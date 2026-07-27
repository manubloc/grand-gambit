# Vier Prompts: Weltkarte · Menülogo · Intro · Hintergrund

Alle vier gehören zur **geschnitzten Livree** (`APP_DESIGN = "carved"`) und
müssen zusammen wirken. Gemeinsame Palette, wörtlich aus `theme.js`:

| Zweck | Farbe |
|---|---|
| Grund (dunkel) | `#151d2c` |
| Tafeln | `#35456a` |
| Linien | `#54679 2` → hell `#7d8fb8` |
| Gold (Akzent) | `#eac96b`, matt `#c9a45c` |
| Pergament/Knochen | `#c0b8a4`, Text `#f6efdf` |

Durchgehende Stilregel aller vier Bilder — **haptische Miniatur, keine
Illustration**: gemeißelter Stein-Ton, feine Werkzeugspuren, matte Oberflächen,
scharfe Kanten, echtes Volumen. Kein Aquarell, kein Concept-Art-Look, kein
Plastik, kein Glanzlack, kein weichgezeichnetes KI-Rendering.

---

# 1 · DIE WELTKARTE — nur die Kacheln, kein Weg

**Format: 2048 × 3072 (2:3, hochkant).** Die alte Karte ist 836 × 1881 und damit
extrem schmal — dieses Verhältnis kriegt kein Generator sauber hin. 2:3 ist der
beste Kompromiss; die Anker im Code setze ich anschließend neu, das kostet nichts.

**Warum kein Weg:** Auf allen bisherigen Versuchen hat der Generator keine
eindeutige Straße gezogen. Die Karte trägt deshalb **nur die zwölf Regionen als
klar getrennte Kacheln**, und der Weg wird nachträglich im Werkzeug
eingezeichnet. Der Prompt verbietet Straßen ausdrücklich, sonst schmuggelt der
Generator doch welche hinein.

## PROMPT — copy/paste

### STYLE

Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. It must look like a REAL three-dimensional miniature landscape, sculpted by hand from matte stone-clay, with subtle handcrafted tool marks and extremely fine sculpted detail. Clean razor-sharp edges, crisp silhouettes, visible physical depth. No painterly brush strokes, no watercolour, no soft digital rendering, no plastic, no glossy varnish, no AI-smoothed surfaces.

### SCENE

A single vertical kingdom seen from high above — one continuous handcrafted miniature landscape running from the bottom edge of the image to the top. The journey climbs from the warm lowlands at the BOTTOM to the open ocean at the TOP. The land narrows and grows colder, harder and more hostile as it rises.

### THE TWELVE REGIONS — this is the whole point of the map

The landscape is divided into TWELVE clearly distinguishable regions, stacked from bottom to top. Each region is an unmistakable biome tile with its own colour, its own terrain and its own silhouette. Neighbouring regions must never blur into each other — the transitions are readable at a glance, like fields of different stone set beside each other. From BOTTOM to TOP:

1. Green home fields with hedgerows, a walled town and a river — warm spring green.
2. Golden farmland, ripe grain, barns and threshing floors — wheat gold.
3. Dense oak forest, heavy canopy, autumn copper and rust.
4. Twisted dwarf pine above the treeline, alpine meadow, pale grey-green.
5. Cold grey rock and old snow, standing stones, slate blue.
6. High mountain wall, sheer cliffs, glacier and cloud, steel grey.
7. Wide open steppe, dry grassland, low rolling swells — pale amber gold.
8. A burnt ash plain, cracked earth, dead bare trees, grey-brown.
9. A deep red canyon torn into the ground, layered rock walls, rust red.
10. Sun-scorched dunes and desert stone, a single oasis — hot sand yellow.
11. A green coast with cliffs, a harbour and a lighthouse where the land ends.
12. Open ocean filling the top of the image, deep blue, with a distant black iron sea fortress on the horizon.

### NO ROADS — CRITICAL

There are NO roads, NO paths, NO trails, NO bridges, NO dotted routes, NO rivers running the length of the map and NO connecting lines of any kind between the regions. Nothing links the twelve regions to each other. Do not draw a journey, a route, a caravan track or any line that a viewer could read as a way through. The regions simply sit next to each other as terrain. Any continuous line running up the image is wrong. Short local features inside a single region (a village lane, a short stream, a harbour mole) are fine as long as they do not continue into the neighbouring region.

### NO STATION MARKERS

Do not place any dots, discs, pins, flags, numbers, banners or labels anywhere. No text, no legend, no compass rose, no frame, no border decoration. The map carries terrain only.

### COLOUR

Natural, slightly rich, always matte and restrained. Never oversaturated, never glowing. The warm greens and golds of the lower third give way to greys and rust in the middle, then to hot sand and finally to cold deep blue at the top. The overall image stays somewhat darker and calmer than a poster, because interface elements will sit on top of it.

### FRAMING

