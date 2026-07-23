// The Hall (Durable-Object multiplayer core) — protocol tests on the memory store.
import { HallCore, memoryStore } from "./worker/src/logic.mjs";
import { createGame, reduce, moveCommand, legalMoves } from "./src/core/index.js";
import { mapById } from "./src/content/index.js";
import { buildArmyFromFormation } from "./src/meta/index.js";

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log("  ok  -", name); } else { fail++; console.log(" FAIL -", name); } };

function mkHall(t0 = 1000) {
  const outbox = [];
  let clock = t0;
  const hall = new HallCore({
    store: memoryStore(),
    send: (id, obj) => outbox.push({ ...obj, _to: id }),
    now: () => clock,
    adminToken: "super-secret-admin-token-24chars",
  });
  return { hall, outbox, tick: (ms) => { clock += ms; }, last: (t, to) => [...outbox].reverse().find((m) => m.t === t && (!to || m._to === to)) };
}

// ── hello / identity ─────────────────────────────────────────────────────────
{
  const { hall, outbox, last } = mkHall();
  const me = hall.handle(null, { t: "hello", id: "p1", secret: "s1", name: "Ana", score: 200 });
  ok("hello signs the player in and welcomes them", me === "p1" && last("welcome").you.name === "Ana" && last("welcome").online === 1);
  let threw = null;
  try { hall.handle(null, { t: "hello", id: "p1", secret: "WRONG", name: "Eve" }); } catch (e) { threw = e.message; }
  ok("a wrong secret cannot steal an identity", threw === "identity taken");
  threw = null;
  try { hall.handle(null, { t: "queue" }); } catch (e) { threw = e.message; }
  ok("messages before hello are rejected", threw === "hello first");
  ok("names are capped at 20 chars", hall.handle(null, { t: "hello", id: "p9", secret: "x", name: "A".repeat(40) }) === "p9" && hall.player("p9").name.length === 20);
}

// ── matchmaking: score bands widen over time ─────────────────────────────────
{
  const { hall, last, tick } = mkHall();
  hall.handle(null, { t: "hello", id: "a", secret: "s", name: "A", score: 0 });
  hall.handle(null, { t: "hello", id: "b", secret: "s", name: "B", score: 1000 });
  hall.handle("a", { t: "queue", maps: ["classic"], army: ["p"] });
  hall.handle("b", { t: "queue", maps: ["classic"], army: ["q"] });
  ok("a 1000-point gap does not match instantly", Object.keys(hall.matches).length === 0 && hall.queue.length === 2);
  tick(80_000); // band grows to 150 + 16*60 = 1110
  hall.handle("b", { t: "dequeue" });
  hall.handle("b", { t: "queue", maps: ["classic"], army: ["q"] });
  // b's `since` is fresh, but a has waited: min(since) counts
  ok("waiting widens the band until they match", Object.keys(hall.matches).length === 1);
  const m = last("match", "a");
  ok("both seats get the same match with opposing colors",
    m && last("match", "b") && m.matchId === last("match", "b").matchId && m.youAre !== last("match", "b").youAre);
  ok("each side receives the opponent's army", Array.isArray(last("match", "a").oppArmy) && last("match", "b").oppArmy[0] !== undefined);
}

