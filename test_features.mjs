import { pieceMoves, NUM_SQUARES, KIND, idx } from "./src/core/index.js";
import {
  defaultFormation, formationLegal, buildArmyFromFormation, buildArmy,
  buildStageMatch, advanceCampaign, nodeStatus, clearedCount, unlockedCharacterIds, mapUnlocked, hpUnlocked, isUnlocked,
} from "./src/meta/index.js";
import { CAMPAIGN } from "./src/content/index.js";

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log("  ok  -", n); } else { fail++; console.log(" FAIL -", n); } };

const blank = () => new Array(NUM_SQUARES).fill(null);
const P = (kind, color, abilities = []) => ({ id: 1, kind, color, level: 9, abilities, used: {}, shield: 0 });
const movesAt = (board, sq) => pieceMoves({ board }, sq);
const canReach = (m, to, special) => m.some((x) => x.to === to && (special ? x.special === special : true));

// ── New abilities ─────────────────────────────────────────────────────────────
let b = blank(); b[idx(3, 4)] = P(KIND.PAWN, "w", ["pawn_charge"]);
ok("pawn_charge advances two from anywhere", canReach(movesAt(b, idx(3, 4)), idx(3, 6), "rush"));

b = blank(); b[idx(3, 4)] = P(KIND.PAWN, "w");
ok("pawn without charge cannot 2-step off start", !canReach(movesAt(b, idx(3, 4)), idx(3, 6)));

b = blank(); b[idx(3, 4)] = P(KIND.PAWN, "w", ["pawn_backstep"]);
ok("pawn_backstep retreats one square", canReach(movesAt(b, idx(3, 4)), idx(3, 3), "back"));

b = blank(); b[idx(4, 4)] = P(KIND.KNIGHT, "w", ["knight_outrider"]);
ok("knight_outrider adds a (2,2) diagonal leap", canReach(movesAt(b, idx(4, 4)), idx(6, 6), "leap"));

b = blank(); b[idx(4, 4)] = P(KIND.BISHOP, "w", ["bishop_ortho_step"]);
ok("bishop_ortho_step adds an orthogonal step", canReach(movesAt(b, idx(4, 4)), idx(4, 5), "step"));

b = blank(); b[idx(0, 0)] = P(KIND.ROOK, "w", ["rook_breach"]); b[idx(0, 1)] = P(KIND.PAWN, "w");
ok("rook_breach hops over an adjacent piece", canReach(movesAt(b, idx(0, 0)), idx(0, 2), "breach"));

b = blank(); b[idx(0, 0)] = P(KIND.ROOK, "w"); b[idx(0, 1)] = P(KIND.PAWN, "w");
ok("rook without breach is blocked by adjacent piece", !canReach(movesAt(b, idx(0, 0)), idx(0, 2)));

// ── New pieces ────────────────────────────────────────────────────────────────
b = blank(); b[idx(4, 4)] = P(KIND.AMAZON, "w");
let m = movesAt(b, idx(4, 4));
ok("Amazon moves like a knight", canReach(m, idx(5, 6)) && canReach(m, idx(6, 5)));
ok("Amazon moves like a queen (file + diagonal)", canReach(m, idx(4, 9)) && canReach(m, idx(8, 8)));

b = blank(); b[idx(4, 4)] = P(KIND.HAWK, "w");
m = movesAt(b, idx(4, 4));
ok("Hawk moves like a knight", canReach(m, idx(5, 6)) && canReach(m, idx(2, 3)));
ok("Hawk steps one diagonally", canReach(m, idx(5, 5)) && canReach(m, idx(3, 3)));
ok("Hawk is NOT a full bishop (no long diagonal)", !canReach(m, idx(7, 7)));

// ── Formation ─────────────────────────────────────────────────────────────────
const allUnlocked = unlockedCharacterIds({ campaign: { unlocked: ["hawk","archbishop","chancellor","amazon","assassin","guardian","dragon","mage","sorceress","alchemist","warlock","paladin","inquisitor","bard","engineer","standard","strategist","pathfinder"] } });
const def = defaultFormation();
ok("defaultFormation has 10 slots", def.length === 10);
ok("defaultFormation is legal", formationLegal(def, allUnlocked));

const twoQueens = [...def]; twoQueens[1] = "queen";
ok("two queens is illegal", !formationLegal(twoQueens, allUnlocked));

const noKing = [...def]; noKing[5] = "rook";
ok("missing king is illegal", !formationLegal(noKing, allUnlocked));

const lockedFairy = [...def]; lockedFairy[1] = "amazon";
ok("unlocked-only is enforced", !formationLegal(lockedFairy, ["king", "queen", "rook", "bishop", "knight"]) && formationLegal(lockedFairy, allUnlocked));

