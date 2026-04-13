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

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($projectId: ID!, $name: String!, $description: String) {
    updateProject(projectId: $projectId, name: $name, description: $description) {
      id
      name
      description
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

export const UPDATE_FEATURE = gql`
  mutation UpdateFeature($projectId: ID!, $featureId: ID!, $title: String!, $description: String) {
    updateFeature(projectId: $projectId, featureId: $featureId, title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

export const DELETE_FEATURE = gql`
  mutation DeleteFeature($projectId: ID!, $featureId: ID!) {
    deleteFeature(projectId: $projectId, featureId: $featureId)
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: ID!) {
    deleteProject(projectId: $projectId)
  }
`;

export const SUBMIT_DRAFT = gql`
  mutation SubmitDraft($projectId: ID!, $featureId: ID!, $content: String!) {
    submitDraft(projectId: $projectId, featureId: $featureId, content: $content) {
      id version content createdAt
    }
  }
`;

export const UPDATE_DRAFT = gql`
  mutation UpdateDraft($projectId: ID!, $featureId: ID!, $draftId: ID!, $content: String!) {
    updateDraft(projectId: $projectId, featureId: $featureId, draftId: $draftId, content: $content) {
      id
      version
      content
      createdAt
    }
  }
`;

export const DELETE_DRAFT = gql`
  mutation DeleteDraft($projectId: ID!, $featureId: ID!, $draftId: ID!) {
    deleteDraft(projectId: $projectId, featureId: $featureId, draftId: $draftId)
  }
`;

export const DRAFTS_BY_FEATURE = gql`
  query DraftsByFeature($projectId: ID!, $featureId: ID!) {
    draftsByFeature(projectId: $projectId, featureId: $featureId) {
      id
      content
      version
      createdAt
      authorId
    }
  }
`;
