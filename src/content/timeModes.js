// ── THE FOUR GAMBITS: how much time a duel is given ─────────────────────────
//
// One table, read by the lobby (cards), by the clock in the match and by the
// worker's matchmaking — a player waiting for Rush must never be paired with
// one waiting for Prime, so the pairing key lives here too.
//
// `base` is each side's budget in seconds, `inc` the seconds handed back after
// every move (Fischer). `perMove` marks the correspondence format, where the
// budget is not a shared pool but a fresh deadline per move.

export const TIME_MODES = [
  {
    id: "quick",
    de: { name: "Quick Gambit", tag: "1–2 Min",
      blurb: "Kugelschnell und pure Reflexe. Ein einziger Fehler entscheidet über Sieg oder Niederlage. Hast du die Nerven für das schnellste Gambit?" },
    en: { name: "Quick Gambit", tag: "1–2 min",
      blurb: "Bullet speed and pure reflex. A single slip decides the game. Do you have the nerve for the fastest gambit?" },
    base: 60, inc: 1, color: "#e05a4a", glyph: "bolt",
  },
  {
    id: "rush",
    de: { name: "Rush Gambit", tag: "3–5 Min",
      blurb: "Der beliebteste Arena-Modus. Das Zusammenspiel aus Taktik, Zeitdruck und Intuition — ideal für den schnellen Wettkampf zwischendurch." },
    en: { name: "Rush Gambit", tag: "3–5 min",
      blurb: "The arena's favourite. Tactics, time pressure and intuition in balance — the sweet spot for a quick contest." },
    base: 180, inc: 2, color: "#e5a13d", glyph: "clock", featured: true,
  },
  {
    id: "prime",
    de: { name: "Prime Gambit", tag: "10–15 Min",
      blurb: "Tiefe Strategie ohne Hektik. Rechne deine Züge voraus, entfalte Kombinationen und zeige echtes Schachverständnis." },
    en: { name: "Prime Gambit", tag: "10–15 min",
      blurb: "Deep strategy without haste. Calculate ahead, unfold combinations and show real understanding." },
    base: 600, inc: 0, color: "#4aa3e8", glyph: "shield",
    // a Prime duel can run half an hour — say so before the horn sounds
    warnDe: "Bedenke: Eine Partie kann 20–30 Minuten dauern.",
    warnEn: "Mind the hour: a game can run 20–30 minutes.",
  },
  {
    id: "daily",
    de: { name: "Classic Gambit", tag: "1–3 Tage",
      blurb: "Das Großmeister-Format für unterwegs. Ziehe, wann immer du Zeit hast, und studiere das Brett in aller Ruhe über mehrere Tage." },
    en: { name: "Classic Gambit", tag: "1–3 days",
      blurb: "The grandmaster's format for the road. Move whenever you have a moment and study the board over days." },
    base: 86400, inc: 0, perMove: true, color: "#a78bfa", glyph: "crown",
    // Honest state: correspondence needs the match to survive both players
    // closing the app, plus a nudge when it is your turn. The live relay does
    // neither yet, so the card announces the format instead of pretending.
    pending: true,
    pendingDe: "In Vorbereitung — dieses Format braucht Partien, die offline weiterlaufen, und eine Benachrichtigung, wenn du am Zug bist.",
    pendingEn: "In preparation — this format needs games that survive going offline, and a nudge when it is your turn.",
  },
];

export const timeModeById = (id) => TIME_MODES.find((m) => m.id === id) || TIME_MODES[1];

/** Two players may only meet if they asked for the SAME clock. */
export const timeModeKey = (id) => (TIME_MODES.some((m) => m.id === id) ? id : "rush");

/** The clock a match starts with, as the board's timer understands it. */
export function clockFor(id) {
  const m = timeModeById(id);
  return { type: m.perMove ? "move" : "total", seconds: m.base, inc: m.inc || 0 };
}
