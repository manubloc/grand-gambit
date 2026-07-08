// Gefolgewert — a single strength number for fair online matchmaking.
// It grows with everything that makes your side stronger: campaign progress
// (reach), recruited pieces (breadth) and purchased levels (depth). Two
// players within a narrow band of this score field comparably strong armies.
import { VALUE } from "../core/index.js";
import { CHARACTERS } from "../content/index.js";
import { clearedCount } from "./campaign.js";
import { unlockedCharacterIds } from "./leveling.js";

export function retinueScore(profile) {
  const reach = 100 * clearedCount(profile);
  let breadth = 0;
  for (const id of unlockedCharacterIds(profile)) {
    const ch = CHARACTERS[id];
    if (ch) breadth += Math.round(Math.min(VALUE[ch.kind] || 100, 1000) / 20); // cap: the king is priceless, not 20k points
  }
  let depth = 0;
  const levels = profile?.pieces?.levels || {};
  for (const l of Object.values(levels)) depth += 40 * Math.max(0, (l || 1) - 1);
  const league = 200 * (((profile?.campaign?.league) || 1) - 1);
  let stars = 0;
  for (const d of Object.values(profile?.campaign?.dupes || {})) stars += 30 * (d || 0);
  let arts = 0;
  for (const list of Object.values(profile?.pieces?.abilities || {})) arts += 15 * (list?.length || 0);
  return reach + breadth + depth + league + stars + arts;
}

/** Matchmaking band: starts tight, widens the longer someone waits. */
export const scoreBand = (waitedMs) => 150 + Math.floor(waitedMs / 5000) * 60;
