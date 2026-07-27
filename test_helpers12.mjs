// Gemeinsame Helfer fuer die Kampagnentests der ZWOELF Kapitel.
// Die alten Tests kannten ihre 51 Knoten beim Namen; die neuen 529 sind
// generiert, also werden Rollen hier DYNAMISCH aus dem Graphen gezogen -
// aendert der Generator die Verteilung, folgen die Tests von selbst.
import { CAMPAIGN } from "./src/content/index.js";
import { advanceCampaign } from "./src/meta/index.js";

export const kap = (L) => CAMPAIGN.filter((n) => n.league === L);

/** Startknoten eines Kapitels: der eine ohne Vorgaenger. */
export const startOf = (L) => {
  const ks = kap(L);
  const ziele = new Set(ks.flatMap((n) => n.next));
  return ks.find((n) => !ziele.has(n.id));
};

/** Der Hauptast in Laufreihenfolge (per haupt-Flag am next-Faden entlang). */
export const hauptast = (L) => {
  const ks = kap(L);
  const kette = [];
  let cur = startOf(L);
  while (cur && kette.length <= ks.length) {
    kette.push(cur);
    cur = ks.find((n) => n.haupt && cur.next.includes(n.id) && !kette.includes(n));
  }
  return kette;
};

/** Erste Station eines Kapitels, die eine bestimmte Figur stellt. */
export const figurStation = (piece) => CAMPAIGN.find((n) => n.boss?.piece === piece);

/** Profil, das ein Kapitel bis VOR seinen Endboss durchgespielt hat. */
export const bisVorEndboss = (profil, L) => {
  const kette = hauptast(L);
  let p = profil;
  for (const n of kette.slice(0, -1)) p = advanceCampaign(p, n.id);
  return p;
};

/** Kapitel komplett: Hauptast inklusive Endboss (wiederholt fuer wins>1). */
export const kapitelDurch = (profil, L) => {
  let p = bisVorEndboss(profil, L);
  const fin = kap(L).find((n) => n.final);
  for (let i = 0; i < (fin.boss?.wins || 1); i++) p = advanceCampaign(p, fin.id);
  return p;
};
