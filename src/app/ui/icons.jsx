import { T } from "./theme.js";

// Minimalist outline nav icons with a small accent. `color` carries the active
// (neon) vs inactive state; the accent stays subtle.
export function ElementIcon({ id, color = "#c9a45c", size = 16 }) {
  const s = { fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  const shapes = {
    light:  <><circle cx="12" cy="12" r="4" {...s} /><path d="M12 3 L12 6 M12 18 L12 21 M3 12 L6 12 M18 12 L21 12 M5.6 5.6 L7.7 7.7 M16.3 16.3 L18.4 18.4 M18.4 5.6 L16.3 7.7 M7.7 16.3 L5.6 18.4" {...s} /></>,
    dark:   <path d="M15 3.5 A9 9 0 1 0 20.5 12 A7 7 0 0 1 15 3.5 Z" {...s} />,
    nature: <path d="M12 21 C12 13 14 7 20 4 C20 12 17 17 12 18.5 M12 21 C12 15 10 10 5 8" {...s} />,
    fire:   <path d="M12 3 C15 7 17 9 17 13 A5 5 0 0 1 7 13 C7 10.4 8.6 8.8 10 7 C10 9 10.6 10 12 10.6 C11.4 8 11.4 5.4 12 3 Z" {...s} />,
    water:  <path d="M12 3 C15.6 8 18 11 18 14.5 A6 6 0 0 1 6 14.5 C6 11 8.4 8 12 3 Z" {...s} />,
    air:    <path d="M12 4 C7 4 4 8 4.6 12 C5.2 16 9 18.6 12.6 18 C15.6 17.5 17.6 15 17.2 12.2 C16.8 9.8 14.6 8.2 12.4 8.7 C10.6 9.1 9.5 10.8 9.9 12.5" {...s} />,
    order:  <><path d="M12 4 L12 20 M8 20 L16 20 M5 7 L19 7" {...s} /><path d="M5 7 L3 12 A2.6 2.6 0 0 0 7 12 Z M19 7 L17 12 A2.6 2.6 0 0 0 21 12 Z" {...s} /></>,
    chaos:  <path d="M12 3 L13.6 8.4 L19 6.8 L15.4 11 L20 14 L14.6 14.4 L15.6 20 L12 16 L8.4 20 L9.4 14.4 L4 14 L8.6 11 L5 6.8 L10.4 8.4 Z" {...s} />,
    wisdom: <><path d="M12 5.5 C9.5 4 6.5 4 4 5.5 L4 18.5 C6.5 17 9.5 17 12 18.5 C14.5 17 17.5 17 20 18.5 L20 5.5 C17.5 4 14.5 4 12 5.5 Z" {...s} /><path d="M12 5.5 L12 18.5" {...s} /></>,
    power:  <path d="M4 18 L5.4 8 L9 12 L12 5.5 L15 12 L18.6 8 L20 18 Z" {...s} />,
    faith:  <path d="M12 3 L12 21 M7 9 L17 9" {...s} />,
    fate:   <><path d="M2.5 12 C6 6.5 18 6.5 21.5 12 C18 17.5 6 17.5 2.5 12 Z" {...s} /><circle cx="12" cy="12" r="2.6" {...s} /></>,
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "block" }}>{shapes[id] || shapes.fate}</svg>;
}

