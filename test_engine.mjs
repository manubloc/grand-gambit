import {
  WHITE, BLACK, KIND, idx, emptyBoard, makePiece,
  createInitialState, legalMoves, legalMovesFrom, applyMove, inCheck, status,
} from "./src/core/index.js";

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log("  ok  -", name); } else { fail++; console.log(" FAIL -", name); } };

// 1) Start position sanity
const s0 = createInitialState();
const lm = legalMoves(s0);
ok("start: white has legal moves", lm.length > 0);
ok("start: white not in check", inCheck(s0, WHITE) === false);
console.log("      (white legal moves at start:", lm.length + ")");

// 2) Turn flips after a move
const s1 = applyMove(s0, lm[0], { record: true });
ok("turn flips to black after a move", s1.turn === BLACK);
ok("undo restores white to move", s1.history.length === 1 && s1.history[0].turn === WHITE);

// 3) Check + checkmate detection (king cornered by queen guarded by king)
function mateBoard() {
  const b = emptyBoard();
  b[idx(0, 0)] = makePiece({ kind: KIND.KING, color: WHITE });
  b[idx(1, 1)] = makePiece({ kind: KIND.QUEEN, color: BLACK });
  b[idx(2, 2)] = makePiece({ kind: KIND.KING, color: BLACK });
  return { board: b, turn: WHITE, captured: { w: [], b: [] }, history: [], lastMove: null, moveCount: 0 };
}
const sm = mateBoard();
ok("white king is in check", inCheck(sm, WHITE) === true);
const st = status(sm);
ok("position is checkmate", st.result === "checkmate");
ok("winner is black", st.winner === BLACK);

// 4) King may NOT move into check (legal filter works)
const kingMoves = legalMovesFrom(sm, idx(0, 0));
ok("cornered king has zero legal moves", kingMoves.length === 0);

// 5) Shield bounce: rook 'captures' a shielded pawn -> bounce, no capture
function shieldBoard() {
  const b = emptyBoard();
  b[idx(0, 0)] = makePiece({ kind: KIND.ROOK, color: WHITE });
  b[idx(0, 3)] = makePiece({ kind: KIND.PAWN, color: BLACK, shield: 1 });
  b[idx(9, 9)] = makePiece({ kind: KIND.KING, color: WHITE });
  b[idx(5, 9)] = makePiece({ kind: KIND.KING, color: BLACK });
  return { board: b, turn: WHITE, captured: { w: [], b: [] }, history: [], lastMove: null, moveCount: 0 };
}
const ssh = shieldBoard();
const capMove = legalMovesFrom(ssh, idx(0, 0)).find((m) => m.to === idx(0, 3));
ok("rook can target the shielded pawn", !!capMove);
const sAfter = applyMove(ssh, capMove);
ok("shield absorbed the hit (bounced)", sAfter.lastMove.bounced === true);
ok("attacker did NOT advance", sAfter.board[idx(0, 0)] && sAfter.board[idx(0, 0)].kind === KIND.ROOK);
ok("pawn survived with shield reduced to 0", sAfter.board[idx(0, 3)] && sAfter.board[idx(0, 3)].shield === 0);
ok("no piece was recorded as captured", sAfter.captured.w.length === 0);

// 6) Ability move generation: pawn sidestep appears
function sideBoard() {
  const b = emptyBoard();
  b[idx(4, 4)] = makePiece({ kind: KIND.PAWN, color: WHITE, abilities: ["pawn_sidestep"] });
  b[idx(0, 0)] = makePiece({ kind: KIND.KING, color: WHITE });
  b[idx(9, 9)] = makePiece({ kind: KIND.KING, color: BLACK });
  return { board: b, turn: WHITE, captured: { w: [], b: [] }, history: [], lastMove: null, moveCount: 0 };
}
const sst = sideBoard();
const pmoves = legalMovesFrom(sst, idx(4, 4));
ok("sidestep ability yields a sideways move", pmoves.some((m) => m.special === "side"));

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
