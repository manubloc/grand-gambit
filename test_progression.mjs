import { createInitialState, status, applyMove, KIND } from "./src/core/index.js";
import { buildArmy, buildAiArmy, characterLevel, playerLevelForXp, charLevelForXp, charXpForLevel } from "./src/meta/index.js";
import { applyResult, upgradeCost, upgradePiece, canUpgrade, MAX_PIECE_LEVEL, maxLevelFor, gambitTier, GAMBIT_MAX_LEVEL, resolveCharacter, buildArmyForMap, itemRevealed } from "./src/meta/index.js";
import { mapById } from "./src/content/index.js";
import { ITEMS } from "./src/content/index.js";
import { evaluate as evalAch } from "./src/meta/index.js";
import { chooseMove } from "./src/ai/index.js";
import { CHARACTERS } from "./src/content/index.js";

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log("  ok  -", n); } else { fail++; console.log(" FAIL -", n); } };

// Hard AI army should contain fairy pieces with shields/abilities (visible to player)
const hard = buildAiArmy("hard");
const hasArch = hard.back.some((s) => s.kind === KIND.ARCHBISHOP);
const hasChan = hard.back.some((s) => s.kind === KIND.CHANCELLOR);
const someShield = hard.back.some((s) => s.shield > 0) || hard.pawn.shield > 0;
ok("hard AI fields an Archbishop", hasArch);
ok("hard AI fields a Chancellor", hasChan);
ok("hard AI pieces carry shields", someShield);
console.log("      (hard pawn:", JSON.stringify(hard.pawn) + ")");

// Default player army is plain level 1
const a0 = buildArmy({ pieces: { levels: {} }, loadout: { flank: ["knight", "knight"] } });
ok("fresh player army has no shields", a0.back.every((s) => s.shield === 0) && a0.pawn.shield === 0);

// Abilities are a deliberate purchase now: level alone gives shields, not skills
const lvlOnly = buildArmy({ pieces: { levels: { pawn: 5 } }, loadout: { flank: ["knight", "knight"] } });
ok("level 5 pawn has its shield but NO auto ability", lvlOnly.pawn.shield >= 1 && lvlOnly.pawn.abilities.length === 0);
const withPick = buildArmy({ pieces: { levels: { pawn: 5 }, abilities: { pawn: ["pawn_sidestep"] } }, loadout: { flank: ["knight", "knight"] } });
ok("a purchased ability shows up in the army", withPick.pawn.abilities.includes("pawn_sidestep"));

// AI move timing on a fresh 10x10 board
const s = createInitialState(buildArmy({ charXp: {}, loadout: { flank: ["knight", "knight"] } }), hard);
for (const depth of [1, 2]) {
  const t0 = Date.now();
  const mv = chooseMove(s, depth);
  const ms = Date.now() - t0;
  ok(`AI returns a move at depth ${depth}`, !!mv);
  console.log(`      (depth ${depth}: ${ms} ms)`);
}

// Result application updates xp, stats, achievements
const base = { v: 1, xp: 0, charXp: {}, loadout: { flank: ["knight", "knight"] }, stats: { games: 0, wins: 0, losses: 0, draws: 0, captures: 0, promotions: 0, checkmates: 0, winStreak: 0, bestStreak: 0, flawlessQueenWins: 0, fastWins: 0 } };
const r = applyResult(base, { result: "win", captures: 4, promotions: 1, checkmate: true, lostQueen: false, moveCount: 33, charXpGains: { pawn: 60, queen: 20 } });
ok("win grants xp", r.profile.xp > 0);
ok("stats record the win", r.profile.stats.wins === 1 && r.profile.stats.checkmates === 1);
ok("character xp accrues", r.profile.charXp.pawn === 60);
ok("a single win earns no tier yet (harsher balance)", r.gained.newAchievements.length === 0);
const r5 = applyResult({ ...base, stats: { ...base.stats, wins: 4, games: 4 } }, { result: "win", captures: 0, promotions: 0, checkmate: false, lostQueen: true, moveCount: 60, charXpGains: {} });
ok("the fifth win unlocks the first tier", r5.gained.newAchievements.some((a) => a.startsWith("wins")));

