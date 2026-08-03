// ── DIE MUSIKREGIE ──────────────────────────────────────────────────────────
// v0.80 (Besitzer): jeder Bereich traegt sein eigenes Stueck, der Kampf sogar
// zwei Stufen. Dieses Modul ist der eine Ort, an dem das Spiel sagt, WO es
// gerade steht - die Soundtrack-Komponente hoert zu und blendet weich um.
//
// Bereiche:
//   menue          Huelle, Hof, Lager, Profil - warm und einladend
//   karte          die Kampagnenkarte - hell, pastoral, hoffnungsvoll
//   kampf          Partie in ruhiger Lage - konzentriert, Raum zum Denken
//   kampfSpannung  Partie kippt (Kraefteverhaeltnis) - Trommeln, Draengen
//   meister        Kapitelfinale - Glocke, Chor, Wuerde und Drohung
//
// Warum ein Modul statt Props: die Partie (GameScreen) und die Huelle (App)
// muessten sonst durch mehrere Ebenen hindurch dieselbe Leitung teilen. So
// ruft jeder einfach musikBereich("...") - und genau EIN Spieler reagiert.

let bereich = "menue";
const hoerer = new Set();

/** Den aktuellen Musikbereich setzen. Gleicher Bereich = kein Ereignis. */
export function musikBereich(neu) {
  if (!neu || neu === bereich) return;
  bereich = neu;
  hoerer.forEach((f) => { try { f(bereich); } catch {} });
}

export function musikAktuell() { return bereich; }

/** Abonnieren; gibt die Abmeldung zurueck. */
export function musikAbo(f) {
  hoerer.add(f);
  return () => hoerer.delete(f);
}
