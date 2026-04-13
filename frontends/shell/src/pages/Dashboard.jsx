import React, { Suspense, lazy } from "react";
import heroCover from "../assets/hero-cover.png";

const ProjectList = lazy(() => import("projectsApp/ProjectList"));
const ProjectForm = lazy(() => import("projectsApp/ProjectForm"));

const HERO_TITLE = import.meta.env.VITE_PROJECT_NAME || "DevPilot";
const HERO_KICKER = import.meta.env.VITE_HERO_KICKER || "Project Workspace";
const HERO_DESCRIPTION =
  import.meta.env.VITE_HERO_DESCRIPTION ||
  "Build and manage your software projects from one place with features, drafts, and AI-assisted review.";

export default function Dashboard({ user }) {
  const displayName = user?.fullName || user?.username;

  return (
    <section className="shell-section">
      <div className="dashboard-hero card-box">
        <div className="dashboard-hero-media">
          <img src={heroCover} alt={`${HERO_TITLE} cover`} className="dashboard-hero-image" />
          <div className="dashboard-hero-content">
            <p className="dashboard-hero-kicker">{HERO_KICKER}</p>
            <h1>{HERO_TITLE}</h1>
            {displayName ? <p className="dashboard-hero-welcome">Welcome back, {displayName}.</p> : null}
            <p>{HERO_DESCRIPTION}</p>
          </div>
        </div>
      </div>

      <div className="shell-section-head">
        <h2>My Projects</h2>
        <p>Create and track your project work from one place.</p>
      </div>
      <Suspense fallback={<div className="card-box shell-loading">Loading project workspace...</div>}>
        <ProjectForm />
        <ProjectList />
      </Suspense>
    </section>
  );
}