Straight top-down to slightly tilted bird's eye view, consistent across the whole image — no changing perspective between regions. The land fills the full width at the bottom and narrows slightly toward the top, where the ocean takes over. Even, soft daylight from the upper left. No vignette, no lens blur, no depth-of-field haze, no text.

---

# 2 · DAS MENÜLOGO — Wortmarke über dem Hauptmenü

**Format: 1800 × 542 (also exakt doppelt so groß wie das heutige 900 × 271),
PNG mit ECHTER TRANSPARENZ.** Das Logo liegt frei über der Halle — ein Hintergrund
im Bild würde als Kasten sichtbar. Ich rechne es anschließend auf 900 × 271 herunter.

## PROMPT — copy/paste

### STYLE

A handcrafted game logo, photographed like a museum-quality miniature object: carved from stone and aged brass, matte, with fine chisel marks and real physical volume. Not an illustration, not a flat vector, not a painted sign. Sharp edges, tactile surface, believable material.

### SUBJECT

The two words "GRAND GAMBIT", stacked on two lines, centred: "GRAND" on the upper line in slightly smaller letters, "GAMBIT" below it larger and dominant. The letterforms are a sturdy carved serif with clean straight stems — chiselled into pale bone-coloured stone, the letter faces matte and slightly worn, the cut edges catching a thin warm highlight. Colour of the stone: pale warm bone `#c0b8a4` shading to `#f6efdf` on the lit edges.

Above and centred between the two words sits a single carved CHESS KING'S HEAD — the crown and collar of a king piece, seen from the front, cut from the same stone, its crown banded with aged gold `#c9a45c`. It is small: it must read as a crest over the words, never as the main subject, and its width stays under one quarter of the width of the word "GAMBIT".

A thin aged-gold line runs horizontally under the word "GAMBIT" from end to end, hairline thin, with tiny chiselled serif ends. Nothing else. No shield, no banner, no ribbon, no laurel, no frame, no ornament in the corners, no chess board, no other pieces, no tagline, no subtitle.

### BACKGROUND — CRITICAL

Fully TRANSPARENT background. No backdrop, no panel, no plate, no card, no glow behind the letters, no drop shadow onto anything. Only the carved letters, the king's head and the gold line exist as objects; everything else is empty transparency. The letters must not sit on a rectangle of any colour.

### LIGHT

Soft warm light from the upper left, so every carved edge shows a fine bright rim and a shallow shadow on its own body. Matte throughout, no shine, no metallic glare, no lens flare, no bloom.

### LAYOUT

Wide banner composition, roughly three and a third times wider than tall. The full lock-up (crest plus both words plus the line) is horizontally centred with a comfortable margin left and right, and is NOT cropped at any edge.

---

# 3 · DAS INTROBILD — der erste Eindruck der Geschichte

**Format: 2400 × 1600 (3:2, quer).** Wird je nach Gerät seitlich oder oben
beschnitten — deshalb muss die Bildmitte tragen und der Rand ruhig bleiben.

Motiv: der Moment, in dem König Osric den Riss öffnet und den Gambit hinabschickt.
Es ist die Wurzel der ganzen Chronik — der Name wird zuerst genommen, dann der Mensch.

## PROMPT — copy/paste

### STYLE

A handcrafted miniature diorama photographed like a museum-quality tabletop scene: sculpted matte stone-clay, fine tool marks, real volume, sharp edges, believable materials. Not an illustration, not concept art, not a painting. No plastic, no gloss, no soft digital rendering.

### SCENE

Night in a vast carved throne hall. The floor is a chessboard of worn stone squares, pale bone and deep blue-grey, running from the camera toward a wide opening at the far end. Through that opening the world outside is nothing but darkness.

In the centre of the floor, in the middle distance, the chessboard is TORN OPEN: a jagged rift cuts across the squares, its broken edges lifted like shattered slate, and out of it rises a cold VIOLET light — the only glowing element in the entire image. The light spills across the surrounding squares and throws long hard shadows toward the camera.

Standing alone at the very edge of the rift, seen from behind, is a single carved chess PAWN of pale bone stone, small against the hall, banded with a thin line of warm gold at its collar. It is about to step down. It is the smallest figure in the picture and unmistakably the subject.

Behind it, further back and raised on a low dais, stands a carved KING piece in dark blue-black stone, taller and heavier, facing the rift. Between the two, on the squares, lie a few toppled pawns.

Along the walls stand tall carved pillars, and between them dark banners hang motionless. Everything else in the hall is quiet and unlit.

### COLOUR

Deep blue-black stone `#151d2c` and `#35456a` for the hall, pale bone `#c0b8a4` for the light pieces, aged gold `#c9a45c` for the thin banded highlights. The rift light is cold violet and touches only what is near it. Everything else stays matte, dark and restrained. Never oversaturated, never a second glowing source.

### COMPOSITION — CRITICAL

