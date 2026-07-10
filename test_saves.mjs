// Accounts + save slots: the front door and the career shelf.
import { ensureAccounts, register, login, loginGuest, findAccount, hashPass, normEmail, validEmail,
  changePassword, adminHasDefaultPass, ADMIN_EMAIL, ADMIN_DEFAULT_PASS, currentAccount, clearSession } from "./src/meta/accounts.js";
import { createSave, listSaves, loadSave, writeSave, deleteSave, renameSave,
  progressPct, withProgressPct, leagueOrder, migrateLegacyInto, fmtPlaytime } from "./src/meta/saves.js";
import { defaultProfile } from "./src/meta/profile.js";
import { storage } from "./src/platform/index.js";

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log("  ok  -", name); } else { fail++; console.log(" FAIL -", name); } };

// ── accounts ─────────────────────────────────────────────────────────────────
const seeded = await ensureAccounts();
ok("first boot seeds exactly the built-in admin", seeded.length === 1 && seeded[0].email === ADMIN_EMAIL && seeded[0].isAdmin);
const adm = await login(ADMIN_EMAIL, ADMIN_DEFAULT_PASS);
ok("admin signs in with the shipped default password", adm.isAdmin === true);
ok("the default-password warning fires", (await adminHasDefaultPass()) === true);
await changePassword(adm.id, ADMIN_DEFAULT_PASS, "neues-passwort");
ok("after changing it the warning stops", (await adminHasDefaultPass()) === false);
ok("and the old password no longer works", await login(ADMIN_EMAIL, ADMIN_DEFAULT_PASS).then(() => false, (e) => e.message === "wrong-pass"));

ok("emails are normalized", normEmail("  Ana@Mail.DE ") === "ana@mail.de");
ok("email validation accepts real addresses and the admin alias", validEmail("a@b.de") && validEmail(ADMIN_EMAIL) && !validEmail("nope"));
const ana = await register("ana@mail.de", "geheim99", "Ana");
ok("registration signs the player in", (await currentAccount())?.id === ana.id && !ana.isAdmin);
ok("duplicate registration is rejected", await register("ana@mail.de", "xxxxxx").then(() => false, (e) => e.message === "exists"));
ok("weak passwords are rejected", await register("b@c.de", "123").then(() => false, (e) => e.message === "weak-pass"));
ok("wrong password is rejected", await login("ana@mail.de", "falsch!").then(() => false, (e) => e.message === "wrong-pass"));
const guest = await loginGuest();
ok("guest entry needs no credentials and is reused", guest.provider === "guest" && (await loginGuest()).id === guest.id);
const h1 = await hashPass("pass", "salt"), h2 = await hashPass("pass", "other");
ok("password hashes are salted", h1 !== h2 && h1.length === 64);

// ── save slots ───────────────────────────────────────────────────────────────
const A = ana.id;
const s1 = await createSave(A, "Erste Reise");
ok("a fresh slot starts at 0% with a default profile", s1.pct === 0 && s1.playtimeSec === 0 && s1.league === 1);
const prof = await loadSave(A, s1.id);
prof.campaign.cleared = ["n01", "n02", "n03"];
const upd = await writeSave(A, s1.id, prof, 125);
ok("writes document progress and accumulate playtime", upd.clearedCount === 3 && upd.playtimeSec === 125 && upd.pct > 0);
await writeSave(A, s1.id, prof, 55);
ok("playtime keeps adding up", (await listSaves(A))[0].playtimeSec === 180);
const s2 = await createSave(A, null);
ok("slots auto-name and list newest-first", (await listSaves(A))[0].id === s2.id && /2/.test(s2.name));
await renameSave(A, s2.id, "Zweite Reise");
ok("renaming sticks", (await listSaves(A)).find((x) => x.id === s2.id).name === "Zweite Reise");
await deleteSave(A, s2.id);
ok("deleting removes slot and payload", (await listSaves(A)).length === 1 && (await loadSave(A, s2.id)) === null);
ok("playtime formats like a game", fmtPlaytime(45) === "0 min" && fmtPlaytime(3720) === "1 h 02 min");

// ── progress dial (the admin control) ────────────────────────────────────────
const order = leagueOrder(1);
ok("journey order covers the whole league once", order.length === 35 && new Set(order).size === 35 && order[0] === "n01");
const full = withProgressPct(defaultProfile(), 100);
ok("100% clears every site of the league", full.campaign.cleared.length === 35 && progressPct(full) === 100);
ok("100% unlocks the bosses along the way", full.campaign.unlocked.length >= 15 && full.gold > 2000);
const half = withProgressPct(defaultProfile(), 50);
ok("50% clears the first half in journey order", half.campaign.cleared.length === 18 && half.campaign.cleared[0] === "n01");
const zero = withProgressPct({ ...full, name: "Keep" }, 0);
ok("0% resets progress but keeps the identity", zero.campaign.cleared.length === 0 && zero.gold === 0 && zero.name === "Keep");

