# Grand Gambit — Übergabe (Stand v0.40.1, 29.07.2026)

Besitzer: fruitcore / Manuel (Deutsch, oft Sprachnachrichten, arbeitet mobil).
Repo `github.com/manubloc/grand-gambit`, lokal `/home/claude/repo`.
Live: `grandgambit.win` — Cloudflare baut bei jedem Push auf **main**, ~2–3 min.
Sprachregel im Spiel: „Kapitel", nicht „Liga".

---

## Zugänge

> **Zugänge stehen NICHT im Repo** — das Verzeichnis ist öffentlich und
> GitHub blockt Pushes mit Geheimnissen (zu Recht). Der Besitzer reicht
> GITHUB_PAT und FAL_KEY im Gespräch nach; die persönliche Fassung dieses
> Dokuments enthält sie.


Push: `git push -q "https://x-access-token:${GITHUB_PAT}@github.com/manubloc/grand-gambit.git" main`
Commit: `git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit`
Admin-Login: `admin` / `gambit-admin` (Passwortwechsel weiterhin offen)
localStorage-Präfix: `gambit:u::` (session:v1, saves:{acc}, save:{acc}:{slot}, daily:v1)

## Die eiserne Prüfkette (vor JEDEM Push auf main)

```
npm test            → Soll: 761 grün, 0 rot, 18 Suiten
npm run build
npm run build:single
node test_boot.mjs                → RESULT: 3 passed
node drive3.mjs                   → == KEINE FEHLER ==
node tools/pruefe-buttons.mjs     → == KNOEPFE SAUBER ==   (läuft auch in npm test)
node tools/messe-knoepfe.mjs      → == BEDIENELEMENTE SAUBER ==
node messe_karten.mjs             → == KARTEN SAUBER ==
node messe_monster.mjs            → == MONSTER IM GLEICHGEWICHT == (2–4 min, NICHT in npm test)
Reinraum: frischer Klon → npm ci → npm test
push → anonymer Depth-1-Klon zur Gegenprobe → Live-Verify über Markerstrings
```

Summenprüfung:
`npm test 2>&1 | grep "^RESULT" | awk -F'[ ,]+' '{p+=$2;f+=$4} END {print p,f,NR}'`

**Live-Verify immer über Markerstrings** im ausgelieferten Bundle, nie über
Hashvergleich (Cloudflare-Hashes weichen vom lokalen Build ab). Rechtstexte
liegen hinter einer Umleitung: `curl -sL .../privacy.html` → `/privacy`.

---

## Was in dieser Sitzung entstand (v0.38.0 → v0.40.1)

- **v0.38.x** Monster-Gaben: alle 25 Bestien tragen Familien-Fähigkeiten,
  balanciert über `messe_monster.mjs`; Osric ans Ende der Kapitelfolge
  (war fälschlich Kapitel-I-Finale); Monster stufbar (5 Ränge, überproportional
  teuer), mit Geschichte, Werten, Lupe und Rangleiter im Popup.
- **v0.39.x** Weltkarte 16:9 eingebaut, Licht-Radien statt Trennband;
  Kartenfehler (Panel verdeckt Knöpfe, Wanderer verschwindet); Rechtstexte und
  Landingpage aktualisiert; Gast fängt wirklich bei null an; Halle verbindet
  beim Start (nur mit Einwilligung + abschaltbar); Segmented-Schalter waren tot
  (o.id statt o.value); Figuren aufgehellt, Kontur statt Nebel.
- **v0.40.0** Klassischer Figurensatz (creme/anthrazit) + Soundtrack als
  Endlosschleife, abschaltbar unter Profil.
- **v0.40.1** Weltkarte als Vollbild (lag im Kartenrahmen gefangen), Dunkel
  deckt voll, Schwadenschichten entfernt (Performance), Siegel nur im Licht.

---

## OFFENE PUNKTE (vom Besitzer benannt, noch nicht erledigt)

**1. Die drei Icons im Hauptmenü neu zeichnen**
Kampagne, Schnelles Spiel, Online-Duell — freigestellt, im Siegel-Stil der
Schatzkammer (nicht detailreich-gemalt), etwas prägnantere Farben.
Achtung: Der Besitzer wollte NICHT die Wappen der Übersichtskarten ersetzt
haben, sondern die blaue Bubble auf dem **„Partie starten"-Knopf**.

**2. Die Kampagne-Karte im Hauptmenü umbauen**
- „Fortsetzen" ist falsch, wenn noch nie gespielt → „Neue Kampagne starten"
- Fortschrittsbalken läuft unter dem Icon durch, Schriften überlappen
- Kampagne soll mehr Raum bekommen
- Online-Karte soll aktive Fernpartien direkt anklickbar zeigen (Abkürzung
  existiert bereits im Hub, aber nicht in der Karte selbst)

