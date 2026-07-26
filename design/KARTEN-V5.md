# GRAND GAMBIT - Die Weltkarten V5.1
**Vorlage: dein GPT-Stil, woertlich uebernommen. Je Kapitel wechseln nur SCENE und Farben.**

---

## Der neue Arbeitsweg - das Bild ist die Wahrheit

Bisher war der Plan: das Spiel gibt die Stationspositionen vor, GPT muss sie
treffen. Du hast es umgedreht, und das ist der bessere Weg:

1. GPT malt die Welt frei nach dem Prompt - Hauptstrang plus Sackgassen, die
   Stationszahlen stehen jetzt IM Prompt (mindestens 40, davon etwa 26 auf dem
   Hauptweg, Rest auf den Stichwegen).
2. `tools/detect-stations.py` liest alle schwarzen Scheiben automatisch aus
   dem fertigen Bild (am Testplan bewiesen: 51/51, Versatz unter 1,5 px).
3. Ich baue die Levelstruktur des Kapitels aus den erkannten Punkten: Reihung
   entlang des Hauptwegs, Stichwege als Sackgassen, je laenger die Sackgasse,
   desto wertvoller die Belohnung an ihrem Ende. Weicht die Zahl leicht ab,
   bekommt das Kapitel eben ein paar Stationen mehr oder weniger - die
   Kampagnenlogik haengt nicht an exakt 51.

Der beigelegte Wegeplan ist damit OPTIONAL. Haengst du ihn an, haelt sich GPT
an die Form ("if a road layout is attached, follow it exactly"); ohne ihn
erfindet GPT selbst - beides ist jetzt in Ordnung.

## Struktur, wie du sie beschrieben hast

