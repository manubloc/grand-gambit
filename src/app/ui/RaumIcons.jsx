// ── DIE RAUM-ZEICHEN ────────────────────────────────────────────────────────
// Besitzer (v0.74.1): kleine Icons in den violetten Schienen-Knoepfen -
// Figuren, Aufstellung, Schatzkammer, Haendler. Bewusst als Vektor gezeichnet
// (nicht als Bild): sie sitzen winzig neben Text, muessen bei 14 px lesbar
// bleiben und die Farbe des Knopfes annehmen (an = hell, aus = gedimmt).
// Linienstaerke und Rundungen folgen der geschnitzten Formsprache: gedrungene
// Silhouetten, weiche Schultern, keine spitzen Haarlinien.

const G = { fill: "none", stroke: "currentColor", strokeWidth: 1.6,
  strokeLinecap: "round", strokeLinejoin: "round" };

/** Der Hof: zwei Figuren nebeneinander, die vordere mit Krone. */
export function FigurenIc({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden focusable="false">
      {/* hintere Figur, angeschnitten */}
      <g {...G} opacity="0.55">
        <circle cx="13.4" cy="6.4" r="1.9" />
        <path d="M10.6 15.6c0-2.2 1.3-3.6 2.8-3.6s2.8 1.4 2.8 3.6" />
      </g>
      {/* vordere Figur mit Krone */}
      <g {...G}>
        <path d="M4.2 4.6l1.5 1.5 1.6-2 1.6 2 1.5-1.5-.7 3.1H4.9z" />
        <circle cx="7.3" cy="9.9" r="1.6" />
        <path d="M3.9 16.4c0-2.4 1.5-4 3.4-4s3.4 1.6 3.4 4z" />
      </g>
    </svg>
  );
}

/** Die Aufstellung: ein Brettausschnitt, drei Felder besetzt. */
export function AufstellungIc({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden focusable="false">
      <rect x="2.6" y="2.6" width="14.8" height="14.8" rx="2.2" {...G} />
      <path d="M7.5 2.6v14.8M12.5 2.6v14.8M2.6 7.5h14.8M2.6 12.5h14.8" {...G} strokeWidth="1" opacity="0.5" />
      <circle cx="5" cy="15" r="1.5" fill="currentColor" />
      <circle cx="10" cy="10" r="1.5" fill="currentColor" />
      <circle cx="15" cy="5" r="1.5" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

/** Die Schatzkammer: eine Truhe mit Beschlag. */
export function SchatzIc({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden focusable="false">
      <path d="M3 8.6c0-2.4 3.1-3.8 7-3.8s7 1.4 7 3.8" {...G} />
      <rect x="3" y="8.6" width="14" height="6.6" rx="1.5" {...G} />
      <path d="M3 11.2h14" {...G} strokeWidth="1.2" />
      <rect x="8.7" y="9.9" width="2.6" height="3.1" rx=".8" fill="currentColor" />
    </svg>
  );
}

/** Der Händler: Verkaufsstand mit gezacktem Baldachin und Fläschchen. */
export function HaendlerIc({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden focusable="false">
      <path d="M2.6 6.4h14.8l-1.1-2.6H3.7z" {...G} />
      <path d="M2.6 6.4l1.5 1.6 1.5-1.6 1.5 1.6 1.5-1.6 1.5 1.6 1.5-1.6 1.5 1.6 1.5-1.6"
        {...G} strokeWidth="1.2" opacity="0.75" />
      <path d="M4.2 16.6v-4.3h11.6v4.3" {...G} />
      <path d="M3.2 12.3h13.6" {...G} strokeWidth="1.4" />
      <path d="M9.2 8.9h1.6v1l.9 1.2H8.3l.9-1.2z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}
