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

    // CRESCENT wisps: rare, large and slow. At most a couple drift at once,
    // born only in the lower corners; each rides a circular arc, so its
    // lingering trail paints a sickle curling inward.
    const wisps = [];
    let nextSpawn = 0;
    const spawnWisp = () => {
      const left = Math.random() < 0.5;
      const cx = left ? W * (0.02 + Math.random() * 0.16) : W * (0.82 + Math.random() * 0.16);
      const cy = H * (0.8 + Math.random() * 0.22);
      const r = 130 + Math.random() * Math.min(260, H * 0.32);   // arc radius — some sweep wide
      const a0 = left ? Math.PI * 0.28 : Math.PI * 0.72;         // start low, curl up & inward
      const da = (left ? -1 : 1) * (0.0016 + Math.random() * 0.0018); // SLOW
      return { cx, cy, r, a: a0, da, life: 0,
        maxLife: 1100 + Math.random() * 900,                      // ~20–35 s per crescent
        size: 42 + Math.random() * 58,                            // large, soft bodies
        grow: 0.05 + Math.random() * 0.07,                        // the arc breathes outward
        gold: Math.random() < 0.3, seed: Math.random() * 7 };
    };

    const step = () => {
      if (!running) return;
      t += 0.016;
      // the trail lingers long — that is what draws the sickle
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.018)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      const tint = tintRef.current;
      // rare births: only ever one or two (at most three) crescents share the night
      if (t > nextSpawn && wisps.length < 3) {
        wisps.push(spawnWisp());
        nextSpawn = t + 5 + Math.random() * 11;
      }
      for (let i = wisps.length - 1; i >= 0; i--) {
        const p = wisps[i];
        p.a += p.da * (0.8 + 0.2 * Math.sin(t * 0.4 + p.seed)); // uneven, breathing sweep
        p.r += p.grow;
        p.life += 1;
        const k = p.life / p.maxLife;
        if (k >= 1) { wisps.splice(i, 1); continue; }
        const x = p.cx + Math.cos(p.a) * p.r + Math.sin(t * 0.6 + p.seed) * 6;
        const y = p.cy + Math.sin(p.a) * p.r * -1 + Math.cos(t * 0.5 + p.seed) * 4;
        const alpha = (k < 0.18 ? k / 0.18 : k > 0.7 ? (1 - k) / 0.3 : 1) * (p.gold ? 0.05 : 0.075);
        const c = p.gold ? tint.a : tint.s;
        const size = p.size * (0.85 + 0.3 * Math.sin(p.life * 0.02 + p.seed));
        const g = ctx.createRadialGradient(x, y, 0, x, y, size);
        g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${alpha})`);
        g.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
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
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </div>
  );
}
