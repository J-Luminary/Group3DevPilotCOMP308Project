import React, { useEffect, useMemo, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Button, Spinner } from "react-bootstrap";
import "./styles.css";

const GET_DRAFT = gql`
  query Draft($projectId: ID!, $featureId: ID!, $draftId: ID!) {
    draft(projectId: $projectId, featureId: $featureId, draftId: $draftId) {
      id content version
    }
  }
`;

const REVIEWS_FOR_DRAFT = gql`
  query Reviews($draftId: ID!) {
    reviewsForDraft(draftId: $draftId) {
      id
      summary
      confidence
      reflectionNotes
      createdAt
      issues { type severity description }
      suggestions
      citations { source snippet }
    }
  }
`;

const GENERATE_REVIEW = gql`
  mutation Gen($draftId: ID!, $projectId: ID!, $featureId: ID!, $draftContent: String!) {
    generateReview(
      draftId: $draftId
      projectId: $projectId
      featureId: $featureId
      draftContent: $draftContent
    ) {
      id
    }
  }
`;

function severityClass(sev) {
  if (sev === "high") return "severity-high";
  if (sev === "medium") return "severity-medium";
  return "severity-low";
}

function formatDate(value) {
  if (!value) return "Unknown";
  return new Date(Number(value) || value).toLocaleString();
}

function reviewToText(r) {
  const issues = (r.issues || [])
    .map((i) => `- [${i.severity}] ${i.type}: ${i.description}`)
    .join("\n");
  const suggestions = (r.suggestions || [])
    .map((s) => `- ${s}`)
    .join("\n");
  const citations = (r.citations || [])
    .map((c) => `- ${c.source}: ${c.snippet}`)
    .join("\n");
  return [
    `Summary: ${r.summary}`,
    `Confidence: ${Math.round((r.confidence || 0) * 100)}%`,
    "",
    "Issues:",
    issues || "- None",
    "",
    "Suggestions:",
    suggestions || "- None",
    "",
    "Citations:",
    citations || "- None",
    "",
    `Reflection: ${r.reflectionNotes || "N/A"}`
  ].join("\n");
}

