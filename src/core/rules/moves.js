import {
  FILES, RANKS, KIND, DIAG, ORTHO, KING_STEPS, KNIGHT_JUMPS, LONG_LEAPS, DIAG_LEAPS,
  fileOf, rankOf, dirOf, startPawnRank, promoRank,
} from "../domain/constants.js";

export function hasAbility(piece, id) {
  // ONE SPELL PER GAME: a piece may KNOW many talents, but may FIRE only one
  // across the whole battle. The first use closes the book — used{} is the
  // ledger, so any prior entry silences every remaining active talent.
  if (!piece.abilities.includes(id)) return false;
  return Object.keys(piece.used || {}).length === 0;
}

// ── Board-shape context ──────────────────────────────────────────────────────
// D carries the dimensions + hole mask for the current match. A hole behaves
// like a wall: nothing lands on it and sliders are blocked by it.
const NO_HOLES = new Set();
const dimsOf = (state) => ({ w: state.w ?? FILES, h: state.h ?? RANKS, holes: state.holes ?? NO_HOLES });
const ix = (f, r, D) => r * D.w + f;
const onBoard = (f, r, D) => f >= 0 && f < D.w && r >= 0 && r < D.h && !D.holes.has(r * D.w + f);

function push(moves, from, to, piece, capture, captureKind, extra) {
  moves.push({ from, to, piece: piece.id, kind: piece.kind, color: piece.color, capture, captureKind, ...extra });
}

// Add a single non-sliding target (knight/king style). Skips own pieces + holes.
function step(moves, from, f, r, piece, board, D, extra) {
  if (!onBoard(f, r, D)) return;
  const t = board[ix(f, r, D)];
  if (t && t.color === piece.color) return;
  push(moves, from, ix(f, r, D), piece, !!t, t ? t.kind : null, extra || {});
}

// Slide along directions until blocked (own piece, capture, edge or hole).
function slide(moves, from, f0, r0, dirs, piece, board, D) {
  for (const [df, dr] of dirs) {
    let f = f0 + df, r = r0 + dr;
    while (onBoard(f, r, D)) {
      const t = board[ix(f, r, D)];
      if (t && t.color === piece.color) break;
      push(moves, from, ix(f, r, D), piece, !!t, t ? t.kind : null, {});
      if (t) break;
      f += df; r += dr;
    }
  }
}

function pawnMoves(moves, from, f, r, piece, board, D) {
  const dir = dirOf(piece.color);
  const early = hasAbility(piece, "pawn_early_promo");
  const promoR = promoRank(piece.color, D.h);
  const startR = startPawnRank(piece.color, D.h);
  const isPromo = (rr) => rr === promoR || (early && rr === promoR - dir);

  const fwd = r + dir;
  if (onBoard(f, fwd, D) && !board[ix(f, fwd, D)]) {
    push(moves, from, ix(f, fwd, D), piece, false, null, isPromo(fwd) ? { promotion: KIND.QUEEN } : {});
    const r2 = r + 2 * dir;
    if (r === startR && onBoard(f, r2, D) && !board[ix(f, r2, D)])
      push(moves, from, ix(f, r2, D), piece, false, null, { double: true });
  }
  // diagonal captures
  for (const df of [-1, 1]) {
    const cf = f + df, cr = fwd;
    if (!onBoard(cf, cr, D)) continue;
    const t = board[ix(cf, cr, D)];
    if (t && t.color !== piece.color)
      push(moves, from, ix(cf, cr, D), piece, true, t.kind, isPromo(cr) ? { promotion: KIND.QUEEN } : {});
  }
  // ABILITY: forward capture (once)
  if (hasAbility(piece, "pawn_forward_capture") && onBoard(f, fwd, D)) {
    const t = board[ix(f, fwd, D)];
    if (t && t.color !== piece.color)
      push(moves, from, ix(f, fwd, D), piece, true, t.kind, { special: "fcap", consumes: "pawn_forward_capture", ...(isPromo(fwd) ? { promotion: KIND.QUEEN } : {}) });
  }
  // ABILITY: sidestep (once, non-capturing)
  if (hasAbility(piece, "pawn_sidestep")) {
    for (const df of [-1, 1]) {
      const sf = f + df;
      if (onBoard(sf, r, D) && !board[ix(sf, r, D)])
        push(moves, from, ix(sf, r, D), piece, false, null, { special: "side", consumes: "pawn_sidestep" });
    }
  }
  // ABILITY: charge (passive) — advance two squares forward from anywhere
  if (hasAbility(piece, "pawn_charge") && r !== startR) {
    const r2 = r + 2 * dir;
    if (onBoard(f, fwd, D) && onBoard(f, r2, D) && !board[ix(f, fwd, D)] && !board[ix(f, r2, D)])
      push(moves, from, ix(f, r2, D), piece, false, null, { special: "rush" });
  }
  // ABILITY: backstep (once, non-capturing) — retreat one square
  if (hasAbility(piece, "pawn_backstep")) {
    const br = r - dir;
    if (onBoard(f, br, D) && !board[ix(f, br, D)])
      push(moves, from, ix(f, br, D), piece, false, null, { special: "back", consumes: "pawn_backstep" });
  }
}

