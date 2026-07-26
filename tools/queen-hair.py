"""Die Haare der Dame umfaerben — und beweisen, dass nur die Haare getroffen sind.

Gemessen wurde vorher (Farbton-Karte ueber die Figur):

    Krone    2-12% Hoehe, Mitte      Farbwinkel 30-39 Grad (Gold)
    Haare   13-28% Hoehe, Flanken    Farbwinkel  0-19 Grad (Rot)   <- nur das hier
    Gesicht 13-28% Hoehe, Mitte      Farbwinkel 20-29 Grad (Kupfer)
    Kragen  28-34% Hoehe             Farbwinkel 30-39 Grad (Gold)
    Gewand  ab 50% Hoehe             Farbwinkel  0-19 Grad (Rot)

Haar und Gewand teilen sich den Farbwinkel — getrennt werden sie allein ueber
die Hoehe. Der goldene Kragen bei 28-34% ist die natuerliche Sperre dazwischen,
deshalb endet die Maske darueber. Gesicht und Krone bleiben ueber den Winkel
aussen vor.

Aufruf:  python3 tools/queen-hair.py --mode blond|dunkel [--probe]
"""
import argparse
import colorsys
import os
from PIL import Image, ImageFilter

QUELLE = "src/app/ui/assets/carved/carved-queen-light.webp"

# Maskengrenzen als Anteil der Figurhoehe (nicht der Bildhoehe)
Y_OBEN, Y_UNTEN = 0.115, 0.285
Y_WEICH = 0.020          # weicher Auslauf oben und unten
HUE_MAX = 20.0           # Grad; darueber faengt das Gesicht an
SAT_MIN = 0.22

# Der Farbwinkel allein reicht NICHT: beschattete Gesichtspartien fallen
# ebenfalls unter 20 Grad und wurden in der ersten Fassung mit aufgehellt
# (Gesicht sprang von L=97 auf L=153). Gemessene Geometrie im Kopfband:
# das Gesicht liegt zwischen 35% und 61% der Figurbreite, Haar nur ausserhalb.
X_INNEN_L, X_INNEN_R = 0.345, 0.625
X_WEICH = 0.025

ZIELE = {
    # Farbwinkel, Saettigungsfaktor, Helligkeitsfaktor, Helligkeits-Sockel
    "blond":  (42.0, 0.62, 1.55, 0.30),
    "dunkel": (26.0, 0.55, 0.45, 0.02),
}


def figurbox(im):
    return im.split()[3].point(lambda v: 255 if v > 12 else 0).getbbox()


def hue_von(r, g, b):
    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    return h * 360, s, v


def maske_bauen(im, bb):
    """Weiche Graustufenmaske: 255 = volles Haar, 0 = nicht anfassen."""
    x0, y0, x1, y1 = bb
    Hf = y1 - y0
    m = Image.new("L", im.size, 0)
    mp = m.load()
    px = im.load()
    oben, unten = y0 + Y_OBEN * Hf, y0 + Y_UNTEN * Hf
    weich = Y_WEICH * Hf
    for y in range(int(oben - weich), int(unten + weich) + 1):
        if y < 0 or y >= im.height:
            continue
        # senkrechter Auslauf
        if y < oben:
            fy = (y - (oben - weich)) / weich
        elif y > unten:
            fy = ((unten + weich) - y) / weich
        else:
            fy = 1.0
        fy = max(0.0, min(1.0, fy))
        for x in range(x0, x1):
            # waagerechter Ausschluss der Gesichtsspalte, mit weicher Kante
            rx = (x - x0) / (x1 - x0)
            if X_INNEN_L <= rx <= X_INNEN_R:
                continue
            if rx < X_INNEN_L:
                fx = min(1.0, (X_INNEN_L - rx) / X_WEICH)
            else:
                fx = min(1.0, (rx - X_INNEN_R) / X_WEICH)
            r, g, b, a = px[x, y]
            if a < 40:
                continue
            h, s, v = hue_von(r, g, b)
            if s < SAT_MIN or v < 0.05:
                continue
            if h > 300:
                h -= 360            # Rot laeuft ueber 0 hinweg
            if h >= HUE_MAX:
                continue
            # Winkelauslauf: direkt an der Gesichtsgrenze weicher werden
            fh = 1.0 if h <= HUE_MAX - 5 else (HUE_MAX - h) / 5.0
            mp[x, y] = int(255 * fy * fx * fh * (a / 255))
    return m.filter(ImageFilter.GaussianBlur(1.6))


