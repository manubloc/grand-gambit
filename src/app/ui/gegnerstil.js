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

/* ── ALLES LILA, DIE GEFAHR MACHT DEN UNTERSCHIED (v1.0.54, Besitzerwunsch) ─
   Die erste Fassung gab jeder Figurenart ihre eigene Farbe - Bauer blau,
   Springer gruen, Turm rot. Der Besitzer will es anders und es ist die
   bessere Idee: EIN Farbton fuer die ganze Gegnerseite, naemlich das Lila
   des Risses, und was die Figuren unterscheidet, ist die HELLIGKEIT - je
   gefaehrlicher, desto heller und satter leuchtet sie.

   Damit liest sich das Brett auf einen Blick als Bedrohungskarte: der Bauer
   glimmt dunkel, die Dame und die Monster stehen hell heraus. Das ist eine
   Auskunft, die dem Spieler etwas SAGT - eine Farbe je Figurenart war nur
   Dekoration.

   Der Winkel bleibt fuer alle gleich (das Lila), gestaffelt werden
   Saettigung und Helligkeit. Die Stufen folgen dem Figurenwert, wie ihn
   jeder Schachspieler im Kopf hat. */
const LILA_WINKEL = 232;          // sepia(1) auf das Riss-Violett gedreht

/* Gefahr je Figurenart: 0 = harmlos, 1 = furchteinfloessend. */
const GEFAHR = {
  P: 0.00,   // Bauer
  N: 0.34,   // Springer
  B: 0.34,   // Laeufer
  R: 0.55,   // Turm
  A: 0.68,   // Erzbischof
  C: 0.78,   // Kanzler
  Q: 0.88,   // Dame
  K: 0.72,   // Koenig - gewichtig, aber nicht das schaerfste Schwert
  D: 1.00,   // Drache
  X: 1.00,   // Monster und Meister
};

export const gefahrVon = (kind) => GEFAHR[kind] ?? 0.5;

/** Die Toenung einer gegnerischen Figur: ein Lila fuer alle, aber je
 *  gefaehrlicher die Figur, desto heller und satter. */
export function toenung(kind) {
  const g = gefahrVon(kind);
  return {
    winkel: LILA_WINKEL,
    saettigung: (1.5 + 1.7 * g).toFixed(2),   // 1.50 -> 3.20
    helligkeit: (0.72 + 0.5 * g).toFixed(2),  // 0.72 -> 1.22
    deckung: (0.78 + 0.2 * g).toFixed(2),     // der Verlauf traegt weiter oben
  };
}

/* Bleibt als Zugang erhalten - liefert jetzt fuer alle dasselbe Lila. */
export function grundfarbeWinkel() {
  return LILA_WINKEL;
}
