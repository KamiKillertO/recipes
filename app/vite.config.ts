import { defineConfig } from "vite";

export default defineConfig({
  root: `${import.meta.dirname}/src`,
  server: {
    port: 8081,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
    fs: {
      allow: [
        `${import.meta.dirname}/src`
      ]
    }
  },
  build: {
    outDir: "dist",
    target: "es2024",
  },
});