// ── Claims: rewards must be collected, and only once ─────────────────────────
import { claimAchievement, claimableCount, claimedTiers } from "./src/meta/index.js";
let cl = { sp: 0, gold: 0, claims: {}, stats: { wins: 6, games: 6 } };
ok("a finished tier is claimable", claimableCount(cl) >= 1);
cl = claimAchievement(cl, "wins");
ok("claiming pays SP + gold and records the tier", cl.sp === 1 && cl.gold >= 2 && claimedTiers(cl, "wins") === 1);
ok("no double dipping", claimAchievement(cl, "wins").sp === cl.sp);
console.log("      (skillpoints now:", evalAch(r.profile.stats).points + ", new tiers:", r.gained.newAchievements.join(", ") + ")");

// ── SKILL-POINT economy: player levels mint ⭐, pieces spend them ─────────────
import { abilityCost as abCost, unlockAbility as unl, canUnlockAbility as canUnl, spForXpJump, SP_PER_PLAYER_LEVEL } from "./src/meta/index.js";
ok("piece costs follow board value (in SP)", upgradeCost("pawn") === 1 && upgradeCost("knight") === 2 && upgradeCost("rook") === 3 && upgradeCost("queen") === 4);
ok("ability rungs cost a few SP", abCost(3) === 2 && abCost(5) === 3 && abCost(9) === 5);
ok("a player level-up mints SP", spForXpJump(0, 60) === SP_PER_PLAYER_LEVEL && spForXpJump(0, 40) === 0);
let eco = { sp: 3, xpEarned: 60, pieces: { levels: {} }, campaign: { cleared: [], unlocked: [] } };
ok("3 SP buys the rook step", canUpgrade(eco, "rook"));
eco = upgradePiece(eco, "rook");
ok("upgrade deducts SP and raises the level", eco.sp === 0 && characterLevel(eco, "rook") === 2);
ok("upgrades are counted for achievements", eco.stats.upgrades === 1);
ok("broke means broke", !canUpgrade(eco, "rook") && upgradePiece(eco, "rook").sp === 0);
ok("abilities gate on level then charge SP", (() => {
  const rung = CHARACTERS.rook.ladder.find((e) => e.ability);
  let p2 = { ...eco, sp: 10, pieces: { levels: { rook: rung.level }, abilities: {} } };
  if (!canUnl(p2, "rook", rung.ability)) return false;
  p2 = unl(p2, "rook", rung.ability);
  return p2.sp === 10 - abCost(rung.level) && p2.pieces.abilities.rook.includes(rung.ability);
})());
ok("levels cap at MAX_PIECE_LEVEL", characterLevel(upgradePiece({ ...eco, sp: 99, pieces: { levels: { rook: MAX_PIECE_LEVEL } } }, "rook"), "rook") === MAX_PIECE_LEVEL);

// ── the hero alone climbs three tiers of ten ─────────────────────────────────
ok("gambit cap is 60, common pieces stay at 10", maxLevelFor("gambit") === 60 && maxLevelFor("rook") === 10 && GAMBIT_MAX_LEVEL === 60);
ok("six tiers, switching every ten levels", gambitTier(1) === 1 && gambitTier(10) === 1 && gambitTier(11) === 2 && gambitTier(21) === 3 && gambitTier(31) === 4 && gambitTier(41) === 5 && gambitTier(51) === 6 && gambitTier(60) === 6);
ok("the climb grows steep: 2/3/4/6/8/10 SP by tier", upgradeCost("gambit", 1) === 2 && upgradeCost("gambit", 10) === 3 && upgradeCost("gambit", 15) === 3 && upgradeCost("gambit", 30) === 6 && upgradeCost("gambit", 45) === 8 && upgradeCost("gambit", 59) === 10);
ok("the full road to 60 costs 328 SP", Array.from({ length: 59 }, (_, i) => upgradeCost("gambit", i + 1)).reduce((a, b) => a + b, 0) === 328);
ok("the risen gambit banks shields all the way: 6 at L30, 11 at L60", resolveCharacter(CHARACTERS.gambit, 30, null).shield === 6 && resolveCharacter(CHARACTERS.gambit, 60, null).shield === 11 && resolveCharacter(CHARACTERS.gambit, 10, null).shield === 2);
ok("the gambit can be upgraded past ten", characterLevel(upgradePiece({ sp: 99, pieces: { levels: { gambit: 10 } } }, "gambit"), "gambit") === 11);
ok("the hero spec carries his tier onto the board", buildArmyForMap({ pieces: { levels: { gambit: 15 } } }, mapById("arena")).hero.spec.tier === 2);

