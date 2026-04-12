import React, { Suspense, lazy } from "react";

const ProjectList = lazy(() => import("projectsApp/ProjectList"));
const ProjectForm = lazy(() => import("projectsApp/ProjectForm"));

export default function Dashboard() {
  return (
    <div>
      <h2>My Projects</h2>
      <Suspense fallback={<div>Loading remote...</div>}>
        <ProjectForm />
        <ProjectList />
      </Suspense>
    </div>
  );
}
