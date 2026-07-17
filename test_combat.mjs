import { createGame, reduce, moveCommand, legalMoves, legalMovesFrom, applyMove, status, idx } from "./src/core/index.js";
import { mapById } from "./src/content/index.js";

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log("  ok  -", n); } else { fail++; console.log(" FAIL -", n); } };

const spec = (k) => ({ kind: k, level: 1, abilities: [], shield: 0 });
const a8 = { back: ["R", "N", "B", "Q", "K", "B", "N", "R"].map(spec), pawn: spec("P") };
const classic = mapById("classic");

// ── stats are injected only in HP mode ───────────────────────────────────────
const hpGame = createGame(a8, a8, { map: classic, rules: "hp" });
const q = hpGame.board[idx(3, 0, 8)];
ok("HP mode gives the queen hp/maxHp/atk", q.hp === 7 && q.maxHp === 7 && q.atk === 4);
ok("HP mode gives the pawn small stats", hpGame.board[idx(0, 1, 8)].atk === 1);
const chessGame = createGame(a8, a8, { map: classic, rules: "chess" });
ok("chess mode leaves pieces without hp", chessGame.board[idx(3, 0, 8)].hp === undefined);
ok("HP mode has no check restriction (all pseudo legal)", legalMoves(hpGame).length === 20);

// ── controlled combat board ──────────────────────────────────────────────────
const W = (k, x = {}) => ({ id: Math.random(), kind: k, color: "w", level: 1, abilities: [], used: {}, shield: 0, ...x });
const B = (k, x = {}) => ({ id: Math.random(), kind: k, color: "b", level: 1, abilities: [], used: {}, shield: 0, ...x });
function hpState(board) { return { board, w: 8, h: 8, holes: new Set(), rules: "hp", turn: "w", captured: { w: [], b: [] }, history: [], lastMove: null, moveCount: 0, log: [], seed: 1 }; }

// queen (atk 4) attacks rook (hp 5) directly above → survives at 1, attacker bumps
let board = new Array(64).fill(null);
board[idx(0, 0, 8)] = W("Q", { hp: 7, maxHp: 7, atk: 4 });
board[idx(0, 1, 8)] = B("R", { hp: 5, maxHp: 5, atk: 3 });
board[idx(7, 7, 8)] = B("K", { hp: 10, maxHp: 10, atk: 3 });
board[idx(7, 0, 8)] = W("K", { hp: 10, maxHp: 10, atk: 3 });
let st = hpState(board);
const attack = legalMoves(st).find((m) => m.from === idx(0, 0, 8) && m.to === idx(0, 1, 8));
let r = reduce(st, moveCommand(attack));
ok("a non-lethal hit wounds the target", r.state.board[idx(0, 1, 8)].hp === 1);
ok("a non-lethal attacker bumps (stays put)", r.state.board[idx(0, 0, 8)] && r.state.board[idx(0, 0, 8)].kind === "Q");
ok("a wound emits a 'damaged' event", r.events.some((e) => e.type === "damaged") && !r.events.some((e) => e.type === "captured"));

// now the rook is at 1 hp → the same attack kills and the queen advances
board[idx(0, 1, 8)].hp = 1; st = hpState(board);
r = reduce(st, moveCommand(attack));
ok("a lethal hit removes the target and advances the attacker", r.state.board[idx(0, 1, 8)].kind === "Q" && r.state.board[idx(0, 0, 8)] === null);
ok("a kill emits a 'captured' event", r.events.some((e) => e.type === "captured"));

// ── regicide ends the game ───────────────────────────────────────────────────
let kb = new Array(64).fill(null);
kb[idx(6, 7, 8)] = W("Q", { hp: 7, maxHp: 7, atk: 4 });
kb[idx(7, 7, 8)] = B("K", { hp: 3, maxHp: 10, atk: 3 });
kb[idx(0, 0, 8)] = W("K", { hp: 10, maxHp: 10, atk: 3 });
let ks = hpState(kb);
const kill = legalMoves(ks).find((m) => m.to === idx(7, 7, 8));
let rk = reduce(ks, moveCommand(kill));
ok("killing the king ends the game (regicide)", status(rk.state).result === "regicide" && status(rk.state).winner === "w");
ok("regicide emits gameOver", rk.events.some((e) => e.type === "gameOver"));

