// The CARVED set — the third piece style, next to "simpel" (SVG) and the
// painted gallery. Every figure is one object cut from dark stone-clay with an
// inlay that grows with rank: the pawn wears a single band, the king roughly a
// third of his surface. Faces are only suggested (three cuts: eye hollows,
// nose ridge, mouth line) so the pieces stay adult and quiet rather than cute.
//
// TWO STONES, NOT A FILTER. Only one set is ever generated — a mid-tone slate
// body with yellow gold inlay, rose-brown skin and emerald rank stones, cut so
// that every material meets the next along a hard edge. tools/carve-teams.py
// takes the two sides out of it:
//   *-light  warm ivory stone, the gold left standing        -> the good side
//   *-dark   cold basalt, the gold polished to silver, the
//            skin drained to ash                             -> the other one
// Three of the four materials therefore differ between the teams, which is what
// makes them tell apart at board distance. A CSS filter could only tint the
// whole figure and would drag inlay, skin and stones along with it. (Purple is
// deliberately unused here — it is reserved for the monsters.)
//
// Only the six basic ranks are carved so far. Everything else — the court, the
// bosses, the Gambit's tiers — keeps falling back to the painted gallery, so
// switching the style never leaves an empty square.
import lPawn from "../assets/carved/carved-pawn-light.webp";
import lKnight from "../assets/carved/carved-knight-light.webp";
import lBishop from "../assets/carved/carved-bishop-light.webp";
import lRook from "../assets/carved/carved-rook-light.webp";
import lQueen from "../assets/carved/carved-queen-light.webp";
import lKing from "../assets/carved/carved-king-light.webp";
import dPawn from "../assets/carved/carved-pawn-dark.webp";
import dKnight from "../assets/carved/carved-knight-dark.webp";
import dBishop from "../assets/carved/carved-bishop-dark.webp";
import dRook from "../assets/carved/carved-rook-dark.webp";
import dQueen from "../assets/carved/carved-queen-dark.webp";
import dKing from "../assets/carved/carved-king-dark.webp";

/** the good side: warm ivory stone, gold inlay, living skin. */
export const CARVED_LIGHT = { P: lPawn, N: lKnight, B: lBishop, R: lRook, Q: lQueen, K: lKing };
/** the other side: cold basalt, silver inlay, ashen skin. */
export const CARVED_DARK = { P: dPawn, N: dKnight, B: dBishop, R: dRook, Q: dQueen, K: dKing };

/** Carving for a live board piece — or null when this set has none yet.
 *  Bosses and the risen Gambit are deliberately excluded: they carry their own
 *  portraits, and a half-carved boss line would read as a bug, not a style. */
export function carvedForPiece(piece) {
  if (!piece || piece.bossId || piece.hero) return null;
  const set = piece.color === "w" ? CARVED_LIGHT : CARVED_DARK;
  return set[piece.kind] || null;
}

// Every carving was cropped to its own silhouette and scaled to one common
// height, with the base sitting on the bottom edge — so unlike the painted
// gallery they need no per-file fit table. The board just plants them.
export const CARVED_FIT = { h: 1, y: 0, x: 0 };
