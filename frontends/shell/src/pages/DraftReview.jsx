import React, { Suspense, lazy } from "react";
import { useParams } from "react-router-dom";

const ReviewPanel = lazy(() => import("aiReviewApp/ReviewPanel"));

export default function DraftReview() {
  const { projectId, featureId, draftId } = useParams();
  return (
    <Suspense fallback={<div>Loading review...</div>}>
      <ReviewPanel projectId={projectId} featureId={featureId} draftId={draftId} />
    </Suspense>
  );
}
