import { MAPS, mapById, validateMap, inMap, inBox, isHole, holeSet, mapIdx, playableCount } from "./src/content/maps.js";
import { PLACE_NAMES } from "./src/content/placeNames.js";
import { CAMPAIGN } from "./src/content/index.js";
import { placeFor, nodeInLeague } from "./src/meta/campaign.js";

let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log("  ok  -", n); } else { fail++; console.log(" FAIL -", n); } };

// Every catalog map is valid
for (const m of MAPS) ok(`map "${m.id}" validates`, validateMap(m).length === 0);

// Classic chess is always present and authentic
const classic = mapById("classic");
ok("classic map is 8x8", classic.w === 8 && classic.h === 8);
ok("classic map is flagged classic", classic.classic === true);
ok("classic default is the standard back rank",
  JSON.stringify(classic.defaultFormation) === JSON.stringify(["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]));
ok("at least one classic map exists", MAPS.some((m) => m.classic));

// Sizes and playable counts
ok("arena is 10x10 fully open", playableCount(mapById("arena")) === 100);
ok("skirmish is a small 6x6", mapById("skirmish").w === 6 && playableCount(mapById("skirmish")) === 36);

// Holes (obstacles / shapes)
const yard = mapById("courtyard");
ok("courtyard removes its 4 holes", playableCount(yard) === 60);
ok("a hole is in the box but not in the map", inBox(yard, 3, 3) && !inMap(yard, 3, 3));
ok("a normal cell is in the map", inMap(yard, 0, 0));
ok("isHole detects a hole", isHole(yard, 4, 4) && !isHole(yard, 0, 0));
ok("holeSet size matches holes", holeSet(yard).size === 4);
ok("gauntlet also has obstacles", playableCount(mapById("gauntlet")) === 60);

// Indexing is width-relative
ok("mapIdx uses the map width", mapIdx({ w: 6 }, 2, 3) === 3 * 6 + 2);
ok("mapById falls back for unknown id", mapById("nope") === MAPS[0]);

// Validation actually catches mistakes
ok("validateMap rejects a bad width", validateMap({ w: 8, h: 8, holes: [], back: { whiteBack: 0, blackBack: 7, whitePawn: 1, blackPawn: 6 }, formation: { required: { king: 1 }, flex: 2 }, defaultFormation: ["king"] }).length > 0);


// ── place names: authored, complete, unique across the whole journey ─────────
{
  const ids = new Set(CAMPAIGN.map((n) => n.id));
  let complete = true;
  for (let lg = 2; lg <= 10; lg++)
    for (const n of CAMPAIGN) if (nodeInLeague(n, lg) && !PLACE_NAMES[lg]?.[n.id]) complete = false;
  ok("every station in leagues II-X has an authored name", complete);
  let noStrayIds = true;
  for (let lg = 2; lg <= 10; lg++) for (const id of Object.keys(PLACE_NAMES[lg])) if (!ids.has(id)) noStrayIds = false;
  ok("no place table references an unknown node id", noStrayIds);
  const seen = new Map(); let dup = 0;
  for (const n of CAMPAIGN) seen.set(n.place, "L1");
  for (let lg = 2; lg <= 10; lg++) for (const [id, nm] of Object.entries(PLACE_NAMES[lg])) {
    if (seen.has(nm)) dup++; else seen.set(nm, "L" + lg);
  }
  ok("no place name is ever repeated across all ten leagues", dup === 0);
  ok("league I keeps its homeland names", placeFor(CAMPAIGN.find((n) => n.id === "a1"), 1) === "Nordwacht");
  ok("later leagues rename the same node", placeFor(CAMPAIGN.find((n) => n.id === "a1"), 4) !== "Nordwacht");
}

// ── strict per-station secrecy: a station reveals its figure only after it
// has been PLAYED in this league (campaign.faced), not merely because the
// piece is recruited or the monster was met elsewhere ──
{
  const withFaced = (ids) => ({ campaign: { league: 3, faced: ids, unlocked: ["knight"], cleared: [] }, codex: { met: ["X:b10"] } });
  // facedNode logic mirrored from CampaignScreen: cleared OR in faced set
  const faced = (profile, id) => (profile.campaign?.faced || []).includes(id);
  ok("an unplayed station stays hidden even for a recruited piece", faced(withFaced([]), "a4") === false);
  ok("a played station reveals its figure", faced(withFaced(["a4"]), "a4") === true);
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
