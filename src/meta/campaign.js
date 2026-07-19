// ── Campaign progression (meta) — BRANCHING GRAPH ────────────────────────────
// Progress lives on the profile as campaign: { cleared: [nodeIds], unlocked:
// [charIds] }. A node is AVAILABLE when any predecessor is cleared (the start
// node always is). Clearing a piece-boss node unlocks that piece — the only way
// to gain new pieces. XP is a spendable currency for upgrades (leveling.js).
import { PLACE_NAMES } from "../content/placeNames.js";
import { CAMPAIGN, nodeById, difficultyById, mapById, bossById, bossSpec, CHARACTERS, leagueBossId } from "../content/index.js";
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
  node = { ...node, boss: effectiveNodeBoss(node, league) };  // the Hoard hatches late
  if (!node.boss) return null;
  const override = node.id === "n22" ? leagueFinalBossPiece(league) : null;
  if (node.boss.pure && !override) {
    // the League Keep fields THIS league's boss — ten finales, ten auras;
    // monster stations rotate their champion by league
    if (node.id === "n22") return bossSpec(bossById(leagueBossId(league)) || bossById(node.boss.pure));
    const rot = node.boss.rotation;
    const pid = rot ? rot[(leagueNo(league) - 1) % rot.length] : node.boss.pure;
    return bossSpec(bossById(pid) || bossById(node.boss.pure));
  }
  const ch = CHARACTERS[override || node.boss.piece];
  const tier = node.tier || 1;
  const { abilities } = resolveCharacter(ch, 1 + tier); // a taste of its ladder
  return {
    kind: ch.kind, level: 1, abilities, shield: 0,
    hp: (BASE_HP[ch.kind] || 3) + HP_BOOST[tier],
    atk: Math.min(6, (BASE_ATK[ch.kind] || 2) + ATK_BOOST[tier]),
    ...(ch.moveSpec ? { moveSpec: ch.moveSpec } : {}),
    ...(ch.big ? { big: true } : {}), // the Dragon of the Hoard spreads across his 2x2 block like any dragon
    name: { de: ch.nameDe, en: ch.nameEn }, bossId: "pb_" + ch.id, accent: "#c9a45c",
  };
}

/** Resolve a node id into a ready-to-play match spec. The boss replaces the
 *  enemy QUEEN slot (the king always stays on the board). */
/** THE DRAGON COMES LATER: his 2x2 form is a new machine, so the Hoard only
 *  holds him from League II on. In League I the warm nest belongs to the
 *  BROODMOTHER — the ancient heart has not hatched yet. */

/** The station's name in the given league — unique across the whole journey.
 *  League I uses the homeland names from CAMPAIGN; II–X draw from PLACE_NAMES,
 *  each set hand-written from that biome's lore (see content/placeNames.js). */
export function placeFor(node, league = 1) {
  const lg = Math.max(1, Math.min(10, leagueNo(league)));
  if (lg === 1) return node?.place || "";
  return (PLACE_NAMES[lg] && PLACE_NAMES[lg][node?.id]) || node?.place || "";
}

export function effectiveNodeBoss(node, lg) {
  if (node?.id === "a4" && (lg || 1) < 2) return { pure: "b03" };
  return node?.boss;
}

const A4_L1_STORY = {
  de: "Im Drachenhort ist es warm — zu warm. Die Brutmutter hütet hier ein Gelege, das noch niemand schlüpfen sah. Noch nicht.",
  en: "The Dragon Hoard is warm - too warm. The Broodmother tends a clutch here that no one has seen hatch. Not yet.",
};

