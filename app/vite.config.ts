import { defineConfig } from "vite";

export default defineConfig({
  root: "./app",
  server: {
    port: 8081,
  },
  build: {
    outDir: "dist",
    target: "es2020",
  },
});