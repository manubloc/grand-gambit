import { createInitialState, status, applyMove, KIND } from "./src/core/index.js";
import { buildArmy, buildAiArmy, characterLevel, playerLevelForXp, charLevelForXp, charXpForLevel } from "./src/meta/index.js";
import { applyResult, upgradeCost, upgradePiece, canUpgrade, MAX_PIECE_LEVEL } from "./src/meta/index.js";
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

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
