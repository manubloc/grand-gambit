import { KIND, VALUE, BASE_HP, BASE_ATK } from "../core/index.js";
import { DEFAULT_BACK_RANK, FLANK_SLOTS } from "../core/index.js";
import { CHARACTERS, CHARACTER_LIST, KIND_TO_CHAR } from "../content/index.js";
import { difficultyById, mapById } from "../content/index.js";

// ── XP curves ───────────────────────────────────────────────────────────────
export const charXpForLevel = (n) => (n <= 1 ? 0 : Math.round(40 * Math.pow(n - 1, 1.7)));
export const playerXpForLevel = (n) => (n <= 1 ? 0 : Math.round(60 * Math.pow(n - 1, 1.45)));

function levelForXp(xp, curve) { let n = 1; while (curve(n + 1) <= xp) n++; return n; }
export const charLevelForXp = (xp) => levelForXp(xp || 0, charXpForLevel);
export const playerLevelForXp = (xp) => levelForXp(xp || 0, playerXpForLevel);

function progress(xp, curve) {
  const level = levelForXp(xp || 0, curve);
  const cur = curve(level), next = curve(level + 1);
  return { level, into: (xp || 0) - cur, span: next - cur, pct: ((xp || 0) - cur) / (next - cur) };
}
export const charXpProgress = (xp) => progress(xp, charXpForLevel);
export const spForXpJump = (fromXp, toXp) =>
  SP_PER_PLAYER_LEVEL * Math.max(0, playerLevelForXp(toXp) - playerLevelForXp(fromXp));
export const playerXpProgress = (xp) => progress(xp, playerXpForLevel);

// ── Character resolution ──────────────────────────────────────────────────────
/** Abilities + shields at a level. Shields are passive and come with the level;
 *  ABILITIES are a conscious choice: pass the player's purchased list (`chosen`)
 *  to resolve exactly those (still gated by level). `chosen = null` = full
 *  ladder — used for AI armies and boss previews. */
export function resolveCharacter(char, level, chosen = null) {
  let shield = 0; const abilities = [];
  for (const e of char.ladder) if (e.level <= level) {
    if (e.shield) shield += e.shield;
    if (e.ability && (chosen === null || chosen.includes(e.ability))) abilities.push(e.ability);
  }
  return { abilities, shield };
}
export const chosenAbilities = (profile, charId) => (profile?.pieces?.abilities?.[charId]) || [];
export const characterLevel = (profile, charId) => profile?.pieces?.levels?.[charId] || 1;

// ── Upgrade economy: XP is a spendable currency ──────────────────────────────
export const MAX_PIECE_LEVEL = 10;
/** SKILL POINTS are the piece currency: earned per player level (and by
 *  claiming achievements), spent deliberately on levels + abilities.
 *  Cost per level step follows the piece's board value. */
export const SP_PER_PLAYER_LEVEL = 3;
export const skillPoints = (profile) => profile?.sp || 0;
export const upgradeCost = (charId) => {
  const ch = CHARACTERS[charId];
  const v = Math.min(ch?.costValue ?? (VALUE[ch?.kind] || 100), 1000);
  return v <= 150 ? 1 : v <= 450 ? 2 : v <= 700 ? 3 : 4; // pawn 1 · minor 2 · rook 3 · queen/king 4
};
export const canUpgrade = (profile, charId) => {
  const l = characterLevel(profile, charId);
  return l < MAX_PIECE_LEVEL && skillPoints(profile) >= upgradeCost(charId);
};
export function upgradePiece(profile, charId) {
  const l = characterLevel(profile, charId);
  if (l >= MAX_PIECE_LEVEL) return profile;
  const cost = upgradeCost(charId);
  if (skillPoints(profile) < cost) return profile;
  const stats = { ...(profile.stats || {}) };
  stats.upgrades = (stats.upgrades || 0) + 1;
  return { ...profile, sp: profile.sp - cost, stats,
    pieces: { ...(profile.pieces || {}), levels: { ...((profile.pieces || {}).levels || {}), [charId]: l + 1 } } };
}

