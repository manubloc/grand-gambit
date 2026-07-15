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

    const mk = (side, shadow = false) => {       // side: -1 left corner, +1 right
      const ex = side < 0 ? W * (0.08 + Math.random() * 0.17) : W * (0.75 + Math.random() * 0.17);
      return { side, ex, x: ex + (Math.random() - 0.5) * W * 0.05,
        y: H * (1.0 + Math.random() * 0.14),
        vy: shadow ? -(0.22 + Math.random() * 0.38)   // shadows crawl — long smears
                   : -(0.4 + Math.random() * 0.6),    // brisk rise — flame, not fog
        life: 0, maxLife: shadow ? 280 + Math.random() * 240 : 220 + Math.random() * 200,
        size: shadow ? (28 + Math.random() * 40) : (15 + Math.random() * 26),
        seed: Math.random() * 9,
        warm: !shadow && Math.random() < 0.42 };
    };
    const N = 72;                                 // tongues → dense overlap (leaner than before)
    const ps = [];
    for (let i = 0; i < N; i++) { const p = mk(i % 2 ? 1 : -1); p.life = Math.random() * p.maxLife; ps.push(p); }
    const NS = 22;                                // shadow-being smears woven INTO the smoke
    const ss = [];
    for (let i = 0; i < NS; i++) { const p = mk(i % 2 ? 1 : -1, true); p.life = Math.random() * p.maxLife; ss.push(p); }

    // ── the smoke comes in EPISODES, not as a constant curtain: a phase of
    // 9–17s swells in, dies away, then the hall stands clear for 10–32s.
    // Each episode has a MOOD: sometimes amber-gold, sometimes blue-dark.
    // env eases toward its target, so nothing ever pops on or off. ──
    let env = 0, envTarget = 1, envTm = 0, envAlive = true, emode = 1; // 1 gold, 0 dark
    const envLoop = (on) => {
      envTarget = on ? 1 : 0;
      if (on) emode = Math.random() < 0.45 ? 1 : 0;
      const dur = on ? 9000 + Math.random() * 8000 : 10000 + Math.random() * 22000;
      envTm = setTimeout(() => envAlive && envLoop(!on), dur);
    };
    envLoop(true);

    const step = () => {
      if (!running) return;
      t += 0.016;
      ctx.clearRect(0, 0, W, H);                 // NO lingering trails
      env += (envTarget - env) * 0.012;          // slow swell / slow decay (~3-4s)
      const dieY = H * (innerWidth < 640 ? 0.84 : 0.68); // smoke hugs the ground (phones even more)
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
        if (k >= 1 || p.y < dieY) { Object.assign(p, mk(p.side)); continue; }
        if (env < 0.015) continue;               // the hall stands clear between episodes
        const size = p.size * (1 - k * 0.62);    // shrinks into the deep
        const fadeIn = Math.min(1, k / 0.12);
        const fadeOut = k > 0.5 ? Math.max(0, 1 - (k - 0.5) / 0.5) : 1;
        const a = fadeIn * fadeOut * fadeOut * (p.warm ? 0.055 : 0.045) * env * (emode ? 1 : 0.55);
        if (a <= 0.004) continue;
        // warm at the root, smoke-cool as it climbs away
        const cw = (p.warm || emode) ? tint.a : tint.s, cs = tint.s; // gold mood leans amber
        const r = cw[0] + (cs[0] - cw[0]) * k, g2 = cw[1] + (cs[1] - cw[1]) * k, b = cw[2] + (cs[2] - cw[2]) * k;
        ctx.fillStyle = `rgba(${r | 0},${g2 | 0},${b | 0},${a})`;
        ctx.beginPath();
        // stretched, slowly tilting ellipse: a streak, not a bubble
        ctx.ellipse(p.x, p.y, Math.max(2, size * 0.42), Math.max(3, size * 1.9),
          Math.sin(t * 0.7 + p.seed) * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
      // ── the shadow-being: blue-black smears drawn OVER the glow ──
      // "lighter" can never darken, so this second pass paints with normal
      // compositing — stretched, slowly tilting ellipses that drag dark
      // streaks through the bright smoke, like something moving inside it.
      ctx.globalCompositeOperation = "source-over";
      for (const p of ss) {
        const k = p.life / p.maxLife;
        p.x += Math.sin(t * 0.9 + p.seed * 7 + p.y * 0.015) * 0.5 + (p.ex - p.x) * 0.003;
        p.y += p.vy * (1 - k * 0.55);
        p.life += 1;
        if (k >= 1 || p.y < dieY) { Object.assign(p, mk(p.side, true)); continue; }
        if (env < 0.015) continue;
        const size = p.size * (1 - k * 0.5);
        const fadeIn = Math.min(1, k / 0.16);
        const fadeOut = k > 0.5 ? Math.max(0, 1 - (k - 0.5) / 0.5) : 1;
        const a = fadeIn * fadeOut * fadeOut * 0.10 * env * (emode ? 0.85 : 1.35);
        if (a <= 0.004) continue;
        // blue-black of the shadow being: a hint of night-blue at the root,
        // swallowing into near-black as it climbs
        const r = 14 + (6 - 14) * k, g2 = 18 + (8 - 18) * k, b = 34 + (16 - 34) * k;
        ctx.fillStyle = `rgba(${r | 0},${g2 | 0},${b | 0},${a})`;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, Math.max(2, size * 0.6), Math.max(3, size * 1.45),
          Math.sin(t * 0.6 + p.seed) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const vis = () => { running = !document.hidden; if (running) raf = requestAnimationFrame(step); };
    document.addEventListener("visibilitychange", vis);
    return () => { running = false; envAlive = false; clearTimeout(envTm); cancelAnimationFrame(raf); removeEventListener("resize", fit); document.removeEventListener("visibilitychange", vis); };
  }, []);

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
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "blur(16px) saturate(1.15)" }} />
    </div>
  );
}
