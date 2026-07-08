// ── platform — web adapters (the "driven" side of the ports) ─────────────────
// Swappable per target: a native or server build would provide its own versions
// of these (storage, crypto, rng) while every layer above stays identical.
export { default as storage } from "./storage.web.js";
export { hashPin, verifyPin } from "./crypto.web.js";
export { makeWebRng } from "./rng.web.js";
