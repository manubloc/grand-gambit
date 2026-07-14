// ── The three HOUSES ──────────────────────────────────────────────────────────
// Every recruitable champion belongs to one of three families; the classic
// pieces (and the Grand Gambit himself) stay unaligned. Families carry
// COLLECTIVE traits that only wake when kin march together:
//
//   blades — the HUNTING PACK: +1 max HP per additional pack member fielded
//            (capped at +3). The pack hardens the lone wolf.
//   magic  — the CIRCLE: fielding 2 members grants ONE Time Rift per match,
//            4 members grant TWO. A rift lets your next move keep the turn.
//   order  — the SHIELD WALL: while an order piece stands orthogonally beside
//            another order ally, incoming hits deal 1 less damage (min 1).
//
// Family is derived from the piece KIND so the core stays self-contained and
// nothing new has to survive the codec.
export const FAMILY_BY_KIND = {
  // blades — fast killers of the western road
  H: "blades", S: "blades", O: "blades", D: "blades", M: "blades", V: "blades",
  // magic — tricksters and miracle-workers
  E: "magic", L: "magic", Z: "magic", W: "magic", A: "magic", Y: "magic",
  // order — shields, banners and the letter of the law
  G: "order", J: "order", U: "order", I: "order", F: "order", T: "order", C: "order",
};

export const familyOf = (kindOrPiece) =>
  FAMILY_BY_KIND[(kindOrPiece && kindOrPiece.kind) || kindOrPiece] || null;

/** Hunting-pack HP bonus for `count` fielded blades (0 below two members). */
export const packBonus = (count) => (count >= 2 ? Math.min(3, count - 1) : 0);

/** Time Rifts granted for `count` fielded magic members. */
export const circleRifts = (count) => (count >= 4 ? 2 : count >= 2 ? 1 : 0);
