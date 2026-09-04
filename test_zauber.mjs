// ── EIN ZAUBER PRO PARTIE - HAELT DIE REGEL? (Besitzerbefund 4.9.2026) ──────
// "Der Grand Gambit ist in meinem Spiel bestimmt dreimal ausgewichen."
// Ausweichen (pawn_sidestep) ist als EINMAL je Partie angelegt, und die
// Hausregel geht weiter: nach dem ERSTEN Zauber ist das ganze Buch zu. Diese
// Probe stellt den Spielverlauf nach - Sidestep, dann noch einmal Sidestep -
// und prueft an jedem Ausgang des Kerns, ob der Verbrauch wirklich gebucht
// wird. Sie prueft auch, was die OBERFLAECHE dem Spieler zeigt: welche
// Faehigkeiten er jetzt noch hat, und welche verbraucht sind.
import { createGame, applyMove } from "./src/core/index.js";
import { legalMovesFrom as legalMoves } from "./src/core/sim/transitions.js";
import { hasAbility } from "./src/core/rules/moves.js";
import { buildArmyFromFormation } from "./src/meta/index.js";
const armee = () => buildArmyFromFormation(() => 1, ["rook","knight","bishop","queen","king","bishop","knight","rook"]);

let pass = 0, fail = 0;
const ok = (was, bed) => { if (bed) { pass++; console.log("  ok  - " + was); } else { fail++; console.log("  FAIL- " + was); } };

const W = 8;
const pawn = (color, abilities, id) => ({ id, kind: "P", color, level: 1, abilities, used: {} });
function leer() { return Array(64).fill(null); }
function spiel(board, turn = "w", rules = "chess") {
  const g = createGame(armee(), armee(), { rules });
  return { ...g, board, turn };
}

console.log("\n== Ausweichen: EINMAL, dann nie wieder ==");
{
  const b = leer();
  b[3 * W + 3] = pawn("w", ["pawn_sidestep"], "gambit");   // d4
  b[7 * W + 4] = { id: "bk", kind: "K", color: "b", level: 1, abilities: [], used: {} };
  b[0 * W + 4] = { id: "wk", kind: "K", color: "w", level: 1, abilities: [], used: {} };
  let g = spiel(b);
  const seit = (st) => legalMoves(st, 3 * W + 3).filter((m) => m.special === "side");
  ok("vor dem ersten Zug: zwei Ausweich-Ziele", seit(g).length === 2);
  const erster = seit(g)[0];
  g = applyMove(g, erster);
  const gambit = g.board[erster.to];
  ok("nach dem Zug steht der Gambit auf dem Zielfeld", !!gambit && gambit.id === "gambit");
  ok("der Verbrauch ist gebucht (used.pawn_sidestep)", !!(gambit.used && gambit.used.pawn_sidestep));
  ok("hasAbility meldet jetzt NEIN", hasAbility(gambit, "pawn_sidestep") === false);
  g = { ...g, turn: "w" };   // Weiss wieder dran
  const nochmal = legalMoves(g, erster.to).filter((m) => m.special === "side");
  ok("beim naechsten eigenen Zug gibt es KEIN Ausweichen mehr", nochmal.length === 0);
}

console.log("\n== Das Buch ist zu: ein Zauber sperrt alle anderen ==");
{
  const b = leer();
  b[3 * W + 3] = pawn("w", ["pawn_sidestep", "pawn_backstep", "pawn_charge"], "gambit");
  b[7 * W + 4] = { id: "bk", kind: "K", color: "b", level: 1, abilities: [], used: {} };
  b[0 * W + 4] = { id: "wk", kind: "K", color: "w", level: 1, abilities: [], used: {} };
  let g = spiel(b);
  const alle = (st, at) => legalMoves(st, at).filter((m) => m.consumes).map((m) => m.consumes);
  const vorher = new Set(alle(g, 3 * W + 3));
  ok("vorher stehen mehrere Talente offen: " + [...vorher].join(","), vorher.size >= 2);
  const side = legalMoves(g, 3 * W + 3).find((m) => m.special === "side");
  g = { ...applyMove(g, side), turn: "w" };
  const nachher = alle(g, side.to);
  ok("nach dem Ausweichen bietet der Kern KEIN Talent mehr an", nachher.length === 0);
}