export function buildStageMatch(id, profile = null) {
  const node = nodeById(id);
  const d = difficultyById(node.difficulty);
  const lgMap = profile?.campaign?.league || 1;
  const mapId = effectiveMap(node, lgMap);
  const map = mapById(mapId);
  // CLASSIC boards mean classic chess: NO level bumps for the AI either —
  // Strength follows the RULESET: pure chess stays vanilla (level 1), an HP
  // battle scales by difficulty + league even on the classic 8x8 field. This
  // used to key off map.classic, which wrongly kept HP fights on the classic
  // board at level 1 against a leveled player.
  const chess = node.rules === "chess";
  const base = chess ? () => 1 : (cid) => d.levels[cid] || 1;
  const formation = node.formation || map.defaultFormation;
  const aiArmy = buildArmyFromFormation((cid) => chess ? 1 : base(cid) + (node.bump || 0) + leagueBump(profile?.campaign?.league), formation);
  const lg = profile?.campaign?.league || 1;
  const boss0 = nodeBossSpec(node, lg);
  const boss = boss0 && lg > 1 ? { ...boss0, hp: boss0.hp + 2 * (lg - 1), atk: boss0.atk + (lg - 1) } : boss0;
  let bossInfo = null;
  if (boss) {
    let qi = formation.indexOf("queen");
    if (qi === -1) qi = Math.max(0, Math.floor(formation.length / 2) - 1);
    aiArmy.back = aiArmy.back.map((spec, j) => (j === qi ? boss : spec));
    bossInfo = { name: boss.name, bossId: boss.bossId, unlocks: recruitOnWin(node, profile),
      art: boss.art || null, accent: boss.accent, kind: boss.kind };
  }
  const recruitId = bossPieceFor(node, lg);
  const turncoat = !!(recruitId && profile && (profile.campaign?.unlocked || []).includes(recruitId));
  return {
    nodeId: id,
    map: mapId, rules: node.rules,
    node: (node.id === "a4" && lg < 2) ? { ...node, storyDe: A4_L1_STORY.de, storyEn: A4_L1_STORY.en } : node,
    boss: bossInfo,
    turncoat, excludeId: turncoat ? recruitId : null,
    // classic boards trade level bumps for a sharper mind in later leagues
    depth: Math.min(3, (node.depth || d.depth) + (map.classic && (profile?.campaign?.league || 1) >= 3 ? 1 : 0)),
    aiArmy,
    timer: stageTimer(node, lg),
    gold: stageGold(node, lg),
    firstClear: profile ? nodeStatus(profile, id) === "available" : true,
    // a FRIENDLY: the station is cleared and one of your own holds the post —
    // a recruited champion, or the fallen League Master in his keep
    friendly: !!profile && nodeStatus(profile, id) === "cleared"
      && (id === "n22" || (!!bossPieceFor(node, lg) && (profile.campaign?.unlocked || []).includes(bossPieceFor(node, lg)))),
    reward: node.reward || { xp: 0 },
  };
}

/** Clearing an AVAILABLE node grants bonus XP (spendable + lifetime) and moves
 *  the front line. Every boss victory — replays included — notches the win
 *  tally of its piece; the piece joins once the tally reaches its `wins`
 *  demand (default 1: joins on the first victory). Champions who fall short
 *  of your court flee the map; the tally survives league rollovers. */
export function advanceCampaign(profile, id) {
  const st = nodeStatus(profile, id);
  const node = nodeById(id);
  if (!node) return profile;
  const league = profile.campaign?.league || 1;
  const firstClear = st === "available";
  const bossReplay = !!node.boss && st === "cleared";
  if (!firstClear && !bossReplay) return profile;

  const unlocked = new Set(profile.campaign?.unlocked || []);
  const dupes = { ...(profile.campaign?.dupes || {}) };
  const bossWins = { ...(profile.campaign?.bossWins || {}) };
  const stats = { ...(profile.stats || {}) };
  const bossPiece = node.boss ? bossPieceFor(node, league) : null;
  let joined = false;
  if (bossPiece) {
    bossWins[bossPiece] = (bossWins[bossPiece] || 0) + 1;
    if (unlocked.has(bossPiece)) {
      if (firstClear) dupes[bossPiece] = Math.min(2, (dupes[bossPiece] || 0) + 1);
    } else if (bossWins[bossPiece] >= winsNeeded(node, profile?.campaign?.league || 1)) {
      unlocked.add(bossPiece);
      joined = true;
      stats.recruits = (stats.recruits || 0) + 1;
    }
  }
  if (!firstClear) {
    // a pure replay: only the tally (and a possible late recruit) moves —
    // EXCEPT a friendly match against one of your OWN (a recruited champion,
    // or the fallen League Master holding his keep), which still pays a
    // quarter of the station's XP (gold is halved in applyResult)
    const friendlyXp = ((bossPiece && unlocked.has(bossPiece) && !joined) || id === "n22")
      ? Math.round((node.reward?.xp || 0) * leagueRewardMult(league) * 0.25) : 0;
    return { ...profile, stats, xpEarned: (profile.xpEarned || 0) + friendlyXp,
      campaign: { ...(profile.campaign || {}), unlocked: [...unlocked], dupes, bossWins } };
  }

  const mult = leagueRewardMult(league);
  const bonus = Math.round((node.reward?.xp || 0) * mult);
  // NOTE (v0.5): stage gold is granted through applyResult (visible in the
  // result banner) — advanceCampaign only handles progress, XP and recruits.
  stats.stagesCleared = (stats.stagesCleared || 0) + 1;
  if (node.boss) stats.bossKills = (stats.bossKills || 0) + 1;
  const xpEarned = (profile.xpEarned || 0) + bonus;
  stats.xpEarned = xpEarned;
  const spGain = spForXpJump(profile.xpEarned || 0, xpEarned);
  let items = profile.items;
  if (node.grant === "potion") items = { ...(items || {}), potion: Math.min(3, ((items || {}).potion || 0) + 1) };
  const finished = id === "n22"; // the League Keep falls — the MAP STAYS; the
  // gate to the next league opens up in the corner (advanceLeague), no rematch
  if (finished) stats.leaguesWon = (stats.leaguesWon || 0) + 1;
  return {
    ...profile,
    items,
    xp: xpEarned,
    sp: (profile.sp || 0) + spGain,
    xpEarned,
    stats,
    campaign: { league, cleared: [...clearedIds(profile), id], unlocked: [...unlocked], dupes, bossWins, tolls: profile.campaign?.tolls || [] },
  };
}