// ── Abilities are bought deliberately: save up, then choose ──────────────────
export const abilityCost = (reqLevel) => Math.ceil(reqLevel / 2); // L3→2 · L5→3 · L7→4 · L9→5 SP
export function canUnlockAbility(profile, charId, abilityId) {
  const ch = CHARACTERS[charId];
  const rung = ch?.ladder.find((e) => e.ability === abilityId);
  if (!rung) return false;
  if (chosenAbilities(profile, charId).includes(abilityId)) return false;
  if (characterLevel(profile, charId) < rung.level) return false;
  return skillPoints(profile) >= abilityCost(rung.level);
}
export function unlockAbility(profile, charId, abilityId) {
  if (!canUnlockAbility(profile, charId, abilityId)) return profile;
  const rung = CHARACTERS[charId].ladder.find((e) => e.ability === abilityId);
  const pieces = profile.pieces || {};
  const abilities = { ...(pieces.abilities || {}) };
  abilities[charId] = [...(abilities[charId] || []), abilityId];
  const stats = { ...(profile.stats || {}) };
  stats.abilitiesUnlocked = (stats.abilitiesUnlocked || 0) + 1;
  return { ...profile, sp: profile.sp - abilityCost(rung.level), stats, pieces: { ...pieces, abilities } };
}
/** Gold service: forget a piece's abilities and get the spent XP back. */
export const RESPEC_GOLD = 15;
export function respecPiece(profile, charId) {
  const list = chosenAbilities(profile, charId);
  if (!list.length || (profile.gold || 0) < RESPEC_GOLD) return profile;
  const ch = CHARACTERS[charId];
  const refund = list.reduce((a, id) => a + abilityCost(ch.ladder.find((e) => e.ability === id)?.level || 1), 0);
  const abilities = { ...((profile.pieces || {}).abilities || {}) };
  delete abilities[charId];
  return { ...profile, gold: profile.gold - RESPEC_GOLD, sp: (profile.sp || 0) + refund,
    pieces: { ...(profile.pieces || {}), abilities } };
}

/** The next ladder entry above `level` (for "next reward" UI), or null. */
export function nextReward(char, level) {
  for (const e of char.ladder) if (e.level > level) return e;
  return null;
}

// ── Unlocks ───────────────────────────────────────────────────────────────────
// New pieces are unlocked ONLY by defeating their end boss on the campaign map.
export const isUnlocked = (char, profile) =>
  char.unlock.type === "start" || (profile?.campaign?.unlocked || []).includes(char.id);
export const unlockedCharacterIds = (profile) => CHARACTER_LIST.filter((c) => isUnlocked(c, profile)).map((c) => c.id);

// ── Army building ─────────────────────────────────────────────────────────────
/** Build an army from a level lookup and a flank assignment ([slot2, slot7]). */
export function buildArmyFrom(levelOf, flank = ["knight", "knight"], chosenOf = null, boostOf = null) {
  const back = DEFAULT_BACK_RANK.map((kind, f) => {
    let charId = KIND_TO_CHAR[kind];
    const slot = FLANK_SLOTS.indexOf(f);
    if (slot >= 0 && flank[slot]) charId = flank[slot];
    const char = CHARACTERS[charId];
    const level = Math.max(1, levelOf(charId) || 1);
    const { abilities, shield } = resolveCharacter(char, level, chosenOf ? chosenOf(charId) : null);
    return { kind: char.kind, level, abilities, shield, ...boostSpec(char, boostOf && boostOf(charId)), ...(char.moveSpec ? { moveSpec: char.moveSpec } : {}) };
  });
  const pl = Math.max(1, levelOf("pawn") || 1);
  const pr = resolveCharacter(CHARACTERS.pawn, pl, chosenOf ? chosenOf("pawn") : null);
  return { back, pawn: { kind: KIND.PAWN, level: pl, abilities: pr.abilities, shield: pr.shield, ...boostSpec(CHARACTERS.pawn, boostOf && boostOf("pawn")) } };
}

/** League duplication: extra recruit copies harden a piece (+1 HP each, +1 ATK at ★2). */
export const dupeCount = (profile, charId) => (profile?.campaign?.dupes?.[charId]) || 0;
function boostSpec(char, dupes) {
  const d = Math.min(dupes || 0, 2);
  if (!d) return {};
  return { baseHp: (BASE_HP[char.kind] || 1) + d, baseAtk: (BASE_ATK[char.kind] || 1) + (d >= 2 ? 1 : 0) };
}