// ── Achievement icons — one monochrome stroke family, drawn in-house ─────────
export function AchIcon({ id, color = "#c9a45c", size = 22 }) {
  const s = { fill: "none", stroke: color, strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" };
  const F = { fill: color, stroke: "none" };
  const shapes = {
    wins:       <><path d="M8 4 L16 4 L16 9 A4 4 0 0 1 8 9 Z" {...s} /><path d="M8 5.5 L4.5 5.5 A3.5 3.5 0 0 0 8 9.8 M16 5.5 L19.5 5.5 A3.5 3.5 0 0 1 16 9.8" {...s} /><path d="M12 13 L12 16.5 M8.5 20 L15.5 20 M10 16.5 L14 16.5 L15 20 L9 20 Z" {...s} /></>,
    checkmates: <><path d="M11 3.5 L13 3.5 L13 5.5 L15 5.5 L15 7.5 L13 7.5 L13 9.5 L11 9.5 L11 7.5 L9 7.5 L9 5.5 L11 5.5 Z" {...F} /><path d="M8.5 20 L6 11.5 L12 14 L18 11.5 L15.5 20 Z" {...s} /><path d="M4 20 L20 20" {...s} /></>,
    captures:   <><path d="M5 5 L16.5 16.5 M19 5 L7.5 16.5 M5 5 L8.2 5 M5 5 L5 8.2 M19 5 L15.8 5 M19 5 L19 8.2 M8.6 15.4 L6 19.5 M15.4 15.4 L18 19.5" {...s} /></>,
    promotions: <><circle cx="7.5" cy="7" r="3" {...s} /><path d="M5.5 12 L9.5 12 L10 20 L5 20 Z" {...s} /><path d="M12.5 9 L17 9 M15.5 6.5 L18 9 L15.5 11.5" {...s} /><path d="M14.5 15 L15.4 12.5 L16.6 14.3 L17.8 12 L19 14.3 L20.2 12.5 L21 15 Z" transform="translate(-2.4 3)" {...F} /></>,
    streak:     <><path d="M12 3 C15 7 17.2 9.2 17.2 13 A5.2 5.2 0 0 1 6.8 13 C6.8 10.4 8.4 8.6 9.8 6.8 C9.8 8.9 10.5 10 12 10.6 C11.4 8 11.4 5.4 12 3 Z" {...s} /><path d="M12 20.6 A3 3 0 0 0 14.6 16.2 C13.8 17.2 13 17.5 12 17.6 C12.6 16.4 12.5 15.2 12 14 C10.6 15.6 9.4 16.6 9.4 18.2 A2.7 2.7 0 0 0 12 20.6 Z" {...F} /></>,
    flawless:   <><path d="M12 3.5 C14.8 5 17.4 5.4 19 5 C19.4 12 17 17.5 12 20.5 C7 17.5 4.6 12 5 5 C6.6 5.4 9.2 5 12 3.5 Z" {...s} /><path d="M8.8 11.8 L11 14 L15.4 9.4" {...s} /></>,
    fast:       <><path d="M13.5 3 L6.5 13 L11 13 L9.5 21 L17.5 10.5 L12.7 10.5 Z" {...s} /></>,
    games:      <><rect x="4.5" y="4.5" width="15" height="15" rx="2" {...s} /><path d="M9.5 4.5 L9.5 19.5 M14.5 4.5 L14.5 19.5 M4.5 9.5 L19.5 9.5 M4.5 14.5 L19.5 14.5" {...s} strokeWidth="1.4" /><rect x="9.5" y="9.5" width="5" height="5" {...F} opacity=".55" /></>,
    stages:     <><path d="M5 20 C7 15 5.5 12 9 9.5 C12.5 7 11 5 14.5 4" {...s} strokeDasharray="0.1 4.2" strokeWidth="2.4" /><path d="M17 3 A3.2 3.2 0 0 1 20.2 6.2 C20.2 8.6 17 11.5 17 11.5 C17 11.5 13.8 8.6 13.8 6.2 A3.2 3.2 0 0 1 17 3 Z" {...s} /><circle cx="17" cy="6.2" r="1.1" {...F} /></>,
    bosses:     <><path d="M12 3.5 C16.2 3.5 18.6 6.4 18.6 9.8 C18.6 12 17.5 13.7 15.8 14.6 L15.8 17 L8.2 17 L8.2 14.6 C6.5 13.7 5.4 12 5.4 9.8 C5.4 6.4 7.8 3.5 12 3.5 Z" {...s} /><circle cx="9.6" cy="10" r="1.4" {...F} /><circle cx="14.4" cy="10" r="1.4" {...F} /><path d="M9.5 20.5 L9.5 18 M12 21 L12 18 M14.5 20.5 L14.5 18" {...s} /></>,
    recruits:   <><circle cx="8" cy="7.5" r="2.6" {...s} /><path d="M3.8 17.5 C4.2 13.8 6 12 8 12 C10 12 11.8 13.8 12.2 17.5" {...s} /><circle cx="16" cy="8.5" r="2.2" {...s} opacity=".6" /><path d="M12.6 17.5 C13 14.4 14.4 12.8 16 12.8 C17.6 12.8 19 14.4 19.4 17.5" {...s} opacity=".6" /><path d="M14.8 5.2 L17.2 5.2 M16 4 L16 6.4" {...s} /></>,
    upgrades:   <><path d="M6 15.5 L13.5 8 L11.5 6 L16.5 3.5 L20.5 7.5 L18 12.5 L16 10.5 L8.5 18 Z" {...s} /><path d="M4.5 20.5 L8.5 18 L6 15.5 Z" {...F} /></>,
    xp:         <><path d="M12 3 L14 9 L20 9.5 L15.3 13.3 L17 19.5 L12 15.8 L7 19.5 L8.7 13.3 L4 9.5 L10 9 Z" {...s} /><circle cx="12" cy="11.8" r="1.2" {...F} /></>,
    hpwins:     <><path d="M12 20 C6.5 16 3.5 12.5 3.5 8.9 A4.4 4.4 0 0 1 12 6.8 A4.4 4.4 0 0 1 20.5 8.9 C20.5 12.5 17.5 16 12 20 Z" {...s} /><path d="M6.5 11 L9.5 11 L10.8 8.5 L12.6 13.5 L13.9 11 L17.5 11" {...s} strokeWidth="1.6" /></>,
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "block" }}>{shapes[id] || shapes.xp}</svg>;
}