const army = buildArmyFromFormation(() => 1, def);
ok("formation army has a 10-piece back rank", army.back.length === 10);
ok("formation army back rank matches kinds", army.back[0].kind === KIND.ROOK && army.back[5].kind === KIND.KING);

// buildArmy prefers a legal custom formation, falls back otherwise (Arena map by default)
const rich = { xp: 0, campaign: { cleared: [], unlocked: ["archbishop"] }, pieces: { levels: {} }, loadout: {} };
const custom = [...def]; custom[1] = "archbishop";
ok("buildArmy uses a legal custom formation", buildArmy({ ...rich, loadout: { formations: { arena: custom } } }).back[1].kind === KIND.ARCHBISHOP);

const illegal = [...def]; illegal[1] = "queen";
const fb = buildArmy({ ...rich, loadout: { formations: { arena: illegal } } });
ok("buildArmy falls back to standard on illegal formation", fb.back.filter((s) => s.kind === KIND.QUEEN).length === 1);

// ── Campaign (branching graph) ───────────────────────────────────────────────
ok("campaign has stages", CAMPAIGN.length >= 8);
const s0 = buildStageMatch("n01");
ok("story starts as chess on the classic board", s0.map === "classic" && s0.rules === "chess");
ok("stage match builds a full enemy army", s0.aiArmy.back.length === 8 && s0.aiArmy.pawn.kind === KIND.PAWN);
ok("stage match carries a search depth", typeof s0.depth === "number" && s0.depth >= 1);
ok("classic stages field base-level enemies", s0.aiArmy.back.every((p) => (p.level || 1) === 1));
ok("later stages open new arenas", CAMPAIGN.some((s) => s.map === "arena") && CAMPAIGN.some((s) => s.rules === "hp"));

const last = buildStageMatch("n22");
ok("final stage is a boss fight", last.boss && last.aiArmy.back.some((s) => s.kind === "X"));

let prof = { xp: 0, campaign: { cleared: [], unlocked: [] } };
ok("n01 starts available, a1 locked", nodeStatus(prof, "n01") === "available" && nodeStatus(prof, "a1") === "locked");
prof = advanceCampaign(prof, "n01");
ok("clearing grants bonus xp (both balances)", clearedCount(prof) === 1 && prof.xp === CAMPAIGN[0].reward.xp && prof.xpEarned === prof.xp);
ok("n01 cleared, n02 available", nodeStatus(prof, "n01") === "cleared" && nodeStatus(prof, "n02") === "available");
ok("clearing a locked node is a no-op", clearedCount(advanceCampaign(prof, "a3")) === 1);
prof = advanceCampaign(prof, "n02");
prof = advanceCampaign(prof, "n03");
ok("the road FORKS after the awakening", nodeStatus(prof, "a1") === "available" && nodeStatus(prof, "b1") === "available" && nodeStatus(prof, "c1") === "available");
ok("paths do not open each other", nodeStatus(advanceCampaign(prof, "a1"), "b2") === "locked");

// ── Piece bosses unlock pieces; XP upgrades them ─────────────────────────────
const before = unlockedCharacterIds(prof);
ok("assassin locked before its boss falls", !before.includes("assassin"));
let prof2 = advanceCampaign(advanceCampaign(prof, "a1"), "a2");
ok("slaying the Assassin boss recruits the piece", unlockedCharacterIds(prof2).includes("assassin") && unlockedCharacterIds(prof2).includes("hawk"));
ok("campaign clears feed the achievement stats", prof2.stats.stagesCleared === 5 && prof2.stats.bossKills === 3 && prof2.stats.recruits === 2);

// ── League 2 (New Game+): rollover, duplication stars, scaling ───────────────
import { buildStageMatch as bsm2, dupeCount, leagueBump } from "./src/meta/index.js";
import { potionCommand, reduce as red2, createGame as cg2, WHITE as W2 } from "./src/core/index.js";
let lg = prof2;
for (const id of ["a3", "a4", "a5", "n16", "n17", "d1", "d2", "n20", "n21", "n22"]) lg = advanceCampaign(lg, id);
ok("finishing the League Keep rolls into league 2 with clears reset", lg.campaign.league === 2 && lg.campaign.cleared.length === 0);
ok("unlocked pieces and gold survive the rollover", lg.campaign.unlocked.length >= 2 && lg.gold > 0);
lg = advanceCampaign(advanceCampaign(advanceCampaign(lg, "n01"), "n02"), "n03");
lg = advanceCampaign(advanceCampaign(lg, "a1"), "a2");
ok("re-beating a piece boss grants a duplication star", dupeCount(lg, "assassin") === 1);
ok("league 2 foes come level-boosted", bsm2("a3", lg).aiArmy.back[0].level === bsm2("a3", prof).aiArmy.back[0].level + leagueBump(2));

