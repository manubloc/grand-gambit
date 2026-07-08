// Renders /tmp/gg-splash.svg and /tmp/gg-map.svg from the REAL app components
// (Emblem, mapArt scenery, PieceArt), so previews always match what ships.
// Run via `npm run preview`, then rasterize with cairosvg.
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "fs";
import { Emblem } from "./src/app/ui/Brand.jsx";
import { CAMPAIGN, nodeById, CHARACTERS, CHAPTERS } from "./src/content/index.js";
import { PieceArt } from "./src/app/ui/board/PieceArt.jsx";
import { MP, GEO, buildCampaignScenery, Pine, Leafy, Rock, RidgeCluster, Cloud, Keep, Cottage, Mill, Bridge, Field, Boat, Birds, Mist, Wisp, StoneCircle, Crystal, DeadTree, RuinArch } from "./src/app/ui/mapArt.jsx";

const GOLD = "#c9a45c", HI = "#e3c07a", NAVY = "#0e1424";

// ── splash ────────────────────────────────────────────────────────────────────
const splash = <svg xmlns="http://www.w3.org/2000/svg" width="460" height="470" viewBox="0 0 460 470">
  <rect width="460" height="470" fill={NAVY} />
  <svg x="105" y="30" width="250" height="228" viewBox="0 0 220 200">{Emblem({ animate: false }).props.children}</svg>
  <text x="230" y="300" textAnchor="middle" fontSize="20" fill={HI} fontFamily="Georgia, serif" letterSpacing="9">GRAND</text>
  <text x="230" y="342" textAnchor="middle" fontSize="42" fill={GOLD} fontFamily="Georgia, serif" letterSpacing="7">GAMBIT</text>
  <g stroke={GOLD}><path d="M120 366 L216 366 M244 366 L340 366" strokeWidth="1.2" /><rect x="226" y="361" width="9" height="9" transform="rotate(45 230.5 365.5)" fill={GOLD} stroke="none" /></g>
</svg>;
writeFileSync("/tmp/gg-splash.svg", renderToStaticMarkup(splash));

// ── campaign map ─────────────────────────────────────────────────────────────
const { WMAP, HMAP, LEFT, STEP, TOPPAD, nx, ny } = GEO;
const n02 = nodeById("n02");
const millAt = { x: nx(n02) + 44, y: ny(n02) - 52 };
const sc = buildCampaignScenery(CAMPAIGN.map((n) => ({ x: nx(n), y: ny(n) })), millAt);
const edges = CAMPAIGN.flatMap((a) => a.next.map((t) => ({ a, b: nodeById(t) })));

