# Grand Gambit — Klang-Prompts

Katalog für die Klangerzeugung (ElevenLabs Sound Effects, Stable Audio, ähnliche).
Prompts auf **Englisch**, weil die Modelle darauf trainiert sind. Deutsch daneben
steht nur, wofür der Klang gedacht ist.

## Die Klangwelt in einem Satz

Zwei Materialien, klar getrennt — daran hängt die ganze Bildsprache des Spiels:

- **Der Hof (eigene Seite, Gold):** geschnitztes Holz auf Stein. Warm, trocken,
  kurz, handgemacht. Kein Fantasy-Kitsch, keine Glöckchen, keine Zauberstäbe.
- **Der Riss (Gegner, Violett):** dieselbe Welt, aber elektrisiert. Entladung,
  Kristall, umgekehrte Hallfahnen, ein Hauch Chor — nie Horror, nie Splatter.

Grundregel für alles: **würdevoll, nicht niedlich.** Wenn ein Klang wie ein
Handyspiel klingt, ist er falsch.

## Technische Vorgaben (für jeden Klang gleich)

- **Format:** WAV mono 48 kHz beim Erzeugen → für die App als `.webm` (Opus)
  oder `.mp3` mit ~96 kbit/s ablegen.
- **Länge:** Spielklänge 0,15–0,6 s. Feierklänge 1,2–2,5 s. Nichts darüber.
- **Kein Vorlauf:** Der Klang muss in den ersten 10 ms beginnen — sonst wirkt
  die Bedienung träge. Stille am Anfang hinterher wegschneiden.
- **Lautheit:** auf etwa −18 LUFS normieren, Spitzen unter −3 dBFS. Der
  Soundtrack läuft darunter weiter und darf nicht zugedeckt werden.
- **Trocken erzeugen**, Hall lieber sparsam — auf dem Handylautsprecher matscht
  langer Nachhall sofort.
- **Wichtig fürs Gefühl:** Zug- und Schlagklänge brauchen 2–3 Varianten, sonst
  ermüdet das Ohr nach zwanzig Zügen. Beim Abspielen zufällig wählen und die
  Tonhöhe um ±4 % streuen.

---

## 1. Das Brett — die Klänge, die man tausendmal hört

Diese fünf tragen das ganze Spielgefühl. Hier lohnt die meiste Mühe.

**Figur anwählen** — *tap-select.wav*, 3 Varianten
> A single small wooden chess piece being lifted off a stone board, very short and dry, soft wooden knock with a faint stone scrape, close-miked, no reverb, no music, 150 ms

**Figur setzen (normaler Zug)** — *move-place.wav*, 3 Varianten
> A carved wooden chess piece placed firmly on a stone chessboard, one crisp warm knock with a short woody body, close-miked, dry, no reverb tail, 200 ms

**Schlagen ohne Tod (HP-Schaden)** — *hit.wav*, 2 Varianten
> Wooden figure struck hard by another wooden figure, dull cracking impact with a low woody thud, small splinter detail, dry and close, no music, 250 ms

**Tödlicher Schlag (Figur fällt)** — *capture-kill.wav*
> A wooden chess piece knocked over and falling onto a stone slab, sharp impact then a short hollow wooden roll that settles, dry, close-miked, no reverb, 500 ms

**Ungültiger Zug / gesperrt** — *denied.wav*
> A short muted wooden bump against a solid stop, damped and low, no ring, no beep, felt rather than heard, 120 ms

---

## 2. Die Sonderzüge des Schachs

**Rochade** — *castle.wav*
> Two wooden chess pieces sliding and settling in quick succession on stone, a soft double placement, the second slightly deeper, dry and warm, 400 ms

**Bauernumwandlung** — *promote.wav*
> A warm ascending shimmer of struck wood and soft brass, like a small carved figure growing taller, ending on a bright confident note, gentle and dignified, no fanfare cliché, 1200 ms

**Schach!** — *check.wav*
> A single tense low string swell with a dull bell struck once far away, warning and serious, dry, no melody, 700 ms

---

## 3. Der Hof — Fähigkeiten der eigenen Seite (Gold)

**Talent einsetzen (allgemein)** — *ability-gold.wav*
> A short warm gold shimmer over a wooden knock, struck metal with a soft rising tail, noble and restrained, dry, 400 ms

**Sturmschritt / schneller Vorstoß** — *ability-charge.wav*
> A quick woody scrape rushing forward, air movement and a firm landing knock, dry, urgent, no whoosh cliché, 350 ms

**Drachenflug** — *dragon-flight.wav*
> Heavy carved wings beating twice, deep air displacement, then a weighty landing thud on stone that shakes slightly, wooden and massive, dry, 900 ms

