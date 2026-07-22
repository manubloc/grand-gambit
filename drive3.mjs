// drive3 — the road test. Serves the built dist/ over HTTP, boots the app in
// headless Chromium and fails on ANY console error or missing login mask.
// Gate line "== KEINE FEHLER ==" is what the push battery greps for.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { chromium } from "playwright-core";

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json" };
const srv = createServer(async (req, res) => {
  const p = req.url.split("?")[0];
  try {
    const f = join("dist", p === "/" ? "index.html" : p.slice(1));
    const b = await readFile(f);
    res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); res.end(b);
  } catch {
    const b = await readFile("dist/index.html");            // SPA fallback
    res.writeHead(200, { "content-type": "text/html" }); res.end(b);
  }
});
await new Promise((r) => srv.listen(0, r));
const port = srv.address().port;

const errors = [];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage();
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 160)); });
page.on("pageerror", (e) => errors.push(String(e).slice(0, 160)));
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
const hasLogin = await page.locator("input").count() > 0 || (await page.textContent("body"))?.includes("Spielstand");
if (!hasLogin) errors.push("Login-/Startmaske nicht gefunden");
await browser.close(); srv.close();

if (errors.length) { console.log("FEHLER:", errors.join(" | ")); process.exit(1); }
console.log("== KEINE FEHLER ==");
