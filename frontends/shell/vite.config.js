import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shell",
      remotes: {
        projectsApp: {
          type: "module",
          name: "projectsApp",
          entry: "http://localhost:3001/remoteEntry.js"
        },
        aiReviewApp: {
          type: "module",
          name: "aiReviewApp",
          entry: "http://localhost:3002/remoteEntry.js"
        }
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
        "react-router-dom": { singleton: true },
        "react-bootstrap": { singleton: true },
        "@apollo/client": { singleton: true }
      }
    })
  ],
  server: { port: 3000 },
  build: { target: "esnext" }
});
