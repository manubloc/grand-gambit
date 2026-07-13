import { useState, useEffect, useMemo } from "react";
import { useMedia } from "../../App.jsx";
import { GildedFrame, goldText } from "../Gilded.jsx";
import { SP_SHARD_GOLD, spShardCap } from "../../../meta/index.js";
import { CHARACTER_LIST, CHARACTERS, ABILITIES, TAGS, MAPS, mapById, ITEM_LIST } from "../../../content/index.js";
import { BASE_HP, BASE_ATK, SHIELD_HP, createGame } from "../../../core/index.js";
import {
  characterLevel, resolveCharacter, isUnlocked, upgradeCost, canUpgrade, MAX_PIECE_LEVEL,
  formationLegalOn, formationCounts, buildArmyFromFormation, buildAiArmyForMap,
  chosenAbilities, abilityCost, canUnlockAbility, dupeCount, RESPEC_GOLD, heroColFor, mapUnlocked,
  itemRevealed,
} from "../../../meta/index.js";
import { CAMPAIGN } from "../../../content/index.js";
import { T } from "../theme.js";
import { Panel, Bar, Chip, Shields, Button, Segmented, PanelTitle, FieldLabel, MapChip } from "../primitives.jsx";
import { SkillStar, GoldCoin, LockIc, BladesIc, SealIc, HeartIc } from "../icons.jsx";
import { PieceGlyph } from "../board/PieceGlyph.jsx";
import { PieceArt } from "../board/PieceArt.jsx";
import { paintedById } from "../board/paintedArt.js";
import { ItemIcon } from "../ItemIcon.jsx";
import { BoardView } from "../board/BoardView.jsx";

const aName = (id, en) => ABILITIES[id][en ? "nameEn" : "nameDe"];

function Glyph({ kind, level, abilities, shield, size = 36, hero = false, art = "painted" }) {
  return <div style={{ fontSize: size, width: "1.3em", height: "1.3em", display: "grid", placeItems: "center", background: T.bg2, borderRadius: 10, border: `1px solid ${T.line}`, flex: "none" }}>
    <PieceGlyph piece={{ kind, color: "w", level, abilities, shield, used: {}, hero }} artStyle={art} />
  </div>;
}

function rewardLabel(r, en) {
  if (!r) return null;
  if (r.ability) return ABILITIES[r.ability].icon + " " + aName(r.ability, en);
  if (r.shield) return "🛡 +" + r.shield + (en ? " shield" : " Schild");
  return null;
}

function StatPill({ icon, val, color }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 900, color }}>{icon} {val}</span>;
}

