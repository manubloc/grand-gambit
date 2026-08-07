// ── WORAN RUCKELT ES WIRKLICH? ──────────────────────────────────────────────
// Der Besitzer meldet seit Wochen: klassischer Satz fluessig, eigene Figuren
// ruckeln. v1.0.38 hat die Bildgroesse auf 192 px gesenkt - das Ruckeln blieb.
// Also ist die Groesse nicht (allein) die Ursache. Dieses Werkzeug misst
// stattdessen die FILTERKETTE.
//
// Verdacht: PieceGlyph.jsx haengt an eine gemalte Figur bis zu NEUN
// drop-shadow-Durchgaenge plus zwei verschachtelte Farbfilterketten, an eine
// klassische genau EINEN Schatten. Jeder drop-shadow ist ein eigener
// Unschaerfe-Durchgang mit eigenem Zwischenpuffer; beim Antippen laeuft
// scale(1.58), und dann muss die ganze Kette neu gerechnet werden.
//
// Gemessen wird nicht der Verdacht, sondern der Unterschied: dieselbe
// Bewegung, einmal mit Kette und einmal ohne.
//
//   node tools/messe-ruckeln.mjs
//
// LAUT, WENN BLIND: findet das Werkzeug keine Figuren, sagt es das und steigt
// mit 1 aus. Ein Pruefwerkzeug, das "sauber" meldet, ohne etwas gesehen zu
// haben, ist schlimmer als keines.
import { createServer } from "node:http";
import { readFile, readFileSync as lies } from "node:fs";
import { extname, join } from "node:path";
import { chromium } from "playwright-core";

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg",
  ".json": "application/json", ".svg": "image/svg+xml", ".mp3": "audio/mpeg",
  ".woff2": "font/woff2", ".webmanifest": "application/manifest+json" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/" || !extname(p)) p = "/index.html";
  readFile(join("dist", p.slice(1)), (e, b) => {
    if (e) readFile("dist/index.html", (_, h) => {
      res.writeHead(200, { "content-type": "text/html" }); res.end(h);
    });
    else { res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" }); res.end(b); }
  });
});
await new Promise((r) => srv.listen(0, r));
const port = srv.address().port;

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "load" });
await page.waitForTimeout(2200);

const klick = (text) => page.evaluate((t) => {
  const alle = [...document.querySelectorAll("button,div,span,a")];
  let a = alle.filter((e) => e.textContent.trim() === t);
  if (!a.length) a = alle.filter((e) => e.textContent.trim().startsWith(t) && e.textContent.trim().length < t.length + 30);
  if (!a.length) a = alle.filter((e) => e.textContent.includes(t) && e.children.length === 0);
  const el = a[a.length - 1]; if (el) { el.click(); return true; } return false;
}, text);

// ── ZUGANG. Das eingebaute Admin-Wort taugt nicht mehr (in v1.0.39/40
//    gewechselt), also legt die Messung sich ein EIGENES Konto an.
await klick("Noch kein Konto");
await page.waitForTimeout(900);
const felder = await page.locator("input").count();
if (felder >= 2) {
  await page.locator("input").nth(felder - (felder >= 3 ? 3 : 2)).fill("mess@mess.test");
  await page.locator("input").nth(felder - (felder >= 3 ? 2 : 1)).fill("messwort-2026");
  if (felder >= 3) await page.locator("input").nth(felder - 1).fill("messwort-2026");
}
await klick("Erstellen");
await page.waitForTimeout(1600);

// Spielstand direkt in den Speicher - am UI vorbei, deterministisch
const PROF = JSON.parse(lies("/tmp/messprof.json", "utf8"));
const gesetzt = await page.evaluate((prof) => {
  const P = "gambit:u::";
  const acc = JSON.parse(localStorage.getItem(P + "session:v1") || "null")?.accountId;
  if (!acc) return false;
  localStorage.setItem(P + "saves:" + acc, JSON.stringify([{ id: "mess1", name: "Messung",
    createdAt: Date.now(), updatedAt: Date.now(), playtimeSec: 0, league: 3,
    clearedCount: 1, total: 43, pct: 2 }]));
  localStorage.setItem(P + "save:" + acc + ":mess1", JSON.stringify(prof));
  return true;
}, PROF);
console.log("Konto angelegt und Spielstand gesetzt:", gesetzt);
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "load" });
await page.waitForTimeout(1800);
await klick("Weiterspielen");
await page.waitForTimeout(1600);
for (let i = 0; i < 8; i++) {
  const weg = await page.evaluate(() => {
    for (const t of ["Los geht's", "Los geht", "Verstanden", "Alles klar", "Weiter", "OK", "Schließen", "Zustimmen"]) {
      const a = [...document.querySelectorAll("button")].filter((e) => e.textContent.trim().startsWith(t));
      if (a.length) { a[a.length - 1].click(); return t; }
    }
    return null;
  });
  if (!weg) break;
  await page.waitForTimeout(600);
}

// ── AUFS BRETT ─────────────────────────────────────────────────────────────
for (const t of ["Spielen", "Schnellspiel", "Starten", "Los"]) {
  await klick(t); await page.waitForTimeout(1100);
}
await page.waitForTimeout(1800);

