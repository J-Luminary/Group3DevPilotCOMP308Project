import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      user { id username }
      message
    }
  }
`;

export default function Register({ onAuth }) {
  const [f, setF] = useState({ username: "", email: "", password: "" });
  const [err, setErr] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const nav = useNavigate();

  const [register, { loading }] = useMutation(REGISTER, {
    onCompleted: async () => {
      await onAuth();
      nav("/");
    },
    onError: (e) => setErr(e.message)
  });

  function ch(k) {
    return (e) => setF({ ...f, [k]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();
    setSubmitted(true);
    setErr(null);
    if (!f.username.trim() || !f.email.trim() || !f.password) return;
    register({ variables: f });
  }

  return (
    <section className="card-box auth-box">
      <div className="auth-head">
        <h3>Create your account</h3>
        <p>Set up your developer profile to start managing project work.</p>
      </div>
      <Form onSubmit={submit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            required
            placeholder="Choose a username"
            value={f.username}
            isInvalid={submitted && !f.username.trim()}
            onChange={ch("username")}
          />
          <Form.Control.Feedback type="invalid">Username is required.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            placeholder="you@example.com"
            value={f.email}
            isInvalid={submitted && !f.email.trim()}
            onChange={ch("email")}
          />
          <Form.Control.Feedback type="invalid">Email is required.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            placeholder="Create a password"
            value={f.password}
            isInvalid={submitted && !f.password}
            onChange={ch("password")}
          />
          <Form.Control.Feedback type="invalid">Password is required.</Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" className="auth-submit-btn" disabled={loading}>{loading ? "Creating account..." : "Create account"}</Button>
        {err && <div className="error-msg">{err}</div>}
      </Form>
      <p className="auth-switch">Have an account? <Link to="/login">Sign in</Link></p>
    </section>
  );
}
