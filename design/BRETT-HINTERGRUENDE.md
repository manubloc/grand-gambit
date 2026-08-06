# Brett-Hintergründe — Prompts (Fassung 3)

Zwölf Gemälde, die hinter dem Schachbrett liegen. Überarbeitet nach drei
Einwänden des Besitzers: **Auflösung**, **Stilfrage**, **Farbwelt**. Alle drei
sind hier zuerst beantwortet, weil sie die Prompts verändern.

---

## 1. Der Stilbefund — Öl bleibt, und warum

Die drei Bildwelten des Spiels nebeneinandergelegt und angesehen:

| Bildwelt | Stil | Funktion |
|---|---|---|
| **Weltkarte** | kolorierte **Tuschezeichnung auf Pergament** | man **liest** sie |
| **Kapitelkarten** (`kap-01…12`) | **Miniatur-Diorama**, isometrisch, taghell | man **bewegt sich darauf** |
| **Kapitel-Landschaften** (`public/kapitel/`) | **Ölgemälde**, romantisch | man **schaut hinein** |

Der Einwand stimmt für Weltkarte und Kapitelkarten — die sind kein Öl. Aber
das Referenzbild ist es: der Kornmark-Schirm ist `02-kornmark.webp`, dasselbe
Ölgemälde wie im Kapitel-Einstieg.

**Empfehlung: bei Öl bleiben.** Öl hat weiche Kanten und ruhige Flächen; ein
Diorama hat scharfe Objektkanten, gebaute Häuser und harte Schlagschatten —
die kämpfen mit den Figuren um dieselbe Aufmerksamkeit. Und die drei Stile
widersprechen sich nicht, sie ordnen: **Pergament = Übersicht, Diorama = Weg,
Öl = Ort.**

---

## 2. Die Auflösung — 3840 geht nicht direkt

**GPT-Image kann 3840 px nicht.** Das Modell liefert genau drei Formate:
1024×1024, 1536×1024 (quer) und **1024×1536 (hoch)**. Die Grenze sitzt im
Modell, nicht in der Schnittstelle.

Der Weg zu großen Bildern:

1. **Erzeugen** in 1024×1536.
2. **Hochrechnen** mit einem Upscaler auf fal, ×2 → 2048×3072, ×3 →
   3072×4608. Bei Öl macht ein guter Upscaler das Bild eher besser:
   Pinselstrich und Wolkenkorn werden feiner, nicht matschig.

Ein 412-px-Telefon mit dreifacher Pixeldichte zeigt 1236 echte Pixel. 1024
wäre knapp, **2048 sitzt bequem**, 3072 ist Reserve. Jede Verdopplung kostet
Ladezeit im Vorlader — bei zwölf Bildern summiert sich das.

| Ablage | `public/brett/01-kronland.webp` … `12-meer.webp` |
|---|---|
| Erzeugen | 1024×1536 (Maximum des Modells) |
| Liefern | 2048×3072, WebP Qualität 78–82, Ziel unter 600 KB je Bild |

---

## 3. Zwölfmal Sonnenuntergang? — gemessen, nicht geraten

Der Besitzer fragte, ob die immer gleiche Dämmerung nicht eine eintönige
Farbwelt ergibt. Die Antwort steckt in seinen eigenen zwölf Kapitelgemälden;
hier durchgemessen (Helligkeit und Sättigung 0–1, Farbton der helleren
Bildhälfte):

| Kapitel | Hell | Sätt. | Farbton | |
|---|---|---|---|---|
| Kronland | 0.40 | 0.27 | 46° | warm |
| Kornmark | 0.36 | 0.51 | 34° | warm |
| Eichwald | 0.26 | 0.54 | 32° | warm |
| Krummholz | 0.29 | 0.21 | 35° | warm |
| **Grauwacht** | 0.23 | 0.27 | **220°** | **kühl** |
| Wolkenjoch | 0.37 | 0.25 | 39° | warm |
| Sattelweite | 0.36 | 0.39 | 37° | warm |
| Aschgrund | 0.44 | 0.66 | 24° | warm |
| Wunde | 0.24 | 0.40 | 27° | warm |
| **Sonnenschlund** | **0.71** | 0.64 | 39° | warm |
| Küste | 0.41 | 0.39 | 36° | warm |
| **Meer** | 0.20 | 0.64 | **231°** | **kühl** |

**Der Verdacht stimmt: zehn von zwölf liegen im selben schmalen Warmband
zwischen 24° und 46°.** Das ist Goldstunde, zehnmal hintereinander.

Aber die Tabelle zeigt auch, dass die beiden Ausreißer **tragen**: Grauwacht
und Meer stehen kühl bei 220–231° und wirken nicht fremd, sondern wie andere
Länder. Genau das soll eine Reise leisten.

