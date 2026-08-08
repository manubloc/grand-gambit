/* ── DIE DARSTELLUNG DES GEGNERS (v1.0.50, Besitzerwunsch) ──────────────────
 *
 * Der Besitzer will zwei Sehweisen AUSPROBIEREN koennen, ohne dass sie
 * jemandem aufgezwungen werden. Drei Stile, waehlbar im Profil:
 *
 *   farbig   Wie bisher: dieselbe Kunst, kuehler gestimmt, violetter Saum.
 *            Das ist und bleibt die Voreinstellung.
 *   grau     Die Gegnerseite in Graustufen - nur der violette Riss-Saum
 *            bleibt farbig. "Etwas Farbloses traegt violettes Licht."
 *   getoent  Grauer Saum, die Figur selbst in Graustufen, aber von unten
 *            steigt eine GRUNDFARBE der Figurenart auf - Bauer stahlblau,
 *            Springer gruen, Turm rot ... So bleiben die ARTEN auf einen
 *            Blick unterscheidbar, obwohl die Seite entfaerbt ist.
 *
 * WICHTIG - ZWEI AUSNAHMEN, BEIDE VON SELBST:
 *   1. Der klassische Figurensatz (Law of Classical, artStyle "classic")
 *      hat seinen eigenen Filterzweig und wird von alledem nicht beruehrt -
 *      "normales Schach" sieht immer aus wie normales Schach.
 *   2. UEBERGELAUFENE Figuren (bestochene Monster, gewonnene Meister)
 *      stehen auf der EIGENEN Seite (color "w") und laufen darum durch den
 *      Freund-Zweig: sie sind automatisch farbig. Kein Sonderfall noetig.
 *
 * DASSELBE MUSTER WIE DER SPARMODUS: ein Modul-Singleton, gesetzt beim
 * Profilwechsel in App.jsx. PieceGlyph liest zur Zeichenzeit - kein Prop
 * muss durch zwanzig Ebenen gereicht werden.
 */

let stil = "farbig";

export const GEGNER_STILE = ["farbig", "grau", "getoent"];

export function setGegnerStil(s) {
  stil = GEGNER_STILE.includes(s) ? s : "farbig";
}

export function gegnerStil() {
  return stil;
}

/* Die Grundfarbe je FigurenART fuer den getoenten Stil - kraeftig und
   untereinander klar unterscheidbar. Gewaehlt als hue-rotate-Winkel auf
   sepia(1): sepia legt ein warmes Orange (~40 Grad) an, der Winkel dreht es
   auf die Zielfarbe. So braucht es KEINE Maske auf der Figurform - nur eine
   billige lineare Verlaufsmaske auf der Tonschicht. */
export const GRUNDFARBE_WINKEL = {
  P: 170,   // Bauer: stahlblau
  N: 65,    // Springer: gruen
  B: 140,   // Laeufer: tuerkis
  R: 300,   // Turm: rot
  Q: 230,   // Dame: violett
  K: 0,     // Koenig: gold bleibt gold
  A: 210,   // Erzbischof-Schiene: blauviolett
  C: 320,   // Kanzler-Schiene: purpurrot
  X: 20,    // Monster: gluehendes orange
  D: 330,   // Drache: rot
};

export function grundfarbeWinkel(kind) {
  return GRUNDFARBE_WINKEL[kind] ?? 200;
}
