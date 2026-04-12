import gql from "graphql-tag";

export const typeDefs = gql`
  type Issue {
    type: String!
    severity: String!
    description: String!
  }

  type Citation {
    source: String!
    snippet: String!
  }

  type Review {
    id: ID!
    draftId: ID!
    summary: String!
    issues: [Issue!]!
    suggestions: [String!]!
    confidence: Float!
    citations: [Citation!]!
    reflectionNotes: String
    createdAt: String!
  }

  extend type Query {
    reviewsForDraft(draftId: ID!): [Review!]!
  }

  extend type Mutation {
    generateReview(draftId: ID!, draftContent: String!): Review!
  }
`;
