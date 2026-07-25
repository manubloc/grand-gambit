// The CARVED set — the third piece style, next to "simpel" (SVG) and the
// painted gallery. Every figure is one object cut from dark stone-clay with an
// inlay that grows with rank: the pawn wears a single band, the king roughly a
// third of his surface. Faces are only suggested (three cuts: eye hollows,
// nose ridge, mouth line) so the pieces stay adult and quiet rather than cute.
//
// TWO STONES, NOT A FILTER. Only one set is ever generated — dark stone with
// antique gold. tools/carve-teams.py cuts the two sides out of it:
//   *-light   pale alabaster, the gold left standing   -> the player
//   *-silver  the same dark stone, the inlay polished to silver -> the enemy
// A CSS filter could only tint the whole figure, which dragged the inlay along
// with it and turned the stone to flat grey. (Purple is deliberately unused
// here — it is reserved for the monsters.)
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
import sPawn from "../assets/carved/carved-pawn-silver.webp";
import sKnight from "../assets/carved/carved-knight-silver.webp";
import sBishop from "../assets/carved/carved-bishop-silver.webp";
import sRook from "../assets/carved/carved-rook-silver.webp";
import sQueen from "../assets/carved/carved-queen-silver.webp";
import sKing from "../assets/carved/carved-king-silver.webp";

/** the player's side: pale alabaster with the gold inlay left standing. */
export const CARVED_LIGHT = { P: lPawn, N: lKnight, B: lBishop, R: lRook, Q: lQueen, K: lKing };
/** the opposing side: the same dark stone, its inlay polished to silver. */
export const CARVED_SILVER = { P: sPawn, N: sKnight, B: sBishop, R: sRook, Q: sQueen, K: sKing };

/** Carving for a live board piece — or null when this set has none yet.
 *  Bosses and the risen Gambit are deliberately excluded: they carry their own
 *  portraits, and a half-carved boss line would read as a bug, not a style. */
export function carvedForPiece(piece) {
  if (!piece || piece.bossId || piece.hero) return null;
  const set = piece.color === "w" ? CARVED_LIGHT : CARVED_SILVER;
  return set[piece.kind] || null;
}

// Every carving was cropped to its own silhouette and scaled to one common
// height, with the base sitting on the bottom edge — so unlike the painted
// gallery they need no per-file fit table. The board just plants them.
export const CARVED_FIT = { h: 1, y: 0, x: 0 };
