"""Das Menuelogo auffaelliger machen - gerechnet, nicht generiert.

Gemessen am alten Stand: der Schriftzug belegte nur 471 von 900 px, also 52 %
der Breite, bei einer Helligkeit von 0,64. Er war nicht schlecht gestaltet, er
war schlicht zu klein und zu matt fuer seinen eigenen Rahmen.

Drei Eingriffe, jeder nachrechenbar:

  GROESSER   Der Schriftzug wird auf die verfuegbare Breite gezogen, statt in
             der Mitte zu schwimmen. Zielbelegung ueber 80 % der Leinwand.
  HELLER     Die Goldwerte werden ueber eine Gammakurve angehoben und die
             Lichter schmal verstaerkt - dasselbe Verfahren wie beim
             Kronenglanz, samt Zaehlung der ausgefressenen Pixel.
  FIGUR      Links daneben der Kopf des GESCHNITZTEN KOENIGS aus der echten
             Figurendatei, nicht generiert. Er traegt die Krone, also ist er
             das Zeichen mit dem hoechsten Wiedererkennungswert.

Das Seitenverhaeltnis 900x271 bleibt, damit im Layout nichts springt.
"""
import colorsys
import numpy as np
from PIL import Image, ImageFilter

B, H = 900, 271
ALT = "src/app/ui/assets/logo-menu.carved.webp"
KOENIG = "src/app/ui/assets/carved/carved-king-light.webp"


def zuschnitt(im):
    return im.crop(im.split()[3].point(lambda v: 255 if v > 12 else 0).getbbox())


def gold_heben(im, gamma=0.62, glanz=0.85):
    """Gold anheben und Lichter verstaerken, mit Zaehlung der Ueberstrahlung."""
    px = im.load()
    w, h = im.size
    gold = clip = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 20:
                continue
            hu, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if s < 0.18:
                continue
            gold += 1
            nv = v ** gamma
            if v > 0.55:
                nv += glanz * ((v - 0.55) / 0.45) ** 2 * (1 - nv)
            nv = 0.985 * (1 - (1 - min(nv, 1.0)) ** 1.6)      # weiche Deckelung
            ns = min(1.0, s * 1.06)
            nr, ng, nb = colorsys.hsv_to_rgb(hu, ns, nv)
            px[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
            if max(px[x, y][:3]) >= 254:
                clip += 1
    return gold, clip


def saum(im, farbe=(255, 226, 160), staerke=0.55, weite=7):
    gl = Image.new("RGBA", im.size, (0, 0, 0, 0))
    gl.putalpha(im.split()[3].filter(ImageFilter.GaussianBlur(weite))
                .point(lambda v: int(v * staerke)))
    voll = Image.new("RGBA", im.size, farbe + (255,))
    voll.putalpha(gl.split()[3])
    unten = Image.new("RGBA", im.size, (0, 0, 0, 0))
    unten.alpha_composite(voll)
    unten.alpha_composite(im)
    return unten


def bauen():
    lw = Image.new("RGBA", (B, H), (0, 0, 0, 0))

    # 1) Koenigskopf links: die obersten 30 % der Figur, also Krone plus Gesicht
    k = zuschnitt(Image.open(KOENIG).convert("RGBA"))
    kopf = k.crop((0, 0, k.width, int(k.height * 0.30)))
    kopf = zuschnitt(kopf)
    zielh = int(H * 0.86)
    kopf = kopf.resize((max(1, round(kopf.width * zielh / kopf.height)), zielh), Image.LANCZOS)
    kx, ky = 10, (H - kopf.height) // 2

    # 2) Schriftzug rechts daneben, auf die Restbreite gezogen
    alt = zuschnitt(Image.open(ALT).convert("RGBA"))
    frei_x = kx + kopf.width + 26
    frei_b = B - frei_x - 12
    f = min(frei_b / alt.width, (H * 0.72) / alt.height)
    wort = alt.resize((max(1, round(alt.width * f)), max(1, round(alt.height * f))), Image.LANCZOS)

    gold_w, clip_w = gold_heben(wort)
    gold_k, clip_k = gold_heben(kopf, gamma=0.78, glanz=0.35)

    lw.alpha_composite(saum(kopf, staerke=0.42), (kx, ky))
    lw.alpha_composite(saum(wort, staerke=0.5), (frei_x, (H - wort.height) // 2))
    return lw, (gold_w, clip_w, gold_k, clip_k)


def pruefe(lw, zahlen):
    a = np.asarray(lw)
    al = a[..., 3]
    ys, xs = np.nonzero(al > 40)
    belegt = (xs.max() - xs.min() + 1) / B
    deckung = (al > 40).mean()
    rgb = a[..., :3][al > 200].astype(float)
    v = (rgb.max(axis=1) / 255).mean()
    ecken = [al[2, 2], al[2, -3], al[-3, 2], al[-3, -3]]
    gw, cw, gk, ck = zahlen
    print("Breite belegt:        %.0f %%   (alt 52 %%, Ziel ueber 80)" % (100 * belegt))
    print("Deckung der Flaeche:  %.0f %%   (alt 21 %%)" % (100 * deckung))
    print("mittlere Helligkeit:  %.2f    (alt 0,64)" % v)
    print("ausgefressen Wort:    %.2f %%  Kopf: %.2f %%  (unter 2 %% ist ok)"
          % (100 * cw / max(1, gw), 100 * ck / max(1, gk)))
    print("Ecken durchsichtig:   %s" % ("ja" if max(ecken) == 0 else "NEIN, Platte!"))


if __name__ == "__main__":
    lw, z = bauen()
    pruefe(lw, z)
    lw.save(ALT, "WEBP", quality=94, method=6)
    lw.save("/tmp/logo-menu.png")
    import os
    print("geschrieben: %d KB" % (os.path.getsize(ALT) / 1024))
