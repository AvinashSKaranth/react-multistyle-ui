import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Dev (demo gallery) config. Library build uses vite.config.lib.ts.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  build: {
    outDir: "dist-demo",
    emptyOutDir: true,
  },
});