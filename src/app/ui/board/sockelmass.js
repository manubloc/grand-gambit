/* ── DER SOCKEL WIRD GEMESSEN, NICHT GESCHAETZT (v1.0.72, Besitzer) ─────────
 *
 * "Du musst, glaub ich, jede Figur einzeln durchpruefen ... check ab, dass
 *  nicht die Fuesse oder der Rock von der Koenigin mitgefaerbt werden."
 *
 * Bisher galt EIN fester Verlauf fuer alle (Obergrenze 19 %) - eine Annahme
 * aus v1.0.60. Aber die Sockel sind verschieden hoch, und was beim Bauern
 * passt, faerbt bei der Dame den Rocksaum. Also misst sich jede Figur
 * selbst: ihr eigenes Gemaelde, einmal, beim ersten Zeichnen.
 *
 * DIE MESSUNG: das Alpha-Profil des Bildes, zeilenweise von unten. Der
 * Sockel ist bei jeder Figur der BREITESTE Teil des Fusses; direkt darueber
 * schnuert die Silhouette ein (Knoechel, Rocksaum, Klauen). Die Kante ist
 * die erste Zeile von unten, deren gezeichnete Breite unter 72 % der
 * Sockelbreite faellt. Ein Sicherheitsabschlag (1,5 %) haelt den Verlauf
 * UNTER der Einschnuerung, die Klemme [8 %, 26 %] faengt Ausreisser, und
 * wo keine Einschnuerung messbar ist (Truemmer, Sonderformen), greift der
 * alte Hauswert 15 %.
 *
 * Die pure Funktion unten kennt kein DOM - test_ui prueft sie mit
 * synthetischen Profilen. holeSockelKante() misst im Browser einmal je
 * Bild-URL (Canvas, ~3 ms) und cached; das <img> ist beim Aufruf laengst
 * geladen, new Image() trifft den Speicher.
 */

const ALPHA_SCHWELLE = 130;   /* nur GEZEICHNETES zaehlt - der halbtransparente
   Schlagschatten (Alpha 60-100) unter dem Teller ist breiter als der Teller
   und wuerde die Messung an den Boden ziehen. */
const SOCKEL_ZONE = 0.25;     // in den untersten 25 % wohnt der Teller (Drache!)
const PLATEAU_AN = 0.97;      // Tellerkoerper betreten: >= 97 % der Tellerbreite
const PLATEAU_AUS = 0.95;     // Tellerkante: erste Zeile darunter < 95 %
const SCHULTER = 1;           // eine Zeile Rundungszuschlag
export const KANTE_MIN = 0.06, KANTE_MAX = 0.24, KANTE_FALLBACK = 0.12;

/** Pure Messung auf rohen Bilddaten { width, height, data(RGBA) }.
 *  Liefert die Sockelkante als Anteil der Bildhoehe, vom UNTEREN BILDRAND.
 *
 *  DIE REGEL KOMMT AUS VIER ECHTEN PROFILEN (gambit, queen, dragon, warlock,
 *  klein-Fassung, Alpha>130), nicht aus einer Annahme:
 *  - der Teller laeuft unten ELLIPTISCH an (32->49->59->67->72->75->79) -
 *    eine naive "Breite faellt unter x %"-Suche feuert auf diese Rundung
 *    und meldet 1-4 % (so entstand der Boden-Balken-Eindruck erst);
 *  - dann kommt das PLATEAU (der Tellerkoerper, viele Zeilen konstant);
 *  - dann der Abfall zur Figur. Die Koenigin traegt ihren Rock mit 82 % der
 *    Tellerbreite - eine 72-%-Schwelle unterscheidet Teller und Rock NICHT,
 *    die Plateau-Kante (95 %) tut es.
 *  Also: erst das Plateau BETRETEN (>= 97 %), dann sein ENDE suchen (< 95 %),
 *  eine Zeile Rundungszuschlag, Klemme [6 %, 24 %]. Figuren ohne messbare
 *  Tellerkante binnen der Zone (fliessende Roben) fallen auf konservative
 *  12 % - lieber zu wenig Anstrich als ein gefaerbter Saum. */
export function messeSockelKante({ width, height, data }) {
  const breite = new Array(height).fill(0);
  for (let y = 0; y < height; y++) {
    let links = -1, rechts = -1;
    const zeile = y * width * 4;
    for (let x = 0; x < width; x++) {
      if (data[zeile + x * 4 + 3] > ALPHA_SCHWELLE) { if (links < 0) links = x; rechts = x; }
    }
    breite[y] = links < 0 ? 0 : rechts - links + 1;
  }
  const zone = Math.max(3, Math.round(height * SOCKEL_ZONE));
  let sockelBreite = 0, boden = -1;
  for (let y = height - 1; y >= height - zone && y >= 0; y--) {
    if (breite[y] > 0 && boden < 0) boden = y;
    if (breite[y] > sockelBreite) sockelBreite = breite[y];
  }
  if (boden < 0 || sockelBreite < width * 0.1) return KANTE_FALLBACK;
  let imPlateau = false;
  for (let y = boden; y >= boden - zone && y >= 0; y--) {
    if (!imPlateau) { if (breite[y] >= sockelBreite * PLATEAU_AN) imPlateau = true; continue; }
    if (breite[y] < sockelBreite * PLATEAU_AUS) {
      const kante = (boden - y + SCHULTER) / height + (height - 1 - boden) / height;
      return Math.min(KANTE_MAX, Math.max(KANTE_MIN, kante));
    }
  }
  return KANTE_FALLBACK;
}

/* Laufzeit: einmal messen je URL, dann aus dem Speicher. sync abfragbar. */
const KANTEN = new Map();
export function sockelKanteAusCache(url) { return KANTEN.get(url); }
export function holeSockelKante(url) {
  if (KANTEN.has(url)) return Promise.resolve(KANTEN.get(url));
  return new Promise((fertig) => {
    try {
      const im = new Image();
      im.onload = () => {
        try {
          const c = document.createElement("canvas");
          /* verkleinert messen reicht und spart Zeit - das Profil bleibt */
          const w = 96, h = Math.max(24, Math.round((im.naturalHeight / im.naturalWidth) * 96));
          c.width = w; c.height = h;
          const g = c.getContext("2d", { willReadFrequently: true });
          g.drawImage(im, 0, 0, w, h);
          const kante = messeSockelKante(g.getImageData(0, 0, w, h));
          KANTEN.set(url, kante); fertig(kante);
        } catch { KANTEN.set(url, KANTE_FALLBACK); fertig(KANTE_FALLBACK); }
      };
      im.onerror = () => { KANTEN.set(url, KANTE_FALLBACK); fertig(KANTE_FALLBACK); };
      im.src = url;
    } catch { fertig(KANTE_FALLBACK); }
  });
}