const map = <svg xmlns="http://www.w3.org/2000/svg" width={WMAP} height={HMAP} viewBox={`0 0 ${WMAP} ${HMAP}`} style={{ fontFamily: "Georgia, serif" }}>
  <rect width={WMAP} height={HMAP} fill={MP.paper} />
  <linearGradient id="w" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stopColor="#5f7a52" stopOpacity=".28" /><stop offset="20%" stopColor="#77875f" stopOpacity=".18" />
    <stop offset="45%" stopColor="#c9b68a" stopOpacity=".24" /><stop offset="70%" stopColor="#7d6b8f" stopOpacity=".2" />
    <stop offset="100%" stopColor="#8e2f39" stopOpacity=".26" />
  </linearGradient>
  <rect width={WMAP} height={HMAP} fill="url(#w)" />
  <path d={`M0 ${HMAP - 34} C ${WMAP * 0.2} ${HMAP - 52}, ${WMAP * 0.36} ${HMAP - 16}, ${WMAP * 0.55} ${HMAP - 34} S ${WMAP * 0.85} ${HMAP - 18}, ${WMAP} ${HMAP - 40}`} fill="none" stroke={MP.river} strokeWidth="10" strokeLinecap="round" opacity=".6" />
  <ellipse cx={WMAP * 0.235} cy={HMAP - 40} rx="46" ry="13" fill={MP.river} opacity=".55" />
  <path d={sc.river2} fill="none" stroke={MP.river} strokeWidth="8" strokeLinecap="round" opacity=".55" />
  {CHAPTERS.slice(1).map((c) => <path key={c.n} d={`M${LEFT + (c.fromRow - 0.5) * STEP} ${TOPPAD - 20} L${LEFT + (c.fromRow - 0.5) * STEP} ${HMAP - 54}`} stroke={MP.trailDim} strokeWidth="1.4" strokeDasharray="2 7" opacity=".7" />)}
  {sc.clouds.map((c, i) => Cloud({ ...c, k: "c" + i }))}
  {sc.ridges.map((m, i) => RidgeCluster({ ...m, k: "r" + i }))}
  {sc.mistsBack.map((m, i) => Mist({ ...m, k: "mb" + i }))}
  {StoneCircle({ ...sc.stonesAt, s: 1.05, k: "st" })}
  {RuinArch({ x: nx(nodeById("e1")) - 56, y: ny(nodeById("e1")) + 30, s: 1, k: "ru" })}
  {sc.crystals.map((m, i) => Crystal({ ...m, k: "cr" + i }))}
  {sc.rocks.map((m, i) => Rock({ ...m, k: "k" + i }))}
  {sc.leafy.map((m, i) => Leafy({ ...m, k: "l" + i }))}
  {sc.fields.map((m, i) => Field({ ...m, k: "f" + i }))}
  {sc.cottages.map((m, i) => Cottage({ ...m, k: "h" + i }))}
  {Mill({ ...millAt, s: 1.05, k: "mill" })}
  {Boat({ x: WMAP * 0.235 + 10, y: HMAP - 42, s: 1, k: "boat" })}
  {sc.birds.map((m, i) => Birds({ ...m, k: "b" + i }))}
  {sc.farPines.map((m, i) => Pine({ ...m, k: "fp" + i }))}
  {sc.pines.map((m, i) => Pine({ ...m, k: "p" + i }))}
  {sc.deadTrees.map((m, i) => DeadTree({ ...m, k: "dt" + i }))}
  {sc.mistsFront.map((m, i) => Mist({ ...m, k: "mf" + i }))}
  {sc.wisps.map((m, i) => Wisp({ ...m, k: "wi" + i }))}
  {edges.map(({ a, b }, i) => { const x1 = nx(a), y1 = ny(a), x2 = nx(b), y2 = ny(b), xm = (x1 + x2) / 2;
    return <path key={"e" + i} d={`M${x1} ${y1} C ${xm} ${y1}, ${xm} ${y2}, ${x2} ${y2}`} fill="none" stroke={MP.trailDim} strokeWidth="4.5" strokeLinecap="round" strokeDasharray="0.5 9.5" opacity=".7" />; })}
  {[(ny({ col: 0 }) + ny({ col: 2 })) / 2, ny({ col: 2 }), (ny({ col: 4 }) + ny({ col: 2 })) / 2].map((y, i) => Bridge({ x: sc.riverXAt(y), y, s: 1.05, k: "br" + i }))}
  {Keep({ x: 62, y: ny({ col: 2 }) - 6, s: 1.15, fill: MP.medal, k: "K1" })}
  {Keep({ x: WMAP - 84, y: ny({ col: 2 }) - 10, s: 1.7, fill: MP.liga, k: "K2" })}
  {CHAPTERS.map((c) => <text key={"t" + c.n} x={LEFT + ((c.fromRow + c.toRow) / 2) * STEP} y={26} textAnchor="middle" fontSize="12" letterSpacing="2" fill={MP.ink}>KAPITEL {["I", "II", "III", "IV"][c.n - 1]} · {c.titleDe.toUpperCase()}</text>)}
  <text x={WMAP - 84} y={ny({ col: 2 }) - 62} textAnchor="middle" fontSize="19" letterSpacing="4" fill={MP.liga} fontWeight="700">❖ LIGA ❖</text>
  {CAMPAIGN.map((n) => { const pc = n.boss && n.boss.piece ? CHARACTERS[n.boss.piece] : null; const below = n.col <= 2;
    return <g key={n.id}>
      <circle cx={nx(n)} cy={ny(n)} r="23" fill={MP.medal} stroke="#c9a45c" strokeWidth="2.5" />
      {pc && <svg x={nx(n) - 15} y={ny(n) - 15} width="30" height="30" viewBox="0 0 48 48">{PieceArt({ kind: pc.kind, fill: MP.ivory, rim: "#c9a45c", detail: MP.medal, level: 1 }).props.children}</svg>}
      <text x={nx(n)} y={ny(n) + (below ? 42 : -34)} textAnchor="middle" fontSize="10.5" fill={MP.ink}>{n.place}</text>
    </g>; })}
</svg>;
writeFileSync("/tmp/gg-map.svg", renderToStaticMarkup(map));
console.log("previews written:", WMAP + "x" + HMAP);
