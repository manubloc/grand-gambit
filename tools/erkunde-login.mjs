import { createServer } from "node:http";
import { readFile } from "node:fs";
import { extname, join } from "node:path";
import { chromium } from "playwright-core";
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json" };
const srv = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/" || !extname(p)) p = "/index.html";
  readFile(join("dist", p.slice(1)), (e, b) => {
    if (e) readFile("dist/index.html", (_, h) => { res.writeHead(200, { "content-type": "text/html" }); res.end(h); });
    else { res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" }); res.end(b); }
  });
});
await new Promise((r) => srv.listen(0, r));
const port = srv.address().port;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on("console", (m) => { if (m.type() === "error") console.log("  [Fehler]", m.text().slice(0, 100)); });
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "load" });
// WARTEN, BIS DER VORLADER DURCH IST. Vorher greift kein Klick - die Maske
// steht zwar da, aber die App reagiert noch nicht. (Genau daran ist der
// erste Anlauf gescheitert: Vorlader bei 232/416.)
await page.waitForFunction(() => {
  const t = document.body.innerText || "";
  const m = t.match(/(\d+)\s*\/\s*(\d+)/);
  return !m || m[1] === m[2];
}, { timeout: 90000 }).catch(() => console.log("  (Vorlader-Warten abgelaufen)"));
await page.waitForTimeout(1500);

async function felder(marke) {
  const d = await page.evaluate(() => ({
    inputs: [...document.querySelectorAll("input")].map((i) => ({
      typ: i.type, platz: i.placeholder || "", name: i.name || "",
      sichtbar: i.getBoundingClientRect().width > 4 })),
    knoepfe: [...document.querySelectorAll("button")]
      .filter((b) => b.getBoundingClientRect().width > 0)
      .map((b) => b.innerText.trim().replace(/\s+/g, " ").slice(0, 30)),
    text: (document.body.innerText || "").replace(/\s+/g, " ").slice(0, 200),
  }));
  console.log(`\n[${marke}]`);
  console.log("  Felder:", JSON.stringify(d.inputs));
  console.log("  Knoepfe:", JSON.stringify(d.knoepfe));
  console.log("  Text:", d.text);
  return d;
}
await felder("Start");
await page.getByRole("button", { name: /Erstellen/i }).first().click({ force: true }).catch(() => {});
await page.waitForTimeout(1500);
const d = await felder("nach Erstellen");

// ausfuellen und absenden
const n = d.inputs.filter((i) => i.sichtbar).length;
console.log("\nsichtbare Felder:", n);
for (let i = 0; i < n; i++) {
  const inp = page.locator("input").nth(i);
  const typ = d.inputs[i].typ;
  await inp.fill(typ === "email" || /mail/i.test(d.inputs[i].platz) ? "mess@mess.test"
    : /name/i.test(d.inputs[i].platz + d.inputs[i].name) ? "Messung" : "messwort-2026").catch(() => {});
}
await felder("ausgefuellt");
for (const t of ["Konto erstellen", "Erstellen", "Registrieren", "Anmelden"]) {
  const l = page.getByRole("button", { name: new RegExp(t, "i") }).first();
  if (await l.count()) { console.log("\ndruecke:", t); await l.click({ force: true }).catch(() => {}); break; }
}
await page.waitForTimeout(2200);
await felder("nach Absenden");
const sess = await page.evaluate(() => {
  const out = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.startsWith("gambit:u::")) out[k] = (localStorage.getItem(k) || "").slice(0, 80);
  }
  return out;
});
console.log("\nSpeicher:", JSON.stringify(sess, null, 1).slice(0, 600));
await browser.close(); srv.close();
