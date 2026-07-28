// ── DER RAHMEN DES BRETTS ────────────────────────────────────────────────────
// Gezeichnet statt gemalt: als SVG bleibt er in jeder Größe scharf und wiegt
// ein paar hundert Byte statt 300 KB. Vor allem aber LEBT er:
//
//   · GLANZ — ein Lichtpunkt wandert langsam an den Leisten entlang, wie ein
//     Schimmer über poliertes Metall. Immer da, nur leise.
//   · FUNKEN — an den vier Eckknoten glimmt es unregelmäßig auf.
//   · WETTER — je nachdem, wer auf dem Brett die Oberhand hat, ändert sich
//     der Rahmen: Führt DEINE Seite, wärmt sich das Gold und die untere
//     Leiste glimmt golden. Führt der GEGNER, kriecht Violett in die obere
//     Leiste und dort zucken Riss-BLITZE — je deutlicher sein Vorsprung,
//     desto häufiger.
//
// Die Übermacht kommt als Zahl `lage` herein: -1 (Gegner klar vorn) bis +1
// (du klar vorn), 0 = ausgeglichen.

const GOLD_HELL = "#f2ddab";
const GOLD = "#c89a4e";
const GOLD_TIEF = "#7d5417";
const RISS_HELL = "#e6dcff";
const RISS = "#a78bfa";

/** Eckknoten: Raute mit zwei Ranken; der Funke sitzt im Kern. */
function Ecke({ id, verzug }) {
  return (
    <g>
      <path d="M0 0 L8 0 L0 8 Z" fill={`url(#${id}-fl)`} opacity=".94" />
      <path d="M1.7 1.7 L5.8 1.7 L1.7 5.8 Z" fill="none" stroke={GOLD_HELL} strokeWidth=".4" opacity=".85" />
      <path d="M10 1.2 q4.5 .3 6 2.2 q-2.6 -.4 -3.7 .8 q1.6 .5 1.6 1.6 q-2 -.6 -3.9 .4"
        fill="none" stroke={`url(#${id}-fl)`} strokeWidth="1.1" strokeLinecap="round" />
      <path d="M1.2 10 q.3 4.5 2.2 6 q-.4 -2.6 .8 -3.7 q.5 1.6 1.6 1.6 q-.6 -2 .4 -3.9"
        fill="none" stroke={`url(#${id}-fl)`} strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="3.6" cy="3.6" r="1.05" fill={GOLD_HELL}>
        <animate attributeName="opacity" values="1;.35;1;1" dur="3.4s" begin={`${verzug}s`} repeatCount="indefinite" />
      </circle>
      <circle cx="3.6" cy="3.6" r="2.4" fill="none" stroke={GOLD_HELL} strokeWidth=".35" opacity="0">
        <animate attributeName="opacity" values="0;.75;0" dur="3.4s" begin={`${verzug}s`} repeatCount="indefinite" />
        <animate attributeName="r" values="1.2;3.4" dur="3.4s" begin={`${verzug}s`} repeatCount="indefinite" />
      </circle>
    </g>
  );
}

/** Die Lilie in der Seitenmitte, mit einem Riss-Funken im Herzen. */
function Lilie({ id, riss }) {
  return (
    <g>
      <path d="M0 -3.6 q1.6 1.6 1.6 3.6 q0 2 -1.6 3.6 q-1.6 -1.6 -1.6 -3.6 q0 -2 1.6 -3.6 Z" fill={`url(#${id}-fl)`} />
      <path d="M-2 0 q-3.8 -.5 -5.7 -2.4 q2.7 .5 4 -.7 q-1.5 1.7 -.5 3.1 Z" fill={`url(#${id}-fl)`} />
      <path d="M2 0 q3.8 -.5 5.7 -2.4 q-2.7 .5 -4 -.7 q1.5 1.7 .5 3.1 Z" fill={`url(#${id}-fl)`} />
      <path d="M-2 0 q-3.8 .5 -5.7 2.4 q2.7 -.5 4 .7 q-1.5 -1.7 -.5 -3.1 Z" fill={`url(#${id}-fl)`} />
      <path d="M2 0 q3.8 .5 5.7 2.4 q-2.7 -.5 -4 .7 q1.5 -1.7 .5 -3.1 Z" fill={`url(#${id}-fl)`} />
      <circle cx="0" cy="0" r=".9" fill={riss ? RISS_HELL : GOLD_HELL} opacity=".95" />
      <circle cx="0" cy="0" r="2" fill="none" stroke={riss ? RISS : GOLD_HELL} strokeWidth=".32" opacity=".5" />
    </g>
  );
}

