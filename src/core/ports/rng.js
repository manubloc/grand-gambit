/**
 * RNG PORT. The simulation/AI must never call Math.random directly — they take
 * an Rng so a match can be made fully deterministic (seed -> identical game),
 * which is what replays and server re-simulation rely on.
 *
 * An Rng is simply: { next(): number in [0,1), int(n): integer in [0,n) }.
 * `platform/` provides a crypto-seeded implementation; tests use a fixed seed.
 */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Build an Rng from a numeric seed. */
export function makeRng(seed = (Date.now() >>> 0)) {
  const next = mulberry32(seed >>> 0);
  return { next, int: (n) => Math.floor(next() * n) };
}

/** Non-deterministic default (wraps Math.random) for casual local play. */
export const defaultRng = { next: Math.random, int: (n) => Math.floor(Math.random() * n) };
