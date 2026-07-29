// ── DIE ZEICHEN DER DREI WEGE ───────────────────────────────────────────────
// Feldzug und Fernduell trugen bis v0.40 GEMALTE Wappenbilder, waehrend das
// Schnelle Spiel laengst ein handgesetztes Siegel war (SwordsArt.jsx) - drei
// Karten, zwei Handschriften. Hier stehen die fehlenden zwei, gezeichnet statt
// erzeugt: gleiche Bauart wie die Klingen (Goldverlauf, dunkle Goldkontur,
// derselbe Schattenwurf), aber jede mit EINER eigenen Leitfarbe, damit die
// Wege sich auf einen Blick unterscheiden - Bernstein fuer den Feldzug,
// Violett fuer den Riss.
//
// WARUM VEKTOR: kleine, harte Zeichen aus dem Bildmodell bekommen fast immer
// eine Platte untergeschoben (die Falle steht in zwei Uebergaben). Aus
// Primitiven gezeichnet sind sie plattenfrei per Konstruktion, nehmen jede
// Groesse an und kosten kein einziges Byte Bild.

const SCHATTEN = (schein) =>
  `drop-shadow(0 2px 4px rgba(0,0,0,.5)) drop-shadow(0 0 6px ${schein})`;

/** Feldzug: die Standarte des Wanderers - Stange, Schwalbenschwanz-Wimpel mit
 *  eingelassenem Stern, ein Wegstueck als Sockel. */
export function CampaignArt({ size = 56 }) {
  return (
    <svg width={size} height={Math.round(size * 1.18)} viewBox="0 0 24 28" aria-hidden
      style={{ display: "block", filter: SCHATTEN("rgba(240,206,122,.3)") }}>
      <defs>
        <linearGradient id="ggCampG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6dfa0" /><stop offset="55%" stopColor="#dcb668" /><stop offset="100%" stopColor="#a87f36" />
        </linearGradient>
        <linearGradient id="ggCampW" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f4b45c" /><stop offset="52%" stopColor="#d3722c" /><stop offset="100%" stopColor="#8d3f13" />
        </linearGradient>
      </defs>
      {/* der Weg: zwei Stufen aus Stein, auf denen die Stange steckt */}
      <g stroke="#4a3512" strokeWidth=".9" strokeLinejoin="round">
        <path d="M3.4 26.4 L20.6 26.4 L18.4 23.6 L5.6 23.6 Z" fill="url(#ggCampG)" opacity=".85" />
        <path d="M6.4 23.6 L17.6 23.6 L16.2 21.2 L7.8 21.2 Z" fill="url(#ggCampG)" opacity=".6" />
      </g>
      {/* die Stange */}
      <path d="M11.2 2.2 L12.8 2.2 L12.8 22.4 L11.2 22.4 Z" fill="url(#ggCampG)" stroke="#4a3512" strokeWidth=".8" strokeLinejoin="round" />
      <circle cx="12" cy="1.9" r="1.5" fill="url(#ggCampG)" stroke="#4a3512" strokeWidth=".8" />
      {/* der Wimpel mit Schwalbenschwanz - die Leitfarbe des Feldzugs */}
      <path d="M12.8 3.9 L22.4 6.4 L19.6 9.3 L22.4 12.2 L12.8 14.7 Z"
        fill="url(#ggCampW)" stroke="#4a2008" strokeWidth=".9" strokeLinejoin="round" />
      {/* der Wanderstern, in den Wimpel eingelassen */}
      <path d="M16.4 6.6 L17.4 8.6 L19.6 8.9 L18 10.4 L18.4 12.5 L16.4 11.5 L14.4 12.5 L14.8 10.4 L13.2 8.9 L15.4 8.6 Z"
        fill="#fbecc4" stroke="#4a2008" strokeWidth=".45" strokeLinejoin="round" />
      {/* Gegenwimpel-Kante links: gibt der Stange Halt im Bild */}
      <path d="M11.2 4.6 L8.2 5.6 L8.2 7.4 L11.2 8.4 Z" fill="url(#ggCampG)" stroke="#4a3512" strokeWidth=".7" strokeLinejoin="round" />
    </svg>
  );
}