/** Step through the gate: the League Master already yielded, so the next
 *  league begins WITHOUT a rematch — court, tallies and dupes travel along,
 *  clears and paid tolls reset with the new climate. */
export function advanceLeague(profile) {
  if (nodeStatus(profile, "n22") !== "cleared") return profile;
  const league = profile.campaign?.league || 1;
  return { ...profile, campaign: { league: league + 1, cleared: [],
    unlocked: [...(profile.campaign?.unlocked || [])], dupes: { ...(profile.campaign?.dupes || {}) },
    bossWins: { ...(profile.campaign?.bossWins || {}) }, tolls: [] } };
}

/** League-specific finale: the Desert league (IX) ends at the Captain, whose
 *  recruitment (plus a boat) is the only way onto the Endless Sea (X). */
export const leagueFinalBossPiece = (league) => (((league - 1) % 10) + 1 === 9 ? "captain" : null);
export const bossPieceFor = (node, league) =>
  (node.id === "n22" && leagueFinalBossPiece(league)) || effectiveNodeBoss(node, league)?.piece || null;

/** Some champions take convincing: `wins` on the boss is how many victories it
 *  takes before the piece joins (default 1). The tally lives on the profile
 *  (campaign.bossWins, per piece) and survives league rollovers — every
 *  victory over that boss counts, replays included. */
export const winsNeeded = (node, lg = 1) => effectiveNodeBoss(node, lg)?.wins || 1;
export const bossWinsFor = (profile, pieceId) => (profile?.campaign?.bossWins || {})[pieceId] || 0;
/** The recruit THIS victory would seal — null while the champion still resists. */
export function recruitOnWin(node, profile) {
  const pieceId = node?.boss ? bossPieceFor(node, profile?.campaign?.league || 1) : null;
  if (!pieceId || (profile?.campaign?.unlocked || []).includes(pieceId)) return null;
  return bossWinsFor(profile, pieceId) + 1 >= winsNeeded(node, profile?.campaign?.league || 1) ? pieceId : null;
}
export const seaAccessible = (profile) =>
  (profile?.campaign?.unlocked || []).includes("captain") && hasItem(profile, "boat");

/** Rewards & foes both scale with the league you are climbing. */
export const leagueRewardMult = (league) => 1 + 0.5 * ((league || 1) - 1);
export const leagueBump = (league) => 2 * ((league || 1) - 1);

/** Which boards a league fields: Liga I is (almost) pure classic chess — only
 *  the League Keep keeps its arena. New boards then enter one league at a
 *  time (II: skirmish · III: courtyard & gauntlet · IV+: everything). */
export function effectiveMap(node, league = 1) {
  if (!node) return "classic";
  if (node.id === "n22" || node.league) return node.map; // finale & combo sites keep their stage
  const lg = leagueNo(league);
  if (lg >= 4) return node.map;
  const allowed = lg === 1 ? ["classic"] : lg === 2 ? ["classic", "skirmish"] : ["classic", "skirmish", "courtyard", "gauntlet"];
  return allowed.includes(node.map) ? node.map : "classic";
}

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
