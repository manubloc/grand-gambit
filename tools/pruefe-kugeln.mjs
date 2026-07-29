// ── SITZEN DIE ZAHLEN IN DEN KUGELN? ────────────────────────────────────────
// Der Besitzer: "die Bubbles Leben und Energie ... wirklich sauber mit den
// Zahlen orientiert und gut lesbar". Das ist keine Geschmacks-, sondern eine
// Messfrage: getBBox liefert den echten Textkasten im SVG-Koordinatensystem,
// der Kreis sitzt bei (12,12) mit r=11. Dieses Werkzeug startet ein HP-Gefecht
// und rechnet fuer JEDE Kugel den Versatz von Text- zu Kreismitte aus, dazu
// den Fuellgrad (wie gross steht die Zahl in der Kugel).
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
await new Promise((r) => server.listen(4352, r));
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await page.goto("http://127.0.0.1:4352/", { waitUntil: "load" });
await page.waitForTimeout(1400);
// Gemessen wird in der MUSTERKAMMER (?galerie): dort stehen die Kugeln in
// allen Groessen und Ziffernlaengen, ohne dass ein Spielmodus mitredet.
await page.goto("http://127.0.0.1:4352/?galerie", { waitUntil: "load" });
await page.waitForTimeout(1800);

const befund = await page.evaluate(() => {
  document.querySelector(".gg-thinbar")?.scrollTo(0, 0);
  const orbs = [...document.querySelectorAll("svg")].filter((s) => s.querySelector("text") && s.querySelector("circle"));
  const zeilen = [];
  for (const s of orbs.slice(0, 60)) {
    const t = s.querySelector("text"), c = s.querySelector("circle");
    if (!t || !c) continue;
    let bb; try { bb = t.getBBox(); } catch { continue; }
    if (!bb.width) continue;
    const cx = +c.getAttribute("cx"), cy = +c.getAttribute("cy"), r = +c.getAttribute("r");
    const dx = (bb.x + bb.width / 2) - cx, dy = (bb.y + bb.height / 2) - cy;
    zeilen.push({ text: t.textContent, dx: +dx.toFixed(2), dy: +dy.toFixed(2), hoehe: +bb.height.toFixed(2),
      fuellHoehe: +(bb.height / (2 * r)).toFixed(2), schrift: getComputedStyle(t).fontFamily.split(",")[0] });
  }
  const n = zeilen.length || 1;
  return { anzahl: zeilen.length,
    maxDx: Math.max(0, ...zeilen.map((z) => Math.abs(z.dx))),
    maxDy: Math.max(0, ...zeilen.map((z) => Math.abs(z.dy))),
    mittelFuell: +(zeilen.reduce((a, z) => a + z.fuellHoehe, 0) / n).toFixed(2),
    schriften: [...new Set(zeilen.map((z) => z.schrift))],
    // MEDIAEVALZIFFERN ENTLARVEN: bei LINIENDEN Ziffern sind alle einstelligen
    // Zahlen gleich hoch. Streuung > 0,4 heisst: die Ziffern tanzen.
    // Wichtig: auf die KUGELGROESSE normieren - die Galerie zeigt 22er, 34er
    // und 48er Kugeln, deren Ziffern natuerlich verschieden hoch sind. Erst
    // der Fuellgrad ist vergleichbar (erste Fassung meldete darum Fehlalarm).
    einstelligStreuung: (() => { const h = zeilen.filter((z) => z.text.length === 1).map((z) => z.fuellHoehe);
      return h.length < 2 ? 0 : +(Math.max(...h) - Math.min(...h)).toFixed(3); })(),
    proben: zeilen.slice(0, 5) };
});
console.log(JSON.stringify(befund, null, 1));
console.log("LAGE", await page.evaluate(() => ({
  knoepfe: [...document.querySelectorAll("main button")].map((b) => (b.innerText || "").replace(/\s+/g, " ").trim().slice(0, 20)).filter(Boolean).slice(0, 8),
  svgs: document.querySelectorAll("main svg").length,
  texteInSvg: [...document.querySelectorAll("main svg text")].length,
})));
if (befund.anzahl < 4) { console.log("== KUGELN NICHT GEMESSEN =="); await browser.close(); server.close(); process.exit(2); }
// Soll: Versatz unter 0,6 SVG-Einheiten (von 24) in beiden Richtungen, und die
// Zahl nimmt mindestens 38 % des Kugeldurchmessers ein.
const gut = befund.maxDx <= 0.6 && befund.maxDy <= 0.6 && befund.mittelFuell >= 0.38 && befund.einstelligStreuung <= 0.03;
console.log(`RESULT: ${gut ? 1 : 0} passed, ${gut ? 0 : 1} failed`);
console.log(gut ? "== KUGELN SAUBER ==" : "== KUGELN SCHIEF ODER ZU KLEIN ==");
await browser.close(); server.close();
process.exit(gut ? 0 : 1);
