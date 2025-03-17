/**
 * Apollo Server setup for handling GraphQL queries.
 * Fetches country data from an external API and exposes it via GraphQL.
 */

import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";

// GraphQL schema definition
const typeDefs = gql`
  type Country {
    name: String
    capital: [String]
    population: Int
    area: Float
    cca3: String
    flag: String
    gdp: Float
  }

  type Query {
    countries: [Country]
    country(code: String!): Country
  }
`;

// Resolvers to fetch data from the REST API
const resolvers = {
  Query: {
    countries: async () => {
      const res = await fetch("https://restcountries.com/v3.1/all");
      const data = await res.json();
      return data.map((country) => ({
        name: country.name.common,
        capital: country.capital || ["N/A"],
        population: country.population,
        area: country.area,
        cca3: country.cca3,
        flag: country.flags.png,
        gdp: null, // Placeholder for missing GDP data
      }));
    },
    country: async (_, { code }) => {
      const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
      const data = await res.json();
      if (!data[0]) throw new Error("Country not found");

      return {
        name: data[0].name.common,
        capital: data[0].capital || ["N/A"],
        population: data[0].population,
        area: data[0].area,
        cca3: data[0].cca3,
        flag: data[0].flags.png,
        gdp: null,
      };
    },
  },
};

// Initialize Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server and handle requests
export const GET = startServerAndCreateNextHandler(server);
export const POST = startServerAndCreateNextHandler(server);
