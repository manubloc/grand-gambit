// ── FLUSS-MESSUNG: BOOT UND KARTEN-ZIEHEN ───────────────────────────────────
// Der Besitzer meldet zerhackte Animationen beim Oeffnen und Ruckeln beim
// Kartenziehen. Ruckeln ist messbar: rAF-Frameabstaende. Dieses Werkzeug
// misst (a) die ersten 3,5 s nach dem Laden und (b) einen synthetischen
// 1,6-s-Zug ueber die Kampagnenkarte. Kennzahlen: mittlerer Abstand,
// schlimmster, Anteil > 26 ms (verlorene Frames bei 60 Hz) und > 50 ms.
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
await new Promise((r) => server.listen(4338, r));
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });

const sammler = () => page.evaluate(() => {
  window.__dt = []; window.__last = performance.now(); window.__lauf = true;
  const tick = (t) => { window.__dt.push(t - window.__last); window.__last = t; if (window.__lauf) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
});
const ernte = (name) => page.evaluate((n) => {
  window.__lauf = false;
  const d = (window.__dt || []).slice(3);
  const mittel = d.reduce((a, b) => a + b, 0) / Math.max(1, d.length);
  const schlimm = Math.max(...d, 0);
  const ue26 = d.filter((x) => x > 26).length, ue50 = d.filter((x) => x > 50).length;
  return `${n}: ${d.length} Frames · mittel ${mittel.toFixed(1)} ms · schlimmster ${schlimm.toFixed(0)} ms · >26ms: ${ue26} · >50ms: ${ue50}`;
}, name);

// Der Boot-Sammler muss VOR dem Dokument leben - ein evaluate vor goto
// stirbt mit der Navigation (gemessen: __dt undefined).
await page.addInitScript(() => {
  window.__errs = []; window.addEventListener("error", (e) => window.__errs.push(String(e.message).slice(0, 120)));
  window.__lt = []; try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push(e.duration)))
    .observe({ entryTypes: ["longtask"] }); } catch {}
  window.__dt = []; window.__last = performance.now(); window.__lauf = true;
  const tick = (t) => { window.__dt.push(t - window.__last); window.__last = t; if (window.__lauf) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
});
await page.goto("http://127.0.0.1:4338/", { waitUntil: "load" });
await page.waitForTimeout(3500);
console.log(await ernte("BOOT  "));

const klick = async (text) => {
  const l = page.getByText(text, { exact: false }).first();
  if (await l.count()) { await l.click({ timeout: 4000, force: true }).catch(() => {}); await page.waitForTimeout(850); }
};
await klick("Als Gast spielen");
for (const t of ["Los geht's", "Weiter", "Verstanden"]) await klick(t);
await klick("Neuer Spielstand");
for (const t of ["Los geht's", "Weiter"]) await klick(t);
await page.waitForTimeout(1100);
await page.evaluate(() => {
  const k = [...document.querySelectorAll("main > div > div")].find((d) => (d.innerText || "").startsWith("Kampagne"));
  k?.querySelector(":scope > button")?.click();
});
await page.waitForTimeout(2400);

// erst: 2 s STILLSTAND auf der Karte - ruckelt es schon ohne Zug?
await sammler();
await page.waitForTimeout(2000);
console.log(await ernte("RUHEND"));

// der Zug: 40 Schritte quer ueber die Karte, wie ein Daumen
await page.mouse.move(195, 420);
await sammler();
await page.mouse.down();
for (let i = 0; i < 40; i++) { await page.mouse.move(195 - i * 3.4, 420 - i * 2.1); await page.waitForTimeout(16); }
for (let i = 0; i < 40; i++) { await page.mouse.move(60 + i * 3.4, 336 + i * 2.6); await page.waitForTimeout(16); }
// Kontrollblick mitten im Zug: bewegt sich die Welt-Transform, und via DOM?
const mitte = await page.evaluate(() => {
  const w = [...document.querySelectorAll("div")].find((d) => (d.style.transform || "").includes("translate3d"));
  return w ? w.style.transform : "KEIN translate3d-Element";
});
await page.mouse.up();
console.log("TRANSFORM:", mitte);
console.log(await ernte("ZIEHEN"));
console.log("LONGTASKS gesamt:", await page.evaluate(() => { const l = window.__lt || []; const s = l.reduce((a,b)=>a+b,0);
  const r = `${l.length} Stueck, ${s.toFixed(0)} ms, laengster ${Math.max(0,...l).toFixed(0)} ms`; window.__lt = []; return r; }));
// Fingerabdruck: dieselbe Ruhe OHNE die grosse Welt-SVG
await page.evaluate(() => { const w = [...document.querySelectorAll("div")].find((d) => (d.style.transform || "").includes("translate3d"));
  const svg = w && w.querySelector("svg"); if (svg) svg.style.display = "none"; });
await sammler(); await page.waitForTimeout(2000);
console.log(await ernte("RUHEND ohne Welt-SVG"));
const fehler = await page.evaluate(() => (window.__errs || []).slice(0, 3));
console.log("SEITENFEHLER:", JSON.stringify(fehler));
await browser.close(); server.close();
