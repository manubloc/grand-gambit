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
    if (!ctx || typeof innerWidth === "undefined") return; // headless / test envs: the hall stands still
    let W = 0, H = 0, raf = 0, running = true, t = 0;
    const fit = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; }; // 1x — fog needs no retina
    fit();
    addEventListener("resize", fit);

    // wisps: born low and at the flanks, they climb along a bending field
    const N = Math.min(80, Math.round((innerWidth * innerHeight) / 26000));
    const ps = [];
    const spawn = () => {
      const flank = Math.random();
      const x = flank < 0.42 ? Math.random() * W * 0.3
        : flank < 0.84 ? W - Math.random() * W * 0.3
        : W * 0.3 + Math.random() * W * 0.4;                 // a few rise from the center
      return { x, y: H * 0.72 + Math.random() * H * 0.36, vx: 0, vy: 0,
        life: 0, maxLife: 380 + Math.random() * 300, seed: Math.random() * 7,
        size: 14 + Math.random() * 26, gold: Math.random() < 0.24 };
    };
    for (let i = 0; i < N; i++) { const p = spawn(); p.life = Math.random() * p.maxLife; ps.push(p); }

    const step = () => {
      if (!running) return;
      t += 0.016;
      // fading memory: yesterday's smoke thins, the trails stay a while
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.03)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      const tint = tintRef.current;
      for (const p of ps) {
        // the flow field: two slow waves bend every path into a ribbon
        const ang = Math.sin(p.x * 0.004 + t * 0.3 + p.seed) * 1.7
                  + Math.cos(p.y * 0.005 - t * 0.22 + p.seed * 0.6) * 1.4;
        p.vx = (p.vx + Math.cos(ang) * 0.042) * 0.985;
        p.vy = (p.vy + Math.sin(ang) * 0.03 - 0.016) * 0.985;
        p.x += p.vx; p.y += p.vy; p.life += 1;
        const k = p.life / p.maxLife;
        const alpha = (k < 0.2 ? k / 0.2 : k > 0.75 ? (1 - k) / 0.25 : 1)
          * (p.gold ? 0.05 : 0.085);
        if (k >= 1 || p.y < -60 || p.x < -80 || p.x > W + 80) { Object.assign(p, spawn()); continue; }
        const c = p.gold ? tint.a : tint.s;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${alpha})`);
        g.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const vis = () => { running = !document.hidden; if (running) raf = requestAnimationFrame(step); };
    document.addEventListener("visibilitychange", vis);
    return () => { running = false; cancelAnimationFrame(raf); removeEventListener("resize", fit); document.removeEventListener("visibilitychange", vis); };
  }, []);

  const mask = "radial-gradient(ellipse 92% 78% at 50% 64%, #000 42%, rgba(0,0,0,.55) 68%, transparent 96%)";
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", overflow: "hidden",
      background: "radial-gradient(120% 100% at 50% 30%, #070a12 0%, #04060a 72%)" }}>
      <img src={bgHall} alt="" draggable={false} style={{ position: "absolute", left: "50%", bottom: 0,
        transform: "translateX(-50%)", width: "max(100%, 1400px)", minHeight: "62%", objectFit: "cover",
        objectPosition: "center bottom", userSelect: "none",
        WebkitMaskImage: mask, maskImage: mask, opacity: 0.92 }} />
      {/* the ceiling of night: melts the image's top edge whatever the viewport */}
      <div style={{ position: "absolute", inset: 0,
        background: "linear-gradient(180deg, #04060a 0%, rgba(4,6,10,.6) 22%, transparent 46%)" }} />
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </div>
  );
}
