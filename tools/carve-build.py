#!/usr/bin/env python3
"""Die Werkbank: macht aus den erzeugten Rohbildern die Spielfiguren.

Zwei Dinge passieren hier, und beide sind wichtiger als sie aussehen.

EINHEITLICHER SOCKEL. Frueher wurde jede Figur auf gleiche HOEHE skaliert. Das
ist falsch: ein Bauer ist kleiner als ein Koenig, und wenn beide gleich hoch
sind, wirkt der Bauer aufgeblasen und die Sockel tanzen in der Groesse. Statt
dessen wird jetzt die SOCKELBREITE gemessen und auf ein festes Mass gebracht.
Alle Figuren landen auf derselben Leinwand, mit dem Sockel unten buendig und
ueber seiner Mitte zentriert - dadurch stehen sie auf dem Brett wie ein echter
Satz, gleiche Standflaeche, unterschiedliche Groesse.

DIE VERDORBENE SEITE. Der Gegner bekommt keine eigenen Bilder. Aus derselben
Figur wird gerechnet: der Stein entfaerbt und abgedunkelt, die Kante faengt
violettes Licht, und feine Blitze kriechen aus dem Sockel nach oben - an der
Silhouette beschnitten, damit sie auf der Figur leben und nicht davor. Der
Startwert je Figur ist fest, das Muster also reproduzierbar und flackerfrei.

    python3 tools/carve-build.py            # alles neu bauen
"""
import glob, os, random, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROH = "/home/claude/gg-test"
ZIEL = "src/app/ui/assets/carved"

LEINWAND = (640, 800)     # gemeinsame Leinwand aller Figuren
SOCKEL_BREITE = 300       # darauf wird jede Standflaeche gebracht
FUSS = 786                # Unterkante des Sockels auf der Leinwand
LILA = np.array([0.62, 0.31, 0.95])


def sockelbreite(alpha):
    """Breite der Standflaeche: das breiteste, was im untersten Zehntel liegt."""
    fest = alpha > 200
    ys = np.nonzero(fest.any(1))[0]
    if not len(ys):
        return alpha.shape[1], alpha.shape[0]
    unten = ys.max()
    band = fest[max(0, unten - max(3, int(len(ys) * 0.10))): unten + 1]
    breiten = [np.nonzero(z)[0] for z in band if z.any()]
    if not breiten:
        return alpha.shape[1], unten
    b = max(x.max() - x.min() + 1 for x in breiten)
    mitten = [ (x.min() + x.max()) / 2 for x in breiten ]
    return b, unten, float(np.median(mitten))


def normieren(pfad):
    """Auf die gemeinsame Leinwand setzen, Sockel unten buendig und zentriert."""
    im = Image.open(pfad).convert("RGBA")
    a = np.asarray(im)[..., 3]
    fest = a > 200
    ys, xs = np.nonzero(fest)
    if not len(xs):
        return None
    im = im.crop((xs.min() - 6, ys.min() - 6, xs.max() + 7, ys.max() + 7))
    a = np.asarray(im)[..., 3]
    b, unten, cx = sockelbreite(a)

    faktor = SOCKEL_BREITE / max(b, 1)
    neu = im.resize((max(1, round(im.width * faktor)), max(1, round(im.height * faktor))), Image.LANCZOS)
    leinwand = Image.new("RGBA", LEINWAND, (0, 0, 0, 0))
    x = round(LEINWAND[0] / 2 - cx * faktor)
    y = round(FUSS - (unten + 1) * faktor)
    leinwand.alpha_composite(neu, (max(-neu.width, x), max(-neu.height, y)))
    return leinwand


def _ast(z, x, y, hoehe, rng, tiefe=0):
    """Ein feiner Blitz, der vom Sockel nach oben kriecht und ausduennt."""
    schritte = 9
    for i in range(schritte):
        rest = 1 - i / schritte
        nx, ny = x + rng.uniform(-7, 7), y - hoehe / schritte
        z.line([x, y, nx, ny], fill=int(255 * rest), width=1)
        x, y = nx, ny
        if tiefe < 1 and rng.random() < 0.22 and rest > 0.4:
            _ast(z, x, y, hoehe * 0.38, rng, tiefe + 1)


def verdorben(bild, saat, restfarbe=0.16):
    W, H = bild.size
    rgb = np.asarray(bild, np.float32)[..., :3] / 255
    alpha = np.asarray(bild)[..., 3]

    grau = rgb @ np.array([0.30, 0.59, 0.11])
    body = np.dstack([grau] * 3) * (1 - restfarbe) + rgb * restfarbe
    body = np.clip(body ** 1.26 * 0.55, 0, 1)
    body += (1 - grau)[..., None] * np.array([0.05, 0.01, 0.10]) * 0.9

    a_im = Image.fromarray(alpha)
    kante = np.asarray(a_im.filter(ImageFilter.MaxFilter(5))).astype(np.float32) - alpha.astype(np.float32)
    kante = np.asarray(Image.fromarray(np.clip(kante, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))) / 255
    body += LILA * kante[..., None]

    rng = random.Random(saat)
    bl = Image.new("L", (W, H), 0)
    z = ImageDraw.Draw(bl)
    ys, xs = np.nonzero(alpha > 200)
    if len(xs):
        boden = ys.max()
        for _ in range(6):
            _ast(z, rng.uniform(xs.min(), xs.max()), boden - rng.uniform(0, H * 0.02),
                 rng.uniform(H * 0.16, H * 0.34), rng)
    kern = np.asarray(bl).astype(np.float32) / 255
    glut = np.asarray(bl.filter(ImageFilter.GaussianBlur(7))).astype(np.float32) / 255
    innen = (alpha > 120).astype(np.float32)
    body += LILA * (glut * 1.25 * innen)[..., None]
    body += (kern * 0.55 * innen)[..., None]
    body += LILA * (kern * 0.8 * innen)[..., None]

    neu_a = np.clip(alpha.astype(np.float32) + glut * 55, 0, 255).astype(np.uint8)
    return Image.fromarray(np.dstack([(np.clip(body, 0, 1) * 255).astype(np.uint8), neu_a]), "RGBA")


if __name__ == "__main__":
    os.makedirs(ZIEL, exist_ok=True)
    for alt in glob.glob(os.path.join(ZIEL, "*.webp")):
        os.remove(alt)
    n = 0
    for f in sorted(glob.glob(os.path.join(ROH, "v4-*.png"))):
        name = os.path.basename(f)[3:-4]           # "pawn" oder "boss-b01"
        bild = normieren(f)
        if bild is None:
            print("leer:", name); continue
        bild.save(f"{ZIEL}/carved-{name}-light.webp", "WEBP", quality=92, method=6)
        verdorben(bild, 4200 + (abs(hash(name)) % 9973)).save(
            f"{ZIEL}/carved-{name}-dark.webp", "WEBP", quality=92, method=6)
        n += 1
        print("gebaut:", name)
    print(f"carve-build: {n} Figuren, je hell und verdorben")