**Der Widerspruch zum Vorschlag „weniger Dämmerung":** Nicht die Dunkelheit
lockern, sondern die **Lichtquelle** wechseln. Was das Brett lesbar hält, ist
nicht die Tageszeit, sondern der **Wert** — dunkle Ränder, ruhige Mitte,
mittlere Helligkeit **zwischen 0.22 und 0.40**. Die Farbe darf innerhalb
dieses Bandes wandern, so weit sie will: Mondlicht, Nebelmorgen,
Gewitterlicht und Sternennacht sind alle dunkel genug, ohne golden zu sein.

Ein Wert fällt auf: **Sonnenschlund steht bei 0.71** — fast doppelt so hell
wie der Rest. Als Kapitel-Einstieg großartig (die Wüste *soll* blenden), als
Brett-Hintergrund wäre es der einzige Schirm, auf dem die Figuren kämpfen
müssten. Der Prompt unten drosselt ihn deshalb auf die späte Stunde.

Ergebnis: **Jedes Kapitel trägt seine eigene Lichtsituation.** Vier bleiben
in der Goldstunde (dort gehört sie hin), acht bekommen ein anderes Licht.

---

## 4. Der gemeinsame Stilkopf

Steht **vor jedem** der zwölf Prompts. Er schreibt die Helligkeit vor, nicht
die Farbe:

```
Romantic oil painting landscape in the manner of Turner and the Hudson River
School, painted for a fantasy chess game. Vertical composition, 2:3.

COMPOSITION IS CRITICAL:
- The upper third carries the sky and the distant horizon.
- The middle of the canvas is deliberately EMPTY and calm: open ground,
  water or haze, no detail, no focal point, gently darkened. A chess board
  will be placed over this area — nothing may compete with it.
- The lower third holds near foreground elements rising from the bottom
  corners on BOTH sides, framing the empty middle like curtains.
- All four edges fall away into deep shadow; strong vignette.

VALUE, NOT COLOUR, IS THE CONSTANT: overall a DARK painting, mid-tone around
25-40% brightness, so bright figures read clearly against it. Deep shadows,
restrained highlights, nothing glaring. The HUE is free and belongs to the
land — do NOT default to golden sunset.

Muted and aged, like varnish over old oil. Adult and dignified — never
bright, never cartoon, never oversaturated.

Painterly visible brushwork, soft edges, atmospheric depth. No people, no
animals, no chess pieces, no buildings in the centre, no text, no lettering,
no border, no frame, no watermark.
```

---

## 5. Die zwölf Kapitel — je ein eigenes Licht

### I — Kronland · `01-kronland` — *Goldstunde*
Der Heimat gehört das warme Licht; es ist das einzige Kapitel, dessen Abend
noch friedlich aussieht.
```
The royal homeland at dusk: rolling meadows and hedgerows under a bruised
golden sky, a distant castle silhouette small on the far horizon, its towers
catching the last light. Foreground: tall dry thistles and a broken fence
post rising from the lower corners. Prosperous land, already uneasy — the
evening before everything changed.
```

### II — Kornmark · `02-kornmark` — *Gewitterlicht* (die Vorlage)
```
An endless wheat field under a towering golden storm sky, the sun burning
low and orange behind heavy cloud. The crop stands high and unharvested.
Foreground: heavy ears of wheat and seed heads rising from both bottom
corners, dark against the light. Warm, oppressive, abandoned.
```

### III — Eichwald · `03-eichwald` — *Nebelmorgen, grün-grau*
Kein Gold: unter dem Blätterdach kommt das Licht kalt und diffus an.
```
An ancient oak forest at first light, older than the kingdom. Massive
gnarled trunks stand left and right at the edges; between them a clearing
filled with cold blue-grey mist that will not lift. Pale diffuse daylight
filtering down, no direct sun. Foreground: fern fronds and wet fallen
leaves. Deep forest green, moss, slate and umber — cool, damp, silent.
```

### IV — Krummholz · `04-krummholz` — *Wolkenverhangener Tag, entsättigt*
```
The treeline where the wind forbids standing upright: stunted pines bent
permanently in one direction, clinging to rock, under a flat overcast sky.
Beyond them an open pale slope fading into cloud. Foreground: wind-twisted
branches and alpine grass leaning hard to one side from both corners.
Desaturated greys, olive and bone, one cold silver band of light on the
horizon. Thin air, no warmth anywhere.
```

### V — Grauwacht · `05-grauwacht` — *Blaue Stunde im Schnee*
```
A cold stone pass in deep winter after sundown: snow lying deep blue in the
shadows, the last cold light on the upper rocks. Grey cliff walls rise on
both sides; between them the pass opens into pale empty distance.
Foreground: snow-laden rock and frozen scrub. A single line of footprints,
already half filled in, leads away — no figure anywhere. Blue, slate and
white, almost monochrome.
```

### VI — Wolkenjoch · `06-wolkenjoch` — *Über der Wolkendecke, Mondlicht*
```
High above the cloud layer at night: a sea of cloud lit silver from above by
a low moon, sharp dark ridges and notches breaking through it like islands.
The middle of the canvas is open cloud, calm and luminous. Foreground: bare
wet rock and a frayed climbing rope over an edge, both bottom corners.
Silver, indigo and deep grey. Vertiginous, immense, thin air.
```

