// GRAND GAMBIT — the Hall: multiplayer protocol core.
//
// A faithful port of server/server.mjs with the runtime cut away: no sockets,
// no filesystem, no timers. Everything the protocol needs comes injected:
//
//   store  — persistence:   getPlayer/putPlayer/playerIds, kvGet/kvSet,
//                            vaultList/vaultPush/vaultGet
//   send   — delivery:      send(playerId, obj)
//   now    — the clock      (injectable for tests)
//
// The Durable Object adapter (index.mjs) backs the store with SQLite and the
// sends with hibernatable WebSockets; the test suite backs both with Maps.
// Live state (queue, matches, challenges, rematch windows) is persisted as
// small KV blobs on every change, so a hibernated Hall wakes up mid-match
// without losing anything.

const BAND = (waited) => 150 + Math.floor(waited / 5000) * 60;
const REMATCH_MS = 120000;

export class HallCore {
  constructor({ store, send, now = () => Date.now(), adminToken = "" }) {
    this.store = store; this.send = send; this.now = now;
    this.adminToken = String(adminToken || "");
    this.adminOn = this.adminToken.length >= 24;
    this.online = new Map();          // playerId → true (presence; sockets live in the adapter)
    this.adminFails = new Map();      // ip → { n, until } (best effort; resets on hibernation)
  }

  // ── live blobs (survive hibernation via KV) ────────────────────────────────
  _blob(key, fallback) { const v = this.store.kvGet(key); return v ? JSON.parse(v) : fallback; }
  _put(key, val) { this.store.kvSet(key, JSON.stringify(val)); }
  get queue() { return this._blob("queue", []); }
  set queue(v) { this._put("queue", v); }
  get matches() { return this._blob("matches", {}); }
  set matches(v) { this._put("matches", v); }
  get challenges() { return this._blob("challenges", {}); }
  set challenges(v) { this._put("challenges", v); }
  get finished() { return this._blob("finished", {}); }   // matchId → {…, want:[], until}
  set finished(v) { this._put("finished", v); }
  nextId(prefix) { const n = (Number(this.store.kvGet("seq")) || 0) + 1; this.store.kvSet("seq", String(n)); return prefix + n; }

  player(id) { return this.store.getPlayer(id); }
  savePlayer(p) { this.store.putPlayer(p); }
  isOnline(id) { return this.online.has(id); }

  // ── presence ───────────────────────────────────────────────────────────────
  connect(id) { this.online.set(id, true); }
  close(id) {
    if (!id) return;
    this.online.delete(id);
    this.dropFromQueue(id);
    this.endMatchFor(id, "oppLeft");
    this.notifyFriends(id);
  }

  // ── friends ────────────────────────────────────────────────────────────────
  friendView(id) {
    const p = this.player(id);
    return (p?.friends || []).map((fid) => {
      const f = this.player(fid);
      return { id: fid, name: f?.name || "?", online: this.isOnline(fid), score: f?.score || 0 };
    });
  }
  pushFriends(id) {
    const p = this.player(id); if (!p) return;
    this.send(id, { t: "friends", friends: this.friendView(id),
      requests: (p.pending || []).map((fid) => ({ id: fid, name: this.player(fid)?.name || "?" })) });
  }
  notifyFriends(id) { for (const fid of this.player(id)?.friends || []) if (this.isOnline(fid)) this.pushFriends(fid); }

  // ── rating (Elo, K=32, start 1000) ─────────────────────────────────────────
  rate(aId, bId, scoreA) {
    const A = this.player(aId), B = this.player(bId);
    const ra = A.rating ?? 1000, rb = B.rating ?? 1000;
    const ea = 1 / (1 + 10 ** ((rb - ra) / 400));
    const dA = Math.round(32 * (scoreA - ea)), dB = -dA;
    A.rating = ra + dA; B.rating = rb + dB;
    A.wins = (A.wins || 0) + (scoreA === 1 ? 1 : 0); A.losses = (A.losses || 0) + (scoreA === 0 ? 1 : 0); A.draws = (A.draws || 0) + (scoreA === 0.5 ? 1 : 0);
    B.wins = (B.wins || 0) + (scoreA === 0 ? 1 : 0); B.losses = (B.losses || 0) + (scoreA === 1 ? 1 : 0); B.draws = (B.draws || 0) + (scoreA === 0.5 ? 1 : 0);
    this.savePlayer(A); this.savePlayer(B);
    this.send(aId, { t: "rated", rating: A.rating, delta: dA });
    this.send(bId, { t: "rated", rating: B.rating, delta: dB });
  }
  settle(matchId, m, scoreW) {
    this.rate(m.w, m.b, scoreW);
    const ms = this.matches; delete ms[matchId]; this.matches = ms;
    const fin = this.finished;
    fin[matchId] = { ...m, want: [], until: this.now() + REMATCH_MS };
    this.finished = fin;
  }
  sweepFinished() {   // lazy expiry replaces the Node timers
    const fin = this.finished; let dirty = false;
    for (const [mid, f] of Object.entries(fin)) if (f.until <= this.now()) { delete fin[mid]; dirty = true; }
    if (dirty) this.finished = fin;
  }

