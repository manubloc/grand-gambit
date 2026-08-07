// ── WORAN RUCKELT ES? MESSUNG AM BRETT-PRUEFSTAND ───────────────────────────
// Der Besitzer meldet seit Wochen: klassischer Satz fluessig, eigene Figuren
// ruckeln. v1.0.38 senkte die Bildgroesse auf 192 px - das Ruckeln blieb.
// Also ist die Groesse nicht die Ursache.
//
// Der Pruefstand (ruckel_harness.jsx) mountet den Match-Bildschirm allein und
// nimmt den Stil als Fahne entgegen. Kein Login, keine Kampagne, kein Zufall -
// zweimal derselbe Bildschirm, nur ein anderer Figurensatz.
//
// Gemessen wird die Last des ANTIPPENS: scale(1.58) im Wechsel, 100 Bilder,
// Bildzeiten in Millisekunden. Dazu vier Zustaende je Stil.
//
//   node tools/messe-ruckeln2.mjs
//
// LAUT, WENN BLIND: ohne Figuren steigt das Werkzeug mit 1 aus.
import { createServer } from "node:http";
import { readFile } from "node:fs";
import { extname, join } from "node:path";
import { chromium } from "playwright-core";

const WURZEL = "/tmp/pruef";
const MIME = { ".html": "text/html", ".js": "text/javascript" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/" || !extname(p)) p = "/index.html";
  readFile(join(WURZEL, p.slice(1)), (e, b) => {
    if (e) { res.writeHead(404); res.end("weg"); }
    else { res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" }); res.end(b); }
  });
});
await new Promise((r) => srv.listen(0, r));
const port = srv.address().port;

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });

const FIGUR = (i) => {
  const r = i.getBoundingClientRect();
  return r.width > 8 && r.width < 130 && r.height > 8 && r.top < innerHeight && r.bottom > 0;
};

async function fuerStil(stil) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(`http://127.0.0.1:${port}/?stil=${stil}`, { waitUntil: "load" });
  await page.waitForTimeout(3500);

  const bestand = await page.evaluate((FIGURQ) => {
    const gilt = new Function("i", FIGURQ);
    const bilder = [...document.querySelectorAll("img")].filter(gilt);
    const zaehl = {}; const proben = [];
    let schattenSumme = 0;
    for (const i of bilder) {
      const e = i.parentElement;
      const f = e ? getComputedStyle(e).filter : "none";
      const n = f === "none" ? 0 : (f.match(/drop-shadow/g) || []).length;
      const bf = getComputedStyle(i).filter || "none";
      const bn = bf === "none" ? 0 : bf.split(") ").length;
      zaehl[n] = (zaehl[n] || 0) + 1;
      schattenSumme += n;
      if (proben.length < 3) {
        const r = i.getBoundingClientRect();
        proben.push({ datei: (i.currentSrc || i.src).split("/").pop().slice(0, 26) || "(inline)",
          quelle: i.naturalWidth + "x" + i.naturalHeight,
          auf: Math.round(r.width) + "x" + Math.round(r.height),
          schatten: n, bildfilter: bn });
      }
    }
    return { anzahl: bilder.length, zaehl, proben, schattenSumme };
  }, "const r=i.getBoundingClientRect();return r.width>8&&r.width<130&&r.height>8&&r.top<innerHeight&&r.bottom>0;");

  console.log(`\n══ STIL: ${stil} ══`);
  console.log("Figuren im Blick:", bestand.anzahl,
    "| drop-shadow-Durchgaenge gesamt:", bestand.schattenSumme);
  console.log("Verteilung je Figur:", JSON.stringify(bestand.zaehl));
  for (const p of bestand.proben) console.log("  ", JSON.stringify(p));
  if (!bestand.anzahl) {
    console.log("!! BLIND - keine Figuren. Nichts gemessen.");
    await page.close();
    return null;
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
        const s = n % 2 ? 1.58 : 1.0;
        for (const e of ziele) e.style.transform = `scale(${s})`;
        if (++n < 100) requestAnimationFrame(schritt);
        else {
          for (const e of ziele) e.style.transform = "";
          zeiten.splice(0, 4);
          const s2 = [...zeiten].sort((a, b) => a - b);
          const q = (x) => s2[Math.floor(s2.length * x)];
          fertig({ marke, figuren: ziele.length, bilder: zeiten.length,
            median: +q(0.5).toFixed(2), p90: +q(0.9).toFixed(2),
            schlimmstes: +s2[s2.length - 1].toFixed(2),
            ueber16: zeiten.filter((t) => t > 16.7).length });
        }
      }
      requestAnimationFrame(schritt);
    }), marke);
  }

  const aus = [];
  aus.push(await messe("wie es ist"));
  await page.evaluate(() => {
    const s = document.createElement("style"); s.id = "ab";
    s.textContent = "div:has(> img){filter:none !important}";
    document.head.appendChild(s);
  });
  await page.waitForTimeout(400);
  aus.push(await messe("Schattenkette aus"));
  await page.evaluate(() => {
    document.getElementById("ab").textContent =
      "div:has(> img){filter:none !important} img{filter:none !important}";
  });
  await page.waitForTimeout(400);
  aus.push(await messe("beide Filter aus"));
  await page.evaluate(() => {
    document.getElementById("ab").textContent =
      "div:has(> img){filter:drop-shadow(0 2px 3px rgba(0,0,0,.6)) !important} img{filter:none !important}";
  });
  await page.waitForTimeout(400);
  aus.push(await messe("EIN Schatten (Vorschlag)"));

  const a = aus[0];
  for (const v of aus)
    console.log(`  ${v.marke.padEnd(24)} Median ${String(v.median).padStart(6)} ms  ` +
      `p90 ${String(v.p90).padStart(6)} ms  schlimmstes ${String(v.schlimmstes).padStart(6)} ms  ` +
      `ueber 16,7 ms: ${String(v.ueber16).padStart(3)}/${v.bilder}` +
      (v === a ? "" : `  → ${(a.median / v.median).toFixed(2)}x`));
  await page.close();
  return { stil, bestand, aus };
}

const ergebnisse = [];
for (const stil of (process.env.STILE || "classic,painted").split(",")) {
  const r = await fuerStil(stil);
  if (r) ergebnisse.push(r);
}

console.log("\n══ GEGENUEBERSTELLUNG ══");
console.log("Stil       Figuren  Schatten ges.  Median wie-es-ist  Median mit EINEM Schatten");
for (const r of ergebnisse)
  console.log(`${r.stil.padEnd(10)} ${String(r.bestand.anzahl).padStart(7)} ` +
    `${String(r.bestand.schattenSumme).padStart(14)} ` +
    `${String(r.aus[0].median).padStart(18)} ms ${String(r.aus[3].median).padStart(21)} ms`);

await browser.close(); srv.close();
if (!ergebnisse.length) process.exit(1);