/** Fernduell: das Risstor - ein Spitzbogen aus Stein, im Inneren der offene
 *  Riss, davor zwei Marken, die einander gegenueberstehen. */
export function DuelArt({ size = 56 }) {
  return (
    <svg width={size} height={Math.round(size * 1.18)} viewBox="0 0 24 28" aria-hidden
      style={{ display: "block", filter: SCHATTEN("rgba(139,92,246,.45)") }}>
      <defs>
        <linearGradient id="ggDuelG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6dfa0" /><stop offset="55%" stopColor="#dcb668" /><stop offset="100%" stopColor="#a87f36" />
        </linearGradient>
        <linearGradient id="ggDuelR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e7ddff" /><stop offset="40%" stopColor="#a78bfa" /><stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
      </defs>
      {/* das Rissfeld im Bogen */}
      <path d="M12 4.2 C17 4.2 19.6 8 19.6 12.4 L19.6 22.6 L4.4 22.6 L4.4 12.4 C4.4 8 7 4.2 12 4.2 Z"
        fill="url(#ggDuelR)" stroke="#2c1264" strokeWidth=".9" strokeLinejoin="round" />
      {/* der Spalt: ein heller Blitz mitten im Tor */}
      <path d="M12.9 7.4 L10.2 14.2 L12.1 14.2 L10.9 20.4 L14.2 13.2 L12.1 13.2 Z"
        fill="#fbf8ff" stroke="#5b21b6" strokeWidth=".5" strokeLinejoin="round" opacity=".95" />
      {/* der steinerne Bogen darum - in Gold, wie jedes Siegel des Hauses */}
      <path d="M12 2.4 C18.2 2.4 21.4 6.9 21.4 12.4 L21.4 23 L18.4 23 L18.4 12.4 C18.4 8.4 16.1 5.4 12 5.4 C7.9 5.4 5.6 8.4 5.6 12.4 L5.6 23 L2.6 23 L2.6 12.4 C2.6 6.9 5.8 2.4 12 2.4 Z"
        fill="url(#ggDuelG)" stroke="#4a3512" strokeWidth=".9" strokeLinejoin="round" />
      {/* Sockel */}
      <path d="M1.6 26.2 L22.4 26.2 L20.8 23 L3.2 23 Z" fill="url(#ggDuelG)" stroke="#4a3512" strokeWidth=".9" strokeLinejoin="round" />
      {/* zwei Marken, die einander gegenueberstehen: hell gegen dunkel */}
      <circle cx="8.4" cy="19.4" r="2.5" fill="#f6efdf" stroke="#4a3512" strokeWidth=".85" />
      <circle cx="15.6" cy="19.4" r="2.5" fill="#160f2c" stroke="#4a3512" strokeWidth=".85" />
    </svg>
  );
}

/** Die Marke auf dem Knopf "Partie starten". Vorher sass dort die BLAUE
 *  Kraftkugel des Bretts - ein kaltes Blau mitten auf dem goldenen Griff.
 *  Jetzt zwei winzige Klingen in der Tintenfarbe des Knopfes, also dasselbe
 *  Zeichen wie auf der Karte "Schnelles Spiel", nur klein und einfarbig. */
export function StartMark({ size = 15, color = "#17110a" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden
      style={{ display: "inline-block", verticalAlign: "-0.16em" }}>
      <g stroke={color} strokeWidth="2.4" strokeLinecap="round" fill="none">
        <path d="M5.2 19.4 L17.6 5.6" />
        <path d="M18.8 19.4 L6.4 5.6" />
      </g>
      <g fill={color}>
        <circle cx="4.2" cy="20.4" r="1.9" />
        <circle cx="19.8" cy="20.4" r="1.9" />
      </g>
      <circle cx="12" cy="12.5" r="1.7" fill={color} />
    </svg>
  );
}
