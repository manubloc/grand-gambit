# Changelog — Grand Gambit

## 0.27.5
- ALLE 25 MEISTER NEU GEZEICHNET — ALS SCHACHFIGUREN: Bisher waren es frei schwebende Kreaturen mit aufgemalten Augen und Mund; die Brutmutter las sich als Smiley. Jetzt steht jeder auf DERSELBEN Schachachse wie die Dame — ihr Rock, ihr Kragen, denn ein Meister nimmt ja ihr Feld ein — und nur der KOPF unterscheidet ihn. Damit liest sich jedes Ungeheuer zuerst als Figur auf einem Brett und erst dann als Ungeheuer.
- UND DIE KOEPFE FOLGEN DEN BESCHREIBUNGEN: Der Waechter ist ein Schild mit Sehschlitz, das Bollwerk traegt Zinnen, der Kanonier ein ausgefahrenes Rohr, der Koloss Klippenschultern, Eisenfaust die Hammerhand; der Springbock zwei geschwungene Hoerner, das Zebra den Maehnenkamm, der Doppelritter zwei abgewandte Pferdekoepfe, die Sturmkraehe den vorgestreckten Schnabel, der Zerreisser Zaehne und Klaue; die Brutmutter einen prallen Sack auf gespreizten Beinen, der Skorpion den gewoelbten Stachel, der Brandstifter die Flamme, die Blutmagd drei lange Schleierspitzen, der Seuchenkoenig drei gestapelte Windungen mit gekroentem Kopf; die Schemen ihre Kapuzen, die Tyrannen Helm, Lanze, Schluesselring und Klingenkronen.
- KEINE GESICHTER MEHR: Augen und Mund sind fort — genau sie liessen die Gestalten laecheln statt drohen.
- VERMESSEN STATT GERATEN: In Chromium gerendert und nachgerechnet — Hoehen 58-68 px neben 69-79 px der echten Figuren, jede auf demselben 9-px-Fuss. Drei Paare waren einander zu aehnlich (Waechter/Schleicher, Geist/Blutmagd, Geist/Wandlerin) und wurden nachgeschaerft, ein viertes (Schattenfuerst/Seuchenkoenig) danach ebenfalls. Kleinster Kopf-Unterschied jetzt 2.19 %, Mittel 4.97 %.
- SIEBEN NEUE WACHEN: jeder Meister hat eine Zeichnung, steht auf dem Schachsockel, traegt den Kragen, hat KEINE gezeichneten Augen, ist eine einzige Silhouette, und keine zwei teilen sich einen Kopf. Gesamtbatterie: 697 gruen.

## 0.27.4
- JEDES AUSRUESTUNGSSTUECK LAESST SICH ANTIPPEN und oeffnet sein eigenes Blatt: das Bild gross oben (116 px), darunter Name, Bestand, die kurze Wirkung — und neu ein ausfuehrlicher Text. Gekauft wird direkt aus dem Blatt heraus.
- AUSFUEHRLICHE ERKLAERUNGEN FUER ALLE DREIZEHN, in beiden Sprachen. Besonders fuer die erklaerungsbeduerftigen Stuecke, denn sechs davon wirken NUR mit der passenden Figur im Hofstaat — der Bergschluessel braucht einen Techniker, die Kriegsaxt einen Schildtraeger, das Donnerpulver einen Alchemisten, der Sternenkompass einen Spaeher, der Anker und das Boot den Kapitaen. Das stand nirgends und ist jetzt in jedem Blatt vermerkt. Auch die Feinheiten stehen dort: dass der Trank den ganzen Zug kostet, dass der Zeitenwender in Online-Duellen nicht gilt, dass die Brieftaube aus der eigenen Kasse zahlt.
- DER STERNENSPLITTER STEHT NICHT MEHR AUF DEM PODEST: Seine eigene Goldplatte mit wanderndem Glanz und Goldschrift ist fort — er ist eine Ware wie jede andere. Was ihn besonders macht (zwei je erreichtem Kapitel), sagt sein Blatt, und ist der Vorrat des Kapitels gehoben, steht der Hinweis genau dort.
- EIN ABSTURZ, DEN DREI PRUEFUNGEN NICHT SAHEN: Das neue Blatt liest die Gegenstandsliste, deren Import aber fehlte — beim ersten Antippen brach der ganze Hofstaat zusammen ("ITEMS is not defined"). Build, Smoke und SSR blieben gruen, weil NIEMAND das Blatt je geoeffnet hat. Behoben, und die Batterie oeffnet jetzt jedes einzelne Blatt (alle dreizehn plus den Splitter) — derselbe Griff, der schon den Schatzkammer-Absturz gefangen hat.
- ZEHN NEUE WACHEN: jedes Blatt oeffnet ohne Absturz, zeigt das grosse Bild, die kurze Wirkung und den langen Text; jeder Gegenstand hat seine Erklaerung in beiden Sprachen; die sechs Stuecke mit Begleiter-Pflicht sagen es ausdruecklich; keine Herz-Zeichen mehr in den Texten; der Splitter ohne eigene Platte. Gesamtbatterie: 690 gruen.

## 0.27.3
- "LÄUFER FREIE FIGUR" — DIE URSACHE GEFUNDEN UND BEHOBEN: Name und Hauszeile waren BEIDE als inline-flex gesetzt, und zwei Inline-Kaesten in einem Block fliessen nebeneinander. Genau darum stand der Zusatz seit Wochen hinter dem Namen statt darunter. Beide sind jetzt blockweise gesetzt — jede Zeile bekommt ihre eigene Reihe. Im Browser an fuenf Figuren nachgemessen: Bauer, Springer, Laeufer, Turm, Dame — ueberall +2 px UNTER dem Namen.
- MEIN PRUEFER HATTE EIN LOCH: Er uebersprang jeden Zusatz, der selbst ein Zeichen traegt (die Hausraute) — und das war ausgerechnet dieser. Er ist geschlossen, und eine zweite, direkte Messung schaut den beiden Kaesten jetzt frontal auf die Kanten. Gegen den alten Stand geprueft: faellt rot.
- KEIN EINZIGES MONSTER HATTE EIN BILD — und die Gemaelde lagen die ganze Zeit da: Die Chronik las die Galerie mit Klammern statt als Funktionsaufruf (paintedById["boss-b01"] statt paintedById("boss-b01")), was IMMER undefined ergibt. Deshalb standen Waechter, Brutmutter, Bollwerk, Geist, Sturmkraehe, Zerreisser — und alle uebrigen — als Fragezeichen da. Berichtigt; im Browser gezaehlt: 47 von 47 Kacheln tragen jetzt ihr Bild.
- UND NIE WIEDER EIN FRAGEZEICHEN, WO EINE FIGUR HINGEHOERT: Fehlt einmal ein Gemaelde, zeigt die Kachel die eigene Vektorgestalt als schwarze Silhouette. Der NAME darf "???" bleiben, bis du der Figur begegnet bist — die Gestalt muss es nicht.
- DREI NEUE BROWSER-MESSUNGEN halten alles fest: fuenf Figurenblaetter werden geoeffnet und die Kanten vermessen, und keine Kachel darf je wieder ohne Figur oder mit einem Fragezeichen dastehen. Gesamtbatterie: 681 gruen, Geometrie-Test 30 gruen.

## 0.27.2
- DIE TRUHE IST GEMALT: Zwoelf Ausruestungsgegenstaende tragen jetzt ihr eigenes Bild — Lebenstrank, Zeitenwender, Buschmesser, Enterhaken, Fackel, Bergschluessel, Kriegsaxt, Kamel, Donnerpulver, Anker, Brieftaube und Boot. Sie erscheinen ueberall gleich, weil alle Stellen durch EIN Symbol laufen: Vorratstruhe, Kampf-HUD (Trank- und Zeitenwender-Knopf), verschlossene Pfade auf der Karte, Kapitel-Belohnungen und die Akademie.
- SECHS DAVON MUSSTEN ERST FREIGESTELLT WERDEN: Die Haelfte der Lieferung kam mit weissem Hintergrund. Ein einfacher Weiss-Filter haette das Segel des Bootes, die Federn der Taube und den Sand der Sanduhr mitgefressen — deshalb wird der Hintergrund nur vom RAND her weggenommen (zusammenhaengende Flaeche), die Kante eine Spur eingezogen und weich ausgelaufen. Gemessene Kantenhelligkeit danach hoechstens 89 von 255: kein weisser Saum.
- DER STERNENKOMPASS FEHLT in der Lieferung — er behaelt sein gezeichnetes Symbol, bis sein Bild kommt. Der Test nennt ihn beim Namen, damit er nicht vergessen wird.
- DIE AKADEMIE WAR VERALTET: Sie sprach von einer "Ligafeste", die es in der Geschichte nicht mehr gibt. Die Kampagnen-Karte nennt jetzt die vier Kapitel beim Namen (Der Aufbruch, Die drei Pfade, Die Pruefungen, Der Aufstieg), die Zitadelle als Ziel, den Grossmeister als Gegner und die 51 Stationen. Auch im Code hiess n22 noch "League Keep" — ebenfalls berichtigt.
- UND ZWEI REGELN FEHLTEN DORT GANZ: Die Hofstaat-Karte erklaert jetzt, dass eine Figur mehrere Faehigkeiten KOENNEN darf, aber pro Partie nur EINE wirkt (und dass der goldene Stern genau das anzeigt) sowie die festen Plaetze von Koenig und Dame. Die Duell-Karte nennt die vier Zeitformate.
- ZEHN NEUE WACHEN: fast die ganze Truhe gemalt, Ungemaltes faellt sauber zurueck, ein gemaltes Stueck rendert als Bild in der gewuenschten Groesse, die Akademie zeigt Bilder statt Zeichen, spricht nicht mehr von der Ligafeste, nennt Zitadelle und Grossmeister, lehrt die Ein-Zauber-Regel und die vier Gambits. Gesamtbatterie: 681 gruen.

## 0.27.1
- CLASSIC GAMBIT IST GEBAUT — FERNSCHACH, DAS OFFLINE WEITERLEBT: Ein Live-Duell ist eine Bruecke zwischen zwei offenen Verbindungen; schliesst einer die App, ist die Partie tot. Eine Fernpartie liegt jetzt VOLLSTAENDIG auf dem Server: Saat, beide Armeen und die geordnete Liste aller Zuege. Weil das Brett deterministisch ist (gleiche Saat + gleiche Zuege = gleiche Stellung), spielt der zurueckkehrende Spieler die Liste einfach nach — der Server muss kein Schach verstehen und keine Stellung serialisieren.
- BEWIESEN, NICHT BEHAUPTET: Ein Test spielt VIER Halbzuege ueber vier Tage durch den echten Regelkern, beide Spieler zwischendurch offline — danach bauen beide Seiten unabhaengig nach und landen auf der IDENTISCHEN Stellung, einig darueber, wer am Zug ist.
- DIE FERNPARTIEN-LISTE in der Lobby: jede laufende Partie mit Gegner, Zugzahl und Restfrist; die, in denen DU am Zug bist, stehen oben und leuchten violett. Ein Tipp oeffnet sie, ein Zug legt sie zurueck ins Regal — mit einer ruhigen Karte, die sagt, dass der Gegner nun dran ist.
- FRIST UND FAIRNESS: Wer drei Tage nicht zieht, verliert auf Zeit; jeder Zugriff auf das Regal raeumt abgelaufene Partien ab und wertet sie. Niemand kann zweimal hintereinander ziehen, ein Fremder kann eine Partie nicht anfassen, eine beendete Partie nimmt keinen Zug mehr an, und Aufgeben entscheidet sie sofort. Die Wertung laeuft ueber dieselbe Leiter wie die Live-Duelle.
- KEINE KI IN FERNPARTIEN: Die Maschine schweigt — hier schuldet ein Mensch die Antwort.
- OFFEN BLEIBT EINZIG DIE PUSH-BENACHRICHTIGUNG: Solange der Gegner online ist, erfaehrt er den Zug sofort; sonst findet er ihn beim naechsten Oeffnen in der Liste. Echtes Push braucht Signaturschluessel (VAPID) und einen Abo-Speicher — das ist ein eigener Schritt, kein Teil dieses Umbaus. Gesamtbatterie: 671 gruen (26 neue Pruefungen im Saal).

## 0.27.0
- DIE VIER GAMBITS: Online-Duelle haben jetzt Zeitformate, als Karten in der Lobby — QUICK GAMBIT (1 Min +1, rotes Blitzzeichen, "Kugelschnell und pure Reflexe"), RUSH GAMBIT (3 Min +2, gelbe Stoppuhr, hervorgehoben als der Modus, in dem die meisten Duelle laufen), PRIME GAMBIT (10 Min, blaues Schild, mit der Vorwarnung "eine Partie kann 20-30 Minuten dauern") und CLASSIC GAMBIT (1-3 Tage, violette Krone).
- EINE ECHTE DUELL-UHR: Bisher tickte nur in Kampagnenstationen eine Uhr, und nur auf deiner Seite. Im Duell laufen jetzt BEIDE Uhren — deine auf deinem Zug, seine auf seinem — und jeder Zug gibt seinem Urheber den Zuschlag zurueck (Fischer). Die Bedenkzeit des Gegners haengt neben deiner im Kopfbereich und tritt zurueck, solange du am Zug bist. Faellt seine Uhr auf null, gewinnst du; faellt deine, verlierst du.
- PAARUNG NACH UHR: Der Worker fuehrt den gewaehlten Takt in der Warteschlange und paart nur Gleiches mit Gleichem — ein Bullet-Spieler landet nie in einer Rapid-Partie. Beide Seiten bekommen dieselbe Uhr angesagt, keiner startet mit einem anderen Budget.
- CLASSIC GAMBIT EHRLICH AUSGEWIESEN: Fernschach braucht Partien, die weiterlaufen, wenn beide die App schliessen, und eine Benachrichtigung, wenn man am Zug ist — beides kann die heutige Live-Verbindung nicht. Die Karte kuendigt das Format an und sagt genau das, statt einen Modus vorzutaeuschen, der ins Leere laeuft.
- SECHZEHN NEUE WACHEN: vier Gambits mit Namen, Takt, Farbe und Zeichen in beiden Sprachen, steigende Budgets von Bullet bis Fernschach, Zuschlag in den schnellen Formaten, Rueckfall bei unbekanntem Takt — und im Worker: getrennte Warteschlangen je Uhr, gleiche Ansage an beide Seiten. Gesamtbatterie: 645 gruen.

## 0.26.12
- ZUSATZ NEBEN DEM NAMEN: NACHGEMESSEN, IN ALLEN VIER RAEUMEN — und nirgends gefunden. Der Hofstaat wurde in echtem Chromium Raum fuer Raum abgetastet (Chronik, Aufstellung, Ausruestung, Verzeichnis) und zusaetzlich das geoeffnete Figurenblatt: Fuer JEDEN Figurennamen wird geprueft, ob rechts daneben auf derselben Zeile ein Kleintext derselben Karte steht. Ergebnis ueberall 0. Die Sache aus 0.26.9 haelt also — wer den Zusatz noch neben dem Namen sieht, hat vermutlich noch einen aelteren Stand geladen.
- UND SIE KANN NICHT MEHR ZURUECKKOMMEN: Sechs neue Browser-Messungen im Geometrie-Test halten es fest. Der Messfuehler unterscheidet dabei sauber zwischen echten Namenszeilen und den Wert-Zeilen ("3 Angriffsstaerke"), deren Beschriftung absichtlich NEBEN der Kugel steht — und ignoriert die "???"-Platzhalter unentdeckter Figuren.
- ERFOLGS-EMBLEME NOCH GOLDENER: Helligkeit von 1.35 auf 1.5 im geoeffneten und 1.16 auf 1.28 im ruhenden Zustand, mehr Sattheit und ein staerkerer Goldstich. Neu darueber: eine warme Goldglasur und ein weiches Glanzlicht oben links, wo die Kerze steht — die Platte liest sich als poliert statt flach.

## 0.26.11
- DIE ZWEI ERSTEN FRAGEN STEHEN JETZT AN DER TUER: Gleich nach dem Einstieg fragt das Spiel, welche Figuren du sehen willst (Simpel oder Detailreich gemalt) und wie stark der Gegner rechnen soll. Beides lag bisher tief im Profil, wo ein Neuling nie hinsieht. Dabei steht ausdruecklich dabei, dass die Kampagne ihre EIGENE Steigerung mitbringt (spaetere Kapitel fordern auch auf "Leicht") und dass sich beides jederzeit unter PROFIL wieder aendern laesst.
- BESCHREIBUNGEN DER SCHATZKAMMER GEGEN DEN CODE GEPRUEFT — zwei waren schlicht falsch: "Blitzmatt" nannte seine Grenze nie (der Code zaehlt 40 HALBZUEGE, beide Seiten zusammen — also spaetestens dein 20. Zug), und "Schmiedekunst" sprach von einer SCHMIEDE, die es im Spiel gar nicht gibt: Aufstiege kauft man im Hofstaat mit Skillpunkten. Beides richtiggestellt, dazu zehn weitere Texte geschaerft: wessen Schlagzahl zaehlt (deine), was "Dame gehalten" wirklich meint (nie gefallen; ein Meister auf ihrem Feld zaehlt als Dame), wieviele Stationen es gibt (51), dass Freundschaftskaempfe nicht erneut zaehlen, und dass ein Remis die Siegesserie ebenso beendet wie eine Niederlage.
- GLANZ LAEUFT JETZT: Die Lichtstraehne lag als starres Band auf der Platte — beim Antippen wandert sie nun EINMAL von links nach rechts hindurch, offen wie geschlossen, mit eigenem Zaehler je Platte.
- EMBLEME HELLER UND GOLDENER: Die gemalten Erfolgsbilder standen fuer eine Schatzkammer eine Spur zu dunkel — angehoben, waermer und mit etwas mehr Gold (geoeffnet noch kraeftiger).
- VIERZEHN NEUE WACHEN, darunter zwei, die die Zahlen im Text gegen den Code halten: Nennt der Blitzmatt seine Grenze? Erfindet noch irgendein Text eine Schmiede? Gesamtbatterie: 629 gruen.

## 0.26.10
- AUFSTELLUNG BEI RUHENDEM KAMPF: GEPRUEFT — KEIN FEHLER, aber ab jetzt gesagt. Nachgerechnet: Ein pausierter Kampagnenkampf wird aus seinem eigenen Schnappschuss fortgesetzt, deine laufende Partie behaelt also exakt ihre Aufstellung; was du im Hofstaat aenderst, wirkt ab dem NAECHSTEN Kampf. Beides ist jetzt als Dauertest verankert (Brett unveraendert UND naechste Schlacht mit der neuen Reihe). Neu ist ein Hinweis im Aufstellungs-Editor, sobald ein Kampf ruht — damit niemand fuerchten muss, gerade einen Spielstand zerschossen zu haben.
- DIE SCHATZKAMMER SETZT IHR EMBLEM IN SZENE: Wird eine Platte geoeffnet, stellt sie sich auf — das Medaillon steigt nach oben in die Mitte, waechst von 56 auf 104 px, leuchtet heller (kraeftigerer Rand, satterer Schein, das Bild eine Spur heller und farbiger). Um den Kreis wandert ein rotierender Lichtring, und aus seiner hellsten Stelle spruehen fuenf Funken TANGENTIAL davon — jeder auf seiner eigenen Bahn, mit eigenem Takt und Versatz. Geschlossene Platten bleiben still.
- NEUN NEUE WACHEN: aufgestellte Platte, gewachsenes Emblem, aufsteigende Bewegung, drehender Ring, Funken auf eigenen Tangenten, Ruhe im geschlossenen Zustand — und der Hinweis erscheint nur, wenn wirklich ein Kampf ruht. Gesamtbatterie: 615 gruen.

