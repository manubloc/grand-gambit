import { useState, useEffect, useMemo, useRef } from "react";
import { useMedia } from "../../App.jsx";
import { GildedFrame, goldText, GoldShineButton } from "../Gilded.jsx";
import { SP_SHARD_GOLD, SP_VAULT_MIN_CLEARED, spShardCap } from "../../../meta/index.js";
import { CHARACTER_LIST, CHARACTERS, ABILITIES, TAGS, MAPS, mapById, ITEM_LIST, bossById, BOSSES } from "../../../content/index.js";
import { BASE_HP, BASE_ATK, SHIELD_HP, createGame, familyOf, crownHp, crownWallSoak, shadowRifts, shadowAtk } from "../../../core/index.js";
import {
  characterLevel, resolveCharacter, isUnlocked, upgradeCost, canUpgrade, maxLevelFor, gambitTier, clearedCount,
  formationLegalOn, formationCounts, buildArmyFromFormation, buildAiArmyForMap, ownedLeagueBosses, isBossEntry, bossEntryId,
  chosenAbilities, abilityCost, canUnlockAbility, dupeCount, RESPEC_GOLD, heroColFor, mapUnlocked,
  itemRevealed, bossWinsFor, effectiveNodeBoss, nodeStatus } from "../../../meta/index.js";
import { CAMPAIGN } from "../../../content/index.js";
import { T } from "../theme.js";
import { BASE_EN, ABILITY_COST } from "../../../core/index.js";
import { EnergyIc } from "../icons.jsx";
import { Panel, Bar, Chip, Shields, Button, Segmented, PanelTitle, FieldLabel, MapChip } from "../primitives.jsx";
import { SkillStar, GoldCoin, LockIc, BladesIc, SealIc, HeartIc } from "../icons.jsx";
import { PieceGlyph } from "../board/PieceGlyph.jsx";
import { PieceArt } from "../board/PieceArt.jsx";
import { paintedById, paintedForPiece } from "../board/paintedArt.js";
import { CoinIc, SkillIc } from "../icons.jsx";
import { ItemIcon } from "../ItemIcon.jsx";
import { BoardView } from "../board/BoardView.jsx";

const aName = (id, en) => ABILITIES[id][en ? "nameEn" : "nameDe"];

/** A painted figure, DEAD-CENTERED in its frame — tiles are not the board,
 *  so no bottom-anchoring, no hp padding, no badge chrome. */
function TileArt({ kind, size, hero = false, level = 1 }) {
  const src = paintedForPiece({ kind, color: "w", hero, level });
  return src
    ? <img src={src} alt="" draggable={false} style={{ width: size ?? "100%", height: size ?? "100%", objectFit: "contain",
        objectPosition: "center center", filter: "brightness(1.16) saturate(1.05) drop-shadow(0 2px 3px rgba(0,0,0,.6))",
        userSelect: "none", pointerEvents: "none", display: "block", flex: "none" }} />
    : <span style={{ fontSize: size * 0.8, lineHeight: 1 }}>♟</span>;
}
function Glyph({ kind, level, abilities, shield, size = 50, hero = false, art = "painted" }) {
  return <div style={{ width: size * 1.3, height: size * 1.3, display: "grid", placeItems: "center", background: T.bg2, borderRadius: 10, border: `1px solid ${T.line}`, flex: "none" }}>
    <TileArt kind={kind} size={size} hero={hero} level={level} />
  </div>;
}

function rewardLabel(r, en) {
  if (!r) return null;
  if (r.ability) return ABILITIES[r.ability].icon + " " + aName(r.ability, en);
  if (r.shield) return "+" + r.shield + (en ? " shield" : " Schild");
  return null;
}

function StatPill({ icon, val, color }) {
  // the little seals: the same deep night-blue as the Verbessern button, gold
  // rim, the SIGN keeps its meaning-color — one visual family across the card
  return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
    fontSize: 12.5, fontWeight: 900, minWidth: 58, boxSizing: "border-box",
    padding: "3px 10px", borderRadius: 999, color: "#f6e9a4",
    background: "linear-gradient(168deg, #2c4f9e 0%, #1b3068 55%, #142450 100%)",
    border: "1px solid #e3c07a", boxShadow: "0 0 8px rgba(64,110,220,.3), inset 0 1px 0 rgba(190,215,255,.28)" }}>
    <span style={{ display: "inline-flex", color }}>{icon}</span> {val}</span>;
}

// ── THE CHRONICLE: every figure of the court, its inborn moves and its whole
// ability ladder — a rulebook page, not a progression view. One law rules it:
// base moves are INBORN and never change; abilities are LEARNED by level.
const DIRS_ORTHO = JSON.stringify([[1,0],[-1,0],[0,1],[0,-1]].sort());
const DIRS_DIAG = JSON.stringify([[1,1],[1,-1],[-1,1],[-1,-1]].sort());
function describeMoves(ch, en) {
  const FIX = {
    pawn: ["Zieht ein Feld voran (zwei aus der Grundreihe), schlägt schräg nach vorn.",
           "Moves one square forward (two from home), captures diagonally forward."],
    gambit: ["Zieht wie ein Bauer — doch er ist der Feldherr: Fällt er, ist die Schlacht verloren. Seine sechs Siegel-Stufen schärfen Fähigkeiten und Rüstzeug, nie die Schrittart.",
             "Moves like a pawn — but he is the commander: lose him and the battle is lost. His six seal tiers sharpen abilities and gear, never the stride."],
    knight: ["Springt im L (zwei vor, eins zur Seite) — über alles hinweg.", "Leaps in an L (two then one) — over everything."],
    bishop: ["Gleitet diagonal, beliebig weit.", "Slides diagonally, any distance."],
    rook: ["Gleitet gerade — waagerecht und senkrecht, beliebig weit.", "Slides straight — files and ranks, any distance."],
    queen: ["Gleitet in alle acht Richtungen, beliebig weit.", "Slides in all eight directions, any distance."],
    king: ["Ein Feld in jede Richtung.", "One square in any direction."],
    archbishop: ["Läufer und Springer in einer Gestalt: diagonal gleiten oder im L springen.", "Bishop and knight in one: slide diagonally or leap the L."],
    chancellor: ["Turm und Springer in einer Gestalt: gerade gleiten oder im L springen.", "Rook and knight in one: slide straight or leap the L."],
    hawk: ["Springer-Sprung oder ein einzelner diagonaler Schritt — der wendige Flügelstürmer.", "Knight leap or a single diagonal step — the nimble flanker."],
    amazon: ["Dame und Springer zugleich — das Schwerste, was der Hof kennt.", "Queen and knight at once — the heaviest piece the court knows."],
    dragon: ["Ein 2×2-Koloss: Zu Fuß schiebt sich der ganze Block um ein Feld — kämpfen tut sein Gewicht (Trampel-Aura gegen alles am Block). Der Flug (per Fähigkeit) trägt ihn einmal pro Partie mitten ins Getümmel.",
             "A 2×2 colossus: on foot the whole block shifts one square — his weight does the fighting (trample aura against everything pressed to the block). Flight (an ability) carries him once per battle into the fray."],
  };
  if (FIX[ch.id]) return FIX[ch.id][en ? 1 : 0];
  const ms = ch.moveSpec || {};
  const parts = [];
  if (ms.slides?.length) {
    const key = JSON.stringify([...ms.slides].sort());
    const dir = key === DIRS_ORTHO ? (en ? "straight" : "gerade")
      : key === DIRS_DIAG ? (en ? "diagonally" : "diagonal")
      : (en ? "in all eight directions" : "in alle acht Richtungen");
    const r = ms.range || 99;
    parts.push(en ? `Slides ${dir}, up to ${r} square${r > 1 ? "s" : ""}` : `Gleitet ${dir}, bis zu ${r} ${r > 1 ? "Felder" : "Feld"}`);
  }
  if (ms.leaps?.length) {
    const L = ms.leaps, n = L.length;
    const allDiag1 = n === 4 && L.every(([a, b]) => Math.abs(a) === 1 && Math.abs(b) === 1);
    const diag12 = n === 8 && L.every(([a, b]) => Math.abs(a) === Math.abs(b) && Math.abs(a) <= 2);
    const ring2 = n === 16 && L.every(([a, b]) => Math.max(Math.abs(a), Math.abs(b)) === 2);
    const ortho2 = n === 4 && L.every(([a, b]) => (a === 0) !== (b === 0) && Math.max(Math.abs(a), Math.abs(b)) === 2);
    const knightL = n === 8 && L.every(([a, b]) => Math.abs(a) + Math.abs(b) === 3 && a && b);
    const what = allDiag1 ? (en ? "one square diagonally (leaping)" : "ein Feld diagonal (springend)")
      : diag12 ? (en ? "one or two squares diagonally, over pieces" : "ein bis zwei Felder diagonal, über Figuren hinweg")
      : ring2 ? (en ? "anywhere on the 2-ring around it, over pieces" : "auf den gesamten 2er-Ring, über Figuren hinweg")
      : ortho2 ? (en ? "two squares straight, over pieces" : "zwei Felder gerade, über Figuren hinweg")
      : knightL ? (en ? "the knight's L" : "im Springer-L")
      : (en ? `to ${n} fixed squares, over pieces` : `auf ${n} feste Zielfelder, über Figuren hinweg`);
    parts.push((en ? "leaps " : "springt ") + what);
  }
  if (!parts.length) return en ? "Moves as its kind." : "Zieht nach Art seiner Gattung.";
  const txt = parts.join(en ? "; " : "; ");
  return txt.charAt(0).toUpperCase() + txt.slice(1) + ".";
}

