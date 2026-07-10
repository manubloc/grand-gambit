// Records — the numbers worth bragging about, tracked per save.
//   • fewest moves per stage (only improvements are kept)
//   • fastest full run through the league (first clear of the throne)
//   • total wins, for flavor
// All pure: the reducer feeds RECORD_STAGE events through recordStage().
import { CAMPAIGN } from "../content/index.js";
import { nodeInLeague } from "./campaign.js";

export function emptyRecords() {
  return { moves: {}, runStartAt: null, fastestRunMs: null, wins: 0 };
}

/** Apply one campaign victory: {id, moves, ms, now?}. */
export function recordStage(profile, { id, moves, now = Date.now() }) {
  const r = { ...(profile.records || emptyRecords()), moves: { ...(profile.records?.moves || {}) } };
  r.wins = (r.wins || 0) + 1;
  if (moves > 0 && (!r.moves[id] || moves < r.moves[id])) r.moves[id] = moves;
  // a fresh career starts the run clock with its very first victory
  const clearedBefore = profile.campaign?.cleared?.length || 0;
  if (r.runStartAt == null && clearedBefore === 0) r.runStartAt = now;
  // the throne falls → the run is complete (first time only)
  const throne = CAMPAIGN.find((n) => n.id === "n22");
  if (throne && id === "n22" && r.runStartAt != null && r.fastestRunMs == null) {
    r.fastestRunMs = Math.max(1000, now - r.runStartAt);
  }
  return { ...profile, records: r };
}

/** Sum of best move counts over the league's cleared core stages. */
export function totalBestMoves(profile) {
  const cleared = new Set(profile.campaign?.cleared || []);
  const league = profile.campaign?.league || 1;
  let sum = 0, n = 0;
  for (const node of CAMPAIGN) {
    if (!nodeInLeague(node, league) || !cleared.has(node.id)) continue;
    const best = profile.records?.moves?.[node.id];
    if (best) { sum += best; n++; }
  }
  return { sum, stages: n };
}

export const fmtMs = (ms) => {
  if (ms == null) return "–";
  const s = Math.round(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h} h ${String(m).padStart(2, "0")} min` : `${m} min ${String(s % 60).padStart(2, "0")} s`;
};
