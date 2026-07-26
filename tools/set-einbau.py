"""Baut den neuen Figurensatz ein: Bauer, Turm, Gambit mit sechs Stufen.

Herkunft der Bilder (alle ueber fal.ai, gpt-image-1, background=transparent):

  Bauer / Gambit Stufe 1   ein Bild ("gambit-c"), bewusst dieselbe Figur
  Gambit Stufe 2..6        BEARBEITUNGEN desselben Bildes, keine Neuzeichnungen
  Turm                     ein Bild ("turm-a", Zinnen und Bogenfenster)

WARUM BEARBEITUNG STATT NEUZEICHNUNG. Fuenf unabhaengig generierte Stufen
ergaben fuenf verschiedene Menschen in fuenf verschiedenen Groessen (-10% bis
+27% Hoehe). Ein Textprompt kann Figurentreue nicht zusichern. Ueber die
Bildbearbeitung desselben Ausgangsbildes bleibt die Person erhalten; gemessen
am Gesichtsbereich liegt die Uebereinstimmung bei 0,80 bis 0,98 Deckung und
0,99 bis 1,00 Farbkorrelation. Die Stufen 4 bis 6 gehen von Stufe 3 aus, damit
das Guertelschwert identisch bleibt.

GROESSE. Die Stufenbilder werden nach der Normierung auf EINE Hoehe gezwungen -
die Figur waechst im Spiel ueber die Fit-Karte, nicht im Bild. Nebenwirkung:
die Sockelbreiten weichen dadurch leicht voneinander ab. Auf dem Brett spielt
das keine Rolle, weil ohnehin skaliert wird.

FARBE. Gemessen ueber alle 52 geschnitzten Figuren sind nur vier Farbbaender
frei: 75-120, 210-225, 240-255 und 300-315 Grad. Der Bauer geht deshalb auf
100 Grad (breitestes freies Band) und nicht auf die urspruenglich geplanten
140 Grad - dort sitzt der Drache. Der Gambit bekommt 82 Grad: dasselbe Band,
aber unterscheidbar, damit Stufe 1 vom Bauern zu trennen ist.

Koenig und Dame werden NICHT ueber die Farbe eindeutig gemacht - das Farbrad
ist bei 52 Figuren zu voll, captain und warlock sitzen im selben Blau. Ihr
Erkennungsmerkmal ist die goldglaenzende Krone, die sonst keine Figur hat.
"""
import colorsys
import importlib.util
import os
import numpy as np
from PIL import Image, ImageFilter

Z = "src/app/ui/assets/carved"
LEIN, FUSS_ANKER = (640, 800), None

spec = importlib.util.spec_from_file_location("cb", "tools/carve-build.py")
cb = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cb)


def kasten(im):
    return im.split()[3].point(lambda v: 255 if v > 12 else 0).getbbox()


