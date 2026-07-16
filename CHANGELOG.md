# Changelog — Grand Gambit

## 0.21.74
- KARTE: statt "Weltkarte"-Pill jetzt ein +/- UNTEREINANDER (minus = raus zur Weltkarte, plus = zurueck in die Liga; inaktive Richtung gedimmt) - die Kapitel-Pille steht damit frei; die Kopfzeile sitzt 8px tiefer. NEBEL deutlich praesenter (Kartenfenster 0.28, Weltkarten-Schleier 0.72/0.55, groessere Schwaden)
- BRETT: das Gluehen/Vignette des Schachbretts ist KOMPLETT entfernt; Figuren nochmal minimal groesser (0.99em) und heller (1.36), eigene Figuren weniger orange/mehr gelb (hue +8); FEINDE weisser statt blau (Saettigung 0.32, Helligkeit 1.02/1.2) - und hinter JEDER feindlichen Figur steigt ganz leiser RAUCH auf (geblurte Schwade, 5.5s-Zyklus)
- KOPFLEISTE: die 4 Menuepunkte auf Desktop MITTIG; das GG-Emblem ist im BILD selbst gelber getuned (Hue +7, Saettigung 1.22); die Schatz-Chips liegen NEBENEINANDER und sind hochwertig neu gezeichnet (facettierte Gold-Icons mit Sheen und Schlagschatten, Serif-Ziffern mit Tabellenziffern, satter Doppelrand) - dieselben Icons jetzt auch beim Kontostand im Hofstaat
- ABSTAENDE: die Kopfleiste steht in JEDEM Menue fuer sich (22px Luft zum Inhalt, Desktop + Mobil); Hofstaat-Kacheln nochmals groesser (Slots bis 74px, Boss-Bilder 78px), mehr Luft um die Bauern-Reihe-Zeile und ueber dem Kontostand
- AUFGERAEUMT: Meta-Texte ohne "kostenlos"; der Admin-Passwort-Hinweis beim Anmelden ist raus; "Willkommen, Admin · Admin" zeigt das Admin-Etikett nur noch, wenn der Name nicht schon Admin lautet

## 0.21.73
- LOGIN + SPIELSTAND repariert: beide Schirme auf REINEM SCHWARZ (das Schachbrett/Hallen-Panorama hinter der Spielstand-Auswahl ist entfernt - wo Ritter und Schriftzug stehen, braucht es kein Brett)
- CONTAIN STATT ABSCHNEIDEN: die Zentrierung lief in die klassische Flexbox-Falle (justify-content: center + Overflow schneidet oben ab). Jetzt margin-auto-Container: passt der Inhalt, steht er exakt mittig OHNE Scrollen - passt er nicht (kleine Schirme), scrollt es sauber ab der ersten Zeile. Bild kompakter gedeckelt (Login 30vh, Spielstand 22vh), Abstaende gestrafft

## 0.21.72
- FIGUREN AUF DEM BRETT: deutlich heller (eigene brightness 1.3, Feind 1.18) und GROESSER - die Kunst bekommt 16% mehr Hoehe als die Kachel, der Kopf ragt bewusst leicht ueber das Feld hinaus (Figur sitzt unten auf)
- NEUE WERTE-ANORDNUNG UM DIE FIGUR: LINKS die Lebenspunkte zweireihig vertikal (Schwergewichte: vertikale Lebenssaeule), RECHTS die Faehigkeiten zweireihig vertikal (aktiv bunt, verbraucht grau), OBEN LINKS der Angriffswert als Gold-Raute, OBEN RECHTS wie gehabt das Level - die Figur selbst bleibt frei
- GOLD APP-WEIT EINEN HAUCH GELBER (lime/gold/goldBright verschoben), auch das GRAND-GAMBIT-Startbild minimal gelber gesaettigt (Hue +6, Saettigung 1.12) - Rand-Feder bleibt

## 0.21.71
- LOGIN/SPIELSTAND: Ritter-Artwork groesser (bis 700px / 42vh) mit mehr Luft zum Text; RAND-FEDER statt harter Kante - innen 100% Original, nur die Raender schmelzen ins Schwarze (oben kraeftig), kein Rechteck-Hintergrund mehr; beide Schirme sind jetzt BILDSCHIRMFUELLEND OHNE SCROLLEN (Inhalt zentriert, gescrollt wird nur falls er wirklich nicht passt)
- KOPFLEISTE: nur noch das GG-EMBLEM (groesser, heller, goldener Glanz-Schein) - die Wortmarke ist raus; rechts ein sauberes 2x2-SCHATZGRID: Gold, Skillpunkte, Level (XP im Tooltip), Hofwert - ALLE Icons handgezeichnet im einen Haus-Goldton (der gruene Funke ist jetzt gold)
- MENUES SCROLLEN NUR NOCH BEI BEDARF: App-Shell auf feste Bildschirmhoehe, der Inhalt scrollt intern nur, wenn er nicht passt - definierter Abstand zum Hauptmenue, kein Leerlauf-Gescrolle mehr
- AUFSTELLUNG: der Erklaertext (Klassische Schlacht / Bauern-Reihe) steht jetzt UEBER der Formation statt daneben - die Formation bekommt die volle Breite, Kacheln nochmals groesser (Slots bis 62px, Boss-Bilder 66px), Figuren exakt mittig

