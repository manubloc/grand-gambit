// The chest, painted. Each item enters as its own asset (hashed by the
// build), and the drawn icon stays as the fallback for anything not yet
// painted — today that is the star compass alone.

import imgAnker from "./item-anker.webp";
import imgBergschluessel from "./item-bergschluessel.webp";
import imgBoat from "./item-boat.webp";
import imgBrieftaube from "./item-brieftaube.webp";
import imgDonnerpulver from "./item-donnerpulver.webp";
import imgGrapnel from "./item-grapnel.webp";
import imgHourglass from "./item-hourglass.webp";
import imgKamel from "./item-kamel.webp";
import imgKriegsaxt from "./item-kriegsaxt.webp";
import imgMachete from "./item-machete.webp";
import imgPotion from "./item-potion.webp";
import imgTorch from "./item-torch.webp";

export const ITEM_ART = {
  anker: imgAnker,
  bergschluessel: imgBergschluessel,
  boat: imgBoat,
  brieftaube: imgBrieftaube,
  donnerpulver: imgDonnerpulver,
  grapnel: imgGrapnel,
  hourglass: imgHourglass,
  kamel: imgKamel,
  kriegsaxt: imgKriegsaxt,
  machete: imgMachete,
  potion: imgPotion,
  torch: imgTorch,
};
