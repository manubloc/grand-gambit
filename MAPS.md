# GAMBIT — Maps (Design)

Ziel: Partien laufen auf **Maps** — Bretter mit unterschiedlicher **Größe** *und*
**Form** (Löcher/Hindernisse). Klassisches 8×8-Schach ist dabei immer eine feste
Map. In der Kampagne **wächst** das Brett Etappe für Etappe — dieser Anstieg
*ist* das Tutorial, ganz ohne erfundene Story.

Dieses Dokument denkt das Modell zu Ende, bevor die Engine umgebaut wird.

---

## 1. Brettmodell

Ein Brett ist eine **Bounding-Box `w × h`** plus eine Menge **`holes`** (gesperrte
Zellen, die nicht zum Spielfeld gehören). Daraus folgt alles:

```
spielbare Zelle  :=  in der Box  UND  kein Loch
Array-Index      :=  r * w + f          (verallgemeinert das heutige r*10+f)
```

Das ist exakt die heutige 10×10-Welt, nur mit `w/h` als Variablen statt der
globalen Konstante `10` und einem optionalen Lochmuster. Klassisches Schach ist
dann schlicht `w=8, h=8, holes=[]`.

### Bewegung mit Hindernissen
Löcher verhalten sich wie **Wände** — eine einzige Regel, überall konsistent:
- Keine Figur darf auf einem Loch landen (Schritt, Sprung, Schlag).
- Gleitende Figuren (Turm/Läufer/Dame …) werden von einem Loch **blockiert**, wie vom Brettrand.
- Springer/Weitsprünge können nicht auf Löchern landen.
- Bauern können nicht in ein Loch vorrücken oder hineinschlagen.
- **Angriffsstrahlen** werden von Löchern blockiert → Schach-/Mattprüfung respektiert Wände automatisch.
- Ein König steht nie auf einem Loch.

Technisch heißt das: die einzige Stelle, die sich ändert, ist `inBounds(f,r)` →
`isPlayable(map,f,r)`. Zug-Generierung, Schlaglogik und Angriffserkennung lesen
nur noch diese eine Funktion.

### Bauern & Umwandlung
Bauern bleiben **reihen-orientiert** (Weiß nach oben, Schwarz nach unten). Start-
und Umwandlungsreihen kommen aus der Map. Auf einer schief geformten Map kann ein
Bauer in einer Spalte mal keinen Weg haben — das ist eine **Design-Vorgabe an die
Map** (Map-Autoren bauen sinnvolle Felder), keine Sonderregel in der Engine.

---

## 2. Aufstellung pro Map

Ein 6er-Brett hat eine kürzere Grundreihe als ein 10er — die Aufstellung muss zur
Breite passen. Jede Map trägt darum eine **Grundreihen-Vorgabe**:

```
formation: { required: { king:1, queen:1, rook:R, bishop:B }, flex: N }
           ── Summe der Pflichtfiguren + flex === w
defaultFormation: [charId, … ]   ── Länge === w
```

Die schweren Figuren sind in der Anzahl fix (Balance), die `flex`-Slots füllst du
mit Springer/Feenfiguren. Der **Aufstellungs-Editor wird map-bewusst**: vor jeder
Partie wählst du eine zur Map passende Aufstellung — das ist die taktische Ebene,
die du wolltest. Aufstellungen werden **pro Brettbreite** gemerkt (deine 10er-
Aufstellung bleibt, daneben eine 8er, eine 6er …).

---

## 3. Klassisches Schach als Map

Es gibt immer eine Map **`classic` (8×8)** mit der Standard-Grundreihe
`R N B Q K B N R`, Bauern auf Reihe 2/7, keine Löcher. Ein `classic: true`-Flag
baut **beide Armeen auf Grundstufe** — keine Schilde, keine Fähigkeiten — also
echtes Schach, nicht „GAMBIT auf 8 Feldern". So bleibt das pure Spiel jederzeit
spielbar, unabhängig vom Fortschritt.

---

## 4. Maps sind Daten

Der Katalog liegt in `content/maps.js`. Eine neue Map ist ein Daten-Eintrag
(Größe, Löcher, Grundreihe, Flags). Nur eine echt neue Regel bräuchte zusätzlich
einen Handler im Kern — das Brettmodell selbst bleibt unangetastet.

Beispiel-Katalog (erste Bausteine, bereits angelegt + getestet):
- **Klassik** — 8×8, Standard-Schach, `classic`
- **Arena** — 10×10, das volle GAMBIT (heutiges Spiel)
- **Scharmützel** — 6×6, wenige Figuren (kleiner Kampagne-Start = Tutorial)
- **Hof** — 8×8 mit 4 Löchern in der Mitte (Form)
- **Schneise** — 8×8 mit Hindernis-Spalten (Hindernisse)

---

## 5. Kampagne = Tutorial

Die frühen Etappen laufen auf **kleinen** Maps mit wenigen Figuren; Größe *und*
Figurenpool wachsen mit jeder Etappe bis zur 10×10-Arena. Der Komplexitäts-Anstieg
übernimmt das Onboarding — keine erfundene Geschichte, nur ein sauberer Ramp.

---

## 6. Bauphasen

1. **Datenmodell + Validierung (erledigt):** `content/maps.js` mit Katalog, Masken-
   /Geometrie-Helfern und `validateMap`; eigene Test-Suite. Additiv, ändert die
   laufende App nicht.
2. **Engine parametrisieren:** `w/h/holes` in den Match-Zustand holen; Geometrie,
   Zug-Generierung, Schlag-/Angriffslogik, Setup, Bewertung und Serialisierung
   lesen Maße + Maske aus dem Zustand. **Verhalten für 10×10 ohne Löcher bleibt
   identisch** (alle bestehenden Tests grün), neue Tests für kleine Bretter + Löcher.
3. **Spielfluss:** map-bewusster Aufstellungs-Editor + Aufstellungswahl vor der
   Partie; Map-Auswahl im Schnellspiel; `classic`-Modus; Kampagne als Folge
   wachsender Maps.
4. **Form-Feinschliff:** unregelmäßige Start-Setups, mehr Maps, Hindernis-Varianten.

---

## 7. Offene Punkte (bewusst markiert)

- Bauern-Verhalten auf unregelmäßigen Formen (Sackgassen) → Map-Design-Regel.
- Strenge von `classic` (komplett ohne Fähigkeiten/Schilde, oder optional).
- Speicherung der Aufstellung **pro Breite** vs. pro einzelner Map.
- Setup auf schiefen Formen: Grundreihe-Vorlage (rechteckig) vs. explizite Start-
  felder (unregelmäßig) — Map trägt das jeweils passende.
