// Design tokens — GRAND GAMBIT. Deep royal navy, antique gold, ivory text.
// The player is GOLD (gold plays the role of white); the enemy is the dark
// navy side rimmed in steel. Elegance over flash: serif brandmarks, diamond
// flourishes, crisp 1px lines. (Token keys kept stable: `lime` = player/primary
// accent, `magenta` = enemy accent.)
export const T = {
  bg: "#0c111e", bg2: "#101828", panel: "#131b2d", panel2: "#1a2338", line: "#28324e",
  text: "#f0e9d8", dim: "#a9a48e", faint: "#6f6b5e",
  lime: "#d1ad55", limeDim: "#b08f3a", limeInk: "#17110a",          // player / primary accent (gold)
  magenta: "#8fa0c0", magentaDim: "#66748f", magentaInk: "#10141d", // enemy accent (steel navy)
  gold: "#eac96b", danger: "#d5495a", green: "#58c98b", blue: "#8fa0c0",
  goldBright: "#f6e9a4",
  shadow: "0 10px 28px rgba(0,0,0,.55)",
  radius: 14, radiusSm: 10,
  sqLight: "#2c3a5c", sqDark: "#1b2540", grid: "#0a0e18",
  serif: `Georgia, 'Palatino Linotype', 'Times New Roman', serif`,
};

export const GLOBAL_CSS = `
  /* Desktop: bei 100% Browser-Zoom soll die App nicht verloren wirken —
     große Fenster bekommen eine sanfte eingebaute Vergrößerung. */
  @keyframes ggFade { from { opacity: 0 } to { opacity: 1 } }
  :root { --vhz: 1; }
  @media (min-width: 1440px) { #root { zoom: 1.15; } :root { --vhz: 1.15; } }
  @media (min-width: 1760px) { #root { zoom: 1.3; } :root { --vhz: 1.3; } }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  /* pull-to-refresh is retired — the app updates itself (v0.21.42); the
     gesture only ever fought the map pan and the board */
  html, body { overscroll-behavior: none; overscroll-behavior-y: none; }
  /* nothing in the app is downloadable: no long-press save sheet on phones,
     no drag-out of the paintings, no image context menu */
  img, svg, canvas { -webkit-touch-callout: none; -webkit-user-drag: none; user-drag: none; user-select: none; }
  /* number fields render as plain gold boxes — no native spinners */
  input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  html, body, #root { height: 100%; }
  button, a { -webkit-tap-highlight-color: transparent; }
  button:focus:not(:focus-visible), a:focus:not(:focus-visible) { outline: none; }
  body {
    margin: 0; color: ${T.text};
    background: ${T.bg};
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased; overflow-x: hidden;
  }
  button:active { transform: scale(.97); }
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
  @keyframes ggGlint { 0%, 86%, 100% { opacity: 0; } 90% { opacity: .85; } 95% { opacity: 0; } }
  @keyframes rise { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 0 2px ${T.danger}; } 50% { box-shadow: 0 0 0 2px ${T.danger}66; } }
  @keyframes hit { 0% { opacity: .8; } 100% { opacity: 0; } }
  @keyframes splashRing { from { transform: scale(.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes splashPiece { from { transform: translateY(26px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes splashSide { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: .92; } }
  @keyframes splashText { from { letter-spacing: .55em; opacity: 0; } to { letter-spacing: .18em; opacity: 1; } }
  @keyframes marbleWave { 0% { opacity: 0; } 35% { opacity: .34; } 100% { opacity: 0; } }
  @keyframes ggSmokeUp { 0% { transform: translateX(-50%) translateY(6%) scaleY(.92); opacity: .22 }
    50% { transform: translateX(-47%) translateY(-6%) scaleY(1.04); opacity: .42 }
    100% { transform: translateX(-50%) translateY(-14%) scaleY(1.1); opacity: .16 } }
  @keyframes ggFogR { from { transform: translateX(5%) } to { transform: translateX(-6%) } }
  @keyframes ggFogR2 { from { transform: translateX(7%) translateY(1.5%) } to { transform: translateX(-4%) translateY(-1%) } }
  @keyframes ggFogA { from { transform: translate(-3.5%, -1.5%) } to { transform: translate(3.5%, 1.5%) } }
  @keyframes ggFogB { from { transform: translate(3%, 1.8%) } to { transform: translate(-3%, -1.8%) } }
  @keyframes ggSweep { from { transform: translate(var(--sx0), var(--sy0)); } to { transform: translate(var(--sx1), var(--sy1)); } }
  @keyframes ggRedeem { from { filter: hue-rotate(185deg) saturate(.5) brightness(.9) drop-shadow(0 3px 6px rgba(0,0,0,.5)); } to { filter: hue-rotate(0deg) saturate(1) brightness(1) drop-shadow(0 3px 6px rgba(0,0,0,.5)); } }
  @keyframes bossFlee { 0% { transform: translateX(-50%) rotate(0deg); opacity: 1; } 18% { transform: translateX(calc(-50% + 14px)) rotate(9deg); opacity: 1; } 100% { transform: translateX(calc(-50% + 340px)) rotate(6deg); opacity: 0; } }
  @keyframes ctaPop { from { opacity: 0; transform: translate(-50%,4px) scale(.92); } to { opacity: 1; transform: translate(-50%,0) scale(1); } }
  @keyframes queuePulse { 0%,100% { transform: scale(1); opacity: .55; } 50% { transform: scale(1.18); opacity: .18; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes arrowFade { 0% { opacity: 0; } 12% { opacity: 1; } 60% { opacity: 1; } 100% { opacity: 0; } }
  @keyframes herePulse { 0%,100% { box-shadow: 0 0 0 3px #c9a45c66, 0 0 0 7px #c9a45c22; } 50% { box-shadow: 0 0 0 5px #c9a45c88, 0 0 0 11px #c9a45c1c; } }
  .gg-quill { font-family: "IM Fell English", Georgia, "Times New Roman", serif; font-style: italic; }
  @keyframes ggShine { 0% { transform: translateX(-160%) skewX(-18deg); } 12% { transform: translateX(320%) skewX(-18deg); } 100% { transform: translateX(320%) skewX(-18deg); } }
  @keyframes ggPulse { 0%,100% { opacity: .35; transform: scale(1); } 50% { opacity: .9; transform: scale(1.12); } }
  @keyframes splashRule { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes splashOut { to { opacity: 0; visibility: hidden; } }
`;