console.log("\n== Der HP-Modus bucht den Verbrauch genauso ==");
{
  const b = leer();
  b[3 * W + 3] = { ...pawn("w", ["pawn_sidestep"], "gambit"), hp: 3, maxHp: 3, atk: 1 };
  b[7 * W + 4] = { id: "bk", kind: "K", color: "b", level: 1, abilities: [], used: {}, hp: 5, maxHp: 5, atk: 1 };
  b[0 * W + 4] = { id: "wk", kind: "K", color: "w", level: 1, abilities: [], used: {}, hp: 5, maxHp: 5, atk: 1 };
  let g = spiel(b, "w", "hp");
  const side = legalMoves(g, 3 * W + 3).find((m) => m.special === "side");
  ok("HP: Ausweichen wird angeboten", !!side);
  if (side) {
    g = { ...applyMove(g, side), turn: "w" };
    const wieder = legalMoves(g, side.to).filter((m) => m.special === "side");
    ok("HP: danach kein zweites Ausweichen", wieder.length === 0);
  }
}

console.log("\n== Passive Talente ueberleben den Zauber ==");
{
  // Sturmlauf (pawn_charge) ist laut Chronik DAUERHAFT: "Darf jederzeit zwei
  // Felder vorruecken". Er darf nicht mit dem ersten Zauber verschwinden.
  const b = leer();
  b[3 * W + 3] = pawn("w", ["pawn_sidestep", "pawn_charge"], "gambit");   // d4, nicht Startreihe
  b[7 * W + 4] = { id: "bk", kind: "K", color: "b", level: 1, abilities: [], used: {} };
  b[0 * W + 4] = { id: "wk", kind: "K", color: "w", level: 1, abilities: [], used: {} };
  let g = spiel(b);
  const rush = (st, at) => legalMoves(st, at).filter((m) => m.special === "rush");
  ok("vorher: Sturmlauf wird angeboten", rush(g, 3 * W + 3).length === 1);
  const side = legalMoves(g, 3 * W + 3).find((m) => m.special === "side");
  g = { ...applyMove(g, side), turn: "w" };
  ok("NACH dem Ausweichen: Sturmlauf bleibt (er ist passiv, kein Zauber)", rush(g, side.to).length === 1);
}

console.log("\n== Kern und Chronik sind sich einig, was passiv ist ==");
{
  const { PASSIVE_TALENTE } = await import("./src/core/rules/moves.js");
  const { ABILITIES } = await import("./src/content/abilities.js");
  const chronikPassiv = Object.values(ABILITIES).filter((a) => a.id && a.once === false).map((a) => a.id);
  const fehltImKern = chronikPassiv.filter((id) => !PASSIVE_TALENTE.has(id));
  const zuvielImKern = [...PASSIVE_TALENTE].filter((id) => !ABILITIES[id] || ABILITIES[id].once !== false);
  ok("jedes once:false der Chronik kennt der Kern als passiv" + (fehltImKern.length ? " - FEHLT: " + fehltImKern.join(",") : ""), fehltImKern.length === 0);
  ok("und der Kern nennt nichts passiv, was die Chronik als Zauber fuehrt" + (zuvielImKern.length ? " - ZUVIEL: " + zuvielImKern.join(",") : ""), zuvielImKern.length === 0);
}

console.log("\n== Die Oberflaeche zeigt die Talente ==");
{
  const { readFileSync } = await import("node:fs");
  const bv = readFileSync("src/app/ui/board/BoardView.jsx", "utf8");
  ok("das Talentband existiert im Board", bv.includes('className="gg-talentband"'));
  ok("es unterscheidet Zauber und dauerhafte Talente", bv.includes('"dauerhaft"') && bv.includes('"Zauber"'));
  ok("es sagt, wenn das Buch geschlossen ist", bv.includes("Das Buch ist geschlossen"));
  ok("es liest die Chronik, nicht eine zweite Liste", bv.includes('from "../../../content/abilities.js"'));
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
