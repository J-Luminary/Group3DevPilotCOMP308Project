import React, { useEffect, useMemo, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";

const UPDATE_PROFILE = gql`
  mutation UpdateProfile(
    $username: String!
    $email: String!
    $fullName: String
    $about: String
    $title: String
    $company: String
    $location: String
    $website: String
    $github: String
    $phone: String
  ) {
    updateProfile(
      username: $username
      email: $email
      fullName: $fullName
      about: $about
      title: $title
      company: $company
      location: $location
      website: $website
      github: $github
      phone: $phone
    ) {
      message
      user {
        id
        username
        email
        fullName
        about
        title
        company
        location
        website
        github
        phone
        role
      }
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      message
    }
  }
`;

const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($currentPassword: String!) {
    deleteAccount(currentPassword: $currentPassword)
  }
`;

export default function Profile({ user, onAuth }) {
  const nav = useNavigate();
  const toProfileForm = useMemo(() => (u) => ({
    username: u?.username || "",
    email: u?.email || "",
    fullName: u?.fullName || "",
    about: u?.about || "",
    title: u?.title || "",
    company: u?.company || "",
    location: u?.location || "",
    website: u?.website || "",
    github: u?.github || "",
    phone: u?.phone || ""
  }), []);
  const [baseline, setBaseline] = useState(toProfileForm(user));
  const [form, setForm] = useState(toProfileForm(user));
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const next = toProfileForm(user);
    setBaseline(next);
    setForm(next);
  }, [user, toProfileForm]);

  const hasUnsavedChanges =
    form.username !== baseline.username ||
    form.email !== baseline.email ||
    form.fullName !== baseline.fullName ||
    form.about !== baseline.about ||
    form.title !== baseline.title ||
    form.company !== baseline.company ||
    form.location !== baseline.location ||
    form.website !== baseline.website ||
    form.github !== baseline.github ||
    form.phone !== baseline.phone;

  const [updateProfile, updateState] = useMutation(UPDATE_PROFILE, {
    onCompleted: async (data) => {
      setError("");
      setMessage(data?.updateProfile?.message || "Profile updated.");
      const updatedUser = data?.updateProfile?.user;
      if (updatedUser) {
        const next = toProfileForm(updatedUser);
        setBaseline(next);
        setForm(next);
      }
      await onAuth?.();
    },
    onError: (e) => setError(e.message)
  });

  const [changePassword, changeState] = useMutation(CHANGE_PASSWORD, {
    onCompleted: async (data) => {
      setError("");
      setMessage(data?.changePassword?.message || "Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      await onAuth?.();
    },
    onError: (e) => setError(e.message)
  });

  const [deleteAccount, deleteState] = useMutation(DELETE_ACCOUNT, {
    onCompleted: () => {
      nav("/register");
    },
    onError: (e) => setError(e.message)
  });

  if (!user) return null;

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function submitProfile(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    updateProfile({ variables: form });
  }

  function submitPassword(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    changePassword({ variables: { currentPassword, newPassword } });
  }

  function submitDelete(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    if (!window.confirm("Delete your account permanently? This action cannot be undone.")) return;
    deleteAccount({ variables: { currentPassword: deletePassword } });
  }

  return (
    <section className="shell-section">
      <div className="shell-section-head">
        <h2>Profile</h2>
        <p>Edit your account details, update password, or delete your account.</p>
      </div>

      <div className="profile-grid">
        <Form onSubmit={submitProfile} className="card-box profile-card profile-card-main">
          <h5>Account information</h5>
          <Form.Group className="mb-3">
            <Form.Label>Full name</Form.Label>
            <Form.Control value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control required value={form.username} onChange={(e) => updateField("username", e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control required type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>About</Form.Label>
            <Form.Control as="textarea" rows={3} value={form.about} onChange={(e) => updateField("about", e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Job title</Form.Label>
            <Form.Control value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g., Full Stack Developer" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Company</Form.Label>
            <Form.Control value={form.company} onChange={(e) => updateField("company", e.target.value)} placeholder="e.g., DevPilot Labs" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control value={form.location} onChange={(e) => updateField("location", e.target.value)} placeholder="e.g., Toronto, ON" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Website</Form.Label>
            <Form.Control value={form.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://your-website.com" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>GitHub</Form.Label>
            <Form.Control value={form.github} onChange={(e) => updateField("github", e.target.value)} placeholder="github.com/username" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+1 (___) ___-____" />
          </Form.Group>
          <div className="profile-row">
            <span className="profile-label">Role</span>
            <span className="profile-role">{user.role}</span>
          </div>
          {hasUnsavedChanges && <div className="profile-unsaved-msg">You have unsaved changes.</div>}
          <Button className="auth-submit-btn profile-save-btn" type="submit" disabled={updateState.loading || !hasUnsavedChanges}>
            {updateState.loading ? "Saving..." : "Save profile"}
          </Button>
        </Form>

        <Form onSubmit={submitPassword} className="card-box profile-card profile-card-side">
          <h5>Change password</h5>
          <Form.Group className="mb-3">
            <Form.Label>Current password</Form.Label>
            <Form.Control type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New password</Form.Label>
            <Form.Control type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </Form.Group>
          <Button className="auth-submit-btn profile-save-btn" type="submit" disabled={changeState.loading}>
            {changeState.loading ? "Updating..." : "Update password"}
          </Button>
        </Form>
      </div>

      <Form onSubmit={submitDelete} className="card-box profile-card danger-card">
        <h5>Delete account</h5>
        <p className="profile-danger-text">This permanently removes your account and signs you out.</p>
        <Form.Group className="mb-3">
          <Form.Label>Confirm password</Form.Label>
          <Form.Control type="password" required value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
        </Form.Group>
        <Button variant="danger" type="submit" disabled={deleteState.loading}>
          {deleteState.loading ? "Deleting..." : "Delete account"}
        </Button>
      </Form>

      {message && <div className="success-msg">{message}</div>}
      {error && <div className="error-msg">{error}</div>}
    </section>
  );
}
