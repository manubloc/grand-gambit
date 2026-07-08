import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Produces ONE self-contained index.html (all JS + CSS inlined, no external
// requests) in dist-single/. Copy it to a phone and open it straight from local
// files — no web server and no network needed. The normal `npm run build`
// (multi-file dist/) remains the target for hosting / PWA / app wrappers.
import pkg from "./package.json";

export default defineConfig({
  base: "./",
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: "dist-single",
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000,
    reportCompressedSize: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
