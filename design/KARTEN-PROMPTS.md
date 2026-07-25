# GRAND GAMBIT — Karten-Prompts V6 „Miniaturwelt"

Elf Karten: die Weltkarte und die zehn Kapitelkarten. Jeder Block ist
eigenständig und komplett — ganz kopieren, nichts kürzen. Das Stilgesetz ist
in jedem Block identisch; nur SCENE, SCENE COLOUR und OUTPUT wechseln.

Zwei Handgriffe, die aus dem alten Katalog weiterleben:

1. **Straßen & Stationen sind Funktion, nicht Deko.** Die reinschwarzen
   Marker-Scheiben sind maschinenlesbar — `tools/detect-stations.py` liest die
   Stationskoordinaten automatisch aus dem fertigen Bild (51/51 bei der alten
   Weltkarte, max. 1,4 px Versatz). Deshalb: Schwarz kommt NUR in den Markern
   vor, alle Schatten bleiben weiches Grau.
2. **Erst Layout, dann Bild.** Wenn du dem Modell das Straßen-Layout als
   Referenzbild mitgibst (image-to-image), sitzt jede Station, wo das Spiel
   sie erwartet. Ohne Referenz die Marker-Zahl im Prompt nennen und danach
   mit dem Skript zurücklesen.

Formate: Kapitelkarten quer 3:2 (mit 1536×1024 erzeugen, dann hochskalieren).
Die Weltkarte ist die scrollende Hochkant-Karte der App (heute 836×1881):
mit 1024×1536 erzeugen und auf ~1:2,25 erweitern/beschneiden.

---
## 075 — Weltkarte
*Datei: `weltkarte.png` · Hochkant, Ziel ~1:2,25 (App: 836×1881)*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Fresh meadow greens. Warm wheat gold. Muted earth browns. Soft blue rivers. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, rivers, fields, hills and buildings are physical forms rather than painted textures. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
THE WORLD MAP of the chess kingdom as ONE continuous handcrafted miniature, seen from high above in a gentle three-quarter view, portrait orientation. The journey climbs from the BOTTOM edge to the TOP: the fresh green heartland of Kronland with its small crown city at the bottom, then golden Kornmark grain country, amber Eichwald oak forest, the cold blue foothills of Grauwacht, the grey high peaks of Wolkenjoch in the middle distance, the dead ash flats of Aschgrund, the golden steppe of Sattelweite, the red canyon called Die Wunde, the bright desert of Sonnenschlund, and at the very top the harbour and open water of the Endless Sea meeting the horizon. The ten regions FLOW into one another with natural transitions - one continuous sculpted landscape, never puzzle plates, never hard borders. ONE small sculpted landmark per region. A single pale main road winds unbroken from the city at the bottom all the way to the harbour at the top, with branches and dead-end spurs along the way.

SCENE COLOUR
Each region leans toward its chapter hues, muted and natural: Kronland #6f9a5c, Kornmark #c9b68a, Eichwald #a86a2e, Grauwacht #8fa7bd, Wolkenjoch #7d8593, Aschgrund #8a7f66, Sattelweite #b09a52, Die Wunde #b0603a, Sonnenschlund #d9a95c, Endloses Meer #2e6a8a.

ROADS & STATIONS (the map is a game board — this part is functional)
A network of pale sculpted road channels crosses the land, clearly visible, with clean sharp edges — sunk into the terrain like carved grooves, never painted on. It is NOT one line: one main road winds from the lower left toward the upper right, three branch roads split off and rejoin, and several short SPURS end in DEAD ENDS, each stopping at one small sculpted landmark. If a road layout is attached, follow it exactly — same shape, same proportions, same position in the frame.
On every station position of the layout sits a small round marker chiselled into the ground: a flat disc of PURE BLACK stone, matte, no shading inside it, no highlight, all discs exactly the SAME size and the SAME pure black, never touching or overlapping. Pure black appears NOWHERE ELSE in the image — every shadow stays soft grey — so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Portrait, generate at 1024x1536, extend/crop to roughly 1:2.25 for the scrolling in-app map. Full bleed, no margin.
```

---
## 076 — Kapitelkarte I — Kronland
*(Der Aufbruch / Die drei Pfade / Die Pruefungen / Der Aufstieg)* · *Datei: `karte-01.png` · Quer 3:2*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Fresh meadow greens. Warm wheat gold. Muted earth browns. Soft blue rivers. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, rivers, fields, hills and buildings are physical forms rather than painted textures. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: the heartland of the kingdom: a small crown city with simplified half-timbered houses and thatched roofs on a low hill, sculpted watchtowers, fresh green home meadows and hedged fields rolling toward the horizon, one soft blue river crossing the land under a chunky stone bridge. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #6f9a5c, #9ab86f and #7aa06a - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board — this part is functional)
A network of pale sculpted road channels crosses the land, clearly visible, with clean sharp edges — sunk into the terrain like carved grooves, never painted on. It is NOT one line: one main road winds from the lower left toward the upper right, three branch roads split off and rejoin, and several short SPURS end in DEAD ENDS, each stopping at one small sculpted landmark. If a road layout is attached, follow it exactly — same shape, same proportions, same position in the frame.
On every station position of the layout sits a small round marker chiselled into the ground: a flat disc of PURE BLACK stone, matte, no shading inside it, no highlight, all discs exactly the SAME size and the SAME pure black, never touching or overlapping. Pure black appears NOWHERE ELSE in the image — every shadow stays soft grey — so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2, generate at 1536x1024, upscale as needed. Full bleed, no margin.
```

