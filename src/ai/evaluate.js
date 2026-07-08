import { VALUE, SHIELD_VALUE, FILES, RANKS, fileOf, rankOf } from "../core/index.js";

/** Static evaluation from `color`'s perspective. In HP mode a piece's worth
 *  scales with its remaining HP (so wounding the enemy king pulls the AI in). */
export function evaluate(state, color) {
  const hp = state.rules === "hp";
  let score = 0;
  const b = state.board;
  const W = state.w ?? FILES, H = state.h ?? RANKS;
  for (let i = 0; i < b.length; i++) {
    const p = b[i];
    if (!p) continue;
    let v = (VALUE[p.kind] || 0) + (p.hero ? 140 : 0);
    if (hp) v *= p.maxHp ? p.hp / p.maxHp : 1;
    else if (p.kind !== "K") v += p.shield * SHIELD_VALUE;
    const f = fileOf(i, W), r = rankOf(i, W);
    v += 10 - (Math.abs(f - (W - 1) / 2) + Math.abs(r - (H - 1) / 2)); // mild center pull
    score += p.color === color ? v : -v;
  }
  return score;
}

export const MATE = 100000;
export const captureValue = (m) => (m.capture ? VALUE[m.captureKind] || 0 : 0);
/** Search captures first → far better alpha-beta pruning. */
export const order = (moves) => moves.slice().sort((a, b) => captureValue(b) - captureValue(a));
