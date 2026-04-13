import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CREATE_PROJECT, MY_PROJECTS, ADD_FEATURE } from "./queries.js";
import "./styles.css";

export default function ProjectForm() {
  const { data } = useQuery(MY_PROJECTS);
  const projects = data?.myProjects ?? [];
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [featureTitle, setFeatureTitle] = useState("");
  const [featureDesc, setFeatureDesc] = useState("");
  const [quickMsg, setQuickMsg] = useState("");
  const [quickErr, setQuickErr] = useState("");

  const [create, { loading }] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{ query: MY_PROJECTS }],
    onCompleted: () => {
      setName("");
      setDesc("");
      setShowCreateModal(false);
    }
  });

  const [addFeature, addFeatureState] = useMutation(ADD_FEATURE, {
    onCompleted: () => {
      setFeatureTitle("");
      setFeatureDesc("");
      setQuickErr("");
      setQuickMsg("Feature added. Open the project to view and submit drafts.");
    },
    onError: (e) => {
      setQuickMsg("");
      setQuickErr(e.message);
    }
  });

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    create({ variables: { name, description: desc } });
  }

  function submitQuickFeature(e) {
    e.preventDefault();
    setQuickMsg("");
    setQuickErr("");
    if (!selectedProjectId || !featureTitle.trim()) {
      setQuickErr("Select a project and enter a feature title.");
      return;
    }
    addFeature({
      variables: {
        projectId: selectedProjectId,
        title: featureTitle,
        description: featureDesc
      }
    });
  }

  return (
    <>
      <section className="projects-card projects-actions-card">
        <div className="projects-card-head">
          <h5>Project Actions</h5>
          <p>Create a new project or add features to any existing project.</p>
        </div>
        <div className="projects-actions-row">
          <Button className="projects-btn-primary" onClick={() => setShowCreateModal(true)}>
            + Create Project
          </Button>
        </div>
      </section>

      <Form onSubmit={submitQuickFeature} className="projects-card projects-form-card">
        <div className="projects-card-head">
          <h5>Add Feature To Existing Project</h5>
          <p>Select a project, add a feature request, then open it for drafts and AI review.</p>
        </div>
        <Form.Group className="mb-3">
          <Form.Label>Project</Form.Label>
          <Form.Select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
            <option value="">Select project...</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Feature title</Form.Label>
          <Form.Control
            placeholder="Example: Add password reset workflow"
            value={featureTitle}
            onChange={(e) => setFeatureTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Feature description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Describe requirements and expected behavior."
            value={featureDesc}
            onChange={(e) => setFeatureDesc(e.target.value)}
          />
        </Form.Group>
        <Button className="projects-btn-primary" type="submit" disabled={addFeatureState.loading}>
          {addFeatureState.loading ? "Adding..." : "Add Feature"}
        </Button>
        {quickMsg && <div className="projects-success-msg">{quickMsg}</div>}
        {quickErr && <div className="error-msg">{quickErr}</div>}
        {selectedProjectId && (
          <p className="projects-inline-link">
            <Link className="projects-link" to={`/projects/${selectedProjectId}`}>Open selected project</Link>
          </p>
        )}
      </Form>

      <Modal centered show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>Project name</Form.Label>
              <Form.Control
                placeholder="Example: DevPilot Dashboard Revamp"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Briefly describe goals, scope, or expected outcomes."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </Form.Group>
            <div className="projects-modal-actions">
              <Button variant="outline-secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button className="projects-btn-primary" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create project"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
