import { useMemo, useState, useEffect } from "react";
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

export function BoardView({ state, onMove, interactive, lastMove, theme = null, maxPx = 520, animateFor = null, flip = false, fitVh = null, pick = null, onPick = null, pov = "w" }) {
  const sqL = theme?.sqLight || T.sqLight, sqD = theme?.sqDark || T.sqDark;
  const [sel, setSel] = useState(null);
  useEffect(() => { setSel(null); }, [state]); // clear selection whenever the position changes

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
      cells.push(
        <div key={i} onClick={() => tap(i)} style={{ position: "relative",
          background: `linear-gradient(148deg, rgba(255,255,255,.055) 0%, rgba(255,255,255,0) 42%, rgba(0,0,0,.14) 100%), ${dark ? sqD : sqL}`,
          boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,.22)",
          display: "grid", placeItems: "center", cursor: interactive ? "pointer" : "default" }}>
          {isLast && <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
            background: i === lastMove.to
              ? `radial-gradient(circle at 50% 52%, ${T.lime}59, ${T.lime}14 68%, transparent 78%)`
              : `radial-gradient(circle at 50% 52%, ${T.gold}3d, transparent 66%)` }} />}
          {isLast && i === lastMove.to && <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 2px ${T.gold}cc`, pointerEvents: "none" }} />}
          {isHit && <div key={`hit${lastMove.from}-${lastMove.to}`} style={{ position: "absolute", inset: 0, background: T.danger, animation: "hit .45s ease-out forwards" }} />}
          {isSel && <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 3px ${T.gold}`, background: `${T.gold}14` }} />}
          {checkSq === i && <div style={{ position: "absolute", inset: "8%", borderRadius: 6, animation: "glow 1.1s infinite" }} />}
          {piece && <div style={{ opacity: anim && i === anim.to ? 0 : 1, width: "100%", height: "100%", display: "grid", placeItems: "center", filter: "drop-shadow(0 0.06em 0.09em rgba(0,0,0,.5))" }}><PieceGlyph piece={piece} showLevel={false} pov={pov} /></div>}
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

  // Smaller boards → larger cells, so scale the glyph to keep it ~85% of a cell.
  const glyph = `min(${(0.85 * 88 / W).toFixed(1)}vw, ${Math.round(0.85 * maxPx / W)}px)`;

  // display coords for the overlay (respect flip)
  const disp = (i) => {
    const f = i % W, r = Math.floor(i / W);
    const c = flip ? W - 1 - f : f, row = flip ? r : H - 1 - r;
    return { x: ((c + 0.5) / W) * 100, y: ((row + 0.5) / H) * 100, l: (c / W) * 100, t: (row / H) * 100 };
  };

  return (
    <div style={{ position: "relative", width: fitVh ? `min(100%, ${maxPx}px, calc((100dvh - ${fitVh}px) * ${(W / H).toFixed(4)}))` : `min(100%, ${maxPx}px)`, margin: "0 auto", fontSize: glyph }}>
      <div style={{ aspectRatio: `${W} / ${H}`, display: "grid",
        gridTemplateColumns: `repeat(${W}, 1fr)`, gridTemplateRows: `repeat(${H}, 1fr)`,
        gap: "1px", background: T.grid, borderRadius: 12, overflow: "hidden",
        border: `1px solid ${T.line}`, boxShadow: T.shadow, userSelect: "none", touchAction: "manipulation" }}>
        {cells}
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
              <PieceGlyph piece={anim.piece} showLevel={false} pov={pov} />
            </div>
          </div>
        );
      })()}
    </div>
  );
}
