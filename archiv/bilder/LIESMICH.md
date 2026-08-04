# Das Bildarchiv — hier gehören die ORIGINALE hinein

## Warum es diesen Ordner gibt

Bis v0.92 lagen im Repo ausschliesslich **Spielfassungen**: verlustbehaftetes
WebP, auf Anzeigegroesse gerechnet. Gemessen am 4.8.2026:

| Bestand | Dateien | Beispielmass | je Datei |
|---|---|---|---|
| gemalte Figuren | 71 | 224x384 | 19 KB |
| geschnitzte Figuren | 114 | 640x800 | 59 KB |
| Turnierfiguren | 12 | 800x800 | 104 KB |

Die Originale, aus denen sie entstanden sind, existieren **nicht mehr**. Sie
lagen im Arbeitsverzeichnis der jeweiligen Sitzung, und das wird zwischen den
Sitzungen neu aufgesetzt. Was nicht im Repo liegt, ist fort. Die
Git-Historie hilft nur bedingt: dort stehen frühere Fassungen derselben
komprimierten Dateien, keine Originale.

## Die Regel ab jetzt

**Jedes erzeugte Bild kommt zuerst hierher — unverändert, in voller
Auflösung.** Erst daraus wird die Spielfassung gerechnet. Nie umgekehrt.

Dieser Ordner wird **nicht** ins Spielbündel eingebunden. Wie beim
Musikarchiv legt `tools/baue-schaukammer.mjs` ihn neben das Spiel; das
Bündel bleibt klein.

## Ablage

```
archiv/bilder/kapitel/     die zwölf Kapitel-Landschaften (16:9, Original)
archiv/bilder/ausruestung/ Mauer, Zaun, Falle, Graben (je Zustand)
archiv/bilder/figuren/     Figuren, sobald neue entstehen
```

## Spielfassung erzeugen

Kapitelbilder: **1920 px breit**, WebP Qualität 85 — rund 300–500 KB. Das
reicht für jeden Bildschirm bei doppelter Pixeldichte; der Kapitelrahmen ist
am Telefon rund 370 px breit, am Schreibtisch bis etwa 1000.