## 0.26.9
- DER ZUSATZ STEHT JETZT UNTER DEM NAMEN — endlich, und diesmal nachgemessen: Auf den Kacheln der Chronik klebte "Krone" / "Schatten" als winzige Zeile in der OBEREN RECHTEN ECKE. Er sitzt nun als Bildunterschrift direkt unter dem Figurennamen. Im Browser vermessen: 20 Zusaetze unter dem Namen, KEINER daneben.
- JEDE KACHEL TRAEGT IHRE VEKTORFIGUR: Oben rechts steht jetzt die simple Figur selbst (28 px, blank, ohne Ring oder Rahmen) — bei Kronen- und Schattenfiguren wie bei jedem Monster mit seiner eigenen Silhouette. Gemessen: 27 von 27 Kacheln.
- AUCH IM FIGUREN-POPUP: Ueber dem Gemaelde sitzt oben rechts der Vektor-Zwilling (40 px im grossen Blatt, 28 px in der Karte), damit Gemaelde und Silhouette als EINE Figur gelernt werden.
- EIN SAAL STATT FUENF LUECKENREIHEN: Die Meister standen in fuenf Sippen-Abschnitten (Golems, Bestien, Schlangen, Schemen, Tyrannen) — jeder duenn besetzt und voller "???", was wie fehlende Bilder aussah. Es fehlt KEIN Bild: die Fragezeichen sind Monster, denen du noch nicht begegnet bist. Sie stehen jetzt gemeinsam unter "MEISTER & GROSSMEISTER".
- DURCHGAENGIGE BENENNUNG: Ueberschrift, Kachel-Zusatz und die Zeile unter dem Namen sagen jetzt dasselbe — "Figuren der Krone" und "Figuren des Schattens" statt "Kronenfiguren" hier und "FIGUREN DER KRONE" dort.
- FUENF NEUE BROWSER-MESSUNGEN im Geometrie-Test halten das fest: Kacheln werden gezeichnet, jede traegt ihr Eck-Zeichen, kein Zusatz steht je wieder neben dem Namen, die Meister haben einen Saal, die Sippen-Ueberschriften sind fort. Gesamtbatterie: 603 gruen.

## 0.26.8
- DAS HAUPTMENUE IM KAMPF WAR EINE SACKGASSE: Auf breiten Bildschirmen bleibt die Menueleiste waehrend einer Partie sichtbar — ein Klick darauf bewirkte jedoch GAR NICHTS, weil das Brett einfach ueber dem gewaehlten Bereich weiter gezeichnet wurde. Jetzt fragt das Spiel nach: "Kampf verlassen?" — und es sagt ehrlich, was es kostet. Ein Kampagnenkampf wird gesichert und laesst sich an derselben Station fortsetzen; ein Schnelles Spiel oder ein Online-Duell laeuft ohne Sicherung und waere verloren. Dazu ein Weg zurueck zum Brett.
- UND ER WIRD JETZT WIRKLICH GESICHERT: Bisher sicherte sich ein Kampagnenkampf nur beim Wegblenden der App und ueber den Zurueck-Pfeil. Wer ihn anders verliess — Menue, Browser-Geste — verlor ihn. Das Verlassen selbst sichert jetzt, genau wie der Pfeil (eine beendete Partie bleibt unberuehrt).
- AUFSTELLUNG: NACHGEWIESEN, NICHT VERSPROCHEN. Auf deine Frage hin geprueft und als Dauertest verankert: Was du im Hofstaat je Karte aufstellst, wird auf JEDER Karte auch wirklich ins Feld geschickt — und der Koenig steht dabei weiterhin auf seinem festen Feld. Eine beschaedigte gespeicherte Reihe kann den Kampf nicht sprengen.
- ZEHN NEUE WACHEN und ein Durchlauf im echten Browser (Kampf → Menue → Rueckfrage → zurueck zum Brett → wechseln). Gesamtbatterie: 599 gruen.

## 0.26.7
- DIE WICHTIGSTE REGEL WIRD ENDLICH ERKLAERT: Vor jedem Lebenskampf erscheint eine Einweisung — BLAU ist die Kampfkraft (so viele Lebenspunkte reisst die Figur beim Angriff herunter), ROT sind die Lebenspunkte (so viel haelt sie selbst aus) — und vor allem der RUECKPRALL: Haelt der Verteidiger stand, springt der Angreifer auf sein Ausgangsfeld zurueck; erst mit dem letzten Lebenspunkt rueckt man vor. Das sah bisher wie ein Fehler aus, weil es nirgends stand. Auch der goldene Stern wird erklaert (die eine Faehigkeit dieser Partie ist noch frei).
- MIT "NICHT MEHR ANZEIGEN": Die Einweisung kommt vor jedem Lebenskampf, bis man sie einmal wegwinkt — dann bleibt sie fuer immer fort. Bei Kampagnenstationen erscheint sie hinter der Erzaehlkarte, damit die Geschichte den Vortritt hat.
- ZUM NACHLESEN IN DER AKADEMIE: Zwei neue Lehrkarten — "Die zwei Kugeln" und "Angriff & Rueckprall", letztere mit gerechnetem Beispiel (3 Kraft gegen 5 Leben braucht zwei Angriffe) und den echten Kugelgrafiken statt Platzhaltern.
- ZWEI FEHLER NEBENBEI BEHOBEN: Die Akademie stuerzte ab, wenn der Seitenzeiger hinter das Ende der kuerzeren Kartenreihe geriet (Spurwechsel) — der Index wird jetzt geklemmt. Und die Brettmessung aus 0.26.0 warf beim Server-Rendern eine React-Warnung; sie nutzt jetzt den passenden Haken.
- NEUN NEUE WACHEN: Die Einweisung muss beide Kugeln und den Rueckprall erklaeren, einen Weg zum Abschalten anbieten und nach dem Abwinken fortbleiben; die Akademie muss beide Lehrkarten fuehren. Zusaetzlich im echten Browser durchgespielt: Erzaehlkarte, Einweisung, Brett. Gesamtbatterie: 589 gruen.

## 0.26.6
- JEDES MONSTER BEKOMMT SEIN EIGENES GESICHT: Im simplen Modus teilten sich 25 Monster ganze FUENF Sippen-Silhouetten — Der Waechter, Das Bollwerk, Kanonier, Der Koloss und Eisenfaust waren buchstaeblich dieselbe Zeichnung, ebenso je fuenf Bestien, Schlangen, Schemen und Tyrannen. Alle 25 sind jetzt einzeln gezeichnet: der Waechter als Schild mit Sehschlitz, das Bollwerk mit Zinnen, der Kanonier mit ausgefahrenem Rohr, der Koloss mit Klippenschultern, Eisenfaust mit Hammerhand, der Springbock mit geschwungenen Hoernern, das Zebra mit Maehne, der Doppelritter mit zwei Koepfen, die Sturmkraehe mit vorgestrecktem Schnabel, der Zerreisser mit Zaehnen und Klaue, die Brutmutter als praller Sack auf Spreizbeinen, der Skorpion mit gewoelbtem Stachel, der Brandstifter als Flamme, die Blutmagd mit spitzem Schleier, der Seuchenkoenig als gekroente Windung, und so fort bis zu Asra mit ihrer Klingenkrone und Osric mit der hoechsten Krone des Bretts.
- AUSWAHL NACH MONSTER, NICHT NACH SIPPE: Die Gestalt wird jetzt zuerst ueber die Monster-Kennung gesucht; die fuenf Sippenbilder bleiben als Rueckfalloption fuer alles Neue (und fuer die Figuren-Bosse der Kampagne).
- GEPRUEFT STATT BEHAUPTET: Alle 25 in Chromium gerendert und vermessen — Deckung 4-7 %, Hoehe 46-66 % der Kachel, exakt im Band der bewaehrten Sippenbilder (5-7 %, 51-61 %), kein Randkontakt, keine zwei Silhouetten einander aehnlich. Der Kanonier fiel dabei zu klein aus und wurde gestreckt.
- SECHS NEUE WACHEN: jedes Monster besitzt eine eigene Gestalt, alle 25 unterscheiden sich, die Sippenbilder bleiben als Rueckfall erhalten, jede Zeichnung nimmt die Brettfarben an und traegt die Kontur, und zwei Monster derselben Sippe muessen verschieden zeichnen. Gesamtbatterie: 580 gruen.

## 0.26.5
- KONTUREN FUER DIE SIMPLEN FIGUREN (Kontraste gerechnet): Die goldenen Figuren trugen bisher GAR KEINE Kante und verschmolzen auf hellen Feldern mit dem Untergrund, die Haarlinie des Gegners war auf dunklen Feldern zu duenn. Jetzt traegt jede Seite ihr Gegenteil — fast schwarze Kontur ums Gold (7.8:1 zur eigenen Fuellung, 7.4:1 zum hellen Feld), fast weisse ums Marineblau (12.4:1 und 6.6:1). Die Kontur wird UNTER die Flaeche gemalt (paint-order), sie schaerft also den Umriss ohne Details zu fressen, und ihre Staerke ist ueber eine Variable regelbar (alle 34 Figuren-Dateien entsprechend erweitert).
- DER GRAND GAMBIT HAT ENDLICH EINE EIGENE SILHOUETTE: Er teilt sich die Figurenart mit dem Bauern und lieh sich darum dessen Umriss — als einzige Figur im Spiel ohne eigene Gestalt. Neu gezeichnet als Bauer, der weitergegangen ist: derselbe runde Kopf und Kragen, aber breitere Schultern zum Umhang und eine Klinge im Ruecken. Sein Wappen reitet weiterhin obenauf.
- UMSCHALTER KLARER BENANNT: "Simpel" und "Detailreich gemalt" (englisch "Simple" / "Painted in detail") statt "Simpel (Vektor)" und "Gemalt"; der Hinweistext nennt jetzt die Kontur.
- ACHT NEUE WACHEN: jede Figurenart besitzt eine Vektorgestalt, der Gambit eine eigene (und nicht die des Bauern), beide Seiten tragen eine Kontur, und die beiden Konturen sind Gegensaetze. Gesamtbatterie: 574 gruen.

## 0.26.4
- DIE EMBLEME ZEIGEN SICH, WIE SIE GEMALT SIND: Bis ein Erfolg begonnen war, lag ein Graufilter samt Abdunklung auf dem Medaillon — bei dieser Staerke war schlicht nicht mehr zu erkennen, WAS das Bild zeigt. Der Filter ist ersatzlos weg; jedes Emblem steht auf jeder Platte in voller Staerke. Was erreicht ist, sagen weiterhin Balken, Rauten und Zaehler.
- MEHR GOLD, KRAEFTIGERE KONTUR: Der Plattengrund ist waermer und heller (rgba 96,74,34), der Saum von 1.5 auf 2 px verstaerkt und aufgehellt, der Medaillonring auf 2.5 px in hellem Gold mit staerkerem Schein. Die Glanzstraehne ueber der Platte ist doppelt so praesent.
- SCHRIFT KONTRASTREICHER (nachgerechnet): Titel jetzt 12.5:1 statt 6.1:1, Beschreibungen 10.2:1, die blasseste Stufe noch 7.6:1 — WCAG verlangt 4.5. Der Titel traegt zusaetzlich einen feinen Schattenriss, damit er sich vom Gold abhebt.
- DREI NEUE WACHEN: kein Emblem darf je wieder ausgegraut oder abgedunkelt werden, alle 14 muessen in voller Staerke gezeichnet sein, und die Kontur muss kraeftig genug bleiben. Der Platten-Test prueft jetzt farbunabhaengig, dass alle Karten denselben Grund tragen — so kann ein Neuanstrich keine dunkle Sonderfassung zurueckschmuggeln. Gesamtbatterie: 566 gruen.

## 0.26.3
- FEHLERBERICHT VOM 22. JULI AUFGEKLAERT (Android, v0.24.25, "Cannot read properties of undefined (reading 'map')"): Das war der Schatzkammer-Absturz beim Antippen eines Erfolgs. Nachgestellt am alten Stand — der Absturz tritt Wort fuer Wort auf, sobald ein Erfolg aufgeklappt ist; auf dem heutigen Stand nicht mehr. Behoben wurde er in 0.24.26 (evaluate reicht die Stufenliste mit, dazu ein Rueckfall auf eine leere Liste), gedeckt vom Smoke-Fall "AchievementsScreen (open)".
- VIER NEUE WACHEN gegen dieselbe Fehlerklasse: (1) Die leere Kulisse fuer GEMALTE Kapitelkarten muss jedes Feld erklaeren, das die Karte zeichnet — genau dieser Pfad wird heiss, sobald die gemalten Karten kommen, und ein fehlendes Feld dort wuerde exakt denselben Absturz ausloesen. (2–4) Schatzkammer, Hofstaat und Chronik werden gegen einen Spielstand gerendert, dem optionale Teile fehlen (wie bei alten Speicherstaenden), und muessen das ueberleben. Gesamtbatterie: 562 gruen.

## 0.26.2
- DIE SCHATZKAMMER TRAEGT IHRE GEMALTEN EMBLEME: Alle 14 Erfolge haben jetzt ihr eigenes Bild — Siegeskranz, gestuerzte Krone, gefluegelte Sanduhr, Monsterschaedel und die uebrigen. 14 Erfolge, 14 Embleme, kein Ueberhang auf keiner Seite.
- FREIGESTELLT UND NEU GEGOSSEN: Die Vorlagen kamen als undurchsichtige Quadrate auf fast schwarzem Grund. Zuerst per Leuchtdichte-Matte freigestellt (Grund abgezogen, Farbe zurueckgerechnet, damit keine dunklen Saeume bleiben) — auf hellem Untergrund blieb aber ein feiner Kasten vom Vignetten-Schleier sichtbar. Deshalb sind sie als RUNDE Medaillons neu gegossen: die Scheibe traegt das warme Dunkel der Goldplatten, das Emblem sitzt mittig darin. So gibt es auf keinem Untergrund eine Kante — geprueft auf hellem Gold wie auf dunklem Grund.
- Das Medaillon waechst von 48 auf 54 px, damit die Zeichnung atmet; der goldene Ring, sein Schein und die gedaempfte Darstellung unbegonnener Erfolge bleiben. Fuer alles ohne Gemaelde steht weiterhin das gezeichnete Zeichen bereit.
- DREI NEUE WACHEN: jeder Erfolg hat sein Emblem, kein Emblem ist verwaist, und alle sind quadratisch und gross genug fuer eine scharfe Praegung (aus den WebP-Kopfdaten gelesen). Gesamtbatterie: 557 gruen.

## 0.26.1
- DIE CHRONIK LIEGT DEM ADMIN OFFEN: Als Admin siehst du jede Figur und jedes Monster sofort — mit Namen, Grundzuegen und Faehigkeiten, ohne etwas freizuschalten oder umzustellen. Gemessen: Beim Spieler bleiben 45 Eintraege verhuellt, beim Admin keiner (alle 27 Figuren namentlich, dazu die Monster). Fuer Spieler bleibt die Chronik unveraendert eine Seite-fuer-Seite verdiente Sammlung.
- BEIDE GESICHTER JEDER FIGUR: Neben dem gemalten Portrait steht in der Chronik jetzt das schlichte Vektor-Zeichen — die Silhouette, die man auf dem Brett in einer Sekunde liest. Bei Figuren wie bei Monstern, 52 Zeilen, jedes Paar vollstaendig.
- ZUG-VORSCHAU IN DER FARBE IHRER ARMEE: Die Zielfelder tragen jetzt dieselbe Legierung wie Knoepfe, Kugeln und Figuren — deine Zuege als geschliffene GOLD-Perle, die eines vom Seher gelesenen Gegners in poliertem STAHL. Ein Schlagzug bleibt ein Ring, ein Schritt eine Perle: die Form sagt was, das Metall sagt wessen. Der Ring entsteht aus einem einzigen Farbverlauf mit klarer Mitte — ohne Masken, damit er auf jeder Darstellungsmaschine gleich aussieht.
- SIEBEN NEUE PRUEFUNGEN halten das fest: dass der Admin nichts verborgen sieht, der Spieler weiterhin schon, und dass Portrait und Vektor-Zeichen in jeder Zeile paarweise auftreten. Gesamtbatterie: 554 gruen.

## 0.26.0
- DAS BRETT RUHT ENDLICH IN DER MITTE — im Browser vermessen, nicht geschaetzt: Auf einem 390x844-Telefon standen 437 px Himmel ueber dem Brett und 47 px darunter. Zwei Ursachen: (1) der Brett-Rahmen richtete seinen Inhalt nach UNTEN aus, sodass aller freie Platz oben landete; (2) die Leiste oben (Zurueck + Gegnerzeile) ist hoeher als deine Zeile unten, was das Brett zusaetzlich nach unten schob. Jetzt zentriert der Rahmen, der Kopfraum wird nur noch reserviert wenn die Hoehe wirklich knapp ist, und die HUD-Hoehen werden zur Laufzeit gemessen und ausgeglichen. Ergebnis auf iPhone, Android, grossem Telefon und Tablet: 0 px Abweichung.
- ALLE FIGUREN SCHARF: Die Eroeffnung legte zwei Sekunden lang einen Weichzeichner ueber das ganze Brett, um einen unbekannten Gegner hervorzuheben — und weil ein Meister im DAMEN-Feld steht, las sich das als "nur die Dame ist scharf". Der Weichzeichner ist raus; der Fremde meldet sich weiterhin mit seinem pulsierenden Ring.
- KUGELN GROESSER: Die Wertkugeln unter jeder Figur wachsen um 17 % (Ziffern mit ihnen), die Armee-Summen von 30 auf 38 px.
- DAS FELD BEKOMMT SEINE ORDNUNG: Erbeutete Figuren liegen oben LINKS am Brett (seine Beute) und unten rechts (deine), die Gesamtwerte halten die rechten Ecken oben und unten, die Ausruestung sitzt unten links — alles mit demselben Randabstand (12 px), auch das Inspektionsblatt.
- NEUE PRUEFUNG test_layout.mjs: misst die Brettlage in echtem Chromium auf vier Geraetegroessen und faellt, wenn die Mitte um mehr als 8 px verfehlt wird. Die erste Pruefung im Projekt, die echte Geometrie misst statt Markup.

## 0.25.5
- JEDE PLATTE LEUCHTET: Unbegonnene Erfolge lagen bisher auf einem dunkleren Grund und wirkten wie abgeschaltet. Jetzt tragen ALLE Karten denselben warmen Goldgrund und denselben Schein — was erreicht ist, sagen Medaillon, Balken und Rauten, nicht mehr das Abdunkeln der halben Schatzkammer. Auch die Medaillons unbegonnener Erfolge stehen im Licht (Graustufe von 80 % auf 35 % zurueckgenommen).
- KONTUR RUNDUM GLEICH: Der goldene Saum lief als 3 px starker Balken NUR an der linken Kante — das las sich wie ein schiefer Rahmen statt wie ein Rand aus Gold. Er ist ersetzt durch eine gleichmaessige Kontur (1.5 px) mit umlaufender innerer Lichtkante.
- WARTENDE BELOHNUNG BEKOMMT RAUM: Steht eine Belohnung bereit, sitzt die Platte spuerbar grosszuegiger (19 statt 16 px Innenabstand), leuchtet kraeftiger, und der Einfordern-Knopf bricht auf eine eigene Zeile: volle Breite, eine Schriftgroesse groesser (14 statt 12) und mit echter Luft nach oben (9 px Abstand plus 13 px Innenabstand oben), damit er nie mehr am Text klebt.
- DREI NEUE WACHEN dazu: keine einseitige Kontur, keine dunkle Karte, und die Einfordern-Platte muss messbar geraeumiger sein als die uebrigen. Gesamtbatterie: 547 gruen.

