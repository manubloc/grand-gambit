import { useMemo, useState, useEffect, useRef } from "react";
import { T } from "../theme.js";
import { FILES, RANKS, idx, legalMovesFrom, inCheck, findKing } from "../../../core/index.js";
import { PieceGlyph } from "./PieceGlyph.jsx";

const MOVE_DOT = "#c9a45c";

// Modern game-style HP: one segment per hit point (readable at a glance),
// falling back to a continuous bar when segments would get too tiny.


// hex -> rgba: with a texture underlay the squares go slightly translucent so
// the material (fine scratches, grain) whispers through — a breath, not a print.
const hexA = (hex, a, lift = 0) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.round(v + (255 - v) * lift);   // gently lift toward ivory
  return `rgba(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)},${a})`;
};

import mL0 from "../assets/marble-l0.webp"; import mL1 from "../assets/marble-l1.webp"; import mL2 from "../assets/marble-l2.webp";
import mL3 from "../assets/marble-l3.webp"; import mL4 from "../assets/marble-l4.webp"; import mL5 from "../assets/marble-l5.webp";
import mD0 from "../assets/marble-d0.webp"; import mD1 from "../assets/marble-d1.webp"; import mD2 from "../assets/marble-d2.webp";
import mD3 from "../assets/marble-d3.webp"; import mD4 from "../assets/marble-d4.webp"; import mD5 from "../assets/marble-d5.webp";
import mG0 from "../assets/marble-g0.webp"; import mG1 from "../assets/marble-g1.webp"; import mG2 from "../assets/marble-g2.webp";
import mG3 from "../assets/marble-g3.webp"; import mG4 from "../assets/marble-g4.webp"; import mG5 from "../assets/marble-g5.webp";
// ── dark marble & gold: every square is a real slab cut from the reference
// image; a deterministic hash deals the variants so no two boards feel cloned,
// yet the same match always shows the same stone. ──
const MARBLE_L = [mL0, mL1, mL2, mL3, mL4, mL5];
const MARBLE_D = [mD0, mD1, mD2, mD3, mD4, mD5];
const MARBLE_G = [mG0, mG1, mG2, mG3, mG4, mG5];   // vein glow, same crops as MARBLE_D
const slabIx = (i) => ((i * 2654435761) >>> 8) % 6;
const slab = (i, dark) => (dark ? MARBLE_D : MARBLE_L)[slabIx(i)];
const REDUCED = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── preload: every slab is fetched once BEFORE the board shows itself — tiles
// popping in one by one looked cheap. A small gold rune breathes while the
// stone is carried in, then the finished board fades up in one piece. ──
const BOARD_ART = [...MARBLE_L, ...MARBLE_D, ...MARBLE_G];
let artDone = false, artPromise = null;
export function preloadBoardArt() {
  if (artPromise) return artPromise;
  if (typeof Image === "undefined") { artDone = true; return (artPromise = Promise.resolve()); }
  artPromise = Promise.race([
    Promise.all(BOARD_ART.map((src) => new Promise((res) => {
      const im = new Image();
      im.onload = im.onerror = () => res();
      im.src = src;
    }))),
    new Promise((res) => setTimeout(res, 2500)), // never gate the game on a slow cache
  ]).then(() => { artDone = true; });
  return artPromise;
}
if (typeof window !== "undefined") preloadBoardArt(); // warm the stone while the menus are still open

