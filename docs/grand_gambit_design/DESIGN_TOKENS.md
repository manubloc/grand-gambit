# Design-Tokens (Quelle: `src/app/ui/theme.js`, Objekt `T`)

Architektur: EIN mutierbares Tokenobjekt, zwei Livreen (CLASSIC/CARVED), `setDesign()` tauscht in place. Komponenten lesen `T.*` zur Renderzeit — kein Bauteil kennt zwei Designs. Diese Architektur bleibt; DS 1.0 ergänzt Semantik statt sie zu ersetzen.

## Flächen
`bg` (Canvas, schwarz) · `bg2` (vertieft) · `panel` / `panel2` (Tafeln; carved mit Alpha e8 → Kontraste werden gegen die GEMISCHTE Farbe gerechnet, test_kontrast.mjs) · `line` (Standardkontur) · `glass`/`glassBlur` (schwebende Chrome).

## Stimmen
- **Gold = Handlung, Wert, Marke:** `gold`, `goldBright`, `lime`/`limeDim` (Spieler-Akzent), `limeInk` (Schrift auf Gold). Regel: pro sichtbarem Bereich EIN dominanter Gold-CTA.
- **Violett = Auswahl, Fokus, Magie:** `rift`, `riftDeep`, `riftLine`, `riftBright`, `riftInk`, `riftGlow` — und NEU `sel`/`selLine`/`selInk`/`selGlow` als die eine Quelle für jeden gewählten Zustand (Segmented, MapChip, Reiter, Karten).
- **Status:** `danger`, `green`, NEU `warn`, `info`.
- **Text:** `text` / `dim` / `faint` — alle ≥4,5:1 auf ihren echten Flächen, maschinell erzwungen (test_kontrast.mjs, Suite 19). classic-`faint` wurde dafür von 3,51:1 auf 4,61:1 gehoben (gleicher Ton, +18 %).

## Maße
`radiusSm` 10 (Controls) · `radius` 14 (Karten) · NEU `radiusLg` 20 (Hero/Dock) · NEU `touch` 44 (Mindesthöhe interaktiv) · NEU `SPACING` = 4·8·12·16·20·24·32·40·48·64 (benannter Export; neuer Code greift Sprossen, Bestandscode wird beim Anfassen migriert).

## Verhalten
NEU `disOpacity` 0.45 — deaktiviert heißt: gedimmt, kein Glow, kein Glanzlauf. NEU `T.mo` Motion-Tokens (siehe MOTION_SYSTEM.md).

## Pergament-Ausnahme
Die helle Kampagnenkarte (mapSurface ≈ #e6dec8, Text #393327, 9,9:1) bleibt als bewusster Kontext erhalten und ist in der Kontrastsuite mitverdrahtet.