// ── Formation (custom back rank) ──────────────────────────────────────────────
const BACK_SIZE = DEFAULT_BACK_RANK.length; // 10
// The fixed-count heavy pieces every legal formation must contain (positionable,
// but not multipliable — this keeps material balanced without a points budget).
export const FORMATION_REQUIRED = { king: 1, queen: 1, rook: 2, bishop: 2 };
// The remaining slots are "flex": a knight or any unlocked flank-eligible fairy.
export const FORMATION_FLEX = new Set(CHARACTER_LIST.filter((c) => c.flank).map((c) => c.id));
export const FORMATION_FLEX_COUNT = BACK_SIZE - Object.values(FORMATION_REQUIRED).reduce((a, b) => a + b, 0); // 4

/** The standard back rank expressed as character ids (the default formation). */
export const defaultFormation = () => DEFAULT_BACK_RANK.map((k) => KIND_TO_CHAR[k]);

export function formationCounts(formation) {
  const c = {};
  for (const id of formation || []) c[id] = (c[id] || 0) + 1;
  return c;
}

/** Legal if it uses only unlocked back-rank pieces, has exactly the required
 *  heavy-piece counts, and fills the rest from the flex pool. */
export function formationLegal(formation, unlockedIds) {
  if (!Array.isArray(formation) || formation.length !== BACK_SIZE) return false;
  const unlocked = new Set(unlockedIds);
  let flex = 0;
  for (const id of formation) {
    const ch = CHARACTERS[id];
    if (!ch || ch.kind === KIND.PAWN || !unlocked.has(id)) return false;
    if (FORMATION_REQUIRED[id] === undefined) {
      if (!FORMATION_FLEX.has(id)) return false;
      flex++;
    }
  }
  const c = formationCounts(formation);
  for (const [id, n] of Object.entries(FORMATION_REQUIRED)) if ((c[id] || 0) !== n) return false;
  return flex === FORMATION_FLEX_COUNT;
}

/** Build an army from an explicit back-rank formation (array of character ids). */
export function buildArmyFromFormation(levelOf, formation, chosenOf = null, boostOf = null) {
  const back = formation.map((id) => {
    const ch = CHARACTERS[id];
    const level = Math.max(1, levelOf(id) || 1);
    const { abilities, shield } = resolveCharacter(ch, level, chosenOf ? chosenOf(id) : null);
    return { kind: ch.kind, level, abilities, shield, ...boostSpec(ch, boostOf && boostOf(id)), ...(ch.moveSpec ? { moveSpec: ch.moveSpec } : {}) };
  });
  const pl = Math.max(1, levelOf("pawn") || 1);
  const pr = resolveCharacter(CHARACTERS.pawn, pl, chosenOf ? chosenOf("pawn") : null);
  return { back, pawn: { kind: KIND.PAWN, level: pl, abilities: pr.abilities, shield: pr.shield, ...boostSpec(CHARACTERS.pawn, boostOf && boostOf("pawn")) } };
}

// ── Map-aware formation & army ────────────────────────────────────────────────
const ARENA = () => mapById("arena");
export const formationSpec = (map) => ({ required: map.formation.required, flex: map.formation.flex, size: map.w });

/** Map-aware legality: required composition + size come from the map. */
export function formationLegalOn(formation, unlockedIds, map) {
  const { required, flex, size } = formationSpec(map);
  if (!Array.isArray(formation) || formation.length !== size) return false;
  const unlocked = new Set(unlockedIds); let flexN = 0;
  for (const id of formation) {
    const ch = CHARACTERS[id];
    if (!ch || ch.kind === KIND.PAWN || !unlocked.has(id)) return false;
    if (required[id] === undefined) { if (!FORMATION_FLEX.has(id)) return false; flexN++; }
  }
  const c = formationCounts(formation);
  for (const [id, n] of Object.entries(required)) if ((c[id] || 0) !== n) return false;
  return flexN === flex;
}

/** Build a player army for a specific map. Classic maps use base-level pieces
 *  (no shields/abilities) → authentic chess; other maps honor a saved legal
 *  per-map formation, else the map's default. */
/** The Grand Gambit's chosen file on this map (clamped; default: center). */
export const heroColFor = (profile, map) => {
  const saved = profile?.loadout?.heroCols?.[map.id];
  const mid = Math.floor(map.w / 2);
  const c = saved == null ? mid : saved;
  return Math.max(0, Math.min(map.w - 1, c));
};
function heroSpec(profile) {
  const ch = CHARACTERS.gambit;
  const level = Math.max(1, characterLevel(profile, "gambit") || 1);
  const { abilities, shield } = resolveCharacter(ch, level, chosenAbilities(profile, "gambit"));
  return { kind: ch.kind, level, abilities, shield };
}

