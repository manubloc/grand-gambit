// ── THE ADMIN BLACK BOX ──────────────────────────────────────────────────────
// Crash reports never leave in an e-mail. They pool inside the app: written to
// the cloud (Supabase table `error_reports`) when it's configured, and mirrored
// into a local ring buffer so nothing is lost offline. The Admin area reads
// them back — the admin sees what players hit, right inside the game.
//
// Supabase table (see SUPABASE-SETUP.md):
//   create table error_reports (
//     id bigint generated always as identity primary key,
//     created_at timestamptz default now(),
//     version text, ua text, url text, kind text, message text, stack text,
//     account text, note text, log jsonb
//   );
//   alter table error_reports enable row level security;
//   create policy "anyone can file" on error_reports for insert with check (true);
//   create policy "admins can read" on error_reports for select using (
//     auth.jwt() ->> 'email' in ( ...your admin e-mails... ) );

import { cloudConfigured, sbClient } from "./cloudAuth.js";

const LOCAL = "gg_reports_local";   // this device's own filed reports (fallback + offline)
const ERRLOG = "gg_errlog";          // the raw runtime error ring buffer (written in main.jsx)

const readLS = (k, fb) => { try { return JSON.parse(localStorage.getItem(k) || fb); } catch { return JSON.parse(fb); } };
const writeLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

/** The raw error ring buffer captured by the global handlers. */
export function recentErrors() { return readLS(ERRLOG, "[]"); }

/** File a report: cloud first (so the admin sees every device), always mirrored
 *  locally. `note` is the player's optional description, `err` an optional
 *  crash object. Returns { ok, where }. Never throws. */
export async function fileReport({ note = "", err = null, account = null } = {}) {
  const row = {
    version: (typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "?"),
    ua: (typeof navigator !== "undefined" ? navigator.userAgent : "").slice(0, 240),
    url: (typeof location !== "undefined" ? location.pathname : ""),
    kind: err ? "crash" : "manual",
    message: String(err?.message || err || note || "(kein Text)").slice(0, 400),
    stack: String(err?.stack || "").slice(0, 1200),
    account: account ? String(account).slice(0, 120) : null,
    note: String(note || "").slice(0, 1000),
    log: recentErrors().slice(-25),
    created_at: new Date().toISOString(),
  };
  // mirror locally no matter what
  const mine = readLS(LOCAL, "[]"); mine.push(row); writeLS(LOCAL, mine.slice(-50));

  if (cloudConfigured()) {
    try {
      const c = await sbClient();
      if (c) {
        const { error } = await c.from("error_reports").insert([{ ...row, log: row.log }]);
        if (!error) return { ok: true, where: "cloud" };
      }
    } catch {}
  }
  return { ok: true, where: "local" };
}

/** Admin view: pull the newest reports. Cloud when available (all devices),
 *  otherwise this device's local mirror. Returns an array (newest first). */
export async function listReports({ limit = 100 } = {}) {
  if (cloudConfigured()) {
    try {
      const c = await sbClient();
      if (c) {
        const { data, error } = await c.from("error_reports").select("*").order("created_at", { ascending: false }).limit(limit);
        if (!error && Array.isArray(data)) return { source: "cloud", rows: data };
      }
    } catch {}
  }
  const mine = readLS(LOCAL, "[]").slice().reverse().slice(0, limit);
  return { source: "local", rows: mine };
}

/** Admin housekeeping: clear the local mirror on this device. Cloud rows are
 *  left untouched (delete those in the Supabase dashboard). */
export function clearLocalReports() { writeLS(LOCAL, []); }
