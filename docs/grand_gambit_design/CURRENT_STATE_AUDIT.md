# Ist-Zustand — Audit (Phase 1)

## Technischer Stack (geprüft, nicht angenommen)
React 18 + Vite 5, reines JS/ESM, kein TypeScript, kein CSS-Framework. Styling = Inline-Styles, die zur Renderzeit aus einem **mutierbaren Token-Objekt `T`** lesen (`src/app/ui/theme.js`); `setDesign()` tauscht die Palette in place (zwei Livreen: CLASSIC dunkelblau, CARVED schwarz-violett — CARVED ist per `APP_DESIGN` aktiv und entspricht Produktion). Globales CSS (Keyframes, Scrollbars, Fokus) als String `GLOBAL_CSS` in theme.js. State: useReducer im App-Root, Profile in localStorage (`gambit:u::…`). Navigation: eigener Tab/View-State, kein Router. i18n: Schlüsseltabelle `src/app/i18n/strings.js` (de/en). PWA: Workbox-Precache, Service-Worker-Watchdog. Tests: 18 eigene mjs-Suiten (761 Assertions) + Fahr-/Boot-/Messwerkzeuge auf Playwright-core.

## Screens (10 Dateien + Zustände)
Login, Saves, Hub (in App.jsx: PlayHub), Schnelles Spiel + Match (GameScreen), Kampagne + Weltkarte (CampaignScreen), Hofstaat 4 Reiter (ArmyScreen), Figuren-Popup (in ArmyScreen), Schatzkammer (AchievementsScreen), Online (OnlineScreen), Profil (ProfileScreen), Akademie (TutorialScreen), Bestenliste (LeaderboardScreen). Zustände: offline-Badge (Hub), locked/gated (Kampagne), Silhouetten (Codex), pausierter Kampf.

## Vorhandene Design-Sprache (erhalten!)
Tokens existieren und werden fast überall gelesen; `Gilded.jsx` bündelt Goldrahmen, Glanzlauf (`ggShine`, 11 s, gestaffelte Slots via `useShineDelay`), Golddividern, Eck-Diamanten; `primitives.jsx` bündelt Button (5 Varianten), Panel + PANEL_WASH/RIFT_WASH, PanelTitle, FieldLabel, MapChip, Bar, Chip, Segmented, Stat. Violett („der Riss") ist bereits als zweite Stimme etabliert (`T.rift*`, gemessene Kontraste im Quelltext dokumentiert).

## Kernprobleme (deckungsgleich mit Auftrag §5, per Screenshot belegt)
1. **Auswahl = Gold.** Segmented, MapChip und Schwierigkeitswahl färben Selektion goldfarben → im Schnellen Spiel stehen 4+ Goldflächen gleichzeitig; Aktion und Auswahl sind ununterscheidbar. (before/normal-04)
2. **Hub zentriert vertikal** (`justifyContent:center`) → Leerraum über der Kampagnenkarte. Drei Gold-CTAs mit Glanzlauf gleichzeitig sichtbar. (before/normal-03)
3. **Match:** Brett per `placeItems:center` mittig „in der Luft", tote Bänder oben+unten. (before/normal-05)
4. **Schatzkammer:** Gilded-Hero hoch, jede Ruhmestat als große Karte. (before/normal-11)
5. **Hofstaat:** Chronik-Intro dauerhaft mehrzeilig; Reiter-Selektion ebenfalls Gold. (before/normal-08/10)
6. **Harte Farben:** 1169 Hex-Vorkommen (505 verschiedene) außerhalb der Tokens; Schwerpunkte sind generierte Kunst (art.generated.js, mapArt — legitim, das sind Bilder) und Screens (ArmyScreen 141, GameScreen 94 — Migrationsziel für Flächen/Text, nicht für Illustrationsfarben).
7. Kein Motion-Tokensatz (Dauern/Kurven hart verteilt), kein disabled-Standard außer opacity, keine Komponenten-Galerie.

## Was bereits gut ist und bleibt
Figuren/Wappen/Karten-Assets (368 Dateien, 40 MB, siehe ASSET_REGISTER), Glas-Kopfleiste + Dock mit Safe-Area, Fluchtlinie 10 px (nachgemessen via schau.mjs), Pergament-Panel der Kampagne, Kontrast-Disziplin in theme.js-Kommentaren, ggShine-Staffelung, immersive-Modus ohne Dock im Match, `prefers-reduced-motion` — **fehlt** (siehe KNOWN_ISSUES).
