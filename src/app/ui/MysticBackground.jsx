import { useEffect, useRef } from "react";
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
  const canvasRef = useRef(null);
  const tintRef = useRef(tintFor(league));
  useEffect(() => { tintRef.current = tintFor(league); }, [league]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // the hall stands still; no smoke
    const ctx = cv.getContext && cv.getContext("2d");
    if (!ctx || typeof innerWidth === "undefined") return; // headless / test envs

    // Rendered at HALF resolution and blurred by the GPU (CSS filter on the
    // canvas): soft as fog, never pixelated, and cheap enough for plain
    // circles instead of gradients. No trail buffer — every frame is cleared,
    // so nothing lingers. The flame look comes from OVERLAP: dozens of small
    // tongues rise from each lower corner, flicker sideways, shrink and dim
    // as they climb — as if vanishing into the depth of the hall.
    const S = 0.5;
    let W = 0, H = 0, raf = 0, running = true, t = 0;
    const fit = () => { W = cv.width = Math.round(innerWidth * S); H = cv.height = Math.round(innerHeight * S); };
    fit();
    addEventListener("resize", fit);

    const mk = (side) => {                       // side: -1 left corner, +1 right
      const ex = side < 0 ? W * (0.06 + Math.random() * 0.26) : W * (0.68 + Math.random() * 0.26);
      return { side, ex, x: ex + (Math.random() - 0.5) * W * 0.05,
        y: H * (1.0 + Math.random() * 0.14),
        vy: -(0.4 + Math.random() * 0.6),      // brisk rise — flame, not fog
        life: 0, maxLife: 220 + Math.random() * 200,
        size: (26 + Math.random() * 44), seed: Math.random() * 9,
        warm: Math.random() < 0.42 };
    };
    const N = 96;                                 // many tongues → dense overlap
    const ps = [];
    for (let i = 0; i < N; i++) { const p = mk(i % 2 ? 1 : -1); p.life = Math.random() * p.maxLife; ps.push(p); }

    const step = () => {
      if (!running) return;
      t += 0.016;
      ctx.clearRect(0, 0, W, H);                 // NO lingering trails
      ctx.globalCompositeOperation = "lighter";
      const tint = tintRef.current;
      for (const p of ps) {
        const k = p.life / p.maxLife;
        // flicker like a tongue of flame; a soft homing pull keeps every wisp
        // near its corner — the middle of the screen stays untouched
        p.x += Math.sin(t * 1.5 + p.seed * 7 + p.y * 0.02) * 0.55 + (p.ex - p.x) * 0.004;
        p.y += p.vy * (1 - k * 0.55);            // slows with height → reads as distance
        p.x += (W * 0.5 - p.x) * 0.0007 * k;     // a whisper of vanishing-point pull (depth)
        p.life += 1;
        if (k >= 1 || p.y < H * (innerWidth < 640 ? 0.68 : 0.55)) { Object.assign(p, mk(p.side)); continue; } // phones: die lower — flatter smoke
        const size = p.size * (1 - k * 0.62);    // shrinks into the deep
        const fadeIn = Math.min(1, k / 0.12);
        const fadeOut = k > 0.5 ? Math.max(0, 1 - (k - 0.5) / 0.5) : 1;
        const a = fadeIn * fadeOut * fadeOut * (p.warm ? 0.07 : 0.06);
        if (a <= 0.004) continue;
        // warm at the root, smoke-cool as it climbs away
        const cw = p.warm ? tint.a : tint.s, cs = tint.s;
        const r = cw[0] + (cs[0] - cw[0]) * k, g2 = cw[1] + (cs[1] - cw[1]) * k, b = cw[2] + (cs[2] - cw[2]) * k;
        ctx.fillStyle = `rgba(${r | 0},${g2 | 0},${b | 0},${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(2, size), 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const vis = () => { running = !document.hidden; if (running) raf = requestAnimationFrame(step); };
    document.addEventListener("visibilitychange", vis);
    return () => { running = false; cancelAnimationFrame(raf); removeEventListener("resize", fit); document.removeEventListener("visibilitychange", vis); };
  }, []);

  const mask = "radial-gradient(ellipse 78% 72% at 50% 66%, #000 38%, rgba(0,0,0,.5) 64%, transparent 92%)";
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", overflow: "hidden",
      background: "radial-gradient(120% 100% at 50% 30%, #070a12 0%, #04060a 72%)" }}>
      <img src={bgHall} alt="" draggable={false} style={{ position: "absolute", left: "50%", bottom: 0,
        transform: "translateX(-50%)", width: "min(96%, 1080px)", userSelect: "none",
        WebkitMaskImage: mask, maskImage: mask, opacity: 0.9 }} />
      {/* the ceiling of night: melts the image's top edge whatever the viewport */}
      <div style={{ position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #04060a 0%, rgba(4,6,10,.6) 22%, transparent 46%)" }} />
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "blur(16px) saturate(1.15)" }} />
    </div>
  );
}