export function buildArmyForMap(profile, map, excludeId = null) {
  const levelOf = map.classic ? () => 1 : (id) => characterLevel(profile, id);
  const chosenOf = map.classic ? null : (id) => chosenAbilities(profile, id);
  const boostOf = map.classic ? null : (id) => dupeCount(profile, id);
  const saved = profile?.loadout?.formations?.[map.id];
  const ok = !map.classic && saved && formationLegalOn(saved, unlockedCharacterIds(profile), map);
  let formation = ok ? saved : map.defaultFormation;
  // Turncoat duels (v0.20): fighting the double of a piece you own — your own
  // copy sits the match out, its slot falls back to the map's default rank.
  if (excludeId) formation = formation.map((cid, i) =>
    cid === excludeId ? (map.defaultFormation[i] !== excludeId ? map.defaultFormation[i] : "knight") : cid);
  const army = buildArmyFromFormation(levelOf, formation, chosenOf, boostOf);
  if (!map.classic) army.hero = { col: heroColFor(profile, map), spec: heroSpec(profile) };
  return army;
}

const AI_BUMP = { easy: 0, normal: 1, hard: 2 };

// Varied enemy back ranks per board width — the AI fields a different (often
// wilder) squad each match. Each entry contains exactly one king.
const ENEMY_POOLS = {
  6: [
    ["rook", "knight", "queen", "king", "bishop", "knight"],
    ["knight", "bishop", "queen", "king", "knight", "rook"],
    ["hawk", "bishop", "queen", "king", "hawk", "rook"],
    ["rook", "knight", "archbishop", "king", "bishop", "knight"],
  ],
  8: [
    ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"],
    ["knight", "knight", "bishop", "queen", "king", "bishop", "knight", "knight"],
    ["rook", "hawk", "archbishop", "queen", "king", "archbishop", "hawk", "rook"],
    ["chancellor", "knight", "bishop", "queen", "king", "bishop", "knight", "chancellor"],
    ["rook", "knight", "amazon", "king", "queen", "bishop", "hawk", "rook"],
  ],
  10: [
    ["rook", "knight", "knight", "bishop", "queen", "king", "bishop", "knight", "knight", "rook"],
    ["rook", "knight", "hawk", "archbishop", "queen", "king", "archbishop", "hawk", "knight", "rook"],
    ["rook", "chancellor", "knight", "bishop", "queen", "king", "bishop", "knight", "chancellor", "rook"],
    ["rook", "hawk", "knight", "amazon", "king", "queen", "bishop", "knight", "hawk", "rook"],
    ["knight", "knight", "bishop", "hawk", "queen", "king", "hawk", "bishop", "knight", "knight"],
  ],
};

/** AI army for a specific map. Classic stays standard (pure chess); other maps
 *  draw a varied enemy formation chosen by `seed`, all scaled by difficulty. */
export function buildAiArmyForMap(difficultyId, map, seed = 0) {
  const bump = map.classic ? 0 : (AI_BUMP[difficultyId] ?? 0);
  let formation = map.defaultFormation;
  if (!map.classic) {
    const pool = ENEMY_POOLS[map.w];
    if (pool && pool.length) formation = pool[Math.abs(seed | 0) % pool.length];
  }
  return buildArmyFromFormation(() => 1 + bump, formation);
}

/** Player army. Defaults to the 10×10 Arena (used by the campaign); the app
 *  passes the active map for quick play. */
export const buildArmy = (profile, map = ARENA(), excludeId = null) => buildArmyForMap(profile, map, excludeId);

export const buildAiArmy = (difficultyId) => {
  const d = difficultyById(difficultyId);
  return buildArmyFrom((id) => d.levels[id] || 1, d.flank);
};

/** Like buildAiArmy but raises every enemy level by `bump` and can override the
 *  flank pieces — the campaign uses this to scale up and introduce new pieces. */
export const buildAiArmyScaled = (difficultyId, bump = 0, flank) => {
  const d = difficultyById(difficultyId);
  return buildArmyFrom((id) => (d.levels[id] || 1) + bump, flank || d.flank);
};
