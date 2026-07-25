// The CARVED set — the third piece style, next to "simpel" (SVG) and the
// painted gallery. Every figure is one object cut from the same dark navy
// stone-clay with antique gold inlaid by rank: the pawn wears a single band,
// the king wears roughly a third of his surface in gold. Faces are only
// suggested (three cuts: eye hollows, nose ridge, mouth line) so the pieces
// stay adult and quiet rather than cute.
//
// Only the six basic ranks are carved so far. Everything else — the court, the
// bosses, the Gambit's tiers — keeps falling back to the painted gallery, so
// switching the style never leaves an empty square.
import cPawn from "../assets/carved/carved-pawn.webp";
import cKnight from "../assets/carved/carved-knight.webp";
import cBishop from "../assets/carved/carved-bishop.webp";
import cRook from "../assets/carved/carved-rook.webp";
import cQueen from "../assets/carved/carved-queen.webp";
import cKing from "../assets/carved/carved-king.webp";
// The light team is not a filter but its own stone: tools/carve-light.py lifts
// the navy of each figure onto a cream alabaster ramp and leaves the inlaid
// gold exactly where it was. A hue filter could only ever tint the whole
// figure, which turned the gold to silver and the stone to a flat grey.
import lPawn from "../assets/carved/carved-pawn-light.webp";
import lKnight from "../assets/carved/carved-knight-light.webp";
import lBishop from "../assets/carved/carved-bishop-light.webp";
import lRook from "../assets/carved/carved-rook-light.webp";
import lQueen from "../assets/carved/carved-queen-light.webp";
import lKing from "../assets/carved/carved-king-light.webp";

/** kind letter -> carved artwork. Missing kinds fall back to the gallery. */
export const CARVED = { P: cPawn, N: cKnight, B: cBishop, R: cRook, Q: cQueen, K: cKing };
/** the same figures cut from cream alabaster — the opposing team. */
export const CARVED_LIGHT = { P: lPawn, N: lKnight, B: lBishop, R: lRook, Q: lQueen, K: lKing };

/** Carving for a live board piece — or null when this set has none yet.
 *  Bosses and the risen Gambit are deliberately excluded: they carry their own
 *  portraits, and a half-carved boss line would read as a bug, not a style. */
export function carvedForPiece(piece) {
  if (!piece || piece.bossId || piece.hero) return null;
  const set = piece.color === "w" ? CARVED : CARVED_LIGHT;
  return set[piece.kind] || null;
}

// Every carving was cropped to its own silhouette and scaled to one common
// height, with the base sitting on the bottom edge — so unlike the painted
// gallery they need no per-file fit table. The board just plants them.
export const CARVED_FIT = { h: 1, y: 0, x: 0 };
