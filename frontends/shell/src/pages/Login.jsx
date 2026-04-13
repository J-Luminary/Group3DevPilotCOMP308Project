import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user { id username }
      message
    }
  }
`;

export default function Login({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const nav = useNavigate();

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: async () => {
      await onAuth();
      nav("/");
    },
    onError: (e) => setErr(e.message)
  });

  function submit(e) {
    e.preventDefault();
    setSubmitted(true);
    setErr(null);
    if (!email.trim() || !password) return;
    login({ variables: { email, password } });
  }

  return (
    <section className="card-box auth-box">
      <div className="auth-head">
        <h3>Welcome back</h3>
        <p>Sign in to continue building and reviewing your projects.</p>
      </div>
      <Form onSubmit={submit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            isInvalid={submitted && !email.trim()}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">Email is required.</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            placeholder="Enter your password"
            value={password}
            isInvalid={submitted && !password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Control.Feedback type="invalid">Password is required.</Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" className="auth-submit-btn" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
        {err && <div className="error-msg">{err}</div>}
      </Form>
      <p className="auth-switch"><Link to="/forgot-password">Forgot email or password?</Link></p>
      <p className="auth-switch">No account? <Link to="/register">Create one</Link></p>
    </section>
  );
}