def umfaerben(im, von, bis, ziel, satf=1.0):
    """Farbband verschieben. Gibt Bild und Trefferzahl zurueck."""
    aus = im.copy()
    px, ap = im.load(), aus.load()
    bb = kasten(im)
    n = 0
    for y in range(bb[1], bb[3]):
        for x in range(bb[0], bb[2]):
            r, g, b, a = px[x, y]
            if a < 40:
                continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            hd = h * 360
            drin = (von <= hd or hd <= bis) if von > bis else (von <= hd <= bis)
            if not drin or s < 0.20:
                continue
            d = ((ziel / 360 - h) + 0.5) % 1.0 - 0.5
            nr, ng, nb = colorsys.hsv_to_rgb((h + d) % 1.0, min(1, s * satf), v)
            ap[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
            n += 1
    return aus, n


def glanz(im, bis_hoehe, gamma=0.44, st=1.15, satb=1.26, deckel=0.972):
    """Goldglanz auf die Krone. 'kraeftig': weiche Deckelung statt hartem Schnitt,
    dadurch 0,00 % ausgefressene Pixel bei maximaler Wirkung."""
    aus = im.copy()
    px, ap = im.load(), aus.load()
    bb = kasten(im)
    Hf = bb[3] - bb[1]
    gold = clip = 0
    for y in range(bb[1], int(bb[1] + bis_hoehe * Hf)):
        for x in range(bb[0], bb[2]):
            r, g, b, a = px[x, y]
            if a < 40:
                continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if not (26 <= h * 360 <= 50) or s < 0.30:
                continue
            gold += 1
            nv = v ** gamma
            if v > 0.55:
                nv += st * ((v - 0.55) / 0.45) ** 2 * (1 - nv)
            nv = deckel * (1 - (1 - min(nv, 1.0)) ** 1.6)
            ns = s * satb if nv < 0.88 else s * (1 - 0.30 * (nv - 0.88) / 0.12)
            nr, ng, nb = colorsys.hsv_to_rgb(h, min(1, ns), nv)
            ap[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
            if max(ap[x, y][:3]) >= 254:
                clip += 1
    return aus, 100 * clip / max(1, gold)


def auf_hoehe(im, ziel):
    bb = kasten(im)
    fig = im.crop(bb)
    f = ziel / (bb[3] - bb[1])
    fig = fig.resize((max(1, round(fig.width * f)), ziel), Image.LANCZOS)
    lw = Image.new("RGBA", LEIN, (0, 0, 0, 0))
    lw.alpha_composite(fig, ((LEIN[0] - fig.width) // 2, min(bb[3], cb.FUSS) - ziel))
    return lw


def schreiben(im, name, saat):
    im.save(f"{Z}/carved-{name}-light.webp", "WEBP", quality=92, method=6)
    cb.verdorben(im, saat).save(f"{Z}/carved-{name}-dark.webp", "WEBP", quality=92, method=6)


def hoehe(im):
    bb = kasten(im)
    return bb[3] - bb[1]


if __name__ == "__main__":
    print("== BAUER ==")
    bauer = cb.normieren("/tmp/gen2/gambit-c.png")
    bauer, n = umfaerben(bauer, 55, 85, 100.0)
    print("   Robe auf 100 Grad, %d Pixel" % n)
    ZIEL = hoehe(bauer)
    schreiben(bauer, "pawn", 5101)
    print("   Hoehe %d px" % ZIEL)

    print("== TURM ==")
    turm = cb.normieren("/tmp/tiers/turm-a.png")
    print("   liegt bereits im Kupferband 15-30 Grad, keine Farbkorrektur")
    schreiben(turm, "rook", 5102)
    print("   Hoehe %d px" % hoehe(turm))

    print("== GAMBIT, sechs Stufen auf einer Hoehe ==")
    quellen = ["/tmp/gen2/gambit-c.png", "/tmp/f-t2.png", "/tmp/edit-t3.png",
               "/tmp/f-t4.png", "/tmp/f-t5.png", "/tmp/f-t6.png"]
    for i, q in enumerate(quellen, start=1):
        im = auf_hoehe(cb.normieren(q), ZIEL)
        im, _ = umfaerben(im, 55, 85, 82.0)
        name = "gambit" if i == 1 else "gambit-t%d" % i
        schreiben(im, name, 5200 + i)
        print("   Stufe %d -> carved-%s  Hoehe %d px" % (i, name, hoehe(im)))

    print("== KRONENGLANZ (kraeftig) ==")
    for name, bis in (("queen", 0.135), ("king", 0.150)):
        im = Image.open(f"{Z}/carved-{name}-light.webp").convert("RGBA")
        if name == "queen":
            im, n = umfaerben(im, 338, 16, 215.0, satf=0.86)
            print("   Dame: Gewand auf 215 Grad, %d Pixel" % n)
        im, q = glanz(im, bis)
        print("   %s: ausgefressen %.2f %%" % (name, q))
        schreiben(im, name, 5301 if name == "queen" else 5302)
    print()
    print("fertig.")