// ── Navigation icons — same family, for the dock / rail ─────────────────────
export function NavIcon({ id, color = "#a9a48e", size = 22 }) {
  const s = { fill: "none", stroke: color, strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" };
  const shapes = {
    play:    <><path d="M5 5 L16.5 16.5 M19 5 L7.5 16.5 M5 5 L8.2 5 M5 5 L5 8.2 M19 5 L15.8 5 M19 5 L19 8.2 M8.6 15.4 L6 19.5 M15.4 15.4 L18 19.5" {...s} /></>,
    army:    <><path d="M12 3.5 C14.8 5 17.4 5.4 19 5 C19.4 12 17 17.5 12 20.5 C7 17.5 4.6 12 5 5 C6.6 5.4 9.2 5 12 3.5 Z" {...s} /><path d="M12 7 L12 16.5 M8 11.5 L16 11.5" {...s} strokeWidth="1.6" /></>,
    ach:     <><path d="M8 4 L16 4 L16 9 A4 4 0 0 1 8 9 Z" {...s} /><path d="M8 5.5 L4.5 5.5 A3.5 3.5 0 0 0 8 9.8 M16 5.5 L19.5 5.5 A3.5 3.5 0 0 1 16 9.8" {...s} /><path d="M12 13 L12 16.5 M9 20 L15 20 L14.2 16.5 L9.8 16.5 Z" {...s} /></>,
    profile: <><circle cx="12" cy="8" r="3.6" {...s} /><path d="M4.8 20 C5.4 15.4 8.2 13.2 12 13.2 C15.8 13.2 18.6 15.4 19.2 20" {...s} /></>,
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "block" }}>{shapes[id] || shapes.play}</svg>;
}

