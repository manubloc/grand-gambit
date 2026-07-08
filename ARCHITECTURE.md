# GAMBIT — Architektur

Ziel dieser Struktur: ein **deterministischer Spielkern**, der von UI, Plattform und
Metaspiel sauber getrennt ist — damit dieselbe Engine später PvP, Replays, Mobile-Apps
und Anti-Cheat trägt, ohne neu geschrieben zu werden.

Das ist das gängige Muster moderner rundenbasierter Spiele: *simulation core* +
*ports & adapters* + *command/event sourcing*.

---

## Schichten & Abhängigkeitsrichtung

```
            ┌─────────────────────────────────────────────┐
            │  app/        React-UI, Screens, Verdrahtung  │  ← darf alles unten nutzen
            └───────────────┬───────────────┬─────────────┘
                            │               │
              ┌─────────────▼───┐   ┌───────▼──────────┐
              │ meta/  RPG/Profil│   │ ai/  Gegner      │
              └─────────┬────────┘   └───────┬──────────┘
                        │                    │
              ┌─────────▼────────┐           │
              │ content/  Daten  │           │
              └─────────┬────────┘           │
                        │                    │
                   ┌────▼────────────────────▼────┐
                   │  core/   deterministischer    │  ← hängt von NICHTS ab
                   │          Spielkern            │
                   └───────────────┬───────────────┘
                                   │ definiert Ports (Interfaces)
                   ┌───────────────▼───────────────┐
                   │ platform/  Web-Adapter         │  ← implementiert die Ports
                   │   storage · crypto · rng       │
                   └───────────────────────────────┘
```

**Eiserne Regel:** Pfeile zeigen immer nach innen. `core/` importiert **nichts** aus
anderen Schichten. `platform/` implementiert nur die von `core/` definierten Ports.
`app/` ist die einzige Schicht, die alles verkabelt (Adapter rein, UI raus).

Jede Schicht wird **ausschließlich über ihr `index.js`-Barrel** angesprochen — das
Barrel ist der Vertrag, alles dahinter ist frei refactorbar.

---

## Die Schichten im Einzelnen

### `core/` — der deterministische Kern (hängt von nichts ab)
Das Herz. Reine Funktionen, keine Seiteneffekte, kein React, kein `Date.now()`, kein
`Math.random()` (Zufall kommt über einen Port herein). Gleicher Input → gleicher Output,
immer. Das ist die Voraussetzung für Netcode, Replays und Verifikation.

- `domain/` — Geometrie (10×10), Figurenarten, Brett, Startaufstellung, Werte.
- `rules/` — Zuggenerierung (`moves.js`) und Schach-/Angriffserkennung (`attacks.js`).
- `sim/` — die Simulation:
  - `state.js` · `createGame(whiteArmy, blackArmy, seed)` → Startzustand inkl. `log` & `seed`.
  - `transitions.js` · `applyMove`, `legalMoves`, `status`, `undo`, `cloneState`.
  - `commands.js` · `moveCommand`, `resignCommand` — **Absichten** (was der Spieler will).
  - `events.js` · `Ev.*` — **Fakten** (was passiert ist: captured, shieldAbsorbed, …).
  - `reducer.js` · `reduce(state, command) → { state, events }` — **die zentrale API.**
- `ports/` — `rng.js`: austauschbarer Zufallsgenerator (`mulberry32` = deterministisch bei Seed).
- `serialization/` — `codec.js` (Snapshot encode/decode) & `replay.js` (Befehlsliste → Endzustand).

### `content/` — Spieldaten (Designer-Schicht)
Reine Daten: Charaktere, Fähigkeiten, Schwierigkeitsgrade. Eine neue Figur ist hier ein
Daten-Eintrag — **kein** Engine-Umbau. (Nur eine völlig neue Bewegungsart braucht
zusätzlich einen Handler in `core/rules/moves.js`.)

### `ai/` — Gegner (hängt nur von `core/` ab)
Negamax + Alpha-Beta über `core`-Funktionen. `chooseMove(state, depth, rng)` liefert
einen Zug; die App verpackt ihn als Command. Der Zufall ist auch hier injizierbar.

### `meta/` — das RPG-Drumherum (hängt von `core/` + `content/` ab)
Profil, XP-Kurven, Level, Freischaltungen, Erfolge, Belohnungen. Besonders:
`session.js` ist **event-sourced** — die Match-Zusammenfassung wird aus dem `log` per
`summarizeMatch(...)` neu abgespielt statt aus dem UI-State zusammengeklaubt. Dadurch
ist sie reproduzierbar und StrictMode-fest (kein Doppelzählen).

