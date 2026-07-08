/**
 * PIN hashing adapter (web). Prefers PBKDF2/SHA-256 via Web Crypto. Some
 * contexts (notably opening a single-file build from file:// on certain mobile
 * browsers) don't expose crypto.subtle — there we degrade to a non-cryptographic
 * fallback so the optional PIN still works for local testing. Records are tagged
 * so verification always uses the matching scheme.
 */
const C = globalThis.crypto;
const subtle = C && C.subtle;
const ITER = 120000;
const enc = new TextEncoder();
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

function randomSaltBytes() {
  if (C && C.getRandomValues) return C.getRandomValues(new Uint8Array(16));
  const a = new Uint8Array(16);
  for (let i = 0; i < 16; i++) a[i] = (Math.random() * 256) | 0;
  return a;
}

async function deriveStrong(pin, saltBytes) {
  const key = await subtle.importKey("raw", enc.encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await subtle.deriveBits({ name: "PBKDF2", salt: saltBytes, iterations: ITER, hash: "SHA-256" }, key, 256);
  return b64(bits);
}

// Non-cryptographic fallback (FNV-1a). Marked weak; only used without SubtleCrypto.
function deriveWeak(pin, saltStr) {
  let h = 2166136261 >>> 0;
  const s = saltStr + "|" + pin;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return ("0000000" + h.toString(16)).slice(-8);
}

export async function hashPin(pin) {
  const salt = randomSaltBytes();
  const saltStr = b64(salt);
  if (subtle) return { salt: saltStr, hash: await deriveStrong(pin, salt) };
  return { salt: saltStr, hash: deriveWeak(pin, saltStr), weak: true };
}

export async function verifyPin(pin, record) {
  if (!record) return true; // no PIN set
  try {
    if (record.weak) return deriveWeak(pin, record.salt) === record.hash;
    if (subtle) return (await deriveStrong(pin, fromB64(record.salt))) === record.hash;
    return false; // strong record but no SubtleCrypto here
  } catch { return false; }
}
