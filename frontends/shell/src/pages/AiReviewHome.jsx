import React from "react";

export default function AiReviewHome() {
  return (
    <section className="shell-section">
      <div className="shell-section-head">
        <h2>AI Review</h2>
        <p>Open a project draft and run AI review to see quality feedback and suggestions.</p>
      </div>

      <div className="card-box">
        <h5>How to access review</h5>
        <ol className="review-steps">
          <li>Go to Dashboard and open a project.</li>
          <li>Select a feature and choose a draft version.</li>
          <li>Click <strong>Run AI review</strong>.</li>
        </ol>
        <p className="shell-loading">This page is your AI review entry point from top navigation.</p>
      </div>
    </section>
  );
}
