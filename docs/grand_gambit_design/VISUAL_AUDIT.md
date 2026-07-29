# Visuelles Audit — alles gemessen, nichts geschätzt
(Bildansicht der Sitzung war ausgefallen; jede Zahl stammt aus DOM-Messung, PIL-Analyse oder den Messwerkzeugen. Fotos: screenshots/before|after|comparisons.)

| Befund | Vorher | Nachher | Werkzeug |
|---|---|---|---|
| Lücke Kopfleiste → erste Hub-Karte | 67 px | **22 px** | messe-lage |
| Glanzläufe gleichzeitig im Hub | 3 | **1** (Kampagne) | messe-lage |
| Totes Band Gegnerzeile → Brett | 160 px | **2 px** | messe-lage |
| Brettseite (390er Viewport) | 366 px | **376 px** | messe-lage |
| Auswahlflächen in Gold (Schnelles Spiel) | 4 gleichzeitig | **0** (Auswahl violett, CTA gold) | Code + Foto 04 |
| Abgeschnittene Optionsnamen | möglich (nowrap) | **umbrechend** | primitives |
| Schatzkammer-Hero | 200 px | **175 px** | /tmp/messe-schatz |
| Ruhmestat-Platte (zu) | 90 px | **84 px** | /tmp/messe-schatz |
| Platten mit Dauer-Goldglow ohne Belohnung | 14 | **0** | /tmp/messe-schatz |
| Sichtbare Ruhmestaten (844 px hoch) | 6 | **7** | /tmp/messe-schatz |
| Hofstaat-Vorrede | dauerhaft ~4 Zeilen | **2 Zeilen + „Mehr"** | Code |
| Kontrast aller Textrollen | 1 Verstoß (classic faint 3,51:1) | **30/30 ≥ Soll** | test_kontrast (Suite 19) |
| Hub-Überlappungen | 0 | **0** | messe-hub |
| Bedienelemente/Karten/Klassiksatz/Boot/Fahrt | sauber | **sauber** | messe-knoepfe, messe_karten, pruefe-klassiksatz, test_boot, drive3 |

Unverändert konform (geprüft, nicht angefasst): Dock-Aktivzustand (violette Fläche + Goldzeichen, §18), Pergament-Panel der Kampagne (9,9:1 in der Kontrastsuite), Login-Struktur (§19.1), Figuren/Wappen/Karten-Assets.