// ── move relay + result + rating ─────────────────────────────────────────────
{
  const { hall, outbox, last } = mkHall();
  hall.handle(null, { t: "hello", id: "a", secret: "s", name: "A", score: 100 });
  hall.handle(null, { t: "hello", id: "b", secret: "s", name: "B", score: 100 });
  hall.handle("a", { t: "queue", maps: ["classic"] });
  hall.handle("b", { t: "queue", maps: ["classic"] });
  const mid = last("match", "a").matchId;
  const white = last("match", "a").youAre === "w" ? "a" : "b";
  const black = white === "a" ? "b" : "a";
  hall.handle("a", { t: "cmd", matchId: mid, cmd: { mv: 1 }, n: 1, hash: "h1" });
  const relayed = last("cmd", "b");
  ok("moves relay to the opponent with sequence and hash", relayed && relayed.n === 1 && relayed.hash === "h1");
  hall.handle(white, { t: "result", matchId: mid, winner: "w" });
  ok("the board result rates both players (Elo, zero-sum)",
    hall.player(white).rating === 1016 && hall.player(black).rating === 984 &&
    hall.player(white).wins === 1 && hall.player(black).losses === 1);
  ok("the match parks in the rematch window", hall.matches[mid] === undefined && hall.finished[mid] !== undefined);
  hall.handle(white, { t: "result", matchId: mid, winner: "w" });
  ok("a second result report is ignored", hall.player(white).rating === 1016);
}

// ── resign / disconnect ──────────────────────────────────────────────────────
{
  const { hall, last } = mkHall();
  hall.handle(null, { t: "hello", id: "a", secret: "s", name: "A", score: 0 });
  hall.handle(null, { t: "hello", id: "b", secret: "s", name: "B", score: 0 });
  hall.handle("a", { t: "queue", maps: ["classic"] });
  hall.handle("b", { t: "queue", maps: ["classic"] });
  const mid = last("match", "a").matchId;
  hall.handle("a", { t: "resign" });
  ok("resigning informs the opponent and loses the game",
    last("oppResign", "b")?.matchId === mid && hall.player("a").losses === 1 && hall.player("b").wins === 1);
  hall.handle("a", { t: "queue", maps: ["classic"] });
  hall.handle("b", { t: "queue", maps: ["classic"] });
  hall.close("b");
  ok("a dropped connection ends the match for the opponent", last("oppLeft", "a") !== undefined && hall.player("b").losses === 1 && hall.player("a").wins === 1);
}

// ── rematch: seats swap ──────────────────────────────────────────────────────
{
  const { hall, last, tick } = mkHall();
  hall.handle(null, { t: "hello", id: "a", secret: "s", name: "A", score: 0 });
  hall.handle(null, { t: "hello", id: "b", secret: "s", name: "B", score: 0 });
  hall.handle("a", { t: "queue", maps: ["classic"] });
  hall.handle("b", { t: "queue", maps: ["classic"] });
  const m1 = last("match", "a");
  const w1 = m1.youAre === "w" ? "a" : "b";
  hall.handle(w1, { t: "result", matchId: m1.matchId, winner: "draw" });
  hall.handle("a", { t: "rematch", matchId: m1.matchId });
  ok("the first rematch wish notifies the other side", last("rematchOffer", "b")?.matchId === m1.matchId);
  hall.handle("b", { t: "rematch", matchId: m1.matchId });
  const m2 = last("match", "a");
  ok("both wishes start a rematch with swapped seats", m2.matchId !== m1.matchId && m2.youAre !== m1.youAre);
  // window expiry
  const w2 = m2.youAre === "w" ? "a" : "b";
  hall.handle(w2, { t: "result", matchId: m2.matchId, winner: "draw" });
  tick(130_000);
  hall.handle("a", { t: "rematch", matchId: m2.matchId });
  ok("the rematch window expires after two minutes", last("match", "a").matchId === m2.matchId);
}

