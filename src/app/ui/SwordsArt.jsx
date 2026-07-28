// ── DAS KAMPFZEICHEN ────────────────────────────────────────────────────────
// Zwei gekreuzte Klingen fuer alles, was eine PARTIE beginnt - das Wappen mit
// der Figur blieb dem Feldzug, aber "Schnelles Spiel" ist kein Haus, sondern
// ein Duell. Handgesetzt im Stil der Siegel: Goldverlauf, dunkle Goldkontur.
export function SwordsArt({ size = 56 }) {
  return (
    <svg width={size} height={Math.round(size * 1.18)} viewBox="0 0 24 28" aria-hidden
      style={{ display: "block", filter: "drop-shadow(0 2px 4px rgba(0,0,0,.5)) drop-shadow(0 0 6px rgba(240,206,122,.25))" }}>
      <defs>
        <linearGradient id="ggSwG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6dfa0" /><stop offset="55%" stopColor="#dcb668" /><stop offset="100%" stopColor="#a87f36" />
        </linearGradient>
        <linearGradient id="ggSwB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8ecf4" /><stop offset="60%" stopColor="#aeb8c8" /><stop offset="100%" stopColor="#6f7b8e" />
        </linearGradient>
      </defs>
      {/* Klinge links unten -> rechts oben */}
      <g stroke="#5c4318" strokeWidth=".9" strokeLinejoin="round" strokeLinecap="round">
        <path d="M4.6 23.4 L17.8 7.6 L19.6 4.4 L19.9 6.9 L6.8 22.6 Z" fill="url(#ggSwB)" />
        <path d="M19.6 4.4 L19.9 6.9 L20.9 5.7 Z" fill="#f2f5fa" />
        {/* Parierstange + Griff */}
        <path d="M3.3 20.6 L7.6 24.4" fill="none" stroke="url(#ggSwG)" strokeWidth="1.7" />
        <path d="M4.9 23 L2.6 25.6" fill="none" stroke="#8a6a2e" strokeWidth="1.5" />
        <circle cx="2.2" cy="26.1" r="1.15" fill="url(#ggSwG)" />
      </g>
      {/* Klinge rechts unten -> links oben */}
      <g stroke="#5c4318" strokeWidth=".9" strokeLinejoin="round" strokeLinecap="round">
        <path d="M19.4 23.4 L6.2 7.6 L4.4 4.4 L4.1 6.9 L17.2 22.6 Z" fill="url(#ggSwB)" />
        <path d="M4.4 4.4 L4.1 6.9 L3.1 5.7 Z" fill="#f2f5fa" />
        <path d="M20.7 20.6 L16.4 24.4" fill="none" stroke="url(#ggSwG)" strokeWidth="1.7" />
        <path d="M19.1 23 L21.4 25.6" fill="none" stroke="#8a6a2e" strokeWidth="1.5" />
        <circle cx="21.8" cy="26.1" r="1.15" fill="url(#ggSwG)" />
      </g>
      {/* der Kreuzungspunkt traegt einen kleinen Goldnagel */}
      <circle cx="12" cy="14.9" r="1.3" fill="url(#ggSwG)" stroke="#5c4318" strokeWidth=".8" />
    </svg>
  );
}
