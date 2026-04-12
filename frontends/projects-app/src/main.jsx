import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";
import ProjectList from "./ProjectList.jsx";
import ProjectForm from "./ProjectForm.jsx";

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:4000/graphql", credentials: "include" }),
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <div className="p-3">
        <h3>Projects MFE (standalone dev mode)</h3>
        <ProjectForm />
        <ProjectList />
      </div>
    </BrowserRouter>
  </ApolloProvider>
);