// ── MOVE VISUALISATION ───────────────────────────────────────────────────────
// Every piece's BASE stride drawn on a small board: the piece sits in the
// centre, reachable squares glow. Slides (rays) shade the whole line and mark
// their reach; leaps (fixed jumps) mark single squares. Standard kinds have no
// stored moveSpec, so we derive one from the same vectors the engine uses.
const DIRS_O = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const DIRS_D = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const DIRS_ALL = [...DIRS_O, ...DIRS_D];
const KNIGHT_L = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
function specForKind(kind, ownSpec) {
  if (ownSpec) return ownSpec;
  switch (kind) {
    case "N": return { leaps: KNIGHT_L };
    case "B": return { slides: DIRS_D, range: 99 };
    case "R": return { slides: DIRS_O, range: 99 };
    case "Q": return { slides: DIRS_ALL, range: 99 };
    case "K": return { slides: DIRS_ALL, range: 1 };
    case "A": return { slides: DIRS_D, range: 99, leaps: KNIGHT_L };
    case "C": return { slides: DIRS_O, range: 99, leaps: KNIGHT_L };
    case "H": return { leaps: [...KNIGHT_L, ...DIRS_D] };
    case "M": return { slides: DIRS_ALL, range: 99, leaps: KNIGHT_L };
    case "D": return { slides: DIRS_ALL, range: 1 };            // the block shuffles one square
    case "P": return { leaps: [[0, 1]], pawn: true };
    default: return null;
  }
}
function MoveDiagram({ kind, moveSpec }) {
  const sp = specForKind(kind, moveSpec);
  if (!sp) return null;
  const R = 3;                                     // radius → 7x7 board (fits knight L and 2-3 slides)
  const N = R * 2 + 1;
  const reach = new Map();                          // "df,dr" → "slide" | "leap"
  const rng = Math.min(sp.range || 1, R);
  for (const [df, dr] of sp.slides || [])
    for (let k = 1; k <= rng; k++) reach.set(`${df * k},${dr * k}`, "slide");
  for (const [df, dr] of sp.leaps || [])
    if (Math.abs(df) <= R && Math.abs(dr) <= R) reach.set(`${df},${dr}`, "leap");
  const cells = [];
  for (let r = R; r >= -R; r--) for (let f = -R; f <= R; f++) {
    const here = f === 0 && r === 0;
    const mark = reach.get(`${f},${r}`);
    const light = (f + r + 100) % 2 === 0;
    cells.push({ f, r, here, mark, light });
  }
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${N}, 1fr)`, gap: 1.5, width: "min(184px, 62vw)",
    padding: 5, borderRadius: 8, background: "rgba(8,12,22,.55)", border: "1px solid #ffffff10" }}>
    {cells.map((c, i) => <div key={i} style={{ aspectRatio: "1", borderRadius: 3, position: "relative",
      background: c.here ? "linear-gradient(160deg,#e7c877,#b1863c)"
        : c.mark === "slide" ? "rgba(74,163,232,.42)"
        : c.mark === "leap" ? "rgba(233,197,63,.5)"
        : c.light ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.02)",
      boxShadow: c.here ? "0 0 5px rgba(231,200,119,.7)" : c.mark ? "inset 0 0 0 1px rgba(255,255,255,.18)" : "none" }}>
      {c.here && <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center",
        fontSize: 9, fontWeight: 900, color: "#1a1206" }}>✦</span>}
    </div>)}
  </div>;
}
const MOVE_LEGEND = { de: "Blau: Gleiten · Gelb: Sprung · ✦ die Figur", en: "Blue: slide · Yellow: leap · ✦ the piece" };

function ChroniclePanel({ profile, t, en }) {
  const [openId, setOpenId] = useState(null);
  const met = new Set(profile.codex?.met || []);
  // seen = recruited OR met in battle. Base moves are only revealed once you
  // have actually LIVED the piece — recruited, or faced across the board.
  const seenChar = (ch) => isUnlocked(ch, profile) || met.has(ch.kind);
  const seenBoss = (b) => met.has("X:" + b.id) || (profile.campaign?.bribedBosses || []).includes(b.id)
    || ownedLeagueBosses(profile).includes(b.id);
  const figures = CHARACTER_LIST;
  const FAM = { golem: ["Golems", "Golems"], beast: ["Bestien", "Beasts"], serpent: ["Schlangen", "Serpents"], wraith: ["Schemen", "Wraiths"], tyrant: ["Tyrannen", "Tyrants"] };
  return <div style={{ display: "grid", gap: 8 }}>
    <div className="gg-serif" style={{ fontSize: 12.5, color: "#a9a28a", fontStyle: "italic", lineHeight: 1.5, padding: "2px 4px" }}>
      {t("chron.law")}</div>
    {figures.map((ch) => {
      const open = openId === ch.id;
      const seen = seenChar(ch);
      const rungs = ch.ladder.filter((r) => r.ability);
      return <div key={ch.id} style={{ borderRadius: 12, border: `1px solid ${open ? "#e3c07a88" : T.line}`,
        background: "linear-gradient(180deg, rgba(24,32,58,.5), rgba(12,16,30,.6))", overflow: "hidden" }}>
        <button onClick={() => seen && setOpenId(open ? null : ch.id)} style={{ display: "flex", alignItems: "center", gap: 10,
          width: "100%", padding: "8px 10px", background: "none", border: "none", cursor: seen ? "pointer" : "default", textAlign: "left" }}>
          <span style={{ width: 40, height: 50, flex: "0 0 auto", display: "grid", placeItems: "center" }}>
            {paintedById(ch.id)
              ? <img src={paintedById(ch.id)} alt="" style={{ width: 40, height: 50, objectFit: "contain", objectPosition: "bottom",
                  filter: seen ? "none" : "grayscale(1) brightness(.4)" }} />
              : <Glyph kind={ch.kind} color="w" size={30} />}
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span className="gg-quill" style={{ display: "block", fontSize: 14.5, color: seen ? T.text : "#79735f" }}>{seen ? (en ? ch.nameEn : ch.nameDe) : "???"}</span>
            {!seen && <span style={{ fontSize: 11, color: "#6c6653" }}><LockIc size={10} /> {en ? "not yet encountered" : "noch nicht begegnet"}</span>}
          </span>
          {seen && <span style={{ color: "#c9b26a", fontSize: 12 }}>{open ? "▾" : "▸"}</span>}
        </button>
        {open && seen && <div style={{ padding: "0 12px 11px", display: "grid", gap: 8 }}>
          <div>
            <div className="gg-serif" style={{ fontSize: 10.5, letterSpacing: ".12em", color: "#c9b26a", marginBottom: 3 }}>{t("chron.moves").toUpperCase()}</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.55, color: "#ddd6bd", marginBottom: 7 }}>{describeMoves(ch, en)}</div>
            <MoveDiagram kind={ch.kind} moveSpec={ch.moveSpec} />
            <div style={{ fontSize: 10, color: "#8a856f", marginTop: 4, fontStyle: "italic" }}>{en ? MOVE_LEGEND.en : MOVE_LEGEND.de}</div>
          </div>
          {rungs.length > 0 && <div>
            <div className="gg-serif" style={{ fontSize: 10.5, letterSpacing: ".12em", color: "#c9b26a", marginBottom: 4 }}>{t("chron.abilities").toUpperCase()}</div>
            <div style={{ display: "grid", gap: 6 }}>
              {rungs.map((rg) => { const ab = ABILITIES[rg.ability];
                return <div key={rg.ability} style={{ fontSize: 12, lineHeight: 1.5, color: "#c9c3aa" }}>
                  <span style={{ color: "#f6e4a8", fontWeight: 800 }}>{ab.icon} {ab[en ? "nameEn" : "nameDe"]}</span>
                  <span className="gg-serif" style={{ color: "#a9a28a", fontSize: 11 }}> · {en ? "from level" : "ab Stufe"} {rg.level}</span>
                  {" — "}{ab[en ? "descEn" : "descDe"]}</div>; })}
            </div>
          </div>}
        </div>}
      </div>; })}

    {/* ── THE BESTIARY: monsters of the rift, revealed once faced ── */}
    <div className="gg-serif" style={{ fontSize: 11, letterSpacing: ".14em", color: "#c9b26a", textTransform: "uppercase",
      marginTop: 10, marginBottom: 2, padding: "2px 4px" }}>{en ? "Bestiary" : "Bestiarium"}</div>
    {BOSSES.map((b) => {
      const open = openId === "X:" + b.id;
      const seen = seenBoss(b);
      const fam = FAM[b.art] ? (en ? FAM[b.art][1] : FAM[b.art][0]) : b.art;
      return <div key={b.id} style={{ borderRadius: 12, border: `1px solid ${open ? "#e3c07a88" : T.line}`,
        background: "linear-gradient(180deg, rgba(46,24,40,.42), rgba(14,10,18,.6))", overflow: "hidden" }}>
        <button onClick={() => seen && setOpenId(open ? null : "X:" + b.id)} style={{ display: "flex", alignItems: "center", gap: 10,
          width: "100%", padding: "8px 10px", background: "none", border: "none", cursor: seen ? "pointer" : "default", textAlign: "left" }}>
          <span style={{ width: 40, height: 50, flex: "0 0 auto", display: "grid", placeItems: "center" }}>
            {(paintedById("boss-" + b.id) || paintedById("boss-" + b.art))
              ? <img src={paintedById("boss-" + b.id) || paintedById("boss-" + b.art)} alt="" style={{ width: 40, height: 50, objectFit: "contain", objectPosition: "bottom",
                  filter: seen ? "none" : "grayscale(1) brightness(.35)" }} />
              : <span style={{ fontSize: 24, filter: seen ? "none" : "grayscale(1) brightness(.4)" }}>👁</span>}
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span className="gg-quill" style={{ display: "block", fontSize: 14.5, color: seen ? "#e7b7c9" : "#79735f" }}>{seen ? (en ? b.nameEn : b.nameDe) : "???"}</span>
            <span style={{ fontSize: 11, color: seen ? "#a98ba0" : "#6c6653" }}>{seen ? fam : (en ? "a shadow on the road" : "ein Schemen auf der Straße")}</span>
          </span>
          {seen && <span style={{ color: "#c9b26a", fontSize: 12 }}>{open ? "▾" : "▸"}</span>}
        </button>
        {open && seen && <div style={{ padding: "0 12px 11px", display: "grid", gap: 8 }}>
          <div>
            <div className="gg-serif" style={{ fontSize: 10.5, letterSpacing: ".12em", color: "#c9b26a", marginBottom: 3 }}>{t("chron.moves").toUpperCase()}</div>
            <MoveDiagram kind={null} moveSpec={b.moveSpec} />
            <div style={{ fontSize: 10, color: "#8a856f", marginTop: 4, fontStyle: "italic" }}>{en ? MOVE_LEGEND.en : MOVE_LEGEND.de}</div>
          </div>
          {(en ? b.hintEn : b.hintDe) && <div className="gg-serif" style={{ fontSize: 12, fontStyle: "italic", color: "#b7a9b2", lineHeight: 1.5 }}>„{en ? b.hintEn : b.hintDe}“</div>}
        </div>}
      </div>; })}
  </div>;
}

function CharCard({ char, profile, dispatch, t, en, onZoom, open = true, onToggle, bigArt = false }) {
  const unlocked = isUnlocked(char, profile);
  const bossNode = CAMPAIGN.find((n) => n.boss?.piece === char.id);
  const abWide = useMedia("(min-width: 680px)");

  // Locked pieces stay a MYSTERY: a grayed silhouette, the name, and only the
  // place where their boss awaits — no stats, no abilities, pure temptation.
  const epic = !!char.epic;
  if (!unlocked) {
    return (
      <Panel style={{ position: "relative", overflow: "hidden", opacity: 0.62 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, filter: "grayscale(1)" }}>
          <div style={{ width: 46, height: 48, flex: "0 0 auto", opacity: 0.75 }}>
            {/* locked pieces stay a mystery: always the plain silhouette, never the painting */}
            <PieceGlyph piece={{ kind: char.kind, color: "w", level: 1, abilities: [], used: {}, shield: 0 }} artStyle="svg" />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="gg-serif" style={{ fontSize: 16, letterSpacing: ".04em", color: T.dim }}>{en ? char.nameEn : char.nameDe}</div>
          {epic && <div style={{ fontSize: 11, color: T.gold, letterSpacing: ".04em", marginTop: 1 }}>{t("army.gambitTag")}</div>}
            {(en ? char.flavorEn : char.flavorDe) && (
              <div className="gg-serif" style={{ fontSize: 11.5, color: "#9a947f", fontStyle: "italic", marginTop: 2, lineHeight: 1.4 }}>
                „{en ? char.flavorEn : char.flavorDe}“
              </div>
            )}
            <div style={{ fontSize: 12, color: T.faint, marginTop: 3 }}>
              <LockIc size={12} /> {bossNode ? t("army.lockedBoss", { place: bossNode.place }) : t("army.locked")}
            </div>
          </div>
          <span style={{ display: "grid", placeItems: "center" }}><LockIc size={19} /></span>
        </div>
      </Panel>
    );
  }

  const level = unlocked ? characterLevel(profile, char.id) : 1;
  const chosen = chosenAbilities(profile, char.id);
  const { abilities, shield } = resolveCharacter(char, level, chosen);
  const stars = dupeCount(profile, char.id);
  const isKing = char.kind === "K";
  const maxHp = (BASE_HP[char.kind] || 1) + (level - 1) + (isKing ? 0 : shield * SHIELD_HP);
  const atk = (BASE_ATK[char.kind] || 1) + Math.floor((level - 1) / 2);
  const rungs = char.ladder.filter((r) => r.ability).map((r) => ({ level: r.level, id: r.ability }));
  const maxed = level >= maxLevelFor(char.id);
  const cost = upgradeCost(char.id, level);
  const affordable = canUpgrade(profile, char.id);


  const INK = "#cfc9b4"; // body text a notch brighter than T.dim — readability pass
  return <Panel style={{ opacity: unlocked ? 1 : 0.74, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", gap: 12, alignItems: "center", cursor: onToggle ? "pointer" : "default" }}
      onClick={onToggle ? (e) => { e.stopPropagation(); onToggle(); } : undefined}>
      {paintedById(char.id)
        ? <><img src={paintedById(char.id)} alt="" onClick={unlocked && onZoom ? (e) => { e.stopPropagation(); onZoom(char); } : undefined}
            title={unlocked && onZoom ? (en ? "Tap to enlarge" : "Antippen zum Vergrößern") : undefined}
            style={{ width: bigArt ? 144 : 86, height: bigArt ? 186 : 112, objectFit: "contain", objectPosition: "bottom",
            flex: "0 0 auto", filter: unlocked ? "drop-shadow(0 3px 5px rgba(0,0,0,.5))" : "grayscale(1) brightness(1.1)",
            opacity: unlocked ? 1 : 0.6, cursor: unlocked && onZoom ? "zoom-in" : "default" }} />
        </>
        : <Glyph kind={char.kind} level={level} abilities={unlocked ? abilities : []} shield={unlocked ? shield : 0} hero={epic} art={"painted"} size={bigArt ? 94 : 60} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8,
          paddingRight: bigArt ? 30 : 0 /* clear of the overlay close button */ }}>
          <div style={{ fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 7 }}>
            {en ? char.nameEn : char.nameDe}
            {(() => { const f = familyOf(char.kind); return f ? <span aria-hidden title={en ? FAMILIES[f].en : FAMILIES[f].de}
              style={{ width: 8, height: 8, transform: "rotate(45deg)", borderRadius: 2, flex: "0 0 auto",
                background: FAMILIES[f].color, boxShadow: `0 0 4px ${FAMILIES[f].color}88` }} /> : null; })()}
            {onToggle && <span aria-hidden style={{ fontSize: 10, color: T.faint,
              transform: open ? "rotate(90deg)" : "none", transition: "transform .15s" }}>▸</span>}
          </div>
          {unlocked
            ? <>{stars > 0 && <Chip color="#f6e9a4" bg="linear-gradient(168deg, #2c4f9e 0%, #1b3068 55%, #142450 100%)" style={{ border: "1px solid #e3c07a", boxShadow: "0 0 8px rgba(64,110,220,.3), inset 0 1px 0 rgba(190,215,255,.28)" }}>{"★".repeat(stars)}</Chip>}<Chip color={T.limeInk} bg={T.lime}>{t("army.lvl")} {level}</Chip></>
            : <Chip color={T.faint} bg={T.panel2}><LockIc size={11} /> {t("camp.challenger")}</Chip>}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center" }}>
          <StatPill icon={<HeartIc size={12} />} val={maxHp} color={T.green} />
          <StatPill icon={<BladesIc color={T.gold} size={12} />} val={atk} color={T.gold} />
          <span style={{ fontSize: 11.5, color: T.dim }}>{rungs.length} {en ? "abilities" : "Fähigkeiten"}</span>
        </div>
      </div>
    </div>
    {(en ? char.flavorEn : char.flavorDe) && (
      <div className="gg-serif" style={{ marginTop: 8, fontSize: 12, lineHeight: 1.45, color: "#b9b295",
        fontStyle: "italic", letterSpacing: ".015em" }}>
        „{en ? char.flavorEn : char.flavorDe}“
      </div>
    )}
    {open && epic && (
      <div style={{ marginTop: 7, fontSize: 11.5, lineHeight: 1.5 }}>
        <span style={{ color: T.gold, fontWeight: 700 }}>{t("army.gambitTag")}</span>{" "}
        <span style={{ color: INK }}>{t("army.gambitExplain")}</span>
      </div>
    )}
    {!unlocked && bossNode && (
      <div style={{ marginTop: 9, fontSize: 12, color: T.dim, display: "flex", alignItems: "center", gap: 6 }}>
        <BladesIc size={13} /> {t("army.lockedBoss", { place: bossNode.place })}
      </div>
    )}
    {open && unlocked && (
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "8px 10px",
        background: T.panel2, borderRadius: T.radiusSm, border: `1px solid ${T.line}` }}>
        <div style={{ flex: 1, fontSize: 12.5, color: maxed ? T.faint : T.text }}>
          {char.id === "gambit" && <span className="gg-serif" style={{ color: T.goldBright, marginRight: 8, letterSpacing: ".05em" }}>
            {"✦".repeat(gambitTier(level))} {t("army.stufe", { r: ["I", "II", "III", "IV", "V", "VI"][gambitTier(level) - 1] })}</span>}
          {(() => { // mirror of core/setup: the SAME formulas, so what you read is what you field
            const k = char.kind, kingly = k === "K" ? 2 : 1;
            const hpAt = (l) => (BASE_HP[k] || 1) + (l - 1) * kingly;
            const atkAt = (l) => (BASE_ATK[k] || 1) + Math.floor((l - 1) / 2);
            const enAt = (l) => (BASE_EN[k] || 2) + Math.floor((l - 1) / 2);
            const regen = (BASE_EN[k] || 2) >= 4;
            return <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", margin: "2px 0 9px" }}>
                {[
                  { ic: <span style={{ color: "#8fd6a0" }}>♥</span>, v: hpAt(level) },
                  { ic: <span style={{ color: "#e5975f" }}>⚔</span>, v: atkAt(level) },
                  { ic: <EnergyIc size={11} style={{ verticalAlign: 0, color: "#8ec7f2" }} />, v: <>{enAt(level)}{regen && <span style={{ color: "#9db8dd", fontWeight: 600 }}> +1/{en ? "turn" : "Zug"}</span>}</> },
                ].map((p, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4,
                    fontWeight: 800, fontSize: 12, minWidth: 58, boxSizing: "border-box",
                    padding: "3px 9px", borderRadius: 999, color: "#f6e9a4",
                    background: "linear-gradient(168deg, #2c4f9e 0%, #1b3068 55%, #142450 100%)",
                    border: "1px solid #e3c07a", boxShadow: "0 0 7px rgba(64,110,220,.28), inset 0 1px 0 rgba(190,215,255,.25)" }}>
                    {p.ic} {p.v}</span>
                ))}
              </div>
              {maxed ? t("army.maxed") : <span style={{ color: "#b9b295", display: "inline-block", lineHeight: 1.5, marginTop: 1 }}>Level {level} → {level + 1}
                <span style={{ color: "#8fd6a0" }}> · ♥+{hpAt(level + 1) - hpAt(level)}</span>
                {atkAt(level + 1) > atkAt(level) && <span style={{ color: "#e5975f" }}> · ⚔+1</span>}
                {enAt(level + 1) > enAt(level) && <span style={{ color: "#8ec7f2" }}> · <EnergyIc size={10} />+1</span>}</span>}
            </>; })()}
        </div>
        {!maxed && <button disabled={!affordable}
          onClick={() => dispatch({ type: "UPGRADE_PIECE", id: char.id })}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 15px", borderRadius: 10,
            fontFamily: "inherit", fontWeight: 800, fontSize: 13, letterSpacing: ".02em",
            cursor: affordable ? "pointer" : "default",
            // the INVERSE seal: deep night-blue, lettered in gold — nothing else looks like this
            background: affordable ? "linear-gradient(168deg, #2c4f9e 0%, #1b3068 55%, #142450 100%)" : "#1a2340",
            color: affordable ? "#f6e9a4" : "#8d94ad",
            border: `1.5px solid ${affordable ? "#e3c07a" : "#3d4666"}`,
            boxShadow: affordable ? "0 0 14px rgba(64,110,220,.4), inset 0 1px 0 rgba(190,215,255,.35)" : "none",
            animation: affordable ? "ggUpPulse 2.2s ease-in-out infinite" : "none",
            textShadow: affordable ? "0 1px 2px rgba(0,0,0,.5)" : "none" }}>
          {t("army.upgrade")} · {cost} <SkillStar size={12} /></button>}
      </div>
    )}

    {open && (() => {
      // the Gambit climbs three tiers of ten — the pip row shows the CURRENT
      // tier's ten steps; every other piece keeps its plain ten.
      const tier = char.id === "gambit" ? gambitTier(level) : 1;
      const base = (tier - 1) * 10;
      return <div style={{ display: "flex", gap: 4, marginTop: 13, marginBottom: 2 }} aria-label={t("army.lvl") + " " + level}>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} style={{ flex: 1, height: 5, borderRadius: 3,
            background: i < level - base ? `linear-gradient(90deg, ${T.lime}, ${T.gold})` : T.panel2,
            boxShadow: i < level - base ? `0 0 6px ${T.gold}66` : "none",
            border: i < level - base ? "none" : `1px solid ${T.line}` }} />
        ))}
      </div>;
    })()}
    {open && unlocked && (() => {
      // Every talent is a tile of equal height: owned ones glow in their tag
      // color behind a gold-tinted frame, purchasable ones invite with a gold
      // button, near-future ones sit dimmed — and once a talent is revealed,
      // its explanation NEVER disappears again, bought or not.
      const future = rungs.filter((rg) => level < rg.level);
      return <div style={{ display: "grid", gap: 8, marginTop: 12,
        gridTemplateColumns: abWide ? "1fr 1fr" : "1fr", alignItems: "stretch" }}>
        {rungs.map((rg) => {
          const owned = chosen.includes(rg.id);
          const reach = level >= rg.level;
          if (!reach && future.indexOf(rg) >= 2) return (
            <div key={rg.id} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              minHeight: 72, borderRadius: 12, border: `1px dashed ${T.line}`, background: "rgba(10, 14, 26, .45)",
              color: "#a9a28a", fontSize: 12 }}>
              <LockIc size={12} />
              <span className="gg-serif" style={{ letterSpacing: ".08em" }}>
                {en ? "Level" : "Stufe"} {rg.level} · {en ? "still veiled" : "noch verhüllt"}</span>
            </div>
          );
          const ab = ABILITIES[rg.id];
          const tg = (ab && TAGS[ab.tag]) || { color: T.gold, nameDe: "Talent", nameEn: "Talent" };
          if (!ab) return null;
          const price = abilityCost(rg.level);
          const can = reach && !owned && canUnlockAbility(profile, char.id, rg.id);
          return (
            <div key={rg.id} style={{ display: "flex", flexDirection: "column", gap: 6, padding: "10px 12px 9px",
              borderRadius: 12,
              border: `1px solid ${owned ? tg.color + "88" : can ? "#e3c07acc" : reach ? "#8a6d3566" : "#3d4666"}`,
              background: owned
                ? `linear-gradient(165deg, ${tg.color}16, rgba(8, 10, 20, .55))`
                : can ? "linear-gradient(165deg, rgba(101, 79, 26, .58), rgba(30, 24, 11, .8))" // ripe for the taking: lit in gold
                : reach ? `linear-gradient(165deg, rgba(43, 36, 16, .35), ${T.panel2})` : T.panel2,
              boxShadow: owned ? `0 0 12px ${tg.color}22, inset 0 0 22px rgba(0,0,0,.22)`
                : can ? "0 0 20px rgba(240,206,122,.42), inset 0 0.5px 0 rgba(255,243,196,.35)" : "none",
              animation: can ? "ggAbilityGlow 2.6s ease-in-out infinite" : "none",
              position: "relative", overflow: "hidden",
              opacity: owned || reach ? 1 : 0.84, filter: owned || reach ? "none" : "saturate(.75)" }}>
              {can && <span aria-hidden style={{ position: "absolute", inset: 0, borderRadius: 12, padding: 1.5,
                pointerEvents: "none", // the glint rides the CONTOUR only: a ring mask keeps the face clean
                background: "linear-gradient(115deg, transparent 30%, rgba(255,240,190,.5) 45%, rgba(255,251,224,.95) 50%, rgba(255,240,190,.5) 55%, transparent 70%)",
                backgroundSize: "260% 100%", animation: "ggEdgeSweep 3.2s ease-in-out infinite",
                WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                WebkitMaskComposite: "xor", mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)" }} />}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span aria-hidden style={{ width: 30, height: 30, borderRadius: 999, flex: "0 0 auto",
                  display: "grid", placeItems: "center", fontSize: 15, lineHeight: 1,
                  background: "radial-gradient(circle at 35% 30%, #2c4f9e, #142450 78%)",
                  border: `1px solid ${can ? "#e8c87d" : owned ? "#e3c07a" : "#e3c07a99"}`,
                  boxShadow: can ? "0 0 10px rgba(240,206,122,.45), inset 0 1px 0 rgba(190,215,255,.3)"
                    : owned ? `0 0 8px ${tg.color}55, inset 0 1px 0 rgba(190,215,255,.25)` : "inset 0 1px 0 rgba(190,215,255,.18)" }}>
                  {ab.icon}</span>
                <b className="gg-serif" style={{ fontSize: 13, letterSpacing: ".03em",
                  color: owned ? tg.color : can ? "#f6e4a8" : reach ? T.text : "#c9c3aa" }}>
                  {en ? ab.nameEn : ab.nameDe}</b>
                <span style={{ flex: 1 }} />
                {owned
                  ? <span aria-hidden style={{ width: 7, height: 7, transform: "rotate(45deg)", flex: "0 0 auto",
                      background: "linear-gradient(135deg, #f0d68a, #8a6d35)", boxShadow: "0 0 6px #d9b56588" }} />
                  : reach && <span style={{ display: "inline-flex", alignItems: "center", gap: 3, flex: "0 0 auto",
                      padding: "2.5px 8px", borderRadius: 999, fontSize: 11, fontWeight: 800,
                      background: can ? "linear-gradient(180deg, #f4dd92, #c9a45c)" : "rgba(10, 14, 26, .55)",
                      color: can ? "#2a1f08" : "#8d94ad",
                      border: can ? "1px solid #f6e6ae" : `1px solid ${T.line}`,
                      boxShadow: can ? "0 0 10px rgba(240,206,122,.4), inset 0 1px 0 rgba(255,250,220,.6)" : "none" }}>
                      {price} <SkillStar size={11} /></span>}
              </div>
              <div style={{ fontSize: 11.5, lineHeight: 1.55, color: can ? "#efe7c9" : owned || reach ? "#ddd6bd" : "#b5af98" }}>
                {en ? ab.descEn : ab.descDe}</div>
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <Chip color={tg.color} bg={"rgba(8, 10, 20, .68)"}>{en ? tg.nameEn : tg.nameDe}</Chip>
                {(ABILITY_COST[rg.id] ?? 0) > 0
                  ? <Chip color={"#9fd2f7"} bg={"rgba(8, 10, 20, .68)"}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                        <EnergyIc size={10} style={{ verticalAlign: 0 }} />{ABILITY_COST[rg.id]}</span></Chip>
                  : <Chip color={T.green} bg={"rgba(8, 10, 20, .68)"}>{en ? "passive" : "dauerhaft"}</Chip>}
                {!ab.live && <Chip color={T.faint} bg={"rgba(8, 10, 20, .5)"}>{en ? "soon" : "bald"}</Chip>}
                <span style={{ flex: 1 }} />
                {owned
                  ? <span className="gg-serif" style={{ fontSize: 11.5, letterSpacing: ".08em", color: "#d9b565" }}>
                      {en ? "Acquired" : "Erworben"}</span>
                  : reach
                    ? <GoldShineButton disabled={!can} style={{ fontSize: 12, padding: "6px 12px" }}
                        onClick={() => dispatch({ type: "UNLOCK_ABILITY", id: char.id, ability: rg.id })}>
                        {en ? "Acquire" : "Erwerben"}</GoldShineButton>
                    : <span className="gg-serif" style={{ fontSize: 11.5, letterSpacing: ".07em", color: "#aaa48c", paddingLeft: 6 }}>
                        {en ? "from level" : "ab Stufe"} {rg.level}</span>}
              </div>
            </div>
          );
        })}
        {chosen.length > 0 && (
          <button onClick={() => dispatch({ type: "RESPEC", id: char.id })} disabled={(profile.gold || 0) < RESPEC_GOLD}
            style={{ gridColumn: "1 / -1", justifySelf: "start", background: "none", border: "none", fontFamily: "inherit",
              cursor: "pointer", fontSize: 11.5, color: (profile.gold || 0) >= RESPEC_GOLD ? T.dim : T.faint,
              padding: "0 2px", textDecoration: "underline" }}>
            ↺ {t("army.respec", { g: RESPEC_GOLD })}
          </button>
        )}
      </div>;
    })()}
  </Panel>;
}

const SlotGlyph = ({ kind, size = 26, art = "painted" }) => (
  <span style={{ width: typeof size === "number" ? size : size, height: typeof size === "number" ? size : size,
    display: "inline-grid", placeItems: "center" }}>
    <TileArt kind={kind} size={typeof size === "number" ? size : undefined} />
  </span>
);

// Classic is fixed standard chess → only non-classic maps are editable.
const FORMATION_MAPS = MAPS; // every board is arrangeable here — even Classic. This is about the FIELD, not the ruleset (quick-play Classic keeps the fixed chess setup regardless)

function FormationEditor({ profile, dispatch, t, en }) {
  const feWide = useMedia("(min-width: 900px)");
  const pieces = CHARACTER_LIST.filter((c) => c.kind !== "P" && isUnlocked(c, profile));
  const unlockedIds = pieces.map((c) => c.id);

  const [mapId, setMapId] = useState(FORMATION_MAPS[0].id); // default: die Klassik-Karte
  const map = mapById(mapId);
  const required = map.formation.required;
  const flexNeed = map.formation.flex;
  const saved = profile.loadout.formations?.[mapId] || map.defaultFormation;

  const [draft, setDraft] = useState(saved);
  const [pick, setPick] = useState(null);
  // Load the selected map's saved formation when the map changes.
  useEffect(() => { setDraft(profile.loadout.formations?.[mapId] || mapById(mapId).defaultFormation); setPick(null); }, [mapId]); // eslint-disable-line

  const legal = formationLegalOn(draft, unlockedIds, map, ownedLeagueBosses(profile));
  const changed = JSON.stringify(draft) !== JSON.stringify(saved);
  const counts = formationCounts(draft);
  const dragonFielded = draft[0] === "dragon" || draft[draft.length - 1] === "dragon";
  const flexCount = draft.filter((id) => id != null && required[id] === undefined).length;
  // the wing eats one flex slot: show the reduced requirement so the chip stays honest

  const [dragonAsk, setDragonAsk] = useState(null); // { slot, wing } awaiting consent
  const pickerRef = useRef(null);
  const scrollToPicker = () => requestAnimationFrame(() =>
    pickerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  const setSlot = (i, id) => {
    if (id === "dragon") {
      const last = draft.length - 1;
      if (i !== 0 && i !== last) { setDragonAsk({ slot: -1 }); return; }   // -1 = "edge only" notice
      setDragonAsk({ slot: i, wing: i === 0 ? 1 : last - 1 });
      return;
    }
    setDraft((d) => {
      const n = [...d]; n[i] = id;
      // the dragon left this slot (or his wing got filled): restore the wing
      const last = n.length - 1;
      if (n[0] !== "dragon" && n[1] == null) n[1] = "knight";
      if (n[last] !== "dragon" && n[last - 1] == null) n[last - 1] = "knight";
      return n;
    });
    setPick(null);
  };
  const confirmDragon = () => {
    const { slot, wing } = dragonAsk;
    setDraft((d) => {
      const n = [...d];
      // clear a previous dragon elsewhere
      const last = n.length - 1;
      if (n[0] === "dragon" && slot !== 0) { n[0] = "knight"; if (n[1] == null) n[1] = "knight"; }
      if (n[last] === "dragon" && slot !== last) { n[last] = "knight"; if (n[last - 1] == null) n[last - 1] = "knight"; }
      n[slot] = "dragon"; n[wing] = null;
      return n;
    });
    // the Grand Gambit never falls to the wing: if his file lies under the
    // block, he steps one column aside (inward)
    const hc = heroColFor(profile, map);
    const covered = slot === 0 ? [0, 1] : [draft.length - 2, draft.length - 1];
    if (covered.includes(hc)) {
      const safe = slot === 0 ? 2 : draft.length - 3;
      dispatch({ type: "SET_HERO_COL", mapId: map.id, col: safe });
    }
    setDragonAsk(null); setPick(null);
  };
  const reqChips = Object.entries(required).map(([id, need]) => ({ id, need, have: counts[id] || 0 }));

  // Full-board live preview: exactly the starting position this formation
  // produces in a match (your side below, a standard opponent above).
  const preview = useMemo(() => {
    if (!legal) return null;
    const levelOf = map.classic ? () => 1 : (id) => characterLevel(profile, id);
    const mine = buildArmyFromFormation(levelOf, draft, map.classic ? null : (id) => chosenAbilities(profile, id), map.classic ? null : (id) => dupeCount(profile, id));
    mine.hero = { col: heroColFor(profile, map), spec: (() => {
      const lvl = map.classic ? 1 : (characterLevel(profile, "gambit") || 1);
      const r = resolveCharacter(CHARACTERS.gambit, lvl, map.classic ? null : chosenAbilities(profile, "gambit"));
      return { kind: "P", level: lvl, abilities: r.abilities, shield: r.shield, tier: gambitTier(lvl) };
    })() };
    const foe = buildAiArmyForMap("easy", map, 0);
    return createGame(mine, foe, { map, rules: "hp", seed: 1 });
  }, [draft, mapId, legal, profile]); // eslint-disable-line

  return <>
  <Panel>
    <PanelTitle style={{ marginBottom: 2 }}>{t("army.formation")}</PanelTitle>
    <div style={{ fontSize: 12, color: T.dim, marginBottom: 10 }}>{map.classic ? t("army.classicHint") : t("army.formationHint")}</div>

    {/* STACKED, not side-by-side: the intro text sits ABOVE, the formation
        gets the FULL width below — room for properly big figures */}
    <div style={{ display: "block" }}>
    <div style={{ minWidth: 0 }}>
    {preview && (
      <div style={{ marginBottom: feWide ? 0 : 12 }}>
        {/* the preview BOARD is retired here — before a match you cannot know
            the foe anyway; the board view returns as the Seeress's scout,
            right before the horn, where it actually informs a decision */}
        {(() => {
          const kin = { crown: 0, shadow: 0 };
          for (const p of preview.board) if (p && p.color === "w") { const f = familyOf(p); if (f) kin[f] += 1; }
          if (!kin.crown && !kin.shadow) return null;
          const wall = crownWallSoak(kin.crown), cHp = crownHp(kin.crown);
          const rifts = shadowRifts(kin.shadow), sAtk = shadowAtk(kin.shadow);
          const chip = (f, label) => kin[f] > 0 && (
            <span key={f} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px",
              borderRadius: 999, border: `1px solid ${FAMILIES[f].color}66`, background: `${FAMILIES[f].color}1c`,
              color: FAMILIES[f].color, fontSize: 11.5, fontWeight: 800 }}>
              <span style={{ width: 7, height: 7, transform: "rotate(45deg)", borderRadius: 2, background: FAMILIES[f].color }} />
              {(en ? FAMILIES[f].en : FAMILIES[f].de)} {kin[f]}{label ? ` · ${label}` : ""}
            </span>);
          const cParts = [wall ? `${t("army.famWall")} ${wall}` : t("army.famNeedTwo"), cHp ? `+${cHp} ♥` : null].filter(Boolean).join(" · ");
          const sParts = [rifts ? `${rifts} ⧗` : t("army.famNeedTwo"), sAtk ? `+${sAtk} ⚔` : null].filter(Boolean).join(" · ");
          return <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
            {chip("crown", cParts)}
            {chip("shadow", sParts)}
          </div>;
        })()}
        <div style={{ fontSize: 11.5, color: T.faint, marginTop: 14, marginBottom: 4, textAlign: "center" }}>{t("army.pawnSoon")}</div>
      </div>
    )}
    </div>

    <div style={{ minWidth: 0 }}>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${draft.length}, 1fr)`, gap: 3, marginBottom: 10 }}>
      {draft.map((id, i) => {
        const open = pick === i;
        // the dragon's wing: an empty square the block spills into — NOT a slot
        // you may fill. It reads as part of the dragon (a 2x2 shadow), and a tap
        // jumps to the dragon's own slot instead.
        const isWing = id == null;
        const dragonAt = draft[0] === "dragon" ? 0 : draft[draft.length - 1] === "dragon" ? draft.length - 1 : -1;
        const isDragon = id === "dragon";
        return <button key={i} onClick={() => { if (isWing) { setPick(dragonAt); scrollToPicker(); } else { setPick(open ? null : i); if (!open) scrollToPicker(); } }}
          style={{ width: "100%", aspectRatio: "5 / 6", minWidth: 0, borderRadius: 8, cursor: "pointer",
            display: "grid", placeItems: "center", fontFamily: "inherit", padding: 0, position: "relative",
            background: open || (isWing && pick === dragonAt) ? T.lime : isWing ? "rgba(120,90,190,.16)" : T.bg2,
            border: `2px solid ${open || (isWing && pick === dragonAt) ? T.lime : isDragon || isWing ? "#8a7ab8" : T.line}` }}>
          {isWing
            ? <span title={t("army.wing")} style={{ fontSize: "clamp(11px, 4vw, 18px)", opacity: 0.5, color: "#b9a6e6" }}>🜁</span>
            : isBossEntry(id)
            ? <img src={paintedById("boss-" + bossEntryId(id)) || undefined} alt="" draggable={false}
                style={{ height: "clamp(24px, 9.6vw, 78px)", objectFit: "contain", pointerEvents: "none" }} />
            : <SlotGlyph kind={CHARACTERS[id].kind} size={"clamp(21px, 9vw, 74px)"} art={"painted"} />}
          {isDragon && <span style={{ position: "absolute", bottom: 1, right: 2, fontSize: 9, fontWeight: 800,
            color: "#e9d296", textShadow: "0 1px 2px #000", pointerEvents: "none" }}>2×2</span>}
        </button>;
      })}
    </div>

    {dragonAsk && (
      <div style={{ background: T.bg2, border: `1.5px solid ${T.gold}66`, borderRadius: 10, padding: "11px 12px", marginBottom: 10 }}>
        {dragonAsk.slot === -1 ? (
          <>
            <div style={{ fontSize: 12.5, lineHeight: 1.55, color: T.text }}>{t("army.dragonEdgeOnly")}</div>
            <div style={{ marginTop: 9 }}><Button variant="subtle" onClick={() => setDragonAsk(null)}>{t("common.ok")}</Button></div>
          </>
        ) : (
          <>
            <div className="gg-serif" style={{ fontSize: 13, letterSpacing: ".08em", color: T.gold, marginBottom: 4 }}>{t("army.dragonAskTitle")}</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.55, color: T.text }}>
              {t("army.dragonAsk", { p: (() => { const w = draft[dragonAsk.wing]; const nm = w && !isBossEntry(w) ? (en ? CHARACTERS[w].nameEn : CHARACTERS[w].nameDe) : "—"; return nm; })() })}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Button variant="primary" onClick={confirmDragon}>{t("army.dragonYes")}</Button>
              <Button variant="subtle" onClick={() => setDragonAsk(null)}>{t("common.cancel")}</Button>
            </div>
          </>
        )}
      </div>
    )}
    {pick !== null && (
      <div ref={pickerRef} style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 10, padding: 8, marginBottom: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 7 }}>
          {pieces.map((c) => {
            const on = draft[pick] === c.id;
            return <button key={c.id} onClick={() => setSlot(pick, c.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 13px", borderRadius: 11, cursor: "pointer", fontFamily: "inherit",
                width: "100%", textAlign: "left",
                background: on ? T.lime : T.panel2, color: on ? T.limeInk : T.text, border: `1px solid ${on ? T.lime : T.line}` }}>
              <SlotGlyph kind={c.kind} size={52} art={"painted"} />
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontWeight: 800, fontSize: 14.5 }}>{en ? c.nameEn : c.nameDe}</span>
                <span style={{ display: "block", fontSize: 12, lineHeight: 1.45, marginTop: 2,
                  color: on ? T.limeInk : T.dim, fontStyle: "italic" }}>{en ? c.flavorEn : c.flavorDe}</span>
              </span>
            </button>;
          })}
        </div>
        {(() => {
          // league bosses — trophies of finished leagues; ONE may take the queen's place
          const owned = ownedLeagueBosses(profile);
          if (!owned.length) return null;
          const usedElsewhere = draft.some((d, j) => j !== pick && isBossEntry(d));
          return <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px dashed ${T.gold}44` }}>
            <div className="gg-serif" style={{ fontSize: 11.5, letterSpacing: ".1em", color: T.gold, marginBottom: 6 }}>
              {t("army.bossSection")}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {owned.map((bid) => {
                const b = bossById(bid);
                const eid = "boss:" + bid;
                const on = draft[pick] === eid;
                const blocked = usedElsewhere && !on;
                return <button key={bid} disabled={blocked} onClick={() => setSlot(pick, eid)}
                  title={en ? undefined : (b.aura ? t("army.bossAuraHint") : undefined)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 9,
                    cursor: blocked ? "default" : "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13, opacity: blocked ? 0.45 : 1,
                    background: on ? "#8a7ab8" : T.panel2, color: on ? "#171125" : T.text, border: `1px solid ${on ? "#8a7ab8" : T.line}` }}>
                  {paintedById("boss-" + bid) && <img src={paintedById("boss-" + bid)} alt="" style={{ height: 20, objectFit: "contain" }} />}
                  {en ? b.nameEn : b.nameDe}
                </button>;
              })}
            </div>
            <div style={{ fontSize: 10.5, color: T.faint, marginTop: 6 }}>{t("army.bossHint")}</div>
          </div>;
        })()}
      </div>
    )}

    {(
      <div style={{ margin: "2px 0 12px", padding: "10px 11px", background: T.panel2, borderRadius: T.radiusSm,
        border: `1px solid ${T.gold}44` }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 7 }}>
          <span className="gg-serif" style={{ fontSize: 12.5, letterSpacing: ".1em", color: T.gold }}>{t("army.heroPos")}</span>
          <span style={{ fontSize: 10.5, color: T.faint }}>{t("army.heroPosHint")}</span>
        </div>
        {/* the pawn rank made visible: the Grand Gambit takes one file, the rest
            are ordinary pawns. Tap a square to move the commander's start. */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${map.w}, 1fr)`, gap: 3 }}>
          {Array.from({ length: map.w }).map((_, f) => {
            const on = f === heroColFor(profile, map);
            return <button key={f} onClick={() => dispatch({ type: "SET_HERO_COL", mapId: map.id, col: f })}
              style={{ aspectRatio: "1", borderRadius: 7, cursor: "pointer", padding: 1,
                background: on ? `radial-gradient(circle at 40% 32%, ${T.gold}33, ${T.panel})` : T.panel,
                border: on ? `1.5px solid ${T.gold}` : `1px solid ${T.line}`,
                boxShadow: on ? `0 0 8px ${T.gold}55` : "none", display: "grid", placeItems: "center" }}>
              <div style={{ width: "82%", height: "82%", opacity: on ? 1 : 0.5 }}>
                <PieceArt kind="P" fill={on ? "#c9a45c" : "#8a7f63"} rim={on ? null : "#5a5238"}
                  detail={on ? "#7a5c26" : "#5a5238"} size="100%" level={1} hero={on} />
              </div>
            </button>;
          })}
        </div>
        <div style={{ fontSize: 10.5, color: T.faint, marginTop: 6, fontStyle: "italic" }}>{t("army.pawnRankNote")}</div>
      </div>
    )}

    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12, alignItems: "center" }}>
      {reqChips.map((r) => (
        <Chip key={r.id} color={r.have === r.need ? T.green : T.danger} bg={T.panel2}>
          <SlotGlyph kind={CHARACTERS[r.id].kind} size={13} art={"painted"} /> {r.have}/{r.need}
        </Chip>
      ))}
      <Chip color={flexCount === flexNeed - (dragonFielded ? 1 : 0) ? T.green : T.danger} bg={T.panel2}>{t("army.flex")} {flexCount}/{flexNeed - (dragonFielded ? 1 : 0)}</Chip>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <Button variant="primary" disabled={!legal || !changed} onClick={() => dispatch({ type: "SET_FORMATION", mapId, formation: draft })}>{t("common.save")}</Button>
      <Button variant="subtle" onClick={() => setDraft(map.defaultFormation)}>{t("army.standard")}</Button>
    </div>
    {!legal && <div style={{ fontSize: 12, color: T.danger, marginTop: 8 }}>{t("army.invalid")}</div>}
    </div>
    </div>
  </Panel>

  {/* map choice — its own strip below the box: ONE row, scroll if it must */}
  <div style={{ minWidth: 0, maxWidth: "100%" }}>
    <FieldLabel>{t("army.mapPick")}</FieldLabel>
    <div style={{ display: "flex", flexWrap: "nowrap", gap: 6, overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 10, scrollbarWidth: "thin", minWidth: 0, maxWidth: "100%" }}>
      {FORMATION_MAPS.map((m) => {
        const on = m.id === mapId;
        const open = mapUnlocked(profile, m.id);
        return <MapChip key={m.id} on={on} locked={!open} theme={m.theme}
          onClick={() => open && setMapId(m.id)}
          label={<>{open ? null : <LockIc size={11} />}{(en ? m.nameEn : m.nameDe)} · {m.w}×{m.h}</>} />;
      })}
    </div>
  </div>
  </>;
}