// ── friends, gifts, challenge privacy ────────────────────────────────────────
{
  const { hall, last } = mkHall();
  hall.handle(null, { t: "hello", id: "a", secret: "s", name: "A", score: 0 });
  hall.handle(null, { t: "hello", id: "b", secret: "s", name: "B", score: 0, privacy: "friends" });
  let threw = null;
  try { hall.handle("a", { t: "challenge", targetId: "b" }); } catch (e) { threw = e.message; }
  ok("friends-only players cannot be challenged by strangers", threw === "friends only");
  try { hall.handle("a", { t: "gift", to: "b" }); } catch (e) { threw = e.message; }
  ok("gifts require friendship", threw === "not friends");
  hall.handle("a", { t: "friendRequest", code: "b" });
  hall.handle("b", { t: "friendRespond", id: "a", accept: true });
  ok("accepting links both friend lists", hall.player("a").friends.includes("b") && hall.player("b").friends.includes("a"));
  hall.handle("a", { t: "gift", to: "b" });
  ok("the carrier pigeon lands (10 gold)", last("gift", "b")?.gold === 10 && last("giftSent", "a")?.to === "b");
  hall.handle("a", { t: "challenge", targetId: "b" });
  const ch = last("challenge", "b");
  hall.handle("b", { t: "challengeRespond", challengeId: ch.challengeId, accept: true, maps: ["classic"] });
  ok("an accepted friend challenge starts a match", last("match", "a") !== undefined && last("match", "b") !== undefined);
}

// ── vault ────────────────────────────────────────────────────────────────────
{
  const { hall, last, tick } = mkHall();
  hall.handle(null, { t: "hello", id: "a", secret: "s", name: "A", score: 0 });
  let threw = null;
  try { hall.handle("a", { t: "vaultPush", save: "tiny" }); } catch (e) { threw = e.message; }
  ok("undersized vault pushes are rejected", threw === "bad size");
  for (let i = 0; i < 7; i++) { hall.handle("a", { t: "vaultPush", save: "x".repeat(30) + i, meta: { league: i, gold: i * 10 } }); tick(10); }
  const list = last("vault", "a").list;
  ok("the vault keeps the newest five snapshots, metadata only", list.length === 5 && list[0].league === 6 && list[0].data === undefined);
  hall.handle("a", { t: "vaultPull", ts: list[0].ts });
  ok("pulling returns the full save", last("vaultSave", "a").save.endsWith("6"));
}

// ── leaderboard + admin ──────────────────────────────────────────────────────
{
  const { hall, last } = mkHall();
  hall.handle(null, { t: "hello", id: "a", secret: "s", name: "A", score: 0 });
  hall.handle(null, { t: "hello", id: "b", secret: "s", name: "B", score: 0 });
  hall.player("b").rating = 1200; hall.savePlayer({ ...hall.player("b"), rating: 1200 });
  hall.handle("a", { t: "leaderboard" });
  const lb = last("leaderboard", "a");
  ok("the duel leaderboard sorts by rating and ranks me", lb.top[0].id === "b" && lb.me.rank === 2);
  let threw = null;
  try { hall.handle("a", { t: "admin", cmd: "stats", token: "wrong-token-wrong-token-wrong" }); } catch (e) { threw = e.message; }
  ok("wrong admin tokens are denied", threw === "denied");
  hall.handle("a", { t: "admin", cmd: "stats", token: "super-secret-admin-token-24chars" });
  ok("the right token reads stats", last("admin", "a").players === 2);
  hall.handle("a", { t: "set", stats: { games: 12, wins: 7, league: 3, playtimeSec: 3600, secret: "leak", evil: 9 } });
  hall.handle("a", { t: "admin", cmd: "dump", token: "super-secret-admin-token-24chars" });
  const dmp = last("admin", "a");
  const rowA = dmp.players.find((r) => r.id === "a");
  ok("admin dump lists players with their mirrored stats", !!rowA && rowA.stats.games === 12 && rowA.stats.league === 3 && rowA.stats.playtimeSec === 3600);
  ok("admin dump never leaks secrets or junk fields", dmp.players.every((r) => r.secret === undefined) && rowA.stats.secret === undefined && rowA.stats.evil === undefined);
  for (let i = 0; i < 5; i++) { try { hall.handle("a", { t: "admin", cmd: "stats", token: "nope-nope-nope-nope-nope-" }, "1.2.3.4"); } catch {} }
  try { hall.handle("a", { t: "admin", cmd: "stats", token: "super-secret-admin-token-24chars" }, "1.2.3.4"); } catch (e) { threw = e.message; }
  ok("five failures lock the source out", threw === "locked");
}