/** All pseudo-legal moves for the piece at sqIndex (ignores king safety). */
export function pieceMoves(state, sqIndex) {
  const board = state.board;
  const piece = board[sqIndex];
  if (!piece) return [];
  const D = dimsOf(state);
  const f = fileOf(sqIndex, D.w), r = rankOf(sqIndex, D.w), from = sqIndex, moves = [];

  switch (piece.kind) {
    case KIND.PAWN: pawnMoves(moves, from, f, r, piece, board, D); break;
    case KIND.KNIGHT: for (const [df, dr] of KNIGHT_JUMPS) step(moves, from, f + df, r + dr, piece, board, D); break;
    case KIND.KING: for (const [df, dr] of KING_STEPS) step(moves, from, f + df, r + dr, piece, board, D); break;
    case KIND.BISHOP: slide(moves, from, f, r, DIAG, piece, board, D); break;
    case KIND.ROOK: slide(moves, from, f, r, ORTHO, piece, board, D); break;
    case KIND.QUEEN: slide(moves, from, f, r, KING_STEPS, piece, board, D); break;
    case KIND.CHANCELLOR:
      slide(moves, from, f, r, ORTHO, piece, board, D);
      for (const [df, dr] of KNIGHT_JUMPS) step(moves, from, f + df, r + dr, piece, board, D);
      break;
    case KIND.ARCHBISHOP:
      slide(moves, from, f, r, DIAG, piece, board, D);
      for (const [df, dr] of KNIGHT_JUMPS) step(moves, from, f + df, r + dr, piece, board, D);
      break;
    case KIND.HAWK: // knight + one diagonal step (nimble flank skirmisher)
      for (const [df, dr] of KNIGHT_JUMPS) step(moves, from, f + df, r + dr, piece, board, D);
      for (const [df, dr] of DIAG) step(moves, from, f + df, r + dr, piece, board, D);
      break;
    case KIND.AMAZON: // queen + knight (the super-piece)
      slide(moves, from, f, r, KING_STEPS, piece, board, D);
      for (const [df, dr] of KNIGHT_JUMPS) step(moves, from, f + df, r + dr, piece, board, D);
      break;
  }

  // ── Ability-granted moves ────────────────────────────────────────────────
  if (piece.kind === KIND.KNIGHT && hasAbility(piece, "knight_longleap"))
    for (const [df, dr] of LONG_LEAPS) step(moves, from, f + df, r + dr, piece, board, D, { special: "leap" });

  if (piece.kind === KIND.KNIGHT && hasAbility(piece, "knight_outrider"))
    for (const [df, dr] of DIAG_LEAPS) step(moves, from, f + df, r + dr, piece, board, D, { special: "leap" });

  if ((piece.kind === KIND.ROOK || piece.kind === KIND.CHANCELLOR) && hasAbility(piece, "rook_diag_step"))
    for (const [df, dr] of DIAG) step(moves, from, f + df, r + dr, piece, board, D, { special: "step" });

  if ((piece.kind === KIND.ROOK || piece.kind === KIND.CHANCELLOR) && hasAbility(piece, "rook_breach"))
    for (const [df, dr] of ORTHO) {
      const af = f + df, ar = r + dr, lf = f + 2 * df, lr = r + 2 * dr;
      if (onBoard(lf, lr, D) && board[ix(af, ar, D)]) { // adjacent orthogonal occupied → breach over it
        const land = board[ix(lf, lr, D)];
        if (!land || land.color !== piece.color)
          push(moves, from, ix(lf, lr, D), piece, !!land, land ? land.kind : null, { special: "breach", consumes: "rook_breach" });
      }
    }

  if (piece.kind === KIND.QUEEN && hasAbility(piece, "queen_knightleap"))
    for (const [df, dr] of KNIGHT_JUMPS) step(moves, from, f + df, r + dr, piece, board, D, { special: "leap", consumes: "queen_knightleap" });

  if (piece.kind === KIND.KING && hasAbility(piece, "king_dash"))
    for (const [df, dr] of ORTHO) {
      const mf = f + df, mr = r + dr, lf = f + 2 * df, lr = r + 2 * dr;
      if (onBoard(mf, mr, D) && onBoard(lf, lr, D) && !board[ix(mf, mr, D)]) {
        const land = board[ix(lf, lr, D)];
        if (!land || land.color !== piece.color)
          push(moves, from, ix(lf, lr, D), piece, !!land, land ? land.kind : null, { special: "dash", consumes: "king_dash" });
      }
    }

  if ((piece.kind === KIND.BISHOP || piece.kind === KIND.ARCHBISHOP) && hasAbility(piece, "bishop_hop"))
    for (const [df, dr] of DIAG) {
      const af = f + df, ar = r + dr, lf = f + 2 * df, lr = r + 2 * dr;
      if (onBoard(lf, lr, D) && board[ix(af, ar, D)]) { // adjacent diagonal occupied → hop over it
        const land = board[ix(lf, lr, D)];
        if (!land || land.color !== piece.color)
          push(moves, from, ix(lf, lr, D), piece, !!land, land ? land.kind : null, { special: "hop", consumes: "bishop_hop" });
      }
    }

  if ((piece.kind === KIND.BISHOP || piece.kind === KIND.ARCHBISHOP) && hasAbility(piece, "bishop_ortho_step"))
    for (const [df, dr] of ORTHO) step(moves, from, f + df, r + dr, piece, board, D, { special: "step", consumes: "bishop_ortho_step" });

  if (piece.big && piece.kind === "D") { bigDragonMoves(moves, from, piece, board, { ...D, rules: state.rules }); return moves; }
  if (piece.kind === "D+") return moves; // wing markers never move themselves

  // ── data-driven movement (bosses / special units): a moveSpec on the piece
  // REPLACES its normal movement. Leaps are single jumps; slides are rays with
  // an optional max range; `spawn` lets the piece create a pawn on an empty
  // adjacent square instead of moving (while charges last).
  if (piece.moveSpec) {
    const sp = piece.moveSpec;
    for (const [df, dr] of sp.leaps || []) step(moves, from, f + df, r + dr, piece, board, D, { special: "leap" });
    const R = sp.range || 99;
    for (const [df, dr] of sp.slides || []) {
      for (let k = 1; k <= R; k++) {
        const nf = f + df * k, nr = r + dr * k;
        if (!onBoard(nf, nr, D)) break;
        const t = board[ix(nf, nr, D)];
        if (!t) { push(moves, from, ix(nf, nr, D), piece, false, null, {}); continue; }
        if (t.color !== piece.color) push(moves, from, ix(nf, nr, D), piece, true, t.kind, {});
        break;
      }
    }
    if (sp.spawn && (piece.spawnLeft || 0) > 0) {
      for (const [df, dr] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]) {
        const nf = f + df, nr = r + dr;
        if (!onBoard(nf, nr, D)) continue;
        if (!board[ix(nf, nr, D)]) push(moves, from, ix(nf, nr, D), piece, false, null, { special: "spawn" });
      }
    }
    return moves;
  }

  // ── ranged attack: hit the first enemy in line of sight (you stay put) ──
  if (hasAbility(piece, "ranged_volley") || hasAbility(piece, "ranged_shot")) {
    const consume = hasAbility(piece, "ranged_volley") ? null : "ranged_shot";
    const MAXR = 4;
    for (const [df, dr] of KING_STEPS) {
      let af = f + df, ar = r + dr, dist = 1;
      while (dist <= MAXR && onBoard(af, ar, D)) {
        const t = board[ix(af, ar, D)];
        if (t) {
          if (t.color !== piece.color && dist >= 2)
            push(moves, from, ix(af, ar, D), piece, true, t.kind, { special: "shot", noAdvance: true, ...(consume ? { consumes: consume } : {}) });
          break; // a shot stops at the first piece it meets
        }
        af += df; ar += dr; dist++;
      }
    }
  }

  // ── teleport: blink to a nearby empty square ──
  if (hasAbility(piece, "teleport")) {
    const R = 2;
    for (let dr = -R; dr <= R; dr++) for (let df = -R; df <= R; df++) {
      if (df === 0 && dr === 0) continue;
      const tf = f + df, tr = r + dr;
      if (onBoard(tf, tr, D) && !board[ix(tf, tr, D)])
        push(moves, from, ix(tf, tr, D), piece, false, null, { special: "blink", consumes: "teleport" });
    }
  }

  return moves;
}

