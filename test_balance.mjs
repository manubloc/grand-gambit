// ── BALANCE: the game plays ITSELF ───────────────────────────────────────────
// The AI takes both chairs and plays whole matches on real campaign stages at
// different levels. We measure how many plies (half-moves) a duel takes and
// pin down floors: no stage may be winnable in a scholar's-mate sprint, and
// duels must actually finish inside a sane horizon.
import { createGame, applyMove, status } from "./src/core/index.js";
import { chooseMove } from "./src/ai/index.js";
import { buildStageMatch, buildArmyForMap, defaultProfile, resolveCharacter } from "./src/meta/index.js";
import { mapById, CHARACTERS } from "./src/content/index.js";

let passed = 0, failed = 0;
const ok = (name, cond) => { if (cond) { passed++; console.log("  ok  - " + name); } else { failed++; console.log("  FAIL- " + name); } };

// deterministic rng so the suite never flakes — the engine's own port
import { makeRng } from "./src/core/ports/rng.js";

/** Play one full duel, both sides driven by the bot. Returns { plies, st }. */
function playOut(white, black, { map = "classic", rules = "chess", depth = 2, seed = 7, cap = 240 } = {}) {
  let state = createGame(white, black, { seed, map, rules });
  const rng = makeRng((seed * 2654435761) >>> 0);
  let plies = 0, st = status(state);
  while (!st.over && plies < cap) {
    const mv = chooseMove(state, depth, rng);
    if (!mv) break;
    state = applyMove(state, mv);
    plies++;
    st = status(state);
  }
  return { plies, st };
}

/** A stage duel: the station's AI army vs a player army from the profile. */
function playStage(id, profile, seed) {
  const m = buildStageMatch(id, profile);
  const mp = mapById(m.map || "classic");
  const player = buildArmyForMap(profile, mp);
  return playOut(player, m.aiArmy, { map: mp, rules: m.rules || "chess", depth: Math.min(2, m.depth || 2), seed });
}

const SEEDS = [3, 11];
const floorOver = (games) => Math.min(...games.map((g) => g.plies));
const anyFinished = (games) => games.some((g) => g.st.over);

// 1) the very first station, fresh hero at level 1
const fresh = defaultProfile();
const g1 = SEEDS.map((s) => playStage("n01", fresh, s));
ok(`the opening station is no sprint — shortest duel ${floorOver(g1)} plies (>= 12)`, floorOver(g1) >= 12);
ok("no opening game collapses early — every duel outlives 12 plies or runs deep", g1.every((g) => g.plies >= 12));

// 2) a boss station: the dragon of league I
const g2 = SEEDS.map((s) => playStage("a4", fresh, s));
ok(`the dragon's lair holds longer than a skirmish — shortest ${floorOver(g2)} plies (>= 16)`, floorOver(g2) >= 16);

// 3) the League Keep, the hardest table of league I
const g3 = SEEDS.map((s) => playStage("n22", fresh, s));
ok(`the League Keep is a real siege — shortest ${floorOver(g3)} plies (>= 16)`, floorOver(g3) >= 16);
ok("the Keep duel reaches a decisive end", anyFinished(g3));

// 4) a grown court in a later league: gambit 20, some champions leveled
const grown = { ...defaultProfile(), campaign: { league: 5, cleared: [], unlocked: ["hawk", "assassin", "mage"], dupes: {}, bossWins: {} },
  pieces: { levels: { gambit: 20, rook: 7, knight: 7, bishop: 6, queen: 8, hawk: 6, assassin: 6, mage: 6 }, abilities: {} } };
const g4 = SEEDS.map((s) => playStage("n01", grown, s));
ok(`league V with a leveled court still trades blows — shortest ${floorOver(g4)} plies (>= 12)`, floorOver(g4) >= 12);

// 5) symmetry sanity: two IDENTICAL fresh armies must never end absurdly fast
const base = buildArmyForMap(fresh, mapById("classic"));
const g5 = SEEDS.map((s) => playOut(base, base, { seed: s, map: mapById("classic") }));
ok(`mirrored armies fight a full game — shortest ${floorOver(g5)} plies (>= 20)`, floorOver(g5) >= 20);

// 6) the hero spec really scales: level 30 gambit carries 6 shields into battle
ok("the level-30 gambit walks in with six shields", resolveCharacter(CHARACTERS.gambit, 30, null).shield === 6);

console.log(`\nRESULT: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
