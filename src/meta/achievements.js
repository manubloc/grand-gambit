// Tiered achievements (inspired by blocscore): each tracks one stat across
// escalating thresholds, each tier worth skillpoints.
function tier(id, icon, nameDe, nameEn, stat, ns, pts) {
  return { id, icon, nameDe, nameEn, stat, tiers: ns.map((n, i) => ({ n, pts: pts[i] })) };
}

export const ACHIEVEMENTS = [
  tier("wins",        "🏆", "Siege",          "Wins",          "wins",              [5, 20, 60, 150, 400, 1000], [5, 10, 25, 50, 100, 200]),
  tier("checkmates",  "♚", "Schachmatt",     "Checkmates",    "checkmates",        [5, 25, 80, 220, 600],      [8, 15, 30, 60, 120]),
  tier("captures",    "⚔️", "Schlagzahl",     "Captures",      "captures",          [50, 250, 900, 2500, 7000], [5, 10, 20, 40, 80]),
  tier("promotions",  "♛", "Umwandlungen",   "Promotions",    "promotions",        [3, 12, 40, 120, 300],      [8, 15, 30, 60, 120]),
  tier("streak",      "🔥", "Siegesserie",    "Win streak",    "bestStreak",        [4, 7, 11, 16, 25],        [15, 25, 40, 70, 120]),
  tier("flawless",    "🛡️", "Dame gehalten",  "Queen kept",    "flawlessQueenWins", [3, 12, 35, 90],           [15, 30, 60, 120]),
  tier("fast",        "⏱️", "Blitzmatt",      "Fast wins",     "fastWins",          [3, 12, 35, 90],           [10, 20, 40, 80]),
  tier("games",       "🎯", "Partien",        "Games played",  "games",             [20, 80, 300, 900, 2500],   [5, 10, 20, 40, 80]),
  tier("stages",      "🗺️", "Weltenwanderer", "Wayfarer",      "stagesCleared",     [3, 9, 16, 23, 27],       [10, 20, 40, 80, 160]),
  tier("bosses",      "☠️", "Bosstöter",      "Boss slayer",   "bossKills",         [3, 8, 15, 21, 25],       [10, 25, 50, 100, 200]),
  tier("recruits",    "🤝", "Rekrutierer",    "Recruiter",     "recruits",          [2, 6, 10, 15, 18],        [10, 25, 50, 100, 200]),
  tier("upgrades",    "⚒️", "Schmiedekunst",  "Forgecraft",    "upgrades",          [3, 12, 35, 80, 180],       [8, 15, 30, 60, 120]),
  tier("xp",          "✨", "Legende",        "Legend",        "xpEarned",          [1500, 6000, 18000, 45000, 120000], [8, 15, 30, 60, 120]),
  tier("hpwins",      "♥️", "Lebenskämpfe",   "Vitality wins", "hpWins",            [5, 25, 90, 250],         [8, 15, 30, 60]),
];

/** Per-achievement progress + total skillpoints earned. */
/** Claiming: finished tiers must be COLLECTED. Each claim pays skill points
 *  (deeper tiers pay more) plus a purse of gold derived from the tier's weight. */
export const claimedTiers = (profile, achId) => (profile?.claims?.[achId]) || 0;
export function claimReward(item, tierIdx) {
  return { sp: tierIdx + 1, gold: Math.max(5, Math.round((item.ptsAt ? item.ptsAt[tierIdx] : 5) * 0.8)) };
}
export function claimableCount(profile) {
  const { items } = evaluate(profile?.stats || {});
  return items.reduce((a, it) => a + Math.max(0, it.done - claimedTiers(profile, it.id)), 0);
}
export function claimAchievement(profile, achId) {
  const { items } = evaluate(profile?.stats || {});
  const it = items.find((x) => x.id === achId);
  if (!it) return profile;
  const claimed = claimedTiers(profile, achId);
  if (claimed >= it.done) return profile;
  const r = claimReward(it, claimed);
  return { ...profile,
    sp: (profile.sp || 0) + r.sp,
    gold: (profile.gold || 0) + r.gold,
    claims: { ...(profile.claims || {}), [achId]: claimed + 1 } };
}

export function evaluate(stats) {
  let points = 0; const items = [];
  for (const a of ACHIEVEMENTS) {
    const val = stats?.[a.stat] || 0;
    let done = 0, earned = 0, nextN = null;
    for (const t of a.tiers) { if (val >= t.n) { done++; earned += t.pts; } else if (nextN === null) nextN = t.n; }
    points += earned;
    items.push({ id: a.id, icon: a.icon, nameDe: a.nameDe, nameEn: a.nameEn, val, done, total: a.tiers.length, earned, nextN, maxN: a.tiers[a.tiers.length - 1].n, ptsAt: a.tiers.map((t) => t.pts) });
  }
  return { points, items };
}

/** Set of "achievementId:tierIndex" completed — used to detect new unlocks. */
export function completedSet(stats) {
  const s = new Set();
  for (const a of ACHIEVEMENTS) {
    const v = stats?.[a.stat] || 0;
    a.tiers.forEach((t, i) => { if (v >= t.n) s.add(a.id + ":" + i); });
  }
  return s;
}
