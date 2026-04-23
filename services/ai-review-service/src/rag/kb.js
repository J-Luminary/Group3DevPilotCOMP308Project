import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { CohereEmbeddings } from "@langchain/cohere";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const here = path.dirname(fileURLToPath(import.meta.url));
const KB_DIR = path.resolve(here, "../../knowledge");

let storePromise = null;

async function loadDocs() {
  const files = await fs.readdir(KB_DIR);
  const mdFiles = files.filter((f) => f.endsWith(".md"));
  const docs = [];
  for (const f of mdFiles) {
    const text = await fs.readFile(path.join(KB_DIR, f), "utf8");
    docs.push({ pageContent: text, metadata: { source: f } });
  }
  return docs;
}

function makeEmbeddings() {
  if (process.env.COHERE_API_KEY) {
    return new CohereEmbeddings({
      apiKey: process.env.COHERE_API_KEY,
      model: process.env.COHERE_EMBED_MODEL || "embed-english-v3.0"
    });
  }
  if (process.env.GEMINI_API_KEY) {
    return new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-embedding-2-preview"
    });
  }
  throw new Error(
    "Set COHERE_API_KEY or GEMINI_API_KEY for knowledge-base embeddings"
  );
}

async function buildStore() {
  const docs = await loadDocs();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50
  });
  const chunks = await splitter.splitDocuments(docs);
  const embeddings = makeEmbeddings();
  const store = await MemoryVectorStore.fromDocuments(chunks, embeddings);
  console.log(`[ai-review] embedded ${chunks.length} chunks from ${docs.length} docs`);
  return store;
}

export function getStore() {
  if (!storePromise) storePromise = buildStore();
  return storePromise;
}

export async function retrieve(query, k = 4) {
  const store = await getStore();
  return store.similaritySearch(query, k);
}
