/**
 * Events are the simulation's OUTPUT stream. The reducer emits them on every
 * command so that outer layers can react without re-deriving game logic:
 *   - the UI plays animations / sounds,
 *   - the meta layer tallies a match (event sourcing),
 *   - analytics / netcode can stream them.
 * Events are plain, serializable objects.
 */
export const EVENT = {
  MOVED: "moved",
  CAPTURED: "captured",
  DAMAGED: "damaged",
  SHIELD_ABSORBED: "shieldAbsorbed",
  PROMOTED: "promoted",
  CHECK: "check",
  GAME_OVER: "gameOver",
};

export const Ev = {
  healed: (color, kind, at, hp) => ({ type: "healed", color, kind, at, hp }),
  moved: (color, kind, from, to, special = null) => ({ type: EVENT.MOVED, color, kind, from, to, special }),
  // `by` captured a piece of `kind` at square `at`; `byKind` is the attacker's kind.
  captured: (by, byKind, kind, at) => ({ type: EVENT.CAPTURED, by, byKind, kind, at }),
  // `by` dealt `dmg` to a (`color`/`kind`) piece at `at`, leaving `hpAfter` HP.
  damaged: (by, color, kind, at, dmg, hpAfter) => ({ type: EVENT.DAMAGED, by, color, kind, at, dmg, hpAfter }),
  // a shielded piece (`color`/`kind`) at `at` absorbed a hit from `by`.
  shieldAbsorbed: (color, kind, at, by) => ({ type: EVENT.SHIELD_ABSORBED, color, kind, at, by }),
  promoted: (color, at, to) => ({ type: EVENT.PROMOTED, color, at, to }),
  check: (color) => ({ type: EVENT.CHECK, color }),
  gameOver: (result, winner) => ({ type: EVENT.GAME_OVER, result, winner }),
};
