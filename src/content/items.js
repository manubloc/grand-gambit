// Equipment & expedition gear — bought with gold in the court's supply
// chest. Two flavors: CONSUMABLES burn per use (draughts), KEYS are owned
// once and forever — they unlock hidden paths on the campaign map, and one
// of them (the boat, together with the Captain) opens the Endless Sea.
export const ITEMS = {
  potion: {
    id: "potion", emoji: "🧪", kind: "consumable", gold: 25, max: 3,
    nameDe: "Lebenstrank", nameEn: "Healing draught",
    textDe: "Heilt im Kampf eine Figur um 2 ♥ (kostet den Zug).",
    textEn: "Heals a piece for 2 ♥ in battle (spends the turn).",
  },
  hourglass: {
    id: "hourglass", emoji: "⏳", kind: "consumable", gold: 40, max: 2, minCleared: 2,
    nameDe: "Zeitenwender", nameEn: "Time-turner",
    textDe: "Nimmt im Kampf deinen letzten Zug zurück — die Sanduhr rieselt aufwärts.",
    textEn: "Takes back your last move in battle — the sand runs upward.",
  },
  machete: {
    id: "machete", emoji: "🌿", kind: "key", gold: 50, minCleared: 4,
    nameDe: "Buschmesser", nameEn: "Machete",
    textDe: "Schlägt den überwucherten Schmugglersteig frei.",
    textEn: "Clears the overgrown Smuggler's Trail.",
  },
  grapnel: {
    id: "grapnel", emoji: "🪝", kind: "key", gold: 60, minCleared: 9,
    nameDe: "Enterhaken", nameEn: "Grappling hook",
    textDe: "Überwindet die Vergessene Kluft.",
    textEn: "Crosses the Forgotten Chasm.",
  },
  torch: {
    id: "torch", emoji: "🔥", kind: "key", gold: 45, minCleared: 11,
    nameDe: "Fackel", nameEn: "Torch",
    textDe: "Erleuchtet die Sturmgrotte vor der Ligafeste.",
    textEn: "Lights the Storm Grotto before the League Keep.",
  },
  bergschluessel: {
    id: "bergschluessel", emoji: "🗝", kind: "key", gold: 55, minLeague: 5,
    nameDe: "Bergschlüssel", nameEn: "Mountain key",
    textDe: "Löst die Winde der Seilbahnstation im Hochgebirge (Liga V) — ein Techniker im Hofstaat wartet das Werk.",
    textEn: "Frees the winch of the cable-car station in the High Mountains (League V) — an Engineer in your court services the gears.",
  },
  kriegsaxt: {
    id: "kriegsaxt", emoji: "🪓", kind: "key", gold: 75, minLeague: 6,
    nameDe: "Kriegsaxt", nameEn: "War axe",
    textDe: "Sprengt das Schwarze Tor im Ödland (Liga VI) — mit einem Schildträger als Rammstoß.",
    textEn: "Breaches the Black Gate in the Badlands (League VI) — with a Guardian as the ram.",
  },
  kamel: {
    id: "kamel", emoji: "🐫", kind: "key", gold: 70, minLeague: 7,
    nameDe: "Kamel", nameEn: "Camel",
    textDe: "Trägt dich durch das Dürrgras der Steppe (Liga VII) zur Karawanenrast der Händler.",
    textEn: "Carries you through the Steppe's dry grass (League VII) to the traders' caravan rest.",
  },
  donnerpulver: {
    id: "donnerpulver", emoji: "🧨", kind: "key", gold: 60, minLeague: 8,
    nameDe: "Donnerpulver", nameEn: "Thunder powder",
    textDe: "Räumt mit einem Alchemisten den Gesprengten Pass im Roten Canyon frei (Liga VIII).",
    textEn: "With an Alchemist, clears the Blasted Pass in the Red Canyon (League VIII).",
  },
  sternenkompass: {
    id: "sternenkompass", emoji: "🧭", kind: "key", gold: 65, minLeague: 9,
    nameDe: "Sternenkompass", nameEn: "Star compass",
    textDe: "Weist in der Wüste (Liga IX) den Nachtpfad zum Verborgenen Schrein — nur ein Späher liest die Zeichen. Der Sieg schenkt einen Lebenstrank.",
    textEn: "Points the night path to the Hidden Shrine in the Desert (League IX) — only a Pathfinder reads the signs. Victory grants a healing draught.",
  },
  anker: {
    id: "anker", emoji: "⚓", kind: "key", gold: 90, minLeague: 10,
    nameDe: "Anker", nameEn: "Anchor",
    textDe: "Erlaubt dem Kapitän, in der Ankerbucht festzumachen (Liga X) — dort kreist der Sturmfalke.",
    textEn: "Lets the Captain moor in Anchor Cove (League X) — where the storm hawk circles.",
  },
  brieftaube: {
    id: "brieftaube", emoji: "🐦", kind: "key", gold: 35, minCleared: 6,
    nameDe: "Brieftaube", nameEn: "Carrier pigeon",
    textDe: "Sendet online einem Freund 10 Gold — einmal pro Liga.",
    textEn: "Sends a friend 10 gold online — once per league.",
  },

  boat: {
    id: "boat", emoji: "🛶", kind: "key", gold: 140, minLeague: 9,
    nameDe: "Boot", nameEn: "Boat",
    textDe: "Mit dem Kapitän an Bord öffnet es das Endlose Meer (Liga X).",
    textEn: "With the Captain aboard it opens the Endless Sea (League X).",
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
