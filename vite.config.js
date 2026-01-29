import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Configure Vite for GitHub Pages project site
// Site URL: https://<username>.github.io/final-project-Josh-pierce2026/
export default defineConfig({
  base: "/final-project-Josh-pierce2026/",
  build: {
    outDir: "docs", // GitHub Pages can serve from /docs on the main branch
  },
  plugins: [react()],
});
