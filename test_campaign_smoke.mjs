// ── CAMPAIGN SMOKE: every node, many seeds, full games, end-to-end summary ──
// Guards against move-time crashes and dragon-node setup failures by driving
// each stage through the real engine + reward pipeline. Engine-level coverage:
// if a node's board, moves, dragon unfolding, capture events or match summary
// throw, this fails loudly.
import { CAMPAIGN, mapById } from "./src/content/index.js";
import { buildStageMatch } from "./src/meta/campaign.js";
import { createGame, applyMove, legalMoves, status } from "./src/core/index.js";
import { buildArmyForMap, withProgressPct, defaultProfile, summarizeMatch, applyResult } from "./src/meta/index.js";

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; } else { fail++; console.log("  FAIL - " + name); } };

const profile = withProgressPct(defaultProfile(), 100, 10);
const SEEDS = [1, 42, 777, 9001, 31337];

let crashed = [];
let dragonNodes = 0, dragonOk = 0;
for (const node of CAMPAIGN) {
  for (const seed of SEEDS) {
    try {
      const m = buildStageMatch(node.id, profile);
      const map = mapById(m.map);
      const wArmy = buildArmyForMap(profile, map, m.excludeId, m.rules);
      let g = createGame(wArmy, m.aiArmy, { map, rules: m.rules, seed });
      // dragon nodes: the 2x2 block must unfold with valid wing refs
      const big = g.board.filter((x) => x && x.big && x.kind === "D").length;
      if (big && seed === SEEDS[0]) {
        dragonNodes++;
        const badWings = g.board.filter((x) => x && x.kind === "D+" && (x.ref == null || !g.board[x.ref])).length;
        if (badWings === 0) dragonOk++;
      }
      const log = [];
      for (let i = 0; i < 120; i++) {
        const st = status(g); if (st.over) break;
        const lm = legalMoves(g); if (!lm.length) break;
        const mv = lm[(i * 17 + seed) % lm.length];
        log.push({ from: mv.from, to: mv.to, ...(mv.special ? { special: mv.special } : {}), ...(mv.promotion ? { promotion: mv.promotion } : {}) });
        g = applyMove(g, mv);
      }
      const st = status(g);
      const result = st.winner === "w" ? "win" : st.winner === "b" ? "loss" : "draw";
      const sum = summarizeMatch(wArmy, m.aiArmy, seed, log, result, "w", { map, rules: m.rules });
      applyResult(profile, sum); // reward pipeline must not throw either
    } catch (e) {
      crashed.push(`${node.id} seed=${seed}: ${e.message}`);
    }
  }
}
ok(`all ${CAMPAIGN.length} campaign nodes play out over ${SEEDS.length} seeds without crashing`, crashed.length === 0);
if (crashed.length) crashed.slice(0, 8).forEach((c) => console.log("    " + c));
ok("every dragon node unfolds its 2x2 block with valid wing refs", dragonNodes > 0 && dragonOk === dragonNodes);

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
