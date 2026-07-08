import { MAPS, mapById, validateMap, inMap, inBox, isHole, holeSet, mapIdx, playableCount } from "./src/content/maps.js";

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

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
