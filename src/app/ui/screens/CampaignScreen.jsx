// Campaign — a HORIZONTAL illustrated journey, now a full-screen WINDOW onto
import { familyOf } from "../../../core/index.js";
// the world: the map IS the screen (100dvh minus the app header), every piece
// of UI floats above it. The Old Watch stands on the left, the crimson LIGA
// keep on the far right; the dotted trail winds through four chapters of
// parchment landscape. The wanderer is the hero — the camera follows him, the
// medallions are waypoints (small), and the node detail lives in a parchment
// panel embedded in the map right where you arrive.
import { useEffect, useMemo, useRef, useState } from "react";
import { CAMPAIGN, nodeById, BRANCHES, campaignTag, mapById, CHARACTERS, CHAPTERS } from "../../../content/index.js";
import { nodeStatus, currentNodeId, nodeBossSpec, leagueRewardMult, advanceLeague, seaAccessible, gateOf, tollCost, effectiveMap, winsNeeded, bossWinsFor, characterLevel, gambitTier } from "../../../meta/index.js";
import { ITEMS, hasItem } from "../../../content/index.js";
import { T } from "../theme.js";
import { Button, Chip } from "../primitives.jsx";
import { GoldShineButton } from "../Gilded.jsx";
import { PieceArt } from "../board/PieceArt.jsx";
import { paintedForPiece, PAINTED, ENEMY_FILTER } from "../board/paintedArt.js";
import { ItemIcon } from "../ItemIcon.jsx";
import { ElementIcon, GoldCoin, SkullIc, BladesIc, LockIc, HeartIc, MapPinIc, BackIc, WaveIc, AnchorIc, BoatIc, CheckIc, BoxIc } from "../icons.jsx";
import { useMedia } from "../../App.jsx";
import { MAP_BITMAPS } from "../mapBitmaps.js";
import { WORLD_MAP, LEAGUE_LORE } from "../worldMap.js";
import { voiceFor } from "../../../content/index.js";
import { placeFor } from "../../../meta/index.js";
import { MP, GEO, buildCampaignScenery, themeForLeague, Pine, Leafy, Rock, RidgeCluster, Cloud, Keep, Cottage, Mill, Bridge, Field, Boat, Birds, Mist, Wisp, StoneCircle, Crystal, DeadTree, RuinArch, Cactus, Dune, Grass, SnowDrift, Palm, Wave, Isle, Lighthouse, SiteGlyph, siteTypeFor, WandererArt } from "../mapArt.jsx";

// ── geometry (pixels; shared with previews via mapArt.GEO) ───────────────────
const { STEP, LANE, LEFT, TOPPAD, WMAP, HMAP, nx, ny } = GEO;

// v0.3 map immersion: medallions ~30% smaller (46 → 32), wanderer ~40% larger
// (34×36 → 48×50) — he is the hero, the stations are just waypoints.
const MEDAL = 32, MEDAL_ART = 22, HIT = 44;
// parchment palette for the embedded node panel — map-world UI, not app chrome
const PP = { bg: "linear-gradient(170deg, #f4eee0, #ece4cf)", bg2: "#e7dfc9", line: "#c9bfa4",
  ink: MP.ink, dim: "#6f6752", chipInk: "#4a4433", green: "#3e7d47" };

const EMPTY_SCENERY = { clouds: [], ridges: [], dunes: [], floors: [], drifts: [], isles: [], mistsBack: [],
  stonesAt: null, ruin: false, crystals: [], rocks: [], grass: [], leafy: [], blossoms: [], cacti: [], fields: [],
  cottages: [], oasis: null, birds: [], farPines: [], pines: [], deadTrees: [], mistsFront: [], waves: [], wisps: [],
  river2: "", riverXAt: () => -999, millAt: { x: -999, y: -999 } };

