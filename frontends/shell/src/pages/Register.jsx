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
    setErr(null);
    register({ variables: f });
  }

  return (
    <div className="card-box auth-box">
      <h3>Register</h3>
      <Form onSubmit={submit}>
        <Form.Group className="mb-2">
          <Form.Label>Username</Form.Label>
          <Form.Control value={f.username} onChange={ch("username")} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control value={f.email} onChange={ch("email")} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={f.password} onChange={ch("password")} />
        </Form.Group>
        <Button type="submit" disabled={loading}>{loading ? "..." : "Create account"}</Button>
        {err && <div className="error-msg">{err}</div>}
      </Form>
      <p className="mt-3">Have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
