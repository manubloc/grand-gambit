// ── DIE KLANGSCHICHT ────────────────────────────────────────────────────────
// Besitzer (v0.75): die ersten fuenf Brettklaenge. Dieselbe Regel wie beim
// Soundtrack: DIE ENTSCHEIDUNG GEHOERT DEM SPIELER. Effekte sind abschaltbar,
// haben einen EIGENEN Regler (getrennt von der Musik) und schweigen, bis der
// Spieler das erste Mal etwas beruehrt hat (Browser erlauben Ton ohnehin erst
// nach einer Geste).
//
// Warum kein <audio> je Klang: ein Zug darf den vorigen nicht abwuergen und
// muss SOFORT klingen. Darum EIN AudioContext, die Puffer einmal entschluesselt
// und je Anschlag eine frische Quelle - das ist latenzarm und ueberlagert sich
// sauber.
//
// VARIANTEN: Setzen und Anwaehlen kommen dreifach, Schlagen doppelt. Ohne das
// ermuedet das Ohr nach zwanzig Zuegen. Zusaetzlich streut die Tonhoehe um
// +-4 %, damit auch dieselbe Aufnahme nie zweimal gleich klingt.

import waehlenKlang from "./assets/klang/waehlen.webm";
import trefferKlang from "./assets/klang/treffer.webm";
import fallKlang from "./assets/klang/fall.webm";
import gesperrtKlang from "./assets/klang/gesperrt.webm";
/* v0.78 - HOERURTEIL DES BESITZERS: Das Brett ist eine HOLZPLATTE. Ein Zug
   ist kein Anschlag, sondern ein SCHLEIFEN der Figur ueber das Holz; Schlag
   und Sturz sind Holz auf Holz, dumpf und hohl, ohne helles "Ding".
   Gemessen statt geraten - die neuen Zug-Klaenge brauchen 99-274 ms bis zur
   Spitze und tragen nur 1-6 % ihrer Energie in den ersten 30 ms; der alte
   Anschlag hatte 4 ms und 60 %. Schlag und Sturz liegen bei 485/983 Hz bzw.
   851/2063 Hz - kein heller Anteil. */
import zug2Klang from "./assets/klang/zug-2.webm";
import zug3Klang from "./assets/klang/zug-3.webm";
import treffer2Klang from "./assets/klang/treffer-2.webm";
import fall2Klang from "./assets/klang/fall-2.webm";
/* v0.77: sieben neue Klaenge, ueber ElevenLabs nach design/KLANG-PROMPTS.md
   erzeugt, geschnitten und auf -3 dBFS gebracht wie die vier davor. */
import zugKlang from "./assets/klang/zug.webm";
import schachKlang from "./assets/klang/schach.webm";
import siegKlang from "./assets/klang/sieg.webm";
import niederlageKlang from "./assets/klang/niederlage.webm";
import stufeKlang from "./assets/klang/stufe.webm";
import freiKlang from "./assets/klang/frei.webm";
import goldKlang from "./assets/klang/gold.webm";

// v0.75.2: DIE WAHL DES BESITZERS - genau diese vier Takes haben bestanden.
// v0.78: "zug" traegt DREI Schleif-Varianten, Schlag und Sturz je zwei -
// so ermuedet das Ohr nicht. Der uebrige Katalog (Rochade, Kroenung, Talente,
// Trank, Zeitenwender, Riss, Bestie, Meister, Werbung, Kapitel, Menue, Karte)
// ist erzeugt, liegt zum Hoeren bereit und wartet auf das Urteil des Besitzers.
const QUELLEN = {
  wahl: [waehlenKlang],
  zug: [zugKlang, zug2Klang, zug3Klang],
  treffer: [trefferKlang, treffer2Klang],
  fall: [fallKlang, fall2Klang],
  nein: [gesperrtKlang],
  // v0.77: die Klaenge um das Brett herum
  schach: [schachKlang],
  sieg: [siegKlang],
  niederlage: [niederlageKlang],
  stufe: [stufeKlang],
  frei: [freiKlang],
  gold: [goldKlang],
};

// Lautstaerke je Art: der Zug klingt hundertmal, der Sturz selten - also darf
// der Sturz lauter sein, ohne aufdringlich zu werden.
const PEGEL = { wahl: 0.55, zug: 0.85, treffer: 1.0, fall: 1.0, nein: 0.7,
  // Seltene Klaenge duerfen lauter stehen, haeufige bleiben zurueckhaltend.
  schach: 0.8, sieg: 0.9, niederlage: 0.85, stufe: 0.85, frei: 0.8, gold: 0.75 };

let ctx = null;
let meister = null;          // Summenregler
const puffer = new Map();    // url → AudioBuffer
let an = true;
let staerke = 0.6;
let letzte = {};             // art → zuletzt gespielter Index (nie zweimal derselbe)

function wecke() {
  if (ctx) return ctx;
  const AC = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
  if (!AC) return null;
  try {
    ctx = new AC();
    meister = ctx.createGain();
    meister.gain.value = staerke;
    meister.connect(ctx.destination);
  } catch { ctx = null; }
  return ctx;
}

async function hole(url) {
  if (puffer.has(url)) return puffer.get(url);
  const c = wecke();
  if (!c) return null;
  try {
    const roh = await (await fetch(url)).arrayBuffer();
    const buf = await c.decodeAudioData(roh);
    puffer.set(url, buf);
    return buf;
  } catch { return null; }
}

/** Alle Klaenge im Hintergrund entschluesseln - der erste Zug soll nicht warten. */
export function klangVorwaermen() {
  if (!an) return;
  const alle = Object.values(QUELLEN).flat();
  alle.forEach((u, i) => setTimeout(() => { hole(u); }, i * 60));
}

/** Regler aus dem Profil uebernehmen. */
export function klangEinstellen({ ein, lautstaerke }) {
  if (typeof ein === "boolean") an = ein;
  if (typeof lautstaerke === "number") {
    staerke = Math.max(0, Math.min(1, lautstaerke));
    if (meister) meister.gain.value = staerke;
  }
}

/**
 * Einen Klang spielen.
 * @param {"wahl"|"zug"|"treffer"|"fall"|"nein"|"schach"|"sieg"|"niederlage"|"stufe"|"frei"|"gold"} art
 */
export function klang(art) {
  // leere Liste = dieser Klang ist (noch) nicht besetzt - stumm bleiben
  if (!an || !QUELLEN[art] || !QUELLEN[art].length) return;
  const c = wecke();
  if (!c) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  const liste = QUELLEN[art];
  // nie zweimal hintereinander dieselbe Aufnahme
  let i = Math.floor(Math.random() * liste.length);
  if (liste.length > 1 && i === letzte[art]) i = (i + 1) % liste.length;
  letzte[art] = i;
  const url = liste[i];
  const buf = puffer.get(url);
  const spiele = (b) => {
    if (!b) return;
    try {
      const q = c.createBufferSource();
      q.buffer = b;
      q.playbackRate.value = 1 + (Math.random() * 0.08 - 0.04);   // +-4 % Tonhoehe
      const g = c.createGain();
      g.gain.value = PEGEL[art] ?? 1;
      q.connect(g); g.connect(meister);
      q.start();
    } catch {}
  };
  if (buf) spiele(buf); else hole(url).then(spiele);
}
