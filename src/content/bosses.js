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
  ({ id, nameDe, nameEn, art, accent, hp, atk, moveSpec, abilities: extra.abilities || [], aura: extra.aura || null, hintDe: extra.hintDe, hintEn: extra.hintEn });

/* ── DIE GABEN DER BESTIEN (v0.38) ────────────────────────────────────────
 * Jedes Wesen traegt seit v0.38 die Gabe seiner FAMILIE - dieselben Regeln,
 * die auch der Hof kennt, von der Engine fuer jede Figur ausgespielt:
 *   golem   -> bulwark   (Stein schluckt den ersten Punkt jedes Schlags)
 *   beast   -> regen     (wildes Fleisch heilt einen Punkt je Zug)
 *   serpent -> lifesteal (Gift trinkt die Haelfte des Schadens als Leben)
 *   wraith  -> teleport  (Schemen blinzeln auf ein nahes leeres Feld)
 *   tyrant  -> je nach Rolle: Panzer oder Zaehigkeit, meist mit Aura
 * BALANCE-GEGENGEWICHTE: bulwark vervielfacht die effektiven HP gegen
 * schwache Angreifer (eff = hp * atk/(atk-1) bei atk>=2) - deshalb sinken
 * die Grund-HP der neuen Panzertraeger. Alle Werte sind ueber
 * messe_monster.mjs simuliert (Feldwirkung je Gabe, Grenzwerte je Kapitel).
 */
export const BOSSES = [
  B("b01", "Der Wächter",      "The Warden",      "golem",   "#8fb4ff", 9, 2, { slides: KING, range: 1 }, { abilities: ["bulwark"] }),  // 12->9: Panzer-Gegengewicht
  B("b02", "Springbock",       "Springbok",       "beast",   "#ffb454",  7, 3, { leaps: CAMEL }, { abilities: ["regen"] }),  // 9->7: heilt fortan
  B("b03", "Die Brutmutter",   "The Broodmother", "serpent", "#3ad98a",  7, 1, { slides: KING, range: 1, spawn: { max: 4 } }, { abilities: ["lifesteal"] }),  // atk 1: trinkt kaum
  B("b04", "Der Schleicher",   "The Prowler",     "wraith",  "#a78bfa",  8, 3, { slides: DIAG, range: 2, leaps: ORTHO }, { abilities: ["teleport"] }),
  B("b05", "Zebra",            "Zebra",           "beast",   "#ff8a4c",  8, 3, { leaps: ZEBRA }, { abilities: ["regen"] }),  // 9->8
  B("b06", "Das Bollwerk",     "The Bulwark",     "golem",   "#9aa5b7", 11, 2, { slides: DIAG, range: 1 }, { abilities: ["bulwark"] }),  // 18->11: Kapitel-I-Grenze (12 Schlaege atk-2)
  B("b07", "Der Geist",        "The Ghost",       "wraith",  "#7dd3fc",  6, 4, { leaps: RING2 }, { abilities: ["teleport"] }),  // Glaskanone, jetzt fluechtig
  B("b08", "Kanonier",         "Cannoneer",       "golem",   "#ffd166", 9, 4, { slides: ORTHO, range: 3 }, { aura: { type: "courtHp", n: 2 }, abilities: ["bulwark"] }),  // 10->9
  B("b09", "Skorpion",         "Scorpion",        "serpent", "#f472b6",  9, 4, { leaps: [...sym(2, 2), ...ORTHO] }, { abilities: ["lifesteal"] }),
  B("b10", "Doppelritter",     "Twin Knight",     "beast",   "#3d9bff", 11, 3, { leaps: [...KNIGHT, ...KING] }, { aura: { type: "wardAdj" }, abilities: ["regen"] }),
  B("b11", "Die Flüsterin",    "The Whisperer",   "wraith",  "#c4b5fd",  9, 2, { slides: KING, range: 1, spawn: { max: 2 } }, { abilities: ["teleport"] }),  // spawn 3->2: Blink + Brut kombinierte auf +19 Feldwirkung; HP-Senkung war wirkungslos (sie steht hinten), die Brut ist der Hebel
  B("b12", "Der Richter",      "The Judge",       "tyrant",  "#ffb454", 11, 3, { slides: KING, range: 2 }, { aura: { type: "noEnemyPotions" }, abilities: ["bulwark"] }),  // 12->11
  B("b13", "Brandstifter",     "Firestarter",     "serpent", "#ff4d5e",  7, 5, { slides: DIAG }, { abilities: ["lifesteal"] }),  // scharf, aber glas
  B("b14", "Der Koloss",       "The Colossus",    "golem",   "#94a3b8", 18, 3, { slides: ORTHO, range: 2, leaps: DIAG }, { aura: { type: "grant", id: "bulwark" } }),  // seine AURA ist die Gabe: Eigenpanzer + Panzer-Aura kaskadierte in der Sim (+77 Feldwirkung)
  B("b15", "Sturmkrähe",       "Stormcrow",       "beast",   "#38bdf8",  8, 4, { leaps: [...CAMEL, ...sym(0, 3)] }, { abilities: ["regen"] }),
  B("b16", "Die Blutmagd",     "The Bloodmaid",   "serpent", "#fb7185", 10, 4, { slides: KING, range: 1, leaps: [[0, 2], [0, -2]] }, { aura: { type: "grant", id: "lifesteal" }, abilities: ["lifesteal"] }),
  B("b17", "Lanzenmeister",    "Lancemaster",     "tyrant",  "#eab308", 12, 3, { leaps: [...sym(0, 2), ...KING] }, { aura: { type: "wardAdj" }, abilities: ["regen"] }),  // der Feldherr haelt sich
  B("b18", "Eisenfaust",       "Ironfist",        "golem",   "#f97316", 11, 4, { slides: ORTHO }, { aura: { type: "courtAtk", n: 1 }, abilities: ["bulwark"] }),  // 13->11
  B("b19", "Schattenfürst",    "Shadowlord",      "wraith",  "#a78bfa",  9, 4, { slides: DIAG, leaps: KNIGHT }, { aura: { type: "courtAtk", n: 1 }, abilities: ["teleport"] }),
  B("b20", "Der Hüter",        "The Keeper",      "tyrant",  "#34d399", 16, 3, { slides: KING, range: 1, leaps: sym(0, 2) }, { aura: { type: "courtHp", n: 2 }, abilities: ["bulwark"] }),
  B("b21", "Die Wandlerin",    "The Shifter",     "wraith",  "#f0abfc",  8, 3, { leaps: RING2, spawn: { max: 2 } }, { abilities: ["teleport"] }),  // die Wandlerin wandelt
  B("b22", "Der Zerreißer",    "The Render",      "beast",   "#ef4444", 10, 5, { leaps: [...KNIGHT, ...CAMEL] }, { abilities: ["regen"] }),
  B("b23", "Asra, die Erzfeindin", "Asra, the Archenemy",   "tyrant",  "#fbbf24", 13, 4, { slides: KING, range: 3 }, { abilities: ["regen"] }),
  B("b24", "Seuchenkönig",     "Plaguelord",      "serpent", "#84cc16",  9, 2, { slides: KING, range: 1, spawn: { max: 5 } }, { abilities: ["lifesteal"] }),
  B("b25", "Osric, der Großmeister", "Osric, the Grandmaster", "tyrant", "#ffd166", 18, 5, { slides: KING, range: 4, leaps: KNIGHT }, { aura: { type: "courtHp", n: 1 }, abilities: ["bulwark"] }),
];

