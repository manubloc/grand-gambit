// ── THE OVERWORLD PAINTING ───────────────────────────────────────────────────
// One vertical journey, ten climates, bottom to top — spring to the Endless
// Sea. Anchors were MEASURED on the painting (percent of width/height): the
// pale corridor that winds through the middle third is the road itself.
import worldUrl from "./assets/weltkarte.webp";

export const WORLD_MAP = {
  url: worldUrl,
  w: 836, h: 1881,
  // league → [x%, y%] along the corridor; L10 sits on the lighthouse isle
  anchors: {
    1: [49, 93], 2: [52, 82], 3: [45.5, 70], 4: [50, 60], 5: [52, 49.5],
    6: [55.5, 40], 7: [55, 32.5], 8: [48.5, 24.5], 9: [50, 16], 10: [74, 5.5],
  },
};

// ── league lore: two sentences each, tied to the Tale of the Rift and the
// gatekeeper who holds that league's door ──
export const LEAGUE_LORE = {
  // ── Die Chronik des Risses ──────────────────────────────────────────────────
  // Ein Bogen, drei Gestalten: Corvin, der Gambit ohne Namen. Asra, die
  // zurückkehrte. Vesna, die Namen aufschrieb, die niemand mehr sprechen darf.
  // Alle anderen sind Nebenwirkungen derselben Wunde.
  1: {
    de: "Auf diesen Blütenwiesen gewann König Osric einen Krieg, den er nicht gewinnen konnte: Er öffnete den Riss und bot ihm Diener statt Soldaten. Der Riss stellte eine einzige Bedingung — er nimmt zuerst den Namen, dann den Menschen. Seither heißt das Opfer der Krone nur noch: der Gambit. In jener Nacht begann eine junge Seherin ein verbotenes Verzeichnis — jeden Namen, den niemand mehr aussprechen darf.",
    en: "On these blossom meadows King Osric won a war he could not win: he opened the rift and offered it servants instead of soldiers. The rift set a single condition — it takes the name first, then the man. Ever since, the Crown's sacrifice bears one title only: the Gambit. That night a young seeress began a forbidden register — every name no one may speak again.",
  },
  2: {
    de: "Im Weizen hält der Richter Gericht, im Namen eines Hofes, den es nicht mehr gibt. Doch seit einem Sommer liegen Freisprüche in seinen Akten, gezeichnet mit einem Namen, den keine Akte kennt: Asra. Der Richter hat das Blatt verbrannt. Die Asche, sagt man, buchstabiert ihn noch.",
    en: "In the wheat the Judge holds court, in the name of a court that no longer exists. Yet since one summer his files hold acquittals, signed with a name no file contains: Asra. The Judge burned the page. The ash, they say, still spells it.",
  },
  3: {
    de: "Zwei Leiber, ein Schwur: Der Doppelritter leistete ihn dem letzten Gambit — Treue bis ans Tor, und keinen Schritt weiter hinab. Einer der beiden erinnert sich an ihre Stimme, keiner an den Namen. So bewacht der Schwur ein Tor und weiß nicht mehr, für wen. Im Bernsteinlaub, heißt es, wenden sich Eide wie Blätter.",
    en: "Two bodies, one vow: the Twin Knight swore it to the last Gambit — loyalty to the gate, and not one step further down. One of them remembers her voice, neither recalls the name. So the vow guards a gate and no longer knows for whom. In the amber leaves, they say, oaths turn like foliage.",
  },
  4: {
    de: "In einem Winter vor Jahren kam jemand aus dem Riss zurück — barfuß, ohne Namen, mit dem Gedächtnis eines ganzen Hofes. Der Schnee bewahrte die Spur, die Kälte hielt sie still. Der Schattenfürst folgte ihr drei Nächte und sah zu lange hin; seither ist er halb Mensch, halb das, was der Riss aus Menschen macht. Die Spur endete am Archiv.",
    en: "One winter years ago someone came back out of the rift — barefoot, nameless, carrying a whole court's memory. The snow kept the trail, the cold kept it still. The Shadowlord followed it three nights and looked too long; he has been half a man, half what the rift makes of men, ever since. The trail ended at the archive.",
  },
  5: {
    de: "Über diese Pässe floh, was vom Hof übrig war, und verriegelte hinter sich jede Tür. Der Hüter trägt die Schlüssel noch — nur eine Tür findet er bis heute: das Archiv der Krone. Dort lag Vesnas verbotenes Verzeichnis, Name um Name, bis zu jenem Winter. Seither bewacht der Hüter ein leeres Regal, so streng wie je.",
    en: "Over these passes fled what remained of the court, bolting every door behind it. The Keeper still carries the keys — only one door he can find to this day: the Crown's archive. There lay Vesna's forbidden register, name upon name, until that winter. Ever since, the Keeper guards an empty shelf, as strictly as ever.",
  },
  6: {
    de: "Das Ödland war der erste Preis: Wo der Riss trank, blieben rissige Erde und totes Geäst. Hier liest die Blutmagd den Ritus — ein Kelch, der nie geleert und nie gefüllt wird, für den letzten Schluck vor dem Abstieg. Asra trank daraus, und sie soll gelächelt haben. Die Blutmagd schenkt seither niemandem mehr nach.",
    en: "The wasteland was the first price: where the rift drank, cracked earth and dead boughs remained. Here the Bloodmaid keeps the rite — a chalice never emptied and never filled, for the last sip before the descent. Asra drank from it, and they say she smiled. The Bloodmaid has refilled no cup since.",
  },
  7: {
    de: "Auf der weiten Steppe ritt der Lanzenmeister einst Turniere für den ganzen Hof — und einen letzten Gang für Asra, seine beste Schülerin, am Vorabend ihres Abstiegs. Er reitet ihn noch immer, Gang um Gang, gegen eine Gegnerin, die nur er sieht. Er weiß, dass etwas zurückgekehrt ist. Er weigert sich zu sehen, was.",
    en: "On the wide steppe the Lancemaster once rode tourneys for the whole court — and one last tilt for Asra, his finest student, on the eve of her descent. He rides it still, tilt after tilt, against an opponent only he can see. He knows something has returned. He refuses to see what.",
  },
  8: {
    de: "Der rote Canyon ist die Wunde selbst: Hier führt die Treppe hinab, die jeder Gambit zuletzt geht — die Stufen glatt von bloßen Füßen. Am Grund liegt der Riss offen und atmet. Eisenfaust hält seit dem ersten Tag die Wache, die Faust um einen Namen geballt, den er nicht mehr aussprechen kann. Wer hier lauscht, hört den Riss flüstern: Er übt Namen, wie andere Klingen wetzen.",
    en: "The red canyon is the wound itself: here run the steps every Gambit walks last — worn smooth by bare feet. At the bottom the rift lies open, breathing. Ironfist has stood watch since the first day, his fist clenched around a name he can no longer speak. Listen here and you will hear the rift whisper: practising names the way others whet blades.",
  },
  9: {
    de: "Die Wüste verschluckt Spuren, Namen und Absichten; nur die Oase erinnert sich. Hierher kam Vesna, die Seherin, als selbst sie Asras Namen vergessen hatte — denn sie war es, die ihn dem Riss genannt hat, um den Hof zu retten. Das Verzeichnis ist fort; Asra sammelt darin keine Rache, sondern Namen: Sie will jeden einzelnen zurückgeben, und wenn der Hof daran zerbricht. Eines trägt Vesna noch bei sich — den Namen des jungen Gambit, aufgeschrieben vor dem Ritus, gegen jede Regel: Corvin.",
    en: "The desert swallows tracks, names and intentions; only the oasis remembers. Here came Vesna the seeress when even she had forgotten Asra's name — for it was she who spoke it to the rift, to save the court. The register is gone; Asra collects no revenge in it, only names: she means to give every one of them back, though the court should break on it. One thing Vesna still carries — the young Gambit's name, written down before the rite, against every rule: Corvin.",
  },
  10: {
    de: "Das Endlose Meer ist, wohin der Riss ausblutet: Was er nicht behalten will, spült er hier an. Der Kapitän fährt die Habseligkeiten der Genommenen hinaus — Fracht ohne Empfänger, seit Osrics erster Nacht. Irgendwo auf diesem Wasser wartet der alte König als Großmeister: Der Riss holt sich zuletzt den, der ihn geöffnet hat. Und zum ersten Mal steigt ein Gambit mit Namen herab — diesmal weiß der Riss, wen er nimmt. Vielleicht macht genau das den Unterschied.",
    en: "The Endless Sea is where the rift bleeds out: what it will not keep, it washes up here. The Captain ferries out the belongings of the taken — cargo with no recipient, since Osric's first night. Somewhere on this water the old king waits as Grandmaster: the rift comes last for the one who opened it. And for the first time a Gambit walks down carrying a name — this time the rift knows whom it takes. Perhaps that is exactly what makes the difference.",
  },
};
