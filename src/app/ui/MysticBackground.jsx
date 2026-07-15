// (hooks no longer needed — the hall stands still)
import bgHall from "./assets/bg-hall.webp";

// ── The hall behind everything ────────────────────────────────────────────────
// A dark marble board fades out of pure black (the image is embedded, not
// stretched: a soft mask melts its edges into the night, so any screen size
// works). Above it drifts SMOKE — not puffy clouds but slow, wispy trails:
// particles ride a curved flow field and their paths linger and fade on a
// transparent canvas (destination-out), which paints exactly those long
// mystical streaks. The smoke is tinted by the LEAGUE you are climbing.

const LEAGUE_TINTS = [
  { s: [46, 58, 76],  a: [196, 150, 84] },   // I    night & gold
  { s: [56, 48, 70],  a: [172, 122, 188] },  // II   violet haze
  { s: [36, 62, 56],  a: [112, 190, 150] },  // III  fen green
  { s: [60, 44, 60],  a: [200, 112, 140] },  // IV   nightrose
  { s: [40, 56, 74],  a: [122, 170, 210] },  // V    steel
  { s: [66, 42, 42],  a: [210, 112, 90] },   // VI   ember
  { s: [36, 58, 64],  a: [112, 190, 200] },  // VII  petrol
  { s: [64, 54, 36],  a: [220, 172, 92] },   // VIII amber
  { s: [66, 58, 44],  a: [230, 192, 132] },  // IX   desert
  { s: [30, 40, 66],  a: [152, 182, 230] },  // X    deep sea silver
];
const tintFor = (league) => LEAGUE_TINTS[((Math.max(1, league || 1) - 1) % 10)];

export function MysticBackground({ league = 1 }) {
  // the ember/smoke canvas is retired — the hall stands still and clear

  const mask = "radial-gradient(ellipse 78% 72% at 50% 66%, #000 38%, rgba(0,0,0,.5) 64%, transparent 92%)";
  const mob = typeof innerWidth !== "undefined" && innerWidth < 640;
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", overflow: "hidden",
      background: "radial-gradient(120% 100% at 50% 30%, #070a12 0%, #04060a 72%)" }}>
      {/* phones: the hall grows and lifts above the bottom menu — the marble
          board in the picture stays in view instead of hiding behind the nav */}
      <img src={bgHall} alt="" draggable={false} style={{ position: "absolute", left: "50%", bottom: mob ? "7vh" : 0,
        transform: "translateX(-50%)", width: mob ? "142%" : "min(96%, 1080px)", maxWidth: mob ? "none" : undefined, userSelect: "none",
        WebkitMaskImage: mask, maskImage: mask, opacity: 0.9 }} />
      {/* the ceiling of night: melts the image's top edge whatever the viewport */}
      <div style={{ position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #04060a 0%, rgba(4,6,10,.6) 22%, transparent 46%)" }} />
    </div>
  );
}
