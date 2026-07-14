// ── Boss system: data-driven movement, spawning, stats, campaign wiring ──────
import { createGame, legalMovesFrom, reduce, moveCommand, idx, encodeState, decodeState } from "./src/core/index.js";
import { mapById, BOSSES, bossById, bossSpec, CAMPAIGN } from "./src/content/index.js";
import { buildStageMatch } from "./src/meta/index.js";
import { chooseMove } from "./src/ai/index.js";

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log("  ok  -", name); } else { fail++; console.log("  FAIL-", name); } };

const ch = (k) => ({ kind: k, level: 1, abilities: [], shield: 0 });
const classicBack = ["R", "N", "B", "Q", "K", "B", "N", "R"].map(ch);
function bossGame(boss, opts = {}) {
  const bBack = [...classicBack]; bBack[3] = bossSpec(boss);
  return createGame({ back: classicBack, pawn: ch("P") }, { back: bBack, pawn: ch("P") },
    { map: mapById("classic"), rules: "hp", seed: opts.seed ?? 3 });
}
// place a lone boss mid-board for clean movement checks
function loneBoss(boss) {
  const s = bossGame(boss);
  const b = s.board;
  for (let i = 0; i < b.length; i++) b[i] = null;
  b[idx(4, 4, 8)] = null;
  const tmp = bossGame(boss); // fresh piece instance
  const piece = tmp.board[idx(3, 7, 8)];
  b[idx(4, 4, 8)] = piece;
  b[idx(0, 0, 8)] = { ...tmp.board[idx(4, 0, 8)] }; // white king
  b[idx(7, 7, 8)] = { ...tmp.board[idx(4, 7, 8)] }; // black king
  s.turn = "b";
  return { s, from: idx(4, 4, 8), piece };
}

// 1) stats override
{
  const b = bossById("b06"); // Bollwerk: hp 18 atk 2
  const s = bossGame(b);
  const p = s.board[idx(3, 7, 8)];
  ok("boss stats come from its definition", p.hp === 18 && p.maxHp === 18 && p.atk === 2);
  ok("boss carries name/art/accent", p.name.de === "Das Bollwerk" && p.art === "golem" && !!p.accent);
}

// 2) leap spec: camel moves from an open square
{
  const { s, from } = loneBoss(bossById("b02")); // camel (1,3)/(3,1)
  const mv = legalMovesFrom(s, from);
  ok("camel boss has exactly 8 leaps in the open", mv.length === 8 && mv.every((m) => m.special === "leap"));
  ok("camel leap geometry (3,1)", mv.some((m) => m.to === idx(7, 5, 8)) && mv.some((m) => m.to === idx(1, 3, 8)));
}

// 3) slide range: Kanonier ortho range 3
{
  const { s, from } = loneBoss(bossById("b08"));
  const mv = legalMovesFrom(s, from);
  ok("range-3 slider reaches 3, not 4", mv.some((m) => m.to === idx(4, 1, 8)) && !mv.some((m) => m.to === idx(4, 0, 8)));
  ok("slider stays orthogonal", !mv.some((m) => m.to === idx(5, 5, 8)));
}

// 4) spawn: Brutmutter creates a pawn, budget counts down
{
  const { s, from } = loneBoss(bossById("b03"));
  const spawns = legalMovesFrom(s, from).filter((m) => m.special === "spawn");
  ok("spawner offers spawn moves on empty neighbors", spawns.length === 8);
  const out = reduce(s, moveCommand(spawns[0]));
  const ns = out.state;
  const pawn = ns.board[spawns[0].to];
  ok("spawn creates an enemy pawn with HP stats", pawn && pawn.kind === "P" && pawn.color === "b" && pawn.hp === 2);
  ok("spawner stays put and spends a charge", ns.board[from].kind === "X" && ns.board[from].spawnLeft === 3);
  ok("spawn costs the turn", ns.turn === "w");
}

// 5) campaign wiring
{
  ok("at least 25 bosses exist", BOSSES.length >= 25);
  ok("every boss has a unique move spec", new Set(BOSSES.map((b) => JSON.stringify(b.moveSpec))).size === BOSSES.length);
  const bossStages = CAMPAIGN.filter((st) => st.boss);
  ok("campaign has 40 boss stages (tolls, gardens, league wilds)", bossStages.length === 40);
  ok("33 of them are recruitable piece bosses", bossStages.filter((st) => st.boss.piece).length === 33);
  ok("every pure boss resolves", bossStages.filter((st) => st.boss.pure).every((st) => bossById(st.boss.pure)));
  const m = buildStageMatch("n03");
  ok("boss replaces the enemy queen", m.aiArmy.back.some((sp) => sp.kind === "X") && !m.aiArmy.back.some((sp) => sp.kind === "Q"));
  ok("stage match exposes the boss for the UI", m.boss && m.boss.bossId === "b01");
  const pm = buildStageMatch("a2"); // Attentäter piece boss
  ok("piece boss fields its own kind with boosted stats", pm.aiArmy.back.some((sp) => sp.kind === "S" && sp.hp >= 8) && pm.boss.unlocks === null);
  ok("from league II the same fight also recruits", buildStageMatch("a2", { campaign: { league: 2 } }).boss.unlocks === "assassin");
}

// 6) AI plays a boss without crashing; codec roundtrips boss fields
{
  const spawnNode = { id: "spawn_test", map: "arena", rules: "hp", difficulty: "normal", bump: 0, next: [], boss: { pure: "b03" }, tier: 2, reward: { xp: 0 } };
  CAMPAIGN.push(spawnNode);
  const m = buildStageMatch("spawn_test"); // Brutmutter (spawner) via injected node
  CAMPAIGN.pop();
  let st = createGame({ back: classicBack, pawn: ch("P") }, m.aiArmy, { map: mapById(m.map), rules: "hp", seed: 11 });
  for (let i = 0; i < 10 && !st.over; i++) {
    const mv = st.turn === "w" ? legalMovesFrom(st, [...st.board.keys()].find((j) => st.board[j]?.color === "w" && legalMovesFrom(st, j).length))[0] : chooseMove(st, 2);
    if (!mv) break;
    st = reduce(st, moveCommand(mv)).state;
  }
  ok("AI survives 10 plies with a spawner boss", st.moveCount >= 8);
  const round = decodeState(encodeState(st));
  const bi = round.board.findIndex((p) => p && p.kind === "X");
  ok("codec roundtrips boss moveSpec + spawn budget", bi !== -1 && !!round.board[bi].moveSpec && typeof round.board[bi].spawnLeft === "number");
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
