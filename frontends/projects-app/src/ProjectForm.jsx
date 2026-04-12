import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Form, Button } from "react-bootstrap";
import { CREATE_PROJECT, MY_PROJECTS } from "./queries.js";

export default function ProjectForm() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [create, { loading }] = useMutation(CREATE_PROJECT, {
    refetchQueries: [{ query: MY_PROJECTS }],
    onCompleted: () => {
      setName("");
      setDesc("");
    }
  });

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    create({ variables: { name, description: desc } });
  }

  return (
    <Form onSubmit={submit} className="card-box">
      <Form.Group className="mb-2">
        <Form.Label>Project name</Form.Label>
        <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-2">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} />
      </Form.Group>
      <Button type="submit" disabled={loading}>Create project</Button>
    </Form>
  );
}
