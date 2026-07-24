# -*- coding: utf-8 -*-
"""Hebt die gemalten Insignien auf eine hoehere Leuchtdichte, OHNE Schleier.

Warum es einen zweiten Anlauf brauchte: 0.29.0 hat den Schwarzpunkt ANGEHOBEN
(jeder Pixel bekam einen Boden von 14). Das macht ein Bild zwar heller, legt
aber einen milchigen Schleier darueber - die Tiefen sind nicht mehr schwarz,
und Glanz ist Kontrast, nicht Helligkeit. Gemessen an den Waren: das fuenfte
Perzentil stieg von 13 auf 32, und genau das hat man als Schleier gesehen.

Richtig ist der umgekehrte Griff: ein EINGANGS-Schwarzpunkt. Alles unterhalb
von ib wird auf echtes Schwarz geklemmt, der Rest wird per Gammakurve
aufgezogen. Ergebnis: Tiefen bleiben tief, Mitten und Lichter kommen hoch,
der Glanz bleibt.

Nur die Insignien werden angefasst. Waren, Erfolge, Orbs und Wappen bleiben
so, wie sie gemalt wurden - sie waren nie das Problem.

Aufruf:  python3 tools/lift-art.py [--dry]
"""
import re, base64, io, sys
from PIL import Image, ImageEnhance

ICONS_JS = 'src/app/ui/assets/icons/iconAssets.js'
TARGET = 150.0   # mittlere Leuchtdichte, Ziel
IB     = 0.12    # Eingangs-Schwarzpunkt: darunter wird echtes Schwarz
SAT    = 1.14    # Gold soll golden bleiben


def stats(im):
    px = im.load()
    v = []
    for y in range(0, im.height, 2):
        for x in range(0, im.width, 2):
            r, g, b, a = px[x, y]
            if a > 40:
                v.append(0.2126 * r + 0.7152 * g + 0.0722 * b)
    v.sort()
    n = max(len(v), 1)
    return v[n // 20], v[n // 2], v[19 * n // 20], sum(v) / n


def levels(im, gamma, ib=IB, sat=SAT):
    lut = []
    for v in range(256):
        y = (v / 255.0 - ib) / (1.0 - ib)
        y = 0.0 if y <= 0 else y ** gamma
        lut.append(min(255, int(round(y * 255))))
    r, g, b, a = im.split()
    r, g, b = r.point(lut), g.point(lut), b.point(lut)
    rgb = ImageEnhance.Color(Image.merge('RGB', (r, g, b))).enhance(sat)
    return Image.merge('RGBA', (*rgb.split(), a))


def fit(im, target=TARGET):
    if stats(im)[3] >= target:
        return im, 1.0
    lo, hi = 0.15, 1.2
    for _ in range(20):
        m = (lo + hi) / 2
        if stats(levels(im, m))[3] < target:
            hi = m
        else:
            lo = m
    g = (lo + hi) / 2
    return levels(im, g), g


if __name__ == '__main__':
    dry = '--dry' in sys.argv
    src = open(ICONS_JS).read()
    report = []

    def repl(m):
        name, b64 = m.group(1), m.group(2)
        im = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGBA')
        before = stats(im)
        out, g = fit(im)
        after = stats(out)
        buf = io.BytesIO()
        out.save(buf, 'WEBP', quality=92, method=6)
        report.append((name, before, after, g, len(buf.getvalue()) // 1024))
        return 'export const %s = "data:image/webp;base64,%s"' % (
            name, base64.b64encode(buf.getvalue()).decode())

    new_src = re.sub(r'export const (\w+) = "data:image/webp;base64,([A-Za-z0-9+/=]+)"', repl, src)
    if not dry:
        open(ICONS_JS, 'w').write(new_src)
    print('%-14s %s' % ('', 'p5  median  p95  Mittel'))
    for n, a, b, g, kb in report:
        print('%-14s vorher %4.0f %6.0f %5.0f %6.0f' % (n, a[0], a[1], a[2], a[3]))
        print('%-14s neu    %4.0f %6.0f %5.0f %6.0f   gamma=%.3f  %dkb' % ('', b[0], b[1], b[2], b[3], g, kb))
    print('%d Insignien%s' % (len(report), ' (Probelauf)' if dry else ' geschrieben'))