**Lebenstrank trinken** — *potion.wav*
> A small glass vial uncorked with a soft pop, a short liquid swallow, then a warm gentle glow tone rising, close and intimate, 800 ms

**Zeitenwender (Zug zurücknehmen)** — *undo.wav*
> Sand running backwards inside an hourglass, a soft reversed granular hiss with a gentle wooden click at the end, dry, 700 ms

**Zeitriss (Zug spannen)** — *timeshift.wav*
> A low humming charge building for a moment then snapping taut, glassy and violet in character, restrained, no explosion, 600 ms

---

## 4. Der Riss — die Gegenseite (Violett)

Immer eine Spur kälter, elektrischer, mit umgekehrten Fahnen. Nie Horror.

**Riss-Blitz (Figur des letzten Zuges)** — *rift-spark.wav*
> A short violet electrical crackle over a wooden knock, glassy discharge with a fine crystalline tail that fades slowly, cold and eerie but quiet, 900 ms

**Bestie erscheint** — *beast-appear.wav*
> A deep stone grinding open, a cold breath of air escaping, distant hollow voices layered under it, ominous but restrained, no monster roar, 1600 ms

**Meister betritt das Feld (Kapitelboss)** — *master-enter.wav*
> A single deep struck bell with heavy stone impact, low male choir hum swelling underneath, dark and ceremonial, ominous, 2200 ms

**Riss-Fähigkeit einsetzen** — *ability-rift.wav*
> A glassy violet snap with a reversed shimmer leading into it, cold crystalline texture, short and sharp, 450 ms

---

## 5. Fortschritt und Feier

**Sieg** — *victory.wav*
> A warm triumphant chord on strings and soft brass with a struck gong underneath, noble and medieval, rising then settling with dignity, no cheerful jingle, 2400 ms

**Niederlage** — *defeat.wav*
> A descending low string phrase with a hollow wooden fall, resigned and quiet, dark but not cruel, ends dry, 2000 ms

**Stufenaufstieg** — *level-up.wav*
> A bright warm shimmer of struck metal rising in three steps, gold and confident, with a soft wooden knock landing at the end, 1400 ms

**Fähigkeit freigeschaltet** — *unlock-ability.wav*
> A carved stone lock turning and opening, then a warm golden shimmer blooming out of it, satisfying and earned, 1200 ms

**Held rekrutiert** — *recruit.wav*
> A wooden figure set down firmly on a stone base, followed by a short warm horn call in the distance, ceremonial and brief, 1600 ms

**Kapitel abgeschlossen** — *chapter-done.wav*
> A distant church bell struck once over a warm string swell, a page of parchment turning, closing and peaceful, 2400 ms

**Gold erhalten / Kauf beim Händler** — *coins.wav*
> A small handful of old coins dropped into a leather pouch, dull metallic clinking, close and dry, no cash register brightness, 600 ms

---

## 6. Menü und Karte

**Menü-Tipp (Knopf)** — *ui-tap.wav*
> A soft wooden tap on a thick parchment page, very short, warm, no click, no beep, 100 ms

**Blatt öffnen (Popup / Chronik)** — *sheet-open.wav*
> A single sheet of old parchment lifted and unfolded, dry paper texture, short and clean, 400 ms

**Blatt schließen** — *sheet-close.wav*
> Parchment folded and set down softly, dry, brief, 300 ms

**Station auf der Karte antippen** — *map-node.wav*
> A small carved wooden marker pressed into a map, soft wooden press with a faint paper crackle, 250 ms

**Station freigeschaltet** — *map-unlock.wav*
> A soft golden shimmer spreading over parchment with a distant wooden click, brief and rewarding, 800 ms

**Herold / wichtige Ansage** — *herald.wav*
> A short distant horn call over parchment rustle, medieval and announcing, restrained, 1200 ms

---

## Reihenfolge beim Bauen

Wenn du nicht alles auf einmal erzeugen willst — diese Reihenfolge bringt das
meiste Gefühl pro Aufwand:

1. **Setzen, Anwählen, Schlagen, tödlicher Schlag** (das Brett trägt alles)
2. **Sieg, Niederlage, Schach**
3. **Stufenaufstieg, Fähigkeit freigeschaltet, Gold**
4. **Riss-Blitz, Bestie erscheint, Meister**
5. Menü, Karte, Sonderzüge

Wenn die Dateien da sind, baue ich die Klangschicht mit derselben Regel wie beim
Soundtrack: **abschaltbar, standardmäßig leise, nie erzwungen** — plus einen
eigenen Regler für Effekte getrennt von der Musik.