function CharCard({ char, profile, dispatch, t, en, onZoom }) {
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
  const maxed = level >= MAX_PIECE_LEVEL;
  const cost = upgradeCost(char.id, level);
  const affordable = canUpgrade(profile, char.id);


  const INK = "#cfc9b4"; // body text a notch brighter than T.dim — readability pass
  return <Panel style={{ opacity: unlocked ? 1 : 0.74, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {paintedById(char.id)
        ? <img src={paintedById(char.id)} alt="" onClick={unlocked && onZoom ? () => onZoom(char) : undefined}
            title={unlocked && onZoom ? (en ? "Tap to enlarge" : "Antippen zum Vergrößern") : undefined}
            style={{ width: 62, height: 80, objectFit: "contain", objectPosition: "bottom",
            flex: "0 0 auto", filter: unlocked ? "drop-shadow(0 3px 5px rgba(0,0,0,.5))" : "grayscale(1) brightness(1.1)",
            opacity: unlocked ? 1 : 0.6, cursor: unlocked && onZoom ? "zoom-in" : "default" }} />
        : <Glyph kind={char.kind} level={level} abilities={unlocked ? abilities : []} shield={unlocked ? shield : 0} hero={epic} art={profile.pieceArt || "painted"} size={44} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div style={{ fontWeight: 800 }}>{en ? char.nameEn : char.nameDe}</div>
          {unlocked
            ? <>{stars > 0 && <Chip color={"#17110a"} bg={T.gold}>{"★".repeat(stars)}</Chip>}<Chip color={T.limeInk} bg={T.lime}>{t("army.lvl")} {level}</Chip></>
            : <Chip color={T.faint} bg={T.panel2}><LockIc size={11} /> {t("camp.challenger")}</Chip>}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 6, alignItems: "center" }}>
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
    {epic && (
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
    {unlocked && (
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "8px 10px",
        background: T.panel2, borderRadius: T.radiusSm, border: `1px solid ${T.line}` }}>
        <div style={{ flex: 1, fontSize: 12.5, color: maxed ? T.faint : T.text }}>
          {maxed ? t("army.maxed") : <>Level {level} → {level + 1}</>}
        </div>
        {!maxed && <Button variant={affordable ? "primary" : "subtle"} disabled={!affordable}
          style={{ padding: "8px 14px", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}
          onClick={() => dispatch({ type: "UPGRADE_PIECE", id: char.id })}>
          {t("army.upgrade")} · {cost} <SkillStar size={12} /></Button>}
      </div>
    )}

    <div style={{ display: "flex", gap: 4, marginTop: 9 }} aria-label={t("army.lvl") + " " + level}>
      {Array.from({ length: MAX_PIECE_LEVEL }).map((_, i) => (
        <span key={i} style={{ flex: 1, height: 5, borderRadius: 3,
          background: i < level ? `linear-gradient(90deg, ${T.lime}, ${T.gold})` : T.panel2,
          boxShadow: i < level ? `0 0 6px ${T.gold}66` : "none",
          border: i < level ? "none" : `1px solid ${T.line}` }} />
      ))}
    </div>
    {unlocked && (() => {
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
              color: T.faint, fontSize: 12 }}>
              <LockIc size={12} />
              <span className="gg-serif" style={{ letterSpacing: ".08em" }}>
                {en ? "Level" : "Stufe"} {rg.level} · {en ? "still veiled" : "noch verhüllt"}</span>
            </div>
          );
          const ab = ABILITIES[rg.id], tg = TAGS[ab.tag];
          const price = abilityCost(rg.level);
          const can = reach && !owned && canUnlockAbility(profile, char.id, rg.id);
          return (
            <div key={rg.id} style={{ display: "flex", flexDirection: "column", gap: 6, padding: "10px 12px 9px",
              borderRadius: 12,
              border: `1px solid ${owned ? tg.color + "88" : reach ? "#8a6d3566" : T.line}`,
              background: owned
                ? `linear-gradient(165deg, ${tg.color}16, rgba(8, 10, 20, .55))`
                : reach ? `linear-gradient(165deg, rgba(43, 36, 16, .35), ${T.panel2})` : T.panel2,
              boxShadow: owned ? `0 0 12px ${tg.color}22, inset 0 0 22px rgba(0,0,0,.22)` : "none",
              opacity: owned || reach ? 1 : 0.66, filter: owned || reach ? "none" : "saturate(.55)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 15, lineHeight: 1 }}>{ab.icon}</span>
                <b style={{ fontSize: 12.5, letterSpacing: ".01em", color: owned ? tg.color : reach ? T.text : T.dim }}>
                  {en ? ab.nameEn : ab.nameDe}</b>
                <span style={{ flex: 1 }} />
                {owned && <span aria-hidden style={{ width: 7, height: 7, transform: "rotate(45deg)", flex: "0 0 auto",
                  background: "linear-gradient(135deg, #f0d68a, #8a6d35)", boxShadow: "0 0 6px #d9b56588" }} />}
              </div>
              <div style={{ fontSize: 11.5, lineHeight: 1.55, color: owned || reach ? INK : T.dim }}>
                {en ? ab.descEn : ab.descDe}</div>
              <div style={{ flex: 1 }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <Chip color={tg.color} bg={"rgba(8, 10, 20, .5)"}>{en ? tg.nameEn : tg.nameDe}</Chip>
                <Chip color={ab.once ? T.gold : T.green} bg={"rgba(8, 10, 20, .5)"}>
                  {ab.once ? (en ? "once" : "einmalig") : (en ? "passive" : "dauerhaft")}</Chip>
                {!ab.live && <Chip color={T.faint} bg={"rgba(8, 10, 20, .5)"}>{en ? "soon" : "bald"}</Chip>}
                <span style={{ flex: 1 }} />
                {owned
                  ? <span className="gg-serif" style={{ fontSize: 11.5, letterSpacing: ".08em", color: "#d9b565" }}>
                      {en ? "Acquired" : "Erworben"}</span>
                  : reach
                    ? <button onClick={() => dispatch({ type: "UNLOCK_ABILITY", id: char.id, ability: rg.id })} disabled={!can}
                        style={{ fontFamily: "inherit", fontWeight: 800, fontSize: 12, borderRadius: 999, padding: "6px 12px",
                          display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
                          cursor: can ? "pointer" : "default", border: `1.5px solid ${can ? "#e3c07a" : T.line}`,
                          background: can ? "linear-gradient(170deg, #e9cf8a, #c9a45c)" : T.panel,
                          color: can ? "#17110a" : T.faint }}>
                        {en ? "Acquire" : "Erwerben"} · {price} <SkillStar size={12} /></button>
                    : <span className="gg-serif" style={{ fontSize: 11.5, letterSpacing: ".06em", color: T.faint }}>
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
  <span style={{ fontSize: size, width: "1em", height: "1em", display: "inline-grid", placeItems: "center" }}>
    <PieceGlyph piece={{ kind, color: "w", level: 1, abilities: [], used: {}, shield: 0 }} artStyle={art} />
  </span>
);

// Classic is fixed standard chess → only non-classic maps are editable.
const FORMATION_MAPS = MAPS; // Klassik zuerst — sie ist die Referenz

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

  const legal = formationLegalOn(draft, unlockedIds, map);
  const changed = JSON.stringify(draft) !== JSON.stringify(saved);
  const counts = formationCounts(draft);
  const flexCount = draft.filter((id) => required[id] === undefined).length;

  const setSlot = (i, id) => { setDraft((d) => { const n = [...d]; n[i] = id; return n; }); setPick(null); };
  const reqChips = Object.entries(required).map(([id, need]) => ({ id, need, have: counts[id] || 0 }));

  // Full-board live preview: exactly the starting position this formation
  // produces in a match (your side below, a standard opponent above).
  const preview = useMemo(() => {
    if (!legal) return null;
    const levelOf = map.classic ? () => 1 : (id) => characterLevel(profile, id);
    const mine = buildArmyFromFormation(levelOf, draft, map.classic ? null : (id) => chosenAbilities(profile, id), map.classic ? null : (id) => dupeCount(profile, id));
    if (!map.classic) mine.hero = { col: heroColFor(profile, map), spec: (() => {
      const lvl = characterLevel(profile, "gambit") || 1;
      const r = resolveCharacter(CHARACTERS.gambit, lvl, chosenAbilities(profile, "gambit"));
      return { kind: "P", level: lvl, abilities: r.abilities, shield: r.shield };
    })() };
    const foe = buildAiArmyForMap("easy", map, 0);
    return createGame(mine, foe, { map, rules: "hp", seed: 1 });
  }, [draft, mapId, legal, profile]); // eslint-disable-line

  return <>
  <Panel>
    <PanelTitle style={{ marginBottom: 2 }}>{t("army.formation")}</PanelTitle>
    <div style={{ fontSize: 12, color: T.dim, marginBottom: 10 }}>{map.classic ? t("army.classicHint") : t("army.formationHint")}</div>

    <div style={{ display: feWide ? "grid" : "block", gridTemplateColumns: feWide ? "minmax(0, 1fr) minmax(280px, 360px)" : undefined,
      gap: feWide ? 18 : 0, alignItems: "start" }}>
    <div style={{ minWidth: 0 }}>
    {preview && (
      <div style={{ marginBottom: feWide ? 0 : 12 }}>
        <div style={{ fontSize: 12, color: T.dim, fontWeight: 700, marginBottom: 6 }}>{t("army.preview")}</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: feWide ? "min(700px, calc(100dvh / var(--vhz, 1) - 250px))" : 340 }}>
            <BoardView state={preview} interactive={false} theme={map.theme} maxPx={700} artStyle={profile.pieceArt || "painted"} />
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: T.faint, marginTop: 6, textAlign: "center" }}>{t("army.pawnSoon")}</div>
      </div>
    )}
    </div>

    <div style={{ minWidth: 0 }}>
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${draft.length}, 1fr)`, gap: 3, marginBottom: 10 }}>
      {draft.map((id, i) => {
        const open = pick === i;
        return <button key={i} disabled={map.classic} onClick={() => setPick(open ? null : i)}
          style={{ width: "100%", aspectRatio: "5 / 6", minWidth: 0, borderRadius: 8, cursor: "pointer",
            display: "grid", placeItems: "center", fontFamily: "inherit", padding: 0,
            background: open ? T.lime : T.bg2, border: `2px solid ${open ? T.lime : T.line}` }}>
          <SlotGlyph kind={CHARACTERS[id].kind} size={"clamp(15px, 6.4vw, 30px)"} art={profile.pieceArt || "painted"} />
        </button>;
      })}
    </div>

    {pick !== null && (
      <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 10, padding: 8, marginBottom: 10 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {pieces.map((c) => {
            const on = draft[pick] === c.id;
            return <button key={c.id} onClick={() => setSlot(pick, c.id)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 9, cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 13,
                background: on ? T.lime : T.panel2, color: on ? T.limeInk : T.text, border: `1px solid ${on ? T.lime : T.line}` }}>
              <SlotGlyph kind={c.kind} size={18} art={profile.pieceArt || "painted"} />{en ? c.nameEn : c.nameDe}
            </button>;
          })}
        </div>
      </div>
    )}

    {!map.classic && (
      <div style={{ margin: "2px 0 12px", padding: "10px 11px", background: T.panel2, borderRadius: T.radiusSm,
        border: `1px solid ${T.gold}44` }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 7 }}>
          <span className="gg-serif" style={{ fontSize: 12.5, letterSpacing: ".1em", color: T.gold }}>{t("army.heroPos")}</span>
          <span style={{ fontSize: 10.5, color: T.faint }}>{t("army.heroPosHint")}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${map.w}, 1fr)`, gap: 3 }}>
          {Array.from({ length: map.w }).map((_, f) => {
            const on = f === heroColFor(profile, map);
            return <button key={f} onClick={() => dispatch({ type: "SET_HERO_COL", mapId: map.id, col: f })}
              style={{ aspectRatio: "1", borderRadius: 7, cursor: "pointer", padding: 1,
                background: on ? `radial-gradient(circle at 40% 32%, ${T.gold}33, ${T.panel})` : T.panel,
                border: on ? `1.5px solid ${T.gold}` : `1px solid ${T.line}`,
                boxShadow: on ? `0 0 8px ${T.gold}55` : "none", display: "grid", placeItems: "center" }}>
              <div style={{ width: "82%", height: "82%", opacity: on ? 1 : 0.4 }}>
                <PieceArt kind="P" fill={on ? "#c9a45c" : "#5b617a"} rim={on ? null : "#3a415c"}
                  detail={on ? "#7a5c26" : "#3a415c"} size="100%" level={1} hero={on} />
              </div>
            </button>;
          })}
        </div>
      </div>
    )}

    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12, alignItems: "center" }}>
      {reqChips.map((r) => (
        <Chip key={r.id} color={r.have === r.need ? T.green : T.danger} bg={T.panel2}>
          <SlotGlyph kind={CHARACTERS[r.id].kind} size={13} art={profile.pieceArt || "painted"} /> {r.have}/{r.need}
        </Chip>
      ))}
      <Chip color={flexCount === flexNeed ? T.green : T.danger} bg={T.panel2}>{t("army.flex")} {flexCount}/{flexNeed}</Chip>
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
          const cap = spShardCap(profile);
          const bought = profile.spShards || 0;
          const left = Math.max(0, cap - bought);
          const can = left > 0 && (profile.gold || 0) >= SP_SHARD_GOLD;
          return <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", borderRadius: 10,
            border: "1px solid #8a6d3566", background: `linear-gradient(165deg, rgba(43, 36, 16, .4), ${T.panel2})`,
            position: "relative", overflow: "hidden" }}>
            <span aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "40%", pointerEvents: "none",
              background: "linear-gradient(90deg, transparent, rgba(255,240,190,.06), transparent)",
              animation: "ggShine 6s ease-in-out infinite" }} />
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

