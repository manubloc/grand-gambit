import { defineConfig } from "vite";
import { readFileSync } from "node:fs";
const GG_VERSION = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf8")).version;
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import pkg from "./package.json";

// base: "./" makes the build portable (Cloudflare/GitHub Pages, itch.io,
// any subfolder, TWA/Capacitor wrapper).
export default defineConfig({
  define: { __GG_VERSION__: JSON.stringify(GG_VERSION) },
  build: { assetsInlineLimit: (file, content) => file.endsWith(".webp") ? false : content.length < 400 * 1024 },
  base: "./",
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false, // registration lives in main.jsx (update loop + auto-reload)
      includeAssets: ["favicon.ico", "favicon.svg", "og.png", "landing.html", "privacy.html", "terms.html", "robots.txt"],
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
      workbox: {
        // WEBP is deliberately NOT precached: during a deploy an asset can be
        // referenced by the fresh JS bundle a moment before its own file has
        // finished uploading — the host then answers with the SPA fallback
        // page, status 200, and Workbox would store that HTML under the
        // image's URL. The picture is then permanently broken for that visitor
        // (it "loads" but never decodes). Images are cached at runtime instead,
        // and ONLY when the response really is an image.
        globPatterns: ["**/*.{js,css,html,svg,png,webmanifest}"],
        globIgnores: ["**/painted-*"], skipWaiting: true, clientsClaim: true,
        runtimeCaching: [{
          urlPattern: ({ request, url }) => request.destination === "image" || /\.webp$/.test(url.pathname),
          handler: "CacheFirst",
          options: {
            cacheName: "gg-images",
            expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 60 },
            cacheableResponse: { statuses: [200] },
            plugins: [{
              // the guard: an HTML fallback never enters the image cache
              cacheWillUpdate: async ({ response }) => {
                const ct = response.headers.get("content-type") || "";
                return ct.startsWith("image/") ? response : null;
              },
            }],
          },
        }],
      },
    }),
  ],
});
