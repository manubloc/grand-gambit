// The gallery: painted piece artworks (user-generated, gold & navy). Explicit
// imports — esbuild-friendly — and a resolver from a live board piece to its
// painting. Pieces without a painting yet fall back to the drawn SVG silently,
// so the set may grow one figure at a time.
import pPawn from "../assets/painted/painted-pawn.webp";
import pGambit from "../assets/painted/painted-gambit.webp";
// the risen hero: tier portraits (Stufe II/III) — currently placeholder copies
// of the base painting; the user's generated art replaces these files 1:1
import pGambitT2 from "../assets/painted/painted-gambit-t2.webp";
import pGambitT3 from "../assets/painted/painted-gambit-t3.webp";
import pGambitT4 from "../assets/painted/painted-gambit-t4.webp";
import pGambitT5 from "../assets/painted/painted-gambit-t5.webp";
import pGambitT6 from "../assets/painted/painted-gambit-t6.webp";
import pSeeress from "../assets/painted/painted-seeress.webp";
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
import pbb23 from "../assets/painted/painted-boss-b23.webp";
import pbb24 from "../assets/painted/painted-boss-b24.webp";
import pbb25 from "../assets/painted/painted-boss-b25.webp";

// ── the CLASSIC set: frozen copies of the original standard pieces. The
// campaign's standard figures may be repainted (human setting), but classic
// chess mode keeps these forever. ──
import cPawn from "../assets/painted/classic-pawn.webp";
import cKnight from "../assets/painted/classic-knight.webp";
import cBishop from "../assets/painted/classic-bishop.webp";
import cRook from "../assets/painted/classic-rook.webp";
import cQueen from "../assets/painted/classic-queen.webp";
import cKing from "../assets/painted/classic-king.webp";
export const CLASSIC_PAINTED = { P: cPawn, N: cKnight, B: cBishop, R: cRook, Q: cQueen, K: cKing };

export const PAINTED = {
  pawn: pPawn, gambit: pGambit, "gambit-t2": pGambitT2, "gambit-t3": pGambitT3, "gambit-t4": pGambitT4, "gambit-t5": pGambitT5, "gambit-t6": pGambitT6, seeress: pSeeress, knight: pKnight, bishop: pBishop, queen: pQueen,
  archbishop: pArchbishop, hawk: pHawk, amazon: pAmazon, assassin: pAssassin, guardian: pGuardian,
  captain: pCaptain, pathfinder: pPathfinder, sorceress: pSorceress,
  rook: pRook, king: pKing, chancellor: pChancellor, dragon: pDragon, mage: pMage,
  alchemist: pAlchemist, warlock: pWarlock, paladin: pPaladin, inquisitor: pInquisitor,
  bard: pBard, engineer: pEngineer, standard: pStandard, strategist: pStrategist,
  "boss-golem": bGolem, "boss-beast": bBeast, "boss-serpent": bSerpent, "boss-wraith": bWraith,
  "boss-tyrant": bTyrant, "boss-archenemy": bArchenemy, "boss-leaguemaster": bLeaguemaster,
  "boss-b01": pbb01, "boss-b02": pbb02, "boss-b03": pbb03, "boss-b04": pbb04, "boss-b05": pbb05, "boss-b06": pbb06, "boss-b07": pbb07, "boss-b08": pbb08,
  "boss-b09": pbb09, "boss-b10": pbb10, "boss-b11": pbb11, "boss-b12": pbb12, "boss-b13": pbb13, "boss-b14": pbb14, "boss-b15": pbb15, "boss-b16": pbb16,
  "boss-b17": pbb17, "boss-b18": pbb18, "boss-b19": pbb19, "boss-b20": pbb20, "boss-b21": pbb21, "boss-b22": pbb22, "boss-b23": pbb23, "boss-b24": pbb24, "boss-b25": pbb25,
};

