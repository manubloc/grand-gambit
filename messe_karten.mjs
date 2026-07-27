// Vermisst die Kampagnenkarten ALLER zwoelf Kapitel im echten Browser-Build -
// als Ersatz fuer Augen: gezaehlt und gemessen statt geschaut.
//   je Kapitel:  gerenderte Stationen == Stationszahl des Kapitels?
//                alle Positionen innerhalb der Karte? keine Deckungsgleichen?
//   Rueckblick:  ein Kapitel zurueckgeblaettert - zeigt die Karte NUR dieses
//                Kapitel (der gemeldete "alles mitten drin"-Fehler)?
// Ausgabe endet mit "== KARTEN SAUBER ==" oder listet die Befunde.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { chromium } from "playwright-core";
import { CAMPAIGN } from "./src/content/index.js";

const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json", ".webmanifest": "application/manifest+json" };
const srv = createServer(async (req, res) => {
  const p = "dist" + (req.url.split("?")[0] === "/" ? "/index.html" : req.url.split("?")[0]);
  try { const b = await readFile(p); res.writeHead(200, { "content-type": MIME[extname(p)] || "application/octet-stream" }); res.end(b); }
  catch { const b = await readFile("dist/index.html"); res.writeHead(200, { "content-type": "text/html" }); res.end(b); }
});
await new Promise((r) => srv.listen(0, r));
const port = srv.address().port;

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 900, height: 1400 } });
const befunde = [];
page.on("pageerror", (e) => befunde.push("pageerror: " + String(e).slice(0, 140)));

await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// 1) Als Admin anmelden (der Weg der Werkbank)
await page.locator("input").first().fill("admin");
await page.locator("input").nth(1).fill("gambit-admin");
await page.evaluate(() => { const a=[...document.querySelectorAll("button,div")].filter(e=>e.textContent.trim()==="Anmelden"); const b=a[a.length-1]; b && b.click(); });
await page.waitForTimeout(1200);

// 2) Spielstand direkt im Speicher anlegen - am UI vorbei, deterministisch
import { readFileSync } from "node:fs";
const DEFPROF = JSON.parse(readFileSync("/tmp/defprof.json", "utf8"));
await page.evaluate((defprof) => {
  const P = "gambit:u::";
  const ses = JSON.parse(localStorage.getItem(P + "session:v1") || "null");
  const acc = ses?.accountId;
  const entry = { id: "mess1", name: "Messung", createdAt: Date.now(), playtimeSec: 0,
    updatedAt: Date.now(), league: 1, clearedCount: 0, total: 45, pct: 0 };
  localStorage.setItem(P + "saves:" + acc, JSON.stringify([entry]));
  localStorage.setItem(P + "save:" + acc + ":mess1", JSON.stringify(defprof));
}, DEFPROF);
await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await page.evaluate(() => { const wa=[...document.querySelectorAll("button,div")].filter((e)=>e.textContent.trim()==="Weiterspielen"); const w=wa[wa.length-1]; w && w.click(); });
await page.waitForTimeout(1200);

// Speicher-Koordinaten fuer den direkten Profil-Eingriff
const keys = await page.evaluate(() => {
  const ses = JSON.parse(localStorage.getItem("gambit:u::session:v1") || "null");
  const acc = ses?.accountId;
  const idx = JSON.parse(localStorage.getItem("gambit:u::saves:" + acc) || "[]");
  return { acc, slot: idx[0]?.id || null };
});
if (!keys.acc || !keys.slot) { befunde.push("kein Konto/Spielstand erreichbar: " + JSON.stringify(keys)); }

const SOLL = Object.fromEntries(Array.from({length:12},(_,i)=>[i+1, CAMPAIGN.filter((n)=>n.league===i+1).map((n)=>n.place)]));
const JE_KAP = Object.fromEntries(Array.from({ length: 12 }, (_, i) => [i + 1, CAMPAIGN.filter((n) => n.league === i + 1).length]));


async function raeumWeg() {
  for (let i = 0; i < 4; i++) {
    const hat = await page.evaluate(() => {
      const texte = ["Verstanden", "OK", "Weiter", "Los geht", "Alles klar", "Schließen"];
      const alle = [...document.querySelectorAll("button,div")];
      for (const t of texte) {
        const a = alle.filter((e) => e.textContent.trim() === t || e.textContent.trim().startsWith(t));
        const el = a[a.length - 1];
        if (el) { el.click(); return t; }
      }
      return null;
    });
    if (!hat) return;
    await page.waitForTimeout(700);
  }
}