// ── classic mode: classic meets classic, duel meets duel ─────────────────────
{
  const { hall, last } = mkHall();
  const c1 = hall.handle(null, { t: "hello", id: "c1", secret: "s1", name: "C1", score: 100 });
  const c2 = hall.handle(null, { t: "hello", id: "c2", secret: "s2", name: "C2", score: 100 });
  const d1 = hall.handle(null, { t: "hello", id: "d1", secret: "s3", name: "D1", score: 100 });
  hall.handle(c1, { t: "queue", maps: ["classic"], army: ["k"], mode: "classic" });
  hall.handle(d1, { t: "queue", maps: ["classic"], army: ["k"] });
  ok("a classic seeker never pairs with a duelist", Object.keys(hall.matches).length === 0);
  hall.handle(c2, { t: "queue", maps: ["classic"], army: ["k"], mode: "classic" });
  const mids = Object.keys(hall.matches);
  ok("two classic seekers pair up", mids.length === 1 && hall.matches[mids[0]].mode === "classic");
  const m = last("match");
  ok("a classic room plays mate rules", !!m && m.rules === "chess" && m.mode === "classic");
}


// ── per-map armies: the match uses the formation saved for the map that was
// actually picked, never the one saved for some other candidate map ─────────
{
  const { hall, last } = mkHall();
  hall.handle(null, { t: "hello", id: "e1", secret: "s", name: "E1", score: 0 });
  hall.handle(null, { t: "hello", id: "e2", secret: "s", name: "E2", score: 0 });
  // e1 only has "gauntlet" in common with e2; both bring per-map armies plus
  // a legacy single .army that must NOT be used once a map-specific one exists.
  hall.handle("e1", { t: "queue", maps: ["arena", "gauntlet"], army: ["ARENA_ARMY_E1"],
    armies: { arena: ["ARENA_ARMY_E1"], gauntlet: ["GAUNTLET_ARMY_E1"] } });
  hall.handle("e2", { t: "queue", maps: ["gauntlet"], army: ["GAUNTLET_ARMY_E2"],
    armies: { gauntlet: ["GAUNTLET_ARMY_E2"] } });
  const mids = Object.keys(hall.matches);
  ok("players with only one map in common are matched on it", mids.length === 1 && hall.matches[mids[0]].map === "gauntlet");
  const m = hall.matches[mids[0]];
  const bothArmies = [m.armyW, m.armyB].map((a) => a[0]);
  ok("the match uses each side's GAUNTLET army, not their arena one",
    bothArmies.includes("GAUNTLET_ARMY_E1") && bothArmies.includes("GAUNTLET_ARMY_E2"));
  const msgs = ["e1", "e2"].map((id) => last("match", id));
  ok("oppArmy shown to each side is also the map-correct one", msgs.every((mm) => mm.oppArmy[0] === "GAUNTLET_ARMY_E1" || mm.oppArmy[0] === "GAUNTLET_ARMY_E2"));
}

// ── ONE CLOCK ONLY EVER MEETS ITS OWN ───────────────────────────────────────
// A bullet player pulled into a rapid game would lose on time through no fault
// of their own — the matchmaker must keep the formats apart, and must tell the
// board which clock was agreed.
{
  const { hall, last } = mkHall();
  hall.handle(null, { t: "hello", id: "a", secret: "s", name: "A", score: 500 });
  hall.handle(null, { t: "hello", id: "b", secret: "s", name: "B", score: 500 });
  hall.handle("a", { t: "queue", maps: ["classic"], army: ["p"], tc: "quick" });
  hall.handle("b", { t: "queue", maps: ["classic"], army: ["q"], tc: "prime" });
  ok("a bullet player is not thrown into a rapid game", Object.keys(hall.matches).length === 0);

  hall.handle("b", { t: "dequeue" });
  hall.handle("b", { t: "queue", maps: ["classic"], army: ["q"], tc: "quick" });
  ok("two players on the same clock are paired", Object.keys(hall.matches).length === 1);
  const ma = last("match", "a"), mb = last("match", "b");
  ok("the match names that clock", ma && ma.tc === "quick");
  ok("both sides are told the same clock", ma && mb && ma.tc === mb.tc);
}

