import gql from "graphql-tag";

export const typeDefs = gql`
  type Draft {
    id: ID!
    content: String!
    version: Int!
    authorId: String!
    createdAt: String!
  }

  type Feature {
    id: ID!
    title: String!
    description: String
    drafts: [Draft!]!
    createdAt: String!
  }

  type Project @key(fields: "id") {
    id: ID!
    name: String!
    description: String
    ownerId: String!
    features: [Feature!]!
    createdAt: String!
  }

  extend type Query {
    myProjects: [Project!]!
    project(id: ID!): Project
    feature(projectId: ID!, featureId: ID!): Feature
    draft(projectId: ID!, featureId: ID!, draftId: ID!): Draft
    draftsByFeature(projectId: ID!, featureId: ID!): [Draft!]!
  }

  extend type Mutation {
    createProject(name: String!, description: String): Project!
    updateProject(projectId: ID!, name: String!, description: String): Project!
    deleteProject(projectId: ID!): Boolean!
    addFeature(projectId: ID!, title: String!, description: String): Feature!
    updateFeature(projectId: ID!, featureId: ID!, title: String!, description: String): Feature!
    deleteFeature(projectId: ID!, featureId: ID!): Boolean!
    submitDraft(projectId: ID!, featureId: ID!, content: String!): Draft!
    updateDraft(projectId: ID!, featureId: ID!, draftId: ID!, content: String!): Draft!
    deleteDraft(projectId: ID!, featureId: ID!, draftId: ID!): Boolean!
  }
`;
