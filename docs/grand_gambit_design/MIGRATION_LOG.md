# Migrations-Logbuch

## Checkpoint 1 — Sicherung + Audit
Backup-Branch `backup/pre-design-system-v1-20260729-0724`, Feature-Branch `feature/design-system-v1`, Baseline dokumentiert, 24 Vorher-Fotos + Live-Foto, Asset-Register (368 Assets) generiert.

### Entscheidungen
1. **Kein Push auf main, kein Deploy** — Auftrag §8.3/§29. Cloudflare baut nur main; der Feature-Branch wird gepusht (Sicherung), deployt aber nichts.
2. **Browser-Werkzeug:** Playwright im Sandkasten statt der Chrome-Integration — erreicht grandgambit.win direkt (Live-Baseline liegt bei), liefert deterministische Multi-Viewport-Fotos und blockiert nicht auf eine Desktop-Bestätigung, während der Besitzer mobil ist.
3. **Livree-Gesetz bleibt:** Gestaltungsänderungen zielen auf die aktive CARVED-Livree und gemeinsame Komponenten; der CLASSIC-Tokensatz behält seine Werte (Zusage aus design/UEBERGABE). Semantische Ergänzungen (Auswahl, Status, Motion) bekommen in beiden Livreen sinnvolle Werte.
4. **Figuren, Karten, Wappen, Login-Artwork: unantastbar** (Auftrag §3) — nur Einbettung/Umfeld ändern.
5. **Version bleibt 0.41.2** auf dem Feature-Branch; der Sprung passiert erst beim Merge.
