import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL || "http://localhost:4000/graphql";

const link = new HttpLink({
  uri: graphqlUrl,
  credentials: "include"
});

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});
