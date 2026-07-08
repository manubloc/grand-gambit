import { T } from "./theme.js";

export function Button({ variant = "primary", disabled, style, children, ...p }) {
  const base = { border: "none", borderRadius: T.radiusSm, padding: "12px 16px", fontSize: 15, fontWeight: 700, fontFamily: "inherit", cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.45 : 1, transition: "filter .15s", WebkitTapHighlightColor: "transparent" };
  const variants = {
    primary: { background: T.lime, color: T.limeInk },
    ghost: { background: "transparent", color: T.text, border: `1px solid ${T.line}` },
    danger: { background: "transparent", color: T.danger, border: `1px solid ${T.danger}55` },
    subtle: { background: T.panel2, color: T.text },
  };
  return <button disabled={disabled} style={{ ...base, ...variants[variant], ...style }} {...p}>{children}</button>;
}

export function Panel({ style, children, ...p }) {
  return <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: T.radius, padding: 16, ...style }} {...p}>{children}</div>;
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
      return <button key={o.value} disabled={o.disabled} onClick={() => !o.disabled && onChange(o.value)} style={{ flex: 1, border: "none", borderRadius: 8, padding: "9px 6px", fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: o.disabled ? "default" : "pointer", opacity: o.disabled ? 0.45 : 1, background: on ? T.lime : "transparent", color: on ? T.limeInk : T.dim }}>{o.label}</button>;
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
    <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
    <div style={{ fontSize: 11, color: T.faint, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
  </div>;
}
