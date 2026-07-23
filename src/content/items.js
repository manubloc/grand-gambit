// Equipment & expedition gear — bought with gold in the court's supply
// chest. Two flavors: CONSUMABLES burn per use (draughts), KEYS are owned
// once and forever — they unlock hidden paths on the campaign map, and one
// of them (the boat, together with the Captain) opens the Endless Sea.
export const ITEMS = {
  potion: {
    id: "potion", emoji: "🧪", kind: "consumable", gold: 25, max: 3, minCleared: 1,
    nameDe: "Lebenstrank", nameEn: "Healing draught",
    textDe: "Heilt im Kampf eine Figur um 2 Lebenspunkte (kostet den Zug).",
    textEn: "Heals a piece for 2 life points in battle (spends the turn).",
    loreDe: "Trinkt eine Figur mitten im Kampf, kehren zwei Lebenspunkte zurück — nie über ihr Maximum hinaus. Das kostet deinen ganzen Zug: Die Figur heilt, statt zu ziehen oder anzugreifen. Antippen des Trank-Knopfes im Kampf, dann die Figur wählen. Du kannst höchstens drei mit ins Feld nehmen.",
    loreEn: "Drunk mid-battle, two life points return — never past the piece's maximum. It costs your whole turn: the piece heals instead of moving or striking. Tap the draught button in battle, then choose the piece. You may carry three at most.",
  },
  hourglass: {
    id: "hourglass", emoji: "⏳", kind: "consumable", gold: 40, max: 2, minCleared: 2,
    nameDe: "Zeitenwender", nameEn: "Time-turner",
    textDe: "Nimmt im Kampf deinen letzten Zug zurück — die Sanduhr rieselt aufwärts.",
    textEn: "Takes back your last move in battle — the sand runs upward.",
    loreDe: "Dreht den letzten Zug zurück — deinen und die Antwort des Gegners. Jede Umkehr verbrennt eine Sanduhr, und du kannst nicht zweimal hintereinander zurück. In Online-Duellen gilt sie nicht: Dort wäre sie gegen den Menschen gegenüber unfair.",
    loreEn: "Turns back the last move — yours and the reply. Each reversal burns one hourglass, and you cannot step back twice in a row. It does not apply in online duels: there it would be unfair to the person across from you.",
  },
  machete: {
    id: "machete", emoji: "🌿", kind: "key", gold: 50, minCleared: 4,
    nameDe: "Buschmesser", nameEn: "Machete",
    textDe: "Schlägt den überwucherten Schmugglersteig frei.",
    textEn: "Clears the overgrown Smuggler's Trail.",
    loreDe: "Ein Wegwerkzeug, kein Kampfmesser: Es öffnet den überwucherten Schmugglersteig, der sich an einer Station der Karte durchs Dickicht zieht. Einmal gekauft, bleibt es dir für immer — der Pfad steht danach dauerhaft offen.",
    loreEn: "A trail tool, not a fighting blade: it opens the overgrown smugglers' path that winds through the thicket at one station. Bought once, kept forever — the path stays open from then on.",
  },
  grapnel: {
    id: "grapnel", emoji: "🪝", kind: "key", gold: 60, minCleared: 9,
    nameDe: "Enterhaken", nameEn: "Grappling hook",
    textDe: "Überwindet die Vergessene Kluft.",
    textEn: "Crosses the Forgotten Chasm.",
    loreDe: "Wirft über die Vergessene Kluft, wo der Weg abbricht. Ein Schlüsselgegenstand: nicht verbrauchbar, nicht im Kampf nutzbar — er entriegelt schlicht einen Pfad, der sonst verschlossen bleibt.",
    loreEn: "Throws across the Forgotten Rift where the road breaks off. A key item: not consumed, not usable in battle — it simply unbars a path that stays shut otherwise.",
  },
  torch: {
    id: "torch", emoji: "🔥", kind: "key", gold: 45, minCleared: 11,
    nameDe: "Fackel", nameEn: "Torch",
    textDe: "Erleuchtet die Sturmgrotte vor der Zitadelle.",
    textEn: "Lights the Storm Grotto before the Citadel.",
    loreDe: "Leuchtet die Sturmgrotte vor der Zitadelle aus. Ohne Licht führt kein Weg hindurch — mit Fackel steht der Durchgang für den Rest der Reise offen.",
    loreEn: "Lights the Storm Grotto below the Citadel. There is no way through in the dark — with the torch the passage stays open for the rest of the journey.",
  },
  bergschluessel: {
    id: "bergschluessel", emoji: "🗝", kind: "key", gold: 55, minLeague: 5,
    nameDe: "Bergschlüssel", nameEn: "Mountain key",
    textDe: "Löst die Winde der Seilbahnstation im Hochgebirge (Kapitel V) — ein Techniker im Hofstaat wartet das Werk.",
    textEn: "Frees the winch of the cable-car station in the High Mountains (Chapter V) — an Engineer in your court services the gears.",
    loreDe: "Löst die eingefrorene Winde der Seilbahnstation im Hochgebirge (Kapitel V). ACHTUNG: Der Schlüssel allein genügt nicht — ein Techniker muss in deinem Hofstaat stehen, der das Werk wartet. Erst beide zusammen öffnen die Station.",
    loreEn: "Frees the frozen winch of the cable station in the high mountains (Chapter V). NOTE: the key alone is not enough — an Engineer must stand in your court to service the works. Only both together open the station.",
  },
  kriegsaxt: {
    id: "kriegsaxt", emoji: "🪓", kind: "key", gold: 75, minLeague: 6,
    nameDe: "Kriegsaxt", nameEn: "War axe",
    textDe: "Sprengt das Schwarze Tor im Ödland (Kapitel VI) — mit einem Schildträger als Rammstoß.",
    textEn: "Breaches the Black Gate in the Badlands (Chapter VI) — with a Guardian as the ram.",
    loreDe: "Sprengt das Schwarze Tor im Ödland (Kapitel VI). ACHTUNG: Die Axt braucht Muskeln — ein Schildträger in deinem Hofstaat rammt das Tor auf. Ohne ihn bleibt es verschlossen, so scharf die Schneide auch ist.",
    loreEn: "Breaks the Black Gate in the wastes (Chapter VI). NOTE: the axe needs shoulders — a Guardian in your court rams the gate. Without him it stays shut, however keen the edge.",
  },
  kamel: {
    id: "kamel", emoji: "🐫", kind: "key", gold: 70, minLeague: 7,
    nameDe: "Kamel", nameEn: "Camel",
    textDe: "Trägt dich durch das Dürrgras der Steppe (Kapitel VII) zur Karawanenrast der Händler.",
    textEn: "Carries you through the Steppe's dry grass (Chapter VII) to the traders' caravan rest.",
    loreDe: "Trägt dich durch das Dürrgras der Steppe (Kapitel VII) bis zur Karawanenrast der Händler. Ein Reittier als Schlüssel: Es kämpft nicht mit, es bringt dich nur dorthin, wo du zu Fuß umkehren müsstest.",
    loreEn: "Carries you through the dry grass of the steppe (Chapter VII) to the traders' rest. A mount as a key: it does not fight, it only takes you where you would have to turn back on foot.",
  },
  donnerpulver: {
    id: "donnerpulver", emoji: "🧨", kind: "key", gold: 60, minLeague: 8,
    nameDe: "Donnerpulver", nameEn: "Thunder powder",
    textDe: "Räumt mit einem Alchemisten den Gesprengten Pass im Roten Canyon frei (Kapitel VIII).",
    textEn: "With an Alchemist, clears the Blasted Pass in the Red Canyon (Chapter VIII).",
    loreDe: "Räumt den Gesprengten Pass im Roten Canyon frei (Kapitel VIII). ACHTUNG: Nur ein Alchemist aus deinem Hofstaat kann die Ladung sicher setzen — ohne ihn bleibt das Fass ungenutzt.",
    loreEn: "Clears the Blasted Pass in the Red Canyon (Chapter VIII). NOTE: only an Alchemist from your court can set the charge safely — without one the keg stays unused.",
  },
  sternenkompass: {
    id: "sternenkompass", emoji: "🧭", kind: "key", gold: 65, minLeague: 9,
    nameDe: "Sternenkompass", nameEn: "Star compass",
    textDe: "Weist in der Wüste (Kapitel IX) den Nachtpfad zum Verborgenen Schrein — nur ein Späher liest die Zeichen. Der Sieg schenkt einen Lebenstrank.",
    textEn: "Points the night path to the Hidden Shrine in the Desert (Chapter IX) — only a Pathfinder reads the signs. Victory grants a healing draught.",
    loreDe: "Weist in der Wüste (Kapitel IX) den Nachtpfad zum Verborgenen Schrein. ACHTUNG: Die Sternzeichen liest nur ein Späher aus deinem Hofstaat. Der Sieg an diesem Schrein schenkt dir zusätzlich einen Lebenstrank.",
    loreEn: "Shows the night path to the Hidden Shrine in the desert (Chapter IX). NOTE: only a Hawk from your court reads the star signs. Victory at that shrine also grants you a healing draught.",
  },
  anker: {
    id: "anker", emoji: "⚓", kind: "key", gold: 90, minLeague: 10,
    nameDe: "Anker", nameEn: "Anchor",
    textDe: "Erlaubt dem Kapitän, in der Ankerbucht festzumachen (Kapitel X) — dort kreist der Sturmfalke.",
    textEn: "Lets the Captain moor in Anchor Cove (Chapter X) — where the storm hawk circles.",
    loreDe: "Erlaubt das Festmachen in der Ankerbucht (Kapitel X) — dort kreist der Späher als Sturmfalke. ACHTUNG: Ohne einen Kapitän im Hofstaat legt niemand an.",
    loreEn: "Allows mooring in Anchor Bay (Chapter X) — where the Hawk circles like a storm. NOTE: without a Captain in your court, no one puts in.",
  },
  brieftaube: {
    id: "brieftaube", emoji: "🐦", kind: "key", gold: 35, minCleared: 6,
    nameDe: "Brieftaube", nameEn: "Carrier pigeon",
    textDe: "Sendet online einem Freund 10 Gold — einmal pro Kapitel.",
    textEn: "Sends a friend 10 gold online — once per chapter.",
    loreDe: "Sendet einem Freund online zehn Goldstücke — einmal je Kapitel. Der Freund muss in deiner Freundesliste stehen; das Gold kommt aus deiner eigenen Kasse und erreicht ihn, sobald er das nächste Mal die Hallen betritt.",
    loreEn: "Sends a friend ten gold pieces online — once per chapter. The friend must be on your list; the gold leaves your own purse and reaches them the next time they enter the halls.",
  },

  boat: {
    id: "boat", emoji: "🛶", kind: "key", gold: 2400, minLeague: 9, // a life's savings: the passage to the Endless Sea is EARNED
    nameDe: "Boot", nameEn: "Boat",
    textDe: "Mit dem Kapitän an Bord öffnet es das Endlose Meer (Kapitel X).",
    textEn: "With the Captain aboard it opens the Endless Sea (Chapter X).",
    loreDe: "Das teuerste Stück der Truhe — und das einzige, das eine ganze Welt öffnet: das Endlose Meer (Kapitel X). ACHTUNG: Das Boot allein segelt nicht. Erst mit dem Kapitän an Bord, den du als Endboss des Wüsten-Kapitels gewinnst, stichst du in See.",
    loreEn: "The dearest thing in the chest — and the only one that opens a whole world: the Endless Sea (Chapter X). NOTE: the boat does not sail itself. Only with the Captain aboard, won as the Desert Chapter finale, do you put to sea.",
  },
};
export const ITEM_LIST = Object.values(ITEMS);
export const hasItem = (profile, id) =>
  ITEMS[id]?.kind === "key" ? !!profile?.items?.[id] : (profile?.items?.[id] || 0) > 0;
export function buyItem(profile, id) {
  const it = ITEMS[id];
  if (!it) return profile;
  const items = { ...(profile.items || {}) };
  if (it.kind === "key") {
    if (items[id]) return profile;
    if ((profile.gold || 0) < it.gold) return profile;
    items[id] = true;
  } else {
    const have = items[id] || 0;
    if (have >= (it.max || 99) || (profile.gold || 0) < it.gold) return profile;
    items[id] = have + 1;
  }
  return { ...profile, gold: profile.gold - it.gold, items };
}
