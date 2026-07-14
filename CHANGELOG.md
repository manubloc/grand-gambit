# Changelog — Grand Gambit

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
- **Admin-Konto eingebaut:** `admin` / `gambit-admin` (Warnhinweis bis zur Passwort-Änderung). Admins bekommen pro Spielstand den **Fortschrittsregler: 0 %, 100 % oder jeder Wert dazwischen** — gesetzt in Reise-Reihenfolge, mit passendem Gold/XP und freigeschalteten Bossen.
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