export const bossById = (id) => BOSSES.find((b) => b.id === id) || null;

/** The ten LEAGUE BOSSES — the finale of each league (I–X). Beating a league
 *  wins you its boss: he may then march for YOU, in place of the queen (one
 *  boss at most). Every league boss carries an AURA that bends the whole
 *  match, not just his square. */
// v0.38.1: OSRIC GEHOERT ANS ENDE. Die Liste begann mit b25 - der
// Grossmeister stand als Finale von KAPITEL I, waehrend Kapitel XII mit
// Asra endete, die dort zusaetzlich als Station stand (Doppelung). Jetzt:
// aufsteigend, die Erzfeindin als vorletztes Finale, Osric EINMAL - im
// letzten Kapitel, in der letzten Festung.
export const LEAGUE_BOSSES = ["b12", "b10", "b02", "b19", "b20", "b16", "b17", "b18", "b08", "b14", "b23", "b25"];
export const leagueBossId = (league) => LEAGUE_BOSSES[(((league || 1) - 1) % 12)];
export const bossName = (b, en) => (en ? b.nameEn : b.nameDe);

/** Army-spec entry for a boss piece (drops into a back-rank slot). */
export function bossSpec(b) {
  return { kind: "X", level: 1, abilities: b.abilities || [], shield: 0,
    hp: b.hp, atk: b.atk, moveSpec: b.moveSpec, art: b.art, accent: b.accent,
    aura: b.aura || null, name: { de: b.nameDe, en: b.nameEn }, bossId: b.id };
}
