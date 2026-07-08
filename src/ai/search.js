import { other, legalMoves, applyMove, inCheck, findKing, WHITE, BLACK } from "../core/index.js";
import { evaluate, order, MATE } from "./evaluate.js";

// HP mode is won/lost by regicide, not by running out of moves.
function regicideScore(state, color) {
  if (state.rules !== "hp") return null;
  const myK = findKing(state.board, color, state.w);
  const opK = findKing(state.board, other(color), state.w);
  if (!opK) return MATE;
  if (!myK) return -MATE;
  return null;
}

/** Negamax + alpha-beta. Returns the score for `color` at the given depth. */
export function negamax(state, depth, alpha, beta, color) {
  const term = regicideScore(state, color);
  if (term !== null) return term;
  if (depth === 0) return evaluate(state, color);
  const moves = order(legalMoves(state, color));
  if (moves.length === 0) return state.rules === "hp" ? 0 : (inCheck(state, color) ? -MATE - depth : 0);
  let best = -Infinity;
  for (let i = 0; i < moves.length; i++) {
    const ns = applyMove(state, moves[i]);
    const v = -negamax(ns, depth - 1, -beta, -alpha, other(color));
    if (v > best) best = v;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}
