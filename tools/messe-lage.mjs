// ── LAGE-MESSUNG HUB + MATCH ────────────────────────────────────────────────
// Belegt die Phase-6/12-Umbauten mit Zahlen statt Augenmass (Bildansicht der
// Sitzung ist ausgefallen): (1) Abstand Kopfleiste -> erste Hub-Karte,
// (2) Anzahl gleichzeitig laufender Glanzlaeufe im Hub, (3) Abstand
// Gegnerzeile -> Brettoberkante im klassischen Match.
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".webp": "image/webp", ".png": "image/png", ".json": "application/json",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".woff2": "font/woff2" };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/" || !extname(p)) p = "/index.html";
  try { const b = await readFile(join("dist", p));
    res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" }); res.end(b);
  } catch { res.writeHead(404); res.end("nope"); }
});
await new Promise((r) => server.listen(4332, r));
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await page.goto("http://127.0.0.1:4332/", { waitUntil: "load" });
await page.waitForTimeout(1400);
const klick = async (text) => {
  const l = page.getByText(text, { exact: false }).first();
  if (await l.count()) { await l.click({ timeout: 4000, force: true }).catch(() => {}); await page.waitForTimeout(850); return true; }
  return false;
};
await klick("Als Gast spielen");
for (const t of ["Los geht's", "Weiter", "Verstanden"]) await klick(t);
await klick("Neuer Spielstand");
for (const t of ["Los geht's", "Weiter", "Best\u00e4tigen", "Starten"]) await klick(t);
await page.waitForTimeout(1300);

const hub = await page.evaluate(() => {
  const kopf = document.querySelector("header, aside") || document.body.firstElementChild;
  const kopfUnten = kopf ? kopf.getBoundingClientRect().bottom : 0;
  const karte = [...document.querySelectorAll("main > div > div")].find((d) => (d.innerText || "").startsWith("Kampagne"));
  const ersteKarteOben = karte ? Math.round(karte.getBoundingClientRect().top) : -1;
  // laufende Glanzlaeufe: Elemente mit ggShine-Animation, die gerade sichtbar sind
  let sheens = 0;
  for (const e of document.querySelectorAll("main *")) {
    const a = getComputedStyle(e).animationName || "";
    if (a.includes("ggShine")) { const r = e.getBoundingClientRect(); if (r.width > 0 && r.bottom > 0 && r.top < innerHeight) sheens++; }
  }
  const akademie = [...document.querySelectorAll("main button")].find((b) => (b.innerText || "").startsWith("Die Akademie"));
  return { kopfUnten: Math.round(kopfUnten), ersteKarteOben, lueckeKopfKarte: ersteKarteOben - Math.round(kopfUnten), sheens,
    akademieUnten: akademie ? Math.round(akademie.getBoundingClientRect().bottom) : -1 };
});
console.log("HUB", JSON.stringify(hub));

// in den klassischen Kampf
await page.evaluate(() => {
  const k = [...document.querySelectorAll("main > div > div")].find((d) => (d.innerText || "").startsWith("Schnelles Spiel"));
  k?.querySelector(":scope > button")?.click();
});
await page.waitForTimeout(1100);
await page.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").trim() === "Klassisch"); b?.click(); });
await page.waitForTimeout(700);
await page.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").includes("Partie starten")); b?.click(); });
await page.waitForTimeout(3000);

const match = await page.evaluate(() => {
  // die Brettflaeche: groesstes Quadrat-artiges Element im main
  const kandidaten = [...document.querySelectorAll("main *")].map((e) => ({ e, r: e.getBoundingClientRect() }))
    .filter(({ r }) => r.width > 250 && Math.abs(r.width - r.height) < 40);
  kandidaten.sort((a, b) => b.r.width * b.r.height - a.r.width * a.r.height);
  const brett = kandidaten[0]?.r;
  // die Gegnerzeile: unterster Textblock OBERHALB des Bretts
  let gegnerUnten = 0;
  if (brett) for (const e of document.querySelectorAll("main *")) {
    const r = e.getBoundingClientRect();
    if (r.height > 8 && r.height < 60 && r.bottom <= brett.top + 1 && r.bottom > gegnerUnten && r.width > 40) gegnerUnten = r.bottom;
  }
  return brett ? { brettOben: Math.round(brett.top), brettSeite: Math.round(brett.width),
    lueckeUeberBrett: Math.round(brett.top - gegnerUnten), lueckeUnterBrett: Math.round(innerHeight - brett.bottom) } : { fehler: "kein Brett gefunden" };
});
console.log("MATCH", JSON.stringify(match));
await browser.close(); server.close();
