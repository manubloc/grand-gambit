import { FILES, NUM_SQUARES, fileOf, rankOf } from "./constants.js";

let _id = 1;
export const newId = () => _id++;

/**
 * A piece carries its character LEVEL, its unlocked ABILITIES (ids) and its
 * remaining SHIELD charges. `used` tracks one-shot abilities spent this game.
 * @param {{kind:string,color:string,level?:number,abilities?:string[],shield?:number}} spec
 */
export function makePiece(spec) {
  const spawn = spec.spawn ?? spec.moveSpec?.spawn; // budget may live on the moveSpec
  return {
    id: newId(),
    kind: spec.kind,
    color: spec.color,
    level: spec.level ?? 1,
    abilities: spec.abilities ? [...spec.abilities] : [],
    shield: spec.shield ?? 0,
    ...(spec.hero ? { hero: true } : {}),
    ...(spec.big ? { big: true } : {}),   // the 2x2 dragon
    used: {},
    hasMoved: false,
    // Optional extensions (bosses & special units) — copied verbatim when given.
    ...(spec.moveSpec ? { moveSpec: spec.moveSpec } : {}),
    ...(spec.aura ? { aura: spec.aura } : {}),
    ...(spec.bossId ? { bossId: spec.bossId } : {}),
    ...(spawn ? { spawnLeft: spawn.max ?? spawn } : {}),
    ...(spec.hp != null ? { baseHp: spec.hp } : {}),
    ...(spec.atk != null ? { baseAtk: spec.atk } : {}),
    ...(spec.art ? { art: spec.art } : {}),
    ...(spec.accent ? { accent: spec.accent } : {}),
    ...(spec.name ? { name: spec.name } : {}),
    ...(spec.bossId ? { bossId: spec.bossId } : {}),
  };
}

export const emptyBoard = (n = NUM_SQUARES) => new Array(n).fill(null);

export function clonePiece(p) {
  return p && { ...p, abilities: [...(p.abilities || [])], used: { ...(p.used || {}) } }; // wing markers travel lean
}
export function cloneBoard(board) {
  return board.map(clonePiece);
}

export function findKing(board, color, w = FILES) {
  for (let i = 0; i < board.length; i++) {
    const p = board[i];
    if (p && p.color === color && p.kind === "K") return { i, f: fileOf(i, w), r: rankOf(i, w) };
  }
  return null;
}
