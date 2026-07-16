import { other, WHITE, BLACK, BASE_HP, BASE_ATK } from "../domain/constants.js";
import { cloneBoard, findKing } from "../domain/board.js";
import { pseudoMoves, pieceMoves } from "../rules/moves.js";
import { inCheck } from "../rules/attacks.js";
import { familyOf, familyCount, crownWallSoak } from "../rules/families.js";

export function cloneState(state) {
  return {
    board: cloneBoard(state.board),
    w: state.w, h: state.h, holes: state.holes, // board geometry is immutable per match → shared by ref
    rules: state.rules,
    turn: state.turn,
    captured: { w: [...state.captured.w], b: [...state.captured.b] },
    potions: state.potions, // carried through every move; the POTION command replaces it immutably
    shifts: state.shifts,       // Time Rifts (magic circle) — the SHIFT command replaces it immutably
    shiftArmed: state.shiftArmed ?? null,
    history: state.history, // shared by reference; only real moves push to it
    lastMove: state.lastMove,
    moveCount: state.moveCount,
    log: state.log,
    seed: state.seed,
  };
}

// In HP mode a promoting piece adopts the new kind's stats.
function repromote(piece, kind) {
  piece.kind = kind;
  if (piece.maxHp != null) { piece.maxHp = BASE_HP[kind] || piece.maxHp; piece.hp = piece.maxHp; piece.atk = BASE_ATK[kind] || piece.atk; }
}

/**
 * Apply a move and return a NEW state (immutable). Pass {record:true} for real
 * moves so undo works; search uses record:false.
 *
 * CHESS rules: capturing removes the target and the attacker advances. A shielded
 * target absorbs one hit (attacker bounces, shield consumed).
 * HP rules: an attack deals the attacker's `atk` as damage. If it kills, the
 * attacker advances onto the square; if the target survives, the attacker stays
 * put (a "bump"). Either way the move costs a turn. Regicide ends the game.
 */
