// App-wide configuration.
// SERVER_URL is the multiplayer endpoint the app connects to automatically —
// set this to your hosted server (see README-ONLINE.md) before shipping.
// Until it is set, the Online screen shows a friendly setup note instead of
// asking players to type addresses.
export const SERVER_URL = "wss://duell.grandgambit.win/ws"; // neutral custom domain (Cloudflare Worker gg-hall)
export const APP_VERSION = "2.0";

// Cloud accounts (Supabase) whose e-mail addresses get admin powers.
export const ADMIN_EMAILS = [];             // e.g. ["you@example.com"]
