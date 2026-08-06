import { useMemo, useState, useEffect, useLayoutEffect, useRef } from "react";
import { klang } from "../klang.js";
// useLayoutEffect on the client (fires before paint → no flicker), plain
// useEffect on the server (no SSR warning; the board never animates there).
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import { T } from "../theme.js";
import { FILES, RANKS, idx, legalMovesFrom, inCheck, findKing } from "../../../core/index.js";
import { PieceGlyph, StatTriad } from "./PieceGlyph.jsx";
import { BrettRahmen, lageAusBrett } from "./BrettRahmen.jsx";
import { PieceArt } from "./PieceArt.jsx";
import { boardFrame, livery } from "../livery.js";

// THE MOVE MARKERS WEAR THE ARMY'S METAL: your own moves are struck in the
// same gold as the buttons and the jewels, a foe's (read by a seer) in the
// polished steel his pieces wear. Shape still carries the meaning — a filled
// bead is a step, a ring is a strike — but the metal says WHOSE move it is.
const MOVE_METAL = {
  gold: {
    face: "radial-gradient(circle at 33% 27%, #fff6d8, #f0d68a 40%, #c9a45c 72%, #8a6a2e)",
    ring: "radial-gradient(circle, transparent 55%, #fff6d8 56%, #f0d68a 63%, #c9a45c 78%, #7d5f28 100%)",
    rim: "#5d451c", glow: "rgba(240,214,138,.55)",
  },
  steel: {
    face: "radial-gradient(circle at 33% 27%, #ffffff, #e2e9ef 40%, #a9b6c2 72%, #6d7885)",
    ring: "radial-gradient(circle, transparent 55%, #ffffff 56%, #dfe7ee 63%, #a9b6c2 78%, #5f6a76 100%)",
    rim: "#232a33", glow: "rgba(206,220,233,.5)",
  },
};

