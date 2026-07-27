// (hooks no longer needed — the hall stands still)
import { bgHall } from "./livery.js";

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
  { s: [44, 54, 42],  a: [150, 176, 118] },  // IV   treeline green
  { s: [60, 44, 60],  a: [200, 112, 140] },  // V    nightrose
  { s: [40, 56, 74],  a: [122, 170, 210] },  // VI   steel
  { s: [64, 54, 36],  a: [220, 172, 92] },   // VII  Sattelweite: amber
  { s: [66, 42, 42],  a: [210, 112, 90] },   // VIII Aschgrund: ember
  { s: [36, 58, 64],  a: [112, 190, 200] },  // IX   Die Wunde: petrol
  { s: [66, 58, 44],  a: [230, 192, 132] },  // X    desert
  { s: [38, 52, 50],  a: [150, 200, 184] },  // XI   Die Kueste: Gischt
  { s: [30, 40, 66],  a: [152, 182, 230] },  // XII  Endloses Meer: deep sea silver
];
const tintFor = (league) => LEAGUE_TINTS[((Math.max(1, league || 1) - 1) % 12)];
/** Der Hauch ueber dem Schwarz: die Kapitelfarbe auf ein Zehntel gedaempft und
 *  in Richtung des Riss-Violetts gezogen. So bleibt jedes Kapitel erkennbar,
 *  ohne dass der Grund je aufhellt. */
const hauchFuer = (league) => {
  const t = tintFor(league)?.s || [30, 20, 50];
  const r = Math.round(t[0] * 0.34 + 22), g = Math.round(t[1] * 0.24 + 8), b = Math.round(t[2] * 0.4 + 34);
  return `rgba(${r}, ${g}, ${b}, .55)`;
};

/** DER SAUM DES RISSES: ein violettes Leuchten laeuft aussen um den Schirm.
 *  Es muss OBEN liegen, nicht im Hintergrund - dort verdecken es die Flaechen
 *  der Oberflaeche, gemessen kam am aeussersten Rand exakt nichts an. Als
 *  eigene Schicht mit hohem zIndex und ohne Mausannahme stoert es nichts und
 *  ist ueberall sichtbar. Es atmet langsam, damit der Rand lebt statt blinkt. */
export function RiftSeam() {
  return <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 60, pointerEvents: "none",
    boxShadow: "inset 0 0 70px 6px rgba(124,58,237,.34), inset 0 0 26px 0 rgba(167,139,250,.2)",
    animation: "ggSaum 7s ease-in-out infinite" }}>
    <div style={{ position: "absolute", inset: 0,
      background: "linear-gradient(90deg, rgba(139,92,246,.22) 0%, transparent 11%, transparent 89%, rgba(139,92,246,.22) 100%)" }} />
  </div>;
}

export function MysticBackground({ league = 1 }) {
  // the ember/smoke canvas is retired — the hall stands still and clear

  const mask = "radial-gradient(ellipse 78% 72% at 50% 66%, #000 38%, rgba(0,0,0,.5) 64%, transparent 92%)";
  const mob = typeof innerWidth !== "undefined" && innerWidth < 640;
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", overflow: "hidden",
      // SCHWARZ, restlos. Aus der Tiefe steigt nur ein Hauch des Risses -
      // dasselbe Violett wie im Wappen, so schwach, dass es als Ahnung wirkt
      // und nicht als Farbe.
      background: `radial-gradient(120% 90% at 50% 26%, ${hauchFuer(league)} 0%, #000 62%), #000` }}>
      {/* phones: the hall grows and lifts above the bottom menu — the marble
          board in the picture stays in view instead of hiding behind the nav.
          CENTRING WITHOUT transform: the app root carries a CSS `zoom`, and a
          translateX(-50%) on this layer is swallowed by it — the picture then
          hangs off to the right. A negative margin of half its own width does
          the same job and survives the zoom at any viewport width (even when
          the image is wider than the screen, where auto margins would fail). */}
      {(() => {
        const W = mob ? "142%" : "min(96%, 1080px)";
        return <img src={bgHall()} alt="" draggable={false} style={{ position: "absolute", left: "50%", bottom: mob ? "7vh" : 0,
          width: W, marginLeft: `calc(${W} / -2)`, maxWidth: mob ? "none" : undefined, userSelect: "none",
          WebkitMaskImage: mask, maskImage: mask, opacity: 0.62,
          // die Halle zieht ins Licht des Risses, statt blau zu bleiben
          filter: "hue-rotate(-28deg) saturate(.72) brightness(.86)" }} />;
      })()}
      {/* the ceiling of night: melts the image's top edge whatever the viewport */}
      <div style={{ position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #000 0%, rgba(0,0,0,.62) 22%, transparent 46%)" }} />
    </div>
  );
}
