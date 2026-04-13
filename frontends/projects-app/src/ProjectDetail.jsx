import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { PROJECT_DETAIL, MY_PROJECTS, ADD_FEATURE, UPDATE_PROJECT, UPDATE_FEATURE, DELETE_FEATURE, DELETE_PROJECT, SUBMIT_DRAFT, UPDATE_DRAFT, DELETE_DRAFT } from "./queries.js";
import "./styles.css";

function DraftCard({ projectId, featureId, draft }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(draft.content || "");
  const [editErr, setEditErr] = useState("");
  const [updateDraft, updateDraftState] = useMutation(UPDATE_DRAFT, {
    refetchQueries: [{ query: PROJECT_DETAIL, variables: { id: projectId } }],
    onCompleted: () => {
      setEditErr("");
      setIsEditing(false);
    },
    onError: (e) => setEditErr(e.message)
  });
  const [deleteDraft, deleteDraftState] = useMutation(DELETE_DRAFT, {
    refetchQueries: [{ query: PROJECT_DETAIL, variables: { id: projectId } }],
    onError: (e) => setEditErr(e.message)
  });

  useEffect(() => {
    setEditedContent(draft.content || "");
    setIsEditing(false);
  }, [draft.id, draft.content]);

  function saveDraft() {
    setEditErr("");
    if (!editedContent.trim()) {
      setEditErr("draft content cannot be empty");
      return;
    }
    updateDraft({
      variables: {
        projectId,
        featureId,
        draftId: draft.id,
        content: editedContent
      }
    });
  }

  function removeDraft() {
    if (!window.confirm("Delete this draft version?")) return;
    setEditErr("");
    deleteDraft({
      variables: {
        projectId,
        featureId,
        draftId: draft.id
      }
    });
  }

  return (
    <div className="projects-card draft-card">
      <div className="small projects-meta">v{draft.version}</div>
      {isEditing ? (
        <>
          <Form.Control
            as="textarea"
            rows={4}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="draft-toolbar">
            <Button className="projects-btn-primary" size="sm" onClick={saveDraft} disabled={updateDraftState.loading}>
              {updateDraftState.loading ? "Saving..." : "Save Draft"}
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
          </div>
          {editErr && <div className="error-msg">{editErr}</div>}
        </>
      ) : (
        <>
          <pre className="projects-draft-content">{draft.content}</pre>
          <div className="draft-toolbar">
            <Button variant="outline-secondary" size="sm" onClick={() => setIsEditing(true)}>Edit Draft</Button>
            <div className="draft-toolbar-actions">
              <Button variant="outline-danger" size="sm" onClick={removeDraft} disabled={deleteDraftState.loading}>
                {deleteDraftState.loading ? "Deleting..." : "Delete Draft"}
              </Button>
              <Link className="projects-link" to={`/projects/${projectId}/features/${featureId}/drafts/${draft.id}`}>
                Run AI review
              </Link>
            </div>
          </div>
          {editErr && <div className="error-msg">{editErr}</div>}
        </>
      )}
    </div>
  );
}

