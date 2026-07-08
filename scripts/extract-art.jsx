// ONE-OFF: turns the in-code SVG art into editable asset files.
// Pieces → assets/pieces/<name>.svg   Scenery → assets/scenery/<name>.svg
// Colors that the game controls become CSS variables (style="fill:var(--fill)").
import { renderToStaticMarkup as R } from "react-dom/server";
import { mkdirSync, writeFileSync } from "fs";
import { _shapes, _bossShapes } from "../src/app/ui/board/PieceArt.jsx";
import { CHARACTERS } from "../src/content/index.js";
import * as MA from "../src/app/ui/mapArt.jsx";

mkdirSync("assets/pieces", { recursive: true });
mkdirSync("assets/scenery", { recursive: true });

// sentinel colors → css vars (as STYLE, because var() is illegal in attributes)
const VARMAP = {
  __F__: ["fill", "var(--fill, #c9a45c)"], __R__: ["stroke", "var(--rim, none)"],
  __A__: ["fill/stroke", "var(--accent, #e8c96a)"],
  __C1__: ["any", "var(--c1, #3f5540)"], __C2__: ["any", "var(--c2, #4c6247)"], __C3__: ["any", "var(--c3, #66805c)"],
  __CR__: ["any", "var(--crown, #6a7d4e)"], __HI__: ["any", "var(--hi, #87996a)"], __GC__: ["any", "var(--c, #a99b5e)"],
};
function attrsToStyle(markup) {
  return markup.replace(/<(path|circle|rect|ellipse|line|polyline|polygon)\b[^>]*?>/g, (tag) => {
    const adds = [];
    for (const [sent, [, cssVal]] of Object.entries(VARMAP)) {
      tag = tag.replace(new RegExp(`\\s(fill|stroke)="${sent}"`, "g"), (_, prop) => { adds.push(`${prop}:${cssVal}`); return ""; });
    }
    if (!adds.length) return tag;
    if (/style="/.test(tag)) return tag.replace(/style="([^"]*)"/, (_, s) => `style="${s};${adds.join(";")}"`);
    return tag.replace(/>$/, ` style="${adds.join(";")}">`);
  });
}
const strip = (m) => m.replace(/^<g[^>]*>/, "").replace(/<\/g>$/, "");
const rootAttr = (m, name) => (m.match(new RegExp(`^<g[^>]*\\b${name}="([^"]*)"`)) || [])[1];
const file = (dir, name, gg, viewBox, inner) =>
  writeFileSync(`assets/${dir}/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" data-gg="${gg}">\n${inner}\n</svg>\n`);

// ── pieces ──
const kindName = {};
for (const c of Object.values(CHARACTERS)) if (!kindName[c.kind] || c.epic) kindName[c.kind] = kindName[c.kind] || c.id;
for (const base of [["P","pawn"],["N","knight"],["B","bishop"],["R","rook"],["Q","queen"],["K","king"]]) kindName[base[0]] = base[1];
const kinds = [...new Set([...Object.values(CHARACTERS).map((c) => c.kind), "P","N","B","R","Q","K"])];
for (const k of kinds) {
  const inner = attrsToStyle(R(<g>{_shapes(k, "__F__", "__R__")}</g>)).replace(/^<g>|<\/g>$/g, "");
  file("pieces", kindName[k] || k.toLowerCase(), `piece:${k}`, "6 0 36 42", inner);
}
file("pieces", "_default", "piece:_default", "6 0 36 42",
  attrsToStyle(R(<g>{_shapes("?", "__F__", "__R__")}</g>)).replace(/^<g>|<\/g>$/g, ""));
for (const art of ["beast", "golem", "wraith", "serpent", "tyrant", "_default"]) {
  const inner = attrsToStyle(R(<g>{_bossShapes(art === "_default" ? "?" : art, "__F__", "__R__", "__A__")}</g>)).replace(/^<g>|<\/g>$/g, "");
  file("pieces", `boss-${art}`, `boss:${art}`, "6 4 36 40", inner);
}
// hero crest: hand-authored (per-element fallbacks match the old rim||x logic)
file("pieces", "_hero-crest", "crest", "6 -2 36 50", `  <path d="M24 0.6 L25.9 4.8 L24 3.9 L22.1 4.8 Z M20 2 L21.3 5.4 L19.2 5 Z M28 2 L26.7 5.4 L28.8 5 Z" style="fill:var(--rim, #f2d98c)" />
  <path d="M24 0.6 L25.9 4.8 L24 3.9 L22.1 4.8 Z" stroke-width="0.5" style="fill:var(--rim, #f2d98c);stroke:var(--detail, #7a5c26)" />
  <path d="M24 26.4 L25 29 L27.8 29.1 L25.6 30.8 L26.4 33.5 L24 31.9 L21.6 33.5 L22.4 30.8 L20.2 29.1 L23 29 Z" opacity=".9" style="fill:var(--rim, #ece5d2)" />
  <path d="M15.5 42.6 L32.5 42.6" stroke="#f2d98c" stroke-width="1.5" stroke-linecap="round" opacity=".95" />
  <path d="M14 45 L34 45" stroke="#f2d98c" stroke-width="1" stroke-linecap="round" stroke-dasharray="2.5 2.2" opacity=".8" />`);

// ── scenery ──
const VB = { pine:"-10 -4 20 34", leafy:"-13 -2 26 28", rock:"-10 -8 20 17", ridge:"-34 -20 68 38",
  cloud:"-18 -12 36 20", keep:"-24 -26 48 46", cottage:"-14 -20 28 34", mill:"-13 -24 26 44",
  bridge:"-15 -8 30 17", field:"-24 -12 48 24", boat:"-9 -11 18 13", birds:"-10 -7 24 10",
  mist:"-62 -8 124 20", wisp:"-7 -7 14 14", stonecircle:"-28 -6 56 18", crystal:"-10 -15 20 26",
  deadtree:"-9 -8 18 35", ruinarch:"-19 -15 38 32", cactus:"-8 -8 16 31", dune:"-26 -12 52 22",
  grass:"-5 -9 10 11", snowdrift:"-24 -8 48 16", palm:"-11 -19 32 44", wave:"-12 -6 24 9",
  isle:"-35 -15 70 32", lighthouse:"-17 -19 34 41" };
const SC = [
  ["pine", () => MA.Pine({ x: 0, y: 0, snow: false })], ["leafy", () => MA.Leafy({ x: 0, y: 0, crown: "__CR__", hi: "__HI__" })],
  ["rock", () => MA.Rock({ x: 0, y: 0 })], ["ridge", () => MA.RidgeCluster({ x: 0, y: 0, caps: true })],
  ["cloud", () => MA.Cloud({ x: 0, y: 0 })], ["keep", () => MA.Keep({ x: 0, y: 0, fill: "__F__" })],
  ["cottage", () => MA.Cottage({ x: 0, y: 0 })], ["mill", () => MA.Mill({ x: 0, y: 0 })],
  ["bridge", () => MA.Bridge({ x: 0, y: 0 })], ["field", () => MA.Field({ x: 0, y: 0 })],
  ["boat", () => MA.Boat({ x: 0, y: 0 })], ["birds", () => MA.Birds({ x: 0, y: 0 })],
  ["mist", () => MA.Mist({ x: 0, y: 0, o: 1 })], ["wisp", () => MA.Wisp({ x: 0, y: 0 })],
  ["stonecircle", () => MA.StoneCircle({ x: 0, y: 0 })], ["crystal", () => MA.Crystal({ x: 0, y: 0 })],
  ["deadtree", () => MA.DeadTree({ x: 0, y: 0 })], ["ruinarch", () => MA.RuinArch({ x: 0, y: 0 })],
  ["cactus", () => MA.Cactus({ x: 0, y: 0 })], ["dune", () => MA.Dune({ x: 0, y: 0 })],
  ["grass", () => MA.Grass({ x: 0, y: 0, c: "__GC__" })], ["snowdrift", () => MA.SnowDrift({ x: 0, y: 0 })],
  ["palm", () => MA.Palm({ x: 0, y: 0 })], ["wave", () => MA.Wave({ x: 0, y: 0 })],
  ["isle", () => MA.Isle({ x: 0, y: 0 })], ["lighthouse", () => MA.Lighthouse({ x: 0, y: 0 })],
];
// pine tone → vars (the three summer-green hexes are the sentinels)
const pineVars = (m) => m.replace(/#3f5540/g, "__C1__x").replace(/#4c6247/g, "__C2__x").replace(/#66805c/g, "__C3__x")
  .replace(/(fill|stroke)="__(C[123])__x"/g, (_, p, v) => `${p}="__${v}__"`);
for (const [name, gen] of SC) {
  let m = R(gen());
  if (name === "pine") m = pineVars(m);
  if (name === "ridge") m = m.replace(/<path([^>]*fill="#f2eee2"[^>]*)>/g, '<path$1 style="display:var(--caps, inline)">');
  const op = rootAttr(m, "opacity");
  let inner = strip(m);
  inner = attrsToStyle(inner);
  if (op && name !== "mist") inner = `<g opacity="${op}">${inner}</g>`;
  file("scenery", name, `scenery:${name}`, VB[name] || "-24 -24 48 48", inner);
}
// pine snow overlay = diff between snowy and bare pine
const bare = strip(R(MA.Pine({ x: 0, y: 0, snow: false })));
const snowy = strip(R(MA.Pine({ x: 0, y: 0, snow: true })));
file("scenery", "pine-snow", "scenery:pine-snow", VB.pine, snowy.replace(bare, ""));
console.log("extracted: pieces + boss + crest + " + (SC.length + 1) + " scenery files");