## 0.25.4
- DIE KRONE HAELT IHRE PLAETZE: Koenig und Dame starten jetzt auf JEDEM Brett an derselben Stelle — Koenig auf der Mitte-Rechts-Position, seine Gemahlin links daneben (10 Felder → 5/4, 8 Felder → 4/3 wie im Schach, 6 Felder → 3/2). Ein Liga-Boss uebernimmt exakt ihr Feld. Vorher mussten die beiden nur nebeneinander stehen und konnten durch die ganze Reihe wandern; das machte jede Karte unnoetig fremd.
- IM AUFSTELLUNGS-EDITOR MITGEZOGEN: Das Koenigsfeld ist gesperrt (mit Hinweis), das Damenfeld bietet nur Dame oder Boss, und in allen anderen Feldern taucht die Krone gar nicht mehr auf. Der Boss-Bereich der Auswahl erscheint nur noch am Damenplatz.
- KEINE SACKGASSE FUER ALTE AUFSTELLUNGEN: Eine gespeicherte Reihe mit wanderndem Koenig waere unrettbar geworden (das Feld laesst sich ja nicht mehr bearbeiten) — solche Reihen fallen jetzt sauber auf die Standardaufstellung der Karte zurueck.
- SCHATZKAMMER ENDLICH LESBAR (vermessen): Die Schrift stand mit 2.9:1 auf den Goldplatten — unter dem Mindestwert selbst fuer grosse Schrift — und unbegonnene Karten liefen zusaetzlich auf 62 % Deckkraft, was den Kontrast Richtung 2:1 drueckte. Neue warme Pergamenttoene liegen bei 6.8:1 und 9.0:1, unbegonnene Karten treten jetzt ueber FARBE zurueck statt ihre eigene Schrift wegzublenden (90 % statt 62 %), Beschreibungen eine Spur groesser.
- ZWEI NEUE WACHEN: Der Kronen-Vertrag prueft auf jeder Karte, dass Koenig und Dame auf ihren festen Feldern sitzen UND dass ein Verschieben abgelehnt wird. Der Kontrast-Vertrag rechnet die WCAG-Kontraste jeder Textfarbe der Schatzkammer gegen die dunkelste Platte nach und schlaegt Alarm, bevor wieder etwas im Dunkeln verschwindet. Gesamtbatterie: 541 gruen.

## 0.25.3
- CHAMPIONS FUELLEN DAS KARTEN-POPUP: Der Bilderrahmen war 84x108 — hoeher als breit. Ein quadratisches Gemaelde wurde darin von der BREITE begrenzt und nur 84 px hoch gezeigt: ein Viertel des Rahmens blieb leer. Der Rahmen ist jetzt quadratisch und waechst mit der Panelbreite mit (96-148 px), die Figuren stehen rund 60 % groesser und fuellen die volle Hoehe.
- VERMESSEN STATT GERATEN: Ueber alle 70 Gemaelde geprueft, wie breit eine Figur bei voller Hoehenfuellung wird — Maximum 0.918 der Hoehe (ein ausladendes Monster). Ein quadratischer Rahmen fasst damit jede Figur, ohne dass etwas ueber den Namen daneben ragt.
- KUNST-VERTRAG ALS DAUERWACHE (4 Pruefungen): Die Testbatterie liest jetzt die WebP-Kopfdaten aller Gemaelde direkt von der Platte — kuenftige Bilder muessen das Seitenverhaeltnis einhalten (max 1.1) und genug Bildzeilen mitbringen (280+), sonst faellt der Test, bevor etwas im Popup ueberlaeuft oder unscharf wird. Gesamtbatterie: 534 gruen.

## 0.25.2
- MEIN FEHLER, ZURUECKGENOMMEN: Gegnerische Meister im Damen-Slot wurden seit 0.24.23 als DAME gemalt — ich hatte "treten beim Gegner in Form der Dame zum Vorschein" als Verhuellung gelesen, gemeint war der Damen-PLATZ. Jeder Champion zeigt wieder sein wahres Gesicht; genau darum tritt man ja gegen ihn an.
- STORY-WIDERSPRUECHE BEHOBEN (belegt, nicht geraten): Die Klingenschlucht kuendigte namentlich "den Zerreisser" an, schickte aber vier verschiedene Wesen ins Feld — ebenso das Geisterfeld mit dreien. Beide Texte sagen jetzt die Wahrheit. Drei Stationen nannten die FALSCHE Figur: Karawanenrast und Verborgener Schrein sprachen vom "Spaeher", obwohl der Kundschafter wartet (zwei verschiedene Figuren!), und der Schrein nannte eine "Zauberin" statt der Hexerin. Ankerbucht benennt ihren Spaeher jetzt beim Namen.
- BUBBLES AUF KARTE UND IM KAMPF-HUD: Gesamtleben und Gesamtstaerke fast doppelt so gross (30 px) und OHNE Pillen-Kontur — die Kugeln sind das Abzeichen, ein Rahmen drumherum kaempfte nur gegen ihren eigenen Rand.
- ZIFFERN OPTISCH AUSGEMITTELT (vermessen): Die Kugelgrafik sitzt mit 49.6 % / 48.2 % leicht hoch in ihrem Rahmen — jede Zahl stand darum systematisch ~1.8 % zu tief. Neue zentrale Korrektur zieht sie auf die echte Kugelmitte, auf dem Brett wie in allen Abzeichen. Zuwachs-Kugeln (+1) deutlich groesser (27 px) und mehrstellige Werte bekommen eine Stufe mehr Raum, damit "+1" sauber sitzt und lesbar bleibt.
- DIE STILLE TESTFALLE GESCHLOSSEN: Die Bildschirm-Smokes meldeten Fehler und beendeten sich trotzdem mit Erfolg — ein kaputter Screen konnte durch die ganze Batterie segeln. Sie zaehlen jetzt und brechen rot ab.
- ZWEI NEUE SUITEN, 47 PRUEFUNGEN: test_ui prueft das GERENDERTE Markup (Champion zeigt sein Portrait und ist damenformatig, beide Seiten tragen zwei Kugeln, Ziffern ein- wie zweistellig gleich gross, der Zauberstern erscheint nur bei einer noch einsetzbaren Faehigkeit und erlischt danach, nichts rendert leer). test_story prueft Erzaehlung und Gewichtung (keine Station nennt ein Monster, das die Rotation nicht liefert; keine nennt eine Figur, die sie nicht aufbietet; jede rekrutierbare Figur hat einen Weg in den Hofstaat; Tore fordern nur Erreichbares; Bauer bleibt der Schwaechste, kein Wert sprengt das Band; die Hauptstrasse zahlt nie rueckwaerts). Gesamtbatterie: 530 gruen.

## 0.25.1
- HOFREIHE ENDLICH MITTIG — GEMESSEN, GEFUNDEN, GENAGELT: Im echten Chromium vermessen (Bildmitte gegen Zellmitte, jede Figur): Bauern +0.3 px, ALLE Hofreihen-Figuren +3.9 bis +5.5 px rechts. Ursache: Der Figuren-Layer lebt im groesseren Hofreihen-Font (1.16em), wurde damit BREITER als die Zelle und klebte an ihrer linken Kante — Versatz exakt (Kasten−Zelle)/2 = 4.22 px. Der Layer spannt sich jetzt absolut auf die Zelle (inset 0), der Ueberstand zentriert sich symmetrisch. Nachmessung: alle Figuren im Bereich −0.3 bis +0.3 px (Springer +1.2 px Layout, den sein Gemaelde visuell aufhebt).
- BRETT VERTIKAL MITTIG: Das Spielfeld ruht jetzt mittig im Kampfbereich — oben wie unten gleich viel Luft.
- KUGELN FAST BERUEHREND: Der Abstand der beiden Juwelen unter jeder Figur ist auf ein Haar reduziert (4.5 % statt 14 % des Durchmessers).

## 0.25.0
- DIE GROSSE REGELWENDE, VOLLENDET UND VERSIEGELT: Energie ist restlos aus dem Spiel — jede Figur darf beliebig viele Faehigkeiten KOENNEN, aber pro Partie nur EINE ausfuehren. Der Kern trug die Regel bereits (jeder Spezialzug schreibt ins Buch der Figur, danach bleibt es zu); diese Version vollendet sie sichtbar und nagelt sie fest:
- ZWEI JUWELEN UNTER JEDER FIGUR: Blau ist der neue ANGRIFF, Rot bleibt LEBEN — gleiche Groesse, gleiche Praegeschrift wie zuvor, fuer beide Seiten. Der Drei-Kugel-Streifen ist Geschichte (Bundle traegt nur noch die zwei Kugeln als eingebettete Daten).
- DER ZAUBERSTERN: Mittig ueber den beiden Kugeln funkelt ein goldener Stern, solange die Figur noch eine EINSETZBARE Faehigkeit hat. Verfeinert: rein passive Gaben zaehlen nicht — kein Stern ohne echte Tat. Ist der eine Zauber gesprochen, erlischt er.
- REGEL-TEST VERANKERT (4 neue Pruefungen): Zwei einsetzbare Talente bieten zwei Spezialzuege; EIN Wirken schreibt ins Buch; danach ist JEDES weitere Talent versiegelt, waehrend normale Schachzuege bleiben. Gesamtbatterie jetzt 466 gruen.
- LETZTE ENERGIE-RESTE GETILGT: tote Energie-Importe und irrefuehrende Kommentare entfernt — der Begriff existiert im Spiel nicht mehr.

## 0.24.28
- DIE SCHATZKAMMER GLAENZT: Jede Erfolgs-Karte ist jetzt eine Goldplatte — warmer Goldverlauf statt flacher Panels, Goldsaum mit innerer Lichtkante, eine stille Glanz-Straehne ueber der Platte, Medaillons mit goldenem Ring und satterem Schein, ein gegossener Gold-Fortschrittsbalken mit Gluehen statt der duennen Linie, gepraegte Gold-Rauten fuer eingeloeste Stufen, Zaehler und "SO ERREICHST DU ES" in Goldschrift. Unbegonnene Erfolge liegen gedaempft im Halbdunkel — Schaetze, die noch gehoben werden wollen.

## 0.24.27
- ZUWACHS-ZAHLEN JETZT IN DEN KUGELN: "+1", "+2" usw. stehen bei Ausbau-Vorschau, Familien-Boni und Energie-Regeneration nicht mehr NEBEN der Kugel, sondern IN ihr — dieselbe Praegeschrift wie auf dem Brett, die Kugeln eine Nummer groesser (19-21 px) und der Ziffernanteil auf 62 %, damit das Plus atmet.

## 0.24.26
- SCHATZKAMMER-ABSTURZ BEHOBEN: Das Aufklappen eines Erfolgs stuerzte ab, weil evaluate() die Stufenliste (tiers) nie mit ans Item gab — das Akkordeon griff ins Leere. Jetzt reisen tiers UND die Beschreibungen mit (die waren aus demselben Grund nie sichtbar). Neuer Smoke-Fall "AchievementsScreen (open)" rendert genau diesen Pfad bei jedem Push.
- BRETT WIEDER MITTIG (MOBIL): Der Zierrahmen ragt 2.6 % ueber jede Brettkante — ohne das im Breiten-Budget einzurechnen, sprengten Brett+Rahmen den Viewport und die Seite bekam Seitwaerts-Scroll (Brett wirkte verschoben). Die Zellrechnung teilt die verfuegbare Breite jetzt durch 1.052 — Rahmen und alles bleibt drin, sauber zentriert.

## 0.24.25
- GOLDENER ZIERRAHMEN UM JEDES BRETT: Der neue Rahmen (frame1) liegt als Auflage um alle Schachbretter — vermessen auf die Leisten-Innenkante (2.5 %), sodass die Zierleiste exakt auf der Brettkante sitzt und die Filigran-Spitzen die Randfelder kuessen. Figuren, Kugeln und Auswahl stehen IM Rahmen (Schaukasten-Tiefe), ein weicher Schattenwurf hebt ihn vom Untergrund. Getrimmt und als 26-KB-WebP mit Alpha eingebunden.

## 0.24.24
- POPUP-WERTE UNTEREINANDER: Im Charakter-Blatt stehen Angriffsstärke, Lebenspunkte und Energie jetzt gestapelt wie ein Kontobuch — eine Kugel pro Zeile, der Name daneben.
- LETZTE SYMBOL-RESTE GETILGT (Restzählung: 0): Kampagnen-Boss-Vorschau (Stahl-Kugeln mit Zahl statt Herz/Schwert), Revanche-Knopf, Intro-Zeile, Tutorial-Kopfkarte 2 — alle sprechen jetzt Juwelen.
- DELTAS IMMER MIT ZAHL: Ausbau-Vorschau zeigt einheitlich Kugel gefolgt von +N (auch Lebenspunkte, vorher nacktes Herz), Familien-Boni ebenso (Kugel +N statt "+2 ♥").
- SYMBOLE AUCH AUS TEXTEN: Tutorial-Fliesstexte und Trank-Hinweis sagen "Lebenspunkte" und "Angriffsstärke" statt ♥/⚔ — eine Sprache ueberall.

## 0.24.23
- DAMEN-SLOT IN VOLLEM GLANZ: Meister im Damen-Slot leuchten jetzt EXAKT wie die Dame (eigene Seite 1.62, Gegner 1.42) — vorher hingen sie eine Lichtstufe darunter. Die Groessen waren bereits auf Damen-Format kalibriert.
- VERHUELLTE MEISTER: Fremde Sonderfiguren im Damen-Slot erscheinen dem Gegner als gewoehnliche Dame — erst der eigene Feldherr sieht, wer die Krone wirklich traegt (dasselbe Prinzip wie die Maskerade des Gambit). Bewusster Kompromiss: Das Inspektions-Blatt nennt weiterhin den echten Namen.
- DIE DAME FLANKIERT DEN KOENIG: Aufstellungen sind nur noch legal, wenn Dame (oder ihr Boss-Stellvertreter) direkt neben dem Koenig steht — das Kronenpaar trennt sich nie.
- SCHATZKAMMER MIT AKKORDEON: Jeder Erfolg klappt per Tipp auf und zeigt "SO ERREICHST DU ES" — jede Stufe mit Ziel und Belohnung (Sterne + Gold), abgehakt was erreicht ist. Der Einloesen-Knopf toggelt das Akkordeon nicht mehr versehentlich.
- LETZTE SCHWERT-SYMBOLE ERSETZT: Auch Online-Duell, Kampf-Buttons und Tutorial-Kopf sprechen jetzt die Juwelen-Sprache (JewelIc statt gekreuzter Schwerter/Herz-Icons).
- BRETT-GEMAELDE ASYNCHRON DEKODIERT: decoding="async" am Figuren-Bild — das Brett blockiert beim Aufbau nicht mehr auf Bilddekodierung.

## 0.24.22
- BUBBLES UNVERGIFTBAR — INS BUNDLE EINGEBETTET: Zweimal hat ein Deploy-Fenster eine Bild-URL mit der HTML-Ersatzseite beantwortet, und Browser-/Service-Worker-Caches hielten das Gift dauerhaft fest (Gegner zeigte nur Zahlen). Jetzt leben alle acht Kugel-Grafiken als Daten-URLs IM Bundle (generiertes Modul statAssets.js): Es gibt keine eigene Bild-URL mehr, die je wieder vergiftet werden koennte — mit jedem Build wandert alles unter neuem Namen aus.
- ZIFFERN UEBERALL EXAKT GLEICH GROSS, ein- wie zweistellig (58 % der Kugel, feste Groesse ohne Sonderstufe).
- POPUP-BEGRIFFE AUSGESCHRIEBEN: Angriffsstärke / Lebenspunkte / Energie statt STK / LEB / ENE (englisch Attack / Life / Energy), LVL -> Level.
- EINE BILDSPRACHE — KUGELN STATT SYMBOLE: Herz, Schwerter und Blitz weichen den kleinen Juwelen-Kugeln: Armeesummen im Kampf-HUD (gold fuer dich, stahl fuer den Gegner), Figuren-Inspektion, Faehigkeits-Energiekosten, Ausbau-Voransicht. Neues JewelIc fuer die nackte Kugel als Symbol.
- KARTE OHNE KAPITEL-SCHILD: Oben nur noch vor, zurueck und Weltkarte.
- POPUPS OHNE ANIMATION: Alle Dialoge erscheinen sofort (rise/fade entfernt).
- FAHRTEST VERSIONIERT: drive3.mjs lag nur im Arbeitscontainer und ging bei jedem frischen Klon verloren — jetzt fest im Repo (dist per HTTP, echter Chromium-Boot, Konsolen-Fehler = rot).

## 0.24.21
- FESTSITZENDE UPDATES LOESEN SICH JETZT SELBST: Live beobachtet — ein frisch installierter Service-Worker blieb dauerhaft im Zustand "waiting", und die Seite lieferte Reload um Reload den alten Stand ("ich lade neu und nichts aendert sich"). Der generierte Worker besitzt keinen Meldungs-Empfaenger, mit dem man ihn aktivieren koennte. Neu: Erkennt die App einen festsitzenden Worker, deregistriert sie ihn EINMALIG und laedt neu — der frische Worker uebernimmt sofort (skipWaiting + clientsClaim). Ein Sitzungs-Schutz verhindert Reload-Schleifen. Damit greifen kuenftige Deploys ohne Zutun des Spielers.

## 0.24.20
- LETZTE SCHICHT DER BUBBLE-VERGIFTUNG: Selbst OHNE Service-Worker blieb strip-steel kaputt — Chromes HTTP-Festplatten-Cache haelt Asset-Antworten als "immutable" fuer immer, und die Datei trug seit 0.24.17 denselben Namens-Hash; genau in dessen Deploy-Fenster wurde die HTML-Ersatzseite unter dieser URL eingelagert. (Die in 0.24.16 neu erzeugten Kugeln bekamen neue Hashes — deshalb funktionierten die sofort.) Loesung: beide Streifen neu kodiert -> neue Bytes -> neuer Hash -> neue URL, am vergifteten Cache vorbei. Der 0.24.18-Waechter verhindert kuenftige Vergiftungen im Service-Worker; gegen den Browser-HTTP-Cache schuetzt ab jetzt das Wissen: Nach einem Deploy-Unfall genuegt ein Re-Encode der betroffenen Datei.

## 0.24.19
- REFACTORING DER WERTUNGS-KUGELN — Kugeln gehoeren zum FELD, nicht zur Figur: Bisher hingen die Streifen am Zeichenkasten der Figur, und dessen Geometrie ist je Figur anders (Bauer 0.98em, Hoffiguren 1.16em, Drache 1.48em). Deshalb sassen sie beim Bauern richtig und rutschten bei Turm, Dame & Co. unter das Feld — und jede Groessenkorrektur verschob heimlich die Hoehe. Jetzt rendert die ZELLE die Kugeln, verankert an der Feld-Unterkante mit fester Zell-Schriftbasis: identische Groesse und identischer Sitz fuer jede Figur, buendig mit dem Feld wie beim Bauern (nur der Drache im 2x2-Feld zeichnet seine weiterhin selbst, exakt gleich gross).
- ZIFFERN NOCHMAL MINIMAL KLEINER (58 % statt 64 % der Kugel) und ZWEISTELLIGE WERTE (hochgelevelte Spielstaende: 12, 27, 46 ...) bekommen eine eigene kleinere Stufe (46 %), damit sie in der Kugel bleiben statt sie zu sprengen.

## 0.24.18
- DIE EIGENTLICHE URSACHE DER FEHLENDEN BUBBLES — GEFUNDEN UND BEHOBEN: In Chrome Schritt fuer Schritt nachgewiesen. Der Server lieferte fuer strip-steel keine Bilddatei, sondern die HTML-Startseite (6 KB, beginnend mit "<!doctype html>") — mit Status 200. Grund: Waehrend eines Deploys kann das frische JS-Bundle schon live sein, bevor die zugehoerige Bilddatei fertig hochgeladen ist; die Seite antwortet dann mit ihrer Ersatzseite. Der Service-Worker legte diese HTML-Antwort brav als Bild ab — und damit blieb die Kugel fuer diesen Besucher DAUERHAFT unsichtbar, obwohl die Datei laengst korrekt online war. Deshalb sahen alle bisherigen Pruefungen (Abruf erfolgreich!) das Problem nicht.
- SCHUTZ EINGEBAUT: Bilder wandern nicht mehr blind in den Vorrats-Cache. Sie werden erst beim Gebrauch gespeichert und NUR, wenn die Antwort wirklich ein Bild ist (Inhaltstyp-Pruefung). Eine untergeschobene HTML-Ersatzseite kann den Bild-Cache nicht mehr vergiften. Alte, bereits vergiftete Eintraege werden beim naechsten Start automatisch entsorgt.

