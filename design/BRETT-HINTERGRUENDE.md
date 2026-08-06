# Brett-Hintergründe — Prompts für alle zwölf Kapitel

Vorlage ist Manuels Kornmark-Schirm: ein Landschaftsgemälde hinter dem Brett,
goldenes Gegenlicht am Horizont, dunkle Ränder, seitlich Halme als Rahmen.
Das Brett steht mittig und quadratisch darauf — der Hintergrund muss ihm die
Mitte freihalten und darf nur oben und unten sprechen.

## Technische Vorgabe

| Punkt | Wert | Warum |
|---|---|---|
| Format | **1024 × 1536** (2:3 hoch) | Das Telefon ist hochkant; die vorhandenen Kapitelbilder in `public/kapitel/` sind 1920×1081 quer und zeigen am Handy nur einen Mittelstreifen. |
| Ablage | `public/brett/01-kronland.webp` … `12-meer.webp` | Wie die Kapitelbilder als Datei daneben, **nicht** ins Bündel: zwölf Bilder wären mehr als das ganze Spiel. |
| Mitte | Zone von 20 % bis 78 % Höhe **ruhig und flächig** | Dort liegt das Brett. Alles Erzählerische gehört darüber und darunter. |
| Ränder | zu allen Seiten dunkel auslaufend | Der Schirm hat keine Ränder; das Bild muss selbst verlöschen. |
| Keine | Menschen, Tiere, Schachfiguren, Schrift, Wappen, Rahmen | Die Figuren stehen davor — der Hintergrund darf nicht mit ihnen konkurrieren. |

Kapitel **VIII (Aschgrund)** fehlt auch als Kapitel-Intro-Bild — der Prompt
unten taugt für beides, quer gerendert für das Intro.

## Der gemeinsame Stilkopf

Dieser Block steht **vor jedem** der zwölf Kapitelprompts:

```
Romantic oil painting landscape in the manner of Turner and the Hudson River
School, painted for a fantasy chess game. Vertical composition, 2:3.

COMPOSITION IS CRITICAL:
- The upper third carries the sky and the distant horizon, lit from behind by
  a low warm sun breaking through heavy cloud.
- The middle of the canvas is deliberately EMPTY and calm: open ground,
  water or haze, no detail, no focal point, gently darkened.
- The lower third holds near foreground elements rising from the bottom
  corners on BOTH sides, framing the empty middle like curtains.
- All four edges fall away into deep shadow; strong vignette.

PALETTE: antique gold and warm amber light against deep umber and near-black.
Muted, aged, like varnish over old oil. Adult and dignified — never bright,
never cartoon, never saturated.

Painterly visible brushwork, atmospheric depth, no people, no animals, no
chess pieces, no text, no lettering, no border, no frame, no watermark.
```

---

## Die zwölf Kapitel

### I — Kronland · `01-kronland`
```
The royal homeland at dusk: rolling meadows and hedgerows under a bruised
golden sky, a distant castle silhouette small on the far horizon, its towers
catching the last light. Foreground: tall dry thistles and a broken fence
post rising from the lower corners. The land looks prosperous and already
uneasy — the evening before everything changed.
```

### II — Kornmark · `02-kornmark` *(die Vorlage)*
```
An endless wheat field under a towering golden storm sky, the sun burning
low and orange behind heavy cloud. The crop stands high and unharvested.
Foreground: heavy ears of wheat and seed heads rising from both bottom
corners, dark against the light. Warm, oppressive, abandoned.
```

### III — Eichwald · `03-eichwald`
```
An ancient oak forest, older than the kingdom. Massive gnarled trunks stand
left and right at the edges; between them a clearing filled with low mist
that will not lift, lit by amber shafts falling through the canopy.
Foreground: fern fronds and fallen amber leaves. Green-gold and umber, the
silence of trees that saw something and never spoke of it.
```

### IV — Krummholz · `04-krummholz`
```
The treeline where the wind forbids standing upright: stunted pines bent
permanently in one direction, clinging to rock. Beyond them an open pale
slope and a cold bright horizon. Foreground: wind-twisted branches and
alpine grass leaning hard to one side from both corners. Thin high air,
gold light gone cool at the edges.
```

### V — Grauwacht · `05-grauwacht`
```
A cold stone pass in deep winter, snow lying blue in the shadows and gold
where the low sun touches it. Grey cliff walls rise on both sides; between
them the pass opens into pale empty distance. Foreground: snow-laden rock
and frozen scrub. A single line of footprints, already half filled in,
leads away — no figure anywhere.
```

