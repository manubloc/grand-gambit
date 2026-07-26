"""Titelentwuerfe, zweite Runde — enger gestellt und tiefer schattiert.

Rueckmeldung des Besitzers zur ersten Runde: "Mehr Schattierung ins Dunkel.
Und Figuren naeher beieinander."

Was daraus folgt, gegenueber build-title.py:

  ENGER      Die Figuren stehen nicht mehr auf verteilten Positionen, sondern
             werden als Gruppe um die Mitte gesetzt und duerfen sich
             ueberlappen. Der Abstand ist ein Anteil der Figurbreite, kein
             fester Pixelwert mehr — dadurch bleibt die Gruppe geschlossen,
             egal wie breit die einzelne Figur ausfaellt.

  TIEFER     Drei Schattierungen statt einer:
             (a) je Figur ein senkrechter Verlauf, der den unteren Teil ins
                 Schwarz zieht, statt sie flach auf der Standlinie abzuschneiden
             (b) hintere Figuren werden gedimmt und leicht weichgezeichnet,
                 vordere bleiben klar — das gibt Raumtiefe
             (c) eine kraeftigere Randabdunklung, die von allen vier Seiten
                 nach innen laeuft

Grund bleibt reines #000, damit es keine Kante gegen den Anmeldeschirm gibt.
"""
from PIL import Image, ImageFilter, ImageChops
import os

W, H = 1200, 800
STAND = 690
A = "src/app/ui/assets/carved/carved-%s-%s.webp"


def fig(name, seite="light"):
    return Image.open(A % (name, seite)).convert("RGBA")


def zuschnitt(im):
    return im.crop(im.split()[3].point(lambda v: 255 if v > 12 else 0).getbbox())


def schattiere(im, ab=0.45, rest=0.06):
    """Senkrechter Verlauf: ab `ab` der Hoehe laeuft die Figur ins Dunkel.

    `rest` ist der Helligkeitsrest ganz unten — nicht 0, damit die Standflaeche
    nicht hart abreisst, sondern sich verliert.
    """
    w, h = im.size
    r, g, b, a = im.split()
    ramp = Image.new("L", (1, h))
    rp = ramp.load()
    for y in range(h):
        t = (y / (h - 1) - ab) / (1 - ab)
        if t <= 0:
            f = 1.0
        else:
            t = min(1.0, t)
            f = 1 - (1 - rest) * (t * t * (3 - 2 * t))
        rp[0, y] = int(255 * f)
    ramp = ramp.resize((w, h))
    return Image.merge("RGBA", (ImageChops.multiply(r, ramp),
                                ImageChops.multiply(g, ramp),
                                ImageChops.multiply(b, ramp), a))


def dimme(im, f):
    r, g, b, a = im.split()
    m = Image.new("L", im.size, int(255 * f))
    return Image.merge("RGBA", (ImageChops.multiply(r, m),
                                ImageChops.multiply(g, m),
                                ImageChops.multiply(b, m), a))


def setze(lw, im, mitte_x, hoehe, standlinie=STAND, tiefe=0.0, saum=0.5, ab=0.45):
    """Figur setzen. `tiefe` 0 = ganz vorn, 1 = ganz hinten."""
    im = zuschnitt(im)
    im = im.resize((max(1, round(im.width * hoehe / im.height)), hoehe), Image.LANCZOS)
    im = schattiere(im, ab=ab)
    if tiefe > 0:
        im = dimme(im, 1 - 0.62 * tiefe)
        if tiefe > 0.35:
            im = im.filter(ImageFilter.GaussianBlur(1.2 + 2.2 * tiefe))
    x, y = mitte_x - im.width // 2, standlinie - im.height
    if saum > 0:
        gl = Image.new("RGBA", im.size, (0, 0, 0, 0))
        gl.putalpha(im.split()[3].filter(ImageFilter.GaussianBlur(9))
                    .point(lambda v: int(v * saum * (1 - 0.7 * tiefe))))
        gl = ImageChops.multiply(gl, Image.new("RGBA", im.size, (255, 226, 160, 255)))
        lw.alpha_composite(gl, (x, y))
    lw.alpha_composite(im, (x, y))
    return im.width


