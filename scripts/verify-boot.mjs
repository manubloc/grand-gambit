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
/* DAS TOR MUSS SICH AUCH SCHLIESSEN. Der Lauf meldete gruen und lief dann
   ewig weiter: jsdom haelt mit pretendToBeVisual einen Bildtaktgeber und die
   Zeitgeber der Anwendung offen, und Node beendet sich nicht, solange ein
   Zeitgeber laeuft. Ein CI-Tor, das nie zurueckkommt, ist ein haengender Bau
   - jede Sitzung musste es bisher in ein timeout wickeln und den Ausgang aus
   dem Text lesen, statt ihn am Rueckgabewert abzulesen.
   window.close() nimmt jsdom seine Taktgeber, exit(0) macht den Erfolg zur
   Zahl. Der Fehlerweg oben endete schon immer sauber mit exit(1). */
dom.window.close();
process.exit(0);
