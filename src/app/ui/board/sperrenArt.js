// ── DIE SPERREN, IN BILDERN ─────────────────────────────────────────────────
// Die Mechanik gibt es seit v0.90 (core/rules/sperren.js), gezeichnet wurde
// sie nie: sperren.js hing allein an transitions.js, in der Oberflaeche kam
// sie nicht vor. Eine Regel, die niemand sieht, ist keine Regel - hier sind
// die Bilder dazu.
//
// stadium(sperre) liefert genau drei Worte, und genau drei Bilder gibt es je
// Art: "heil" | "angeschlagen" | "truemmer".
//
// ZWEI MASSE JE BILD. Die 192-px-Fassung geht aufs Brett (dasselbe Mass wie
// die Figuren seit v1.0.38 - eine Sperre steht auf einem 50-px-Feld, alles
// Groessere ist verschenkte Rechenzeit). Die 576er ist fuers Blatt und die
// Schaukammer, wo man sie gross ansieht.
//
// TRUEMMER SIND ANDERS. Die beiden aufrechten Zustaende stehen wie eine Figur
// auf der Grundkante. Die Truemmer LIEGEN, breit und flach, und sie sind kein
// Dauerzustand: sie zeigen sich kurz und verblassen dann unter der Figur, die
// darueber zieht. Wer sie festhaelt, verdeckt das Brett.
import mauerHeil from "../assets/sperren/mauer-heil.webp";
import mauerRiss from "../assets/sperren/mauer-riss.webp";
import mauerSchutt from "../assets/sperren/mauer-schutt.webp";
import mauerHeilG from "../assets/sperren/mauer-heil@gross.webp";
import mauerRissG from "../assets/sperren/mauer-riss@gross.webp";
import mauerSchuttG from "../assets/sperren/mauer-schutt@gross.webp";

/* Je Art die drei Zustaende. Fehlt eine Art noch (Zaun, Bollwerk), steht sie
   hier ausdruecklich als null - dann weiss der Aufrufer, dass das Bild fehlt,
   statt still nichts zu zeichnen. */
export const SPERR_BILDER = {
  mauer:     { heil: mauerHeil, angeschlagen: mauerRiss, truemmer: mauerSchutt },
  zaun:      null,        // Bilder stehen noch aus
  bergfried: null,        // Bilder stehen noch aus
};

export const SPERR_BILDER_GROSS = {
  mauer:     { heil: mauerHeilG, angeschlagen: mauerRissG, truemmer: mauerSchuttG },
  zaun:      null,
  bergfried: null,
};

/** Das Bild fuer eine Sperre in ihrem Zustand - oder null, wenn die Art noch
 *  keine Bilder hat. */
export function sperrBild(art, zustand, gross = false) {
  const satz = (gross ? SPERR_BILDER_GROSS : SPERR_BILDER)[art];
  return (satz && satz[zustand]) || null;
}

/* WIE HOCH SITZT WAS. Die aufrechten Zustaende fuellen das Feld fast ganz und
   stehen auf der Grundkante; die Truemmer liegen flach und breit im unteren
   Drittel. Ohne diese Trennung schwebte der Schutt in der Feldmitte wie ein
   Gegenstand, den jemand hochhaelt. */
export const SPERR_SITZ = {
  heil:         { hoehe: 0.96, unten: 0.02, breite: 1.02 },
  angeschlagen: { hoehe: 0.94, unten: 0.02, breite: 1.04 },
  truemmer:     { hoehe: 0.42, unten: 0.04, breite: 1.14 },
};
