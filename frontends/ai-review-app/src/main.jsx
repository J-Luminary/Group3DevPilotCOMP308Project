import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import ReviewPanel from "./ReviewPanel.jsx";

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/graphql", credentials: "include" }),
  cache: new InMemoryCache()
});

function StandaloneReviewApp() {
  const [projectId, setProjectId] = useState("");
  const [featureId, setFeatureId] = useState("");
  const [draftId, setDraftId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="review-app-wrap">
      <div className="review-page-head">
        <h3>AI Review Workspace</h3>
        <p>Standalone mode: provide IDs to test review rendering without Shell routing.</p>
      </div>

      <form onSubmit={submit} className="review-card review-standalone-form">
        <div className="review-grid-3">
          <label className="review-field">
            <span>Project ID</span>
            <input value={projectId} onChange={(e) => setProjectId(e.target.value)} placeholder="project id" />
          </label>
          <label className="review-field">
            <span>Feature ID</span>
            <input value={featureId} onChange={(e) => setFeatureId(e.target.value)} placeholder="feature id" />
          </label>
          <label className="review-field">
            <span>Draft ID</span>
            <input value={draftId} onChange={(e) => setDraftId(e.target.value)} placeholder="draft id" />
          </label>
        </div>
        <button type="submit" className="review-btn-primary">Load Review Panel</button>
      </form>

      {submitted && projectId && featureId && draftId ? (
        <ReviewPanel projectId={projectId} featureId={featureId} draftId={draftId} />
      ) : (
        <div className="review-card review-placeholder">
          Enter a valid `projectId`, `featureId`, and `draftId` to preview the review experience.
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <StandaloneReviewApp />
  </ApolloProvider>
);