The rift, the pawn and the king sit in the CENTRAL THIRD of the image, because the outer edges will be cropped on some screens. The left and right margins stay calm and empty — pillars and darkness only, nothing the viewer needs to see. The camera is low, close to the board, looking slightly upward past the pawn toward the king and the rift.

No text, no title, no logo, no letters anywhere in the image. No frame, no border, no vignette drawn into the picture.

---

# 4 · DER HINTERGRUND — die Halle hinter dem Menü

**Format: 2160 × 3840 (9:16, HOCHKANT — doppelt das heutige 1080 × 1920).**
Nicht quer! Die geschnitzte Halle steht hochkant, sitzt am unteren Bildrand
und wird von einer weichen ovalen Maske ausgeblendet (Zentrum bei 50% / 66%
der Bildhöhe). Praktische Folgen, die im Prompt stehen müssen:

- Die **obere Bildkante läuft ins Nichts** — dort greift die Maske am
  stärksten. Kein Deckengewölbe, kein Abschluss, keine wichtige Struktur oben.
- Die **Ecken werden ausgeblendet**. Alles Erzählenswerte gehört in die untere
  Bildhälfte, mittig.
- Das Bild liegt hinter dem gesamten Menü: Wortmarke, Knöpfe, Spielstände. Es
  darf **nichts erzählen und nichts anziehen** — es ist Bühne, nicht Bild.

Messlatte aus der heutigen Halle: mittlere Helligkeit **28 von 255**, im
mittleren Bilddrittel das 95-Perzentil bei **34**. So dunkel muss die neue auch
bleiben, sonst wird die Menüschrift unlesbar.

## PROMPT — copy/paste

### STYLE

A handcrafted miniature interior photographed like a museum-quality tabletop scene: carved matte stone, fine tool marks, real volume, sharp edges. Not an illustration, not concept art. No plastic, no gloss, no soft digital rendering.

### SCENE

The empty great hall of a carved stone keep, seen straight on from the middle of the room. Tall pillars of dark blue-grey stone `#35456a` stand along both sides, receding symmetrically toward a wide dark archway in the centre background. The floor is worn chessboard stone, pale bone and deep blue-grey, its squares blurred by wear and distance.

The composition is VERTICAL: the floor and the feet of the pillars occupy the lower half of the image, and the pillars continue upward into darkness. The hall is EMPTY: no figures, no chess pieces, no furniture, no throne, no chests, no weapons. Between the pillars hang a few dark banners, motionless and unreadable, with no emblem or writing on them. Fine dust hangs in the still air.

### LIGHT — CRITICAL FOR READABILITY

Dim, cold, even light. The image is DARK overall — this is a backdrop and interface text will be laid over it. The CENTRAL AREA of the image, roughly the middle half of the frame, stays especially quiet, dark and low in contrast: no bright spot, no highlight, no strong pattern there, nothing that would fight with text placed on top. The visible structure and detail sit in the OUTER THIRDS, left and right, and along the top. Brightness falls off gently toward all edges.

A single faint warm glow, aged gold `#c9a45c`, sits far back in the central archway — very dim, small and diffuse, just enough to give the room depth. It must never become a bright light source and must never cast a visible beam.

### COLOUR

Almost monochrome: deep blue-black `#151d2c`, stone blue `#35456a`, with the faintest bone `#c0b8a4` on the lit pillar edges and that one distant warm gold. Nothing saturated, nothing glowing, no second colour accent.

### FRAMING — TALL PORTRAIT

TALL VERTICAL portrait format, clearly higher than wide. Symmetrical straight-on view at standing eye height. The floor and the base of the pillars fill the LOWER HALF of the image; the pillars rise through the upper half and simply FADE INTO DARKNESS toward the top edge. There is NO ceiling, NO vault, NO roof and no closing structure at the top — the upper edge of the image dissolves into empty black. The four corners hold nothing important; they fade out as well. No text, no logo, no letters, no frame, no vignette drawn into the image, no lens flare, no depth-of-field bokeh.

---

## Nach der Lieferung

- **Weltkarte:** Ich messe die zwölf Regionen aus, setze die zwölf Anker neu
  (der zwölfte ist derzeit erfunden) und passe `WORLD_MAP.w/h` an. Den Weg
  zeichnest du selbst ein — dafür erweitere ich den Stationsprüfer um einen
  Stift, der eine Linie über die Karte legt und als Punktzug exportiert.
- **Logo:** kommt als `logo-menu.carved.webp` auf 900 × 271 herunter, Transparenz
  bleibt erhalten.
- **Intro:** Format und Beschnitt prüfe ich auf Handy- und Desktopbreite, bevor
  es fest eingebaut wird.
- **Hintergrund:** ersetzt `bg-hall.carved.webp` (hochkant!). Danach messe ich
  die Helligkeit nach: mittleres Drittel darf das 95-Perzentil von 34 nicht
  überschreiten, sonst leidet die Menüschrift.