### VII — Sattelweite · `07-sattelweite` — *Goldstunde, aber flach*
Der Steppe steht das warme Licht — nur das Land ist fast leer.
```
The open steppe under an enormous sky — nine tenths sky, one tenth land.
Wind-combed grass runs to a flat far horizon lit by a low burning sun.
Foreground: tall dry steppe grass and a leaning tournament lance driven
into the ground, both bottom corners. Vast, golden, and very empty.
```

### VIII — Aschgrund · `08-aschgrund` — *Später Nachmittag, rostrot*
**Berichtigt:** Der Aschgrund ist **kein graues Aschefeld**, sondern eine
**rote Felsschlucht** — der Name täuscht, das Kartenbild heißt nicht ohne
Grund `liga-canyon`. Das Kapitelgemälde ist die Referenz.
```
A vast red rock canyon in the late afternoon: rust-red and ochre cliff walls
falling away in tiers, weathered spires standing in the gorge, a dry river
bed threading the floor far below. Warm sandstone light, deep umber shadows
already filling the gorge. The middle of the canvas is the open gorge, hazy
and calm. Foreground: a broad ledge of cracked red stone reaching in from
both bottom corners, a few dry shrubs. Ochre, rust and iron — no grey, no
ash, no golden sunset.
```

### IX — Die Wunde · `09-wunde` — *Rissviolett als einzige Lichtquelle*
```
Ashen wasteland at the mouth of the rift, at night: bone-pale ground, dead
rivers, nothing growing. The ONLY light source is the rift itself in the far
distance — a vertical tear of violet light on the horizon, breathing, its
glow raking low across the ground. Foreground: weathered bone-white stone
and the top steps of a stair worn smooth, descending out of frame. Violet,
ash-grey and black. Ominous, reverent, quiet.
```

### X — Sonnenschlund · `10-sonnenschlund` — *Nach Sonnenuntergang, gedrosselt*
Die Wüste blendet — als Brett-Hintergrund darf sie das nicht. Deshalb die
Stunde nach dem Untergang statt der Mittagsglut.
```
The great desert in the hour after sunset: dune ridges in deep amber and
long violet shadows, the sky above already darkening to indigo, only a low
band of ember light left on the horizon. The middle is open sand, smooth and
empty, in shadow. Foreground: wind-carved dune crests and a few dry palm
fronds from both corners. Warm below, cold above — dark overall, NOT a
bright desert scene.
```

### XI — Die Küste · `11-kueste` — *Sturmgrau, See-Grün*
Kein Sonnenuntergang: an der Küste enden die Straßen, das Licht ist rau.
```
The last place with names: dark cliffs above a restless sea under a heavy
grey storm sky, a lighthouse standing small and unlit on a far headland.
Cold sea-green water catching a pale break in the cloud. The middle of the
canvas is open water, dark and calm. Foreground: wet black rock, kelp and a
coil of rope on the stones. Slate, sea-green and salt-white — raw, cold, no
golden light.
```

### XII — Endloses Meer · `12-meer` — *Sternennacht auf offener See*
```
The open endless sea at night under a vast clouded sky, faint starlight and
a pale moon-track laid across the black water. No land anywhere. The middle
is open swell, calm and dark. Foreground: heavy waves rising in both bottom
corners, spray caught in the thin light, a single drifting plank. A faint
violet cast in the far cloud — the rift bleeding out. Deep blue-black,
almost monochrome.
```

---

## 6. Ablauf beim Erzeugen

1. **Erst fragen** — Bildläufe kosten Budget. Der Besitzer entscheidet, wie
   viele Kapitel auf einmal laufen.
2. Modell `fal-ai/gpt-image-1/edit-image`, das jeweilige **Kapitelgemälde als
   Referenzbild** mitgeben (das Modell folgt Bildern zuverlässiger als
   Worten) — so erbt der Brett-Hintergrund die Farbwelt seines Kapitels.
3. Format **1024×1536**, danach ×2 hochrechnen.
4. **Nachmessen statt ansehen**, zwei Kennzahlen je Bild:
   - Mittlere Helligkeit **zwischen 0.22 und 0.40** (dasselbe Maß wie in der
     Tabelle oben). Liegt sie darüber, kämpfen die Figuren.
   - Helligkeits-Standardabweichung der Mittelzone (20–78 % Höhe) **deutlich
     unter** der des Gesamtbildes. Sonst ist die Mitte nicht ruhig.
   Reißt eine Kennzahl, wird der Lauf wiederholt — nicht durchgewinkt.
5. Ablegen als `public/brett/NN-name.webp`.
6. Im Spiel unter das Brett legen: unten verankert, oben in Schwarz
   auslaufend — dasselbe Muster wie `RissBoden.jsx`, nur je Kapitel.
