import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import { MY_PROJECTS } from "./queries.js";
import "./styles.css";

export default function ProjectList() {
  const { data, loading, error } = useQuery(MY_PROJECTS);
  if (loading) return <div className="projects-card projects-loading">Loading projects...</div>;
  if (error) return <p className="error-msg">{error.message}</p>;
  const items = data?.myProjects ?? [];
  if (items.length === 0) return <div className="projects-card projects-empty">No projects yet. Create your first project above.</div>;
  return (
    <section className="projects-card">
      <div className="projects-card-head">
        <h5>Your Projects</h5>
        <p>Click a project to expand details, then open it to manage features and drafts.</p>
      </div>
      <Accordion className="projects-list">
        {items.map((p) => (
          <Accordion.Item eventKey={p.id} key={p.id} className="projects-list-item">
            <Accordion.Header>{p.name}</Accordion.Header>
            <Accordion.Body>
              {p.description ? (
                <div className="projects-item-desc">{p.description}</div>
              ) : (
                <div className="projects-item-desc">No description provided yet.</div>
              )}
              <div className="projects-list-actions">
                <Link className="projects-link" to={`/projects/${p.id}`}>Open project</Link>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </section>
  );
}
