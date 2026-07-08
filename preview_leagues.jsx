// Renders complete league-world maps (scenery only, medallions as dots) so a
// human can eyeball the ten climates. Usage: node .pl.mjs (after esbuild).
import { renderToStaticMarkup } from "react-dom/server";
import { writeFileSync } from "fs";
import { CAMPAIGN, nodeById } from "./src/content/index.js";
import { MP, GEO, buildCampaignScenery, LEAGUE_THEMES, Pine, Leafy, Rock, RidgeCluster, Cloud, Keep, Cottage, Mill, Bridge, Field, Boat, Birds, Mist, Wisp, StoneCircle, Crystal, DeadTree, RuinArch, Cactus, Dune, Grass, SnowDrift, Palm, Wave, Isle, Lighthouse } from "./src/app/ui/mapArt.jsx";

const { WMAP, HMAP, LEFT, STEP, TOPPAD, LANE, nx, ny } = GEO;

function worldSvg(league) {
  const th = LEAGUE_THEMES[league];
  const n02 = nodeById("n02");
  const millAt = { x: nx(n02) + 44, y: ny(n02) - 52 };
  const sc = buildCampaignScenery(CAMPAIGN.map((n) => ({ x: nx(n), y: ny(n) })), millAt, th);
  const edges = [];
  for (const a of CAMPAIGN) for (const id of a.next || []) { const b = nodeById(id); if (b) edges.push([a, b]); }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={WMAP} height={HMAP} viewBox={`0 0 ${WMAP} ${HMAP}`}>
      <defs>
        <linearGradient id={"wash" + league} x1="0" y1="0" x2="1" y2="0.25">
          {th.wash.map(([off, col, op], i) => <stop key={i} offset={off} stopColor={col} stopOpacity={op} />)}
        </linearGradient>
      </defs>
      <rect width={WMAP} height={HMAP} fill={th.paper} />
      <rect width={WMAP} height={HMAP} fill={`url(#wash${league})`} />
      {th.river && <>
        <path d={`M0 ${HMAP - 34} C ${WMAP * 0.2} ${HMAP - 52}, ${WMAP * 0.36} ${HMAP - 16}, ${WMAP * 0.55} ${HMAP - 34} S ${WMAP * 0.85} ${HMAP - 18}, ${WMAP} ${HMAP - 40}`}
          fill="none" stroke={th.river} strokeWidth="10" strokeLinecap="round" opacity={th.frozen ? 0.85 : 0.6} strokeDasharray={th.frozen ? "14 6" : "none"} />
        <path d={sc.river2} fill="none" stroke={th.river} strokeWidth="8" strokeLinecap="round" opacity={th.frozen ? 0.8 : 0.55} strokeDasharray={th.frozen ? "12 6" : "none"} />
      </>}
      {sc.clouds.map((c, i) => Cloud({ ...c, k: "cl" + i }))}
      {sc.ridges.map((m, i) => RidgeCluster({ ...m, k: "ri" + i }))}
      {sc.dunes.map((m, i) => Dune({ ...m, k: "du" + i }))}
      {sc.drifts.map((m, i) => SnowDrift({ ...m, k: "sd" + i }))}
      {sc.isles.map((m, i) => Isle({ ...m, k: "is" + i }))}
      {th.sea && CAMPAIGN.map((n, i) => Isle({ x: nx(n), y: ny(n) + 14, s: 1.05, k: "nis" + i }))}
      {sc.mistsBack.map((m, i) => Mist({ ...m, k: "mb" + i }))}
      {sc.stonesAt && StoneCircle({ ...sc.stonesAt, s: 1.05, k: "st" })}
      {sc.ruin && RuinArch({ x: nx(nodeById("e1")) - 56, y: ny(nodeById("e1")) + 30, s: 1, k: "ru" })}
      {sc.crystals.map((m, i) => Crystal({ ...m, k: "cr" + i }))}
      {sc.rocks.map((m, i) => Rock({ ...m, k: "ro" + i }))}
      {sc.grass.map((m, i) => Grass({ ...m, k: "gr" + i }))}
      {sc.leafy.map((m, i) => Leafy({ ...m, k: "le" + i }))}
      {sc.blossoms.map((m, i) => Leafy({ ...m, k: "bl" + i }))}
      {sc.cacti.map((m, i) => Cactus({ ...m, k: "ca" + i }))}
      {th.settle && sc.fields.map((m, i) => Field({ ...m, k: "fi" + i }))}
      {th.settle && sc.cottages.map((m, i) => Cottage({ ...m, k: "co" + i }))}
      {th.settle && Mill({ ...millAt, s: 1.05, k: "mi" })}
      {th.river && !th.sea && Boat({ x: WMAP * 0.235 + 10, y: HMAP - 42, s: 1, k: "bo" })}
      {sc.oasis && <>
        <ellipse cx={sc.oasis.x} cy={sc.oasis.y + 8} rx="42" ry="12" fill="#7fb3c9" opacity=".8" />
        {Palm({ x: sc.oasis.x - 30, y: sc.oasis.y - 10, s: 1, k: "p1" })}
        {Palm({ x: sc.oasis.x + 26, y: sc.oasis.y - 14, s: 0.85, k: "p2" })}
      </>}
      {sc.birds.map((m, i) => Birds({ ...m, k: "bi" + i }))}
      {sc.farPines.map((m, i) => Pine({ ...m, k: "fp" + i }))}
      {sc.pines.map((m, i) => Pine({ ...m, k: "pi" + i }))}
      {sc.deadTrees.map((m, i) => DeadTree({ ...m, k: "dt" + i }))}
      {sc.mistsFront.map((m, i) => Mist({ ...m, k: "mf" + i }))}
      {sc.waves.map((m, i) => Wave({ ...m, k: "wa" + i }))}
      {sc.wisps.map((m, i) => Wisp({ ...m, k: "wi" + i }))}
      {edges.map(([a, b], i) => {
        const x1 = nx(a), y1 = ny(a), x2 = nx(b), y2 = ny(b), xm = (x1 + x2) / 2;
        const gated = !!b.gate;
        return <path key={"e" + i} d={`M${x1} ${y1} C ${xm} ${y1}, ${xm} ${y2}, ${x2} ${y2}`} fill="none"
          stroke={gated ? "#7a6a94" : MP.trailDim} strokeWidth={gated ? 3.5 : 4.5} strokeLinecap="round"
          strokeDasharray={gated ? "6 6" : "0.5 9.5"} opacity={gated ? 0.5 : 0.62} />;
      })}
      {th.sea ? <>{Isle({ x: 62, y: ny({ col: 2 }) + 12, s: 1.15, k: "ki1" })}{Lighthouse({ x: 62, y: ny({ col: 2 }) - 4, s: 1.1, k: "k1" })}
        {Isle({ x: WMAP - 84, y: ny({ col: 2 }) + 16, s: 1.6, k: "ki2" })}{Lighthouse({ x: WMAP - 84, y: ny({ col: 2 }) - 8, s: 1.55, k: "k2" })}</>
        : <>{Keep({ x: 62, y: ny({ col: 2 }) - 6, s: 1.15, fill: MP.medal, k: "k1" })}{Keep({ x: WMAP - 84, y: ny({ col: 2 }) - 10, s: 1.7, fill: MP.liga, k: "k2" })}</>}
      {CAMPAIGN.map((n, i) => <g key={"nd" + i}>
        <circle cx={nx(n)} cy={ny(n)} r="17" fill={MP.medal} stroke={n.gate ? "#8a6fb0" : "#c9a45c"} strokeWidth="2.4" />
        {n.gate && <text x={nx(n) + 12} y={ny(n) + 20} fontSize="13">🔒</text>}
      </g>)}
      <text x={WMAP / 2} y="30" textAnchor="middle" fontFamily="Georgia, serif" fontSize="17" letterSpacing="4"
        fill={th.sea ? "#e8f1f5" : MP.ink}>{"LIGA " + ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][league] + " — " + th.nameDe.toUpperCase()}</text>
    </svg>
  );
}

const LGS = (process.env.LEAGUES || "1,4,9,10").split(",").map(Number);
const OUT = process.env.OUT || "/tmp";
for (const lg of LGS) {
  writeFileSync(`${OUT}/gg-liga-${lg}.svg`, renderToStaticMarkup(worldSvg(lg)));
}
console.log("league previews ok");
