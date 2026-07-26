# KAPITEL XII — DAS OFFENE MEER (Finale)

**Diese Karte bricht bewusst die wichtigste Regel aller anderen elf: es gibt
KEINE WEGE.** In `KARTEN-V5.md` gilt "THE ROAD IS ONE TREE" — ein einziger
Straßenbaum, an dem alle Stationen hängen. Auf offener See wäre das Unsinn.
Hier stehen die Stationen frei im Wasser, und was sie verbindet, ist die
Fahrtrichtung des Schiffs, nicht ein gemeißelter Kanal.

Alles andere bleibt gleich: dasselbe Material, dieselbe Kamera, dieselben
tiefschwarzen Scheiben, damit `tools/detect-stations.py` unverändert liest.

---

## Warum diese Karte anders zählt

Die elf Kapitelkarten tragen mindestens 40 Stationen. **Diese trägt 14.** Das
Finale soll sich nicht anfühlen wie noch ein Kapitel, sondern wie eine kurze,
harte Überfahrt. Weniger Punkte, jeder einzelne ein Ereignis.

**Ordnungsproblem, das du kennen musst:** Die Levelstruktur wird sonst aus dem
Wegenetz gebaut — Hauptstrang zuerst, Sackgassen daran. Ohne Wege fehlt diese
Information im Bild. Deshalb verlangt der Prompt, dass die vierzehn Scheiben
eine **erkennbare Fahrtlinie von unten links zur Festung oben rechts** bilden:
locker gestreut, aber in einer lesbaren Reihenfolge, keine gleichmäßige Wolke.
Dann lässt sich die Reihenfolge über eine Nachbarschaftskette aus den
Koordinaten rekonstruieren. Liegen die Punkte zu gleichmäßig verteilt, ist die
Reihenfolge nicht mehr eindeutig und ich muss sie von Hand setzen.

**Detektor-Grenzen, wörtlich aus `tools/detect-stations.py`:**

| Prüfung | Grenze |
|---|---|
| Luminanz eines Markers | ≤ 62 |
| Buntheit (max−min Kanal) | ≤ 30 |
| Mindestfläche | 60 px |
| Rundheit | ≥ 0,62 |

Daraus folgt die einzige echte Gefahr dieser Karte: **tiefes Wasser darf nicht
grauschwarz werden.** Bleibt die See kräftig blau, ist ihre Buntheit weit über
30 und der Detektor ignoriert sie — die Kapitelfarbe `#1e4a66` liegt bei
Buntheit 72, also sicher. Kippt der Schatten dagegen ins Entsättigt-Dunkle,
zählt er als Marker. Das steht deshalb ausdrücklich im Prompt.

---

## PROMPT — copy/paste

**Format: 3840 x 2560 (3:2).**

### STYLE

Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

### COLOUR

Natural but slightly rich colours. Deep ocean blues and cold green-greys. Pale bone driftwood. Muted rust on old iron. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing — with one single exception named below.

### SCENE

THE OPEN SEA at the end of the world — the final crossing of the chess kingdom, rendered as one handcrafted miniature. There is NO mainland, NO coast and NO continuous terrain: the entire image is open water from edge to edge, apart from the scattered objects described below. The sea is REAL LIQUID — resin-poured water in a miniature, glassy, gently reflective, with a slow heavy swell and fine sculpted foam crests, never carved stone, never frosted, never a painted blue stripe. The swell runs from the lower left toward the upper right, so the water itself suggests the direction of travel.

The upper part of the image is open sky above a clearly visible horizon — vast, cold and quiet, with gasoform drifting cloud veils that look like air and not like sculpted material. The sky darkens gradually toward the upper right, where the storm sits.

### NO ROADS — THIS IS THE ONE MAP WITHOUT THEM

There are NO roads, NO paths, NO bridges, NO carved channels and NO lines of any kind on this map. Nothing connects the objects to each other. The water between them is empty, open and unbroken. Do not draw wakes, dotted routes, sea lanes, rope lines, chains or any other connecting element. Any line across the water is wrong.

### THE FOURTEEN STATIONS

Along the crossing sit exactly FOURTEEN STATIONS: small round markers, flat discs of PURE BLACK stone, matte, no shading inside, no highlight, all discs exactly the SAME size and the SAME pure black. They lie flat ON the water surface like dark still pools.

Each station sits AT a solitary object rising from the sea — never in empty water. Vary them: a wrecked ship run aground on a hidden reef with its ribs showing, a leaning broken mast, a tiny rock islet with a single crooked tree, a half-sunken watchtower, a reef of black-wet stones, a capsized hull, a drifting field of shattered timber, a lone iron buoy furred with rust. The objects are SMALL — the sea dominates everything and each object is an island of detail in a wide emptiness.

Place the fourteen so they form a READABLE LINE OF PASSAGE from the LOWER LEFT of the image toward the fortress in the UPPER RIGHT: loosely scattered, drifting off the line by a good margin, but always progressing — never an even carpet, never a cluster, never a ring. Neighbouring discs keep a gap of at least six disc-widths and must never touch or overlap.

### THE FORTRESS OF THE GRANDMASTER

In the UPPER RIGHT, at the end of the crossing, stands the final fortress: a vast black-iron sea bastion built straight out of the open water on sheer pillars, sharp-edged, angular and hostile, far larger than anything else in the image. Around and above it the sky is torn by VIOLET LIGHTNING — jagged branching bolts in cold purple, the only glowing element anywhere in this picture, casting a faint violet sheen on the swell beneath it. This is where the Grandmaster waits. The fortress reads as the destination from the first glance.

### CRITICAL — SO A SCRIPT CAN READ THE MARKERS

PURE BLACK appears NOWHERE ELSE in this image. This matters more here than on any other map, because the sea is dark by nature. Every shadow on the water, every trough of the swell, every shaded hull and the fortress itself must stay CLEARLY COLOURED — deep blue, blue-green, rust or violet — and must never fall into neutral grey-black. Deep water stays saturated blue, not black. The fortress iron stays a cold blue-black with visible blue in it, never neutral. Only the fourteen station discs are true, flat, dead black.

### FRAMING

High three-quarter tabletop view. Visible horizon in the upper third. Gentle perspective. The water fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it — except the fortress and its lightning, which may dominate. Nothing else here may compete with the figures.

---

## Was danach im Code passieren müsste

Nur zur Vorwarnung, das ist NICHT Teil des Prompts:

- Der Weltzyklus steht seit Krummholz auf **Modulo 11**. Ein zwölftes Kapitel
  zieht dieselbe Runde noch einmal durch MysticBackground, mapArt, GameScreen,
  CampaignScreen, content/campaign.js, meta/campaign.js, meta/saves.js und
  bosses.js — plus römische Ziffern bis XII und ein zwölfter Brettboden.
- **`GROUNDS_C`/`GROUNDS_K` haben heute nur zehn Schlüssel**, während
  `boardGround` schon mit `% 11` rechnet. Kapitel XI bekommt dadurch bereits
  jetzt gar keinen Boden. Das ist vor einem zwölften Kapitel zu reparieren,
  sonst wachsen zwei Löcher statt einem.
- Der Wegverfolger aus der Karten-Übergabe greift hier nicht. Für diese eine
  Karte braucht die Reihenfolge eine Nachbarschaftskette aus den Koordinaten.