// Gear & supplies — its own room now (tab 2), no longer part of one long scroll.
function GearPanel({ profile, dispatch, t, en }) {
  return (
    <div style={{ background: T.panel, border: `1px solid ${T.line}`, borderRadius: T.radius, padding: "12px 14px" }}>
      <div className="gg-serif" style={{ fontSize: 12.5, letterSpacing: ".14em", color: T.dim, textTransform: "uppercase", marginBottom: 8 }}>{t("army.supplies")}</div>
      <div style={{ display: "grid", gap: 8 }}>
        {(() => {
          // Star shards: the treasury's rarest ware — skill points for gold,
          // strictly rationed: two per league the campaign has reached.
          // The vault itself is EARNED: it stays closed until the third victory.
          if (clearedCount(profile) < SP_VAULT_MIN_CLEARED) return null;
          const cap = spShardCap(profile);
          const bought = profile.spShards || 0;
          const left = Math.max(0, cap - bought);
          const can = left > 0 && (profile.gold || 0) >= SP_SHARD_GOLD;
          return <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", borderRadius: 10,
            border: "1px solid #8a6d3566", background: `linear-gradient(165deg, rgba(43, 36, 16, .4), ${T.panel2})`,
            position: "relative", overflow: "hidden" }}>
            <span aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "40%", pointerEvents: "none",
              background: "linear-gradient(90deg, transparent, rgba(255,240,190,.06), transparent)",
              animation: "ggShine 12s ease-in-out 3.4s infinite" }} />
            <span style={{ width: 24, display: "grid", placeItems: "center", position: "relative" }}><SkillStar size={22} /></span>
            <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>
                <span className="gg-serif" style={{ letterSpacing: ".04em", ...goldText }}>{en ? "Star shard" : "Sternensplitter"}</span>
                <span style={{ color: T.dim, fontWeight: 700 }}> · {bought}/{cap}</span>
              </div>
              <div style={{ fontSize: 11.5, color: T.dim, lineHeight: 1.5 }}>
                {en
                  ? `A captured spark of insight, ground into a skill point. The court keeps ${"" + 2} per league in its vault.`
                  : "Ein gebannter Funke Erleuchtung, zu einem Skillpunkt geschliffen. Der Hof verwahrt zwei je erreichter Liga."}
              </div>
            </div>
            <button onClick={() => dispatch({ type: "BUY_SP_SHARD" })} disabled={!can}
              style={{ fontFamily: "inherit", fontWeight: 900, fontSize: 12.5, borderRadius: 999, padding: "8px 13px",
                position: "relative", border: "none", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 5,
                background: can ? "linear-gradient(160deg, #f0d68a, #d9b565 55%, #b08c44)" : T.panel,
                boxShadow: can ? `0 0 12px ${T.gold}66, inset 0 1px 0 #fff6d8aa` : "none",
                color: can ? "#17110a" : T.faint, cursor: can ? "pointer" : "default",
                outline: can ? "none" : `1.5px solid ${T.line}` }}>
              {left === 0 ? (en ? "Vault empty" : "Tresor leer") : <><GoldCoin size={13} /> {SP_SHARD_GOLD}</>}
            </button>
          </div>;
        })()}
        {ITEM_LIST.filter((it) => itemRevealed(profile, it)).map((it) => {
          const owned = it.kind === "key" ? !!profile.items?.[it.id] : (profile.items?.[it.id] || 0);
          const full = it.kind === "key" ? owned : owned >= (it.max || 99);
          const can = !full && (profile.gold || 0) >= it.gold;
          return <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 24, display: "grid", placeItems: "center" }}><ItemIcon id={it.id} size={22} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800 }}>
                {en ? it.nameEn : it.nameDe}
                {it.kind === "consumable" ? <span style={{ color: T.dim, fontWeight: 700 }}> · {owned}/{it.max}</span>
                  : owned ? <span style={{ color: T.green, fontWeight: 800 }}> ✓</span> : null}
              </div>
              <div style={{ fontSize: 11.5, color: T.dim }}>{en ? it.textEn : it.textDe}</div>
            </div>
            <button onClick={() => dispatch({ type: "BUY_ITEM", id: it.id })} disabled={!can}
              style={{ fontFamily: "inherit", fontWeight: 900, fontSize: 12.5, borderRadius: 999, padding: "8px 13px",
                border: `1.5px solid ${can ? T.gold : T.line}`, background: can ? T.gold : T.panel,
                color: can ? "#17110a" : T.faint, cursor: can ? "pointer" : "default", whiteSpace: "nowrap" }}>
              {full ? (it.kind === "key" ? "✓" : t("army.full")) : <><GoldCoin size={13} /> {it.gold}</>}
            </button>
          </div>;
        })}
        {(() => {
          // the veiled remainder: one quiet row, no names, no prices — the road
          // ahead keeps its secrets until you walk it
          const hidden = ITEM_LIST.filter((it) => !itemRevealed(profile, it)).length;
          if (!hidden) return null;
          return <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.6, paddingTop: 2 }}>
            <span style={{ width: 24, display: "grid", placeItems: "center" }}><SealIc size={20} /></span>
            <div style={{ fontSize: 12, color: T.faint, fontStyle: "italic" }}
              className="gg-serif">{t(hidden === 1 ? "army.itemHidden1" : "army.itemsHidden", { n: hidden })}</div>
          </div>;
        })()}
      </div>
    </div>
  );
}