// THE FALLEN, in flight: a captured piece doesn't just fade in a rough
// direction — it spins off the board and lands EXACTLY on its captor's tray
// (the very slot where it now shows among the taken). We measure the real
// on-screen tray at flight time (querying [data-gg-tray=<victim colour>]), so
// it lands true whether the layout is portrait, landscape or flipped.
function DeathFlyer({ death, disp, W, H, pov, artStyle }) {
  const ref = useRef(null);
  const d = disp(death.at);
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from = el.getBoundingClientRect();
    const cx = from.left + from.width / 2, cy = from.top + from.height / 2;
    // aim at the tray that displays a piece of THIS victim's colour; land on
    // its newest (right-most) slot — that's where the capture now sits.
    const tray = typeof document !== "undefined" && document.querySelector(`[data-gg-tray="${death.piece.color}"]`);
    let tx, ty;
    if (tray) {
      const tr = tray.getBoundingClientRect();
      tx = tr.right - Math.min(tr.height, from.width) * 0.5;   // the last glyph's centre
      ty = tr.top + tr.height / 2;
    } else {
      // no tray on screen (rare) — fall off toward the correct corner instead
      tx = cx + from.width * 2.4 * (death.dir || 1);
      ty = cy + from.height * 3.5 * (death.fly || -1);
    }
    const dx = tx - cx, dy = ty - cy;
    const dir = death.dir || 1;
    // shrink toward the little tray glyph so it seems to BECOME the trophy
    const endScale = Math.max(0.16, Math.min(0.4, (from.width ? 22 / from.width : 0.3)));
    const kf = [
      { transform: "translate(0px,0px) rotate(0deg) scale(1)", opacity: 1, offset: 0 },
      // knocked loose: a clear pop UP and a spin before it's flung off
      { transform: `translate(${dx * 0.1}px, ${dy * 0.1 - from.height * 0.62}px) rotate(${dir * 82}deg) scale(1.16)`, opacity: 1, offset: 0.24 },
      { transform: `translate(${dx * 0.58}px, ${dy * 0.48}px) rotate(${dir * 330}deg) scale(.66)`, opacity: 0.92, offset: 0.62 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${dir * 580}deg) scale(${endScale})`, opacity: 0, offset: 1 },
    ];
    // fill "both": BEFORE the delay elapses the first frame holds the victim in
    // place (visible on its square) while the attacker glides in; then it flies.
    const player = el.animate(kf, { duration: 1200, delay: death.holdMs || 0, easing: "cubic-bezier(.34,.06,.6,1)", fill: "both" });
    return () => { try { player.cancel(); } catch {} };
  }, [death.id]); // eslint-disable-line
  return <div ref={ref} style={{ position: "absolute", left: `${d.l}%`, top: `${d.t}%`,
    width: `${100 / W}%`, height: `${100 / H}%`, pointerEvents: "none", zIndex: 8,
    display: "grid", placeItems: "center", willChange: "transform, opacity" }}>
    {/* same lift/size/origin as the cell piece, so while it waits on its square
        it sits exactly where the real piece stood */}
    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center",
      transform: `translateY(${death.lift || "-10%"})`, transformOrigin: "50% 72%",
      fontSize: death.font || "1.16em",
      filter: "drop-shadow(0 0.09em 0.13em rgba(0,0,0,.6))" }}>
      <PieceGlyph piece={death.piece} showLevel={false} pov={pov} artStyle={artStyle} />
    </div>
  </div>;
}

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

/* v0.79: DIE EINE DAUERFORMEL. Der Klang eines Treffers gehoert in den Moment,
   in dem die Figur ANKOMMT - also braucht der GameScreen dieselbe Rechnung wie
   die Gleit-Animation hier. Eine Formel, zwei Nutzer, kein Auseinanderlaufen. */
export function zugDauerMs(lastMove, pov, hotseat, w) {
  if (!lastMove || lastMove.from == null || lastMove.to == null) return 0;
  const W = w || 8;
  const foe = !hotseat && lastMove.color !== pov;
  const fF = lastMove.from % W, fR = (lastMove.from / W) | 0;
  const tF = lastMove.to % W, tR = (lastMove.to / W) | 0;
  const dF = Math.abs(tF - fF), dR = Math.abs(tR - fR);
  const leaps = !lastMove.bounced && (lastMove.kind === "N" || !!(dF && dR && dF !== dR));
  return Math.round((leaps ? (foe ? 1.25 : 0.95) : (foe ? 0.9 : 0.52)) * 1000);
}

export function BoardView({ state, onMove, interactive, lastMove, theme = null, maxPx = 520, animateFor = null, flip = false, fitBox = false, feld = null, feldDunkel = null, ruhig = false, pick = null, onPick = null, pov = "w", texture = null, ground = null, artStyle = "painted", showLevel = true, showCoords = false, pulse = 0.4, friendly = false, knownKinds = null, seerVision = false, onEnemyTap = null, introSpot = null, onInspect = null, hotseat = false }) {
  const sqL0 = theme?.sqLight || T.sqLight, sqD0 = theme?.sqDark || T.sqDark;
  // a GROUND painting beneath the field: the squares open further so meadow,
  // stream and path shimmer through — the land itself hosts the battle
  // With a painted GROUND the land itself is the board: squares become pure
  // light/dark veils (no theme colour, no stone) so the meadow stays the star,
  // and the existing bevel layers make each tile read as gently RAISED.
  //
  // TWO LAWS, ONE FOR EACH LIVERY.
  // CLASSIC keeps the organic breath it was designed with: each veil is a
  // radial breath, strong at the heart of the square and fading toward the
  // seams so neighbouring tiles melt into one another over the land.
  // CARVED does the opposite, on purpose. Its grounds carry far more of their
  // own contrast, and a veil that fades out at the seam left the board
  // unreadable — the chess squares dissolved into the texture. So the carved
  // veil covers the WHOLE square evenly and meets its neighbour at a real
  // edge; a hairline seam (dark outside, one light catch inside) then draws
  // the grid the way a carved board would actually part. The ground still
  // shows through — it is calmer art now (tools/calm-grounds.py) — so the
  // squares stay clearly separated without losing the carved surface.
  const carvedBoard = ground && livery() === "carved";
  const sqL = carvedBoard
    ? "rgba(255,255,255,.24)"
    : ground
    ? "radial-gradient(circle at 50% 50%, rgba(255,255,255,.27) 0%, rgba(255,255,255,.20) 52%, rgba(255,255,255,.06) 96%)"
    : texture ? hexA(sqL0, 0.82, 0.34) : sqL0;
  const sqD = carvedBoard
    ? "rgba(0,0,0,.34)"
    : ground
    ? "radial-gradient(circle at 50% 50%, rgba(0,0,0,.37) 0%, rgba(0,0,0,.29) 52%, rgba(0,0,0,.09) 96%)"
    : texture ? hexA(sqD0, 0.84, 0.07) : sqD0;
  const [sel, setSel] = useState(null);
  const [spy, setSpy] = useState(null);        // seer's gaze: an ENEMY square under inspection
  useEffect(() => { setSel(null); setSpy(null); }, [state]); // clear selection whenever the position changes
  useEffect(() => { // the inspect sheet mirrors whatever is currently chosen
    if (!onInspect) return;
    if (sel != null && state.board[sel]) onInspect({ i: sel, mode: "own" });
    else if (spy != null && state.board[spy]) onInspect({ i: spy, mode: "spy" });
    else onInspect(null);
  }, [sel, spy]);
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

  // Move animation for BOTH armies. A ghost of the mover glides from→to, tilting
  // slightly into the direction of travel (like the wanderer on the map). Pieces
  // that LEAP (knights, and any move that isn't a straight line) hop in an arc.
  // On a KILL the fallen piece spins off toward its captor's tray (up top for a
  // foe I took, down low for a piece the foe took from me).
  const [anim, setAnim] = useState(null);
  const [death, setDeath] = useState(null);   // { at, piece, dir, fly, id }
  const animSeq = useRef(0);   // strictly-increasing id: two moves in the same
                               // millisecond must still get distinct keys, or
                               // React recycles the ghost div and it slides in
                               // from the PREVIOUS move's destination.
  // useIsoLayoutEffect: the ghost is armed BEFORE the browser paints, so the
  // real piece is never shown for a frame at its new square before the glide
  // starts (that was the "pops in at the wrong place" clip).
  useIsoLayoutEffect(() => {
    if (!lastMove || lastMove.from === lastMove.to) { setAnim(null); return; }
    // hotseat animates both; otherwise only the side we're told to animate
    if (animateFor && lastMove.color !== animateFor) { setAnim(null); return; }
    const piece = state.board[lastMove.to];
    if (!piece && !lastMove.bounced) { setAnim(null); return; }
    const glider = piece || { kind: lastMove.kind, color: lastMove.color };
    // is this the OPPONENT moving? A foe move (vs AI or online, not hotseat)
    // glides noticeably slower so the eye can clearly follow what it does.
    const foe = !hotseat && lastMove.color !== pov;
    // does this move LEAP? knights always; otherwise any non-straight, non-
    // diagonal hop over distance (a piece that doesn't travel in a line).
    const fF = lastMove.from % W, fR = (lastMove.from / W) | 0;
    const tF = lastMove.to % W, tR = (lastMove.to / W) | 0;
    const dF = Math.abs(tF - fF), dR = Math.abs(tR - fR);
    const leaps = !lastMove.bounced && (glider.kind === "N" || !!(dF && dR && dF !== dR));
    // leaps read slower AND higher — a real jump takes its time in the air.
    // own leap a touch longer than before so the hop feels complete (the foe's
    // is already well-paced), plain glides quick.
    const durS = zugDauerMs(lastMove, pov, hotseat, W) / 1000;
    const animId = ++animSeq.current;
    const a = { from: lastMove.from, to: lastMove.to, piece: glider, phase: 0,
      bounced: !!lastMove.bounced, foe, leaps, dur: durS, id: animId };
    setAnim(a);
    // a struck piece is hurled off toward its captor's tray. It fires on ANY
    // capture — in chess rules a taken piece has capture=true but lethal=false
    // (lethal is the HP-mode "dropped to 0" flag), so keying off lethal alone
    // meant the flight never played in normal games. Never on a blocked hit.
    if ((lastMove.capture || lastMove.lethal) && lastMove.hitKind && !lastMove.bounced) {
      const iWon = lastMove.color === pov;            // did MY side make this capture?
      setDeath({ at: lastMove.to, id: a.id + 100000,
        piece: { kind: lastMove.hitKind, color: lastMove.hitColor || (lastMove.color === "w" ? "b" : "w") },
        dir: (lastMove.color === "w" ? 1 : -1) * (pov === "w" ? 1 : -1),
        // hold the victim in place until the attacker actually arrives, THEN
        // fling it — so you read the strike, not a piece leaving early.
        holdMs: Math.round(durS * 1000),
        lift: pieceLift, font: pieceFont(lastMove.hitKind),
        fly: iWon ? -1 : 1 });   // -1 up (foe's tray up top), +1 down (my tray below)
    }
    // arm the glide: phase 0 paints the ghost at FROM, then the next frame(s)
    // (Riss-Sterne: siehe eigener Effekt unter diesem Block)
    // flip to phase 1 so the CSS transition carries it to TO. A double rAF plus
    // a tiny timeout guarantees the FROM frame is painted first on every device
    // — without it the ghost can appear straight at TO (the "clip onto my
    // piece" glitch).
    let raf2 = 0;
    const raf = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => {
      setAnim((cur) => (cur && cur.id === a.id ? { ...cur, phase: 1 } : cur));
    }); });
    // the HANDOFF: the instant the glide lands (lean settled to 0, shadow gone)
    // the ghost's final frame equals the real piece exactly — swap right then,
    // in one commit, so nothing blinks. The trail svg lingers a bit longer.
    const tDone = setTimeout(() => {
      setAnim((cur) => (cur && cur.id === a.id ? { ...cur, phase: 2 } : cur));
    }, durS * 1000 + 90);
    const hold = Math.max(durS * 1000 + 650, 1150);   // trail fade-out cover
    const t = setTimeout(() => { setAnim((cur) => (cur && cur.id === a.id ? null : cur)); }, hold);
    // the death flight = hold (until the attacker lands) + 1.2s flight; never cut short
    const tDeath = setTimeout(() => { setDeath((cur) => (cur && cur.id === a.id + 100000 ? null : cur)); }, durS * 1000 + 1500);
    return () => { cancelAnimationFrame(raf); cancelAnimationFrame(raf2); clearTimeout(tDone); clearTimeout(t); clearTimeout(tDeath); };
  }, [lastMove, animateFor, hotseat, pov]); // eslint-disable-line

  /* ── v0.80 (Besitzer): DIE RISS-STERNE. Ein Fernangriff braucht ein BILD:
     auf jedem getroffenen Feld birst ein leuchtender violetter Stern auf und
     GLIMMT NACH, damit man auch einen Wimpernschlag spaeter noch sieht, wo
     der Schlag sass. Dasselbe Zeichen tragen die Felder der SCHOCKWELLE -
     dort gestaffelt NACH der Ankunft des Schlaegers (zugDauerMs), beim
     Schuss mit dem Pfeil-Einschlag (160 ms). */
  const [sterne, setSterne] = useState(null);
  useEffect(() => {
    const lm = lastMove;
    if (!lm) { setSterne(null); return; }
    const treffer = [];
    if (lm.special === "shot" && (lm.damaged || lm.capture || lm.lethal))
      treffer.push({ at: lm.to, delay: 160 });
    if (Array.isArray(state.welle) && state.welle.length) {
      const basis = zugDauerMs(lm, pov, hotseat, state.w || FILES) + 60;
      for (const e of state.welle) treffer.push({ at: e.at, delay: basis });
    }
    if (!treffer.length) { setSterne(null); return; }
    setSterne({ id: Date.now(), list: treffer });
    const t = setTimeout(() => setSterne(null),
      Math.max(...treffer.map((e) => e.delay)) + 2600);
    return () => clearTimeout(t);
  }, [lastMove]); // eslint-disable-line react-hooks/exhaustive-deps

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
    // A selected dragon moving one square forward lands on a square its own 2x2
    // block currently covers (a wing marker). That target must WIN over the
    // "tap a wing = tap the dragon" redirect, or he can never step forward.
    if (sel != null && targets.has(i)) { onMove(targets.get(i)); setSel(null); return; }
    const w0 = state.board[i];
    if (w0 && w0.kind === "D+") i = w0.ref;        // a wing tap is a dragon tap
    if (pick && onPick) { const pc = state.board[i]; if (pc && pc.color === pick) onPick(i); return; }
    if (sel != null && targets.has(i)) { onMove(targets.get(i)); setSel(null); return; }
    const piece = state.board[i];
    if (piece && piece.color === state.turn) { klang("wahl"); setSel(i === sel ? null : i); setSpy(null); }
    else if (piece) {
      if (onEnemyTap) onEnemyTap(i, spyAllowed(piece));      // the hall notices your curiosity (first-meet tales)
      if (spyAllowed(piece)) setSpy(i === spy ? null : i);   // known or seen-through: study its moves
      else setSpy(null);                                     // a stranger keeps its secrets — this time
      setSel(null);
    }
    else { setSel(null); setSpy(null); }
  }

  // ── Shared piece-in-cell geometry ──────────────────────────────────────────
  // The ANIMATED overlay reuses these EXACT values, so the gliding/leaping piece
  // is pixel-identical to the one that finally stands in the cell: same lift,
  // same size, same transform-origin. Previously the ghost sat centred and a
  // size smaller, so on landing the piece visibly jumped up and grew — that was
  // the "drifts too far, then snaps into place" glitch. One source of truth now.
  const bigScreen = typeof innerWidth !== "undefined" && innerWidth >= 640;
  /* v1.0.35 (Besitzer): "alle sitzen sehr weit unten am Rand - minimal
     vertikal eher in die Mitte". Nachgemessen im laufenden Brett: die Figur
     steht mit dem Fuss auf der Feldkante und waechst nach OBEN aus dem Feld
     heraus (der Turm um 75 % der Feldhoehe) - das ist gewollt, denn eine
     Figur STEHT auf ihrem Feld. Sie hing dabei aber zu tief; vier Prozent
     mehr Hub ruecken sie zur Mitte, ohne dass der Fuss den Bezug zum Feld
     verliert. */
  const pieceLift = artStyle === "svg" ? "-4%" : bigScreen ? "-14%" : "-17%";
  /* v1.0.9 (Besitzer): "alle Figuren bitte wieder groesser" - der
     Brett-Umbau hatte sie optisch schrumpfen lassen. +9 % auf beide Stile
     und beide Klassen; gilt fuers Gefecht UND das klassische Schach, denn
     beide zeichnen durch dieses Blatt. */
  /* v1.0.35: "alle Figuren koennten noch etwas groesser sein" - rund 9 %
     drauf, auf beide Stile und beide Klassen. */
  const pieceFont = (kind) => artStyle === "svg"
    ? (kind === "P" ? "1.00em" : "1.19em")
    : (kind === "P" ? "1.17em" : "1.37em");
  const PIECE_ORIGIN = "50% 72%";

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
      // whose moves are on show? your own piece, or a foe read by the seer
      const movingPiece = sel != null ? state.board[sel] : null;
      const metal = MOVE_METAL[movingPiece && movingPiece.color !== pov ? "steel" : "gold"];
      const isSel = sel === i;
      const isSpy = spy === i;
      const spyT = spyTargets.has(i);
      const isLast = lastMove && (lastMove.from === i || lastMove.to === i);
      const isHit = hpMode && lastMove && lastMove.to === i && (lastMove.damaged || lastMove.lethal);
      // Tiny coordinates on the rim squares (a–j / 1–10), chess-board style:
      // file letters along the bottom edge, rank numbers along the left edge.
      const coordCol = ground ? (dark ? "rgba(255,247,222,.92)" : "rgba(24,17,7,.88)") : (dark ? sqL : sqD);
      const fileLbl = showCoords && rr === H - 1 ? "abcdefghij"[f] : null;
      const rankLbl = showCoords && ff === 0 ? String(r + 1) : null;
      /* v1.0.34 (Besitzer: "das Schachbrett zum Rand hin transparenter, mit
         Verlauf"): DIE RANDWEICHE SITZT IM FELD, NICHT UEBER IHM. Jedes Feld
         am Brettrand bekommt eine eigene Maske, die genau nach AUSSEN
         ausblendet - oben die oberste Reihe nach oben, links die linke Spalte
         nach links, an den Ecken beides. Weil die Maske am FELD haengt und
         nicht an einer Schicht darueber, bleiben die Figuren unberuehrt: ihre
         Koepfe ragen weiterhin ueber die Kante, ohne in einen Schleier zu
         laufen. Innen (ab 42 %) ist das Feld voll deckend, die Spielflaeche
         bleibt also lesbar. */
      const randMaske = (() => {
        const teile = [];
        if (rr === 0) teile.push("linear-gradient(180deg, transparent 0%, rgba(0,0,0,.35) 16%, #000 44%)");
        if (rr === H - 1) teile.push("linear-gradient(0deg, transparent 0%, rgba(0,0,0,.35) 16%, #000 44%)");
        if (f === 0) teile.push("linear-gradient(90deg, transparent 0%, rgba(0,0,0,.35) 16%, #000 44%)");
        if (f === W - 1) teile.push("linear-gradient(270deg, transparent 0%, rgba(0,0,0,.35) 16%, #000 44%)");
        return teile.length ? teile.join(", ") : null;
      })();
      cells.push(
        <div key={i} data-zelle={i} onClick={() => tap(i)} style={{ position: "relative",
          // the flat colour + a soft diagonal light stand INSTANTLY — no loading
          // state at all; the marble whisper fades in per square once every slab
          // is preloaded, so nothing ever pops
          /* Der Feldgrund liegt seit v1.0.34 in EIGENER Schicht (gleich
             darunter), damit die Randmaske ihn allein trifft - haenge sie an
             die Zelle, blendet sie die FIGUR gleich mit aus. */
          background: randMaske ? "transparent" : `${dark ? sqD : sqL}`,
          display: "grid", placeItems: "center", cursor: interactive ? "pointer" : "default" }}>
          {randMaske && <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
            background: `${dark ? sqD : sqL}`,
            WebkitMaskImage: randMaske, maskImage: randMaske,
            WebkitMaskComposite: "source-in", maskComposite: "intersect" }} />}
          {(feld || !ground) && (() => {
            // DIE FELDER DES BESITZERS (v0.66) SIEGEN AUCH UEBER DEM BODEN:
            // seine Kacheln SIND die Felder - der gemalte Grund weicht. liegt ein Kapitel-Streifen an,
            // schneidet sich jede Zelle ihr Fenster aus der richtigen Haelfte
            // (links hell, rechts dunkel) - Hash haelt das Fenster je Zelle
            // fest, der Schleier darueber ist DUENNER als beim Marmor, damit
            // die Malerei traegt. Die Finale-Kachel (feldDunkel) ist ein
            // GANZES Bild und ersetzt nur die dunklen Felder.
            if (feld) {
              // v0.71.2 (Besitzer): KEINE Hash-Fenster mehr - jedes Feld zeigt
              // seine GANZE Kachel, unbeschnitten: helle Haelfte links (0 %),
              // dunkle rechts (100 %), senkrecht mittig. Die Finale-Kachel
              // deckt als Ganzbild.
              const finale = dark && feldDunkel;
              const quelle = finale ? feldDunkel : feld;
              // v0.71.3 (Besitzer: "noch etwas groesser"): sanft hinein - die
              // Kachel fuellt mehr, ihr Eigenrand bleibt als feine Kante.
              // 215 %-Breite, mittig auf der jeweiligen Haelfte verankert.
              // v0.71.4: zurueck zur GANZEN Kachel - der Eigenrand ist dem
              // Besitzer "megageil" und bleibt KOMPLETT drin.
              const groesse = finale ? "cover" : "200% auto";
              const px = finale ? 50 : dark ? 100 : 0;
              const fy = 0.5;
              // ROHDATEN ANEINANDER (Besitzer, v0.67.1): kein Schleier,
              // keine Fase, keine Fuge - die Kacheln stehen Kante an Kante,
              // genau wie geliefert. Nur Freundschaftskaempfe dimmen leicht.
              return <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
                background: `url(${quelle}) ${px}% ${fy * 100}% / ${groesse} no-repeat`,
                opacity: friendly ? 0.55 : 1 }} />;
            }
            if (ground) return null;
            return <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
              background: `linear-gradient(${hexA(dark ? sqD0 : sqL0, dark ? 0.8 : 0.78, friendly ? 0.26 : 0.12)}, ${hexA(dark ? sqD0 : sqL0, dark ? 0.8 : 0.78, friendly ? 0.26 : 0.12)}), url(${slab(i, dark)}) center / cover`,
              /* v1.0.30: Die Felder bleiben VOLL DECKEND. Ein Versuch mit 0.92
                 liess den Grundverlauf durch die Platten schlagen - statt
                 eines Hauchs Landschaft kam ein flaues Rautenmuster heraus.
                 Am Bild gemessen: deutlich schlechter, also zurueckgenommen. */
              /* v1.0.34 (Besitzer: "die Animation am Anfang kann deutlich
                 langsamer sein, dass man auch noch ein bisschen den
                 Hintergrund sieht - und dann kommt das Schachbrett ganz
                 langsam"): 0,6 s waren zu hastig; das Brett stand da, ehe das
                 Auge das Land gesehen hatte, und der Aufbau aller 64 Felder
                 in derselben halben Sekunde war zugleich die Stelle, an der
                 es stockte. Jetzt 1,8 s mit einer halben Sekunde Vorlauf -
                 langsamer heisst hier auch RUHIGER, weil sich die Last ueber
                 mehr Bilder verteilt. */
              opacity: artReady ? (friendly ? 0.4 : 1) : 0, transition: "opacity 1.8s ease .5s" }} />;
          })()}
          {!ground && !feld && <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
            boxShadow: "inset 2px 2px 0 rgba(255,246,220,.12), inset 6px 6px 7px -5px rgba(255,250,230,.28), inset -2px -2px 0 rgba(0,0,0,.32)" }} />}
          {!ground && !feld && <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
            boxShadow: "inset 1.5px 1.5px 0 rgba(255,238,200,.14), inset -2px -2px 3px rgba(0,0,0,.42)" }} />}
          {ground && !feld && <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
            boxShadow: carvedBoard
              // the parting line: every square owns a real edge again
              ? "inset 0 0 0 1px rgba(10,14,24,.52), inset 1.5px 1.5px 0 rgba(255,248,226,.18), inset -3px -3px 8px -3px rgba(0,0,0,.30)"
              : "inset 4px 4px 10px -4px rgba(255,252,236,.14), inset -4px -4px 10px -4px rgba(0,0,0,.18)" }} />}

          {fileLbl && <span style={{ position: "absolute", right: "5%", bottom: "1%", fontSize: "0.22em", fontWeight: 800,
            color: "#f0d68a", textShadow: "0 0 4px rgba(240,214,138,.55), 0 1px 1px rgba(0,0,0,.9)",
            opacity: 0.95, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>{fileLbl}</span>}
          {rankLbl && <span style={{ position: "absolute", left: "5%", top: "4%", fontSize: "0.22em", fontWeight: 800,
            color: "#f0d68a", textShadow: "0 0 4px rgba(240,214,138,.55), 0 1px 1px rgba(0,0,0,.9)",
            opacity: 0.95, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>{rankLbl}</span>}
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
          {piece && <div style={{ opacity: anim && anim.phase < 2 && i === anim.to ? 0 : 1, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none",
            transform: `translateY(${pieceLift})` + ((isSel || isSpy) && !piece.big ? (artStyle === "svg" ? " scale(1.4)" : " scale(1.58)") : ""),
            transformOrigin: PIECE_ORIGIN,
            // MEASURED, then nailed: this layer's 1em box lives in the piece font
            // (court 1.16em), so it grew WIDER than the square and sat flush to
            // its LEFT edge — every court figure drifted (em-cell)/2 = ~4-5px
            // right while the slimmer pawns stayed true. Pinning the layer to
            // the square (inset 0) makes the flex centre the overflow evenly.
            position: "absolute", inset: 0,
            // v0.71.13 (Besitzer): steht ein Dialog offen, faellt die Auswahl
            // in die Reihe zurueck - sonst ragten Figur UND Kugeln darueber.
            zIndex: (!ruhig && (isSel || isSpy)) ? 40 : rr + 3, // selection floats above ALL rows so its value orbs stay readable; otherwise row-by-row layering
            fontSize: pieceFont(piece.kind),
            // a single combined transition: the settle (scale/lift) is quick, the
            // arriving piece fades in gently so it never "pops" after the glide
            transition: "transform .16s ease, opacity .18s ease, filter .45s ease",
            // EVERY FIGURE STANDS SHARP. The opening used to soften the whole
            // board for two seconds to spotlight an unknown foe — but since a
            // champion stands in the QUEEN'S square, the effect read as "only
            // the queen is in focus, everything else is out of focus". The
            // stranger still announces himself with the pulsing ring below.
            filter: "drop-shadow(0 0.06em 0.09em rgba(0,0,0,.5))",
            /* v1.0.14: WER EINEN SCHLAG UEBERSTEHT, WACKELT. Nicht die Zelle,
               die FIGUR - und sie faellt nicht, sie fasst sich wieder. */
            ...(lastMove && lastMove.damaged && !lastMove.lethal && lastMove.to === i && !ruhig
              ? { animation: "ggShake .5s ease-in-out" } : {}) }}><PieceGlyph piece={{ ...piece, selected: isSel || isSpy, justMoved: !!lastMove && lastMove.to === i && !ruhig }} showLevel={showLevel} pov={pov} artStyle={artStyle} /></div>}
          {/* v1.0.14 (Besitzer): DER SPRINGER LANDET HOERBAR SICHTBAR - ein
              heller Ring faehrt aus dem Feld, auf dem er aufsetzt. Nur fuer
              den Sprung, sonst wird jedes Ziehen zum Ereignis. */}
          {!ruhig && lastMove && lastMove.to === i && piece && piece.kind === "N" && (
            <span key={`ldg${lastMove.id || lastMove.to}`} aria-hidden style={{ position: "absolute",
              left: "50%", top: "72%", width: "58%", height: "24%", borderRadius: "50%",
              border: "1.5px solid rgba(240,214,138,.6)", pointerEvents: "none", zIndex: 5,
              animation: "ggAufprall .42s ease-out forwards" }} />
          )}
          {/* the value orbs live on the SQUARE, not on the piece: one fixed
              em-basis for every figure, so every strip is the same size and
              sits flush with the square's bottom edge — pawn, rook or queen */}
          {piece && !piece.big && piece.atk != null && piece.maxHp > 0 &&
            <div aria-hidden style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 0,
              display: "flex", justifyContent: "center", pointerEvents: "none",
              zIndex: (!ruhig && (isSel || isSpy)) ? 41 : rr + 4 }}>
              <StatTriad piece={piece} focus={isSel || isSpy} />
            </div>}
          {tgt && (tgt.capture
            ? <>
                <div style={{ position: "absolute", inset: 0, background: `${T.danger}1f`, pointerEvents: "none" }} />
                {/* a strike: the same metal drawn as a polished ring around the
                    prey. Built from one radial gradient with a clear centre —
                    no masks, so it renders identically on every engine. */}
                <div style={{ position: "absolute", inset: "7%", borderRadius: "50%", pointerEvents: "none",
                  background: metal.ring,
                  boxShadow: `0 0 9px ${metal.glow}, 0 1px 4px rgba(0,0,0,.5)` }} />
              </>
            : <div style={{ position: "absolute", width: "30%", height: "30%", borderRadius: "50%",
                background: metal.face, border: `1.5px solid ${tgt.special ? "#f6e4a2" : metal.rim}`,
                boxShadow: `0 1px 4px rgba(0,0,0,.6), 0 0 8px ${metal.glow}, inset 0 1px 1px rgba(255,255,255,.5)`,
                pointerEvents: "none" }} />)}
        </div>
      );
    }
  }

  // Integer cell size from the measured box — SSR / first paint fall back to a
  // fluid grid; the client snaps to exact pixels right after mount, so every
  // tile is the same size on every screen (no fr-track rounding drift).
  const GAP0 = 2; // dark seams between the slabs — the board reads as separate stone plates
  // v0.71.4: EIN effektiver Gap fuer ALLES (Besitzer-Fund: bei gap 0 unter
  // seinen Feldern rechnete bw/bh weiter mit Fuge - der Rahmenkasten war
  // 14 px zu gross [schwarzer Streifen rechts+unten] und die Zug-Animation
  // lief versetzt). Layout, Kasten und Animation teilen jetzt dieselbe Zahl.
  const GAP = feld ? 0 : GAP0;
  let cell = 0, tight = false;   // tight = height is the binding constraint
  if (avail.w > 0) {
    // THE FRAME OVERHANG: the gilded rail blooms 2.6 percent past each edge.
    // Without carving that out of the width budget, board+frame overflow the
    // viewport on phones - the page gains sideways scroll and the board reads
    // as shoved off-centre. Dividing by 1.052 keeps rail and all inside.
    // v0.71.5 (Besitzer: "das GESAMTE Brett groesser"): der Sicherheits-
    // teiler schrumpft von 1,052 auf 1,018 - rund +3,3 % Kantenlaenge.
    // v0.71.6 (Besitzer): Teiler faellt GANZ - volle Breite, nur der
    // 1-px-Blockrand bleibt als hauchduenner Schwarzsaum.
    const byW = (Math.min(avail.w, fitBox ? avail.w : maxPx) - (W - 1) * GAP) / W;
    // Reserve HEADROOM above the top rank AND FOOTROOM below the first: a
    // selected piece grows 1.58x from its footpoint, so its head rises almost a
    // full cell over the square — and the value orbs ride a little UNDER the
    // bottom rank. The zoom viewport clips both without this reserve.
    // ... und der Hoehen-Vorhalt wird schlanker (0,78 statt 1,25 Zellen
    // Luft) - die Koepfe der Grundreihe brauchen weniger Reserve als gedacht.
    const byH = fitBox && avail.h > 0 ? (avail.h - (H - 1) * GAP) / (H + 0.62 + 0.16) : Infinity;
    cell = Math.max(8, Math.floor(Math.min(byW, byH)));
    tight = byH <= byW;          // the reserves only need defending when height decides
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
        /* v1.0.30 (Besitzer: "Hintergrund und Schachfeld muessen mehr
           zusammenwachsen"): DAS BRETT WAECHST INS BILD - aber nur so weit,
           wie es SPIELBAR bleibt. Drei Wege wurden am Bild ausprobiert und
           gemessen; zwei sind wieder geflogen:
           - Maske ueber dem Brett: schnitt die Eckfelder an, die Platten
             verloren ihre Tiefe. VERWORFEN.
           - Felder auf 0.92 Deckkraft: der Grund schlug durch, aus Stein
             wurde ein flaues Rautenmuster. VERWORFEN.
           Geblieben ist, was traegt: ein weiter, sehr weicher Schein nach
           aussen, der das Brett in die Landschaft bettet, und ein
           Kantenverlauf DARUEBER, der die harte Aussenkante ausfransen
           laesst - beides ohne die Spielflaeche selbst anzutasten. */
        background: "#05070c",
        // Besitzer-Felder bringen ihren eigenen Rand mit (v0.71): keine Fugen,
        // keine Haarlinie obendrauf - nur der Goldrahmen bleibt.
        border: feld ? "none" : `1px solid ${T.line}`,
        /* Der Schein nach aussen: ein tiefer, sehr weicher Schatten in der
           Farbe der Nacht - das Brett steht damit IM Bild statt darauf. Dazu
           innen ein Hauch, der die Kante bricht. */
        boxShadow: "0 0 44px 26px rgba(5,7,12,.62), 0 18px 60px rgba(0,0,0,.55), inset 0 0 22px rgba(5,7,12,.5)",
        /* KEINE Maske auf dem Brett: der erste Versuch legte einen weichen
           Radialverlauf darueber - und schnitt damit die ECKFELDER an,
           waehrend die Steinplatten ihre Tiefe verloren. Am Bild gemessen
           war es schlechter als vorher. Das Einwachsen leistet allein der
           Schein nach aussen; die Spielflaeche bleibt unangetastet. */
        userSelect: "none", touchAction: "manipulation" }}>
        {ground && !feld && <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `url(${ground})`, backgroundSize: "cover", backgroundPosition: "center" }} />}
        {cells}
        {/* v1.0.30: DIE KANTE FRANST AUS. Ein Verlauf in der Farbe der Nacht
            liegt nur auf den aeussersten Prozenten des Bretts - innen ist er
            vollstaendig durchsichtig, die Spielflaeche bleibt unberuehrt.
            Er nimmt der Aussenkante die Schaerfe, sodass Brett und Gemaelde
            ineinander laufen statt uebereinander zu liegen. */}
        {/* v1.0.34 (Besitzer: "am Kopf der Figuren sieht man die Kante des
            Brettes"): GENAU SO WAR ES, und der Grund lag in den Ebenen. Die
            Zellen tragen zIndex rr+3, die oberste Reihe also 3 - derselbe
            Wert wie dieser Verlauf, der im DOM SPAETER kommt und damit
            gewinnt. Die Koepfe der hinteren Reihe ragen ueber die Brettkante
            hinaus (so ist es gewollt) und liefen deshalb genau in diesen
            Schleier. Er ist ersatzlos fort: die Randweiche macht jetzt jedes
            Randfeld SELBST, hinter seiner Figur. */}
        {/* v1.0.34 (Besitzer): "Das Zickzack ist doof am Rand. Geht gar
            nicht." - fort damit. Die gesprungene Kante aus v1.0.31 ist
            restlos entfernt; an ihre Stelle tritt echte Transparenz an den
            Randfeldern (siehe unten bei den Zellen) und ein weicher
            Schatten nach aussen. */}
        {/* THE GILDED FRAME: an ornate rail laid around every board so the
            field reads as a mounted plate, not a flat grid. Measured on the
            art: the rail's inner edge sits 2.5% in from the image border, so
            an inset of -2.6% lands that edge right on the board's rim — the
            filigree tips kiss the outer squares, the rest blooms outward.
            No z-index: squares beneath it, pieces (z1+), orbs and selection
            above — the back rank stands IN the frame like a showcase. */}
        {/* DER LEBENDE RAHMEN (v0.39.1): gezeichnet statt gemalt - scharf in
            jeder Groesse, ein paar hundert Byte statt 300 KB, und er ERZAEHLT
            die Partie: ein Glanz wandert an den Leisten entlang, die Ecken
            glimmen, und wer die Oberhand hat, faerbt seine Leiste - fuehrt
            der Gegner, zucken oben Riss-Blitze, je klarer sein Vorsprung,
            desto haeufiger. */}
        {/* v0.71.6: bei Besitzer-Feldern faellt der Goldrahmen ganz - die
            Kacheln tragen ihren eigenen Rand. */}
        {!feld && <div aria-hidden style={{ position: "absolute",
          // v0.71.1: mit Koordinaten rueckt der Goldrahmen weiter nach AUSSEN,
          // damit er Buchstaben und Zahlen nicht ueberdeckt (Besitzer).
          // v0.71.4: bei Besitzer-Feldern ruecken die Goldleisten GANZ nach
          // aussen - nichts ueberlappt die Kacheln; mit Koordinaten ohnehin.
          inset: feld ? "-5.6%" : showCoords ? "-4.8%" : "-2.6%", pointerEvents: "none",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,.45))" }}>
          <BrettRahmen lage={lageAusBrett(state.board, pov)} />
        </div>}
        {/* ── THE BIG DRAGON: one sprite over four squares ── */}
        {state.board.map((pc, a) => {
          if (!pc || !pc.big || pc.kind !== "D") return null;
          const f0 = a % W, r0 = (a / W) | 0;
          const dc = flip ? W - 2 - f0 : f0;
          const dr = flip ? r0 : H - 2 - r0;
          const selHere = sel === a;
          // once the dragon is chosen, let taps fall THROUGH to the squares
          // beneath (his step-forward target sits under his own block), so the
          // move markers stay reachable — a re-tap on him still deselects via
          // the wing cells underneath.
          return (
            <div key={"drg" + a} onClick={selHere ? undefined : () => tap(a)} style={{ position: "absolute", zIndex: 2,
              left: `calc(${(dc / W) * 100}% )`, top: `calc(${(dr / H) * 100}% )`,
              width: `${(2 / W) * 100}%`, height: `${(2 / H) * 100}%`,
              display: "grid", placeItems: "center", cursor: interactive ? "pointer" : "default",
              pointerEvents: selHere ? "none" : "auto",
              borderRadius: 10,
              boxShadow: selHere ? "inset 0 0 0 3px rgba(240,214,138,.85), 0 0 18px rgba(240,214,138,.35)" : "none",
              fontSize: `calc(${typeof glyph === "string" ? glyph : glyph + "px"} * 1.88)` }}>
              <PieceGlyph piece={pc} showLevel={showLevel} pov={pov} artStyle={artStyle} focus={selHere} big />
            </div>
          );
        })}

        {/* the material rides on top too: a soft-light wash of the same wood, so
            scratches and grain read across light and dark squares alike */}
        {texture && !ground && <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
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
              background: `linear-gradient(${g.toFixed(0)}deg, transparent 18%, rgba(242,217,140,.05) 34%, rgba(242,217,140,.13) 50%, rgba(242,217,140,.05) 66%, transparent 82%)`,
              animation: "ggSweep 4.6s ease-in-out both" }} />
          </div>;
        })()}
      </div>
      {lastMove && !anim && lastMove.from !== lastMove.to && (() => {
        const a = disp(lastMove.from), b = disp(lastMove.to);
        return (
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {/* v0.71.4 (Besitzer): kein Kreis-Schweif mehr - ein WEICHER
                VERLAUF zeigt den Zug: breiter zarter Strahl darunter, feiner
                hellerer darueber, beide von durchsichtig (Start) zu Gold
                (Ziel), runde Kappen. */}
            <defs>
              <linearGradient id="zugschweif" gradientUnits="userSpaceOnUse"
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}>
                <stop offset="0%" stopColor={T.gold} stopOpacity="0" />
                <stop offset="55%" stopColor={T.gold} stopOpacity="0.16" />
                <stop offset="100%" stopColor={T.gold} stopOpacity="0.42" />
              </linearGradient>
            </defs>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="url(#zugschweif)"
              strokeWidth="3.1" strokeLinecap="round" />
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="url(#zugschweif)"
              strokeWidth="1.3" strokeLinecap="round" opacity="0.9" />
          </svg>
        );
      })()}
      {/* v1.0.14 (Besitzer): DER TREFFER WIRD SICHTBAR. Hier schuettelte
          bisher ein LEERES Feld ueber der Zelle - eine Animation ohne Koerper,
          man sah also nichts. Der Getroffene wackelt jetzt SELBST (unten in
          der Zelle); hier bleibt nur noch der rote Aufschlag-Ring, damit man
          sieht, WO der Schlag sass, ohne dass die Figur faellt. */}
      {/* v1.0.32 (Besitzer: "der Angriff soll sichtbar werden"): DER FUNKE AM
          AUFPRALL. Bisher blieb ein abgewehrter Schlag stumm - die Figur
          stiess vor, kam zurueck, und nichts sagte, dass da etwas AUFGESCHLAGEN
          ist. Jetzt sitzt am Beruehrungspunkt ein kurzer heller Ring, genau
          fuer die Dauer des Aufpralls. Er liegt zwischen den Figuren, nicht
          darueber, und faengt keine Klicks. */}
      {anim && anim.bounced && (() => {
        const a = disp(anim.from), b = disp(anim.to);
        const x = a.x + (b.x - a.x) * 0.46, y = a.y + (b.y - a.y) * 0.46;
        return <div key={`fnk${anim.id}`} aria-hidden style={{ position: "absolute",
          left: `${x}%`, top: `${y}%`, width: `${100 / W * 0.5}%`, height: `${100 / H * 0.5}%`,
          transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 5,
          borderRadius: "50%", border: "2px solid rgba(255,226,168,.85)",
          boxShadow: "0 0 14px rgba(255,206,120,.7), inset 0 0 8px rgba(255,226,168,.5)",
          animation: "ggAufprall .34s ease-out .1s both" }} />;   /* both: bis zum Einsatz unsichtbar, danach ausgeblendet */
      })()}
      {lastMove && lastMove.damaged && !lastMove.lethal && !anim?.bounced && (() => {
        const s = disp(lastMove.to);
        return <div key={`shk${lastMove.id || lastMove.to}`} aria-hidden style={{ position: "absolute",
          left: `${s.l}%`, top: `${s.t}%`, width: `${100 / W}%`, height: `${100 / H}%`,
          pointerEvents: "none", zIndex: 6, display: "grid", placeItems: "center" }}>
          <span style={{ width: "62%", height: "62%", borderRadius: "50%",
            border: "2px solid rgba(216,72,72,.75)", boxShadow: "0 0 10px rgba(216,72,72,.5)",
            animation: "ggAufprall .5s ease-out forwards" }} />
        </div>;
      })()}

      {anim && (() => {
        // The mover is drawn ONCE, as an overlay that is pixel-identical to the
        // piece that will stand in the cell (same lift, size, origin — see the
        // shared pieceLift/pieceFont above). It sits on its DESTINATION cell and
        // slides in FROM the origin as a transform (FROM-offset -> 0), so it
        // lands EXACTLY on its square: transform 0 IS the cell. A leap arcs, a
        // plain move leans, a blocked strike lunges and returns — every one ends
        // neutral, so when the overlay hands off to the cell nothing shifts,
        // grows or blinks. (The old ghost sat centred and smaller, then jumped.)
        const a = disp(anim.from), b = disp(anim.to);
        const dur = anim.dur || (anim.foe ? 0.9 : 0.52);
        const ease = "cubic-bezier(.34,.72,.28,1)";
        const leapEase = "cubic-bezier(.42,.05,.58,.95)";
        // lean INTO the direction of travel — mid-flight only.
        const dxSign = Math.sign(b.l - a.l);
        const dir = dxSign || (Math.sign(b.t - a.t) || 1);
        const tilt = dir * 7;
        // BASE cell: normal move/leap → destination (slide in from origin);
        // a bounce → origin (lunge toward the foe and spring back).
        const base = anim.bounced ? a : b;
        // offset that plants the piece at FROM while its base cell is TO, in %
        // of one cell (translate(-100%) == exactly one cell). Same disp() maths
        // as the grid, so origin and destination line up to the pixel.
        const txStart = (a.l - b.l) * W, tyStart = (a.t - b.t) * H;
        const bx = (b.l - a.l) * W * 0.42, by = (b.t - a.t) * H * 0.42; // lunge vector
        const glideOn = !anim.bounced && anim.phase >= 1;
        const leapNow = anim.leaps && anim.phase === 1 && !anim.bounced;
        const leanNow = !anim.leaps && anim.phase === 1 && !anim.bounced;
        const bounceNow = anim.bounced && anim.phase === 1;
        return (
          <div key={anim.id} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
              style={{ position: "absolute", inset: 0, animation: "arrowFade 1.05s ease forwards" }}>
              {Array.from({ length: 7 }).map((_, k) => {
                const q = (k + 1) / 8;
                return <circle key={k} cx={a.x + (b.x - a.x) * q} cy={a.y + (b.y - a.y) * q}
                  r={0.7 + q * 1.5} fill={T.gold} opacity={0.10 + q * 0.34} />;
              })}
              <circle cx={b.x} cy={b.y} r="3.1" fill={T.gold} opacity="0.16" />
              <circle cx={b.x} cy={b.y} r="1.5" fill={T.gold} opacity="0.55" />
            </svg>
            {anim.phase < 2 && <div key={`g${anim.id}`} style={{ position: "absolute",
              left: `${base.l}%`, top: `${base.t}%`,
              width: `${100 / W}%`, height: `${100 / H}%`, zIndex: 7,
              // OUTER = board glide. Destination-based, so transform 0 lands the
              // piece dead-centre on its cell. No transition in phase 0 (planted
              // at FROM); phase 1 switches it on and carries it home.
              transform: anim.bounced ? "none" : (glideOn ? "translate(0%,0%)" : `translate(${txStart}%, ${tyStart}%)`),
              transition: anim.bounced ? "none" : (glideOn ? `transform ${dur}s ${anim.leaps ? leapEase : ease}` : "none"),
              display: "grid", placeItems: "center" }}>
              {/* MIDDLE = the hop arc / lean / lunge — all end neutral */}
              <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center",
                ...(leapNow ? { animation: `ggLeapArc ${dur}s cubic-bezier(.4,.12,.5,1) forwards` }
                  : leanNow ? { ["--tilt"]: `${tilt}deg`, animation: `ggLean ${dur}s ${ease} forwards` }
                  : bounceNow ? { ["--bx"]: `${bx}%`, ["--by"]: `${by}%`, animation: `ggBounce ${dur}s ease-in-out forwards` }
                  : {}) }}>
                {/* INNER = the piece, IDENTICAL geometry to the cell version */}
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                  transform: `translateY(${pieceLift})`, transformOrigin: PIECE_ORIGIN,
                  fontSize: pieceFont(anim.piece.kind),
                  filter: "drop-shadow(0 0.06em 0.09em rgba(0,0,0,.5))" }}>
                  <PieceGlyph piece={anim.piece} showLevel={showLevel} pov={pov} artStyle={artStyle} fliegt />
                </div>
              </div>
            </div>}
          </div>
        );
      })()}

      {/* the FALLEN: spins off and lands exactly on its captor's tray */}
      {death && <DeathFlyer death={death} disp={disp} W={W} H={H} pov={pov} artStyle={artStyle} />}
      {sterne && sterne.list.map((e, i) => {
        const d = disp(e.at);
        return (
          <span key={sterne.id + "-" + i} aria-hidden style={{ position: "absolute",
            left: d.x + "%", top: d.y + "%", width: (118 / W) + "%", height: (118 / H) + "%",
            transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 6 }}>
            <span style={{ position: "absolute", inset: 0, opacity: 0,
              animation: "ggRissStern 2.5s cubic-bezier(.2,.7,.3,1) both",
              animationDelay: e.delay + "ms" }}>
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <radialGradient id={"ggStGl" + i} cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#e9defd" stopOpacity=".95" />
                  <stop offset="34%" stopColor="#a78bfa" stopOpacity=".55" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </radialGradient>
                <circle cx="50" cy="50" r="46" fill={"url(#ggStGl" + i + ")"} />
                {/* der Stern: vier lange, vier kurze Zacken - eine Sternschnuppe im Stand */}
                <path d="M50 6 L55.5 42 L50 50 L44.5 42 Z M94 50 L58 55.5 L50 50 L58 44.5 Z M50 94 L44.5 58 L50 50 L55.5 58 Z M6 50 L42 44.5 L50 50 L42 55.5 Z"
                  fill="#d8ccfb" />
                <path d="M74 26 L54.5 45.5 L50 50 L58 42 Z M74 74 L54.5 54.5 L50 50 L58 58 Z M26 74 L45.5 54.5 L50 50 L42 58 Z M26 26 L45.5 45.5 L50 50 L42 42 Z"
                  fill="#b9a4f7" opacity=".85" />
                <circle cx="50" cy="50" r="6.5" fill="#f2ecff" />
              </svg>
            </span>
          </span>
        );
      })}
    </div>
  );
  // MEASURED (390x844 phone): this box aligned its content to the END, so on a
  // width-limited board every scrap of spare height piled up ABOVE it — 437px
  // of sky over the board and 47px under it. The reserves are real (a selected
  // piece grows 1.58x and its head clears almost a full cell; the value orbs
  // ride under the bottom rank), so they stay — but as PADDING, with the board
  // centred in what remains. Slack now falls evenly above and below.
  // When HEIGHT is the binding constraint the reserves must be held as padding
  // or a selected piece's head gets clipped. When WIDTH decides — every phone
  // in portrait — there is slack to spare, so the board simply sits centred and
  // the head room comes free. That is the difference between a board resting
  // mid-screen and one shoved against the bottom rail.
  if (fitBox) return <div ref={wrapRef} style={{ position: "absolute", inset: 0, display: "grid",
    alignItems: "center", justifyItems: "center",
    paddingTop: tight && cell ? Math.round(cell * 0.95) : 0,
    paddingBottom: tight && cell ? Math.round(cell * 0.3) : 0 }}>{board}</div>;
  return <div ref={wrapRef} style={{ width: "100%" }}>{board}</div>;
}
