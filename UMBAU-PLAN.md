# Umbau-Plan v0.3 (vom Nutzer beauftragt, Umsetzung im nächsten Arbeitsblock)

## A) Map-Immersion (zuerst, danach Deploy) — ✅ UMGESETZT (v0.3.0)
Umsetzung: Shell lockt in Kampagnen-Ansicht auf 100dvh (App.jsx `immersive`),
Karte = Cover-Fit-Viewport ohne Seiten-Scroll; Zurück-Pille/Liga-Abzeichen/Zoom
schweben oben; Medaillons 46→32 px, Wanderer 34×36→48×50; Node-Detail als
Pergament-Panel in Viewport-Koordinaten am Node verankert (gleitet mit Kamera/
Zoom, ✕ zum Einklappen); Meer-Sperre als zentriertes Overlay. 228 Tests grün.
Referenzbild lag bei Umsetzung nicht vor — Feintuning (Offsets/Look) nach
Sichtung gern nachziehen.
1. Kampagne füllt den Screen: kein Seiten-Scroll mehr um die Karte herum —
   Karte = fester Viewport (100dvh minus Kopfleiste), UI-Elemente schweben darüber.
2. Stations-Medaillons ~30% kleiner; Grand-Gambit-Wanderfigur ~40% größer
   (er ist der Held, nicht die Felder).
3. Level-/Node-Detail NICHT als Karte unterhalb, sondern eingebettetes Panel
   IN der Map (Pergament-Overlay nahe dem Node, Ankunft = Teil der Welt).
4. Nutzer liefert Referenzbild — vor Umsetzung ansehen.

## B) Gefolge → 3 Reiter
Aufstellung (Brett+Heldenposition) · Ausrüstung (Shop) · Charaktere (Level+Fähigkeiten).
Kein Endlos-Scroll mehr.

## C) Währungs-SVGs + zentrale Ressourcen-Leiste
Eigene gezeichnete Icons (assets/icons, Muster wie Items): gold (Münze mit ♟-Prägung),
skillpunkt (Stern/Siegel), xp (aufsteigender Funke). Überall wo gekauft wird:
fixe Leiste oben mit aktuellen Beständen; jeder Preis mit Icon.

## D) Schwierigkeitsgrad beim ersten Start
Wahl Leicht/Mittel/Schwer im Willkommens-Flow, jederzeit im Profil änderbar.
Elo-Anzeige als ehrliche RANGE (kalibriert über klassische Partien):
Leicht ≈ 600–900 · Mittel ≈ 1000–1300 · Schwer ≈ 1400–1700.
Technik: KI-Stufen (Suchtiefe/Fehlerrate) an diese Bänder koppeln; Offline-
Performance-Rating aus Ergebnissen gegen bekannte KI-Stärke ableitbar.

## E) Konten & Online (eigener Block danach)
- Identität = E-MAIL (unique, daran hängt alles). Login: Google OAuth + E-Mail
  (Magic Link). Empfehlung: Supabase Auth (EU-Region, AVV, kostenlos) statt
  Eigenbau — kompatibel mit Play-Store-Login später.
- Nickname/Gamertag = öffentlich, unique, NACHTRÄGLICH änderbar, per Würfel
  generierbar aus Schach-Wortlisten (z. B. "EiserneDame", "NebelLaeufer42");
  Kollisionsprüfung serverseitig; bei E-Mail-Registrierung automatisch zugewiesen.
- Freundescode bleibt zusätzlich; Suche über Nickname.
- Bestehende id/secret-Gastprofile: "Konto verknüpfen"-Migration.
- Datenschutz: weiterhin KEINE Cookies nötig (Token in localStorage) → kein
  Cookie-Banner; privacy.html um Auth-Abschnitt (Supabase als Auftrags-
  verarbeiter, Art. 28) erweitern, Online-Consent-Text anpassen.
