import { other } from "../domain/constants.js";
import { findKing } from "../domain/board.js";
import { pseudoMoves } from "./moves.js";

/**
 * Is `sqIndex` attacked by `byColor`? We reuse move generation as the single
 * source of truth: any capture-capable move landing on the square is an attack.
 * (Shields don't prevent giving check — a shielded king never exists.)
 */
export function isSquareAttacked(state, sqIndex, byColor) {
  const moves = pseudoMoves(state, byColor);
  for (let i = 0; i < moves.length; i++) {
    const m = moves[i];
    if (m.to === sqIndex && m.capture) return true;
  }
  return false;
}

export function inCheck(state, color) {
  const k = findKing(state.board, color, state.w);
  if (!k) return false;
  return isSquareAttacked(state, k.i, other(color));
}