/** All pseudo-legal moves for a color. */
export function pseudoMoves(state, color) {
  const out = [], b = state.board;
  const mateRules = state.rules !== "hp";
  for (let i = 0; i < b.length; i++) {
    const p = b[i];
    if (p && p.color === color) {
      const m = pieceMoves(state, i);
      for (let j = 0; j < m.length; j++) {
        // BALANCE (mate rules only): the long leap cannot strike a crowned
        // head. Extended-leap abilities kept smother-mating the boxed-in
        // starting king in 2-3 moves; movement and normal captures stay,
        // but a leap never targets the king and thus never gives check.
        // HP duels are untouched — there the king has hit points and shields.
        if (mateRules && m[j].special === "leap" && b[m[j].to]?.kind === KIND.KING) continue;
        out.push(m[j]);
      }
    }
  }
  return out;
}

// ── THE BIG DRAGON (2x2): one piece, four squares ────────────────────────────
// The anchor is the block's lower-left index; the other three cells carry
// markers { kind: "D+", color, ref: anchor }. Legacy 1x1 dragons (no `big`
// flag) keep their old leap moveSpec untouched.
export const dragonBlock = (a, w) => [a, a + 1, a + w, a + w + 1];
export const dragonAnchorOf = (board, i) => {
  const pc = board[i];
  if (!pc) return -1;
  if (pc.kind === "D+") return pc.ref;
  return pc.big && pc.kind === "D" ? i : -1;
};
function dragonBlockFree(board, holes, w, h, a, self, forColor, allowEnemies, noKing) {
  const f = a % w, r = (a / w) | 0;
  if (f < 0 || f > w - 2 || r < 0 || r > h - 2) return false;
  for (const c of dragonBlock(a, w)) {
    if (holes && holes.has(c)) return false;
    const oc = board[c];
    if (!oc) continue;
    if (oc === self || (oc.kind === "D+" && oc.ref !== undefined && board[oc.ref] === self)) continue;
    if (!allowEnemies) return false;
    if (oc.color === self.color) return false;
    if (noKing && oc.kind === "K") return false; // may never smother the king
  }
  return true;
}
function bigDragonMoves(moves, from, piece, board, D) {
  const { w, h, holes, rules } = D;
  // ON FOOT: one square in the four orthogonal directions. He may crush a foe
  // caught under his leading edge (but never smother the king in classic play).
  for (const d of [-1, 1, -w, w]) {
    const a2 = from + d;
    if (dragonBlockFree(board, holes, w, h, a2, piece, piece.color, true, rules !== "hp"))
      moves.push({ from, to: a2, special: "dragonStep" });
  }
  // FLIGHT: once per game, range grows with the unlocked wing. Landing on foes
  // is a direct strike on every covered square — survivors throw him back.
  const abil = piece.abilities || [];
  if (abil.includes("dragon_flight") && !(piece.used || {}).dragon_flight) {
    const range = 2 + (abil.includes("dragon_flight2") ? 1 : 0) + (abil.includes("dragon_flight3") ? 1 : 0);
    const f0 = from % w, r0 = (from / w) | 0;
    for (let df = -range; df <= range; df++) for (let dr = -range; dr <= range; dr++) {
      if (!df && !dr) continue;
      const a2 = from + df + dr * w;
      const f2 = f0 + df, r2 = r0 + dr;
      if (f2 < 0 || f2 > w - 2 || r2 < 0 || r2 > h - 2) continue;
      if (dragonBlockFree(board, holes, w, h, a2, piece, piece.color, true, rules !== "hp"))
        moves.push({ from, to: a2, special: "dragonFly" });
    }
  }
}
