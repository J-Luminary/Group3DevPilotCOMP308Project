import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "projectsApp",
      filename: "remoteEntry.js",
      exposes: {
        "./ProjectList": "./src/ProjectList.jsx",
        "./ProjectForm": "./src/ProjectForm.jsx",
        "./ProjectDetail": "./src/ProjectDetail.jsx"
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
  server: { port: 3001, cors: true },
  preview: { port: 3001 },
  build: { target: "esnext", minify: false, cssCodeSplit: false }
});
