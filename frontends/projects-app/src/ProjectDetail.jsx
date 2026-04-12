import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { Form, Button, Accordion } from "react-bootstrap";
import { PROJECT_DETAIL, ADD_FEATURE, SUBMIT_DRAFT } from "./queries.js";

function FeatureBlock({ projectId, feature }) {
  const [content, setContent] = useState("");
  const [err, setErr] = useState("");
  const [submit, { loading }] = useMutation(SUBMIT_DRAFT, {
    refetchQueries: [{ query: PROJECT_DETAIL, variables: { id: projectId } }],
    onCompleted: () => {
      setContent("");
      setErr("");
    },
    onError: (e) => setErr(e.message)
  });

  function send(e) {
    e.preventDefault();
    setErr("");
    if (!content.trim()) {
      setErr("draft cannot be empty");
      return;
    }
    submit({ variables: { projectId, featureId: feature.id, content } });
  }

  return (
    <div>
      <p className="text-muted">{feature.description}</p>
      <h6>Drafts</h6>
      {feature.drafts.length === 0 && <p className="small">No drafts yet.</p>}
      {feature.drafts.map((d) => (
        <div key={d.id} className="card-box">
          <div className="small text-muted">v{d.version}</div>
          <pre style={{ whiteSpace: "pre-wrap" }}>{d.content}</pre>
          <Link to={`/projects/${projectId}/features/${feature.id}/drafts/${d.id}`}>
            Run AI review
          </Link>
        </div>
      ))}
      <Form onSubmit={send}>
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Paste your implementation draft..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button className="mt-2" type="submit" disabled={loading}>Submit draft</Button>
        {err && <div className="error-msg">{err}</div>}
      </Form>
    </div>
  );
}

export default function ProjectDetail({ projectId }) {
  const { data, loading, error } = useQuery(PROJECT_DETAIL, { variables: { id: projectId } });
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [addFeature] = useMutation(ADD_FEATURE, {
    refetchQueries: [{ query: PROJECT_DETAIL, variables: { id: projectId } }],
    onCompleted: () => {
      setTitle("");
      setDesc("");
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-msg">{error.message}</p>;
  const p = data?.project;
  if (!p) return <p>Project not found.</p>;

  function addFeat(e) {
    e.preventDefault();
    if (!title.trim()) return;
    addFeature({ variables: { projectId, title, description: desc } });
  }

  return (
    <div>
      <h2>{p.name}</h2>
      <p>{p.description}</p>

      <div className="card-box">
        <h5>Add feature request</h5>
        <Form onSubmit={addFeat}>
          <Form.Group className="mb-2">
            <Form.Label>Title</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </Form.Group>
          <Button type="submit">Add feature</Button>
        </Form>
      </div>

      <h4>Features</h4>
      {p.features.length === 0 && <p>No features yet.</p>}
      <Accordion>
        {p.features.map((f, idx) => (
          <Accordion.Item eventKey={String(idx)} key={f.id}>
            <Accordion.Header>{f.title}</Accordion.Header>
            <Accordion.Body>
              <FeatureBlock projectId={projectId} feature={f} />
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}