// ── chess mode is unchanged: capture is instant ──────────────────────────────
let cb = new Array(64).fill(null);
cb[idx(0, 0, 8)] = W("Q"); cb[idx(0, 1, 8)] = B("R"); cb[idx(7, 7, 8)] = B("K"); cb[idx(7, 0, 8)] = W("K");
let cs = { board: cb, w: 8, h: 8, holes: new Set(), rules: "chess", turn: "w", captured: { w: [], b: [] }, history: [], lastMove: null, moveCount: 0, log: [], seed: 1 };
const cap = legalMoves(cs).find((m) => m.from === idx(0, 0, 8) && m.to === idx(0, 1, 8));
let rc = reduce(cs, moveCommand(cap));
ok("chess mode still captures instantly", rc.state.board[idx(0, 1, 8)].kind === "Q" && rc.state.board[idx(0, 0, 8)] === null);

// ── new abilities ────────────────────────────────────────────────────────────
const ab = (k, side, x) => ({ id: Math.random(), kind: k, color: side, level: 1, abilities: [], used: {}, shield: 0, hp: 5, maxHp: 5, atk: 3, ...x });
const kings = (bd) => { bd[idx(7, 7, 8)] = ab("K", "b", { hp: 10, maxHp: 10 }); bd[idx(7, 0, 8)] = ab("K", "w", { hp: 10, maxHp: 10 }); };

// ranged snipe: hits at distance, attacker stays even on kill
let rb = new Array(64).fill(null);
rb[idx(0, 0, 8)] = ab("B", "w", { abilities: ["ranged_shot"], atk: 9 });
rb[idx(0, 3, 8)] = ab("R", "b", { hp: 5, maxHp: 5 });
kings(rb);
let rs = hpState(rb);
const shot = legalMoves(rs).find((m) => m.special === "shot" && m.to === idx(0, 3, 8));
ok("ranged attack is generated at distance", !!shot && shot.noAdvance);
let rr = reduce(rs, moveCommand(shot));
ok("ranged kill removes target but shooter stays put", rr.state.board[idx(0, 3, 8)] === null && rr.state.board[idx(0, 0, 8)].kind === "B");

// lifesteal heals the attacker
let lb = new Array(64).fill(null);
lb[idx(0, 0, 8)] = ab("Q", "w", { abilities: ["lifesteal"], hp: 3, maxHp: 9, atk: 4 });
lb[idx(1, 1, 8)] = ab("R", "b", { hp: 9, maxHp: 9 });
kings(lb);
let lr = reduce(hpState(lb), moveCommand({ from: idx(0, 0, 8), to: idx(1, 1, 8), piece: 1, kind: "Q", color: "w", capture: true, captureKind: "R" }));
ok("lifesteal heals the attacker on a hit", lr.state.board[idx(0, 0, 8)].hp === 5);

// bulwark reduces incoming damage
let bb = new Array(64).fill(null);
bb[idx(0, 0, 8)] = ab("Q", "w", { atk: 4 });
bb[idx(1, 1, 8)] = ab("R", "b", { hp: 9, maxHp: 9, abilities: ["bulwark"] });
kings(bb);
let br = reduce(hpState(bb), moveCommand({ from: idx(0, 0, 8), to: idx(1, 1, 8), piece: 1, kind: "Q", color: "w", capture: true, captureKind: "R" }));
ok("bulwark soaks 1 damage", br.state.board[idx(1, 1, 8)].hp === 6);

