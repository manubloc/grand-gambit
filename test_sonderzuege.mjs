// ── SONDERZUEGE: ROCHADE & EN PASSANT ───────────────────────────────────────
// Suite 20 der eisernen Kette. Prueft die beiden Sonderzuege gegen die echte
// Engine: Angebot, Verweigerung (gezogen / blockiert / bedroht / verspaetet)
// und Ausfuehrung (Turmsprung, Bauernverschwinden).
import { createGame } from "./src/core/sim/state.js";
import { legalMoves, applyMove } from "./src/core/sim/transitions.js";

let passed = 0, failed = 0;
const ok = (name, cond) => { if (cond) { passed++; console.log("  ok  - " + name); }
  else { failed++; console.log("  FAIL - " + name); } };

// LAYOUT-AGNOSTISCH (Lehre v0.49): das Hausbrett ist 10x10, nicht 8x8 -
// alle Koordinaten werden aus dem Brett GESCANNT, nichts wird geraten.
const g0 = createGame();
const W = g0.w ?? 8, H = g0.h ?? 8;
const ix = (f, r) => r * W + f;
const suche = (g, kind, color) => g.board.findIndex((p) => p && p.kind === kind && p.color === color);
const kIdx = suche(g0, "K", "w");
const kF = kIdx % W, kR = (kIdx / W) | 0;
const bkR = (suche(g0, "K", "b") / W) | 0;
const dir = bkR > kR ? 1 : -1;              // weisse Laufrichtung
const wPawnR = (suche(g0, "P", "w") / W) | 0;
const bPawnR = (suche(g0, "P", "b") / W) | 0;
const fernR = dir > 0 ? H - 1 : 0;          // fernste Reihe aus weisser Sicht

// ── Rochade kurz: erst blockiert, dann frei ─────────────────────────────────
const cast = (g) => legalMoves(g, "w").filter((m) => m.special === "castle");
ok("mit voller Grundreihe keine Rochade", cast(g0).length === 0);

const g1 = structuredClone(g0);
for (let f = kF + 1; f < W - 1; f++) g1.board[ix(f, kR)] = null;   // kurze Seite raeumen
const kurz = cast(g1);
ok("kurze Rochade wird angeboten, wenn die Gasse frei ist", kurz.length === 1);
ok("sie fuehrt den Koenig ZWEI Felder zum Turm", kurz[0] && kurz[0].to === ix(kF + 2, kR));

const g2 = structuredClone(g1);
g2.board[kIdx].hasMoved = true;
ok("ein gezogener Koenig rochiert nie wieder", cast(g2).length === 0);

const g3 = structuredClone(g1);
g3.board[ix(W - 1, kR)].hasMoved = true;
ok("ein gezogener Turm traegt keine Rochade mehr", cast(g3).length === 0);

// Kreuzfeld bedroht: gegnerischer Turm zielt die geraeumte Gasse hinab
const g4 = structuredClone(g1);
const kreuzF = kF + 1;
for (let r = 0; r < H; r++) if (r !== kR) g4.board[ix(kreuzF, r)] = null;
g4.board[ix(kreuzF, fernR)] = { id: 999, kind: "R", color: "b", level: 1, abilities: [], shield: 0, used: {} };
ok("ueber ein bedrohtes Kreuzfeld geht keine Rochade", cast(g4).length === 0);

// Ausfuehrung: Turm springt auf die Innenseite
const g5 = applyMove(g1, kurz[0]);
ok("nach der Rochade steht der Koenig auf seinem neuen Feld", g5.board[ix(kF + 2, kR)]?.kind === "K");
ok("und der Turm auf der Innenseite des Koenigs", g5.board[ix(kF + 1, kR)]?.kind === "R");
ok("die Ecke ist leer", !g5.board[ix(W - 1, kR)]);
ok("beide Rochade-Zeugen sind im lastMove notiert", g5.lastMove.special === "castle" && g5.lastMove.rookTo === ix(kF + 1, kR));

// ── En passant ──────────────────────────────────────────────────────────────
// Weisser Bauer vier Reihen vor (zwei Doppelschritte simuliert per Chirurgie),
// schwarzer Nachbar zieht Doppelschritt vorbei - genau EINEN Zug lang darf
// im Vorbeigehen geschlagen werden.
const g6 = structuredClone(g0);
const pF = 3, startR = wPawnR;                       // ein weisser Bauer
const epR = bPawnR - 2 * dir;                        // die Reihe NEBEN dem schwarzen Doppelschritt-Ziel
const wp = g6.board[ix(pF, startR)];
g6.board[ix(pF, startR)] = null; wp.hasMoved = true; g6.board[ix(pF, epR)] = wp;
// der schwarze Nachbarbauer macht den Doppelschritt
const bStart = bPawnR, bF = pF + 1;
const doppel = legalMoves({ ...g6, turn: "b" }, "b").find((m) => m.from === ix(bF, bStart) && m.double);
ok("der schwarze Doppelschritt existiert", !!doppel);
const g7 = applyMove({ ...g6, turn: "b" }, doppel);
const ep = legalMoves(g7, "w").filter((m) => m.special === "enpassant");
ok("direkt danach bietet sich EN PASSANT genau einmal an", ep.length === 1);
ok("Ziel ist das UEBERSPRUNGENE Feld", ep[0] && ep[0].to === ix(bF, epR + dir));
const g8 = applyMove(g7, ep[0]);
ok("der Schlaeger steht auf dem uebersprungenen Feld", g8.board[ix(bF, epR + dir)]?.color === "w");
ok("der ueberholte Bauer ist fort", !g8.board[ix(bF, epR)]);
ok("der Schlag zaehlt als Schlag", g8.lastMove.capture === true && g8.captured.w.includes("P"));
// eine Runde spaeter ist das Fenster zu
const g9 = structuredClone(g7);
g9.lastMove = { ...g9.lastMove, double: false };
ok("einen Zug spaeter ist das Fenster geschlossen", legalMoves(g9, "w").filter((m) => m.special === "enpassant").length === 0);

console.log(`RESULT: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
