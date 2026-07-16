// Save slots — one account, many careers.
//
// Layout in storage (device-local; mirrored to the shared backend for cloud
// accounts once Supabase is configured):
//   saves:<accountId>            → index [{id, name, createdAt, updatedAt,
//                                    playtimeSec, league, clearedCount, pct}]
//   save:<accountId>:<slotId>    → the full profile JSON
//
// Playtime is accumulated by the app shell in small ticks while the tab is
// visible and flushed here; progress numbers are derived on every write so
// the save screen never has to load full profiles to render the list.
import { storage } from "../platform/index.js";
import { defaultProfile } from "./profile.js";
import { clearedCount, campaignLength, nodeInLeague } from "./campaign.js";
import { CAMPAIGN } from "../content/index.js";

const IKEY = (acc) => `saves:${acc}`;
const SKEY = (acc, slot) => `save:${acc}:${slot}`;
const rid = (n) => Array.from({ length: n }, () => "abcdefghjkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 31)]).join("");

// ── pure: progress ───────────────────────────────────────────────────────────
export function progressPct(profile) {
  const total = campaignLength(profile) || 1;
  return Math.max(0, Math.min(100, Math.round((clearedCount(profile) / total) * 100)));
}

/** The league's sites in play order (x-axis rows are the journey east). */
export function leagueOrder(league = 1) {
  return CAMPAIGN.filter((n) => nodeInLeague(n, league))
    .slice().sort((a, b) => (a.row - b.row) || (a.col - b.col)).map((n) => n.id);
}

/**
 * Admin control: force a profile to a given progress percentage (0–100).
 * 0 wipes back to a fresh career (name/lang kept); 100 clears every site of
 * the league and unlocks generously; anything between clears the first k
 * sites in journey order with proportional purse.
 */
export function withProgressPct(profile, pct, league = 1) {
  const p = Math.max(0, Math.min(100, Math.round(pct)));
  const lg = Math.max(1, Math.round(league));
  const biome = ((lg - 1) % 10) + 1;
  const base = defaultProfile();
  const keep = { name: profile.name, lang: profile.lang, online: profile.online, notices: profile.notices, difficulty: profile.difficulty };
  // the Endless Sea (X) sits behind its toll: captain + boat travel along
  const seaKit = biome === 10 ? { unlocked: ["captain"], items: { boat: 1 } } : { unlocked: [], items: {} };
  if (p === 0) return { ...base, ...keep,
    items: { ...seaKit.items },
    campaign: { ...base.campaign, league: lg, unlocked: [...new Set([...(base.campaign?.unlocked || []), ...seaKit.unlocked])] } };
  const order = leagueOrder(lg);
  const k = Math.round((p / 100) * order.length);
  const cleared = order.slice(0, k);
  const bosses = CAMPAIGN.filter((n) => cleared.includes(n.id) && n.boss?.piece).map((n) => n.boss.piece);
  return {
    ...base, ...keep,
    gold: 90 * k + (lg - 1) * 300, sp: 3 * k + (lg - 1) * 10, xp: 130 * k * lg, xpEarned: 130 * k * lg,
    items: { potion: p === 100 ? 5 : Math.floor(k / 8), ...seaKit.items },
    campaign: { league: lg, cleared, unlocked: [...new Set([...bosses, ...seaKit.unlocked])], dupes: {} },
  };
}

// ── slot index ───────────────────────────────────────────────────────────────
async function readIndex(acc) {
  try { const r = await storage.get(IKEY(acc), false); if (r?.value) return JSON.parse(r.value); } catch {}
  return [];
}
async function writeIndex(acc, list) { try { await storage.set(IKEY(acc), JSON.stringify(list), false); } catch {} }

export function summarize(entry, profile, playtimeAdd = 0) {
  return {
    ...entry,
    updatedAt: Math.max(Date.now(), (entry.updatedAt || 0) + 1),  // strictly monotonic: newest-first stays stable
    playtimeSec: (entry.playtimeSec || 0) + playtimeAdd,
    league: profile.campaign?.league || 1,
    clearedCount: clearedCount(profile),
    total: campaignLength(profile),
    pct: progressPct(profile),
  };
}

export async function listSaves(acc) {
  const list = await readIndex(acc);
  return list.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export async function createSave(acc, name, profile = null) {
  const list = await readIndex(acc);
  const prof = profile || defaultProfile();
  const entry = summarize({ id: rid(8), name: name || "Spielstand " + (list.length + 1), createdAt: Date.now(), playtimeSec: 0 }, prof);
  entry.updatedAt = Math.max(entry.updatedAt, ...list.map((s) => (s.updatedAt || 0) + 1)); // a new slot always lands on top
  list.push(entry);
  await storage.set(SKEY(acc, entry.id), JSON.stringify(prof), false);
  await writeIndex(acc, list);
  return entry;
}

export async function loadSave(acc, slotId) {
  try { const r = await storage.get(SKEY(acc, slotId), false); if (r?.value) return JSON.parse(r.value); } catch {}
  return null;
}

export async function writeSave(acc, slotId, profile, playtimeAdd = 0) {
  const list = await readIndex(acc);
  const i = list.findIndex((s) => s.id === slotId);
  if (i < 0) return null;
  list[i] = summarize(list[i], profile, playtimeAdd);
  await storage.set(SKEY(acc, slotId), JSON.stringify(profile), false);
  await writeIndex(acc, list);
  return list[i];
}

export async function deleteSave(acc, slotId) {
  const list = (await readIndex(acc)).filter((s) => s.id !== slotId);
  await storage.delete(SKEY(acc, slotId), false);
  await writeIndex(acc, list);
}

export async function renameSave(acc, slotId, name) {
  const list = await readIndex(acc);
  const s = list.find((x) => x.id === slotId);
  if (s) { s.name = String(name || "").slice(0, 40) || s.name; await writeIndex(acc, list); }
}

// ── legacy migration: the single pre-account profile becomes slot #1 ─────────
const LEGACY = "profile";
const MIGRATED = "saves:migrated";
export async function migrateLegacyInto(acc) {
  try {
    const done = await storage.get(MIGRATED, false);
    if (done?.value) return null;
    const old = await storage.get(LEGACY, false);
    if (!old?.value) { await storage.set(MIGRATED, "1", false); return null; }
    const prof = JSON.parse(old.value);
    const entry = await createSave(acc, "Übernommener Spielstand", prof);
    await storage.set(MIGRATED, "1", false);
    return entry;
  } catch { return null; }
}

export const fmtPlaytime = (sec) => {
  const h = Math.floor((sec || 0) / 3600), m = Math.floor(((sec || 0) % 3600) / 60);
  return h > 0 ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min`;
};
