import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "aiReviewApp",
      filename: "remoteEntry.js",
      exposes: {
        "./ReviewPanel": "./src/ReviewPanel.jsx"
      },
      shared: {
        react: { singleton: true },
        "react-dom": { singleton: true },
        "react-bootstrap": { singleton: true },
        "@apollo/client": { singleton: true }
      }
    })
  ],
  server: { port: 3002, cors: true },
  preview: { port: 3002 },
  build: { target: "esnext", minify: false, cssCodeSplit: false }
});