/**
 * @param {number} lage  -1 (Gegner klar vorn) .. 0 .. +1 (du klar vorn)
 */
export function BrettRahmen({ id = "br", lage = 0, style }) {
  const W = 1000, H = 1000, rand = 26;   // eigenes Gitter, quadratisch
  const feind = Math.max(0, -lage);      // wie stark der Gegner führt
  const eigen = Math.max(0, lage);
  const blitzTakt = feind > 0.05 ? Math.max(2.4, 7 - feind * 5) : 0;   // Sekunden
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", ...style }}>
      <defs>
        <linearGradient id={`${id}-fl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GOLD_HELL} /><stop offset="46%" stopColor={GOLD} /><stop offset="100%" stopColor={GOLD_TIEF} />
        </linearGradient>
        {/* die Leisten: das Licht läuft QUER zur Leiste, so glänzt Metall */}
        <linearGradient id={`${id}-q`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GOLD_HELL} /><stop offset="34%" stopColor={GOLD} />
          <stop offset="66%" stopColor={GOLD_HELL} /><stop offset="100%" stopColor={GOLD_TIEF} />
        </linearGradient>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={GOLD_HELL} /><stop offset="34%" stopColor={GOLD} />
          <stop offset="66%" stopColor={GOLD_HELL} /><stop offset="100%" stopColor={GOLD_TIEF} />
        </linearGradient>
        {/* DER WANDERNDE GLANZ: ein heller Streifen zieht endlos um das Brett */}
        <linearGradient id={`${id}-glanz`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="42%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fffdf4" stopOpacity=".85" />
          <stop offset="58%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          <animate attributeName="x1" values="-1;1" dur="6.5s" repeatCount="indefinite" />
          <animate attributeName="x2" values="0;2" dur="6.5s" repeatCount="indefinite" />
        </linearGradient>
        <clipPath id={`${id}-leisten`}>
          <path d={`M${rand - 9} ${rand - 9} H${W - rand + 9} V${H - rand + 9} H${rand - 9} Z
                    M${rand + 9} ${rand + 9} V${H - rand - 9} H${W - rand - 9} V${rand + 9} Z`} fillRule="evenodd" />
        </clipPath>
      </defs>

      {/* dunkler Kanal für Tiefe */}
      <rect x={rand + 4} y={rand + 4} width={W - 2 * rand - 8} height={H - 2 * rand - 8}
        fill="none" stroke="rgba(18,10,3,.6)" strokeWidth="7" />

      {/* die vier Leisten */}
      <rect x={rand} y={rand - 8} width={W - 2 * rand} height="16" fill={`url(#${id}-q)`} />
      <rect x={rand} y={H - rand - 8} width={W - 2 * rand} height="16" fill={`url(#${id}-q)`} />
      <rect x={rand - 8} y={rand} width="16" height={H - 2 * rand} fill={`url(#${id}-s)`} />
      <rect x={W - rand - 8} y={rand} width="16" height={H - 2 * rand} fill={`url(#${id}-s)`} />

      {/* innere Haarlinie */}
      <rect x={rand + 26} y={rand + 26} width={W - 2 * (rand + 26)} height={H - 2 * (rand + 26)}
        fill="none" stroke={`url(#${id}-q)`} strokeWidth="4" />

      {/* WETTER: die Seite, die führt, färbt ihre Leiste */}
      {eigen > 0.05 && <rect x={rand} y={H - rand - 8} width={W - 2 * rand} height="16"
        fill={GOLD_HELL} opacity={Math.min(0.5, eigen * 0.55)}>
        <animate attributeName="opacity" values={`${Math.min(0.5, eigen * 0.55)};${Math.min(0.8, eigen * 0.85)};${Math.min(0.5, eigen * 0.55)}`}
          dur="3.2s" repeatCount="indefinite" />
      </rect>}
      {feind > 0.05 && <rect x={rand} y={rand - 8} width={W - 2 * rand} height="16"
        fill={RISS} opacity={Math.min(0.62, feind * 0.7)}>
        <animate attributeName="opacity" values={`${Math.min(0.62, feind * 0.7)};${Math.min(0.9, feind)};${Math.min(0.62, feind * 0.7)}`}
          dur="2.6s" repeatCount="indefinite" />
      </rect>}

      {/* DIE BLITZE DES GEGNERS: zucken an der oberen Leiste, je öfter, je
          klarer er führt. Drei Zacken mit versetztem Takt. */}
      {blitzTakt > 0 && [0.22, 0.5, 0.78].map((p, i) => {
        const x = rand + (W - 2 * rand) * p;
        return (
          <g key={i} opacity="0">
            <animate attributeName="opacity" values="0;1;0;0;0" dur={`${blitzTakt}s`} begin={`${i * 0.9}s`} repeatCount="indefinite" />
            <path d={`M${x} ${rand - 6} l-13 26 l11 -3 l-8 24 l24 -30 l-12 3 Z`}
              fill={RISS_HELL} stroke={RISS} strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx={x} cy={rand - 2} r="9" fill={RISS_HELL} opacity=".55" />
          </g>
        );
      })}

      {/* der wandernde Glanz, auf die Leisten beschnitten */}
      <g clipPath={`url(#${id}-leisten)`}>
        <rect x="0" y="0" width={W} height={H} fill={`url(#${id}-glanz)`} />
      </g>

      {/* Ecken und Lilien - in eigenen Gruppen, damit sie rund bleiben */}
      <g transform={`translate(${rand - 8} ${rand - 8})`}><Ecke id={id} verzug={0} /></g>
      <g transform={`translate(${W - rand + 8} ${rand - 8}) scale(-1 1)`}><Ecke id={id} verzug={1.1} /></g>
      <g transform={`translate(${rand - 8} ${H - rand + 8}) scale(1 -1)`}><Ecke id={id} verzug={2.2} /></g>
      <g transform={`translate(${W - rand + 8} ${H - rand + 8}) scale(-1 -1)`}><Ecke id={id} verzug={1.7} /></g>

      <g transform={`translate(${W / 2} ${rand}) scale(2.1)`}><Lilie id={id} riss={feind > 0.05} /></g>
      <g transform={`translate(${W / 2} ${H - rand}) scale(2.1) scale(1 -1)`}><Lilie id={id} riss={false} /></g>
      <g transform={`translate(${rand} ${H / 2}) rotate(90) scale(2.1)`}><Lilie id={id} riss={false} /></g>
      <g transform={`translate(${W - rand} ${H / 2}) rotate(-90) scale(2.1)`}><Lilie id={id} riss={false} /></g>
    </svg>
  );
}

/** Wer hat die Oberhand? Aus den Lebenspunkten beider Seiten, bezogen auf
 *  die eigene Farbe. Ergebnis -1 .. +1, gedämpft, damit der Rahmen nicht bei
 *  jedem Schlagabtausch flackert. */
export function lageAusBrett(board, meineFarbe = "w") {
  let mein = 0, sein = 0;
  for (const p of board || []) {
    if (!p) continue;
    const wert = (p.hp || 1) + (p.atk || 0);
    if (p.color === meineFarbe) mein += wert; else sein += wert;
  }
  if (!mein && !sein) return 0;
  const roh = (mein - sein) / Math.max(1, mein + sein);
  return Math.max(-1, Math.min(1, roh * 2.2));   // erst deutliche Vorsprünge zählen
}
