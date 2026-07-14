# GRAND GAMBIT — Übergabe für neuen Chat (Stand v0.21.17, 13.07.2026)

## Was ist das
Story-Taktik-Schach-RPG als PWA. React 18 + Vite 5, plain JS ESM, Node 22.
Kern deterministisch & UI-frei (core/content/meta/ai/app/platform), 11 Test-Suiten
(`npm test`, MUSS grün sein vor jedem Push). Figuren-Optik: 33 gemalte WebP-Figuren
(26 Hofstaat + 7 Boss-Familien) unter src/app/ui/assets/painted/, Vektor-SVGs als
Fallback/„Simpel"-Stil. Doku: README, CHANGELOG, RELEASE-ANLEITUNG,
ACCOUNTS-ANLEITUNG, DEPLOY-WORKER.md, UMBAU-PLAN.md.

## Live & Infrastruktur
- **https://grandgambit.win** (Cloudflare Pages "grand-gambit", Auto-Deploy bei
  Push auf main; Build `npm run build`, Output `dist`, NODE_VERSION=22).
- GitHub: **manubloc/grand-gambit** (**ÖFFENTLICH**, main). Deshalb Grundregel:
  niemals Zugangsdaten, Tokens, Konto-IDs oder private E-Mails in Repo-Dateien
  schreiben — Betriebsdetails gehören in den Passwortmanager des Nutzers.
- **Online-Duell:** Cloudflare Worker **gg-hall** (Durable Object "Hall", SQLite,
  hibernatable WebSockets). Neutrale Domain **wss://duell.grandgambit.win/ws**
  (Custom Domain aktiv, Zertifikat läuft). Alte URL gg-hall.frey-manu.workers.dev
  ist bewusst noch aktiv (fängt alte PWA-Caches), taucht aber nirgends mehr im
  Quellcode auf. Cloudflare-Zugang: beim Nutzer (Passwortmanager).
- **Supabase** (EU-Projekt, Ref beim Nutzer): Konten/Google-OAuth. Admin-Login lokal:
  Konto `admin`, Passwort beim Nutzer (Saves-Screen → „⚙ Admin · Spielfortschritt"
  setzt beliebigen Fortschritt, z. B. 100%-Save für Tests).

## Deploy aus dem Chat (bewährter Ablauf)
1. Nutzer gibt Fine-grained-Token "gambit-deploy" (Contents RW, nur dieses Repo)
   in den Chat — Token NIE in Dateien/Ausgaben schreiben, danach widerrufen lassen.
2. Sandbox: clone nach /tmp/gg-deploy mit `https://x-access-token:${GH_TOKEN}@github.com/...`,
   Projekt per **tar-Pipe** überlagern (rsync existiert nicht!), Excludes:
   node_modules dist dist-single .git server/data.json server/backups
   assets/map-export layout_harness* .harness.js.
3. Vor jedem Push: Version-Bump in package.json + CHANGELOG-Eintrag,
   `npm test` (11 Suiten) + `npm run build` in Quelle UND /tmp/gg-deploy.
4. Push → Cloudflare baut selbst (~2 Min). Service Worker cached: live prüfen
   per Hard-Reload / zweimal laden.

## Worker-Deploy ohne Wrangler (bewährt, über Chrome-Fernsteuerung)
1. Bundle lokal: `npx esbuild worker/src/index.mjs --bundle --format=esm
   --external:cloudflare:workers --outfile=/tmp/worker-bundle.js`
2. Bundle temporär als public/gg-hall-fix.js + CORS-Zeile in public/_headers
   pushen (wird über grandgambit.win gehostet).
3. Im Dashboard-Editor (workers/services/edit/gg-hall/production, VS-Code-Web
   in iframes — Monaco NICHT vom Top-Frame erreichbar): per javascript_tool
   Bundle fetchen → navigator.clipboard.writeText (braucht vorherigen Klick
   für Fokus!) → Klick in Editor, Ctrl+A, Ctrl+V → Deploy → Toast "Version saved".
4. Roundtrip-Test per WebSocket: hello {id:'testxx', secret:'testsecret1234567',
   name:'DiagTest', score:100, privacy:'public'} → erwarte {t:"welcome"}.
5. Bundle + CORS-Zeile wieder aus dem Repo entfernen und pushen.
WICHTIG Worker-Eigenheit: hibernatable WS — Zustellung läuft über Attachment-IDs;
beim hello wird die ID per preSeat VOR handle() gesetzt (Rollback bei Fehler),
sonst verpufft das welcome (war ein Live-Bug, gefixt in d722653).

## Zustand v0.21.x (seit v0.20.1 passiert)
- **Galerie komplett:** 33 gemalte Figuren; paintedArt.js (PAINTED-Map, KIND2ID,
  ENEMY_FILTER hue-rotate(185deg)). Boss-Lookup: eigenes Porträt
  (painted-boss-<id>.webp) → b23/archenemy, b25/leaguemaster → Familie (piece.art).
- **Design-Sprache:** Nachtblau #0c111e + Antikgold #c9a45c, KEINE Signalfarben.
  Gilded.jsx = geteilte Bausteine (GildedFrame, goldText, GoldRule, Diamond,
  GoldShineButton). Glanz (ggShine-Sweep) NUR auf Haupt-CTAs: Fortsetzen/Spielen/
  Verbinden (Hub), Verbessern/Erwerben (Figuren), Partie starten (Schnelles Spiel),
  Einfordern (Schatzkammer). Segmented-Reiter: Gold ohne Sweep.
