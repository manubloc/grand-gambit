import { KIND } from "../core/index.js";

// Each character is a "card". `ladder` lists the reward at each level (>=2);
// level 1 is the base. A reward is { shield:+n } and/or { ability:"id" }.
// More powerful pieces get more abilities (pawn 4 … queen 10).
export const CHARACTERS = {
  pawn: {
    id: "pawn", kind: KIND.PAWN, glyph: "♟", nameDe: "Bauer", nameEn: "Pawn",
    unlock: { type: "start" }, flank: false,
    ladder: [
      { level: 2, shield: 1 },
      { level: 3, ability: "pawn_sidestep" },
      { level: 4, shield: 1 },
      { level: 5, ability: "pawn_charge" },
      { level: 6, ability: "pawn_forward_capture" },
      { level: 7, shield: 1 },
      { level: 8, ability: "pawn_early_promo" },
    ],
  },
  gambit: {
    id: "gambit", kind: KIND.PAWN, glyph: "♟", nameDe: "Grand Gambit", nameEn: "Grand Gambit",
    unlock: { type: "start" }, flank: false, epic: true, costValue: 380,
    // The pawn the whole tale is named after: raised to be offered — and to
    // walk further than anyone expects. Richer ladder than any common pawn.
    ladder: [
      { level: 2, shield: 1 },
      { level: 3, ability: "pawn_sidestep" },
      { level: 4, ability: "pawn_forward_capture" },
      { level: 5, ability: "pawn_charge" },
      { level: 6, ability: "teleport" },
      { level: 7, shield: 1 },
      { level: 8, ability: "gambit_masquerade" },
      { level: 9, ability: "pawn_early_promo" },
    ],
  },
  knight: {
    id: "knight", kind: KIND.KNIGHT, glyph: "♞", nameDe: "Springer", nameEn: "Knight",
    unlock: { type: "start" }, flank: true,
    ladder: [
      { level: 2, shield: 1 },
      { level: 3, ability: "knight_longleap" },
      { level: 4, shield: 1 },
      { level: 5, ability: "knight_outrider" },
      { level: 6, ability: "teleport" },
      { level: 7, shield: 1 },
      { level: 8, ability: "lifesteal" },
      { level: 9, ability: "bulwark" },
    ],
  },
  bishop: {
    id: "bishop", kind: KIND.BISHOP, glyph: "♝", nameDe: "Läufer", nameEn: "Bishop",
    unlock: { type: "start" }, flank: false,
    ladder: [
      { level: 2, shield: 1 },
      { level: 3, ability: "bishop_hop" },
      { level: 4, ability: "ranged_shot" },
      { level: 5, shield: 1 },
      { level: 6, ability: "bishop_ortho_step" },
      { level: 7, ability: "teleport" },
      { level: 8, ability: "regen" },
    ],
  },
  rook: {
    id: "rook", kind: KIND.ROOK, glyph: "♜", nameDe: "Turm", nameEn: "Rook",
    unlock: { type: "start" }, flank: false,
    ladder: [
      { level: 2, shield: 1 },
      { level: 3, ability: "rook_diag_step" },
      { level: 4, ability: "ranged_shot" },
      { level: 5, ability: "rook_breach" },
      { level: 6, ability: "bulwark" },
      { level: 7, ability: "ranged_volley" },
      { level: 8, shield: 1 },
      { level: 9, ability: "blast" },
    ],
  },
  queen: {
    id: "queen", kind: KIND.QUEEN, glyph: "♛", nameDe: "Dame", nameEn: "Queen",
    unlock: { type: "start" }, flank: false,
    ladder: [
      { level: 2, shield: 1 },
      { level: 3, ability: "queen_knightleap" },
      { level: 4, ability: "ranged_shot" },
      { level: 5, ability: "teleport" },
      { level: 6, ability: "lifesteal" },
      { level: 7, ability: "ranged_volley" },
      { level: 8, ability: "bulwark" },
      { level: 9, ability: "regen" },
      { level: 10, ability: "blast" },
      { level: 11, ability: "pull" },
      { level: 12, ability: "chain" },
    ],
  },
  king: {
    id: "king", kind: KIND.KING, glyph: "♚", nameDe: "König", nameEn: "King",
    unlock: { type: "start" }, flank: false,
    // Kings never get shields (keeps chess-mode check/mate logic clean).
    ladder: [
      { level: 2, ability: "king_dash" },
      { level: 3, ability: "teleport" },
      { level: 4, ability: "bulwark" },
      { level: 5, ability: "regen" },
    ],
  },
  archbishop: {
    id: "archbishop", kind: KIND.ARCHBISHOP, glyph: null, nameDe: "Erzbischof", nameEn: "Archbishop",
    unlock: { type: "boss" }, flank: true,
    ladder: [
      { level: 2, shield: 1 },
      { level: 3, ability: "bishop_hop" },
      { level: 4, ability: "ranged_shot" },
      { level: 5, ability: "bishop_ortho_step" },
      { level: 6, ability: "teleport" },
      { level: 7, ability: "lifesteal" },
      { level: 8, ability: "regen" },
      { level: 9, ability: "blast" },
    ],
  },
  chancellor: {
    id: "chancellor", kind: KIND.CHANCELLOR, glyph: null, nameDe: "Kanzler", nameEn: "Chancellor",
    unlock: { type: "boss" }, flank: true,
    ladder: [
      { level: 2, shield: 1 },
      { level: 3, ability: "rook_diag_step" },
      { level: 4, ability: "ranged_shot" },
      { level: 5, ability: "rook_breach" },
      { level: 6, ability: "ranged_volley" },
      { level: 7, ability: "bulwark" },
      { level: 8, ability: "pull" },
      { level: 9, ability: "blast" },
    ],
  },
  hawk: {
    id: "hawk", kind: KIND.HAWK, glyph: null, nameDe: "Späher", nameEn: "Hawk",
    unlock: { type: "boss" }, flank: true,
    ladder: [
      { level: 2, shield: 1 },
      { level: 3, ability: "teleport" },
      { level: 4, ability: "ranged_shot" },
      { level: 5, ability: "knight_outrider" },
      { level: 6, ability: "lifesteal" },
      { level: 7, ability: "bulwark" },
    ],
  },
  amazon: {
    id: "amazon", kind: KIND.AMAZON, glyph: null, nameDe: "Amazone", nameEn: "Amazon",
    unlock: { type: "boss" }, flank: true,
    ladder: [
      { level: 2, shield: 1 },
      { level: 3, ability: "queen_knightleap" },
      { level: 4, ability: "ranged_shot" },
      { level: 5, ability: "teleport" },
      { level: 6, ability: "lifesteal" },
      { level: 7, ability: "ranged_volley" },
      { level: 8, ability: "bulwark" },
      { level: 9, ability: "regen" },
      { level: 10, ability: "blast" },
      { level: 11, ability: "pull" },
    ],
  },

  // ── Boss-unlocked specialists (movement is data-driven via moveSpec) ────────
  captain: {
    id: "captain", kind: KIND.CAPTAIN, glyph: "⚓", nameDe: "Kapitän", nameEn: "Captain",
    unlock: { type: "boss" }, flank: true,
    // Sea legs: strides three straight, steps one diagonal — and can hook foes in.
    moveSpec: { slides: [[1,0],[-1,0],[0,1],[0,-1]], range: 3, leaps: [[1,1],[1,-1],[-1,1],[-1,-1]] },
    ladder: [
      { level: 2, shield: 1 },
      { level: 4, ability: "pull" },
      { level: 6, ability: "ranged_volley" },
      { level: 8, shield: 1 },
      { level: 9, ability: "blast" },
    ],
  },
  assassin: {
    id: "assassin", kind: KIND.ASSASSIN, glyph: "🗡", nameDe: "Attentäter", nameEn: "Assassin",
    unlock: { type: "boss" }, flank: true,
    moveSpec: { leaps: [[1,1],[1,-1],[-1,1],[-1,-1],[2,2],[2,-2],[-2,2],[-2,-2]] },
    ladder: [
      { level: 2, shield: 1 },
      { level: 3, ability: "teleport" },
      { level: 6, ability: "lifesteal" },
      { level: 8, shield: 1 },
    ],
  },
  guardian: {
    id: "guardian", kind: KIND.GUARDIAN, glyph: "🛡", nameDe: "Schildträger", nameEn: "Guardian",
    unlock: { type: "boss" }, flank: true,
    moveSpec: { slides: [[1,0],[-1,0],[0,1],[0,-1]], range: 2 },
    ladder: [
      { level: 3, ability: "bulwark" },
      { level: 5, shield: 1 },
      { level: 7, ability: "regen" },
      { level: 9, shield: 1 },
    ],
  },
  dragon: {
    id: "dragon", kind: KIND.DRAGON, glyph: "🐉", nameDe: "Drache", nameEn: "Dragon",
    unlock: { type: "boss" }, flank: true,
    moveSpec: { leaps: [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1],[2,2],[2,-2],[-2,2],[-2,-2]] },
    ladder: [
      { level: 2, shield: 1 },
      { level: 4, ability: "ranged_shot" },
      { level: 7, ability: "lifesteal" },
      { level: 9, ability: "ranged_volley" },
    ],
  },
  mage: {
    id: "mage", kind: KIND.MAGE, glyph: "✨", nameDe: "Magier", nameEn: "Mage",
    unlock: { type: "boss" }, flank: true,
    moveSpec: { slides: [[1,1],[1,-1],[-1,1],[-1,-1]], range: 2 },
    ladder: [
      { level: 3, ability: "ranged_shot" },
      { level: 5, shield: 1 },
      { level: 7, ability: "ranged_volley" },
      { level: 9, ability: "teleport" },
    ],
  },
  sorceress: {
    id: "sorceress", kind: KIND.SORCERESS, glyph: "🔮", nameDe: "Hexerin", nameEn: "Sorceress",
    unlock: { type: "boss" }, flank: true,
    moveSpec: { leaps: [[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[-2,-1],[2,-1],[-2,0],[2,0],[-2,1],[2,1],[-2,2],[-1,2],[0,2],[1,2],[2,2]] },
    ladder: [
      { level: 3, ability: "teleport" },
      { level: 5, shield: 1 },
      { level: 7, ability: "ranged_shot" },
      { level: 9, ability: "lifesteal" },
    ],
  },
  alchemist: {
    id: "alchemist", kind: KIND.ALCHEMIST, glyph: "⚗", nameDe: "Alchemist", nameEn: "Alchemist",
    unlock: { type: "boss" }, flank: true,
    moveSpec: { slides: [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]], range: 1, leaps: [[0,2],[0,-2],[2,0],[-2,0]] },
    ladder: [
      { level: 3, ability: "regen" },
      { level: 5, shield: 1 },
      { level: 7, ability: "lifesteal" },
      { level: 9, shield: 1 },
    ],
  },
  warlock: {
    id: "warlock", kind: KIND.WARLOCK, glyph: "🜏", nameDe: "Warlock", nameEn: "Warlock",
    unlock: { type: "boss" }, flank: true,
    moveSpec: { slides: [[1,1],[1,-1],[-1,1],[-1,-1]], range: 3 },
    ladder: [
      { level: 3, ability: "lifesteal" },
      { level: 5, ability: "ranged_shot" },
      { level: 7, shield: 1 },
      { level: 9, ability: "ranged_volley" },
    ],
  },
  paladin: {
    id: "paladin", kind: KIND.PALADIN, glyph: "⚔", nameDe: "Paladin", nameEn: "Paladin",
    unlock: { type: "boss" }, flank: true,
    moveSpec: { slides: [[1,0],[-1,0],[0,1],[0,-1]], range: 2, leaps: [[1,1],[1,-1],[-1,1],[-1,-1]] },
    ladder: [
      { level: 2, shield: 1 },
      { level: 4, ability: "bulwark" },
      { level: 7, ability: "regen" },
      { level: 9, shield: 1 },
    ],
  },
  inquisitor: {
    id: "inquisitor", kind: KIND.INQUISITOR, glyph: "✠", nameDe: "Inquisitor", nameEn: "Inquisitor",
    unlock: { type: "boss" }, flank: true,
    moveSpec: { slides: [[1,0],[-1,0],[0,1],[0,-1]], range: 3 },
    ladder: [
      { level: 3, ability: "ranged_shot" },
      { level: 5, shield: 1 },
      { level: 8, ability: "bulwark" },
    ],
  },
  bard: {
    id: "bard", kind: KIND.BARD, glyph: "🎵", nameDe: "Barde", nameEn: "Bard",
    unlock: { type: "boss" }, flank: true,
    moveSpec: { slides: [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]], range: 1, leaps: [[2,2],[2,-2],[-2,2],[-2,-2]] },
    ladder: [
      { level: 3, ability: "regen" },
      { level: 5, shield: 1 },
      { level: 7, ability: "bulwark" },
      { level: 9, ability: "teleport" },
    ],
  },
  engineer: {
    id: "engineer", kind: KIND.ENGINEER, glyph: "⚙", nameDe: "Techniker", nameEn: "Engineer",
    unlock: { type: "boss" }, flank: true,
    moveSpec: { leaps: [[0,2],[0,-2],[2,0],[-2,0],[2,2],[2,-2],[-2,2],[-2,-2]] },
    ladder: [
      { level: 3, ability: "ranged_shot" },
      { level: 5, shield: 1 },
      { level: 8, ability: "ranged_volley" },
    ],
  },
  standard: {
    id: "standard", kind: KIND.STANDARD, glyph: "🚩", nameDe: "Flaggenträger", nameEn: "Standard Bearer",
    unlock: { type: "boss" }, flank: true,
    moveSpec: { leaps: [[1,0],[-1,0],[0,1],[0,-1],[0,2],[0,-2],[2,0],[-2,0]] },
    ladder: [
      { level: 3, ability: "bulwark" },
      { level: 5, shield: 1 },
      { level: 8, ability: "regen" },
    ],
  },
  strategist: {
    id: "strategist", kind: KIND.STRATEGIST, glyph: "🧭", nameDe: "Stratege", nameEn: "Strategist",
    unlock: { type: "boss" }, flank: true,
    moveSpec: { slides: [[1,0],[-1,0],[0,1],[0,-1]], range: 2, leaps: [[2,2],[2,-2],[-2,2],[-2,-2]] },
    ladder: [
      { level: 3, ability: "teleport" },
      { level: 5, shield: 1 },
      { level: 8, ability: "ranged_shot" },
    ],
  },
  pathfinder: {
    id: "pathfinder", kind: KIND.PATHFINDER, glyph: "🧿", nameDe: "Kundschafter", nameEn: "Pathfinder",
    unlock: { type: "boss" }, flank: true,
    moveSpec: { leaps: [[1,3],[3,1],[-1,3],[-3,1],[1,-3],[3,-1],[-1,-3],[-3,-1]] },
    ladder: [
      { level: 3, ability: "regen" },
      { level: 5, shield: 1 },
      { level: 8, ability: "teleport" },
    ],
  },
};

export const CHARACTER_LIST = Object.values(CHARACTERS);
// Standard back-rank slots map a kind to its character id.
export const KIND_TO_CHAR = { P: "pawn", N: "knight", B: "bishop", R: "rook", Q: "queen", K: "king", A: "archbishop", C: "chancellor", H: "hawk", M: "amazon" };
