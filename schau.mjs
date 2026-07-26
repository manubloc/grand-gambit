// schau.mjs — die Werkbank fuer Augenmass. Serviert dist/, geht als Gast
// hinein, misst die Fluchtlinien von Kopfleiste, Inhalt und Dock und legt
// Aufnahmen in /tmp/look ab. Antwortet auf "ist das Profil so breit wie das
// Menue?" mit Zahlen statt mit Zuversicht.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { chromium } from "playwright-core";

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json" };
const srv = createServer(async (req, res) => {
  const p = req.url.split("?")[0];
  try {
    const f = join("dist", p === "/" ? "index.html" : p.slice(1));
    const b = await readFile(f);
    res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" }); res.end(b);
  } catch {
    res.writeHead(200, { "content-type": "text/html" }); res.end(await readFile("dist/index.html"));
  }
});
await new Promise((r) => srv.listen(0, r));
const port = srv.address().port;

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const klick = async (text) => {
  const l = page.getByText(text, { exact: false }).first();
  if (await l.count()) { await l.click({ timeout: 4000, force: true }).catch(() => {}); await page.waitForTimeout(900); return true; }
  return false;
};
// Eintreten: Gast -> etwaige Hinweise wegklicken -> Spielstand waehlen
await klick("Als Gast spielen");
for (const t of ["Los geht's", "Weiter", "Verstanden"]) await klick(t);
await page.waitForTimeout(600);
await klick("Neuer Spielstand");
for (const t of ["Los geht's", "Weiter", "Bestätigen", "Starten"]) await klick(t);
await page.waitForTimeout(1200);
await page.screenshot({ path: "/tmp/look/app-hub.png" });

// Fluchtlinien messen: erstes <header>-Kind, <main>-Inhalt, Dock-Innenteil
const mass = await page.evaluate(() => {
  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { l: +b.left.toFixed(1), r: +b.right.toFixed(1), w: +b.width.toFixed(1) }; };
  const kopf = document.querySelector("header > div");
  const main = document.querySelector("main");
  const inhalt = main?.firstElementChild;
  const dock = document.querySelector("nav > div");
  return { kopf: r(kopf), main: r(main), inhalt: r(inhalt), dock: r(dock), vw: innerWidth };
});
console.log("MASSE", JSON.stringify(mass, null, 1));

// Profil ansteuern und dieselbe Messung dort wiederholen
const tabs = await page.$$("nav > div > button");
if (tabs.length >= 4) { await tabs[3].click({ force: true }).catch(() => {}); await page.waitForTimeout(1000); }
await page.screenshot({ path: "/tmp/look/app-profil.png" });
const mass2 = await page.evaluate(() => {
  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { l: +b.left.toFixed(1), r: +b.right.toFixed(1), w: +b.width.toFixed(1) }; };
  return { kopf: r(document.querySelector("header > div")), inhalt: r(document.querySelector("main")?.firstElementChild),
           dock: r(document.querySelector("nav > div")) };
});
console.log("PROFIL", JSON.stringify(mass2, null, 1));

await browser.close(); srv.close();
