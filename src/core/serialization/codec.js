/**
 * Snapshot (de)serialization for save games and online sync. We intentionally
 * DROP `history` (the undo stack of past states) — it is large and rebuildable.
 * Replays are reconstructed from the command `log` instead (see replay.js).
 */
const VERSION = 1;

export function encodeState(state) {
  return JSON.stringify({
    v: VERSION,
    board: state.board,
    w: state.w ?? 10, h: state.h ?? 10,
    holes: state.holes ? [...state.holes] : [],
    rules: state.rules ?? "chess",
    turn: state.turn,
    potions: state.potions || { w: 0, b: 0 },
    shifts: state.shifts || { w: 0, b: 0 },
    shiftArmed: state.shiftArmed ?? null,
    captured: state.captured,
    lastMove: state.lastMove,
    moveCount: state.moveCount,
    seed: state.seed ?? 0,
    log: state.log ?? [],
  });
}

export function decodeState(json) {
  const o = typeof json === "string" ? JSON.parse(json) : json;
  return {
    board: o.board,
    w: o.w ?? 10, h: o.h ?? 10,
    holes: new Set(o.holes || []),
    rules: o.rules ?? "chess",
    turn: o.turn,
    captured: o.captured || { w: [], b: [] },
    potions: o.potions || { w: 0, b: 0 },
    shifts: o.shifts || { w: 0, b: 0 },
    shiftArmed: o.shiftArmed ?? null,
    history: [], // fresh; undo starts over after a load
    lastMove: o.lastMove || null,
    moveCount: o.moveCount || 0,
    seed: o.seed || 0,
    log: o.log || [],
  };
}
