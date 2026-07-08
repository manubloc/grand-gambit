// ── End bosses ────────────────────────────────────────────────────────────────
// Every boss brings ONE unique piece (kind "X") whose movement the player does
// NOT know in advance — it must be observed. Movement is data-driven via a
// `moveSpec` the engine executes: `leaps` (single jumps), `slides` (rays with
// optional `range`), and `spawn` (create a pawn on an empty adjacent square
// while charges last). Stats trade off for balance: huge HP with tiny reach,
// glass cannons, summoners with almost no HP, and everything between.
// Bosses replace the enemy QUEEN slot, so their side never has queen + boss.

// Symmetric offset helpers.
const sym = (a, b) => { // all sign/swap combinations of (a,b), deduped
  const out = new Set();
  for (const [x, y] of [[a, b], [b, a]])
    for (const sx of [1, -1]) for (const sy of [1, -1]) out.add(`${x * sx},${y * sy}`);
  return [...out].map((s) => s.split(",").map(Number)).filter(([x, y]) => !(x === 0 && y === 0));
};
const ORTHO = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const DIAG = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const KING = [...ORTHO, ...DIAG];
const KNIGHT = sym(1, 2);
const CAMEL = sym(1, 3);
const ZEBRA = sym(2, 3);
const RING2 = (() => { const o = []; for (let f = -2; f <= 2; f++) for (let r = -2; r <= 2; r++) if (Math.max(Math.abs(f), Math.abs(r)) === 2) o.push([f, r]); return o; })();

const B = (id, nameDe, nameEn, art, accent, hp, atk, moveSpec, extra = {}) =>
  ({ id, nameDe, nameEn, art, accent, hp, atk, moveSpec, abilities: extra.abilities || [], hintDe: extra.hintDe, hintEn: extra.hintEn });

export const BOSSES = [
  B("b01", "Der Wächter",      "The Warden",      "golem",   "#8fb4ff", 12, 2, { slides: KING, range: 1 }),
  B("b02", "Springbock",       "Springbok",       "beast",   "#ffb454",  9, 3, { leaps: CAMEL }),
  B("b03", "Die Brutmutter",   "The Broodmother", "serpent", "#3ad98a",  7, 1, { slides: KING, range: 1, spawn: { max: 4 } }),
  B("b04", "Der Schleicher",   "The Prowler",     "wraith",  "#a78bfa",  8, 3, { slides: DIAG, range: 2, leaps: ORTHO }),
  B("b05", "Zebra",            "Zebra",           "beast",   "#ff8a4c",  9, 3, { leaps: ZEBRA }),
  B("b06", "Das Bollwerk",     "The Bulwark",     "golem",   "#9aa5b7", 18, 2, { slides: DIAG, range: 1 }),
  B("b07", "Der Geist",        "The Ghost",       "wraith",  "#7dd3fc",  6, 4, { leaps: RING2 }),
  B("b08", "Kanonier",         "Cannoneer",       "golem",   "#ffd166", 10, 4, { slides: ORTHO, range: 3 }),
  B("b09", "Skorpion",         "Scorpion",        "serpent", "#f472b6",  9, 4, { leaps: [...sym(2, 2), ...ORTHO] }),
  B("b10", "Doppelritter",     "Twin Knight",     "beast",   "#3d9bff", 11, 3, { leaps: [...KNIGHT, ...KING] }),
  B("b11", "Die Flüsterin",    "The Whisperer",   "wraith",  "#c4b5fd",  9, 2, { slides: KING, range: 1, spawn: { max: 3 } }),
  B("b12", "Der Richter",      "The Judge",       "tyrant",  "#ffb454", 12, 3, { slides: KING, range: 2 }),
  B("b13", "Brandstifter",     "Firestarter",     "serpent", "#ff4d5e",  7, 5, { slides: DIAG }),
  B("b14", "Der Koloss",       "The Colossus",    "golem",   "#94a3b8", 20, 3, { slides: ORTHO, range: 2, leaps: DIAG }),
  B("b15", "Sturmkrähe",       "Stormcrow",       "beast",   "#38bdf8",  8, 4, { leaps: [...CAMEL, ...sym(0, 3)] }),
  B("b16", "Die Blutmagd",     "The Bloodmaid",   "serpent", "#fb7185", 10, 4, { slides: KING, range: 1, leaps: [[0, 2], [0, -2]] }, { abilities: ["lifesteal"] }),
  B("b17", "Lanzenmeister",    "Lancemaster",     "tyrant",  "#eab308", 12, 3, { leaps: [...sym(0, 2), ...KING] }),
  B("b18", "Eisenfaust",       "Ironfist",        "golem",   "#f97316", 13, 4, { slides: ORTHO }),
  B("b19", "Schattenfürst",    "Shadowlord",      "wraith",  "#a78bfa",  9, 4, { slides: DIAG, leaps: KNIGHT }),
  B("b20", "Der Hüter",        "The Keeper",      "tyrant",  "#34d399", 16, 3, { slides: KING, range: 1, leaps: sym(0, 2) }, { abilities: ["bulwark"] }),
  B("b21", "Die Wandlerin",    "The Shifter",     "wraith",  "#f0abfc",  8, 3, { leaps: RING2, spawn: { max: 2 } }),
  B("b22", "Der Zerreißer",    "The Render",      "beast",   "#ef4444", 10, 5, { leaps: [...KNIGHT, ...CAMEL] }),
  B("b23", "Die Erzfeindin",   "The Archenemy",   "tyrant",  "#fbbf24", 13, 4, { slides: KING, range: 3 }, { abilities: ["regen"] }),
  B("b24", "Seuchenkönig",     "Plaguelord",      "serpent", "#84cc16",  9, 2, { slides: KING, range: 1, spawn: { max: 5 } }, { abilities: ["lifesteal"] }),
  B("b25", "Der Ligameister",  "The League Master", "tyrant", "#ffd166", 18, 5, { slides: KING, range: 4, leaps: KNIGHT }, { abilities: ["bulwark"] }),
];

export const bossById = (id) => BOSSES.find((b) => b.id === id) || null;
export const bossName = (b, en) => (en ? b.nameEn : b.nameDe);

/** Army-spec entry for a boss piece (drops into a back-rank slot). */
export function bossSpec(b) {
  return { kind: "X", level: 1, abilities: b.abilities || [], shield: 0,
    hp: b.hp, atk: b.atk, moveSpec: b.moveSpec, art: b.art, accent: b.accent,
    name: { de: b.nameDe, en: b.nameEn }, bossId: b.id };
}
