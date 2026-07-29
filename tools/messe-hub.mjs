// ── DIE HUB-KARTEN NACHMESSEN ───────────────────────────────────────────────
// Der Besitzer meldete: "Fortschrittsbalken laeuft unter dem Icon durch,
// Schriften ueberlappen". Ansehen hilft hier wenig - Ueberlappung ist eine
// Rechenfrage. Dieses Werkzeug bootet dist/, geht als Gast in den Hub und
// prueft jede Karte auf Schnittflaechen zwischen Zeichen und Text.
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
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
await new Promise((r) => server.listen(4319, r));

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await page.goto("http://127.0.0.1:4319/", { waitUntil: "load" });
await page.waitForTimeout(1400);

// Eintreten wie in schau.mjs: Gast -> Hinweise -> neuer Spielstand
const klick = async (text) => {
  const l = page.getByText(text, { exact: false }).first();
  if (await l.count()) { await l.click({ timeout: 4000, force: true }).catch(() => {}); await page.waitForTimeout(900); return true; }
  return false;
};
await klick("Als Gast spielen");
for (const t of ["Los geht's", "Weiter", "Verstanden"]) await klick(t);
await page.waitForTimeout(600);
await klick("Neuer Spielstand");
for (const t of ["Los geht's", "Weiter", "Best\u00e4tigen", "Starten"]) await klick(t);
await page.waitForTimeout(1400);

const befund = await page.evaluate(() => {
  const schnitt = (a, b) => {
    const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    return w > 1 && h > 1 ? Math.round(w) * Math.round(h) : 0;
  };
  // WICHTIG: nicht die KAESTEN messen, sondern die SCHRIFT. Ein Block-<div>
  // mit paddingRight reicht als Kasten bis unter das Zeichen, obwohl kein
  // Buchstabe dort steht - genau so meldet ein Messwerkzeug Fehlalarm.
  const textFelder = (wurzel) => {
    const raus = [];
    const w = document.createTreeWalker(wurzel, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      if (!n.nodeValue.trim()) continue;
      const r = document.createRange(); r.selectNodeContents(n);
      for (const b of r.getClientRects()) if (b.width > 2 && b.height > 2) raus.push({ b, txt: n.nodeValue.trim().slice(0, 26) });
    }
    return raus;
  };
  const karten = [...document.querySelectorAll("main div")].filter((d) => {
    const b = d.querySelector(":scope > button");
    return b && b.querySelector("svg") && d.getBoundingClientRect().width > 200;
  });
  return karten.slice(0, 3).map((k) => {
    const kopf = k.querySelector(":scope > button");
    const svg = kopf.querySelector("svg");
    const zeichen = svg.getBoundingClientRect();
    let schlimm = 0, wer = "";
    for (const e of textFelder(kopf)) {
      const f = schnitt(zeichen, e.b);
      if (f > schlimm) { schlimm = f; wer = e.txt; }
    }
    // der Fortschrittsbalken ist keine Schrift - er wird eigens geprueft
    for (const bal of kopf.querySelectorAll("div")) {
      const bb = bal.getBoundingClientRect();
      if (bb.height > 0 && bb.height <= 8 && bb.width > 40) {
        const f = schnitt(zeichen, bb);
        if (f > schlimm) { schlimm = f; wer = "FORTSCHRITTSBALKEN"; }
      }
    }
    return {
      titel: (kopf.querySelector(".gg-serif")?.textContent || "?").slice(0, 24),
      zeichen: { l: Math.round(zeichen.left), t: Math.round(zeichen.top), r: Math.round(zeichen.right) },
      ueberlappung_px2: schlimm, mit: wer,
    };
  });
});
console.log(JSON.stringify(befund, null, 1));
await mkdir("/tmp/hub", { recursive: true });
await page.screenshot({ path: "/tmp/hub/hub.png", fullPage: false });
console.log("KNOPFTEXTE", JSON.stringify([...await page.$$eval("main button", (bs) => bs.map((b) => b.innerText.replace(/\s+/g, " ").trim().slice(0, 70)))]));

if (befund.length < 3) { console.log("== HUB NICHT GEMESSEN: nur " + befund.length + " Karten gefunden =="); await browser.close(); server.close(); process.exit(2); }
const schlimmste = Math.max(0, ...befund.map((b) => b.ueberlappung_px2));
await browser.close(); server.close();
console.log(schlimmste === 0 ? "== HUB SAUBER ==" : `== HUB UEBERLAPPT (${schlimmste} px2) ==`);
process.exit(schlimmste === 0 ? 0 : 1);
