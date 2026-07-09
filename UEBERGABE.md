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
