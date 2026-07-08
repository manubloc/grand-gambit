import { reduce } from "../sim/reducer.js";

/**
 * Deterministically rebuild a match by replaying its command log from a starting
 * state. Powers: watch-a-replay, crash recovery, and server-side verification of
 * a client-submitted game. Returns the final state and the full event stream.
 */
export function replay(initialState, commands) {
  let state = initialState;
  const events = [];
  for (const command of commands) {
    const r = reduce(state, command);
    state = r.state;
    for (const e of r.events) events.push(e);
  }
  return { state, events };
}