// ── Healing draught: a real, guarded core command ─────────────────────────────
const hg = cg2(undefined, undefined, { rules: "hp", seed: 3, potions: { w: 1, b: 0 } });
const pi = hg.board.findIndex((x) => x && x.color === "w" && x.kind === "P");
hg.board[pi] = { ...hg.board[pi], hp: 1 };
const heal = red2(hg, potionCommand(W2, pi));
ok("potion heals toward max, spends a charge, passes the turn",
  heal.state.board[pi].hp === heal.state.board[pi].maxHp && heal.state.potions.w === 0 && heal.state.turn === "b");
ok("without charges the command is a no-op", red2(heal.state, potionCommand("b", pi)).state === heal.state);

// ── Item-gated secret paths + the Captain/boat chain ─────────────────────────
import { nodeStatus as nst, seaAccessible, dupeCount as dc2 } from "./src/meta/index.js";
import { buyItem, CAMPAIGN as CAMP2, ITEMS } from "./src/content/index.js";
ok("the map now holds 36 sites (27 + 9 secret paths)", CAMP2.length === 36 && CAMP2.filter((n) => n.gate).length === 9);
ok("six of the secret sites are league-bound", CAMP2.filter((n) => n.league).length === 6);
import { nodeStatus as nstH } from "./src/meta/index.js";
ok("league-bound sites hide outside their league", nstH({ campaign: { league: 1, cleared: ["a1"] } }, "g8") === "hidden");
let gp = { ...prof, gold: 500 };
for (const id of ["c1", "c2"]) gp = advanceCampaign(gp, id);
ok("a reachable gated site reports 'gated' until you own the key", nst(gp, "g1") === "gated");
const goldBefore = gp.gold;
gp = buyItem(gp, "machete");
ok("buying the key opens the path (and charges gold)", nst(gp, "g1") === "available" && gp.gold === goldBefore - ITEMS.machete.gold);
gp = advanceCampaign(gp, "g1");
ok("the secret guardian recruits its heavyweight early", gp.campaign.unlocked.includes("dragon"));
const lg9 = { v: 2, sp: 0, gold: 0, xp: 0, xpEarned: 0, stats: {}, pieces: { levels: {}, abilities: {} }, items: {}, claims: {},
  loadout: { flank: ["knight", "knight"], formations: {} },
  campaign: { league: 9, cleared: ["n01","n02","n03","a1","a2","a3","a4","a5","n16","n17","d1","d2","n20","n21"], unlocked: [], dupes: {} } };
ok("league IX finale is the Captain", bsm2("n22", lg9).boss.unlocks === "captain");
const sailed = advanceCampaign(lg9, "n22");
ok("beating him recruits the Captain and opens league X", sailed.campaign.unlocked.includes("captain") && sailed.campaign.league === 10);
ok("but the sea still wants a boat", !seaAccessible(sailed) && seaAccessible(buyItem({ ...sailed, gold: 200 }, "boat")));

// ── The Grand Gambit: the eponymous hero pawn ────────────────────────────────
import { upgradeCost as upc2, heroColFor, buildArmy as bArmy } from "./src/meta/index.js";
import { CHARACTERS as CH2, mapById as mapBy2 } from "./src/content/index.js";
import { createGame as cg3 } from "./src/core/index.js";
ok("the hero exists, costs more than a common pawn, learns Masquerade at 8",
  CH2.gambit.epic === true && upc2("gambit") === 2 && upc2("pawn") === 1 &&
  CH2.gambit.ladder.some((e) => e.level === 8 && e.ability === "gambit_masquerade"));
const hp0 = { ...prof, loadout: { ...prof.loadout, heroCols: {} } };
ok("his file defaults to the center and clamps to the board",
  heroColFor(hp0, mapBy2("arena")) === 5 &&
  heroColFor({ ...hp0, loadout: { ...hp0.loadout, heroCols: { arena: 99 } } }, mapBy2("arena")) === 9);
const hpX = { ...prof, loadout: { flank: ["knight", "knight"], formations: {}, heroCols: { arena: 2 } },
  pieces: { levels: { gambit: 4 }, abilities: { gambit: ["pawn_sidestep"] } } };
const hg2 = cg3(bArmy(hpX), undefined, { rules: "hp", seed: 5 });
const heroes2 = hg2.board.filter((x) => x && x.hero);
ok("exactly ONE crested pawn takes his chosen file",
  heroes2.length === 1 && heroes2[0].color === "w" && heroes2[0].level === 4 &&
  hg2.board.findIndex((x) => x && x.hero) % 10 === 2);
