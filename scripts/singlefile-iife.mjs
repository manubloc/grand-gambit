// Post-build: the single-file HTML ships inline ES module script(s). Some
// sandboxed viewers (chat previews, strict WebViews) refuse module scripts —
// so we re-bundle that inline code as ONE classic IIFE and swap it in. The
// result runs anywhere a plain <script> tag runs, file:// included.
import { readFileSync, writeFileSync, unlinkSync } from "fs";
import { execSync } from "child_process";

const path = "dist-single/index.html";
let html = readFileSync(path, "utf8");

const re = /<script type="module"[^>]*>([\s\S]*?)<\/script>/g;
const blocks = [...html.matchAll(re)];
if (blocks.length === 0) { console.log("no module script found — nothing to do"); process.exit(0); }

// Deduplicate identical blocks, keep source order.
const seen = new Set();
const sources = [];
for (const b of blocks) if (!seen.has(b[1])) { seen.add(b[1]); sources.push(b[1]); }

writeFileSync(".sf-in.mjs", sources.join("\n;\n"));
execSync("node_modules/.bin/esbuild .sf-in.mjs --bundle --format=iife --platform=browser --minify --outfile=.sf-out.js --log-level=error");
const iife = readFileSync(".sf-out.js", "utf8");

// Guard: a raw </script> inside the code would terminate our inline tag early
// in the browser's HTML parser. esbuild normally escapes it — enforce anyway.
const safeIife = iife.replace(/<\/script/g, "<\\/script");

// Classic scripts execute where they stand — a module in <head> was deferred,
// our IIFE would run before <body> exists. So: strip the module blocks and
// inject the IIFE right before </body>, after #root is parsed.
// IMPORTANT: splice by index — String.replace() treats $&, $', $` in the
// REPLACEMENT as patterns, and minified code is full of "$&&" (variable $
// followed by &&), which silently corrupted the bundle.
html = html.replace(re, "");
const at = html.lastIndexOf("</body>");
if (at === -1) throw new Error("no </body> in dist html");
html = html.slice(0, at) + "<script>\n" + safeIife + "\n</script>\n" + html.slice(at);
writeFileSync(path, html);
unlinkSync(".sf-in.mjs"); unlinkSync(".sf-out.js");
console.log(`single-file: ${blocks.length} module block(s) -> 1 classic IIFE (${Math.round(iife.length / 1024)} KB)`);
