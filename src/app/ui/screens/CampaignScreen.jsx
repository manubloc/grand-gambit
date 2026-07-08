// Campaign — a HORIZONTAL illustrated journey. The Gleamhold stands on the
// left, the crimson LIGA keep on the far right; the dotted trail winds through
// four chapters of parchment landscape (forest → moors → highlands → ash).
// The five branch lanes run as vertical offsets; the map scrolls sideways and
// auto-centers on your current waypoint.
import { useEffect, useMemo, useRef, useState } from "react";
import { CAMPAIGN, nodeById, BRANCHES, campaignTag, mapById, CHARACTERS, CHAPTERS } from "../../../content/index.js";
import { nodeStatus, currentNodeId, clearedCount, campaignLength, nodeBossSpec, leagueRewardMult, seaAccessible, gateOf } from "../../../meta/index.js";
import { ITEMS, hasItem } from "../../../content/index.js";
import { T } from "../theme.js";
import { Button, Chip } from "../primitives.jsx";
import { PieceArt } from "../board/PieceArt.jsx";
import { ElementIcon } from "../icons.jsx";
import { MP, GEO, buildCampaignScenery, themeForLeague, Pine, Leafy, Rock, RidgeCluster, Cloud, Keep, Cottage, Mill, Bridge, Field, Boat, Birds, Mist, Wisp, StoneCircle, Crystal, DeadTree, RuinArch, Cactus, Dune, Grass, SnowDrift, Palm, Wave, Isle, Lighthouse } from "../mapArt.jsx";

// ── geometry (pixels; shared with previews via mapArt.GEO) ───────────────────
const { STEP, LANE, LEFT, TOPPAD, WMAP, HMAP, nx, ny } = GEO;

function useScenery(th) {
  return useMemo(() => {
    const n02 = nodeById("n02");
    const millAt = { x: nx(n02) + 44, y: ny(n02) - 52 };
    const sc = buildCampaignScenery(CAMPAIGN.map((n) => ({ x: nx(n), y: ny(n) })), millAt, th);
    return { ...sc, millAt };
  }, [th]);
}

const Swords = ({ c = MP.ivory }) => (
  <svg viewBox="0 0 24 24" width="22" height="22"><path d="M5 5 L17 17 M19 5 L7 17 M5 5 L8 5 M5 5 L5 8 M19 5 L16 5 M19 5 L19 8 M8.4 15.6 L6 20 M15.6 15.6 L18 20" stroke={c} strokeWidth="1.9" strokeLinecap="round" fill="none" /></svg>
);
const CrownIc = ({ c = "#f2d98c" }) => (
  <svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 17 L5.2 8.5 L9 12 L12 6.5 L15 12 L18.8 8.5 L20 17 Z" fill={c} /><path d="M5.5 19.5 L18.5 19.5" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>
);

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

