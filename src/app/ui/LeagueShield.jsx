// The league shield: one painted blank escutcheon, the roman numeral set in
// code — razor sharp at any size, dead-center in the navy roundel (measured
// at 48.3% / 44.7% of the artwork, verified with a crosshair overlay), and consistent from league I to X.
import { T } from "./theme.js";
import shieldUrl from "./assets/shield-league.webp";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const AR = 258 / 420; // artwork width/height

export function LeagueShield({ league = 1, size = 58, dim = false, style }) {
  const txt = ROMAN[league - 1] || String(league);
  const fs = size * (txt.length <= 1 ? 0.3 : txt.length === 2 ? 0.25 : txt.length === 3 ? 0.2 : 0.155);
  return (
    <span aria-hidden style={{ position: "relative", display: "inline-block", width: size * AR, height: size,
      flex: "0 0 auto", filter: dim ? "grayscale(1) brightness(1.35)" : "drop-shadow(0 3px 6px rgba(0,0,0,.45))",
      opacity: dim ? 0.55 : 1, ...style }}>
      <img src={shieldUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
      <span className="gg-serif" style={{ position: "absolute", left: "48.3%", top: "44.7%",
        transform: "translate(-50%, -50%)", fontSize: fs, fontWeight: 700, letterSpacing: txt.length > 2 ? 0 : ".04em",
        color: "#e8c97e", textShadow: "0 1px 2px rgba(0,0,0,.85), 0 0 7px rgba(201,164,92,.3)", lineHeight: 1 }}>
        {txt}
      </span>
    </span>
  );
}
