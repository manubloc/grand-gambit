// THE CHEST, PAINTED. Every item now shows its own painting; the hand-drawn
// vector icon stays underneath as the fallback for anything not yet painted
// (today: the star compass), and the emoji beneath that. One component, so
// wherever an item appears — supply chest, battle HUD, a barred path on the
// map, the academy — it wears the same face.
import { ICON_ART } from "./art.generated.js";
import { ITEM_ART } from "./assets/items/itemArt.js";
import { ITEMS } from "../../content/index.js";

export function ItemIcon({ id, size = 22, style = null }) {
  const painted = ITEM_ART[id];
  if (painted) {
    return <img src={painted} alt="" draggable={false} decoding="async" aria-hidden="true"
      style={{ width: size, height: size, objectFit: "contain", display: "block",
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,.45))", ...style }} />;
  }
  const art = ICON_ART[id];
  if (!art) return <span style={{ fontSize: size * 0.86, ...style }}>{ITEMS[id]?.emoji || "❔"}</span>;
  return <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true"
    style={{ display: "block", filter: "drop-shadow(0 1px 1px rgba(0,0,0,.35))", ...style }}
    dangerouslySetInnerHTML={{ __html: art }} />;
}
