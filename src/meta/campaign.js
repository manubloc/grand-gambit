// ── Campaign progression (meta) — BRANCHING GRAPH ────────────────────────────
// Progress lives on the profile as campaign: { cleared: [nodeIds], unlocked:
// [charIds] }. A node is AVAILABLE when any predecessor is cleared (the start
// node always is). Clearing a piece-boss node unlocks that piece — the only way
// to gain new pieces. XP is a spendable currency for upgrades (leveling.js).
import { CAMPAIGN, nodeById, difficultyById, mapById, bossById, bossSpec, CHARACTERS } from "../content/index.js";
import { buildArmyFromFormation, resolveCharacter, spForXpJump, isUnlocked } from "./leveling.js";
import { hasItem } from "../content/items.js";
import { BASE_HP, BASE_ATK } from "../core/index.js";

export const campaignLength = (profile = null) =>
  profile ? CAMPAIGN.filter((n) => nodeInLeague(n, profile.campaign?.league)).length : CAMPAIGN.length;
export const clearedIds = (profile) => profile?.campaign?.cleared || [];
export const clearedCount = (profile) => clearedIds(profile).length;

/** Progressive supply chest: an item shows up in the shop only once the
 *  journey has reached it — by league, and within its league by stages
 *  cleared. Before that it sits in the chest as a veiled mystery. */
export function itemRevealed(profile, item) {
  const lg = profile?.campaign?.league || 1;
  const min = item.minLeague || 1;
  if (lg > min) return true;
  if (lg < min) return false;
  return clearedCount(profile) >= (item.minCleared || 0);
}

// reverse edges, computed once
const PREDS = (() => {
  const m = {};
  for (const n of CAMPAIGN) for (const t of n.next) (m[t] = m[t] || []).push(n.id);
  return m;
})();
export const predsOf = (id) => PREDS[id] || [];

export const leagueNo = (league) => ((Math.max(1, league || 1) - 1) % 10) + 1;
/** League-bound sites (the combo paths) only exist in their own climate. */
export const nodeInLeague = (node, league) => !node.league || node.league === leagueNo(league);
/** Gates come as "item", { item, piece } or { gold } (a toll) — normalize. */
export const gateOf = (node) => !node?.gate ? null
  : typeof node.gate === "string" ? { item: node.gate, piece: null, gold: null }
  : { item: node.gate.item || null, piece: node.gate.piece || null, gold: node.gate.gold || null };
export const gateSatisfied = (profile, node) => {
  const g = gateOf(node);
  if (!g) return true;
  if (g.gold) return (profile?.campaign?.tolls || []).includes(node.id);
  if (!hasItem(profile, g.item)) return false;
  if (g.piece && !isUnlocked(CHARACTERS[g.piece], profile)) return false;
  return true;
};

/** Gold a stage pays on a FIRST clear — the deeper the road and the bigger
 *  the boss, the heavier the purse. End bosses simply carry more gold.
 *  Scales with the league; replays pay half (handled by the caller). */
export const stageGold = (node, league = 1) =>
  Math.round((5 + 2 * (node.row || 0) + (node.boss ? 6 : 0) + (node.boss?.pure ? 6 : 0) + (node.reward?.gold || 0)) * leagueRewardMult(league));

/** Tolls scale with the league — every climate has its own gatekeeper. */
export const tollCost = (node, league = 1) => {
  const g = gateOf(node);
  return g?.gold ? Math.round(g.gold * leagueRewardMult(league)) : 0;
};
/** Pay a toll gate: gold changes hands, the path opens (for this league). */
export function payToll(profile, id) {
  const node = nodeById(id);
  const g = gateOf(node);
  if (!g?.gold) return profile;
  const paid = profile.campaign?.tolls || [];
  if (paid.includes(id)) return profile;
  const cost = tollCost(node, profile.campaign?.league || 1);
  if ((profile.gold || 0) < cost) return profile;
  return { ...profile, gold: (profile.gold || 0) - cost,
    campaign: { ...(profile.campaign || {}), tolls: [...paid, id] } };
}

