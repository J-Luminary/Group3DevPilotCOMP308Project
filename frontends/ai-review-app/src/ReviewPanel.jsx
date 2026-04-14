import React from "react";
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

function ReviewCard({ r }) {
  const pct = Math.round((r.confidence || 0) * 100);
  const issues = r.issues || [];
  const suggestions = r.suggestions || [];
  const citations = r.citations || [];
  return (
    <article className="review-card">
      <div className="review-row review-row-between">
        <strong>Summary</strong>
        <small className="review-muted">{formatDate(r.createdAt)}</small>
      </div>
      <p className="review-summary">{r.summary}</p>

      <div className="review-row review-confidence-row">
        <span className="small">Confidence: {pct}%</span>
        <div className="confidence-bar review-grow">
          <div style={{ width: `${pct}%` }} />
        </div>
      </div>

      <h6 className="review-subtitle">Issues</h6>
      {issues.length === 0 && <p className="small review-muted">No issues flagged.</p>}
      <ul>
        {issues.map((i, idx) => (
          <li key={idx}>
            <span className={severityClass(i.severity)}>[{i.severity}]</span> <em>{i.type}</em> — {i.description}
          </li>
        ))}
      </ul>

      <h6 className="review-subtitle">Suggestions</h6>
      <ul>
        {suggestions.length === 0 && <li className="review-muted">No suggestions available.</li>}
        {suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
      </ul>

      <h6 className="review-subtitle">Citations</h6>
      {citations.map((c, idx) => (
        <div key={idx} className="citation">
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

  const [generate, genState] = useMutation(GENERATE_REVIEW, {
    refetchQueries: [{ query: REVIEWS_FOR_DRAFT, variables: { draftId } }]
  });

  if (draftQ.loading) return <div className="review-card review-loading">Loading draft...</div>;
  if (draftQ.error) return <p className="error-msg">{draftQ.error.message}</p>;
  const draft = draftQ.data?.draft;
  if (!draft) return <div className="review-card review-empty">Draft not found.</div>;

  function runReview() {
  generate({
    variables: {
      draftId,
      projectId,
      featureId,
      draftContent: draft.content
    }
  });
}

  const reviews = reviewsQ.data?.reviewsForDraft ?? [];

  return (
    <section className="review-wrap">
      <div className="review-page-head">
        <h2>AI Review</h2>
        <p>Analyze draft quality, issues, and suggestions with confidence scoring.</p>
      </div>

      <div className="review-card">
        <div className="small review-muted">Draft v{draft.version}</div>
        <pre className="review-draft-content">{draft.content}</pre>
        <Button className="review-btn-primary" onClick={runReview} disabled={genState.loading}>
          {genState.loading ? <><Spinner size="sm" /> Running AI analysis...</> : "Generate review"}
        </Button>
        {genState.error && <div className="error-msg">{genState.error.message}</div>}
      </div>

      <h4 className="review-subtitle">Review History</h4>
      {reviews.length === 0 && <p className="review-muted">No reviews yet for this draft.</p>}
      {reviews.map((r) => <ReviewCard key={r.id} r={r} />)}
    </section>
  );
}
