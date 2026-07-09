// Campaign — a HORIZONTAL illustrated journey, now a full-screen WINDOW onto
// the world: the map IS the screen (100dvh minus the app header), every piece
// of UI floats above it. The Gleamhold stands on the left, the crimson LIGA
// keep on the far right; the dotted trail winds through four chapters of
// parchment landscape. The wanderer is the hero — the camera follows him, the
// medallions are waypoints (small), and the node detail lives in a parchment
// panel embedded in the map right where you arrive.
import { useEffect, useMemo, useRef, useState } from "react";
import { CAMPAIGN, nodeById, BRANCHES, campaignTag, mapById, CHARACTERS, CHAPTERS } from "../../../content/index.js";
import { nodeStatus, currentNodeId, clearedCount, campaignLength, nodeBossSpec, leagueRewardMult, seaAccessible, gateOf, tollCost } from "../../../meta/index.js";
import { ITEMS, hasItem } from "../../../content/index.js";
import { T } from "../theme.js";
import { Button, Chip } from "../primitives.jsx";
import { PieceArt } from "../board/PieceArt.jsx";
import { ItemIcon } from "../ItemIcon.jsx";
import { ElementIcon, GoldCoin } from "../icons.jsx";
import { useMedia } from "../../App.jsx";
import { MP, GEO, buildCampaignScenery, themeForLeague, Pine, Leafy, Rock, RidgeCluster, Cloud, Keep, Cottage, Mill, Bridge, Field, Boat, Birds, Mist, Wisp, StoneCircle, Crystal, DeadTree, RuinArch, Cactus, Dune, Grass, SnowDrift, Palm, Wave, Isle, Lighthouse } from "../mapArt.jsx";

// ── geometry (pixels; shared with previews via mapArt.GEO) ───────────────────
const { STEP, LANE, LEFT, TOPPAD, WMAP, HMAP, nx, ny } = GEO;

// v0.3 map immersion: medallions ~30% smaller (46 → 32), wanderer ~40% larger
// (34×36 → 48×50) — he is the hero, the stations are just waypoints.
const MEDAL = 32, MEDAL_ART = 22, HIT = 44;
// parchment palette for the embedded node panel — map-world UI, not app chrome
const PP = { bg: "linear-gradient(170deg, #f4eee0, #ece4cf)", bg2: "#e7dfc9", line: "#c9bfa4",
  ink: MP.ink, dim: "#6f6752", chipInk: "#4a4433", green: "#3e7d47" };

function useScenery(th) {
  return useMemo(() => {
    const n02 = nodeById("n02");
    const millAt = { x: nx(n02) + 44, y: ny(n02) - 52 };
    const sc = buildCampaignScenery(CAMPAIGN.map((n) => ({ x: nx(n), y: ny(n) })), millAt, th);
    return { ...sc, millAt };
  }, [th]);
}

const Swords = ({ c = MP.ivory, size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}><path d="M5 5 L17 17 M19 5 L7 17 M5 5 L8 5 M5 5 L5 8 M19 5 L16 5 M19 5 L19 8 M8.4 15.6 L6 20 M15.6 15.6 L18 20" stroke={c} strokeWidth="1.9" strokeLinecap="round" fill="none" /></svg>
);
const CrownIc = ({ c = "#f2d98c", size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size}><path d="M4 17 L5.2 8.5 L9 12 L12 6.5 L15 12 L18.8 8.5 L20 17 Z" fill={c} /><path d="M5.5 19.5 L18.5 19.5" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>
);

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const CAM_EASE = "cubic-bezier(.45,.05,.35,1)";

