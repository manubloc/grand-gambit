# GRAND GAMBIT — Übergabe für neuen Chat (Stand v0.2.1, Juli 2026)

## Was ist das
Story-Taktik-Schach-RPG als PWA. React 18 + Vite 5, plain JS ESM, Node 22.
Kern deterministisch & UI-frei (core/content/meta/ai/app/platform), 235 Tests
(`npm test`), 115 KB gzip. Alle Grafiken (26 Figuren, 6 Bosse, Wappen,
27 Landschafts-Bausteine, 12 Item-Icons) sind editierbare SVGs unter assets/
→ `npm run art` (läuft via pre-Hooks automatisch). Doku: README, assets/README,
RELEASE-ANLEITUNG, ACCOUNTS-ANLEITUNG, CHANGELOG, **UMBAU-PLAN.md (= nächste Aufgaben!)**.

## Live & Infrastruktur
- **https://grandgambit.win** (+ grand-gambit.pages.dev), HTTPS, PWA mit Service Worker.
- GitHub: **manubloc/grand-gambit** (privat, main, HEAD 15db7f2). CI grün
  (Tests+Builds+Sandbox-Boot). itch-Workflow liegt bereit (Secrets fehlen noch).
- Cloudflare Pages "grand-gambit": Auto-Deploy bei Push auf main
  (Build `npm run build`, Output `dist`, NODE_VERSION=22). Konto Frey.manu@gmail.com.

## Deploy aus dem Chat (bewährter Ablauf)
1. Nutzer gibt Fine-grained-Token "gambit-deploy" (Contents RW + Workflows RW,
   nur dieses Repo) in den Chat — Token NIE in Dateien/Ausgaben schreiben.
2. Sandbox: clone nach /tmp mit `https://x-access-token:${GH_TOKEN}@github.com/...`,
   Projekt per **tar-Pipe** überlagern (rsync existiert nicht!), Excludes:
   node_modules dist dist-single .git server/data.json server/backups assets/map-export.
3. `npm test` vorher (235 erwartet), commit, push → Cloudflare baut selbst.
4. Verifizieren: Service Worker cached! Neue Version am besten über die
   frische Deployment-Preview-URL (hash.grand-gambit.pages.dev) prüfen oder
   Seite zweimal laden. Versions-Anzeige: Profil unten "v0.2.x".

## Offene Punkte
- **privacy.html: rote Platzhalter [NAME/ADRESSE/E-MAIL/DATUM] ausfüllen (Pflicht!).**
- LICENSE: [NAME]-Platzhalter.
- **UMBAU-PLAN.md abarbeiten**: (A) Map-Immersion (Vollbild-Viewport, kleinere
  Medaillons, größerer Wanderer, eingebettetes Node-Panel — Nutzer liefert
  Referenzbild), (B) Gefolge → 3 Reiter, (C) Währungs-SVGs + Ressourcen-Leiste,
  (D) Schwierigkeitsgrad (Elo-Ranges 600–900/1000–1300/1400–1700),
  (E) Konten via Supabase Auth (E-Mail=Identität, Gamertag-Würfel, unique) + Online.
- Multiplayer-Server noch nicht gehostet (SERVER_URL leer; server/ ist fertig
  inkl. Backups alle 10 Min, Admin via ADMIN_TOKEN ≥24 Zeichen + scripts/admin.mjs).

## Arbeitsweise des Nutzers
Deutsch, knappe Mobile-Nachrichten, Deliverables statt Rückfragen, am Ende
jeweils Deploy. Nach jedem Feature: npm test + Smoke, dann push.

## Login & Admin (v0.16)

- Eingebauter Admin: **admin / gambit-admin** — nach erstem Login ändern! Admin sieht je Spielstand den Fortschrittsregler (0–100 %).
- Online-Anmeldung (Google/E-Mail als Cloud-Konten): SUPABASE-SETUP.md befolgen (2 Env-Variablen), Code ist fertig.

## Multiplayer (v0.18)

- Server = Cloudflare Worker + Durable Object: `cd worker && npx wrangler deploy`, dann SERVER_URL in src/app/config.js (DEPLOY-WORKER.md). Free Plan reicht. Admin optional via `wrangler secret put ADMIN_TOKEN` (≥24 Zeichen).

## ── LIVE-STAND (Session 10.07.2026 — Cloud komplett eingerichtet) ──

Alles Folgende ist LIVE und verifiziert. Repo-Stand = Commit 24cf9d7 auf main.

### Supabase (Login, Cloud-Konten, Online-Bestenlisten)
- Projekt: **grand-gambit**, Org "manubloc's Org" (Free), Region Europe
- Projekt-Ref: **kuhriectbryhezhbnsrq** → Dashboard: supabase.com/dashboard/project/kuhriectbryhezhbnsrq
- URL: `https://kuhriectbryhezhbnsrq.supabase.co`
- Publishable Key (öffentlich ok): `sb_publishable_ASusbTX5wkBnGvrQvjNRFA_Oy5Ph_kg`
- Tabelle `gambit_store` (key/value/updated_at) + RLS-Policy "gambit rw" (offen) angelegt
- Auth: Site URL = https://grandgambit.win · E-Mail-Login aktiv (Confirm email an)
- Google-Provider AKTIV: Client-ID `565450682520-p1mm2mi18iojictjs578ss5q9hom0hit.apps.googleusercontent.com`
  (Secret liegt NUR in Supabase + Google Console; bei Verlust: Google Console → Client → "Add secret")
