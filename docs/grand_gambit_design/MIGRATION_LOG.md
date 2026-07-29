# Migrations-Logbuch

## Checkpoint 1 — Sicherung + Audit
Backup-Branch `backup/pre-design-system-v1-20260729-0724`, Feature-Branch `feature/design-system-v1`, Baseline dokumentiert, 24 Vorher-Fotos + Live-Foto, Asset-Register (368 Assets) generiert.

### Entscheidungen
1. **Kein Push auf main, kein Deploy** — Auftrag §8.3/§29. Cloudflare baut nur main; der Feature-Branch wird gepusht (Sicherung), deployt aber nichts.
2. **Browser-Werkzeug:** Playwright im Sandkasten statt der Chrome-Integration — erreicht grandgambit.win direkt (Live-Baseline liegt bei), liefert deterministische Multi-Viewport-Fotos und blockiert nicht auf eine Desktop-Bestätigung, während der Besitzer mobil ist.
3. **Livree-Gesetz bleibt:** Gestaltungsänderungen zielen auf die aktive CARVED-Livree und gemeinsame Komponenten; der CLASSIC-Tokensatz behält seine Werte (Zusage aus design/UEBERGABE). Semantische Ergänzungen (Auswahl, Status, Motion) bekommen in beiden Livreen sinnvolle Werte.
4. **Figuren, Karten, Wappen, Login-Artwork: unantastbar** (Auftrag §3) — nur Einbettung/Umfeld ändern.
5. **Version bleibt 0.41.2** auf dem Feature-Branch; der Sprung passiert erst beim Merge.

## Checkpoint 3 — Kernkomponenten + Musterkammer
Segmented und MapChip: Auswahl = Violett (T.sel/selLine/selInk), lange Namen brechen um, Beruehrziele >=36-44 px, aria-pressed. Button: minHeight T.touch, disabled einheitlich (disOpacity, kein Schein). Alle Glanzlaeufe linear (v0.31.1-Lehre). Tastaturfokus sichtbar violett. GalerieScreen (?galerie): 10 Abschnitte, scrollt nachweislich (scrollHeight 1867 / sichtbar 844 / gescrollt 1023), Cinzel+Cormorant laden nachweislich (document.fonts).

### Ehrliche Korrektur
Audit-Irrtum in Checkpoint 2 behoben: IM Fell English war KEINE Attrappe, sondern real via @fontsource gebuendelt. Der Tausch auf Cormorant bleibt (Auftrag §13: schwer lesbare Antiqua darf ersetzt werden); die Fontsource-Importe sind entfernt (keine doppelte Schriftlast). Spectral 700 (Brettzahlen) unangetastet.

### Umgebungsnotiz
Die Bildansicht ist mitten in der Sitzung ausgefallen (bekanntes Muster, Uebergabe §0a). Ab hier werden visuelle Behauptungen ausschliesslich mit Zahlen belegt: DOM-Messungen, PIL-Pixelanalyse, Messwerkzeuge. Keine Geschmacksarbeit an Figuren.
