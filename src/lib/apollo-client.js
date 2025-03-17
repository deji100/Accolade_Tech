/**
 * Apollo Client instance for making GraphQL requests.
 * Uses in-memory caching to optimize performance.
 */

import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "/api/graphql", // GraphQL API endpoint
  cache: new InMemoryCache(), // Enables caching
});

export default client;