Kein Zickzack-Netz mehr: **ein Hauptstrang, sechs bis acht Abzweigungen, jede
endet als Sackgasse an einem Wahrzeichen.** Je laenger der Stichweg, desto
groesser das Wahrzeichen - das ist woertlich so im Prompt verankert ("the
longer a spur, the grander its final landmark"). Zum Vergleich: die heutige
Kampagne hat 33 Stationen im Hauptnetz und 18 einzelne Sackgassen-Enden; die
neue Form ist also keine Verarmung, sondern eine Begradigung.

---

## Die elf Kapitelkarten

### 01 - Kapitel I - Kronland
*Datei: `karte-01.png`*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Fresh meadow greens. Warm wheat gold. Muted earth browns. Soft blue rivers. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, fields, hills and buildings are physical forms rather than painted textures. WATER is the one exception: rivers, lakes and sea read as REAL LIQUID - glassy, gently reflective, with a soft natural flow around stones and under bridges - resin-poured water in a miniature, never carved stone, never frosted, never a painted blue stripe. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

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

ROADS & STATIONS (the map is a game board - this part is functional)
A network of sculpted road channels crosses the land, sunk into the terrain like carved grooves, never painted on. The roads are DISTINCTLY PALER than everything around them - pale bone-white stone against the coloured land, high contrast, clean sharp edges, so a script can trace them reliably. The roads stay COMPLETELY CLEAR: no houses, no trees, no rocks, no carts, nothing may stand ON a road or overlap its edges - every building and landmark sits BESIDE the road, never on it. THE ROAD IS ONE TREE. Picture the entire road network as ONE tree lying across the land. Its ROOT is the single point where the main road enters the map at the LOWER LEFT edge - the only place where any road touches any border of the image. Its TRUNK is the main road: draw it FIRST, as one continuous unbroken stroke from that lower-left entry all the way to the gate of the fortress. Its BRANCHES are the spurs: each one starts ON the trunk and grows out of it - at every junction the two carved channels merge seamlessly, same width, same depth, same pale stone - and most branches end inside the map at their dead-end landmark. On this map, one branch splits from the trunk before the river, crosses on its own smaller bridge and REJOINS the trunk behind the hill - a gentle parallel stretch; the other five or six branches are short dead-end spurs to hamlets and shrines. A road segment that does not grow out of the trunk simply does not exist; there is no road anywhere on this map that cannot be walked back, road only, to the lower-left entry. Where the trunk or a branch meets water it crosses on a sculpted bridge; where it meets a ridge it passes through a carved notch; no river, cliff or building ever interrupts it.
ROUTE CHARACTER OF THIS CHAPTER - make this map clearly different from the other chapters: The trunk flows in soft wide curves through the meadows.
The structure is simple: ONE main road winds from the lower left toward the upper right and ends at the CROWN CITADEL of the kingdom, a proud walled keep with sculpted towers on the highest hill in the upper right - the largest structure on the whole map, clearly the destination of the journey. SIX TO EIGHT short SPUR roads branch off the main road and end in DEAD ENDS, each stopping at one small sculpted landmark. The longer a spur, the grander its final landmark. No other road shapes, no zigzag, no loops, no free-floating road pieces.
Along the roads sit the STATIONS: small round markers chiselled into the ground, flat discs of PURE BLACK stone, matte, no shading inside, no highlight, all discs exactly the SAME size and the SAME pure black. AT LEAST 40 STATIONS in total: about 26 of them spaced evenly along the main road, the rest on the spurs with one to three stations each and always one on every dead end. Neighbouring discs keep a gap of at least three disc-widths and must never touch or overlap. Pure black appears NOWHERE ELSE in the image - every shadow stays soft grey - so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2 at 3840x2560 pixels. Full bleed, no margin.
```

### 02 - Kapitel II - Kornmark
*Datei: `karte-02.png`*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Warm wheat gold. Soft straw yellows. Muted barn reds. Fresh field greens. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, fields, hills and buildings are physical forms rather than painted textures. WATER is the one exception: rivers, lakes and sea read as REAL LIQUID - glassy, gently reflective, with a soft natural flow around stones and under bridges - resin-poured water in a miniature, never carved stone, never frosted, never a painted blue stripe. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: the fertile grain belt: wide sculpted corn and wheat plots divided by low hedges, a threshing yard, tithe barns and one round granary tower on a gentle rise, a narrow stream feeding a chunky water mill. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #5f7a52, #c9b68a and #8e2f39 - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board - this part is functional)
A network of sculpted road channels crosses the land, sunk into the terrain like carved grooves, never painted on. The roads are DISTINCTLY PALER than everything around them - pale bone-white stone against the coloured land, high contrast, clean sharp edges, so a script can trace them reliably. The roads stay COMPLETELY CLEAR: no houses, no trees, no rocks, no carts, nothing may stand ON a road or overlap its edges - every building and landmark sits BESIDE the road, never on it. THE ROAD IS ONE TREE. Picture the entire road network as ONE tree lying across the land. Its ROOT is the single point where the main road enters the map at the LOWER LEFT edge - the only place where any road touches any border of the image. Its TRUNK is the main road: draw it FIRST, as one continuous unbroken stroke from that lower-left entry all the way to the gate of the fortress. Its BRANCHES are the spurs: each one starts ON the trunk and grows out of it - at every junction the two carved channels merge seamlessly, same width, same depth, same pale stone - and most branches end inside the map at their dead-end landmark. On this map, two field lanes leave the trunk at the same junction, run PARALLEL between the corn plots and rejoin two fields later; the remaining branches are dead-end spurs, one of them noticeably long, leading far out to a lonely water mill. A road segment that does not grow out of the trunk simply does not exist; there is no road anywhere on this map that cannot be walked back, road only, to the lower-left entry. Where the trunk or a branch meets water it crosses on a sculpted bridge; where it meets a ridge it passes through a carved notch; no river, cliff or building ever interrupts it.
ROUTE CHARACTER OF THIS CHAPTER - make this map clearly different from the other chapters: The trunk runs straight and calm between the plots, kinking only at field corners.
The structure is simple: ONE main road winds from the lower left toward the upper right and ends at the fortified HARVEST GRANGE, a massive walled granary-fortress with a round keep, upper right - the largest structure on the whole map, clearly the destination of the journey. SIX TO EIGHT short SPUR roads branch off the main road and end in DEAD ENDS, each stopping at one small sculpted landmark. The longer a spur, the grander its final landmark. No other road shapes, no zigzag, no loops, no free-floating road pieces.
Along the roads sit the STATIONS: small round markers chiselled into the ground, flat discs of PURE BLACK stone, matte, no shading inside, no highlight, all discs exactly the SAME size and the SAME pure black. AT LEAST 40 STATIONS in total: about 26 of them spaced evenly along the main road, the rest on the spurs with one to three stations each and always one on every dead end. Neighbouring discs keep a gap of at least three disc-widths and must never touch or overlap. Pure black appears NOWHERE ELSE in the image - every shadow stays soft grey - so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2 at 3840x2560 pixels. Full bleed, no margin.
```

### 03 - Kapitel III - Eichwald
*Datei: `karte-03.png`*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Amber and rust browns. Deep oak greens. Muted bark greys. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, fields, hills and buildings are physical forms rather than painted textures. WATER is the one exception: rivers, lakes and sea read as REAL LIQUID - glassy, gently reflective, with a soft natural flow around stones and under bridges - resin-poured water in a miniature, never carved stone, never frosted, never a painted blue stripe. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: a dense sculpted oak forest: rounded amber tree crowns packed shoulder to shoulder, a timber hall in one clearing, deer paths, one chunky wooden bridge over a leaf-choked stream. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #a86a2e, #c98a3a and #7a3a2a - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board - this part is functional)
A network of sculpted road channels crosses the land, sunk into the terrain like carved grooves, never painted on. The roads are DISTINCTLY PALER than everything around them - pale bone-white stone against the coloured land, high contrast, clean sharp edges, so a script can trace them reliably. The roads stay COMPLETELY CLEAR: no houses, no trees, no rocks, no carts, nothing may stand ON a road or overlap its edges - every building and landmark sits BESIDE the road, never on it. THE ROAD IS ONE TREE. Picture the entire road network as ONE tree lying across the land. Its ROOT is the single point where the main road enters the map at the LOWER LEFT edge - the only place where any road touches any border of the image. Its TRUNK is the main road: draw it FIRST, as one continuous unbroken stroke from that lower-left entry all the way to the gate of the fortress. Its BRANCHES are the spurs: each one starts ON the trunk and grows out of it - at every junction the two carved channels merge seamlessly, same width, same depth, same pale stone - and most branches end inside the map at their dead-end landmark. On this map, there is NO parallel stretch - the forest is too dense; instead one branch is VERY long, winding deep between the oaks to a hidden timber shrine, the rest are short dead ends. A road segment that does not grow out of the trunk simply does not exist; there is no road anywhere on this map that cannot be walked back, road only, to the lower-left entry. Where the trunk or a branch meets water it crosses on a sculpted bridge; where it meets a ridge it passes through a carved notch; no river, cliff or building ever interrupts it.
ROUTE CHARACTER OF THIS CHAPTER - make this map clearly different from the other chapters: The trunk winds narrowly between the tree crowns, often half shaded by them.
The structure is simple: ONE main road winds from the lower left toward the upper right and ends at the TIMBER HOLD, a fortress of colossal oak trunks and a palisade ring deep in the wood, upper right - the largest structure on the whole map, clearly the destination of the journey. SIX TO EIGHT short SPUR roads branch off the main road and end in DEAD ENDS, each stopping at one small sculpted landmark. The longer a spur, the grander its final landmark. No other road shapes, no zigzag, no loops, no free-floating road pieces.
Along the roads sit the STATIONS: small round markers chiselled into the ground, flat discs of PURE BLACK stone, matte, no shading inside, no highlight, all discs exactly the SAME size and the SAME pure black. AT LEAST 40 STATIONS in total: about 26 of them spaced evenly along the main road, the rest on the spurs with one to three stations each and always one on every dead end. Neighbouring discs keep a gap of at least three disc-widths and must never touch or overlap. Pure black appears NOWHERE ELSE in the image - every shadow stays soft grey - so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2 at 3840x2560 pixels. Full bleed, no margin.
```

### 04 - Kapitel IV - Krummholz
*Datei: `karte-04.png`*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Highland greens fading to grass gold. Weathered rock greys. The last amber of the oaks below the treeline. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, fields, hills and buildings are physical forms rather than painted textures. WATER is the one exception: rivers, lakes and sea read as REAL LIQUID - glassy, gently reflective, with a soft natural flow around stones and under bridges - resin-poured water in a miniature, never carved stone, never frosted, never a painted blue stripe. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: the highland belt where the Eichwald thins toward the peaks: the TREELINE clearly visible as a line across the slopes - below it twisted wind-bent krummholz trees and the last amber oaks, above it bare grass shoulders and rock; high pastures with drystone walls, a shepherd hut, scattered boulders, small cairns along the way, the first bare crests rising behind The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #7f9066, #a8ab84 and #5c6b56 - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board - this part is functional)
A network of sculpted road channels crosses the land, sunk into the terrain like carved grooves, never painted on. The roads are DISTINCTLY PALER than everything around them - pale bone-white stone against the coloured land, high contrast, clean sharp edges, so a script can trace them reliably. The roads stay COMPLETELY CLEAR: no houses, no trees, no rocks, no carts, nothing may stand ON a road or overlap its edges - every building and landmark sits BESIDE the road, never on it. THE ROAD IS ONE TREE. Picture the entire road network as ONE tree lying across the land. Its ROOT is the single point where the main road enters the map at the LOWER LEFT edge - the only place where any road touches any border of the image. Its TRUNK is the main road: draw it FIRST, as one continuous unbroken stroke from that lower-left entry all the way to the gate of the fortress. Its BRANCHES are the spurs: each one starts ON the trunk and grows out of it - at every junction the two carved channels merge seamlessly, same width, same depth, same pale stone - and most branches end inside the map at their dead-end landmark. On this map, one branch climbs to a high pasture above the treeline and REJOINS the trunk beyond a rock shoulder; the other branches are dead-end spurs to a shepherd hut, a cairn field and a lone weather tree. A road segment that does not grow out of the trunk simply does not exist; there is no road anywhere on this map that cannot be walked back, road only, to the lower-left entry. Where the trunk or a branch meets water it crosses on a sculpted bridge; where it meets a ridge it passes through a carved notch; no river, cliff or building ever interrupts it.
ROUTE CHARACTER OF THIS CHAPTER - make this map clearly different from the other chapters: The trunk climbs steadily through the thinning forest and crosses the treeline exactly once, clearly visible.
The structure is simple: ONE main road winds from the lower left toward the upper right and ends at the TREELINE HOLD, a fortress of stone and weathered timber standing exactly on the treeline, upper right - the largest structure on the whole map, clearly the destination of the journey. SIX TO EIGHT short SPUR roads branch off the main road and end in DEAD ENDS, each stopping at one small sculpted landmark. The longer a spur, the grander its final landmark. No other road shapes, no zigzag, no loops, no free-floating road pieces.
Along the roads sit the STATIONS: small round markers chiselled into the ground, flat discs of PURE BLACK stone, matte, no shading inside, no highlight, all discs exactly the SAME size and the SAME pure black. AT LEAST 40 STATIONS in total: about 26 of them spaced evenly along the main road, the rest on the spurs with one to three stations each and always one on every dead end. Neighbouring discs keep a gap of at least three disc-widths and must never touch or overlap. Pure black appears NOWHERE ELSE in the image - every shadow stays soft grey - so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2 at 3840x2560 pixels. Full bleed, no margin.
```

### 05 - Kapitel V - Grauwacht
*Datei: `karte-05.png`*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Cool slate blues. Pale snow whites on the crests. Muted granite greys. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, fields, hills and buildings are physical forms rather than painted textures. WATER is the one exception: rivers, lakes and sea read as REAL LIQUID - glassy, gently reflective, with a soft natural flow around stones and under bridges - resin-poured water in a miniature, never carved stone, never frosted, never a painted blue stripe. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: the last grey watch before the high peaks: sculpted mountain villages on rock shoulders, squat grey watchtowers, cold passes between ridges, stone bridges over gorges, the first snow on the highest crests. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #8fa7bd, #c9d6e2 and #6d84a3 - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board - this part is functional)
A network of sculpted road channels crosses the land, sunk into the terrain like carved grooves, never painted on. The roads are DISTINCTLY PALER than everything around them - pale bone-white stone against the coloured land, high contrast, clean sharp edges, so a script can trace them reliably. The roads stay COMPLETELY CLEAR: no houses, no trees, no rocks, no carts, nothing may stand ON a road or overlap its edges - every building and landmark sits BESIDE the road, never on it. THE ROAD IS ONE TREE. Picture the entire road network as ONE tree lying across the land. Its ROOT is the single point where the main road enters the map at the LOWER LEFT edge - the only place where any road touches any border of the image. Its TRUNK is the main road: draw it FIRST, as one continuous unbroken stroke from that lower-left entry all the way to the gate of the fortress. Its BRANCHES are the spurs: each one starts ON the trunk and grows out of it - at every junction the two carved channels merge seamlessly, same width, same depth, same pale stone - and most branches end inside the map at their dead-end landmark. On this map, one branch climbs over a second, higher pass and REJOINS the trunk beyond it - two parallel ways over the ridge; the other branches are dead-end spurs to watchtowers. A road segment that does not grow out of the trunk simply does not exist; there is no road anywhere on this map that cannot be walked back, road only, to the lower-left entry. Where the trunk or a branch meets water it crosses on a sculpted bridge; where it meets a ridge it passes through a carved notch; no river, cliff or building ever interrupts it.
ROUTE CHARACTER OF THIS CHAPTER - make this map clearly different from the other chapters: The trunk climbs in switchbacks, each hairpin clearly sculpted.
The structure is simple: ONE main road winds from the lower left toward the upper right and ends at the GREY WATCH itself, a stern stone fortress spanning the highest pass, upper right - the largest structure on the whole map, clearly the destination of the journey. SIX TO EIGHT short SPUR roads branch off the main road and end in DEAD ENDS, each stopping at one small sculpted landmark. The longer a spur, the grander its final landmark. No other road shapes, no zigzag, no loops, no free-floating road pieces.
Along the roads sit the STATIONS: small round markers chiselled into the ground, flat discs of PURE BLACK stone, matte, no shading inside, no highlight, all discs exactly the SAME size and the SAME pure black. AT LEAST 40 STATIONS in total: about 26 of them spaced evenly along the main road, the rest on the spurs with one to three stations each and always one on every dead end. Neighbouring discs keep a gap of at least three disc-widths and must never touch or overlap. Pure black appears NOWHERE ELSE in the image - every shadow stays soft grey - so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2 at 3840x2560 pixels. Full bleed, no margin.
```

### 06 - Kapitel VI - Wolkenjoch
*Datei: `karte-06.png`*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Glacier greys. Ice blues. Pale mist whites. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, fields, hills and buildings are physical forms rather than painted textures. WATER is the one exception: rivers, lakes and sea read as REAL LIQUID - glassy, gently reflective, with a soft natural flow around stones and under bridges - resin-poured water in a miniature, never carved stone, never frosted, never a painted blue stripe. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: the passes above the clouds: sheer sculpted rock faces with tiny alpine huts clinging to them, rope bridges spanning chasms, a glacier tongue, thin veils of cloud drifting BELOW some of the higher ledges. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #7d8593, #9aa2ae and #5d6675 - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board - this part is functional)
A network of sculpted road channels crosses the land, sunk into the terrain like carved grooves, never painted on. The roads are DISTINCTLY PALER than everything around them - pale bone-white stone against the coloured land, high contrast, clean sharp edges, so a script can trace them reliably. The roads stay COMPLETELY CLEAR: no houses, no trees, no rocks, no carts, nothing may stand ON a road or overlap its edges - every building and landmark sits BESIDE the road, never on it. THE ROAD IS ONE TREE. Picture the entire road network as ONE tree lying across the land. Its ROOT is the single point where the main road enters the map at the LOWER LEFT edge - the only place where any road touches any border of the image. Its TRUNK is the main road: draw it FIRST, as one continuous unbroken stroke from that lower-left entry all the way to the gate of the fortress. Its BRANCHES are the spurs: each one starts ON the trunk and grows out of it - at every junction the two carved channels merge seamlessly, same width, same depth, same pale stone - and most branches end inside the map at their dead-end landmark. On this map, one branch takes a high ledge while the trunk passes through a carved notch below - they rejoin after the chasm; the rest are dead-end spurs to huts and a glacier viewpoint. A road segment that does not grow out of the trunk simply does not exist; there is no road anywhere on this map that cannot be walked back, road only, to the lower-left entry. Where the trunk or a branch meets water it crosses on a sculpted bridge; where it meets a ridge it passes through a carved notch; no river, cliff or building ever interrupts it.
ROUTE CHARACTER OF THIS CHAPTER - make this map clearly different from the other chapters: The trunk clings to the rock, crossing two rope bridges.
The structure is simple: ONE main road winds from the lower left toward the upper right and ends at the SUMMIT HOLD, a fortress carved into the very peak above the clouds, upper right - the largest structure on the whole map, clearly the destination of the journey. SIX TO EIGHT short SPUR roads branch off the main road and end in DEAD ENDS, each stopping at one small sculpted landmark. The longer a spur, the grander its final landmark. No other road shapes, no zigzag, no loops, no free-floating road pieces.
Along the roads sit the STATIONS: small round markers chiselled into the ground, flat discs of PURE BLACK stone, matte, no shading inside, no highlight, all discs exactly the SAME size and the SAME pure black. AT LEAST 40 STATIONS in total: about 26 of them spaced evenly along the main road, the rest on the spurs with one to three stations each and always one on every dead end. Neighbouring discs keep a gap of at least three disc-widths and must never touch or overlap. Pure black appears NOWHERE ELSE in the image - every shadow stays soft grey - so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2 at 3840x2560 pixels. Full bleed, no margin.
```

### 07 - Kapitel VII - Aschgrund
*Datei: `karte-07.png`*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Ash beiges. Rust browns. Bone whites. Muted charcoal greys. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, fields, hills and buildings are physical forms rather than painted textures. WATER is the one exception: rivers, lakes and sea read as REAL LIQUID - glassy, gently reflective, with a soft natural flow around stones and under bridges - resin-poured water in a miniature, never carved stone, never frosted, never a painted blue stripe. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: the drained land the rift drank first: flat sculpted ash plains, cracked dead river beds, rusted iron ruins, a field of pale sculpted bones, one broken black gate. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #8a7f66, #a3947a and #6e6250 - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board - this part is functional)
A network of sculpted road channels crosses the land, sunk into the terrain like carved grooves, never painted on. The roads are DISTINCTLY PALER than everything around them - pale bone-white stone against the coloured land, high contrast, clean sharp edges, so a script can trace them reliably. The roads stay COMPLETELY CLEAR: no houses, no trees, no rocks, no carts, nothing may stand ON a road or overlap its edges - every building and landmark sits BESIDE the road, never on it. THE ROAD IS ONE TREE. Picture the entire road network as ONE tree lying across the land. Its ROOT is the single point where the main road enters the map at the LOWER LEFT edge - the only place where any road touches any border of the image. Its TRUNK is the main road: draw it FIRST, as one continuous unbroken stroke from that lower-left entry all the way to the gate of the fortress. Its BRANCHES are the spurs: each one starts ON the trunk and grows out of it - at every junction the two carved channels merge seamlessly, same width, same depth, same pale stone - and most branches end inside the map at their dead-end landmark. On this map, there is NO parallel stretch in this dead land - instead there are MANY spurs, seven or eight, each a short bleak dead end at a ruin, a bone field or the broken gate. A road segment that does not grow out of the trunk simply does not exist; there is no road anywhere on this map that cannot be walked back, road only, to the lower-left entry. Where the trunk or a branch meets water it crosses on a sculpted bridge; where it meets a ridge it passes through a carved notch; no river, cliff or building ever interrupts it.
ROUTE CHARACTER OF THIS CHAPTER - make this map clearly different from the other chapters: The trunk runs almost straight across the ash, bleak and exposed.
The structure is simple: ONE main road winds from the lower left toward the upper right and ends at the BLACK GATE FORTRESS, a broken but still towering ruin-stronghold, upper right - the largest structure on the whole map, clearly the destination of the journey. SIX TO EIGHT short SPUR roads branch off the main road and end in DEAD ENDS, each stopping at one small sculpted landmark. The longer a spur, the grander its final landmark. No other road shapes, no zigzag, no loops, no free-floating road pieces.
Along the roads sit the STATIONS: small round markers chiselled into the ground, flat discs of PURE BLACK stone, matte, no shading inside, no highlight, all discs exactly the SAME size and the SAME pure black. AT LEAST 40 STATIONS in total: about 26 of them spaced evenly along the main road, the rest on the spurs with one to three stations each and always one on every dead end. Neighbouring discs keep a gap of at least three disc-widths and must never touch or overlap. Pure black appears NOWHERE ELSE in the image - every shadow stays soft grey - so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2 at 3840x2560 pixels. Full bleed, no margin.
```

### 08 - Kapitel VIII - Sattelweite
*Datei: `karte-08.png`*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Dry grass golds. Olive greens. Warm leather browns. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, fields, hills and buildings are physical forms rather than painted textures. WATER is the one exception: rivers, lakes and sea read as REAL LIQUID - glassy, gently reflective, with a soft natural flow around stones and under bridges - resin-poured water in a miniature, never carved stone, never frosted, never a painted blue stripe. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: the endless rider plains: rolling sculpted grass seas, round yurt camps with tiny corrals, rider trails, one lone signal tower on a far hill under an enormous sky. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #b09a52, #c9ae62 and #8a6f3a - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board - this part is functional)
A network of sculpted road channels crosses the land, sunk into the terrain like carved grooves, never painted on. The roads are DISTINCTLY PALER than everything around them - pale bone-white stone against the coloured land, high contrast, clean sharp edges, so a script can trace them reliably. The roads stay COMPLETELY CLEAR: no houses, no trees, no rocks, no carts, nothing may stand ON a road or overlap its edges - every building and landmark sits BESIDE the road, never on it. THE ROAD IS ONE TREE. Picture the entire road network as ONE tree lying across the land. Its ROOT is the single point where the main road enters the map at the LOWER LEFT edge - the only place where any road touches any border of the image. Its TRUNK is the main road: draw it FIRST, as one continuous unbroken stroke from that lower-left entry all the way to the gate of the fortress. Its BRANCHES are the spurs: each one starts ON the trunk and grows out of it - at every junction the two carved channels merge seamlessly, same width, same depth, same pale stone - and most branches end inside the map at their dead-end landmark. On this map, two rider trails leave the trunk together and sweep in WIDE parallel arcs through the grass sea before rejoining - the widest parallel stretch of all eleven maps; few dead ends, but long ones. A road segment that does not grow out of the trunk simply does not exist; there is no road anywhere on this map that cannot be walked back, road only, to the lower-left entry. Where the trunk or a branch meets water it crosses on a sculpted bridge; where it meets a ridge it passes through a carved notch; no river, cliff or building ever interrupts it.
ROUTE CHARACTER OF THIS CHAPTER - make this map clearly different from the other chapters: The trunk sweeps in huge open curves under the enormous sky.
The structure is simple: ONE main road winds from the lower left toward the upper right and ends at the KHAN'S RING, a vast circular earthwork fortress with banner poles, upper right - the largest structure on the whole map, clearly the destination of the journey. SIX TO EIGHT short SPUR roads branch off the main road and end in DEAD ENDS, each stopping at one small sculpted landmark. The longer a spur, the grander its final landmark. No other road shapes, no zigzag, no loops, no free-floating road pieces.
Along the roads sit the STATIONS: small round markers chiselled into the ground, flat discs of PURE BLACK stone, matte, no shading inside, no highlight, all discs exactly the SAME size and the SAME pure black. AT LEAST 40 STATIONS in total: about 26 of them spaced evenly along the main road, the rest on the spurs with one to three stations each and always one on every dead end. Neighbouring discs keep a gap of at least three disc-widths and must never touch or overlap. Pure black appears NOWHERE ELSE in the image - every shadow stays soft grey - so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2 at 3840x2560 pixels. Full bleed, no margin.
```

### 09 - Kapitel IX - Die Wunde
*Datei: `karte-09.png`*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Terracotta reds. Deep canyon shadows in soft grey. Warm sandstone oranges. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, fields, hills and buildings are physical forms rather than painted textures. WATER is the one exception: rivers, lakes and sea read as REAL LIQUID - glassy, gently reflective, with a soft natural flow around stones and under bridges - resin-poured water in a miniature, never carved stone, never frosted, never a painted blue stripe. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: the rift itself: a deep sculpted red canyon cutting the land in two, cliff dwellings carved into the walls, hanging stairs and rope walkways descending level by level toward the shadowed floor. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #b0603a, #c97a4a and #8a3a2a - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board - this part is functional)
A network of sculpted road channels crosses the land, sunk into the terrain like carved grooves, never painted on. The roads are DISTINCTLY PALER than everything around them - pale bone-white stone against the coloured land, high contrast, clean sharp edges, so a script can trace them reliably. The roads stay COMPLETELY CLEAR: no houses, no trees, no rocks, no carts, nothing may stand ON a road or overlap its edges - every building and landmark sits BESIDE the road, never on it. THE ROAD IS ONE TREE. Picture the entire road network as ONE tree lying across the land. Its ROOT is the single point where the main road enters the map at the LOWER LEFT edge - the only place where any road touches any border of the image. Its TRUNK is the main road: draw it FIRST, as one continuous unbroken stroke from that lower-left entry all the way to the gate of the fortress. Its BRANCHES are the spurs: each one starts ON the trunk and grows out of it - at every junction the two carved channels merge seamlessly, same width, same depth, same pale stone - and most branches end inside the map at their dead-end landmark. On this map, the trunk descends the canyon in levels, and one branch takes the walkway one level BELOW, rejoining at a shared stair; the other branches are dead-end spurs onto viewing ledges. A road segment that does not grow out of the trunk simply does not exist; there is no road anywhere on this map that cannot be walked back, road only, to the lower-left entry. Where the trunk or a branch meets water it crosses on a sculpted bridge; where it meets a ridge it passes through a carved notch; no river, cliff or building ever interrupts it.
ROUTE CHARACTER OF THIS CHAPTER - make this map clearly different from the other chapters: The trunk hugs the canyon wall, visibly stepping down level by level.
The structure is simple: ONE main road winds from the lower left toward the upper right and ends at the RIM FORTRESS, a stronghold grown out of the canyon wall above the abyss, upper right - the largest structure on the whole map, clearly the destination of the journey. SIX TO EIGHT short SPUR roads branch off the main road and end in DEAD ENDS, each stopping at one small sculpted landmark. The longer a spur, the grander its final landmark. No other road shapes, no zigzag, no loops, no free-floating road pieces.
Along the roads sit the STATIONS: small round markers chiselled into the ground, flat discs of PURE BLACK stone, matte, no shading inside, no highlight, all discs exactly the SAME size and the SAME pure black. AT LEAST 40 STATIONS in total: about 26 of them spaced evenly along the main road, the rest on the spurs with one to three stations each and always one on every dead end. Neighbouring discs keep a gap of at least three disc-widths and must never touch or overlap. Pure black appears NOWHERE ELSE in the image - every shadow stays soft grey - so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2 at 3840x2560 pixels. Full bleed, no margin.
```

### 10 - Kapitel X - Sonnenschlund
*Datei: `karte-10.png`*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Ochre sands. Sun-bleached adobe creams. One restrained oasis green. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, fields, hills and buildings are physical forms rather than painted textures. WATER is the one exception: rivers, lakes and sea read as REAL LIQUID - glassy, gently reflective, with a soft natural flow around stones and under bridges - resin-poured water in a miniature, never carved stone, never frosted, never a painted blue stripe. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: the desert that swallows names: sculpted dune seas, adobe towers, caravan wells along the road, one green oasis with a few chunky palms, sun-bleached ruins half sunk in sand. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #d9a95c, #e8c377 and #b0763a - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board - this part is functional)
A network of sculpted road channels crosses the land, sunk into the terrain like carved grooves, never painted on. The roads are DISTINCTLY PALER than everything around them - pale bone-white stone against the coloured land, high contrast, clean sharp edges, so a script can trace them reliably. The roads stay COMPLETELY CLEAR: no houses, no trees, no rocks, no carts, nothing may stand ON a road or overlap its edges - every building and landmark sits BESIDE the road, never on it. THE ROAD IS ONE TREE. Picture the entire road network as ONE tree lying across the land. Its ROOT is the single point where the main road enters the map at the LOWER LEFT edge - the only place where any road touches any border of the image. Its TRUNK is the main road: draw it FIRST, as one continuous unbroken stroke from that lower-left entry all the way to the gate of the fortress. Its BRANCHES are the spurs: each one starts ON the trunk and grows out of it - at every junction the two carved channels merge seamlessly, same width, same depth, same pale stone - and most branches end inside the map at their dead-end landmark. On this map, one branch swings around the far side of a great dune and rejoins beyond it; the other branches are dead-end spurs to caravan wells, one of them long, out to the green oasis. A road segment that does not grow out of the trunk simply does not exist; there is no road anywhere on this map that cannot be walked back, road only, to the lower-left entry. Where the trunk or a branch meets water it crosses on a sculpted bridge; where it meets a ridge it passes through a carved notch; no river, cliff or building ever interrupts it.
ROUTE CHARACTER OF THIS CHAPTER - make this map clearly different from the other chapters: The trunk weaves between the dunes like a caravan track.
The structure is simple: ONE main road winds from the lower left toward the upper right and ends at the DUNE CITADEL, a mighty adobe fortress rising from the sand, upper right - the largest structure on the whole map, clearly the destination of the journey. SIX TO EIGHT short SPUR roads branch off the main road and end in DEAD ENDS, each stopping at one small sculpted landmark. The longer a spur, the grander its final landmark. No other road shapes, no zigzag, no loops, no free-floating road pieces.
Along the roads sit the STATIONS: small round markers chiselled into the ground, flat discs of PURE BLACK stone, matte, no shading inside, no highlight, all discs exactly the SAME size and the SAME pure black. AT LEAST 40 STATIONS in total: about 26 of them spaced evenly along the main road, the rest on the spurs with one to three stations each and always one on every dead end. Neighbouring discs keep a gap of at least three disc-widths and must never touch or overlap. Pure black appears NOWHERE ELSE in the image - every shadow stays soft grey - so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2 at 3840x2560 pixels. Full bleed, no margin.
```

### 11 - Kapitel XI - Endloses Meer
*Datei: `karte-11.png`*

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Deep sea blues. Turquoise shallows. Weathered timber browns. Pale sail creams. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, fields, hills and buildings are physical forms rather than painted textures. WATER is the one exception: rivers, lakes and sea read as REAL LIQUID - glassy, gently reflective, with a soft natural flow around stones and under bridges - resin-poured water in a miniature, never carved stone, never frosted, never a painted blue stripe. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: the harbour at the edge of the world: a sculpted coastal town with a stout lighthouse, moored ships with folded sails, stone piers, small islands scattered toward the horizon - here the main road runs along the coast and out over stone causeways from island to island. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #2e6a8a, #3f7fa0 and #1e4a66 - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board - this part is functional)
A network of sculpted road channels crosses the land, sunk into the terrain like carved grooves, never painted on. The roads are DISTINCTLY PALER than everything around them - pale bone-white stone against the coloured land, high contrast, clean sharp edges, so a script can trace them reliably. The roads stay COMPLETELY CLEAR: no houses, no trees, no rocks, no carts, nothing may stand ON a road or overlap its edges - every building and landmark sits BESIDE the road, never on it. THE ROAD IS ONE TREE. Picture the entire road network as ONE tree lying across the land. Its ROOT is the single point where the main road enters the map at the LOWER LEFT edge - the only place where any road touches any border of the image. Its TRUNK is the main road: draw it FIRST, as one continuous unbroken stroke from that lower-left entry all the way to the gate of the fortress. Its BRANCHES are the spurs: each one starts ON the trunk and grows out of it - at every junction the two carved channels merge seamlessly, same width, same depth, same pale stone - and most branches end inside the map at their dead-end landmark. On this map, two stone causeway chains leave the coast at different piers, hop across DIFFERENT small islands and rejoin on the last island before the bastion; the remaining branches are short dead-end causeways to lone isles. A road segment that does not grow out of the trunk simply does not exist; there is no road anywhere on this map that cannot be walked back, road only, to the lower-left entry. Where the trunk or a branch meets water it crosses on a sculpted bridge; where it meets a ridge it passes through a carved notch; no river, cliff or building ever interrupts it.
ROUTE CHARACTER OF THIS CHAPTER - make this map clearly different from the other chapters: The trunk runs along the coast, then out to sea from island to island.
The structure is simple: ONE main road winds from the lower left toward the upper right and ends at the SEA BASTION, a lighthouse-fortress on the last island, upper right - the largest structure on the whole map, clearly the destination of the journey. SIX TO EIGHT short SPUR roads branch off the main road and end in DEAD ENDS, each stopping at one small sculpted landmark. The longer a spur, the grander its final landmark. No other road shapes, no zigzag, no loops, no free-floating road pieces.
Along the roads sit the STATIONS: small round markers chiselled into the ground, flat discs of PURE BLACK stone, matte, no shading inside, no highlight, all discs exactly the SAME size and the SAME pure black. AT LEAST 40 STATIONS in total: about 26 of them spaced evenly along the main road, the rest on the spurs with one to three stations each and always one on every dead end. Neighbouring discs keep a gap of at least three disc-widths and must never touch or overlap. Pure black appears NOWHERE ELSE in the image - every shadow stays soft grey - so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2 at 3840x2560 pixels. Full bleed, no margin.
```

---

## Die Weltuebersicht
*Datei: `weltkarte.png`*

Genau ELF Punkte - einer je Kapitel, keiner mehr.

```
STYLE
Create a physically believable handcrafted tabletop world, photographed like a premium museum-quality miniature. The image must NOT look painted, illustrated or like concept art. Instead, it should look like a REAL three-dimensional miniature landscape that was sculpted by hand and photographed with a high-end camera. Everything has actual volume and precise geometry.

SURFACE & MATERIAL
The terrain is carved from matte stone-clay with subtle handcrafted tool marks and extremely fine sculpted detail. Clean, razor-sharp edges. Crisp silhouettes. Visible physical depth. No painterly brush strokes. No watercolor. No soft digital rendering. No plastic. No glossy varnish. No AI-smoothed surfaces. Every surface feels handcrafted, tactile and real.

COLOUR
Natural but slightly rich colours. Fresh greens, wheat golds, amber browns, slate blues, glacier greys, ash beiges, dry grass golds, terracotta reds, ochre sands, deep sea blues - one restrained hue per region. Colours remain matte, realistic and restrained. Never oversaturated. Never glowing.

GEOMETRY
Everything is sculpted. Roads, fields, hills and buildings are physical forms rather than painted textures. WATER is the one exception: rivers, lakes and sea read as REAL LIQUID - glassy, gently reflective, with a soft natural flow around stones and under bridges - resin-poured water in a miniature, never carved stone, never frosted, never a painted blue stripe. Avoid fragmented terrain plates or puzzle-like subdivisions. Terrain flows naturally with continuous rolling shapes and clean transitions. Buildings are simplified, chunky and handcrafted.

LIGHT
Single soft sunlight from the upper left. Soft realistic shadows. No bloom. No dramatic contrast. No cinematic effects. Only a faint atmospheric haze near the distant horizon.

CAMERA
High three-quarter tabletop view. Visible horizon. Gentle perspective. The playable area fills most of the image and feels close to the camera. The world reads mainly left-to-right without strong foreshortening.

QUALITY
Ultra-high-resolution. Extremely crisp. Every carved edge remains perfectly defined. The image should feel like a professional macro photograph of a handcrafted fantasy board-game terrain.

OVERALL IMPRESSION
The world must look like a professionally photographed physical miniature terrain, NOT like artwork depicting a miniature terrain. The viewer should immediately believe this landscape physically exists as a handcrafted tabletop model. The environment must use the exact same material language as the handcrafted chess pieces that stand on top of it.

SCENE
A CAMPAIGN REGION of the chess kingdom as one handcrafted miniature: the WHOLE kingdom seen at once, eleven regions flowing into each other from the near foreground to the far coast: green heartland with the crown city, golden grain belt, amber oak forest, a highland belt with a visible treeline, grey watch mountains, cloud-wrapped high passes, ash flats, wide rider plains, a deep red canyon, an ochre desert, and at the horizon the endless sea with a lighthouse. Each region stays simple - one landmark each, no clutter. The upper part of the image is open sky above the visible horizon - pale, quiet, with only a faint haze and two or three thin drifting veils of cloud low over the land; the sky must look like air, not like sculpted material.

SCENE COLOUR
The land leans toward the chapter hues #6f9a5c, #b09a52 and #2e6a8a - muted, natural, matte; stage colours, not signal colours.

ROADS & STATIONS (the map is a game board - this part is functional)
A network of sculpted road channels crosses the land, sunk into the terrain like carved grooves, never painted on. The roads are DISTINCTLY PALER than everything around them - pale bone-white stone against the coloured land, high contrast, clean sharp edges, so a script can trace them reliably. The roads stay COMPLETELY CLEAR: no houses, no trees, no rocks, no carts, nothing may stand ON a road or overlap its edges - every building and landmark sits BESIDE the road, never on it. THE ROAD IS ONE TREE. Picture the entire road network as ONE tree lying across the land. Its ROOT is the single point where the main road enters the map at the LOWER LEFT edge - the only place where any road touches any border of the image. Its TRUNK is the main road: draw it FIRST, as one continuous unbroken stroke from that lower-left entry all the way to the gate of the fortress. Its BRANCHES are the spurs: each one starts ON the trunk and grows out of it - at every junction the two carved channels merge seamlessly, same width, same depth, same pale stone - and most branches end inside the map at their dead-end landmark. On this map, there are no branches at all - one single journey road. A road segment that does not grow out of the trunk simply does not exist; there is no road anywhere on this map that cannot be walked back, road only, to the lower-left entry. Where the trunk or a branch meets water it crosses on a sculpted bridge; where it meets a ridge it passes through a carved notch; no river, cliff or building ever interrupts it.
ROUTE CHARACTER OF THIS CHAPTER - make this map clearly different from the other chapters: One single journey road crossing every region, no branches.
The structure is simple: ONE main road winds from the lower left toward the upper right and ends at the SEA BASTION, a lighthouse-fortress at the very end of the journey on the last island, upper right - the largest structure on the whole map, clearly the destination of the journey. SIX TO EIGHT short SPUR roads branch off the main road and end in DEAD ENDS, each stopping at one small sculpted landmark. The longer a spur, the grander its final landmark. No other road shapes, no zigzag, no loops, no free-floating road pieces.
Along the roads sit the STATIONS: small round markers chiselled into the ground, flat discs of PURE BLACK stone, matte, no shading inside, no highlight, all discs exactly the SAME size and the SAME pure black. EXACTLY ELEVEN STATIONS, one per region, each disc sitting at that region's landmark along the journey road. Not a single marker more. Neighbouring discs keep a gap of at least three disc-widths and must never touch or overlap. Pure black appears NOWHERE ELSE in the image - every shadow stays soft grey - so the marker positions can be read back automatically by a script.

STAGE RULE
This is a STAGE, not a hero image: calm, matte, lower contrast than the chess pieces that will stand on it. A few well-placed details, never clutter. Nothing here may compete with the figures.

LEAVE OUT
No numbers, no labels, no text of any kind, no frame, no border, no vignette, no dark corners, no compass rose, no chess pieces. The world fills the entire frame edge to edge, full bleed, no margin.

OUTPUT
Landscape 3:2 at 3840x2560 pixels. Full bleed, no margin.
```

---

## Danach

ZIP an mich. Ich lese je Karte die Stationen aus, pruefe die Mindestzahl, baue
Hauptweg-Reihung und Sackgassen daraus, schreibe die Positionstabelle, setze
die Tiefenskalierung, webp, Einbau, Chromium-Nachmessung, Push.
