// ── @gambit/content — game data (designer-facing) ───────────────────────────
// Pure data + light helpers. Adding a character or ability is a data edit here
// (plus, for a brand-new movement rule, one handler in core/rules/moves.js).
export { ABILITIES, TAGS } from "./abilities.js";
export { CHARACTERS, CHARACTER_LIST, KIND_TO_CHAR } from "./characters.js";
export { DIFFICULTIES, difficultyById } from "./difficulties.js";
export { CAMPAIGN, nodeById, BRANCHES, campaignTag, CHAPTERS, chapterForRow, chapterTitle } from "./campaign.js";
export { MAPS, mapById, validateMap, inMap, isHole, holeSet, mapIdx, playableCount } from "./maps.js";
export { BOSSES, bossById, LEAGUE_BOSSES, leagueBossId, bossName, bossSpec } from "./bosses.js";

export { ITEMS, ITEM_LIST, hasItem, buyItem } from "./items.js";
export { VOICES, voiceFor } from "./voices.js";
