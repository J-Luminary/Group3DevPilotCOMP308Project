import { gql } from "@apollo/client";

export const MY_PROJECTS = gql`
  query MyProjects {
    myProjects {
      id
      name
      description
      createdAt
    }
  }
`;

export const PROJECT_DETAIL = gql`
  query Project($id: ID!) {
    project(id: $id) {
      id
      name
      description
      features {
        id
        title
        description
        drafts {
          id
          content
          version
          createdAt
        }
      }
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation Create($name: String!, $description: String) {
    createProject(name: $name, description: $description) {
      id name description createdAt
    }
  }
`;

export const ADD_FEATURE = gql`
  mutation AddFeature($projectId: ID!, $title: String!, $description: String) {
    addFeature(projectId: $projectId, title: $title, description: $description) {
      id title description
    }
  }
`;

export const SUBMIT_DRAFT = gql`
  mutation SubmitDraft($projectId: ID!, $featureId: ID!, $content: String!) {
    submitDraft(projectId: $projectId, featureId: $featureId, content: $content) {
      id version content createdAt
    }
  }
`;
