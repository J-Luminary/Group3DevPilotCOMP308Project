import gql from "graphql-tag";

export const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    username: String!
    email: String!
    fullName: String
    about: String
    title: String
    company: String
    location: String
    website: String
    github: String
    phone: String
    role: String!
  }

  type AuthPayload {
    user: User
    message: String!
  }

  type PasswordResetRequestPayload {
    message: String!
    resetToken: String
  }

  extend type Query {
    currentUser: User
    recoverEmail(username: String!): String
  }

  extend type Mutation {
    register(username: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!
    requestPasswordReset(email: String!): PasswordResetRequestPayload!
    resetPassword(token: String!, newPassword: String!): AuthPayload!
    updateProfile(
      username: String!
      email: String!
      fullName: String
      about: String
      title: String
      company: String
      location: String
      website: String
      github: String
      phone: String
    ): AuthPayload!
    changePassword(currentPassword: String!, newPassword: String!): AuthPayload!
    deleteAccount(currentPassword: String!): Boolean!
  }
`;
