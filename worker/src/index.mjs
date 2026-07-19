// GRAND GAMBIT — Cloudflare Worker + Durable Object "Hall".
//
// One Hall coordinates everything: presence, friends, matchmaking, the move
// relay, ratings and the save vault. Clients connect over hibernatable
// WebSockets, so an idle Hall costs nothing; players and live state live in
// the Hall's embedded SQLite and survive both hibernation and deploys.
//
//   npx wrangler deploy          (from the worker/ directory)
//   npx wrangler secret put ADMIN_TOKEN     (optional, ≥ 24 chars)
//
// The game connects to  wss://<worker-host>/ws  — see DEPLOY-WORKER.md.
import { DurableObject } from "cloudflare:workers";
import { HallCore } from "./logic.mjs";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.headers.get("Upgrade") === "websocket") {
      const id = env.HALL.idFromName("hall");
      return env.HALL.get(id).fetch(request);
    }
    // health + the error-report endpoints all live in the one Hall
    if (url.pathname === "/health" || url.pathname === "/report" || url.pathname === "/reports") {
      const id = env.HALL.idFromName("hall");
      return env.HALL.get(id).fetch(request);
    }
    return new Response("Grand Gambit Hall — connect via WebSocket at /ws", {
      status: 200, headers: { "content-type": "text/plain; charset=utf-8" } });
  },
};