const bestand = await page.evaluate(() => {
  const bilder = [...document.querySelectorAll("img")].filter((i) => {
    const r = i.getBoundingClientRect();
    return r.width > 8 && r.width < 130 && r.height > 8 && r.top < innerHeight && r.bottom > 0;
  });
  const zaehl = {}; const proben = [];
  for (const i of bilder) {
    const e = i.parentElement;
    const f = e ? getComputedStyle(e).filter : "none";
    const n = f === "none" ? 0 : (f.match(/drop-shadow/g) || []).length;
    zaehl[n] = (zaehl[n] || 0) + 1;
    if (proben.length < 4) {
      const r = i.getBoundingClientRect();
      proben.push({ datei: (i.currentSrc || i.src).split("/").pop().slice(0, 34),
        quelle: i.naturalWidth + "x" + i.naturalHeight,
        auf: Math.round(r.width) + "x" + Math.round(r.height),
        schatten: n, bildfilter: (getComputedStyle(i).filter || "none").slice(0, 46) });
    }
  }
  return { anzahl: bilder.length, zaehl, proben, wo: (document.body.innerText || "").replace(/\s+/g, " ").slice(0, 90) };
});
console.log("\n── BESTAND AUF DEM BRETT ──");
console.log("Wo:", bestand.wo);
console.log("Figuren im Blick:", bestand.anzahl);
console.log("drop-shadow-Durchgaenge je Figur:", JSON.stringify(bestand.zaehl));
for (const p of bestand.proben) console.log("  ", JSON.stringify(p));

if (!bestand.anzahl) {
  console.log("\n!! BLIND: keine Figuren gefunden - der Weg aufs Brett hat nicht getragen.");
  console.log("   Es wurde NICHTS gemessen. Kein Urteil moeglich.");
  await browser.close(); srv.close(); process.exit(1);
}

async function messe(marke) {
  return await page.evaluate((marke) => new Promise((fertig) => {
    const ziele = [...document.querySelectorAll("img")].map((i) => i.parentElement)
      .filter((e) => { if (!e) return false; const r = e.getBoundingClientRect();
        return r.width > 8 && r.width < 130 && r.height > 8 && r.top < innerHeight && r.bottom > 0; });
    const zeiten = []; let letzte = performance.now(); let n = 0;
    function schritt() {
      const jetzt = performance.now();
      zeiten.push(jetzt - letzte); letzte = jetzt;
      const s = n % 2 ? 1.58 : 1.0;            // genau die Last des Antippens
      for (const e of ziele) e.style.transform = `scale(${s})`;
      if (++n < 100) requestAnimationFrame(schritt);
      else {
        for (const e of ziele) e.style.transform = "";
        zeiten.splice(0, 4);
        const sortiert = [...zeiten].sort((a, b) => a - b);
        const q = (x) => sortiert[Math.floor(sortiert.length * x)];
        fertig({ marke, figuren: ziele.length, bilder: zeiten.length,
          median: +q(0.5).toFixed(2), p90: +q(0.9).toFixed(2),
          schlimmstes: +sortiert[sortiert.length - 1].toFixed(2),
          ueber16: zeiten.filter((t) => t > 16.7).length,
          ueber33: zeiten.filter((t) => t > 33.3).length });
      }
    }
    requestAnimationFrame(schritt);
  }), marke);
}

console.log("\n── A/B: DIESELBE BEWEGUNG, VIER ZUSTAENDE ──");
const a = await messe("wie es ist");
console.log(JSON.stringify(a));

await page.evaluate(() => {
  const s = document.createElement("style"); s.id = "ab";
  s.textContent = "div:has(> img) { filter: none !important; }";
  document.head.appendChild(s);
});
await page.waitForTimeout(400);
const b = await messe("Schattenkette aus");
console.log(JSON.stringify(b));

await page.evaluate(() => {
  document.getElementById("ab").textContent =
    "div:has(> img){filter:none !important} img{filter:none !important}";
});
await page.waitForTimeout(400);
const c = await messe("beide Filter aus");
console.log(JSON.stringify(c));

await page.evaluate(() => {
  document.getElementById("ab").textContent =
    "div:has(> img){filter:drop-shadow(0 2px 3px rgba(0,0,0,.6)) !important} img{filter:none !important}";
});
await page.waitForTimeout(400);
const d = await messe("ein Schatten (Vorschlag)");
console.log(JSON.stringify(d));

console.log("\n── URTEIL ──");
const x = (v) => (v.median > 0 ? (a.median / v.median).toFixed(2) + "x" : "?");
for (const v of [a, b, c, d])
  console.log(`  ${v.marke.padEnd(26)} Median ${String(v.median).padStart(6)} ms  p90 ${String(v.p90).padStart(6)} ms  ` +
    `ueber 16,7ms: ${String(v.ueber16).padStart(3)}/${v.bilder}  ${v === a ? "" : "→ " + x(v) + " schneller"}`);

await browser.close(); srv.close();
