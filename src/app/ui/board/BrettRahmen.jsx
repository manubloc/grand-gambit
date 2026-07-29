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
        <animate attributeName="opacity" values="1;.35;1;1" dur="6.5s" begin={`${verzug}s`} repeatCount="indefinite" />
      </circle>
      <circle cx="3.6" cy="3.6" r="2.4" fill="none" stroke={GOLD_HELL} strokeWidth=".35" opacity="0">
        <animate attributeName="opacity" values="0;.75;0" dur="6.5s" begin={`${verzug}s`} repeatCount="indefinite" />
        <animate attributeName="r" values="1.2;3.4" dur="6.5s" begin={`${verzug}s`} repeatCount="indefinite" />
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
        {/* KURZE AUFGLAENZER statt Wanderglanz - Wunsch des Besitzers (v0.45):
            "eher hier oder da mal kurz aufglaenzen, nicht ueber den gesamten
            Rahmen laufen". Ein weicher Lichtfleck, der an drei Stellen der
            Leisten in langen Pausen kurz aufscheint. */}
        <radialGradient id={`${id}-funke`}>
          <stop offset="0%" stopColor="#fffdf4" stopOpacity=".9" />
          <stop offset="55%" stopColor="#fdeebc" stopOpacity=".35" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
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

      {/* Die Riss-Blitze sind fort - Wunsch des Besitzers (v0.45):
          "diese Blitze unbedingt weglassen". Der Vorsprung des Gegners
          spricht weiter ueber die violette Glut der Leisten, nur ohne
          Entladungen. */}
      {/* drei oertliche Aufglaenzer, auf die Leisten beschnitten: jeder lebt
          knapp eine Sekunde in einem 9-13-s-Takt, versetzt - nie im Chor */}
      <g clipPath={`url(#${id}-leisten)`}>
        {[[0.24, rand, 9.5, 0], [1 - 0.18, H / 2, 12.5, 4.2], [0.62, H - rand, 11, 7.6]].map(([px, py, takt, start], i) => (
          <circle key={i} cx={i === 1 ? W - rand : (W - 2 * rand) * px + rand} cy={i === 1 ? H * 0.42 : py}
            r={26} fill={`url(#${id}-funke)`} opacity="0">
            <animate attributeName="opacity" values="0;0;0;.8;0;0;0;0;0;0;0" dur={`${takt}s`}
              begin={`${start}s`} repeatCount="indefinite" />
          </circle>
        ))}
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
