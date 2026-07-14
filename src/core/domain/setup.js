import { FILES, RANKS, WHITE, BLACK, KIND, idx, BASE_HP, BASE_ATK, SHIELD_HP } from "./constants.js";
import { familyOf, packBonus, circleRifts } from "../rules/families.js";
import { emptyBoard, makePiece } from "./board.js";

// Default 10-wide back rank. Indices 2 and 7 are the "flank" slots that new
// unlocked characters can occupy (knights by default).
export const DEFAULT_BACK_RANK = [
  KIND.ROOK, KIND.KNIGHT, KIND.KNIGHT, KIND.BISHOP, KIND.QUEEN,
  KIND.KING, KIND.BISHOP, KIND.KNIGHT, KIND.KNIGHT, KIND.ROOK,
];
export const FLANK_SLOTS = [2, 7];

/** A plain level-1 army (no abilities, no shields). Progression enriches this. */
export function defaultArmy() {
  return {
    back: DEFAULT_BACK_RANK.map((kind) => ({ kind, level: 1, abilities: [], shield: 0 })),
    pawn: { kind: KIND.PAWN, level: 1, abilities: [], shield: 0 },
  };
}

// Default map = the classic 10×10 GAMBIT board (back ranks at the edges).
export const DEFAULT_MAP = {
  w: FILES, h: RANKS, holes: [],
  back: { whiteBack: 0, blackBack: RANKS - 1, whitePawn: 1, blackPawn: RANKS - 2 },
};

function placeBack(board, rank, color, specs, w, holes) {
  for (let f = 0; f < w; f++) {
    const i = idx(f, rank, w);
    if (holes.has(i)) continue;
    board[i] = makePiece({ ...specs[f], color });
  }
}
function placePawns(board, rank, color, spec, w, holes, hero = null) {
  // hero: { col, spec } — ONE pawn of this side is the Grand Gambit: own spec
  // (level/abilities/shield) and a `hero` flag the renderer and AI can read.
  // If his chosen file is a hole, he steps to the nearest open square.
  let heroCol = -1;
  if (hero) {
    const open = [];
    for (let f = 0; f < w; f++) if (!holes.has(idx(f, rank, w))) open.push(f);
    if (open.length) heroCol = open.reduce((a, b) => Math.abs(b - hero.col) < Math.abs(a - hero.col) ? b : a);
  }
  for (let f = 0; f < w; f++) {
    const i = idx(f, rank, w);
    if (holes.has(i)) continue;
    board[i] = f === heroCol ? makePiece({ ...hero.spec, color, hero: true }) : makePiece({ ...spec, color });
  }
}

/**
 * Build the initial game state from two armies on a given map. Armies are fully
 * resolved specs (kind/level/abilities/shield); the back rank length must equal
 * the map width. The engine never reads progression rules.
 */
export function createInitialState(whiteArmy = defaultArmy(), blackArmy = defaultArmy(), map = DEFAULT_MAP, rules = "chess") {
  const w = map.w, h = map.h;
  const holes = new Set((map.holes || []).map(([f, r]) => idx(f, r, w)));
  const board = emptyBoard(w * h);
  placeBack(board, map.back.whiteBack, WHITE, whiteArmy.back, w, holes);
  placePawns(board, map.back.whitePawn, WHITE, whiteArmy.pawn, w, holes, whiteArmy.hero || null);
  placePawns(board, map.back.blackPawn, BLACK, blackArmy.pawn, w, holes, blackArmy.hero || null);
  placeBack(board, map.back.blackBack, BLACK, blackArmy.back, w, holes);

  // HP ruleset: give every piece hit points + attack power. A progression
  // "shield" charge folds into +max HP, so leveled pieces are simply tankier.
  const rifts = { w: 0, b: 0 };
  if (rules === "hp") {
    for (const p of board) {
      if (!p) continue;
      const lvl = p.level || 1;
      p.maxHp = (p.baseHp ?? (BASE_HP[p.kind] || 1)) + (lvl - 1) + (p.shield || 0) * SHIELD_HP;
      p.hp = p.maxHp;
      p.atk = (p.baseAtk ?? (BASE_ATK[p.kind] || 1)) + Math.floor((lvl - 1) / 2);
      p.shield = 0;
    }
    // ── family traits: kin that march together fight harder ──────────────────
    // the hunting pack toughens every fielded blade; the circle banks time rifts
    for (const color of ["w", "b"]) {
      const kin = { blades: 0, magic: 0, order: 0 };
      for (const p of board) if (p && p.color === color) { const f = familyOf(p); if (f) kin[f] += 1; }
      const bonus = packBonus(kin.blades);
      if (bonus > 0) for (const p of board) if (p && p.color === color && familyOf(p) === "blades") {
        p.maxHp += bonus; p.hp += bonus;
      }
      rifts[color] = circleRifts(kin.magic);
    }
  }

  return {
    board,
    w, h, holes,                // board geometry for this match (holes = blocked indices)
    rules,                      // "chess" (instant capture, checkmate) or "hp" (damage, regicide)
    turn: WHITE,
    potions: { w: 0, b: 0 },
    shifts: rifts,              // Time Rifts (magic circle): spend one to keep the turn after your next move
    shiftArmed: null,           // color that armed a rift for its upcoming move
    captured: { w: [], b: [] }, // piece kinds captured BY each color
    history: [],                // previous states, for undo
    lastMove: null,
    moveCount: 0,
  };
}
