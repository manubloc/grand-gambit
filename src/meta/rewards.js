import { spForXpJump, playerLevelForXp } from "./leveling.js";
import { completedSet } from "./achievements.js";

const XP = { win: 18, draw: 7, loss: 3, perCapture: 1, checkmate: 8, promotion: 5 };
const GOLD = { win: 2, draw: 1, loss: 0 };
/** Free-play purse per win, scaled by the difficulty you dared. */
export const winGold = (difficulty) => ({ easy: 4, normal: 7, hard: 11 }[difficulty] || 4);

/**
 * Apply a finished match to the profile. Pure: returns a new profile plus a
 * `gained` summary for the result banner.
 * @param {object} summary { result, captures, promotions, checkmate, lostQueen, moveCount, charXpGains }
 */
export function applyResult(profile, summary) {
  const p = structuredClone(profile);
  const levelBefore = playerLevelForXp(p.xpEarned || p.xp);

  const gain = (summary.result === "win" ? XP.win : summary.result === "draw" ? XP.draw : XP.loss)
    + (summary.captures || 0) * XP.perCapture
    + (summary.checkmate ? XP.checkmate : 0)
    + (summary.promotions || 0) * XP.promotion;
  const beforeXp = p.xpEarned || 0;
  p.xpEarned = (p.xpEarned || 0) + gain;

  p.charXp = p.charXp || {};
  for (const [id, xp] of Object.entries(summary.charXpGains || {})) p.charXp[id] = (p.charXp[id] || 0) + xp;

  const st = p.stats;
  st.games++;
  if (summary.result === "win") st.wins++; else if (summary.result === "loss") st.losses++; else st.draws++;
  st.captures += summary.captures || 0;
  st.promotions += summary.promotions || 0;
  if (summary.checkmate) st.checkmates++;
  if (summary.result === "win") { st.winStreak = (st.winStreak || 0) + 1; st.bestStreak = Math.max(st.bestStreak || 0, st.winStreak); }
  else st.winStreak = 0;
  if (summary.result === "win" && !summary.lostQueen) st.flawlessQueenWins = (st.flawlessQueenWins || 0) + 1;
  if (summary.result === "win" && (summary.moveCount || 999) <= 40) st.fastWins = (st.fastWins || 0) + 1;
  if (summary.result === "win" && summary.hpRules) st.hpWins = (st.hpWins || 0) + 1;
  st.xpEarned = p.xpEarned;
  const spGain = spForXpJump(beforeXp, p.xpEarned);
  p.sp = (p.sp || 0) + spGain;
  p.xp = p.xpEarned; // legacy mirror: XP is no longer spendable
  const goldGain = (GOLD[summary.result] || 0) + (summary.result === "win" ? (summary.gold || 0) : 0);
  p.gold = (p.gold || 0) + goldGain;
  if (summary.potionsUsed) {
    const items = { ...(p.items || {}) };
    items.potion = Math.max(0, (items.potion || 0) - summary.potionsUsed);
    p.items = items;
  }

  const before = completedSet(profile.stats), after = completedSet(st);
  const newAchievements = [...after].filter((k) => !before.has(k));

  return { profile: p, gained: { gold: goldGain, sp: spGain, xp: p.xp - profile.xp, levelBefore, levelAfter: playerLevelForXp(p.xpEarned), newAchievements } };
}
