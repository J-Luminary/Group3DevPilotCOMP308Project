import gql from "graphql-tag";

export const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  type AuthPayload {
    user: User
    message: String!
  }

  extend type Query {
    currentUser: User
  }

  extend type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!
  }
`;