export function nodeStatus(profile, id) {
  const node = nodeById(id);
  if (!nodeInLeague(node, profile?.campaign?.league)) return "hidden";
  const cleared = new Set(clearedIds(profile));
  if (cleared.has(id)) return "cleared";
  const preds = predsOf(id);
  const reached = preds.length === 0 || preds.some((p) => cleared.has(p));
  if (!reached) return "locked";
  if (!gateSatisfied(profile, node)) return "gated"; // reachable, but the path wants its key (and companion)
  return "available";
}
/** The "front line": first available node in map order (for default selection). */
export function currentNodeId(profile) {
  for (const n of CAMPAIGN) if (nodeStatus(profile, n.id) === "available") return n.id;
  return CAMPAIGN[CAMPAIGN.length - 1].id;
}

/** Quick-play unlocks ride on campaign reach (available or cleared). */
const reachableUses = (profile, pred) =>
  CAMPAIGN.some((n) => pred(n) && ["available", "cleared", "gated"].includes(nodeStatus(profile, n.id)));
export const mapUnlocked = (profile, mapId) =>
  mapId === "classic" || reachableUses(profile, (n) => n.map === mapId);
export const hpUnlocked = (profile) => reachableUses(profile, (n) => n.rules === "hp");

// ── Boss construction ─────────────────────────────────────────────────────────
// Tier scales piece-boss stats: modest early, fearsome late — but bounded.
const HP_BOOST = [0, 5, 7, 9, 11];
const ATK_BOOST = [0, 0, 1, 1, 2];

/** The boss army-spec for a node: a unique monster or the BOSS VERSION of an
 *  unlockable piece (same movement — fighting it teaches you the piece). */
export function nodeBossSpec(node, league = 1) {
  if (!node.boss) return null;
  const override = node.id === "n22" ? leagueFinalBossPiece(league) : null;
  if (node.boss.pure && !override) return bossSpec(bossById(node.boss.pure));
  const ch = CHARACTERS[override || node.boss.piece];
  const tier = node.tier || 1;
  const { abilities } = resolveCharacter(ch, 1 + tier); // a taste of its ladder
  return {
    kind: ch.kind, level: 1, abilities, shield: 0,
    hp: (BASE_HP[ch.kind] || 3) + HP_BOOST[tier],
    atk: Math.min(6, (BASE_ATK[ch.kind] || 2) + ATK_BOOST[tier]),
    ...(ch.moveSpec ? { moveSpec: ch.moveSpec } : {}),
    name: { de: ch.nameDe, en: ch.nameEn }, bossId: "pb_" + ch.id, accent: "#c9a45c",
  };
}

/** Resolve a node id into a ready-to-play match spec. The boss replaces the
 *  enemy QUEEN slot (the king always stays on the board). */
export function buildStageMatch(id, profile = null) {
  const node = nodeById(id);
  const d = difficultyById(node.difficulty);
  const map = mapById(node.map);
  const base = map.classic ? () => 1 : (cid) => d.levels[cid] || 1;
  const formation = node.formation || map.defaultFormation;
  const aiArmy = buildArmyFromFormation((cid) => base(cid) + (node.bump || 0) + leagueBump(profile?.campaign?.league), formation);
  const lg = profile?.campaign?.league || 1;
  const boss0 = nodeBossSpec(node, lg);
  const boss = boss0 && lg > 1 ? { ...boss0, hp: boss0.hp + 2 * (lg - 1), atk: boss0.atk + (lg - 1) } : boss0;
  let bossInfo = null;
  if (boss) {
    let qi = formation.indexOf("queen");
    if (qi === -1) qi = Math.max(0, Math.floor(formation.length / 2) - 1);
    aiArmy.back = aiArmy.back.map((spec, j) => (j === qi ? boss : spec));
    bossInfo = { name: boss.name, bossId: boss.bossId, unlocks: bossPieceFor(node, lg),
      art: boss.art || null, accent: boss.accent, kind: boss.kind };
  }
  const recruitId = bossPieceFor(node, lg);
  const turncoat = !!(recruitId && profile && (profile.campaign?.unlocked || []).includes(recruitId));
  return {
    nodeId: id, node,
    map: node.map, rules: node.rules,
    boss: bossInfo,
    turncoat, excludeId: turncoat ? recruitId : null,
    depth: node.depth || d.depth,
    aiArmy,
    timer: stageTimer(node, lg),
    gold: stageGold(node, lg),
    firstClear: profile ? nodeStatus(profile, id) === "available" : true,
    reward: node.reward || { xp: 0 },
  };
}

