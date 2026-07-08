// Hand-drawn item icons (assets/icons/*.svg) in the game palette —
// replaces the mismatched emoji look. Falls back to the emoji if an
// icon file is ever missing.
import { ICON_ART } from "./art.generated.js";
import { ITEMS } from "../../content/index.js";

export function ItemIcon({ id, size = 22, style = null }) {
  const art = ICON_ART[id];
  if (!art) return <span style={{ fontSize: size * 0.86, ...style }}>{ITEMS[id]?.emoji || "❔"}</span>;
  return <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true"
    style={{ display: "block", filter: "drop-shadow(0 1px 1px rgba(0,0,0,.35))", ...style }}
    dangerouslySetInnerHTML={{ __html: art }} />;
}
