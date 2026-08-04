# Wo die Daten liegen — Bestandsaufnahme

Stand: 4.8.2026, gemessen (nicht geschätzt): jede Spielfassung wurde per
Bildvergleich gegen die 93 Originale im Archiv geprüft.

## Die drei Orte

| Ort | Was liegt dort | Größe | Kommt ins Spiel? |
|---|---|---|---|
| `src/app/ui/assets/` | **Spielfassungen** — klein, verlustbehaftet | 49 MB | ja, gebündelt (1,75 MB) |
| `archiv/bilder/` | **Bild-Originale**, aus fal.ai gerettet | 138 MB | nein, wird danebengelegt |
| `archiv/musik/` | **36 Musikstücke**, alle je erzeugten | 37 MB | nein, wird danebengelegt |

Alles liegt in GitHub. Repo gepackt: 145 MB — weit unter der Grenze.
Zusätzlich als ZIP für deine lokale Ablage übergeben.

## Was ein Original hat — und was nicht

| Gruppe | Spielfassungen | Original da | **fehlt** |
|---|---|---|---|
| Geschnitzte Figuren | 57 | **24** | 33 |
| Gemalte Figuren | 71 | **21** | 50 |
| Turnierfiguren | 6 | **0** | 6 |
| Ausrüstung | 27 | **2** | 25 |
| Auszeichnungen | 28 | **8** | 20 |
| Bodentexturen | 16 | **1** | 15 |

## Was konkret fehlt

**Der farbige geschnitzte Satz** — Springer, Läufer, Turm, Dame, König.
Nur Bauer und Gambit sind wiedergefunden. Diese Figuren stammen nicht von
fal.ai, sondern von einem anderen Dienst (aimlapi oder ChatGPT).

**Die Turnierfiguren** (klassisches Set, cremeweiß und anthrazit) — kein
einziges Original. *Der Besitzer hat diese noch und reicht sie nach.*

**Die gemalten Portraits** — 50 von 71 ohne Original. Das sind die ältesten
Bilder des Spiels, teils nur noch als 224×384 vorhanden.

**Ausrüstung, Auszeichnungen, Bodentexturen** — fast durchweg ohne Original.

## Wo noch zu suchen wäre

1. **aimlapi** — sobald der Schlüssel vorliegt, dieselbe Suche wie bei
   fal.ai (Ergebnisse liegen auf `s3.aimlapi.com`).
2. **ChatGPT-Verlauf** — dort entstand ein Teil der Figuren; Bilder bleiben
   dort dauerhaft in voller Auflösung.
3. **Ältere Claude-Chats** — die damals per `present_files` übergebenen
   Dateien hängen an den Nachrichten und sind herunterladbar.

## Die Regel ab jetzt

Jedes neue Bild kommt **zuerst unverändert** nach `archiv/bilder/`, erst
daraus wird die Spielfassung gerechnet. Nie umgekehrt.