def gruppe(lw, teile, mitte=W // 2, ueberlapp=0.16):
    """Figuren als geschlossene Gruppe um `mitte` setzen.

    teile: Liste aus (name, seite, hoehe, tiefe). Die Breiten werden vorab
    gemessen, damit die Gruppe wirklich mittig sitzt und der Abstand als
    Anteil der Figurbreite wirkt statt als fester Pixelwert.
    """
    br = []
    for n, s, h, t in teile:
        f = zuschnitt(fig(n, s))
        br.append(max(1, round(f.width * h / f.height)))
    schritt = [round((br[i] + br[i + 1]) / 2 * (1 - ueberlapp)) for i in range(len(br) - 1)]
    gesamt = sum(schritt)
    x = mitte - gesamt // 2
    # hintere zuerst, damit vordere davor liegen
    reihen = sorted(range(len(teile)), key=lambda i: -teile[i][3])
    pos = [x + sum(schritt[:i]) for i in range(len(teile))]
    for i in reihen:
        n, s, h, t = teile[i]
        setze(lw, fig(n, s), pos[i], h, tiefe=t)


def randdunkel(im, seite=0.13, unten=0.34, oben=0.10, ziel=(0, 0, 0)):
    """Von allen vier Seiten in `ziel` auslaufen.

    `ziel` MUSS der Anmeldegrund der jeweiligen Livree sein (T.loginBg), sonst
    sitzt hinter dem Titelbild eine sichtbare Kachel. Classic = #000, carved =
    #202b40. Frueher war Schwarz fest eingebaut, weil es nur eine Livree gab.
    """
    px = im.load()
    w, h = im.size
    su, so, sr = int(h * (1 - unten)), int(h * oben), int(w * seite)
    for y in range(h):
        if y >= su:
            t = (y - su) / max(1, h - 1 - su)
            fy = 1 - t * t * (3 - 2 * t)
        elif y <= so:
            t = 1 - y / max(1, so)
            fy = 1 - 0.55 * (t * t * (3 - 2 * t))
        else:
            fy = 1.0
        for x in range(w):
            if x < sr:
                fx = x / sr
            elif x >= w - sr:
                fx = (w - 1 - x) / sr
            else:
                fx = 1.0
            fx = fx * fx * (3 - 2 * fx) if fx < 1 else 1.0
            f = fy * fx
            if f >= 0.999:
                continue
            r, g, b = px[x, y]
            px[x, y] = (int(r * f + ziel[0] * (1 - f)),
                        int(g * f + ziel[1] * (1 - f)),
                        int(b * f + ziel[2] * (1 - f)))
    return im


ZIEL = (0x00, 0x00, 0x00)      # T.loginBg - die Eingangsstrecke ist schwarz


def platte():
    return Image.new("RGBA", (W, H), ZIEL + (255,))


def fertig(lw, name):
    out = randdunkel(lw.convert("RGB"), ziel=ZIEL)
    out.save("/tmp/titel/%s.webp" % name, "WEBP", quality=92, method=6)
    out.save("/mnt/user-data/outputs/titelbild-%s.png" % name, "PNG")
    # Nachweis: wie schwarz ist der Rand wirklich?
    px = out.load()
    ecken = [px[2, 2], px[W - 3, 2], px[2, H - 3], px[W - 3, H - 3]]
    ab = max(max(abs(c[i] - ZIEL[i]) for i in range(3)) for c in ecken)
    print("  %-14s Ecken weichen um max %d/255 von %s ab  %s"
          % (name, ab, "#%02x%02x%02x" % ZIEL, "ok" if ab <= 2 else "<== KANTE SICHTBAR"))


os.makedirs("/tmp/titel", exist_ok=True)
os.makedirs("/mnt/user-data/outputs", exist_ok=True)

# 5 — ENGER HOF: dieselbe Idee wie 1, aber als geschlossene Gruppe mit Tiefe
lw = platte()
gruppe(lw, [("rook", "light", 300, 0.55),
            ("queen", "light", 385, 0.10),
            ("king", "light", 440, 0.00),
            ("knight", "light", 320, 0.55)], ueberlapp=0.20)
fertig(lw, "5-hof-eng")

# 6 — ENGES DUELL: die beiden Koenige fast Schulter an Schulter
lw = platte()
gruppe(lw, [("king", "light", 450, 0.00),
            ("king", "dark", 450, 0.22)], ueberlapp=0.30)
fertig(lw, "6-duell-eng")

# 7 — DER HELD, eng: Gambit vorn, Hofstaat dicht dahinter statt daneben
lw = platte()
gruppe(lw, [("bishop", "light", 265, 0.80),
            ("queen", "light", 335, 0.45),
            ("gambit", "light", 470, 0.00),
            ("king", "light", 350, 0.45),
            ("rook", "light", 275, 0.80)], ueberlapp=0.34)
fertig(lw, "7-held-eng")

# 8 — GESCHLOSSENE REIHE: die Grundreihe dicht an dicht, tief gestaffelt
lw = platte()
gruppe(lw, [("rook", "light", 250, 0.70),
            ("knight", "light", 265, 0.45),
            ("bishop", "light", 275, 0.22),
            ("queen", "light", 320, 0.00),
            ("king", "light", 340, 0.00),
            ("bishop", "light", 275, 0.22),
            ("knight", "light", 265, 0.45),
            ("rook", "light", 250, 0.70)], ueberlapp=0.26)
fertig(lw, "8-reihe-eng")

print("vier neue Entwuerfe fertig")