export function BoardView({ state, onMove, interactive, lastMove, theme = null, maxPx = 520, animateFor = null, flip = false, fitBox = false, pick = null, onPick = null, pov = "w", texture = null, artStyle = "painted", showLevel = true, pulse = 0.4, friendly = false, knownKinds = null, seerVision = false, onEnemyTap = null, introSpot = null }) {
  const sqL0 = theme?.sqLight || T.sqLight, sqD0 = theme?.sqDark || T.sqDark;
  const sqL = texture ? hexA(sqL0, 0.82, 0.34) : sqL0;
  const sqD = texture ? hexA(sqD0, 0.84, 0.07) : sqD0;
  const [sel, setSel] = useState(null);
  const [spy, setSpy] = useState(null);        // seer's gaze: an ENEMY square under inspection
  useEffect(() => { setSel(null); setSpy(null); }, [state]); // clear selection whenever the position changes
  // WHO may be studied? Standard chessmen always (everyone knows how a rook
  // moves). Exotic foes only once you have MET them before (the codex,
  // knownKinds) — unless a seer with her first gift stands in your ranks
  // (seerVision), which reads even strangers.
  const STD_KINDS = new Set(["P", "N", "B", "R", "Q", "K"]);
  const codexKey = (p) => (p.bossId ? "X:" + p.bossId : p.kind);
  const spyAllowed = (p) => state.rules !== "hp" || STD_KINDS.has(p.kind) || seerVision || !!(knownKinds && knownKinds.has(codexKey(p)));

  // ── the board breathes as ONE: every now and then a golden wave rolls
  // across the dark slabs (never per-tile flicker). The interval is a skewed
  // draw from 2–60s — the stronger the foe (pulse 0..1), the more the draw
  // leans toward the short end; an endboss makes the stone restless. ──
  const [wave, setWave] = useState(null);
  useEffect(() => {
    if (REDUCED) return;
    let alive = true, tm = 0, off = 0;
    const loop = () => {
      const skew = 1 + pulse * 2.6;                       // 1 (uniform) … 3.6 (leans short)
      const iv = (2 + 58 * Math.pow(Math.random(), skew)) * 1000;
      tm = setTimeout(() => {
        if (!alive) return;
        const ang = Math.random() * Math.PI * 2;
        setWave({ id: Date.now(), dx: Math.cos(ang), dy: Math.sin(ang) });
        off = setTimeout(() => alive && setWave(null), 5200); // wave passed — drop the layers
        loop();
      }, iv);
    };
    loop();
    return () => { alive = false; clearTimeout(tm); clearTimeout(off); };
  }, [pulse]); // eslint-disable-line

  // all slabs loaded? until then every square shows its flat colour — the
  // marble layer fades in per square once the preload finishes
  const [artReady, setArtReady] = useState(artDone);
  useEffect(() => {
    if (artReady) return;
    let on = true;
    preloadBoardArt().then(() => { if (on) setArtReady(true); });
    return () => { on = false; };
  }, []); // eslint-disable-line

  // Integer-pixel sizing: fr-tracks round to different pixel widths per column
  // (tiles visibly unequal on some screens), so we measure the available box
  // and hand the grid EXACT pixel cells — every square identical, every time.
  const wrapRef = useRef(null);
  const [avail, setAvail] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => { const w = el.clientWidth, h = el.clientHeight; if (w > 0) setAvail({ w, h }); };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    window.addEventListener("resize", measure);
    return () => { ro?.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  // Enemy-move animation: a ghost of the moved piece glides from → to, with a
  // fading gold arrow underneath, so the opponent's move is unmissable.
  const [anim, setAnim] = useState(null);
  useEffect(() => {
    if (!lastMove || !animateFor || lastMove.color !== animateFor) { setAnim(null); return; }
    const piece = state.board[lastMove.to];
    if (!piece) { setAnim(null); return; }
    const a = { from: lastMove.from, to: lastMove.to, piece, phase: 0, id: Date.now() };
    setAnim(a);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() =>
      setAnim((cur) => (cur && cur.id === a.id ? { ...cur, phase: 1 } : cur))));
    const t = setTimeout(() => setAnim((cur) => (cur && cur.id === a.id ? null : cur)), 950);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [lastMove, animateFor]); // eslint-disable-line

  const W = state.w ?? FILES, H = state.h ?? RANKS;
  const holes = state.holes; // Set of blocked indices (or undefined)
  const hpMode = state.rules === "hp";

  const targets = useMemo(() => {
    const m = new Map();
    if (sel != null) for (const mv of legalMovesFrom(state, sel)) m.set(mv.to, mv);
    return m;
  }, [sel, state]);
  const spyTargets = useMemo(() => {
    const m = new Set();
    if (spy != null && state.board[spy]) {
      try { for (const mv of legalMovesFrom({ ...state, turn: state.board[spy].color }, spy)) m.add(mv.to); } catch {}
    }
    return m;
  }, [spy, state]);

  const checkSq = useMemo(() => {
    const k = findKing(state.board, state.turn, W);
    return k && inCheck(state, state.turn) ? k.i : -1;
  }, [state]);

  function tap(i) {
    if (!interactive) return;
    const w0 = state.board[i];
    if (w0 && w0.kind === "D+") i = w0.ref;        // a wing tap is a dragon tap
    if (pick && onPick) { const pc = state.board[i]; if (pc && pc.color === pick) onPick(i); return; }
    if (sel != null && targets.has(i)) { onMove(targets.get(i)); setSel(null); return; }
    const piece = state.board[i];
    if (piece && piece.color === state.turn) { setSel(i === sel ? null : i); setSpy(null); }
    else if (piece) {
      if (onEnemyTap) onEnemyTap(i, spyAllowed(piece));      // the hall notices your curiosity (first-meet tales)
      if (spyAllowed(piece)) setSpy(i === spy ? null : i);   // known or seen-through: study its moves
      else setSpy(null);                                     // a stranger keeps its secrets — this time
      setSel(null);
    }
    else { setSel(null); setSpy(null); }
  }

  const cells = [];
  for (let rr = 0; rr < H; rr++) {
    const r = flip ? rr : H - 1 - rr;
    for (let ff = 0; ff < W; ff++) {
      const f = flip ? W - 1 - ff : ff;
      const i = idx(f, r, W);
      if (holes && holes.has(i)) { // carved-out void: not part of the play area
        cells.push(<div key={i} style={{ background: "#07090d", boxShadow: "inset 0 1px 6px rgba(0,0,0,.8)" }} />);
        continue;
      }
      let piece = state.board[i];
      const isWing = piece && piece.kind === "D+";
      const isBigAnchor = piece && piece.big && piece.kind === "D";
      if (isWing || isBigAnchor) piece = null;     // drawn by the 2x2 overlay instead
      const dark = (f + r) % 2 === 1;
      const tgt = targets.get(i);
      const isSel = sel === i;
      const isSpy = spy === i;
      const spyT = spyTargets.has(i);
      const isLast = lastMove && (lastMove.from === i || lastMove.to === i);
      const isHit = hpMode && lastMove && lastMove.to === i && (lastMove.damaged || lastMove.lethal);
      // Tiny coordinates on the rim squares (a–j / 1–10), chess-board style:
      // file letters along the bottom edge, rank numbers along the left edge.
      const coordCol = dark ? sqL : sqD;
      const fileLbl = rr === H - 1 ? "abcdefghij"[f] : null;
      const rankLbl = ff === 0 ? String(r + 1) : null;
      cells.push(
        <div key={i} onClick={() => tap(i)} style={{ position: "relative",
          // the flat colour + a soft diagonal light stand INSTANTLY — no loading
          // state at all; the marble whisper fades in per square once every slab
          // is preloaded, so nothing ever pops
          background: `${dark ? sqD : sqL}`,
          display: "grid", placeItems: "center", cursor: interactive ? "pointer" : "default" }}>
          <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
            background: `linear-gradient(${hexA(dark ? sqD0 : sqL0, dark ? 0.8 : 0.78, friendly ? 0.26 : 0.12)}, ${hexA(dark ? sqD0 : sqL0, dark ? 0.8 : 0.78, friendly ? 0.26 : 0.12)}), url(${slab(i, dark)}) center / cover`,
            opacity: artReady ? (friendly ? 0.4 : 1) : 0, transition: "opacity .6s ease" }} />
          <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
            boxShadow: "inset 2px 2px 0 rgba(255,246,220,.12), inset 6px 6px 7px -5px rgba(255,250,230,.28), inset -2px -2px 0 rgba(0,0,0,.32)" }} />
          <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
            boxShadow: "inset 1.5px 1.5px 0 rgba(255,238,200,.14), inset -2px -2px 3px rgba(0,0,0,.42)" }} />

          {fileLbl && <span style={{ position: "absolute", right: "5%", bottom: "1%", fontSize: "0.22em", fontWeight: 800,
            color: coordCol, opacity: 0.85, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>{fileLbl}</span>}
          {rankLbl && <span style={{ position: "absolute", left: "5%", top: "4%", fontSize: "0.22em", fontWeight: 800,
            color: coordCol, opacity: 0.85, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>{rankLbl}</span>}
          {isLast && <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
            background: i === lastMove.to
              ? `radial-gradient(circle at 50% 52%, ${T.lime}59, ${T.lime}14 68%, transparent 78%)`
              : `radial-gradient(circle at 50% 52%, ${T.gold}3d, transparent 66%)` }} />}
          {isLast && i === lastMove.to && <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 2px ${T.gold}cc`, pointerEvents: "none" }} />}
          {isHit && <div key={`hit${lastMove.from}-${lastMove.to}`} style={{ position: "absolute", inset: 0, background: T.danger, animation: "hit .45s ease-out forwards" }} />}
          {isSel && <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 3px ${T.gold}`, background: `${T.gold}14` }} />}
          {isSpy && <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 0 3px #a78bfa", background: "rgba(167,139,250,.1)" }} />}
          {introSpot && introSpot.has(i) && piece && <div style={{ position: "absolute", inset: "4%", borderRadius: 8,
            pointerEvents: "none", animation: "ggNewPulse 1.15s ease-in-out infinite" }} />}
          {spyT && <div style={{ position: "absolute", width: "30%", height: "30%", borderRadius: "50%", left: "35%", top: "35%",
            background: "radial-gradient(circle at 34% 30%, #ddd2ff, #8f76e8 62%, #5b47a8)", border: "2px solid #17110a",
            boxShadow: "0 1px 5px rgba(0,0,0,.55), 0 0 7px rgba(167,139,250,.55)", pointerEvents: "none" }} />}
          {checkSq === i && <div style={{ position: "absolute", inset: "8%", borderRadius: 6, animation: "glow 1.1s infinite" }} />}
          {piece && <div style={{ opacity: anim && i === anim.to ? 0 : 1, width: "100%", height: "100%", display: "grid", placeItems: "center", pointerEvents: "none",
            transform: (typeof innerWidth !== "undefined" && innerWidth >= 640 ? "translateY(-10%)" : "translateY(-13%)")
              + ((isSel || isSpy) ? " scale(1.38)" : ""), // the chosen one steps forward for inspection
            transformOrigin: "50% 72%", transition: "transform .16s ease",
            position: "relative", zIndex: rr + 3, // row-by-row layering ALWAYS: even grown, a back-rank piece never covers a nearer one
            fontSize: piece.kind === "P" ? "0.9em" : "1.07em", // pawns humble, the court imposing
            transition: "filter .45s ease",
            filter: introSpot && !introSpot.has(i)
              ? "blur(1.8px) brightness(.72) saturate(.75) drop-shadow(0 0.06em 0.09em rgba(0,0,0,.5))" // the known world softens ...
              : "drop-shadow(0 0.06em 0.09em rgba(0,0,0,.5))" }}>                                       // ... the strangers stand sharp<PieceGlyph piece={piece} showLevel={showLevel} pov={pov} artStyle={artStyle} /></div>}
          {tgt && (tgt.capture
            ? <>
                <div style={{ position: "absolute", inset: 0, background: `${T.danger}1f`, pointerEvents: "none" }} />
                <div style={{ position: "absolute", inset: "7%", border: `0.22em solid ${tgt.special ? T.gold : T.danger}`, borderRadius: "50%", boxShadow: "0 0 6px rgba(0,0,0,.5)", pointerEvents: "none" }} />
              </>
            : <div style={{ position: "absolute", width: "34%", height: "34%", borderRadius: "50%",
                background: MOVE_DOT, border: `2px solid ${tgt.special ? T.goldBright : "#17110a"}`,
                boxShadow: "0 1px 5px rgba(0,0,0,.55)", pointerEvents: "none" }} />)}
        </div>
      );
    }
  }

  // Integer cell size from the measured box — SSR / first paint fall back to a
  // fluid grid; the client snaps to exact pixels right after mount, so every
  // tile is the same size on every screen (no fr-track rounding drift).
  const GAP = 2; // dark seams between the slabs — the board reads as separate stone plates
  let cell = 0;
  if (avail.w > 0) {
    const byW = (Math.min(avail.w, fitBox ? avail.w : maxPx) - (W - 1) * GAP) / W;
    const byH = fitBox && avail.h > 0 ? (avail.h - (H - 1) * GAP) / H : Infinity;
    cell = Math.max(8, Math.floor(Math.min(byW, byH)));
  }
  const bw = cell ? cell * W + (W - 1) * GAP : null;
  const bh = cell ? cell * H + (H - 1) * GAP : null;
  // Smaller boards → larger cells; glyph stays ~85% of a cell.
  const glyph = cell ? `${Math.round(cell * 0.98)}px` : `min(${(0.98 * 88 / W).toFixed(1)}vw, ${Math.round(0.98 * maxPx / W)}px)`;

  // display coords for the overlay (respect flip)
  const disp = (i) => {
    const f = i % W, r = Math.floor(i / W);
    const c = flip ? W - 1 - f : f, row = flip ? r : H - 1 - r;
    return { x: ((c + 0.5) / W) * 100, y: ((row + 0.5) / H) * 100, l: (c / W) * 100, t: (row / H) * 100 };
  };

  const board = (
    <div style={{ position: "relative", width: bw ?? `min(100%, ${maxPx}px)`, maxWidth: "100%",
      margin: fitBox ? 0 : "0 auto", fontSize: glyph }}>
      <div style={{ ...(cell
          ? { width: bw, height: bh, gridTemplateColumns: `repeat(${W}, ${cell}px)`, gridTemplateRows: `repeat(${H}, ${cell}px)` }
          : { aspectRatio: `${W} / ${H}`, gridTemplateColumns: `repeat(${W}, 1fr)`, gridTemplateRows: `repeat(${H}, 1fr)` }),
        display: "grid", gap: GAP, borderRadius: 12, overflow: "visible", position: "relative", // the back rank's heads rise ABOVE the field
        background: "#05070c",
        border: `1px solid ${T.line}`, boxShadow: T.shadow, userSelect: "none", touchAction: "manipulation" }}>
        {cells}
        {/* ── THE BIG DRAGON: one sprite over four squares ── */}
        {state.board.map((pc, a) => {
          if (!pc || !pc.big || pc.kind !== "D") return null;
          const f0 = a % W, r0 = (a / W) | 0;
          const dc = flip ? W - 2 - f0 : f0;
          const dr = flip ? r0 : H - 2 - r0;
          const selHere = sel === a;
          return (
            <div key={"drg" + a} onClick={() => tap(a)} style={{ position: "absolute", zIndex: 2,
              left: `calc(${(dc / W) * 100}% )`, top: `calc(${(dr / H) * 100}% )`,
              width: `${(2 / W) * 100}%`, height: `${(2 / H) * 100}%`,
              display: "grid", placeItems: "center", cursor: interactive ? "pointer" : "default",
              borderRadius: 10,
              boxShadow: selHere ? "inset 0 0 0 3px rgba(240,214,138,.85), 0 0 18px rgba(240,214,138,.35)" : "none",
              fontSize: `calc(${typeof glyph === "string" ? glyph : glyph + "px"} * 1.88)` }}>
              <PieceGlyph piece={pc} showLevel={showLevel} pov={pov} artStyle={artStyle} />
            </div>
          );
        })}

        {/* the material rides on top too: a soft-light wash of the same wood, so
            scratches and grain read across light and dark squares alike */}
        {texture && <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `url(${texture})`, backgroundSize: "280px 280px", backgroundRepeat: "repeat",
          mixBlendMode: "soft-light", opacity: 0.7 }} />}
        {/* a FRIENDLY table wears its welcome: a warm golden wash, and on each
            vein wave a soft sheen band glides across the polished stone */}
        {friendly && <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(242,217,140,.05), rgba(242,217,140,.11))" }} />}
        {friendly && wave && !REDUCED && artReady && (() => {
          const g = Math.atan2(wave.dx, wave.dy) * 180 / Math.PI;
          return <div key={"fw" + wave.id} aria-hidden style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden", mixBlendMode: "screen" }}>
            <div style={{ position: "absolute", left: "-60%", top: "-60%", width: "220%", height: "220%",
              "--sx0": `${(-wave.dx * 55).toFixed(1)}%`, "--sy0": `${(wave.dy * 55).toFixed(1)}%`,
              "--sx1": `${(wave.dx * 55).toFixed(1)}%`, "--sy1": `${(-wave.dy * 55).toFixed(1)}%`,
              background: `linear-gradient(${g.toFixed(0)}deg, transparent 42%, rgba(242,217,140,.04) 47%, rgba(242,217,140,.10) 50%, rgba(242,217,140,.04) 53%, transparent 58%)`,
              animation: "ggSweep 3.6s ease-in-out both" }} />
          </div>;
        })()}
      </div>
      {lastMove && !anim && lastMove.from !== lastMove.to && (() => {
        const a = disp(lastMove.from), b = disp(lastMove.to);
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {Array.from({ length: 6 }).map((_, k) => {
              const q = (k + 1) / 7;
              return <circle key={k} cx={a.x + (b.x - a.x) * q} cy={a.y + (b.y - a.y) * q}
                r={0.55 + q * 1.15} fill={T.gold} opacity={0.06 + q * 0.2} />;
            })}
          </svg>
        );
      })()}
      {anim && (() => {
        const a = disp(anim.from), b = disp(anim.to), at = anim.phase ? b : a;
        return (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
              style={{ position: "absolute", inset: 0, animation: "arrowFade 1.05s ease forwards" }}>
              {/* comet trail: fading, shrinking orbs from origin toward target */}
              {Array.from({ length: 7 }).map((_, k) => {
                const q = (k + 1) / 8;
                return <circle key={k} cx={a.x + (b.x - a.x) * q} cy={a.y + (b.y - a.y) * q}
                  r={0.7 + q * 1.5} fill={T.gold} opacity={0.10 + q * 0.34} />;
              })}
              <circle cx={b.x} cy={b.y} r="3.1" fill={T.gold} opacity="0.16" />
              <circle cx={b.x} cy={b.y} r="1.5" fill={T.gold} opacity="0.55" />
            </svg>
            <div style={{ position: "absolute", left: `${at.l}%`, top: `${at.t}%`, width: `${100 / W}%`, height: `${100 / H}%`,
              transition: "left .34s cubic-bezier(.3,.8,.3,1), top .34s cubic-bezier(.3,.8,.3,1)",
              display: "grid", placeItems: "center", filter: "drop-shadow(0 3px 6px rgba(0,0,0,.5))" }}>
              <PieceGlyph piece={anim.piece} showLevel={showLevel} pov={pov} artStyle={artStyle} />
            </div>
          </div>
        );
      })()}
    </div>
  );
  if (fitBox) return <div ref={wrapRef} style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>{board}</div>;
  return <div ref={wrapRef} style={{ width: "100%" }}>{board}</div>;
}
