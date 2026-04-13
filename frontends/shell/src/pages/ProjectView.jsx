import React, { Suspense, lazy } from "react";
import { useParams } from "react-router-dom";

const ProjectDetail = lazy(() => import("projectsApp/ProjectDetail"));

export default function ProjectView() {
  const { id } = useParams();
  return (
    <section className="shell-section">
      <div className="shell-section-head">
        <h2>Project Details</h2>
        <p>Review features, drafts, and progress in a focused view.</p>
      </div>
      <Suspense fallback={<div className="card-box shell-loading">Loading project details...</div>}>
        <ProjectDetail projectId={id} />
      </Suspense>
    </section>
  );
}
