# Komponenten (Ist nach DS1 — GG-Namensschema per Kommentar gemappt, Dateien bleiben)
- Grundgerüst: App-Shell (Kopfleiste Glas, main, Dock; immersive ohne Dock im Match) = GGScreenShell/GGGameplayShell.
- Panels: `Panel` + `PANEL_WASH`/`RIFT_WASH` (standard/rift), `GildedFrame` (hero/reward), Pergament-Panel der Kampagne (mapContext).
- Buttons: `Button` primary/subtle/ghost/danger/rift (Zustände: default/disabled einheitlich, Fokus violett, minHeight T.touch), `GoldShineButton` (der EINE Primär-CTA, Sheen nur aktiv).
- Auswahl: `Segmented` (Tabs/Choice, violett, umbrechend, aria-pressed), `MapChip` (SelectionCard mit Brettmuster, violett), Zustände locked via disOpacity.
- Anzeigen: `Bar` (T.mo.fill), `Chip` (Status inkl. warn/info), `Stat`, `Shields`, Dock-Badge, ForceBadge (HUD).
- Effekte: `useShineDelay` (gestaffelte Slots), `goldText`, `GoldRule`, `Diamond`, Funkenkontur, Medaillon-Ring (Schatzkammer).
- Galerie: `GalerieScreen` (?galerie) zeigt alle obigen Zustände inkl. langer deutscher Texte, disabled, selected.