async function oeffneKampagne() {
  await raeumWeg();
  const ok = await page.evaluate(() => {
    const k = [...document.querySelectorAll("button,div")].filter((e) => e.textContent.trim() === "Kampagne");
    const el = k[k.length - 1]; if (el) { el.click(); return true; } return false;
  });
  if (!ok) console.log("  (Kampagne-Knopf nicht gefunden; Body:", (await page.evaluate(() => document.body.innerText.slice(0, 120))).replace(/\n/g, " | "), ")");
  await page.waitForTimeout(1400);
  await raeumWeg();
  const drin = await page.evaluate(() => document.body.innerText.includes("KAPITEL"));
  if (!drin) console.log("  (nicht in der Kampagne; Body:", (await page.evaluate(() => document.body.innerText.slice(0, 100))).replace(/\n/g, " | "), ")");
}

async function messeKarte(kapNr, etikett) {
  const soll = SOLL[kapNr];
  const m = await page.evaluate((sollNamen) => {
    const alle = [...document.querySelectorAll("div")].filter((d) => {
      const st = d.getAttribute("style") || "";
      return /translate\(-50%,\s*-50%\)/.test(st) && st.includes("position: absolute") && st.includes("left:") && st.includes("top:") && d.offsetWidth >= 30 && d.offsetWidth <= 70;
    });
    const eintraege = alle.map((d) => ({ t: (d.textContent || "").trim().replace(/^[✓✔!·\s]+/, ""), x: parseFloat(d.style.left), y: parseFloat(d.style.top) })).filter((e) => e.t);
    const istSoll = (t) => sollNamen.some((sn) => sn === t || sn.startsWith(t.slice(0, 16)) || t.startsWith(sn.slice(0, 16)));
    const stationen = eintraege.filter((e) => istSoll(e.t));
    const fremde = eintraege.filter((e) => !istSoll(e.t) && !e.t.includes("AKTUELL")).map((e) => e.t);
    const img = [...document.querySelectorAll("img")].sort((a, b) => (b.naturalWidth || 0) - (a.naturalWidth || 0))[0];
    return { anzahl: stationen.length, pos: stationen.map((e) => [e.x, e.y]), fremde: [...new Set(fremde)], kw: img?.naturalWidth || 0, kh: img?.naturalHeight || 0 };
  }, soll);
  if (m.anzahl !== soll.length) befunde.push(`${etikett}: ${m.anzahl} benannte Stationen, erwartet ${soll.length}`);
  if (m.fremde.length) befunde.push(`${etikett}: fremde benannte Marker: ${m.fremde.slice(0, 5).join(", ")}`);
  const HREL = m.kw ? (m.kh / m.kw) * 1796 : 1400;
  const raus = m.pos.filter(([x, y]) => x < -5 || y < -5 || x > 1801 || y > HREL + 5);
  if (raus.length) befunde.push(`${etikett}: ${raus.length} Stationen ausserhalb der Karte (${JSON.stringify(raus.slice(0, 3))})`);
  const seen = new Set(); let deck = 0;
  for (const [x, y] of m.pos) { const k = Math.round(x) + ":" + Math.round(y); if (seen.has(k)) deck++; seen.add(k); }
  if (deck) befunde.push(`${etikett}: ${deck} deckungsgleiche Stationen`);
}

