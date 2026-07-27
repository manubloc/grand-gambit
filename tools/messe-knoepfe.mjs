// Liest die WIRKLICH gerenderten Stile jedes Knopfes und Eingabefeldes im
// laufenden Spiel - nicht den Quelltext, sondern das, was der Browser daraus
// macht. Nur so werden Rahmen sichtbar, die aus mehreren Regeln entstehen.
//
//   node tools/messe-knoepfe.mjs            -> Bericht
//   node tools/messe-knoepfe.mjs --pruefen  -> Ausstieg 1 bei Verstoessen
//
// Verstoss ist: Randbreite ueber 1.5px, ein plastischer Innenschatten
// (heller inset oben ODER dunkler inset), oder ein outline ueber 1.5px.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { chromium } from "playwright-core";

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json", ".webmanifest": "application/manifest+json" };
const srv = createServer(async (req, res) => {
  const p = "dist" + (req.url.split("?")[0] === "/" ? "/index.html" : req.url.split("?")[0]);
  try { const b = await readFile(p); res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" }); res.end(b); }
  catch { const b = await readFile("dist/index.html"); res.writeHead(200, { "content-type": "text/html" }); res.end(b); }
});
await new Promise((r) => srv.listen(0, r));
const port = srv.address().port;

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 900, height: 1500 } });
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1400);

const klick = (text) => page.evaluate((t) => {
  const alle = [...document.querySelectorAll("button,div,span,a")];
  let a = alle.filter((e) => e.textContent.trim() === t);
  if (!a.length) a = alle.filter((e) => e.textContent.trim().startsWith(t) && e.textContent.trim().length < t.length + 30);
  if (!a.length) a = alle.filter((e) => e.textContent.includes(t) && e.children.length === 0);
  const el = a[a.length - 1]; if (el) { el.click(); return true; } return false;
}, text);

// Anmelden und in einen Spielstand
await page.locator("input").first().fill("admin");
await page.locator("input").nth(1).fill("gambit-admin");
await klick("Anmelden");
await page.waitForTimeout(1200);
// Spielstand direkt im Speicher anlegen - am UI vorbei, deterministisch
const { readFileSync } = await import("node:fs");
const MESSPROF = JSON.parse(readFileSync("/tmp/messprof.json", "utf8"));
await page.evaluate((prof) => {
  const P = "gambit:u::";
  const acc = JSON.parse(localStorage.getItem(P + "session:v1") || "null")?.accountId;
  localStorage.setItem(P + "saves:" + acc, JSON.stringify([{ id: "mess1", name: "Messung",
    createdAt: Date.now(), updatedAt: Date.now(), playtimeSec: 0, league: 3, clearedCount: 1, total: 43, pct: 2 }]));
  localStorage.setItem(P + "save:" + acc + ":mess1", JSON.stringify(prof));
}, MESSPROF);
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1300);
const w = await klick("▶ Weiterspielen") || await klick("Weiterspielen");
console.log("Weiterspielen geklickt:", w);
await page.waitForTimeout(1800);
// Begruessung und alle Hinweisdialoge wegklicken, bis das Hauptmenue steht
for (let i = 0; i < 6; i++) {
  const weg = await page.evaluate(() => {
    const texte = ["Los geht's", "Los geht", "Verstanden", "Alles klar", "Weiter", "OK", "Schließen", "Zustimmen"];
    for (const t of texte) {
      const a = [...document.querySelectorAll("button")].filter((e) => e.textContent.trim().startsWith(t));
      if (a.length) { a[a.length - 1].click(); return t; }
    }
    return null;
  });
  if (!weg) break;
  await page.waitForTimeout(700);
}

const lies = () => page.evaluate(() => {
  const roh = (s) => (s === "none" || !s ? "" : s);
  return [...document.querySelectorAll("button, input, select, textarea")].map((e) => {
    const c = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    if (r.width < 8 || r.height < 8) return null;
    return {
      tag: e.tagName.toLowerCase(),
      text: (e.textContent || e.value || e.placeholder || "").trim().slice(0, 26),
      bw: Math.max(parseFloat(c.borderTopWidth) || 0, parseFloat(c.borderLeftWidth) || 0),
      bc: c.borderTopColor,
      ow: parseFloat(c.outlineWidth) || 0,
      shadow: roh(c.boxShadow).slice(0, 150),
    };
  }).filter(Boolean);
});

const seiten = [];
const sammle = async (name) => { await page.waitForTimeout(800); const l = await lies(); seiten.push([name, l]);
  if (process.argv.includes("--bilder")) await page.screenshot({ path: `/tmp/schirm-${name}.png`, fullPage: false });
  console.log(`  ${name}: ${l.length} Elemente`, l.length ? "-> " + l.slice(0, 3).map((e) => e.text || e.tag).join(" / ") : ""); };

console.log("Start-Body:", (await page.evaluate(() => document.body.innerText.slice(0, 140))).replace(/\n/g, " | "));
await sammle("Start");
for (const [knopf, name] of [["Profil", "Profil"], ["Hofstaat", "Hofstaat"], ["Schatzkammer", "Schatzkammer"], ["Spielen", "Spielen"]]) {
  const ok = await klick(knopf);
  console.log("klick", knopf, ok ? "ok" : "NICHT GEFUNDEN");
  if (ok) await sammle(name);
}

await browser.close(); srv.close();

const funde = [];
const gesehen = new Set();
for (const [seite, liste] of seiten) {
  for (const e of liste) {
    const kennung = seite + "|" + e.tag + "|" + e.text + "|" + e.bw + e.shadow;
    if (gesehen.has(kennung)) continue;
    gesehen.add(kennung);
    const gruende = [];
    if (e.bw > 1.5) gruende.push(`Rand ${e.bw}px (${e.bc})`);
    if (e.ow > 1.5) gruende.push(`Outline ${e.ow}px`);
    if (/inset/.test(e.shadow)) gruende.push(`Innenschatten: ${e.shadow}`);
    if (gruende.length) funde.push(`${seite} · ${e.tag} "${e.text}": ${gruende.join(" | ")}`);
  }
}

console.log(`gemessen: ${seiten.map(([n, l]) => n + " " + l.length).join(", ")}`);
if (funde.length) {
  console.log("BEFUNDE:\n" + funde.map((f) => "  - " + f).join("\n"));
  if (process.argv.includes("--pruefen")) process.exit(1);
} else console.log("== BEDIENELEMENTE SAUBER ==");
