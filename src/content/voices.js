// ── THE TALE OF THE RIFT ─────────────────────────────────────────────────────
// One court, once. Then the first League Master opened a rift to win a war he
// could not win — and the shadow has been calling ever since. The court
// shattered: some fled to guard what they knew, some liked what they heard.
// Every champion carries ONE sentence of this tale. Read along the campaign,
// the herald lines add up to the whole story; the answers only come to those
// who have beaten them. Heralds speak in the third person (the epic voice);
// after defeat, the figures address the Wanderer directly.
//
// Keyed by character id (champions) or boss id (b23 archenemy, b25 master).

export const VOICES = {
  // ── the shadow-drawn (Schatten) ────────────────────────────────────────────
  hawk: {
    heraldDe: "Man sagt, der Späher war der Erste, der den Riss am Himmel sah — und der Erste, der beschloss, niemandem davon zu erzählen.",
    heraldEn: "They say the Hawk was the first to see the rift in the sky — and the first to decide to tell no one.",
    afterDe: "Du hast schärfere Augen als ich, Wanderer. Dann sieh auch das: der Riss wächst, während wir hier reden.",
    afterEn: "Your eyes are sharper than mine, Wanderer. Then see this too: the rift grows while we stand here talking.",
  },
  assassin: {
    heraldDe: "Der Attentäter nahm keinen Auftrag mehr an, seit der Schatten ihm einen besseren gab: warten.",
    heraldEn: "The Assassin took no more contracts once the shadow offered him a better one: to wait.",
    afterDe: "Zweimal geschlagen — gut. Dann warte ich eben an deiner Seite weiter.",
    afterEn: "Beaten twice — fine. Then I shall keep waiting at your side.",
  },
  pathfinder: {
    heraldDe: "Der Pfadfinder kartierte jeden Weg des Reiches, bis er einen fand, der auf keine Karte gehört.",
    heraldEn: "The Pathfinder charted every road of the realm — until he found one that belongs on no map.",
    afterDe: "Nimm meine Karte, Wanderer. Aber versprich mir, den einen Weg darauf niemals zu gehen.",
    afterEn: "Take my map, Wanderer. But promise me you will never walk the one road on it.",
  },
  dragon: {
    heraldDe: "Der Drache schwor einst der Krone die Treue; der Riss fragte nicht nach Schwüren, nur nach Feuer.",
    heraldEn: "The Dragon once swore fealty to the Crown; the rift never asked for oaths, only for fire.",
    afterDe: "Drei Siege forderte mein Stolz von dir. Dein Feuer brennt heller als meines — führe mich.",
    afterEn: "My pride demanded three victories of you. Your fire burns brighter than mine — lead me.",
  },
  sorceress: {
    heraldDe: "Die Hexerin sah im Orakel das Ende dieser Geschichte — und beschloss, jedem einzelnen Kapitel im Weg zu stehen.",
    heraldEn: "The Sorceress saw the end of this tale in her orb — and resolved to stand in the way of every single chapter.",
    afterDe: "Ich habe dich kommen sehen, Wanderer. Ich wollte nur wissen, wie es sich anfühlt.",
    afterEn: "I saw you coming, Wanderer. I only wanted to know how it would feel.",
  },
  alchemist: {
    heraldDe: "Die Alchemistin destillierte einen einzigen Tropfen des Schattens — und verkauft seither an beide Seiten.",
    heraldEn: "The Alchemist distilled a single drop of the shadow — and has been selling to both sides ever since.",
    afterDe: "Ein Tropfen für dich, umsonst. Der zweite kostet — so bleibt es ehrlich zwischen uns.",
    afterEn: "One drop for you, free. The second has a price — that keeps us honest.",
  },
  warlock: {
    heraldDe: "Der Hexenmeister bat den Riss nie um Macht; er stellte Bedingungen, und der Riss unterschrieb.",
    heraldEn: "The Warlock never begged the rift for power; he set terms, and the rift signed.",
    afterDe: "Mein Vertrag hat eine Klausel für Stärkere. Glückwunsch, Wanderer — du bist sie.",
    afterEn: "My contract holds a clause for the stronger. Congratulations, Wanderer — that clause is you.",
  },
  amazon: {
    heraldDe: "Die Amazone focht auf jeder Seite dieses Krieges; nur eine hat sie nie betrogen — die eigene Klinge.",
    heraldEn: "The Amazon has fought on every side of this war; only one has never betrayed her — her own blade.",
    afterDe: "Meine Klinge wählt dich, Wanderer. Enttäusche sie nicht.",
    afterEn: "My blade chooses you, Wanderer. Do not disappoint it.",
  },
  strategist: {
    heraldDe: "Der Stratege hat diesen Feldzug längst zu Ende gedacht — er wartet nur noch darauf, dass die Welt nachzieht.",
    heraldEn: "The Strategist finished this campaign in his head long ago — he is merely waiting for the world to catch up.",
    afterDe: "Interessant. Diesen Zug hatte ich nicht. Noch einmal von vorn — diesmal an deiner Seite.",
    afterEn: "Interesting. That move I did not have. Once more from the top — this time at your side.",
  },
  captain: {
    heraldDe: "Der Kapitän segelte als Einziger bis an den Rand des Endlosen Meeres; was er dort sah, ließ ihn umkehren — und schweigen.",
    heraldEn: "The Captain alone sailed to the edge of the Endless Sea; what he saw there turned him back — and struck him silent.",
    afterDe: "Also gut, Wanderer. Ich setze noch einmal Segel dorthin — aber diesmal steuerst du.",
    afterEn: "Very well, Wanderer. I will set sail for it once more — but this time, you steer.",
  },

  // ── the crown-loyal (Krone) ────────────────────────────────────────────────
  mage: {
    heraldDe: "Der Magier versiegelte den ersten Spalt mit bloßer Hand — und zählt seither die Tage, bis das Siegel zu singen beginnt.",
    heraldEn: "The Mage sealed the first crack with his bare hand — and has counted the days ever since, waiting for the seal to sing.",
    afterDe: "Das Siegel hält noch, Wanderer. Frag mich nicht, wie lange.",
    afterEn: "The seal still holds, Wanderer. Do not ask me for how long.",
  },
  guardian: {
    heraldDe: "Der Wächter verließ seinen Posten nie — als der Hof zerbrach, trug er ihn einfach mit sich fort.",
    heraldEn: "The Guardian never abandoned his post — when the court shattered, he simply carried it with him.",
    afterDe: "Mein Posten ist jetzt dort, wo du stehst.",
    afterEn: "My post is now wherever you stand.",
  },
  bard: {
    heraldDe: "Der Barde sammelt die verstreuten Strophen des alten Liedes; in der letzten, heißt es, steht der Name des Verräters.",
    heraldEn: "The Bard gathers the scattered verses of the old song; the last one, they say, holds the traitor's name.",
    afterDe: "Für dich, Wanderer, schreibe ich die letzte Strophe um.",
    afterEn: "For you, Wanderer, I shall rewrite the final verse.",
  },
  paladin: {
    heraldDe: "Der Paladin jagt nicht den Schatten — er jagt die Stelle, an der ein Eid zum ersten Mal riss.",
    heraldEn: "The Paladin does not hunt the shadow — he hunts the place where an oath first tore.",
    afterDe: "Den Riss in meinem Eid hast du nicht verbreitert, Wanderer. Das genügt mir.",
    afterEn: "You did not widen the tear in my oath, Wanderer. That is enough for me.",
  },
  inquisitor: {
    heraldDe: "Der Inquisitor verhörte hundert Abtrünnige; die letzte Antwort stellte ihm die Fragen zurück.",
    heraldEn: "The Inquisitor questioned a hundred renegades; the final answer handed the questions back to him.",
    afterDe: "Keine weiteren Fragen. Dein Schwert hat geantwortet.",
    afterEn: "No further questions. Your sword has answered.",
  },
  archbishop: {
    heraldDe: "Der Erzbischof predigt noch immer das Licht — nur brennen seine Kerzen neuerdings ein wenig blau.",
    heraldEn: "The Archbishop still preaches the light — only his candles have lately begun to burn a little blue.",
    afterDe: "Dann trage du das Licht weiter, Wanderer. Meine Arme sind müde geworden.",
    afterEn: "Then you carry the light onward, Wanderer. My arms have grown weary.",
  },
  chancellor: {
    heraldDe: "Der Kanzler führt Buch über jeden Zoll des Reiches — und über eine einzige Schuld, die niemand tilgen kann.",
    heraldEn: "The Chancellor keeps ledgers on every toll of the realm — and on one single debt no one can repay.",
    afterDe: "Ich verbuche dich als Gewinn, Wanderer. Zum ersten Mal seit Jahren stimmt meine Bilanz.",
    afterEn: "I book you as profit, Wanderer. For the first time in years, my ledger balances.",
  },
  engineer: {
    heraldDe: "Der Ingenieur baute die Tore zwischen den Ligen — und weiß als Einziger, wohin sie sich wirklich öffnen.",
    heraldEn: "The Engineer built the gates between the leagues — and alone knows where they truly open.",
    afterDe: "Die Tore öffnen sich für dich, Wanderer. Frag nicht, womit ich sie geölt habe.",
    afterEn: "The gates will open for you, Wanderer. Do not ask what I oiled them with.",
  },
  standard: {
    heraldDe: "Die Standarte trägt das alte Banner des ungeteilten Hofes; wer ihr folgt, folgt einer Erinnerung.",
    heraldEn: "The Standard bears the old banner of the undivided court; whoever follows it follows a memory.",
    afterDe: "Das Banner erkennt seinen Träger, wenn es ihn sieht. Heb es auf, Wanderer.",
    afterEn: "The banner knows its bearer on sight. Pick it up, Wanderer.",
  },

  // ── the two who hold the tale together ─────────────────────────────────────
  b23: {
    heraldDe: "Sie war die erste Klinge der Krone, ehe der Riss ihren Namen flüsterte — jetzt flüstert sie ihn zurück.",
    heraldEn: "She was the Crown's first blade before the rift whispered her name — now she whispers it back.",
    afterDe: "Du hörst ihn inzwischen auch, nicht wahr, Wanderer? … Bis zum nächsten Brett.",
    afterEn: "You hear it too by now, don't you, Wanderer? … Until the next board.",
  },
  b25: {
    heraldDe: "Jeder Ligameister hütet ein Tor — und zahlt dem Riss die Miete in fremden Niederlagen.",
    heraldEn: "Every League Master keeps a gate — and pays the rift its rent in other people's defeats.",
    afterDe: "Das Tor gehört dir, Wanderer. Was dahinter wartet, hat mir nie gehört.",
    afterEn: "The gate is yours, Wanderer. What waits beyond it was never mine.",
  },
};

/** the voice of a match's boss: piece bosses by character id, monsters by boss id */
export function voiceFor(boss) {
  if (!boss) return null;
  const id = boss.bossId?.startsWith("pb_") ? boss.bossId.slice(3) : boss.bossId;
  return VOICES[id] || null;
}