### VI — Wolkenjoch · `06-wolkenjoch`
```
High above the cloud layer: a sea of cloud lit gold from above, sharp dark
ridges and notches breaking through it like islands. The middle of the
canvas is open cloud, calm and luminous. Foreground: bare wet rock and a
frayed climbing rope over an edge, both bottom corners. Vertiginous,
immense, thin air.
```

### VII — Sattelweite · `07-sattelweite`
```
The open steppe under an enormous sky — nine tenths sky, one tenth land.
Wind-combed grass runs to a flat far horizon lit by a low burning sun.
Foreground: tall dry steppe grass and a leaning tournament lance driven
into the ground, both bottom corners. Vast, golden, and very empty.
```

### VIII — Aschgrund · `08-aschgrund`

**Berichtigt (Besitzer, 6.8.):** Der Aschgrund ist **kein graues Aschefeld**,
sondern eine **rote Felsschlucht** — rostrote Wände, Ockerboden, warmes
Abendlicht. Der Name taeuscht; das Kartenbild heisst nicht ohne Grund
`liga-canyon`. Meine erste Fassung sagte "ash-grey rock" und haette am Ort
vorbeigemalt. Das Kapitelgemaelde liegt inzwischen vor und ist die Referenz.

```
A vast red rock canyon at golden hour: rust-red and ochre cliff walls
falling away in tiers, weathered spires standing in the gorge, a dry river
bed threading the floor far below. Warm sandstone light, deep umber
shadows. The middle of the canvas is the open gorge, hazy and calm.
Foreground: a broad ledge of cracked red stone reaching in from both bottom
corners, a few dry shrubs. Ochre, rust and gold — no grey, no ash.
```

### IX — Die Wunde · `09-wunde`
```
Ashen wasteland at the mouth of the rift: bone-pale ground, dead rivers,
nothing growing. In the far distance the rift itself stands open — a
vertical tear of violet light on the horizon, breathing. Foreground:
weathered bone-white stone and the top steps of a stair worn smooth,
descending out of frame. Violet and cold gold against near-black. Ominous,
reverent, quiet.
```

### X — Sonnenschlund · `10-sonnenschlund`
```
The great desert at the hour the sun swallows everything: dune ridges in
molten gold and long violet shadows, heat shimmer erasing the far horizon.
The middle is open sand, smooth and empty. Foreground: wind-carved dune
crests and a few dry palm fronds from both corners. Blinding light above,
deep shadow below.
```

### XI — Die Küste · `11-kueste`
```
The last place with names: dark cliffs above a restless sea at sunset, a
lighthouse standing small and unlit on a far headland. The middle of the
canvas is open water catching the gold of the sky. Foreground: wet black
rock, kelp and a coil of rope on the stones. Salt air, the end of the
roads.
```

### XII — Endloses Meer · `12-meer`
```
The open endless sea under a vast storm sky, the sun burning through cloud
low on the horizon and laying a long gold road across the water. No land
anywhere. The middle is open swell, calm and dark. Foreground: heavy waves
rising in both bottom corners, spray caught in the light, a single drifting
plank. A faint violet cast in the far cloud — the rift bleeding out.
```

---

## Erzeugen und einbauen

1. **Erst fragen** — Bildläufe kosten Budget. Manuel entscheidet, wie viele
   Kapitel auf einmal laufen.
2. Modell wie gehabt: `fal-ai/gpt-image-1/edit-image` mit **Manuels
   Kornmark-Schirm als Referenzbild** (zwei bis drei Referenzen halten den
   Stil zusammen; das Modell folgt Bildern zuverlässiger als Worten).
3. Nach dem Lauf: Datei prüfen (`file x.webp`), Mittelzone messen — die
   Standardabweichung der Helligkeit zwischen 20 % und 78 % Höhe muss klein
   sein, sonst kämpft der Hintergrund mit dem Brett.
4. Ablegen als `public/brett/NN-name.webp`, Zuordnung analog `KapitelIntro.jsx`
   (dort steht die Kapitel-zu-Datei-Tabelle schon).
5. Im Spiel unter das Brett legen: unten verankert, oben in Schwarz
   auslaufend — dasselbe Muster wie `RissBoden.jsx`, nur je Kapitel.