// ── Currency v3 — an order star and a crowned coin, drawn as insignia rather
// than cartoon gold: clean silhouettes, fine dark contours, one soft light
// edge. Reads crisp at chip size, shows its engraving when large. ───────────
export function SkillStar({ size = 18, style }) {
  const fine = size >= 16;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" shapeRendering="geometricPrecision"
      style={{ display: "inline-block", verticalAlign: "-0.14em", ...style }}>
      <defs>
        <linearGradient id="ggStarG3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7e5ac" /><stop offset=".55" stopColor="#d3ac5c" /><stop offset="1" stopColor="#96742f" />
        </linearGradient>
      </defs>
      {/* four-ray order star: long N/S rays, shorter E/W, slim diagonals */}
      <path d="M12 0.8 L14 9.2 L12 12 L10 9.2 Z M12 23.2 L10 14.8 L12 12 L14 14.8 Z M0.8 12 L8.4 10.3 L12 12 L8.4 13.7 Z M23.2 12 L15.6 13.7 L12 12 L15.6 10.3 Z"
        fill="url(#ggStarG3)" stroke="#59461e" strokeWidth={fine ? 0.8 : 1.1} strokeLinejoin="round" />
      <path d="M12 2.6 L12 12 L10.6 10 Z M2.8 12 L12 12 L9.6 10.9 Z" fill="#fff7dc" opacity=".5" />
      {fine && <path d="M5.9 5.9 L10.4 10.4 M18.1 5.9 L13.6 10.4 M5.9 18.1 L10.4 13.6 M18.1 18.1 L13.6 13.6"
        stroke="#d3ac5c" strokeWidth="1.1" strokeLinecap="round" opacity=".85" />}
      <circle cx="12" cy="12" r={fine ? 1.7 : 2} fill="#f7e5ac" stroke="#59461e" strokeWidth=".7" />
    </svg>
  );
}

export function GoldCoin({ size = 18, style, shine = false }) {
  const fine = size >= 16;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" shapeRendering="geometricPrecision"
      style={{ display: "inline-block", verticalAlign: "-0.14em", ...style }}>
      <defs>
        <linearGradient id="ggCoinG3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2dfa2" /><stop offset=".55" stopColor="#cfa254" /><stop offset="1" stopColor="#8d6b2a" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="10.6" fill="url(#ggCoinG3)" stroke="#59461e" strokeWidth={fine ? 0.9 : 1.2} />
      <circle cx="12" cy="12" r="8.2" fill="none" stroke="#6e5423" strokeWidth={fine ? 0.8 : 1.1} opacity=".9" />
      <path d="M4.4 8.2 A8.6 8.6 0 0 1 19.6 8.2" fill="none" stroke="#fff4d2" strokeWidth="1" opacity=".5" strokeLinecap="round" />
      {shine && <ellipse cx="9.5" cy="7.6" rx="4.6" ry="1.8" fill="#fffbe6"
        transform="rotate(-24 9.5 7.6)" style={{ animation: "ggGlint 5.6s ease-in-out infinite" }} opacity="0" />}
      {/* crowned coinage — three points, jewelled band */}
      <path d="M7.6 14.6 L7 9.4 L9.8 11.6 L12 8.4 L14.2 11.6 L17 9.4 L16.4 14.6 Z"
        fill={fine ? "#6e5423" : "#6e5423"} stroke={fine ? "#59461e" : "none"} strokeWidth=".5" strokeLinejoin="round" />
      <path d="M7.7 15.6 h8.6 v1.5 h-8.6 Z" fill="#6e5423" />
      {fine && <path d="M7.3 9.7 L9.9 11.8 L12 8.8 L14.1 11.8 L16.7 9.7" fill="none" stroke="#f2dfa2" strokeWidth=".7" opacity=".7" />}
      {fine && <circle cx="9.8" cy="16.35" r=".55" fill="#f2dfa2" />}
      {fine && <circle cx="12" cy="16.35" r=".55" fill="#f2dfa2" />}
      {fine && <circle cx="14.2" cy="16.35" r=".55" fill="#f2dfa2" />}
    </svg>
  );
}