## 0.24.17
- GEGNERISCHE (SILBERNE) BUBBLES ERSCHEINEN ENDLICH: In Chrome direkt nachgewiesen — die Datei strip-steel wurde zwar fehlerfrei geladen (Abruf ok), aber vom Browser NICHT dekodiert; CSS zeigt dann still nichts an, waehrend die Ziffern darueber sichtbar blieben. Genau derselbe Fehler wie zuvor bei den gelben und roten Hofstaat-Kugeln. Beide Streifen aus den gelieferten Vorlagen mit der reparierten Bildpipeline neu erzeugt und der Decode geprueft.
- ALLE BUBBLES GLEICH GROSS — SO KLEIN WIE BEIM BAUERN: Das Brett gibt Bauern 0.98em und allen anderen Figuren 1.16em Schriftmass (dem Drachen noch mehr); der Kugel-Streifen erbte das und wuchs bei jeder groesseren Figur um 18 %. Die Groesse rechnet dieses Mass jetzt heraus, sodass jede Figur — Bauer, Dame, Boss, Drache, Gambit — exakt dieselbe kleine Kugelgroesse traegt.
- ZIFFERN MINIMAL KLEINER UND HELLER: Fuellgrad 70 % -> 64 % der Kugel, ueberall gleich (Brett und Charakterkarten), Farbe von #F5E8C8 auf das hellere #FCF5E2, Praegeschimmer eine Spur kraeftiger.

## 0.24.16
- HOFSTAAT-KUGELN GELB & ROT: Live in Chrome nachgewiesen, dass die STK- und LEB-Kugelbilder dort mit einem Browser-Dekodierfehler scheiterten ("The source image cannot be decoded" — der HTTP-Abruf war ok, deshalb sahen alle frueheren Pruefungen sie als intakt). Alle sechs Einzel-Kugeln aus den frisch gelieferten Vorlagen neu geschnitten (Kreis exakt, WEBP q95/method6) und per libwebp-Decode verifiziert.

## 0.24.15
- CHARAKTERKARTEN-ZIFFERN WIE AUF DEM BRETT: Live in Chrome verglichen — auf dem Brett fuellt die Zahl 70 % der Kugel mit 0.018em-Haarkontur, auf den Karten nur 50 % mit dickerer 0.5px-Kontur; dadurch wirkten die Karten-Zahlen mickrig. Jetzt identische Regel ueberall: 70 % Fuellgrad, gleiche Haarkontur.
- LIVE-BEFUND (Chrome, grandgambit.win, v0.24.14): HP-Gefecht rendert 32 Streifen — 16 gold + 16 STAHL, alle Bilder laden; unterster Streifen der Grundreihe voll sichtbar; Hofstaat-Karte zeigt alle drei Kugeln in Spectral 700. Die frueher gemeldeten fehlenden Stahl-Kugeln/STK-LEB-Orbs waren der alte Service-Worker-Stand.

## 0.24.14
- BRETT NOCH ETWAS KLEINER — dafuer nichts mehr abgeschnitten: Die Hoehenrechnung reserviert jetzt fast eine Zellhoehe Kopfraum (eine ANGEWAEHLTE Figur waechst 1.58x und ragte sonst oben raus — im Test steht der Kopf der vergroesserten Dame jetzt 64 px unter der Rahmenkante) und zusaetzlich 0.3 Zellen Fussraum, damit die Wertungs-Kugeln der eigenen Grundreihe unten nicht mehr vom Rahmen verdeckt werden.
- KOORDINATEN NUR NOCH IM KLASSISCHEN SCHACH: Die Raender a–h / 1–8 erscheinen nur, wenn der Spielmodus klassisches Schach ist — in Kampagne, HP-Gefecht und allen anderen Modi sind sie weg.
- ZIFFERN-KONTUR VIEL DUENNER: Die dunkle Umrandung der Zahlen frass die Ziffer auf — von 0.05em auf 0.018em reduziert (Charakterkarten von 1 px auf 0.5 px). Die Zahl selbst bleibt in der Groesse von 0.24.12.
- ZENTRIERUNG, DRITTE ITERATION: Die Glyph-Kaesten stehen nachweislich exakt zellmittig (gemessen: max 1.7 px, Mittel 0.5 px auf 1280 px Breite) — der wahrgenommene Versatz kommt aus der Bildkomposition. Der Ausrichtungspunkt ist jetzt das MITTEL aus Masse- und Sockel-Schwerpunkt je Gemaelde (frisch vermessen fuer alle Figuren, Bosse und Gambit-Stufen), was z. B. den Springer doppelt so stark nach rechts rueckt wie die reine Sockel-Metrik.
- DESKTOP: Die Kopfleiste (SPIELEN / HOFSTAAT / ...) bleibt jetzt auch waehrend eines Kampfes sichtbar.
- CHARAKTER-POPUP: Hoehe ist jetzt zoom-fest (84dvh durch den Interface-Zoom geteilt) — es waechst am Rechner nicht mehr aus dem Bildschirm, der Inhalt scrollt.
- HINWEIS STAHL-KUGELN & STK/LEB & "Freie Figur": Im aktuellen Build nachgeprueft — die silbernen Streifen sind im Bundle verdrahtet, die Charakterkarte rendert alle drei Kugeln (Staerke/Leben/Energie) und "Freie Figur" steht als eigene Zeile unter dem Titel. Die Screenshots zeigen einen aelteren Live-Stand; nach diesem Deploy die App einmal neu laden (Service-Worker-Update).

## 0.24.13
- KARTE AUF MENUEBREITE — RICHTIG: In 0.24.10 hatte ich die Karte am Rechner faelschlich auf die Handy-Dockbreite (536) gedeckelt, wodurch sie viel zu schmal wurde. Gemeint war die Kopfleiste, die am Rechner bis 1020 laeuft. Das Kartenfenster ist jetzt exakt so breit wie die Menueleiste darueber: gemessen bei 420, 900, 1000, 1400 und 1920 px Fensterbreite jeweils 0 px Unterschied in Breite UND linker Kante. Das Gemaelde deckt den gerundeten Rahmen weiterhin randlos (Farbsonde: 0.000 % Untergrund sichtbar).

## 0.24.12
- ZIFFERN GROESSER UND LESBARER: Am gerenderten Brett nachgemessen waren die Zahlen auf dem Handy nur rund 8 px hoch. Die Ziffer fuellt die Kugel jetzt deutlich staerker (70 % statt 52 % des Durchmessers) — gemessen rund 9 px auf dem Handy und 14 px am Rechner, ohne dass die Zahl den Glasrand beruehrt.
- KEINE UEBERLAPPUNG: Der Kugel-Streifen ist exakt so breit wie ein Brettfeld (gemessen 47 px bei 47er Zelle, 64 px bei 64er Zelle). Ein erster Versuch mit groesseren Kugeln haette die Streifen benachbarter Figuren um mehrere Pixel ueberlappen lassen; deshalb bleibt der Durchmesser innerhalb der Feldbreite und nur die Ziffer waechst.

## 0.24.11
- BRETT: Die drei Wertungs-Kugeln liegen jetzt als EIN ungeteiltes Bild unter der Figur — die Kugeln behalten ihre Ueberlappung und den gemeinsamen Schatten. Die Ziffern sind an den im Gemaelde ausgemessenen Kugelmitten platziert (18.6 % / 50 % / 81.4 % der Streifenbreite, halbe Hoehe); im Pruefstand nachgemessen: hoechstens 1 px Abweichung. Fuehrt eine Figur keine Energie, zeigt sie einen schmaleren Ausschnitt desselben Streifens (erste zwei Kugeln).
- CHARAKTERKARTEN: Eigene, sauber freigestellte Einzel-Kugeln aus den dafuer gelieferten Bildern — gold fuer den Hofstaat, silbern fuer Monster und Schatten.
- SCHRIFT: Ziffern jetzt Spectral Bold 700 statt Cinzel — deutlich besser lesbar bei kleiner Groesse; weiterhin Pergamentweiss mit dunkelbrauner Haarkontur und leichtem Praegeschimmer. Cinzel entfernt.

## 0.24.10
- KARTE AUF DESKTOP: Das Kartenfenster war am Rechner so breit wie der ganze Bildschirm und ueberragte damit das Menue, zu dem es gehoert. Es sitzt jetzt auf JEDER Bildschirmgroesse exakt auf Menuebreite (wie der Dock-Balken, max 536).
- KEIN LEERRAUM MEHR IM RAHMEN: Am Rechner wurde das Gemaelde kleiner als sein gerundeter Rahmen gerechnet (Faktor 0.8), wodurch der schwarze Untergrund an den Kanten durchschien. Jetzt deckt das Bild den Rahmen auf allen Groessen randlos ab — es waechst immer mit der Kante, die mehr verlangt. Mit einer Farbsonde hinter der Karte geprueft: bei 390, 1440 und 1920 px Breite ist der Untergrund zu 0.000 % sichtbar.

