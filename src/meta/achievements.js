// Tiered achievements (inspired by blocscore): each tracks one stat across
// escalating thresholds, each tier worth skillpoints.
function tier(id, icon, nameDe, nameEn, stat, ns, pts, descDe = "", descEn = "") {
  return { id, icon, nameDe, nameEn, stat, descDe, descEn, tiers: ns.map((n, i) => ({ n, pts: pts[i] })) };
}

export const ACHIEVEMENTS = [
  tier("wins",        "🏆", "Siege",          "Wins",          "wins",              [5, 20, 60, 150, 400, 1000], [5, 10, 25, 50, 100, 200],
    "Gewonnene Partien — egal ob Kampagne, freies Spiel oder Duell.", "Games won — campaign, free play or duel alike."),
  tier("checkmates",  "♚", "Schachmatt",     "Checkmates",    "checkmates",        [5, 25, 80, 220, 600],      [8, 15, 30, 60, 120],
    "Siege durch echtes Schachmatt. Gibt der Gegner auf oder fällt sein König im Lebenskampf, zählt es hier nicht.", "Wins by true checkmate. A resignation, or a king felled in a life battle, does not count here."),
  tier("captures",    "⚔️", "Schlagzahl",     "Captures",      "captures",          [50, 250, 900, 2500, 7000], [5, 10, 20, 40, 80],
    "Gegnerische Figuren, die DU geschlagen hast — über alle Partien gezählt. Was der Gegner schlägt, zählt nicht.", "Enemy pieces YOU captured — tallied across all games. What the enemy takes does not count."),
  tier("promotions",  "♛", "Umwandlungen",   "Promotions",    "promotions",        [3, 12, 40, 120, 300],      [8, 15, 30, 60, 120],
    "Eigene Bauern, die die gegnerische Grundreihe erreicht und sich verwandelt haben.", "Your own pawns that reached the far rank and transformed."),
  tier("streak",      "🔥", "Siegesserie",    "Win streak",    "bestStreak",        [4, 7, 11, 16, 25],        [15, 25, 40, 70, 120],
    "Deine längste Kette von Siegen am Stück. Eine Niederlage setzt sie zurück, ein Remis ebenfalls.", "Your longest unbroken chain of wins. A loss resets it, and so does a draw."),
  tier("flawless",    "🛡️", "Dame gehalten",  "Queen kept",    "flawlessQueenWins", [3, 12, 35, 90],           [15, 30, 60, 120],
    "Gewonnene Partien, in denen deine Dame nie gefallen ist. Steht ein Meister auf ihrem Feld, zählt er als deine Dame.", "Wins in which your queen never fell. A master standing in her square counts as your queen."),
  tier("fast",        "⏱️", "Blitzmatt",      "Fast wins",     "fastWins",          [3, 12, 35, 90],           [10, 20, 40, 80],
    "Siege in höchstens 40 Halbzügen — beide Seiten zusammengezählt, also spätestens mit deinem 20. Zug. Aufgabe des Gegners zählt mit.", "Wins within 40 half-moves — both sides counted together, so by your 20th move at the latest. A resignation counts too."),
  tier("games",       "🎯", "Partien",        "Games played",  "games",             [20, 80, 300, 900, 2500],   [5, 10, 20, 40, 80],
    "Gespielte Partien insgesamt. Ausdauer ist auch eine Kunst.", "Total games played. Endurance is an art too."),
  tier("stages",      "🗺️", "Weltenwanderer", "Wayfarer",      "stagesCleared",     [3, 9, 16, 23, 27],       [10, 20, 40, 80, 160],
    "Erstmals gemeisterte Stationen der Kampagne — 51 warten insgesamt. Freundschaftskämpfe auf bereits geräumtem Boden zählen nicht erneut.", "Campaign stations mastered for the first time — 51 await in all. Friendly rematches on cleared ground do not count again."),
  tier("bosses",      "☠️", "Bosstöter",      "Boss slayer",   "bossKills",         [3, 8, 15, 21, 25],       [10, 25, 50, 100, 200],
    "Gewonnene Bosskämpfe — jede Station mit einem Champion oder Monster zählt einmal beim ersten Sieg.", "Boss fights won — every station with a champion or monster counts once, on the first victory."),
  tier("recruits",    "🤝", "Rekrutierer",    "Recruiter",     "recruits",          [2, 6, 10, 15, 18],        [10, 25, 50, 100, 200],
    "Figuren, die deinem Hofstaat beigetreten sind — erkämpft oder mit Gold bestochen.", "Pieces that joined your court — won in battle or bought with gold."),
  tier("upgrades",    "⚒️", "Schmiedekunst",  "Forgecraft",    "upgrades",          [3, 12, 35, 80, 180],       [8, 15, 30, 60, 120],
    "Stufenaufstiege, die du im Hofstaat für Skillpunkte ✦ gekauft hast — eine je Aufstieg, gleich welche Figur.", "Level-ups bought in the court with skill points ✦ — one per step, whichever piece."),
  tier("xp",          "✨", "Legende",        "Legend",        "xpEarned",          [1500, 6000, 18000, 45000, 120000], [8, 15, 30, 60, 120],
    "Erfahrung aus der Kampagne, über den ganzen Spielstand gezählt — sie steigt mit jeder gemeisterten Station und bringt dir Skillpunkte ein.", "Campaign experience across the whole save — it grows with every station you master and pays out skill points."),
  tier("hpwins",      "♥️", "Lebenskämpfe",   "Vitality wins", "hpWins",            [5, 25, 90, 250],         [8, 15, 30, 60],
    "Gewonnene Lebenskämpfe — die Partien mit blauer Kampfkraft und roten Lebenspunkten.", "Life battles won — the matches with blue attack strength and red life points."),
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
    // tiers + descriptions travel WITH the item: the treasury accordion maps
    // over it.tiers - omitting them here crashed the screen on first tap.
    items.push({ id: a.id, icon: a.icon, nameDe: a.nameDe, nameEn: a.nameEn, descDe: a.descDe, descEn: a.descEn,
      tiers: a.tiers, val, done, total: a.tiers.length, earned, nextN, maxN: a.tiers[a.tiers.length - 1].n, ptsAt: a.tiers.map((t) => t.pts) });
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
