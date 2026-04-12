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
  }

  extend type Mutation {
    createProject(name: String!, description: String): Project!
    addFeature(projectId: ID!, title: String!, description: String): Feature!
    submitDraft(projectId: ID!, featureId: ID!, content: String!): Draft!
  }
`;
