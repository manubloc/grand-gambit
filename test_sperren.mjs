// ── Mauern, Zaeune, Fallen (v0.90) ──────────────────────────────────────────
import { createGame, legalMoves, applyMove } from "./src/core/index.js";
import { buildArmyFromFormation } from "./src/meta/index.js";
import { SPERR_ARTEN, FALLEN_ARTEN, stadium, loeseFalleAus, falleSichtbar } from "./src/core/rules/sperren.js";

let pass = 0, fail = 0;
const ok = (was, bed) => { if (bed) { pass++; console.log("  ok  - " + was); } else { fail++; console.log("  FAIL- " + was); } };

const armee = () => buildArmyFromFormation(() => 1, ["rook","knight","bishop","queen","king","bishop","knight","rook"]);
function feld() {
  const g = createGame(armee(), armee(), { rules: "chess" });
  const W = g.w;
  const t = g.board.map((p, i) => [p, i]).find(([p]) => p && p.kind === "R" && p.color === "w")[1];
  const b = [...g.board];
  for (let k = 1; k <= 3; k++) b[t + k * W] = null;
  return { g: { ...g, board: b }, t, W, ziel: t + 2 * W };
}

// 1. Eine Mauer haelt den Gleiter auf - und laesst sich schlagen
{
  const { g, t, W, ziel } = feld();
  const s = { ...g, sperren: { [ziel]: { art: "mauer", hp: 2 } } };
  const z = legalMoves(s).filter((m) => m.from === t);
  ok("die Mauer laesst sich angreifen", z.some((m) => m.to === ziel && m.schlag));
  ok("hinter der Mauer geht es nicht weiter", !z.some((m) => m.to === ziel + W));
}

// 2. Der Schlag kostet den Zug, nicht die Figur
{
  const { g, t, ziel } = feld();
  const s = { ...g, sperren: { [ziel]: { art: "mauer", hp: 2 } } };
  const n = applyMove(s, legalMoves(s).find((m) => m.to === ziel && m.schlag));
  ok("die Figur bleibt stehen", !!n.board[t]);
  ok("die Mauer verliert einen Punkt", n.sperren[ziel].hp === 1);
  ok("der Gegner ist am Zug", n.turn === "b");
  ok("sie steht nun angeschlagen", stadium(n.sperren[ziel]) === "angeschlagen");
}

// 3. Drei Stadien, und am Ende ist das Feld frei
{
  const { g, t, ziel } = feld();
  let s = { ...g, sperren: { [ziel]: { art: "bergfried", hp: 3 } } };
  let schlaege = 0;
  while (s.sperren[ziel] && schlaege < 6) {
    const z = legalMoves({ ...s, turn: "w" }).find((m) => m.to === ziel && m.schlag);
    if (!z) break;
    s = applyMove({ ...s, turn: "w" }, z); schlaege++;
  }
  ok("das Bollwerk braucht drei Schlaege", schlaege === 3);
  ok("danach ist das Feld frei", legalMoves({ ...s, turn: "w" }).some((m) => m.from === t && m.to === ziel && !m.schlag));
}

// 4. Jede Sorte haelt, was ihr Preis verspricht
{
  ok("Zaun haelt einen Schlag", SPERR_ARTEN.zaun.hp === 1);
  ok("Mauer haelt zwei", SPERR_ARTEN.mauer.hp === 2);
  ok("Bollwerk haelt drei", SPERR_ARTEN.bergfried.hp === 3);
  ok("teurer heisst haerter", SPERR_ARTEN.zaun.gold < SPERR_ARTEN.mauer.gold
    && SPERR_ARTEN.mauer.gold < SPERR_ARTEN.bergfried.gold);
}

// 5. Fallen: die Grube schlaegt, die Baerenfalle fesselt
{
  const f = { 12: { art: "grube", von: "w" } };
  const { fallen, wirkung } = loeseFalleAus(f, 12);
  ok("die Grube macht Schaden", wirkung.schaden === FALLEN_ARTEN.grube.schaden);
  ok("sie liegt danach offen", fallen[12].offen === true);
  ok("und schnappt nicht zweimal", loeseFalleAus(fallen, 12).wirkung === null);

  const b = { 20: { art: "baerenfalle", von: "b" } };
  const w2 = loeseFalleAus(b, 20).wirkung;
  ok("die Baerenfalle fesselt statt zu schlagen", w2.fessel === 1 && !w2.schaden);
}

// 6. Eine Falle sieht nur, wer sie legte - bis sie zuschnappt
{
  const heimlich = { art: "grube", von: "w" };
  ok("der Leger sieht seine Falle", falleSichtbar(heimlich, "w"));
  ok("der Gegner sieht sie nicht", !falleSichtbar(heimlich, "b"));
  ok("nach dem Ausloesen sehen sie alle", falleSichtbar({ ...heimlich, offen: true }, "b"));
}

// 7. Ohne Sperren aendert sich am Spiel nichts
{
  const g = createGame(armee(), armee(), { rules: "chess" });
  ok("ein Brett ohne Sperren zieht wie immer", legalMoves(g).length > 0 && !legalMoves(g).some((m) => m.schlag));
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
