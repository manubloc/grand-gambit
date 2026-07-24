#!/usr/bin/env python3
# GRAND GAMBIT Bildgenerator: liest PROMPTS-COPYPASTE.md, ruft die OpenAI
# Images-API (gpt-image-1) und legt PNGs unter out/ ab. Key NUR aus der
# Umgebung ($OPENAI_API_KEY) — nie in Dateien, nie im Repo.
import os, re, sys, json, time, base64, urllib.request

KEY = os.environ.get("OPENAI_API_KEY")
if not KEY: sys.exit("OPENAI_API_KEY fehlt")
CAT = next((c for c in ["/home/claude/repo/design/PROMPTS-COPYPASTE.md",
  "design/PROMPTS-COPYPASTE.md", "/mnt/user-data/uploads/PROMPTS-COPYPASTE.md",
  "/mnt/user-data/outputs/PROMPTS-COPYPASTE.md"] if os.path.exists(c)), None)
if not CAT: sys.exit("PROMPTS-COPYPASTE.md nicht gefunden")
src = open(CAT).read()
blocks = re.split(r"\n(?=### \d{3} — )", src.split("\n---\n", 1)[1])
items = []
for b in blocks:
    m = re.match(r"### (\d{3}) — ([^\n·]+)", b)
    f = re.search(r"Datei: `([^`]+)`", b)
    p = re.search(r"```\n(.*?)\n```", b, re.S)
    if m and p:
        num = m.group(1); prompt = p.group(1).strip()
        fname = (f.group(1) if f else f"block-{num}.png")
        alpha = "transparent background" in prompt
        # Format aus dem Prompt ableiten
        size = "1024x1024"
        if "16:9" in prompt or "1200x630" in prompt or "8:1" in prompt: size = "1536x1024"
        if "9:16" in prompt: size = "1024x1536"
        items.append((num, m.group(2).strip(), fname, prompt, alpha, size))

want = sys.argv[1:] or ["001","002","003","004","005","006","007","058"]  # Pilot
quality = os.environ.get("Q", "high")
os.makedirs("out", exist_ok=True)
sel = [it for it in items if it[0] in want]
print(f"{len(sel)} Bilder, Qualitaet={quality}")
for num, title, fname, prompt, alpha, size in sel:
    outp = f"out/{fname}"
    if os.path.exists(outp): print(num, "uebersprungen (existiert)"); continue
    body = {"model": "gpt-image-1", "prompt": prompt, "size": size, "quality": quality, "n": 1}
    if alpha: body["background"] = "transparent"
    req = urllib.request.Request("https://api.openai.com/v1/images/generations",
        data=json.dumps(body).encode(), method="POST",
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                data = json.loads(r.read())
            img = base64.b64decode(data["data"][0]["b64_json"])
            open(outp, "wb").write(img)
            print(num, title, "->", fname, f"{len(img)//1024} KB")
            break
        except urllib.error.HTTPError as e:
            msg = e.read().decode()[:300]
            print(num, "HTTP", e.code, msg)
            if e.code in (429, 500, 502, 503) and attempt < 3:
                time.sleep(15 * (attempt + 1)); continue
            if "verif" in msg.lower(): sys.exit("Organisation nicht verifiziert — DALL-E-3-Fallback noetig, sag mir Bescheid")
            break
        except Exception as e:
            print(num, "Fehler:", e); time.sleep(10)
    time.sleep(2)
print("fertig -> /home/claude/gen/out/")
