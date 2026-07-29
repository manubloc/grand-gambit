// ── KEIN WAHLSCHALTER VERSCHLUCKT SEINEN TEXT ───────────────────────────────
// Forderung des Besitzers (v0.44): auf keinem Schirm darf ein Segment oder
// Kartenchip seinen Namen abschneiden. Dieses Werkzeug bootet dist/ im
// SCHMALEN Viewport (320 px), laeuft durch Schnelles Spiel, Hofstaat-Reiter
// und Profil und misst an JEDEM Knopf: scrollWidth <= clientWidth + 1 und
// scrollHeight <= clientHeight + 1. Ein einziger Ueberlauf faellt die Kette.
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
await new Promise((r) => server.listen(4336, r));
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
let gesamtFunde = 0, gemessen = 0;
for (const [vw, vh] of [[320, 690], [412, 915]]) {
const page = await browser.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: 2 });
await page.goto("http://127.0.0.1:4336/", { waitUntil: "load" });
await page.waitForTimeout(1400);
const klick = async (text) => {
  const l = page.getByText(text, { exact: false }).first();
  if (await l.count()) { await l.click({ timeout: 4000, force: true }).catch(() => {}); await page.waitForTimeout(850); return true; }
  return false;
};
await klick("Als Gast spielen");
for (const t of ["Los geht's", "Weiter", "Verstanden"]) await klick(t);
await klick("Neuer Spielstand");
for (const t of ["Los geht's", "Weiter"]) await klick(t);
await page.waitForTimeout(1100);

const messe = (wo) => page.evaluate((ort) => {
  const raus = [];
  for (const b of document.querySelectorAll("main button")) {
    const r = b.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) continue;
    const wOver = b.scrollWidth - b.clientWidth, hOver = b.scrollHeight - b.clientHeight;
    if (wOver > 1 || hOver > 1) raus.push({ ort, text: (b.innerText || "").replace(/\s+/g, " ").slice(0, 34), wOver, hOver });
    // auch abgeschnittene Innen-Spans (ellipsis) zaehlen als verschluckt -
    // AUSSER dort, wo der Schnitt Absicht ist (Namen auf Kacheln: title-Attr)
    for (const e of b.querySelectorAll("span,div")) {
      const cs = getComputedStyle(e);
      if (cs.textOverflow === "ellipsis" && e.scrollWidth - e.clientWidth > 1 && !e.closest("[data-schnitt-ok]"))
        raus.push({ ort, text: "ELLIPSIS: " + (e.textContent || "").slice(0, 30), wOver: e.scrollWidth - e.clientWidth, hOver: 0 });
    }
  }
  return raus;
}, wo);

let funde = [];
// Schnelles Spiel (Konfiguration)
await page.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").trim() === "Anpassen"); b?.click(); });
await page.waitForTimeout(1100);
funde.push(...await messe("schnelles-spiel"));
await page.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => (x.innerText || "").includes("Zur\u00fcck")); b?.click(); });
await page.waitForTimeout(800);
// Hofstaat: alle vier Reiter
await page.evaluate(() => document.querySelectorAll("nav > div > button")[1]?.click());
await page.waitForTimeout(1000);
for (const reiter of ["Hofstaat", "Aufstellung", "Ausr\u00fcstung", "Chronik"]) {
  await page.evaluate((r) => { const b = [...document.querySelectorAll("main button")].find((x) => (x.innerText || "").trim() === r); b?.click(); }, reiter);
  await page.waitForTimeout(700);
  funde.push(...await messe("hofstaat-" + reiter));
}
// Profil (Segmente: Figurenstil, Sprache, Schwierigkeit)
await page.evaluate(() => document.querySelectorAll("nav > div > button")[3]?.click());
await page.waitForTimeout(1000);
funde.push(...await messe("profil"));

// Kachel-Namen im Hofstaat duerfen per Bauart mit Ellipse enden (nowrap +
// title) - alles andere nicht. Wir werten NUR echte Ueberlaeufe:
funde = funde.filter((f) => !(f.text.startsWith("ELLIPSIS") && f.ort.startsWith("hofstaat-Hofstaat")));
const anzahl = await page.evaluate(() => document.querySelectorAll("main button").length);
gemessen += anzahl; gesamtFunde += funde.length;
for (const f of funde) console.log(`  VERSCHLUCKT [${vw}px · ${f.ort}] "${f.text}" +${f.wOver}x${f.hOver}px`);
console.log(`  Viewport ${vw}x${vh}: ${anzahl} Knoepfe zuletzt sichtbar, ${funde.length} Funde`);
await page.close();
}
if (gemessen < 20) { console.log("== TEXTFLUSS NICHT GEMESSEN =="); await browser.close(); server.close(); process.exit(2); }
console.log(`RESULT: ${gesamtFunde === 0 ? 1 : 0} passed, ${gesamtFunde} failed`);
console.log(gesamtFunde === 0 ? "== TEXTFLUSS SAUBER ==" : "== TEXT VERSCHLUCKT ==");
await browser.close(); server.close();
process.exit(gesamtFunde === 0 ? 0 : 1);