// ── small in-house UI glyphs (v0.19): every icon drawn, no emoji anywhere ────
const gs = (color, w = 1.9) => ({ fill: "none", stroke: color, strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" });

/** True bosses only — the league's monsters wear the skull. */
export function SkullIc({ color = "#8e2f39", size = 14 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "inline-block", verticalAlign: "-2px" }}>
    <path d="M12 3 C7 3 4.5 6.4 4.5 10.2 C4.5 13 6 14.8 7.5 15.8 L7.5 18.5 L10 18.5 L10 20.5 L14 20.5 L14 18.5 L16.5 18.5 L16.5 15.8 C18 14.8 19.5 13 19.5 10.2 C19.5 6.4 17 3 12 3 Z" fill={color} />
    <circle cx="9.2" cy="10.6" r="1.9" fill="#f6f0de" /><circle cx="14.8" cy="10.6" r="1.9" fill="#f6f0de" />
    <path d="M12 12.6 L13 14.6 L11 14.6 Z" fill="#f6f0de" />
  </svg>;
}

/** Challengers — crossed blades, a fight worth picking. */
export function BladesIc({ color = "#8a6f4d", size = 14 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "inline-block", verticalAlign: "-2px" }}>
    <path d="M5 5 L17 17 M19 5 L7 17 M5 5 L8 5 M5 5 L5 8 M19 5 L16 5 M19 5 L19 8 M8.4 15.6 L6 20 M15.6 15.6 L18 20" {...gs(color)} />
  </svg>;
}

export function LockIc({ color = "#8b90a3", size = 13 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "inline-block", verticalAlign: "-2px" }}>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2.2" fill={color} />
    <path d="M8 10.5 L8 7.6 A4 4 0 0 1 16 7.6 L16 10.5" {...gs(color, 2.2)} />
    <circle cx="12" cy="14.6" r="1.5" fill="#0d1017" /><path d="M12 15.6 L12 17.4" stroke="#0d1017" strokeWidth="1.6" strokeLinecap="round" />
  </svg>;
}

export function FlagIc({ color = "currentColor", size = 14 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "inline-block", verticalAlign: "-2px" }}>
    <path d="M6 3.5 L6 20.5" {...gs(color, 2.1)} />
    <path d="M6 4.5 L17.5 4.5 L14.8 8 L17.5 11.5 L6 11.5 Z" fill={color} />
  </svg>;
}

export function TrashIc({ color = "#8b90a3", size = 15 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "inline-block", verticalAlign: "-2px" }}>
    <path d="M4.5 6.5 L19.5 6.5 M9.5 6.5 L9.5 4.5 L14.5 4.5 L14.5 6.5 M6.5 6.5 L7.4 20 L16.6 20 L17.5 6.5" {...gs(color)} />
    <path d="M10 10 L10.3 16.5 M14 10 L13.7 16.5" {...gs(color, 1.6)} />
  </svg>;
}

/** The time-turner in play: an hourglass whose sand runs upward. */
export function HourglassIc({ color = "#c9a45c", size = 16 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "inline-block", verticalAlign: "-2px" }}>
    <path d="M6.5 3.5 L17.5 3.5 M6.5 20.5 L17.5 20.5" {...gs(color, 2)} />
    <path d="M8 5 L16 5 C16 8 14.2 9.9 13 11.2 L13 12.8 C14.2 14.1 16 16 16 19 L8 19 C8 16 9.8 14.1 11 12.8 L11 11.2 C9.8 9.9 8 8 8 5 Z" {...gs(color, 1.5)} />
    <path d="M9.3 17.6 C9.9 16.1 10.9 15 12 13.9 C13.1 15 14.1 16.1 14.7 17.6 Z" fill={color} />
    <path d="M12 12.4 L12 9.4 M12 8.2 L10.9 9.5 M12 8.2 L13.1 9.5" {...gs("#f0dfae", 1.3)} />
  </svg>;
}

/** A veiled thing in the supply chest — a wax seal over a question. */
export function SealIc({ color = "#6f6b5e", size = 20 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "block" }}>
    <path d="M12 2.8 L20.2 12 L12 21.2 L3.8 12 Z" fill="none" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M9.6 9.4 C9.6 7.8 10.7 6.9 12.1 6.9 C13.5 6.9 14.5 7.8 14.5 9.2 C14.5 11.2 12.2 11.2 12.2 13.2" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    <circle cx="12.2" cy="16.4" r="1.15" fill={color} />
  </svg>;
}


