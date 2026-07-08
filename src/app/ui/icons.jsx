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
