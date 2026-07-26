"""Vier Titelbild-Entwuerfe — aus den ECHTEN Spielfiguren gebaut.

Der Wunsch war: man soll auf dem Titel schon sehen, wie die Figuren spaeter
aussehen. Also wird hier nichts mehr generiert. Jeder Entwurf setzt die
tatsaechlichen geschnitzten Assets auf reines Schwarz — was du hier siehst,
steht spaeter genau so auf dem Brett.

Gemeinsames Gesetz: Grund #000 (der Anmeldeschirm IST schwarz, damit gibt es
keine Kante), Figuren auf eine gemeinsame Standlinie, nach unten in Schwarz
auslaufend, leichter Lichtsaum, damit sich jede Silhouette abhebt.
"""
from PIL import Image, ImageFilter, ImageChops
import os

W, H = 1200, 800
A = "src/app/ui/assets/carved/carved-%s-%s.webp"

def fig(name, seite="light"):
    return Image.open(A % (name, seite)).convert("RGBA")

def setze(lw, im, mitte_x, standlinie, hoehe, saum=True):
    """Figur auf eine gemeinsame Standlinie stellen, auf `hoehe` skaliert."""
    b = im.split()[3].point(lambda v: 255 if v > 12 else 0).getbbox()
    im = im.crop(b)
    im = im.resize((max(1, round(im.width * hoehe / im.height)), hoehe), Image.LANCZOS)
    x, y = mitte_x - im.width // 2, standlinie - im.height
    if saum:  # weicher heller Saum, damit die Figur aus dem Schwarz tritt
        gl = Image.new("RGBA", im.size, (0, 0, 0, 0))
        gl.putalpha(im.split()[3].filter(ImageFilter.GaussianBlur(7)).point(lambda v: int(v * 0.5)))
        gl = ImageChops.multiply(gl, Image.new("RGBA", im.size, (255, 228, 165, 255)))
        lw.alpha_composite(gl, (x, y))
    lw.alpha_composite(im, (x, y))
    return lw

def ausblenden(im):
    """Nach unten und zu den Seiten in reines Schwarz."""
    px = im.load(); w, h = im.size
    s = int(h * 0.60)
    for y in range(s, h):
        t = (y - s) / (h - 1 - s); f = 1 - t * t * (3 - 2 * t)
        for x in range(w):
            r, g, b = px[x, y]; px[x, y] = (int(r*f), int(g*f), int(b*f))
    rand = int(w * 0.07)
    for x in range(rand):
        f = x / rand
        for y in range(h):
            for xx in (x, w - 1 - x):
                r, g, b = px[xx, y]; px[xx, y] = (int(r*f), int(g*f), int(b*f))
    return im

def platte():
    return Image.new("RGBA", (W, H), (0, 0, 0, 255))

def fertig(lw, name):
    out = ausblenden(lw.convert("RGB"))
    out.save("/tmp/titel/%s.webp" % name, "WEBP", quality=92, method=6)
    out.save("/mnt/user-data/outputs/titelbild-%s.png" % name, "PNG")
    print("  %s" % name)

os.makedirs("/tmp/titel", exist_ok=True)
os.makedirs("/mnt/user-data/outputs", exist_ok=True)
STAND = 660

# 1 — DER HOF: Dame, Koenig, Springer, Turm nebeneinander
lw = platte()
for n, x, h in [("rook", 250, 300), ("queen", 470, 380), ("king", 720, 430), ("knight", 950, 320)]:
    setze(lw, fig(n), x, STAND, h)
fertig(lw, "1-hof")

# 2 — DIE AUFSTELLUNG: die ganze Grundreihe, klein, wie vor dem ersten Zug
lw = platte()
reihe = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]
for i, n in enumerate(reihe):
    h = 300 if n in ("king", "queen") else 250
    setze(lw, fig(n), 150 + i * 128, STAND, h)
fertig(lw, "2-aufstellung")

# 3 — DAS DUELL: heller Koenig gegen die verdorbene Seite
lw = platte()
setze(lw, fig("king", "light"), 420, STAND, 440)
setze(lw, fig("king", "dark"), 790, STAND, 440)
fertig(lw, "3-duell")

# 4 — DER HELD: der Gambit gross, Hofstaat als Schemen dahinter
lw = platte()
for n, x, h in [("bishop", 250, 250), ("rook", 990, 250)]:
    d = fig(n); d.putalpha(d.split()[3].point(lambda v: int(v * 0.42)))
    setze(lw, d, x, STAND - 20, h, saum=False)
setze(lw, fig("queen"), 430, STAND, 330)
setze(lw, fig("gambit"), 700, STAND, 470)
fertig(lw, "4-held")
print("vier Entwuerfe fertig")
