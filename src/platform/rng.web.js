import { makeRng } from "../core/index.js";

/**
 * Web implementation of the RNG port. Draws a strong seed from Web Crypto when
 * available, then returns a deterministic generator from it. The seed can be
 * stored alongside a match so it can be replayed exactly.
 */
export function makeWebRng() {
  const C = globalThis.crypto;
  let seed;
  if (C && C.getRandomValues) { const a = new Uint32Array(1); C.getRandomValues(a); seed = a[0]; }
  else seed = (Date.now() ^ (Math.random() * 0x100000000)) >>> 0;
  return makeRng(seed);
}