---
## 077 — Kapitelkarte II — Kornmark
*(Ins hohe Korn / Wege zwischen den Aeckern / Die Zehntwaage / Der Erntethron)* · *Datei: `karte-02.png` · Quer 3:2*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Fresh meadow greens. Warm wheat gold. Muted earth browns. Soft blue rivers. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, rivers, fields, hills and buildings are physical forms rather than painted textures. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: an open harvest country: wide sculpted corn and wheat fields in gentle waves, threshing yards, chunky tithe barns and round granaries, straw ricks casting soft shadows, a few poplars along the field lanes. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #5f7a52, #c9b68a and #8e2f39 - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board — this part is functional)
A network of pale sculpted road channels crosses the land, clearly visible, with clean sharp edges — sunk into the terrain like carved grooves, never painted on. It is NOT one line: one main road winds from the lower left toward the upper right, three branch roads split off and rejoin, and several short SPURS end in DEAD ENDS, each stopping at one small sculpted landmark. If a road layout is attached, follow it exactly — same shape, same proportions, same position in the frame.
On every station position of the layout sits a small round marker chiselled into the ground: a flat disc of PURE BLACK stone, matte, no shading inside it, no highlight, all discs exactly the SAME size and the SAME pure black, never touching or overlapping. Pure black appears NOWHERE ELSE in the image — every shadow stays soft grey — so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2, generate at 1536x1024, upscale as needed. Full bleed, no margin.
```

---
## 078 — Kapitelkarte III — Eichwald
*(Unter das Blaetterdach / Der Nebelscheid / Ins Dickicht / Der Herr der Eichen)* · *Datei: `karte-03.png` · Quer 3:2*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Fresh meadow greens. Warm wheat gold. Muted earth browns. Soft blue rivers. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, rivers, fields, hills and buildings are physical forms rather than painted textures. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: a dense old oak forest: sculpted broccoli-like oak canopies in layered amber and rust tones, timber halls with steep shingle roofs in clearings, deer paths, a leaf-choked stream under low wooden bridges, thin veils of mist between the far trees. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #a86a2e, #c98a3a and #7a3a2a - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board — this part is functional)
A network of pale sculpted road channels crosses the land, clearly visible, with clean sharp edges — sunk into the terrain like carved grooves, never painted on. It is NOT one line: one main road winds from the lower left toward the upper right, three branch roads split off and rejoin, and several short SPURS end in DEAD ENDS, each stopping at one small sculpted landmark. If a road layout is attached, follow it exactly — same shape, same proportions, same position in the frame.
On every station position of the layout sits a small round marker chiselled into the ground: a flat disc of PURE BLACK stone, matte, no shading inside it, no highlight, all discs exactly the SAME size and the SAME pure black, never touching or overlapping. Pure black appears NOWHERE ELSE in the image — every shadow stays soft grey — so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2, generate at 1536x1024, upscale as needed. Full bleed, no margin.
```

