// The CARVED set — the third piece style, next to "simpel" (SVG) and the
// painted gallery. Every figure is one object cut from stone with an inlay that
// grows with rank: the pawn wears a single band, the king roughly a third of his
// surface. Faces are only suggested — three cuts for eye hollows, nose ridge and
// mouth line — so the pieces stay adult and quiet rather than cute, and every
// figure must still read as a pure black silhouette.
//
// TWO STONES, NOT A FILTER. Only one set is ever generated: a mid-tone slate
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
// The whole roster is carved now — the six basic ranks, the twenty court
// figures, the Gambit, and all twenty-five bosses.
//
// THE MONSTERS FOLLOW THEIR OWN LAW. Their body is black basalt, never the
// kingdom's slate, and they carry NO gold — gold belongs to the kingdom. Each
// one wears the signature colour the game already gives it in content/bosses.js
// as its only inlay, and the same colour glows in its eye hollows. That glow is
// the one detail that survives to 24 pixels, so a monster stays a monster even
// on the smallest square. Because a boss is only ever the foe, it is not split
// into two stones: the same carving serves both sides.
import lPawn from "../assets/carved/carved-pawn-light.webp";
import lKnight from "../assets/carved/carved-knight-light.webp";
import lBishop from "../assets/carved/carved-bishop-light.webp";
import lRook from "../assets/carved/carved-rook-light.webp";
import lQueen from "../assets/carved/carved-queen-light.webp";
import lKing from "../assets/carved/carved-king-light.webp";
import lArchbishop from "../assets/carved/carved-archbishop-light.webp";
import lChancellor from "../assets/carved/carved-chancellor-light.webp";
import lHawk from "../assets/carved/carved-hawk-light.webp";
import lAmazon from "../assets/carved/carved-amazon-light.webp";
import lCaptain from "../assets/carved/carved-captain-light.webp";
import lAssassin from "../assets/carved/carved-assassin-light.webp";
import lSeeress from "../assets/carved/carved-seeress-light.webp";
import lGuardian from "../assets/carved/carved-guardian-light.webp";
import lDragon from "../assets/carved/carved-dragon-light.webp";
import lMage from "../assets/carved/carved-mage-light.webp";
import lSorceress from "../assets/carved/carved-sorceress-light.webp";
import lAlchemist from "../assets/carved/carved-alchemist-light.webp";
import lWarlock from "../assets/carved/carved-warlock-light.webp";
import lPaladin from "../assets/carved/carved-paladin-light.webp";
import lInquisitor from "../assets/carved/carved-inquisitor-light.webp";
import lBard from "../assets/carved/carved-bard-light.webp";
import lEngineer from "../assets/carved/carved-engineer-light.webp";
import lStandard from "../assets/carved/carved-standard-light.webp";
import lStrategist from "../assets/carved/carved-strategist-light.webp";
import lPathfinder from "../assets/carved/carved-pathfinder-light.webp";
import lGambit from "../assets/carved/carved-gambit-light.webp";
import dPawn from "../assets/carved/carved-pawn-dark.webp";
import dKnight from "../assets/carved/carved-knight-dark.webp";
import dBishop from "../assets/carved/carved-bishop-dark.webp";
import dRook from "../assets/carved/carved-rook-dark.webp";
import dQueen from "../assets/carved/carved-queen-dark.webp";
import dKing from "../assets/carved/carved-king-dark.webp";
import dArchbishop from "../assets/carved/carved-archbishop-dark.webp";
import dChancellor from "../assets/carved/carved-chancellor-dark.webp";
import dHawk from "../assets/carved/carved-hawk-dark.webp";
import dAmazon from "../assets/carved/carved-amazon-dark.webp";
import dCaptain from "../assets/carved/carved-captain-dark.webp";
import dAssassin from "../assets/carved/carved-assassin-dark.webp";
import dSeeress from "../assets/carved/carved-seeress-dark.webp";
import dGuardian from "../assets/carved/carved-guardian-dark.webp";
import dDragon from "../assets/carved/carved-dragon-dark.webp";
import dMage from "../assets/carved/carved-mage-dark.webp";
import dSorceress from "../assets/carved/carved-sorceress-dark.webp";
import dAlchemist from "../assets/carved/carved-alchemist-dark.webp";
import dWarlock from "../assets/carved/carved-warlock-dark.webp";
import dPaladin from "../assets/carved/carved-paladin-dark.webp";
import dInquisitor from "../assets/carved/carved-inquisitor-dark.webp";
import dBard from "../assets/carved/carved-bard-dark.webp";
import dEngineer from "../assets/carved/carved-engineer-dark.webp";
import dStandard from "../assets/carved/carved-standard-dark.webp";
import dStrategist from "../assets/carved/carved-strategist-dark.webp";
import dPathfinder from "../assets/carved/carved-pathfinder-dark.webp";
import dGambit from "../assets/carved/carved-gambit-dark.webp";
import xB01 from "../assets/carved/carved-boss-b01.webp";
import xB02 from "../assets/carved/carved-boss-b02.webp";
import xB03 from "../assets/carved/carved-boss-b03.webp";
import xB04 from "../assets/carved/carved-boss-b04.webp";
import xB05 from "../assets/carved/carved-boss-b05.webp";
import xB06 from "../assets/carved/carved-boss-b06.webp";
import xB07 from "../assets/carved/carved-boss-b07.webp";
import xB08 from "../assets/carved/carved-boss-b08.webp";
import xB09 from "../assets/carved/carved-boss-b09.webp";
import xB10 from "../assets/carved/carved-boss-b10.webp";
import xB11 from "../assets/carved/carved-boss-b11.webp";
import xB12 from "../assets/carved/carved-boss-b12.webp";
import xB13 from "../assets/carved/carved-boss-b13.webp";
import xB14 from "../assets/carved/carved-boss-b14.webp";
import xB15 from "../assets/carved/carved-boss-b15.webp";
import xB16 from "../assets/carved/carved-boss-b16.webp";
import xB17 from "../assets/carved/carved-boss-b17.webp";
import xB18 from "../assets/carved/carved-boss-b18.webp";
import xB19 from "../assets/carved/carved-boss-b19.webp";
import xB20 from "../assets/carved/carved-boss-b20.webp";
import xB21 from "../assets/carved/carved-boss-b21.webp";
import xB22 from "../assets/carved/carved-boss-b22.webp";
import xB23 from "../assets/carved/carved-boss-b23.webp";
import xB24 from "../assets/carved/carved-boss-b24.webp";
import xB25 from "../assets/carved/carved-boss-b25.webp";