for (let lg = 1; lg <= 12; lg++) {
  // Profil direkt setzen: Kapitel lg, halber Fortschritt, Boot+Kapitaen fuer XII
  await page.evaluate(({ acc, slot, lg }) => {
    const key = `gambit:u::save:${acc}:${slot}`;
    const p = JSON.parse(localStorage.getItem(key) || "{}");
    p.campaign = { ...(p.campaign || {}), league: lg, cleared: lg === 1 ? ["L01s00"] : [], unlocked: lg >= 6 ? ["captain"] : [], tolls: [], dupes: {} };
    p.items = lg === 12 ? { ...(p.items || {}), boat: 1 } : (p.items || {});
    localStorage.setItem(key, JSON.stringify(p));
  }, { ...keys, lg });
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1400);
  const weiter = page.getByText("Weiterspielen");
  if (await weiter.count()) { await weiter.first().click(); await page.waitForTimeout(1000); }
  await oeffneKampagne();
  await messeKarte(lg, `Kapitel ${lg}`);

  // Der Wanderer: traegt er die Livree (carved-Gambit), und lebt die Animation?
  if (lg === 1 || lg === 12) {
    const wf = await page.evaluate(() => {
      const c = document.querySelector('[title="Gambit"]');
      if (!c) return { da: false };
      const img = c.querySelector("img[src]");
      const anim = [...c.querySelectorAll("div")].map((d) => getComputedStyle(d).animationName).find((a) => a && a !== "none") || "none";
      return { da: true, src: img ? img.getAttribute("src").split("/").pop().slice(0, 30) : null, anim };
    });
    if (!wf.da) befunde.push(`Kapitel ${lg}: kein Wanderer auf der Karte`);
    else {
      if (lg === 1 && !(wf.src || "").includes("gambit")) befunde.push(`Kapitel 1: Wanderer zeigt nicht den Gambit (src=${wf.src})`);
      if (lg === 12 && !wf.anim.includes("ggBob")) befunde.push(`Kapitel 12: Boot schaukelt nicht vor Anker (anim=${wf.anim})`);
    }
    if (lg === 1) {
      // Zur Alten Wacht zurueckwandern: unterwegs muss der Gambit HUEPFEN
      await page.evaluate(() => {
        const st = [...document.querySelectorAll("div")].find((d) => (d.textContent || "").trim().replace(/^[✓✔!·\s]+/, "") === "Alte Wacht" && d.offsetWidth <= 70);
        const b = st && st.querySelector("button"); b && b.click();
      });
      await page.waitForTimeout(220);
      const hop = await page.evaluate(() => {
        const c = document.querySelector('[title="Gambit"]');
        return c ? ([...c.querySelectorAll("div")].map((d) => getComputedStyle(d).animationName).find((a) => a && a.includes("ggHop")) || "none") : "weg";
      });
      if (!hop.includes("ggHop")) befunde.push(`Kapitel 1: unterwegs kein Huepfen (anim=${hop})`);
      await page.waitForTimeout(1100);

      // DER GAMBIT BLEIBT SICHTBAR: Panel und Wanderer duerfen sich nie
      // ueberlappen, mit mindestens 12px Abstand (Soll 24, Toleranz fuer Rundung).
      const frei = await page.evaluate(() => {
        const tok = document.querySelector('[title="Gambit"]');
        const panels = [...document.querySelectorAll("div")].filter((d) => {
          const st = d.getAttribute("style") || "";
          return st.includes("backdrop-filter") && d.offsetWidth > 250 && d.offsetWidth < 420 && (d.textContent || "").length > 30;
        });
        if (!tok) return { fehlt: "Wanderer" };
        if (!panels.length) return { fehlt: "Panel (nicht offen)" };
        const t = tok.getBoundingClientRect(), p = panels[0].getBoundingClientRect();
        const overlap = Math.max(0, Math.min(t.bottom, p.bottom) - Math.max(t.top, p.top)) *
                        Math.max(0, Math.min(t.right, p.right) - Math.max(t.left, p.left));
        const abstand = t.top >= p.bottom ? t.top - p.bottom : p.top - t.bottom;
        return { overlap: Math.round(overlap), abstand: Math.round(abstand) };
      });
      if (frei.fehlt) befunde.push(`Kapitel 1: Sichtbarkeitstest unvollstaendig (${frei.fehlt})`);
      else if (frei.overlap > 0) befunde.push(`Kapitel 1: Panel ueberdeckt den Gambit (${frei.overlap}px2)`);
      else if (frei.abstand < 12) befunde.push(`Kapitel 1: Panel zu dicht am Gambit (${frei.abstand}px)`);

      // NEBEL DER ZUKUNFT: das obere Kartenende muss im Dunkel liegen
      const nebel = await page.evaluate(() => {
        const o = [...document.querySelectorAll("div")].find((d) => ((d.getAttribute("style") || "").includes("rgba(0, 0, 0, 0.97)")));
        return !!o;
      });
      if (!nebel) befunde.push("Kapitel 1: Nebel der Zukunft fehlt");
    }
  }

  // Rueckblick: ein Kapitel zurueck - DER gemeldete Fehler
  if (lg >= 2) {
    const roman = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"][lg - 2];
    const zk = await page.evaluate((r) => { const b = document.querySelector(`button[title="${r}"]`); if (b) { b.click(); return true; } return false; }, roman);
    if (zk) { await page.waitForTimeout(1200); await messeKarte(lg - 1, `Rueckblick auf ${lg - 1} (aus ${lg})`); }
    else befunde.push(`Kapitel ${lg}: Rueckblick-Pfeil (title=${roman}) nicht gefunden`);
  }
}

await browser.close(); srv.close();
if (befunde.length) { console.log("BEFUNDE:\n" + befunde.map((b) => "  - " + b).join("\n")); process.exit(1); }
console.log("== KARTEN SAUBER ==");