### `platform/` — Adapter (die „getriebene" Seite der Ports)
Web-Implementierungen von `storage`, `crypto` (PIN-Hash), `rng`. Ein Native- oder
Server-Build liefert hier eigene Versionen — **alle Schichten darüber bleiben gleich.**
`storage.web.js` nutzt localStorage und, falls konfiguriert, Supabase; ohne gesetzte
Env-Variablen läuft alles rein lokal und offline.

### `app/` — UI & Verdrahtung
React-Screens (Spielen/Armee/Erfolge/Profil), i18n (DE/EN), Theme. Die **einzige**
Schicht, die Adapter mit dem Kern verbindet. Spielzüge laufen über `reduce()`.

---

## Der zentrale Datenfluss: Command → State + Events

Statt den Zustand direkt zu mutieren, schickt die UI **Commands** in den Reducer und
bekommt **neuen Zustand + Events** zurück:

```js
import { reduce, moveCommand } from "../core/index.js";

const { state: next, events } = reduce(state, moveCommand(move));
// events z.B.: [ moved, captured{byKind,kind,at}, shieldAbsorbed{...}, check, gameOver{...} ]
```

Warum dieses Muster (und nicht „einfach den State ändern")?

- **Replays & Speichern:** ein Spiel = Startzustand + Befehlsliste. `replay()` rekonstruiert
  jeden Moment exakt. (Save-Games, „Zug zurück", Match-History.)
- **PvP/Netcode:** über das Netz wandern winzige Commands, nicht der ganze Zustand. Beide
  Seiten rechnen deterministisch dasselbe Ergebnis → wenig Bandbreite, leicht verifizierbar.
- **Anti-Cheat:** der Server spielt die Command-Liste nach und prüft das Ergebnis.
- **Meta ohne Brüche:** XP/Erfolge entstehen aus den Events, nicht aus UI-Zuständen.
- **Analytics/Telemetrie:** Events sind ein natürlicher Logging-Strom.

---

## Konventionen

**Relative Imports + Barrels, keine Pfad-Aliase.** Outer-Layer importieren nur das
`index.js` der inneren Schicht (z.B. `import { reduce } from "../core/index.js"`). Das
läuft identisch in Node-Tests *und* im Vite-Build ohne jede Konfiguration und ist
extraktionsfertig: jeder Top-Level-Ordner kann 1:1 zu einem npm-Workspace-Paket werden,
ohne dass ein einziger Import bricht.

**Brettgröße als Konstante.** `FILES`/`RANKS` (10) liegen in `core/domain/constants.js`.
Geometrie wird daraus berechnet, nirgends „10" hartkodiert — andere Formate später ohne
Engine-Operation am offenen Herzen.

---

## Tests

Drei Node-Suites, ohne Build/Browser lauffähig (`npm test`):

- `test_core.mjs` — Kern inkl. Reducer, Events, Replay-Reproduzierbarkeit (17).
- `test_engine.mjs` — Regeln: Matt, Schild-Mechanik, Fähigkeiten (14).
- `test_progression.mjs` — Meta: KI-Armeen, XP, Erfolge (11).

---

## Builds

- `npm run dev` — Entwicklung.
- `npm run build` → `dist/` — normaler Web-/PWA-Build fürs Hosting.
- `npm run build:single` → `dist-single/index.html` — **eine** autarke HTML-Datei
  (alles inline, keine externen Dateien) zum direkten Antippen auf dem Handy.

---

## Roadmap (vom Fundament aus)

1. **Echte Pakete:** die sechs Ordner als npm-Workspaces (`@gambit/core`, `@gambit/content`,
   …). Rein mechanisch — die Barrels und relativen Imports sind schon dafür ausgelegt.
2. **PvP:** Deck-Building → Matchmaking. Über das Netz laufen Commands; `replay()` +
   deterministischer Kern liefern die Verifikation. `platform/storage` ist für Supabase
   (Shared-Daten) vorbereitet.
3. **Native:** Expo/React Native oder Capacitor. Nur `app/` + neue `platform/`-Adapter —
   `core`, `content`, `ai`, `meta` bleiben unangetastet.
4. **Regel-Vervollständigung:** Rochade, En-Passant, Umwandlungs-Wahl (aktuell Auto-Dame)
   — neue Handler/Commands im Kern, vom Rest entkoppelt.
