// ── THE ADMIN BLACK BOX ──────────────────────────────────────────────────────
// Crash reports never leave in an e-mail. They pool in the game's own Hall (the
// existing Cloudflare Worker): anyone can FILE a report (POST /report), and the
// admin READS them (GET /reports?token=…) straight inside the app. Every report
// is also mirrored to a local ring buffer so nothing is lost offline.
//
// The admin token is the Worker's ADMIN_TOKEN secret (npx wrangler secret put
// ADMIN_TOKEN). The admin pastes it once in the Fehlerberichte panel; it's kept
// on the device only.

import { HALL_HTTP } from "../app/config.js";

const LOCAL = "gg_reports_local";  // this device's filed reports (offline mirror)
const ERRLOG = "gg_errlog";         // raw runtime error ring buffer (written in main.jsx)
const TOKKEY = "gg_admin_token";    // admin's read token, this device only

const readLS = (k, fb) => { try { return JSON.parse(localStorage.getItem(k) || fb); } catch { return JSON.parse(fb); } };
const writeLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export function recentErrors() { return readLS(ERRLOG, "[]"); }
export function getAdminToken() { try { return localStorage.getItem(TOKKEY) || ""; } catch { return ""; } }
export function setAdminToken(tok) { try { tok ? localStorage.setItem(TOKKEY, tok) : localStorage.removeItem(TOKKEY); } catch {} }

function buildRow({ note = "", err = null, account = null } = {}) {
  return {
    version: (typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "?"),
    ua: (typeof navigator !== "undefined" ? navigator.userAgent : "").slice(0, 240),
    url: (typeof location !== "undefined" ? location.pathname : ""),
    kind: err ? "crash" : "manual",
    message: String(err?.message || err || note || "(kein Text)").slice(0, 400),
    stack: String(err?.stack || "").slice(0, 1600),
    account: account ? String(account).slice(0, 120) : null,
    note: String(note || "").slice(0, 1000),
    log: recentErrors().slice(-25),
    created_at: new Date().toISOString(),
  };
}

/** File a report: sent to the Hall so the admin sees every device; always
 *  mirrored locally. Never throws. Returns { ok, where }. */
export async function fileReport(opts = {}) {
  const row = buildRow(opts);
  const mine = readLS(LOCAL, "[]"); mine.push(row); writeLS(LOCAL, mine.slice(-50));
  if (HALL_HTTP) {
    try {
      const res = await fetch(HALL_HTTP + "/report", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify(row), keepalive: true, // survive a page unload after a crash
      });
      if (res.ok) return { ok: true, where: "hall" };
    } catch {}
  }
  return { ok: true, where: "local" };
}

/** Admin view: pull the newest reports from the Hall (all devices) using the
 *  admin token. Falls back to this device's local mirror. Returns
 *  { source, rows, error? }. */
export async function listReports({ limit = 100 } = {}) {
  const token = getAdminToken();
  if (HALL_HTTP && token) {
    try {
      const res = await fetch(HALL_HTTP + "/reports?token=" + encodeURIComponent(token) + "&limit=" + limit);
      if (res.status === 401) return { source: "hall", rows: [], error: "unauthorized" };
      if (res.ok) { const j = await res.json(); if (Array.isArray(j.rows)) return { source: "hall", rows: j.rows }; }
    } catch {}
  }
  const local = readLS(LOCAL, "[]").slice().reverse().slice(0, limit);
  return { source: "local", rows: local, error: token ? "offline" : "no-token" };
}

/** Clear this device's local mirror. Hall rows are untouched. */
export function clearLocalReports() { writeLS(LOCAL, []); }
