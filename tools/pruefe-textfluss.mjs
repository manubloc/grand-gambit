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
for (const [vw, vh] of [[320, 690], [412, 915], [1280, 860]]) {
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
  // DER DAUERAUFTRAG DES BESITZERS: "nie Elemente uebereinander". Jedes
  // sichtbare Knopf-Paar wird auf Ueberdeckung geprueft (Vorfahr-Verhaeltnisse
  // ausgenommen - Knoepfe in Knoepfen gibt es ohnehin nicht).
  // Erste Fassung schlug bei Inhalt-unterm-Dock in SCROLL-MITTE an - das ist
  // aber legitim (Glasleiste, man scrollt weiter). Die echte Regel: Inhalt
  // gegen Inhalt IMMER; Inhalt gegen Dock erst, nachdem main ans ENDE
  // gescrollt wurde - dort garantiert das Bodenpolster die Freiheit.
  document.querySelector("main")?.scrollTo(0, 9e6);
  // getBoundingClientRect ignoriert CLIPPING: ein aus main herausgescrollter
  // Knopf "ueberlappte" numerisch die Kopfleiste (gemessen: top -1125, real
  // unsichtbar). Wir rechnen deshalb das SICHTBARE Rechteck - mit jedem
  // overflow-schneidenden Vorfahren verschnitten.
  const sichtbar = (el) => {
    let r = el.getBoundingClientRect();
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      const o = getComputedStyle(a);
      if (o.overflow !== "visible" || o.overflowY !== "visible" || o.overflowX !== "visible") {
        const ar = a.getBoundingClientRect();
        r = { left: Math.max(r.left, ar.left), top: Math.max(r.top, ar.top),
          right: Math.min(r.right, ar.right), bottom: Math.min(r.bottom, ar.bottom) };
        if (r.right - r.left <= 0 || r.bottom - r.top <= 0) return null;
      }
    }
    return { ...r, width: r.right - r.left, height: r.bottom - r.top };
  };
  const kn = [...document.querySelectorAll("main button, nav button, aside button")]
    .map((b) => ({ b, r: sichtbar(b), dock: !!b.closest("nav, aside") }))
    .filter((x) => x.r && x.r.width > 8 && x.r.height > 8 && x.r.bottom > 0 && x.r.top < innerHeight && x.b.offsetParent !== null);
  for (let i = 0; i < kn.length; i++) for (let j = i + 1; j < kn.length; j++) {
    const A = kn[i], B = kn[j];
    if (A.dock && B.dock) continue;
    if (A.b.contains(B.b) || B.b.contains(A.b)) continue;
    const w = Math.min(A.r.right, B.r.right) - Math.max(A.r.left, B.r.left);
    const h = Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top);
    if (w > 3 && h > 3) raus.push({ ort, text: "UEBERDECKT: '" + (A.b.innerText || "?").slice(0, 18) + "' x '" + (B.b.innerText || "?").slice(0, 18) + "'", wOver: Math.round(w), hOver: Math.round(h) });
  }
  document.querySelector("main")?.scrollTo(0, 0);
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
// Das Dock heisst mobil <nav>, breit <aside> - wir greifen per BESCHRIFTUNG,
// nicht per Index, damit derselbe Lauf beide Layouts traegt.
// ERSTBESUCH-HERALDS (v0.51) stellen jeden Raum einmal vor - der Waechter
// bestaetigt sie wie ein Mensch (Hauptknopf), sonst laege der Schleier
// ueber allen Messungen.
const abraeumen = async () => { for (let i = 0; i < 6; i++) {
  const g = await page.evaluate(() => {
    const sch = [...document.querySelectorAll("div")].find((d) => { const cs = getComputedStyle(d);
      return cs.position === "fixed" && cs.zIndex === "60" && d.getBoundingClientRect().width > 300; });
    if (!sch) return false;
    const kn = [...sch.querySelectorAll("button")].filter((b) => b.getBoundingClientRect().height > 30);
    (kn.find((b) => /Los geht|Weiter|Verstanden|Got it|Start/.test(b.innerText)) || kn[kn.length - 1])?.click();
    return true; });
  if (!g) break; await page.waitForTimeout(650); } };
const dock = async (name) => { await page.evaluate((n) => {
  const bs = [...document.querySelectorAll("nav button, aside button")];
  const z = bs.find((b) => (b.innerText || "").replace(/\s+/g, " ").trim().toLowerCase().includes(n));
  z?.click(); }, name); await page.waitForTimeout(1050); await abraeumen(); };
await abraeumen();
await dock("hofstaat");
for (const reiter of ["Hofstaat", "Aufstellung", "Ausr\u00fcstung", "Chronik"]) {
  await page.evaluate((r) => { const b = [...document.querySelectorAll("main button")].find((x) => (x.innerText || "").trim() === r); b?.click(); }, reiter);
  await page.waitForTimeout(700);
  funde.push(...await messe("hofstaat-" + reiter));
}
// Profil (Segmente: Figurenstil, Sprache, Schwierigkeit)
await dock("profil");
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
