"""Das Hauszeichen als RUNDES Medaillon.

Warum prozedural statt generiert: ein App-Icon muss ein exakter Kreis sein —
gleiche Randstaerke ringsum, sauber freigestellt, mittig. Das kann kein
Bildmodell zuverlaessig, eine Rechnung schon. Die Figur im Inneren bleibt das
generierte geschnitzte Werk; nur die Fassung wird gebaut.

Aufbau von aussen nach innen:
  Goldring (mit Lichtkante oben links, Schatten unten rechts)
  dunkle Innenflaeche (das Feld, auf dem die Figur steht)
  feiner Goldstrich als Abschluss
  die Koenigsfigur, mittig, leicht hochgesetzt

4-fach ueberabgetastet, damit die Kreiskante glatt ist.
"""
from PIL import Image, ImageDraw, ImageFilter
import sys

S = 4                     # Ueberabtastung
D = 1024                  # Zielkante
Q = D * S
FIGUR = sys.argv[1] if len(sys.argv) > 1 else "/tmp/brand/emblem-a.png"
ZIEL  = sys.argv[2] if len(sys.argv) > 2 else "src/app/ui/assets/emblem.carved.webp"

GOLD_HELL = (246, 224, 150)
GOLD      = (201, 164, 92)
GOLD_TIEF = (122, 94, 40)
FELD_OBEN = (38, 52, 80)
FELD_UNTEN= (16, 23, 38)

lw = Image.new("RGBA", (Q, Q), (0, 0, 0, 0))
d  = ImageDraw.Draw(lw)
r  = Q // 2

# 1 — Goldring als voller Kreis
d.ellipse([0, 0, Q-1, Q-1], fill=GOLD + (255,))

# 2 — Bevel: heller Bogen oben links, dunkler unten rechts
d.pieslice([0, 0, Q-1, Q-1], 170, 350, fill=GOLD_HELL + (255,))
d.pieslice([0, 0, Q-1, Q-1], 350, 530, fill=GOLD_TIEF + (255,))
ring = int(Q * 0.088)     # Randstaerke

# 3 — Innenfeld mit senkrechtem Verlauf
feld = Image.new("RGBA", (Q, Q), (0, 0, 0, 0))
fd = ImageDraw.Draw(feld)
for y in range(ring, Q - ring):
    t = (y - ring) / max(1, (Q - 2*ring))
    c = tuple(int(FELD_OBEN[i] + (FELD_UNTEN[i] - FELD_OBEN[i]) * t) for i in range(3))
    fd.line([(0, y), (Q, y)], fill=c + (255,))
maske = Image.new("L", (Q, Q), 0)
ImageDraw.Draw(maske).ellipse([ring, ring, Q-1-ring, Q-1-ring], fill=255)
lw.paste(feld, (0, 0), maske)

# 4 — feiner Goldstrich als innerer Abschluss
d.ellipse([ring, ring, Q-1-ring, Q-1-ring], outline=GOLD_HELL + (190,), width=int(Q*0.008))

# 5 — die Figur hinein, alpha-beschnitten, mittig, leicht hoch
fig = Image.open(FIGUR).convert("RGBA")
a = fig.split()[3].point(lambda v: 255 if v > 200 else 0)
fig = fig.crop(a.getbbox())
innen = Q - 2*ring
hoehe = int(innen * 0.78)
fig = fig.resize((max(1, round(fig.width * hoehe / fig.height)), hoehe), Image.LANCZOS)
lw.paste(fig, ((Q - fig.width)//2, ring + int(innen*0.09)), fig)

# 6 — aussen sauber auf den Kreis beschneiden
rund = Image.new("L", (Q, Q), 0)
ImageDraw.Draw(rund).ellipse([0, 0, Q-1, Q-1], fill=255)
rund = rund.filter(ImageFilter.GaussianBlur(S*0.6))
lw.putalpha(Image.composite(lw.split()[3], Image.new("L", (Q, Q), 0), rund).point(lambda v: v))
lw.putalpha(rund)

out = lw.resize((D, D), Image.LANCZOS)
out.save(ZIEL, "WEBP", quality=95, method=6)

# --- Nachweis, dass es wirklich ein sauberer Kreis ist ---
al = out.split()[3]
mitte = D // 2
print("Emblem:", out.size)
print("  Mitte deckend:", al.getpixel((mitte, mitte)) > 250)
for name, p in [("oben", (mitte, 2)), ("unten", (mitte, D-3)), ("links", (2, mitte)), ("rechts", (D-3, mitte))]:
    print("  Rand %-7s alpha %3d" % (name, al.getpixel(p)))
for name, p in [("Ecke ol", (6, 6)), ("Ecke or", (D-7, 6)), ("Ecke ul", (6, D-7)), ("Ecke ur", (D-7, D-7))]:
    print("  %-9s alpha %3d  (muss 0 sein)" % (name, al.getpixel(p)))