export function ArmyScreen({ profile, dispatch, t, initialTab }) {
  const [zoomChar, setZoomChar] = useState(null);
  const en = profile.lang === "en";
  const wide = useMedia("(min-width: 900px)");
  const [tab, setTab] = useState(initialTab || "formation"); // formation | gear | chars
  // Grand Gambit LEADS the roster — he is the piece the whole tale bends around.
  const rec = CHARACTER_LIST.filter((c) => isUnlocked(c, profile)).sort((a, b) => (b.epic ? 1 : 0) - (a.epic ? 1 : 0));
  const hid = CHARACTER_LIST.filter((c) => !isUnlocked(c, profile));
  const H = ({ children }) => <div className="gg-serif" style={{ fontSize: 14, letterSpacing: ".14em",
    color: T.dim, margin: "6px 2px -4px", textTransform: "uppercase", gridColumn: wide ? "1 / -1" : undefined }}>{children}</div>;
  return <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 12, maxWidth: "100%", minWidth: 0, overflowX: "clip" }}>
    <CharLightbox char={zoomChar} en={profile.lang === "en"} onClose={() => setZoomChar(null)} />
    {/* balance — always in sight, whatever the tab; wears the treasury's gold */}
    <GildedFrame pad="11px 16px">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span className="gg-serif" style={{ fontSize: 13, letterSpacing: ".22em", textTransform: "uppercase",
        ...goldText, filter: "drop-shadow(0 1px 1px rgba(0,0,0,.5))" }}>{t("army.balance")}</span>
      <span style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
        <span className="gg-serif" style={{ fontWeight: 500, fontSize: 21, letterSpacing: ".02em", color: T.gold, display: "inline-flex", alignItems: "center", gap: 7 }}><SkillStar size={17} /> {profile.sp || 0}</span>
        <span className="gg-serif" style={{ fontWeight: 500, fontSize: 21, letterSpacing: ".02em", color: "#e8c96a", display: "inline-flex", alignItems: "center", gap: 7 }}><GoldCoin size={17} shine /> {profile.gold || 0}</span>
      </span>
    </div>
    </GildedFrame>
    {/* three rooms instead of one endless scroll */}
    <Segmented value={tab} onChange={setTab} options={[
      { value: "formation", label: t("army.tabFormation") },
      { value: "gear", label: t("army.tabGear") },
      { value: "chars", label: t("army.tabChars") },
    ]} />
    {tab === "formation" && <FormationEditor profile={profile} dispatch={dispatch} t={t} en={en} />}
    {tab === "gear" && <GearPanel profile={profile} dispatch={dispatch} t={t} en={en} />}
    {tab === "chars" && (
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: wide ? "1fr 1fr" : "1fr", alignItems: "start" }}>
        <H>{t("army.secRecruited")} · {rec.length}</H>
        {rec.map((c) => (
          <div key={c.id} style={c.epic && wide ? { gridColumn: "1 / -1" } : undefined}>
            <CharCard char={c} profile={profile} dispatch={dispatch} t={t} en={en} onZoom={setZoomChar} />
          </div>
        ))}
        {hid.length > 0 && <H>{t("army.secHidden")} · {hid.length}</H>}
        {hid.map((c) => (
          <div key={c.id} style={{ height: "100%" }}><CharCard char={c} profile={profile} dispatch={dispatch} t={t} en={en} onZoom={setZoomChar} /></div>
        ))}
      </div>
    )}
  </div>;
}
