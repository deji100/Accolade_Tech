"use client";

/**
 * Root layout component that wraps the application with ApolloProvider.
 * Ensures GraphQL queries are accessible throughout the app.
 */

import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client";

export default function RootLayout({ children }) {
  return (
    <ApolloProvider client={client}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ApolloProvider>
  );
}