// regen heals 1 on moving
let gb = new Array(64).fill(null);
gb[idx(0, 0, 8)] = ab("R", "w", { abilities: ["regen"], hp: 4, maxHp: 9 });
kings(gb);
let gr = reduce(hpState(gb), moveCommand(legalMoves(hpState(gb)).find((m) => m.from === idx(0, 0, 8) && !m.capture)));
ok("regen heals 1 HP when moving", [...gr.state.board].find((p) => p && p.kind === "R" && p.color === "w").hp === 5);


// ── the TWO houses: crown and shadow, plus the boss auras ────────────────────
import { shiftCommand, potionCommand as potCmd, familyOf, crownWallSoak, crownHp, shadowRifts, shadowAtk, encodeState, decodeState } from "./src/core/index.js";
import { bossSpec, bossById } from "./src/content/index.js";
{
  // shadow ladder: 4 fielded shadows → +1 atk each and 2 rifts banked
  const sh4 = { back: ["H", "S", "O", "Z", "K", "B", "N", "R"].map(spec), pawn: spec("P") };
  const g4 = createGame(sh4, a8, { map: classic, rules: "hp" });
  const hawk4 = g4.board[idx(0, 0, 8)];
  const sh1 = { back: ["H", "N", "B", "Q", "K", "B", "N", "R"].map(spec), pawn: spec("P") };
  const hawk1 = createGame(sh1, a8, { map: classic, rules: "hp" }).board[idx(0, 0, 8)];
  ok("shadow ladder: 4 shadows → +1 atk each & 2 rifts", hawk4.atk === hawk1.atk + 1 && g4.shifts.w === 2);
  ok("family helpers agree", familyOf(hawk4) === "shadow" && shadowRifts(2) === 1 && shadowRifts(6) === 3 && shadowAtk(3) === 0 && crownHp(4) === 1 && crownWallSoak(6) === 2);

  // a banked rift keeps the turn exactly once
  const armed = reduce(g4, shiftCommand("w")).state;
  ok("arming a rift spends it without ending the turn", armed.shifts.w === 1 && armed.shiftArmed === "w" && armed.turn === "w");
  const afterMove = reduce(armed, moveCommand(legalMoves(armed)[0])).state;
  ok("the rifted move keeps the turn — exactly once", afterMove.turn === "w" && afterMove.shiftArmed === null);
  ok("rifts survive the codec", decodeState(encodeState(armed)).shifts.w === 1 && decodeState(encodeState(armed)).shiftArmed === "w");

  // crown ladder: 4 crowns → +1 max HP each; the wall soaks 1 while flanked
  const cr4 = { back: ["G", "U", "I", "J", "K", "B", "N", "R"].map(spec), pawn: spec("P") };
  const cg = createGame(cr4, a8, { map: classic, rules: "hp" });
  const guard4 = cg.board[idx(0, 0, 8)];
  const cr1 = { back: ["G", "N", "B", "Q", "K", "B", "N", "R"].map(spec), pawn: spec("P") };
  const guard1 = createGame(cr1, a8, { map: classic, rules: "hp" }).board[idx(0, 0, 8)];
  ok("crown ladder: 4 crowns → +1 max HP each", guard4.maxHp === guard1.maxHp + 1);
  const st0 = { ...cg, board: cg.board.slice(), turn: "b" };
  const bq = { id: 999, kind: "Q", color: "b", level: 1, abilities: [], shield: 0, used: {}, hasMoved: true, maxHp: 7, hp: 7, atk: 4 };
  st0.board[idx(0, 1, 8)] = null; st0.board[idx(1, 1, 8)] = null;
  st0.board[idx(0, 2, 8)] = bq;
  const strike = legalMoves(st0).find((m) => m.from === idx(0, 2, 8) && m.to === idx(0, 0, 8));
  const hitG = reduce(st0, moveCommand(strike)).state.board[idx(0, 0, 8)];
  ok("living shield wall: flanked crown soaks 1 (4 atk → 3 dmg)", hitG && hitG.maxHp - hitG.hp === 3);
  const stL = { ...createGame(cr1, a8, { map: classic, rules: "hp" }) };
  stL.board = stL.board.slice(); stL.turn = "b";
  stL.board[idx(0, 1, 8)] = null; stL.board[idx(0, 2, 8)] = { ...bq };
  const strikeL = legalMoves(stL).find((m) => m.from === idx(0, 2, 8) && m.to === idx(0, 0, 8));
  const lone = reduce(stL, moveCommand(strikeL)).state.board[idx(0, 0, 8)];
  ok("no wall for the lone crown piece: full damage", lone && lone.maxHp - lone.hp === 4);

  // boss auras bend the whole match
  const withBoss = (bid) => {
    const back = ["R", "N", "B", "Q", "K", "B", "N", "R"].map(spec);
    back[3] = { ...bossSpec(bossById(bid)) };
    return createGame({ back, pawn: spec("P") }, a8, { map: classic, rules: "hp" });
  };
  const disc = withBoss("b25"); // courtHp 1
  ok("courtHp aura: the League Master grants his court +1 HP", disc.board[idx(4, 0, 8)].maxHp === 11); // king 10 → 11
  const iron = withBoss("b14"); // grant bulwark
  ok("grant aura: the Colossus makes his court bulwarks", iron.board[idx(0, 0, 8)].abilities.includes("bulwark"));
  const judge = withBoss("b12"); // noEnemyPotions
  const js = { ...judge, potions: { w: 0, b: 1 }, turn: "b", board: judge.board.slice() };
  const hurtIx = js.board.findIndex((p) => p && p.color === "b" && p.kind === "P");
  js.board[hurtIx] = { ...js.board[hurtIx], hp: 1 };
  ok("noEnemyPotions aura: the Judge forbids hostile draughts", reduce(js, potCmd("b", hurtIx)).state === js);
}