  // ── matchmaking ────────────────────────────────────────────────────────────
  dropFromQueue(id) { const q = this.queue; const i = q.findIndex((x) => x.id === id); if (i >= 0) { q.splice(i, 1); this.queue = q; } }
  tryMatch() {
    const q = this.queue;
    for (let i = 0; i < q.length; i++) for (let j = i + 1; j < q.length; j++) {
      const a = q[i], b = q[j];
      const waited = this.now() - Math.min(a.since, b.since);
      if (Math.abs(a.score - b.score) > BAND(waited)) continue;
      const maps = a.maps.filter((m) => b.maps.includes(m));
      if (!maps.length) continue;
      q.splice(j, 1); q.splice(i, 1); this.queue = q;
      this.startMatch(a, b, maps[Math.floor(Math.random() * maps.length)]);
      return this.tryMatch();
    }
  }
  startMatch(a, b, map, forceSeats = false) {
    const matchId = this.nextId("m");
    const seed = (Math.random() * 2 ** 31) | 0;
    const flip = forceSeats ? false : Math.random() < 0.5;
    const [w, bl] = flip ? [b, a] : [a, b];
    const ms = this.matches;
    ms[matchId] = { w: w.id, b: bl.id, armyW: w.army, armyB: bl.army, map, n: 0 };
    this.matches = ms;
    const base = { t: "match", matchId, seed, map, rules: "hp" };
    this.send(w.id, { ...base, youAre: "w", opp: { name: this.player(bl.id).name, score: bl.score }, oppArmy: bl.army });
    this.send(bl.id, { ...base, youAre: "b", opp: { name: this.player(w.id).name, score: w.score }, oppArmy: w.army });
    return matchId;
  }
  endMatchFor(id, reason) {
    const ms = this.matches;
    for (const [mid, m] of Object.entries(ms)) if (m.w === id || m.b === id) {
      const opp = m.w === id ? m.b : m.w;
      this.send(opp, { t: reason, matchId: mid });
      this.settle(mid, m, m.w === id ? 0 : 1);
    }
  }

  // ── admin ──────────────────────────────────────────────────────────────────
  adminCheck(ip, token) {
    const rec = this.adminFails.get(ip);
    if (rec && rec.until > this.now()) throw new Error("locked");
    // constant-time compare (no Node crypto in Workers)
    const A = String(token || ""), B = this.adminToken;
    let diff = A.length ^ B.length;
    const L = Math.max(A.length, B.length, 1);
    for (let i = 0; i < L; i++) diff |= (A.charCodeAt(i) || 0) ^ (B.charCodeAt(i) || 0);
    const ok = this.adminOn && diff === 0;
    if (!ok) {
      const n = (rec?.n || 0) + 1;
      this.adminFails.set(ip, { n, until: n >= 5 ? this.now() + 15 * 60 * 1000 : 0 });
      throw new Error("denied");
    }
    this.adminFails.delete(ip);
  }

