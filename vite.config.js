import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Update the base path so the app works when served from
// https://<username>.github.io/final-project-Josh-pierce2026/
export default defineConfig({
  base: "/final-project-Josh-pierce2026/",
  plugins: [react()],
});
