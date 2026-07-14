// Gilded — the treasury's design language, bottled for reuse.
// A gradient gold frame, a soft radial glow from above, a passing gleam and
// four corner diamonds. Hofstaat, Profil & friends borrow the shimmer here.
import { useMemo } from "react";
import { T } from "./theme.js";

// The gleam passes rarely now — and never in chorus. Every mounted shine takes
// the next slot, so several on one screen glint one after another, not at once.
let shineSlot = 0;
export function useShineDelay(step = 2.2) {
  return useMemo(() => ((shineSlot++ % 5) * step + 0.4).toFixed(1) + "s", []);
}
export const SHINE_DUR = "11s";

export const goldText = {
  backgroundImage: "linear-gradient(168deg, #f8e6ab 8%, #d9b565 45%, #a17f3e 78%, #e9cf8a 100%)",
  WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
};

export function Diamond(pos) {
  return <span aria-hidden style={{ position: "absolute", width: 7, height: 7, transform: "rotate(45deg)",
    background: "linear-gradient(135deg, #f0d68a, #8a6d35)", boxShadow: "0 0 6px #d9b56588", ...pos }} />;
}

/** thin gold rule with a diamond in the middle — the treasury's divider */
export function GoldRule({ margin = "8px 12%" }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 8, margin }}>
    <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #8a6d35)" }} />
    <span style={{ width: 5, height: 5, background: "#d9b565", transform: "rotate(45deg)" }} />
    <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #8a6d35, transparent)" }} />
  </div>;
}

export function GildedFrame({ children, pad = "14px 16px", center = false, corners = false, style }) {
  const shineDelay = useShineDelay();
  return (
    <div style={{ position: "relative", borderRadius: T.radius, padding: 1.5,
      background: "linear-gradient(135deg, #6f5526, #f0d68a 28%, #8a6d35 52%, #e9cf8a 76%, #6f5526)",
      boxShadow: `${T.shadow}, 0 0 22px #d9b56518`, ...style }}>
      <div style={{ position: "relative", overflow: "hidden", borderRadius: T.radius - 2, padding: pad,
        textAlign: center ? "center" : "left",
        background: `radial-gradient(130% 100% at 50% 0%, #241e0e 0%, ${T.panel2} 46%, ${T.panel} 100%)` }}>
        <div aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "42%", pointerEvents: "none",
          background: "linear-gradient(90deg, transparent, rgba(255,240,190,.08), transparent)",
          animation: `ggShine ${SHINE_DUR} ease-in-out ${shineDelay} infinite` }} />
        {corners && <>
          <Diamond top={7} left={7} /><Diamond top={7} right={7} />
          <Diamond bottom={7} left={7} /><Diamond bottom={7} right={7} />
        </>}
        <div style={{ position: "relative" }}>{children}</div>
      </div>
    </div>
  );
}

/** The claim-button, bottled: gold gradient, glow, and a passing gleam.
 *  Reserve it for the ONE action a screen truly wants pressed. */
export function GoldShineButton({ children, onClick, disabled = false, style }) {
  const shineDelay = useShineDelay();
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ fontFamily: "inherit", fontWeight: 800, fontSize: 13, borderRadius: 999, padding: "9px 16px",
        border: "none", position: "relative", overflow: "hidden", whiteSpace: "nowrap",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
        background: disabled ? T.panel : "linear-gradient(160deg, #f0d68a, #d9b565 55%, #b08c44)",
        boxShadow: disabled ? "none" : `0 0 12px ${T.gold}66, inset 0 1px 0 #fff6d8aa`,
        outline: disabled ? `1.5px solid ${T.line}` : "none",
        color: disabled ? T.faint : "#17110a", cursor: disabled ? "default" : "pointer", ...style }}>
      {!disabled && <span aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "46%",
        pointerEvents: "none", background: "linear-gradient(90deg, transparent, rgba(255,252,235,.4), transparent)",
        animation: `ggShine ${SHINE_DUR} ease-in-out ${shineDelay} infinite` }} />}
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 5 }}>{children}</span>
    </button>
  );
}
