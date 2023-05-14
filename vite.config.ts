import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This is the alias for the path to the src folder
      // in the root of the project
      "@": "/src",
    },
  },
});