// ── v0.22.4: ENERGY — the second resource ────────────────────────────────────
{
  const g = createGame(a8, a8, { map: classic, rules: "hp", seed: 5 });
  ok("every hp piece carries energy", g.board.filter(Boolean).every((p) => p.kind === "D+" || (p.maxEn > 0 && p.en === p.maxEn)));
  const { BASE_EN } = await import("./src/core/index.js");
  ok("the mage brims, the colossus rations (class law)", (BASE_EN.M || 0) > (BASE_EN.G || 0));
  // a pawn learns the ranged shot: with energy the move exists, drained it vanishes
  const pawns = g.board.map((p, j) => (p && p.kind === "P" && p.color === "w" ? j : -1)).filter((j) => j >= 2);
  const pi = pawns[3]; // a mid-file pawn: room for a flat 2-square firing lane
  g.board[pi].abilities = ["ranged_shot"]; g.board[pi].used = g.board[pi].used || {};
  g.board[pi].en = 2; g.board[pi].maxEn = 3;
  g.board[pi - 1] = null; // clear the lane ...
  g.board[pi - 2] = { kind: "P", color: "b", level: 1, abilities: [], used: {}, shield: 0,
    hp: 2, maxHp: 2, atk: 1, en: 1, maxEn: 1 }; // ... and stand a target at range 2
  const shots = legalMovesFrom(g, pi).filter((m) => m.consumes === "ranged_shot");
  ok("with 2 energy the 2-cost shot is offered", shots.length > 0);
  if (shots.length) {
    const after = applyMove(g, shots[0]);
    const st2 = after.state ?? after;
    const shooter = st2.board.find((p) => p && p.kind === "P" && p.color === "w" && p.used && p.used.ranged_shot);
    ok("firing drains the cost (2 -> 0)", shooter && shooter.en === 0);
    const dryShots = shooter ? legalMovesFrom(st2, st2.board.indexOf(shooter)).filter((m) => m.consumes === "ranged_shot") : [];
    ok("drained pieces fall back to plain moves", dryShots.length === 0);
  }
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
