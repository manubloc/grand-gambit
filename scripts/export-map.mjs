// Exports the campaign map of one or more leagues as standalone SVG files —
// full scenery, trails, medallions — for editing in Inkscape/Illustrator or
// as poster/marketing art.  Usage:
//   npm run map:svg                      → leagues 1,4,9,10 → assets/map-export/
//   LEAGUES=2 npm run map:svg            → just league 2
//   LEAGUES=1,2,3,4,5,6,7,8,9,10 npm run map:svg
// NOTE: this is a SNAPSHOT for viewing/editing outside the game. The live map
// is assembled procedurally from assets/scenery/*.svg — edit THOSE files to
// change what the game draws.
import { execSync } from "child_process";
import { mkdirSync } from "fs";
mkdirSync("assets/map-export", { recursive: true });
execSync("node_modules/.bin/esbuild preview_leagues.jsx --bundle --platform=node --jsx=automatic --outfile=.pl.mjs --format=esm --external:react --external:react-dom --log-level=error");
execSync("node .pl.mjs", { stdio: "inherit", env: { ...process.env, OUT: "assets/map-export", LEAGUES: process.env.LEAGUES || "1,4,9,10" } });
execSync("rm -f .pl.mjs");