## 0.21.70
- HOTFIX 2 (React #310): der 0.21.69-Fix griff zu kurz - VOR dem Zurueck-Gesten-Hook lauerte noch ein weiterer Fruehausgang (authReady-Boot-Return). Der Hook steht jetzt VOR ALLEN Returns; per grep verifiziert, dass kein Return mehr davor liegt. Login laeuft

## 0.21.69
- HOTFIX LOGIN-CRASH (React #310): der Zurueck-Gesten-Hook aus 0.21.67 stand HINTER den Login-/Spielstand-Fruehausgaengen und brach die Hook-Reihenfolge beim Einloggen - er laeuft jetzt bedingungslos vor allen Returns. Login funktioniert wieder
- LOGIN- UND SPIELSTAND-BILD: das Ritter-Artwork wird jetzt EXAKT wie hochgeladen verwendet (keine Freistellung, kein Verlauf, kein Abdunkeln mehr) - nur sanft gerundete Ecken und ein Schatten

## 0.21.68
- ADMIN-WERKBANK im Profil (nur Admin-Konto): Liga I-X direkt anspringen, alle Figuren rekrutieren, +1000 Gold / +50 Skillpunkte - Vollzugriff zum Testen, wirkt nur aufs eigene Profil

## 0.21.67
- LOGIN-BILD: sanfter Verlauf oben ins Schwarze (kein harter Rand am Lichtschein mehr)
- KOPFLEISTE: das runde GG-EMBLEM steht jetzt vor der Wortmarke (Desktop + Mobil); Gold, Skillpunkte und neu der HOFWERT als sauber GEZEICHNETE Gold-Icons (Muenze, Funke, Wappen - keine Emojis mehr); Level-/XP-Balken bleibt
- WELTKARTE: Schloesser der verhuellten Ligen sind handgezeichnete GOLD-SCHLOESSER; der Nebel schweift jetzt VON RECHTS herueber (zwei Schichten, im Fenster gehalten)
- LIGAKARTE: fuellt auf dem Handy den kompletten Schirm bis zum Menue (Vollbild-Zoom, gleichmaessiges Randpadding); ganz sanfter Nebel zieht von rechts durchs Kartenfenster; das LIGA-Schild bleibt mit kleinem Abstand innerhalb der Karte; KAPITEL-Pill und Weltkarte-Pill sitzen vertikal mittig zueinander
- DER WANDERER steht hoeher (nicht mehr auf den Stationsnamen) und ist einen Hauch groesser
- ZURUECK-GESTE IM SPIEL: verlaesst jetzt die Partie statt die App zu beenden (History-Wache fuer Schnellspiel, Kampagne und Online)

## 0.21.66
- NEUES LOGIN-BILD (die hellere Fassung): Ritter und Titel freigestellt, Schachboden entfernt - und VIEL groesser dargestellt (bis 620px, Spielstand-Schirm 420px)
- AUFSTELLUNG DESKTOP: das Auswahlmenue ist jetzt eine LISTE ueber die volle Breite - grosse Figur (52px), Name fett, Erklaerungstext darunter; Figuren sitzen ueberall MITTIG in ihren Kacheln (neue TileArt statt Brett-Verankerung, das behebt den Versatz)
- REITER-REIHENFOLGE im Hofstaat: Aufstellung, FIGUREN, Ausruestung (Ausruestung ans Ende)
- START-SPLASH traegt jetzt die goldene Wortmarke (statt Vektor-Schriftzug); die Kopfleisten-Logos (Desktop + Mobil) kamen bereits mit 0.21.65

## 0.21.65
- NEUE LOGOS ueberall: Login zeigt den goldenen Ritter (Schachboden aus dem Bild entfernt - Luminanz-Freistellung, das App-Brett uebernimmt), Kopfleiste (Desktop + Mobil) traegt die goldene GRAND-GAMBIT-Wortmarke, App-Symbol/PWA-Icons/Favicon sind das GG-Emblem auf Navy (192/512/maskable/apple-touch neu gebaut)
- WAEHRUNGEN IMMER IM BLICK: Kopfleiste zeigt Gold und Skillpunkte als Chips (Desktop und Mobil), XP-Balken wie gehabt; OFFENE BELOHNUNGEN erscheinen als goldene Zaehler-Plakette am Schatzkammer-Reiter
- STATIONSNAMEN EINMALIG: alle 51 Orte tragen in jeder Liga einen eigenen Namen (510 Namen, keiner doppelt) - Liga I behaelt die Gruendungsnamen, spaetere Ligen benennen nach ihrem Land (Sonnenklippe, Frosthort, Oasenfeste, Moewenwacht ...), der markante Namenskern bleibt erhalten
- MARMOR-SCHALTFLAECHEN ENTFERNT: Buttons (auch im Profil) sind wieder klare Gold-/Panel-Verlaeufe ohne Steintextur
- MOBIL: Figuren-Kacheln in der Aufstellung nochmals groesser skaliert (8vw-Anteil, Roster-Glyphen 50px)

## 0.21.64
- DESKTOP-BREITE: alle Menues laufen jetzt so breit wie die Kopfleiste (1020px statt 720); in der Aufstellung nutzen Auswahlmenue und Slots die volle Breite, Figuren-Kacheln deutlich groesser (Slots bis 46px, Auswahl-Buttons 30px-Bilder, Roster-Glyphen 44px)
- ABTRUENNIG NUR VOR DEM SIEG: die rote "hat sich gegen dich gewandt"-Zeile erscheint nur noch, solange die Station offen ist - nach dem Sieg bleibt allein die Freundschaftskampf-Info
- DIE SAGE SPRICHT AUF DER KARTE: die mystische Herold-Zeile (3. Person) jeder Figur steht jetzt auch im Stations-Panel unter dem Boss - Champions wie Monster; die Rotations-Stationen zeigen die Zeile des aktuell wachhabenden Monsters
- DER DRACHE SCHLUEPFT IN LIGA II: im Drachenhort wacht in Liga I die BRUTMUTTER (eigene Story-Zeile, 1 Sieg, keine Rekrutierung); ab Liga II wartet der Drache (3 Siege) - wer ihn frueher schon rekrutiert hat, behaelt ihn
- WELTKARTE: oeffnet jetzt DORT, wo du gerade bist (Auto-Scroll zur aktuellen Liga), und ueber dem noch verhuellten Land liegt wieder ganz sanfter, treibender NEBEL (zwei geblurte Schichten, 44s/58s Drift)

## 0.21.63
- DER DRACHE IST GROSS (2x2): er belegt jetzt echte vier Felder. AUFSTELLUNG nur ganz aussen; sein Preis: der Nachbarplatz wird zur Drachenschwinge (leer) und die beiden Bauern davor weichen - mit Bestaetigungs-Abfrage im Editor ("Platz machen?"), der Grand Gambit tritt automatisch zur Seite, Rueckbau fuellt die Schwinge wieder
- ZU FUSS langsam (der ganze Block schiebt sich 1 Feld, nie auf Figuren), dafuer GEWICHTS-AURA: nach jedem Setzen nehmen ALLE an den Block gedraengten Feinde ceil(atk/2) Schaden (automatisch, wie besprochen)
- FLIEGEN einmal pro Partie (Faehigkeit L3, Reichweite 2; Weite Schwingen L6: 3; Sturmschwingen L9: 4): der Block springt, Landung auf Gegnern trifft JEDES bedeckte Feld direkt - ueberleben nicht alle, faellt er auf sein Ursprungsfeld zurueck (der Schlag zaehlt trotzdem; steht woertlich in der Faehigkeits-Beschreibung). Im Klassik-Regelwerk darf er den Koenig nie ersticken
- TECHNIK: Schwingen-Marker (D+) leiten Treffer auf den Drachen um, sein Tod raeumt alle vier Zellen, Marker blocken Linien, tragen keine eigenen HP und zaehlen der KI nichts; Zuege/Hash/Speicherstaende bleiben deterministisch. ALTE Spielstaende mit 1x1-Drachen laufen unveraendert weiter (big-Flag nur auf neu gebauten Armeen)
- 19 neue Drachen-Tests inkl. KI-Vollpartie (395 gesamt)

## 0.21.62
- DIE HELLSEHERIN IST DA: eigene Championfigur (Kind SE, sanfte Mystikerin: Damen-Linien mit 2 Feldern Reichweite, HP 3 / ATK 2, Leiter mit Teleport + Fernschuss). Neue Station MONDWARTE (e3) im Wisdom-Zweig direkt hinter der Sturmfeste, spaet in Liga I, 2 Siege - Position auf allen 10 gemalten Ligakarten gesetzt, eigene Vektor-Silhouette, gemaltes Portraet, Sage-Stimme (Herold + Antwort)
- HELLSICHT PRO FAMILIE: die Gabe liegt jetzt bei EINEM Seher je Haus - KRONE: Hellseherin, SCHATTEN: Spaeher (Falke). Die Hexerin gibt die Gabe ab; online zaehlen die Kinds SE und H
- FIGUREN-AUDIT: alle Anzeigewege (Brett, Karten-Medaillons, Vorspann, Siegesbanner, Hofstaat) ziehen aus den NEUEN painted-Dateien; dist-Hash-Vergleich bestaetigt die Auslieferung. Wer alte Figuren sieht, hat noch eine App-Version vor 0.21.58 - einmal komplett schliessen und neu oeffnen
- WELTKARTEN-ANKER VERIFIZIERT: Kontrollbild mit allen 10 Ringen gerendert - L1-L8 sitzen auf der Schneise, L9 auf der Oase, L10 auf der Leuchtturm-Insel

## 0.21.61
- NEUE FIGUREN-GALERIE: alle 25 Figuren aus dem Menschen-Setting eingebunden (Standard-Sechs + 19 Champions), plus ALLE SECHS Gambit-Stufenbilder und die HELLSEHERIN (painted-seeress.webp, wartet auf ihren Spielauftritt). Opake Lieferungen wurden per Rand-Flood-Fill freigestellt (weiche Weiss-Schleier, eingeschlossene Taschen und die Barden-Feder alle sauber), Klassik-Modus behaelt die alten classic-*.webp unangetastet
- GAMBIT 6x10: der Held steigt jetzt bis LEVEL 60 (sechs Stufen a zehn Level). Jede Stufe traegt ihr eigenes Portraet und eine tiefere Gold-Aura (nur fuer die eigene Seite sichtbar). Der Aufstieg wird STEIL teurer: 2/3/4/6/8/10 SP pro Level nach Stufe - der ganze Weg kostet 328 SP. Fuenf weitere Schilde auf der langen Strasse (L34/40/46/52/58, gesamt 11); Staerke kommt weiter ueber +1 HP je Level
- WELTKARTE ALS GEMAELDE: das Overlay zeigt jetzt das hochkant gemalte Reich (Fruehling unten bis Endloses Meer mit Leuchtturm oben). Die 10 Liga-Anker wurden auf der Schneise VERMESSEN (Zeilen-Farbanalyse + hellste-Spalte), erreichte Welten tragen einen hellen Halo auf dem Weg, Kommendes schlaeft unter Nebel und Schloss. Jeder Anker oeffnet seine LIGA-LORE: zwei Saetze je Liga (de+en), verknuepft mit dem jeweiligen Tor-Hueter und der Riss-Sage, plus Reise-Knopf
- DRACHE 2x2 GEPLANT: vollstaendige Spezifikation in DRACHE-2x2-PLAN.md festgehalten (Platzierung aussen, 4-Slot-Verbrauch mit Bestaetigung, Gambit-Auto-Shift, Blockzug, Flug mit Rueckfall-Regel) - Umsetzung folgt als eigenes Versions-Paket

## 0.21.60
- DIE SAGE WAECHST: alle 23 Monster (b01-b22, b24) haben jetzt ihre Stimmen - 44 Figuren insgesamt, jede mit Herold-Satz (3. Person, vor dem Kampf) und direkter Antwort (nach dem Sieg), de+en. Drei neue Schichten der Geschichte: die WACHEN der anderen Seite (Waechter ohne Abloesung, Bollwerk das nie erfuhr was es haelt), die GESCHOEPFE durch die der Riss selbst murmelt (Springbock, Zebra, Zerreisser - abgehackte, unheimliche Stimmen), und die ABTRUENNIGEN des alten Hofes (Richter, Lanzenmeister, Schattenfuerst). Alle 10 Liga-Tor-Hueter tragen das Miete-Motiv weiter, und die Spur zum Endlosen Meer verdichtet sich (Sturmkraehe: "Komm nicht ans Meer", Hueter: ein ungeprobter Schluessel, Koloss: der Deckel auf dem Brunnen)

## 0.21.59
- DIE SAGE VOM RISS: jede der 19 Champions plus Erzfeindin und Ligameister traegt jetzt ihre Zeile einer uebergeordneten Geschichte (content/voices.js, de+en). VOR dem Kampf steht der HEROLD-Satz in dritter Person neben der Figur im Vorspann (episch, kursiv); NACH dem Sieg antwortet die Figur im Siegesbanner in DIREKTER ANSPRACHE an den Wanderer (Zitatkarte mit Namenszeile). In Summe erzaehlen die Herold-Zeilen die Sage: der erste Ligameister oeffnete den Riss, der Hof zerbrach, manche fluechteten mit Fragmenten, manche hoerten den Sog gern - und das Endlose Meer verbirgt die Quelle
- SEHER-KORREKTUR: der "Spaeher" ist der FALKE (nameDe) - die Hellsicht liegt jetzt auf Hexerin + Falke (statt Pfadfinder)

## 0.21.58
- SCHNELLES SPIEL UMSORTIERT: der Modus steht jetzt GANZ OBEN, Klassisch als erste Option (Klassisch | Klassik-Schach... | Duell-Modi), Karte/Gegner/Staerke folgen darunter; Partie-starten-Knopf mit Abstand zum Text darueber
- ELO-FELD SAUBER: native Spinner entfernt (WebKit/Firefox), neutrales Appearance, hellere Goldschrift, Hinweistext gekuerzt ("Die Elo steuert die Staerke der KI.")
- UPDATE-HAERTUNG FUER INSTALLIERTE APPS: Sofort-Check beim Start, controllerchange loest garantiert genau EINEN Reload aus (Gurt und Hosentraeger neben dem Plugin-Hook), pageshow faengt Rueckkehr aus dem Back-Forward-Cache ab (typisches iOS-PWA-Loch), focus-Check zusaetzlich

## 0.21.57
- FUNKEN UND RAUCH KOMPLETT ENTFERNT: der Partikel-Canvas ist raus - die Halle steht still und klar (Hintergrundbild + Licht bleiben)
- HELLSICHT ONLINE: fuehrt ein Spieler Hexerin oder Pfadfinder aktiv im Heer, oeffnet sich vor dem ersten Zug der Spaeher-Moment - und online darf der Seher dabei ZWEI EIGENE Figuren antippen und ihre Plaetze TAUSCHEN (beliebig oft), waehrend der Gegner hinter einem Hinweis wartet: "Der Gegner liest deine Aufstellung und ordnet die eigenen Reihen neu". Beim Beginnen reist die Tauschliste als scoutDone-Nachricht mit (Worker-Relay), der Gegner spiegelt die Tausche - beide Bretter bleiben identisch, die Zug-Hashes stimmen weiter
- Fuehren BEIDE einen Seher, spaehen beide gleichzeitig und das Duell beginnt, sobald beide fertig sind; Uhr und Zuege pausieren waehrend jeder Spaeh-Phase
- WICHTIG: Worker (gg-hall) erneut deployen (wrangler) - das scoutDone-Relay ist neu

## 0.21.56
- NICHTS IST RUNTERLADBAR: Bilder/Canvas/SVG ohne Long-Press-Speichern-Sheet (iOS touch-callout aus), ohne Drag-out, ohne Rechtsklick-Kontextmenue - Eingabefelder und Text behalten ihre normalen Menues
- PULL-TO-REFRESH AUS: das Runterziehen zum Aktualisieren ist abgeschaltet (overscroll-behavior none) - die App haelt sich seit 0.21.42 selbst frisch, die Geste stoerte nur Karten-Pan und Brett

## 0.21.55
- ZWEITER SEHER: auch der PFADFINDER (der Spaeher) traegt jetzt die Hellsicht - aktiv aufgestellt liegt die Gegner-Aufstellung vor dem Horn offen (gleiche Regel wie bei der Hexerin, Texte figurneutral auf Seher umgestellt)
- Prompts fuer die kommende HELLSEHERIN (eigene Figur, silbernes Mondlicht #c9d8f2) und die grosse WELTKARTE (hochkant 1024x2304, zehn Klimazonen von Fruehling bis Endloses Meer, ohne Beschriftung) als Dokument uebergeben

## 0.21.54
- BLICK DER HELLSEHERIN: steht die HEXERIN aktiv in der Aufstellung (nur bewusst gesetzt - Standard-Formationen zaehlen nie), liegt in Kampagnen-Partien nach dem Vorspann die komplette Gegner-Aufstellung offen: das Brett ist sichtbar, Uhr und Aufgeben pausieren, unten eine goldene Leiste mit Kampf beginnen und Zur Aufstellung (zurueck zum Neuordnen). Sie wird gegen Ende von Liga I rekrutiert (2 Siege)
- DER LIGAMEISTER STELLT JEDES MAL NEU AUF: die Burg (n22) mischt ihre hintere Reihe pro Anlauf (seed-basiert) - wer verliert, trifft eine NEUE Formation; nur die Hellsicht verraet sie vorab
- AUFSTELLUNG OHNE VORSCHAU-BRETT: das Brett in der Aufstellung ist raus (vor dem Match kennt man den Gegner ohnehin nicht) - uebrig bleiben die Auswahl-Slots und die Familien-Chips; die Brett-Ansicht lebt jetzt genau dort, wo sie eine Entscheidung informiert: im Spaeher-Moment
- Rauch-Thema ruht wie gewuenscht (Funken/Rauch von 0.21.53 bleiben unangetastet)

## 0.21.53
- ALS WUERDE DIE WELT BRENNEN: die Flammenzungen sind FUNKEN gewichen - kleine gluehende Ausleufer (2-6px), amber geboren, in tiefes Glutrot kuehlend, nervoes flackernd, kurzlebig (1.5-3.5s), aus den untersten Ecken. Kein flaechiges Feuer mehr
- RAUCH VERBLASST UND VERSCHWINDET: die dunklen Schleier verloeschen jetzt hart (fadeOut^2.6), weniger (16 statt 22), alles lebt noch tiefer (Handy stirbt bei 86%, Desktop 74%)
- GPU-Blur 16 -> 9px, damit die Funken ihren Punkt behalten und nicht zu Nebel verschwimmen; Episoden-Rhythmus (mal golden, mal dunkel) bleibt

## 0.21.52
- WELTKARTE: neuer ❖-Knopf oben links auf der Kampagnen-Karte oeffnet die Reise durch alle 10 Ligen - vertikal von Fruehling (unten) bis zum Endlosen Meer (oben), jede Welt als runde Vignette aus ihrer echten gemalten Karte, gemeisterte Welten antippbar (reist dorthin), kommende im Nebel mit Schloss, aktuelle golden markiert
- KAMPAGNE IM HALLEN-LICHT: die Halle mit dem Marmorbrett liegt jetzt wie in allen anderen Menues auch hinter der Kampagnen-Karte; die Karte dockt GANZ OBEN an (kein schwebender Zwischenrahmen mehr) - darunter atmet die Halle
- FIGUREN HELLER: die goldene eigene Seite +16% Helligkeit, der stahlblaue Gegner +7%
- ELO-FELD LESBAR: Goldschrift auf dunklem Grund, zentriert, goldene Kante

## 0.21.51
- KLASSISCH SCHACH ALS SPIELMODUS: dritter Modus im Schnellen Spiel - reines Standardschach (8x8, Matt-Regeln, keine Faehigkeiten, keine Level, beide Seiten die blanke Grundaufstellung)
- ELO-WAHL: statt Leicht/Normal/Schwer gibt es im Klassik-Modus einen Elo-Regler + Zahlenfeld (600-2200, gemerkt im Profil) - die Elo steuert die Suchtiefe der KI (unter 1000: 1, unter 1600: 2, darueber: 3)
- KLASSISCHE FIGUREN EINGEFROREN: die bisherigen Standard-Gemaelde sind als classic-*.webp fest kopiert und haengen NUR am Klassik-Modus - wenn die Kampagnen-Standardfiguren neu (menschlich) bebildert werden, behaelt Klassik die alten Figuren fuer immer
- KLASSISCH ONLINE: eigener Umschalter Duell/Klassisch in der Online-Lobby; der Worker paart Klassik nur mit Klassik (getrennte Warteschlange), Raum spielt Matt-Regeln, Challenges und Rematches tragen den Modus mit (3 neue Worker-Tests)
- WICHTIG: der Worker (gg-hall) muss einmal neu deployt werden (wrangler, siehe DEPLOY-WORKER.md), damit Klassik online greift

## 0.21.50
- FREUNDSCHAFTS-BRETT: Duelle gegen den eigenen Hofstaat (rekrutierte Champions, gefallener Ligameister) spielen auf einem sichtbar freundlicheren Tisch - Marmor-Struktur auf 40% gedaempft, waermerer hellerer Schleier (Elfenbein-Lift .26), ein leiser goldener Hauch ueber dem ganzen Brett, und die frischeste Abnutzungs-Textur des Hauses statt der liga-rauen
- GLANZ-SWEEP RECYCELT: das weiche Gold-Band gleitet jetzt NUR im Freundschaftskampf mit jeder Adern-Welle uebers polierte Brett - dort passt der Glanz; ernste Duelle behalten den nuechternen Stein
- match.friendly kommt aus buildStageMatch (Test: Champion-Station liefert den Freundschafts-Tisch, normale Stationen nicht)

## 0.21.49
- FERNWIRKUNG HALBIERT: Spruenge (longleap u.a.) und Fernschuesse (ranged) treffen in HP-Partien nur noch mit HALBER Wucht (aufgerundet) - Nahkampf behaelt den vollen Biss. Sniper-Burst ist Geschichte
- DER KOENIG HAERTET SCHNELLER: +2 HP pro Level statt +1 (alle anderen +1) - ein gelevelter Hofstaat muss den Koenig belagern, nicht bersten. Level-5-Koenig: 18 HP, Dame daneben: 11
- BRETT-OPTIK KORRIGIERT: das wandernde Glanz-Band (Sweep) ist raus - geblieben ist der Adern-Impuls pro Feld, der versetzt als Welle durchlaeuft (der war fast richtig). NEU: jede Platte traegt wieder ihre 3D-Fase - Lichtkante oben links, Schattenkante unten rechts, als EIGENE Ebene UEBER dem Marmor (die alte Fase lag unter der Marmor-Ebene und war unsichtbar)
- 6 neue Balance-Tests (Sprung halbe Wucht, Nahkampf voll, Schuss halbe Wucht + Schuetze bleibt, Koenig-Skalierung) - 370 Pruefungen gesamt

## 0.21.48
- BALANCE-TESTSUITE: die KI spielt jetzt selbst komplette Partien auf echten Stationen (test_balance.mjs, deterministisch geseedet) und misst die Zuganzahl - Mindestlaengen sind festgeschrieben: kein Blitz-Ende in 2 Zuegen, Burg >= 16 Halbzuege und entscheidend, Spiegel-Armeen >= 20
- ZWEI ECHTE BALANCE-BUGS GEFUNDEN UND GEFIXT: (1) auf KLASSIK-Brettern bekam die KI trotzdem den Liga-Bonus - Level-9-Blink-Laeufer gegen die Level-1-Klassikarmee des Spielers, Matt in 3 Zuegen. Klassik ist jetzt fuer BEIDE Seiten reines Schach (Level 1), die Schwierigkeit kommt ab Liga 3 stattdessen ueber +1 Suchtiefe. (2) der WEITE SPRUNG (knight_longleap u.a.) konnte den eingeklemmten Start-Koenig in Matt-Partien in 2-3 Zuegen ersticken - in Matt-Regeln trifft ein Sprung nie den Koenig (kein Schach aus dem Sprung); HP-Partien unveraendert. Liga-V-Duelle: von 6 auf 101 Halbzuege
- FIGUREN-HOEHE VERMESSEN STATT GESCHAETZT: die sichtbare Masse der Gemaelde sitzt bei ~60% Bildhoehe (Alpha-Schwerpunkt aller 7 Grundfiguren) - rechnerisch zentriert -9.3%. Desktop jetzt -10%, Handy -13% (tools/piece-lift.mjs dokumentiert Messung + Bildvergleich)

## 0.21.47
- RAUCH WIEDER HOERBAR: die letzte Abstimmrunde hatte ihn in die Unsichtbarkeit gedreht (kleine Zungen x niedrige Deckung x gedimmte Dunkel-Episoden x Pausen bis 32s). Jetzt: Zungen 19-51 statt 15-41, Deckung .09/.075 statt .055/.045, Dunkel-Episoden auf 70% statt 55%, Schlieren minimal breiter, Pausen max ~20s statt 32s, und beim Laden steht der Rauch sofort halb da statt bei null zu beginnen. Charakter (Episoden, Schlieren, flach) bleibt

## 0.21.46
- KEIN LIGAMEISTER-REMATCH MEHR: faellt die Burg, BLEIBT die Karte stehen (bisher sprang die Liga sofort um). Der Meister tritt in deinen Hofstaat ueber und haelt seine Burg golden besetzt - jedes Rematch ist ein Freundschaftskampf (25% XP, halbes Gold)
- WEITER-KNOPF: oben rechts oeffnet sich ein goldenes Tor "Weiter - Liga {r}", sobald der Meister gefallen ist - EIN Tipp und die naechste Liga beginnt (advanceLeague: Hofstaat, Zaehler und Dupes reisen mit, Clears und Zoelle setzen zurueck)
- LIGA-NAVIGATION MIT PFEILEN: links "< IX" blaettert in gemeisterte Welten zurueck, rechts "X >" wieder vor (ab Liga II) - der alte Dropdown ist raus, Liga I hat kein Zurueck
- ZURUECK-KNOPF ENTFERNT + HAUPTMENUE AUF DER KARTE: die Tab-Leiste (Hof, Spielen, ...) bleibt auch in der Kampagne sichtbar (mobil unten, Desktop oben) - ein Tipp und man ist am Hof; die Karte misst sich automatisch den Platz darueber ab
- Tests: 356 Pruefungen (Tor verweigert solange der Meister steht, Rollover erst durchs Tor, Kapitaen + See ueber das Tor)

## 0.21.45
- STATIONEN ERZAEHLEN NACH DEM SIEG NEU: eine Station bleibt nur offen, solange dort eine Figur steht
- FREUNDSCHAFTSKAMPF: rekrutierte Champions halten ihren Posten (goldene Figur bleibt auf der Karte) - jedes Rematch gegen den eigenen Gefolgsmann ist ein Freundschaftskampf mit 25% XP und halbem Gold (Chips zeigen die reduzierten Werte, eigener Button-Text, neue Panel-Meldung)
- GEFLOHENE VERSCHWINDEN: nicht rekrutierte Champions und erlegte Monster raeumen die Station - Knopf zeigt deaktiviert Abgeschlossen, Panel-Text erklaert: die Spur ist kalt, Wiedersehen in einer neuen Liga (der Sieg-Zaehler bleibt ligenuebergreifend erhalten)
- Ligameister-Rematch (Burg) bleibt wie gehabt offen; laufende pausierte Partien lassen sich weiterhin fortsetzen
- KONSEQUENZ: mehrfach geforderte Champions (z.B. der Drache mit 3 Siegen) sammeln ihre Siege jetzt ueber Nebenstationen und LIGEN statt ueber Station-Farming

## 0.21.44
- RAUCH: stirbt noch frueher (Handy 84% statt 76%, Desktop 68%), leiser (Alphas gesenkt), noch schlankere und laengere Schlieren (Ellipse .42 x 1.9), kleinere Zungen
- RAUCH-STIMMUNGEN: jede Episode ist mal GOLDEN (amber, weichere Schatten), mal DUNKEL (gedimmte Zungen, kraeftigere blauschwarze Schlieren) - gewaehlt beim Anschwellen
- BRETT-WELLE MIT ECHTEM VERLAUF: ein einzelnes weiches Gold-Band (Gradient quer zur Laufrichtung) zieht als eine Ebene uebers ganze Brett, waehrend die Adern der Platten darunter synchron aufglimmen; alles langsamer (2.6s pro Feld, 2s Versatz, Band 3.6s)
- FIGUREN NOCH HOEHER: Desktop -8%, Handy -12%

## 0.21.43
- RAUCH IN EPISODEN: nicht mehr staendig - eine Phase von 9-17s schwillt an und vergeht, dann steht die Halle 10-32s klar (weiche Uebergaenge, nichts poppt)
- SCHLIEREN STATT BUBBLES: auch die hellen Zungen sind jetzt gestreckte, langsam kippende Ellipsen; kleiner (18-50 statt 26-70), schmalere Spawn-Zonen an den Ecken, weniger Partikel (72+22 statt 96+30), Desktop-Sterbehoehe .55 -> .62
- HALLE AUF MOBIL SICHTBAR: das Hintergrund-Brett waechst auf 142% und hebt sich 7vh ueber das Bottom-Menue - es verschwindet nicht mehr hinter der Navigation
- FIGUREN AUCH AUF MOBIL ANGEHOBEN (-9%, Desktop -6%) - gilt ueberall inkl. Aufstellungs-Vorschau

## 0.21.42
- NIE WIEDER CACHE-LEEREN: die App prueft jetzt selbst auf neue Builds - beim Oeffnen, bei jedem Tab-Fokus und alle 60s. Ist ein neuer Stand da, uebernimmt der Service Worker sofort und die Seite laedt sich EINMAL selbst neu. Nach einem Deploy reicht es, das Spiel am Handy einfach wieder anzuschauen
- Registrierung wandert vom HTML-Snippet in main.jsx (injectRegister aus, keine Doppel-Registrierung)

## 0.21.41
- DAS BRETT ATMET ALS EINS: statt einzeln glimmender Kacheln rollt jetzt gelegentlich EINE goldene Adern-Welle uebers Brett (zufaellige Richtung, ~1.2s Lauf, sanftes Auf- und Abglimmen pro Feld)
- TAKT NACH GEGNERSTAERKE: Intervall als geneigte Ziehung aus 2-60s - je staerker der Gegner, desto oefter faellt sie kurz aus. Endboss/Monster ~ oft, Champions mittel, freies Spiel nach Schwierigkeit; nie dauerhaft, nie hektisch
- FIGUREN AUF DESKTOP ~6% ANGEHOBEN - sie sassen zu tief im Feld

## 0.21.40
- RAUCH AUF MOBIL NOCH FLACHER: Zungen sterben schon bei 76% Hoehe (vorher 68%)
- SCHATTENWESEN IM RAUCH: 30 blauschwarze Schlieren ziehen jetzt DURCH den hellen Rauch - ein zweiter Zeichen-Pass (normal statt additiv, denn additiv kann nie dunkel), gestreckte, traege kippende Ellipsen mit Nachtblau an der Wurzel, das nach oben in Fast-Schwarz verschluckt wird; langsamer und langlebiger als die Zungen, gleiche Ecken, gleiche Sterbe-Hoehe

## 0.21.39
- GLUEH-BUG GEFUNDEN UND GEFIXT: die Gold-Adern-Ebene startete wegen der Animations-Verzoegerung (bis 14s) auf VOLLER Deckung - das ganze Brett gluehte beim Laden, bis jedes Feld seinen ersten Zyklus begann. Jetzt Basis-Opacity .03 + fill-mode backwards + Ebene erscheint erst nach dem Marmor-Preload
- BRETT WIRKLICH HELLER: die Karten geben eigene Feldfarben mit (CLASSIC_SQ) - die bisherige Theme-Aufhellung griff im Spiel nie. CLASSIC_SQ angehoben (hell #6f6a5f -> #8a8371, dunkel #26282d -> #3a3e49), Schleier-Deckung .68/.72 -> .78/.80 mit staerkerem Elfenbein-Lift (.12): heller UND ruhiger, per Ebenen-Mock visuell gegengeprueft (tools/board-mock.mjs)

## 0.21.38
- BRETT HELLER: Feldfarben angehoben (hell #2c3a5c, dunkel #1b2540), Rand-Vignette deutlich weicher (.52 -> .34), waermeres Herzlicht, weniger Eck-Schatten pro Platte
- KEIN LADE-GLUEHEN MEHR: die goldene Lade-Raute ist raus - das Brett steht ab dem ERSTEN Frame in flacher Feldfarbe und ist sofort spielbar; der Marmor-Hauch blendet pro Feld sanft nach (0.6s), sobald der Preload fertig ist. Nichts poppt, nichts glueht, kein Vorhang
- FIGUREN GROESSER: Glyphen 85% -> 90% der Feldgroesse
- FALKE, ATTENTAETER, PFADFINDER auf 2 Siege (alle Stationen dieser Champions, Zaehlung laeuft pro Figur ueber Haupt- und Nebenwege); Tests angepasst: erster Sieg zaehlt nur, der zweite rekrutiert

## 0.21.37
- MARMOR AUF EIN FLUESTERN: jedes Feld traegt jetzt einen Schleier in der EIGENEN Feldfarbe mit ~70% Deckung (vorher pauschal 35% dunkel) - die Struktur ist nur noch ein Hauch, Figuren und Zuege stehen klar im Vordergrund; funktioniert auch mit Karten-Themes, da der Schleier aus der Theme-Farbe gerechnet wird
- Adern-Glimmen ebenfalls halbiert (Spitze .25 -> .14)
- KEIN KACHEL-POPPEN MEHR: alle 18 Marmor-Platten werden VOR dem ersten Brett geladen (Warmstart schon beim App-Oeffnen). Bis dahin atmet eine kleine goldene Raute im Rahmen, dann blendet das fertige Brett in einem Stueck auf (Sicherheits-Timeout 2.5s - das Spiel wartet nie ewig)

## 0.21.36
- GRAND GAMBIT STEIGT AUF: als einzige Figur 3 Stufen x 10 Level (bis 30). Stufe II ab Level 11, Stufe III ab Level 21 - auf dem langen Weg warten vier weitere Schilde (L12/16/21/26, max. 6)
- Der Aufstieg ist SICHTBAR, aber nur fuer dich: eigenes Portraet je Stufe (painted-gambit-t2/-t3 - Platzhalter liegen bereit, deine Bilder ersetzen sie 1:1) plus eine leise goldene Aura auf Brett und Kampagnen-Karte. Der Gegner sieht immer den schlichten Helden
- Hofstaat: die Level-Leiste zeigt beim Gambit die 10 Schritte der AKTUELLEN Stufe, davor Stufen-Sterne (Stufe I/II/III); Verbessern-Knopf laeuft bis 30
- 28 Figuren-Prompts im Boss-Stil als Dokument uebergeben: alle Figuren bekommen wie die Bosse eine Akzentfarbe (Grundfiguren dezent als Einlage, Champions kraeftiger, Gambit dreistufig in Morgengold)
- 5 neue Pruefungen sichern Cap, Stufengrenzen, Schilde und Tier-Uebergabe ab (352 gesamt)

## 0.21.35
- BRETT ALS STEINPLATTEN: fast schwarze Fugen (2px) statt Gold-Grid, Schleier ueber dem Marmor (Struktur ~50% zurueck - die Figuren fuehren, das Brett tritt zurueck), gerichtetes Licht pro Platte (helle Kante oben links, weicher Schatten unten rechts)
- Adern-GLIMMEN statt Dauerpuls: 14s-Zyklus, 85% der Zeit fast unsichtbar (Opacity .05), kurzes sanftes Aufleuchten (.25) - Versatz pro Feld ueber den ganzen Zyklus gestreut, kein Wellen-Effekt mehr
- Buttons zeigen mehr Stein: Gold-Deckung 93% -> 83%
- Der Rauch der Halle stirbt auf dem Handy frueher (flacher) - verdeckt Brett und Karten weniger
- Familien-Pacing der Siege: Standarte (Krone) 3 -> 1, Alchemist und Hexerin (Schatten) 1 -> 2; Test sichert das Muster ab (347 Pruefungen)
- BLAU BIS ZUR ERLOESUNG: Herausforderer bleiben ueberall feindblau (stehende Figuren, Medaillon-Miniaturen, Panel-Portraet), bis sie rekrutiert sind - erst dann Gold. Im Rekrutierungs-Popup blendet das Portraet sichtbar von Blau nach Gold ueber
- Das Panel besiegter Stationen erzaehlt den Ausgang: "Abgeschlossen - X dient nun deinem Gefolge" / "Besiegt xN - X konnte erneut fluechten" / "Abgeschlossen"
- KARTE FREI VERSCHIEBEN: ein Finger (oder die Maus) zieht das Kartenfenster ueber die Welt, die Kamera kehrt beim naechsten Schritt zum Wanderer zurueck
- LIGA-RUECKBLICK: ab Liga II waehlt eine Pille neben dem Zurueck-Knopf jede gemeisterte Welt zum Betrachten (nur Ansicht - ohne Schloesser, Nebel und Wanderer; alle Wege liegen offen)
- Karten-Chips (Karte/Modus/Schwierigkeit/XP/Gold) in Serifen - die Karte ist jetzt 100% Serife
- Doku bereinigt: Repo ist OEFFENTLICH - Zugangsdaten, Konto-IDs und Projekt-Refs aus allen Doku-Dateien entfernt (Grundregel dokumentiert)

## 0.21.34
- ADERN-PULS, ECHT: aus den beiden neuen Texturen (schwarzer Goldadern-Marmor + Leuchtmasken-Variante, deckungsgleich geschnitten) bekommen die dunklen Felder ihr Glow-Overlay exakt auf den Adern - jedes Feld atmet mit eigenem Versatz (screen-Blend, 6s), Reduced-Motion respektiert
- Buttons: der Marmor sitzt jetzt SANFT - Gold-Siegel wie gewohnt, darunter nur ein Hauch Steinstruktur (93% Deckung), dunkle Buttons analog
- Stationskarte der Gegner: grosses Portraet links (84x108), Name in Serifen, darunter einfarbig Leben - Angriff - Familie (Kronenfiguren/Schattenwesen). Kein "Gegner:"-Praefix, kein "Bewegungen unbekannt" mehr
- Zurueck-Knopf der Karte: dunkles Glas mit Blur, goldene Serifen - statt Pergament-Pille
- Karte auf dem Handy: minimales Seitenpolster (6px)

## 0.21.33
- FIX: die Kampagnenkarte war nach dem Top-Bar-Umbau am Desktop schwarz (das Spalten-Layout gab ihr keine Hoehe) - behoben
- Figuren stehen jetzt IMMER buendig ueber ihrem Lebensbalken (Fuesse auf den Punkten), in Aufstellung und Kampf
- Der Umschalter fuer simple SVG-Figuren ist entfernt - es gibt nur noch die gemalten Figuren
- Ueberall nur noch GEGNER: das Karten-Panel verraet weder Art noch Sieg-Rauten. Erst nach dem Kampf: "X schliesst sich deinem Gefolge an!" oder "X konnte fluechten ..."
- ONLINE: vor dem ersten Verbinden fragt der Herold nach deinem Anzeigenamen - mit Wuerfel-Knopf fuer Namen aus der Welt des Spiels (Eherner Turm IV, Stiller Falke, Wandernder Gambit ...)
- Marmor auch auf den Knoepfen: CTA-Buttons aus der goldgeaederten Platte, ruhige Buttons aus dunklem Stein - mit Verlauf fuer klare Lesbarkeit
- Datenschutz-Kurzhinweis aktualisiert (Konto, Cloud-Sicherung und Online-Duell erwaehnt statt "bleibt nur auf diesem Geraet")

## 0.21.32
- MARMOR-BRETTER: die Spielfelder tragen jetzt die Optik der dunklen Marmorhalle - jedes Feld ist eine echte Steinplatte, aus dem Referenzbild geschnitten (6 helle + 6 dunkle Varianten, per Feld-Hash deterministisch verteilt, ~75 KB gesamt). Goldene Fugen zwischen den Platten, Vignette mit warmem Lichtherz ueber dem Brett
- ERSTER PULS: ein langsamer goldener Glanz (Overlay-Blend, 6s-Atem) laesst die Goldadern im Stein periodisch aufleuchten - respektiert prefers-reduced-motion. Echte adern-genaue Leuchtmasken koennen spaeter folgen
- Auswahl-, Zug- und Treffer-Markierungen liegen unveraendert ueber dem Stein

## 0.21.31
- Desktop: das Grand-Gambit-Menue sitzt jetzt als TOP-BAR ueber dem Inhalt (Wortmarke - Reiter in einer Reihe - Level rechts, sticky), statt als Seitenleiste links
- Die kleinen Eck-Rauten in den goldgerahmten Boxen (Kontostand, Schatzkammer usw.) sind entfernt
- Rauch-Feintuning: die Zungen duerfen deutlich weiter Richtung Bildmitte entstehen, steigen dafuer weniger hoch (loesen sich unterhalb der Bildmitte auf) und einen Hauch gemaechlicher

## 0.21.30
- Rauch komplett neu nach Feedback: schneller und FLAMMENARTIG - viele kleine Zungen steigen aus den unteren Ecken auf, flackern seitlich und ueberlagern sich zu dichten Koerpern (warm am Fuss, rauchig-kuehl oben)
- Butterweich statt pixelig: halbe Render-Aufloesung plus GPU-Blur (16px) auf dem Canvas - keine sichtbaren Kanten mehr
- TIEFE: die Zungen schrumpfen beim Aufstieg, werden langsamer und dunkler und ziehen einen Hauch Richtung Fluchtpunkt - als wuerden sie in der Halle verschwinden; oberhalb von ~30% Hoehe loest sich alles auf
- Der Rauch bleibt strikt in den unteren Ecken verankert (Rueckstellkraft zum Emitter) und laeuft weder in die Bildmitte noch ueber UI-Elemente
- KEINE Spuren mehr: der Trail-Puffer ist raus, jede Frame wird sauber geleert - nichts verweilt

## 0.21.29
- Hintergrund-Feinschliff nach Feedback: das Marmorbrett ist deutlich kleiner eingebettet (max. 1080px, engere Nacht-Maske) - besonders am Desktop wirkt es jetzt wie ein Fenster in die Halle statt wie eine Tapete
- Der Rauch ist neu choreografiert: nur noch WENIGE (hoechstens drei), GROSSE, LANGSAME Schwaden, die ausschliesslich in den unteren Ecken geboren werden und auf Bogenbahnen nach innen ziehen - ihre stehenbleibenden Spuren malen SICHELN. Zwischen zwei Geburten vergehen 5-16 Sekunden; eine Sichel lebt ca. 20-35 Sekunden
- Die Spielstand-Auswahl (Login) traegt jetzt ebenfalls Halle und Rauch - getoent nach der hoechsten Liga deiner Spielstaende

## 0.21.28
- NEUER APP-HINTERGRUND: die dunkle Marmorhalle (Schachboden mit Goldadern) liegt jetzt hinter Menues, Hub und Hofstaat - smart eingebettet statt gestreckt: eine weiche Maske laesst das Bild an allen Raendern in die Nacht verlaufen, dadurch passt es auf jede Bildschirmgroesse
- MYSTISCHER RAUCH darueber: keine runden Wolken, sondern schweifartige Schwaden - Partikel reiten ein gekruemmtes Stroemungsfeld, ihre Bahnen bleiben als verblassende Spuren stehen (Canvas, destination-out). Steigt wie in der Vorlage von den Flanken auf
- Der Rauch-FARBTON wandelt sich sanft mit der Liga (I Nacht & Gold, II Violett, III Moorgruen, IV Nachtrose, V Stahl, VI Glut, VII Petrol, VIII Bernstein, IX Wueste, X Tiefsee-Silber)
- Ruecksichtsvoll: pausiert im Hintergrund-Tab, respektiert prefers-reduced-motion, laeuft nicht im Match oder auf der Kampagnenkarte

## 0.21.27
- ZWEI FAMILIEN statt drei: KRONENFIGUREN (Schildtraeger, Barde, Paladin, Inquisitor, Standarte, Techniker, Kanzler, Erzbischof, Kapitaen, Magier) und SCHATTENWESEN (Falke, Attentaeter, Kundschafter, Drache, Amazone, Alchemist, Hexerin, Hexer, Stratege). Mischen bleibt immer erlaubt - aber je mehr man sich einer Seite verschreibt, desto staerker ihr Geschenk:
  - Krone: ab 2 Schildwall (benachbarte Kronenfiguren -1 Schaden, LEBEND: broeckelt wenn der Hof faellt), ab 4 zusaetzlich +1 max. Leben je Kronenfigur, ab 6 wehrt der Wall 2 ab
  - Schatten: ab 2 ein Zeitriss pro Partie, ab 4 zusaetzlich +1 Angriff je Schattenwesen und ein zweiter Riss, ab 6 ein dritter
- BOSSE sind eine eigene Rubrik: genau 10 LIGA-BOSSE, einer als Endgegner jeder Liga (I Ligameister, II Richter, III Doppelritter, IV Schattenfuerst, V Hueter, VI Blutmagd, VII Lanzenmeister, VIII Eisenfaust, IX Kanonier, X Koloss). Jeder traegt eine AURA, die die GANZE Partie beugt (z.B. "Das Urteil: gegnerische Traenke verboten", "Blutzoll: Angriffe der Verbuendeten heilen", "Unerschuetterlich: alle Verbuendeten wehren 1 Schaden ab")
- Wer eine Liga gewinnt, gewinnt ihren Boss: er darf fortan ANSTELLE DER DAME in der eigenen Aufstellung marschieren - maximal EIN Boss auf dem Feld, seine Aura dient dann dir. Auswahl im Hofstaat-Picker unter "Liga-Bosse"
- Stations-Monster behalten schlankere Rotationen; die Erzfeindin haelt weiter den Aschenpass

## 0.21.26
- DIE DREI HAEUSER: jede rekrutierbare Figur gehoert einer von drei Familien an - und Familien, die gemeinsam antreten, wecken Kollektiv-Eigenschaften:
  - JAGDRUDEL (Klingen: Falke, Attentaeter, Kundschafter, Drache, Amazone, Kapitaen): +1 max. Leben je weiterem Rudelmitglied in der Aufstellung (max +3)
  - ZIRKEL (Magie: Magier, Alchemist, Hexerin, Hexer, Erzbischof, Stratege): 2 Mitglieder schenken einen ZEITRISS pro Partie, 4 Mitglieder zwei - ein Riss laesst den naechsten eigenen Zug das Zugrecht behalten (Doppelzug)
  - SCHILDWALL (Ordnung: Schildtraeger, Barde, Paladin, Inquisitor, Standarte, Techniker, Kanzler): wer orthogonal neben einem Ordnungs-Verbuendeten steht, erleidet 1 Schaden weniger (min 1)
- Boni gelten fuer beide Seiten - auch Gegner-Formationen mit Familienmitgliedern profitieren (die KI zuendet nur keine Zeitrisse)
- Hofstaat zeigt Familien-Rauten an den Karten und unter der Aufstellungs-Vorschau die Muster-Zeile mit aktiven Boni; im Kampf sitzt der Zeitriss-Knopf neben dem Trank
- Zeitrisse ueberleben Speichern/Laden (Codec); vorerst nur Solo-Partien (Online folgt)

## 0.21.25
- Das Bestiarium marschiert komplett auf: die fuenf Monster-Stationen (Vergessener Schrein, Klingenschlucht, Geisterfeld, Grenzwall, Sturmfeste) rotieren ihren Champion pro Liga - thematisch gruppiert (Schrecken des Erwachens, schnelle Killer, Schemen & Blutmagie, eiserne Golems, Taktiker). Ueber die Ligen hinweg treten damit alle 23 benannten Monster auf, jedes mit seinem eigenen Portrait. Liga I bleibt unveraendert; ab Liga II warten neue Gegner an bekannten Orten
- Nichts wurde ersetzt: die 23 Unikat-Portraits gehoeren zu Bossen, die es in der Spiellogik laengst gab (eigene Namen, Werte, Zugmuster) - sie teilten sich nur fuenf generische Familienbilder und waren zu 18/23 nie in der Kampagne verdrahtet

## 0.21.24
- Die Galerie ist komplett: alle 23 uebrigen Monster-Bosse (b01-b22, b24) haben jetzt ihr eigenes gemaltes Unikat-Portrait - auf der Kampagnenkarte, im Stationspanel, auf dem Brett und in der Flucht-Animation. Sechs Rohbilder kamen mit weissem Hintergrund und wurden freigestellt (Flood-Fill vom Rand, beim Zebra zusaetzlich das eingemalte Transparenz-Schachbrett entfernt)

## 0.21.23
- Rekrutierung neu gedacht: kein Liga-Gating mehr - stattdessen fordern starke Figuren MEHRERE Siege, bevor sie beitreten (3 Siege: Drache, Amazone, Standarte - 2 Siege: Hexer, Inquisitor, Stratege, Techniker, Kanzler, Erzbischof - alle anderen treten beim ersten Sieg bei). Der Zaehler zaehlt jeden Sieg, Replays inklusive, und ueberlebt den Liga-Wechsel
- Das Stationspanel zeigt bei stoerrischen Champions die Sieg-Rauten ("Siege bis zum Beitritt: x/y")
- Besiegte, nicht rekrutierte Champions FLIEHEN nach dem Sieg sichtbar nach rechts aus der Karte - danach markiert nur noch ein Haken die Station. Rekruten treten stattdessen dem Hofstaat bei
- Rekrutierungs-Vorstellung im Siegesbanner: gemaltes Portrait, Name, Zitat und ein grober Steckbrief (Faehigkeiten, Schilde, Maximalstufe) plus direkter "Zum Hofstaat"-Knopf zum Weiterleveln
- Die roten Schwierigkeits-Punkte unter den Stationsnamen sind weg (verstand niemand)
- Grand Gambit steht auf der Karte jetzt knapp ueber dem Stationsnamen und ist scharf (die permanente Subpixel-Atmung ist raus)

## 0.21.22
- Kampagnen-Pacing entzerrt: Liga I schenkt nur noch vier Rekruten (Falke, Magier, Schildtraeger, Erzbischof) - alle anderen Figuren-Bosse kaempfen zwar von Anfang an, treten aber erst ab ihrer Liga bei (II: Attentaeter/Alchemist/Barde/Kanzler, III: Kundschafter/Hexerin/Paladin/Techniker, IV: Drache/Hexer/Inquisitor/Stratege, V: Standarte/Amazone). Bis dahin gibt es Gold und XP - das Panel sagt "tritt ab Liga N bei"
- Liga I spielt (fast) nur auf dem klassischen Brett - nur die Ligafeste behaelt ihre Arena. Neue Bretter kommen gestaffelt: Liga II Schneise, Liga III Hof & Spiessrutenlauf, ab Liga IV alles
- Brett-Texturen variieren ab sofort pro Station: jede Partie wuerfelt ihr Holz deterministisch aus einem Pool, der mit der Liga rauer wird - inkl. neuer sehr rauer dunkler Tafel (tex-wear-4)
- Wanderer steht tiefer am Boden, gleitet mit leichter Kippung in Laufrichtung statt zu huepfen und zieht einen goldenen Schweif hinter sich her, der nach der Ankunft verblasst; im Stand nur noch ein ruhiges Atmen

## 0.21.21
- Liga-Aufstieg sichtbar gemacht: an der geschafften Ligafeste heißt der Knopf jetzt "Ligameister fordern -> Liga II" statt "Nochmal" - ein erneuter Sieg eröffnet die nächste Liga
- Aufgeräumt: versehentlich committetes Test-Backup entfernt, server/backups/ ignoriert

## 0.21.20
- Figuren stehen jetzt mittig in der Feldhöhe statt am unteren Feldrand; die Lebenspunkt-Kugeln bleiben an der Unterkante
- Liga-Aufstieg entsperrt: Wer die Ligafeste bei voll freigespielter Karte erneut bezwingt, steigt in die nächste Liga auf (vorher Sackgasse bei 100%)
- Kampagnenkarte: der Wanderer ist jetzt das gemalte Grand-Gambit-Porträt; der Zurück-Knopf trägt Pergament statt Nachtblau
- Brett-Badges harmonisiert: Stärke-Klingen und -Zahl in Lack-Tönen statt Neon (Gold für dich, Stahl für den Gegner), Level-Raute antiker und ohne grellen Glow
- Lebenspunkt-Kugeln einen Hauch heller

## 0.21.19
- Kampagnenkarte: an jeder Boss-Station steht jetzt die detailreiche gemalte Figur — stählern-dunkel bis zum Sieg, in warmem Lack sobald sie dem Hofstaat beigetreten ist; auch das Stations-Panel zeigt das Gemälde
- Glanzeffekte gezähmt: der Lichtlauf über Buttons und Rahmen kommt deutlich seltener (ein kurzer Schimmer alle ~11 s) und mehrere Glanzflächen auf einer Seite laufen zeitversetzt statt im Chor
- Figuren stehen höher im Feld: unter ihnen ist jetzt Platz für die Lebenspunkte, die als dunkelgrüne Glaskugeln fast an der Unterkante des Feldes ruhen — die Figur immer darüber
- Level als goldene Raute mit Zahl oben rechts an der Figur — auf dem Brett, in der Aufstellung und überall wo Figuren gezeigt werden (ab Stufe 2)
- Fähigkeits-Punkte in den Farben ihrer Kategorie bleiben rechts neben der Figur

## 0.21.18
- Duell-Worker deployed: Rangliste zeigt nur noch Spieler mit gespielten Partien oder Online-Status (Karteileichen mit 0 Spielen gefiltert); eigener Rang-Eintrag mit Fallback wenn ungelistet
- Aufgeräumt: temporäres Deploy-Bundle gg-hall-fix.js und CORS-Freigabe aus public/ entfernt

## 0.21.17
- Hauptmenü: Karten-Hintergrund-Schimmer entfernt — Glanz liegt jetzt gezielt auf den drei Aktionen "Fortsetzen", "Spielen" und "Verbinden", im gleichen Gold-Design mit heller Kontur wie die übrigen Highlight-Buttons
- Spielen-Symbol neu gezeichnet: gekreuzte Schwerter in klaren Strichen (runde Kappen) statt überlappender Flächen — keine seltsame Vereinigung mehr in der Mitte
- Figuren: zugeklappte Kacheln sind pro Zeile exakt gleich hoch; die GANZE Kachel öffnet per Klick; aufgeklappt nimmt die Karte die volle Breite ein, der Nachbar rutscht darunter

## 0.21.16
- Boss-Gemälde repariert: Kampagnen-Konkurrenten zeigten gar kein Bild (Zuordnung suchte "boss-01" statt der Art-Familie) — jetzt eigenes Porträt zuerst, dann Erzfeindin/Ligameister, dann Familien-Gemälde (Golem/Bestie/Schlange/Schemen/Tyrann)
- Karten-Wording: Figuren-Stationen heißen "Neue Figur", Unikate "Konkurrent" — nur die Ligafeste trägt noch "Endboss"
- SEO-Feinschliff: doppeltes canonical und relatives twitter:image entfernt, og:url + og:image-Maße/alt ergänzt, sitemap.xml angelegt und in robots.txt verlinkt

## 0.21.15
- Crash behoben: Held-Fähigkeiten (Tag "List") ließen den Figuren-Tab beim Verbessern abstürzen — Tag ergänzt, Anzeige zusätzlich abgesichert
- Glanz nur noch dort, wo die UX hinzeigen will: Reiter und Profil-Regler sind ruhig-gold ohne Schimmer; dafür leuchten jetzt "Verbessern", "Erwerben" und "Partie starten" im Einfordern-Glanz
- Figuren-Tab als Akkordeon: Karten zeigen Figur, Werte und Zitat — ein Tipp klappt Leveln und Fähigkeiten auf (eine Karte offen)
- Noch gesperrte Fähigkeits-Kacheln deutlich lesbarer (heller, sichtbare Umrandung)
- Brett-Figuren wieder größer und höher gestellt; Lebens-Bubbles kleiner und ganz unten an der Feldkante; Level-Rauten kleiner und golden leuchtend
- Online-Rangliste zeigt nur noch echte Duellanten (mind. ein gewertetes Duell) und wer gerade online ist; Cloud-Sicherung ist nur noch für Admin-Konten sichtbar (die automatische Sicherung beim Verbinden läuft für alle weiter)

## 0.21.14
- Figuren stehen jetzt sauber mittig im Feld (Brett wie Aufstellung), mit klarem Abstand zum Feldrand
- Lebenspunkte als glänzende kleine Glas-Bubbles direkt unter der Figur — mit Lichtpunkt, passend zum lackierten Look der Figuren; Riesen (>10 Leben) behalten einen schmalen Balken
- Kampfkraft: Klingen-Symbol jetzt über der Zahl, links neben der Figur vertikal mittig
- Desktop scrollt nicht mehr: die eingebaute Vergrößerung wird bei allen Vollbild-Höhen herausgerechnet (Match, Kampagne, Hub-Zentrierung, Aufstellungs-Brett)
- Spielen-Symbol in der Navigation: echte gekreuzte Schwerter mit Parierstange und Knauf (die Pfeile sind Geschichte)
- Liga-Ziffer im Schild exakt auf 50% / 47.5% gesetzt

## 0.21.13
- Figuren-Overlays neu: Level als kleine Gold-Rauten oben mittig (keine Zahlen-Plakette mehr), Lebenspunkte als dezente Punkte unten mittig (statt breitem Balken), Kampfkraft als Zahl über gekreuzten Klingen links neben der Figur, Fähigkeits-Punkte in Talentfarben rechts — verbrauchte Einmal-Fähigkeiten ergrauen
- Figuren stehen mit kleinem Abstand über dem Feldrand (Brett wie Wahlfelder), kleben nicht mehr am Boden
- Aufstellung auf Desktop als Ein-Bildschirm-Layout: großes Brett links (skaliert mit der Fensterhöhe), Wahlfelder, Heldenposition und Speichern rechts daneben — kein Scrollen mehr
- Reiter (Aufstellung/Ausrüstung/Figuren u. a.): aktiver Tab trägt jetzt den schimmernden Einfordern-Glanz der Schatzkammer
- "Charaktere" heißt jetzt "Figuren"; der Verbessern-Knopf zeigt den Preis immer direkt im Button
- Neues Schatzstück in der Ausrüstung: der Sternensplitter — ein Skillpunkt für 45 Gold, streng rationiert auf zwei je erreichter Liga
- Match-Brett auf Desktop mit fester Luft nach oben und unten

## 0.21.12
- Charaktersystem neu aufgebaut: Fähigkeiten sind jetzt gleich große Kacheln (Desktop zweispaltig) mit Gold-Rahmen — erworbene glimmen in ihrer Talentfarbe mit Gold-Raute, erwerbbare tragen einen goldenen "Erwerben"-Knopf (die Spitzhacke ist Geschichte), kommende sind gedimmt, tiefere bleiben verhüllt
- Fähigkeits-Erklärungen verschwinden nie mehr: Jede enthüllte Fähigkeit zeigt ihren Text dauerhaft — vor dem Kauf, nach dem Kauf (nebenbei einen Alt-Bug behoben, durch den Kaufzeilen nie eine Beschreibung zeigten)
- Schatzkammer-Glanz wandert weiter: Kontostand im Hofstaat und der Profil-Kopf tragen jetzt den goldenen Rahmen mit Eck-Rauten und Lichtstreif
- Aufstellung: Brett auf Desktop deutlich größer (560px), Figuren in den Wahlfeldern höher gesetzt, Vorschau zentriert
- Hauptmenü jetzt auch im schmalen Layout vertikal zentriert; Akademie-Zeile als würdige Kachel gestaltet
- Neues Klingen-Icon (Spielen): elegante gekreuzte Schwerter mit Parierstange und Knauf

## 0.21.11
- Desktop-Feinschliff: Auf großen Bildschirmen skaliert die App bei 100 % Browser-Zoom sanft mit (eingebaute Vergrößerung ab 1440/1760 px) — nichts wirkt mehr verloren klein
- Spielstand-Auswahl vertikal zentriert; Liga-Ziffer im Schild kleiner und optisch mittig
- Startmenü (Hub) auf Desktop vertikal zentriert; Kampagnen-Spalte breiter (920 px)
- Hofstaat: Figuren-Gemälde deutlich größer (62×80) und antippbar — ein Tipp öffnet das Gemälde groß als Lightbox mit Name und Spruch, ein Tipp schließt
- Aufstellungs-Vorschau zentriert
- Profil: neuer Abschnitt "Spielstand & Konto" mit "Spielstand wechseln" (zurück zur Auswahl) und "Abmelden"

## 0.18.0

**Die Halle — Multiplayer auf Durable Objects**

- **Der Spielserver läuft jetzt als Cloudflare Worker mit einem SQLite-Durable-Object** („Hall"): WebSocket-Hibernation (im Leerlauf 0 Kosten, Verbindungen bleiben stehen), Spieler/Elo/Freunde/Vault im eingebauten SQLite — überlebt Schlaf und Deploys, läuft im **Workers Free Plan**. Deploy in 5 Minuten: `cd worker && npx wrangler deploy`, dann `SERVER_URL` eintragen (DEPLOY-WORKER.md).
- **Protokoll 1:1 portiert**, Client unverändert: score-gebandetes Matchmaking (Band wächst mit Wartezeit), Elo K=32, Zug-Relay mit Hash, Resign/Disconnect-Wertung, Rematch-Fenster 2 min mit Seitenwechsel, Freunde + Anfragen + Brieftauben-Geschenk, Privatsphäre „nur Freunde", Cloud-Vault (5 Snapshots), Duell-Bestenliste, token-gesicherte Admin-Kommandos (konstante Vergleichszeit, Lockout nach 5 Fehlversuchen).
- **Kern als testbare Logik ausgekoppelt** (`worker/src/logic.mjs`, storage-agnostisch): neue Suite mit **29 Protokoll-Tests** — Identitätsschutz, Band-Erweiterung, Relay, Elo-Nullsumme, doppelte Ergebnis-Meldungen, Rematch-Ablauf, Vault-Rotation, Admin-Lockout. Gesamt jetzt 11 Suiten.
- Der alte Node-Server bleibt als Referenz unter `server/` liegen.

## 0.17.0

**Wappen, Bestenlisten & feine Schlösser**

- **Das neue Logo ist im Spiel:** Der Login-Bildschirm trägt jetzt das goldene Grand-Gambit-Wappen (weich in den Hintergrund eingebettet), und der **Grand Gambit auf der Kampagnenkarte wurde nach der Logo-Figur neu modelliert** — Kugel-Kopf mit Glanzlicht, doppelter Kragenring, glatter konischer Körper, Rauten-Emblem mit Vierstrahl-Stern, gestufter Doppelsockel, Licht von links.
- **Bestenlisten & Statistiken:** Der Erfolge-Tab hat einen zweiten Reiter „Bestenlisten": dein eigener Fortschritt (%, Liga, Spielzeit, schnellster Liga-I-Durchlauf, Zug-Bestwerte) plus drei Ranglisten — Fortschritt, schnellster Durchlauf, wenigste Züge — mit ausdrücklichem „Bestwert teilen" und „Als Text kopieren" (System-Share). Das Spiel erfasst dafür ab jetzt **Züge pro Levelsieg** (nur Verbesserungen zählen) und die **Durchlaufzeit** vom ersten Sieg bis zum Thron. Die Listen laufen über die geteilte Speicherschicht: heute gerätelokal, **automatisch weltweit, sobald Supabase konfiguriert ist** — inklusive Hinweis im UI.
- **Spielstand-Werkzeuge sind jetzt Admin-Sache:** Exportieren/Importieren und die Wiederherstellungspunkte erscheinen im Profil nur noch für Admin-Konten.
- **Passwort statt PIN:** Der Sperrschutz akzeptiert jetzt vollständige Zeichenfolgen (beliebige Zeichen, 4–64), gehasht wie gehabt — bestehende Ziffern-PINs bleiben gültig.
- **Mehr Login-Wege:** Neben Google stehen **Apple** und **Discord** bereit (echte Markenzeichen, gleiche Ein-Klick-OAuth-Mechanik, aktiv mit Supabase).
- Testsuite auf 37 Prüfungen erweitert (Rekorde, Ranglisten-Merge, Kappung, Eigen-Upsert).

## 0.16.0

**Der Einstieg wie bei den Großen**

- **Login vor dem Spiel:** E-Mail + Passwort, „Mit Google anmelden" und ein Gast-Zugang. Läuft heute komplett offline über Gerätekonten (Passwörter salted-gehasht); sobald Supabase konfiguriert ist (SUPABASE-SETUP.md, 10 Minuten), übernehmen echte Cloud-Konten Google- und E-Mail-Anmeldung automatisch — der Code ist fertig verdrahtet.
- **Mehrere Spielstände pro Konto:** Nach dem Login wählst du deinen Spielstand — jede Karte zeigt Liga, geschaffte Stationen, **Fortschritt in %**, **Spielzeit** und „zuletzt gespielt", mit Fortschrittsbalken, Umbenennen und Löschen. Die Spielzeit tickt nur, während das Spiel sichtbar ist. Ein vorhandener alter Spielstand wird beim ersten Login automatisch als „Übernommener Spielstand" importiert.
- **Admin-Konto eingebaut:** `admin` mit Standard-Passwort (Warnhinweis bis zur Passwort-Änderung). Admins bekommen pro Spielstand den **Fortschrittsregler: 0 %, 100 % oder jeder Wert dazwischen** — gesetzt in Reise-Reihenfolge, mit passendem Gold/XP und freigeschalteten Bossen.
- **Meta sauber:** OpenGraph/Twitter-Karten mit eigenem Vorschaubild (og.jpg aus dem Frühlings-Artwork), Canonical auf grandgambit.win, Apple-Touch-Icon.
- Neue Testsuite (27 Prüfungen) für Konten, Spielstände, Fortschrittsregler und Migration — plus ein still gewordener Smoke-Test, der wieder scharf ist (jpg-Loader fehlte).

## 0.15.0

**Die ganze Welt ist gemalt**

- **Sechs neue Welten:** Hochgebirge (V), Ödland (VI), Steppe (VII), Roter Canyon (VIII), Wüste (IX) und das Endlose Meer (X) sind jetzt gemalte Karten — analysiert mit paletten-unabhängiger, lokal-adaptiver Kreiserkennung (mit Lochfüllung für die große Endgegner-Fläche), Knoten per Optimierung + Reparaturlauf zugewiesen, inklusive der jeweiligen Liga-Sonderorte (Seilbahnstation, Schwarzes Tor, Karawanenrast, Gesprengter Pass, Verborgener Schrein, Ankerbucht).
- **Neun neue liga-eigene Orte** füllen die restlichen echten Kreise — jede Welt bekommt Eigenes: Steppe: *Grasmeerwacht*, *Termitenturm* (Techniker-Boss). Wüste: *Singende Düne*, *Karawanengrab*, *Skorpionnest* (Attentäter-Boss). Ödland: *Aschequelle*, *Knochenacker*, *Schlackenfeld* (Alchemist-Boss). Canyon: *Echoschlucht*. Alle mit eigener Story (DE/EN), Sackgassen-Boni, drei davon rekrutierbare Bosse — 50 Stationen insgesamt.
- **Gemalte Karten, zwei neue Regeln:** Ortsnamen stehen jetzt überall **leicht unterhalb der Fläche**, und der Grand Gambit steht **mittig auf seiner Lichtung** (statt links daneben).
- 235 Tests grün; Ligen V–X laden als eigene Dateien, Single-File enthält alle zehn Welten.

## 0.14.0

**Volle Karten, ruhiges HUD**

- **Alle vier Welten sauber neu analysiert — jede helle Fläche trägt jetzt ein Level.** Vollzuweisung statt Snap: Frühling 35/35, Sommer 33/33 (handkuratiert), Herbst 34/34, Winter 33/33 gemalte Kreise belegt. Dafür gibt es ein neues Level: der **Stille Hain** (oben links am Wasserfall, Abstecher von der Silbermühle — „Ein Hain, in dem kein Vogel singt.") — 35 Stationen insgesamt.
- **HUD entschlackt:** Das „Kampagne · Liga"-Badge, das die Kapitel-Pille verdeckte, ist weg — links steht nur noch Zurück, die Kapitel-Anschrift ist frei sichtbar; rechts bleibt ein schlanker Fortschritts-Zähler (z. B. 12/35). Die Liga steht weiterhin auf der Karte selbst.
- **Zoom-Knöpfe entfernt:** Die Karte skaliert automatisch passend (Desktop mit ruhigem Rahmenabstand, mobil bildfüllend) — kein + / − mehr.
- **Ortsnamen kompakter:** Zweizeilige Namen wie „Vergessener Schrein" sitzen jetzt eng (Zeilenhöhe 0,92 statt luftig) unter ihrem Licht-Halo.

## 0.13.0

**Gerahmte Welt**

- **Die Karte lebt jetzt in einem gerundeten Rahmen:** Egal welches Bildschirmformat — die Welt füllt den Rahmen randlos, übrige Fläche bleibt dunkles Chrome (Letterbox zentriert), die Kanten sind weich gerundet. Zurück-Pille, Liga-Badge, Zoom und das Orts-Panel liegen **immer innerhalb der Karte** mit sauberem Abstand zum Rand.
- **Level-Box fix links unten:** Das Orts-Panel dockt dauerhaft unten links im Rahmen an (14 px Padding, scrollt bei Platznot) statt am Medaillon zu springen.
- **Federschrift auch im Panel:** Der Levelname steht in der Kapitel-Schrift (IM Fell, 20 px) — der Fließtext bleibt in gut lesbarer Schrift. Gehört das Level zu einem Pfad, begrüßt dich der Pfadname („Pfad der Klingen") in Federschrift am **ersten Level des Zweigs** — die schwebenden Wimpel auf der Karte sind dafür komplett verschwunden.
- **„Herausforderung starten" in Gold-Glas:** halbtransparentes Gold mit Blur, heller Kante und einem leise wandernden Glanz.
- **Ortsnamen mit Licht-Halo:** Hinter jedem Namen liegt ein weicher radialer Hell-Verlauf (geblurt, konturlos, nach außen in alle Richtungen voll transparent) — lesbar auf jedem Untergrund. Das Wort „START" ist von der Karte verschwunden, und die erste Station heißt jetzt schlicht **„Alte Wacht"** (statt Glanzfeste).
- Der Grand Gambit steht wieder etwas tiefer an seiner Station.

## 0.12.0

**Federschrift & Figur**

- **Kartenbeschriftung mit der Feder:** Ortsnamen, Zweig-Wimpel, Kapitel-Banner und der „Hier steht dein Gambit"-Hinweis stehen jetzt in *IM Fell English* kursiv — als hätte ein Kartograph sie mit Tinte eingeschrieben. Die Schrift wird selbst gehostet und eingebettet (offline-fähig). Die Wimpel verlieren ihre Icons: nur noch der geschriebene Name.
- **Der Grand Gambit ist wieder als Bauer lesbar** — runder Kopf, Kragen-Wulst, tailliert geschwungener Körper, Rocksockel — bleibt aber gemalt: zarte Kontur, Aquarell-Schattierung (jetzt größer) und eine breitere warme Aura.
- **Glas-Kacheln veredelt:** Blur deutlich stärker (12–16 px), mehr Rundung (Panel 18 px), und die versetzten Kontur-Schatten sind durch weiche, zentrierte Leuchtschatten ersetzt — keine „abgesetzte Kante" mehr hinter den Overlays.

## 0.11.0

**Die Karte flüstert**

- **Gestrichelte Reiserouten und Stationsnummern sind von den gemalten Karten verschwunden** — die gemalten Wege der Artworks tragen die Reise, die Ortsnamen genügen. (Prozedurale Ligen behalten ihre Trails; das Panel behält seine Stationsnummer.)
- **Stationen deuten nur noch an:** kein Wappen, kein Totenkopf mehr auf den Feldern — die Glow-Fläche selbst erzählt den Status (warmgold = offen, grünlich mit zartem ✓ = geschafft, bronze mit Münze = Zoll, beinahe unsichtbar = fern). Der Puls unter dem Grand Gambit bleibt.
- **Der Grand Gambit ist noch weicher:** eine fließende Silhouette ohne Ecken — runder Kopf, geschwungener Rock statt Trapez-Sockel, Kontur auf ein Viertel gedimmt, Aquarell-Schattierung und größere Aura.
- **Overlays aus Milchglas:** Kapitel-Banner, Zweig-Wimpel und das Orts-Panel liegen jetzt als transparente Blur-Flächen über der Karte (Pergament-Glas, 55–70 % Deckung); die dunklen HUD-Pillen wurden ebenfalls durchlässiger.

## 0.10.0

**Vier gemalte Jahreszeiten-Welten + verschmolzene Spielschicht**

- **Sommer, Herbst und Winter** sind jetzt gemalte Welten (Liga II, III, IV) — gleiche Pipeline wie Liga I: Lichtungserkennung mit jahreszeiten-eigener Kalibrierung (Winter über Weiß-auf-Weiß-Schwellen), L1-Layout als Rückgrat mit Snap auf gemalte Kreise, Kanten-Validierung, Prüfbilder. Endgegner liegt auf jeder Karte auf der Riesenfläche unter der Burg.
- **Stationen sind jetzt Licht statt Stein:** Auf gemalten Karten ersetzt eine flach in der Ebene liegende Glow-Fläche (weicher radialer Verlauf, statusfarben) die Sockel und Haus-Silhouetten. Steht der Grand Gambit darauf, atmet sie hell (Puls). Die Boss-Wappen schweben mit weichem Schatten darüber — SVG und Malerei verschmelzen.
- **Der Grand Gambit ist auf der Karte neu gemalt:** warme Verläufe, sanfte Kontur, zarte Aura — im Duktus der Artworks. Im Match bleibt die vertraute Spielfigur unverändert.
- Assets: Liga I eingebettet, Ligen II–IV laden als eigene Dateien (Service Worker precacht sie); Single-File-Version enthält alle vier Welten.

## 0.9.0

**Karte voll besiedelt + ruhigere Bühne**

- **Zwei neue Orte füllen die letzten freien Lichtungen:** das **Wildererlager** (unten links am stillen Flussarm — ungegateter Früh-Abstecher von der Silbermühle aus, Beute: 35 Gold) und der **Kristallgarten** (rechts an der Kristallformation — harter Warlock-Boss auf dem Weg zwischen Bannerhöhe und Torfeste, rekrutierbar). Damit ist jede gemalte Fläche der Liga-I-Welt bespielt: 34 Stationen.
- **Plattform-Sockel zurückgenommen:** halbtransparenter Stein, leiserer Ring — das Artwork führt, die Spielschicht schwebt nur noch darüber.
- **Desktop atmet:** Die Kampagnen-Kamera startet auf großen Bildschirmen eine Stufe weiter draußen (0,9× Cover statt 1×), Letterbox-Ränder zentrieren sich statt oben-links zu kleben.
- Neuer Ort-Glyph „Kristall" (drei Zacken auf Felsboden); 237 Tests.

## 0.8.0

**Liga I als gemalte Welt**

- Die erste Liga spielt jetzt auf dem **handgemalten Frühlings-Artwork**: Dörfer, Windmühle, Flüsse, Monolithen, Kristall, Höhlen — und die Burg über der großen Endgegner-Lichtung.
- **32 Lichtungen, 32 Stationen:** Die hellen Flächen der Karte wurden programmatisch erkannt (Helligkeits-/Sättigungs-Analyse) und der Kampagnen-Graph per Optimierung x-monoton daraufgelegt — kuratiert nachjustiert (d-Route zu den Monolithen, Geheimpfad an die Höhle, Zollbrücke an den Fluss, Endgegner auf die Riesenfläche unter der Burg).
- Gestrichelte Reiserouten, Plattform-Sockel, Ort-Silhouetten, Kapitel-Banner und Zweig-Wimpel liegen weiter über dem Artwork; prozedurale Landschaft, Flüsse und Rand-Festungen pausieren in Bitmap-Ligen. Ligen II–X bleiben prozedural — weitere Artworks können über dieselbe Pipeline einziehen.
- Karte ist in Liga I höher (748 statt 590 Kartenpixel) — unverzerrtes Seitenverhältnis; Kamera, Nebel und Zoom folgen. Artwork wird ins Bundle eingebettet (funktioniert auch in der Single-File-Version).

## 0.7.0

**Feinschliff-Batch: Aufstellung, Währung v3, Karte, Schimmer**

- **Aufstellung neu sortiert:** Vorschau-Brett zuerst, darunter die Slot-Aufstellung samt Grand-Gambit-Position — und die Kartenwahl wandert als eigener Streifen **unter die Box**: eine Reihe, horizontal scrollbar statt Umbruch, ohne Mini-Brett-Icons. Auch im Schnellspiel-Setup laufen die Karten-Chips jetzt einzeilig.
- **Währung v3 — Insignien statt Comic-Gold:** Skillpunkte als vierstrahliger Ordensstern mit feinen Diagonalstrahlen, Gold als geprägte Kronenmünze mit Juwelenband. Klare Silhouetten, feine Konturen — gestochen auch in Chip-Größe.
- **Feine Zahlen:** Kontostand (Hofstaat) und Schatzkammer-Summen in leichter Serifen-Schrift statt fettem Sans.
- **Preise mit echter Münze:** Ausrüstungs-Kaufknöpfe und alle Kostenangaben zeigen die gezeichnete Münze bzw. den Stern — kein Emoji-Kästchen mehr.
- **Karte:** Das Lila ist verbannt (Zoll-/Gate-Markierungen jetzt in Karten-Bronze). Die Stationen sind **flache Plattform-Sockel in der Ebene** — mit Seitenkante und Wappenfigur, die darauf steht, wie die Häuser daneben. Der Grand Gambit steht spürbar tiefer am Ort statt darüber zu schweben. Der Nebel des Unbekannten beginnt erst 3–4 Spalten weiter rechts (die nächsten 4–5 Stationen bleiben sichtbar) und ist jetzt **dunkel** statt milchig.
- **Schimmer:** Der leichte Glanz-Sweep der Schatzkammer läuft nun gestaffelt und stark gedimmt über die drei Spielen-Kacheln.

## 0.6.0

**Orte statt Punkte (Map-Immersion II) + Hofstaat-Feinschliff**

- **Jede Station ist jetzt ein Ort:** 10 gezeichnete Silhouetten (Weiler, Torhof, Arena, Zeltlager, Palisade, Bergfried, Höhle, Zollbrücke, Fähranleger, Ligafeste) wachsen leicht versetzt hinter den Medaillons aus der Karte — pseudo-3D in der schrägen Vogelperspektive. Ortsnamen thronen über ihrer Silhouette.
- **Der Grand Gambit geht hinein:** Er steht nicht mehr AUF dem Punkt, sondern tritt tiefer und links ans Tor — mit Bodenschatten unter den Füßen. Wer tiefer steht, ist näher am Betrachter: echtes Tiefen-Gefühl.
- **Kampagne randlos:** In der Kartenansicht verschwinden Kopfzeile, Seitenleiste und Dock — die Welt füllt den ganzen Schirm, wie im Match.
- **Hub-Embleme neu:** Heraldische Wappenschilde (Feste mit Banner / gekreuzte Klingen / Botentaube mit Brief) — kräftig, vollständig sichtbar, nichts steht mehr über.
- **Hofstaat lesbarer:** Goldrahmen des Grand Gambit entfernt (oben stehen + Erklärung genügt), Fließtexte eine Stufe heller, **jede der 26 Figuren spricht jetzt in einem eigenen Flavor-Satz** (DE/EN, auch die Verborgenen flüstern schon).
- **Taktik braucht Horizont:** Die **nächsten zwei** noch gesperrten Fähigkeiten zeigen Name + Symbol (ausgegraut, antippbar für Details, mit Stufen-Angabe) — erst dahinter bleibt es „???".
- **Währung v2:** Stern und Münze rendern größenadaptiv — bei Chip-Größe ohne Mikrodetail und Schatten, dafür gestochen scharf; Skillpunkt-Kosten überall mit gezeichnetem Stern.

## 0.5.0

**Hofstaat, Schatzkammer & die Gold-Ökonomie (UX-Review + Nutzerbatch)**

- **Umbenannt:** „Gefolge" → **Hofstaat** (⚜️), „Erfolge" → **Schatzkammer** (👑) — kein verwechselbares Wortbild mehr in der Navigation; alle Texte (auch EN: Court / Treasury) ziehen mit.
- **Schatzkammer, pompös:** goldener Verlaufs-Rahmen mit Ecken-Diamanten, wandernder Glanz-Sweep, Serifen-Zahlen in Gold-Verlauf — und **selbst gezeichnete Währung**: facettierter Skillpunkt-Stern und geprägte Goldmünze (mit Bauern-Relief) ersetzen die Emojis überall (Schatzkammer, Hofstaat-Guthaben, Ergebnis-Banner, Einfordern-Knöpfe, Karten-Medaillons).
- **Gold pro Sieg — sichtbar:** Jeder Sieg zahlt jetzt in den Beutel, direkt im Ergebnis-Banner. Etappen tragen ihr eigenes Gold (je tiefer die Reise und je größer der Boss, desto schwerer der Beutel — Endbosse zahlen Aufschlag), Wiederholungen die Hälfte, Schnellspiel skaliert mit der Schwierigkeit (4/7/11 + Basis), Online-Siege 6.
- **Zollwege mit Story:** Zwei neue Orte — die **Nebelfähre** (der Fährmann rudert nur für Münze; drüben hortet ein Schmugglerfürst) und die **Zollbrücke** (der Brückenwärter hebt die Schranke nur für Gold; dahinter rastet eine schwer beladene Karawane). Zoll einmal pro Liga, skaliert mit ihr — und der Schatz dahinter ist immer größer als der Zoll.
- **Ökonomie durchgerechnet:** Liga-1-Einkommen ≈ 1015 Gold deckt alle Schlüssel + Zölle (845) mit Luft; Einfordern zahlt jetzt 80 % der Stufenpunkte (min. 5) statt der Hälfte — die Schatzkammer lohnt sich. Neuer Invarianten-Test wacht darüber.
- **Aufgeben mit Netz:** ⚑ verwandelt sich beim ersten Tipp in „Wirklich aufgeben? ✓ ✕" (3,5 s) — kein Ein-Klick-Verlust mehr.
- **Onboarding & Hub:** „Auf ins Abenteuer!" springt direkt auf die Kampagnen-Karte; Kampagnen-Karte zeigt „Station X von Y · Nächster Halt" mit Fortschrittsbalken; Online-Karte ohne Text-Überlauf, ehrlich mit „Bald verfügbar"-Siegel solange kein Server steht; Level-Leiste in Gold und nie mehr unsichtbar.
- **Konsistente Sperren:** Der Aufstellungs-Editor sperrt Karten jetzt genau wie das Schnellspiel (🔒 statt Phantom-Aufstellungen); gesperrte Karten-Chips erklären sich per Tipp auch auf Touch.
- **Match-Topbar:** Kontext-Chips mittig zwischen den Pillen — kein zerfallender Leerraum auf breiten Screens.
- 235 Tests (12 neue: Etappen-Gold, Zoll-Mechanik, Claim-Beutel, Einkommens-Invariante).

## 0.4.0

**Brett & Spiel-Immersion (Umbau-Plan B + Nutzerbatch)**

- **Brett-Fixes:** Kacheln jetzt pixelgenau identisch (Ganzzahl-Zellen statt fr-Rundung — keine Verzerrung mehr), alle Karten in Klassik-Farbgebung, Mini-Koordinaten a–j / 1–10 am Rand, Desktop-Brett füllt die volle Höhe.
- **Kein Scrollen im Spiel:** Schnellspiel & Kampagne laufen jetzt im Vollbild — das Brett sitzt fest, oben schweben ‹ Zurück und ⚑ Aufgeben (gleiche Pille, roter Ton), unten die schmale Spieler-Leiste mit Status, Trank, Schlagbilanz und ↶.
- **Schnellspiel-Setup vorgelagert:** Karte, Modus und Schwierigkeit wählst du VOR der Partie; im Spiel gibt es keine Einstellungen mehr. Nach der Partie: Neue Partie oder zurück zu den Einstellungen.
- **Zeitdruck ab Liga 5:** Monster-Meilensteine bekommen ein Gesamtzeit-Budget (6 min, pro Liga −30 s bis min. 3 min), Elite-Figurenbosse ein Zug-Limit (20 s, pro Liga −1 s bis min. 12 s). Die Uhr läuft nur in deinem Zug, pausiert bei Story & Banner, und wird in der Story-Karte angekündigt. Ablauf = Zeitüberschreitung (Niederlage).
- **Gefolge in drei Reitern:** Aufstellung · Ausrüstung · Charaktere — Guthaben-Leiste bleibt immer sichtbar, kein Endlos-Scroll. Der Grand Gambit führt die Charakterliste an, mit Erklärung: ein besonderer Bauer, dein Held.
- **Spiel-Intro:** Beim allerersten Start (nach dem Datenschutz-Hinweis) erklärt eine Pergament-Karte, was Grand Gambit ist und was es besonders macht.

## 0.3.0 — Map-Immersion (Umbau-Plan Block A)
- Kampagne füllt den Bildschirm: Karte = fester Viewport (100dvh minus
  Kopfleiste), kein Seiten-Scroll mehr — Zurück-Pille, Liga-Abzeichen und
  Zoom schweben über der Welt
- Stations-Medaillons ~30 % kleiner (46 → 32 px), der Grand Gambit als
  Wanderfigur ~40 % größer (34×36 → 48×50) — er ist der Held, nicht die Felder
- Level-Detail als Pergament-Panel IN der Karte, direkt am Node verankert
  (gleitet mit Kamera und Zoom mit); Ankunft ist Teil der Welt, das Panel
  trägt Geschichte, Belohnungen, Boss-/Tor-Infos und den Start-Knopf
- Endloses-Meer-Sperre schwebt zentriert über der ausgegrauten Karte

## 0.2.0 — Erster öffentlicher Release (Browser)
- Der Grand Gambit: die Titelfigur als Helden-Bauer mit Wappen, eigener
  Fähigkeiten-Leiter (inkl. Maskerade) und wählbarer Position in der Bauernreihe
- Zehn Ligen mit zehn Klimazonen (Frühling bis Endloses Meer), Kapitän & Boot,
  neun Geheimpfade mit Gegenstands- und Begleiter-Schlössern, Brieftaube (Online-Geschenk)
- Kampagnen-Kamera folgt dem Wanderer (kein freies Scrollen), drei Zoomstufen,
  Nebel des Krieges hinter der Frontlinie
- Alle Figuren- und Landschaftsgrafiken als editierbare SVG-Dateien (assets/)
- Release-Härtung: PWA (Service Worker, Icons), Datenschutz-Hinweis & -Seite,
  Online-Zustimmung, Spielstand-Export/-Import, Fehlerfänger statt Weißbildschirm
