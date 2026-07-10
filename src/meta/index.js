// ── @gambit/meta — progression & profile (the "RPG" layer) ───────────────────
// Depends on @gambit/core (types, replay) and @gambit/content (data).
export {
  charXpForLevel, playerXpForLevel, charLevelForXp, playerLevelForXp,
  charXpProgress, playerXpProgress,
  resolveCharacter, characterLevel, nextReward, chosenAbilities, dupeCount, skillPoints, SP_PER_PLAYER_LEVEL, spForXpJump, heroColFor,
  abilityCost, canUnlockAbility, unlockAbility, respecPiece, RESPEC_GOLD,
  MAX_PIECE_LEVEL, upgradeCost, canUpgrade, upgradePiece,
  isUnlocked, unlockedCharacterIds,
  buildArmyFrom, buildArmy, buildAiArmy, buildAiArmyScaled, buildArmyForMap, buildAiArmyForMap,
  defaultFormation, formationLegal, formationLegalOn, formationSpec, formationCounts, buildArmyFromFormation,
  FORMATION_REQUIRED, FORMATION_FLEX, FORMATION_FLEX_COUNT,
} from "./leveling.js";
export { ACHIEVEMENTS, evaluate, completedSet, claimedTiers, claimReward, claimableCount, claimAchievement } from "./achievements.js";
export { applyResult, winGold } from "./rewards.js";
export { emptyStats, defaultProfile, loadProfile, saveProfile, serializeSave, parseSave } from "./profile.js";
export { newSession, applyEvents, summarize, summarizeMatch } from "./session.js";
export {
  campaignLength, clearedCount, clearedIds, nodeStatus, currentNodeId, predsOf, nodeBossSpec,
  buildStageMatch, advanceCampaign, mapUnlocked, hpUnlocked, stageTimer,
  leagueRewardMult, leagueBump, stageGold, tollCost, payToll, bossPieceFor, leagueFinalBossPiece, seaAccessible, nodeInLeague, gateOf, leagueNo,
} from "./campaign.js";
export { retinueScore, scoreBand } from "./rating.js";
export { applySnapshot, readSnapshot, listRestorePoints, takeRestorePoint, BK_RECENT, BK_DAILY_DAYS, BK_MIN_GAP_MS } from "./backups.js";
export {
  ensureAccounts, register, login, loginGuest, upsertCloudAccount, changePassword,
  adminHasDefaultPass, currentAccount, setSession, clearSession, findAccount,
  normEmail, validEmail, hashPass, mkAccount, ADMIN_EMAIL, ADMIN_DEFAULT_PASS,
} from "./accounts.js";
export {
  listSaves, createSave, loadSave, writeSave, deleteSave, renameSave,
  progressPct, withProgressPct, leagueOrder, summarize as summarizeSave, migrateLegacyInto, fmtPlaytime,
} from "./saves.js";
export { cloudConfigured, signInWithGoogle, signInWithProvider, signInEmailCloud, signUpEmailCloud, resumeCloudSession, signOutCloud } from "./cloudAuth.js";
export { emptyRecords, recordStage, totalBestMoves, fmtMs } from "./records.js";
export { BOARDS, LB_MAX, mergeBoard, fetchBoard, submitScore } from "./leaderboard.js";
