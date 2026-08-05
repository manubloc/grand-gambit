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
import treffer2Klang from "./assets/klang/treffer-2.webm";
import fall2Klang from "./assets/klang/fall-2.webm";
/* v0.77: sieben neue Klaenge, ueber ElevenLabs nach design/KLANG-PROMPTS.md
   erzeugt, geschnitten und auf -3 dBFS gebracht wie die vier davor. */
import zugKlang from "./assets/klang/zug.webm";
import sprungKlang from "./assets/klang/sprung.webm";
/* v0.79: DER GANZE KATALOG. Jede Art traegt ihre Quelle(n); was am Brett oder
   im Menue haeufig klingt, steht leiser als das Seltene und Feierliche.
   Sturz und Treffer sind auf Besitzerwunsch DUMPFER (Tiefpass: Sturz
   851->622 Hz, Treffer 485->358 Hz - Holz auf Holzplatte, kein Klingen). */
import pfeilKlang from "./assets/klang/pfeil.webm";
import rochadeKlang from "./assets/klang/rochade.webm";
import kroenungKlang from "./assets/klang/kroenung.webm";
import talentGoldKlang from "./assets/klang/talentgold.webm";
import sturmschrittKlang from "./assets/klang/sturmschritt.webm";
import drachenflugKlang from "./assets/klang/drachenflug.webm";
import trankKlang from "./assets/klang/trank.webm";
import zeitenwenderKlang from "./assets/klang/zeitenwender.webm";
import zeitrissKlang from "./assets/klang/zeitriss.webm";
import rissBlitzKlang from "./assets/klang/rissblitz.webm";
import bestieKlang from "./assets/klang/bestie.webm";
import meisterKlang from "./assets/klang/meister.webm";
import werbungKlang from "./assets/klang/werbung.webm";
import kapitelEndeKlang from "./assets/klang/kapitelende.webm";
import menueTippKlang from "./assets/klang/menuetipp.webm";
import blattAufKlang from "./assets/klang/blattauf.webm";
import blattZuKlang from "./assets/klang/blattzu.webm";
import karteStationKlang from "./assets/klang/kartestation.webm";
import karteFreiKlang from "./assets/klang/kartefrei.webm";
import kapitelKlang from "./assets/klang/kapitel.webm";
import karteSchrittKlang from "./assets/klang/karteschritt.webm";
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
  /* v0.81 (Besitzer): GENAU EINE Aufnahme fuer den Zug. Vorher lagen hier drei
     Varianten, aus denen zufaellig gewaehlt wurde - und weiter unten sorgte
     eine Regel dafuer, dass NIE zweimal dieselbe kam. Dein Zug und die
     Antwort des Gegners folgen unmittelbar aufeinander, klangen also
     zwangslaeufig verschieden. Genau der Eindruck, den der Besitzer gemeldet
     hat. Eine Aufnahme fuer beide Seiten, fertig.
     Der Klang selbst ist neu: hoelzern statt metallisch (Schwerpunkt 538 statt
     1893 Hz) und leiser (-23,5 statt -18 dBFS). */
  zug: [zugKlang],
  /* Wer SPRINGT, schleift nicht: der Springer (und jeder Sprungzug) setzt nur
     mit einem leisen hoelzernen Tock auf - 0,12 s, 707 Hz. Beim Abheben
     bleibt es still, gehoert wird allein die Landung. */
  sprung: [sprungKlang],
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
  // v0.79: Sonderzuege und Faehigkeiten
  pfeil: [pfeilKlang],
  rochade: [rochadeKlang],
  kroenung: [kroenungKlang],
  talentGold: [talentGoldKlang],
  /* v0.82 (Hoerurteil): der Riss-Klang war "eher gut fuer einen
     Stufenaufstieg" - also wandert sein Charakter dorthin, und ein Talent
     klingt auf BEIDEN Seiten wie das Talent des Hofes. Ein Haus, ein Zeichen. */
  talentRiss: [talentGoldKlang],
  sturmschritt: [sturmschrittKlang],
  drachenflug: [drachenflugKlang],
  trank: [trankKlang],
  zeitenwender: [zeitenwenderKlang],
  zeitriss: [zeitrissKlang],
  rissBlitz: [rissBlitzKlang],
  // Auftritte und Feier
  bestie: [bestieKlang],
  meister: [meisterKlang],
  werbung: [werbungKlang],
  kapitelEnde: [kapitelEndeKlang],
  // Menue und Karte - bewusst SEHR leise (siehe PEGEL)
  menue: [menueTippKlang],
  blattAuf: [blattAufKlang],
  blattZu: [blattZuKlang],
  karteStation: [karteStationKlang],
  karteFrei: [karteFreiKlang],
  /* Der HEROLD ist fort: er klang nur beim allerersten Oeffnen eines
     Menue-Blattes - so selten, dass er sich niemandem zuordnen liess.
     Dafuer zwei neue Klaenge der Weltkarte: */
  kapitel: [kapitelKlang],           // ein neues Kapitel tut sich auf
  karteSchritt: [karteSchrittKlang], // der Gambit rueckt vor: Holz auf Stein
};

