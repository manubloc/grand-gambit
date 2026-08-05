# Übergabe · Grand Gambit · Stand v1.0.2 (5.8.2026)

Repo `github.com/manubloc/grand-gambit` · live `grandgambit.win`
Prüfkette **875 / 0 / 21** · Bündel **1,75 MB** · Cloudflare-Deploy ~2,5 min

---

## ZUERST: die Schlüssel rotieren

In der letzten Unterhaltung standen **fünf** Zugänge im Klartext:
GitHub-PAT, ElevenLabs, fal.ai, **OpenAI**, aimlapi. Der OpenAI-Schlüssel ist
der heikelste (Abrechnung). Alle Arbeit ist gesichert — die Schlüssel haben
ihren Zweck erfüllt.

---

## Die drei nächsten Aufgaben

### 1. Namenspflicht beim Anlegen (angefangen, nicht gebaut)
Beim Anlegen eines Kontos soll ein **Name** verlangt werden, eindeutig, statt
ihn erst beim ersten Online-Duell zu erfragen. Kein Handgriff: Eingabefeld,
Prüfung auf Eindeutigkeit, Fehlermeldung, Weitergabe an Spielstand und Halle.
Bewusst nicht halb gebaut — sonst entstehen Konten ohne Namen.

### 2. Der Textfluss-Prüfer ist BLIND (wichtig)
`tools/pruefe-textfluss.mjs` misst **seit v0.92 nichts mehr**: er läuft über
den Gastzugang, den wir damals entfernt haben, und meldet „0 Knöpfe" auf
allen drei Viewports — **ohne zu scheitern**. Er hat also acht Versionen lang
grünes Licht gegeben, ohne hinzusehen. Auf den Kontoweg umstellen (Konto
anlegen wie in den Sonden: „Noch kein Konto? Erstellen", dann E-Mail +
Passwort zweimal).

### 3. „Design klassisch" im Admin
Der Besitzer sieht dort einen Eintrag, den er entfernt haben will. Ich habe
ihn weder im Admin noch im Profil gefunden — beim nächsten Mal zeigen lassen.

---

## Weiter offen (aus früheren Runden)

- **Kapitel VIII (Aschgrund, roter Canyon)**: Einstiegsbild fehlt als
  einziges. Prompt liegt in `design/BILD-PROMPTS-KAPITEL.md`.
- **Mauern/Fallen/Zäune**: Die **Mechanik steht** (20 Prüfungen, v0.90) —
  Kauf im Lager, Platzieren auf dem Brett und Darstellung fehlen. Bilder-
  Prompts mit allen Zuständen liegen bereit.
- **Musikauswahl**: 36 Stücke im Archiv, in der Klangwerkstatt hörbar
  (Menü A–L usw.). Der Besitzer soll Buchstaben nennen; Halle und Schnelles
  Spiel haben noch keine eigene Verdrahtung, Kapitel II–IX auch nicht.
- **Kartenerzählung**: Gegner tritt aus dem Dunkel in den Weg, nach dem Sieg
  zurück zur Karte, besiegte Figur verschwindet (`design/IDEEN-UND-OFFENES.md`).
- **Verwandlungs-Animation**: Turnierfiguren drehen sich und werden lebendig.
- **Schaukammer**: echtes Löschen/Pushen aus der Oberfläche (bisher nur
  Merkliste als Datei — bewusst, siehe unten).

---

## Was in dieser Sitzung entstand (v0.86 → v1.0.2)

- **Musik**: 36 Stücke, alle in einer Handschrift (tiefe gezupfte Saiten,
  keine Streicher, nichts Grelles, −23,5 dBFS). Blende 9 s, nacheinander.
- **Kapitel-Einstiege**: 12 Landschaften, vollflächig, Ken Burns 24 s, Musik
  blendet mit, einmalig je Kapitel (`profile.gesehen.kapitelIntro`).
- **Sperren-Engine**: Zaun/Mauer/Bollwerk (1/2/3 Schläge, 40/110/240 Gold),
  Spitzgrube (2 Schaden) und Bärenfalle (1 Zug Pause). Ein Schlag kostet den
  **Zug**, nicht die Figur.