---
## 079 — Kapitelkarte IV — Grauwacht
*(Der erste Anstieg / Drei kalte Paesse / Die Steinprobe / Der Sattel des Winds)* · *Datei: `karte-04.png` · Quer 3:2*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Fresh meadow greens. Warm wheat gold. Muted earth browns. Soft blue rivers. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, rivers, fields, hills and buildings are physical forms rather than painted textures. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: cold foothill country: mountain villages on rock shoulders, sculpted stone bridges over gorges, the snow line touching the upper slopes, hardy pines, cairns along the passes, the first white peaks on the horizon. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #8fa7bd, #c9d6e2 and #6d84a3 - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board — this part is functional)
A network of pale sculpted road channels crosses the land, clearly visible, with clean sharp edges — sunk into the terrain like carved grooves, never painted on. It is NOT one line: one main road winds from the lower left toward the upper right, three branch roads split off and rejoin, and several short SPURS end in DEAD ENDS, each stopping at one small sculpted landmark. If a road layout is attached, follow it exactly — same shape, same proportions, same position in the frame.
On every station position of the layout sits a small round marker chiselled into the ground: a flat disc of PURE BLACK stone, matte, no shading inside it, no highlight, all discs exactly the SAME size and the SAME pure black, never touching or overlapping. Pure black appears NOWHERE ELSE in the image — every shadow stays soft grey — so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2, generate at 1536x1024, upscale as needed. Full bleed, no margin.
```

---
## 080 — Kapitelkarte V — Wolkenjoch
*(Am Fuss der Wand / Grate und Scharten / Die Seilprobe / Zum Gipfelthron)* · *Datei: `karte-05.png` · Quer 3:2*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Fresh meadow greens. Warm wheat gold. Muted earth browns. Soft blue rivers. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, rivers, fields, hills and buildings are physical forms rather than painted textures. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: the high mountains above the clouds: alpine huts clinging to sculpted rock faces, rope bridges spanning airy gaps, glacier passes, sharp grey ridges and saddles, small snowfields in the shaded couloirs, wisps of cloud drifting BELOW some ridgelines. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #7d8593, #9aa2ae and #5d6675 - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board — this part is functional)
A network of pale sculpted road channels crosses the land, clearly visible, with clean sharp edges — sunk into the terrain like carved grooves, never painted on. It is NOT one line: one main road winds from the lower left toward the upper right, three branch roads split off and rejoin, and several short SPURS end in DEAD ENDS, each stopping at one small sculpted landmark. If a road layout is attached, follow it exactly — same shape, same proportions, same position in the frame.
On every station position of the layout sits a small round marker chiselled into the ground: a flat disc of PURE BLACK stone, matte, no shading inside it, no highlight, all discs exactly the SAME size and the SAME pure black, never touching or overlapping. Pure black appears NOWHERE ELSE in the image — every shadow stays soft grey — so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2, generate at 1536x1024, upscale as needed. Full bleed, no margin.
```

---
## 081 — Kapitelkarte VI — Aschgrund
*(In die Asche / Drei tote Fluesse / Das Knochenfeld / Der Herr der Oede)* · *Datei: `karte-06.png` · Quer 3:2*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Fresh meadow greens. Warm wheat gold. Muted earth browns. Soft blue rivers. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, rivers, fields, hills and buildings are physical forms rather than painted textures. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: a dead ash waste: flat grey-brown ash plains, three dry sculpted riverbeds, rusted skeletal ruins half-sunk in the ground, a scattered bone field of oversized pale ribs and skulls, one leafless black tree. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #8a7f66, #a3947a and #6e6250 - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board — this part is functional)
A network of pale sculpted road channels crosses the land, clearly visible, with clean sharp edges — sunk into the terrain like carved grooves, never painted on. It is NOT one line: one main road winds from the lower left toward the upper right, three branch roads split off and rejoin, and several short SPURS end in DEAD ENDS, each stopping at one small sculpted landmark. If a road layout is attached, follow it exactly — same shape, same proportions, same position in the frame.
On every station position of the layout sits a small round marker chiselled into the ground: a flat disc of PURE BLACK stone, matte, no shading inside it, no highlight, all discs exactly the SAME size and the SAME pure black, never touching or overlapping. Pure black appears NOWHERE ELSE in the image — every shadow stays soft grey — so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2, generate at 1536x1024, upscale as needed. Full bleed, no margin.
```

---
## 082 — Kapitelkarte VII — Sattelweite
*(Unter weitem Himmel / Die Reiterpfade / Feuer im Gras / Der Khan der Steppe)* · *Datei: `karte-07.png` · Quer 3:2*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Fresh meadow greens. Warm wheat gold. Muted earth browns. Soft blue rivers. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, rivers, fields, hills and buildings are physical forms rather than painted textures. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: an endless golden steppe under an enormous sky: round sculpted yurt camps with banner poles, braided rider trails through dry grass, a small blackened burn scar still smoking faintly, herds suggested as tiny carved dots far off. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #b09a52, #c9ae62 and #8a6f3a - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board — this part is functional)
A network of pale sculpted road channels crosses the land, clearly visible, with clean sharp edges — sunk into the terrain like carved grooves, never painted on. It is NOT one line: one main road winds from the lower left toward the upper right, three branch roads split off and rejoin, and several short SPURS end in DEAD ENDS, each stopping at one small sculpted landmark. If a road layout is attached, follow it exactly — same shape, same proportions, same position in the frame.
On every station position of the layout sits a small round marker chiselled into the ground: a flat disc of PURE BLACK stone, matte, no shading inside it, no highlight, all discs exactly the SAME size and the SAME pure black, never touching or overlapping. Pure black appears NOWHERE ELSE in the image — every shadow stays soft grey — so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2, generate at 1536x1024, upscale as needed. Full bleed, no margin.
```

