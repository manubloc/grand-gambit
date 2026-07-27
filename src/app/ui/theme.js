// Design tokens — GRAND GAMBIT. Deep royal navy, antique gold, ivory text.
// The player is GOLD (gold plays the role of white); the enemy is the dark
// navy side rimmed in steel. Elegance over flash: serif brandmarks, diamond
// flourishes, crisp 1px lines. (Token keys kept stable: `lime` = player/primary
// accent, `magenta` = enemy accent.)
// TWO LIVERIES, ONE TOKEN SET. The app now dresses in either of two designs:
// the CLASSIC deep-navy night it has always worn, or the CARVED daylight that
// matches the painted stone piece set — lighter slate, stone-coloured panels,
// the same antique gold. Every component keeps reading `T.bg`, `T.panel`, … at
// render time, so switching is a single in-place palette swap plus a re-render;
// no component knows two designs exist. Classic stays the default: the old
// design is a promise, not a leftover.
const CLASSIC = {
  bg: "#000000", bg2: "#0a0710", panel: "#140f24", panel2: "#1c1533", line: "#2f2450",
  text: "#f0e9d8", dim: "#a9a48e", faint: "#6f6b5e",
  lime: "#d1ad55", limeDim: "#b08f3a", limeInk: "#17110a",          // player / primary accent (gold)
  magenta: "#8fa0c0", magentaDim: "#66748f", magentaInk: "#10141d", // enemy accent (steel navy)
  gold: "#eac96b", danger: "#d5495a", green: "#58c98b", blue: "#8fa0c0",
  goldBright: "#f6e9a4",
  // DER RISS: die violette Stimme des Spiels. `rift` traegt Flaechen,
  // `riftInk` die Schrift darauf, `riftGlow` den Schein. Gemessen auf
  // Schwarz: rift 4,96:1, riftLine 7,72:1, riftBright 11,38:1 - deshalb
  // steht auf violetten Flaechen WEISSE Schrift, nie dunkle.
  rift: "#7c3aed", riftDeep: "#5b21b6", riftLine: "#a78bfa", riftBright: "#c4b5fd",
  riftInk: "#f7f3ff", riftGlow: "rgba(139,92,246,.55)",
  shadow: "0 10px 28px rgba(0,0,0,.55)",
  // How see-through the floating chrome (header card, dock) is, as a hex
  // alpha appended to `panel`, plus its backdrop blur. Classic stays nearly
  // solid: on the deep navy night a translucent bar just reads as muddy.
  glass: "ec", glassBlur: "12px",
  // The login screen used to hardwire these three. That was invisible while
  // classic was the only livery, and wrong the moment carved arrived: the
  // fields stayed night-navy on a daylight app. Classic keeps the exact old
  // values, so switching to classic is still byte-for-byte the old screen.
  // NOTE: the social buttons (Google, Apple, Discord) are deliberately NOT
  // tokenised - their colours are brand requirements, not our palette.
  // The ENTRY STRETCH - login and save picking - stays black in both liveries:
  // the title art sits on it and the whole opening reads as one dark curtain.
  // Only what comes AFTER logging in wears the lightened carved stone. Classic
  // keeps its exact former values here (login was #000, saves inherited T.bg).
  input: "#0b0813", loginBg: "#000", savesBg: "#000", errText: "#e08f8f",
  radius: 14, radiusSm: 10,
  sqLight: "#2c3a5c", sqDark: "#1b2540", grid: "#0a0e18",
  serif: `Georgia, 'Palatino Linotype', 'Times New Roman', serif`,
};
// The carved liveries' stone: everything one to two steps lighter and warmer,
// as if the whole app were cut from the same slate as the figures. Accents,
// radii and type stay identical so nothing jumps when switching.
const CARVED = { ...CLASSIC,
  // Zurueck auf das Blau - v0.33.0 hatte daraus Pergament gemacht, das war zu
  // weit. Gemeint war: dasselbe Blau, nur luftiger. Deshalb hier drei gezielte
  // Aenderungen gegen den Stand davor:
  //   1. GRUND dunkler (#202b40 -> #151d2c), damit das Schachbrett im
  //      Hintergrund darin verschwinden kann statt darauf zu liegen.
  //   2. TAFELN eine Stufe heller (#2c3a57 -> #35456a), damit sie sich vom
  //      dunkleren Grund weiter abheben als vorher.
  //   3. TAFELN leicht durchscheinend (Alpha e8 = 91 %), damit das Brett
  //      darunter zu ahnen ist. Die Kontraste sind gegen die GEMISCHTE Farbe
  //      gerechnet, nicht gegen die reine - sonst luegt die Rechnung.
  //   5. SCHWARZ als Grund und DER RISS als zweite Stimme. Das Introbild und
  //      das Wappen geben die Sprache vor: tiefes Schwarz, aus dem violettes
  //      Licht bricht. Die Tafeln bleiben ablesbar, verlieren aber ihr Blau
  //      zugunsten eines sehr dunklen Violett-Anteils.
  bg: "#000000", bg2: "#0a0710", panel: "#1a1430e8", panel2: "#241a3fe8", line: "#3b2d63",
  text: "#f6efdf", dim: "#c6bca2", faint: "#c0b8a4",
  //   4. GOLD eine Stufe heller. Auf der blauen Tafel wirkte das alte Gold
  //      stumpf - Ueberschriften wie "DEINE SCHATZKAMMER" lasen sich fast
  //      dunkel. Gemessen gegen die effektive Tafelfarbe #324164 steigt der
  //      Kontrast von 6,29:1 auf 7,26:1 (gold) und 8,24:1 auf 9,07:1 (hell);
  //      der Akzent lime von 4,73:1 auf 5,85:1.
  gold: "#f2d98c", goldBright: "#fbf3cf", lime: "#e0c274", limeDim: "#c2a253",
  magenta: "#9fb0d0", magentaDim: "#76849f",
  shadow: "0 10px 24px rgba(0,0,0,.45)",
  glass: "d9", glassBlur: "18px",
  sqLight: "#41527a", sqDark: "#2d3d60", grid: "#1a2440",
  input: "#0b0813", loginBg: "#000", savesBg: "#000", errText: "#e8a6a6",
};
export const T = { ...CLASSIC };
/** Swap the whole app's livery in place. Called once from App.jsx per render
 *  of a hydrated profile — every T.* read after it sees the chosen design. */