import { evaluate as aiEval } from "./src/ai/evaluate.js";
const swap = hg2.board.slice();
const hiIdx = swap.findIndex((x) => x && x.hero);
const plainIdx = swap.findIndex((x) => x && x.kind === "P" && !x.hero && x.color === "w");
// ── Restore points: rolling + daily retention (pure policy) ─────────────────
import { applySnapshot, readSnapshot, BK_RECENT, BK_MIN_GAP_MS } from "./src/meta/index.js";
ok("snapshots respect the 10-minute gap but never miss forced ones", (() => {
  const p = { name: "A", pieces: {}, gold: 1, campaign: { league: 1 } };
  let l = applySnapshot([], p, 1_000_000);
  const same = applySnapshot(l, p, 1_000_000 + BK_MIN_GAP_MS / 2);
  const forced = applySnapshot(l, p, 1_000_000 + 1000, true);
  return l.length === 1 && same.length === 1 && forced.length === 2;
})());
ok("retention keeps the recent six plus one anchor per older day", (() => {
  const p = { name: "A", pieces: {}, gold: 1, campaign: { league: 1 } };
  let l = []; const day = 864e5; let now = 100 * day;
  for (let d = 8; d >= 1; d--) for (let h = 0; h < 4; h++)
    l = applySnapshot(l, p, now - d * day + h * 3 * 3600e3, true);
  for (let i = 0; i < 8; i++) l = applySnapshot(l, p, now + i * BK_MIN_GAP_MS, true);
  const days = new Set(l.slice(BK_RECENT).map((e) => new Date(e.ts).toISOString().slice(0, 10)));
  return l.length === BK_RECENT + days.size && days.size >= 6 && l.length <= BK_RECENT + 10;
})());
ok("a snapshot restores the full profile (and rejects corruption)", (() => {
  const p = { name: "Held", pieces: { levels: {} }, gold: 99, campaign: { league: 3 } };
  const l = applySnapshot([], p, 5_000_000);
  const r = readSnapshot(l[0]);
  let rejected = false;
  try { readSnapshot({ data: "{\"broken\":1}" }); } catch { rejected = true; }
  return r.gold === 99 && r.campaign.league === 3 && rejected;
})());

// ── Release hardening: notices + portable saves ─────────────────────────────
import { serializeSave, parseSave, defaultProfile as dp2 } from "./src/meta/index.js";
ok("fresh profiles carry an empty notices ledger (privacy popup will show)",
  JSON.stringify(dp2().notices) === "{}");
ok("a save file round-trips through export → import (with migration)", (() => {
  const p = { ...dp2(), name: "Backup", gold: 77, notices: { privacy: true } };
  const r = parseSave(serializeSave(p));
  return r.name === "Backup" && r.gold === 77 && r.notices.privacy === true && r.loadout.heroCols;
})());
ok("imports reject files that are not Grand Gambit saves", (() => {
  for (const bad of ["nope", "{}", JSON.stringify({ gg: "x", profile: {} })]) {
    try { parseSave(bad); return false; } catch {}
  }
  return true;
})());

// ── SVG asset registry: every figure and scenery piece has an editable file ──
import { PIECE_ART, BOSS_ART, CREST_ART, SCENERY_ART } from "./src/app/ui/art.generated.js";
ok("every character kind has a piece SVG (plus a default)", (() => {
  const kinds = new Set([...Object.values(CH2).map((c) => c.kind), "P", "N", "B", "R", "Q", "K"]);
  return [...kinds].every((k) => (PIECE_ART[k] || "").length > 40) && PIECE_ART._default;
})());
ok("boss silhouettes + the hero's crest come from files",
  ["beast", "golem", "wraith", "serpent", "tyrant"].every((a) => (BOSS_ART[a] || "").length > 40) && CREST_ART.length > 100);
ok("all 27 scenery pieces are file-backed (incl. the snow overlay)",
  Object.keys(SCENERY_ART).length >= 27 && (SCENERY_ART["pine-snow"] || "").length > 40 && /var\(--c1/.test(SCENERY_ART.pine));
ok("the AI values the hero above a common pawn", (() => {
  const withHero = aiEval({ ...hg2, board: swap }, "w");
  const noHero = aiEval({ ...hg2, board: swap.map((x, i) => i === hiIdx ? { ...x, hero: false } : x) }, "w");
  return withHero > noHero;
})());

// ── Unlocks ride on campaign reach ───────────────────────────────────────────
const fresh = { xp: 0, campaign: { cleared: [], unlocked: [] } };
ok("fresh profile: only classic, no HP", mapUnlocked(fresh, "classic") && !mapUnlocked(fresh, "skirmish") && !hpUnlocked(fresh));
ok("hp opens once the awakening is reachable", hpUnlocked(advanceCampaign(advanceCampaign(fresh, "n01"), "n02")));
ok("fork maps open with the fork, arena stays shut", mapUnlocked(prof, "skirmish") && mapUnlocked(prof, "courtyard") && !mapUnlocked(prof, "arena"));

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