// ── legacy migration ─────────────────────────────────────────────────────────
await storage.set("profile", JSON.stringify({ ...defaultProfile(), gold: 777 }), false);
const mig = await migrateLegacyInto(A);
ok("the pre-account profile becomes an imported slot", mig && (await loadSave(A, mig.id)).gold === 777);
ok("migration runs only once", (await migrateLegacyInto(A)) === null);

// ── records + leaderboards (v0.17) ───────────────────────────────────────────
const { recordStage, totalBestMoves, fmtMs } = await import("./src/meta/records.js");
const { mergeBoard } = await import("./src/meta/leaderboard.js");
{
  let p = { ...defaultProfile() };
  p = recordStage(p, { id: "n01", moves: 24, now: 1000 });
  ok("first victory starts the run clock and logs the moves", p.records.runStartAt === 1000 && p.records.moves.n01 === 24 && p.records.wins === 1);
  p.campaign.cleared = ["n01"];
  p = recordStage(p, { id: "n01", moves: 30, now: 2000 });
  ok("worse move counts never overwrite the best", p.records.moves.n01 === 24 && p.records.wins === 2);
  p = recordStage(p, { id: "n01", moves: 18, now: 3000 });
  ok("better move counts do", p.records.moves.n01 === 18);
  p.campaign.cleared = leagueOrder(1).filter((id) => id !== "n22");
  p = recordStage(p, { id: "n22", moves: 40, now: 61000 });
  ok("felling the throne stops the run clock", p.records.fastestRunMs === 60000 && fmtMs(60000) === "1 min 00 s");
  const again = recordStage(p, { id: "n22", moves: 33, now: 990000 });
  ok("later throne replays keep the first run time", again.records.fastestRunMs === 60000);
  p.campaign.cleared = ["n01", "n02"];
  p.records.moves = { n01: 18, n02: 22, x99: 5 };
  const tb = totalBestMoves(p);
  ok("total best moves sums only cleared league stages", tb.sum === 40 && tb.stages === 2);
}
{
  let b = mergeBoard("progress", [], { uid: "a", name: "Ana", value: 40, at: 10 });
  b = mergeBoard("progress", b, { uid: "b", name: "Ben", value: 70, at: 20 });
  ok("progress sorts high-to-low", b[0].uid === "b" && b[1].uid === "a");
  b = mergeBoard("progress", b, { uid: "a", name: "Ana", value: 90, at: 30 });
  ok("resubmitting replaces your own entry", b.length === 2 && b[0].uid === "a" && b[0].value === 90);
  let f = mergeBoard("fastrun", [], { uid: "a", name: "Ana", value: 5000, at: 10 });
  f = mergeBoard("fastrun", f, { uid: "b", name: "Ben", value: 3000, at: 20 });
  ok("fastest run sorts low-to-high", f[0].uid === "b");
  const many = Array.from({ length: 60 }, (_, i) => ({ uid: "u" + i, name: "P" + i, value: i, at: i }));
  let m = [];
  for (const e of many) m = mergeBoard("moves", m, e);
  ok("boards cap at the top 50", m.length === 50 && m[0].value === 0);
}

await clearSession();

// ── v0.19 pause & resume: the codec round-trips a mid-fight snapshot ─────────
{
  const { createGame, reduce, moveCommand, encodeState, decodeState } = await import("./src/core/index.js");
  const { buildAiArmyForMap, buildArmyFromFormation } = await import("./src/meta/index.js");
  const { mapById } = await import("./src/content/index.js");
  const map = mapById("classic");
  const mine = buildArmyFromFormation(() => 1, map.defaultFormation);
  const foe = buildAiArmyForMap("easy", map, 7);
  let st = createGame(mine, foe, { map, rules: "hp", seed: 7, potions: { w: 2, b: 0 } });
  const mv = (await import("./src/core/index.js")).pieceMoves ? null : null;
  // play the first legal pawn-ish move via the move generator on the sim
  const { status } = await import("./src/core/index.js");
  const legal = (await import("./src/core/index.js")).legalMoves ? (await import("./src/core/index.js")).legalMoves(st) : null;
  if (legal && legal.length) st = reduce(st, moveCommand(legal[0])).state;
  const back = decodeState(encodeState(st));
  ok("pause codec keeps the turn", back.turn === st.turn);
  ok("pause codec keeps the log", (back.log || []).length === (st.log || []).length);
  ok("pause codec keeps the potions", back.potions?.w === st.potions?.w);
  ok("pause codec keeps the board", JSON.stringify(back.board) === JSON.stringify(st.board));
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

