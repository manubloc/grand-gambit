// The gallery: painted piece artworks (user-generated, gold & navy). Explicit
// imports — esbuild-friendly — and a resolver from a live board piece to its
// painting. Pieces without a painting yet fall back to the drawn SVG silently,
// so the set may grow one figure at a time.
import pPawn from "../assets/painted/painted-pawn.webp";
import pGambit from "../assets/painted/painted-gambit.webp";
import pKnight from "../assets/painted/painted-knight.webp";
import pBishop from "../assets/painted/painted-bishop.webp";
import pQueen from "../assets/painted/painted-queen.webp";
import pArchbishop from "../assets/painted/painted-archbishop.webp";
import pHawk from "../assets/painted/painted-hawk.webp";
import pAmazon from "../assets/painted/painted-amazon.webp";
import pAssassin from "../assets/painted/painted-assassin.webp";
import pGuardian from "../assets/painted/painted-guardian.webp";
import pCaptain from "../assets/painted/painted-captain.webp";
import pSorceress from "../assets/painted/painted-sorceress.webp";
import pPathfinder from "../assets/painted/painted-pathfinder.webp";
import pRook from "../assets/painted/painted-rook.webp";
import pKing from "../assets/painted/painted-king.webp";
import pChancellor from "../assets/painted/painted-chancellor.webp";
import pDragon from "../assets/painted/painted-dragon.webp";
import pMage from "../assets/painted/painted-mage.webp";
import pAlchemist from "../assets/painted/painted-alchemist.webp";
import pWarlock from "../assets/painted/painted-warlock.webp";
import pPaladin from "../assets/painted/painted-paladin.webp";
import pInquisitor from "../assets/painted/painted-inquisitor.webp";
import pBard from "../assets/painted/painted-bard.webp";
import pEngineer from "../assets/painted/painted-engineer.webp";
import pStandard from "../assets/painted/painted-standard.webp";
import pStrategist from "../assets/painted/painted-strategist.webp";
import bGolem from "../assets/painted/painted-boss-golem.webp";
import bBeast from "../assets/painted/painted-boss-beast.webp";
import bSerpent from "../assets/painted/painted-boss-serpent.webp";
import bWraith from "../assets/painted/painted-boss-wraith.webp";
import bTyrant from "../assets/painted/painted-boss-tyrant.webp";
import bArchenemy from "../assets/painted/painted-boss-archenemy.webp";
import bLeaguemaster from "../assets/painted/painted-boss-leaguemaster.webp";
// every named monster of the road now sits for his own portrait (b01–b22, b24)
import pbb01 from "../assets/painted/painted-boss-b01.webp";
import pbb02 from "../assets/painted/painted-boss-b02.webp";
import pbb03 from "../assets/painted/painted-boss-b03.webp";
import pbb04 from "../assets/painted/painted-boss-b04.webp";
import pbb05 from "../assets/painted/painted-boss-b05.webp";
import pbb06 from "../assets/painted/painted-boss-b06.webp";
import pbb07 from "../assets/painted/painted-boss-b07.webp";
import pbb08 from "../assets/painted/painted-boss-b08.webp";
import pbb09 from "../assets/painted/painted-boss-b09.webp";
import pbb10 from "../assets/painted/painted-boss-b10.webp";
import pbb11 from "../assets/painted/painted-boss-b11.webp";
import pbb12 from "../assets/painted/painted-boss-b12.webp";
import pbb13 from "../assets/painted/painted-boss-b13.webp";
import pbb14 from "../assets/painted/painted-boss-b14.webp";
import pbb15 from "../assets/painted/painted-boss-b15.webp";
import pbb16 from "../assets/painted/painted-boss-b16.webp";
import pbb17 from "../assets/painted/painted-boss-b17.webp";
import pbb18 from "../assets/painted/painted-boss-b18.webp";
import pbb19 from "../assets/painted/painted-boss-b19.webp";
import pbb20 from "../assets/painted/painted-boss-b20.webp";
import pbb21 from "../assets/painted/painted-boss-b21.webp";
import pbb22 from "../assets/painted/painted-boss-b22.webp";
import pbb24 from "../assets/painted/painted-boss-b24.webp";

export const PAINTED = {
  pawn: pPawn, gambit: pGambit, knight: pKnight, bishop: pBishop, queen: pQueen,
  archbishop: pArchbishop, hawk: pHawk, amazon: pAmazon, assassin: pAssassin, guardian: pGuardian,
  captain: pCaptain, pathfinder: pPathfinder, sorceress: pSorceress,
  rook: pRook, king: pKing, chancellor: pChancellor, dragon: pDragon, mage: pMage,
  alchemist: pAlchemist, warlock: pWarlock, paladin: pPaladin, inquisitor: pInquisitor,
  bard: pBard, engineer: pEngineer, standard: pStandard, strategist: pStrategist,
  "boss-golem": bGolem, "boss-beast": bBeast, "boss-serpent": bSerpent, "boss-wraith": bWraith,
  "boss-tyrant": bTyrant, "boss-archenemy": bArchenemy, "boss-leaguemaster": bLeaguemaster,
  "boss-b01": pbb01, "boss-b02": pbb02, "boss-b03": pbb03, "boss-b04": pbb04, "boss-b05": pbb05, "boss-b06": pbb06, "boss-b07": pbb07, "boss-b08": pbb08,
  "boss-b09": pbb09, "boss-b10": pbb10, "boss-b11": pbb11, "boss-b12": pbb12, "boss-b13": pbb13, "boss-b14": pbb14, "boss-b15": pbb15, "boss-b16": pbb16,
  "boss-b17": pbb17, "boss-b18": pbb18, "boss-b19": pbb19, "boss-b20": pbb20, "boss-b21": pbb21, "boss-b22": pbb22, "boss-b24": pbb24,
};

// kind letter -> character id (pawn wins the shared "P"; the hero flag decides gambit)
const KIND2ID = {
  P: "pawn", N: "knight", B: "bishop", R: "rook", Q: "queen", K: "king",
  A: "archbishop", C: "chancellor", H: "hawk", M: "amazon", V: "captain", S: "assassin",
  G: "guardian", D: "dragon", E: "mage", Z: "sorceress", L: "alchemist", W: "warlock",
  U: "paladin", I: "inquisitor", J: "bard", T: "engineer", F: "standard", Y: "strategist", O: "pathfinder",
};

/** Painting for a live board piece — or null when the gallery has none yet. */
export function paintedForPiece(piece) {
  if (!piece) return null;
  if (piece.bossId) {
    if (piece.bossId.startsWith("pb_")) return PAINTED[piece.bossId.slice(3)] || null;
    // dedicated portrait first (painted-boss-<id>.webp), then the two named
    // finals, then the boss's art family (golem/beast/serpent/wraith/tyrant)
    return PAINTED["boss-" + piece.bossId]
      || (piece.bossId === "b23" ? PAINTED["boss-archenemy"] : null)
      || (piece.bossId === "b25" ? PAINTED["boss-leaguemaster"] : null)
      || PAINTED["boss-" + (piece.art || "")] || null;
  }
  if (piece.hero) return PAINTED.gambit || null; // hero keeps his own portrait or stays drawn
  const id = KIND2ID[piece.kind];
  return id ? PAINTED[id] || null : null;
}

/** Painting by character id — for the court's character cards. */
export const paintedById = (id) => PAINTED[id] || null;

/** The enemy fields the same paintings, turned to cold steel by filter. */
export const ENEMY_FILTER = "hue-rotate(185deg) saturate(0.5) brightness(0.9)";