// Tap a figurine → the painting fills the stage. One tap anywhere closes it.
function CharLightbox({ char, en, onClose }) {
  if (!char) return null;
  const src = paintedById(char.id);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(5, 8, 16, .88)",
      backdropFilter: "blur(7px)", WebkitBackdropFilter: "blur(7px)", display: "grid", placeItems: "center",
      cursor: "zoom-out", padding: 20, animation: "ggFade .18s ease-out" }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        {src && <img src={src} alt="" style={{ height: "min(58vh, 470px)", maxWidth: "88vw", objectFit: "contain",
          filter: "drop-shadow(0 18px 40px rgba(0,0,0,.65))" }} />}
        <div className="gg-serif" style={{ color: T.goldBright, fontSize: 23, letterSpacing: ".06em", marginTop: 14 }}>
          {en ? char.nameEn : char.nameDe}</div>
        {(en ? char.flavorEn : char.flavorDe) && (
          <div className="gg-serif" style={{ color: "#9a947f", fontStyle: "italic", fontSize: 13.5, lineHeight: 1.5, marginTop: 6 }}>
            „{en ? char.flavorEn : char.flavorDe}“</div>
        )}
      </div>
    </div>
  );
}

// ── the three HOUSES: colors & names for badges and the muster line ──────────
const FAMILIES = {
  crown:  { de: "Kronenfiguren", en: "Crown", color: "#c9a45c" },
  shadow: { de: "Schattenwesen", en: "Shadows", color: "#8a7ab8" },
};


