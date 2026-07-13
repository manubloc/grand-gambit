import { T } from "./theme.js";

export function Button({ variant = "primary", disabled, style, children, ...p }) {
  const base = { border: "none", borderRadius: T.radiusSm, padding: "12px 16px", fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.45 : 1, transition: "filter .15s", WebkitTapHighlightColor: "transparent" };
  const variants = {
    // the court's seal: brushed gold with an ivory hairline — one CTA style everywhere
    primary: { background: "linear-gradient(165deg, #e0b76c, #b78d43)", color: T.limeInk,
      border: "1px solid rgba(255,240,200,.5)", boxShadow: "0 2px 12px rgba(201,164,92,.22)" },
    ghost: { background: "transparent", color: T.text, border: `1px solid ${T.line}` },
    danger: { background: "transparent", color: T.danger, border: `1px solid ${T.danger}55` },
    subtle: { background: T.panel2, color: T.text, border: `1px solid ${T.line}` },
  };
  return <button disabled={disabled} style={{ ...base, ...variants[variant], ...style }} {...p}>{children}</button>;
}

export function Panel({ style, children, ...p }) {
  return <div style={{ background: `linear-gradient(172deg, ${T.panel2}, ${T.panel})`, border: `1px solid ${T.line}`, borderRadius: T.radius, padding: 16, ...style }} {...p}>{children}</div>;
}

/** The one panel headline: serif, gold, led by the brand diamond — so every
 *  screen speaks in the campaign's voice instead of bold sans shouting. */
export function PanelTitle({ children, tag, style }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 7, ...style }}>
    <span aria-hidden style={{ width: 5, height: 5, background: T.gold, transform: "rotate(45deg)", flex: "0 0 auto" }} />
    <span className="gg-serif" style={{ fontSize: 15.5, letterSpacing: ".07em", color: T.goldBright }}>{children}</span>
    {tag && <span style={{ color: T.gold, fontSize: 11, fontWeight: 800 }}>· {tag}</span>}
  </div>;
}

/** The one field caption: a quiet serif eyebrow — used above every picker
 *  (map, mode, opponent, difficulty) across the whole app. */
export function FieldLabel({ children, style }) {
  return <div className="gg-serif" style={{ fontSize: 11.5, letterSpacing: ".14em", color: T.dim,
    textTransform: "uppercase", margin: "0 2px 6px", ...style }}>{children}</div>;
}

/** The one map chip: a rectangular card with the board swatch — same shape,
 *  same gold, in quick play and in the court's formation editor. */
export function MapChip({ on, locked, theme, label, onClick, title }) {
  return <button onClick={onClick} title={title}
    style={{ cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 12.5, borderRadius: 10,
      padding: "8px 11px", whiteSpace: "nowrap", flex: "0 0 auto", display: "inline-flex", alignItems: "center", gap: 8,
      border: on ? "1px solid rgba(255,240,200,.5)" : `1px solid ${T.line}`,
      background: on ? "linear-gradient(165deg, #e0b76c, #b78d43)" : T.panel2,
      color: on ? T.limeInk : locked ? T.faint : T.text, opacity: locked ? 0.55 : 1 }}>
    <span aria-hidden style={{ display: "inline-grid", gridTemplateColumns: "repeat(4, 4.5px)", borderRadius: 3,
      overflow: "hidden", flex: "0 0 auto", border: `1px solid ${on ? "#00000033" : T.line}` }}>
      {Array.from({ length: 16 }).map((_, k) => (
        <span key={k} style={{ width: 4.5, height: 4.5,
          background: ((k + Math.floor(k / 4)) % 2 === 0) ? theme.sqLight : theme.sqDark }} />
      ))}
    </span>
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>{label}</span>
  </button>;
}

export function Bar({ pct = 0, color = T.lime, height = 8, track = "#0009" }) {
  const w = Math.max(0, Math.min(1, pct)) * 100;
  return <div style={{ background: track, borderRadius: 99, height, overflow: "hidden" }}>
    <div style={{ width: w + "%", height: "100%", background: color, borderRadius: 99, transition: "width .45s ease" }} />
  </div>;
}

export function Chip({ children, color = T.dim, bg = T.panel2, style }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: bg, color, borderRadius: 99, padding: "3px 9px", fontSize: 12, fontWeight: 700, ...style }}>{children}</span>;
}

export function Segmented({ options, value, onChange }) {
  return <div style={{ display: "flex", gap: 4, background: T.bg2, padding: 4, borderRadius: T.radiusSm, border: `1px solid ${T.line}` }}>
    {options.map((o) => {
      const on = value === o.value;
      return <button key={o.value} disabled={o.disabled} onClick={() => !o.disabled && onChange(o.value)} style={{ flex: 1,
        border: on ? "1px solid rgba(255,240,200,.5)" : "1px solid transparent", borderRadius: 8, padding: "9px 6px",
        fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: o.disabled ? "default" : "pointer",
        opacity: o.disabled ? 0.45 : 1, position: "relative", overflow: "hidden",
        background: on ? "linear-gradient(160deg, #f0d68a, #d9b565 55%, #b08c44)" : "transparent",
        boxShadow: on ? `0 0 12px ${T.gold}55, inset 0 1px 0 #fff6d8aa` : "none",
        color: on ? "#17110a" : T.dim }}>
        <span style={{ position: "relative" }}>{o.label}</span>
      </button>;
    })}
  </div>;
}

export function Shields({ n, size = 7 }) {
  if (!n) return null;
  return <span style={{ display: "inline-flex", gap: 2, alignItems: "center" }}>
    {Array.from({ length: n }).map((_, i) => <span key={i} style={{ width: size, height: size, borderRadius: "50%", background: T.blue, boxShadow: `0 0 4px ${T.blue}` }} />)}
  </span>;
}

export function Stat({ label, value, color = T.text }) {
  return <div style={{ textAlign: "center" }}>
    <div className="gg-serif" style={{ fontSize: 22, fontWeight: 700, letterSpacing: ".02em", color }}>{value}</div>
    <div style={{ fontSize: 11, color: T.faint, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
  </div>;
}