  // ── the protocol ───────────────────────────────────────────────────────────
  /** Handle one message from `me` (playerId or null before hello).
   *  Returns the (possibly newly assigned) playerId. Throws protocol errors. */
  handle(me, msg, ip = "?") {
    this.sweepFinished();
    if (msg.t === "admin") {
      if (!this.adminOn) throw new Error("admin disabled");
      this.adminCheck(ip, msg.token);
      const reply = (payload) => this.send(me, { t: "admin", cmd: msg.cmd, ...payload });
      if (msg.cmd === "stats") {
        const ids = this.store.playerIds();
        return reply({ players: ids.length, online: this.online.size,
          matches: Object.keys(this.matches).length, vaultSnapshots: this.store.vaultCount() }), me;
      }
      if (msg.cmd === "dump") return reply({ players: this.store.dumpPlayers() }), me;
      throw new Error("unknown admin cmd");
    }
    if (msg.t === "hello") {
      const { id, secret, name, score, privacy } = msg;
      if (!id || !secret || !name) throw new Error("bad hello");
      const ex = this.player(id);
      if (ex && ex.secret !== secret) throw new Error("identity taken");
      this.savePlayer({ ...(ex || { friends: [], pending: [] }), id, secret,
        name: String(name).slice(0, 20), score: score | 0,
        privacy: privacy === "friends" ? "friends" : "public" });
      me = id;
      this.connect(me);
      const p = this.player(me);
      this.send(me, { t: "welcome", you: { id, name: p.name, score: p.score, privacy: p.privacy }, online: this.online.size });
      this.pushFriends(me); this.notifyFriends(me);
      return me;
    }
    if (!me) throw new Error("hello first");
    const p = this.player(me);

    if (msg.t === "set") {
      if (msg.privacy) p.privacy = msg.privacy === "friends" ? "friends" : "public";
      if (msg.score != null) p.score = msg.score | 0;
      if (msg.name) p.name = String(msg.name).slice(0, 20);
      this.savePlayer(p); return me;
    }
    if (msg.t === "friendRequest") {
      const target = this.player(msg.code);
      if (!target) throw new Error("code not found");
      if (msg.code === me) throw new Error("that is you");
      if ((p.friends || []).includes(msg.code)) throw new Error("already friends");
      target.pending = [...new Set([...(target.pending || []), me])];
      this.savePlayer(target);
      if (this.isOnline(msg.code)) this.pushFriends(msg.code);
      this.send(me, { t: "info", info: "requestSent" });
      return me;
    }
    if (msg.t === "friendRespond") {
      const from = msg.id;
      p.pending = (p.pending || []).filter((x) => x !== from);
      const other = this.player(from);
      if (msg.accept && other) {
        p.friends = [...new Set([...(p.friends || []), from])];
        other.friends = [...new Set([...(other.friends || []), me])];
        this.savePlayer(other);
      }
      this.savePlayer(p);
      this.pushFriends(me); if (this.isOnline(from)) this.pushFriends(from);
      return me;
    }
    if (msg.t === "unfriend") {
      p.friends = (p.friends || []).filter((x) => x !== msg.id);
      this.savePlayer(p);
      const other = this.player(msg.id);
      if (other) { other.friends = (other.friends || []).filter((x) => x !== me); this.savePlayer(other); }
      this.pushFriends(me); if (this.isOnline(msg.id)) this.pushFriends(msg.id);
      return me;
    }
    if (msg.t === "queue") {
      this.dropFromQueue(me);
      const q = this.queue;
      q.push({ id: me, since: this.now(), maps: msg.maps || ["classic"], army: msg.army, score: p.score });
      this.queue = q;
      this.tryMatch(); return me;
    }
    if (msg.t === "dequeue") { this.dropFromQueue(me); return me; }
    if (msg.t === "vaultPush") {
      const data = String(msg.save || "");
      if (data.length < 20 || data.length > 250_000) throw new Error("bad size");
      const meta = msg.meta && typeof msg.meta === "object"
        ? { league: msg.meta.league | 0, gold: msg.meta.gold | 0 } : {};
      this.store.vaultPush(me, { ts: this.now(), ...meta, data }, 5);
      this.send(me, { t: "vault", list: this.store.vaultList(me) });
      return me;
    }
    if (msg.t === "vaultList") { this.send(me, { t: "vault", list: this.store.vaultList(me) }); return me; }
    if (msg.t === "vaultPull") {
      const e = this.store.vaultGet(me, msg.ts);
      if (!e) throw new Error("not found");
      this.send(me, { t: "vaultSave", ts: e.ts, save: e.data });
      return me;
    }
    if (msg.t === "gift") {
      if (!(p.friends || []).includes(msg.to)) throw new Error("not friends");
      if (!this.isOnline(msg.to)) throw new Error("offline");
      this.send(msg.to, { t: "gift", from: p.name, gold: 10 });
      this.send(me, { t: "giftSent", to: msg.to });
      return me;
    }
    if (msg.t === "challenge") {
      const target = this.player(msg.targetId);
      if (!target || !this.isOnline(msg.targetId)) throw new Error("not online");
      const isFriend = (target.friends || []).includes(me);
      if (target.privacy === "friends" && !isFriend) throw new Error("friends only");
      const challengeId = this.nextId("c");
      const cs = this.challenges;
      cs[challengeId] = { from: me, to: msg.targetId, maps: msg.maps || ["classic"], army: msg.army };
      this.challenges = cs;
      this.send(msg.targetId, { t: "challenge", challengeId, from: { id: me, name: p.name, score: p.score } });
      this.send(me, { t: "info", info: "challengeSent" });
      return me;
    }
    if (msg.t === "challengeRespond") {
      const cs = this.challenges;
      const c = cs[msg.challengeId];
      delete cs[msg.challengeId]; this.challenges = cs;
      if (!c || c.to !== me) return me;
      if (!msg.accept) { this.send(c.from, { t: "challengeDeclined" }); return me; }
      const maps = c.maps.filter((m) => (msg.maps || ["classic"]).includes(m));
      this.startMatch({ id: c.from, army: c.army, score: this.player(c.from).score },
                      { id: me, army: msg.army, score: p.score },
                      maps[0] || "classic");
      return me;
    }
    if (msg.t === "cmd") {
      const ms = this.matches;
      const m = ms[msg.matchId]; if (!m) return me;
      const opp = m.w === me ? m.b : m.w;
      m.n++; this.matches = ms;
      this.send(opp, { t: "cmd", matchId: msg.matchId, cmd: msg.cmd, n: msg.n, hash: msg.hash });
      return me;
    }
    if (msg.t === "resign") { this.endMatchFor(me, "oppResign"); return me; }
    if (msg.t === "result") {
      const m = this.matches[msg.matchId];
      if (!m || (m.w !== me && m.b !== me)) return me;
      this.settle(msg.matchId, m, msg.winner === "w" ? 1 : msg.winner === "b" ? 0 : 0.5);
      return me;
    }
    if (msg.t === "rematch") {
      const fin = this.finished;
      const f = fin[msg.matchId];
      if (!f || (f.w !== me && f.b !== me)) return me;
      if (!f.want.includes(me)) f.want.push(me);
      const other = f.w === me ? f.b : f.w;
      if (f.want.includes(other)) {
        delete fin[msg.matchId]; this.finished = fin;
        this.startMatch({ id: f.b, army: f.armyB, score: this.player(f.b).score },
                        { id: f.w, army: f.armyW, score: this.player(f.w).score }, f.map, true);
      } else {
        this.finished = fin;
        if (this.isOnline(other)) this.send(other, { t: "rematchOffer", matchId: msg.matchId });
      }
      return me;
    }
    if (msg.t === "leaderboard") {
      const rows = this.store.playerIds()
        .map((id) => { const pl = this.player(id); return { id, name: pl.name, rating: pl.rating ?? 1000, wins: pl.wins || 0, losses: pl.losses || 0, online: this.isOnline(id) }; })
        .sort((a, b) => b.rating - a.rating);
      const rank = rows.findIndex((r) => r.id === me) + 1;
      this.send(me, { t: "leaderboard", top: rows.slice(0, 20), me: { rank, ...rows[rank - 1] } });
      return me;
    }
    if (msg.t === "matchOver") return me; // legacy no-op
    return me;
  }
}

/** In-memory store — used by the test suite and handy for local runs. */
export function memoryStore() {
  const players = new Map(), kv = new Map(), vault = new Map();
  return {
    getPlayer: (id) => players.get(id) ? JSON.parse(JSON.stringify(players.get(id))) : undefined,
    putPlayer: (p) => players.set(p.id, JSON.parse(JSON.stringify(p))),
    playerIds: () => [...players.keys()],
    dumpPlayers: () => Object.fromEntries(players),
    kvGet: (k) => kv.get(k) ?? null,
    kvSet: (k, v) => kv.set(k, v),
    vaultPush: (owner, entry, keep) => {
      const list = [entry, ...(vault.get(owner) || [])].slice(0, keep);
      vault.set(owner, list);
    },
    vaultList: (owner) => (vault.get(owner) || []).map(({ data: _d, ...m }) => m),
    vaultGet: (owner, ts) => (vault.get(owner) || []).find((x) => x.ts === ts) || null,
    vaultCount: () => [...vault.values()].reduce((a, v) => a + v.length, 0),
  };
}