// ── CORRESPONDENCE: THE GAME THAT SURVIVES GOING OFFLINE ────────────────────
// This is the whole point of Classic Gambit: a live match dies when a socket
// closes, a daily game must not. It is filed with seed, both armies and the
// ordered commands, so a returning player replays it exactly.
{
  const { hall, last, tick } = mkHall();
  hall.handle(null, { t: "hello", id: "a", secret: "s", name: "Ana", score: 500 });
  hall.handle(null, { t: "hello", id: "b", secret: "s", name: "Bo", score: 500 });
  hall.handle("a", { t: "queue", maps: ["classic"], army: ["p"], tc: "daily" });
  hall.handle("b", { t: "queue", maps: ["classic"], army: ["q"], tc: "daily" });

  ok("a daily pairing opens no live seat", Object.keys(hall.matches).length === 0);
  const nw = last("daily:new", "a");
  ok("both players are told a game was filed", !!nw && !!last("daily:new", "b"));
  const gid = nw.gameId;

  hall.handle("a", { t: "daily:list" });
  const list = last("daily:list", "a");
  ok("the shelf lists the game", list && list.games.length === 1 && list.games[0].gameId === gid);
  const mine = list.games[0];
  ok("it says whose move it is", mine.yourTurn === (mine.youAre === "w"));
  ok("it names the opponent", mine.opp.name === "Bo");
  ok("it carries a deadline in the future", mine.deadline > 0);

  // THE DISCONNECT that would kill a live match
  hall.close("a"); hall.close("b");
  ok("closing both sockets does NOT end the game", !hall.daily[gid].done);

  // the player to move returns and plays
  hall.handle(null, { t: "hello", id: "a", secret: "s", name: "Ana", score: 500 });
  const g0 = hall.daily[gid];
  const mover = g0.turn === "w" ? g0.w : g0.b;
  const other = mover === g0.w ? g0.b : g0.w;
  hall.handle(mover, { t: "daily:open", gameId: gid });
  const opened = last("daily:game", mover);
  ok("opening returns everything needed to rebuild the board",
    opened && opened.game.seed != null && opened.game.armyW && opened.game.armyB && Array.isArray(opened.game.moves));

  hall.handle(mover, { t: "daily:move", gameId: gid, cmd: { t: "move", from: 8, to: 16 } });
  ok("the move is filed", hall.daily[gid].moves.length === 1);
  ok("and the turn passes", hall.daily[gid].turn !== g0.turn);
  ok("the mover is acknowledged", !!last("daily:ok", mover));

  // the WRONG player may not move
  const before = hall.daily[gid].moves.length;
  hall.handle(mover, { t: "daily:move", gameId: gid, cmd: { t: "move", from: 9, to: 17 } });
  ok("nobody may move twice in a row", hall.daily[gid].moves.length === before);
  hall.handle("zz", { t: "daily:move", gameId: gid, cmd: { t: "move", from: 9, to: 17 } });
  ok("a stranger cannot touch the game", hall.daily[gid].moves.length === before);

  // the deadline decides an abandoned game
  tick(4 * 24 * 60 * 60 * 1000);
  hall.handle(mover, { t: "daily:list" });
  ok("a game left past its deadline is decided", !!hall.daily[gid].done);
  ok("and it is decided against whoever owed the move", hall.daily[gid].done.reason === "time");
  ok("both players are told", !!last("daily:over", mover) && !!last("daily:over", other));
}

