import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Preloads the fonts the first screen uses, so text is set in them on first paint instead of
// reflowing when they arrive. The file names carry content hashes, so they come from the bundle.
const firstScreenFonts =
  /fira-(sans-latin-(400|500|600)|code-latin(-ext)?-wght)-normal-[\w-]+\.woff2$/;
const preloadFonts = () => ({
  name: "preload-fonts",
  transformIndexHtml: {
    order: "post",
    handler: (_html, { bundle }) =>
      Object.keys(bundle ?? {})
        .filter((file) => firstScreenFonts.test(file))
        .map((file) => ({
          tag: "link",
          attrs: {
            rel: "preload",
            href: `/${file}`,
            as: "font",
            type: "font/woff2",
            crossorigin: "",
          },
          injectTo: "head",
        })),
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFonts()],
  server: {
    port: 5173,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/test/**", "src/main.jsx", "src/App.jsx"],
      all: true,
      // Vitest only enforces these under `thresholds`: a run below 100% fails.
      thresholds: {
        lines: 100,
        branches: 100,
        functions: 100,
        statements: 100,
      },
    },
  },
});
