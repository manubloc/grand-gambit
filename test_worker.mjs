// The Hall (Durable-Object multiplayer core) — protocol tests on the memory store.
import { HallCore, memoryStore } from "./worker/src/logic.mjs";

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


console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
