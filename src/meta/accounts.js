// Accounts — the front door of the game.
//
// Two modes, one API:
//   • LOCAL (always available, offline-first): accounts live on this device,
//     passwords stored as salted SHA-256. Includes the built-in admin and the
//     one-tap guest. This is what runs today.
//   • CLOUD (activates itself when VITE_SUPABASE_URL/KEY are configured):
//     Supabase Auth takes over e-mail + Google sign-in; local mode remains the
//     fallback and the guest path. See cloudAuth.js.
//
// The built-in admin: email "admin", initial password "gambit-admin".
// Change it after first sign-in (Profile → account). Admin unlocks the
// progress controls on the save screen.
import { storage } from "../platform/index.js";

const KEY = "accounts:v1";
const SKEY = "session:v1";
export const ADMIN_EMAIL = "admin";
export const ADMIN_DEFAULT_PASS = "gambit-admin";

const rid = (n) => Array.from({ length: n }, () => "abcdefghjkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 31)]).join("");

export async function hashPass(pass, salt) {
  const data = new TextEncoder().encode(salt + "\u0000" + pass);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ── pure helpers (tested) ────────────────────────────────────────────────────
export const normEmail = (e) => String(e || "").trim().toLowerCase();
export const validEmail = (e) => e === ADMIN_EMAIL || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

export function findAccount(list, email) {
  const e = normEmail(email);
  return (list || []).find((a) => a.email === e) || null;
}

export async function mkAccount({ email, pass, name, provider = "local", isAdmin = false }) {
  const salt = rid(12);
  return {
    id: rid(8), email: normEmail(email), name: name || normEmail(email).split("@")[0],
    salt, passHash: pass != null ? await hashPass(pass, salt) : null,
    provider, isAdmin: !!isAdmin, createdAt: Date.now(),
  };
}

// ── stored list ──────────────────────────────────────────────────────────────
async function readList() {
  try { const r = await storage.get(KEY, false); if (r?.value) return JSON.parse(r.value); } catch {}
  return null;
}
async function writeList(list) { try { await storage.set(KEY, JSON.stringify(list), false); } catch {} }

/** Ensure the account list exists; seed the built-in admin exactly once. */
export async function ensureAccounts() {
  let list = await readList();
  if (!list) {
    list = [await mkAccount({ email: ADMIN_EMAIL, pass: ADMIN_DEFAULT_PASS, name: "Admin", isAdmin: true })];
    await writeList(list);
  }
  return list;
}

export async function register(email, pass, name) {
  const e = normEmail(email);
  if (!validEmail(e)) throw new Error("invalid-email");
  if (!pass || pass.length < 6) throw new Error("weak-pass");
  const list = await ensureAccounts();
  if (findAccount(list, e)) throw new Error("exists");
  const acc = await mkAccount({ email: e, pass, name });
  list.push(acc); await writeList(list);
  await setSession(acc.id);
  return acc;
}

export async function login(email, pass) {
  const list = await ensureAccounts();
  const acc = findAccount(list, email);
  if (!acc || acc.passHash == null) throw new Error("not-found");
  const h = await hashPass(pass || "", acc.salt);
  if (h !== acc.passHash) throw new Error("wrong-pass");
  await setSession(acc.id);
  return acc;
}

export async function loginGuest() {
  const list = await ensureAccounts();
  let acc = list.find((a) => a.provider === "guest");
  if (!acc) {
    acc = await mkAccount({ email: "gast@" + rid(6) + ".local", pass: null, name: "Gast", provider: "guest" });
    list.push(acc); await writeList(list);
  }
  await setSession(acc.id);
  return acc;
}

/** Mirror a cloud (Supabase) identity into the local account list. */
export async function upsertCloudAccount({ email, name, provider, isAdmin }) {
  const list = await ensureAccounts();
  let acc = findAccount(list, email);
  if (!acc) { acc = await mkAccount({ email, pass: null, name, provider }); list.push(acc); }
  acc.provider = provider; acc.isAdmin = acc.isAdmin || !!isAdmin;
  await writeList(list); await setSession(acc.id);
  return acc;
}

export async function changePassword(accountId, oldPass, newPass) {
  if (!newPass || newPass.length < 6) throw new Error("weak-pass");
  const list = await ensureAccounts();
  const acc = list.find((a) => a.id === accountId);
  if (!acc) throw new Error("not-found");
  if (acc.passHash != null && (await hashPass(oldPass || "", acc.salt)) !== acc.passHash) throw new Error("wrong-pass");
  acc.passHash = await hashPass(newPass, acc.salt);
  acc.mustChangePass = false;
  await writeList(list);
  return acc;
}

/** True while the admin still uses the shipped default password. */
export async function adminHasDefaultPass() {
  const list = await ensureAccounts();
  const adm = findAccount(list, ADMIN_EMAIL);
  if (!adm) return false;
  return (await hashPass(ADMIN_DEFAULT_PASS, adm.salt)) === adm.passHash;
}

// ── session ──────────────────────────────────────────────────────────────────
export async function setSession(accountId) { try { await storage.set(SKEY, JSON.stringify({ accountId, at: Date.now() }), false); } catch {} }
export async function clearSession() { try { await storage.delete(SKEY, false); } catch {} }
export async function currentAccount() {
  try {
    const r = await storage.get(SKEY, false);
    if (!r?.value) return null;
    const { accountId } = JSON.parse(r.value);
    const list = await ensureAccounts();
    return list.find((a) => a.id === accountId) || null;
  } catch { return null; }
}
