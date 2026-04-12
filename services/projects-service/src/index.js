import dotenv from "dotenv";
dotenv.config({ path: new URL("../../../.env", import.meta.url) });

import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

const PORT = 4002;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/devpilot";

async function start() {
  await mongoose.connect(MONGO_URI);
  console.log("[projects] mongo connected");

  const app = express();
  app.use(express.json());

  app.use(session({
    name: "devpilot.sid",
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI, collectionName: "sessions" }),
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  }));

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers })
  });
  await server.start();

  app.use("/graphql", expressMiddleware(server, {
    context: async ({ req, res }) => ({ req, res })
  }));

  app.listen(PORT, () => console.log(`[projects] running on http://localhost:${PORT}/graphql`));
}

start().catch((e) => {
  console.error("[projects] failed", e);
  process.exit(1);
});
