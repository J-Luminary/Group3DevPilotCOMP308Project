import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const projectsRemoteEntry = env.VITE_PROJECTS_REMOTE_ENTRY || "http://localhost:3001/remoteEntry.js";
  const aiReviewRemoteEntry = env.VITE_AIREVIEW_REMOTE_ENTRY || "http://localhost:3002/remoteEntry.js";

  return {
    plugins: [
      react(),
      federation({
        name: "shell",
        remotes: {
          projectsApp: {
            type: "module",
            name: "projectsApp",
            entry: projectsRemoteEntry
          },
          aiReviewApp: {
            type: "module",
            name: "aiReviewApp",
            entry: aiReviewRemoteEntry
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
  };
});
