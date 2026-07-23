import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// Library build config -> dist/ (ESM bundle). Run via `vite build --config vite.config.lib.ts`.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      name: "ReactMultistyleUI",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "chart.js",
        "dayjs",
        "dayjs/plugin/customParseFormat",
        "prismjs",
        "@dnd-kit/core",
        "@dnd-kit/sortable",
        "@dnd-kit/utilities",
        "tailwind-merge",
      ],
      output: {
        entryFileNames: "[name].js",
        assetFileNames: (asset) => {
          // The single bundled stylesheet -> dist/style.css (the ./style.css export).
          if (asset.name && asset.name.endsWith(".css")) {
            return "[name][extname]";
          }
          return "assets/[name][extname]";
        },
      },
    },
    emptyOutDir: true,
    sourcemap: true,
  },
});