/** the good side: warm ivory stone, gold inlay, living skin. */
export const CARVED_LIGHT = {
  pawn: lPawn, knight: lKnight, bishop: lBishop, rook: lRook, queen: lQueen, king: lKing,
  archbishop: lArchbishop, chancellor: lChancellor, hawk: lHawk, amazon: lAmazon,
  captain: lCaptain, assassin: lAssassin, seeress: lSeeress, guardian: lGuardian,
  dragon: lDragon, mage: lMage, sorceress: lSorceress, alchemist: lAlchemist,
  warlock: lWarlock, paladin: lPaladin, inquisitor: lInquisitor, bard: lBard,
  engineer: lEngineer, standard: lStandard, strategist: lStrategist, pathfinder: lPathfinder,
  gambit: lGambit
};
/** the other side: cold basalt, silver inlay, ashen skin. */
export const CARVED_DARK = {
  pawn: dPawn, knight: dKnight, bishop: dBishop, rook: dRook, queen: dQueen, king: dKing,
  archbishop: dArchbishop, chancellor: dChancellor, hawk: dHawk, amazon: dAmazon,
  captain: dCaptain, assassin: dAssassin, seeress: dSeeress, guardian: dGuardian,
  dragon: dDragon, mage: dMage, sorceress: dSorceress, alchemist: dAlchemist,
  warlock: dWarlock, paladin: dPaladin, inquisitor: dInquisitor, bard: dBard,
  engineer: dEngineer, standard: dStandard, strategist: dStrategist, pathfinder: dPathfinder,
  gambit: dGambit
};

/** the monsters: one carving each, black basalt with its own signature colour. */
export const CARVED_BOSS = {
  b01: xB01, b02: xB02, b03: xB03, b04: xB04, b05: xB05, b06: xB06, b07: xB07, b08: xB08,
  b09: xB09, b10: xB10, b11: xB11, b12: xB12, b13: xB13, b14: xB14, b15: xB15, b16: xB16,
  b17: xB17, b18: xB18, b19: xB19, b20: xB20, b21: xB21, b22: xB22, b23: xB23, b24: xB24,
  b25: xB25
};

// Kind letter -> character id. The pawn wins the shared "P"; the hero flag
// picks the Gambit out of it. Mirrors the gallery's own table.
const KIND2ID = {
  P: "pawn", N: "knight", B: "bishop", R: "rook", Q: "queen", K: "king",
  A: "archbishop", C: "chancellor", H: "hawk", M: "amazon", V: "captain", S: "assassin", SE: "seeress",
  G: "guardian", D: "dragon", E: "mage", Z: "sorceress", L: "alchemist", W: "warlock",
  U: "paladin", I: "inquisitor", J: "bard", T: "engineer", F: "standard", Y: "strategist", O: "pathfinder",
};

/** Carving for a live board piece — or null when this set has none yet.
 *  Anything without a carving falls through to the painted gallery, so
 *  switching the style never leaves a square empty. */
export function carvedForPiece(piece) {
  if (!piece) return null;
  // The campaign's own piece-bosses ("pb_<id>") are ordinary figures wearing a
  // boss role — they keep their kingdom carving. Only the named monsters of the
  // road get a basalt one.
  if (piece.bossId) {
    if (piece.bossId.startsWith("pb_")) return CARVED_DARK[piece.bossId.slice(3)] || null;
    return CARVED_BOSS[piece.bossId] || null;
  }
  const id = piece.hero ? "gambit" : KIND2ID[piece.kind];
  if (!id) return null;
  return (piece.color === "w" ? CARVED_LIGHT : CARVED_DARK)[id] || null;
}

// Every carving was cropped to its own silhouette and scaled to one common
// height, with the base sitting on the bottom edge — so unlike the painted
// gallery they need no per-file fit table. The board just plants them.
export const CARVED_FIT = { h: 1, y: 0, x: 0 };
