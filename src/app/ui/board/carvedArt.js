// The CARVED set — the third piece style, next to "simpel" (SVG) and the older
// painted gallery. Every figure is a small object cut from stone-clay: visible
// tool facets, hard-edged colour, a face suggested with three cuts and nothing
// more. What makes the set readable on a board is COLOUR BY CHARACTER — the
// knight is red, the mage violet, the guardian green — because at 44 pixels the
// silhouette alone could not tell twenty-seven figures apart. The colours are
// grouped by guild, so the hue also hints at what a piece does.
//
// ONE SET, TWO SIDES. Both players field the SAME figure in full colour; the
// enemy's copy is the corrupted one. tools/carve-build.py drains its stone to
// near-grey, lets the edge catch violet light and sends fine bolts crawling up
// out of the base, clipped to the silhouette so they live ON the figure rather
// than in front of it. That reads faster across a board than light-against-dark
// ever did, and — unlike a hue filter — it costs the piece none of its identity:
// a red knight stays a red knight, he is just no longer his own.
//
// Every figure also shares ONE BASE WIDTH. Scaling them to equal height (the
// obvious thing) was wrong: it inflates the pawn and shrinks the king, and the
// plinths end up all different sizes. Normalising the standing surface instead
// makes them sit on the board like a real set.
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
import xL01 from "../assets/carved/carved-boss-b01-light.webp";
import xL02 from "../assets/carved/carved-boss-b02-light.webp";
import xL03 from "../assets/carved/carved-boss-b03-light.webp";
import xL04 from "../assets/carved/carved-boss-b04-light.webp";
import xL05 from "../assets/carved/carved-boss-b05-light.webp";
import xL06 from "../assets/carved/carved-boss-b06-light.webp";
import xL07 from "../assets/carved/carved-boss-b07-light.webp";
import xL08 from "../assets/carved/carved-boss-b08-light.webp";
import xL09 from "../assets/carved/carved-boss-b09-light.webp";
import xL10 from "../assets/carved/carved-boss-b10-light.webp";
import xL11 from "../assets/carved/carved-boss-b11-light.webp";
import xL12 from "../assets/carved/carved-boss-b12-light.webp";
import xL13 from "../assets/carved/carved-boss-b13-light.webp";
import xL14 from "../assets/carved/carved-boss-b14-light.webp";
import xL15 from "../assets/carved/carved-boss-b15-light.webp";
import xL16 from "../assets/carved/carved-boss-b16-light.webp";
import xL17 from "../assets/carved/carved-boss-b17-light.webp";
import xL18 from "../assets/carved/carved-boss-b18-light.webp";
import xL19 from "../assets/carved/carved-boss-b19-light.webp";
import xL20 from "../assets/carved/carved-boss-b20-light.webp";
import xL21 from "../assets/carved/carved-boss-b21-light.webp";
import xL22 from "../assets/carved/carved-boss-b22-light.webp";
import xL23 from "../assets/carved/carved-boss-b23-light.webp";
import xL24 from "../assets/carved/carved-boss-b24-light.webp";
import xL25 from "../assets/carved/carved-boss-b25-light.webp";
import xD01 from "../assets/carved/carved-boss-b01-dark.webp";
import xD02 from "../assets/carved/carved-boss-b02-dark.webp";
import xD03 from "../assets/carved/carved-boss-b03-dark.webp";
import xD04 from "../assets/carved/carved-boss-b04-dark.webp";
import xD05 from "../assets/carved/carved-boss-b05-dark.webp";
import xD06 from "../assets/carved/carved-boss-b06-dark.webp";
import xD07 from "../assets/carved/carved-boss-b07-dark.webp";
import xD08 from "../assets/carved/carved-boss-b08-dark.webp";
import xD09 from "../assets/carved/carved-boss-b09-dark.webp";
import xD10 from "../assets/carved/carved-boss-b10-dark.webp";
import xD11 from "../assets/carved/carved-boss-b11-dark.webp";
import xD12 from "../assets/carved/carved-boss-b12-dark.webp";
import xD13 from "../assets/carved/carved-boss-b13-dark.webp";
import xD14 from "../assets/carved/carved-boss-b14-dark.webp";
import xD15 from "../assets/carved/carved-boss-b15-dark.webp";
import xD16 from "../assets/carved/carved-boss-b16-dark.webp";
import xD17 from "../assets/carved/carved-boss-b17-dark.webp";
import xD18 from "../assets/carved/carved-boss-b18-dark.webp";
import xD19 from "../assets/carved/carved-boss-b19-dark.webp";
import xD20 from "../assets/carved/carved-boss-b20-dark.webp";
import xD21 from "../assets/carved/carved-boss-b21-dark.webp";
import xD22 from "../assets/carved/carved-boss-b22-dark.webp";
import xD23 from "../assets/carved/carved-boss-b23-dark.webp";
import xD24 from "../assets/carved/carved-boss-b24-dark.webp";
import xD25 from "../assets/carved/carved-boss-b25-dark.webp";