// ── retinue score: monotonic with progress ──────────────────────────────────
import { retinueScore, defaultProfile as dp2, advanceCampaign as adv2 } from "./src/meta/index.js";
const r0 = retinueScore(dp2());
const rp = retinueScore(adv2(adv2(dp2(), "n01"), "n02"));
ok("retinue score starts modest and grows with progress", r0 > 50 && r0 < 400 && rp > r0);
ok("upgrades raise the retinue score", retinueScore({ ...dp2(), pieces: { levels: { rook: 3 } } }) === r0 + 80);

// ── stage clock (v0.4): time pressure begins in league 5, only on SOME nodes ─
import { stageTimer, buildStageMatch as bsm2 } from "./src/meta/index.js";
import { nodeById as nb2 } from "./src/content/index.js";
ok("no clock before league 5", stageTimer(nb2("n22"), 4) === null && stageTimer(nb2("n03"), 1) === null);
ok("plain stages never get a clock", stageTimer(nb2("n01"), 7) === null);
const tMon = stageTimer(nb2("n03"), 5);
ok("league 5 monster boss: 6-minute total budget", tMon?.type === "total" && tMon.seconds === 360);
const tEli = stageTimer(nb2("n20"), 5);
ok("league 5 elite piece boss: 20s per move", tEli?.type === "move" && tEli.seconds === 20);
ok("clocks tighten but stay bounded", stageTimer(nb2("n22"), 30).seconds === 180 && stageTimer(nb2("n20"), 30).seconds === 12);
ok("buildStageMatch carries the clock", (() => {
  const p = { ...dp2(), campaign: { league: 5, cleared: [], unlocked: [] } };
  const m = bsm2("n03", p);
  return m.timer?.type === "total" && m.timer.seconds === 360 && bsm2("n03", dp2()).timer === null;
})());

// ── the purse (v0.5): visible gold per win, tolls, richer claims ─────────────
import { stageGold, tollCost, payToll, winGold, nodeStatus as ns2, claimReward as cr2, evaluate as ev2 } from "./src/meta/index.js";
import { CAMPAIGN as CAMP3, ITEM_LIST as IL3 } from "./src/content/index.js";

// end bosses simply carry more gold
ok("stage gold grows down the road and peaks at the League Keep",
  stageGold(nb2("n22"), 1) > stageGold(nb2("n03"), 1) && stageGold(nb2("n03"), 1) > stageGold(nb2("n01"), 1));
ok("pure monster bosses pay a premium over plain sites",
  stageGold(nb2("n03"), 1) - stageGold(nb2("n02"), 1) >= 8);
ok("league scaling multiplies the purse", stageGold(nb2("n22"), 3) === Math.round(stageGold(nb2("n22"), 1) * 2));
ok("quick-play purses scale with difficulty", winGold("easy") < winGold("normal") && winGold("normal") < winGold("hard"));

// tolls: reachable but gated until paid; paying opens the way for this league
const tp0 = { ...dp2(), gold: 500, campaign: { league: 1, cleared: ["n01", "n02", "n03", "a1", "a2", "a3"], unlocked: [] } };
ok("the Mist Ferry is reachable but wants its toll", ns2(tp0, "z1") === "gated");
ok("toll cost scales with the league", tollCost(nb2("z1"), 1) === 40 && tollCost(nb2("z1"), 3) === 80);
const tpPoor = payToll({ ...tp0, gold: 10 }, "z1");
ok("too little gold: the ferryman does not row", tpPoor.gold === 10 && !(tpPoor.campaign.tolls || []).includes("z1"));
const tp1 = payToll(tp0, "z1");
ok("paying the toll opens the way and empties the purse accordingly",
  tp1.gold === 500 - 40 && ns2(tp1, "z1") === "available");
ok("paying twice is a no-op", payToll(tp1, "z1") === tp1);
ok("toll sites reward more than they cost", CAMP3.filter((n) => n.gate?.gold).every((n) => (n.reward?.gold || 0) > n.gate.gold));