export function setDesign(design) {
  Object.assign(T, design === "carved" ? CARVED : CLASSIC);
}

export const GLOBAL_CSS = `
  /* Desktop: bei 100% Browser-Zoom soll die App nicht verloren wirken —
     große Fenster bekommen eine sanfte eingebaute Vergrößerung. */
  @keyframes ggFade { from { opacity: 0 } to { opacity: 1 } }
  :root { --vhz: 1; }
  @media (min-width: 1440px) { #root { zoom: 1.15; } :root { --vhz: 1.15; } }
  @media (min-width: 1760px) { #root { zoom: 1.3; } :root { --vhz: 1.3; } }
  /* NOTHING in the app is selectable, draggable or downloadable — no text
     selection, no long-press save sheet, no drag-out of art, no image context
     menu. The ONLY exception is fields the user types into (name, password,
     search, import boxes), so copy/paste still works there. */
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent;
      -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;
      -webkit-user-drag: none; user-drag: none; -webkit-touch-callout: none; }
  input, textarea, [contenteditable="true"], [contenteditable=""] {
      -webkit-user-select: text; -moz-user-select: text; -ms-user-select: text; user-select: text;
      -webkit-touch-callout: default; }
  /* pull-to-refresh is retired — the app updates itself (v0.21.42); the
     gesture only ever fought the map pan and the board */
  html, body { overscroll-behavior: none; overscroll-behavior-y: none; }
  img, svg, canvas { -webkit-touch-callout: none; -webkit-user-drag: none; user-drag: none; user-select: none; }
  /* number fields render as plain gold boxes — no native spinners */
  input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  html, body, #root { height: 100%; }
  button, a { -webkit-tap-highlight-color: transparent; }
  /* DIE WURZEL DES PLASTIK-RAHMENS: Ohne eigene Angabe geben Browser jedem
     Knopf und Feld ihren Standardrahmen "2px outset" - eine dicke, dunkle,
     dreidimensional wirkende Kante. Genau die soll nirgends erscheinen.
     Deshalb hier EIN Reset fuer alle Bedienelemente: duenne Kante, flach.
     Eigene Stile im Bauteil ueberschreiben das wie gehabt. */
  button, input, select, textarea {
    border: 1px solid transparent;
    border-radius: ${T.radiusSm}px;
    background-clip: padding-box;
  }
  input, select, textarea { border-color: ${T.line}; background-color: ${T.bg2}; color: ${T.text}; }
  input:focus, select:focus, textarea:focus { border-color: ${T.riftLine}; box-shadow: 0 0 0 3px rgba(124,58,237,.18); outline: none; }
  button:focus:not(:focus-visible), a:focus:not(:focus-visible) { outline: none; }
  body {
    margin: 0; color: ${T.text};
    background: ${T.bg};
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased; overflow-x: hidden;
  }
  button:active { transform: scale(.97); }
  .gg-thinbar { scrollbar-width: thin; scrollbar-color: rgba(233,210,150,.28) transparent; }
  .gg-thinbar::-webkit-scrollbar { width: 5px; }
  .gg-thinbar::-webkit-scrollbar-thumb { background: rgba(233,210,150,.28); border: none; border-radius: 99px; }
  ::-webkit-scrollbar { width: 10px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2b3550; border: 2.5px solid ${T.bg}; border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: #c9a45c88; }
  ::-webkit-scrollbar-corner { background: transparent; }
  * { scrollbar-width: thin; scrollbar-color: #2b3550 transparent; }
  input { font-family: inherit; }
  .gg-serif { font-family: ${T.serif}; }
  @keyframes pop { from { transform: scale(.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes ggGlow { 0%,100% { box-shadow: 0 0 5px rgba(201,164,92,.22); } 50% { box-shadow: 0 0 14px rgba(201,164,92,.5); } }
  /* THE TREASURY'S MEDALLION, once its plate is opened: the ring of light
     turns around the emblem, and sparks fly off TANGENTIALLY from the brightest
     point — each spark rides its own orbit, so they leave the rim sideways
     rather than shooting straight out. */
  /* one sweep of light across a treasury plate, run once when it is tapped */
  /* Der Streifen ist 62 % so breit wie die Platte. translateX rechnet in der
     EIGENEN Breite, also brachte das alte Ziel von 120 % seine linke Kante
     nur auf 0.62*120 = 74 % der Platte - und weil die Animation mit both
     stehen bleibt, lag der Rest des Verlaufs danach fuer immer im letzten
     Viertel. Das war die harte Kante. Damit er vollstaendig hinauslaeuft,
     muss die linke Kante ueber 100 % kommen: 100/62 = 161 %. 175 % gibt Luft. */
  @keyframes ggPlateSheen { from { transform: translateX(-120%); } to { transform: translateX(175%); } }
  @keyframes ggSaum { 0%, 100% { opacity: .72; } 50% { opacity: 1; } }
  @keyframes ggRiftOpen { from { transform: scale(1.09); opacity: 0; } 40% { opacity: .92; } to { transform: scale(1); opacity: .92; } }
  @keyframes ggRiftPulse { 0%, 100% { box-shadow: 0 0 9px rgba(124,58,237,.35); border-color: rgba(167,139,250,.55); }
    50% { box-shadow: 0 0 20px rgba(139,92,246,.65); border-color: rgba(196,181,253,.95); } }
  @keyframes ggHop { 0% { transform: translateY(0); } 32% { transform: translateY(-13px); } 55% { transform: translateY(0) scale(1.04, .94); } 72% { transform: translateY(-3px); } 100% { transform: translateY(0); } }
  @keyframes ggGlide { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-3px) rotate(-1.6deg); } }
  @keyframes ggBob { 0%, 100% { transform: translateY(0) rotate(-0.8deg); } 50% { transform: translateY(-2.5px) rotate(0.8deg); } }
  @keyframes ggRingSpin { to { transform: rotate(360deg); } }
  @keyframes ggSpark {
    0%   { opacity: 0; transform: rotate(var(--a)) translateX(var(--r)) scale(.5); }
    12%  { opacity: 1; }
    100% { opacity: 0; transform: rotate(calc(var(--a) + 46deg)) translateX(calc(var(--r) + 26px)) scale(.2); }
  }
  @keyframes ggMedalRise { from { transform: translateY(6px) scale(.86); } to { transform: none; } }
  @keyframes ggGlint { 0%, 86%, 100% { opacity: 0; } 90% { opacity: .85; } 95% { opacity: 0; } }
  @keyframes rise { from { opacity: 0; } to { opacity: 1; } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 0 2px ${T.danger}; } 50% { box-shadow: 0 0 0 2px ${T.danger}66; } }
  @keyframes hit { 0% { opacity: .8; } 100% { opacity: 0; } }
  @keyframes ggShake { 0%,100% { transform: translateX(0) rotate(0); }
    15% { transform: translateX(-9%) rotate(-5deg); } 30% { transform: translateX(8%) rotate(4deg); }
    45% { transform: translateX(-6%) rotate(-3deg); } 60% { transform: translateX(5%) rotate(2deg); }
    75% { transform: translateX(-3%) rotate(-1deg); } }
  @keyframes ggFallAway {
    0% { transform: translate(0,0) rotate(0) scale(1); opacity: 1; }
    18% { transform: translate(calc(var(--fdir) * 20%), -34%) rotate(calc(var(--fdir) * 130deg)) scale(1.06); opacity: 1; }
    100% { transform: translate(calc(var(--fdir) * 340%), -120%) rotate(calc(var(--fdir) * 900deg)) scale(.12); opacity: 0; } }
  /* the FALLEN fly to their captor's tray: UP off the top (foe took my piece →
     my tray sits below, so it flies down; I took a foe piece → its tray sits up
     top, flies up). --fdir still nudges sideways so pieces don't overlap. */
  @keyframes splashRing { from { transform: scale(.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes splashPiece { from { transform: translateY(26px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes splashSide { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: .92; } }
  @keyframes splashText { from { letter-spacing: .55em; opacity: 0; } to { letter-spacing: .18em; opacity: 1; } }
  @keyframes marbleWave { 0% { opacity: 0; } 35% { opacity: .34; } 100% { opacity: 0; } }
  /* three opening flights — each battle draws one. All of them ride CLOSE
     along the enemy's TWO ranks (screen-filling) and sweep past once before
     settling. A: left→right. B: right→left. C: a glance at your own line,
     then the sweep. */
  @keyframes ggBoardZoomIn { 0% { transform: scale(.22) translateY(2%); filter: blur(2.5px); }
    55% { filter: blur(0); }
    100% { transform: scale(1) translateY(0); filter: blur(0); } }
  @keyframes ggBoardFlyA { 0% { transform: scale(2.7) translateY(16.5%) translateX(16.2%); }
    14% { transform: scale(2.7) translateY(16.5%) translateX(16.2%); }
    62% { transform: scale(2.7) translateY(16.5%) translateX(-16.2%); }
    82% { transform: scale(1.55) translateY(5%) translateX(-3%); }
    100% { transform: scale(1) translateY(0) translateX(0); } }
  @keyframes ggBoardFlyB { 0% { transform: scale(2.7) translateY(16.5%) translateX(-16.2%); }
    14% { transform: scale(2.7) translateY(16.5%) translateX(-16.2%); }
    62% { transform: scale(2.7) translateY(16.5%) translateX(16.2%); }
    82% { transform: scale(1.55) translateY(5%) translateX(3%); }
    100% { transform: scale(1) translateY(0) translateX(0); } }
  @keyframes ggBoardFlyC { 0% { transform: scale(2.2) translateY(-19%) translateX(-8%); }
    16% { transform: scale(2.2) translateY(-19%) translateX(6%); }
    30% { transform: scale(2.7) translateY(16.5%) translateX(16.2%); }
    72% { transform: scale(2.7) translateY(16.5%) translateX(-16.2%); }
    86% { transform: scale(1.5) translateY(4%) translateX(0); }
    100% { transform: scale(1) translateY(0) translateX(0); } }
  @keyframes ggAbilityGlow { 0%, 100% { box-shadow: 0 0 10px rgba(240,206,122,.22); }
    50% { box-shadow: 0 0 22px rgba(240,206,122,.5); } }
  @keyframes ggUpPulse { 0%, 100% { box-shadow: 0 0 10px rgba(64,110,220,.35), 0 0 0 0 rgba(227,192,122,.0); }
    50% { box-shadow: 0 0 18px rgba(80,130,240,.55), 0 0 0 3px rgba(227,192,122,.18); } }
  @keyframes ggNewPulse { 0%, 100% { box-shadow: inset 0 0 0 2px rgba(240,206,122,.25), 0 0 10px rgba(240,206,122,.15); }
    50% { box-shadow: inset 0 0 0 4.5px rgba(246,233,164,.95), 0 0 30px rgba(240,206,122,.8); } }
  @keyframes ggSmokeUp { 0% { transform: translateX(-50%) translateY(6%) scaleY(.92); opacity: .45 }
    50% { transform: translateX(-47%) translateY(-6%) scaleY(1.04); opacity: .8 }
    100% { transform: translateX(-50%) translateY(-14%) scaleY(1.1); opacity: .35 } }
  @keyframes ggFogR { from { transform: translateX(5%) } to { transform: translateX(-6%) } }
  @keyframes ggFogR2 { from { transform: translateX(7%) translateY(1.5%) } to { transform: translateX(-4%) translateY(-1%) } }
  /* drifting clouds over the map's head: layers crossing at different speeds,
     travelling FAR across the sky so blue/sun/dusk keeps opening up between them */
  @keyframes ggCloudA { 0% { transform: translate(-48%, 3%) scale(1.16); }
    50% { transform: translate(4%, -5%) scale(1.34); }
    100% { transform: translate(46%, 4%) scale(1.18); } }
  @keyframes ggCloudB { 0% { transform: translate(44%, -3%) scale(1.32); }
    50% { transform: translate(-10%, 6%) scale(1.14); }
    100% { transform: translate(-46%, -2%) scale(1.3); } }
  @keyframes ggCloudC { 0% { transform: translate(28%, 2%) scale(1.22); }
    100% { transform: translate(-34%, -4%) scale(1.46); } }
  @keyframes ggCloudD { 0% { transform: translate(-38%, -2%) scale(1.2); }
    50% { transform: translate(14%, 5%) scale(1.3); }
    100% { transform: translate(40%, -3%) scale(1.16); } }
  @keyframes ggCloudBreath { 0%,100% { opacity: .58; } 50% { opacity: 1; } }
  @keyframes ggFogA { from { transform: translate(-3.5%, -1.5%) } to { transform: translate(3.5%, 1.5%) } }
  @keyframes ggFogB { from { transform: translate(3%, 1.8%) } to { transform: translate(-3%, -1.8%) } }
  @keyframes ggSweep { from { transform: translate(var(--sx0), var(--sy0)); } to { transform: translate(var(--sx1), var(--sy1)); } }
  @keyframes ggRedeem { from { filter: hue-rotate(185deg) saturate(.5) brightness(.9) drop-shadow(0 3px 6px rgba(0,0,0,.5)); } to { filter: hue-rotate(0deg) saturate(1) brightness(1) drop-shadow(0 3px 6px rgba(0,0,0,.5)); } }
  @keyframes bossFlee { 0% { transform: translateX(-50%) rotate(0deg); opacity: 1; } 18% { transform: translateX(calc(-50% + 14px)) rotate(9deg); opacity: 1; } 100% { transform: translateX(calc(-50% + 340px)) rotate(6deg); opacity: 0; } }
  @keyframes ctaPop { from { opacity: 0; transform: translate(-50%,4px) scale(.92); } to { opacity: 1; transform: translate(-50%,0) scale(1); } }
  @keyframes queuePulse { 0%,100% { transform: scale(1); opacity: .55; } 50% { transform: scale(1.18); opacity: .18; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes arrowFade { 0% { opacity: 0; } 12% { opacity: 1; } 60% { opacity: 1; } 100% { opacity: 0; } }
  /* a plain stride LEANS into the direction of travel mid-way and settles back
     upright on arrival — so the ghost's final frame is IDENTICAL to the real
     piece and the handoff is invisible. The shadow breathes in and out with it. */
  @keyframes ggLean {
    0%   { transform: rotate(0deg); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
    45%  { transform: rotate(var(--tilt, 0deg)); filter: drop-shadow(0 3px 6px rgba(0,0,0,.5)); }
    100% { transform: rotate(0deg); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); } }
  /* a LEAP is a real hop: spring high, grow toward the eye at the apex, land —
     upright the whole way (no lean), the shadow deepens beneath at the peak. */
  @keyframes ggLeapArc {
    0%   { transform: translateY(0) scale(1); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); }
    46%  { transform: translateY(-110%) scale(1.18); filter: drop-shadow(0 16px 12px rgba(0,0,0,.42)); }
    100% { transform: translateY(0) scale(1); filter: drop-shadow(0 0 0 rgba(0,0,0,0)); } }
  /* a blocked strike: the attacker lunges toward the foe (--bx/--by point at the
     target) and springs back to where it stood — ends neutral. */
  @keyframes ggBounce {
    0%   { transform: translate(0,0); }
    38%  { transform: translate(var(--bx, 0), var(--by, 0)); }
    100% { transform: translate(0,0); } }
  @keyframes herePulse { 0%,100% { box-shadow: 0 0 0 3px #c9a45c66, 0 0 0 7px #c9a45c22; } 50% { box-shadow: 0 0 0 5px #c9a45c88, 0 0 0 11px #c9a45c1c; } }
  .gg-quill { font-family: "IM Fell English", Georgia, "Times New Roman", serif; font-style: italic; }
  /* Der Glanz lief bisher mit ease-in-out — und bremste damit AB, WÄHREND das
     Band noch im Bild war: es sah aus, als bliebe der Schimmer bei zwei
     Dritteln stehen und löste sich dort auf. Der Lauf ist jetzt gleichförmig
     (linear auf dem Sweep-Abschnitt, per-Keyframe gesetzt und damit stärker
     als das ease-in-out am Element), und er reicht mit 360% sicher über die
     rechte Kante hinaus. Danach ruht das Band bis zum nächsten Durchgang. */
  @keyframes ggShine { 0% { transform: translateX(-170%) skewX(-18deg); animation-timing-function: linear; } 13% { transform: translateX(360%) skewX(-18deg); } 100% { transform: translateX(360%) skewX(-18deg); } }
  @keyframes ggPulse { 0%,100% { opacity: .35; transform: scale(1); } 50% { opacity: .9; transform: scale(1.12); } }
  @keyframes splashRule { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes ggEdgeSweep { 0% { background-position: 230% 0; } 60%, 100% { background-position: -130% 0; } }
  @keyframes splashOut { to { opacity: 0; visibility: hidden; } }
`;