## 0.24.9
- NEUE WERTUNGS-BUBBLES: Die drei Kennzahl-Kugeln unter jeder Figur (Staerke / Leben / Energie) sind jetzt gemalte Juwelen-Orbs — goldener Ring fuer den eigenen Hofstaat, stahlkalter Ring fuer den Gegner; Kern gelbgold, rubinrot und saphirblau. Einheitliche Groesse fuer alle Figuren (auch der Drache), da Wertungen einstellig bleiben (hoechste Wertung 9).
- ZIFFERN IM PRAEGE-STIL: Cinzel SemiBold in Pergamentweiss (#F5E8C8) mit hauchduenner dunkelbrauner Kontur und leichtem Praegeschimmer — lokal gebuendelt, kein Netz-Font.
- LESBARKEIT: Die angewaehlte Figur schwebt samt ihrer Bubbles jetzt ueber ALLEN anderen Reihen, damit die Wertigkeit nie verdeckt wird.
- HOFSTAAT: Die Charakterbogen-Orbs (STK/LEB) nutzen dieselben gemalten Kugeln.
- Nebenfix: playwright-core als Dev-Abhaengigkeit verankert (wurde von npm beim Font-Install entfernt und brach die Pruef-Batterie).

## 0.24.8
- ZENTRIERUNG RICHTIG GEMESSEN: Die x-Korrektur aus 0.24.7 nutzte den Masse-Schwerpunkt der Gemaelde — Staebe, Arme und Umhaenge zogen ihn zur Seite, obwohl der SOCKEL mittig sitzt; einige Figuren rutschten dadurch sogar nach links. Jetzt zaehlt die Sockelmitte (unterste 10% der Figur): neu vermessen fuer alle Figuren, Bosse, Figuren-Bosse und Gambit-Stufen — die Teller stehen damit exakt auf der Feldmitte.
- GAMBIT-FUSSLINIE: Der Held schwebte deutlich ueber den Bauern (alter y-Wert aus der Vor-Kalibrierung). Seine Fusslinie folgt jetzt derselben Formel wie Bauer und Dame und wandert mit den Stufen sauber von Bauern- zu Damen-Hoehe (eigene y-Treppe je Stufe).
- KOEPFE NICHT MEHR ABGESCHNITTEN: Das Brett reserviert in der Hoehenrechnung jetzt Kopffreiraum (~ein Drittel Zellhoehe) ueber der hintersten Reihe und richtet sich unten aus — die ueberstehenden Koepfe der 8. Reihe werden vom Zoom-Rahmen nicht mehr beschnitten (das Brett wird dafuer minimal kleiner).

## 0.24.7
- FIGUREN-FEINSCHLIFF: Bauern nochmals dunkler und matter (weniger Glanz); alle uebrigen Figuren (ausser Held) spuerbar heller — klar unter Dame und Koenig, aber deutlich ueber den Bauern. Gilt gespiegelt auch fuer die Gegner-Seite.
- RECHTS-VERSATZ BEHOBEN: Viele Gemaelde sitzen nicht exakt mittig im Bild (gemessen: Schwerpunkte von -4.1% bis +2.8% der Bildbreite, z.B. Waechter +2.8%, Barde +2.2%) — die Groessen-Skalierung schob diesen Versatz zusaetzlich nach aussen, weshalb die meisten Figuren etwas zu weit rechts standen. Jetzt traegt jedes Bild seinen gemessenen x-Versatz in den Fit-Karten (Figuren, Bosse, Figuren-Bosse, Gambit-Stufen), und der Renderer zieht den Schwerpunkt exakt auf die Feldmitte zurueck.

## 0.24.6
- GROESSEN-VOLLKALIBRIERUNG: Jedes Figuren- und Boss-Bild wurde vermessen (sichtbarer Anteil im Canvas) und auf einheitliche Ziel-Groessen gebracht: Bauer 0.867, Figuren 1.016, Koenigspaar/Bosse 1.082 (effektiv). Behebt drei Figuren-Ausreisser (Turm, Assassine, Warlock standen zu klein) und vor allem: ALLE Bosse stehen jetzt bildgenau in Damen-Groesse — Monster wie Figuren-Bosse (z.B. der Attentaeter an der Nebelfaehre, der bisher voellig unkalibriert in Normalgroesse stand). Fuss-Abstaende der Boss-Bilder werden pro Bild kompensiert, damit nichts schwebt. Gambits Stufen-Wachstum ist nun ebenfalls pro Stufen-Portrait vermessen (Bauer -> Dame ueber die Bilder t1-t6).

## 0.24.5
- MACHT-SYSTEM (Licht + Groesse): Je maechtiger eine Figur, desto heller und glaenzender. Dame nochmals heller; Bauern UND Gambit dunkler gestuft; rekrutierbare Meister (anstelle der Dame) erhalten Boss-Glanz samt Schein — auch gegnerische Bosse in der Kampagne wirken damit imposanter. Der Gambit traegt jetzt schon ab Stufe 1 einen leisen Schimmer (gold im eigenen Heer, stahlkalt beim Gegner), der ihn trotz Bauern-Dunkelheit klar heraushebt.
- GROESSEN: Gambit startet exakt in Bauern-Groesse und WAECHST mit seinen Stufen — Stufe VI steht in Damen-Groesse. Meister anstelle der Dame stehen immer in Damen-Groesse. Skalierung weiterhin vom Fusspunkt, Grundlinie bleibt exakt.
- BUGFIX (latent seit 0.22.80): OnlineScreen crashte, wenn kein Account uebergeben wurde (account.id in useEffect-Abhaengigkeit) — der Render-Smoke-Test deckte es auf; jetzt defensiv abgesichert. Ausserdem brach der Smoke-Bundler still ab (silent-Flag), wodurch vier Test-Suiten unbemerkt uebersprungen wurden — Ursache (doppelte Deklaration) behoben, alle 15 Suiten laufen wieder.

## 0.24.4
- FIGUREN: Der Koenig strahlt jetzt wie die Dame. Sein Gemaelde ist von Haus aus deutlich dunkler gemalt (gemessen: Median 32 gegen 58 bei der Dame), weshalb er mit gleichem Filter blass neben ihr stand. Seine Helligkeit ist nun so angehoben, dass beide gleichauf liegen, und er traegt den breitesten Schein von allen.

## 0.24.3
- BUGFIX HINTERGRUND: Die Halle mit dem Marmorbrett stand nicht mittig, sondern hing nach rechts aus dem Bild. Ursache: Die Zentrierung lief ueber transform: translateX(-50%), das vom CSS-zoom des App-Wurzelelements verschluckt wird (der Transform kam gar nicht an). Ersetzt durch einen negativen Rand von der halben Eigenbreite, der den Zoom uebersteht und auch dann traegt, wenn das Bild breiter als der Bildschirm ist. Am gebauten Stand gemessen: 0.0 px Abweichung bei 390, 820, 1440 und 1920 px Breite.

## 0.24.2
- FIGUREN: Rang wird sichtbar. Koenig und Koenigin tragen jetzt einen weichen Schein (warm-golden im eigenen Hofstaat, kuehl-silbrig beim Gegner) und die hellste Malerei; alle uebrigen Figuren sind eine Spur dunkler und weniger gesaettigt, damit die Krone das Auge fuehrt. Der Gambit-Held behaelt seine eigene Stufen-Aura unveraendert.

## 0.24.1
- FIGUREN: Groessen-Hierarchie auf dem Brett. Bauern etwas kleiner, alle anderen Figuren etwas groesser, Koenig und Koenigin am groessten. Umgesetzt ueber Skalierung der Figurenhoehen (vom Fusspunkt aus, daher bleibt die gemeinsame Grundlinie erhalten); der Gambit-Held und der Drache bleiben unveraendert.

## 0.24.0
- ONLINE-DUELL: Kartenwahl hinzugefuegt (Zufaellig oder eine bestimmte freigeschaltete Karte), sichtbar VOR dem Suchen inkl. Hinweis, dass deine dafuer gespeicherte Aufstellung verwendet wird. Waehrend der Suche erscheint ein Hinweis, wenn gerade niemand sonst online ist.
- BUGFIX (Worker): Die Armee eines Online-Duells wurde bisher fuer eine feste Karte (Arena bzw. erste freigeschaltete Karte) gebaut, unabhaengig davon, welche Karte das Matchmaking am Ende tatsaechlich waehlte. Jeder Spieler sendet nun pro Kandidaten-Karte eine eigene Aufstellung; der Server nutzt beim Start des Matches genau die zur gewaehlten Karte passende. Betrifft Zufallssuche, Freundes-Herausforderung und Annahme einer Herausforderung.

## 0.23.1
- BEGRIFFE: Die rekrutierbaren Kapitel-Endgegner heissen jetzt schlicht MEISTER (statt Kapitelmeister).
- ORTSNAME: Die Finalstation von Kapitel I heisst nun DIE ZITADELLE (statt der unklaren "Meisterfeste"/"Ligafeste"). Der generische Finale-Story-Text nennt keinen Ortsnamen mehr, sodass er in jedem Kapitel zum jeweiligen Ort passt.

## 0.23.0
- STORY/BEGRIFFE: Grosser Umbau der Weltsprache passend zur ueberarbeiteten Erzaehlung. Die zehn Welten heissen jetzt KAPITEL (statt Liga), die vier inneren Etappen ABSCHNITT (statt Kapitel). Der Endgegner der Reise ist OSRIC, DER GROSSMEISTER (statt Ligameister); die rekrutierbaren Welt-Endgegner heissen KAPITELMEISTER (statt Liga-Bosse).
- NAME: Die Erzfeindin heisst nun ASRA (statt Mirenn) — durchgezogen ueber Boss-Namen, Welt-Lore, Herold-Sprueche und den Ortsnamen "Asras Brunnen" (Kapitel VII).
- Betroffen: i18n (DE+EN), Boss-Namen, Ortsnamen, Herold-Texte, Welt-Lore, Item-Beschreibungen und die Landing-Page. Reine Umbenennung mit korrekter deutscher Grammatik; Spielmechanik unveraendert.

## 0.22.80
- ADMIN: Neue Nutzerliste im Online-Bereich (nur fuer Admins). Zeigt alle Nutzer, die online waren, mit Liga/Fortschritt, Spielzeit, Anzahl Spiele, Duell-Bilanz und ELO. Jeder Client spiegelt beim Verbinden dieselben Werte, die er auf dem eigenen Profil sieht, an die Hall; der Admin-Dump liefert sie gesammelt zurueck (ohne Secrets). Reine Offline-Spieler erscheinen nicht, da ihre Daten lokal auf dem Geraet bleiben.
- SICHERHEIT: Der Admin-Dump gibt keine Spieler-Secrets mehr preis (nur Name, Liga, Spielzeit, Spiele, Bilanz, Rating, zuletzt gesehen).

## 0.22.79
- ANIMATIONEN: Panels und Popups blenden jetzt sanft ein (Fade) statt herein- oder hochzugleiten. Die rise-Animation zieht nichts mehr hoch, und das Kampagnen-Panel gleitet nicht mehr seitlich mit der Kamera mit.
- HOFSTAAT: Die Figurenbilder werden vorgeladen und erscheinen gemeinsam mit den Kacheln (kurzer Ladespinner beim ersten Oeffnen), statt dass leere Kacheln sich erst danach fuellen.

## 0.22.78
- DRACHE vereinfacht und intuitiver: Er zieht ein Feld orthogonal (vorwaerts, seitlich oder zurueck) und darf dabei schlagen, was unter seiner Vorderkante steht. Zuvor konnte er zu Fuss gar nicht schlagen. Die Trampel-Aura (Nachbar-Gegner nahmen automatisch Schaden) wurde ersatzlos entfernt. Der einmalige Flug pro Partie bleibt unveraendert. Beschreibungstext im Hofstaat angepasst.

## 0.22.77
- FIGUREN-RENDERING: Systematischen Rechts-Versatz aller Hoffiguren behoben. Ursache war die Feld-Zentrierung per CSS-Grid, die eine Figur groesser als ihr Feld nicht symmetrisch zentriert (~4-5px nach rechts wandernd); auf Flexbox umgestellt -> jetzt exakt mittig (am echten Brett verifiziert: Schnitt -0.4px statt +4.6px). Bauern waren nie betroffen (kleiner als das Feld).
- Turm minimal verkleinert, jetzt auf Groesse der uebrigen Hoffiguren.
- Drache waechst beim Anwaehlen nicht mehr, sondern behaelt seine Groesse; angewaehlt werden nur die moeglichen Zug-Felder gezeigt.

## 0.22.76
- FIGUREN-RENDERING: Alle Figuren einheitlich etwas hoeher gesetzt (gemeinsame Grundlinie und Bauern gleichmaessig um denselben Betrag angehoben), sodass sie mittiger im Feld sitzen. Groessen und horizontale Zentrierung unveraendert.

## 0.22.75
- FIGUREN-RENDERING: Die Spielfiguren stehen jetzt einheitlich gross und auf einer gemeinsamen Grundlinie mit etwas Luft darunter. Die fruehere Sockelbreiten-Normierung hatte breite Figuren (Turm, Magier u.a.) zu stark verkleinert und die uebrigen unterschiedlich hoch sitzen lassen. Ersetzt durch eine Box-Anpassung: einheitliche Figurhoehe (sehr breite Figuren werden nur sanft in der Breite begrenzt) plus Grundlinien-Ausrichtung. Bauern, Grand Gambit und Drache behalten bewusst ihre eigene Groesse.

## 0.22.74
- KAMPAGNENKARTE: Tippen auf den Grand Gambit oeffnet jetzt das Level-Panel der aktuellen Station ("Herausforderung starten"), statt zum Faehigkeitenbaum zu springen. Dadurch laesst sich das Panel nach dem Schliessen jederzeit wieder oeffnen und das Level erneut starten. Die alte Rang-Box mit dem Faehigkeitenbaum-Sprung wurde entfernt (der Faehigkeitenbaum bleibt ueber den Hofstaat erreichbar).

## 0.22.73
- LANDING-SEITE deutlich ausgebaut: Spielmodi (klassisches Schach ODER das RPG; gegen die KI, zu zweit an einem Geraet, oder online), eine Figuren-Chronik mit vier Helden (Bild, Flavor-Text und Faehigkeiten), ein geformtes Liga-Brett mit gesperrten Feldern und ein stilisiertes Weltkarten-Diagramm der Kampagne (drei Pfade laufen zum Ligameister zusammen). Durchgehende Hallen-Atmosphaere, die auch unter dem letzten Container mit Abstand wieder sichtbar wird. Der Hinweis "im Browser" wurde aus der Kopfzeile entfernt. Vier verkleinerte Figurenbilder unter public/pieces.

## 0.22.72
- FIGUREN-SOCKEL VEREINHEITLICHT: Jede gemalte Figur fuellt ihr 1024er Quadrat anders aus, darum kamen die Fuesse (die Standflaeche auf dem Feld) bei gleicher Schriftgroesse unterschiedlich breit heraus - der Turm wirkte viel groesser. Aus den Bildern vermessene Pro-Figur-Faktoren (paintedScaleFor) skalieren nun jede Figur so, dass alle Sockel gleich breit stehen (Turm/Dame/Koenig/Waechter kleiner, schlanke Figuren groesser); der Bauer bleibt ueber seine kleinere Schriftgroesse kleiner, der Gambit wird bewusst etwas kleiner, der Drache (2x2) etwas groesser. Skalierung am Fuss verankert, damit die Figur auf dem Feld stehen bleibt.

## 0.22.71
- OEFFENTLICHE STARTSEITE (landing.html) fuer das Google-Login-Branding: Google verlangt, dass die im OAuth-Zustimmungsbildschirm angegebene Startseite OHNE Anmeldung erklaert, was die App ist - die App-Wurzel zeigt aber den Login-Screen. Neue oeffentliche Landing-Seite im Spiel-Stil (dunkle Halle, GG-Wappen, Feature-Uebersicht, "Jetzt spielen"-Button zur App, Hinweis zum optionalen Konto, Links zu Datenschutz + Nutzungsbedingungen). Im Google-Branding als Startseite eintragen: https://grandgambit.win/landing.html

## 0.22.70
- ZUG-ANIMATION SAUBER REFACTORED: die ziehende Figur wird jetzt als EIN Objekt animiert, das pixelgenau der Figur entspricht, die danach im Feld steht (gleicher Versatz, gleiche Groesse). Frueher glitt ein mittig sitzender, kleinerer Ghost und wurde beim Landen durch die echte, hoehere + groessere Figur ersetzt - das war das "zieht zu weit, springt dann zurecht". Die Figur sitzt nun auf ihrem ZIELFELD und gleitet per Transform vom Start auf translate(0,0) = exakt das Feld; per DOM-Messung als pixelgenau verifiziert (Delta 0)
- SPRINGEN/HUEPFEN: Pferd & Co. landen jetzt exakt statt daneben und werden nicht mehr nachtraeglich zurechtgerueckt; eigener Sprung minimal laenger fuer ein volleres Sprunggefuehl
- RAUSFLIEGENDE FIGUREN endlich sichtbar: der Todesflug wurde nie ausgeloest, weil er auf lethal (nur HP-Modus) statt auf capture pruefte - im normalen Schach ist lethal=false. Er fliegt jetzt bei jedem Schlag; die geschlagene Figur bleibt stehen, bis der Angreifer ankommt, und wird dann zur Ablage geschleudert
- ALLE FIGUREN ETWAS GROESSER
- GEGNER: 1 Sekunde Pause vor seinem Zug (statt 260ms) - kein hektischer Sofort-Zug mehr
- KAMPAGNENKARTE: der blaue Himmel hinter den Wolken ist jetzt komplett transparent (kein Blau mehr), Wolken-Animation ~30% langsamer

## 0.22.69
- FAVICON UEBERALL ERNEUERT: das neue runde GG-Wappen liegt jetzt konsistent als Browser-Tab-Icon (favicon.ico + PNG 16/32/192), Apple-Touch-Icon, PWA-Icon (192/512) und maskable-Icon (mit gefuellter Safe-Zone) vor; index.html und PWA-Manifest darauf umgestellt
- DATENSCHUTZERKLAERUNG EU-KONFORM UEBERARBEITET: konkrete Aufsichtsbehoerde (LfDI Baden-Wuerttemberg), Drittlanduebermittlung mit Rechtsgrundlage (EU-SCC/DPF), jsDelivr-CDN der Login-Bibliothek, Speicherdauern, Abschnitt Minderjaehrige (Art. 8 DSGVO), kein Profiling (Art. 22), Widerspruchsrecht (Art. 21); bewusst KEIN Verweis auf die zum 20.7.2025 abgeschaltete EU-ODR-Plattform (waere abmahngefaehrlich)
- NUTZUNGSBEDINGUNGEN NEU (terms.html): kostenloser Dienst, Pflichten/verbotene Nutzung (Cheaten, Bots, rechtswidrige Namen), Rechte am Spiel, dreistufige Haftungsklausel nach deutschem Recht (Vorsatz/grobe Fahrlaessigkeit und Leben/Koerper/Gesundheit unbeschraenkt, einfache Fahrlaessigkeit nur Kardinalpflicht), deutsches Recht, § 36 VSBG; im Footer und in der Datenschutzseite verlinkt
- Hinweis: keine anwaltliche Pruefung - solide DSGVO-orientierte Grundlage, fuer volle Rechtssicherheit fachliche Pruefung empfohlen

## 0.22.68
- FEHLERBERICHTE ZUM DIREKTEN KOPIEREN: unter Profil -> Fehlerberichte gibt es jetzt "Alle kopieren" (kopiert saemtliche geladenen Berichte als lesbaren Text, durch Trennlinien getrennt - zum direkten Einfuegen hier im Chat) sowie einen "Kopieren"-Knopf an jedem einzelnen aufgeklappten Bericht. Der kopierte Text enthaelt Zeit, Version, Art, Konto, URL, Geraet, Meldung, Notiz, Stacktrace und die letzten Ereignisse - alles, was fuer eine Fehlersuche gebraucht wird, in einem Block

## 0.22.67
- KEIN AUFBLINZELN MEHR AM ZUGENDE: die Uebergabe von der Zug-Animation zur echten Figur ist jetzt unsichtbar. Ursache war, dass die animierte Figur nach der Landung noch schraeg gekippt (und mit Schatten) stehen blieb und erst spaeter gegen die aufrechte echte Figur getauscht wurde - dieser Sprung war das Blinzeln. Jetzt richtet sich die Neigung schon VOR der Landung wieder auf, der Schatten blendet mit aus, und der Tausch passiert im Moment der Landung, wenn beide pixelgleich sind
- SPRUNG-ZUEGE (Springer und alle Figuren mit Sprung-Bewegung): deutlich hoeherer Bogen (ueber eine ganze Feldhoehe), langsamer in der Luft, und die Figur bleibt dabei komplett aufrecht - keine Schraegstellung beim Huepfen. Der Schatten unter der Figur vertieft sich am Scheitel
- Gleit-Zuege neigen sich weiterhin in Laufrichtung, aber nur MITTEN im Zug - zur Landung hin stehen sie wieder gerade
- CHARAKTERKARTE: das Portrait sitzt jetzt vertikal mittig in seiner Kachel und fuellt sie maximal aus (vorher klebte die Figur am unteren Rand)

## 0.22.66
- BUBBLES OHNE GLANZ: der weisse Glanzpunkt ist aus allen Stat-Bubbles entfernt (Staerke/Leben/Energie) - durchgaengig im Spiel wie auf den Charakterkarten. Die Farbe fuellt die Kugel jetzt satt, nur die Kante dunkelt fuer die Rundung nach
- CHARAKTERKARTE, TEXTREIHENFOLGE: der Flavor-Text (in der Serifenschrift, kursiv) steht jetzt direkt unter dem Namen - noch VOR den Stats, nicht mehr danach. Dazwischen bleibt die kleine Zeile mit Name der Zugehoerigkeit (Freie Figur, Kronenfigur bzw. das Haus). Reihenfolge also: Name, Zugehoerigkeit, Flavor, dann die Werte

## 0.22.65
- GESCHLAGENE FIGUR LANDET EXAKT IN DER ABLAGE: statt nur grob vom Brett zu fliegen, dreht sich die geschlagene Figur jetzt heraus und landet PRAEZISE auf dem Ablage-Feld, das sie danach anzeigt - beim Gegner oben rechts, bei mir unten rechts. Die echte Bildschirmposition der Ablage wird im Flugmoment gemessen, also stimmt das Ziel in Hoch- und Querformat und egal aus welcher Perspektive gespielt wird
- SPRINGER HUEPFT WIRKLICH: ein Sprung ist jetzt ein echter Bogen - die Figur springt hoch, wird am Scheitel eine Spur groesser (als kaeme sie dem Auge naeher) und landet wieder, statt nur ueber das Brett zu gleiten
- alle uebrigen Zuege gleiten weiterhin leicht schraeg gekippt wie ein schreitender Wanderer

## 0.22.64
- CHARAKTERKARTEN ALS STECKBRIEF: die Detailkarte einer Figur ist neu aufgebaut wie ein Wanted-Poster-Dossier. Portrait links in gerahmter Platte, Name und Haus-Zeile (mit Familien-Raute) oben, daneben die DREI SPIEL-BUBBLES (dieselben Kugeln wie im Kampf) fuer Staerke/Leben/Energie zur sofortigen Wiedererkennung, darunter Ledger-Zeilen (Stufe, Faehigkeiten) im Steckbrief-Rhythmus
- FAEHIGKEITEN ALS AKKORDEON: jede Faehigkeit ist eine aufklappbare Zeile. Schon EINGEKLAPPT sichtbar sind Icon, Name, Typ-Badge (Bewegung/Angriff/Fernkampf/passiv...) und die Kosten (Energie-Pips, oder "passiv" wenn kostenlos). Antippen klappt Beschreibung, Zug-Diagramm und Erlernen-Knopf auf. Weit entfernte Talente bleiben "noch verhuellt"
- Upgrade-Box verschlankt: keine doppelten Stats mehr, nur der Fortschritt Stufe->Stufe+1 mit den Zuwaechsen und der Verbessern-Knopf

## 0.22.63
- GEGNER-ZUG STARTET ENDLICH AM RICHTIGEN FELD: der Gegner-Ghost begann seine Bewegung faelschlich dort, wo MEINE Figur zuletzt hinzog. Ursache: bei zwei schnellen Zuegen in derselben Millisekunde bekam die Animation dieselbe Kennung, React verwendete das alte Element wieder und die Figur glitt von der alten Zielposition herein. Jetzt bekommt jeder Zug eine streng fortlaufende Kennung UND die Gleit-Animation ist im Startmoment abgeschaltet - die Figur wird am FROM-Feld gesetzt und gleitet erst dann sauber zum Ziel
- ALLE Figuren ziehen leicht schraeg gekippt (nicht nur der Gegner) - auch gerade Zuege bekommen eine leichte Neigung, wie ein schreitender Wanderer
- GESCHLAGENE FIGUR: ausdrucksstaerkerer Flug zur Ablage (klarer Bogen, mehr Drehung, sauberes Verblassen) - nach oben zur Gegner-Ablage wenn ich schlage, nach unten zu meiner wenn der Gegner schlaegt
- NICHTS ist per Rechtsklick/Markieren/Ziehen speicherbar (verstaerkt: selectstart blockiert, jedes Bild draggable=false, auch spaet geladene) - Ausnahme bleiben Eingabefelder (Name, Passwort), wo Kopieren/Einfuegen funktioniert

## 0.22.62
- HIMMEL UEBER DER KARTE: hinter den Wolken liegt jetzt ein Himmel in der Stimmung der Welt - blauer Himmel mit Sonne in den gruenen Welten, kuehler im Herbst/Winter, duestere Lila- und Glut-Toene in den tiefen Welten. Durch die Luecken der ziehenden Wolken schimmert dieser Himmel durch
- WOLKEN STAERKER ANIMIERT: die Wolken ziehen jetzt weiter und sichtbarer ueber den Himmel (mehrere Ebenen in unterschiedlichem Tempo), luftiger, sodass mehr Himmel durchscheint
- META/SEO: Titel und Beschreibung geschaerft (Das Schach-RPG - Schach auf einem neuen Level), Ladehinweis entschlackt (kein Browser-Hinweis mehr)

## 0.22.61
- GEGNER-ZUG-ANIMATION: CLIP-FEHLER BEHOBEN + LANGSAMER
  - Der Gegner-Zug klippte manchmal (die Figur erschien kurz an der falschen Stelle - etwa auf meiner Figur - und sprang dann). Ursache war ein Timing-Fenster, in dem die echte Figur schon am Zielfeld stand, bevor die Gleit-Animation begann. Die Animation wird jetzt VOR dem Bildaufbau scharf gestellt (useLayoutEffect) und der Startpunkt garantiert zuerst gezeichnet - die Figur gleitet jetzt sauber von ihrem Feld los
  - Gegnerzuege sind jetzt DEUTLICH langsamer animiert (0,9s statt 0,66s), eigene Zuege minimal ruhiger (0,52s) - der Gegnerzug ist klar nachvollziehbar

## 0.22.60
- KARTE UNTEN WIEDER GESCHLOSSEN: die Karte fuellt das Fenster jetzt wieder voll und ist unten buendig - die runde untere Kante ist sauber geschlossen (vorher fehlte dort ein Stueck, weil die Karte nach unten verschoben war)
- SCHACHBRETT-HINTERGRUND WEG: der Kartenhintergrund ist jetzt reines Schwarz - kein durchschimmerndes Muster mehr am Rand
- WOLKEN AM KARTENKOPF UEBERARBEITET: drei Ebenen ziehen jetzt sichtbar und in unterschiedlichem Tempo (rollen + atmen wie echtes Wetter). Oben ist es nicht mehr flaechig weiss - dunklere Stellen der Karte schimmern zwischen den Wolken durch, wie am Himmel. Der untere Rand des Nebels laeuft ueber eine lange weiche Maske aus, keine harte Kante mehr

## 0.22.59
- ELO-EINSCHAETZUNG BEIM KAMPAGNEN-SCHWIERIGKEITSGRAD: unter Sanft/Normal/Hart steht jetzt eine grobe Einordnung der Gegnerstaerke - Sanft etwa Anfaenger (grob 600-900 Elo), Normal etwa Gelegenheitsspieler (grob 1000-1300), Hart etwa Vereinsspieler (grob 1400-1700). Die Angabe ist bewusst grob, da die Kampagne kein reines Schach ist (Faehigkeiten, Level, Lebenspunkte spielen mit)

## 0.22.58
- WOLKENKOPF KORRIGIERT: der Wolkenbereich reichte zu weit in die Karte und hatte unten eine harte Kante. Er ist jetzt deutlich niedriger und der GANZE Kopf wird nach unten weich ausgeblendet (per Maske) - die Wolken loesen sich sanft in die Karte auf, keine harte Kante mehr. Die Karte rueckt entsprechend weniger tief nach unten

## 0.22.57
- ZIEHENDE WOLKEN UEBER DEM KARTENKOPF: der weiche obere Bereich der Karte bekommt jetzt langsam ziehende Wolken/Rauch (zwei Ebenen in unterschiedlichem Tempo, sanft atmend) - in den Farben der jeweiligen Welt. Die Helligkeit folgt der Reise: Grasland hell, SOMMER fast weiss, danach Herbst/Winter/Hochgebirge duenner und die tiefen Welten (Oedland, Canyon) dunkel und schwer. Der alte statische Nebel oben wurde durch die Wolken ersetzt

## 0.22.56
- WEICHER KARTENKOPF IN EIGENER FARBE: die gemalte Karte sitzt jetzt etwas tiefer im Fenster, und der obere Bereich wird von einem sanften Verlauf gefuellt, der aus der Karte SELBST stammt (ihre obere Kante, vergroessert und weich verwischt) - der Uebergang traegt also genau die Farben der jeweiligen Welt. Die oben schwebenden Knoepfe (Atlas, Liga-Navigation) liegen jetzt in diesem weichen Kopf statt hart auf der Karte; der obere Kartenrand blendet zusaetzlich weich ein, sodass keine harte Kante bleibt

## 0.22.55
- KARTE IM FENSTER FEINER: die Rahmen-Kontur ist duenner (3 statt 5 Pixel), und die Karte selbst wird eine Stufe kleiner im Fenster gezeichnet - dadurch wirkt sie auf hochaufloesenden Handys SCHAERFER (die Unschaerfe kam vom Hochskalieren der gemalten Welt). Wegpunkte und Wanderer skalieren mit. Der schmale Rand, der so entsteht, wird von einem weichen Verlauf (Vignette) nach aussen ins Dunkle gefuehrt

## 0.22.54
- ZUG-ANIMATION GRUNDLEGEND UEBERARBEITET:
  - RUCKELN BEHOBEN: eine doppelte CSS-Transition an der Figur liess sie nach dem Zug nochmal zucken - jetzt eine saubere kombinierte Transition, die ankommende Figur blendet sanft ein statt hart aufzupoppen
  - FIGUREN NEIGEN SICH BEIM ZIEHEN: wie der Wanderer auf der Karte lehnt sich die gleitende Figur leicht in die Laufrichtung (nach rechts beim Zug nach rechts, nach links andersrum)
  - SPRINGER UND UEBERSPRINGENDE ZUEGE HUEPFEN: das Pferd (und jeder nicht-gerade/nicht-diagonale Sprung) macht jetzt einen echten Huepfer im Bogen statt zu gleiten
  - GESCHLAGENE FIGUREN FLIEGEN ZUR RICHTIGEN ABLAGE: rotierend raus - nach OBEN zur Gegner-Ablage, wenn ich schlage, nach UNTEN zu meiner Ablage, wenn der Gegner mich schlaegt (dorthin, wo man die Figur danach als Symbol sieht)
  - ANIMATION INSGESAMT ETWAS LANGSAMer und ruhiger, beim Gegner wie bei mir

## 0.22.53
- GEGNERZUEGE DEUTLICH LANGSAMER ANIMIERT: wenn der Gegner (KI oder online) am Zug ist, gleitet seine Figur jetzt spuerbar langsamer ueber das Brett (rund doppelt so lang wie ein eigener Zug) - so siehst du bewusst, welchen Zug er macht, statt dass er blitzschnell passiert. Eigene Zuege bleiben flott. Im Zwei-Spieler-Modus an einem Geraet bleibt alles gleich schnell (beide Seiten bist du)

## 0.22.52
- SIEG-POPUP LIEGT JETZT UEBER ALLEM: das Ergebnis-Banner (Geschafft/Verloren mit Belohnungen) wurde bisher IM zoombaren Brett-Container gezeichnet und lag dadurch hinter Figuren und Overlays. Es wird jetzt ganz oben im Bildschirm als festes Overlay (position fixed, hoechste Ebene) gerendert - immer klar ueber allen Figuren
- SCHWIERIGKEIT DER KAMPAGNE EINSTELLBAR: unter Profil gibt es jetzt den Regler Schwierigkeit der Kampagne (Sanft / Normal / Hart), jederzeit aenderbar. Sanft macht jede Station eine Stufe leichter, Hart eine Stufe schwerer - das verschiebt Gegner-Level UND KI-Suchtiefe pro Station relativ zu ihrer vorgesehenen Staerke

## 0.22.51
- FEHLERBERICHTE LAUFEN JETZT UEBER DIE ONLINE-HALLE: statt E-Mail oder nur lokal werden Berichte im bestehenden Multiplayer-Worker gesammelt (POST /report offen fuer alle, GET /reports nur mit Admin-Token). Im Admin-Profil traegst du einmal das Token ein und siehst dann die Berichte ALLER Nutzer geraeteuebergreifend - ohne neue Infrastruktur, kein Supabase noetig. Einrichtung: worker deployen + ADMIN_TOKEN setzen (Anleitung in REPORTS-SETUP.md)
- Absturzberichte werden weiterhin automatisch vermerkt und an die Halle gesendet (auch nach einem Absturz dank keepalive)

## 0.22.50
- SAFARI OEFFNET WIEDER: aeltere iOS-Safari-Versionen (vor 15.4) kennen structuredClone nicht - eine einzige fehlende Funktion lie? die ganze App dort nicht starten (weisser Bildschirm). Ein kleiner Ersatz fuellt die Luecke, sodass die App auf jedem Geraet bootet. Zusaetzlich sind die neuen Bild- und Fehler-Bausteine rundum abgesichert, damit kein Browser-Eigenheit den Start blockiert
- FEHLERBERICHTE IM ADMIN-BEREICH STATT PER MAIL: Absturz- und Fehlerberichte gehen nicht mehr an eine E-Mail, sondern werden in der App gesammelt - im Admin-Profil gibt es jetzt den Bereich Fehlerberichte, der sie auflistet (aufklappbar mit Zeit, Geraet, Meldung, Stacktrace und den letzten Fehlern). Mit eingerichteter Cloud (Supabase-Tabelle error_reports, Anleitung in SUPABASE-REPORTS.md) siehst du die Berichte ALLER Nutzer zentral; ohne Cloud die dieses Geraets
- Der Absturz-Bildschirm vermerkt einen Fehler jetzt automatisch (kein Knopfdruck noetig) und bietet weiterhin Neu laden

## 0.22.49
- APP-INSTALLATION AUF DEM IPHONE ERKLAERT SICH SELBST: Safari kennt keinen Installations-Knopf - der einzige Weg ist Teilen -> Zum Home-Bildschirm. Auf iPhone/iPad zeigt der Profil-Bereich Als App jetzt direkt die Schritt-fuer-Schritt-Anleitung statt eines Knopfs, der dort nichts tun kann; zudem zeigt das Home-Icon jetzt auf das echte 180er Apple-Touch-Icon
- JEDES BILD KOMMT MIT EINEM KLEINEN AUFTRITT: Bilder, die noch laden muessen, blenden sanft ein (kurzes Aufsteigen); bereits geladene erscheinen sofort - kein Flackern mitten im Gefecht, kaputte Bilder bleiben nie unsichtbar
- SCHWARZE BOX + FEHLERBERICHT AN DEN SUPPORT: Laufzeitfehler landen in einem kleinen Ringpuffer; stuerzt die App ab, bietet der Absturz-Bildschirm neben Neu laden jetzt Bericht an Support senden (oeffnet die Mail-App mit Version, Browser, Zeit, Absturz und den letzten Fehlern vorausgefuellt) und Bericht kopieren

## 0.22.48
- ABMELDEN JETZT UNUMSTOESSLICH: der Abmelde-Knopf (Profil und Spielstand-Auswahl) faehrt jetzt einen harten, deterministischen Pfad - Login erscheint sofort, lokale Sitzung wird geloescht, die Cloud-Abmeldung bekommt ein kurzes Zeitfenster (damit kein Wiederherstellen nach dem Neuladen das Konto zurueckholt), dann startet die App sauber neu am Anmeldebildschirm. Kein React-Zustand, Cache oder Listener kann das mehr rueckgaengig machen - auf jedem Browser

## 0.22.47
- ABMELDEN IN SAFARI REPARIERT: der Abmelden-Knopf im Profil lag unter dem schwebenden Menue-Dock - in Safari (Home-Balken-Reserve) hat das Dock den Tipp geschluckt. Der Scrollbereich reserviert jetzt Dock-Hoehe plus Safe-Area, sodass die letzten Knoepfe immer frei liegen. Zusaetzlich meldet der Knopf jetzt SOFORT ab (lokal), waehrend Cloud-Abmeldung und Aufraeumen im Hintergrund folgen - ein haengender Netzwerk-Aufruf kann den Knopf nicht mehr tot wirken lassen

## 0.22.46
- KARTE ALS GERAHMTES GEMAELDE: das Kartenfenster ist auf dem Handy jetzt exakt so breit wie das Menue darunter (gleiches Raster, 536er-Cap) mit spuerbar mehr Luft zum Menue; die Welt darin zeigt sich eine Stufe kleiner (Fit aufs Fenster statt auf den Bildschirm) - Wegpunkte und Wanderer skalieren automatisch mit; um das Fenster laeuft ein Rahmen im Randton der jeweiligen Liga mit leichtem Verlauf ins Dunkle
- BUBBLES MITTIG UNTER DER FIGUR: die drei Stat-Kugeln stehen jetzt als eine zentrierte Reihe unter der Figur - Staerke, Leben, Energie (statt L-Form unten links); die Farbe fuellt die Kugel deutlich satter, der weisse Glanz ist nur noch ein kleiner Lichtpunkt (~1 Prozent der Flaeche)

## 0.22.45
- KLASSIK BEHERRSCHT DAS REICH: die Karten-Verteilung der Kampagne ist umgebaut - das 8x8-Feld traegt jetzt 75 Prozent aller Stationen (Klassik allein 19 von 51 und damit groesste Einzelgruppe, dazu Schneise 12 und Hof 7); die weite Arena und das enge Scharmuetzel ueberleben nur auf ihren Signatur-Stationen (Ligameister, Finale, wenige markante Orte)
- RUECKBLICK IST JETZT SPIELBAR: in bereits gemeisterten Ligen (Pfeile auf der Karte) laesst sich jede Station antippen und als FREUNDSCHAFTSKAMPF der alten Liga erneut spielen - Gegner, Karte und Boss skalieren auf die damalige Liga, kein Fortschritt/keine Rekrutierung/kein Zeitdruck, nur die Ehre (und etwas Freundschafts-XP). Kuenftige Ligen bleiben verschlossen
- JEDE LIGA ERZAEHLT EIGENE KAPITEL: die vier Kapitel-Banner oben tragen jetzt pro Welt eigene Titel (Sommer, Herbst, Winter, Hochgebirge, Oedland, Steppe, Canyon, Wueste, Meer) statt immer derselben vier Namen
- 5 neue Regressionstests (8x8-Mehrheit, Klassik groesste Gruppe, Rueckblick friendly/alte Skalierung/keine Rekrutierung)

## 0.22.44
- DRACHE KANN ENDLICH VORWAERTS: der Schritt nach vorne landet auf einem Feld, das sein eigener 2x2-Block gerade ueberdeckt (ein Fluegel-Feld) - bisher wurde ein Tipp darauf als "Drache erneut antippen" gedeutet und der Zug verworfen. Jetzt gewinnt ein gueltiges Zugziel vor der Fluegel-Umleitung, und das grosse Drachenbild laesst bei Auswahl Tipps auf die Zielfelder darunter durch. Er wandert jetzt sichtbar Feld fuer Feld
- 3 neue Regressionstests (Vorwaerts-Feld ist Fluegel, Zug ist legal, Drache rueckt eine Reihe vor)

## 0.22.43
- DOPPELTE KRAEFTE-ANZEIGE ENTFERNT: die bunte DU/GEGNER-Leiste mit Leben und Energie direkt ueber dem Brett ist raus - die Kraefte stehen weiterhin in den Kopf- und Fussleisten (Herz + Staerke je Seite), also keine Dopplung mehr
- KAMPAGNEN-SMOKE-TEST: neuer Regressionstest spielt JEDEN der 51 Kampagnen-Knoten ueber 5 Startwerte voll durch (ueber 25000 Zuege) inklusive Belohnungs-Auswertung und prueft, dass jedes Drachen-Level seinen 2x2-Block korrekt entfaltet - faengt Zug- und Aufbau-Abstuerze auf Engine-Ebene ab und laeuft ab jetzt bei jedem npm test mit

## 0.22.42
- STAT-BUBBLES GROESSER UND TIEFER: die drei Kugeln (Leben, Staerke, Energie) sind rund 30 Prozent groesser und sitzen weiter unten an der Figur (die L-Form ragt jetzt leicht unter das Feld) - die Zahlen sind dadurch deutlich besser lesbar; der Leben-Orb misst rund 42 Prozent der Feldbreite statt vorher ~30

## 0.22.41
- GRAND GAMBIT VERDIENT MUTIG: der Kommandant bekommt jetzt Bonus-Erfahrung, wenn ER selbst eine Figur schlaegt (+8) und wenn er das ganze Gefecht auf dem Brett uebersteht (+14) - das belohnt einen kuehnen, stets anwesenden Anfuehrer; Schlag-Herkunft und Opfer laufen dafuer durch die Event-Kette (byHero/hitHero)
- ONBOARDING IN DREI STUFEN: neue einmalige Erklaerungs-Popups entlang des Fortschritts - (1) wie man aufstellt, sobald die erste Zusatzfigur freigespielt ist; (2) die Gambit-Bonus-XP-Mechanik nach dem 2. gewonnenen Kampf; (3) dass der Gambit ab dem 3. Kampf seine Spalte selbst waehlen darf. Erscheinen nur zwischen Kaempfen, nie ueber einem laufenden Spiel, je genau einmal
- Das Sieg-Banner (Errungenschaften, neue Faehigkeiten, Erfahrung, Skillpunkte, Story) bleibt wie gehabt am Spielende
- 2 neue Regressionstests (Gambit-Ueberlebensbonus, heroSurvived im Summary)

## 0.22.40
- FIGUREN ZIEHEN UND FALLEN ANIMIERT: Zuege werden jetzt fuer BEIDE Armeen animiert - die Figur gleitet sichtbar von ihrem Feld zum Ziel (mit Kometenschweif), nicht nur der Gegner wie bisher
- TODESFLUG: schlaegt man eine Figur und sie stirbt, wirbelt sie mit vielen Rotationen aus dem Spielfeld - im Flug wird sie immer kleiner und segelt zur Beute-Seite des Siegers (Endposition ausserhalb des Bretts)
- UEBERLEBTER TREFFER: ueberlebt die getroffene Figur, wackelt sie kurz und bleibt stehen, waehrend die angreifende Figur genau den Weg zurueckgleitet, den sie gekommen ist (Prellzug)

## 0.22.39
- AUFSTELLUNG WIRD JETZT IM KAMPF UEBERNOMMEN: in fruehen Ligen biegt das Spiel jeden Kampf auf das 8x8-Klassik-Feld um, auch wenn der Knoten eine andere Karte vorsieht - dadurch wurde die gespeicherte Aufstellung unter der falschen Karte gesucht und still verworfen. Jetzt greift, wenn fuer das genaue Kampffeld keine eigene Aufstellung vorliegt, eine gespeicherte Aufstellung von einem gleich grossen Feld (gleiche Slot-Zahl), sofern sie hier legal ist; die exakte Karte hat weiter Vorrang. End-to-End geprueft: Turm-gegen-Springer-Tausch erscheint auf dem Brett (1 Turm, 3 Springer statt 2/2)
- 2 neue Regressionstests (Aufstellung uebertraegt sich aufs umgebogene Feld; exakte Karte gewinnt)

## 0.22.38
- BUBBLES MIT GLANZ: die Stat-Kugeln haben oben jetzt einen weissen Glanzpunkt statt der durchsichtigen Stelle - die Zahl liest sich besser; die schwarze Kontur ist deutlich duenner (nur noch ein zarter unterer Rand statt Vollring)
- VEKTOR-ZWILLING WEG: beim Antippen einer Figur erschien oben links im Feld ihre simple Vektor-Kopie - diese Anzeige ist entfernt
- DRACHE MITTIG & GROSS: im Aufstellungs-Editor wird der Drache jetzt als ein grosses, mittig ueber seinem 2x2-Block schwebendes Bild gezeichnet (nicht mehr klein in einem Einzelfeld); auf dem Spielfeld fuellt er seinen Block zentriert (big-Flag ans Sprite durchgereicht)
- ZUGDIAGRAMM PRO FAEHIGKEIT: Faehigkeiten, die die Bewegung veraendern (Weitsprung, Vorreiter, Phase, Blinzeln, Koenigsflucht u.a.), zeigen ihr eigenes Mini-Diagramm mit den neuen Feldern in Gruen - eingebettet sowohl in die Chronik als auch in die Hofstaat-Figurenkarten unter der jeweiligen Faehigkeit

## 0.22.37
- AUFSTELLUNG ZEIGT BEIDE REIHEN: ueber der Hinterreihe erscheint jetzt die Bauernreihe mit echten Figurenbildern - gewoehnliche Bauern und der Grand Gambit (sein aktuelles Siegel-Portrait) auf seiner Spalte, mit Stern markiert; ein Tipp auf ein Bauernfeld setzt seine Spalte. Der alte separate Positionsbalken entfaellt
- DRACHE VERDRAENGT SICHTBAR: setzt man den Drachen in eine Ecke, verschwinden in der Anzeige die zwei Bauern vor ihm UND die Nachbarfigur in der Hinterreihe (Flug-Symbol, ausgegraut) - man sieht direkt, dass er 2x2 Felder samt der zwei Bauern beansprucht
- KAMPFSTAERKE FOLGT DEM REGELWERK, NICHT DEM BRETT: auf dem klassischen 8x8-Feld gibt es HP-Kaempfe (31 Kampagnen-Knoten) - dort bringen deine Figuren jetzt ihre Level, Faehigkeiten und Duplikate mit, genau wie auf jeder anderen Karte. Reines Schach (Schnellspiel-Klassik, Schach-Knoten) bleibt Level 1 ohne Faehigkeiten. Betrifft Spieler UND Gegner und den Grand Gambit; Seher-Vorschau ebenso an die Regel gekoppelt

## 0.22.36
- KLASSIK WIEDER AUFSTELLBAR: die Klassik-Karte ist zurueck in der Kartenwahl des Aufstellungs-Editors und voll bearbeitbar - es geht um das SPIELFELD (8x8), nicht um die Schach-Regeln. Im Schnellspiel bleibt Klassik unveraendert die traditionelle Aufstellung (eigener Baupfad); nur Kampagnen-Bretter ehren die gespeicherte Formation (Sperre map.classic in buildArmyForMap entfernt)
- FIGURENWAHL SPRINGT AUF: tippt man einen Slot an, scrollt die Auswahl-Liste automatisch ins Bild (vorher musste man selbst suchen)
- DRACHEN-FLUEGEL GESPERRT: der leere 2x2-Nachbarplatz laesst sich nicht mehr eigenstaendig belegen - er zeigt sich als Teil des Drachen (lila Schimmer, Flug-Symbol) und ein Tipp darauf springt zum Drachen-Slot; der Drache traegt jetzt ein sichtbares 2x2-Abzeichen
- BAUERNREIHE + GAMBIT IM EDITOR: die Position des Grand Gambit (seine Spalte in der Bauernreihe) ist jetzt auf JEDER Karte waehlbar, auch Klassik - der Rest der Bauernreihe steht fest; Hinweistext klargestellt

## 0.22.35
- KARTEN-BUTTON VEREINHEITLICHT: der goldene Textknopf "Weiter - Liga X" (erschien nur nach dem Ligameister-Sieg) ist ersetzt durch einen runden Symbol-Knopf im selben Stil wie der Zurueck-Knopf, nur seitenverkehrt (Pfeil nach vorn)
- STAT-BUBBLES NACH UNTEN LINKS: Leben (gruen) sitzt jetzt fest in der unteren linken Ecke jeder Figur, Staerke (gelb) direkt darueber, Energie (blau) rechts neben dem Leben - L-Form mit kleinem tangentialem Abstand zwischen den Kugeln; Gegner und eigene Figuren gleich
- KRAEFTIGERE BUBBLES: leuchtender Kern, satter Mittelton und fast schwarzer Rand (dreistufiger Verlauf plus dunkler Aussenring) fuer klaren Kontrast auf jedem Untergrund
- DOSSIER OHNE MINI-BILD: beim Antippen der eigenen Figur zeigt das Info-Feld weiterhin Name, Werte und Faehigkeiten, aber nicht mehr das kleine Figurenbild - die Kugeln wachsen ja bereits beim Fokus

## 0.22.34
- CHRONIK HINTER AUSRUESTUNG: Reiter-Reihenfolge jetzt Hofstaat, Aufstellung, Ausruestung, Chronik
- BESTIARIUM: alle 25 Monster des Risses in der Chronik ergaenzt (eigene Sektion unter den Figuren), mit Familie, Zug-Diagramm und Andeutung
- NUR ERLEBTES WIRD ENTHUELLT: Chronik-Eintraege sind verschlossen (Silhouette, "???", "noch nicht begegnet"), bis man die Figur besitzt ODER ihr im Kampf begegnet ist - Standardfiguren kennt man von Beginn an, exotische Figuren und Monster erst nach der Begegnung (nutzt denselben Codex wie der Hofstaat-Baum)
- GRUNDZUEGE VISUALISIERT: jede enthuellte Figur zeigt ihr Zugmuster auf einem kleinen 7x7-Diagramm - blaue Felder fuers Gleiten (mit Reichweite), gelbe fuer Spruenge, die Figur in der Mitte; fuer Standardfiguren aus den Engine-Vektoren abgeleitet, fuer Sonderfiguren und Monster aus ihrem moveSpec (verifiziert: Springer zeigt reines Sprung-L, 0 Gleitfelder)

## 0.22.33
- TUERME SIND KEINE PFLICHT MEHR: alle Karten verlangen nur noch Koenig, Dame und Laeufer - Tuerme wandern in den Flex-Pool und koennen wie jede Hofstaat-Figur getauscht werden (ein spaeter ueberschreibendes flank:false am Turm behoben). Rochade existiert im Spiel ohnehin nicht; falls sie je kommt, gilt sie den FELDERN, nicht den Figuren
- STAT-TRIADE AUF JEDER FIGUR: Leben (gruen), Staerke (gelb) und Energie (blau) als drei gleichgestaltete Kugeln im Dreieck oben links an jeder Figur, Zahlen in der Kugel; die Kugel WAECHST mit ihrem Wert (zweistellige Zahlen bekommen ein breiteres Zuhause) und waechst nochmals um 40 Prozent, wenn die Figur angetippt ist; Gegner und eigene Figuren exakt gleich dargestellt; ersetzt die alten Punktspalten links/rechts. Gemessen: 96 Kugeln bei 32 Figuren, Groessen 8.8-14.8px je nach Wert und Fokus

## 0.22.32
- CHRONIK-REITER IM HOFSTAAT: neuer Tab "Chronik" zwischen Hofstaat und Aufstellung - jede Figur des Reichs mit Portrait, Grundzugsbeschreibung (was sie von Natur aus kann, unveraenderlich) und vollstaendigem Faehigkeitsbaum (welche Faehigkeit ab welcher Stufe); Gambit erhielt dabei eine explizite Erlaueterung dass nur seine Siegel-Stufen wachsen, nie seine Schrittart; der einleitende Satz wiederholt die Regel: Grundzuege sind angeboren, Faehigkeiten kommen mit den Stufen hinzu
- BESTAETIGT: kein Charakter ausser Gambit veraendert seine Grundzuege beim Leveln (maschinell geprueft, 0 Faelle); Faehigkeiten sind ausschliesslich Spezial-Effekte und einmalige Zugmodifikatoren, keine neuen Zugrichtungen

## 0.22.32
- NEUER REITER "CHRONIK" IM HOFSTAAT: das Regelbuch des Hofes - jede der 27 Figuren aufklappbar mit ihren GRUNDZUEGEN (handgeschrieben fuer die klassischen Gattungen inkl. Drache-2x2 und Grand Gambit; automatisch und stets korrekt aus dem moveSpec fuer alle Spezialisten: Gleiten/Reichweite/Spruenge) und ihrer kompletten FAEHIGKEITEN-LEITER (Symbol, Name, ab Stufe, Beschreibung). Noch nicht rekrutierte Figuren erscheinen ausgegraut, ihr Wissen ist frei einsehbar
- DAS GESETZ STEHT DARUEBER: Grundzuege sind angeboren und aendern sich nie - allein der Grand Gambit waechst ueber seine Siegel-Stufen; Faehigkeiten kommen mit den Stufen hinzu und aendern die Schrittart nicht (im Code stimmt das per Bauart: moveSpec ist statisch je Figur)

## 0.22.31
- DER DRACHE BREITET SICH AUS: der Drachenhort-Boss verlor beim Spec-Bau sein big-Flag und stand deshalb auf einem Feld - jetzt entfaltet er sich wie vorgesehen ueber 2x2 (Anker plus drei Fluegel-Marker)
- AUFSTELLUNG WIEDER AENDERBAR: zwei Blocker behoben. Erstens startete der Editor auf der Klassik-Karte, wo alle Felder bewusst gesperrt sind (reines Schach) - Klassik ist jetzt aus der Kartenwahl des Editors raus, Arena zuerst. Zweitens kannte die map-bewusste Legalitaetspruefung die Drachen-Regeln nicht: der leere Fluegel-Slot machte jede Drachen-Formation illegal (Speichern gesperrt, Kampf fiel still auf Standard zurueck) - Ecken-Regel, Fluegel-Slot und Flex-Abzug jetzt uebernommen
- BESTAETIGT: Dame kann durch verbuendete Liga-Bosse ersetzt werden, alle anderen Plaetze durch Hofstaat-Figuren (Pflicht-Kontingente der Karte bleiben) - im Browser durchgespielt: Slot antippen, Boss waehlen, speichern
- 3 neue Regressionstests (Drachen-Formation legal, Spieler-Drache entfaltet 2x2, Hort-Boss traegt big) - 432 gesamt

## 0.22.30
- ALLE ZEHN WELTEN UNTERM BRETT: die Ground-Tabelle ist komplett - Sommer (Trockengras), Herbst (Laubgrund), Winter (Schnee mit gefrorenem Bach), Hochgebirge (Fels mit Schneeresten), Oedland (rissige Erde mit Glutadern), Steppe (Grasland mit Pfaden), Roter Canyon (geborstener Fels), Wueste (Duenen mit Spuren) und Endloses Meer (Wellengang) liegen jetzt wie die Fruehlingswiese unter den Kampagnen-Brettern ihrer Liga, mit denselben organischen Hell/Dunkel-Schleiern; im Browser verifiziert (Liga IX rendert ground-09)

## 0.22.29
- ZOOM STATT KAMERAFAHRT: die 6-Sekunden-Eroeffnungsfahrt ueber die Feindreihe ist ersetzt durch einen kurzen, sauberen Zoom (1,9s) - das Brett steigt klein und leicht verschwommen aus der Kartenhoehe auf und rastet scharf in voller Groesse ein, wie ein Hineinzoomen in die Station; gilt fuer Kampagne und Duelle, Schnellspiel bleibt ohne Anlauf

## 0.22.28
- ORGANISCHE FELD-UEBERGAENGE AUF GROUND-BRETTERN: die Hell/Dunkel-Schleier sind jetzt radiale Verlaeufe (kraeftig in der Feldmitte, zu den Raendern auslaufend), sodass Nachbarfelder ueber der Wiese ineinander verschmelzen statt an einer Kante zu stossen; die harten Relief-Linien weichen einem weichen, verwaschenen Hauch. Gemessen: Uebergangsbreite an der Naht ~17px statt 1-2px, Zentren-Kontrast 75 (Schachbrett klar lesbar)

## 0.22.27
- GROUND-BRETT ENTSAETTIGT: die Feld-Schleier sind jetzt neutral (reines Weiss 20 Prozent / reines Schwarz 30 Prozent statt warmer Creme/Braun-Toene) und die Holz-Abnutzungstextur liegt auf Ground-Brettern nicht mehr drueber - die Wiese zeigt ihre echten Farben durch die Transparenzen, Hell/Dunkel bleibt klar erkennbar. Gemessen: Warmstich weg (Rot-Gruen-Abstand 12 auf 2), Gruen-Anteil deutlich hoeher, Hell/Dunkel-Abstand 62

## 0.22.26
- WEISSE EINSCHLUESSE IN 25 FIGUREN ENTFERNT: beim urspruenglichen Freistellen ueberlebten eingeschlossene Hintergrund-Reste (weisse Taschen zwischen Arm und Koerper, unter Fluegeln, neben Sockeln). Alle 70 Figuren-Gemaelde maschinell gesichtet, Taschen mit der Original-Freistell-Logik plus Kern-Kriterium (grosse flache Reinweiss-Kerne) entfernt, Raender wie beim Import weich abgefedert. Nachgearbeitet: Amazone, Erzbischof, Attentaeter, Barde, Laeufer, Schildtraeger, Spaeher, Springer, Magier, Paladin, Dame, Seherin, Hexerin, Flaggentraeger sowie die Monster Waechter, Skorpion, Koloss, Sturmkraehe, Blutmagd, Eisenfaust, Schattenfuerst, Hueter, Wandlerin und Mirenn. Kontrolle: groesster verbliebener Weiss-Kern 179px (ein echtes Mal-Highlight), Malerei ausserhalb der Taschen unangetastet (nur Re-Encode-Rauschen), Erzbischof und Inquisitor bewusst in einem einzigen Encode-Durchgang

## 0.22.25
- WIESE ALS STAR, KACHELN ALS RELIEF: das Liga-I-Brett umgedreht - vorher lagen Themenfarbe und Stein-Slab fast deckend UEBER dem Grund, jetzt ist der gemalte Boden voll sichtbar und die Felder sind nur noch neutrale Hell/Dunkel-Schleier (34/44 Prozent) mit den bestehenden Relief-Kanten, wie erhabene Kacheln im Gelaende; Stein-Textur auf Ground-Brettern entfernt, Koordinaten in satter Tinte. Gemessen an leeren Reihen: Hell/Dunkel-Abstand 83, Wiese in beiden Feldtypen deutlich sichtbar (Gruen-Ueberhang +10/+26)

## 0.22.24
- DER GAMBIT STICHT IN SEE: auf der Meeres-Liga sitzt der Wanderer jetzt im gemalten Ruderboot (sobald das Boot in der Truhe liegt) - der Rumpf legt sich als vordere Ebene vor die Figur, die Gischt ersetzt den Wegschatten, die Figur hebt sich leicht ueber die Bordwand; alle sechs Stufen-Portraits funktionieren unveraendert, das alte Mini-SVG-Boot ist ersetzt
- WIESE UNTERM BRETT (LIGA I): der gemalte Fruehlingsgrund (Bach, Pfad, Bluehwiese) liegt jetzt unter jedem Kampagnen-Brett der ersten Liga - die Felder oeffnen sich (60/66 Prozent Deckung), damit das Land durchschimmert; Schnellspiel und Duelle behalten ihre blanken Tische. Weitere Welten folgen, sobald ihre Gemaelde eintreffen (GROUNDS-Tabelle 1-10 vorbereitet)
- Assets importiert und optimiert: Boot freigestellt und beschnitten (640x344, 92 KB WebP mit Alpha), Grund als 1024er WebP (246 KB)

## 0.22.23
- SOFORT AUFS BRETT: die Eroeffnungs-Kamerafahrt entfaellt im Schnellen Spiel komplett (auch Klassik Schach und Hotseat) - sie gehoert zur Reise und bleibt Kampagne und Online-Duellen vorbehalten
- SIMPLE FIGUREN UEBERALL: der Vektor-Figurenstil aus den Einstellungen gilt jetzt auch in Klassik Schach im Schnellen Spiel (vorher ueberschrieb der Klassik-Modus die Wahl mit seinen Gemaelden)
- AUSRUESTUNG ALS SIEGESBEUTE: nichts liegt mehr von Beginn an im Vorratslager. Der erste Kampagnen-Sieg enthuellt den Lebenstrank (+1 gratis), der zweite den Zeitenwender (+1 gratis), der dritte oeffnet den Sternensplitter-Tresor, danach enthuellt die Reise Stueck fuer Stueck den Rest - jede Freischaltung erscheint als eigene Siegel-Zeile im Siegesbanner; Schluessel-Gegenstaende werden angekuendigt und bleiben kaeuflich (die Tore behalten ihren Preis)
- Test angepasst und erweitert (429 gesamt): Lebenstrank zu Beginn verhuellt, nach dem ersten Sieg enthuellt

## 0.22.22
- MEER-ORTSNAMEN OHNE PLAKETTE: auf Liga X wird die helle Grund-Ellipse hinter den Namen jetzt WEGGELASSEN (an Land verschmilzt sie mit hellem Boden, auf dem Wasser sah sie wie ein aufgesetztes Oval aus). Die Namen tragen sich dort ueber die Schrift selbst - heller Text mit dunklem Umriss, gut lesbar auf dem Wasser. Alle anderen Ligen unveraendert (Halo wie gehabt). Verifiziert: Meer-Labels rendern jetzt in hellem #fbf6e8 statt dunkler Schrift auf Halo

## 0.22.21
- KARTENNAMEN FOLGEN DER ANGEZEIGTEN LIGA: der Ortsname (und sein Text-Schein) richtete sich nach der Fortschritts-Liga statt nach der gerade angezeigten - beim Zurueckblattern auf fruehere Welten passten Name und Farbe nicht zusammen. Jetzt konsequent an viewLeague gekoppelt (die Werkbank setzt die Fortschritts-Liga, daher wirkte es dort besonders)
- MEER-BESCHRIFTUNG WIE AN LAND: der Namens-Schein auf Liga X war graublau getoent und stach auf dem Wasser als Farbfleck hervor - jetzt heller neutraler Dunst wie bei den anderen Ligen, die Plakette verschwindet (0 graublaue Halo-Pixel im Meeresband gemessen)
- KOPFLEISTE AUFGERAEUMT: nur noch Gold und Hofwert; Level-Anzeige und Skillpunkte entfernt (Skillpunkte fliessen ohnehin in den Hofwert). Ungenutzte Importe/Variablen mitentfernt

## 0.22.20
- ORTSNAMEN IM SITZ-REGISTER: alle Ligen II-X erneut ueberarbeitet in Richtung grosser Fantasy-Chroniken - Namen, die wie Stammsitze und Wegmarken klingen (Sichelmark, Zwillingsfeste, Frostthron, Koenigsjoch, Dornendiadem, Gischtthron, Ebbe und Niemand), nichts direkt uebernommen (Blacklist-Pruefung gegen bekannte Westeros-Namen im Build-Skript), kein Name doppelt, keine Slot-Stempel (Suffix-Budget geprueft: max 7 von 510)
- NAMENSWUERFEL FUER ONLINE-DUELLE: zwei Muster statt einem - "Vorname Beiname" (Maera Salzherz, Torvin Rissgaenger) und das Siegel (EhernerFalke IX); 36 Vornamen x 32 Beinamen plus 20x20x9 Siegel = rund 4750 Kombinationen, dieselbe Kennung faellt in einer Sitzung nie zweimal (Session-Merker mit Ausweich-Suffix), Laengenkappe 24 Zeichen

## 0.22.19
- NAMEN, RICHTIG KREATIV: die Ligen II-X komplett neu benannt - eigenstaendige, bildhafte Orte je Welt (Sommer: Maeusekirche, Wende des Lichts; Winter: Barfussspur, Letzte Flocke; Steppe: Hufdonner, Lied der Weite; Wueste: Fata Morgana, Namenlose Weite; Meer: Flaschenpost, Ebbe und Niemand, Planke ueber Schwarz). Bewusste Ketten bleiben als Erzaehlmotiv: je Liga eine Halle, eine Messe, eine Kanzel - und Osrics Koenigs-Mal auf jedem Land. Kein Name doppelt ueber alle zehn Ligen (Test erzwingt es)
- FAEHIGKEITSKARTE FEINSCHLIFF: Talent-Symbole exakt mittig in den Bubbles (Grid statt Zeilenhoehe), Werte-Pillen fuer Leben/Staerke/Energie gleich gross (58px) mit sauberem Abstand nach oben und unten, Stufen-Chip mit Luft zum Schliessen-Knopf, Stufenpunkte ruecken ab
- MEHR KONTRAST IM TALENTE-MENUE: Beschreibungen, Titel, Chips und die "ab Stufe"-Hinweise deutlich heller
- GLANZ NUR IN DER KONTUR: kaufbare Talente tragen den Lichtlauf jetzt ausschliesslich in der Umrandung (Ring-Maske, neues Keyframe ggEdgeSweep) statt ueber der Flaeche; dabei eine Keyframe-Namenskollision behoben, die den Brett-Sweep still ueberschrieben hatte

## 0.22.18
- CHANGELOG bereinigt: drei 0.22.17-Bloecke aus mehreren Arbeitsgaengen zu einem zusammengefasst (keine Code-Aenderung)

## 0.22.17
- ECHTE ORTSNAMEN STATT PRAEFIX-SCHEMA: alle Stationen der Ligen II-X tragen handgeschriebene, storygebundene Namen - keine mechanischen Serien mehr (vorher Saatwacht/Frostwacht/Sandwacht und zuletzt noch Gras 12x, Sand 17x, Salz 9x in VII/IX/X), kein Name doppelt ueber alle zehn Ligen inkl. Liga I (per Test gesichert); Liga I behaelt ihre Heimatnamen
- FIGUREN ERST NACH DEM KAMPF: jeder Posten bleibt leer, bis man an dieser Station in dieser Liga gespielt hat (Sieg oder Niederlage, campaign.faced) - gemalte Karte, Boss-Blatt und Totenkopf decken erst dann auf; auch die Story-Zeile des Ortsblatts und die Abtruennig-Zeile bleiben bis dahin verschleiert (Schleiertext: "Niemand berichtet, was hier wartet ...")
- Namens- und Aufdeckungs-Tests erweitert (428 gesamt gruen)

## 0.22.16
- SIEGEL-FAMILIE AUF DER CHARAKTERKARTE: alle Zeichen-Bubbles tragen jetzt den Look des Verbessern-Knopfs (tiefes Nachtblau, Goldrand, Goldschrift) - die Herz/Schwert-Pillen im Kopf, der Sterne-Chip, die Wertezeile neben dem Verbessern-Knopf und die runden Talent-Symbole; die Zeichen selbst behalten ihre Bedeutungsfarbe, gekaufte Talente ihren Familien-Schein
- PORTRAITS GROESSER: geoeffnete Karte 118x152 -> 144x186, eingeklappte Kartenreihe 74x96 -> 86x112, Vektor-Fallback entsprechend

## 0.22.15
- DIE CHRONIK DES RISSES: die zehn Welt-Geschichten sind jetzt EIN durchgehender Bogen mit drei Gestalten - Corvin (der Gambit, dem der Hof den Namen nahm), Mirenn (die Geopferte, die aus dem Riss zurueckkam und jeden genommenen Namen zurueckgeben will) und Vesna (die Seherin, die das verbotene Verzeichnis fuehrte und Mirenn einst selbst benannte). Osric, der Kapitaen, Doppelritter, Schattenfuerst, Lanzenmeister und Blutmagd bleiben Nebenwirkungen derselben Wunde, keine Nebenhelden
- NAMEN MIT BEDEUTUNG: b23 heisst Mirenn, b25 heisst Osric, die Hellseherin heisst Vesna - und dass Opfer nur Titel tragen, ist jetzt selbst Teil der Geschichte (der Riss nimmt zuerst den Namen). Gambit-Tag, Riss-Begegnung, Bestechungs-Hinweis und Chronik-Intro sind in den Bogen eingewoben
- KARTEN-BESCHRIFTUNG ZURUECKGENOMMEN: die Ellipsen unter den Ortsnamen sind auf ein Fluestern reduziert (Deckkraft .58 -> .22, langer Auslauf ins Transparente, staerkerer Blur); Lesbarkeit haengt jetzt an einem Schein entlang der Buchstaben statt an einer Flaeche - besonders auf dem Meer verschwinden die Felder unter der Schrift

## 0.22.14
- NACHZUEGLER: die Vollausbau-Engine selbst (withProgressPct baut jetzt Codex-Sichtungen, Liga-Kronen, Monster-Buendnisse und volle Truhe mit auf) lag nur im Arbeitsstand und fehlte im 0.22.13-Commit - ohne sie zeigte die neue Werkbank weiter Luecken und die neuen Tests schluegen auf frischem Klon fehl
- ABSICHERUNG: kompletter Testlauf zusaetzlich auf einem frischen Klon des Repos ausgefuehrt, damit keine ungetrackten Arbeitsstand-Reste mehr fehlen koennen

## 0.22.13
- WERKBANK OHNE REIHENFOLGE-FALLE: die Liga-Knoepfe WAEHLEN jetzt nur noch aus, SETZEN wendet Liga und Fortschritt zusammen an. Vorher wirkte der Regler auf die noch aktive Liga - wer erst Setzen und dann Liga 10 drueckte, bekam 17 Monster in Nacht, leaguesWon=1 und leere Liga-Boss-Plaetze
- VOLLAUSBAU WIRKLICH VOLL SICHTBAR: Liga-Bosse, die fuer dich kaempfen, stehen im Figurenbaum jetzt golden mit "Im Hofstaat" statt grau (gilt auch im normalen Spielverlauf nach Liga-Siegen); nur die Erzfeindin bleibt bewusst unverbuendet, ihr Antlitz ist im Codex sichtbar
- 5 neue Tests sichern den Vollausbau ab: alle Figuren rekrutiert, alle Monster im Codex, alle Monster ausser der Erzfeindin im Feld, Truhe voll, zehn Kronen

## 0.22.13
- WERKBANK-REGLER BAUT JETZT DIE ECHTE REISE: fruehere Ligen zaehlen als gemeistert (Ligameister-Trophaeen inklusive), Rekruten und Codex-Sichtungen wachsen den Weg entlang mit - vorher setzte der Regler nur die aktuelle Liga und liess alles andere dunkel
- 100% = VOLLAUSBAU: alle Figuren rekrutiert, jedes Monster im Codex, bestechbare Monster verbuendet, Tyrannen-Ligameister ueber Siege feldbar, Truhe komplett gefuellt - Liga X bei 100% garantiert den kompletten Katalog (nur die Erzfeindin bleibt wie im Spiel unerreichbar)
- 5 neue Tests fuer die Vollausbau-Semantik (jetzt 416)

## 0.22.12
- FEATURES AUS 0.22.9/0.22.10 ZURUECK: Glanz-Sweep auf kaufbaren Faehigkeitskarten, Medaillon-Symbole exakt mittig, Sicht-Leck im Figurenbaum gestopft (nur diesseits des Nebels gilt als gesichtet), Eroeffnungsfahrt nur noch ueber die Feindreihe (Variante C gestrichen), Vektor-Zwilling entfernt, CharCard-Portraits groesser
- URSACHEN-ANALYSE: kein Code-Defekt in 0.22.9/0.22.10 reproduzierbar - echter Chromium-Boot des Multi-Chunk-Builds, eingeloggter Bootpfad mit Fortschritt und der Service-Worker-Deploy-Uebergang liefen alle fehlerfrei; der Haenger war sehr wahrscheinlich ein Deploy-/Cache-Zustand nach zwei Deploys in sieben Minuten
- TESTPFLICHT: vor jedem Push npm test UND npm run build UND npm run build:single UND node test_boot.mjs

## 0.22.11
- NOTFALL-REVERT auf Stand 0.22.8 - grandgambit.win blieb mit v0.22.9/10 beim Boot im Fallback haengen ("Wird geladen ...")
- src/ und index.html exakt auf Commit 9cf98a2 (v0.22.8) zurueckgesetzt; die Features aus 0.22.9/0.22.10 folgen repariert als 0.22.12
- NEUE EISERNE REGEL: vor jedem Push npm test UND npm run build UND npm run build:single UND node test_boot.mjs (3/3)

## 0.21.95
- ABSTURZ BEHOBEN: Tipp auf Gambit in der Karte crashte die App - der onOpenTree-Prop fehlte in der CampaignScreen-Signatur (ReferenceError beim Rendern des Rang-Blatts)
- GAMBIT-BLATT SAUBER IM FRAME: das Blatt sass faelschlich IN der schwebenden Kopf-Leiste (doppelter Versatz) - jetzt liegt es auf Karten-Ebene, mittig, immer INNERHALB der Karte
- FESTER KARTENRAHMEN MIT GLEICHMAESSIGEM ABSTAND: 12px Luft oben, 12px ueber dem Menue unten (mobil 78px inkl. Dock) - der Rahmen steht fest, die Karte SKALIERT und pannt innerhalb dieses Fensters (vorher schrumpfte der Rahmen mit dem Inhalt)

## 0.21.94
- DER HOFSTAAT (vormals Chronik) IST JETZT REITER 1 im Hofstaat-Bereich und der Standard-Einstieg; danach Aufstellung, Figuren, Ausruestung
- KACHELN AUFGERAEUMT: die zweite Zeile unter dem Figurennamen ist weg, die Figuren dafuer deutlich groesser (68px statt 52px); Status wie "Gesichtet"/"Verbuendet" und die Herkunft stehen als kleines Eck-Kuerzel oben rechts
- VOLLE FIGUREN-FUNKTIONEN IM HOFSTAAT: ein Tipp auf eine Figur oeffnet ihre komplette Karte als Overlay (Level, Fahigkeitsleiter, Aufwerten, Zoom) - fuer rekrutierte UND begegnete Figuren; der Bestechen-Knopf bleibt direkt auf der Kachel
- BEITRITTS-LOGIK: rekrutierte Kronen- und Schattenfiguren RUTSCHEN HOCH in die Hofstaat-Sektion (mit Herkunfts-Vermerk "Krone"/"Schatten"), verbuendete Monster ebenso ("Verbuendet") - die Ursprungs-Sektionen zeigen nur noch die Unerreichten

## 0.21.93
- BRETT-EBENEN STRIKT: auch die gewaehlte/vergroesserte Figur bleibt in ihrer Reihen-Ebene - eine grosse Figur in Reihe b verdeckt NIE eine Figur in Reihe a (naeher = hoeher, ausnahmslos)
- KLICK-DURCHLASS: Figuren fangen keine Klicks mehr - das Feld direkt hinter einer vergroesserten Figur bleibt anklickbar (Klicks treffen immer die Zelle unterm Finger)
- FEIND-RAUCH ENTFERNT (samt Animation)
- MARMOR-WELLE ("Glow") ENTFERNT - der gelegentlich verbuggte Schimmer-Effekt ist raus
- KACHEL-3D ALS SAUBERE FASE: statt des weichen Verlaufs klare Kanten - oben/links hell, unten/rechts dunkel (2px Inset)
- FIGURENGROESSEN: Bauern (inkl. Gambit) auf 90%, alle anderen Figuren auf 107% - der Hof ueberragt das Fussvolk
- KARTE MOBIL: der Kartenrahmen laesst dem Menue unten jetzt 78px Luft (nur auf schmalen Screens)
- SCHATZKAMMER: jede der 14 Errungenschaften traegt jetzt eine ERKLAERUNG, was gezaehlt wird (de/en)

## 0.21.92
- MONSTER-BESTECHUNG (Chronik): begegnete Monster lassen sich mit VIEL GOLD (1800) UND DEM OPFER EINER KRONENFIGUR auf deine Seite ziehen - der Knopf oeffnet die Opferwahl unter den rekrutierten Kronenfiguren; TYRANNEN und die beiden benannten Finals (Erzfeindin, Ligameister) sind unbestechlich. Bestochene Monster stehen als "Verbuendet" in Gold im Baum und sind sofort in der Aufstellung waehlbar (boss-Slot); Formationen, die das Opfer enthielten, werden aufgeloest, seine Siege verfallen
- GAMBIT TRAEGT SEINEN RANG UEBERALL: das Stufen-Antlitz (Tier 1-6) erscheint jetzt zentral ueber die Galerie - auf dem BRETT, im HOFSTAAT, in der CHRONIK und auf der Karte (Formel exakt wie meta gambitTier: neue Gestalt alle 10 Level)
- 3 neue Tests sichern den Monster-Besitz ab (403 gesamt)

## 0.21.91
- GAMBIT-BLATT REPARIERT: das Rang-Blatt haengt nicht mehr am Wanderer (ragte ueber den Kartenrand), sondern sitzt fest oben mittig im Kartenfenster mit sauberem Innenabstand - NEU: Knopf "Zum Faehigkeitenbaum" springt direkt in den Hofstaat zu den Figuren
- DER FIGURENBAUM (Chronik, erste Version): neuer Hofstaat-Reiter mit ALLEN Figuren des Reichs, unterteilt in Hofstaat / Krone / Schatten / Monster-Familien (Golems, Bestien, Schlangen, Schemen, Tyrannen). SICHTBARKEIT NACH ERLEBTEM: Rekrutierte in Gold, Begegnete zeigen Gesicht + Siege-Zaehler, Monster der AKTUELLEN Liga lauern als dunkle Silhouette mit Namen ("Gesichtet"), der Rest ist ??? 
- BESTECHUNG: begegnete Champions mit mind. 1 Sieg lassen sich mit GOLD bestechen (ca. 90% ihres Hofwerts) - Gold statt weiterer Siege, der Freundschaftskampf wird uebersprungen
- FAEHIGKEITS-GESCHICHTEN IM SIEGESBANNER: jede in dieser Schlacht erklommene Leiterstufe wird erzaehlt - "{Figur} lernt {Faehigkeit}" mit Beschreibung, "+1 Schild"-Meldungen, und GAMBIT-STUFEN-WECHSEL ("sein Antlitz wandelt sich") werden angekuendigt

## 0.21.90
- AKADEMIE-KNOPF im Hub zweizeilig: Zeile 1 "Die Akademie" (etwas kleiner, 13.5, mit den Doppel-Rauten), darunter "Regeln in zwei Minuten - jederzeit ueberspringbar" - gleiche Panel-Huelle wie die anderen Karten

## 0.21.89
- STATIONSNAMEN-TOENE JETZT AUS DEN KARTEN SELBST: der Schein hinter jedem Namen wurde pro Liga aus den FREIEN FLAECHEN des jeweiligen Gemaeldes GESAMPELT (hellstes Luminanz-Band, Glanzlichter uebersprungen, +12% Licht fuer die Tinte) - Fruehling Wiesen-Pergament, Sommer Olivgold, Wueste Sandgold, Meer Graublau der See usw.; dazu DEUTLICH TRANSPARENTER (Halo .58/.38 statt .95/.78, Textschatten .55)
- GAMBIT STEHT HOEHER auf der Karte (Fuesse ueber dem Ankerpunkt, -102%) - er verdeckt keine Stationsnamen mehr
- GAMBIT IST ANTIPPBAR: ein Tipp laesst ihn auf 132% vortreten (goldener Schein) und oeffnet ueber seinem Kopf ein kleines Rang-Blatt - Level, Stufe (I-VI) und die Funken-Kette; zweiter Tipp schliesst

## 0.21.88
- DAS BOOT IST JETZT EIN LEBENSWERK: 2400 Gold statt 140 - die Passage aufs Endlose Meer will ueber die ganze Reise ERSPART sein (neue Test-Invarianten: Boot >= 2000, Einkommen der Ligen 1-9 deckt es locker; Liga-1-Invariante zaehlt nur noch Liga-1-Schluessel)
- NAHANSICHT RICHTIG GEBAUT: freies PINCH-ZOOM bis 200% (zwei Finger), Ein-Finger-Ziehen verschiebt den Ausschnitt (Tippen bleibt Zug - nach einem Zieh-Manoever wird der versehentliche Tap geschluckt), am Desktop zoomt das Mausrad; KEIN Scrollbalken mehr (Transform statt Scroll). Der LUPEN-KNOPF sitzt jetzt UNTEN RECHTS im Brettfenster - weit weg vom Aufgeben-Knopf; Ausschalten setzt die Ansicht zurueck
- EBENEN-STAPEL DER FIGUREN: die Reihen liegen jetzt sauber uebereinander - Brett zuunterst, hinterste Reihe darueber, jede naehere Reihe hoeher; vordere Figuren VERDECKEN dahinterstehende, die gewaehlte Figur steht ueber allem; die Marmor-Welle laeuft weiter unter den Figuren
- DIE LETZTE REIHE WIRD NICHT MEHR ABGESCHNITTEN: das Brett laesst die Koepfe der hintersten Reihe ueber das Spielfeld hinausragen (overflow frei)

## 0.21.87
- EROEFFNUNG DRAMATISCHER + VARIIERT: drei Kamerafluege (A/B/C), jede Schlacht zieht zufaellig einen - alle beginnen NAH UEBER DEN FEINDREIHEN und verweilen dort (die eigene Reihe kennt man), mit seitlichen Schwenks, 3.4s; NEUE, nie gesehene Feindfiguren PULSIEREN waehrend des Flugs golden - die Kamera stellt sie vor
- DER CODEX (neue Kernmechanik): das Profil merkt sich, welchen exotischen Figuren man je begegnet ist. FEINDE SIND JETZT IMMER ANKLICKBAR - Standardfiguren und bereits BEKANNTE zeigen ihre Zuege; FREMDE behalten ihre Zuege beim ersten Treffen fuer sich (ab der naechsten Schlacht offen)
- SEHER-GABE PRAEZISIERT: Hellseherin und Falke lesen auch FREMDE - aber erst ab Level 2 (die erste erworbene Faehigkeitsstufe schaltet den Spaehblick frei)
- FIRST-MEET-GESCHICHTEN: klickt man eine nie gesehene Figur an, stellt sie sich einmalig mit einem Popup vor (Portrait, Name, Sage) - inkl. Hinweis, ob die Seher-Gabe sie bereits liest oder sie ihre Geheimnisse noch behaelt
- Gewaehlte Figuren wachsen beim Anklicken jetzt auf 138% (vorher 124%)

## 0.21.86
- KARTE: das Liga-Blaettern sind jetzt runde GOLD-PFEILE (links/rechts, gleicher Siegel-Stil) - der Karten-Nadel-Knopf bleibt ganz links
- WERKBANK: der SPIELFORTSCHRITT-REGLER ist von der Spielstand-Karte in die Werkbank umgezogen (alte Stelle entfernt) und wirkt jetzt auf die GEWAEHLTE LIGA statt stur auf Liga 1
- LIGA-10-BUG BEHOBEN: der Liga-Sprung setzt die Reise sauber auf (frisches cleared, Tore geleert) - und das ENDLOSE MEER kommt automatisch mit Kapitaen + Boot ausgestattet, sonst sperrte die Meer-Maut die komplette Karte ("bei 10 kann man nichts spielen")

## 0.21.85
- GROSSE EMOJI-JAGD: die komplette App wurde nach Emoji-Symbolen durchkaemmt - alles jetzt handgezeichnet im Haus-Gold. NEU GEZEICHNET: gekreuzte Klingen, Seherkugel, Anker, Ruderboot, Wellen-Siegel, Wachs-Haken + Pflicht-Kaestchen, Gold-Sanduhr, vergoldeter Schaedel
- AKADEMIE: alle Lektions-Icons auf Schatz-Gold umgestellt (Gold-Herz + Klingen, Sanduhr, Schaedel, Funke + Wimpel, Muenze); Stern-Emoji in den Texten durch den Funken ersetzt
- MEER-POPUP: Wellen-Titel, Anker- und Boot-Bedingungen mit gezeichneten Haken/Kaestchen statt Emoji; ebenso die TOR-Bedingungen der Reise
- AUSSERDEM: Seher-Fenster mit gezeichneter Kristallkugel, Bestenliste mit Gold-Pokal, Sperrschirm mit gezeichnetem Schloss, Schild-/Drachen-Emoji-Reste im Hofstaat entfernt, tote Emoji-Daten der Navigation bereinigt

## 0.21.84
- GEZEICHNETE ICONS komplettiert: das Willkommen-Fenster traegt jetzt GOLD-HERZ, Gold-Funke und Feldkarte (statt gruenem Herz/Stern); der Namens-Wuerfel im Online-Duell ist ein handgezeichneter GOLD-WUERFEL mit dunklen Augen
- DIE GEWAEHLTE FIGUR TRITT VOR: beim Anwaehlen waechst jede Figur um 24% aus ihrer Kachel (sanfte .16s-Bewegung) - eigene wie feindliche
- SEHER-SPAEHBLICK (neue Faehigkeit von Hellseherin und Falke): steht eine SEHERIN oder ein FALKE in deinen Reihen, kannst du JEDE feindliche Figur antippen - sie tritt vor und ihre moeglichen Zuege leuchten in Seher-Violett auf. So analysierst du fremde Champions und Monster, bevor du ziehst
- EROEFFNUNGSFLUG: jede Partie beginnt mit einem kurzen Kameraflug uebers Brett (2.5s, von den Feindreihen heran) - der Gegner steht dir einmal vor Augen, dann setzt sich das Brett
- NAHANSICHT (Lupen-Knopf neben Aufgeben): schaltet einen scrollbaren Zoom-Modus (185%), um das Brett im Detail zu studieren - das feste, unverrueckbare Brett bleibt der Standard

## 0.21.83
- UPDATE-PROBLEM AN DER WURZEL BEHOBEN: der Service Worker bekam skipWaiting + clientsClaim - neue Versionen uebernehmen ab jetzt beim NAECHSTEN LADEN sofort, statt zu warten bis alle Tabs geschlossen sind (der Grund, warum Aenderungen oft "nicht ankamen")
- VERSIONSANZEIGE: unten auf Login und Spielstand-Auswahl steht jetzt dezent die laufende Versionsnummer - so ist sofort sichtbar, welcher Stand laedt
- ABSTAND Logo -> Text nochmals kraeftiger: Login 42px, Spielstand-Auswahl 38px

## 0.21.82
- STATIONSNAMEN tragen jetzt das Licht ihres Landes: der Schein hinter jedem Namen ist je Liga getoent - Fruehling Wiesengruen, Sommer Sonnengold, Herbst Bernstein, Winter Eisblau, Hochgebirge Felsgrau, Oedland Aschebeige, Steppe Grasgelb, Canyon Terrakotta, WUESTE SANDGELB, MEER MEERBLAU (dunkle Tinte bleibt lesbar)
- BRETTFIGUREN nochmals groesser: die Glyphe waechst von 90% auf 98% der Kachel

## 0.21.81
- DER WANDERER auf der Karte deutlich groesser (76x78 statt 56x58) - jetzt klar erkennbar
- SCHACHBRETT breiter und hoeher: die Partie-Ansicht laesst nur noch einen schmalen dunklen Rand (Brett-Rand 2/4px, Shell-Polster im Spiel 10px Desktop / 3px mobil)

## 0.21.80
- KARTEN-NAVIGATION neu: statt +/- jetzt ein runder SIEGEL-KNOPF mit handgezeichneter FELDKARTE + NADEL (drei gefaltete Bahnen, gestichelte Route, goldene Wegnadel mit Lichtpunkt) - ein Tipp oeffnet das Weltgemaelde; IN der Weltkarte sitzt oben links ein runder ZURUECK-PFEIL (ebenfalls handgezeichnet, Haus-Gold) zurueck zur Liga

## 0.21.79
- LOGIN + SPIELSTAND: mehr Freiraum unter dem Logo (26px bzw. 24px Abstand zum Anmelde-Bereich / zur Spielstand-Liste)

## 0.21.78
- FEIND-RAUCH nochmals deutlich verstaerkt (im Live-Test war er selbst im Zoom kaum sichtbar): hellere Schwaden, Deckkraft-Zyklus 0.45-0.8, breiter und hoeher (0.95em x 1.42em)

## 0.21.77
- SPERRSCHIRM-SACKGASSE BEHOBEN (im Live-UX-Test gefunden): der "Profil gesperrt"-Schirm hatte KEINEN Weg zurueck - wer den falschen Spielstand antippte oder das Passwort nicht parat hatte, sass fest. Jetzt gibt es "Zurueck zur Spielstand-Auswahl" direkt unter dem Entsperren-Knopf

## 0.21.76
- ERSTER START OEFFNET DIE WELT: wer die Kampagne zum ersten Mal betritt, sieht zuerst das grosse Weltgemaelde (einmalig, danach gemerkt) - die Reise beginnt mit dem Blick aufs Ganze
- LORE-FENSTER IN DER KARTE: tippt man eine Liga an, erscheint die Geschichte jetzt INNERHALB des Gemaeldes - schwebend ueber dem Anker im vergrauten Dunkel (bei den obersten Ligen klappt es stattdessen darunter auf); kein Block mehr unter der Karte, auch auf Desktop
- HELLER STRICH LINKS BEHOBEN: die Karte bekommt eine Deckungs-Reserve (Zoom +0.5%) und der Rahmen hinter Gemaelden ist dunkel statt Pergament - keine helle Naht mehr am Rand
- NEBEL & RAUCH KRAEFTIGER: Kartenfenster-Nebel heller und dichter (0.4 + zweite 0.26er-Schicht, hellere Schwaden), der Rauch hinter feindlichen Figuren ist breiter, steigt ueber den Kopf hinaus und traegt mehr Deckkraft (0.55) - jetzt wirklich sichtbar

## 0.21.75
- LOGIN + SPIELSTAND final aufgeraeumt: Inhalt beginnt GANZ OBEN (kein Riesen-Abstand mehr auf Desktop - die vertikale Zentrierung ist raus), das Ritter-Bild ist GROESSER (Login 36vh/720px, Spielstand 32vh/620px) und steht als Erstes; "Waehle deinen Spielstand" kleiner (14.5 statt 19); die GEISTER-PILL unter dem Absatz ist entfernt (leere Huelle des alten Admin-Hinweises, auf beiden Schirmen geprueft); Eingabefelder und Knoepfe kompakter - und gescrollt wird ganz normal, wenn die Bildschirmhoehe nicht reicht

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