**3. Der Händler in der Ausrüstung** (Hofstaat → Reiter „gear")
- Anderer Name als „Corvo" (Krämer, Höker, Marketender …)
- Bild im **geschnitzten** Stil, freigestellt, mit kleinem Stand dahinter
  (aktuell: `src/app/ui/assets/painted/painted-haendler.webp`, gemalt)
- Waren als Kacheln mit violett leuchtender Kontur; neue Waren mit der
  animierten Funkenkontur (`gg-funkenkontur` liegt in `theme.js` bereit)

**4. Anthrazit-Satz der klassischen Figuren prüfen**
Ist aus den Cremedateien abgeleitet (`src/app/ui/assets/klassik/*-dunkel.webp`),
vom Besitzer noch nicht beurteilt.

**5. Rauswurf aus der Online-Ansicht** — vom Besitzer gemeldet, nicht
reproduzierbar gewesen. Braucht genaue Schrittfolge.

**6. Sprachknopf beim Login** — im Browser getestet und funktionsfähig,
Sicherheitsabstand ergänzt; Besitzer meldet ihn weiter als defekt. Nachfragen:
passiert gar nichts, oder wechseln nur Teile der Texte?

**7. Kontakte-Einladung** — bewusst NICHT gebaut. Telefonnummern Dritter an den
Server zu geben ist datenschutzrechtlich heikel; stattdessen gibt es den
Teilen-Knopf für den Freundescode. Braucht anwaltliche Prüfung, falls gewünscht.

**Altlasten:** Monster-Portrait b22, Admin-Passwort in `accounts.js`,
Test-Spielstand 2 löschen, Onboarding-Treppe, erste Aura-Fähigkeit,
HP-Remis-Regel (60 Züge ohne Schaden).

---

## Werkzeuge

| Werkzeug | Zweck |
|---|---|
| `tools/web/stationspruefer.html` | Stationen der 12 Kapitelkarten setzen |
| `tools/web/weltkarten-anker.html` | 12 Weltanker auf der 16:9-Karte setzen |
| `messe_karten.mjs` | Karten, Wanderer, Panel, Nebel, Weltkarte |
| `messe_monster.mjs` | Monster-Balance (KI gegen KI) |
| `tools/messe-knoepfe.mjs` | Bedienelemente zur Laufzeit (`--bilder`, `--halle`) |
| `tools/pruefe-buttons.mjs` | Quelltextregeln (Konturen, Wortmarke, Segmented, mp3-Lader) |

**Bildschmiede:** `fal-ai/gpt-image-1/edit-image` über `/tmp/edit.py`
(Hilfsskript neu anlegen: POST an fal.run mit `prompt`, `image_urls`,
`image_size: "1024x1024"`, `quality: "high"`, `background: "transparent"`).
Referenzbilder vorher zu `rest.alpha.fal.ai/storage/upload/initiate` hochladen.

---

## Hart erkaufte Erkenntnisse

- **Der stille esbuild-Abbruch.** `--log-level=silent` verschluckt Fehler; als
  die MP3 dazukam, fiel die Kette unbemerkt von 18 auf 11 Suiten. Bei
  unerwartet niedriger Suitenzahl: esbuild ohne den Silent-Schalter laufen
  lassen. Ein Wächter prüft den mp3-Lader jetzt.
- **Das Bildmodell hält keine Vergleichsangaben ein.** „Kleiner als die Dame"
  wird ignoriert, weil jede Figur einzeln entsteht. Größen, Sockelbreiten und
  Saumdicken deshalb IMMER rechnerisch nachsetzen, nie erbitten.
- **Bild-zu-Bild braucht die eigene Figur als Eingabe.** Eine fremde
  Stilvorlage überschreibt den Stil, statt ihn zu bewahren.
- **Messwerkzeuge lügen auch.** Zwei Fälle: die Knopfprüfung maß das
  Weltkarten-Overlay statt der Kapitelkarte; die Kartenmessung nahm die neue
  Querkarte als „breitestes Bild" und meldete korrekte Stationen als außerhalb.
  Bei überraschenden Befunden erst das Werkzeug prüfen.
- **`Segmented` liest `o.value`.** Optionen mit `o.id` ergeben tote Schalter.
- **Vollbild-Overlays gehören auf `position: fixed`.** Mit `absolute` landen sie
  im nächsten positionierten Vorfahren (so lag die Weltkarte im Kartenrahmen).
- **Der Screenshot-Trugschluss.** Die App-Hülle ist auf `100dvh / --vhz`
  begrenzt; ein höheres Prüffenster zeigt darunter schwarzen Seitengrund —
  das ist kein fehlender Hintergrund.
- **`view` auf selbst erzeugte Screenshots ist unzuverlässig.** Bildarbeit über
  Messungen (PIL/numpy), nicht über Ansehen. Bilder dem Besitzer IMMER zeigen
  (`present_files`), bevor sie eingebaut werden.
- Playwright: `playwright-core`, `executablePath:
  /opt/pw-browsers/chromium-1194/chrome-linux/chrome`, `args: ["--no-sandbox"]`.
  Messprofil unter `/tmp/messprof.json`.
- Netzaussetzer bei fal.media sind häufig — Downloads mit 3–4 Versuchen und
  Wartezeit umgeben, Antwort auf leeren Text prüfen.
