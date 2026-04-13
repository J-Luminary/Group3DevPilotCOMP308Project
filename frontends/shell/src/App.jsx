import React from "react";
import { Routes, Route, Link, NavLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import { gql, useQuery, useMutation } from "@apollo/client";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import RecoverAccount from "./pages/RecoverAccount.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProjectView from "./pages/ProjectView.jsx";
import DraftReview from "./pages/DraftReview.jsx";
import Profile from "./pages/Profile.jsx";
import AiReviewHome from "./pages/AiReviewHome.jsx";

const CURRENT_USER = gql`
  query Me { currentUser { id username email fullName about role } }
`;

const LOGOUT = gql`
  mutation { logout }
`;

const PROJECT_NAV = gql`
  query ProjectNavigator {
    myProjects {
      id
      name
      features {
        id
        title
      }
    }
  }
`;

function pageTheme(pathname) {
  if (pathname.startsWith("/profile")) return "theme-profile";
  if (pathname.startsWith("/ai-review")) return "theme-ai";
  if (pathname.startsWith("/projects/")) return "theme-projects";
  return "theme-dashboard";
}

function ShellChrome({ user, refetch, projects }) {
  const nav = useNavigate();
  const [logout] = useMutation(LOGOUT, {
    onCompleted: async () => {
      await refetch();
      nav("/login");
    }
  });

  return (
    <aside className="shell-layout">
      <aside className="shell-sidebar">
        <Link to="/" className="brand-link">DevPilot</Link>
        {user ? (
          <>
            <div className="sidebar-user">
              <NavLink to="/profile" className="user-chip user-chip-link">
                {user.fullName || user.username}
              </NavLink>
              <button className="btn btn-sm btn-outline-light nav-logout-btn sidebar-logout" onClick={() => logout()}>
                Logout
              </button>
            </div>
            <nav className="sidebar-nav">
              <NavLink to="/" className="sidebar-link">
                <span className="nav-emoji">🏠</span>
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/ai-review" className="sidebar-link">
                <span className="nav-emoji">🤖</span>
                <span>AI Review</span>
              </NavLink>
              <NavLink to="/profile" className="sidebar-link">
                <span className="nav-emoji">👤</span>
                <span>Profile</span>
              </NavLink>
            </nav>

            <div className="sidebar-projects">
              <h6>Project Navigator</h6>
              {projects.length === 0 ? (
                <div className="project-nav-empty">No projects yet.</div>
              ) : (
                projects.map((p) => (
                  <details key={p.id} className="project-nav-item">
                    <summary>
                      <span className="nav-emoji">📁</span>
                      <span>{p.name}</span>
                    </summary>
                    <ol>
                      {(p.features || []).map((f) => (
                        <li key={f.id}>{f.title}</li>
                      ))}
                      {(p.features || []).length === 0 && <li className="project-nav-empty">No features yet.</li>}
                    </ol>
                    <Link className="project-nav-open" to={`/projects/${p.id}`}>Open project</Link>
                  </details>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="guest-links sidebar-auth-links">
            <Link to="/login">Login</Link>
            <Link to="/register" className="register-link">Register</Link>
          </div>
        )}
      </aside>
    </aside>
  );
}

function Protected({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  const { data, loading, refetch } = useQuery(CURRENT_USER);
  const user = data?.currentUser;
  const { data: projectNavData } = useQuery(PROJECT_NAV, {
    skip: !user
  });
  const projects = projectNavData?.myProjects || [];

  if (loading) return <div className="page shell-page"><div className="card-box">Loading...</div></div>;

  return (
    <div className={`app-root ${pageTheme(location.pathname)}`}>
      <ShellChrome user={user} refetch={refetch} projects={projects} />
      <main className="page shell-page app-main">
        <Routes>
          <Route path="/login" element={<Login onAuth={refetch} />} />
          <Route path="/register" element={<Register onAuth={refetch} />} />
          <Route path="/forgot-password" element={<RecoverAccount />} />
          <Route path="/" element={<Protected user={user}><Dashboard user={user} /></Protected>} />
          <Route path="/ai-review" element={<Protected user={user}><AiReviewHome /></Protected>} />
          <Route path="/profile" element={<Protected user={user}><Profile user={user} onAuth={refetch} /></Protected>} />
          <Route path="/projects/:id" element={<Protected user={user}><ProjectView /></Protected>} />
          <Route path="/projects/:projectId/features/:featureId/drafts/:draftId" element={<Protected user={user}><DraftReview /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
