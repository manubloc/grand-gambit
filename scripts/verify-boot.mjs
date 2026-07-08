// CI gate: boots the shipped single-file build in a spec-faithful DOM
// (opaque file:// origin — the harshest sandbox) and fails on any error
// or an empty root. Catches what SSR smoke structurally cannot:
// module-vs-classic script issues, storage crashes, effect-phase errors.
import { JSDOM, VirtualConsole } from "jsdom";
import { readFileSync } from "fs";
const errs = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => errs.push(e.message || String(e)));
const dom = new JSDOM(readFileSync("dist-single/index.html", "utf8"),
  { runScripts: "dangerously", url: "file:///gambit.html", pretendToBeVisual: true, virtualConsole: vc });
if (!dom.window.matchMedia) dom.window.matchMedia = (q) => ({ matches: false, media: q,
  addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
await new Promise((r) => setTimeout(r, 3800));
const len = dom.window.document.getElementById("root")?.innerHTML.length ?? 0;
if (errs.length || len < 1000) {
  console.error("BOOT FAILED — root:", len, errs.slice(0, 2).join(" | "));
  process.exit(1);
}
console.log("boot verified — root renders", len, "chars, zero errors");
