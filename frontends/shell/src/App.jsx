import React, { Suspense, lazy } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProjectView from "./pages/ProjectView.jsx";
import DraftReview from "./pages/DraftReview.jsx";

const CURRENT_USER = gql`
  query Me { currentUser { id username email role } }
`;

const LOGOUT = gql`
  mutation { logout }
`;

function Nav({ user, refetch }) {
  const nav = useNavigate();
  const [logout] = useMutation(LOGOUT, {
    onCompleted: async () => {
      await refetch();
      nav("/login");
    }
  });

  return (
    <div className="app-nav">
      <Link to="/">DevPilot</Link>
      {user && <Link to="/">Projects</Link>}
      <span className="spacer" />
      {user ? (
        <>
          <span>{user.username}</span>
          <button className="btn btn-sm btn-light" onClick={() => logout()}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </div>
  );
}

function Protected({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { data, loading, refetch } = useQuery(CURRENT_USER);
  const user = data?.currentUser;

  if (loading) return <div className="page">Loading...</div>;

  return (
    <>
      <Nav user={user} refetch={refetch} />
      <div className="page">
        <Routes>
          <Route path="/login" element={<Login onAuth={refetch} />} />
          <Route path="/register" element={<Register onAuth={refetch} />} />
          <Route path="/" element={<Protected user={user}><Dashboard /></Protected>} />
          <Route path="/projects/:id" element={<Protected user={user}><ProjectView /></Protected>} />
          <Route path="/projects/:projectId/features/:featureId/drafts/:draftId" element={<Protected user={user}><DraftReview /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
