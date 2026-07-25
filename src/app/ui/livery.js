// ── THE LIVERY ──────────────────────────────────────────────────────────────
// One switch dresses the whole app: CLASSIC (the deep-navy night with its
// original paintings) or CARVED (the painted-stone world of the new piece set).
// Both liveries ship complete — the classic files were restored from history
// byte for byte, so choosing classic is really the old app, not a repaint.
//
// WHO DECIDES. The design is GLOBAL: `APP_DESIGN` in config.js is what every
// player gets, and shipping a change of it is a one-line deploy. A signed-in
// ADMIN can override it live from the profile workbench to preview either
// livery; ordinary players have no design setting at all — they only choose
// between "detailed" and "simple" pieces, and "detailed" silently follows the
// house design.
//
// Every asset with two faces lives here as a pair plus a getter. Components
// call the getter at render time; setLivery swaps palette (theme), insignia
// (live bindings) and piece gallery (paintedArt) in one stroke.
import { setDesign as setThemeDesign } from "./theme.js";
import { applyInsigniaDesign } from "./assets/icons/iconAssets.js";
import { setPieceStyle } from "./board/paintedArt.js";

import hallC from "./assets/bg-hall.webp";
import hallK from "./assets/bg-hall.carved.webp";
import frameC from "./assets/board-frame.webp";
import frameK from "./assets/board-frame.carved.webp";
import shieldC from "./assets/shield-league.webp";
import shieldK from "./assets/shield-league.carved.webp";
import crest1C from "./assets/crest-1.webp";
import crest1K from "./assets/crest-1.carved.webp";
import crest2C from "./assets/crest-2.webp";
import crest2K from "./assets/crest-2.carved.webp";
import crest3C from "./assets/crest-3.webp";
import crest3K from "./assets/crest-3.carved.webp";
import logoC from "./assets/logo.webp";
import logoK from "./assets/logo.carved.webp";
import logoMenuC from "./assets/logo-menu.webp";
import logoMenuK from "./assets/logo-menu.carved.webp";
import emblemC from "./assets/emblem.webp";
import emblemK from "./assets/emblem.carved.webp";

import g01C from "./assets/ground-01.webp"; import g01K from "./assets/ground-01.carved.webp";
import g02C from "./assets/ground-02.webp"; import g02K from "./assets/ground-02.carved.webp";
import g03C from "./assets/ground-03.webp"; import g03K from "./assets/ground-03.carved.webp";
import g04C from "./assets/ground-04.webp"; import g04K from "./assets/ground-04.carved.webp";
import g05C from "./assets/ground-05.webp"; import g05K from "./assets/ground-05.carved.webp";
import g06C from "./assets/ground-06.webp"; import g06K from "./assets/ground-06.carved.webp";
import g07C from "./assets/ground-07.webp"; import g07K from "./assets/ground-07.carved.webp";
import g08C from "./assets/ground-08.webp"; import g08K from "./assets/ground-08.carved.webp";
import g09C from "./assets/ground-09.webp"; import g09K from "./assets/ground-09.carved.webp";
import g10C from "./assets/ground-10.webp"; import g10K from "./assets/ground-10.carved.webp";

let DESIGN = "classic";

/** The one entry point: dress the app. Called from App.jsx (and the login
 *  screens' module scope) with the effective design. */
export function setLivery(design) {
  DESIGN = design === "carved" ? "carved" : "classic";
  setThemeDesign(DESIGN);
  applyInsigniaDesign(DESIGN);
  setPieceStyle(DESIGN);
}
export const livery = () => DESIGN;
const pick = (c, k) => (DESIGN === "carved" ? k : c);

export const bgHall = () => pick(hallC, hallK);
export const boardFrame = () => pick(frameC, frameK);
export const leagueShield = () => pick(shieldC, shieldK);
export const crestArt = (n) => pick([crest1C, crest2C, crest3C], [crest1K, crest2K, crest3K])[n - 1] || null;
export const emblemArt = () => pick(emblemC, emblemK);
export const logoArt = () => pick(logoC, logoK);
export const logoMenuArt = () => pick(logoMenuC, logoMenuK);

const GROUNDS_C = { 1: g01C, 2: g02C, 3: g03C, 4: g04C, 5: g05C, 6: g06C, 7: g07C, 8: g08C, 9: g09C, 10: g10C };
const GROUNDS_K = { 1: g01K, 2: g02K, 3: g03K, 4: g04K, 5: g05K, 6: g06K, 7: g07K, 8: g08K, 9: g09K, 10: g10K };
export const groundArt = (league) => pick(GROUNDS_C, GROUNDS_K)[league] || null;
