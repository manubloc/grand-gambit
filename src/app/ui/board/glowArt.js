// ── DER LEUCHTENDE STIL ─────────────────────────────────────────────────────
// v0.70.1, Besitzer-Korrektur: "bei Leuchtend leuchten beide Seiten - das
// ist Quatsch." NUR DIE GEGENSEITE glueht (heller: Faktor x1,4; breiter:
// Kantenbreite 3), die eigenen Figuren bleiben die Geschnitzten. Darum
// gibt es nur noch DUNKLE Leucht-Schwestern; die Tausch-Karte greift
// allein auf den dunklen Saetzen, alles andere faellt auf Geschnitzt
// zurueck - Bosse, pb_-Hofbosse und Heldenstufen erben automatisch.
import g_alchemist_dark from "../assets/glow/glow-alchemist-dark.webp";
import g_amazon_dark from "../assets/glow/glow-amazon-dark.webp";
import g_archbishop_dark from "../assets/glow/glow-archbishop-dark.webp";
import g_assassin_dark from "../assets/glow/glow-assassin-dark.webp";
import g_bard_dark from "../assets/glow/glow-bard-dark.webp";
import g_bishop_dark from "../assets/glow/glow-bishop-dark.webp";
import g_boss_b01_dark from "../assets/glow/glow-boss-b01-dark.webp";
import g_boss_b02_dark from "../assets/glow/glow-boss-b02-dark.webp";
import g_boss_b03_dark from "../assets/glow/glow-boss-b03-dark.webp";
import g_boss_b04_dark from "../assets/glow/glow-boss-b04-dark.webp";
import g_boss_b05_dark from "../assets/glow/glow-boss-b05-dark.webp";
import g_boss_b06_dark from "../assets/glow/glow-boss-b06-dark.webp";
import g_boss_b07_dark from "../assets/glow/glow-boss-b07-dark.webp";
import g_boss_b08_dark from "../assets/glow/glow-boss-b08-dark.webp";
import g_boss_b09_dark from "../assets/glow/glow-boss-b09-dark.webp";
import g_boss_b10_dark from "../assets/glow/glow-boss-b10-dark.webp";
import g_boss_b11_dark from "../assets/glow/glow-boss-b11-dark.webp";
import g_boss_b12_dark from "../assets/glow/glow-boss-b12-dark.webp";
import g_boss_b13_dark from "../assets/glow/glow-boss-b13-dark.webp";
import g_boss_b14_dark from "../assets/glow/glow-boss-b14-dark.webp";
import g_boss_b15_dark from "../assets/glow/glow-boss-b15-dark.webp";
import g_boss_b16_dark from "../assets/glow/glow-boss-b16-dark.webp";
import g_boss_b17_dark from "../assets/glow/glow-boss-b17-dark.webp";
import g_boss_b18_dark from "../assets/glow/glow-boss-b18-dark.webp";
import g_boss_b19_dark from "../assets/glow/glow-boss-b19-dark.webp";
import g_boss_b20_dark from "../assets/glow/glow-boss-b20-dark.webp";
import g_boss_b21_dark from "../assets/glow/glow-boss-b21-dark.webp";
import g_boss_b22_dark from "../assets/glow/glow-boss-b22-dark.webp";
import g_boss_b23_dark from "../assets/glow/glow-boss-b23-dark.webp";
import g_boss_b24_dark from "../assets/glow/glow-boss-b24-dark.webp";
import g_boss_b25_dark from "../assets/glow/glow-boss-b25-dark.webp";
import g_captain_dark from "../assets/glow/glow-captain-dark.webp";
import g_chancellor_dark from "../assets/glow/glow-chancellor-dark.webp";
import g_dragon_dark from "../assets/glow/glow-dragon-dark.webp";
import g_engineer_dark from "../assets/glow/glow-engineer-dark.webp";
import g_gambit_dark from "../assets/glow/glow-gambit-dark.webp";
import g_gambit_t2_dark from "../assets/glow/glow-gambit-t2-dark.webp";
import g_gambit_t3_dark from "../assets/glow/glow-gambit-t3-dark.webp";
import g_gambit_t4_dark from "../assets/glow/glow-gambit-t4-dark.webp";
import g_gambit_t5_dark from "../assets/glow/glow-gambit-t5-dark.webp";
import g_gambit_t6_dark from "../assets/glow/glow-gambit-t6-dark.webp";
import g_guardian_dark from "../assets/glow/glow-guardian-dark.webp";
import g_hawk_dark from "../assets/glow/glow-hawk-dark.webp";
import g_inquisitor_dark from "../assets/glow/glow-inquisitor-dark.webp";
import g_king_dark from "../assets/glow/glow-king-dark.webp";
import g_knight_dark from "../assets/glow/glow-knight-dark.webp";
import g_mage_dark from "../assets/glow/glow-mage-dark.webp";
import g_paladin_dark from "../assets/glow/glow-paladin-dark.webp";
import g_pathfinder_dark from "../assets/glow/glow-pathfinder-dark.webp";
import g_pawn_dark from "../assets/glow/glow-pawn-dark.webp";
import g_queen_dark from "../assets/glow/glow-queen-dark.webp";
import g_rook_dark from "../assets/glow/glow-rook-dark.webp";
import g_seeress_dark from "../assets/glow/glow-seeress-dark.webp";
import g_sorceress_dark from "../assets/glow/glow-sorceress-dark.webp";
import g_standard_dark from "../assets/glow/glow-standard-dark.webp";
import g_strategist_dark from "../assets/glow/glow-strategist-dark.webp";
import g_warlock_dark from "../assets/glow/glow-warlock-dark.webp";