function useScenery(th) {
  return useMemo(() => {
    if (th.bitmap) return EMPTY_SCENERY; // the painted map IS the scenery
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

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const CAM_EASE = "cubic-bezier(.45,.05,.35,1)";

// the name-plate halo borrows each land's own light: spring green, desert
// gold, sea blue ... (indexed by biome 1..10, dark ink stays readable)
// SAMPLED from each painting's open ground (top-luminance band, highlights
// skipped), lifted +12% so the dark ink stays readable on a sheer halo.
const LABEL_TINT = {
  1: "224,208,164",   // Fruehling - Wiesen-Pergament
  2: "178,152,83",    // Sommer - Olivgold der Felder
  3: "211,155,82",    // Herbst - Ocker
  4: "220,229,243",   // Winter - Eisgrau
  5: "199,198,194",   // Hochgebirge - Felsgrau
  6: "179,146,104",   // Oedland - Erdbraun
  7: "236,196,127",   // Steppe - Grassand
  8: "241,155,91",    // Roter Canyon - Terrakotta
  9: "255,212,127",   // Wueste - Sandgold
  10: "157,174,176",  // Endloses Meer - Graublau der See
};
const labelTint = (league) => LABEL_TINT[((Math.max(1, league) - 1) % 10) + 1] || "248,242,226";

export function CampaignScreen({ profile, dispatch, t, onStart, onBack, onOpenTree }) {
  const en = profile.lang === "en";
  const wide = useMedia("(min-width: 900px)");
  const league = profile.campaign?.league || 1;
  // league selector: look back at worlds already mastered — view-only; the
  // journey itself (status, wanderer, panel) always lives in the CURRENT league
  const [viewLeague, setViewLeague] = useState(league);
  const [world, setWorld] = useState(() => !profile?.notices?.worldSeen);
  const [gambitInfo, setGambitInfo] = useState(false); // tap the wanderer: he steps forward and shows his rank // the first visit opens on the WHOLE world
  useEffect(() => { if (world && !profile?.notices?.worldSeen) dispatch({ type: "SET_NOTICE", key: "worldSeen" }); }, [world]); // the overworld: travel between leagues
  const [worldSel, setWorldSel] = useState(null); // tapped league on the painting
  useEffect(() => { setViewLeague(league); }, [league]);
  const viewing = viewLeague !== league;
  const th = themeForLeague(viewLeague);
  const bmDef = th.bitmap ? MAP_BITMAPS[th.bitmap] : null; // painted league worlds
  const bm = !!bmDef;
  const nx = (n) => (bm && n?.id && bmDef.pos[n.id]) ? bmDef.pos[n.id][0] : GEO.nx(n);
  const ny = (n) => (bm && n?.id && bmDef.pos[n.id]) ? bmDef.pos[n.id][1] : GEO.ny(n);
  const HM = bm ? bmDef.h : HMAP;
  const mult = leagueRewardMult(league);
  const [sel, setSel] = useState(() => currentNodeId(profile));
  const [token, setToken] = useState(() => ({ at: currentNodeId(profile), moving: false }));
  const [panelOpen, setPanelOpen] = useState(true);
  // free panning: a finger (or mouse) drags the window across the world; the
  // camera resumes following the wanderer on his next step
  const [panOff, setPanOff] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(null);
  const clickSquelch = useRef(false);
  const walkT = useRef(null);
  const [stride, setStride] = useState({ angle: 0, dir: 1 }); // last travel heading — feeds tilt & trail
  // A champion beaten but not recruited FLEES the map to the east — GameScreen
  // leaves his station id behind; we play the escape once, then only ✓ remains.
  const [fleeing, setFleeing] = useState(null);
  useEffect(() => {
    let fledId = null;
    try { fledId = sessionStorage.getItem("gg:fled"); if (fledId) sessionStorage.removeItem("gg:fled"); } catch {}
    if (!fledId || !nodeById(fledId)?.boss) return;
    setFleeing(fledId);
    const tm = setTimeout(() => setFleeing(null), 1600);
    return () => clearTimeout(tm);
  }, []);
  function walkTo(id) {
    const stT = nodeStatus(profile, id);
    if (id === token.at || stT === "locked" || stT === "hidden") return;
    clearTimeout(walkT.current);
    const from = nodeById(token.at), to = nodeById(id);
    if (from && to) {
      const dx = nx(to) - nx(from), dy = ny(to) - ny(from);
      setStride({ angle: Math.atan2(dy, dx) * 180 / Math.PI, dir: dx >= 0 ? 1 : -1 });
    }
    setToken({ at: id, moving: true });
    setPanOff({ x: 0, y: 0 }); // the camera returns to the wanderer
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
  const cur = currentNodeId(profile);
  const node = nodeById(sel);
  const status = nodeStatus(profile, sel);
  const boss = node?.boss ? nodeBossSpec(node, league) : null;
  const unlockCh = node?.boss?.piece ? CHARACTERS[node.boss.piece] : null;
  const needWins = winsNeeded(node, league);               // stubborn champions demand several victories
  const haveWins = unlockCh ? Math.min(needWins, bossWinsFor(profile, unlockCh.id)) : 0;
  const canRecruit = !!unlockCh && haveWins + 1 >= needWins;  // the NEXT win seals it
  const known = unlockCh ? (profile.campaign?.unlocked || []).includes(unlockCh.id) : true;
  const golden = !!unlockCh && known;                      // redeemed: only a recruited champion wears gold
  // a station stays OPEN only while a figure still stands there: either the
  // duel is yet to be won, or your OWN recruited champion holds the post —
  // then every rematch is a friendly (a little gold & XP). Fled champions
  // and slain monsters close their station for this league.
  const friendly = status === "cleared" && ((!!unlockCh && known) || sel === "n22");
  const closed = status === "cleared" && !friendly && profile.pausedMatch?.nodeId !== sel;
  const unlockedSet = useMemo(() => new Set(profile.campaign?.unlocked || []), [profile]);
  // who has actually been FACED on a board — a piece by its kind, a monster by
  // "X:"+id. Until then a node keeps its figure hidden: an empty post, a name
  // to earn, no silhouette to spoil what waits.
  const facedSet = useMemo(() => new Set(profile.campaign?.faced || []), [profile]);
  const facedNode = (n) => {
    // STRICT per-station secrecy: whether a figure waits here stays unknown
    // until you have PLAYED at this very station in this league (win or
    // lose) — even a champion of your own court or a monster met elsewhere.
    if (!n?.boss) return true;                       // plain stations: nothing to hide
    if (nodeStatus(profile, n.id) === "cleared") return true; // beaten HERE: of course shown
    return facedSet.has(n.id);
  };
  const edges = useMemo(() => CAMPAIGN.flatMap((a) => a.next.map((tid) => ({ a, b: nodeById(tid) }))), []);

  // camera target = the Grand Gambit's position (he leads, the map follows)
  const camNode = nodeById(token.at) || nodeById(cur);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fit = Math.max(vp.h / HM, vp.w / WMAP);       // cover the viewport
  // the painted worlds are 1796px wide — rendered any larger they go soft on
  // hi-DPI screens, so the window sits a step back from full bleed
  const z = fit * (wide ? 0.8 : 1.005); // phones: full bleed + a hair of cover reserve (no light seam at the rim)
  // the world lives inside a rounded frame; letterbox bars stay dark chrome
  // the frame is FIXED: even margins top and bottom (the dock gets its room on
  // phones); the painting scales and pans INSIDE this steady window
  const padTop = 12;
  // the shell already keeps the dock's 72px clear below the map — the frame
  // itself only adds a BREATH of air, so the painting runs down TO the menu
  const dockPad = (typeof innerWidth !== "undefined" && innerWidth < 900) ? 10 : 12;
  const frameW = Math.min(vp.w, WMAP * z), frameH = Math.max(220, vp.h - padTop - dockPad);
  const frameX = Math.round((vp.w - frameW) / 2);
  const frameY = padTop; // pinned: same breath above as below
  const camMaxX = Math.max(0, WMAP * z - frameW), camMaxY = Math.max(0, HM * z - frameH);
  const camX = clamp((viewing ? 0 : nx(camNode) * z - frameW * 0.46) + panOff.x, 0, camMaxX);
  const camY = clamp((viewing ? camMaxY * 0.5 : ny(camNode) * z - frameH * 0.5) + panOff.y, 0, camMaxY);
  // fog of war: everything past the frontline stays a blurred rumour until
  // the league's end boss falls — the map never spoils the road ahead
  const frontierX = useMemo(() => {
    let fx = 0;
    for (const n of CAMPAIGN) {
      const st = nodeStatus(profile, n.id);
      if (st === "available" || st === "cleared" || st === "gated") fx = Math.max(fx, nx(n));
    }
    return fx + STEP * 3.4; // the next 4-5 stations stay visible before the dark
  }, [profile]);

  // ── the embedded node panel: parchment overlay near the selected medallion,
  //    projected into viewport coords so text never scales with zoom ─────────
  const seaLock = !viewing && th.sea && !seaAccessible(profile);
  const panelW = Math.min(352, frameW - 28);
  const panelLeft = 14;
  const panelPos = { bottom: dockPad + 14, maxHeight: frameH - 28, overflowY: "auto" }; // anchored INSIDE the frame, never over the dock
  const showPanel = panelOpen && !viewing && !!node && !token.moving && !seaLock;

  return (
    <div style={{ position: "relative", overflow: "hidden", flex: "1 1 auto", minHeight: 0, height: "100%" }}>
      {/* the wanderer's window onto the world — a rounded frame; whatever the
          screen shape, chrome stays dark and every control lives INSIDE */}
      <div ref={vpRef} style={{ position: "absolute", inset: 0 }}>
      <div
        onPointerDown={(e) => { if (seaLock) return;
          dragRef.current = { id: e.pointerId, px: e.clientX, py: e.clientY, ox: panOff.x, oy: panOff.y, moved: false, el: e.currentTarget }; }}
        onPointerMove={(e) => { const d = dragRef.current; if (!d) return;
          const dx = e.clientX - d.px, dy = e.clientY - d.py;
          if (!d.moved && Math.hypot(dx, dy) > 6) { d.moved = true; clickSquelch.current = true; setDragging(true); try { d.el.setPointerCapture(d.id); } catch {} }
          if (d.moved) setPanOff({ x: d.ox - dx, y: d.oy - dy }); }}
        onPointerUp={() => { dragRef.current = null; setDragging(false); }}
        onPointerCancel={() => { dragRef.current = null; setDragging(false); }}
        onClickCapture={(e) => { if (clickSquelch.current) { clickSquelch.current = false; e.preventDefault(); e.stopPropagation(); } }}
        style={{ position: "absolute", left: frameX, top: frameY, width: frameW, height: frameH,
        overflow: "hidden", borderRadius: Math.min(22, frameW / 12), background: bm ? "#0c0e13" : th.paper,
        boxShadow: "0 0 34px rgba(0,0,0,.45)", touchAction: "none",
        ...(seaLock ? { pointerEvents: "none", filter: "saturate(.55) brightness(.8)" } : {}) }}>
        {/* the hall's breath: a whisper of fog drifting in from the right, held by the frame */}
        <div aria-hidden style={{ position: "absolute", inset: "-14%", zIndex: 6, pointerEvents: "none",
          filter: "blur(16px)", opacity: 0.4, mixBlendMode: "screen",
          background: "radial-gradient(48% 36% at 86% 30%, rgba(236,228,212,.6), transparent 70%), radial-gradient(42% 32% at 78% 72%, rgba(220,212,196,.48), transparent 70%)",
          animation: "ggFogR 52s ease-in-out infinite alternate" }} />
        <div aria-hidden style={{ position: "absolute", inset: "-14%", zIndex: 6, pointerEvents: "none",
          filter: "blur(22px)", opacity: 0.26, mixBlendMode: "screen",
          background: "radial-gradient(40% 30% at 90% 52%, rgba(228,220,204,.55), transparent 70%)",
          animation: "ggFogR2 67s ease-in-out infinite alternate" }} />
        <div style={{ position: "relative", width: WMAP, height: HM, transformOrigin: "0 0",
          transform: `translate(${-camX}px, ${-camY}px) scale(${z})`,
          transition: dragging ? "none" : `transform .72s ${CAM_EASE}` }}>
          <svg width={WMAP} height={HM} viewBox={`0 0 ${WMAP} ${HM}`} style={{ position: "absolute", inset: 0 }}>
            <defs>
              <linearGradient id="wash" x1="0" y1="0" x2="1" y2="0">
                {th.wash.map(([off, col, op], i) => <stop key={i} offset={off} stopColor={col} stopOpacity={op} />)}
              </linearGradient>
            </defs>
            {bm && <image href={bmDef.url} x="0" y="0" width={WMAP} height={HM} preserveAspectRatio="none" />}
            {!bm && <rect width={WMAP} height={HM} fill="url(#wash)" />}
            {/* river along the south + a small lake */}
            {!bm && th.river && <>
              <path d={`M0 ${HM - 34} C ${WMAP * 0.2} ${HM - 52}, ${WMAP * 0.36} ${HM - 16}, ${WMAP * 0.55} ${HM - 34} S ${WMAP * 0.85} ${HM - 18}, ${WMAP} ${HM - 40}`}
                fill="none" stroke={th.river} strokeWidth="10" strokeLinecap="round" opacity={th.frozen ? 0.85 : 0.6}
                strokeDasharray={th.frozen ? "14 6" : "none"} />
              <ellipse cx={WMAP * 0.235} cy={HM - 40} rx="46" ry="13" fill={th.river} opacity={th.frozen ? 0.8 : 0.55} />
            </>}
            {/* chapter dividers */}
            {!bm && CHAPTERS.slice(1).map((c) => {
              const x = LEFT + (c.fromRow - 0.5) * STEP;
              return <path key={"cd" + c.n} d={`M${x} ${TOPPAD - 20} L${x} ${HM - 54}`} stroke={MP.trailDim} strokeWidth="1.4" strokeDasharray="2 7" opacity=".7" />;
            })}
            {/* the north river + crossings */}
            {!bm && th.river && <path d={scenery.river2} fill="none" stroke={th.river} strokeWidth="8" strokeLinecap="round" opacity={th.frozen ? 0.8 : 0.55} strokeDasharray={th.frozen ? "12 6" : "none"} />}
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
            {!bm && th.settle && Mill({ ...scenery.millAt, s: 1.05, k: "mill" })}
            {!bm && th.river && !th.sea && Boat({ x: WMAP * 0.235 + 10, y: HM - 42, s: 1, k: "boat" })}
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
            {!bm && (th.mystic?.wisps || 0) > 0 && [0, 1, 2].map((i) => Wisp({ x: nx(nodeById("n03")) - 34 + i * 30, y: ny(nodeById("n03")) - 40 + (i % 2) * 14, s: 0.9, k: "sw" + i }))}
            {/* dotted trail (procedural leagues only — painted maps have their own roads) */}
            {!bm && edges.map(({ a, b }, i) => {
              const stOf = (id) => (viewing ? "cleared" : nodeStatus(profile, id)); // the look back shows every road walked
              const x1 = nx(a), y1 = ny(a), x2 = nx(b), y2 = ny(b), xm = (x1 + x2) / 2;
              if (stOf(a.id) === "hidden" || stOf(b.id) === "hidden") return null;
              const gated = stOf(b.id) === "gated";
              const done = stOf(a.id) === "cleared" && !gated && stOf(b.id) !== "locked";
              return <path key={"e" + i} d={`M${x1} ${y1} C ${xm} ${y1}, ${xm} ${y2}, ${x2} ${y2}`} fill="none"
                stroke={gated ? "#7a6a94" : done ? MP.trail : MP.trailDim} strokeWidth={gated ? 3.5 : 4.5} strokeLinecap="round"
                strokeDasharray={gated ? "6 6" : "0.5 9.5"} opacity={gated ? 0.5 : done ? 0.95 : 0.62} />;
            })}
            {!bm && th.river && th.settle && [(ny({ col: 0 }) + ny({ col: 2 })) / 2, ny({ col: 2 }), (ny({ col: 4 }) + ny({ col: 2 })) / 2].map((y, i) =>
              Bridge({ x: scenery.riverXAt(y), y, s: 1.05, k: "br" + i }))}
            {!bm && (th.sea ? <>
              {Isle({ x: 62, y: ny({ col: 2 }) + 12, s: 1.15, k: "ki1" })}
              {Lighthouse({ x: 62, y: ny({ col: 2 }) - 4, s: 1.1, k: "k1" })}
            </> : Keep({ x: 62, y: ny({ col: 2 }) - 6, s: 1.15, fill: MP.medal, k: "k1" }))}
            {!bm && (th.sea ? <>
              {Isle({ x: WMAP - 84, y: ny({ col: 2 }) + 16, s: 1.6, k: "ki2" })}
              {Lighthouse({ x: WMAP - 84, y: ny({ col: 2 }) - 8, s: 1.55, k: "k2" })}
            </> : Keep({ x: WMAP - 84, y: ny({ col: 2 }) - 10, s: 1.7, fill: MP.liga, k: "k2" }))}
          </svg>

          {/* chapter banners (drawn maps only — painted worlds carry a fixed pill in the chrome) */}
          {!bm && CHAPTERS.map((c) => (
            <div key={"ch" + c.n} className="gg-quill" style={{ position: "absolute", top: 12,
              left: LEFT + ((c.fromRow + c.toRow) / 2) * STEP, transform: "translateX(-50%)",
              background: "rgba(239,233,218,.42)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(201,191,164,.6)", borderRadius: 999, padding: "8px 15px",
              fontSize: 12.5, color: MP.ink, whiteSpace: "nowrap", boxShadow: "0 0 18px rgba(30,25,15,.14)" }}>
              {(en ? "CHAPTER " : "KAPITEL ")}{["I", "II", "III", "IV"][c.n - 1]} · {(en ? c.titleEn : c.titleDe).toUpperCase()}
            </div>
          ))}
          <div className="gg-serif" style={{ position: "absolute", top: Math.max(14, ny({ col: 2 }) - 74), left: Math.min(WMAP - 84, WMAP - 14), transform: "translateX(-50%)",
            color: MP.liga, fontSize: 19, letterSpacing: ".22em", fontWeight: 700, whiteSpace: "nowrap" }}>❖ LIGA {ROMAN[viewLeague - 1] || viewLeague} ❖</div>
          {/* medallions + labels — small waypoints now; the wanderer is the star */}
          {CAMPAIGN.map((n) => {
            const st = viewing ? "available" : nodeStatus(profile, n.id); // a mastered world holds no locks
            const isSel = !viewing && sel === n.id, isCur = !viewing && cur === n.id;
            const pieceCh = n.boss?.piece ? CHARACTERS[n.boss.piece] : null;
            const pure = n.boss?.pure ? nodeBossSpec(n) : null;
            const below = n.col <= 2; // labels toward the free side of the lane
            if (st === "hidden") return null;
            const ringCol = st === "locked" ? "#8d8672" : st === "gated" ? "#a9853f" : st === "cleared" ? "#7c5f3d" : T.gold;
            return (
              <div key={n.id} style={{ position: "absolute", left: nx(n), top: ny(n), transform: "translate(-50%,-50%)" }}>
                {/* on painted maps every boss stands at his station in person —
                    dark and waiting until beaten, gold once he joined the court;
                    the league finale towers over the road's end */}
                {bm && n.boss && (() => {
                  const spec = nodeBossSpec(n, viewLeague);
                  if (!spec) return null;
                  const faced = viewing || facedNode(n);
                  if (!faced) return null;           // not yet fought: the post stands empty
                  const finale = n.id === "n22";
                  const size = finale ? 68 : 46;
                  const beaten = st === "cleared";
                  const flee = !viewing && fleeing === n.id;
                  // beaten figures leave the map — UNLESS the champion joined
                  // your court: a recruit keeps his post in gold, ready for a
                  // friendly duel; the fled and the slain are gone
                  const joinedHere = n.id === "n22" || (!!n.boss.piece && unlockedSet.has(n.boss.piece));
                  if (beaten && !flee && !joinedHere) return null;
                  const painting = paintedForPiece({ kind: spec.kind, art: spec.art, bossId: spec.bossId });
                  return <div aria-hidden style={{ position: "absolute", left: "50%", bottom: 12,
                    transform: "translateX(-50%)", width: size, height: size, zIndex: flee ? 6 : 0, pointerEvents: "none",
                    animation: flee ? "bossFlee 1.5s ease-in forwards" : "none",
                    opacity: st === "locked" ? 0.55 : 1, filter: st === "locked"
                      ? "grayscale(.65) drop-shadow(0 2px 3px rgba(40,32,16,.3))"
                      : "drop-shadow(0 3px 4px rgba(40,32,16,.42))" }}>
                    {!flee && <div style={{ position: "absolute", left: "50%", bottom: -2, transform: "translateX(-50%)",
                      width: size * 0.62, height: size * 0.16, borderRadius: "50%",
                      background: "radial-gradient(ellipse at center, rgba(46,42,32,.32), transparent 72%)" }} />}
                    {painting
                      ? <img src={painting} alt="" draggable={false} style={{ width: "100%", height: "100%",
                          objectFit: "contain", objectPosition: "bottom",
                          filter: (n.boss.piece ? unlockedSet.has(n.boss.piece) : beaten) ? undefined : ENEMY_FILTER,
                          userSelect: "none", pointerEvents: "none" }} />
                      : <PieceArt kind={spec.kind} art={spec.art} fill="#242d44" rim="#93a0bb" detail="#9aa8c6"
                          accent={spec.accent || T.gold} size="100%" level={1} />}
                  </div>;
                })()}
                {!bm && <div aria-hidden style={{ position: "absolute", left: "50%", bottom: 24, transform: "translateX(-26%)",
                  zIndex: 0, pointerEvents: "none", opacity: st === "locked" ? 0.42 : 0.94,
                  filter: st === "locked" ? "grayscale(.6)" : "none" }}>
                  <SiteGlyph type={siteTypeFor(n)} width={n.id === "n22" ? 54 : 44} />
                </div>}
                <button onClick={() => { if (viewing) return; setSel(n.id); setPanelOpen(true); walkTo(n.id); }}
                  style={{ width: HIT, height: HIT, background: "none", border: "none", padding: 0, cursor: viewing ? "default" : "pointer",
                    position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: st === "locked" ? 0.55 : st === "gated" ? 0.85 : 1 }}>
                  <div style={{ position: "relative", width: MEDAL + 10, height: MEDAL + 9,
                    filter: bm ? "none" : isSel ? `drop-shadow(0 0 5px ${T.gold}aa)` : "drop-shadow(0 2px 3px rgba(0,0,0,.3))" }}>
                  {bm && (() => {
                    const glow = st === "cleared" ? "#b8c98a" : st === "gated" ? "#d9a45c" : st === "locked" ? "#8a8474" : "#f2d98c";
                    const on = isCur || isSel;
                    return <div aria-hidden style={{ position: "absolute", left: "50%", bottom: -4, transform: "translateX(-50%)",
                      width: (MEDAL + 10) * (n.id === "n22" ? 2 : 1.55), height: (MEDAL + 10) * (n.id === "n22" ? 1 : 0.8),
                      borderRadius: "50%", pointerEvents: "none",
                      background: `radial-gradient(ellipse at center, ${glow}${on ? "b8" : st === "locked" ? "2e" : "70"} 0%, ${glow}${on ? "66" : "30"} 45%, transparent 72%)`,
                      animation: isCur ? "ggPulse 2.2s ease-in-out infinite" : "none",
                      transition: "background .4s" }} />;
                  })()}
                  {!bm && <svg viewBox="0 0 44 19" width={MEDAL + 10} height={Math.round((MEDAL + 10) * 19 / 44)}
                    style={{ position: "absolute", left: 0, bottom: 0, display: "block", overflow: "visible" }}>
                    {isCur && <ellipse cx="22" cy="8" rx="21" ry="8.8" fill="none" stroke={T.gold} strokeWidth="1.5"
                      style={{ animation: "ggPulse 1.8s ease-in-out infinite", transformOrigin: "center", transformBox: "fill-box" }} />}
                    <path d="M2.5 8 a19.5 7.2 0 0 0 39 0 l0 3.6 a19.5 7.2 0 0 1 -39 0 Z" fill={MP.medal} fillOpacity=".42" stroke={ringCol} strokeWidth="1" strokeOpacity=".7" />
                    <path d="M2.5 8 a19.5 7.2 0 0 0 39 0 l0 3.6 a19.5 7.2 0 0 1 -39 0 Z" fill="rgba(0,0,0,.14)" />
                    <ellipse cx="22" cy="8" rx="19.5" ry="7.2" fill={MP.medal} fillOpacity=".46" stroke={ringCol} strokeWidth="1.4" strokeOpacity=".85" />
                    <ellipse cx="22" cy="7" rx="14.5" ry="4.6" fill="none" stroke={ringCol} strokeWidth=".7" opacity=".3" />
                  </svg>}
                  {!bm && (() => { const faced = viewing || facedNode(n); return <div style={{ position: "absolute", left: "50%", bottom: 9, transform: "translateX(-50%)",
                    width: MEDAL_ART + 2, height: MEDAL_ART + 2,
                    filter: faced && pieceCh && !unlockedSet.has(pieceCh.id) ? `${ENEMY_FILTER} drop-shadow(0 2px 2px rgba(0,0,0,.35))` : "drop-shadow(0 2px 2px rgba(0,0,0,.35))",
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {faced && pieceCh ? <div style={{ width: MEDAL_ART, height: MEDAL_ART }}>
                        <PieceArt kind={pieceCh.kind} fill={MP.ivory} rim="#c9a45c" detail={MP.medal} size="100%" level={1} /></div>
                      : faced && pure ? <div style={{ width: MEDAL_ART, height: MEDAL_ART }}>
                        <PieceArt kind="X" art={pure.art} fill={MP.ivory} rim="#c9a45c" accent={n.id === "n22" ? "#f2d98c" : T.danger} size="100%" /></div>
                      : n.id === "n22" ? ((faced && ((viewLeague - 1) % 10) + 1 === 9)
                          ? <div style={{ width: MEDAL_ART, height: MEDAL_ART }}><PieceArt kind="V" fill={MP.ivory} rim="#c9a45c" detail={MP.medal} size="100%" level={1} /></div>
                          : <CrownIc />) : <Swords />}
                  </div>; })()}
                  </div>
                  {st === "cleared" && (bm
                    ? <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-72%)",
                        fontSize: 12, fontWeight: 800, color: "#3e6b3a", opacity: 0.8,
                        textShadow: "0 1px 2px rgba(255,250,230,.7)" }}>✓</span>
                    : <span style={{ position: "absolute", top: 2, right: 2, width: 13, height: 13, borderRadius: "50%",
                        background: T.gold, color: "#17110a", fontSize: 8.5, fontWeight: 900, display: "flex", alignItems: "center",
                        justifyContent: "center", border: "1.5px solid #efe9da" }}>✓</span>)}
                  {st === "gated" && <span style={{ position: "absolute", bottom: 2, right: 1, fontSize: 11, opacity: bm ? 0.85 : 1,
                    filter: bm ? "none" : "drop-shadow(0 1px 1px rgba(0,0,0,.4))" }}>{gateOf(n)?.item ? <ItemIcon id={gateOf(n).item} size={11} style={{ display: "inline-block", verticalAlign: "-2px" }} /> : gateOf(n)?.gold ? <GoldCoin size={11} style={{ verticalAlign: "-2px" }} /> : <LockIc size={11} />}</span>}
                  {!bm && n.boss?.pure && (viewing || facedNode(n)) && st !== "cleared" && st !== "gated" && <span style={{ position: "absolute", bottom: 3, right: 3, width: 13, height: 13,
                    borderRadius: "50%", background: T.danger, display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1.5px solid #efe9da" }}><SkullIc color="#f6f0de" size={8} /></span>}
                </button>
                <div style={{ position: "absolute", left: "50%", [bm || below ? "top" : "bottom"]: bm ? 24 : below ? 27 : 52, transform: "translateX(-50%)",
                  width: 96, textAlign: "center", opacity: st === "locked" ? 0.55 : st === "gated" ? 0.85 : 1, pointerEvents: "none" }}>
                  <span style={{ position: "relative", display: "inline-block", padding: "1px 6px" }}>
                    {/* a WHISPER of ground: so faint the eye never catches a
                        mismatched edge — readability lives in the letter halo below */}
                    <span aria-hidden style={{ position: "absolute", inset: "-8px -18px", borderRadius: "50%",
                      background: `radial-gradient(ellipse at center, rgba(${labelTint(league)},.22) 0%, rgba(${labelTint(league)},.12) 38%, rgba(${labelTint(league)},.04) 62%, transparent 78%)`,
                      filter: "blur(4px)", pointerEvents: "none" }} />
                    <span className="gg-quill" style={{ position: "relative", display: "block", fontSize: 13.5, fontWeight: 700, color: "#231d10",
                      lineHeight: 0.94, textShadow: `0 0 7px rgba(${labelTint(league)},.95), 0 0 3px rgba(${labelTint(league)},.9), 0 1px 1px rgba(${labelTint(league)},.55)` }}>{placeFor(n, league)}</span>
                  </span>
                </div>
              </div>
            );
          })}
          {/* the traveller — the Grand Gambit walks the trail, larger than life */}
          {!viewing && (() => {
            const tn = nodeById(token.at);
            if (!tn) return null;
            return <div onClick={(e) => { e.stopPropagation(); setGambitInfo((g) => !g); }}
              title="Gambit" style={{ position: "absolute", left: nx(tn), top: ny(tn), width: 76, height: 78, zIndex: gambitInfo ? 9 : 5,
              pointerEvents: "auto", cursor: "pointer", transition: `left .72s ${CAM_EASE}, top .72s ${CAM_EASE}, transform .18s ease`,
              ...(gambitInfo ? { filter: "drop-shadow(0 0 12px rgba(240,206,122,.55))" } : {}),
              transform: (bm ? "translate(-50%,-102%)" : "translate(-98%,-70%)") + (gambitInfo ? " scale(1.32)" : ""), transformOrigin: "50% 96%" }}>

              {/* the wake: a golden streak trailing opposite the heading, fading once he rests */}
              <div aria-hidden style={{ position: "absolute", left: "50%", top: "62%", width: 58, height: 9,
                transformOrigin: "0 50%", transform: `rotate(${stride.angle + 180}deg)`,
                background: "linear-gradient(90deg, rgba(240,214,138,.55), rgba(240,214,138,.18) 55%, rgba(240,214,138,0))",
                borderRadius: 99, filter: "blur(1.6px)", pointerEvents: "none",
                opacity: token.moving ? 0.8 : 0, transition: token.moving ? "opacity .12s ease" : "opacity .55s ease .05s" }} />
              <div style={{ position: "absolute", left: "50%", bottom: -3, transform: "translateX(-46%)", width: 30, height: 8,
                borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(46,42,32,.34), transparent 72%)" }} />
              {th.sea && hasItem(profile, "boat") && <div style={{ position: "absolute", left: "50%", bottom: -10, transform: "translateX(-50%)", width: 58, height: 29 }}>
                <svg viewBox="-22 -14 44 22" width="100%" height="100%">{Boat({ x: 0, y: 0, s: 1, k: "tb" }).props.children}</svg>
              </div>}
              <div style={{ position: "relative", width: "100%", height: "100%",
                // the risen Gambit glows quietly on the road too (Stufe II/III)
                filter: (() => { const gt = gambitTier(characterLevel(profile, "gambit") || 1);
                  return gt >= 3 ? "drop-shadow(0 2px 3px rgba(46,42,32,.35)) drop-shadow(0 0 6px rgba(240,214,138,.55)) drop-shadow(0 0 13px rgba(240,214,138,.3))"
                    : gt === 2 ? "drop-shadow(0 2px 3px rgba(46,42,32,.35)) drop-shadow(0 0 7px rgba(240,214,138,.45))"
                    : "drop-shadow(0 2px 3px rgba(46,42,32,.35))"; })(),
                transform: token.moving ? `rotate(${-7 * stride.dir}deg)` : "none", transition: "transform .3s ease" }}>
                {bm && PAINTED.gambit
                  ? <img src={(() => { const gt = gambitTier(characterLevel(profile, "gambit") || 1);
                      return (gt >= 2 && PAINTED["gambit-t" + gt]) || PAINTED.gambit; })()} alt="" draggable={false} style={{ width: "100%", height: "100%",
                      objectFit: "contain", objectPosition: "bottom", userSelect: "none", pointerEvents: "none" }} />
                  : <WandererArt size="100%" />}
              </div>
            </div>;
          })()}
          {!viewing && frontierX < WMAP - 60 && (
            <div style={{ position: "absolute", top: 0, bottom: 0, left: frontierX, right: 0, zIndex: 5,
              pointerEvents: "none", backdropFilter: "blur(3.5px) saturate(.55) brightness(.6)",
              WebkitBackdropFilter: "blur(3.5px) saturate(.55) brightness(.6)",
              background: "linear-gradient(90deg, transparent, rgba(24,20,13,.4) 110px, rgba(24,20,13,.68))",
              WebkitMaskImage: "linear-gradient(90deg, transparent, #000 80px)",
              maskImage: "linear-gradient(90deg, transparent, #000 80px)" }} />
          )}
        </div>
      </div>
      </div>

      {gambitInfo && (() => {
        const lvl = characterLevel(profile, "gambit") || 1;
        const gt = gambitTier(lvl);
        return <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", top: frameY + 68, left: "50%",
          transform: "translateX(-50%)", width: "min(88vw, 250px)", zIndex: 12, borderRadius: 13, padding: "11px 13px 12px",
          background: "rgba(12,15,22,.94)", border: "1px solid rgba(233,210,150,.45)",
          boxShadow: "0 10px 30px rgba(0,0,0,.55)", textAlign: "center", animation: "rise .2s ease", pointerEvents: "auto" }}>
          <div className="gg-serif" style={{ fontSize: 14, color: "#f6e9a4", letterSpacing: ".06em" }}>{t("camp.gambitTitle")}</div>
          <div className="gg-serif" style={{ fontSize: 12.5, color: "#e9d296", marginTop: 4 }}>
            {t("camp.gambitLine", { lvl, tier: ["I","II","III","IV","V","VI"][gt - 1] || gt })}</div>
          <div style={{ fontSize: 11, color: "#c9b98f", letterSpacing: ".2em", marginTop: 2 }}>{"✦".repeat(gt)}</div>
          {onOpenTree && <button onClick={onOpenTree} style={{ marginTop: 9, width: "100%", padding: "8px 12px", borderRadius: 9,
            background: "linear-gradient(165deg, #e0b76c, #b78d43)", border: "1px solid rgba(255,240,200,.5)",
            color: "#17110a", fontWeight: 800, fontSize: 12.5, fontFamily: "inherit", cursor: "pointer" }}>{t("camp.gambitTree")} ›</button>}
        </div>;
      })()}
      {/* floating chrome: back pill + league badge (left), zoom (right) —
          always INSIDE the rounded map frame, padded off its edge */}
      <div style={{ position: "absolute", top: frameY + 12, left: frameX + 12, right: frameX + 12, zIndex: 8, display: "flex",
        alignItems: "center", gap: 8, pointerEvents: "none" }}>
        {/* league navigation: ‹ back through mastered worlds, › forward again —
            and once the League Master has fallen, the golden gate: Onward. */}

        {/* the atlas button: a small round seal with the field map + waypin,
            hand-drawn — one tap steps out to the world painting */}
        <button onClick={() => setWorld(true)} title={t("camp.zoomOut")}
          style={{ pointerEvents: "auto", cursor: "pointer", width: 40, height: 40, borderRadius: "50%",
            display: "grid", placeItems: "center", background: "rgba(8, 11, 20, .48)",
            border: "1px solid rgba(233, 210, 150, .42)", boxShadow: "0 2px 10px rgba(0,0,0,.35), inset 0 0.5px 0 rgba(255,243,196,.25)",
            backdropFilter: "blur(10px) saturate(1.1)", WebkitBackdropFilter: "blur(10px) saturate(1.1)" }}>
          <MapPinIc size={21} />
        </button>
        {viewLeague > 1 && (
          <button onClick={() => { setViewLeague(viewLeague - 1); setPanOff({ x: 0, y: 0 }); }} title={ROMAN[viewLeague - 2] || viewLeague - 1}
            style={{ pointerEvents: "auto", cursor: "pointer", width: 40, height: 40, borderRadius: "50%",
              display: "grid", placeItems: "center", background: "rgba(8, 11, 20, .48)",
              border: "1px solid rgba(233, 210, 150, .42)", boxShadow: "0 2px 10px rgba(0,0,0,.35), inset 0 0.5px 0 rgba(255,243,196,.25)",
              backdropFilter: "blur(10px) saturate(1.1)", WebkitBackdropFilter: "blur(10px) saturate(1.1)" }}>
            <BackIc size={19} />
          </button>
        )}
        <div style={{ flex: 1 }} />
        {bm && (() => {
          const cur = nodeById(token.at);
          const ch = CHAPTERS.find((c) => cur && cur.row >= c.fromRow && cur.row <= c.toRow) || CHAPTERS[0];
          return <div className="gg-serif" style={{ pointerEvents: "none", display: "inline-flex", alignItems: "center",
            height: 40, padding: "0 15px", borderRadius: 999, background: "rgba(8, 11, 20, .48)",
            border: "1px solid rgba(233, 210, 150, .42)", color: "#e9d296", fontSize: 11.5, letterSpacing: ".12em",
            whiteSpace: "nowrap", boxShadow: "0 2px 10px rgba(0,0,0,.35), inset 0 0.5px 0 rgba(255,243,196,.25)",
            backdropFilter: "blur(10px) saturate(1.1)", WebkitBackdropFilter: "blur(10px) saturate(1.1)" }}>
            {(en ? "CHAPTER " : "KAPITEL ")}{["I", "II", "III", "IV"][ch.n - 1]} · {(en ? ch.titleEn : ch.titleDe).toUpperCase()}
          </div>;
        })()}
        {viewLeague < league && (
          <button onClick={() => { setViewLeague(viewLeague + 1); setPanOff({ x: 0, y: 0 }); }} title={ROMAN[viewLeague] || viewLeague + 1}
            style={{ pointerEvents: "auto", cursor: "pointer", width: 40, height: 40, borderRadius: "50%",
              display: "grid", placeItems: "center", background: "rgba(8, 11, 20, .48)",
              border: "1px solid rgba(233, 210, 150, .42)", boxShadow: "0 2px 10px rgba(0,0,0,.35), inset 0 0.5px 0 rgba(255,243,196,.25)",
              backdropFilter: "blur(10px) saturate(1.1)", WebkitBackdropFilter: "blur(10px) saturate(1.1)" }}>
            <span style={{ transform: "scaleX(-1)", display: "grid" }}><BackIc size={19} /></span>
          </button>
        )}
        {!viewing && nodeStatus(profile, "n22") === "cleared" && (
          <button onClick={() => dispatch({ type: "REPLACE", profile: advanceLeague(profile) })} className="gg-serif"
            style={{ pointerEvents: "auto", display: "inline-flex", alignItems: "center", gap: 6,
            cursor: "pointer", background: "linear-gradient(160deg, rgba(240,214,138,.92), rgba(176,140,68,.92))",
            border: "1px solid rgba(255,240,200,.7)", color: "#17110a", borderRadius: 999,
            padding: "8px 14px 8px 16px", fontFamily: "inherit", fontWeight: 800, fontSize: 13.5, letterSpacing: ".08em",
            boxShadow: "0 2px 14px rgba(201,164,92,.45)",
            backdropFilter: "blur(10px) saturate(1.1)", WebkitBackdropFilter: "blur(10px) saturate(1.1)" }}>
            {t("camp.advance", { r: ROMAN[league] || league + 1 })} <span style={{ fontSize: 16, lineHeight: 1 }}>›</span>
          </button>
        )}
      </div>

      {/* ── THE OVERWORLD PAINTING: the whole journey on one canvas — the
          measured corridor carries ten anchors, spring at the foot, the
          Endless Sea and its lighthouse at the crown. Reached leagues glow
          with a pale halo on the road (the "brighter gradients"); what lies
          ahead sleeps under mist and lock. Tapping an anchor opens its lore. ── */}
      {world && (() => {
        const ratio = WORLD_MAP.h / WORLD_MAP.w;
        return (
          <div ref={(el) => {
              // open the atlas WHERE YOU ARE: scroll the current league into the middle
              if (!el || el._ggScrolled) return; el._ggScrolled = true;
              requestAnimationFrame(() => {
                const img = el.querySelector("[data-world-frame]");
                if (!img) return;
                const ay = WORLD_MAP.anchors[Math.min(10, Math.max(1, league))][1] / 100;
                el.scrollTop = Math.max(0, img.offsetTop + img.offsetHeight * ay - el.clientHeight / 2);
              });
            }}
            onClick={() => { setWorldSel(null); setWorld(false); }} style={{ position: "absolute", inset: 0, zIndex: 12,
            background: "rgba(4,6,10,.82)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
            overflowY: "auto", padding: "22px 12px calc(30px + env(safe-area-inset-bottom))" }}>
            <div className="gg-serif" style={{ textAlign: "center", color: "#e9d296", letterSpacing: ".24em",
              fontSize: 15, marginBottom: 4 }}>❖ {t("camp.world").toUpperCase()} ❖</div>
            <div style={{ textAlign: "center", color: "rgba(233,210,150,.55)", fontSize: 11.5, marginBottom: 12 }}>{t("camp.worldHint")}</div>
            <div data-world-frame onClick={(e) => e.stopPropagation()} style={{ position: "relative", maxWidth: 430, margin: "0 auto",
              borderRadius: 14, overflow: "hidden", border: "1px solid rgba(233,210,150,.35)",
              boxShadow: "0 14px 40px rgba(0,0,0,.6)" }}>
              <button onClick={() => { setWorldSel(null); setWorld(false); }} title={t("camp.zoomIn")}
                style={{ position: "absolute", top: 10, left: 10, zIndex: 8, cursor: "pointer",
                  width: 38, height: 38, borderRadius: "50%", display: "grid", placeItems: "center",
                  background: "rgba(8, 11, 20, .55)", border: "1px solid rgba(233, 210, 150, .42)",
                  boxShadow: "0 2px 10px rgba(0,0,0,.4), inset 0 0.5px 0 rgba(255,243,196,.25)",
                  backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
                <BackIc size={20} />
              </button>
              <img src={WORLD_MAP.url} alt="" draggable={false} style={{ display: "block", width: "100%",
                aspectRatio: `${WORLD_MAP.w} / ${WORLD_MAP.h}`, userSelect: "none" }} />
              {/* mist over what lies ahead: from just above the current league to the crown */}
              {league < 10 && (() => {
                const cutY = Math.max(0, WORLD_MAP.anchors[Math.min(10, league + 1)][1] - 4);
                return <div aria-hidden style={{ position: "absolute", left: 0, right: 0, top: 0, height: `${cutY + 5}%`,
                  background: "linear-gradient(180deg, rgba(14,12,9,.78) 0%, rgba(14,12,9,.72) 82%, rgba(14,12,9,0) 100%)",
                  overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: "-12%", filter: "blur(14px)", opacity: 0.72,
                    background: "radial-gradient(52% 38% at 78% 34%, rgba(196,186,168,.34), transparent 70%), radial-gradient(50% 34% at 74% 62%, rgba(176,168,152,.26), transparent 70%)",
                    animation: "ggFogR 44s ease-in-out infinite alternate" }} />
                  <div style={{ position: "absolute", inset: "-12%", filter: "blur(18px)", opacity: 0.55,
                    background: "radial-gradient(46% 30% at 84% 22%, rgba(206,196,178,.3), transparent 70%), radial-gradient(40% 26% at 30% 76%, rgba(170,162,148,.24), transparent 70%)",
                    animation: "ggFogR2 58s ease-in-out infinite alternate" }} />
                </div>;
              })()}
              {Array.from({ length: 10 }, (_, i) => i + 1).map((lg) => {
                const [ax, ay] = WORLD_MAP.anchors[lg];
                const reachable = lg <= league;
                const here = lg === league;
                return (
                  <div key={lg} onClick={(e) => { e.stopPropagation(); if (reachable) setWorldSel(worldSel === lg ? null : lg); }}
                    style={{ position: "absolute", left: `${ax}%`, top: `${ay}%`, transform: "translate(-50%, -50%)",
                      cursor: reachable ? "pointer" : "default" }}>
                    {/* the brighter gradient: a pale halo where the road passes a mastered world */}
                    {reachable && <div aria-hidden style={{ position: "absolute", left: "50%", top: "50%",
                      width: 96, height: 96, transform: "translate(-50%, -50%)", pointerEvents: "none",
                      background: `radial-gradient(circle, rgba(255,243,196,${here ? ".34" : ".22"}) 0%, rgba(255,243,196,${here ? ".14" : ".08"}) 45%, transparent 70%)` }} />}
                    <div style={{ position: "relative", width: here ? 34 : 28, height: here ? 34 : 28, borderRadius: "50%",
                      display: "grid", placeItems: "center",
                      background: reachable ? "rgba(20,16,8,.72)" : "rgba(10,12,18,.7)",
                      border: here ? "2px solid #f0d68a" : reachable ? "1.5px solid rgba(233,210,150,.75)" : "1.5px solid rgba(150,150,160,.4)",
                      boxShadow: here ? "0 0 14px rgba(240,214,138,.55)" : "0 2px 8px rgba(0,0,0,.5)" }}>
                      <span className="gg-serif" style={{ fontSize: reachable ? 12 : 11, fontWeight: 700,
                        color: reachable ? "#e9d296" : "rgba(200,200,210,.55)" }}>
                        {reachable ? (ROMAN[lg - 1] || lg) : <svg width="11" height="12" viewBox="0 0 14 16" aria-hidden style={{ display: "block" }}>
                          <defs><linearGradient id="ggLockG" x1="0" y1="0" x2="0.6" y2="1">
                            <stop offset="0" stopColor="#f6e096" /><stop offset=".5" stopColor="#d9b264" /><stop offset="1" stopColor="#a97e3c" />
                          </linearGradient></defs>
                          <path d="M4 7 L4 4.6 A3 3 0 0 1 10 4.6 L10 7" fill="none" stroke="url(#ggLockG)" strokeWidth="1.7" strokeLinecap="round" />
                          <rect x="2.4" y="6.8" width="9.2" height="7.6" rx="1.8" fill="url(#ggLockG)" stroke="#7a5c26" strokeWidth="0.9" />
                          <circle cx="7" cy="10.2" r="1.15" fill="#5c4318" />
                          <path d="M7 10.8 L7 12.4" stroke="#5c4318" strokeWidth="1.1" strokeLinecap="round" />
                        </svg>}</span>
                    </div>
                    {here && <div className="gg-serif" style={{ position: "absolute", left: "50%", top: "100%",
                      transform: "translateX(-50%)", marginTop: 3, fontSize: 8.5, letterSpacing: ".14em",
                      color: "#f0d68a", textShadow: "0 1px 3px rgba(0,0,0,.9)", whiteSpace: "nowrap" }}>{t("hub.at").toUpperCase()}</div>}
                  </div>
                );
              })}
              {/* the lore sheet lives INSIDE the painting now: above the tapped
                  anchor, in the veiled dark where there is always room */}
              {worldSel && (() => {
                const wt = themeForLeague(worldSel);
                const lore = LEAGUE_LORE[worldSel];
                const ay = WORLD_MAP.anchors[worldSel][1];
                const below = ay < 30;                       // crown anchors: sheet drops BELOW instead
                const top = below ? `${ay + 5}%` : undefined;
                const bottom = below ? undefined : `${100 - ay + 4}%`;
                return (
                  <div onClick={(e) => e.stopPropagation()} style={{ position: "absolute", left: "50%",
                    transform: "translateX(-50%)", width: "min(92%, 340px)", top, bottom, zIndex: 6,
                    borderRadius: 14, border: "1px solid rgba(233,210,150,.4)", background: "rgba(12,15,22,.92)",
                    padding: "12px 13px", animation: "rise .25s ease" }}>
                    <div className="gg-serif" style={{ color: "#e9d296", fontSize: 15, letterSpacing: ".1em" }}>
                      {ROMAN[worldSel - 1]} · {wt.nameDe}</div>
                    <div className="gg-serif" style={{ color: "rgba(240,233,216,.85)", fontSize: 12.5, fontStyle: "italic",
                      lineHeight: 1.6, marginTop: 6 }}>{lore ? (profile.lang === "en" ? lore.en : lore.de) : ""}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 11 }}>
                      <GoldShineButton style={{ flex: 1, padding: "9px 12px", fontSize: 13, borderRadius: 10 }}
                        onClick={() => { setViewLeague(worldSel); setPanOff({ x: 0, y: 0 }); setWorldSel(null); setWorld(false); }}>
                        {worldSel === viewLeague ? t("camp.worldHere") : t("camp.worldTravel")}
                      </GoldShineButton>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        );
      })()}


      {/* embedded node panel — parchment overlay near the medallion; arrival is
          part of the world, not a card below the map */}
      {showPanel && (
        <div key={sel + (token.at === sel ? "@" : "")} style={{ position: "absolute", left: frameX + panelLeft, width: panelW, ...panelPos,
          zIndex: 7, background: "rgba(240,233,216,.6)", backdropFilter: "blur(16px) saturate(1.15)",
          WebkitBackdropFilter: "blur(16px) saturate(1.15)", border: `1px solid ${PP.line}`, borderRadius: 18, color: PP.ink,
          boxShadow: "0 0 30px rgba(30,25,15,.2)", padding: "12px 13px 13px",
          animation: "rise .26s ease",
          transition: `left .72s ${CAM_EASE}, top .72s ${CAM_EASE}, bottom .72s ${CAM_EASE}` }}>
          {(() => {
            const br = { a1: "blades", b1: "magic", c1: "order", d1: "power", e1: "wisdom" }[sel];
            return br ? <div className="gg-quill" style={{ fontSize: 12.5, color: PP.dim, marginBottom: 2 }}>
              {BRANCHES[br][en ? "nameEn" : "nameDe"]}</div> : null;
          })()}
          <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
            <div className="gg-quill" style={{ fontSize: 20, color: PP.ink, flex: 1, minWidth: 0, lineHeight: 1.05 }}>{node ? placeFor(node, league) : ""}</div>
            <button onClick={() => setPanelOpen(false)} aria-label="Close" style={{ background: "none", border: "none",
              color: PP.dim, fontSize: 15, cursor: "pointer", padding: "0 0 0 6px", fontFamily: "inherit", lineHeight: 1, flex: "0 0 auto" }}>✕</button>
          </div>
          {(() => { // STRICT secrecy extends to the tale: a boss station's story
            // names its figure — so it stays veiled until you have PLAYED here
            const tell = !node?.boss || status === "cleared" || facedSet.has(sel);
            if (tell && node?.storyDe) return <div className="gg-serif" style={{ fontSize: 12.5, color: PP.dim, marginTop: 4, fontStyle: "italic", lineHeight: 1.45 }}>
              {en ? node.storyEn : node.storyDe}</div>;
            if (node?.boss) return <div className="gg-serif" style={{ fontSize: 12.5, color: PP.dim, marginTop: 4, fontStyle: "italic", lineHeight: 1.45 }}>
              {t("camp.veiled")}</div>;
            return null; })()}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 9 }}>
            <Chip className="gg-serif" color={PP.chipInk} bg={PP.bg2}>{mapById(effectiveMap(node, league))[en ? "nameEn" : "nameDe"]}</Chip>
            <Chip className="gg-serif" color={PP.chipInk} bg={PP.bg2}>{t("mode." + node.rules)}</Chip>
            <Chip className="gg-serif" color={PP.chipInk} bg={PP.bg2}>{t("diff." + node.difficulty)}{node.bump ? ` +${node.bump}` : ""}</Chip>
            <Chip className="gg-serif" color={"#3c4a22"} bg={"#d3deb2"}>+{Math.round((node.reward?.xp || 0) * mult * (friendly ? 0.25 : 1))} XP</Chip>
            <Chip className="gg-serif" color={"#17110a"} bg={"#e8c96a"}><GoldCoin size={12} /> +{Math.round((5 + 2 * node.row + (node.boss ? 6 : 0)) * mult / (friendly ? 2 : 1))}</Chip>
          </div>
          {boss && (status === "cleared" || facedSet.has(sel)) && (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 13, marginTop: 10, padding: "10px 12px",
              background: PP.bg2, borderRadius: 9, border: `1px solid ${PP.line}` }}>
              <div style={{ width: 84, height: 108, flex: "0 0 auto" }}>
                {(() => {
                  const painting = paintedForPiece({ kind: boss.kind, art: boss.art, bossId: boss.bossId });
                  return painting
                    ? <img src={painting} alt="" draggable={false} style={{ width: "100%", height: "100%",
                        objectFit: "contain", objectPosition: "bottom",
                        filter: golden ? "drop-shadow(0 2px 2px rgba(40,32,16,.35))" : `${ENEMY_FILTER} drop-shadow(0 2px 2px rgba(40,32,16,.35))`,
                        userSelect: "none", pointerEvents: "none" }} />
                    : <PieceArt kind={boss.kind} art={boss.art} fill={golden ? "#c9a45c" : "#242d44"} rim={golden ? "#f0dfae" : "#93a0bb"}
                        detail={golden ? "#59421a" : "#9aa8c6"} accent={boss.accent || T.gold} size="100%" level={1} />;
                })()}
              </div>
              <div style={{ minWidth: 0, paddingBottom: 3 }}>
                <div className="gg-serif" style={{ fontSize: 17, letterSpacing: ".03em", color: PP.ink }}>{boss.name[en ? "en" : "de"]}</div>
                <div className="gg-serif" style={{ fontSize: 12.5, color: "#8a6f4d", marginTop: 5, display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
                  <HeartIc color="#8a6f4d" size={12} /> {boss.hp} <span style={{ opacity: .55 }}>·</span> <BladesIc color="#8a6f4d" size={12} /> {boss.atk}
                  {(() => { const f = familyOf(boss.kind);
                    return f ? <><span style={{ opacity: .55 }}>·</span> {f === "crown" ? (en ? "Crown" : "Kronenfiguren") : (en ? "Shadows" : "Schattenwesen")}</> : null; })()}
                </div>
                {unlockCh && known && status !== "cleared" && facedSet.has(sel) && <div className="gg-serif" style={{ fontSize: 11.5, color: "#8e2f39", fontStyle: "italic", marginTop: 4, lineHeight: 1.4 }}>
                  {t("camp.turncoat", { name: unlockCh[en ? "nameEn" : "nameDe"] })}</div>}
                {(() => { const v = voiceFor(boss);   // the saga speaks on the map too
                  return v ? <div className="gg-serif" style={{ fontSize: 11.5, color: "#6b5c44", fontStyle: "italic", marginTop: 5, lineHeight: 1.5 }}>
                    {v[en ? "heraldEn" : "heraldDe"]}</div> : null; })()}
              </div>
            </div>
          )}
          {/* the aftermath, told on the spot: joined the retinue, fled again (with tally), or simply done */}
          {status === "cleared" && (() => {
            const nm = unlockCh ? unlockCh[en ? "nameEn" : "nameDe"] : null;
            const txt = node.id === "n22" ? t("camp.stKeepFriendly")
              : unlockCh
              ? (known ? t("camp.stFriendly", { name: nm })
                       : t("camp.stFled", { n: bossWinsFor(profile, unlockCh.id), name: nm }))
              : t("camp.stDone");
            return <div className="gg-serif" style={{ marginTop: 9, fontSize: 12, fontStyle: "italic", lineHeight: 1.4,
              color: golden ? PP.green : PP.dim }}>{golden ? "✦ " : "✓ "}{txt}</div>;
          })()}
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
                  <GoldCoin size={13} /> {cost} · {t("camp.payToll")}
                </Button>
              </div>;
            }
            const it = ITEMS[g.item];
            const pieceCh2 = g.piece ? CHARACTERS[g.piece] : null;
            const pieceOk = !g.piece || (profile.campaign?.unlocked || []).includes(g.piece);
            const itemOk = hasItem(profile, g.item);
            const can = !itemOk && (profile.gold || 0) >= it.gold;
            return <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "9px 11px",
              background: "#c9a45c22", border: "1.5px dashed #a9853f", borderRadius: 9 }}>
              <ItemIcon id={it.id} size={22} />
              <div style={{ flex: 1, fontSize: 12.5 }}>
                <b>{itemOk ? <><CheckIc size={13} /> </> : ""}{t("camp.gateNeed", { item: en ? it.nameEn : it.nameDe })}</b>
                <div style={{ color: PP.dim, fontSize: 11.5 }}>{en ? it.textEn : it.textDe}</div>
                {pieceCh2 && <div style={{ fontSize: 11.5, marginTop: 3, color: pieceOk ? PP.green : MP.liga, fontWeight: 700 }}>
                  {pieceOk ? <CheckIc size={13} /> : <BoxIc size={13} />} {t("camp.gatePiece", { name: en ? pieceCh2.nameEn : pieceCh2.nameDe })}
                </div>}
              </div>
              {!itemOk && <Button variant={can ? "primary" : "subtle"} disabled={!can}
                onClick={() => dispatch({ type: "BUY_ITEM", id: it.id })}
                style={{ padding: "9px 14px", whiteSpace: "nowrap", ...(can ? {} : { background: "#dcd3ba", color: PP.ink }) }}>
                <GoldCoin size={13} /> {it.gold} · {t("camp.buyHere")}
              </Button>}
            </div>;
          })() : (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Button variant={status === "available" || friendly ? "primary" : "subtle"} disabled={status === "locked" || closed}
                onClick={() => onStart(sel)} style={{ flex: 1, position: "relative", overflow: "hidden",
                  ...(status === "available" || friendly
                    ? { background: "rgba(201,164,92,.72)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,240,200,.55)", boxShadow: "0 0 16px rgba(201,164,92,.3)" }
                    : { background: "#dcd3ba", color: PP.ink }) }}>
                {status === "available" && <span aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "42%",
                  background: "linear-gradient(90deg, transparent, rgba(255,244,210,.28), transparent)",
                  animation: "ggShine 12s ease-in-out 1.8s infinite", pointerEvents: "none" }} />}
                <BladesIc color={T.limeInk} size={14} /> {profile.pausedMatch?.nodeId === sel && status !== "locked" ? t("camp.resume") : status === "cleared" ? (friendly ? t("camp.friendly") : t("camp.done")) : status === "locked" ? t("camp.locked") : (sel === token.at ? t("camp.startChallenge") : t("camp.play"))}
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
            <div className="gg-serif" style={{ fontSize: 17, color: "#cfe6f2", letterSpacing: ".06em", display: "flex", alignItems: "center", gap: 8 }}><WaveIc size={18} /> {t("camp.seaLockedTitle")}</div>
            <div style={{ fontSize: 12.5, color: "#9dbdd0", margin: "6px 0 10px", lineHeight: 1.5 }}>{t("camp.seaLockedText")}</div>
            <div style={{ display: "grid", gap: 6, fontSize: 13, color: "#cfe6f2" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                {(profile.campaign?.unlocked || []).includes("captain") ? <CheckIc size={15} /> : <BoxIc size={15} />}
                <AnchorIc size={15} /> {t("camp.seaNeedCaptain")}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                {hasItem(profile, "boat") ? <CheckIc size={15} /> : <BoxIc size={15} />}
                <BoatIc size={15} /> {t("camp.seaNeedBoat")}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