export function CampaignScreen({ profile, dispatch, t, onStart }) {
  const en = profile.lang === "en";
  const league = profile.campaign?.league || 1;
  const th = themeForLeague(league);
  const mult = leagueRewardMult(league);
  const [sel, setSel] = useState(() => currentNodeId(profile));
  const [token, setToken] = useState(() => ({ at: currentNodeId(profile), moving: false }));
  const walkT = useRef(null);
  function walkTo(id) {
    const stT = nodeStatus(profile, id);
    if (id === token.at || stT === "locked" || stT === "hidden") return;
    clearTimeout(walkT.current);
    setToken({ at: id, moving: true });
    walkT.current = setTimeout(() => setToken({ at: id, moving: false }), 760);
  }
  const scenery = useScenery(th);
  const scrollRef = useRef(null);           // now the fixed VIEWPORT (no free scrolling)
  const [zoom, setZoom] = useState(1);      // the wanderer decides where we look; you only zoom
  const [vw, setVw] = useState(720);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setVw(el.clientWidth || 720);
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    window.addEventListener("resize", measure);
    return () => { ro?.disconnect(); window.removeEventListener("resize", measure); };
  }, []);
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
  const viewH = Math.round(HMAP * Math.min(zoom, 1));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const camX = WMAP * zoom <= vw ? -(vw - WMAP * zoom) / 2
    : clamp(nx(camNode) * zoom - vw * 0.46, 0, WMAP * zoom - vw);
  const camY = HMAP * zoom <= viewH ? 0
    : clamp(ny(camNode) * zoom - viewH * 0.5, 0, HMAP * zoom - viewH);
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

  return (
    <div style={{ padding: "0 0 96px", maxWidth: "100%", margin: "0 auto" }}>
      {/* sticky detail card */}
      <div style={{ position: "sticky", top: 8, zIndex: 6, background: T.panel, border: `1px solid ${T.line}`,
        borderRadius: T.radius, boxShadow: T.shadow, padding: "12px 14px", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
          <div className="gg-serif" style={{ fontSize: 19, color: T.gold, letterSpacing: ".04em" }}>{node?.place}</div>
          <div style={{ fontSize: 11, color: T.dim }}>{t("camp.sites", { a: clearedCount(profile), b: campaignLength(profile) })}</div>
        </div>
        {node?.storyDe && <div className="gg-serif" style={{ fontSize: 12.5, color: T.dim, marginTop: 4, fontStyle: "italic", lineHeight: 1.45 }}>
          {en ? node.storyEn : node.storyDe}</div>}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 9 }}>
          <Chip color={T.text} bg={T.panel2}>{mapById(node.map)[en ? "nameEn" : "nameDe"]}</Chip>
          <Chip color={T.text} bg={T.panel2}>{t("mode." + node.rules)}</Chip>
          <Chip color={T.text} bg={T.panel2}>{t("diff." + node.difficulty)}{node.bump ? ` +${node.bump}` : ""}</Chip>
          <Chip color={T.limeInk} bg={T.lime}>+{Math.round((node.reward?.xp || 0) * mult)} XP</Chip>
          <Chip color={"#17110a"} bg={"#e8c96a"}>🪙 +{Math.round((5 + 2 * node.row + (node.boss ? 6 : 0)) * mult)}</Chip>
        </div>
        {boss && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "8px 10px",
            background: T.panel2, borderRadius: T.radiusSm, border: `1px solid ${T.line}` }}>
            <div style={{ width: 40, height: 40, flex: "0 0 auto" }}>
              <PieceArt kind={boss.kind} art={boss.art} fill={unlockCh ? "#c9a45c" : "#242d44"} rim={unlockCh ? "#f0dfae" : "#93a0bb"}
                detail={unlockCh ? "#59421a" : "#9aa8c6"} accent={boss.accent || T.gold} size="100%" level={1} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: T.danger }}>☠ {t("camp.boss")}: <span style={{ color: T.text }}>{boss.name[en ? "en" : "de"]}</span></div>
              <div style={{ fontSize: 12, color: T.dim, marginTop: 2 }}>
                ♥ {boss.hp} · ⚔ {boss.atk}{unlockCh ? <> · <span style={{ color: T.gold }}>{t("camp.recruit")}: {unlockCh[en ? "nameEn" : "nameDe"]}</span></> : null}
                {!known && <> · {t("camp.unknown")}</>}
              </div>
            </div>
          </div>
        )}
        {status === "gated" ? (() => {
          const g = gateOf(node);
          const it = ITEMS[g.item];
          const pieceCh2 = g.piece ? CHARACTERS[g.piece] : null;
          const pieceOk = !g.piece || (profile.campaign?.unlocked || []).includes(g.piece);
          const itemOk = hasItem(profile, g.item);
          const can = !itemOk && (profile.gold || 0) >= it.gold;
          return <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "9px 11px",
            background: "#8a6fb01a", border: "1.5px dashed #8a6fb0", borderRadius: T.radiusSm }}>
            <span style={{ fontSize: 19 }}>{it.emoji}</span>
            <div style={{ flex: 1, fontSize: 12.5 }}>
              <b>{itemOk ? "✅ " : ""}{t("camp.gateNeed", { item: en ? it.nameEn : it.nameDe })}</b>
              <div style={{ color: T.dim, fontSize: 11.5 }}>{en ? it.textEn : it.textDe}</div>
              {pieceCh2 && <div style={{ fontSize: 11.5, marginTop: 3, color: pieceOk ? T.green : T.danger }}>
                {pieceOk ? "✅" : "⬜"} {t("camp.gatePiece", { name: en ? pieceCh2.nameEn : pieceCh2.nameDe })}
              </div>}
            </div>
            {!itemOk && <Button variant={can ? "primary" : "subtle"} disabled={!can}
              onClick={() => dispatch({ type: "BUY_ITEM", id: it.id })} style={{ padding: "9px 14px", whiteSpace: "nowrap" }}>
              🪙 {it.gold} · {t("camp.buyHere")}
            </Button>}
          </div>;
        })() : (
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <Button variant={status === "available" ? "primary" : "subtle"} disabled={status === "locked"}
            onClick={() => onStart(sel)} style={{ flex: 1 }}>
            {status === "cleared" ? t("camp.replay") : status === "locked" ? t("camp.locked") : t("camp.play")}
          </Button>
        </div>
        )}
      </div>

      {th.sea && !seaAccessible(profile) && (
        <div style={{ padding: "16px 14px", background: `linear-gradient(160deg, #14324a, #0c1e30)`,
          border: `1.5px solid #3f7fa0`, borderRadius: T.radius, boxShadow: T.shadow }}>
          <div className="gg-serif" style={{ fontSize: 17, color: "#cfe6f2", letterSpacing: ".06em" }}>🌊 {t("camp.seaLockedTitle")}</div>
          <div style={{ fontSize: 12.5, color: "#9dbdd0", margin: "6px 0 10px", lineHeight: 1.5 }}>{t("camp.seaLockedText")}</div>
          <div style={{ display: "grid", gap: 6, fontSize: 13 }}>
            <div>{(profile.campaign?.unlocked || []).includes("captain") ? "✅" : "⬜"} ⚓ {t("camp.seaNeedCaptain")}</div>
            <div>{hasItem(profile, "boat") ? "✅" : "⬜"} 🛶 {t("camp.seaNeedBoat")}</div>
          </div>
        </div>
      )}
      {/* the wanderer's window onto the world — camera follows him, no scrolling */}
      <div style={{ position: "relative" }}>
      <div ref={scrollRef} style={{ overflow: "hidden", position: "relative", height: viewH, borderRadius: T.radius,
        border: `1px solid ${T.line}`, background: th.paper, boxShadow: T.shadow, touchAction: "manipulation",
        ...(th.sea && !seaAccessible(profile) ? { pointerEvents: "none", filter: "saturate(.55) brightness(.8)" } : {}) }}>
        <div style={{ position: "relative", width: WMAP, height: HMAP, transformOrigin: "0 0",
          transform: `translate(${-camX}px, ${-camY}px) scale(${zoom})`,
          transition: "transform .72s cubic-bezier(.45,.05,.35,1)" }}>
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
            { id: "wisdom", n: nodeById("e1"), above: false }].map(({ id, n, above }) => (
            <div key={id} style={{ position: "absolute", left: nx(n), top: ny(n) + (above ? -66 : 56), transform: "translateX(-50%)",
              display: "flex", alignItems: "center", gap: 5, background: "#efe9da", border: `1px solid #c9bfa4`,
              borderRadius: 999, padding: "3px 9px", boxShadow: "0 2px 6px rgba(0,0,0,.15)", whiteSpace: "nowrap" }}>
              <ElementIcon id={BRANCHES[id].icon} color={MP.ink} size={13} />
              <span className="gg-serif" style={{ fontSize: 10.5, letterSpacing: ".08em", color: MP.ink }}>{BRANCHES[id][en ? "nameEn" : "nameDe"]}</span>
            </div>
          ))}

          {/* medallions + labels */}
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
                <button onClick={() => { setSel(n.id); walkTo(n.id); }} style={{ width: 46, height: 46, borderRadius: "50%",
                  background: MP.medal, border: `2.5px solid ${ringCol}`, cursor: "pointer", padding: 0, position: "relative",
                  opacity: st === "locked" ? 0.55 : st === "gated" ? 0.85 : 1,
                  boxShadow: isSel ? `0 0 0 3px ${T.gold}55, 0 3px 8px rgba(0,0,0,.35)` : "0 3px 8px rgba(0,0,0,.3)",
                  animation: isCur ? "herePulse 1.8s ease-in-out infinite" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {pieceCh ? <div style={{ width: 32, height: 32 }}>
                      <PieceArt kind={pieceCh.kind} fill={MP.ivory} rim="#c9a45c" detail={MP.medal} size="100%" level={1} /></div>
                    : pure ? <div style={{ width: 32, height: 32 }}>
                      <PieceArt kind="X" art={pure.art} fill={MP.ivory} rim="#c9a45c" accent={n.id === "n22" ? "#f2d98c" : T.danger} size="100%" /></div>
                    : n.id === "n22" ? (((league - 1) % 10) + 1 === 9
                        ? <div style={{ width: 32, height: 32 }}><PieceArt kind="V" fill={MP.ivory} rim="#c9a45c" detail={MP.medal} size="100%" level={1} /></div>
                        : <CrownIc />) : <Swords />}
                  {st === "cleared" && <span style={{ position: "absolute", top: -5, right: -5, width: 16, height: 16, borderRadius: "50%",
                    background: T.gold, color: "#17110a", fontSize: 10.5, fontWeight: 900, display: "flex", alignItems: "center",
                    justifyContent: "center", border: "1.5px solid #efe9da" }}>✓</span>}
                  {st === "gated" && <span style={{ position: "absolute", bottom: -5, right: -6, fontSize: 13,
                    filter: "drop-shadow(0 1px 1px rgba(0,0,0,.4))" }}>{ITEMS[gateOf(n)?.item]?.emoji || "🔒"}</span>}
                  {n.boss && st !== "cleared" && st !== "gated" && <span style={{ position: "absolute", bottom: -4, right: -4, width: 15, height: 15,
                    borderRadius: "50%", background: T.danger, display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1.5px solid #efe9da", fontSize: 8.5 }}>☠</span>}
                </button>
                <div style={{ position: "absolute", left: "50%", [below ? "top" : "bottom"]: 30, transform: "translateX(-50%)",
                  width: 104, textAlign: "center", opacity: st === "locked" ? 0.55 : st === "gated" ? 0.85 : 1, pointerEvents: "none" }}>
                  <span style={{ display: "inline-flex", minWidth: 16, height: 15, background: MP.ink, color: "#efe9da", fontSize: 9.5,
                    fontWeight: 800, borderRadius: 4, alignItems: "center", justifyContent: "center", padding: "0 3px",
                    verticalAlign: "middle", marginRight: 4 }}>{order[n.id]}</span>
                  <span className="gg-serif" style={{ fontSize: 10.5, letterSpacing: ".05em", color: MP.ink, lineHeight: 1.15,
                    textShadow: `0 1px 0 ${th.paper}, 0 -1px 0 ${th.paper}, 1px 0 0 ${th.paper}, -1px 0 0 ${th.paper}` }}>{n.place}</span>
                  <span style={{ display: "block", marginTop: 2 }}>
                    {(() => {
                      const base = n.difficulty === "easy" ? 1 : n.difficulty === "normal" ? 2 : 3;
                      const pips = Math.min(4, base + (n.bump ? 1 : 0) + (league - 1));
                      const col = pips <= 1 ? "#4d7a45" : pips === 2 ? "#8a6f4d" : pips === 3 ? "#a1512e" : "#8e2f39";
                      return Array.from({ length: 4 }).map((_, k) => (
                        <span key={k} style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%",
                          margin: "0 1.5px", background: k < pips ? col : "#c9bfa4" }} />
                      ));
                    })()}
                  </span>
                </div>
                {isCur && <div className="gg-serif" style={{ position: "absolute", left: "50%", [below ? "bottom" : "top"]: 32,
                  transform: "translateX(-50%)", fontSize: 9, letterSpacing: ".08em", color: "#8a6f4d", whiteSpace: "nowrap",
                  pointerEvents: "none" }}>{below ? "▴" : "▾"} {t("camp.current")}</div>}
              </div>
            );
          })}
          {/* the traveller — your pawn walks the trail */}
          {(() => {
            const tn = nodeById(token.at);
            if (!tn) return null;
            return <div style={{ position: "absolute", left: nx(tn), top: ny(tn), width: 34, height: 36, zIndex: 5,
              pointerEvents: "none", transition: "left .72s cubic-bezier(.45,.05,.35,1), top .72s cubic-bezier(.45,.05,.35,1)",
              transform: "translate(-50%,-118%)",
              animation: token.moving ? "walkBob .3s ease-in-out infinite" : "idleBob 2.4s ease-in-out infinite",
              filter: "drop-shadow(0 3px 4px rgba(0,0,0,.45))" }}>
              {th.sea && hasItem(profile, "boat") && <div style={{ position: "absolute", left: "50%", bottom: -8, transform: "translateX(-50%)", width: 44, height: 22 }}>
                <svg viewBox="-22 -14 44 22" width="100%" height="100%">{Boat({ x: 0, y: 0, s: 1, k: "tb" }).props.children}</svg>
              </div>}
              <PieceArt kind="P" fill="#c9a45c" rim="#7a5c26" detail="#7a5c26" size="100%" level={1} hero />
            </div>;
          })()}
          {/* arrival → the challenge call-to-action */}
          {!token.moving && sel === token.at && (status === "available" || status === "cleared") && (() => {
            const tn = nodeById(token.at);
            const below = tn.col <= 2;
            return <button onClick={() => onStart(sel)} style={{ position: "absolute", left: nx(tn),
              top: ny(tn) + (below ? 62 : 36), transform: "translateX(-50%)", zIndex: 6,
              animation: "ctaPop .22s ease", background: T.gold, color: "#17110a", border: "none",
              borderRadius: 999, padding: "9px 16px", fontFamily: "inherit", fontWeight: 900, fontSize: 13,
              cursor: "pointer", boxShadow: `0 6px 18px rgba(0,0,0,.4), 0 0 14px ${T.gold}66`, whiteSpace: "nowrap" }}>
              ⚔ {status === "cleared" ? t("camp.replay") : t("camp.startChallenge")}
            </button>;
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
      {/* zoom control (the only camera freedom the wanderer allows) */}
      <div style={{ position: "absolute", right: 10, top: 10, zIndex: 6, display: "flex", gap: 6 }}>
        {[["−", -1], ["+", 1]].map(([lbl, d]) => (
          <button key={lbl} onClick={() => setZoom((z) => {
            const steps = [0.72, 1, 1.35];
            const i = clamp(steps.findIndex((x) => Math.abs(x - z) < 0.01) + d, 0, steps.length - 1);
            return steps[i];
          })} style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${T.gold}77`,
            background: "#0d1017d9", color: T.gold, fontSize: 18, fontWeight: 800, cursor: "pointer",
            fontFamily: "inherit", boxShadow: "0 3px 10px rgba(0,0,0,.4)" }}>{lbl}</button>
        ))}
      </div>
      </div>
    </div>
  );
}
