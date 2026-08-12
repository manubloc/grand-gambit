// ── KEIN DATEINAME DARF DEN BAU BRECHEN (v1.0.69) ──────────────────────────
// Der CI-Lauf scheiterte am Artefakt-Upload: 73 Figurenbilder hiessen
// woertlich "NNN_?.png" - unter Linux erlaubt, fuer NTFS und damit fuer
// GitHubs Artefaktspeicher verboten. Der Fehler lag MONATE unsichtbar im
// Baum, weil lokal alles lief; erst der Upload deckte ihn auf.
// Diese Probe laeuft als erste Suite der Kette und prueft JEDEN Dateinamen,
// den git kennt, gegen die Verbotsliste des Artefaktspeichers:
//   " : < > | * ?  sowie Wagenruecklauf und Zeilenvorschub.
// Sie liest git ls-files, nicht das Dateisystem - was nicht eingecheckt ist
// (dist, node_modules), kann den Bau auf GitHub auch nicht brechen.
import { execFileSync } from "node:child_process";

let pass = 0, fail = 0;
const ok = (name, cond) => {
  if (cond) { pass++; console.log("  ok  -", name); }
  else { fail++; console.log("  not ok -", name); }
};

console.log("\n== pruefe-dateinamen: die Verbotsliste des Artefaktspeichers ==");
// -z trennt mit NUL: nur so ueberleben Namen mit Zeilenumbruechen die Messung.
const roh = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" });
const dateien = roh.split("\0").filter(Boolean);
ok("git kennt Dateien (Messung nicht leer)", dateien.length > 500);

const VERBOTEN = /["\u003a<>|*?\r\n]/;   // " : < > | * ? \r \n
const suender = dateien.filter((f) => VERBOTEN.test(f));
ok("kein eingecheckter Dateiname traegt \" : < > | * ? oder Zeilenumbrueche",
  suender.length === 0);
if (suender.length) for (const s of suender.slice(0, 10)) console.log("      >", JSON.stringify(s));

// Die Namensform der einst kaputten Gruppe bleibt festgehalten: die 73
// umgetauften Bilder heissen jetzt NNN_unbenannt.png - vorhanden und sauber.
const getauft = dateien.filter((f) => /archiv\/bilder\/figuren\/\d{3}_unbenannt\.png$/.test(f));
ok("die 73 umgetauften Figurenbilder stehen unter ihrem neuen Namen", getauft.length === 73);

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
