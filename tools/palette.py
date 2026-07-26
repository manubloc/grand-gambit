"""Farbleitsystem: jede Figurenart bekommt einen eigenen Farbwinkel.

Warum ueberhaupt: gemessen am Ist-Zustand teilten sich BAUER (195-210 Grad) und
KOENIG (210-225 Grad) das Blau. Genau deshalb liesen sich die beiden auf dem
Brett schlecht auseinanderhalten. Blau gehoert jetzt exklusiv Koenig und Dame.

    Koenig, Dame      215 Grad  blau
    Bauer, Gambit     140 Grad  gruen
    Springer            5 Grad  rot
    Turm               22 Grad  kupfer
    Laeufer            38 Grad  gold

Die Lehre aus dem Haar-Werkzeug ist hier fest eingebaut: ein Farbwinkel-
Nachweis allein genuegt nicht. Eine Maske kann den Winkel exakt treffen und
trotzdem Nachbarbereiche aufhellen oder absaufen lassen. Deshalb wird zu
JEDEM Schutzbereich auch die Helligkeit geprueft, und jede Abweichung ueber
6 Stufen gilt als Fehlschlag.

    python3 tools/palette.py --probe        # nach /tmp, nichts ins Repo
    python3 tools/palette.py --anwenden     # ins Repo schreiben
"""
import argparse
import colorsys
import os
from PIL import Image, ImageFilter

Q = "src/app/ui/assets/carved/carved-%s-light.webp"

# name -> (Quellwinkel von, bis, Zielwinkel, ab welcher Hoehe, Saettigungsfaktor)
# Die Hoehengrenze schuetzt Kopf und Krone: umgefaerbt wird nur das Gewand.
AUFTRAEGE = {
    "queen": dict(von=338.0, bis=16.0, ziel=215.0, ab=0.34, sat=0.86,
                  schutz=[("Krone", 0.02, 0.12), ("Gesicht", 0.15, 0.26),
                          ("Haare", 0.13, 0.28), ("Kragen", 0.29, 0.34)]),
    "pawn":  dict(von=185.0, bis=225.0, ziel=140.0, ab=0.00, sat=1.00,
                  schutz=[("Kopf", 0.02, 0.22), ("Sockel", 0.90, 1.00)]),
}


def box(im):
    return im.split()[3].point(lambda v: 255 if v > 12 else 0).getbbox()


def imbereich(h, von, bis):
    """Winkelbereich, der ueber 0 Grad hinweglaufen darf."""
    return (von <= h or h <= bis) if von > bis else (von <= h <= bis)


def maske(im, bb, a):
    x0, y0, x1, y1 = bb
    Hf = y1 - y0
    m = Image.new("L", im.size, 0)
    mp, px = m.load(), im.load()
    grenze = y0 + a["ab"] * Hf
    weich = 0.03 * Hf
    for y in range(y0, y1):
        fy = 1.0 if y >= grenze + weich else max(0.0, (y - grenze) / weich)
        if fy <= 0:
            continue
        for x in range(x0, x1):
            r, g, b, al = px[x, y]
            if al < 40:
                continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if s < 0.20 or v < 0.06:
                continue
            if not imbereich(h * 360, a["von"], a["bis"]):
                continue
            mp[x, y] = int(255 * fy * (al / 255))
    return m.filter(ImageFilter.GaussianBlur(1.4))


def faerben(im, m, ziel, satf):
    aus = im.copy()
    px, ap, mp = im.load(), aus.load(), m.load()
    bb = m.getbbox()
    if not bb:
        return aus, 0
    n = 0
    for y in range(bb[1], bb[3]):
        for x in range(bb[0], bb[2]):
            w = mp[x, y] / 255
            if w <= 0.004:
                continue
            r, g, b, al = px[x, y]
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            zh = ziel / 360
            # kuerzester Weg auf dem Farbkreis
            d = ((zh - h) + 0.5) % 1.0 - 0.5
            nh = (h + d * w) % 1.0
            ns = s * (1 + (satf - 1) * w)
            nr, ng, nb = colorsys.hsv_to_rgb(nh, min(1, ns), v)
            ap[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), al)
            n += 1
    return aus, n


def mess(im, bb, lo, hi):
    x0, y0, x1, y1 = bb
    Hf = y1 - y0
    px = im.load()
    hs, ls = [], []
    for y in range(int(y0 + lo * Hf), int(y0 + hi * Hf)):
        for x in range(x0, x1):
            r, g, b, a = px[x, y]
            if a < 200:
                continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if s > 0.22 and v > 0.10:
                hs.append(h * 360)
                ls.append(0.2126 * r + 0.7152 * g + 0.0722 * b)
    if not hs:
        return float("nan"), float("nan")
    return sum(hs) / len(hs), sum(ls) / len(ls)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--probe", action="store_true")
    p.add_argument("--anwenden", action="store_true")
    args = p.parse_args()
    os.makedirs("/tmp/palette", exist_ok=True)
    fehler = 0

    for name, a in AUFTRAEGE.items():
        im = Image.open(Q % name).convert("RGBA")
        bb = box(im)
        m = maske(im, bb, a)
        aus, n = faerben(im, m, a["ziel"], a["sat"])
        ges = sum(1 for y in range(bb[1], bb[3]) for x in range(bb[0], bb[2])
                  if im.load()[x, y][3] > 200)
        print("%s: %d Pixel umgefaerbt = %.1f%% der Figur, Ziel %.0f Grad"
              % (name.upper(), n, 100 * n / ges, a["ziel"]))
        for lab, lo, hi in a["schutz"]:
            w1, l1 = mess(im, bb, lo, hi)
            w2, l2 = mess(aus, bb, lo, hi)
            dw = abs(((w2 - w1) + 180) % 360 - 180)
            dl = l2 - l1
            ok = dw < 2.0 and abs(dl) < 6
            if not ok:
                fehler += 1
            print("   Schutz %-8s Winkel %5.1f->%5.1f (%+4.1f)  L %3.0f->%3.0f (%+5.1f)  %s"
                  % (lab, w1, w2, w2 - w1, l1, l2, dl, "ok" if ok else "<== VERLETZT"))
        aus.save("/tmp/palette/%s.png" % name)
        if args.anwenden:
            aus.save(Q % name, "WEBP", quality=92, method=6)
        print()

    print("VERLETZUNGEN: %d" % fehler)
    print("geschrieben nach: %s" % ("Repo" if args.anwenden else "/tmp/palette"))


if __name__ == "__main__":
    main()