// Lautstaerke je Art: der Zug klingt hundertmal, der Sturz selten - also darf
// der Sturz lauter sein, ohne aufdringlich zu werden.
/* v0.82 (Besitzer: "das muss viel weniger sein"): die ganze Tafel ist eine
   Stufe zurueckgenommen. Was oft klingt, klingt leise; was selten kommt, darf
   tragen - aber keiner mehr auf Anschlag. Die Aufnahmen selbst wurden
   zusaetzlich leiser gemeistert (-22 bis -33 dBFS); dieser Pegel ist die
   zweite Bremse, nicht die erste. */
const PEGEL = { wahl: 0.5, zug: 0.7, treffer: 0.85, fall: 0.85, nein: 0.45,
  sprung: 0.6, schach: 0.7, sieg: 0.8, niederlage: 0.75, stufe: 0.7, frei: 0.65, gold: 0.6,
  pfeil: 0.7, rochade: 0.6, kroenung: 0.8, talentGold: 0.6, talentRiss: 0.6,
  sturmschritt: 0.5, drachenflug: 0.8, trank: 0.6, zeitenwender: 0.4,
  zeitriss: 0.6, rissBlitz: 0.5, bestie: 0.8, meister: 0.8, werbung: 0.65,
  kapitelEnde: 0.75,
  // Menue und Karte: das Minimalste im Haus - fuehlbar, nie aufdringlich.
  menue: 0.22, blattAuf: 0.3, blattZu: 0.26, karteStation: 0.3, karteFrei: 0.5,
  kapitel: 0.6, karteSchritt: 0.4 };

let ctx = null;
let meister = null;          // Summenregler
const puffer = new Map();    // url → AudioBuffer
let an = true;
let staerke = 0.6;
let letzte = {};             // art → zuletzt gespielter Index (nie zweimal derselbe)
let zaehler = 0;             // zaehlt jede klang()-Absicht (fuer den Klangfaenger)

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
 * @param {string} art  eine der Arten aus QUELLEN
 */
export function klang(art) {
  zaehler++;   // auch ein stummer Versuch zaehlt als "diese Stelle klingt selbst"
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

/* ── DER KLANGFAENGER (v1.0.3, Besitzerwunsch) ──────────────────────────────
   "Du darfst diesen Menue-Sound gerne ueberall verwenden, wo sonst nichts
   waere." Statt jeden der verstreuten Knoepfe einzeln zu verdrahten, hoert
   EIN Faenger in der Capture-Phase auf jeden Klick auf etwas Druckbares.
   Er spielt den leisen Menuetipp - ABER NUR, wenn die Stelle nicht selbst
   klingt: React-Handler laufen synchron nach der Capture-Phase, also wird
   die Entscheidung um einen Tick verschoben und faellt aus, sobald in
   diesem Klick bereits ein klang() lief (der Zaehler zaehlt auch stumme
   Versuche mit, damit ein abgeschalteter Effektkanal nicht ploetzlich
   doppelt tippt, wenn er wieder angeht). Bereiche mit eigener Klangwelt
   koennen sich mit data-klang="aus" ganz ausnehmen. */
export function klangUeberall() {
  if (typeof document === "undefined" || klangUeberall._an) return;
  klangUeberall._an = true;
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!t || !t.closest) return;
    const el = t.closest(
      'button, [role="button"], a[href], select, summary, input[type="checkbox"], input[type="radio"]');
    if (!el || el.closest('[data-klang="aus"]')) return;
    const vorher = zaehler;
    setTimeout(() => { if (zaehler === vorher) klang("menue"); }, 0);
  }, true);
}
