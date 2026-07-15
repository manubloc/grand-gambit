import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import pkg from "./package.json";

// base: "./" makes the build portable (Cloudflare/GitHub Pages, itch.io,
// any subfolder, TWA/Capacitor wrapper).
export default defineConfig({
  build: { assetsInlineLimit: (file, content) => file.endsWith(".webp") ? false : content.length < 400 * 1024 },
  base: "./",
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false, // registration lives in main.jsx (update loop + auto-reload)
      includeAssets: ["favicon.svg", "og.png", "privacy.html", "robots.txt"],
      manifest: {
        name: "Grand Gambit",
        short_name: "Grand Gambit",
        description: "Schach, das Charaktere erhebt — ein Taktik-Abenteuer. Chess that levels up.",
        lang: "de",
        start_url: "./",
        scope: "./",
        display: "standalone",
        background_color: "#0c111e",
        theme_color: "#0f1115",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: { globPatterns: ["**/*.{js,css,html,svg,png,webp,webmanifest}"], globIgnores: ["**/painted-*"] },
    }),
  ],
});
