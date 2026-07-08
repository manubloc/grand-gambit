import { createGame, reduce, moveCommand, legalMoves, status, idx } from "./src/core/index.js";
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

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
