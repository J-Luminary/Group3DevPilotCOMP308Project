import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";
import ReviewPanel from "./ReviewPanel.jsx";

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/graphql", credentials: "include" }),
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <div className="p-3">
      <h3>AI Review MFE (standalone dev mode)</h3>
      <p className="small text-muted">Needs a valid draftId + featureId + projectId query from shell context.</p>
    </div>
  </ApolloProvider>
);