/** Clearing an AVAILABLE node: grants bonus XP (spendable + lifetime) and, for
 *  piece bosses, unlocks that piece. Replays change nothing. */
export function advanceCampaign(profile, id) {
  if (nodeStatus(profile, id) !== "available") return profile;
  const node = nodeById(id);
  const league = profile.campaign?.league || 1;
  const mult = leagueRewardMult(league);
  const bonus = Math.round((node.reward?.xp || 0) * mult);
  // NOTE (v0.5): stage gold is granted through applyResult (visible in the
  // result banner) — advanceCampaign only handles progress, XP and recruits.
  const unlocked = new Set(profile.campaign?.unlocked || []);
  const dupes = { ...(profile.campaign?.dupes || {}) };
  const bossPiece = node.boss ? bossPieceFor(node, league) : null;
  if (bossPiece) {
    if (unlocked.has(bossPiece)) dupes[bossPiece] = Math.min(2, (dupes[bossPiece] || 0) + 1);
    else unlocked.add(bossPiece);
  }
  const stats = { ...(profile.stats || {}) };
  stats.stagesCleared = (stats.stagesCleared || 0) + 1;
  if (node.boss) stats.bossKills = (stats.bossKills || 0) + 1;
  if (bossPiece) stats.recruits = (stats.recruits || 0) + 1;
  const xpEarned = (profile.xpEarned || 0) + bonus;
  stats.xpEarned = xpEarned;
  const spGain = spForXpJump(profile.xpEarned || 0, xpEarned);
  let items = profile.items;
  if (node.grant === "potion") items = { ...(items || {}), potion: Math.min(3, ((items || {}).potion || 0) + 1) };
  const finished = id === "n22"; // the League Keep falls → next league begins
  if (finished) stats.leaguesWon = (stats.leaguesWon || 0) + 1;
  return {
    ...profile,
    items,
    xp: xpEarned,
    sp: (profile.sp || 0) + spGain,
    xpEarned,
    stats,
    campaign: finished
      ? { league: league + 1, cleared: [], unlocked: [...unlocked], dupes, tolls: [] }
      : { league, cleared: [...clearedIds(profile), id], unlocked: [...unlocked], dupes, tolls: profile.campaign?.tolls || [] },
  };
}

/** League-specific finale: the Desert league (IX) ends at the Captain, whose
 *  recruitment (plus a boat) is the only way onto the Endless Sea (X). */
export const leagueFinalBossPiece = (league) => (((league - 1) % 10) + 1 === 9 ? "captain" : null);
export const bossPieceFor = (node, league) =>
  (node.id === "n22" && leagueFinalBossPiece(league)) || node.boss?.piece || null;
export const seaAccessible = (profile) =>
  (profile?.campaign?.unlocked || []).includes("captain") && hasItem(profile, "boat");

/** Rewards & foes both scale with the league you are climbing. */
export const leagueRewardMult = (league) => 1 + 0.5 * ((league || 1) - 1);
export const leagueBump = (league) => 2 * ((league || 1) - 1);

/** Time pressure (v0.4): from league 5 onward SOME stages carry a clock —
 *  the monster milestones (pure bosses, incl. the League Keep) grant a total
 *  time budget, the elite piece bosses (bump ≥ 2) a per-move limit. Both
 *  tighten each league but stay bounded, so they remain winnable. The clock
 *  is UI-side only (a flagged loss on timeout); the deterministic core stays
 *  untouched. */
export function stageTimer(node, league = 1) {
  const lg = league || 1;
  if (lg < 5 || !node || !node.boss) return null;
  if (node.boss.pure) return { type: "total", seconds: Math.max(180, 360 - 30 * (lg - 5)) };
  if ((node.bump || 0) >= 2) return { type: "move", seconds: Math.max(12, 20 - (lg - 5)) };
  return null;
}
