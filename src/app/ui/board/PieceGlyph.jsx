import { ABILITIES, TAGS } from "../../../content/index.js";
import { T } from "../theme.js";
import { PieceArt } from "./PieceArt.jsx";
import { BladesIc } from "../icons.jsx";
import { paintedForPiece, paintedById, paintedFitFor, CLASSIC_PAINTED, klassikFor, ENEMY_FILTER } from "./paintedArt.js";
import { carvedForPiece, carvedFitFor } from "./carvedArt.js";
import { IC_SPELLSTAR } from "../assets/icons/iconAssets.js";

// Fixed display order so the emblem row is stable as abilities are gained.
const TAG_ORDER = ["move", "ranged", "blink", "aoe", "control", "sustain", "promo"];

// A piece = a thin neon-OUTLINE silhouette whose glow grows with level, topped by
// a row of category emblems (one per distinct ability category it has — more
// abilities ⇒ more emblems), plus its exact LEVEL, its ATK (HP mode) and shield
// pips (chess mode). Player glows cyan, enemy magenta.

// Little glass orbs of life, resting on the square's lower edge — the figure
// always stands above them. Deep bottle-green glass with a bright specular
// window and a shaded floor, so each bead reads as a tiny sphere. Giants
// (>10 HP) keep a slim glass bar instead.
function HpDots({ hp, max, side = "left", palette = "life" }) {
  const ratio = Math.max(0, Math.min(1, hp / max));
  // life speaks in the old traffic tongue; ENERGY is always the same cold blue
  const [col, deep] = palette === "energy" ? ["#4aa3e8", "#123a66"]
    : ratio > 0.55 ? ["#22a763", "#0a5229"] : ratio > 0.28 ? ["#e8a33f", "#8a5312"] : ["#e6394a", "#7c1622"];
  if (max > 10) {
    // heavyweights: a vertical life column on the LEFT flank, filling bottom-up
    return <span style={{ position: "absolute", bottom: "0.07em", [side]: "-0.012em",
      display: "flex", alignItems: "flex-end", width: "max(3.5px, 0.05em)", height: "0.52em",
      background: "rgba(6,10,16,.7)", borderRadius: 99, overflow: "hidden", pointerEvents: "none",
      boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,.22), inset 0 1px 1px rgba(0,0,0,.5)" }}>
      <span style={{ display: "block", width: "100%", height: `${ratio * 100}%`, borderRadius: 99,
        background: `linear-gradient(0deg, ${deep} 0%, ${col} 62%, rgba(255,255,255,.55) 100%)`,
        boxShadow: `0 0 4px ${col}, 0 0 8px ${col}66`, transition: "height .2s ease" }} />
    </span>;
  }
  const d = Math.min(0.075, 0.5 / Math.ceil(max / 2));
  return <span style={{ position: "absolute", bottom: "0.07em", [side]: "-0.028em",
    display: "grid", gridAutoFlow: "column", gridTemplateRows: `repeat(${Math.ceil(max / 2)}, auto)`,
    gap: "0.024em", pointerEvents: "none",
    filter: "drop-shadow(0 1px 1px rgba(0,0,0,.55))" }}>
    {Array.from({ length: max }).map((_, i) => (
      // ECHTE KUGELN statt flacher Punkte: ein enges Glanzlicht oben links,
      // darunter die volle Farbe, unten der Schattenboden - und aussen ein
      // Schein, der die Perle vom Brett abhebt. Leere Perlen bleiben dunkel,
      // damit der Unterschied auf einen Blick zaehlt.
      <span key={i} style={{ width: `max(4px, ${d}em)`, height: `max(4px, ${d}em)`, borderRadius: "50%",
        background: i < hp
          ? `radial-gradient(circle at 34% 24%, #ffffff 0%, #ffffffcc 9%, ${col} 42%, ${col} 58%, ${deep} 88%, #000 100%)`
          : "radial-gradient(circle at 34% 24%, rgba(255,255,255,.1) 0%, rgba(4,6,10,.9) 62%)",
        boxShadow: i < hp
          ? `inset 0 -0.9px 1.4px ${deep}, inset 0 0.5px 0.8px rgba(255,255,255,.5), 0 0 4px ${col}, 0 0 9px ${col}77`
          : "inset 0 0 0 0.6px rgba(255,255,255,.16)",
        transition: "background .2s ease, box-shadow .2s ease" }} />
    ))}
  </span>;
}


// ── THE STAT TRIAD: three orbs anchored to the BOTTOM-LEFT corner. Life is
// always the corner stone (bottom-left); Power sits ABOVE it; Energy sits to
// the RIGHT of life. They keep a small tangential gap between them. One design,
// three colours, BOTH armies alike. Each orb GROWS with its number (two digits
// need a wider home) and grows again when the piece is pressed (focus). Rims
// run to near-black with a vivid inner colour. Numbers live inside. ──
import "@fontsource/spectral/700.css";
import { ORB_BLUE, ORB_RED } from "../assets/stat/statAssets.js";
const ORB = { power: ORB_BLUE, life: ORB_RED }; // blue = attack, red = life
function numeralStyle(px) {
  return { fontFamily: NUM_FONT, fontWeight: 700, lineHeight: 1, fontSize: px,
    color: "#FCF5E2", WebkitTextStroke: "0.018em #15120D",
    textShadow: "0 0.06em 0 rgba(255,248,226,.26)", fontVariantNumeric: "tabular-nums" };
}

// MEASURED on the artwork (144x144): the sphere's visible mass centres at
// 49.6% / 48.2% of the image — it sits a hair left and noticeably HIGH in its
// box. A numeral centred on the BOX therefore reads ~1.8% too low and 0.4%
// too far right. ORB_TRUE_CENTER pulls it back onto the sphere's real middle,
// so single digits, double digits and "+1" all sit dead centre.
const ORB_TRUE_CENTER = { x: -0.004, y: -0.018 };

const NUM_FONT = "'Spectral', Georgia, serif";

// THE SPELL STAR — the painted gold spark hovering in the seam between the
// two orbs: it burns while the piece still holds its single cast, and goes out
// the moment any talent fires (one spell per game — the star IS the ledger).
// Inline data URL like the orbs, so no cache window can ever starve the board.
function SpellStar({ size }) {
  return <img src={IC_SPELLSTAR} alt="" aria-hidden draggable={false}
    style={{ width: size, height: size, display: "block", objectFit: "contain",
      transform: "scale(1.14)", transformOrigin: "center",
      filter: "drop-shadow(0 0 4px rgba(246,222,150,.95)) drop-shadow(0 0 9px rgba(240,214,138,.5)) drop-shadow(0 1px 1px rgba(0,0,0,.6))" }} />;
}

// TWO JEWELS UNDER EVERY FIGHTER: blue attack left, red life right — the same
// diameter and the same engraved numerals the old strip carried, for both
// sides alike (the figure itself tells friend from foe).
function StatDuo({ piece, focus, shrink = 1 }) {
  const d = 0.405 * (focus ? 1.4 : 1) * shrink;  // orb diameter in em — a size up, numerals with it
  const gap = d * 0.045;                         // a hair apart — nearly kissing
  // the star promises an ACT: only castable (live) talents count — a piece
  // with purely passive gifts has nothing left to "use", so no star for it
  const spell = (piece.abilities || []).some((id) => ABILITIES[id]?.live) && Object.keys(piece.used || {}).length === 0;
  // EINE KUGEL FUER ALLE (v0.38.6): dieselbe gegossene Siegelkugel wie im
  // Hofstaat - Goldrand, Glanzlicht, Zahl geometrisch mittig. Vorher trug das
  // Brett noch die alte Bildkugel mit optischer Versatz-Korrektur, weshalb die
  // Zahl je nach Wert wanderte.
  const orb = (kind, v) => <span style={{ width: d + "em", height: d + "em", display: "grid", placeItems: "center" }}>
    <StatOrbBadge kind={kind} v={v} size={`${d}em`} num={0.58} />
  </span>;
  return <span style={{ position: "absolute", bottom: "-0.09em", left: "50%", transform: "translateX(-50%)", zIndex: 3,
    display: "inline-flex", gap: gap + "em", pointerEvents: "none" }}>
    {orb("power", piece.atk)}
    {orb("life", piece.hp)}
    {spell && <span style={{ position: "absolute", left: "50%", top: 0, transform: "translate(-50%, -58%)" }}>
      <SpellStar size={d * 0.72 + "em"} />
    </span>}
  </span>;
}

// bare jewel sphere as an ICON — replaces the old sword/heart/bolt glyphs
export function JewelIc({ kind, size = 13 }) {
  return <span aria-hidden style={{ width: size, height: size, display: "inline-block", verticalAlign: "-0.15em",
    backgroundImage: `url(${ORB[kind]})`, backgroundSize: "100% 100%" }} />;
}

// px-based jewel badge for sheets & the court roster — the separately cut orbs.
export function StatOrbBadge({ kind, v, size = 26, num = 0.58 }) {
  // NEU GEGOSSEN (v0.38.1): weg von der geschnitzten Grafik mit versenkter
  // Zahl - hin zum SIEGEL-STIL der Schatzkammer: satte Kugel im Farbverlauf,
  // ein feiner GOLDRAND wie an jedem Wappen des Hauses, Glanzlicht oben, und
  // die Zahl WEISS und fett mit dunklem Kern - endlich klar lesbar.
  const chars = String(v ?? "").length;
  const fs = size * num * (chars >= 3 ? 0.8 : chars === 2 ? 0.9 : 1);
  // ZIFFERN NEU GESETZT (v0.47): Georgia bringt MEDIAEVALZIFFERN mit - 3, 4,
  // 5, 7, 9 haengen unter die Grundlinie, 6 und 8 ragen hoch. In einer Kugel
  // wirkt das wie ein Wackeln, obwohl der Textkasten mittig sitzt (gemessen:
  // Versatz dy = 0). Jetzt der System-Sans mit LINIENDEN, TABELLARISCHEN
  // Ziffern: gleiche Hoehe, gleiche Breite, jede Zahl steht ruhig - und eine
  // Stufe groesser, weil Sans-Ziffern schmaler bauen als Antiqua.
  // DUNKLER GEGOSSEN (v0.38.4): die satten Toene sprangen im Kampf zu sehr
  // an - eine Stufe tiefer, damit die Kugeln zum Brett gehoeren statt es zu
  // uebertoenen. Der Goldrand haelt sie trotzdem klar abgesetzt.
  const [c0, c1, c2] = kind === "life"
    ? ["#e0616f", "#a81a2a", "#3d0810"]
    : ["#6aa8d8", "#1f5e9e", "#08203c"];
  const rid = "sob-" + kind + "-" + String(size).replace(/[^a-z0-9]/gi, "");
  const schein = kind === "life"
    ? "drop-shadow(0 0 3px rgba(230,57,74,.7)) drop-shadow(0 1px 1.5px rgba(0,0,0,.55))"
    : "drop-shadow(0 0 3px rgba(74,163,232,.7)) drop-shadow(0 1px 1.5px rgba(0,0,0,.55))";
  return <span style={{ position: "relative", width: size, height: size, display: "grid", placeItems: "center",
    flex: "0 0 auto", filter: schein }}>
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id={rid} cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor={c0} /><stop offset="52%" stopColor={c1} /><stop offset="100%" stopColor={c2} />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="11" fill={`url(#${rid})`} />
      <circle cx="12" cy="12" r="11" fill="none" stroke="#e3c07a" strokeWidth="1.1" opacity=".95" />
      <circle cx="12" cy="12" r="9.9" fill="none" stroke="#6f5526" strokeWidth=".7" opacity=".55" />
      <ellipse cx="9.2" cy="7.4" rx="4.6" ry="3" fill="rgba(255,255,255,.3)" />
      <text x="12" y="12" textAnchor="middle" dominantBaseline="central"
        fontFamily='ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
        fontWeight="800" fontSize={24 * num * (chars >= 3 ? 0.82 : chars === 2 ? 0.94 : 1.06)}
        fill="#ffffff" stroke="rgba(0,0,0,.62)" strokeWidth=".8" paintOrder="stroke"
        style={{ userSelect: "none", fontVariantNumeric: "tabular-nums lining-nums",
          fontFeatureSettings: '"tnum" 1, "lnum" 1' }}>{v}</text>
    </svg>
  </span>;
}

// Exported: the CELL renders this now (BoardView), anchored to the SQUARE —
// not to the piece's own em-box, whose size varies per figure (pawn 0.98em,
// court 1.16em, dragon 1.48em) and silently shifted the orbs up and down.
// Only the 2x2 dragon overlay still draws its own (no cell to sit in).
export function StatTriad({ piece, focus, shrink = 1 }) {
  // the board wears the DUO now: blue attack + red life, spell star between
  return <StatDuo piece={piece} focus={focus} shrink={shrink} />;
}

export function PieceGlyph({ piece, showLevel = true, pov = "w", artStyle = "painted", focus = false, big = false }) {
  if (!piece) return null;
  const white = piece.color === "w";
  const neon = white ? T.lime : T.magenta; // badge/frame color per faction
  // Grand Gambit faction colors: the player is antique gold, the enemy deep navy.
  const fill = white ? "#c9a45c" : "#1a2233";
  // A CONTOUR ON BOTH SIDES. Gold pieces used to carry no edge at all, so on a
  // light square they melted into it; the enemy's hairline was too thin to help
  // on a dark one. Now each side wears its OPPOSITE: near-black around the gold
  // (7.8:1 against its own fill, 7.4:1 against a light square) and near-white
  // around the navy (12.4:1 and 6.6:1). The stroke is painted UNDER the fill,
  // so it sharpens the outline without eating any detail.
  const rim = white ? "#1b1408" : "#dbe4f5";
  const rimW = 1.6;
  const detail = white ? "#7a5c26" : "#8fa0bb";
  const accent = piece.accent || T.gold;
  const lvl = piece.level || 1;
  const hpMode = piece.atk != null;
  // A master stands in the QUEEN'S PLACE — that is a matter of formation, not
  // of disguise. He shows his true face to both sides: the whole point of
  // meeting a champion is SEEING whom you face.
  const isBoss = !!piece.bossId;
  const paintPiece = piece;
  // The Grand Gambit wears his crest openly — unless Masquerade is learned:
  // then only his OWN commander (pov) still sees who he is.
  const showHero = !!piece.hero && (piece.color === pov || !(piece.abilities || []).includes("gambit_masquerade"));

  // Ability dots (right rail): sorted by tag for a stable column; once-spent
  // talents fade to ash so a glance tells you what is left in the tank.
  const abilityDots = (piece.abilities || [])
    .map((id) => ABILITIES[id]).filter(Boolean)
    .sort((x, y) => TAG_ORDER.indexOf(x.tag) - TAG_ORDER.indexOf(y.tag))
    .slice(0, 6)
    .map((ab) => ({ id: ab.id, color: (TAGS[ab.tag] || { color: T.gold }).color, spent: !!(ab.once && piece.used?.[ab.id]) }));

  // Crisp, modern: a short drop shadow for depth — no neon bloom. The risen
  // Gambit (Stufe II-VI) carries a quiet golden aura on top — OWN side only;
  // the opponent always sees the plain hero. The glow deepens per tier.
  const heroTier = piece.hero && white ? Math.min(6, piece.tier || 1) : 1;
  const AURA = [
    "", // tier 1: plain
    "drop-shadow(0 0 6px rgba(240,214,138,.38))",
    "drop-shadow(0 0 5px rgba(240,214,138,.5)) drop-shadow(0 0 11px rgba(240,214,138,.28))",
    "drop-shadow(0 0 6px rgba(240,214,138,.58)) drop-shadow(0 0 13px rgba(240,214,138,.34))",
    "drop-shadow(0 0 7px rgba(240,214,138,.66)) drop-shadow(0 0 15px rgba(240,214,138,.4))",
    "drop-shadow(0 0 8px rgba(246,224,150,.74)) drop-shadow(0 0 18px rgba(240,214,138,.46))",
  ];
  // POWER READS AS LIGHT: the mightier the piece, the brighter and shinier.
  // King > queen > masters-in-the-queen's-place > everyone else > pawns. The
  // king's portrait is painted far darker than the queen's (measured: median
  // 32 against her 58), so he needs a heavier hand to stand beside her. The
  // Gambit is a pawn — painted as dark as one — but he GLEAMS: a quiet sheen
  // even at tier one (gold for your own, cold steel for a foe's), beneath the
  // tier aura that grows with his rank.
  const isKing = !piece.hero && !isBoss && piece.kind === "K";
  const isQueen = !piece.hero && !isBoss && piece.kind === "Q";
  const isPawn = !piece.hero && !isBoss && piece.kind === "P";
  const royal = isKing || isQueen || isBoss;
  const ROYAL_HALO = white
    ? (isKing ? "drop-shadow(0 0 6px rgba(248,228,158,.64)) drop-shadow(0 0 16px rgba(240,214,138,.4))"
              : "drop-shadow(0 0 5px rgba(246,224,150,.5)) drop-shadow(0 0 12px rgba(240,214,138,.3))")
    : (isKing ? "drop-shadow(0 0 6px rgba(196,181,253,.54)) drop-shadow(0 0 16px rgba(139,92,246,.34))"
              : "drop-shadow(0 0 5px rgba(196,181,253,.42)) drop-shadow(0 0 12px rgba(139,92,246,.26))");
  const HERO_SHEEN = white
    ? "drop-shadow(0 0 5px rgba(240,214,138,.45)) drop-shadow(0 0 10px rgba(240,214,138,.22))"
    : "drop-shadow(0 0 5px rgba(196,181,253,.42)) drop-shadow(0 0 10px rgba(139,92,246,.24))";
  // Der Saum folgt der Silhouette: erste Stufe schmal und hell (die Kante),
  // die weiteren breiter und schwaecher (das Abklingen ins Violett). Die
  // EIGENEN glimmen nur leise golden, die Gegner tragen den Riss - und beim
  // Auswaehlen glimmt die Figur deutlich auf.
  // EINE KONTUR, KEIN NEBEL: zwei enge Schatten statt dreier weiter - das
  // Licht liegt AUF der Silhouette, frisst kein halbes Feld und kostet die
  // Haelfte an Rechenzeit.
  const kante = (r, g2, b2, staerke = 1) =>
    `drop-shadow(0 0 1px rgba(${r},${g2},${b2},${(1 * staerke).toFixed(2)})) `
    + `drop-shadow(0 0 2.5px rgba(${r},${g2},${b2},${(0.5 * staerke).toFixed(2)}))`;
  const gewaehlt = !!piece.selected;
  // v0.71.14 (Besitzer): DIE FIGUR DES LETZTEN ZUGES zuckt einmal auf und
  // glimmt langsam aus - Gegner im Riss-Violett, eigene im Gold. Nur DIESE
  // eine Figur, sonst wird der Schirm unruhig.
  const zuletzt = !!piece.justMoved;
  /* v1.0.11 (Besitzer): ALLE Figuren leuchten auf KOENIGS-Mass — eigene
     deutlich goldener, der Gegner heller und kraeftiger im Riss-Violett
     (184,146,255 statt 150,105,255). Der Koenig behaelt sein ROYAL_HALO
     obenauf und bleibt so die Spitze des Massstabs. */
  const SIDE_GLOW = white
    ? kante(240, 214, 138, gewaehlt ? 1.0 : 0.55)
      + " drop-shadow(0 0 5px rgba(246,224,150,.5)) drop-shadow(0 0 12px rgba(240,214,138,.3))"
    : kante(184, 146, 255, gewaehlt ? 1.1 : 0.85)
      + " drop-shadow(0 0 5px rgba(214,196,255,.55)) drop-shadow(0 0 12px rgba(168,130,255,.34))";
  const klassisch = artStyle === "classic";
  // v0.71.14: alle Figuren minimal aufgehellt und kontrastreicher; die
  // Gegenseite traegt DIESELBE Kunst, nur eine Spur dunkler - die Trennung
  // leisten Goldschein (eigene) und Riss-Violett (Gegner).
  const tonung = white ? "brightness(1.10) contrast(1.10) saturate(1.04)"
                       : "brightness(0.94) contrast(1.12) saturate(0.98)";
  const glow = klassisch
    ? "drop-shadow(0 2px 3px rgba(0,0,0,.55))"     // nur ein ehrlicher Schatten
    : tonung + " drop-shadow(0 2px 3px rgba(0,0,0,.65))"
    + " " + SIDE_GLOW
    + (AURA[heroTier - 1] ? " " + AURA[heroTier - 1] : "")
    + (piece.hero ? " " + HERO_SHEEN : "")
    + (royal ? " " + ROYAL_HALO : "");
  // v0.71.1: klassische Figuren einen Hauch kleiner (Besitzer: "noch etwas zu gross")
  const pieceSize = isBoss ? "1.14em" /* v0.71.12: Bosse stehen groesser - der Waechter war kaum zu erkennen */
    : klassisch ? "0.9em" : hpMode && piece.maxHp > 0 ? "0.99em" : "1.0em";

  // Resolve the painting up-front (if any) so we can level its base width. The
  // enemy's gallery is turned to steel; the risen Gambit wears his tier portrait.
  // The carved set only covers the six basic ranks; anything it has no figure
  // for (court, bosses, the risen Gambit) drops through to the gallery, so the
  // style switch never leaves a square empty.
  // v0.71.14 (Besitzer): der Leuchtstil ist fort - UEBERALL dieselben Figuren.
  const carving = artStyle === "carved" ? carvedForPiece(paintPiece) : null;
  const painting = carving
    ? carving
    : artStyle === "classic"
    ? (klassikFor(paintPiece) || CLASSIC_PAINTED[paintPiece.kind] || paintedForPiece(paintPiece))
    : (artStyle === "painted" || artStyle === "carved")
    ? ((heroTier >= 2 && paintedById("gambit-t" + heroTier)) || paintedForPiece(paintPiece))
    : null;
  // every painting fitted to one box (uniform height) and dropped onto one
  // baseline; big pieces and the drawn SVG opt out. The carvings were already
  // cropped and levelled at build time, so they need no per-file fit.
  const fit = (painting && !big) ? (carving ? carvedFitFor(paintPiece) : paintedFitFor(paintPiece)) : { h: 1, y: 0 };

  return (
    <div style={{ position: "relative", width: "1em", height: "1em", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: big ? "center" : "flex-end",
      paddingBottom: big ? 0 : "0.015em",
      animation: zuletzt ? `${white ? "ggGoldBlitz" : "ggRissBlitz"} 2.6s ease-out both, pop .18s ease` : "pop .18s ease",
      boxSizing: "border-box" }}>

      {/* the head may rise above the square: the art gets MORE than the tile.
          A big piece (the 2x2 dragon) fills its whole block, centred. The scale
          levels each figure's base to one width, anchored at the foot so the
          base stays planted on the square. */}
      <div style={{ position: "relative", zIndex: 1, width: big ? "1.48em" : pieceSize, height: big ? "1.48em" : "calc(" + pieceSize + " * 1.16)", filter: glow, flex: "0 0 auto",
        marginTop: big ? 0 : "-0.16em",
        // the horizontal nudge re-centres each painting: its subject sits a
        // touch off the image middle (measured per file), and scaling would
        // otherwise push that bias outward — so we pull it back by x·h.
        transform: (fit.h !== 1 || fit.y !== 0 || fit.x) ? `translate(${(-(fit.x || 0) * fit.h).toFixed(4)}em, ${fit.y}em) scale(${fit.h})` : undefined, transformOrigin: "50% 100%" }}>
        {painting
          ? <img src={painting} alt="" draggable={false} decoding="async" style={{ width: "100%", height: "100%",
              // the gallery hangs in a dim hall — lift the paintings a step:
              // your golden court shines brighter, the steel foe a touch too
              objectFit: "contain", objectPosition: big ? "center" : "center bottom",
              // A CARVING BRINGS ITS OWN COLOUR. The navy team and the cream
              // team are two separate cuts of stone (tools/carve-light.py), so
              // neither the gold lift nor the steel filter may touch them —
              // both would repaint the inlaid gold. Only the rank gets a
              // whisper of light, so kings and queens still read first.
              filter: klassisch
                // der klassische Satz bringt seine beiden Farben schon mit -
                // kein Umfaerben, nur ein Hauch Licht fuer die Grossen
                ? (isKing ? "brightness(1.08)" : isQueen ? "brightness(1.04)" : "none")
                : carving
                ? (isKing ? "brightness(1.12)" : isQueen ? "brightness(1.06)" : "none")
                : white
                ? (isKing ? "brightness(2.1) saturate(1.24) hue-rotate(8deg)"
                  : isQueen ? "brightness(1.62) saturate(1.24) hue-rotate(8deg)"
                  : isBoss ? "brightness(1.62) saturate(1.24) hue-rotate(8deg)"
                  : piece.hero ? "brightness(1.12) saturate(1) hue-rotate(8deg)"
                  : isPawn ? "brightness(0.97) saturate(0.82) hue-rotate(8deg)"
                  : "brightness(1.32) saturate(1.02) hue-rotate(8deg)")
                : ENEMY_FILTER + (isKing ? " brightness(1.85) saturate(1.2)"
                  : isQueen ? " brightness(1.42) saturate(1.18)"
                  : isBoss ? " brightness(1.42) saturate(1.18)"
                  : piece.hero ? " brightness(1)"
                  : isPawn ? " brightness(0.9) saturate(0.8)"
                  : " brightness(1.16) saturate(0.98)"),
              userSelect: "none", pointerEvents: "none" }} />
          : <PieceArt kind={piece.kind} fill={fill} rim={rim} rimW={rimW} detail={detail} accent={accent} size="100%" level={showLevel ? lvl : 1} art={piece.art} bossId={piece.bossId} hero={showHero} />}
      </div>

      {/* the twin gauges: LIFE bubbles on the left flank, ENERGY bubbles on the
          right — same jewel language, only the cold blue tells them apart.
          Level, strike and every richer detail live in the tap-to-inspect sheet. */}
      {big && hpMode && piece.maxHp > 0 && <StatTriad piece={piece} focus={focus} shrink={0.98 / 1.48} />}


      {!hpMode && piece.shield > 0 && (
        <span style={{ position: "absolute", bottom: "-0.02em", right: "-0.04em", display: "flex", gap: "0.05em" }}>
          {Array.from({ length: Math.min(piece.shield, 4) }).map((_, i) => (
            <span key={i} style={{ width: "max(4px,0.1em)", height: "max(4px,0.1em)", borderRadius: "50%",
              background: T.blue, boxShadow: "0 1px 2px rgba(0,0,0,.6)" }} />
          ))}
        </span>
      )}
    </div>
  );
}
