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
  1: {
    de: "Hier zerbrach der Hof: Auf diesen Blütenwiesen öffnete der erste Ligameister den Riss, um einen Krieg zu gewinnen, den er nicht gewinnen konnte. Seine Burg steht noch — und zahlt dem Riss die Miete in fremden Niederlagen.",
    en: "Here the court shattered: on these blossom meadows the first League Master opened the rift to win a war he could not win. His keep still stands — paying the rift its rent in other people's defeats.",
  },
  2: {
    de: "Die goldenen Felder ernähren alle Ligen, doch geerntet wird unter Aufsicht: Im Weizen hält der Richter Gericht — im Namen eines Hofes, den es nicht mehr gibt. Wer hier verliert, gilt als verurteilt.",
    en: "The golden fields feed every league, but the harvest is supervised: the Judge holds court in the wheat, in the name of a court that no longer exists. To lose here is to be sentenced.",
  },
  3: {
    de: "In den Bernsteinwäldern färbte sich mehr als das Laub: Hier wandten sich die ersten Eide. Am Tor wacht der Doppelritter — zwei Leiber, ein Schwur, und keiner erinnert sich, wem er galt.",
    en: "In the amber woods more than the leaves turned: the first oaths turned here. The Twin Knight guards the gate — two bodies, one vow, and neither remembers to whom it was sworn.",
  },
  4: {
    de: "Der Winter bewahrt, was der Riss verändert — die Kälte hält es nur still. Am Tor steht der Schattenfürst: halb Mensch, halb das, was der Riss aus Menschen macht.",
    en: "Winter preserves what the rift changes — the cold merely keeps it still. At the gate stands the Shadowlord: half a man, half what the rift makes of men.",
  },
  5: {
    de: "Über die Pässe des Hochgebirges floh, was vom Hof übrig war, und verriegelte hinter sich jede Tür. Der Hüter trägt die Schlüssel noch — zu Türen, die längst niemand mehr findet.",
    en: "Over these high passes fled what remained of the court, bolting every door behind it. The Keeper still carries the keys — to doors no one can find anymore.",
  },
  6: {
    de: "Das Ödland war der erste Preis: Als der Riss trank, blieb rissige Erde und totes Geäst. Die Blutmagd schenkt hier aus einem Kelch, der nie geleert und nie gefüllt wird.",
    en: "The wasteland was the first price: where the rift drank, cracked earth and dead boughs remained. Here the Bloodmaid pours from a chalice never emptied and never filled.",
  },
  7: {
    de: "Auf der weiten Steppe wurden einst Turniere geritten, als der Hof noch einer war. Der Lanzenmeister reitet sie weiter — Gang um Gang, gegen einen Gegner, den nur er sieht.",
    en: "On the wide steppe tourneys were ridden when the court was still one. The Lancemaster rides them yet — tilt after tilt, against a foe only he can see.",
  },
  8: {
    de: "Der rote Canyon klafft wie die Erde selbst zerrissen — manche sagen: am selben Tag wie der Hof. In seinen Wänden hält Eisenfaust Wache, die Faust seit jenem Tag geballt.",
    en: "The red canyon gapes as if the earth itself had torn — some say on the very day the court did. In its walls Ironfist keeps watch, the fist clenched since that day.",
  },
  9: {
    de: "Die Wüste verschluckt Spuren, Namen und schlechte Absichten; nur die Oase erinnert sich an alle. Der Kanonier hütet das letzte Tor vor dem Wasser — und rät jedem, dort auf gar nichts zu zielen.",
    en: "The desert swallows tracks, names and bad intentions; only the oasis remembers them all. The Cannoneer keeps the last gate before the water — and advises everyone to aim at nothing out there.",
  },
  10: {
    de: "Das Endlose Meer ist der Brunnen, aus dem der Riss trinkt — und der Koloss ist sein Deckel. Der Leuchtturm warnt nicht vor den Klippen: Er warnt vor dem, was unter ihnen wohnt.",
    en: "The Endless Sea is the well the rift drinks from — and the Colossus is its lid. The lighthouse does not warn of the rocks: it warns of what lives beneath them.",
  },
};