/** ── THE FIGURE TREE (Chronik) ──────────────────────────────────────────────
 * Every piece of the realm on one page, sorted by kin. What you see depends
 * on what you have LIVED: recruited pieces stand in gold; foes you have met
 * show their face and their tally; monsters lurking in the CURRENT league are
 * "sighted" (a dark silhouette with a name to earn); the rest is night.
 * Champions you have beaten at least once can be BRIBED — gold instead of
 * the remaining victories, the friendly duel politely skipped. */
const CROWN_IDS = ["mage","guardian","bard","paladin","inquisitor","archbishop","chancellor","engineer","standard","seeress"];
const SHADOW_IDS = ["hawk","assassin","pathfinder","dragon","sorceress","alchemist","warlock","amazon","strategist","captain"];
const COURT_IDS = ["gambit","pawn","knight","bishop","rook","queen","king"];
const FAM_LABEL = { golem: ["Golems","Golems"], beast: ["Bestien","Beasts"], serpent: ["Schlangen","Serpents"], wraith: ["Schemen","Wraiths"], tyrant: ["Tyrannen","Tyrants"] };
function CodexTree({ profile, dispatch, t, en, onZoom }) {
  const met = new Set(profile.codex?.met || []);
  const unlocked = new Set(profile.campaign?.unlocked || []);
  const league = profile.campaign?.league || 1;
  const gold = profile.gold || 0;
  // monsters currently prowling THIS league's road (rotations included)
  const sighted = useMemo(() => {
    const set = new Set();
    for (const n of CAMPAIGN) {
      const st = nodeStatus(profile, n.id);
      if (st === "locked" || st === "hidden") continue; // beyond the fog: never glimpsed
      const b = effectiveNodeBoss(n, league);
      if (b?.pure) set.add(b.pure);
    }
    return set;
  }, [profile, league]);
  const bribePrice = (ch) => Math.max(250, Math.round((ch.costValue || 320) * 0.9));
  // ── monster bribery: SOME monsters take gold — but only a lot of it, and
  // only sealed with the SACRIFICE of a recruited crown piece. Tyrants and
  // the two named finals are beyond corruption. ──
  const MONSTER_BRIBE_GOLD = 1800;
  const [sacrificeFor, setSacrificeFor] = useState(null); // bossId awaiting a crown sacrifice
  const bribedSet = new Set(profile.campaign?.bribedBosses || []);
  const ownedBossSet = new Set(ownedLeagueBosses(profile)); // beaten league tyrants fight FOR you — the tree shows them in gold
  const crownOwned = CROWN_IDS.filter((cid) => unlocked.has(cid));
  const monsterBribable = (b) => b.art !== "tyrant" && b.id !== "b23" && b.id !== "b25" && met.has("X:" + b.id) && !bribedSet.has(b.id);
  const bribeMonster = (bossId, victim) => {
    if (gold < MONSTER_BRIBE_GOLD || !unlocked.has(victim)) return;
    // formations that fielded the victim are dissolved (they fall back to default)
    const forms = { ...(profile.loadout?.formations || {}) };
    for (const k of Object.keys(forms)) if ((forms[k] || []).includes(victim)) delete forms[k];
    dispatch({ type: "REPLACE", profile: { ...profile, gold: gold - MONSTER_BRIBE_GOLD,
      loadout: { ...(profile.loadout || {}), formations: forms },
      campaign: { ...profile.campaign,
        unlocked: (profile.campaign?.unlocked || []).filter((c) => c !== victim),
        bossWins: { ...(profile.campaign?.bossWins || {}), [victim]: 0 },
        bribedBosses: [...new Set([...(profile.campaign?.bribedBosses || []), bossId])] } } });
    setSacrificeFor(null);
  };
  const bribe = (ch) => {
    const price = bribePrice(ch);
    if (gold < price) return;
    dispatch({ type: "REPLACE", profile: { ...profile, gold: gold - price,
      campaign: { ...profile.campaign, unlocked: [...new Set([...(profile.campaign?.unlocked || []), ch.id])],
        bossWins: { ...(profile.campaign?.bossWins || {}), [ch.id]: 99 } } } });
  };
  const Tile = ({ img, name, dim, dark, action, glow, origin, onOpen }) => (
    <div onClick={onOpen} style={{ position: "relative", background: T.panel2, border: `1px solid ${glow ? T.gold : T.line}`,
      borderRadius: 11, padding: "10px 7px 9px", textAlign: "center", minWidth: 0, cursor: onOpen ? "pointer" : "default",
      boxShadow: glow ? "0 0 10px rgba(240,206,122,.22)" : undefined }}>
      {origin && <span className="gg-serif" style={{ position: "absolute", top: 4, right: 6, fontSize: 8.5,
        letterSpacing: ".08em", color: T.dim }}>{origin}</span>}
      {img ? <img src={img} alt="" style={{ width: 68, height: 68, objectFit: "contain", display: "block", margin: "0 auto",
        filter: dark ? "brightness(0) opacity(.55)" : dim ? "grayscale(1) brightness(.8)" : "brightness(1.14) saturate(1.05)",
        userSelect: "none" }} />
        : <div style={{ width: 68, height: 68, display: "grid", placeItems: "center", margin: "0 auto", fontSize: 30, color: T.faint }}>?</div>}
      <div className="gg-serif" style={{ fontSize: 11.5, marginTop: 5, color: dark ? T.faint : glow ? T.goldBright : T.text,
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
      {action}
    </div>
  );
  const [detail, setDetail] = useState(null); // a tapped figure opens its FULL card (level, ladder, upgrades)
  const champTile = (cid, origin) => {
    const ch = CHARACTERS[cid]; if (!ch) return null;
    const img = paintedForPiece({ kind: ch.kind, color: "w", hero: cid === "gambit", level: characterLevel(profile, cid) || 1 });
    const own = unlocked.has(cid) || COURT_IDS.includes(cid);
    const seen = met.has(ch.kind);
    const wins = bossWinsFor(profile, cid) || 0;
    if (own) return <Tile key={cid} img={img} name={en ? ch.nameEn : ch.nameDe} glow origin={origin} onOpen={() => setDetail(cid)} />;
    if (seen || wins > 0) {
      const price = bribePrice(ch);
      return <Tile key={cid} img={img} dim name={en ? ch.nameEn : ch.nameDe} onOpen={() => setDetail(cid)}
        action={wins >= 1 ? <button onClick={(e) => { e.stopPropagation(); bribe(ch); }} disabled={gold < price}
          title={t("tree.bribeHint")}
          style={{ marginTop: 5, width: "100%", padding: "4px 4px", borderRadius: 7, fontFamily: "inherit", fontWeight: 800,
            fontSize: 10, cursor: gold >= price ? "pointer" : "default", opacity: gold >= price ? 1 : 0.45,
            background: "linear-gradient(165deg, #e0b76c, #b78d43)", border: "1px solid rgba(255,240,200,.5)", color: "#17110a" }}>
          {t("tree.bribe", { g: price })}</button> : null} />;
    }
    return <Tile key={cid} img={img} dark name={"???"} />;
  };
  const monsterTile = (b) => {
    const img = paintedById["boss-" + b.id] || paintedById["boss-" + b.art];
    const k = "X:" + b.id;
    if (bribedSet.has(b.id) || ownedBossSet.has(b.id)) return <Tile key={b.id} img={img} glow
      name={en ? b.nameEn : b.nameDe} origin={bribedSet.has(b.id) ? t("tree.allied") : t("tree.inCourt")} />;
    if (met.has(k)) {
      const can = monsterBribable(b);
      return <Tile key={b.id} img={img} dim name={en ? b.nameEn : b.nameDe}
        action={can ? (sacrificeFor === b.id
          ? <div style={{ marginTop: 5 }}>
              <div style={{ fontSize: 9.5, color: T.gold, marginBottom: 3 }}>{t("tree.pickSacrifice")}</div>
              {crownOwned.length === 0 && <div style={{ fontSize: 9.5, color: T.faint }}>{t("tree.noCrown")}</div>}
              {crownOwned.map((cid) => <button key={cid} onClick={() => bribeMonster(b.id, cid)}
                style={{ display: "block", width: "100%", marginTop: 3, padding: "3px 4px", borderRadius: 6,
                  fontFamily: "inherit", fontSize: 9.5, fontWeight: 800, cursor: "pointer",
                  background: T.panel, border: `1px solid ${T.gold}66`, color: T.gold }}>
                {en ? CHARACTERS[cid].nameEn : CHARACTERS[cid].nameDe}</button>)}
              <button onClick={() => setSacrificeFor(null)} style={{ display: "block", width: "100%", marginTop: 3,
                padding: "3px 4px", borderRadius: 6, fontFamily: "inherit", fontSize: 9.5, cursor: "pointer",
                background: "none", border: `1px solid ${T.line}`, color: T.dim }}>{t("tree.cancel")}</button>
            </div>
          : <button onClick={() => setSacrificeFor(b.id)} disabled={gold < MONSTER_BRIBE_GOLD}
              title={t("tree.monsterBribeHint")}
              style={{ marginTop: 5, width: "100%", padding: "4px 4px", borderRadius: 7, fontFamily: "inherit", fontWeight: 800,
                fontSize: 10, cursor: gold >= MONSTER_BRIBE_GOLD ? "pointer" : "default", opacity: gold >= MONSTER_BRIBE_GOLD ? 1 : 0.45,
                background: "linear-gradient(165deg, #b78de0, #7a5ab0)", border: "1px solid rgba(226,205,255,.5)", color: "#17110a" }}>
              {t("tree.bribe", { g: MONSTER_BRIBE_GOLD })}</button>) : null} />;
    }
    if (sighted.has(b.id)) return <Tile key={b.id} img={img} dark name={en ? b.nameEn : b.nameDe} origin={t("tree.sighted")} />;
    return <Tile key={b.id} img={img} dark name={"???"} />;
  };
  const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 7 };
  const H = ({ children }) => <div className="gg-serif" style={{ fontSize: 12, letterSpacing: ".12em", color: T.gold, margin: "14px 0 7px" }}>{children}</div>;
  const fams = ["golem", "beast", "serpent", "wraith", "tyrant"];
  // recruits RISE into the court — each keeps a small note of where it came from
  const crownIn = CROWN_IDS.filter((c) => unlocked.has(c));
  const shadowIn = SHADOW_IDS.filter((c) => unlocked.has(c));
  const alliedIn = BOSSES.filter((b) => bribedSet.has(b.id));
  return <div>
    <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.55, marginBottom: 4 }}>{t("tree.intro")}</div>
    <H>{t("tree.court")}</H><div style={grid}>
      {COURT_IDS.map((c) => champTile(c))}
      {crownIn.map((c) => champTile(c, t("tree.fromCrown")))}
      {shadowIn.map((c) => champTile(c, t("tree.fromShadow")))}
      {alliedIn.map(monsterTile)}
    </div>
    <H>{t("tree.crown")}</H><div style={grid}>{CROWN_IDS.filter((c) => !unlocked.has(c)).map((c) => champTile(c))}</div>
    <H>{t("tree.shadow")}</H><div style={grid}>{SHADOW_IDS.filter((c) => !unlocked.has(c)).map((c) => champTile(c))}</div>
    {fams.map((f) => { const list = BOSSES.filter((b) => b.art === f && !bribedSet.has(b.id)); return list.length
      ? <div key={f}><H>{en ? FAM_LABEL[f][1] : FAM_LABEL[f][0]}</H><div style={grid}>{list.map(monsterTile)}</div></div> : null; })}
    {detail && CHARACTERS[detail] && (
      <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, zIndex: 55, background: "rgba(4,6,10,.72)",
        display: "grid", placeItems: "center", padding: 16, animation: "fade .18s ease" }}>
        <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", width: "min(100%, 440px)",
          borderRadius: 22, overflow: "hidden", boxShadow: "0 18px 50px rgba(0,0,0,.6)",
          border: "1px solid rgba(233,210,150,.4)", animation: "rise .22s ease" }}>
          <button onClick={() => setDetail(null)} aria-label="close" style={{ position: "absolute", top: 9, right: 9, zIndex: 4,
            width: 30, height: 30, borderRadius: "50%", display: "grid", placeItems: "center", cursor: "pointer",
            background: "rgba(10,13,20,.72)", border: "1px solid rgba(233,210,150,.4)", color: "#e9d296",
            fontFamily: "inherit", fontSize: 13, lineHeight: 1 }}>✕</button>
          <div className="gg-thinbar" style={{ maxHeight: "84vh", overflowY: "auto" }}>
            <CharCard char={CHARACTERS[detail]} profile={profile} dispatch={dispatch} t={t} en={en}
              onZoom={onZoom} open bigArt />
          </div>
        </div>
      </div>
    )}
  </div>;
}

