import { other, legalMoves, applyMove, defaultRng } from "../core/index.js";
import { order } from "./evaluate.js";
import { negamax } from "./search.js";

/**
 * Pick a move for the side to move. `rng` is injected (a port) so the choice is
 * reproducible under a fixed seed — required for replays and online re-sim.
 * Slight randomness among near-equal moves keeps games from feeling robotic.
 */
export function chooseMove(state, depth = 2, rng = defaultRng) {
  const color = state.turn;
  const moves = order(legalMoves(state, color));
  if (moves.length === 0) return null;
  const scored = moves.map((m) => ({ m, v: -negamax(applyMove(state, m), depth - 1, -Infinity, Infinity, other(color)) }));
  const bestV = Math.max(...scored.map((s) => s.v));
  const pool = scored.filter((s) => s.v >= bestV - 12);
  return pool[rng.int(pool.length)].m;
}