- **Figuren-Overlays (PieceGlyph):** Level = Gold-Rauten oben mittig; HP = Glanz-
  Bubbles (HpDots, radial-gradient Lichtpunkt) ganz unten am Feld, >10 HP schmaler
  Balken; ATK = BladesIc ÜBER Zahl links; Fähigkeits-Punktspalte rechts
  (TAG_ORDER, once+used ergraut). Figur mittig, paddingBottom 0.095em.
- **Desktop:** eingebaute Vergrößerung zoom 1.15 ab 1440px / 1.3 ab 1760px;
  --vhz-Variable kompensiert dvh (sonst scrollt es!). Match zweispaltig ab 940px
  (Brett maximal, Seitenleiste 272px). Aufstellung ein Bildschirm (Brett links
  min(700px, 100dvh/var(--vhz)-250px), Regie rechts). Hub + Saves vertikal mittig.
- **Figuren-Tab:** Akkordeon (eine Karte offen, ganze Kachel klickt, offen =
  volle Breite via gridColumn 1/-1); AbilityTiles gleich hoch, Beschreibungen
  IMMER sichtbar (Felder heißen descDe/descEn — NICHT textDe!); TAGS enthält
  "trick" (Held-Fähigkeiten, war Crash-Ursache).
- **Ökonomie:** upgradeCost wertgewichtet (Bauer 1★ … Dame/König 4★).
  Sternensplitter (Ausrüstung): 1 Skillpunkt für 45 Gold, Cap 2×Liga
  (leveling.js buySpShard/spShardCap, Reducer BUY_SP_SHARD, profile.spShards).
- **Karten-Wording:** piece-Stationen "Neue Figur", pure "Konkurrent",
  nur Ligafeste (pure && next leer && kein Gate) = "Endboss".
- **Profil:** Gold-Kopf (GildedFrame), "Spielstand wechseln" (setSlot(null)) +
  "Abmelden" (clearSession+signOutCloud). Erst-Start-Intro → Hub statt Karte.
- **Online:** Cloud-Vault-UI nur account.isAdmin; App reicht account durch.
  SERVER_URL = wss://duell.grandgambit.win/ws (config.js), kein Fallback mehr.
- **SEO:** index.html sauber (canonical 1×, OG inkl. url/width/height/alt,
  twitter, JSON-LD), public/og.jpg 1200×630, robots.txt + sitemap.xml.
- Strings: typografische Anführungszeichen in strings.js brechen die Datei — nur gerade "…" verwenden!

## OFFENE PUNKTE (Prio oben)
1. ~~Worker-Deploy Rangliste~~ **ERLEDIGT 14.07.2026:** Gefiltertes Leaderboard
   deployed & verifiziert (Bindings/compat intakt, WS-Roundtrip auf beiden
   Endpunkten grün). Bundle + CORS-Zeile aus dem Repo entfernt.
   NEUER BEWÄHRTER WEG (statt Monaco-Paste, der an Cross-Origin-Clipboard
   scheitert): im eingeloggten Dashboard-Tab per javascript_tool die interne
   API nutzen — PUT /api/v4/accounts/<acct>/workers/scripts/gg-hall als
   multipart (metadata: main_module index.js, compatibility_date aus
   GET …/settings übernehmen, keep_bindings: [alle Typen]; index.js als
   Blob application/javascript+module). Session-Cookies reichen, kein Wrangler.
2. **Boss-Gemälde:** Nutzer generiert mit BOSS-PROMPTS.md (liegt im Zip unter
   docs-handover/) 23 Unikat-Porträts, schickt sie nummeriert mit Zuordnung →
   freistellen (strip_checker gegen Fake-Transparenz!), als
   painted-boss-<id>.webp einbinden, PAINTED erweitern.
3. **Figuren-Entzerrung über Ligen:** alle 18 Stations-Rekruten hängen am
   Kernpfad (= Liga I). Hebel: `league:`-Feld an Kernpfad-Knoten (Mechanik
   existiert, siehe g4–g9). Nutzer nennt Zielverteilung → umsetzen.
   Analyse: docs-handover/GAME-SITEMAP.md.
4. **Liga-Hintergründe:** 10 Bilder bg-fruehling…bg-meer vom Nutzer ausstehend
   (Prompts wurden früher geliefert) → hinter Brett abgedunkelt einbauen.
5. Zuordnungs-Review 4 Deutungsfälle der Galerie (Kanzler/Flaggenträger/
   Stratege/Kundschafter) via Admin-100%-Save.
6. Discord-Provider in Supabase (Anleitung zugesagt); Apple-OAuth kostet 99$/Jahr.
7. GameScreen-HUD gilt weiter als Design-Kandidat; Balance-Idee "steilere
   Levelkurve für starke Figuren" nur auf Nutzerwunsch (kostet Save-Kompatibilität).

## Arbeitsweise mit dem Nutzer
Knappe deutsche (Sprach-)Nachrichten, viele Punkte pro Nachricht. Deliverables
statt Rückfragen; Screenshots selbst ansehen (Headless-Harness: esbuild-Bundle
aus Harness-JSX + puppeteer-core@23 + @sparticuz/chromium, 1280×800; Muster:
GLOBAL_CSS injizieren, defaultProfile()+upgradePiece, makeT, ArmyScreen initialTab).
Chrome-Fernsteuerung für Cloudflare/Live-Checks etabliert (browser_batch nutzen;
Fehlerseiten nicht screenshotbar; Login IMMER der Nutzer selbst).
