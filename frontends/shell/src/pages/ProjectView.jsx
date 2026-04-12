import React, { Suspense, lazy } from "react";
import { useParams } from "react-router-dom";

const ProjectDetail = lazy(() => import("projectsApp/ProjectDetail"));

export default function ProjectView() {
  const { id } = useParams();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectDetail projectId={id} />
    </Suspense>
  );
}
