import { useState, useEffect, useMemo } from "react";
import { useMedia } from "../../App.jsx";
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

function CharCard({ char, profile, dispatch, t, en }) {
  const unlocked = isUnlocked(char, profile);
  const bossNode = CAMPAIGN.find((n) => n.boss?.piece === char.id);
  const [info, setInfo] = useState(null);

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

  const a = info ? ABILITIES[info] : null;
  const tag = a ? TAGS[a.tag] : null;
  const infoLevel = a ? (rungs.find((r) => r.id === info) || {}).level : 0;

  const INK = "#cfc9b4"; // body text a notch brighter than T.dim — readability pass
  return <Panel style={{ opacity: unlocked ? 1 : 0.74 }}>
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      {paintedById(char.id)
        ? <img src={paintedById(char.id)} alt="" style={{ width: 44, height: 56, objectFit: "contain", objectPosition: "bottom",
            flex: "0 0 auto", filter: unlocked ? "drop-shadow(0 3px 5px rgba(0,0,0,.5))" : "grayscale(1) brightness(1.1)",
            opacity: unlocked ? 1 : 0.6 }} />
        : <Glyph kind={char.kind} level={level} abilities={unlocked ? abilities : []} shield={unlocked ? shield : 0} hero={epic} art={profile.pieceArt || "painted"} />}
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
          {maxed ? t("army.maxed") : <>Level {level} → {level + 1} · <b style={{ color: affordable ? T.gold : T.danger }}>{cost} <SkillStar size={12} /></b></>}
        </div>
        {!maxed && <Button variant={affordable ? "primary" : "subtle"} disabled={!affordable}
          style={{ padding: "8px 14px", fontSize: 13 }}
          onClick={() => dispatch({ type: "UPGRADE_PIECE", id: char.id })}>{t("army.upgrade")}</Button>}
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
      // Abilities are BOUGHT, not granted: owned = glowing chip; reachable = a
      // purchase row with cost; beyond your level = a quiet "L{n} · ???" tease.
      return <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          {rungs.filter((rg) => chosen.includes(rg.id)).map((rg) => {
            const ab = ABILITIES[rg.id], tg = TAGS[ab.tag];
            const sel = info === rg.id;
            return <button key={rg.id} onClick={() => setInfo(sel ? null : rg.id)}
              style={{ cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 12, fontWeight: 800, padding: "5px 9px", borderRadius: 999,
                border: `1px solid ${tg.color}`, boxShadow: `0 0 8px ${tg.color}44`,
                background: sel ? tg.color + "26" : "rgba(8,6,15,.4)", color: tg.color }}>
              <span>{ab.icon}</span>{en ? ab.nameEn : ab.nameDe}
            </button>;
          })}
          {rungs.filter((rg) => level < rg.level).map((rg, i) => {
            // Tactics need a horizon: the next two rungs show their cards
            // face-up (grayed), the deeper ones stay a mystery.
            if (i < 2) {
              const ab = ABILITIES[rg.id], tg = TAGS[ab.tag];
              const sel = info === rg.id;
              return <button key={rg.id} onClick={() => setInfo(sel ? null : rg.id)}
                style={{ cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 12, fontWeight: 800, padding: "5px 9px", borderRadius: 999,
                  border: `1px dashed ${tg.color}77`, background: sel ? tg.color + "1f" : T.panel2,
                  color: tg.color + "bb", filter: "saturate(.65)" }}>
                <span style={{ opacity: .8 }}>{ab.icon}</span>{en ? ab.nameEn : ab.nameDe}
                <span style={{ fontSize: 10, fontWeight: 700, color: T.faint }}>L{rg.level}</span>
              </button>;
            }
            return <span key={rg.id} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 800,
              padding: "5px 9px", borderRadius: 999, border: `1px dashed ${T.line}`, background: T.panel2, color: T.faint }}>
              <LockIc size={10} /> L{rg.level} · ???
            </span>;
          })}
        </div>
        {rungs.filter((rg) => !chosen.includes(rg.id) && level >= rg.level).map((rg) => {
          const ab = ABILITIES[rg.id], tg = TAGS[ab.tag];
          const price = abilityCost(rg.level);
          const can = canUnlockAbility(profile, char.id, rg.id);
          return <div key={rg.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px",
            background: T.panel2, borderRadius: T.radiusSm, border: `1px solid ${tg.color}66` }}>
            <span style={{ fontSize: 15 }}>{ab.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: tg.color }}>{en ? ab.nameEn : ab.nameDe}</div>
              <div style={{ fontSize: 11.5, color: INK }}>{en ? ab.textEn : ab.textDe}</div>
            </div>
            <button onClick={() => dispatch({ type: "UNLOCK_ABILITY", id: char.id, ability: rg.id })} disabled={!can}
              style={{ fontFamily: "inherit", fontWeight: 900, fontSize: 12, borderRadius: 999, padding: "7px 12px",
                cursor: can ? "pointer" : "default", border: `1.5px solid ${can ? T.gold : T.line}`,
                background: can ? T.gold : T.panel, color: can ? "#17110a" : T.faint, whiteSpace: "nowrap" }}>
              ⛏ {price} <SkillStar size={12} />
            </button>
          </div>;
        })}
        {chosen.length > 0 && (
          <button onClick={() => dispatch({ type: "RESPEC", id: char.id })} disabled={(profile.gold || 0) < RESPEC_GOLD}
            style={{ justifySelf: "start", background: "none", border: "none", fontFamily: "inherit", cursor: "pointer",
              fontSize: 11.5, color: (profile.gold || 0) >= RESPEC_GOLD ? T.dim : T.faint, padding: "2px 2px 0",
              textDecoration: "underline" }}>
            ↺ {t("army.respec", { g: RESPEC_GOLD })}
          </button>
        )}
      </div>;
    })()}

    {a && (
      <div style={{ marginTop: 10, padding: 10, borderRadius: 12, background: T.bg2, border: `1px solid ${tag.color}55`, borderLeft: `3px solid ${tag.color}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
          <span style={{ fontSize: 16 }}>{a.icon}</span>
          <b style={{ color: T.text }}>{en ? a.nameEn : a.nameDe}</b>
          <Chip color={tag.color} bg={T.panel2}>{en ? tag.nameEn : tag.nameDe}</Chip>
          <Chip color={a.once ? T.gold : T.green} bg={T.panel2}>{a.once ? (en ? "once" : "einmalig") : (en ? "passive" : "dauerhaft")}</Chip>
          {!a.live && <Chip color={T.faint} bg={T.panel2}>⚙ {en ? "soon" : "bald"}</Chip>}
        </div>
        <div style={{ fontSize: 13, color: INK, marginTop: 6, lineHeight: 1.5 }}>{en ? a.descEn : a.descDe}</div>
        {unlocked && level < infoLevel && <div style={{ fontSize: 12, color: T.faint, marginTop: 5 }}>{en ? "Unlocks at level" : "Schaltet frei ab Stufe"} {infoLevel}</div>}
      </div>
    )}
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

    {preview && (
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 12, color: T.dim, fontWeight: 700, marginBottom: 6 }}>{t("army.preview")}</div>
        <BoardView state={preview} interactive={false} theme={map.theme} maxPx={340} artStyle={profile.pieceArt || "painted"} />
        <div style={{ fontSize: 11.5, color: T.faint, marginTop: 6, textAlign: "center" }}>{t("army.pawnSoon")}</div>
      </div>
    )}


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
  </Panel>

  {/* map choice — its own strip below the box: ONE row, scroll if it must */}
  <div style={{ minWidth: 0, maxWidth: "100%" }}>
    <FieldLabel>{t("army.mapPick")}</FieldLabel>
    <div style={{ display: "flex", flexWrap: "nowrap", gap: 6, overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 10,
      paddingBottom: 4, scrollbarWidth: "thin", minWidth: 0, maxWidth: "100%" }}>
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

export function ArmyScreen({ profile, dispatch, t }) {
  const en = profile.lang === "en";
  const wide = useMedia("(min-width: 900px)");
  const [tab, setTab] = useState("formation"); // formation | gear | chars
  // Grand Gambit LEADS the roster — he is the piece the whole tale bends around.
  const rec = CHARACTER_LIST.filter((c) => isUnlocked(c, profile)).sort((a, b) => (b.epic ? 1 : 0) - (a.epic ? 1 : 0));
  const hid = CHARACTER_LIST.filter((c) => !isUnlocked(c, profile));
  const H = ({ children }) => <div className="gg-serif" style={{ fontSize: 14, letterSpacing: ".14em",
    color: T.dim, margin: "6px 2px -4px", textTransform: "uppercase", gridColumn: wide ? "1 / -1" : undefined }}>{children}</div>;
  return <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 12, maxWidth: "100%", minWidth: 0, overflowX: "clip" }}>
    {/* balance — always in sight, whatever the tab */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      background: T.panel, border: `1px solid ${T.line}`, borderRadius: T.radius, padding: "10px 14px" }}>
      <span className="gg-serif" style={{ fontSize: 14, letterSpacing: ".08em", color: T.dim }}>{t("army.balance")}</span>
      <span style={{ display: "flex", gap: 12, alignItems: "baseline" }}>
        <span className="gg-serif" style={{ fontWeight: 500, fontSize: 21, letterSpacing: ".02em", color: T.gold, display: "inline-flex", alignItems: "center", gap: 7 }}><SkillStar size={17} /> {profile.sp || 0}</span>
        <span className="gg-serif" style={{ fontWeight: 500, fontSize: 21, letterSpacing: ".02em", color: "#e8c96a", display: "inline-flex", alignItems: "center", gap: 7 }}><GoldCoin size={17} shine /> {profile.gold || 0}</span>
      </span>
    </div>
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
            <CharCard char={c} profile={profile} dispatch={dispatch} t={t} en={en} />
          </div>
        ))}
        {hid.length > 0 && <H>{t("army.secHidden")} · {hid.length}</H>}
        {hid.map((c) => (
          <div key={c.id}><CharCard char={c} profile={profile} dispatch={dispatch} t={t} en={en} /></div>
        ))}
      </div>
    )}
  </div>;
}
