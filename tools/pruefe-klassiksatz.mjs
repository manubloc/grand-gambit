// ── WELCHE FIGUREN LIEGEN IM KLASSISCHEN SCHACH WIRKLICH AUF DEM BRETT? ─────
// Der Besitzer fragt, ob der neue creme/anthrazit-Satz im Schnellen Spiel
// ankommt. Das ist keine Geschmacks-, sondern eine Beweisfrage: dieses
// Werkzeug startet eine klassische Partie und liest die Bildquellen der
// Figuren aus dem Brett aus. Was drinsteht, steht drin.
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".webp": "image/webp", ".png": "image/png", ".json": "application/json",
  ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".woff2": "font/woff2" };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/" || !extname(p)) p = "/index.html";
  try {
    const buf = await readFile(join("dist", p));
    res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" });
    res.end(buf);
  } catch { res.writeHead(404); res.end("nope"); }
});
await new Promise((r) => server.listen(4321, r));

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "load" });
await page.waitForTimeout(1300);

const klick = async (text) => {
  const l = page.getByText(text, { exact: false }).first();
  if (await l.count()) { await l.click({ timeout: 4000, force: true }).catch(() => {}); await page.waitForTimeout(900); return true; }
  return false;
};
await klick("Als Gast spielen");
for (const t of ["Los geht's", "Weiter", "Verstanden"]) await klick(t);
await klick("Neuer Spielstand");
for (const t of ["Los geht's", "Weiter", "Best\u00e4tigen", "Starten"]) await klick(t);
await page.waitForTimeout(1400);

// Schnelles Spiel -> Klassisch -> Partie starten
// den Kopfknopf der Karte "Schnelles Spiel" direkt anfassen
await page.evaluate(() => {
  const k = [...document.querySelectorAll("main > div > div")].find((d) => (d.innerText || "").startsWith("Schnelles Spiel"));
  k?.querySelector(":scope > button")?.click();
});
await page.waitForTimeout(1200);
const zeig = async (wo) => console.log(wo, JSON.stringify(
  await page.$$eval("main button, main [role=button]", (bs) => bs.map((b) => (b.innerText || "").replace(/\s+/g, " ").trim().slice(0, 34)).filter(Boolean))));
await zeig("NACH SCHNELLES SPIEL:");
await page.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").trim() === "Klassisch");
  b?.click();
});
await page.waitForTimeout(800);
await zeig("NACH KLASSISCH:");
await page.evaluate(() => {
  const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").includes("Partie starten"));
  b?.click();
});
await page.waitForTimeout(3200);
await zeig("NACH START:");

const befund = await page.evaluate(() => {
  const bilder = [...document.querySelectorAll("img")]
    .map((i) => i.currentSrc || i.src)
    .filter((s) => /\.(webp|png)/i.test(s));
  const kurz = (s) => (s.split("/").pop() || s).split("?")[0];
  const zaehl = {};
  for (const b of bilder) { const k = kurz(b); zaehl[k] = (zaehl[k] || 0) + 1; }
  return {
    brettDa: !!document.querySelector('[class*="board"], main svg, main'),
    verschieden: Object.keys(zaehl).length,
    dateien: Object.entries(zaehl).sort((a, b) => b[1] - a[1]).slice(0, 14),
  };
});
console.log(JSON.stringify(befund, null, 1));

const namen = befund.dateien.map(([n]) => n).join(" ");
const klassik = /pawn-hell|king-hell|queen-hell|pawn-dunkel/.test(namen);
const carved = /carved-/.test(namen);
console.log(klassik ? "BEFUND: der KLASSIK-Satz (creme/anthrazit) liegt auf dem Brett"
  : carved ? "BEFUND: der GESCHNITZTE Satz liegt auf dem Brett - der Klassik-Satz kommt NICHT an"
  : "BEFUND: unklar - keiner der beiden Saetze erkannt");
await browser.close(); server.close();
