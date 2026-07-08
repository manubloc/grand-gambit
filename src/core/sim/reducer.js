import { other } from "../domain/constants.js";
import { inCheck } from "../rules/attacks.js";
import { applyMove, status } from "./transitions.js";
import { COMMAND } from "./commands.js";
import { Ev } from "./events.js";

/**
 * The single entry point for advancing a game.
 *   reduce(state, command) -> { state, events }
 * Pure: never mutates `state`. Appends the command to `state.log` on the new
 * state so the whole match can be replayed or sent online.
 */
export function reduce(state, command) {
  switch (command.type) {
    case COMMAND.MOVE: {
      const next = applyMove(state, command.move, { record: true });
      if (next === state) return { state, events: [] }; // illegal/no-op guard
      next.log = (state.log || []).concat([command]);

      const events = [];
      const lm = next.lastMove;
      events.push(Ev.moved(lm.color, lm.kind, lm.from, lm.to, lm.special));
      if (lm.bounced) events.push(Ev.shieldAbsorbed(lm.hitColor, lm.hitKind, lm.to, lm.color));
      else if (lm.damaged) events.push(Ev.damaged(lm.color, lm.hitColor, lm.hitKind, lm.to, lm.dmg, lm.targetHpAfter));
      else if (lm.capture) events.push(Ev.captured(lm.color, lm.kind, lm.captured, lm.to));
      if (lm.promotion) events.push(Ev.promoted(lm.color, lm.to, lm.promotion));

      const sideToMove = next.turn;
      if (state.rules !== "hp" && inCheck(next, sideToMove)) events.push(Ev.check(sideToMove));

      const st = status(next);
      if (st.over) events.push(Ev.gameOver(st.result, st.winner));
      return { state: next, events };
    }

    case COMMAND.POTION: {
      // Guards: HP rules only, right side to move, charges left, own hurt piece.
      if (state.rules !== "hp" || state.over) return { state, events: [] };
      if (command.color !== state.turn) return { state, events: [] };
      const left = (state.potions && state.potions[command.color]) || 0;
      if (left <= 0) return { state, events: [] };
      const piece = state.board[command.target];
      if (!piece || piece.color !== command.color) return { state, events: [] };
      if ((piece.hp ?? 1) >= (piece.maxHp ?? piece.hp ?? 1)) return { state, events: [] };
      const board = state.board.slice();
      const healedHp = Math.min(piece.maxHp, (piece.hp ?? 1) + 2);
      board[command.target] = { ...piece, hp: healedHp };
      const next = { ...state, board,
        potions: { ...state.potions, [command.color]: left - 1 },
        turn: other(state.turn),
        lastMove: null,
        log: (state.log || []).concat([command]) };
      return { state: next, events: [Ev.healed(command.color, piece.kind, command.target, healedHp)] };
    }

    case COMMAND.RESIGN: {
      const winner = other(command.color);
      const next = { ...state, log: (state.log || []).concat([command]), over: { result: "resign", winner } };
      return { state: next, events: [Ev.gameOver("resign", winner)] };
    }

    default:
      return { state, events: [] };
  }
}