function ReviewCard({ r, onDelete }) {
  const pct = Math.round((r.confidence || 0) * 100);
  const issues = r.issues || [];
  const suggestions = r.suggestions || [];
  const citations = r.citations || [];
  const [copied, setCopied] = useState(false);

  async function copyReview() {
    try {
      await navigator.clipboard.writeText(reviewToText(r));
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="review-message review-message-ai">
      <div className="review-message-head">
        <div className="review-avatar review-avatar-ai">AI</div>
        <div>
          <strong>DevPilot Reviewer</strong>
          <div className="review-muted review-timestamp">{formatDate(r.createdAt)}</div>
        </div>
        <button type="button" className="review-chip-btn" onClick={copyReview}>
          {copied ? "Copied" : "Copy"}
        </button>
        <button type="button" className="review-chip-btn danger" onClick={() => onDelete?.(r.id)}>
          Delete
        </button>
      </div>
      <p className="review-summary review-summary-highlight">{r.summary}</p>

      <div className="review-row review-confidence-row">
        <span className="small">Confidence score: {pct}%</span>
        <div className="confidence-bar review-grow">
          <div style={{ width: `${pct}%` }} />
        </div>
      </div>

      <h6 className="review-subtitle">Key Issues</h6>
      {issues.length === 0 && <p className="small review-muted">No issues flagged.</p>}
      <ul className="review-bullets">
        {issues.map((i, idx) => (
          <li key={idx}>
            <span className={severityClass(i.severity)}>[{i.severity}]</span> <em>{i.type}</em> — {i.description}
          </li>
        ))}
      </ul>

      <h6 className="review-subtitle">Suggestions</h6>
      <ul className="review-bullets">
        {suggestions.length === 0 && <li className="review-muted">No suggestions available.</li>}
        {suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
      </ul>

      <h6 className="review-subtitle">Citations</h6>
      {citations.map((c, idx) => (
        <div key={idx} className="citation review-citation">
          <strong>{c.source}</strong>
          <div>{c.snippet}</div>
        </div>
      ))}

      {r.reflectionNotes && (
        <>
          <h6 className="review-subtitle mt-2">Reflection audit</h6>
          <p className="small"><em>{r.reflectionNotes}</em></p>
        </>
      )}
    </article>
  );
}

export default function ReviewPanel({ projectId, featureId, draftId }) {
  const draftQ = useQuery(GET_DRAFT, { variables: { projectId, featureId, draftId } });
  const reviewsQ = useQuery(REVIEWS_FOR_DRAFT, { variables: { draftId } });
  const [editableDraft, setEditableDraft] = useState("");
  const [copyState, setCopyState] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [hiddenReviewIds, setHiddenReviewIds] = useState([]);

  const [generate, genState] = useMutation(GENERATE_REVIEW, {
    refetchQueries: [{ query: REVIEWS_FOR_DRAFT, variables: { draftId } }]
  });

  const draft = draftQ.data?.draft;
  const reviews = reviewsQ.data?.reviewsForDraft ?? [];
  const originalDraft = draft?.content || "";

  useEffect(() => {
    if (!draft?.id) return;
    setEditableDraft(draft.content || "");
    setIsEditing(false);
    setHiddenReviewIds([]);
  }, [draft?.id, draft?.version, draft?.content]);

  const visibleReviews = useMemo(() => {
    if (hiddenReviewIds.length === 0) return reviews;
    return reviews.filter((r) => !hiddenReviewIds.includes(r.id));
  }, [reviews, hiddenReviewIds]);

  const latestReview = useMemo(() => {
    return visibleReviews[0] || null;
  }, [visibleReviews]);

  if (draftQ.loading) return <div className="review-card review-loading">Loading draft...</div>;
  if (draftQ.error) return <p className="error-msg">{draftQ.error.message}</p>;
  if (!draft) return <div className="review-card review-empty">Draft not found.</div>;

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(editableDraft);
      setCopyState("Draft copied");
      setTimeout(() => setCopyState(""), 1500);
    } catch {
      setCopyState("Copy failed");
      setTimeout(() => setCopyState(""), 1500);
    }
  }

  function resetDraft() {
    setEditableDraft(originalDraft);
    setIsEditing(false);
  }

  function clearDraft() {
    setEditableDraft("");
    setIsEditing(true);
  }

  function deleteReviewFromView(id) {
    if (!id) return;
    setHiddenReviewIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function clearReviewHistoryFromView() {
    setHiddenReviewIds(reviews.map((r) => r.id));
  }

  function runReview() {
    generate({
      variables: {
        draftId,
        projectId,
        featureId,
        draftContent: editableDraft
      }
    });
  }

  return (
    <section className="review-wrap review-chat-app">
      <div className="review-chat-head">
        <h2>AI Draft Review Assistant</h2>
        <p>Chat-style review experience with editable draft input, copy helpers, and structured feedback.</p>
      </div>

      <div className="review-chat-grid">
        <aside className="review-chat-composer">
          <div className="review-message review-message-user">
            <div className="review-message-head">
              <div className="review-avatar review-avatar-user">You</div>
              <div>
                <strong>Draft Input</strong>
                <div className="review-muted review-timestamp">Draft v{draft.version}</div>
              </div>
            </div>
            <textarea
              className="review-draft-editor"
              value={editableDraft}
              readOnly={!isEditing}
              onChange={(e) => setEditableDraft(e.target.value)}
            />
            <div className="review-composer-actions">
              <button type="button" className="review-chip-btn" onClick={() => setIsEditing((v) => !v)}>
                {isEditing ? "Lock" : "Edit"}
              </button>
              <button type="button" className="review-chip-btn" onClick={copyDraft}>Copy draft</button>
              <button type="button" className="review-chip-btn" onClick={resetDraft}>Reset</button>
              <button type="button" className="review-chip-btn danger" onClick={clearDraft}>Clear</button>
              <Button className="review-btn-primary" onClick={runReview} disabled={genState.loading || !editableDraft.trim()}>
                {genState.loading ? <><Spinner size="sm" /> Reviewing...</> : "Generate Review"}
              </Button>
            </div>
            {copyState && <div className="review-muted">{copyState}</div>}
            {genState.error && <div className="error-msg">{genState.error.message}</div>}
          </div>
          {latestReview && (
            <div className="review-card review-latest-snapshot">
              <div className="review-muted small">Latest confidence</div>
              <div className="review-kpi">{Math.round((latestReview.confidence || 0) * 100)}%</div>
            </div>
          )}
        </aside>

        <div className="review-chat-thread">
          {reviewsQ.loading && <div className="review-card review-loading">Loading review history...</div>}
          {!reviewsQ.loading && visibleReviews.length > 0 && (
            <div className="review-thread-actions">
              <button type="button" className="review-chip-btn danger" onClick={clearReviewHistoryFromView}>
                Clear all reviews (view)
              </button>
            </div>
          )}
          {!reviewsQ.loading && visibleReviews.length === 0 && (
            <div className="review-card review-placeholder">
              No reviews yet. Generate one from the draft editor to start the conversation.
            </div>
          )}
          {visibleReviews.map((r) => <ReviewCard key={r.id} r={r} onDelete={deleteReviewFromView} />)}
        </div>
      </div>
    </section>
  );
}
