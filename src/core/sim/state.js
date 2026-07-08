import { createInitialState, defaultArmy, DEFAULT_MAP } from "../domain/setup.js";

/**
 * A GameState is the initial position plus two things that make the engine
 * future-proof:
 *   - `log`  : the ordered list of commands applied (enables replays + netcode).
 *   - `seed` : the RNG seed for this match (reproducible AI / deterministic sim).
 * The board/turn/captured/history/w/h/holes fields come from createInitialState.
 *
 * `opts` is either a numeric seed (back-compat) or { seed, map }.
 */
export function createGame(whiteArmy = defaultArmy(), blackArmy = defaultArmy(), opts) {
  let seed = (Date.now() >>> 0), map = DEFAULT_MAP, rules = "chess";
  if (typeof opts === "number") seed = opts;
  else if (opts && typeof opts === "object") {
    if (opts.seed != null) seed = opts.seed;
    if (opts.map) map = opts.map;
    if (opts.rules) rules = opts.rules;
  }
  const s = createInitialState(whiteArmy, blackArmy, map, rules);
  if (opts && typeof opts === "object" && opts.potions) s.potions = { w: opts.potions.w || 0, b: opts.potions.b || 0 };
  s.log = [];
  s.seed = seed >>> 0;
  return s;
}
