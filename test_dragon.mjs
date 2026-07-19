// THE BIG DRAGON (2x2) — rules pinned down.
import { createGame, legalMoves, applyMove, status } from "./src/core/index.js";
import { chooseMove } from "./src/ai/index.js";
import { makeRng } from "./src/core/ports/rng.js";
import { buildArmyFromFormation, formationLegal, unlockedCharacterIds } from "./src/meta/index.js";
import { mapById, CHARACTERS } from "./src/content/index.js";

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log("  ok  -", name); } else { fail++; console.log(" FAIL -", name); } };

const map = mapById("arena");
const W = map.w;
const dform = [...map.defaultFormation]; dform[0] = "dragon"; dform[1] = null;
const mk = (lvl = 5, rules = "hp") => createGame(
  buildArmyFromFormation(() => lvl, dform),
  buildArmyFromFormation(() => 1, map.defaultFormation),
  { map, rules, seed: 11 });

// ── unfolding & the price ────────────────────────────────────────────────────
{
  const g = mk();
  const b = g.board;
  ok("the dragon unfolds at the edge anchor with three wing markers",
    b[0]?.kind === "D" && b[0].big && [1, W, W + 1].every((i) => b[i]?.kind === "D+" && b[i].ref === 0));
  ok("his price is paid: the neighbour and both pawns in front are gone",
    b.filter((p) => p && p.color === "w" && p.kind !== "D" && p.kind !== "D+").length === map.w * 2 - 4);
  ok("wing markers carry no hp of their own", b[1].hp === undefined && b[0].hp > 0);
}

// ── walking ──────────────────────────────────────────────────────────────────
{
  const g = mk();
  const step = legalMoves(g, "w").find((m) => m.special === "dragonStep");
  ok("on foot he shifts the whole block one square", !!step && step.to === W);
  const g2 = applyMove(g, step);
  ok("the block truly moved: old cells free, new block intact",
    g2.board[0] === null && g2.board[1] === null && g2.board[W]?.kind === "D" &&
    [W + 1, 2 * W, 2 * W + 1].every((i) => g2.board[i]?.kind === "D+"));
}

// ── flight: strike, settle, fall back ────────────────────────────────────────
{
  // hand-built: dragon anchor 0, one WEAK foe pawn at 22 → fly to 21 covers it, it dies → settle
  const g = mk(9); // level 9: range 4, atk 8
  g.board[22] = { id: 901, kind: "P", color: "b", level: 1, abilities: [], shield: 0, used: {}, hasMoved: true, maxHp: 2, hp: 2, atk: 1 };
  const fly = legalMoves(g, "w").find((m) => m.special === "dragonFly" && m.to === 21);
  ok("flight may land on foes", !!fly);
  const g2 = applyMove(g, fly);
  ok("all covered foes fell -> he settles on the new block",
    g2.board[21]?.kind === "D" && g2.board[0] === null && g2.lastMove.bounced === false && g2.captured.w.includes("P"));
  ok("the wings are spent: once per game", (g2.board[21].used || {}).dragon_flight === true &&
    !legalMoves(g2, "w").some((m) => m.special === "dragonFly"));
}
{
  // a TOUGH foe on the landing zone survives → the strike counts, he falls back
  const g = mk(3); // level 3: flight range 2, atk 5
  g.board[22] = { id: 902, kind: "R", color: "b", level: 1, abilities: [], shield: 0, used: {}, hasMoved: true, maxHp: 20, hp: 20, atk: 3 };
  const fly = legalMoves(g, "w").find((m) => m.special === "dragonFly" && m.to === 21);
  const g2 = applyMove(g, fly);
  ok("a survivor throws him back to his take-off block",
    g2.board[0]?.kind === "D" && g2.board[21] === null && g2.lastMove.bounced === true);
  ok("the strike still counts (rook bruised) and the wings are spent anyway",
    g2.board[22].hp < 20 && (g2.board[0].used || {}).dragon_flight === true);
}

// ── the weight of him: the aura ──────────────────────────────────────────────
{
  const g = mk(5); // atk 6 -> aura 3
  g.board[3 * W] = { id: 903, kind: "P", color: "b", level: 1, abilities: [], shield: 0, used: {}, hasMoved: true, maxHp: 9, hp: 9, atk: 1 };
  const step = legalMoves(g, "w").find((m) => m.special === "dragonStep" && m.to === W);
  const g2 = applyMove(g, step);
  ok("every foe pressed against the block takes ceil(atk/2)", g2.board[3 * W].hp === 6);
}

