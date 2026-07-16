// Display + classification metadata for abilities. The actual MOVE/COMBAT logic
// lives in the engine (rules/moves.js, sim/transitions.js). Adding an ability =
// define it here + handle it there.
//   tag   groups abilities (drives colour + the small visual mark on a piece)
//   live  whether the mechanic is already wired up (false = shown as "bald")
//   once  one-shot per match (otherwise passive/repeatable)
export const TAGS = {
  move:    { nameDe: "Bewegung",   nameEn: "Movement", color: "#3d9bff" },
  ranged:  { nameDe: "Fernkampf",  nameEn: "Ranged",   color: "#ffb454" },
  blink:   { nameDe: "Sprung",     nameEn: "Blink",    color: "#a78bfa" },
  sustain: { nameDe: "Zähigkeit",  nameEn: "Sustain",  color: "#3ad98a" },
  aoe:     { nameDe: "Fläche",     nameEn: "Area",     color: "#ff8a4c" },
  control: { nameDe: "Kontrolle",  nameEn: "Control",  color: "#ff5d8f" },
  promo:   { nameDe: "Krönung",    nameEn: "Promotion", color: "#ffd166" },
  trick:   { nameDe: "List",       nameEn: "Trickery",  color: "#e3c07a" },
};

export const ABILITIES = {
  // ── movement (live) ──
  pawn_sidestep:        { id: "pawn_sidestep",        icon: "↔", tag: "move", once: true,  live: true,  nameDe: "Ausweichen",   nameEn: "Sidestep",       descDe: "Darf 1× ein Feld zur Seite ziehen (ohne zu schlagen).", descEn: "Step one square sideways once (no capture)." },
  pawn_forward_capture: { id: "pawn_forward_capture", icon: "⤒", tag: "move", once: true,  live: true,  nameDe: "Stoßschlag",   nameEn: "Forward strike", descDe: "Darf 1× gerade nach vorn schlagen.",                  descEn: "Capture straight forward once." },
  pawn_charge:          { id: "pawn_charge",          icon: "⇈", tag: "move", once: false, live: true,  nameDe: "Sturmlauf",    nameEn: "Charge",         descDe: "Darf jederzeit zwei Felder vorrücken (Weg frei).",    descEn: "Advance two squares anytime (path clear)." },
  pawn_backstep:        { id: "pawn_backstep",        icon: "⇩", tag: "move", once: true,  live: true,  nameDe: "Rückzug",      nameEn: "Backstep",       descDe: "Darf 1× ein Feld zurückziehen.",                      descEn: "Retreat one square once." },
  dragon_flight:        { id: "dragon_flight",        icon: "🜁", tag: "wing",  once: true,  live: true, nameDe: "Fliegen", nameEn: "Flight",
    descDe: "EINMAL pro Partie springt der Drache als ganzer 2×2-Block bis zu 2 Felder weit. Landet er auf Gegnern, trifft er JEDES bedeckte Feld direkt — überleben nicht alle Getroffenen, fällt er auf sein Ursprungsfeld zurück (der Schlag zählt trotzdem).",
    descEn: "ONCE per game the dragon leaps as a full 2×2 block, up to 2 squares. Landing on foes strikes EVERY covered square directly - unless all struck foes fall, he is thrown back to where he took off (the strike still counts)." },
  dragon_flight2:       { id: "dragon_flight2",       icon: "🜁", tag: "wing",  once: false, live: true, nameDe: "Weite Schwingen", nameEn: "Wide wings",
    descDe: "Die Flug-Reichweite wächst auf 3 Felder.", descEn: "Flight range grows to 3 squares." },
  dragon_flight3:       { id: "dragon_flight3",       icon: "🜁", tag: "wing",  once: false, live: true, nameDe: "Sturmschwingen", nameEn: "Storm wings",
    descDe: "Die Flug-Reichweite wächst auf 4 Felder.", descEn: "Flight range grows to 4 squares." },
  pawn_early_promo:     { id: "pawn_early_promo",     icon: "★", tag: "promo", once: false, live: true, nameDe: "Frühe Krönung", nameEn: "Early crown",   descDe: "Wandelt eine Reihe früher um.",                       descEn: "Promotes one rank earlier." },
  knight_longleap:      { id: "knight_longleap",      icon: "⤢", tag: "move", once: false, live: true,  nameDe: "Weitsprung",   nameEn: "Long leap",      descDe: "Zusätzliche, weitere Springer-Sprünge.",              descEn: "Extra, longer knight jumps." },
  knight_outrider:      { id: "knight_outrider",      icon: "◆", tag: "move", once: false, live: true,  nameDe: "Vorreiter",    nameEn: "Outrider",       descDe: "Zusätzliche diagonale Weitsprünge.",                  descEn: "Extra diagonal long jumps." },
  bishop_hop:           { id: "bishop_hop",           icon: "⟿", tag: "move", once: true,  live: true,  nameDe: "Phase",        nameEn: "Phase",          descDe: "Darf 1× über eine angrenzende Figur springen.",       descEn: "Hop over one adjacent piece once." },
  bishop_ortho_step:    { id: "bishop_ortho_step",    icon: "✜", tag: "move", once: true,  live: true,  nameDe: "Wachschritt",  nameEn: "Guard step",     descDe: "Darf 1× ein Feld gerade ziehen.",                     descEn: "Step one square orthogonally once." },
  rook_diag_step:       { id: "rook_diag_step",       icon: "✛", tag: "move", once: false, live: true,  nameDe: "Sturmschritt", nameEn: "Storm step",     descDe: "Darf zusätzlich ein Feld diagonal ziehen.",           descEn: "Also step one square diagonally." },
  rook_breach:          { id: "rook_breach",          icon: "⊕", tag: "move", once: true,  live: true,  nameDe: "Durchbruch",   nameEn: "Breach",         descDe: "Darf 1× über eine angrenzende Figur springen.",       descEn: "Leap over one adjacent piece once." },
  queen_knightleap:     { id: "queen_knightleap",     icon: "✦", tag: "move", once: true,  live: true,  nameDe: "Hofsprung",    nameEn: "Court leap",     descDe: "Darf 1× wie ein Springer ziehen.",                    descEn: "Move like a knight once." },
  king_dash:            { id: "king_dash",            icon: "»", tag: "move", once: true,  live: true,  nameDe: "Königsflucht", nameEn: "King dash",      descDe: "Darf 1× zwei Felder gerade ziehen.",                  descEn: "Move two squares straight once." },

  // ── ranged (live) ──
  ranged_shot:          { id: "ranged_shot",          icon: "➶", tag: "ranged", once: true,  live: true, nameDe: "Scharfschuss", nameEn: "Snipe",        descDe: "Trifft 1× eine Figur in Sichtlinie aus der Ferne — du bleibst stehen.", descEn: "Hit a piece in line of sight from afar once — you stay put." },
  ranged_volley:        { id: "ranged_volley",        icon: "⁂", tag: "ranged", once: false, live: true, nameDe: "Dauerfeuer",   nameEn: "Volley",        descDe: "Darf jederzeit aus der Ferne in Sichtlinie schießen, ohne zu ziehen.", descEn: "May fire from afar in line of sight anytime, without moving." },

  // ── blink (live) ──
  gambit_masquerade:    { id: "gambit_masquerade",    icon: "🎭", tag: "trick", once: false, live: true, nameDe: "Maskerade",    nameEn: "Masquerade",    descDe: "Der Grand Gambit trägt kein Wappen mehr — für den Gegner ist er von jedem Bauern ununterscheidbar.", descEn: "The Grand Gambit sheds his crest — to the enemy he is indistinguishable from any pawn." },
  teleport:             { id: "teleport",             icon: "✸", tag: "blink", once: true,  live: true, nameDe: "Blinzeln",     nameEn: "Blink",         descDe: "Teleportiert 1× auf ein freies Feld in der Nähe.",     descEn: "Teleport to a nearby empty square once." },

  // ── sustain (live) ──
  lifesteal:            { id: "lifesteal",            icon: "❦", tag: "sustain", once: false, live: true, nameDe: "Lebensraub",  nameEn: "Lifesteal",     descDe: "Heilt sich beim Schaden zufügen um die Hälfte des Schadens.", descEn: "Heals for half the damage it deals." },
  regen:                { id: "regen",                icon: "✚", tag: "sustain", once: false, live: true, nameDe: "Regeneration", nameEn: "Regen",        descDe: "Heilt 1 HP, wann immer sie zieht.",                   descEn: "Heals 1 HP whenever it moves." },
  bulwark:              { id: "bulwark",              icon: "⛨", tag: "sustain", once: false, live: true, nameDe: "Bollwerk",     nameEn: "Bulwark",       descDe: "Erleidet 1 Schaden weniger pro Treffer.",             descEn: "Takes 1 less damage per hit." },

  // ── upcoming (shown in the tree, mechanic rolling out) ──
  blast:                { id: "blast",                icon: "✺", tag: "aoe", once: true,  live: false, nameDe: "Schockwelle",  nameEn: "Blast",          descDe: "Ein Angriff trifft auch alle angrenzenden Gegner.",   descEn: "An attack also hits all adjacent enemies." },
  chain:                { id: "chain",                icon: "↯", tag: "aoe", once: true,  live: false, nameDe: "Kettenblitz",  nameEn: "Chain",          descDe: "Schaden springt auf einen weiteren nahen Gegner über.", descEn: "Damage arcs to another nearby enemy." },
  pull:                 { id: "pull",                 icon: "⇲", tag: "control", once: true, live: false, nameDe: "Enterhaken",  nameEn: "Hook",           descDe: "Zieht einen Gegner in Sichtlinie zu dir heran.",      descEn: "Pulls an enemy in line toward you." },
};