// kind letter -> character id (pawn wins the shared "P"; the hero flag decides gambit)
const KIND2ID = {
  P: "pawn", N: "knight", B: "bishop", R: "rook", Q: "queen", K: "king",
  A: "archbishop", C: "chancellor", H: "hawk", M: "amazon", V: "captain", S: "assassin", SE: "seeress",
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
  if (piece.hero) {
    // the hero WEARS his rank: each gambit tier has its own likeness — on the
    // board, in the court, everywhere this gallery serves
    const lvl = piece.level || 1;
    const gt = Math.min(6, Math.floor((Math.max(1, lvl) - 1) / 10) + 1); // mirrors meta gambitTier
    return (gt > 1 && PAINTED["gambit-t" + gt]) || PAINTED.gambit || null;
  }
  const id = KIND2ID[piece.kind];
  return id ? PAINTED[id] || null : null;
}

/** Painting by character id — for the court's character cards. */
export const paintedById = (id) => PAINTED[id] || null;

// ── Base-width normalisation ────────────────────────────────────────────────
// Every painting is 1024x1024, but each figure fills a different share of it,
// so at one font size their FEET (the base that rests on the square) came out
// wildly different sizes AND heights — the rook read as a giant, the queen and
// bishop hung low. So instead of levelling only WIDTH (which shrank broad
// figures out of proportion), each painting is fitted to a uniform BOX: `h`
// scales it to one figure height (broad figures capped in width so they don't
// sprawl into the neighbours), and `y` lifts or drops the foot onto one shared
// baseline with a little air beneath. The pawn (already smaller via its font),
// the gambit and the big dragon keep their own size on purpose. MEASURED from
// each painting's alpha bounding box.
const PAINTED_FIT = {
  "pawn": { h: 1.02, y: -0.02 },
  "gambit": { h: 0.94, y: -0.109 },
  "knight": { h: 0.972, y: -0.1077 },
  "bishop": { h: 0.983, y: -0.1046 },
  "queen": { h: 0.985, y: -0.1027 },
  "rook": { h: 1.003, y: -0.0975 },
  "king": { h: 0.979, y: -0.1009 },
  "chancellor": { h: 0.963, y: -0.1106 },
  "archbishop": { h: 0.973, y: -0.0943 },
  "amazon": { h: 0.975, y: -0.0943 },
  "hawk": { h: 1.023, y: -0.086 },
  "seeress": { h: 0.976, y: -0.0943 },
  "assassin": { h: 0.945, y: -0.0988 },
  "guardian": { h: 0.995, y: -0.1006 },
  "captain": { h: 0.971, y: -0.1067 },
  "sorceress": { h: 0.971, y: -0.1029 },
  "pathfinder": { h: 0.991, y: -0.0939 },
  "mage": { h: 0.967, y: -0.103 },
  "alchemist": { h: 0.957, y: -0.1163 },
  "warlock": { h: 0.947, y: -0.1089 },
  "paladin": { h: 0.977, y: -0.1028 },
  "inquisitor": { h: 0.981, y: -0.1028 },
  "bard": { h: 0.987, y: -0.1094 },
  "engineer": { h: 0.98, y: -0.098 },
  "standard": { h: 0.967, y: -0.0945 },
  "strategist": { h: 0.973, y: -0.1048 },
  "dragon": { h: 1.0, y: 0.0 },
};
/** Per-figure { h, y }: box-fit height scale + baseline shift (em). Default
 *  { h:1, y:0 } for bosses, big pieces and unknown ids. Mirrors
 *  paintedForPiece's id resolution. */
export function paintedFitFor(piece) {
  if (!piece || piece.bossId) return { h: 1, y: 0 };
  const id = piece.hero ? "gambit" : KIND2ID[piece.kind];
  return (id && PAINTED_FIT[id]) || { h: 1, y: 0 };
}

/** The enemy fields the same paintings, turned to cold steel by filter. */
export const ENEMY_FILTER = "hue-rotate(185deg) saturate(0.32) brightness(1.02)"; // whiter steel, less blue