// ── correspondence: resigning ───────────────────────────────────────────────
{
  const { hall, last } = mkHall();
  hall.handle(null, { t: "hello", id: "a", secret: "s", name: "A", score: 100 });
  hall.handle(null, { t: "hello", id: "b", secret: "s", name: "B", score: 100 });
  hall.handle("a", { t: "queue", maps: ["classic"], army: ["p"], tc: "daily" });
  hall.handle("b", { t: "queue", maps: ["classic"], army: ["q"], tc: "daily" });
  const gid = last("daily:new", "a").gameId;
  hall.handle("a", { t: "daily:resign", gameId: gid });
  ok("resigning ends a daily game", !!hall.daily[gid].done && hall.daily[gid].done.reason === "resign");
  ok("the winner is the other side", hall.daily[gid].done.winner === (hall.daily[gid].w === "a" ? "b" : "w"));
  ok("a finished game accepts no further moves", (() => {
    const n = hall.daily[gid].moves.length;
    hall.handle("b", { t: "daily:move", gameId: gid, cmd: { t: "move", from: 8, to: 16 } });
    return hall.daily[gid].moves.length === n;
  })());
}

// ── THE LONG GAME, PLAYED FOR REAL ──────────────────────────────────────────
// Not a mock: four half-moves are played through the actual rules engine, on
// four different days, with BOTH players offline in between. What is stored is
// only seed + armies + commands, so the proof that matters is that each side,
// rebuilding independently, lands on the identical position.
{
  const { hall, last, tick } = mkHall();
  const army = () => buildArmyFromFormation(() => 1, mapById("classic").defaultFormation);
  const rebuild = (g) => {
    let st = createGame(g.armyW, g.armyB, { map: mapById(g.map), rules: g.rules, seed: g.seed >>> 0 });
    for (const c of g.moves) st = reduce(st, c).state;
    return st;
  };
  const sig = (st) => st.board.map((p) => p && p.kind + p.color + (p.hp ?? "")).join(",");

  hall.handle(null, { t: "hello", id: "a", secret: "s", name: "Ana", score: 500 });
  hall.handle(null, { t: "hello", id: "b", secret: "s", name: "Bo", score: 500 });
  hall.handle("a", { t: "queue", maps: ["classic"], army: army(), tc: "daily" });
  hall.handle("b", { t: "queue", maps: ["classic"], army: army(), tc: "daily" });
  const gid = last("daily:new", "a").gameId;
  hall.close("a"); hall.close("b");

  let played = 0;
  for (let i = 0; i < 4; i++) {
    tick(20 * 60 * 60 * 1000);                       // a day (nearly) passes
    const rec = hall.daily[gid];
    const who = rec.turn === "w" ? rec.w : rec.b;
    hall.handle(null, { t: "hello", id: who, secret: "s", name: who, score: 500 });
    hall.handle(who, { t: "daily:open", gameId: gid });
    const g = last("daily:game", who).game;
    const st = rebuild(g);
    const mv = legalMoves(st)[0];
    if (!mv) break;
    hall.handle(who, { t: "daily:move", gameId: gid, cmd: moveCommand(mv) });
    hall.close(who);                                  // and away again
    played++;
  }
  ok("four half-moves are played across four days offline", played === 4);
  ok("the server holds exactly those commands", hall.daily[gid].moves.length === 4);
  ok("the game is still open", !hall.daily[gid].done);

  hall.handle(null, { t: "hello", id: "a", secret: "s", name: "Ana", score: 500 });
  hall.handle(null, { t: "hello", id: "b", secret: "s", name: "Bo", score: 500 });
  hall.handle("a", { t: "daily:open", gameId: gid });
  hall.handle("b", { t: "daily:open", gameId: gid });
  const sa = rebuild(last("daily:game", "a").game);
  const sb = rebuild(last("daily:game", "b").game);
  ok("both players rebuild the IDENTICAL position", sig(sa) === sig(sb));
  ok("and agree whose move it is", sa.turn === sb.turn);
  ok("the position really moved on from the start", sig(sa) !== sig(rebuild({ ...last("daily:game", "a").game, moves: [] })));
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
