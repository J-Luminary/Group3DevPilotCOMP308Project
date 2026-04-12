import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { MY_PROJECTS } from "./queries.js";

export default function ProjectList() {
  const { data, loading, error } = useQuery(MY_PROJECTS);
  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="error-msg">{error.message}</p>;
  const items = data?.myProjects ?? [];
  if (items.length === 0) return <p>No projects yet. Create one above.</p>;
  return (
    <ListGroup>
      {items.map((p) => (
        <ListGroup.Item key={p.id}>
          <Link to={`/projects/${p.id}`}>{p.name}</Link>
          {p.description && <div className="text-muted small">{p.description}</div>}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