export function ArmyScreen({ profile, dispatch, t, initialTab }) {
  const [zoomChar, setZoomChar] = useState(null);
  const [openChar, setOpenChar] = useState(null); // Figuren-Akkordeon: eine Karte offen
  const en = profile.lang === "en";
  const wide = useMedia("(min-width: 900px)");
  const [tab, setTab] = useState(initialTab || "tree"); // tree (the court) first | formation | chars | gear
  // Grand Gambit LEADS the roster — he is the piece the whole tale bends around.
  const rec = CHARACTER_LIST.filter((c) => isUnlocked(c, profile)).sort((a, b) => (b.epic ? 1 : 0) - (a.epic ? 1 : 0));
  const hid = CHARACTER_LIST.filter((c) => !isUnlocked(c, profile));
  const H = ({ children }) => <div className="gg-serif" style={{ fontSize: 14, letterSpacing: ".14em",
    color: T.dim, margin: "6px 2px -4px", textTransform: "uppercase", gridColumn: wide ? "1 / -1" : undefined }}>{children}</div>;
  return <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 12, maxWidth: "100%", minWidth: 0, overflowX: "clip", paddingTop: 8 }}>
    <CharLightbox char={zoomChar} en={profile.lang === "en"} onClose={() => setZoomChar(null)} />
    {/* balance — always in sight, whatever the tab; wears the treasury's gold */}
    <GildedFrame pad="11px 16px">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span className="gg-serif" style={{ fontSize: 13, letterSpacing: ".22em", textTransform: "uppercase",
        ...goldText, filter: "drop-shadow(0 1px 1px rgba(0,0,0,.5))" }}>{t("army.balance")}</span>
      <span style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
        <span className="gg-serif" style={{ fontWeight: 500, fontSize: 21, letterSpacing: ".02em", color: T.gold, display: "inline-flex", alignItems: "center", gap: 7 }}><SkillIc size={18} /> {profile.sp || 0}</span>
        <span className="gg-serif" style={{ fontWeight: 500, fontSize: 21, letterSpacing: ".02em", color: "#e8c96a", display: "inline-flex", alignItems: "center", gap: 7 }}><CoinIc size={18} /> {profile.gold || 0}</span>
      </span>
    </div>
    </GildedFrame>
    {/* three rooms instead of one endless scroll */}
    <Segmented value={tab} onChange={setTab} options={[
      { value: "tree", label: t("army.tabTree") },
      { value: "formation", label: t("army.tabFormation") },
      { value: "gear", label: t("army.tabGear") },
      { value: "chron", label: t("army.tabChron") },
    ]} />
    {tab === "formation" && <FormationEditor profile={profile} dispatch={dispatch} t={t} en={en} />}
    {tab === "chron" && <ChroniclePanel profile={profile} t={t} en={en} />}
    {tab === "tree" && <CodexTree profile={profile} dispatch={dispatch} t={t} en={en} onZoom={setZoomChar} />}
    {tab === "gear" && <GearPanel profile={profile} dispatch={dispatch} t={t} en={en} />}
  </div>;
}
