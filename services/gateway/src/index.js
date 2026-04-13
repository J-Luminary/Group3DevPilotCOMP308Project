import dotenv from "dotenv";
dotenv.config({ path: new URL("../../../.env", import.meta.url) });

import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from "@apollo/gateway";

const PORT = 4000;
const includeAiReview = process.env.ENABLE_AIREVIEW_SUBGRAPH !== "false";

class SessionAwareDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    const cookie = context?.req?.headers?.cookie;
    if (cookie) request.http.headers.set("cookie", cookie);
  }

  didReceiveResponse({ response, context }) {
    const setCookie = response.http.headers.get("set-cookie");
    if (setCookie && context?.res) {
      const existing = context.res.getHeader("set-cookie");
      if (existing) {
        const merged = Array.isArray(existing) ? [...existing, setCookie] : [existing, setCookie];
        context.res.setHeader("set-cookie", merged);
      } else {
        context.res.setHeader("set-cookie", setCookie);
      }
    }
    return response;
  }
}

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: "auth", url: "http://localhost:4001/graphql" },
      { name: "projects", url: "http://localhost:4002/graphql" },
      ...(includeAiReview ? [{ name: "aireview", url: "http://localhost:4003/graphql" }] : [])
    ]
  }),
  buildService: ({ url }) => new SessionAwareDataSource({ url })
});

const server = new ApolloServer({ gateway });

const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  credentials: true
}));
app.use(express.json());

await server.start();

app.use("/graphql", expressMiddleware(server, {
  context: async ({ req, res }) => ({ req, res })
}));

app.listen(PORT, () => {
  console.log(`[gateway] running on http://localhost:${PORT}/graphql`);
  if (!includeAiReview) {
    console.log("[gateway] milestone mode: ai-review subgraph disabled");
  }
});
