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
  "pawn": { h: 0.8977, y: -0.06, x: -0.0049 },
  "gambit": { h: 0.94, y: -0.144, x: -0.0052 },
  "knight": { h: 1.0498, y: -0.1427, x: -0.0252 },
  "bishop": { h: 1.0616, y: -0.1396, x: -0.0077 },
  "queen": { h: 1.1329, y: -0.1377, x: 0.0033 },
  "rook": { h: 1.0826, y: -0.1336, x: -0.0028 },
  "king": { h: 1.126, y: -0.1359, x: -0.0001 },
  "chancellor": { h: 1.0393, y: -0.1456, x: -0.001 },
  "archbishop": { h: 1.0509, y: -0.1293, x: 0.0173 },
  "amazon": { h: 1.053, y: -0.1293, x: 0.018 },
  "hawk": { h: 1.1044, y: -0.121, x: -0.0022 },
  "seeress": { h: 1.0552, y: -0.1293, x: 0.0142 },
  "assassin": { h: 1.0404, y: -0.1338, x: 0.0117 },
  "guardian": { h: 1.0748, y: -0.1356, x: 0.0277 },
  "captain": { h: 1.0488, y: -0.1417, x: 0.0139 },
  "sorceress": { h: 1.0498, y: -0.1379, x: 0.0168 },
  "pathfinder": { h: 1.0704, y: -0.1289, x: 0.0255 },
  "mage": { h: 1.0456, y: -0.138, x: 0.0042 },
  "alchemist": { h: 1.0332, y: -0.1513, x: -0.0091 },
  "warlock": { h: 1.0425, y: -0.1439, x: 0.0064 },
  "paladin": { h: 1.0562, y: -0.1378, x: 0.0029 },
  "inquisitor": { h: 1.0605, y: -0.1378, x: -0.0134 },
  "bard": { h: 1.066, y: -0.1444, x: 0.0215 },
  "engineer": { h: 1.0584, y: -0.133, x: 0.0064 },
  "standard": { h: 1.0446, y: -0.1295, x: -0.0409 },
  "strategist": { h: 1.052, y: -0.1398, x: 0.0081 },
  "dragon": { h: 1.0, y: 0.0, x: 0.0153 },
};
/** Per-figure { h, y }: box-fit height scale + baseline shift (em). Default
 *  { h:1, y:0 } for bosses, big pieces and unknown ids. Mirrors
 *  paintedForPiece's id resolution. */

