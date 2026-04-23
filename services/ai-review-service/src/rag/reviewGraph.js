import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { ChatCohere } from "@langchain/cohere";
import { StateGraph, Annotation, END, START } from "@langchain/langgraph";
import { retrieve } from "./kb.js";

const reviewSchema = z.object({
  summary: z.string(),
  issues: z.array(z.object({
    type: z.string(),
    severity: z.enum(["low", "medium", "high"]),
    description: z.string()
  })),
  suggestions: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  citations: z.array(z.object({
    source: z.string(),
    snippet: z.string()
  }))
});

const reflectionSchema = z.object({
  unsupportedClaims: z.array(z.string()),
  hallucinationDetected: z.boolean(),
  confidenceAdjustment: z.number().min(-1).max(0),
  notes: z.string()
});

const MODEL_CHAIN = [
  { provider: "groq", name: "llama-3.3-70b-versatile" },
  { provider: "groq", name: "llama-3.1-8b-instant" },
  { provider: "cohere", name: "command-r-plus" },
  { provider: "cohere", name: "command-r" },
  { provider: "google", name: "gemini-2.5-flash" },
  { provider: "google", name: "gemini-2.5-flash-lite" },
  { provider: "google", name: "gemini-2.0-flash" }
];

function makeModel(entry) {
  if (entry.provider === "groq") {
    if (!process.env.GROQ_API_KEY) return null;
    return new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: entry.name,
      temperature: 0.2
    });
  }
  if (entry.provider === "cohere") {
    if (!process.env.COHERE_API_KEY) return null;
    return new ChatCohere({
      apiKey: process.env.COHERE_API_KEY,
      model: entry.name,
      temperature: 0.2
    });
  }
  if (!process.env.GEMINI_API_KEY) return null;
  return new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: entry.name,
    temperature: 0.2
  });
}

function stripFence(text) {
  let t = text.trim();
  if (t.startsWith("```")) {
    t = t.replace(/^```(?:json)?\s*/, "").replace(/```\s*$/, "");
  }
  return t.trim();
}

function isTransient(err) {
  const msg = String(err?.message || err);
  return msg.includes("503") || msg.includes("429") || msg.includes("Service Unavailable") || msg.includes("overloaded");
}

async function callJson(prompt, schema) {
  let lastErr;
  for (const entry of MODEL_CHAIN) {
    const model = makeModel(entry);
    if (!model) continue;
    const label = `${entry.provider}:${entry.name}`;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await model.invoke(prompt);
        const raw = typeof res.content === "string" ? res.content : res.content.map((c) => c.text || "").join("");
        const cleaned = stripFence(raw);
        const parsed = JSON.parse(cleaned);
        return schema.parse(parsed);
      } catch (e) {
        lastErr = e;
        if (!isTransient(e)) {
          console.warn(`[ai-review] ${label} attempt ${attempt + 1} hard-failed:`, String(e.message || e).slice(0, 200));
          break;
        }
        const wait = 1000 * (attempt + 1);
        console.warn(`[ai-review] ${label} attempt ${attempt + 1} transient, retrying in ${wait}ms`);
        await new Promise((r) => setTimeout(r, wait));
      }
    }
    console.warn(`[ai-review] falling through to next model after ${label}`);
  }
  throw lastErr || new Error("no usable model configured");
}

const State = Annotation.Root({
  draft: Annotation(),
  chunks: Annotation(),
  review: Annotation(),
  reflection: Annotation()
});

async function retrieveNode(state) {
  const docs = await retrieve(state.draft, 5);
  const chunks = docs.map((d) => ({
    source: d.metadata.source,
    snippet: d.pageContent.slice(0, 300)
  }));
  return { chunks };
}

async function generateNode(state) {
  const ctx = state.chunks
    .map((c, i) => `[${i + 1}] (${c.source})\n${c.snippet}`)
    .join("\n\n");

  const prompt = `You are reviewing a developer's implementation draft. Use only the knowledge base context below to ground your review. Each issue you raise MUST be tied to at least one citation from the context.

KNOWLEDGE BASE CONTEXT:
${ctx}

DRAFT TO REVIEW:
${state.draft}

Return ONLY valid JSON matching this shape (no prose, no code fences):
{
  "summary": "one-paragraph overview",
  "issues": [{"type":"security|style|performance|correctness","severity":"low|medium|high","description":"..."}],
  "suggestions": ["..."],
  "confidence": 0.0,
  "citations": [{"source":"filename.md","snippet":"short exact quote from context"}]
}`;

  const review = await callJson(prompt, reviewSchema);
  return { review };
}

async function reflectNode(state) {
  const ctx = state.chunks
    .map((c, i) => `[${i + 1}] (${c.source})\n${c.snippet}`)
    .join("\n\n");

  const prompt = `You are a hallucination auditor. Inspect the review below against the knowledge base context. Flag any claim in the review that is NOT supported by at least one context chunk.

CONTEXT:
${ctx}

REVIEW TO AUDIT:
${JSON.stringify(state.review)}

Return ONLY JSON (no prose, no code fences):
{
  "unsupportedClaims": ["..."],
  "hallucinationDetected": true|false,
  "confidenceAdjustment": -0.5,
  "notes": "short explanation"
}`;

  const reflection = await callJson(prompt, reflectionSchema);
  const adjusted = Math.max(0, Math.min(1, state.review.confidence + reflection.confidenceAdjustment));
  const finalReview = { ...state.review, confidence: adjusted };
  return { reflection, review: finalReview };
}

const graph = new StateGraph(State)
  .addNode("retrieve", retrieveNode)
  .addNode("generate", generateNode)
  .addNode("reflect", reflectNode)
  .addEdge(START, "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", "reflect")
  .addEdge("reflect", END)
  .compile();

export async function runReview(draft) {
  const out = await graph.invoke({ draft });
  return {
    review: out.review,
    reflection: out.reflection
  };
}
