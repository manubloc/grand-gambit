// LAYOUT TEST — the only suite that measures REAL geometry.
//
// SSR tests can prove what renders; they cannot prove where it lands. This one
// mounts the live match screen in headless Chromium at real device sizes and
// measures the board's distance to the top and bottom of the viewport. It
// exists because the board sat 437px below the sky and 47px above the floor
// for weeks while every other suite stayed green.
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const DIR = "/tmp/gg-layout";
await mkdir(DIR, { recursive: true });
execFileSync("npx", ["esbuild", "board_harness.jsx", "--bundle", "--jsx=automatic",
  `--outfile=${DIR}/app.js`, "--format=iife", "--loader:.jpg=dataurl", "--loader:.webp=dataurl",
  "--loader:.css=text", "--log-level=warning"], { stdio: "inherit" });
await writeFile(`${DIR}/index.html`,
  `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;height:100%;background:#0c111e;font-family:system-ui}#root{height:100%}</style><div id="root"></div><script src="app.js"></script>`);

const srv = createServer(async (req, res) => {
  const f = DIR + (req.url === "/" ? "/index.html" : req.url.split("?")[0]);
  try { const b = await readFile(f); res.writeHead(200, { "content-type": f.endsWith(".js") ? "text/javascript" : "text/html" }); res.end(b); }
  catch { res.writeHead(404); res.end(""); }
});
await new Promise((r) => srv.listen(0, r));
const port = srv.address().port;

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log("  ok  -", n); } else { fail++; console.log(" FAIL -", n); } };

const PROBE = `(() => {
  let b = null, best = 0;
  for (const el of document.querySelectorAll("div")) {
    const r = el.getBoundingClientRect();
    if (r.width < 120 || Math.abs(r.width - r.height) > 6 || el.children.length < 20) continue;
    if (r.width * r.height > best) { best = r.width * r.height; b = el; }
  }
  if (!b) return null;
  const r = b.getBoundingClientRect();
  return { above: Math.round(r.top), below: Math.round(innerHeight - r.bottom), size: Math.round(r.width),
    wide: Math.round(innerWidth - r.width) };
})()`;

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
for (const [w, h, name] of [[390, 844, "iPhone"], [360, 800, "Android"], [414, 896, "large phone"], [768, 1024, "tablet"]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const errs = []; page.on("pageerror", (e) => errs.push(String(e).slice(0, 100)));
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  const m = await page.evaluate(PROBE);
  ok(`${name} ${w}x${h}: the match screen renders a board`, !!m && m.size > 100);
  if (m) {
    const off = Math.abs(m.above - m.below);
    ok(`${name}: the board rests vertically centred (off by ${off}px)`, off <= 8);
    ok(`${name}: the board fills its width sensibly`, m.size > w * 0.8);
  }
  ok(`${name}: no script errors`, errs.length === 0 || console.log("     ", errs[0]));
  await page.close();
}

// ── THE REGISTER: captions, corner sigils, one hall ──────────────────────────
// Proven here rather than in SSR because the chronicle waits for its paintings
// before it draws a single tile. Three things were asked for and kept slipping:
// the house caption belongs UNDER the name, the tile's corner belongs to the
// piece's own vector figure, and the masters belong in one hall.
{
  execFileSync("npx", ["esbuild", "layout_harness.jsx", "--bundle", "--jsx=automatic",
    `--outfile=${DIR}/app.js`, "--format=iife", "--loader:.jpg=dataurl", "--loader:.webp=dataurl",
    "--loader:.css=text", "--log-level=error"], { stdio: "inherit" });
  const page = await browser.newPage({ viewport: { width: 430, height: 900 } });
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  const r = await page.evaluate(() => {
    const txt = document.body.innerText;
    // a tile = a box holding an <img> or <svg> and a name line
    const tiles = [...document.querySelectorAll("div")].filter((d) => {
      const b = d.getBoundingClientRect();
      return b.width > 60 && b.width < 190 && b.height > 70 && d.querySelector("svg,img");
    });
    let withSigil = 0, captionBelow = 0, captionRight = 0;
    for (const tl of tiles) {
      const box = tl.getBoundingClientRect();
      const svg = tl.querySelector(":scope > span > svg");
      if (svg) {
        const s = svg.getBoundingClientRect();
        if (s.top - box.top < box.height * 0.35 && box.right - s.right < box.width * 0.35) withSigil++;
      }
      const lines = [...tl.querySelectorAll("div")].filter((d) => d.children.length === 0 && d.innerText.trim());
      if (lines.length >= 2) {
        const a = lines[0].getBoundingClientRect(), b2 = lines[1].getBoundingClientRect();
        if (b2.top >= a.bottom - 1) captionBelow++; else captionRight++;
      }
    }
    return { tiles: tiles.length, withSigil, captionBelow, captionRight,
      masters: /MEISTER & GROSSMEISTER/i.test(txt),
      oldHeads: ["Golems", "Bestien", "Schlangen", "Schemen", "Tyrannen"].filter((h) => new RegExp("^" + h + "$", "m").test(txt)) };
  });
  ok(`the register draws its tiles (${r.tiles})`, r.tiles > 15);
  ok(`tiles carry a vector figure in the corner (${r.withSigil})`, r.withSigil > 10);
  ok(`captions sit UNDER the name, never beside it (${r.captionBelow} below / ${r.captionRight} beside)`, r.captionRight === 0 && r.captionBelow > 0);
  ok("the masters stand in one hall", r.masters);
  ok("the five family headings are gone", r.oldHeads.length === 0 || console.log("     ", r.oldHeads.join(", ")));
  await page.close();
}

await browser.close(); srv.close();
console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