// ── damage routes through the wings; death clears all four cells ─────────────
{
  const g = mk(2, "hp");
  const a = 0;
  // an enemy rook shoots the wing marker cell -> the DRAGON bleeds
  g.board[2] = { id: 904, kind: "R", color: "b", level: 9, abilities: [], shield: 0, used: {}, hasMoved: true, maxHp: 20, hp: 20, atk: 99 };
  const hit = legalMoves(g, "b").find((m) => m.to === 1); // wing cell
  ok("foes can target a wing cell", !!hit);
  const g2 = applyMove(g, hit);
  ok("the blow routes to the dragon and his death clears all four squares",
    g2.captured.b.includes("D") && [0, W, W + 1].every((i) => g2.board[i] === null) && g2.board[1]?.kind === "R");
}

// ── formation law ────────────────────────────────────────────────────────────
{
  const owned = [...unlockedCharacterIds({ campaign: { unlocked: Object.keys(CHARACTERS) } })];
  // required counts (K/Q/2R/2B) must survive: the dragon eats two FLEX slots
  const f1 = ["dragon", null, "rook", "rook", "bishop", "queen", "king", "bishop", "knight", "knight"];
  const f2 = ["rook", "knight", "knight", "bishop", "dragon", "king", "bishop", "queen", "rook", "knight"];
  const f3 = ["dragon", "knight", "rook", "rook", "bishop", "queen", "king", "bishop", "knight", "knight"];
  ok("dragon at the edge with an empty wing is lawful", formationLegal(f1, owned) === true);
  ok("a dragon in the middle is turned away", formationLegal(f2, owned) === false);
  ok("without the empty wing slot he may not deploy", formationLegal(f3, owned) === false);
}

// ── the AI wields him without breaking the board ─────────────────────────────
{
  const dform = ["dragon", null, "rook", "rook", "bishop", "queen", "king", "bishop", "knight", "knight"];
  let g = createGame(buildArmyFromFormation(() => 6, dform), buildArmyFromFormation(() => 4, map.defaultFormation), { map, rules: "hp", seed: 42 });
  const rng = makeRng(42);
  let plies = 0, dragonMoves = 0;
  while (plies < 80 && !status(g).over) {
    const m = chooseMove(g, 1, rng);
    if (!m) break;
    if (m.special === "dragonStep" || m.special === "dragonFly") dragonMoves++;
    g = applyMove(g, m); plies++;
  }
  ok("a full AI game with the big dragon ends cleanly", status(g).over === true && plies > 10);
  ok("the AI actually moved the beast", dragonMoves >= 1);
  ok("wing markers never orphan across a whole game",
    g.board.every((p) => !p || p.kind !== "D+" || g.board[p.ref]?.kind === "D"));
}

// ── the step-forward target sits UNDER his own 2x2 block (a wing square) ──
// the tap handler must let a valid move win over the "wing = dragon" redirect,
// or he can never walk forward. Here we assert the move is legal & lands right.
{
  const dform = ["dragon", null, "rook", "rook", "bishop", "queen", "king", "bishop", "knight", "knight"];
  const g = createGame(buildArmyFromFormation(() => 6, dform), buildArmyFromFormation(() => 4, map.defaultFormation), { map, rules: "hp", seed: 7 });
  const W2 = g.w;
  const anchor = g.board.findIndex((x) => x && x.big && x.kind === "D");
  const fwd = anchor + W2; // one square forward = his own lower-left wing cell
  ok("the dragon's forward square is currently a wing of his own block",
    g.board[fwd]?.kind === "D+" && g.board[fwd].ref === anchor);
  const step = legalMoves(g).find((m) => m.from === anchor && m.to === fwd);
  ok("stepping forward onto that wing square is a legal move", !!step);
  const g2 = applyMove(g, step);
  const newAnchor = g2.board.findIndex((x) => x && x.big && x.kind === "D");
  ok("after the step he has advanced one rank", ((newAnchor / W2) | 0) === ((anchor / W2) | 0) + 1);
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
