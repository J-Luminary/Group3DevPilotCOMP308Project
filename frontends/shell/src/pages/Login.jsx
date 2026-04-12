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
    setErr(null);
    login({ variables: { email, password } });
  }

  return (
    <div className="card-box auth-box">
      <h3>Login</h3>
      <Form onSubmit={submit}>
        <Form.Group className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Button type="submit" disabled={loading}>{loading ? "..." : "Login"}</Button>
        {err && <div className="error-msg">{err}</div>}
      </Form>
      <p className="mt-3">No account? <Link to="/register">Register</Link></p>
    </div>
  );
}