- DB-Passwort wurde generiert und nicht notiert → bei Bedarf im Dashboard resetten (wird i.d.R. nicht gebraucht)

### Google Cloud (OAuth)
- Projekt "My First Project" (project-41d010ca-6649-414c-8cb), Konto frey.manu@gmail.com
- Google Auth Platform: App "Grand Gambit", Extern, **Status: In Produktion** (alle Google-Konten)
- OAuth-Client "Grand Gambit Web": Redirect `https://kuhriectbryhezhbnsrq.supabase.co/auth/v1/callback`,
  JS-Origin `https://grandgambit.win`

### Cloudflare (Account 73af6b7e9469b4f0ac2577e7c9e5ac18, Frey.manu@gmail.com)
- Pages "grand-gambit": Auto-Deploy von manubloc/grand-gambit main; Env (Production):
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_KEY`, `NODE_VERSION=22`
- Worker **gg-hall** (Multiplayer, Durable Objects): via "Import repository", Root `/worker`,
  Deploy `npx wrangler deploy`, baut bei jedem Push automatisch mit
- Worker-URL: `https://gg-hall.frey-manu.workers.dev` (workers.dev Production-Toggle: AN)
- Health: /health → {"ok":true,...} ✓ · SERVER_URL im Client: `wss://gg-hall.frey-manu.workers.dev/ws`
- Optional offen: Custom Domain pvp.grandgambit.win · ADMIN_TOKEN-Secret für Server-Admin-Kommandos

### Verifiziert am Ende der Session
- grandgambit.win zeigt nach Hard-Reload den neuen Login (Logo, E-Mail, Google/Apple/Discord, Gast)
- Google-OAuth-Flow bis zur Kontoauswahl fehlerfrei (Consent "Grand Gambit" → Supabase-Callback)
- Alte Clients laden die neue Version nach Service-Worker-Update (ggf. Hard-Reload)

### Offene Punkte für die nächste Session
1. GitHub-Token widerrufen (falls noch nicht geschehen) — der genutzte Token ist verbraucht zu behandeln.
2. Lokal geändert, NOCH NICHT gepusht: index.html theme-color #0f1115 → **#0c111e** (an T.bg angeglichen).
3. Apple/Discord-Login: Buttons live, Provider in Supabase noch nicht konfiguriert (analog Google).
4. privacy.html ist Platzhalter (Pflicht!), LICENSE [NAME] eintragen.
5. Erster echter Live-Test: E-Mail-Registrierung + Google-Login + PvP-Duell zu zweit.
6. Admin-Spielkonto admin/gambit-admin nach erstem Login ändern (App erinnert daran).


---

## Nachtrag Session 11.07.2026 (v0.18.1 → v0.20.1)

Deploys auf main: 9c2935f, 34b6e84, 085d293, 03265ae, 6fc4a3b, 19045ea, + Install-Banner.
Highlights: neues Logo ohne Schimmer + Splash entfernt; Bosse/Herausforderer stehen auf der Karte;
heraldischer Design-Pass (PanelTitle, Gold-CTAs, Serif-Nav); iOS-Input-Zoom-Fix (Inputs ≥16px);
Aufgeben = 0 Punkte; Zeitenwender-Gadget statt Gratis-Undo; progressive Vorratstruhe (itemRevealed);
Emoji→gezeichnete Icons; Match-Pause&Fortsetzen (profile.pausedMatch, Codec); cloneState-Potion-Bugfix;
Abtrünnige (excludeId in buildStageMatch/buildArmy); Hotseat „Zu zweit · ein Gerät" (Brett dreht zum
Ziehenden); Akademie-Tutorial (7 Lektionen, überspringbar); PWA-Install-Banner (nur im Browser,
beforeinstallprompt + iOS-Hinweis, localStorage gg-install-dismissed).
Login: Apple/Discord hinter SHOW_EXTRA_PROVIDERS=false (LoginScreen.jsx) bis Provider konfiguriert.

## Geplant (noch NICHT gebaut): zwei Editionen

Free-Edition bis Liga II, Vollversion bis Liga X (Kampagne kostenpflichtig), Launch als zwei
getrennte Apps. Vorgesehene Umsetzung, wenn es so weit ist: Build-Flag `EDITION` ('free'|'full')
in src/app/config.js + `MAX_LEAGUE` (2 bzw. 10); advanceLeague deckelt auf MAX_LEAGUE und zeigt
statt Liga-III-Aufstieg einen Upgrade-Hinweis; zwei Cloudflare-Pages-Projekte aus demselben Repo
mit ENV VITE_GG_EDITION. Der Install-Banner ist bereits Web-only (display-mode standalone wird
erkannt) und stört eine spätere Store-Variante nicht.