export function applyMove(state, move, opts) {
  const record = !!(opts && opts.record);
  const hp = state.rules === "hp";
  const ns = cloneState(state);
  const b = ns.board;
  const piece = b[move.from];
  if (!piece) return state;
  // blows aimed at a dragon's WING strike the dragon himself; when the beast
  // falls, all four of his squares clear at once
  let target = b[move.to];
  let dragonAnchor = -1;
  if (target && target.kind === "D+") { dragonAnchor = target.ref; target = b[target.ref]; }
  else if (target && target.big && target.kind === "D") dragonAnchor = move.to;
  const clearDragon = (a) => {
    const W2 = ns.w ?? 10;
    for (const c of [a, a + 1, a + W2, a + W2 + 1]) {
      const oc = b[c];
      if (oc && (c === a || (oc.kind === "D+" && oc.ref === a))) b[c] = null;
    }
  };

  let bounced = false, damaged = false, lethal = false, dmg = 0;

  // ── spawn: the piece stays put and creates a pawn on an empty adjacent
  // square (bosses with a spawn budget). Costs the turn like any move. ──
  if (move.special === "spawn") {
    if ((piece.spawnLeft || 0) > 0 && !target) {
      const pawn = { id: (state.moveCount + 1) * 100000 + move.to, kind: "P", color: piece.color,
        level: 1, abilities: [], shield: 0, used: {}, hasMoved: true };
      if (hp) { pawn.maxHp = BASE_HP.P; pawn.hp = pawn.maxHp; pawn.atk = BASE_ATK.P; }
      b[move.to] = pawn;
      piece.spawnLeft -= 1;
    }
    if (ns.shiftArmed === piece.color) { ns.turn = piece.color; ns.shiftArmed = null; }
    else ns.turn = other(state.turn);
    ns.lastMove = { from: move.from, to: move.to, color: piece.color, kind: piece.kind, capture: false, spawned: true, special: "spawn" };
    ns.moveCount = state.moveCount + 1;
    if (record) { ns.history = [...state.history, state]; }
    return ns;
  }


  // ── THE BIG DRAGON moves as a 2x2 block ─────────────────────────────────────
  // dragonStep: the block shifts one square — slow, never onto anyone.
  // dragonFly: ONCE per game the block leaps. Landing on foes is a direct
  // strike on every covered square; in hp play, SURVIVORS throw him back to
  // where he took off (the strike still counts). After settling (step or
  // flight), his sheer weight bruises every adjacent foe: ceil(atk/2).
  if (move.special === "dragonStep" || move.special === "dragonFly") {
    const W = ns.w ?? 10;
    const block = (a) => [a, a + 1, a + W, a + W + 1];
    const oldCells = block(move.from), newCells = block(move.to);
    for (const c of oldCells) b[c] = null;                    // lift off
    let settled = true;
    if (move.special === "dragonFly") {
      piece.used = { ...(piece.used || {}), dragon_flight: true };
      const covered = newCells.map((c) => b[c]).filter((oc) => oc && oc.color !== piece.color);
      if (hp) {
        for (const oc of covered) {
          const before = oc.hp;
          oc.hp = Math.max(0, oc.hp - (oc.shield > 0 ? Math.max(1, piece.atk - 1) : piece.atk));
          if (oc.shield > 0) oc.shield -= 1;
          damaged = damaged || oc.hp < before;
          if (oc.hp <= 0) {
            lethal = true;
            ns.captured[piece.color].push(oc.kind);
            for (const c2 of newCells) if (b[c2] === oc) b[c2] = null;
          }
        }
        settled = newCells.every((c) => !b[c]);               // any survivor throws him back
      } else {
        for (const oc of covered) {
          ns.captured[piece.color].push(oc.kind);
          for (const c2 of newCells) if (b[c2] === oc) b[c2] = null;
        }
      }
    }
    const home = settled ? move.to : move.from;
    b[home] = piece;
    for (const c of block(home)) if (c !== home) b[c] = { kind: "D+", color: piece.color, ref: home };
    piece.hasMoved = true;
    if (hp) {
      // the weight of him: every foe pressed against the block takes half his fury
      const aura = Math.max(1, Math.ceil(piece.atk / 2));
      const seen = new Set();
      for (const c of block(home)) {
        const f0 = c % W, r0 = (c / W) | 0;
        for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) {
          const f2 = f0 + df, r2 = r0 + dr;
          if (f2 < 0 || f2 >= W || r2 < 0 || r2 >= (ns.h ?? 10)) continue;
          const i2 = r2 * W + f2;
          const oc = b[i2];
          if (!oc || oc.color === piece.color || oc.kind === "D+" || seen.has(oc.id ?? i2)) continue;
          seen.add(oc.id ?? i2);
          const before = oc.hp;
          oc.hp = Math.max(0, oc.hp - (oc.shield > 0 ? Math.max(1, aura - 1) : aura));
          if (oc.shield > 0) oc.shield -= 1;
          damaged = damaged || oc.hp < before;
          if (oc.hp <= 0) { lethal = true; ns.captured[piece.color].push(oc.kind); b[i2] = null; }
        }
      }
    }
    if (ns.shiftArmed === piece.color) { ns.turn = piece.color; ns.shiftArmed = null; }
    else ns.turn = other(state.turn);
    ns.lastMove = { from: move.from, to: settled ? move.to : move.from, color: piece.color, kind: piece.kind,
      capture: lethal, damaged, lethal, special: move.special, bounced: !settled };
    ns.moveCount = state.moveCount + 1;
    if (record) { ns.history = [...state.history, state]; }
    return ns;
  }

  if (hp) {
    const has = (id) => piece.abilities.includes(id);
    if (target) {
      // the SHIELD WALL: a crown piece flanked orthogonally by crown kin soaks
      // damage — 1 while 2+ crown stand, 2 from 6+. The wall is living: it is
      // read off the CURRENT board, so it crumbles as the court falls.
      const W = state.w || 8, H2 = state.h || 8, ti = move.to, tf = ti % W;
      const flanked = familyOf(target) === "crown" && [
        tf > 0 ? ti - 1 : -1, tf < W - 1 ? ti + 1 : -1, ti - W, ti + W,
      ].some((n) => { const q = n >= 0 && n < W * H2 ? b[n] : null;
        return q && q !== target && q.color === target.color && familyOf(q) === "crown"; });
      const wall = flanked ? crownWallSoak(familyCount(b, target.color, "crown")) : 0;
      // wardAdj aura: allies orthogonally beside their fielded boss stand warded
      const warded = [tf > 0 ? ti - 1 : -1, tf < W - 1 ? ti + 1 : -1, ti - W, ti + W]
        .some((n) => { const q = n >= 0 && n < W * H2 ? b[n] : null;
          return q && q.color === target.color && q.aura && q.aura.type === "wardAdj"; });
      const soak = (target.abilities.includes("bulwark") ? 1 : 0) + wall + (warded ? 1 : 0);
      // BALANCE: strikes from afar carry less weight — a leap or a ranged
      // shot lands at HALF force (rounded up); melee keeps its full bite.
      const afar = move.special === "leap" || move.special === "shot" || move.noAdvance;
      const force = afar ? Math.ceil((piece.atk || 1) / 2) : (piece.atk || 1);
      dmg = Math.max(1, force - soak);
      target.hp -= dmg;
      if (move.consumes) piece.used[move.consumes] = true;
      if (has("lifesteal")) piece.hp = Math.min(piece.maxHp, piece.hp + Math.ceil(dmg / 2));
      if (target.hp <= 0) {                       // kill
        lethal = true;
        ns.captured[piece.color].push(target.kind);
        if (dragonAnchor >= 0) clearDragon(dragonAnchor);  // the beast falls: all four squares clear
        if (move.noAdvance) {                      // ranged kill: target gone, shooter stays
          b[move.to] = null;
        } else {                                   // melee kill: attacker advances
          b[move.to] = piece; b[move.from] = null; piece.hasMoved = true;
          if (move.promotion) repromote(piece, move.promotion);
        }
      } else {
        damaged = true;                            // bump / ranged hit: attacker stays, target wounded
      }
    } else {                                       // quiet move
      b[move.to] = piece; b[move.from] = null; piece.hasMoved = true;
      if (move.consumes) piece.used[move.consumes] = true;
      if (move.promotion) repromote(piece, move.promotion);
    }
    if (has("regen")) piece.hp = Math.min(piece.maxHp, (piece.hp || 0) + 1);
  } else {
    if (target && target.shield > 0) {            // chess: shield absorbs the hit
      target.shield -= 1; bounced = true;
      if (move.consumes) piece.used[move.consumes] = true;
    } else {
      if (target) ns.captured[piece.color].push(target.kind);
      if (dragonAnchor >= 0) clearDragon(dragonAnchor);
      b[move.to] = piece; b[move.from] = null; piece.hasMoved = true;
      if (move.consumes) piece.used[move.consumes] = true;
      if (move.promotion) piece.kind = move.promotion;
    }
  }

  const captured = hp ? lethal : (!!target && !bounced);
  // an armed TIME RIFT (magic circle) lets this move keep the turn — once
  if (ns.shiftArmed === piece.color) { ns.turn = piece.color; ns.shiftArmed = null; }
  else ns.turn = other(state.turn);
  ns.moveCount = state.moveCount + 1;
  ns.lastMove = {
    from: move.from, to: move.to, color: piece.color, kind: move.kind,
    capture: captured, bounced, damaged, dmg, lethal,
    targetHpAfter: hp && target ? Math.max(0, target.hp) : null,
    captured: captured ? target.kind : null,
    hitKind: target ? target.kind : null,
    hitColor: target ? target.color : null,
    special: move.special || null, promotion: move.promotion || null,
  };
  if (record) ns.history = state.history.concat([state]);
  return ns;
}

