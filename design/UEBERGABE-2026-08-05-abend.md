# Übergabe 5.8.2026 abends — Stand v1.0.9 (live), Play Store im internen Test

Vorige Übergabe + Details: Transkript dieser Sitzung. Kette vor JEDEM Push:
npm test (902/0/21!) → build → build:single → test_boot (3/3) → drive3
(KEINE FEHLER) → Reinraum → push → version.json pollen → Bündel-Marker
(>500 KB prüfen, SPA-Fallback ist ~11 KB; Deploy heute z.T. ~4 min).

## Heute geschafft (v1.0.5→v1.0.9 + Play Store)
- Konto löschen (Gerät+Halle, Worker POST /vergiss, HallCore.forget)
- Namensruf: GameIntro fragt Namen (Pflicht, Würfel, roter Hinweis),
  NamensRuf für Bestandsstände; rollTag → ui/namen.js (Leerzeichen-Fix)
- Datenschutz Stand 5.8. (E-Mail-Trennung, Selbstlöschung, Feedback)
- Install-Banner UND Profil-Install-Weg entfernt (nur noch Google)
- PLAY STORE: App 4972631526998923335, Paket win.grandgambit.app, Konto
  "Constance Interactive" (privat, 8998373364859050324). Interner Test
  "1.0 – Die Eröffnung" LIVE seit 15:19. assetlinks scharf (A5:55:… +
  D1:6C:… aus Play-Console-Snippet), live verifiziert. Store-Eintrag:
  Texte gespeichert (Name/Kurz/Lang); GRAFIKEN fehlen (Manuel lädt hoch:
  outputs-Grafiken + Telefon-Screenshots), dann Fragebögen (Antworten in
  design/PLAYSTORE.md; App-Zugriff braucht Prüfer-Konto von Manuel!)
- Vorstellungsgrafik: Riss-Nacht (Manuels Boden + 7 Helden + 2 Bestien,
  Kartenhauch) in design/playstore-feature-1024x500.png
- v1.0.8: GameIntro lila+reduziert, painted Standard; Liga-Audit KOMPLETT
  (auch src/content/lehren.js+voices.js!); Profil: nur Regler
  ("Soundeffekte"), Regler-Außenkontur weg, Name FEST (nameFixedHint),
  Leicht/Normal/Schwer, "Passwort ändern"-Panel (changePassword, local),
  PIN-Karte heißt "Geräte-Sperre", Konto-Löschen lila; NEU-Pill weg;
  Hub-Kontur 1.5px rgba(178,150,255,.62)
- v1.0.9: Figuren +9% (BoardView pieceFont svg .92/1.09, painted
  1.07/1.26 — gilt Gefecht UND Klassik); Hofstaat-Glyphen 68→76, 94→104,
  Slot 26→29

## Nächste Punkte (Besitzer-Reihenfolge)
2. Weltkarte: Container-Radius = Kapitelkarten-Radius (CampaignScreen
   ~Z.367/402: Math.min(22/24, frameW/12) ist die REFERENZ; Weltkarten-
   Container nutzt anderen Wert — erst lesen, nicht raten). Zurück- und
   Übersichts-Buttons oben auf der Weltkarte in Lila.
3. Hofstaat: kleines SVG-Symbol im Eck der Kacheln UND im Popup weg
   (NICHT die Sperr-Silhouette Z.424) — Screenshot von Manuel erbitten.
4. Simple-Modus: Gambit in "Aufstellung" zeigt painted statt simple;
   alle Kacheln auf Passform prüfen (Figuren ragten raus).
5. Preloader: Logo-Animation (wie Boot-Riss) als vollständiger
   Erstlade-Schirm — ALLES laden vor Spielstart; Ladeanimation überall
   wo es ruckelt.
6. Heldname (profile.name) in Kampagnentexte einweben.
7. Handy-Popup-Umbrüche (v.a. Karte) — vorher tools/pruefe-textfluss.mjs
   reparieren (BLIND seit v0.92, nutzt entfernten Gastzugang).
8. Name als Login: Eindeutigkeit beim Anlegen erzwingen, Login per Name.
Falls +9% Figuren nicht reichen: derselbe Hebel, eine Zeile.

## Manuel (offen)
- GitHub-PAT WIDERRUFEN (steht im Transkript-Kopf) — mehrfach erinnert
- PWABuilder-ZIP sichern (signing.keystore + Passwörter!)
- Store-Grafiken+Screenshots hochladen; Prüfer-Konto nennen
- Tester einladen (Liste "Interne Tester"); bei ~20 → "Hochstufen" in
  geschlossenen Test (14-Tage-Uhr; interne Zeit zählt NICHT)
- 14 "HQ?"-Kandidaten Schaukammer

## Alt-Backlog unverändert
Kapitel-VIII-Bild · Titelbild · Holzfiguren-Satz · Damen-Neuzeichnung ·
Gambit-t1+Kartenfigur · Kapitelkarten (KARTEN-PROMPTS) · Onboarding-
Treppe · HP-Remis 60 · Brett-Hintergrund je Kapitel · ground-Overlays ·
Aura 1 · Admin-Defaultpasswort · "Design klassisch" · Musikzuordnung ·
Kartenerzählung · Verwandlungs-Animation · Schaukammer-Löschen · Sperren
Kauf/Platzieren

## Fallen (Kurzform)
python3-heredoc statt -c; str_replace bei Regex-Text; esbuild alle
Loader + Suitenzahl zählen; jsdom-Sonden im Projektordner; Chrome MCP:
find/ref statt Koordinaten in Formularen, "?" öffnet Shortcuts,
Clipboard unlesbar; Play-Formularfelder sind teils vorbefüllt (ctrl+a).
