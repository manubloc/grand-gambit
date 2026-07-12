import { useMemo, useState, useEffect, useRef } from "react";
import { T } from "../theme.js";
import { FILES, RANKS, idx, legalMovesFrom, inCheck, findKing } from "../../../core/index.js";
import { PieceGlyph } from "./PieceGlyph.jsx";

const MOVE_DOT = "#c9a45c";

// Modern game-style HP: one segment per hit point (readable at a glance),
// falling back to a continuous bar when segments would get too tiny.
function HpBar({ hp, max }) {
  const ratio = Math.max(0, Math.min(1, hp / max));
  const col = ratio > 0.55 ? "#3ad98a" : ratio > 0.28 ? "#ffb454" : "#ff4d5e";
  const wrap = { position: "absolute", left: "8%", right: "8%", bottom: "4.5%", height: "9%", minHeight: 4,
    background: "rgba(0,0,0,.62)", borderRadius: 3, overflow: "hidden", pointerEvents: "none",
    boxShadow: "0 0 0 1px rgba(0,0,0,.5)", padding: 1 };
  if (max > 14) {
    return <div style={wrap}><div style={{ width: `${ratio * 100}%`, height: "100%", background: col, borderRadius: 2, transition: "width .2s ease" }} /></div>;
  }
  return (
    <div style={{ ...wrap, display: "flex", gap: 1 }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ flex: 1, borderRadius: 1, background: i < hp ? col : "rgba(255,255,255,.13)", transition: "background .2s ease" }} />
      ))}
    </div>
  );
}

// hex -> rgba: with a texture underlay the squares go slightly translucent so
// the material (fine scratches, grain) whispers through — a breath, not a print.
const hexA = (hex, a, lift = 0) => {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.round(v + (255 - v) * lift);   // gently lift toward ivory
  return `rgba(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)},${a})`;
};

export function BoardView({ state, onMove, interactive, lastMove, theme = null, maxPx = 520, animateFor = null, flip = false, fitBox = false, pick = null, onPick = null, pov = "w", texture = null, artStyle = "svg" }) {
  const sqL0 = theme?.sqLight || T.sqLight, sqD0 = theme?.sqDark || T.sqDark;
  const sqL = texture ? hexA(sqL0, 0.82, 0.34) : sqL0;
  const sqD = texture ? hexA(sqD0, 0.84, 0.07) : sqD0;
  const [sel, setSel] = useState(null);
  useEffect(() => { setSel(null); }, [state]); // clear selection whenever the position changes

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

  const checkSq = useMemo(() => {
    const k = findKing(state.board, state.turn, W);
    return k && inCheck(state, state.turn) ? k.i : -1;
  }, [state]);

  function tap(i) {
    if (!interactive) return;
    if (pick && onPick) { const pc = state.board[i]; if (pc && pc.color === pick) onPick(i); return; }
    if (sel != null && targets.has(i)) { onMove(targets.get(i)); setSel(null); return; }
    const piece = state.board[i];
    if (piece && piece.color === state.turn) setSel(i === sel ? null : i);
    else setSel(null);
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
      const piece = state.board[i];
      const dark = (f + r) % 2 === 1;
      const tgt = targets.get(i);
      const isSel = sel === i;
      const isLast = lastMove && (lastMove.from === i || lastMove.to === i);
      const isHit = hpMode && lastMove && lastMove.to === i && (lastMove.damaged || lastMove.lethal);
      // Tiny coordinates on the rim squares (a–j / 1–10), chess-board style:
      // file letters along the bottom edge, rank numbers along the left edge.
      const coordCol = dark ? sqL : sqD;
      const fileLbl = rr === H - 1 ? "abcdefghij"[f] : null;
      const rankLbl = ff === 0 ? String(r + 1) : null;
      cells.push(
        <div key={i} onClick={() => tap(i)} style={{ position: "relative",
          background: `linear-gradient(148deg, rgba(255,255,255,.055) 0%, rgba(255,255,255,0) 42%, rgba(0,0,0,.14) 100%), ${dark ? sqD : sqL}`,
          boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,.22)",
          display: "grid", placeItems: "center", cursor: interactive ? "pointer" : "default" }}>
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
          {checkSq === i && <div style={{ position: "absolute", inset: "8%", borderRadius: 6, animation: "glow 1.1s infinite" }} />}
          {piece && <div style={{ opacity: anim && i === anim.to ? 0 : 1, width: "100%", height: "100%", display: "grid", placeItems: "center", filter: "drop-shadow(0 0.06em 0.09em rgba(0,0,0,.5))" }}><PieceGlyph piece={piece} showLevel={false} pov={pov} artStyle={artStyle} /></div>}
          {hpMode && piece && piece.maxHp > 0 && <HpBar hp={piece.hp} max={piece.maxHp} />}
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
  const GAP = 1;
  let cell = 0;
  if (avail.w > 0) {
    const byW = (Math.min(avail.w, fitBox ? avail.w : maxPx) - (W - 1) * GAP) / W;
    const byH = fitBox && avail.h > 0 ? (avail.h - (H - 1) * GAP) / H : Infinity;
    cell = Math.max(8, Math.floor(Math.min(byW, byH)));
  }
  const bw = cell ? cell * W + (W - 1) * GAP : null;
  const bh = cell ? cell * H + (H - 1) * GAP : null;
  // Smaller boards → larger cells; glyph stays ~85% of a cell.
  const glyph = cell ? `${Math.round(cell * 0.85)}px` : `min(${(0.85 * 88 / W).toFixed(1)}vw, ${Math.round(0.85 * maxPx / W)}px)`;

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
        display: "grid", gap: GAP, borderRadius: 12, overflow: "hidden", position: "relative",
        background: texture ? `url(${texture}) ${T.grid}` : T.grid,
        backgroundSize: texture ? "280px 280px" : undefined, backgroundRepeat: "repeat",
        border: `1px solid ${T.line}`, boxShadow: T.shadow, userSelect: "none", touchAction: "manipulation" }}>
        {cells}
        {/* the material rides on top too: a soft-light wash of the same wood, so
            scratches and grain read across light and dark squares alike */}
        {texture && <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `url(${texture})`, backgroundSize: "280px 280px", backgroundRepeat: "repeat",
          mixBlendMode: "soft-light", opacity: 0.7 }} />}
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
              <PieceGlyph piece={anim.piece} showLevel={false} pov={pov} artStyle={artStyle} />
            </div>
          </div>
        );
      })()}
    </div>
  );
  if (fitBox) return <div ref={wrapRef} style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>{board}</div>;
  return <div ref={wrapRef} style={{ width: "100%" }}>{board}</div>;
}
