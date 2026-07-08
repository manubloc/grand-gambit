// Tunable game/app config. Difficulty defines AI search depth, the AI's
// character levels (so the player faces — and SEES — upgraded enemy pieces),
// and which characters sit in the AI's flank slots.
export const DIFFICULTIES = [
  {
    id: "easy", depth: 1,
    levels: {}, flank: ["knight", "knight"],
  },
  {
    id: "normal", depth: 2,
    levels: { pawn: 3, knight: 3, bishop: 2, rook: 2, queen: 2 },
    flank: ["knight", "knight"],
  },
  {
    id: "hard", depth: 2,
    levels: { pawn: 5, knight: 4, bishop: 4, rook: 4, queen: 4, king: 2, archbishop: 3, chancellor: 3 },
    flank: ["archbishop", "chancellor"], // fairy pieces with abilities + shields
  },
];
export const difficultyById = (id) => DIFFICULTIES.find((d) => d.id === id) || DIFFICULTIES[1];