/** Legal moves. Chess: pseudo moves that don't leave your king in check.
 *  HP: every pseudo move is legal (no check rule — you win by regicide). */
export function legalMoves(state, color = state.turn) {
  const pseudo = pseudoMoves(state, color);
  if (state.rules === "hp") return pseudo;
  const out = [];
  for (let i = 0; i < pseudo.length; i++) {
    const ns = applyMove(state, pseudo[i]);
    if (!inCheck(ns, color)) out.push(pseudo[i]);
  }
  return out;
}

export function legalMovesFrom(state, sqIndex) {
  const piece = state.board[sqIndex];
  if (!piece || piece.color !== state.turn) return [];
  const pseudo = pieceMoves(state, sqIndex);
  if (state.rules === "hp") return pseudo;
  return pseudo.filter((m) => !inCheck(applyMove(state, m), piece.color));
}

export function status(state) {
  const color = state.turn;
  if (state.rules === "hp") {
    const wk = findKing(state.board, WHITE, state.w);
    const bk = findKing(state.board, BLACK, state.w);
    if (!wk || !bk) return { over: true, result: "regicide", winner: wk ? WHITE : BLACK, check: false };
    const legal = legalMoves(state, color);
    if (legal.length === 0) return { over: true, result: "draw", winner: null, check: false };
    return { over: false, result: "ongoing", winner: null, check: false, legalCount: legal.length };
  }
  const legal = legalMoves(state, color);
  const check = inCheck(state, color);
  if (legal.length === 0)
    return check
      ? { over: true, result: "checkmate", winner: other(color), check: true }
      : { over: true, result: "stalemate", winner: null, check: false };
  return { over: false, result: "ongoing", winner: null, check, legalCount: legal.length };
}

export function undo(state) {
  if (!state.history || state.history.length === 0) return state;
  return state.history[state.history.length - 1];
}
