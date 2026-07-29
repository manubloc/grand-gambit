// ── DIE FOTO-TOUR ───────────────────────────────────────────────────────────
// Bootet dist/, geht als Gast hinein und fotografiert jeden Kernbildschirm in
// zwei Viewports (schmal 320, normal 390). Dieselbe Tour laeuft VOR und NACH
// der Design-Migration - `node tools/foto-tour.mjs vorher|nachher` legt die
// Bilder unter docs/grand_gambit_design/screenshots/{before,after}/ ab.
// Bewusst dieselben Klickpfade wie messe-hub/pruefe-klassiksatz: erprobte Wege.
import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, join } from "node:path";

const RUNDE = process.argv[2] === "nachher" ? "after" : "before";
const ZIEL = `docs/grand_gambit_design/screenshots/${RUNDE}`;
await mkdir(ZIEL, { recursive: true });

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
await new Promise((r) => server.listen(4330, r));

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox"],
});

for (const [name, w, h] of [["schmal", 320, 690], ["normal", 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const foto = (stop) => page.screenshot({ path: `${ZIEL}/${name}-${stop}.png` });
  const klick = async (text) => {
    const l = page.getByText(text, { exact: false }).first();
    if (await l.count()) { await l.click({ timeout: 4000, force: true }).catch(() => {}); await page.waitForTimeout(850); return true; }
    return false;
  };
  const knopf = async (text, exakt = false) => {
    await page.evaluate(([t, ex]) => {
      const b = [...document.querySelectorAll("button")].find((x) => {
        const s = (x.innerText || "").replace(/\s+/g, " ").trim();
        return ex ? s === t : s.includes(t);
      });
      b?.click();
    }, [text, exakt]);
    await page.waitForTimeout(950);
  };

  await page.goto("http://127.0.0.1:4330/", { waitUntil: "load" });
  await page.waitForTimeout(1400);
  await foto("01-login");

  await klick("Als Gast spielen");
  for (const t of ["Los geht's", "Weiter", "Verstanden"]) await klick(t);
  await foto("02-spielstaende");
  await klick("Neuer Spielstand");
  for (const t of ["Los geht's", "Weiter", "Best\u00e4tigen", "Starten"]) await klick(t);
  await page.waitForTimeout(1200);
  await foto("03-hub");

  // Schnelles Spiel (Kopfknopf der Karte)
  await page.evaluate(() => {
    const k = [...document.querySelectorAll("main > div > div")].find((d) => (d.innerText || "").startsWith("Schnelles Spiel"));
    k?.querySelector(":scope > button")?.click();
  });
  await page.waitForTimeout(1100);
  await foto("04-schnelles-spiel");
  await knopf("Klassisch", true);
  await knopf("Partie starten");
  await page.waitForTimeout(2600);
  await foto("05-match-klassisch");
  await knopf("\u2039 Zur\u00fcck");
  await klick("Verlassen"); await klick("Ja"); await page.waitForTimeout(700);
  await knopf("\u2039 Zur\u00fcck");
  await page.waitForTimeout(800);

  // Kampagne
  await page.evaluate(() => {
    const k = [...document.querySelectorAll("main > div > div")].find((d) => (d.innerText || "").startsWith("Kampagne"));
    k?.querySelector(":scope > button")?.click();
  });
  await page.waitForTimeout(1900);
  await foto("06-kampagne");
  // Station antippen -> Infopanel
  await page.evaluate(() => {
    const c = document.querySelector("main canvas, main svg");
    if (c) { const r = c.getBoundingClientRect(); const ev = new MouseEvent("click", { clientX: r.left + r.width * 0.5, clientY: r.top + r.height * 0.72, bubbles: true }); c.dispatchEvent(ev); }
  });
  await page.waitForTimeout(900);
  await foto("07-kampagne-panel");

  // Dock: Hofstaat, Schatzkammer, Profil
  const dock = async (i) => { await page.evaluate((n) => document.querySelectorAll("nav > div > button")[n]?.click(), i); await page.waitForTimeout(1100); };
  await dock(1); await foto("08-hofstaat");
  await knopf("Ausr\u00fcstung"); await foto("09-ausruestung");
  await knopf("Chronik"); await foto("10-chronik");
  await dock(2); await foto("11-schatzkammer");
  await dock(3); await foto("12-profil");
  await page.close();
  console.log(`Tour ${name} (${w}x${h}) abgeschlossen`);
}
await browser.close(); server.close();
console.log("== FOTO-TOUR FERTIG:", ZIEL, "==");
