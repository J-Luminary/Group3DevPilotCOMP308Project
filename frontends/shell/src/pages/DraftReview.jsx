import React, { Suspense, lazy } from "react";
import { useParams } from "react-router-dom";

const ReviewPanel = lazy(() => import("aiReviewApp/ReviewPanel"));

export default function DraftReview() {
  const { projectId, featureId, draftId } = useParams();
  return (
    <section className="shell-section">
      <div className="shell-section-head">
        <h2>Draft Review</h2>
        <p>Inspect generated feedback and issue severity with clearer context.</p>
      </div>
      <Suspense fallback={<div className="card-box shell-loading">Loading review panel...</div>}>
        <ReviewPanel projectId={projectId} featureId={featureId} draftId={draftId} />
      </Suspense>
    </section>
  );
}
