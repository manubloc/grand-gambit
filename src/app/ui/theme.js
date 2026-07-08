// Design tokens — GRAND GAMBIT. Deep royal navy, antique gold, ivory text.
// The player is GOLD (gold plays the role of white); the enemy is the dark
// navy side rimmed in steel. Elegance over flash: serif brandmarks, diamond
// flourishes, crisp 1px lines. (Token keys kept stable: `lime` = player/primary
// accent, `magenta` = enemy accent.)
export const T = {
  bg: "#0c111e", bg2: "#101828", panel: "#131b2d", panel2: "#1a2338", line: "#28324e",
  text: "#f0e9d8", dim: "#a9a48e", faint: "#6f6b5e",
  lime: "#c9a45c", limeDim: "#a8863f", limeInk: "#17110a",          // player / primary accent (gold)
  magenta: "#8fa0c0", magentaDim: "#66748f", magentaInk: "#10141d", // enemy accent (steel navy)
  gold: "#e3c07a", danger: "#d5495a", green: "#58c98b", blue: "#8fa0c0",
  goldBright: "#f0dfae",
  shadow: "0 10px 28px rgba(0,0,0,.55)",
  radius: 14, radiusSm: 10,
  sqLight: "#232c44", sqDark: "#141b2e", grid: "#0a0e18",
  serif: `Georgia, 'Palatino Linotype', 'Times New Roman', serif`,
};

export const GLOBAL_CSS = `
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0; color: ${T.text};
    background: ${T.bg};
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    -webkit-font-smoothing: antialiased; overflow-x: hidden;
  }
  button:active { transform: scale(.97); }
  ::-webkit-scrollbar { width: 9px; height: 9px; }
  ::-webkit-scrollbar-thumb { background: ${T.line}; border-radius: 9px; }
  input { font-family: inherit; }
  .gg-serif { font-family: ${T.serif}; }
  @keyframes pop { from { transform: scale(.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes rise { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 0 2px ${T.danger}; } 50% { box-shadow: 0 0 0 2px ${T.danger}66; } }
  @keyframes hit { 0% { opacity: .8; } 100% { opacity: 0; } }
  @keyframes splashRing { from { transform: scale(.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes splashPiece { from { transform: translateY(26px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes splashSide { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: .92; } }
  @keyframes splashText { from { letter-spacing: .55em; opacity: 0; } to { letter-spacing: .18em; opacity: 1; } }
  @keyframes walkBob { 0%,100% { transform: translate(-50%,-118%) rotate(-4deg); } 50% { transform: translate(-50%,-124%) rotate(4deg); } }
  @keyframes idleBob { 0%,100% { transform: translate(-50%,-118%); } 50% { transform: translate(-50%,-122%); } }
  @keyframes ctaPop { from { opacity: 0; transform: translate(-50%,4px) scale(.92); } to { opacity: 1; transform: translate(-50%,0) scale(1); } }
  @keyframes queuePulse { 0%,100% { transform: scale(1); opacity: .55; } 50% { transform: scale(1.18); opacity: .18; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes arrowFade { 0% { opacity: 0; } 12% { opacity: 1; } 60% { opacity: 1; } 100% { opacity: 0; } }
  @keyframes herePulse { 0%,100% { box-shadow: 0 0 0 3px #c9a45c66, 0 0 0 7px #c9a45c22; } 50% { box-shadow: 0 0 0 5px #c9a45c88, 0 0 0 11px #c9a45c1c; } }
  @keyframes splashRule { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes splashOut { to { opacity: 0; visibility: hidden; } }
`;
