// ── WAS AUF DEM FELD STEHT UND NICHT ZIEHT ──────────────────────────────────
// Mauern, Zaeune und Fallen (v0.90, Besitzerentwurf). Sie sind KEINE Figuren:
// sie ziehen nicht, sie schlagen nicht, sie zaehlen nicht zum Material. Sie
// besetzen ein Feld und aendern, was dort moeglich ist.
//
// DIE ENTSCHEIDUNGEN, die dieser Datei zugrunde liegen:
//
//  1. EINE SPERRE KOSTET ZUEGE, NICHT FIGUREN. Wer gegen sie schlaegt, bleibt
//     stehen - der Zug ist fort, die Figur unversehrt. Genau das ist der
//     Nachteil, den der Besitzer wollte: nicht das Zerschlagen selbst, der
//     verlorene Zug.
//  2. DREI STADIEN. Jede Sperre bricht sichtbar: heil, angeschlagen,
//     Truemmer. Darum traegt sie Lebenspunkte und keinen blossen Schalter.
//  3. WER SPRINGT, KOMMT DARUEBER. Der Springer (und jeder Sprungzug) setzt
//     ueber eine Mauer hinweg - er landet nur nicht darauf. Gleitende Figuren
//     hingegen halten davor an, wie an jeder Wand.
//  4. FALLEN SIEHT NUR, WER SIE LEGTE. Sie liegen still, bis jemand
//     hineinzieht; danach sind sie fuer alle sichtbar (die Grube bleibt).

/** Die Sorten. Preis und Haerte gehoeren zusammen: was laenger haelt, kostet
 *  mehr - und kostet den Gegner mehr Zuege. */
export const SPERR_ARTEN = {
  // Der Zaun: billig, schnell fort. Ein Zug Aufenthalt, mehr nicht.
  zaun:      { hp: 1, gold: 40,  nameDe: "Zaun",        nameEn: "Fence",
               beschreibungDe: "Hält einen einzigen Schlag auf. Billig und schnell wieder fort." },
  // Die Mauer: das Rueckgrat. Zwei Schlaege, also zwei verlorene Zuege.
  mauer:     { hp: 2, gold: 110, nameDe: "Mauer",       nameEn: "Wall",
               beschreibungDe: "Zwei Schläge, bis sie fällt — zwei Züge, die dem Gegner fehlen." },
  // Der Bergfried: teuer und zaeh. Drei Zuege sind eine halbe Partie.
  bergfried: { hp: 3, gold: 240, nameDe: "Bollwerk",    nameEn: "Bulwark",
               beschreibungDe: "Drei Schläge. Wer hier durchwill, verliert eine halbe Eröffnung." },
};

/** Fallen wirken anders: sie halten niemanden auf, sie strafen das Betreten. */
export const FALLEN_ARTEN = {
  // Die Spitzgrube: fester Schaden, sofort.
  grube:     { schaden: 2, gold: 90,  nameDe: "Spitzgrube", nameEn: "Pit trap",
               beschreibungDe: "Wer hineintritt, nimmt 2 Schaden. Danach liegt sie offen." },
  // Die Baerenfalle: kein Schaden, aber die Figur steht fest - ein Zug fort.
  baerenfalle: { fessel: 1, gold: 130, nameDe: "Bärenfalle", nameEn: "Bear trap",
               beschreibungDe: "Kein Schaden — die Figur sitzt fest und setzt einen Zug aus." },
};

// ── Zugriff ─────────────────────────────────────────────────────────────────
// Sperren und Fallen liegen als schlichte Verzeichnisse am Zustand, damit
// Klonen und Speichern nichts Besonderes lernen muessen.

export const sperrenVon = (state) => state.sperren || null;
export const sperreAuf = (state, i) => (state.sperren ? state.sperren[i] : undefined);
export const fallenVon = (state) => state.fallen || null;
export const falleAuf = (state, i) => (state.fallen ? state.fallen[i] : undefined);

/** Steht dort etwas, das den Weg versperrt? */
export function versperrt(state, i) {
  const s = sperreAuf(state, i);
  return !!(s && s.hp > 0);
}

/** In welchem der drei Stadien steht die Sperre? Fuer das Bild auf dem Brett. */
export function stadium(sperre) {
  if (!sperre || sperre.hp <= 0) return "truemmer";
  const voll = SPERR_ARTEN[sperre.art]?.hp || 1;
  if (sperre.hp >= voll) return "heil";
  return "angeschlagen";
}

/** Einen Schlag gegen eine Sperre fuehren. Gibt das neue Verzeichnis zurueck
 *  (oder dasselbe, wenn dort nichts stand). */
export function schlageSperre(sperren, i) {
  const s = sperren && sperren[i];
  if (!s || s.hp <= 0) return { sperren, gefallen: false };
  const neu = { ...sperren };
  if (s.hp <= 1) { delete neu[i]; return { sperren: neu, gefallen: true }; }
  neu[i] = { ...s, hp: s.hp - 1 };
  return { sperren: neu, gefallen: false };
}

/** Eine Falle ausloesen. Liefert die Wirkung und das bereinigte Verzeichnis:
 *  die Falle bleibt liegen, ist aber ab jetzt offen (und wirkt nicht erneut). */
export function loeseFalleAus(fallen, i) {
  const f = fallen && fallen[i];
  if (!f || f.offen) return { fallen, wirkung: null };
  const art = FALLEN_ARTEN[f.art] || FALLEN_ARTEN.grube;
  const neu = { ...fallen, [i]: { ...f, offen: true } };
  return { fallen: neu, wirkung: { art: f.art, schaden: art.schaden || 0, fessel: art.fessel || 0 } };
}

/** Sieht diese Seite die Falle? Nur wer sie gelegt hat - bis sie zuschnappt. */
export function falleSichtbar(falle, fuerFarbe) {
  if (!falle) return false;
  return falle.offen || falle.von === fuerFarbe;
}
