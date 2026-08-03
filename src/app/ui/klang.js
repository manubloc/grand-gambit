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

import tap1 from "./assets/klang/tap-select-1.webm";
import tap2 from "./assets/klang/tap-select-2.webm";
import tap3 from "./assets/klang/tap-select-3.webm";
import setz1 from "./assets/klang/move-place-1.webm";
import setz2 from "./assets/klang/move-place-2.webm";
import setz3 from "./assets/klang/move-place-3.webm";
import schlag1 from "./assets/klang/hit-1.webm";
import schlag2 from "./assets/klang/hit-2.webm";
import fall1 from "./assets/klang/capture-kill-1.webm";
import fall2 from "./assets/klang/capture-kill-2.webm";
import nein1 from "./assets/klang/denied-1.webm";

const QUELLEN = {
  wahl: [tap1, tap2, tap3],
  zug: [setz1, setz2, setz3],
  treffer: [schlag1, schlag2],
  fall: [fall1, fall2],
  nein: [nein1],
};

// Lautstaerke je Art: der Zug klingt hundertmal, der Sturz selten - also darf
// der Sturz lauter sein, ohne aufdringlich zu werden.
const PEGEL = { wahl: 0.55, zug: 0.85, treffer: 1.0, fall: 1.0, nein: 0.7 };

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
 * @param {"wahl"|"zug"|"treffer"|"fall"|"nein"} art
 */
export function klang(art) {
  if (!an || !QUELLEN[art]) return;
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