---
## 083 — Kapitelkarte VIII — Die Wunde
*(In die Schlucht / Die drei Klammen / Echo und Absturz / Ueber der Felskante)* · *Datei: `karte-08.png` · Quer 3:2*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Fresh meadow greens. Warm wheat gold. Muted earth browns. Soft blue rivers. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, rivers, fields, hills and buildings are physical forms rather than painted textures. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: a deep red canyon land: layered sculpted rock walls in rust and terracotta, three narrow side gorges, cliff dwellings carved into the walls, hanging stairs and timber galleries pinned to the stone, a thin river far below at the canyon floor. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #b0603a, #c97a4a and #8a3a2a - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board — this part is functional)
A network of pale sculpted road channels crosses the land, clearly visible, with clean sharp edges — sunk into the terrain like carved grooves, never painted on. It is NOT one line: one main road winds from the lower left toward the upper right, three branch roads split off and rejoin, and several short SPURS end in DEAD ENDS, each stopping at one small sculpted landmark. If a road layout is attached, follow it exactly — same shape, same proportions, same position in the frame.
On every station position of the layout sits a small round marker chiselled into the ground: a flat disc of PURE BLACK stone, matte, no shading inside it, no highlight, all discs exactly the SAME size and the SAME pure black, never touching or overlapping. Pure black appears NOWHERE ELSE in the image — every shadow stays soft grey — so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2, generate at 1536x1024, upscale as needed. Full bleed, no margin.
```

---
## 084 — Kapitelkarte IX — Sonnenschlund
*(Der gluehende Sand / Karawanenwege / Die Glutprobe / Der Duenenthron)* · *Datei: `karte-09.png` · Quer 3:2*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Fresh meadow greens. Warm wheat gold. Muted earth browns. Soft blue rivers. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, rivers, fields, hills and buildings are physical forms rather than painted textures. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: a bright hot desert: wide sculpted dune bands, adobe towers and walled caravan wells along the routes, bleached animal bones in the sand, ONE small green oasis with palms and a dark water hole. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #d9a95c, #e8c377 and #b0763a - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board — this part is functional)
A network of pale sculpted road channels crosses the land, clearly visible, with clean sharp edges — sunk into the terrain like carved grooves, never painted on. It is NOT one line: one main road winds from the lower left toward the upper right, three branch roads split off and rejoin, and several short SPURS end in DEAD ENDS, each stopping at one small sculpted landmark. If a road layout is attached, follow it exactly — same shape, same proportions, same position in the frame.
On every station position of the layout sits a small round marker chiselled into the ground: a flat disc of PURE BLACK stone, matte, no shading inside it, no highlight, all discs exactly the SAME size and the SAME pure black, never touching or overlapping. Pure black appears NOWHERE ELSE in the image — every shadow stays soft grey — so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2, generate at 1536x1024, upscale as needed. Full bleed, no margin.
```

---
## 085 — Kapitelkarte X — Endloses Meer
*(Ablegen / Drei Stroemungen / Die Sturmfahrt / Der Herr der Wellen)* · *Datei: `karte-10.png` · Quer 3:2*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Fresh meadow greens. Warm wheat gold. Muted earth browns. Soft blue rivers. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, rivers, fields, hills and buildings are physical forms rather than painted textures. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: the coast of an endless sea: a harbour town of stacked stone houses around a sculpted quay, a lighthouse on the mole, moored ships with furled sails, sculpted wave bands rolling out to the horizon, gull-white foam lines along the shore. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #2e6a8a, #3f7fa0 and #1e4a66 - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board — this part is functional)
A network of pale sculpted road channels crosses the land, clearly visible, with clean sharp edges — sunk into the terrain like carved grooves, never painted on. It is NOT one line: one main road winds from the lower left toward the upper right, three branch roads split off and rejoin, and several short SPURS end in DEAD ENDS, each stopping at one small sculpted landmark. If a road layout is attached, follow it exactly — same shape, same proportions, same position in the frame.
On every station position of the layout sits a small round marker chiselled into the ground: a flat disc of PURE BLACK stone, matte, no shading inside it, no highlight, all discs exactly the SAME size and the SAME pure black, never touching or overlapping. Pure black appears NOWHERE ELSE in the image — every shadow stays soft grey — so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2, generate at 1536x1024, upscale as needed. Full bleed, no margin.
```

---
