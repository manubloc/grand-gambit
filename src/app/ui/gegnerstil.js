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

let stil = "getoent";

/* v1.0.66 (Besitzerentscheid): ZWEI SEHWEISEN, NICHT DREI.
   "die Graustufen fallen jetzt eh weg" - der graue Figurenfilter war seit
   v1.0.60 ohnehin nur noch eine Abdunklung unter derselben Sockelglut. Sein
   Platz traegt jetzt die zweite Glutfarbe:

     getoent        Farbig. Gegner glueht LILA, die eigene Seite GOLD.
                    Voreinstellung fuer alle Spieler.
     schwarzweiss   Dieselbe Glut, ohne Farbe: Gegner SCHWARZ, eigene WEISS.
                    "das hat echt gut funktioniert, dass wir den Sockel
                    schwarz machen und bei mir weiss."

   Die alten Namen bleiben lesbar, damit gespeicherte Profile nicht auf die
   Voreinstellung zurueckfallen und stillschweigend etwas anderes zeigen. */
export const GEGNER_STILE = ["getoent", "schwarzweiss"];
const ALTNAMEN = { farbig: "getoent", grau: "schwarzweiss" };

/* v1.0.62 (Besitzerentscheid): DIE TOENUNG IST DER STANDARD - "die ist
   ziemlich gut geworden". Wer nichts waehlt (und waehlen kann kuenftig nur
   noch der Admin), sieht den Gegner farbig mit der lila Sockel-Glut. */
export function setGegnerStil(s) {
  const g = ALTNAMEN[s] || s;
  stil = GEGNER_STILE.includes(g) ? g : "getoent";
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

/* ── DIE FARBE DER SOCKELGLUT (v1.0.66) ────────────────────────────────────
   Bis hierher glueht nur die Gegnerseite. Der Besitzer will die Glut auch
   fuer die EIGENEN Figuren - "genau das Gleiche, bloss in leuchtend gelb,
   dann ist da eine klare Unterscheidung". Zwei Seiten, zwei Toene, ein
   Bauprinzip; im schwarz-weissen Blick dieselbe Trennung ohne Farbe.

   Die Werte sind Filter auf eine graustufige Kopie des Gemaeldes:
   sepia(1) faerbt sie in ein Braungold, hue-rotate dreht von dort weg.
   Gold braucht darum fast keine Drehung, Lila die vollen 232 Grad. */
const GLUT = {
  lila:    { winkel: 232, saettigung: [3.4, 1.6], helligkeit: [1.15, 0.45] },
  gold:    { winkel: -6,  saettigung: [3.8, 1.4], helligkeit: [1.30, 0.40] },
  schwarz: { winkel: 0,   saettigung: [0.0, 0.0], helligkeit: [0.16, 0.10] },
  weiss:   { winkel: 0,   saettigung: [0.0, 0.0], helligkeit: [2.10, 0.60] },
};

/** Welcher Ton glueht unter dieser Figur?
 *  eigen = die eigene Seite (weiss), sonst die Gegenseite. */
export function glutTon(eigen) {
  if (stil === "schwarzweiss") return eigen ? "weiss" : "schwarz";
  return eigen ? "gold" : "lila";
}

/** Der fertige Filter fuer die Glutkopie - Gefahr staffelt Saettigung und
 *  Helligkeit wie bisher (je gefaehrlicher, desto greller). */
export function glutFilter(ton, gefahr) {
  const g = GLUT[ton] || GLUT.lila;
  const sat = (g.saettigung[0] + g.saettigung[1] * gefahr).toFixed(2);
  const hel = (g.helligkeit[0] + g.helligkeit[1] * gefahr).toFixed(2);
  return `grayscale(1) sepia(${g.saettigung[0] ? 1 : 0}) hue-rotate(${g.winkel}deg) `
    + `saturate(${sat}) brightness(${hel})`;
}

/** Der weiche Lichtschein hinter dem Fuss, im selben Ton. */
export const GLUT_SCHEIN = {
  lila:    ["196,166,255", "124,58,237"],
  gold:    ["255,226,150", "216,164,65"],
  schwarz: ["40,36,52", "10,8,16"],
  weiss:   ["255,255,255", "214,214,224"],
};

/* ── DER VERLAUF FOLGT DER GEMESSENEN KANTE (v1.0.72) ──────────────────────
   Zwei Formen, eine Obergrenze je Figur (sockelmass.js):
   - farbig: die GLUT - dunkel am Boden, Gipfel knapp unter der Kante,
     sanft aus kurz darueber. Der Look aus v1.0.66, nur nicht mehr auf
     pauschale 19 % genagelt.
   - schwarz/weiss: der ANSTRICH - voll deckend vom Boden bis knapp unter
     die Kante ("der Sockel komplett schwarz"), dann ein weicher Auslauf
     ueber gut vier Prozent, damit keine Schnittkante entsteht ("mit einem
     ganz sanften Verlauf ... sonst wird man das sehen"). */
export function sockelVerlauf(kante, nurSockel) {
  /* v1.0.73 (Besitzer): "Du musst die Sockeleinfaerbung deutlich weiter
     runterziehen - es waere gut, wenn man immer noch ein Stueckchen von der
     Farbe vom Sockel sieht, aktuell bist Du bei jeder Figur zu weit oben."
     Bis v1.0.72 lief die Deckung bis knapp UNTER die gemessene Tellerkante -
     der ganze Teller war eingefaerbt, seine eigene Farbe verschwand. Jetzt
     endet die volle Deckung bei 55 % der Kante, und der Auslauf ist an der
     Kante fertig: die obere Haelfte des Tellers behaelt ihren Stein, die
     Faerbung sitzt darunter wie ein Schatten, aus dem die Figur waechst. */
  const k = Math.round(kante * 1000) / 10;   // in %
  if (nurSockel) {
    /* v1.0.76: "bei manchen Figuren minimal zu hoch" - volle Deckung endet
       jetzt bei 42 % statt 55 % der Kante, der Auslauf bei 85 % statt 100 %.
       Die Faerbung bleibt damit sicher unter dem Tellerrand, auch bei den
       Figuren mit flachem Teller. */
    const voll = Math.max(1.2, k * 0.42).toFixed(1);
    const aus = Math.max(2.5, k * 0.85).toFixed(1);
    return `linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${voll}%, rgba(0,0,0,0) ${aus}%)`;
  }
  const gipfel = Math.max(2, k * 0.36).toFixed(1);
  const schulter = Math.max(2.5, k * 0.56).toFixed(1);
  const aus = Math.max(3.5, k * 0.85).toFixed(1);
  return `linear-gradient(0deg, rgba(0,0,0,.18) 0%, rgba(0,0,0,.45) ${Math.max(1.5, k * 0.2).toFixed(1)}%, `
    + `rgba(0,0,0,1) ${gipfel}%, rgba(0,0,0,.55) ${schulter}%, rgba(0,0,0,0) ${aus}%)`;
}