export function CampaignScreen({ profile, dispatch, t, onStart, onBack }) {
  const en = profile.lang === "en";
  const wide = useMedia("(min-width: 900px)");
  const league = profile.campaign?.league || 1;
  const th = themeForLeague(league);
  const mult = leagueRewardMult(league);
  const [sel, setSel] = useState(() => currentNodeId(profile));
  const [token, setToken] = useState(() => ({ at: currentNodeId(profile), moving: false }));
  const [panelOpen, setPanelOpen] = useState(true);
  const walkT = useRef(null);
  function walkTo(id) {
    const stT = nodeStatus(profile, id);
    if (id === token.at || stT === "locked" || stT === "hidden") return;
    clearTimeout(walkT.current);
    setToken({ at: id, moving: true });
    walkT.current = setTimeout(() => setToken({ at: id, moving: false }), 760);
  }
  const scenery = useScenery(th);
  // the viewport: fills the whole screen below the header; we measure it and
  // fit-scale the map so the parchment always covers it (no letterboxing)
  const vpRef = useRef(null);
  const [vp, setVp] = useState({ w: 720, h: 560 });
  useEffect(() => {
    const el = vpRef.current;
    if (!el) return;
    const measure = () => { const w = el.clientWidth, h = el.clientHeight; if (w > 0 && h > 0) setVp({ w, h }); };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    window.addEventListener("resize", measure);
    return () => { ro?.disconnect(); window.removeEventListener("resize", measure); };
  }, []);
  const [zi, setZi] = useState(0); // zoom step on top of the cover-fit scale
  const cur = currentNodeId(profile);
  const node = nodeById(sel);
  const status = nodeStatus(profile, sel);
  const boss = node?.boss ? nodeBossSpec(node) : null;
  const unlockCh = node?.boss?.piece ? CHARACTERS[node.boss.piece] : null;
  const known = unlockCh ? (profile.campaign?.unlocked || []).includes(unlockCh.id) : true;
  const order = useMemo(() => Object.fromEntries(CAMPAIGN.map((n, i) => [n.id, i + 1])), []);
  const edges = useMemo(() => CAMPAIGN.flatMap((a) => a.next.map((tid) => ({ a, b: nodeById(tid) }))), []);

  // camera target = the Grand Gambit's position (he leads, the map follows)
  const camNode = nodeById(token.at) || nodeById(cur);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fit = Math.max(vp.h / HMAP, vp.w / WMAP);       // cover the viewport
  const z = fit * [1, 1.3, 1.65][zi];
  const camX = clamp(nx(camNode) * z - vp.w * 0.46, 0, Math.max(0, WMAP * z - vp.w));
  const camY = clamp(ny(camNode) * z - vp.h * 0.5, 0, Math.max(0, HMAP * z - vp.h));
  // fog of war: everything past the frontline stays a blurred rumour until
  // the league's end boss falls — the map never spoils the road ahead
  const frontierX = useMemo(() => {
    let fx = 0;
    for (const n of CAMPAIGN) {
      const st = nodeStatus(profile, n.id);
      if (st === "available" || st === "cleared" || st === "gated") fx = Math.max(fx, nx(n));
    }
    return fx + 88;
  }, [profile]);

  // ── the embedded node panel: parchment overlay near the selected medallion,
  //    projected into viewport coords so text never scales with zoom ─────────
  const seaLock = th.sea && !seaAccessible(profile);
  const px = node ? nx(node) * z - camX : 0;
  const py = node ? ny(node) * z - camY : 0;
  const panelW = Math.min(340, vp.w - 20);
  const panelLeft = clamp(px - panelW / 2, 10, Math.max(10, vp.w - panelW - 10));
  const above = py > vp.h * 0.52;                        // node low → panel above it
  const gapUp = Math.round(62 * z + 12);                 // clear the hero standing on the node
  const gapDown = Math.round(40 * z + 10);               // clear medallion + label block
  const panelPos = above
    ? { bottom: clamp(vp.h - py + gapUp, wide ? 14 : 104, Math.max(120, vp.h - 150)) }
    : { top: clamp(py + gapDown, 58, Math.max(58, vp.h - 200)) };
  const showPanel = panelOpen && !!node && !token.moving && !seaLock;

  return (
    <div style={{ position: "relative", overflow: "hidden", flex: "1 1 auto", minHeight: 0, height: "100%" }}>
      {/* the wanderer's window onto the world — the map fills the screen */}
      <div ref={vpRef} style={{ position: "absolute", inset: 0, overflow: "hidden", background: th.paper,
        touchAction: "manipulation",
        ...(seaLock ? { pointerEvents: "none", filter: "saturate(.55) brightness(.8)" } : {}) }}>
        <div style={{ position: "relative", width: WMAP, height: HMAP, transformOrigin: "0 0",
          transform: `translate(${-camX}px, ${-camY}px) scale(${z})`,
          transition: `transform .72s ${CAM_EASE}` }}>
          <svg width={WMAP} height={HMAP} viewBox={`0 0 ${WMAP} ${HMAP}`} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <linearGradient id="wash" x1="0" y1="0" x2="1" y2="0">
                {th.wash.map(([off, col, op], i) => <stop key={i} offset={off} stopColor={col} stopOpacity={op} />)}
              </linearGradient>
            </defs>
            <rect width={WMAP} height={HMAP} fill="url(#wash)" />
            {/* river along the south + a small lake */}
            {th.river && <>
              <path d={`M0 ${HMAP - 34} C ${WMAP * 0.2} ${HMAP - 52}, ${WMAP * 0.36} ${HMAP - 16}, ${WMAP * 0.55} ${HMAP - 34} S ${WMAP * 0.85} ${HMAP - 18}, ${WMAP} ${HMAP - 40}`}
                fill="none" stroke={th.river} strokeWidth="10" strokeLinecap="round" opacity={th.frozen ? 0.85 : 0.6}
                strokeDasharray={th.frozen ? "14 6" : "none"} />
              <ellipse cx={WMAP * 0.235} cy={HMAP - 40} rx="46" ry="13" fill={th.river} opacity={th.frozen ? 0.8 : 0.55} />
            </>}
            {/* chapter dividers */}
            {CHAPTERS.slice(1).map((c) => {
              const x = LEFT + (c.fromRow - 0.5) * STEP;
              return <path key={"cd" + c.n} d={`M${x} ${TOPPAD - 20} L${x} ${HMAP - 54}`} stroke={MP.trailDim} strokeWidth="1.4" strokeDasharray="2 7" opacity=".7" />;
            })}
            {/* the north river + crossings */}
            {th.river && <path d={scenery.river2} fill="none" stroke={th.river} strokeWidth="8" strokeLinecap="round" opacity={th.frozen ? 0.8 : 0.55} strokeDasharray={th.frozen ? "12 6" : "none"} />}
            {scenery.clouds.map((c, i) => Cloud({ ...c, k: "cl" + i }))}
            {scenery.ridges.map((m, i) => RidgeCluster({ ...m, k: "ri" + i }))}
            {scenery.dunes.map((m, i) => Dune({ ...m, k: "du" + i }))}
            {scenery.floors.map((f, i) => <ellipse key={"fl" + i} cx={f.x} cy={f.y + 6} rx={f.rx + 14} ry={f.ry + 7}
              fill={MP.pineDark} opacity={f.o} />)}
            {scenery.drifts.map((m, i) => SnowDrift({ ...m, k: "sd" + i }))}
            {scenery.isles.map((m, i) => Isle({ ...m, k: "is" + i }))}
            {th.sea && CAMPAIGN.map((n, i) => Isle({ x: nx(n), y: ny(n) + 14, s: 1.05, k: "nis" + i }))}
            {scenery.mistsBack.map((m, i) => Mist({ ...m, k: "mb" + i }))}
            {scenery.stonesAt && StoneCircle({ ...scenery.stonesAt, s: 1.05, k: "stones" })}
            {scenery.ruin && RuinArch({ x: nx(nodeById("e1")) - 56, y: ny(nodeById("e1")) + 30, s: 1, k: "ruin" })}
            {scenery.crystals.map((m, i) => Crystal({ ...m, k: "cr" + i }))}
            {scenery.rocks.map((m, i) => Rock({ ...m, k: "ro" + i }))}
            {scenery.grass.map((m, i) => Grass({ ...m, k: "gr" + i }))}
            {scenery.leafy.map((m, i) => Leafy({ ...m, k: "le" + i }))}
            {scenery.blossoms.map((m, i) => Leafy({ ...m, k: "bl" + i }))}
            {scenery.cacti.map((m, i) => Cactus({ ...m, k: "ca" + i }))}
            {th.settle && scenery.fields.map((m, i) => Field({ ...m, k: "fi" + i }))}
            {scenery.cottages.map((m, i) => Cottage({ ...m, k: "co" + i }))}
            {th.settle && Mill({ ...scenery.millAt, s: 1.05, k: "mill" })}
            {th.river && !th.sea && Boat({ x: WMAP * 0.235 + 10, y: HMAP - 42, s: 1, k: "boat" })}
            {scenery.oasis && <>
              <ellipse cx={scenery.oasis.x} cy={scenery.oasis.y + 8} rx="42" ry="12" fill="#7fb3c9" opacity=".8" />
              {Palm({ x: scenery.oasis.x - 30, y: scenery.oasis.y - 10, s: 1, k: "pa1" })}
              {Palm({ x: scenery.oasis.x + 26, y: scenery.oasis.y - 14, s: 0.85, k: "pa2" })}
            </>}
            {scenery.birds.map((m, i) => Birds({ ...m, k: "bi" + i }))}
            {scenery.farPines.map((m, i) => Pine({ ...m, k: "fp" + i }))}
            {scenery.pines.map((m, i) => Pine({ ...m, k: "pi" + i }))}
            {scenery.deadTrees.map((m, i) => DeadTree({ ...m, k: "dt" + i }))}
            {scenery.mistsFront.map((m, i) => Mist({ ...m, k: "mf" + i }))}
            {scenery.waves.map((m, i) => Wave({ ...m, k: "wa" + i }))}
            {scenery.wisps.map((m, i) => Wisp({ ...m, k: "wi" + i }))}
            {(th.mystic?.wisps || 0) > 0 && [0, 1, 2].map((i) => Wisp({ x: nx(nodeById("n03")) - 34 + i * 30, y: ny(nodeById("n03")) - 40 + (i % 2) * 14, s: 0.9, k: "sw" + i }))}
            {/* dotted trail */}
            {edges.map(({ a, b }, i) => {
              const x1 = nx(a), y1 = ny(a), x2 = nx(b), y2 = ny(b), xm = (x1 + x2) / 2;
              if (nodeStatus(profile, a.id) === "hidden" || nodeStatus(profile, b.id) === "hidden") return null;
              const gated = nodeStatus(profile, b.id) === "gated";
              const done = nodeStatus(profile, a.id) === "cleared" && !gated && nodeStatus(profile, b.id) !== "locked";
              return <path key={"e" + i} d={`M${x1} ${y1} C ${xm} ${y1}, ${xm} ${y2}, ${x2} ${y2}`} fill="none"
                stroke={gated ? "#7a6a94" : done ? MP.trail : MP.trailDim} strokeWidth={gated ? 3.5 : 4.5} strokeLinecap="round"
                strokeDasharray={gated ? "6 6" : "0.5 9.5"} opacity={gated ? 0.5 : done ? 0.95 : 0.62} />;
            })}
            {th.river && th.settle && [(ny({ col: 0 }) + ny({ col: 2 })) / 2, ny({ col: 2 }), (ny({ col: 4 }) + ny({ col: 2 })) / 2].map((y, i) =>
              Bridge({ x: scenery.riverXAt(y), y, s: 1.05, k: "br" + i }))}
            {th.sea ? <>
              {Isle({ x: 62, y: ny({ col: 2 }) + 12, s: 1.15, k: "ki1" })}
              {Lighthouse({ x: 62, y: ny({ col: 2 }) - 4, s: 1.1, k: "k1" })}
            </> : Keep({ x: 62, y: ny({ col: 2 }) - 6, s: 1.15, fill: MP.medal, k: "k1" })}
            {th.sea ? <>
              {Isle({ x: WMAP - 84, y: ny({ col: 2 }) + 16, s: 1.6, k: "ki2" })}
              {Lighthouse({ x: WMAP - 84, y: ny({ col: 2 }) - 8, s: 1.55, k: "k2" })}
            </> : Keep({ x: WMAP - 84, y: ny({ col: 2 }) - 10, s: 1.7, fill: MP.liga, k: "k2" })}
          </svg>

          {/* chapter banners */}
          {CHAPTERS.map((c) => (
            <div key={"ch" + c.n} className="gg-serif" style={{ position: "absolute", top: 12,
              left: LEFT + ((c.fromRow + c.toRow) / 2) * STEP, transform: "translateX(-50%)",
              background: "#efe9da", border: "1px solid #c9bfa4", borderRadius: 999, padding: "3px 12px",
              fontSize: 10.5, letterSpacing: ".14em", color: MP.ink, whiteSpace: "nowrap", boxShadow: "0 2px 6px rgba(0,0,0,.12)" }}>
              {(en ? "CHAPTER " : "KAPITEL ")}{["I", "II", "III", "IV"][c.n - 1]} · {(en ? c.titleEn : c.titleDe).toUpperCase()}
            </div>
          ))}
          <div className="gg-serif" style={{ position: "absolute", top: ny({ col: 2 }) - 74, left: WMAP - 84, transform: "translateX(-50%)",
            color: MP.liga, fontSize: 19, letterSpacing: ".22em", fontWeight: 700, whiteSpace: "nowrap" }}>❖ LIGA {ROMAN[league - 1] || league} ❖</div>
          <div className="gg-serif" style={{ position: "absolute", top: ny({ col: 2 }) + 22, left: 62, transform: "translateX(-50%)",
            color: MP.ink, fontSize: 10.5, letterSpacing: ".2em" }}>START</div>

          {/* branch ribbons */}
          {[{ id: "blades", n: nodeById("a1"), above: true }, { id: "magic", n: nodeById("b1"), above: true },
            { id: "order", n: nodeById("c1"), above: false }, { id: "power", n: nodeById("d1"), above: true },
            { id: "wisdom", n: nodeById("e1"), above: false }].map(({ id, n, above: rAbove }) => (
            <div key={id} style={{ position: "absolute", left: nx(n), top: ny(n) + (rAbove ? -58 : 48), transform: "translateX(-50%)",
              display: "flex", alignItems: "center", gap: 5, background: "#efe9da", border: `1px solid #c9bfa4`,
              borderRadius: 999, padding: "3px 9px", boxShadow: "0 2px 6px rgba(0,0,0,.15)", whiteSpace: "nowrap" }}>
              <ElementIcon id={BRANCHES[id].icon} color={MP.ink} size={13} />
              <span className="gg-serif" style={{ fontSize: 10.5, letterSpacing: ".08em", color: MP.ink }}>{BRANCHES[id][en ? "nameEn" : "nameDe"]}</span>
            </div>
          ))}

          {/* medallions + labels — small waypoints now; the wanderer is the star */}
          {CAMPAIGN.map((n) => {
            const st = nodeStatus(profile, n.id);
            const isSel = sel === n.id, isCur = cur === n.id;
            const pieceCh = n.boss?.piece ? CHARACTERS[n.boss.piece] : null;
            const pure = n.boss?.pure ? nodeBossSpec(n) : null;
            const below = n.col <= 2; // labels toward the free side of the lane
            if (st === "hidden") return null;
            const ringCol = st === "locked" ? "#8d8672" : st === "gated" ? "#8a6fb0" : st === "cleared" ? "#7c5f3d" : T.gold;
            return (
              <div key={n.id} style={{ position: "absolute", left: nx(n), top: ny(n), transform: "translate(-50%,-50%)" }}>
                <button onClick={() => { setSel(n.id); setPanelOpen(true); walkTo(n.id); }}
                  style={{ width: HIT, height: HIT, background: "none", border: "none", padding: 0, cursor: "pointer",
                    position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: st === "locked" ? 0.55 : st === "gated" ? 0.85 : 1 }}>
                  <div style={{ width: MEDAL, height: MEDAL, borderRadius: "50%",
                    background: MP.medal, border: `2px solid ${ringCol}`,
                    boxShadow: isSel ? `0 0 0 3px ${T.gold}55, 0 2px 6px rgba(0,0,0,.35)` : "0 2px 6px rgba(0,0,0,.3)",
                    animation: isCur ? "herePulse 1.8s ease-in-out infinite" : "none",
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {pieceCh ? <div style={{ width: MEDAL_ART, height: MEDAL_ART }}>
                        <PieceArt kind={pieceCh.kind} fill={MP.ivory} rim="#c9a45c" detail={MP.medal} size="100%" level={1} /></div>
                      : pure ? <div style={{ width: MEDAL_ART, height: MEDAL_ART }}>
                        <PieceArt kind="X" art={pure.art} fill={MP.ivory} rim="#c9a45c" accent={n.id === "n22" ? "#f2d98c" : T.danger} size="100%" /></div>
                      : n.id === "n22" ? (((league - 1) % 10) + 1 === 9
                          ? <div style={{ width: MEDAL_ART, height: MEDAL_ART }}><PieceArt kind="V" fill={MP.ivory} rim="#c9a45c" detail={MP.medal} size="100%" level={1} /></div>
                          : <CrownIc />) : <Swords />}
                  </div>
                  {st === "cleared" && <span style={{ position: "absolute", top: 2, right: 2, width: 13, height: 13, borderRadius: "50%",
                    background: T.gold, color: "#17110a", fontSize: 8.5, fontWeight: 900, display: "flex", alignItems: "center",
                    justifyContent: "center", border: "1.5px solid #efe9da" }}>✓</span>}
                  {st === "gated" && <span style={{ position: "absolute", bottom: 2, right: 1, fontSize: 11,
                    filter: "drop-shadow(0 1px 1px rgba(0,0,0,.4))" }}>{gateOf(n)?.item ? <ItemIcon id={gateOf(n).item} size={11} style={{ display: "inline-block", verticalAlign: "-2px" }} /> : gateOf(n)?.gold ? <GoldCoin size={11} style={{ verticalAlign: "-2px" }} /> : "🔒"}</span>}
                  {n.boss && st !== "cleared" && st !== "gated" && <span style={{ position: "absolute", bottom: 3, right: 3, width: 12.5, height: 12.5,
                    borderRadius: "50%", background: T.danger, display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1.5px solid #efe9da", fontSize: 7 }}>☠</span>}
                </button>
                <div style={{ position: "absolute", left: "50%", [below ? "top" : "bottom"]: 27, transform: "translateX(-50%)",
                  width: 96, textAlign: "center", opacity: st === "locked" ? 0.55 : st === "gated" ? 0.85 : 1, pointerEvents: "none" }}>
                  <span style={{ display: "inline-flex", minWidth: 14, height: 13, background: MP.ink, color: "#efe9da", fontSize: 8.5,
                    fontWeight: 800, borderRadius: 4, alignItems: "center", justifyContent: "center", padding: "0 3px",
                    verticalAlign: "middle", marginRight: 3 }}>{order[n.id]}</span>
                  <span className="gg-serif" style={{ fontSize: 10, letterSpacing: ".05em", color: MP.ink, lineHeight: 1.15,
                    textShadow: `0 1px 0 ${th.paper}, 0 -1px 0 ${th.paper}, 1px 0 0 ${th.paper}, -1px 0 0 ${th.paper}` }}>{n.place}</span>
                  <span style={{ display: "block", marginTop: 2 }}>
                    {(() => {
                      const base = n.difficulty === "easy" ? 1 : n.difficulty === "normal" ? 2 : 3;
                      const pips = Math.min(4, base + (n.bump ? 1 : 0) + (league - 1));
                      const col = pips <= 1 ? "#4d7a45" : pips === 2 ? "#8a6f4d" : pips === 3 ? "#a1512e" : "#8e2f39";
                      return Array.from({ length: 4 }).map((_, k) => (
                        <span key={k} style={{ display: "inline-block", width: 4.5, height: 4.5, borderRadius: "50%",
                          margin: "0 1.5px", background: k < pips ? col : "#c9bfa4" }} />
                      ));
                    })()}
                  </span>
                </div>
                {isCur && <div className="gg-serif" style={{ position: "absolute", left: "50%", [below ? "bottom" : "top"]: 30,
                  transform: "translateX(-50%)", fontSize: 9, letterSpacing: ".08em", color: "#8a6f4d", whiteSpace: "nowrap",
                  pointerEvents: "none" }}>{below ? "▴" : "▾"} {t("camp.current")}</div>}
              </div>
            );
          })}
          {/* the traveller — the Grand Gambit walks the trail, larger than life */}
          {(() => {
            const tn = nodeById(token.at);
            if (!tn) return null;
            return <div style={{ position: "absolute", left: nx(tn), top: ny(tn), width: 48, height: 50, zIndex: 5,
              pointerEvents: "none", transition: `left .72s ${CAM_EASE}, top .72s ${CAM_EASE}`,
              transform: "translate(-50%,-118%)",
              animation: token.moving ? "walkBob .3s ease-in-out infinite" : "idleBob 2.4s ease-in-out infinite",
              filter: "drop-shadow(0 4px 5px rgba(0,0,0,.45))" }}>
              {th.sea && hasItem(profile, "boat") && <div style={{ position: "absolute", left: "50%", bottom: -10, transform: "translateX(-50%)", width: 58, height: 29 }}>
                <svg viewBox="-22 -14 44 22" width="100%" height="100%">{Boat({ x: 0, y: 0, s: 1, k: "tb" }).props.children}</svg>
              </div>}
              <PieceArt kind="P" fill="#c9a45c" rim="#7a5c26" detail="#7a5c26" size="100%" level={1} hero />
            </div>;
          })()}
          {frontierX < WMAP - 60 && (
            <div style={{ position: "absolute", top: 0, bottom: 0, left: frontierX, right: 0, zIndex: 5,
              pointerEvents: "none", backdropFilter: "blur(3.5px) saturate(.7) brightness(.98)",
              WebkitBackdropFilter: "blur(3.5px) saturate(.7) brightness(.98)",
              background: `linear-gradient(90deg, transparent, ${th.paper}66 90px, ${th.paper}8c)`,
              WebkitMaskImage: "linear-gradient(90deg, transparent, #000 80px)",
              maskImage: "linear-gradient(90deg, transparent, #000 80px)" }} />
          )}
        </div>
      </div>

      {/* floating chrome: back pill + league badge (left), zoom (right) */}
      <div style={{ position: "absolute", top: 10, left: 10, right: 10, zIndex: 8, display: "flex",
        alignItems: "center", gap: 8, pointerEvents: "none" }}>
        {onBack && (
          <button onClick={onBack} style={{ pointerEvents: "auto", display: "inline-flex", alignItems: "center", gap: 6,
            cursor: "pointer", background: "#0d1017d9", border: `1.5px solid ${T.gold}88`, color: T.gold, borderRadius: 999,
            padding: "8px 14px 8px 10px", fontFamily: "inherit", fontWeight: 800, fontSize: 13.5,
            boxShadow: "0 3px 10px rgba(0,0,0,.4)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>‹</span> {t("common.back")}
          </button>
        )}
        <div className="gg-serif" style={{ background: "#0d1017d9", border: `1px solid ${T.line}`, color: T.gold,
          borderRadius: 999, padding: "8px 13px", fontSize: 12, letterSpacing: ".08em", whiteSpace: "nowrap",
          overflow: "hidden", textOverflow: "ellipsis", minWidth: 0, boxShadow: "0 3px 10px rgba(0,0,0,.4)",
          backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>
          {wide ? `${t("camp.title")} · ` : ""}{t("camp.leagueNo", { r: ROMAN[league - 1] || league })}
          <span style={{ color: T.dim }}> · {clearedCount(profile)}/{campaignLength(profile)}</span>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", gap: 6, pointerEvents: "auto" }}>
          {[["−", -1], ["+", 1]].map(([lbl, d]) => (
            <button key={lbl} onClick={() => setZi((i) => clamp(i + d, 0, 2))}
              style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${T.gold}77`,
                background: "#0d1017d9", color: T.gold, fontSize: 18, fontWeight: 800, cursor: "pointer",
                fontFamily: "inherit", boxShadow: "0 3px 10px rgba(0,0,0,.4)",
                backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}>{lbl}</button>
          ))}
        </div>
      </div>

      {/* embedded node panel — parchment overlay near the medallion; arrival is
          part of the world, not a card below the map */}
      {showPanel && (
        <div key={sel + (token.at === sel ? "@" : "")} style={{ position: "absolute", left: panelLeft, width: panelW, ...panelPos,
          zIndex: 7, background: PP.bg, border: `1px solid ${PP.line}`, borderRadius: 12, color: PP.ink,
          boxShadow: "0 12px 32px rgba(30,25,15,.38), inset 0 1px 0 #fffef98c", padding: "11px 12px 12px",
          animation: "rise .26s ease", maxHeight: Math.max(160, vp.h - 140), overflowY: "auto",
          transition: `left .72s ${CAM_EASE}, top .72s ${CAM_EASE}, bottom .72s ${CAM_EASE}` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
            <span style={{ display: "inline-flex", minWidth: 17, height: 16, background: MP.ink, color: "#efe9da", fontSize: 10,
              fontWeight: 800, borderRadius: 4, alignItems: "center", justifyContent: "center", padding: "0 4px", flex: "0 0 auto",
              transform: "translateY(-1px)" }}>{order[sel]}</span>
            <div className="gg-serif" style={{ fontSize: 17.5, letterSpacing: ".04em", color: PP.ink, flex: 1, minWidth: 0 }}>{node?.place}</div>
            <button onClick={() => setPanelOpen(false)} aria-label="Close" style={{ background: "none", border: "none",
              color: PP.dim, fontSize: 15, cursor: "pointer", padding: "0 0 0 6px", fontFamily: "inherit", lineHeight: 1, flex: "0 0 auto" }}>✕</button>
          </div>
          {node?.storyDe && <div className="gg-serif" style={{ fontSize: 12.5, color: PP.dim, marginTop: 4, fontStyle: "italic", lineHeight: 1.45 }}>
            {en ? node.storyEn : node.storyDe}</div>}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 9 }}>
            <Chip color={PP.chipInk} bg={PP.bg2}>{mapById(node.map)[en ? "nameEn" : "nameDe"]}</Chip>
            <Chip color={PP.chipInk} bg={PP.bg2}>{t("mode." + node.rules)}</Chip>
            <Chip color={PP.chipInk} bg={PP.bg2}>{t("diff." + node.difficulty)}{node.bump ? ` +${node.bump}` : ""}</Chip>
            <Chip color={"#3c4a22"} bg={"#d3deb2"}>+{Math.round((node.reward?.xp || 0) * mult)} XP</Chip>
            <Chip color={"#17110a"} bg={"#e8c96a"}>🪙 +{Math.round((5 + 2 * node.row + (node.boss ? 6 : 0)) * mult)}</Chip>
          </div>
          {boss && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "8px 10px",
              background: PP.bg2, borderRadius: 9, border: `1px solid ${PP.line}` }}>
              <div style={{ width: 40, height: 40, flex: "0 0 auto" }}>
                <PieceArt kind={boss.kind} art={boss.art} fill={unlockCh ? "#c9a45c" : "#242d44"} rim={unlockCh ? "#f0dfae" : "#93a0bb"}
                  detail={unlockCh ? "#59421a" : "#9aa8c6"} accent={boss.accent || T.gold} size="100%" level={1} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: MP.liga }}>☠ {t("camp.boss")}: <span style={{ color: PP.ink }}>{boss.name[en ? "en" : "de"]}</span></div>
                <div style={{ fontSize: 12, color: PP.dim, marginTop: 2 }}>
                  ♥ {boss.hp} · ⚔ {boss.atk}{unlockCh ? <> · <span style={{ color: "#8a6f4d", fontWeight: 700 }}>{t("camp.recruit")}: {unlockCh[en ? "nameEn" : "nameDe"]}</span></> : null}
                  {!known && <> · {t("camp.unknown")}</>}
                </div>
              </div>
            </div>
          )}
          {status === "gated" ? (() => {
            const g = gateOf(node);
            if (g.gold) {
              const cost = tollCost(node, profile.campaign?.league || 1);
              const have = profile.gold || 0;
              const can = have >= cost;
              return <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "9px 11px",
                background: "#c9a45c26", border: "1.5px dashed #a9853f", borderRadius: 9 }}>
                <GoldCoin size={22} />
                <div style={{ flex: 1, fontSize: 12.5 }}>
                  <b>{t("camp.tollNeed", { n: cost })}</b>
                  <div style={{ color: can ? PP.dim : "#8e2f39", fontSize: 11.5 }}>
                    {can ? t("camp.tollHint") : t("camp.tollShort", { have })}
                  </div>
                </div>
                <Button variant={can ? "primary" : "subtle"} disabled={!can}
                  onClick={() => dispatch({ type: "PAY_TOLL", id: node.id })}
                  style={{ padding: "9px 14px", whiteSpace: "nowrap", ...(can ? {} : { background: "#dcd3ba", color: PP.ink }) }}>
                  🪙 {cost} · {t("camp.payToll")}
                </Button>
              </div>;
            }
            const it = ITEMS[g.item];
            const pieceCh2 = g.piece ? CHARACTERS[g.piece] : null;
            const pieceOk = !g.piece || (profile.campaign?.unlocked || []).includes(g.piece);
            const itemOk = hasItem(profile, g.item);
            const can = !itemOk && (profile.gold || 0) >= it.gold;
            return <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "9px 11px",
              background: "#8a6fb01f", border: "1.5px dashed #8a6fb0", borderRadius: 9 }}>
              <ItemIcon id={it.id} size={22} />
              <div style={{ flex: 1, fontSize: 12.5 }}>
                <b>{itemOk ? "✅ " : ""}{t("camp.gateNeed", { item: en ? it.nameEn : it.nameDe })}</b>
                <div style={{ color: PP.dim, fontSize: 11.5 }}>{en ? it.textEn : it.textDe}</div>
                {pieceCh2 && <div style={{ fontSize: 11.5, marginTop: 3, color: pieceOk ? PP.green : MP.liga, fontWeight: 700 }}>
                  {pieceOk ? "✅" : "⬜"} {t("camp.gatePiece", { name: en ? pieceCh2.nameEn : pieceCh2.nameDe })}
                </div>}
              </div>
              {!itemOk && <Button variant={can ? "primary" : "subtle"} disabled={!can}
                onClick={() => dispatch({ type: "BUY_ITEM", id: it.id })}
                style={{ padding: "9px 14px", whiteSpace: "nowrap", ...(can ? {} : { background: "#dcd3ba", color: PP.ink }) }}>
                🪙 {it.gold} · {t("camp.buyHere")}
              </Button>}
            </div>;
          })() : (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Button variant={status === "available" ? "primary" : "subtle"} disabled={status === "locked"}
                onClick={() => onStart(sel)} style={{ flex: 1,
                  ...(status === "available" ? {} : { background: "#dcd3ba", color: PP.ink }) }}>
                ⚔ {status === "cleared" ? t("camp.replay") : status === "locked" ? t("camp.locked") : (sel === token.at ? t("camp.startChallenge") : t("camp.play"))}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* the Endless Sea gate — floats over the greyed-out map */}
      {seaLock && (
        <div style={{ position: "absolute", inset: 0, zIndex: 7, display: "grid", placeItems: "center",
          padding: "18px 18px 110px", pointerEvents: "none" }}>
          <div style={{ width: "100%", maxWidth: 400, padding: "16px 14px", background: `linear-gradient(160deg, #14324a, #0c1e30)`,
            border: `1.5px solid #3f7fa0`, borderRadius: T.radius, boxShadow: "0 16px 44px rgba(0,0,0,.55)" }}>
            <div className="gg-serif" style={{ fontSize: 17, color: "#cfe6f2", letterSpacing: ".06em" }}>🌊 {t("camp.seaLockedTitle")}</div>
            <div style={{ fontSize: 12.5, color: "#9dbdd0", margin: "6px 0 10px", lineHeight: 1.5 }}>{t("camp.seaLockedText")}</div>
            <div style={{ display: "grid", gap: 6, fontSize: 13, color: "#cfe6f2" }}>
              <div>{(profile.campaign?.unlocked || []).includes("captain") ? "✅" : "⬜"} ⚓ {t("camp.seaNeedCaptain")}</div>
              <div>{hasItem(profile, "boat") ? "✅" : "⬜"} 🛶 {t("camp.seaNeedBoat")}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
