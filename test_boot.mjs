// Boots the REAL single-file build inside jsdom and fails on any runtime
// error — exactly what a phone browser would hit on opening gambit-handy.html.
import { readFileSync, existsSync } from "fs";
import { JSDOM } from "jsdom";

const path = "dist-single/index.html";
if (!existsSync(path)) { console.log("RESULT: 0 passed, 1 failed (no dist-single build)"); process.exit(1); }
let html = readFileSync(path, "utf8");
// jsdom does not execute type="module" scripts — the bundle is fully rolled
// up (no import/export statements), so demoting it to a classic script is safe.
// move the (demoted) bundle to the end of <body> so #root exists first
{
  const m = html.match(/<script type="module"[\s\S]*?<\/script>/);
  if (m) {
    html = html.replace(m[0], "");
    const tag = m[0].replace('<script type="module"', "<script");
    html = html.replace("</body>", tag + "</body>");
  }
}
// the rolled-up bundle may still reference import.meta (legal in real module
// scripts) — shim it for the classic-script demotion
html = html.replace(/import\.meta\.url/g, JSON.stringify("https://localhost/"));
html = html.replace(/import\.meta/g, '({ url: "https://localhost/" })');

const errors = [];
const dom = new JSDOM(html, {
  url: "https://localhost/",
  runScripts: "dangerously",
  pretendToBeVisual: true,
  beforeParse(window) {
    window.matchMedia = window.matchMedia || ((q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
    window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
    window.cancelAnimationFrame = clearTimeout;
    window.scrollTo = () => {};
    window.addEventListener("error", (e) => errors.push("window.onerror: " + (e.message || "") + " | " + (e.error?.message || "") + "\n" + (e.error?.stack || "").split("\n").slice(0, 4).join("\n")));
    const ce = window.console.error.bind(window.console);
    window.console.error = (...a) => { errors.push("console.error: " + a.map((x) => (x && x.message) || String(x)).join(" ").slice(0, 500)); ce(...a); };
    window.addEventListener("unhandledrejection", (e) => errors.push("unhandledrejection: " + (e.reason?.stack || e.reason)));
  },
});

for (const ms of [800, 2000, 3500, 5200, 7000]) {
  await new Promise((res) => setTimeout(res, ms === 800 ? 800 : ms - [800,2000,3500,5200][([800,2000,3500,5200,7000].indexOf(ms))-1]));
  const tx = (dom.window.document.getElementById("root")?.textContent || "").slice(0, 60);
  console.log("  t=" + ms + "ms → " + JSON.stringify(tx));
}

let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => { if (cond) { pass++; console.log("  ok  - " + name); } else { fail++; console.log(" FAIL - " + name + (extra ? " → " + extra : "")); } };

ok("no runtime errors during boot", errors.length === 0, errors[0]?.slice(0, 400));
const root = dom.window.document.getElementById("root");
ok("react mounted content into #root", !!root && root.children.length > 0);
const text = root?.textContent || "";
ok("the shell rendered visible UI", text.length > 40, "text=" + JSON.stringify(text.slice(0, 80)));
console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