def faerben(im, m, mode):
    ziel_h, s_fak, v_fak, v_sockel = ZIELE[mode]
    aus = im.copy()
    px, ap, mp = im.load(), aus.load(), m.load()
    x0, y0, x1, y1 = m.getbbox()
    n = 0
    for y in range(y0, y1):
        for x in range(x0, x1):
            w = mp[x, y] / 255
            if w <= 0.004:
                continue
            r, g, b, a = px[x, y]
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            nh = ((ziel_h / 360) - h) * w + h
            ns = s * (1 + (s_fak - 1) * w)
            nv = v * (1 + (v_fak - 1) * w) + v_sockel * w
            nr, ng, nb = colorsys.hsv_to_rgb(nh % 1.0, min(1, ns), min(1, nv))
            ap[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
            n += 1
    return aus, n


def band(im, bb, lo, hi, nurflanke=None):
    """Mittlerer Farbwinkel UND Helligkeit eines Hoehenbands — fuer den Nachweis.

    Die Helligkeit ist der wichtigere Wert: eine Maske kann den Farbwinkel
    perfekt treffen und trotzdem das halbe Gesicht ausbleichen.
    """
    x0, y0, x1, y1 = bb
    Hf, Wf = y1 - y0, x1 - x0
    px = im.load()
    hs = []
    ls = []
    for y in range(int(y0 + lo * Hf), int(y0 + hi * Hf)):
        for x in range(x0, x1):
            rx = (x - x0) / Wf
            if nurflanke == "aussen" and 0.36 < rx < 0.64:
                continue
            if nurflanke == "mitte" and not (0.40 < rx < 0.60):
                continue
            r, g, b, a = px[x, y]
            if a < 200:
                continue
            h, s, v = hue_von(r, g, b)
            if s > 0.25 and v > 0.12:
                hs.append(h if h < 300 else h - 360)
                ls.append(0.2126 * r + 0.7152 * g + 0.0722 * b)
    return (sum(hs) / len(hs), sum(ls) / len(ls)) if hs else (float("nan"), float("nan"))


def main():
    ap_ = argparse.ArgumentParser()
    ap_.add_argument("--mode", choices=sorted(ZIELE), required=True)
    ap_.add_argument("--probe", action="store_true", help="nach /tmp statt ins Repo")
    args = ap_.parse_args()

    im = Image.open(QUELLE).convert("RGBA")
    bb = figurbox(im)
    m = maske_bauen(im, bb)
    aus, n = faerben(im, m, args.mode)

    ges = sum(1 for p in im.getdata() if p[3] > 200)
    print("Modus: %s" % args.mode)
    print("Umgefaerbt: %d Pixel = %.1f%% der Figur  (Haar plausibel bei 3-9%%)"
          % (n, 100 * n / ges))
    print()
    print("Nachweis je Bereich, vorher -> nachher (Winkel in Grad, L = Helligkeit):")
    proben = [
        ("Haare  (13-28%, Flanken)", 0.13, 0.28, "aussen"),
        ("Gesicht(15-26%, Mitte)  ", 0.15, 0.26, "mitte"),
        ("Krone  ( 2-12%)         ", 0.02, 0.12, None),
        ("Kragen (29-34%)         ", 0.29, 0.34, None),
        ("Gewand (55-80%)         ", 0.55, 0.80, None),
    ]
    schlimm = 0
    for name, lo, hi, fl in proben:
        a1, l1 = band(im, bb, lo, hi, fl)
        a2, l2 = band(aus, bb, lo, hi, fl)
        dw, dl = a2 - a1, l2 - l1
        if "Haare" in name:
            flag = "  <== Ziel"
        elif abs(dw) < 1.5 and abs(dl) < 6:
            flag = "  ok"
        else:
            flag = "  <== ACHTUNG, darf sich nicht bewegen"
            schlimm += 1
        print("  %s  %6.1f -> %6.1f Grad (%+5.1f)   L %3.0f -> %3.0f (%+5.1f)%s"
              % (name, a1, a2, dw, l1, l2, dl, flag))
    if schlimm:
        print()
        print("  ABBRUCH-WUERDIG: %d Bereich(e) wurden mitgetroffen." % schlimm)

    ziel = "/tmp/queen-%s.webp" % args.mode if args.probe else QUELLE
    aus.save(ziel, quality=95, method=6)
    os.makedirs("/tmp/dame", exist_ok=True)
    aus.save("/tmp/dame/dame-%s.png" % args.mode)
    print()
    print("geschrieben: %s" % ziel)


if __name__ == "__main__":
    main()