- **Schaukammer** (`?werkstatt`): 382 Bilder, Vorschau 200 px (43 MB → 3,4 MB),
  Bestandsanzeige, Merkliste zum Aussortieren.
- **Klangwerkstatt** (`?klangwerkstatt`): 36 Stücke, alle je erzeugten.
- **Gastzugang entfernt**, Rechtstexte nachgezogen (null Treffer für „Gast").
- **Zurück-Geste** verlässt die App nicht mehr (Verlaufseinträge je Tiefe).
- **Lautstärke**: ein violetter Regler je Klangart, ganz links = aus.
- **Icons**: alle aus dem freigestellten Riss-Emblem, mittig (Versatz war
  6/12 px, jetzt < 1 px).
- **Figuren normiert**: 114 geschnitzte auf gleiche Sockelbreite (Streuung
  46 → 25 px), 12 klassische auf gestaffelte Sockel und gleiche Helligkeit
  (Streuung 28,6 → 0,8).

---

## Die Archive (wichtigste Struktur)

| Ort | Inhalt | Im Bündel? |
|---|---|---|
| `src/app/ui/assets/` | Spielfassungen, klein | **ja** (1,75 MB) |
| `archiv/bilder/` | 122 Originale + 12 Kapitel-Landschaften | nein |
| `archiv/musik/` | 36 Stücke | nein |
| `public/kapitel/` | 12 Einstiegsbilder, 1920 px | nein, daneben |

**Regel:** Jedes neue Bild kommt **zuerst unverändert** ins Archiv, erst
daraus wird die Spielfassung gerechnet. Nie umgekehrt. Grund: Bis v0.92 lagen
nur Spielfassungen im Repo (teils 224×384), die Originale waren verloren —
93 konnten aus der fal.ai-Auftragshistorie gerettet werden, der farbige
geschnitzte Satz (Springer, Läufer, Turm, Dame, König) ist **weg**.

`tools/baue-schaukammer.mjs` legt beim Bau alle Archive neben das Spiel.

---

## Fallen, die diese Sitzung gekostet haben

- **App.jsx hat zwei Rückgabezweige** (breit/schmal) — jede UI-Änderung muss
  in beide.
- **Hooks vor allen bedingten `return`** in App.jsx, sonst React #310.
- **`<main>` trägt eine mask-image** = Stapelkontext: Leisten und
  Install-Banner liegen **immer** über Popups darin. Freiraum **messen**
  (`data-gg-leiste="oben"`), nicht raten.
- **`import.meta.glob` kennt nur Vite** — esbuild (Rauchtest, Einzeldatei)
  wirft zur Laufzeit; ein try/catch verhindert den Absturz nicht, sondern
  bündelt trotzdem alles (Einzeldatei wuchs auf 119 MB).
- **Große Bestände nie einbinden**: 348 Bilder als Import → Bündel 2,82 MB,
  Bau bricht ab (Offline-Speicher).
- **fal.ai-Historie ist seitenweise** (50/Seite, Felder `page`/`size`) — eine
  runde Zahl ist ein Warnzeichen.
- **`git checkout`** setzt auf den letzten Commit zurück; ungesicherte
  Änderungen sind fort.
- **Massenersetzung per String** trifft mehr als gedacht (18 statt 3) —
  gezielt vom Anker aus arbeiten.

---

## Arbeitsweise (bewährt)

Eiserne Kette vor **jedem** Push: `npm test` (875/0/21) → `npm run build` →
`npm run build:single` → `node test_boot.mjs` (3/3) → `node drive3.mjs`
(KEINE FEHLER) → Reinraum-Klon (`npm ci` + alles) → Push → live `version.json`
pollen (~26 s, oft 2–3 Runden) → Bundle > 500 KB prüfen (SPA-Fallback ist
~11 KB!) → Marker-Strings, nie Hashes.

Commit-Identität: `git -c user.name="Claude" -c user.email="noreply@anthropic.com"`

Der Besitzer arbeitet mobil per Sprachnachricht, will autonome Blöcke ohne
Rückfragen, aber **ehrliche Fehlermeldungen** — und Messwerte statt
Behauptungen („nachgemessen: 24/57"), keine Scheingenauigkeit.