function FeatureBlock({ projectId, feature }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(feature.title || "");
  const [editDesc, setEditDesc] = useState(feature.description || "");
  const [content, setContent] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    setEditTitle(feature.title || "");
    setEditDesc(feature.description || "");
    setIsEditing(false);
  }, [feature.id, feature.title, feature.description]);

  const [submit, { loading }] = useMutation(SUBMIT_DRAFT, {
    refetchQueries: [{ query: PROJECT_DETAIL, variables: { id: projectId } }],
    onCompleted: () => {
      setContent("");
      setErr("");
    },
    onError: (e) => setErr(e.message)
  });

  const [updateFeature, updateState] = useMutation(UPDATE_FEATURE, {
    refetchQueries: [{ query: PROJECT_DETAIL, variables: { id: projectId } }],
    onCompleted: () => {
      setErr("");
      setIsEditing(false);
    },
    onError: (e) => setErr(e.message)
  });

  const [deleteFeature, deleteState] = useMutation(DELETE_FEATURE, {
    refetchQueries: [{ query: PROJECT_DETAIL, variables: { id: projectId } }],
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

  function saveFeatureEdits(e) {
    e.preventDefault();
    setErr("");
    if (!editTitle.trim()) {
      setErr("feature title is required");
      return;
    }
    updateFeature({
      variables: {
        projectId,
        featureId: feature.id,
        title: editTitle,
        description: editDesc
      }
    });
  }

  function removeFeature() {
    if (!window.confirm("Delete this feature and all its drafts?")) return;
    setErr("");
    deleteFeature({ variables: { projectId, featureId: feature.id } });
  }

  return (
    <div className="feature-content">
      <div className="feature-toolbar">
        <Button variant="outline-secondary" size="sm" onClick={() => setIsEditing((v) => !v)}>
          {isEditing ? "Cancel Edit" : "Edit Feature"}
        </Button>
        <Button variant="outline-danger" size="sm" onClick={removeFeature} disabled={deleteState.loading}>
          {deleteState.loading ? "Deleting..." : "Delete Feature"}
        </Button>
      </div>

      {isEditing ? (
        <Form onSubmit={saveFeatureEdits} className="projects-inline-form">
          <Form.Group className="mb-2">
            <Form.Label>Feature title</Form.Label>
            <Form.Control value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={editDesc} onChange={(e) => setEditDesc(e.target.value)} />
          </Form.Group>
          <Button className="projects-btn-primary" type="submit" disabled={updateState.loading}>
            {updateState.loading ? "Saving..." : "Save Feature"}
          </Button>
        </Form>
      ) : (
        <p className="projects-item-desc">{feature.description || "No feature description yet."}</p>
      )}

      <h6 className="projects-subtitle">Drafts</h6>
      {feature.drafts.length === 0 && <p className="small">No drafts yet.</p>}
      {feature.drafts.map((d) => (
        <DraftCard key={d.id} projectId={projectId} featureId={feature.id} draft={d} />
      ))}
      <Form onSubmit={send} className="projects-inline-form">
        <Form.Control
          as="textarea"
          rows={4}
          placeholder="Paste your implementation draft..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button className="mt-2 projects-btn-primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit draft"}
        </Button>
        {err && <div className="error-msg">{err}</div>}
      </Form>
    </div>
  );
}

export default function ProjectDetail({ projectId }) {
  const nav = useNavigate();
  const { data, loading, error } = useQuery(PROJECT_DETAIL, { variables: { id: projectId } });
  const p = data?.project;
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [projectErr, setProjectErr] = useState("");

  const [addFeature] = useMutation(ADD_FEATURE, {
    refetchQueries: [{ query: PROJECT_DETAIL, variables: { id: projectId } }],
    onCompleted: () => {
      setTitle("");
      setDesc("");
      setProjectErr("");
    },
    onError: (e) => setProjectErr(e.message)
  });

  const [deleteProject, deleteProjectState] = useMutation(DELETE_PROJECT, {
    refetchQueries: [{ query: MY_PROJECTS }],
    onCompleted: () => nav("/"),
    onError: (e) => setProjectErr(e.message)
  });
  const [updateProject, updateProjectState] = useMutation(UPDATE_PROJECT, {
    refetchQueries: [{ query: PROJECT_DETAIL, variables: { id: projectId } }, { query: MY_PROJECTS }],
    onCompleted: () => {
      setProjectErr("");
      setIsEditingProject(false);
    },
    onError: (e) => setProjectErr(e.message)
  });

  useEffect(() => {
    if (!p) return;
    setProjectName(p.name || "");
    setProjectDesc(p.description || "");
  }, [p]);

  if (loading) return <div className="projects-card projects-loading">Loading project...</div>;
  if (error) return <p className="error-msg">{error.message}</p>;
  if (!p) return <div className="projects-card projects-empty">Project not found.</div>;

  function addFeat(e) {
    e.preventDefault();
    setProjectErr("");
    if (!title.trim()) return;
    addFeature({ variables: { projectId, title, description: desc } });
  }

  function removeProject() {
    if (!window.confirm("Delete this project and all its features/drafts?")) return;
    setProjectErr("");
    deleteProject({ variables: { projectId } });
  }

  function saveProject(e) {
    e.preventDefault();
    setProjectErr("");
    if (!projectName.trim()) {
      setProjectErr("project title is required");
      return;
    }
    updateProject({
      variables: {
        projectId,
        name: projectName,
        description: projectDesc
      }
    });
  }

  return (
    <section className="projects-detail-wrap">
      <div className="projects-page-head">
        {isEditingProject ? (
          <Form onSubmit={saveProject} className="projects-inline-form">
            <Form.Group className="mb-2">
              <Form.Label>Project title</Form.Label>
              <Form.Control value={projectName} onChange={(e) => setProjectName(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Project description</Form.Label>
              <Form.Control as="textarea" rows={3} value={projectDesc} onChange={(e) => setProjectDesc(e.target.value)} />
            </Form.Group>
            <div className="projects-head-actions">
              <Button variant="outline-secondary" size="sm" onClick={() => setIsEditingProject(false)}>Cancel</Button>
              <Button className="projects-btn-primary" size="sm" type="submit" disabled={updateProjectState.loading}>
                {updateProjectState.loading ? "Saving..." : "Save Project"}
              </Button>
            </div>
          </Form>
        ) : (
          <>
            <h2>{p.name}</h2>
            <p>{p.description || "No description provided yet."}</p>
          </>
        )}
        <div className="projects-head-actions">
          {!isEditingProject && (
            <Button variant="outline-secondary" size="sm" onClick={() => setIsEditingProject(true)}>
              Edit Project
            </Button>
          )}
          <Button variant="outline-danger" size="sm" onClick={removeProject} disabled={deleteProjectState.loading}>
            {deleteProjectState.loading ? "Deleting project..." : "Delete Project"}
          </Button>
        </div>
      </div>

      <div className="projects-card">
        <h5>Add feature request</h5>
        <Form onSubmit={addFeat}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control placeholder="Example: Add role-based access controls" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Describe requirements, acceptance criteria, and constraints." value={desc} onChange={(e) => setDesc(e.target.value)} />
          </Form.Group>
          <Button className="projects-btn-primary" type="submit">Add feature</Button>
        </Form>
      </div>

      <h4 className="projects-subtitle">Features</h4>
      {p.features.length === 0 && <p>No features yet.</p>}
      <div className="feature-list">
        {p.features.map((f, idx) => (
          <div className="projects-card feature-list-item" key={f.id}>
            <div className="feature-list-header">
              <div className="feature-list-title">
                <span className="feature-index">{idx + 1}</span>
                <div>
                  <div className="feature-header-title">{f.title}</div>
                  <div className="feature-header-meta">
                    <span>{f.drafts.length} draft{f.drafts.length === 1 ? "" : "s"}</span>
                    <span>{f.description ? f.description.slice(0, 80) : "No description"}</span>
                  </div>
                </div>
              </div>
            </div>
            <FeatureBlock projectId={projectId} feature={f} />
          </div>
        ))}
      </div>
      {projectErr && <div className="error-msg">{projectErr}</div>}
    </section>
  );
}