import { CARVED_DARK, CARVED_BOSS_DARK, carvedForPiece } from "./carvedArt.js";

const GLOW_DARK = {
  "alchemist": g_alchemist_dark,
  "amazon": g_amazon_dark,
  "archbishop": g_archbishop_dark,
  "assassin": g_assassin_dark,
  "bard": g_bard_dark,
  "bishop": g_bishop_dark,
  "captain": g_captain_dark,
  "chancellor": g_chancellor_dark,
  "dragon": g_dragon_dark,
  "engineer": g_engineer_dark,
  "gambit": g_gambit_dark,
  "gambit-t2": g_gambit_t2_dark,
  "gambit-t3": g_gambit_t3_dark,
  "gambit-t4": g_gambit_t4_dark,
  "gambit-t5": g_gambit_t5_dark,
  "gambit-t6": g_gambit_t6_dark,
  "guardian": g_guardian_dark,
  "hawk": g_hawk_dark,
  "inquisitor": g_inquisitor_dark,
  "king": g_king_dark,
  "knight": g_knight_dark,
  "mage": g_mage_dark,
  "paladin": g_paladin_dark,
  "pathfinder": g_pathfinder_dark,
  "pawn": g_pawn_dark,
  "queen": g_queen_dark,
  "rook": g_rook_dark,
  "seeress": g_seeress_dark,
  "sorceress": g_sorceress_dark,
  "standard": g_standard_dark,
  "strategist": g_strategist_dark,
  "warlock": g_warlock_dark,
};
const GLOW_BOSS_DARK = {
  "b01": g_boss_b01_dark,
  "b02": g_boss_b02_dark,
  "b03": g_boss_b03_dark,
  "b04": g_boss_b04_dark,
  "b05": g_boss_b05_dark,
  "b06": g_boss_b06_dark,
  "b07": g_boss_b07_dark,
  "b08": g_boss_b08_dark,
  "b09": g_boss_b09_dark,
  "b10": g_boss_b10_dark,
  "b11": g_boss_b11_dark,
  "b12": g_boss_b12_dark,
  "b13": g_boss_b13_dark,
  "b14": g_boss_b14_dark,
  "b15": g_boss_b15_dark,
  "b16": g_boss_b16_dark,
  "b17": g_boss_b17_dark,
  "b18": g_boss_b18_dark,
  "b19": g_boss_b19_dark,
  "b20": g_boss_b20_dark,
  "b21": g_boss_b21_dark,
  "b22": g_boss_b22_dark,
  "b23": g_boss_b23_dark,
  "b24": g_boss_b24_dark,
  "b25": g_boss_b25_dark,
};

const TAUSCH = new Map();
for (const [alt, neu] of [[CARVED_DARK, GLOW_DARK], [CARVED_BOSS_DARK, GLOW_BOSS_DARK]]) {
  for (const k of Object.keys(alt)) if (neu[k]) TAUSCH.set(alt[k], neu[k]);
}
export function glowForPiece(piece) {
  const geschnitzt = carvedForPiece(piece);
  if (!geschnitzt) return null;
  return TAUSCH.get(geschnitzt) || geschnitzt; // eigene Seite: Geschnitzt
}
