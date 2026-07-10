# Multiplayer live schalten — Cloudflare Durable Objects (0 € Fixkosten)

Der Spielserver ist als Cloudflare Worker mit einem SQLite-Durable-Object
("Hall") portiert: WebSocket-Hibernation (kostet im Leerlauf nichts),
Spieler/Ratings/Vault in eingebautem SQLite, überlebt Deploys und Schlaf.
SQLite-DOs laufen im **Workers Free Plan**.

## Deploy (5 Minuten)
    cd worker
    npx wrangler login          # einmalig, öffnet den Browser
    npx wrangler deploy

Die Ausgabe zeigt die URL, z. B. `https://gg-hall.<dein-subaccount>.workers.dev`.

## Spiel verbinden
In `src/app/config.js`:

    export const SERVER_URL = "wss://gg-hall.<dein-subaccount>.workers.dev/ws";

Committen → Cloudflare Pages deployt → der Online-Tab verbindet sich.

## Optional
* **Eigene Domain:** Worker → Settings → Domains & Routes →
  `pvp.grandgambit.win` hinzufügen, dann `SERVER_URL` entsprechend.
* **Admin-Kommandos** (stats/dump über die Online-Konsole):
      npx wrangler secret put ADMIN_TOKEN     # ≥ 24 Zeichen!
* **Health-Check:** `https://…workers.dev/health` → `{"ok":true,"online":n}`

## Was gleich blieb
Das Protokoll ist 1:1 das des alten Node-Servers (`server/server.mjs` bleibt
als Referenz liegen) — Client und Online-Screen brauchten keine Änderung.
Matchmaking-Bänder, Elo (K=32), Rematch-Fenster (2 min, Seitenwechsel),
Vault (5 Snapshots), Freunde/Geschenke/Privatsphäre: alles identisch, jetzt
mit 29 eigenen Protokoll-Tests (`node test_worker.mjs`).
