import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Button, Spinner } from "react-bootstrap";

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
  mutation Gen($draftId: ID!, $draftContent: String!) {
    generateReview(draftId: $draftId, draftContent: $draftContent) {
      id
    }
  }
`;

function severityClass(sev) {
  if (sev === "high") return "severity-high";
  if (sev === "medium") return "severity-medium";
  return "severity-low";
}

function ReviewCard({ r }) {
  const pct = Math.round((r.confidence || 0) * 100);
  return (
    <div className="card-box">
      <div className="d-flex justify-content-between">
        <strong>Summary</strong>
        <small className="text-muted">{new Date(Number(r.createdAt) || r.createdAt).toLocaleString()}</small>
      </div>
      <p>{r.summary}</p>

      <div className="d-flex align-items-center gap-2 mb-2">
        <span className="small">Confidence: {pct}%</span>
        <div className="confidence-bar flex-grow-1">
          <div style={{ width: `${pct}%` }} />
        </div>
      </div>

      <h6>Issues</h6>
      {r.issues.length === 0 && <p className="small text-muted">No issues flagged.</p>}
      <ul>
        {r.issues.map((i, idx) => (
          <li key={idx}>
            <span className={severityClass(i.severity)}>[{i.severity}]</span> <em>{i.type}</em> — {i.description}
          </li>
        ))}
      </ul>

      <h6>Suggestions</h6>
      <ul>
        {r.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
      </ul>

      <h6>Citations</h6>
      {r.citations.map((c, idx) => (
        <div key={idx} className="citation">
          <strong>{c.source}</strong>
          <div>{c.snippet}</div>
        </div>
      ))}

      {r.reflectionNotes && (
        <>
          <h6 className="mt-2">Reflection audit</h6>
          <p className="small"><em>{r.reflectionNotes}</em></p>
        </>
      )}
    </div>
  );
}

export default function ReviewPanel({ projectId, featureId, draftId }) {
  const draftQ = useQuery(GET_DRAFT, { variables: { projectId, featureId, draftId } });
  const reviewsQ = useQuery(REVIEWS_FOR_DRAFT, { variables: { draftId } });

  const [generate, genState] = useMutation(GENERATE_REVIEW, {
    refetchQueries: [{ query: REVIEWS_FOR_DRAFT, variables: { draftId } }]
  });

  if (draftQ.loading) return <p>Loading draft...</p>;
  if (draftQ.error) return <p className="error-msg">{draftQ.error.message}</p>;
  const draft = draftQ.data?.draft;
  if (!draft) return <p>Draft not found.</p>;

  function runReview() {
    generate({ variables: { draftId, draftContent: draft.content } });
  }

  const reviews = reviewsQ.data?.reviewsForDraft ?? [];

  return (
    <div>
      <h2>AI Review</h2>
      <div className="card-box">
        <div className="small text-muted">Draft v{draft.version}</div>
        <pre style={{ whiteSpace: "pre-wrap" }}>{draft.content}</pre>
        <Button onClick={runReview} disabled={genState.loading}>
          {genState.loading ? <><Spinner size="sm" /> Running agentic RAG...</> : "Generate review"}
        </Button>
        {genState.error && <div className="error-msg">{genState.error.message}</div>}
      </div>

      <h4>History</h4>
      {reviews.length === 0 && <p>No reviews yet for this draft.</p>}
      {reviews.map((r) => <ReviewCard key={r.id} r={r} />)}
    </div>
  );
}
