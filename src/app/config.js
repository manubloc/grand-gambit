// App-wide configuration.
// SERVER_URL is the multiplayer endpoint the app connects to automatically —
// set this to your hosted server (see README-ONLINE.md) before shipping.
// Until it is set, the Online screen shows a friendly setup note instead of
// asking players to type addresses.
export const SERVER_URL = "wss://duell.grandgambit.win/ws"; // neutral custom domain (Cloudflare Worker gg-hall)
// The same Hall serves the error-report endpoints over HTTPS (POST /report,
// GET /reports). Derived from SERVER_URL so there's a single source of truth.
export const HALL_HTTP = SERVER_URL.replace(/^wss:/, "https:").replace(/^ws:/, "http:").replace(/\/ws$/, "");
export const APP_VERSION = "2.0";

// Cloud accounts (Supabase) whose e-mail addresses get admin powers.
export const ADMIN_EMAILS = [];             // e.g. ["you@example.com"]
