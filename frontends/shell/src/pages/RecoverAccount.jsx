import React, { useState } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const RECOVER_EMAIL = gql`
  query RecoverEmail($username: String!) {
    recoverEmail(username: $username)
  }
`;

const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      message
      resetToken
    }
  }
`;

const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      message
    }
  }
`;

export default function RecoverAccount() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetTokenFromServer, setResetTokenFromServer] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [recoverEmail, recoverEmailState] = useLazyQuery(RECOVER_EMAIL, {
    onCompleted: (data) => {
      setError("");
      setMessage(data?.recoverEmail ? `Email found: ${data.recoverEmail}` : "No account found for that username.");
    },
    onError: (e) => setError(e.message)
  });

  const [requestReset, requestResetState] = useMutation(REQUEST_PASSWORD_RESET, {
    onCompleted: (data) => {
      setError("");
      const payload = data?.requestPasswordReset;
      setResetTokenFromServer(payload?.resetToken || "");
      setMessage(payload?.message || "Password reset request processed.");
    },
    onError: (e) => setError(e.message)
  });

  const [resetPassword, resetPasswordState] = useMutation(RESET_PASSWORD, {
    onCompleted: () => {
      setError("");
      setMessage("Password reset successful. Please sign in with your new password.");
      nav("/login");
    },
    onError: (e) => setError(e.message)
  });

  function submitRecoverEmail(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    recoverEmail({ variables: { username } });
  }

  function submitRequestToken(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    requestReset({ variables: { email } });
  }

  function submitResetPassword(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    resetPassword({ variables: { token, newPassword } });
  }

  return (
    <section className="card-box auth-box recover-box">
      <div className="auth-head">
        <h3>Recover account</h3>
        <p>Find your email by username or reset your password securely.</p>
      </div>

      <div className="recover-grid">
        <Form onSubmit={submitRecoverEmail} className="recover-block">
          <h6>Recover email</h6>
          <Form.Group className="mb-2">
            <Form.Label>Username</Form.Label>
            <Form.Control
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="auth-submit-btn" disabled={recoverEmailState.loading}>
            {recoverEmailState.loading ? "Searching..." : "Find email"}
          </Button>
        </Form>

        <Form onSubmit={submitRequestToken} className="recover-block">
          <h6>Request password reset token</h6>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Button type="submit" className="auth-submit-btn" disabled={requestResetState.loading}>
            {requestResetState.loading ? "Requesting..." : "Get reset token"}
          </Button>
          {resetTokenFromServer && (
            <div className="reset-token-box">
              <strong>Temporary reset token (dev):</strong>
              <code>{resetTokenFromServer}</code>
            </div>
          )}
        </Form>
      </div>

      <Form onSubmit={submitResetPassword} className="recover-block">
        <h6>Reset password</h6>
        <Form.Group className="mb-2">
          <Form.Label>Reset token</Form.Label>
          <Form.Control
            placeholder="Paste token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>New password</Form.Label>
          <Form.Control
            type="password"
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>
        <Button type="submit" className="auth-submit-btn" disabled={resetPasswordState.loading}>
          {resetPasswordState.loading ? "Updating..." : "Reset password"}
        </Button>
      </Form>

      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}

      <p className="auth-switch">Back to <Link to="/login">Login</Link></p>
    </section>
  );
}