export class Hall extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx = ctx;
    this.sql = ctx.storage.sql;
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS players (id TEXT PRIMARY KEY, doc TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS vault (owner TEXT NOT NULL, ts INTEGER NOT NULL,
        league INTEGER, gold INTEGER, data TEXT NOT NULL, PRIMARY KEY (owner, ts));
      CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY AUTOINCREMENT,
        ts INTEGER NOT NULL, version TEXT, ua TEXT, url TEXT, kind TEXT,
        message TEXT, stack TEXT, account TEXT, note TEXT, log TEXT);
    `);
    const sql = this.sql;
    const store = {
      getPlayer: (id) => {
        const r = [...sql.exec("SELECT doc FROM players WHERE id = ?", id)];
        return r.length ? JSON.parse(r[0].doc) : undefined;
      },
      putPlayer: (p) => { sql.exec("INSERT INTO players (id, doc) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET doc = excluded.doc", p.id, JSON.stringify(p)); },
      playerIds: () => [...sql.exec("SELECT id FROM players")].map((r) => r.id),
      dumpPlayers: () => Object.fromEntries([...sql.exec("SELECT id, doc FROM players")].map((r) => [r.id, JSON.parse(r.doc)])),
      kvGet: (k) => { const r = [...sql.exec("SELECT v FROM kv WHERE k = ?", k)]; return r.length ? r[0].v : null; },
      kvSet: (k, v) => { sql.exec("INSERT INTO kv (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v", k, v); },
      vaultPush: (owner, entry, keep) => {
        sql.exec("INSERT OR REPLACE INTO vault (owner, ts, league, gold, data) VALUES (?, ?, ?, ?, ?)",
          owner, entry.ts, entry.league ?? null, entry.gold ?? null, entry.data);
        sql.exec(`DELETE FROM vault WHERE owner = ? AND ts NOT IN
          (SELECT ts FROM vault WHERE owner = ? ORDER BY ts DESC LIMIT ?)`, owner, owner, keep);
      },
      vaultList: (owner) => [...sql.exec("SELECT ts, league, gold FROM vault WHERE owner = ? ORDER BY ts DESC", owner)]
        .map((r) => ({ ts: r.ts, league: r.league ?? 0, gold: r.gold ?? 0 })),
      vaultGet: (owner, ts) => {
        const r = [...sql.exec("SELECT ts, data FROM vault WHERE owner = ? AND ts = ?", owner, ts)];
        return r.length ? { ts: r[0].ts, data: r[0].data } : null;
      },
      vaultCount: () => [...this.sql.exec("SELECT COUNT(*) AS n FROM vault")][0].n,
    };
    this.core = new HallCore({
      store,
      send: (id, obj) => this.deliver(id, obj),
      adminToken: env.ADMIN_TOKEN || "",
    });
    // after hibernation: re-seat everyone who is still connected
    for (const ws of this.ctx.getWebSockets()) {
      const att = ws.deserializeAttachment();
      if (att?.id) this.core.online.set(att.id, true);
    }
  }

  wsFor(id) {
    for (const ws of this.ctx.getWebSockets()) {
      if (ws.deserializeAttachment()?.id === id) return ws;
    }
    return null;
  }
  deliver(id, obj) {
    const ws = this.wsFor(id);
    if (ws) { try { ws.send(JSON.stringify(obj)); } catch {} }
  }

  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ ok: true, online: this.core.online.size }),
        { headers: { "content-type": "application/json" } });
    }
    // ── THE BLACK BOX: crash & error reports pool here so the admin reads them
    //    inside the game. Filing is open to anyone (CORS); reading needs the
    //    admin token. No e-mail, no third-party service — just the Hall. ──
    const cors = {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    };
    if (request.method === "OPTIONS" && (url.pathname === "/report" || url.pathname === "/reports")) {
      return new Response(null, { status: 204, headers: cors });
    }
    if (url.pathname === "/report" && request.method === "POST") {
      let b = {}; try { b = await request.json(); } catch {}
      const clip = (v, n) => (v == null ? null : String(v).slice(0, n));
      try {
        this.sql.exec(
          "INSERT INTO reports (ts, version, ua, url, kind, message, stack, account, note, log) VALUES (?,?,?,?,?,?,?,?,?,?)",
          Date.now(), clip(b.version, 40), clip(b.ua, 240), clip(b.url, 200), clip(b.kind, 20),
          clip(b.message, 400), clip(b.stack, 1600), clip(b.account, 120), clip(b.note, 1000),
          clip(typeof b.log === "string" ? b.log : JSON.stringify(b.log || []), 4000));
        // keep the table bounded: newest 500 reports
        this.sql.exec("DELETE FROM reports WHERE id NOT IN (SELECT id FROM reports ORDER BY id DESC LIMIT 500)");
      } catch {}
      return new Response(JSON.stringify({ ok: true }), { headers: { "content-type": "application/json", ...cors } });
    }
    if (url.pathname === "/reports" && request.method === "GET") {
      const token = url.searchParams.get("token") || "";
      const admin = this.core.adminToken;
      if (!admin || token !== admin) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { "content-type": "application/json", ...cors } });
      const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get("limit") || "100", 10) || 100));
      const rows = [...this.sql.exec("SELECT * FROM reports ORDER BY id DESC LIMIT ?", limit)].map((r) => ({
        ...r, log: (() => { try { return JSON.parse(r.log || "[]"); } catch { return []; } })(),
        created_at: new Date(r.ts).toISOString(),
      }));
      return new Response(JSON.stringify({ rows }), { headers: { "content-type": "application/json", ...cors } });
    }
    if (request.headers.get("Upgrade") !== "websocket") return new Response("expected websocket", { status: 426 });
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    // hibernatable accept: the Hall sleeps between moves, connections stay up
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ id: null, ip: request.headers.get("cf-connecting-ip") || "?" });
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(ws, raw) {
    let msg; try { msg = JSON.parse(raw); } catch { return; }
    const att = ws.deserializeAttachment() || {};
    // hello: seat the identity BEFORE handling — the welcome (and friend
    // pushes) are delivered by id, so the socket must already carry it.
    const preSeat = msg.t === "hello" && msg.id && att.id !== msg.id;
    if (preSeat) ws.serializeAttachment({ ...att, id: msg.id });
    try {
      const id = this.core.handle(att.id, msg, att.ip || "?");
      if (id && id !== att.id) ws.serializeAttachment({ ...att, id });
    } catch (e) {
      if (preSeat) ws.serializeAttachment(att); // a rejected hello must not hijack the seat
      try { ws.send(JSON.stringify({ t: "error", error: String(e.message || e) })); } catch {}
    }
  }

  webSocketClose(ws) {
    const att = ws.deserializeAttachment();
    // "identity taken" reconnects: only drop presence if no OTHER socket holds this id
    if (att?.id) {
      const others = this.ctx.getWebSockets().filter((o) => o !== ws && o.deserializeAttachment()?.id === att.id);
      if (!others.length) this.core.close(att.id);
    }
  }
  webSocketError(ws) { this.webSocketClose(ws); }
}
