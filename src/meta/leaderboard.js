// Leaderboards — compare your realm with everyone else's.
//
// Boards live in the SHARED storage layer (`lb:<board>` keys). Without a
// configured backend that layer is device-local, so you see your own entries;
// the moment Supabase is configured (SUPABASE-SETUP.md) the same code reads
// and writes one shared table and the boards go truly online. Submissions are
// explicit — nothing leaves the device until the player taps "share".
import { storage } from "../platform/index.js";

export const BOARDS = ["progress", "fastrun", "moves"];
export const LB_MAX = 50;

/** Pure: upsert an entry (one per uid), sort by the board's rule, cap. */
export function mergeBoard(board, list, entry) {
  const cur = (Array.isArray(list) ? list : []).filter((e) => e && e.uid !== entry.uid);
  cur.push({ ...entry, at: entry.at || Date.now() });
  const asc = board !== "progress";       // fastrun + moves: lower is better
  cur.sort((a, b) => {
    const d = asc ? a.value - b.value : b.value - a.value;
    return d || (a.at - b.at);            // ties: the earlier claim wins
  });
  return cur.slice(0, LB_MAX);
}

export async function fetchBoard(board) {
  try { const r = await storage.get("lb:" + board, true); if (r?.value) return JSON.parse(r.value); } catch {}
  return [];
}

export async function submitScore(board, entry) {
  const list = await fetchBoard(board);
  const next = mergeBoard(board, list, entry);
  try { await storage.set("lb:" + board, JSON.stringify(next), true); } catch {}
  return next;
}