// richer claims: gold = max(5, 80% of the tier's points)
const evItems = ev2({ wins: 5 }).items;
const winsIt = evItems.find((i) => i.id === "wins");
ok("claims pay a fatter purse (80% of tier points, min 5)",
  cr2(winsIt, 0).gold === 5 && cr2(winsIt, 5).gold === 160);

// the big invariant: league 1 first-clear income comfortably covers every key
// item AVAILABLE in league 1. Late keys (the boat, minLeague 9) are a life's
// savings by design — they get their own invariant below.
const l1Income = CAMP3.filter((n) => !n.league).reduce((a, n) => a + stageGold(n, 1), 0);
const keyCost = IL3.filter((i) => i.kind === "key" && (i.minLeague || 1) <= 1).reduce((a, i) => a + i.gold, 0);
const tolls1 = CAMP3.filter((n) => n.gate?.gold).reduce((a, n) => a + tollCost(n, 1), 0);
ok("league 1 income covers its keys plus tolls with room to breathe (" + l1Income + " vs " + (keyCost + tolls1) + ")",
  l1Income > (keyCost + tolls1) * 1.1);

// the boat is EXPENSIVE by design (a story savings goal) — but the income of
// leagues 1..9 must still afford it comfortably before the Endless Sea calls
const boat3 = IL3.find((i) => i.id === "boat");
const income9 = [1,2,3,4,5,6,7,8,9].reduce((a, lg) => a + CAMP3.filter((n) => !n.league).reduce((b, n) => b + stageGold(n, lg), 0), 0);
ok("the boat costs serious coin (>= 2000)", boat3.gold >= 2000);
ok("nine leagues of income cover the boat (" + income9 + " vs " + boat3.gold + ")", income9 > boat3.gold * 1.5);


// ── v0.19: resigning forfeits everything; the chest reveals itself slowly ────
{
  const p0 = { ...structuredClone(base), gold: 10, items: { hourglass: 2 } };
  const rr = applyResult(p0, { result: "loss", resigned: true, captures: 3, checkmate: false, promotions: 0, charXpGains: { pawn: 40 }, hourglassUsed: 1 });
  ok("resign grants zero XP", rr.profile.xpEarned === (p0.xpEarned || 0));
  ok("resign grants zero gold", rr.profile.gold === 10);
  ok("resign grants zero piece XP", !(rr.profile.charXp?.pawn > (p0.charXp?.pawn || 0)));
  ok("resign still counts the loss", rr.profile.stats.losses === (base.stats.losses || 0) + 1);
  ok("time-turner burned on resign too", rr.profile.items.hourglass === 1);
  const rl = applyResult(p0, { result: "loss", captures: 3, charXpGains: {} });
  ok("a fought loss still pays a little XP", rl.profile.xpEarned > (p0.xpEarned || 0));
}
{
  const fresh = { campaign: { league: 1, cleared: [] } };
  ok("potion revealed from the start", itemRevealed(fresh, ITEMS.potion));
  ok("machete veiled at the start", !itemRevealed(fresh, ITEMS.machete));
  const mid = { campaign: { league: 1, cleared: ["n01","n02","n03","c1","c2"] } };
  ok("machete revealed after 4 stages", itemRevealed(mid, ITEMS.machete));
  ok("mountain key veiled in league 1", !itemRevealed(mid, ITEMS.bergschluessel));
  ok("mountain key revealed in league 5", itemRevealed({ campaign: { league: 5, cleared: [] } }, ITEMS.bergschluessel));
  ok("time-turner revealed after 2 stages", itemRevealed({ campaign: { league: 1, cleared: ["n01","n02"] } }, ITEMS.hourglass));
}


// ── every station name is spoken once across all ten leagues ─────────────────
import { placeFor as _pf } from "./src/meta/index.js";
import { CAMPAIGN as _cg } from "./src/content/index.js";
{
  const seen = new Set(); let dups = 0;
  for (let lg = 1; lg <= 10; lg++) for (const n of _cg) { const nm = _pf(n, lg); if (seen.has(nm)) dups++; seen.add(nm); }
  ok("510 station names, none spoken twice", seen.size === 510 && dups === 0);
  ok("League I keeps its founding names", _pf(_cg.find((n) => n.id === "a1"), 1) === "Nordwacht");
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