// Bosses measured per portrait: every master stands queen-tall (effective
// 1.082) whatever share of the canvas the painting fills; y offsets the foot
// gap so the base stays planted when the scale grows.
const BOSS_FIT = { "archenemy": { h: 1.102, y: 0.001, x: 0.0017 }, "b01": { h: 1.11, y: 0.001, x: 0.01 }, "b02": { h: 1.42, y: 0.037, x: 0.0136 }, "b03": { h: 1.305, y: 0.024, x: 0.0083 }, "b04": { h: 1.507, y: 0.049, x: -0.0023 }, "b05": { h: 1.308, y: 0.03, x: -0.0037 }, "b06": { h: 1.383, y: 0.038, x: -0.0015 }, "b07": { h: 1.345, y: 0.037, x: -0.0099 }, "b08": { h: 1.399, y: 0.048, x: -0.0081 }, "b09": { h: 1.166, y: 0.006, x: -0.0009 }, "b10": { h: 1.471, y: 0.049, x: 0.0045 }, "b11": { h: 1.294, y: 0.027, x: 0.0069 }, "b12": { h: 1.248, y: 0.021, x: 0.0051 }, "b13": { h: 1.314, y: 0.028, x: 0.0049 }, "b14": { h: 1.147, y: 0.003, x: -0.001 }, "b15": { h: 1.132, y: 0.002, x: 0.0267 }, "b16": { h: 1.147, y: 0.003, x: -0.0035 }, "b17": { h: 1.096, y: 0.001, x: -0.0084 }, "b18": { h: 1.23, y: 0.01, x: -0.0039 }, "b19": { h: 1.182, y: 0.005, x: -0.0079 }, "b20": { h: 1.147, y: 0.004, x: -0.0096 }, "b21": { h: 1.132, y: 0.0, x: 0.0088 }, "b22": { h: 1.085, y: 0.0, x: -0.0151 }, "b23": { h: 1.089, y: 0.0, x: 0.0038 }, "b24": { h: 1.361, y: 0.029, x: 0.0131 }, "b25": { h: 1.188, y: 0.012, x: 0.0024 }, "beast": { h: 1.099, y: 0.001, x: 0.0108 }, "golem": { h: 1.099, y: 0.001, x: 0.0006 }, "leaguemaster": { h: 1.091, y: 0.0, x: -0.0008 }, "serpent": { h: 1.099, y: 0.001, x: 0.0103 }, "tyrant": { h: 1.102, y: 0.001, x: -0.0016 }, "wraith": { h: 1.096, y: 0.001, x: 0.0053 } };
// A piece serving as a boss (pb_*) wears its own portrait, raised to the
// same queen-tall stature.
const PIECE_BOSS_FIT = { "alchemist": { h: 1.1, y: 0.0, x: -0.0091 }, "amazon": { h: 1.121, y: 0.003, x: 0.018 }, "archbishop": { h: 1.119, y: 0.003, x: 0.0173 }, "assassin": { h: 1.108, y: 0.002, x: 0.0117 }, "bard": { h: 1.135, y: 0.001, x: 0.0215 }, "bishop": { h: 1.131, y: 0.002, x: -0.0077 }, "captain": { h: 1.117, y: 0.002, x: 0.0139 }, "chancellor": { h: 1.107, y: 0.001, x: -0.001 }, "engineer": { h: 1.127, y: 0.003, x: 0.0064 }, "gambit": { h: 1.116, y: 0.001, x: -0.0052 }, "guardian": { h: 1.145, y: 0.003, x: 0.0277 }, "hawk": { h: 1.176, y: 0.006, x: -0.0022 }, "inquisitor": { h: 1.129, y: 0.002, x: -0.0134 }, "king": { h: 1.126, y: 0.002, x: -0.0001 }, "knight": { h: 1.118, y: 0.001, x: -0.0252 }, "mage": { h: 1.114, y: 0.002, x: 0.0042 }, "paladin": { h: 1.125, y: 0.002, x: 0.0029 }, "pathfinder": { h: 1.14, y: 0.004, x: 0.0255 }, "pawn": { h: 1.12, y: 0.001, x: -0.0049 }, "queen": { h: 1.133, y: 0.002, x: 0.0033 }, "rook": { h: 1.153, y: 0.003, x: -0.0028 }, "seeress": { h: 1.124, y: 0.003, x: 0.0142 }, "sorceress": { h: 1.118, y: 0.002, x: 0.0168 }, "standard": { h: 1.112, y: 0.003, x: -0.0409 }, "strategist": { h: 1.12, y: 0.002, x: 0.0081 }, "warlock": { h: 1.11, y: 0.001, x: 0.0064 } };

// The hero grows with his rank: tier 1 stands pawn-small, tier 6 queen-tall —
// a straight climb between the two (pawn 0.898 → queen 1.133).
const GAMBIT_TIER_X = [-0.0052, -0.0029, -0.0017, 0.0034, -0.0022, -0.0016];
const GAMBIT_TIER_H = [0.894, 0.944, 0.981, 1.027, 1.057, 1.096];

export function paintedFitFor(piece) {
  if (!piece || piece.big) return { h: 1, y: 0, x: 0 };
  if (piece.bossId) {
    // Same lookup chain as paintedForPiece, so the fit always matches the
    // portrait actually shown.
    if (piece.bossId.startsWith("pb_")) return PIECE_BOSS_FIT[piece.bossId.slice(3)] || { h: 1.113, y: 0, x: 0 };
    return BOSS_FIT[piece.bossId]
      || (piece.bossId === "b23" ? BOSS_FIT["archenemy"] : null)
      || (piece.bossId === "b25" ? BOSS_FIT["leaguemaster"] : null)
      || BOSS_FIT[piece.art || ""] || { h: 1.113, y: 0, x: 0 };
  }
  if (piece.hero) {
    const t = Math.min(6, Math.max(1, piece.tier || 1));
    return { h: GAMBIT_TIER_H[t - 1], y: (PAINTED_FIT.gambit || {}).y || 0, x: GAMBIT_TIER_X[t - 1] || 0 };
  }
  const id = KIND2ID[piece.kind];
  return (id && PAINTED_FIT[id]) || { h: 1, y: 0, x: 0 };
}

/** The enemy fields the same paintings, turned to cold steel by filter. */
export const ENEMY_FILTER = "hue-rotate(185deg) saturate(0.32) brightness(1.02)"; // whiter steel, less blue
