// ── @gambit/ai — opponent ────────────────────────────────────────────────────
// Depends only on @gambit/core. Returns a move (the app wraps it as a command).
export { chooseMove } from "./bot.js";
export { evaluate } from "./evaluate.js";
export { negamax } from "./search.js";
