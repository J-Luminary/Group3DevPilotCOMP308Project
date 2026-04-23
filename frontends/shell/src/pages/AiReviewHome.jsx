import React from "react";
import { Link } from "react-router-dom";

export default function AiReviewHome() {
  return (
    <section className="shell-section ai-home">
      <div className="ai-home-grid">
        <aside className="ai-home-sidebar">
          <div className="ai-home-sidebar-card">
            <h6>Tools & History</h6>
            <div className="ai-home-side-group">
              <h5>Help & Resources</h5>
              <a href="https://owasp.org/www-project-top-ten/" target="_blank" rel="noreferrer">OWASP Top 10</a>
              <a href="https://graphql.org/learn/" target="_blank" rel="noreferrer">GraphQL Docs</a>
              <a href="https://react.dev/" target="_blank" rel="noreferrer">React Documentation</a>
              <a href="https://docs.langchain.com/oss/javascript/langgraph/overview" target="_blank" rel="noreferrer">LangGraph.js Guide</a>
            </div>
            <div className="ai-home-side-group">
              <h5>Recent Activity</h5>
              <div className="ai-home-history">
                <small>Latest</small>
                <p>Draft review for payment refactor was generated successfully.</p>
                <div className="ai-home-history-actions">
                  <button type="button">Load</button>
                  <button type="button">Remove</button>
                </div>
              </div>
              <button type="button" className="ai-home-clear-history">Clear all history</button>
            </div>
          </div>
        </aside>

        <div className="ai-home-main">
          <header className="ai-home-head">
            <div className="ai-home-head-chip">AI</div>
            <div>
              <h2>AI Review Workspace</h2>
              <p>Modern assistant layout with structured review workflow and citation-aware analysis.</p>
            </div>
          </header>

          <div className="ai-home-main-card">
            <div className="ai-home-main-instructions">
              <p>Open a project draft to review quality, risks, and implementation gaps with confidence scoring.</p>
              <p>
                Session actions (CRUD-style): <strong>Create</strong> select draft and run review,
                <strong> Read</strong> inspect AI output, <strong>Update</strong> edit draft and regenerate,
                <strong> Delete</strong> remove draft history as needed.
              </p>
            </div>

            <div className="ai-home-main-panels">
              <div className="ai-home-main-block">
                <h4>Your Draft</h4>
                <p>Pick a project and open a feature draft from dashboard.</p>
                <ol className="review-steps">
                  <li>Go to Dashboard.</li>
                  <li>Open a project and feature.</li>
                  <li>Click Run AI Review.</li>
                </ol>
              </div>

              <div className="ai-home-main-block">
                <h4>Assistant Output</h4>
                <p>Structured output includes summary, issues, suggestions, confidence, citations, and reflection.</p>
                <div className="ai-home-actions">
                  <Link to="/" className="ai-chip-link">Open Dashboard</Link>
                  <Link to="/profile" className="ai-chip-link">View Profile</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