export function HeartIc({ color = "#58c98b", size = 13 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "inline-block", verticalAlign: "-2px" }}>
    <path d="M12 20.4 C7 16.4 3.6 13.2 3.6 9.6 C3.6 6.9 5.7 5 8.1 5 C9.7 5 11.1 5.8 12 7.1 C12.9 5.8 14.3 5 15.9 5 C18.3 5 20.4 6.9 20.4 9.6 C20.4 13.2 17 16.4 12 20.4 Z" fill={color} />
    <path d="M7.4 8.2 C6.6 8.7 6.1 9.5 6.1 10.4" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.3" strokeLinecap="round" />
  </svg>;
}

export function CloudIc({ color = "#c9a45c", size = 14 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "inline-block", verticalAlign: "-2px" }}>
    <path d="M7 18.5 A4.2 4.2 0 0 1 7.6 10.2 A5.4 5.4 0 0 1 18 11.5 A3.6 3.6 0 0 1 17.4 18.5 Z"
      fill="none" stroke={color} strokeWidth="1.9" strokeLinejoin="round" />
  </svg>;
}

export function PigeonIc({ color = "#c9a45c", size = 14 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "inline-block", verticalAlign: "-2px" }}>
    <path d="M4.5 17.5 C8.5 17.8 13.6 16.6 15.6 12.4 L20 11 L16.6 9.9 C16.2 7.6 14.3 6.2 12.3 6.6 C9.6 7.1 8.8 9.8 9.4 12 C7.8 12.9 5.9 14.6 4.5 17.5 Z"
      fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M9.4 12 C11.4 11.6 13.4 10.4 14.2 8.6" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="14.4" cy="9" r=".85" fill={color} />
  </svg>;
}

/** Leaderboard laurels: gold, silver, bronze — drawn, never emoji medals. */
export function LaurelIc({ rank = 1, size = 16 }) {
  const c = rank === 1 ? "#e3c07a" : rank === 2 ? "#b9c0cc" : "#b98a5e";
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "inline-block", verticalAlign: "-3px" }}>
    <path d="M6.5 4 C5.4 9.6 7 14.8 12 17.6 M17.5 4 C18.6 9.6 17 14.8 12 17.6" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    <path d="M6.9 6.6 L4.9 5.9 M7 9.5 L5 9.3 M7.8 12.3 L6 12.7 M17.1 6.6 L19.1 5.9 M17 9.5 L19 9.3 M16.2 12.3 L18 12.7"
      stroke={c} strokeWidth="1.4" strokeLinecap="round" />
    <text x="12" y="12.6" textAnchor="middle" fontSize="8.4" fontWeight="800" fill={c} fontFamily="Georgia, serif">{rank}</text>
    <path d="M9.4 18.6 L14.6 18.6" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
  </svg>;
}


export function MapIc({ color = "#c9a45c", size = 16 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "inline-block", verticalAlign: "-2px" }}>
    <path d="M4 6.5 L9.3 4.5 L14.7 6.5 L20 4.5 L20 17.5 L14.7 19.5 L9.3 17.5 L4 19.5 Z" fill="none" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M9.3 4.5 L9.3 17.5 M14.7 6.5 L14.7 19.5" stroke={color} strokeWidth="1.3" opacity=".7" />
    <path d="M6.4 12.6 C8 11 10.5 12.8 12 11.2 C13.5 9.6 16 11.6 17.6 9.8" fill="none" stroke={color} strokeWidth="1.2" strokeDasharray="0.5 2.4" strokeLinecap="round" />
  </svg>;
}


export function TrophyIc({ color = "#17110a", size = 15 }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: "inline-block", verticalAlign: "-2px" }}>
    <path d="M8 4.5 L16 4.5 L16 10 A4 4 0 0 1 8 10 Z" fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8 6 L5.2 6 A0.1 0.1 0 0 0 5.2 9.4 C5.8 10.6 6.9 11.2 8.2 11.4 M16 6 L18.8 6 A0.1 0.1 0 0 1 18.8 9.4 C18.2 10.6 17.1 11.2 15.8 11.4"
      fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 14 L12 16.6 M9.2 19 L14.8 19 M10 16.6 L14 16.6" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>;
}