/** the kingdom, in full colour — the player's side. */
export const CARVED_LIGHT = {
  pawn: lPawn, knight: lKnight, bishop: lBishop, rook: lRook, queen: lQueen, king: lKing,
  archbishop: lArchbishop, chancellor: lChancellor, hawk: lHawk, amazon: lAmazon,
  captain: lCaptain, assassin: lAssassin, seeress: lSeeress, guardian: lGuardian,
  dragon: lDragon, mage: lMage, sorceress: lSorceress, alchemist: lAlchemist,
  warlock: lWarlock, paladin: lPaladin, inquisitor: lInquisitor, bard: lBard,
  engineer: lEngineer, standard: lStandard, strategist: lStrategist, pathfinder: lPathfinder,
  gambit: lGambit
};
/** the same figures, corrupted — the enemy's side. */
export const CARVED_DARK = {
  pawn: dPawn, knight: dKnight, bishop: dBishop, rook: dRook, queen: dQueen, king: dKing,
  archbishop: dArchbishop, chancellor: dChancellor, hawk: dHawk, amazon: dAmazon,
  captain: dCaptain, assassin: dAssassin, seeress: dSeeress, guardian: dGuardian,
  dragon: dDragon, mage: dMage, sorceress: dSorceress, alchemist: dAlchemist,
  warlock: dWarlock, paladin: dPaladin, inquisitor: dInquisitor, bard: dBard,
  engineer: dEngineer, standard: dStandard, strategist: dStrategist, pathfinder: dPathfinder,
  gambit: dGambit
};
/** the monsters. Sickly, bruised colour and no gold — gold is the kingdom's. */
export const CARVED_BOSS_LIGHT = {
  b01: xL01, b02: xL02, b03: xL03, b04: xL04, b05: xL05, b06: xL06, b07: xL07, b08: xL08,
  b09: xL09, b10: xL10, b11: xL11, b12: xL12, b13: xL13, b14: xL14, b15: xL15, b16: xL16,
  b17: xL17, b18: xL18, b19: xL19, b20: xL20, b21: xL21, b22: xL22, b23: xL23, b24: xL24,
  b25: xL25
};
export const CARVED_BOSS_DARK = {
  b01: xD01, b02: xD02, b03: xD03, b04: xD04, b05: xD05, b06: xD06, b07: xD07, b08: xD08,
  b09: xD09, b10: xD10, b11: xD11, b12: xD12, b13: xD13, b14: xD14, b15: xD15, b16: xD16,
  b17: xD17, b18: xD18, b19: xD19, b20: xD20, b21: xD21, b22: xD22, b23: xD23, b24: xD24,
  b25: xD25
};

// Kind letter -> character id; mirrors the gallery's own table.
const KIND2ID = {
  P: "pawn", N: "knight", B: "bishop", R: "rook", Q: "queen", K: "king",
  A: "archbishop", C: "chancellor", H: "hawk", M: "amazon", V: "captain", S: "assassin", SE: "seeress",
  G: "guardian", D: "dragon", E: "mage", Z: "sorceress", L: "alchemist", W: "warlock",
  U: "paladin", I: "inquisitor", J: "bard", T: "engineer", F: "standard", Y: "strategist", O: "pathfinder",
};

/** Carving for a character id — used by every screen outside the board (the
 *  court, the chronicle, the pop-ups), which look pieces up by name. */
export function carvedById(id, korrupt = false) {
  if (!id) return null;
  if (id.startsWith("boss-")) {
    const b = id.slice(5);
    return (korrupt ? CARVED_BOSS_DARK : CARVED_BOSS_LIGHT)[b] || null;
  }
  // the Gambit's tiers all wear the one hero carving
  const grund = id.startsWith("gambit") ? "gambit" : id;
  return (korrupt ? CARVED_DARK : CARVED_LIGHT)[grund] || null;
}

/** Carving for a live board piece — or null when the set has none. */
export function carvedForPiece(piece) {
  if (!piece) return null;
  const korrupt = piece.color !== "w";
  if (piece.bossId) {
    // The campaign's own piece-bosses ("pb_<id>") are ordinary court figures in
    // a boss role — they keep their kingdom carving rather than a monster's.
    if (piece.bossId.startsWith("pb_")) return carvedById(piece.bossId.slice(3), korrupt);
    return (korrupt ? CARVED_BOSS_DARK : CARVED_BOSS_LIGHT)[piece.bossId] || null;
  }
  const id = piece.hero ? "gambit" : KIND2ID[piece.kind];
  if (!id) return null;
  return (korrupt ? CARVED_DARK : CARVED_LIGHT)[id] || null;
}

// Each carving already sits on the shared canvas with its base bottom-aligned
// and levelled to one standing width, so the board needs no per-file fit table.
export const CARVED_FIT = { h: 1, y: 0, x: 0 };
