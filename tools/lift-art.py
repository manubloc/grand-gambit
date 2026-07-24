# -*- coding: utf-8 -*-
"""Hebt alle gemalten UI-Bildfamilien auf eine einheitliche Ziel-Leuchtdichte.

Verfahren je Bild: Gammakurve (haelt den Weisspunkt, brennt also nichts aus)
+ leichter Schwarzpunkt-Lift, damit Konturen auf dem Navy nicht absaufen,
+ etwas Saettigung, damit Gold golden bleibt und die Edelsteine der Orbs
ihre Bedeutung behalten. Idempotent: liegt ein Bild schon auf Ziel oder
darueber, wird es nicht angefasst.

Aufruf:  python3 tools/lift-art.py [--dry]

Familien und Ziele stehen unten in FAMILIES. Die Icons liegen als base64 in
iconAssets.js (wie die Orbs, gegen Cache-Vergiftung), alles andere als webp.
"""
import re, base64, io, sys, glob, os
from PIL import Image, ImageEnhance

BLACK = 14  # Schwarzpunkt anheben

# name -> (Ziel-Leuchtdichte, Saettigung)
FAMILIES = {
    'icons': (160.0, 1.18),
    'items': (140.0, 1.12),
    'ach':   (132.0, 1.12),
    'orbs':  (104.0, 1.05),
    'misc':  (118.0, 1.10),
}

ICONS_JS = 'src/app/ui/assets/icons/iconAssets.js'
GLOBS = {
    'items': ['src/app/ui/assets/items/*.webp'],
    'ach':   ['src/app/ui/assets/ach/*.webp'],
    'orbs':  ['src/app/ui/assets/stat/orb-*.webp', 'src/app/ui/assets/stat/strip-*.webp'],
    'misc':  ['src/app/ui/assets/emblem.webp', 'src/app/ui/assets/crest-*.webp'],
}


def mean_lum(im, step=2):
    px = im.load()
    tot = 0.0
    n = 0
    for y in range(0, im.height, step):
        for x in range(0, im.width, step):
            r, g, b, a = px[x, y]
            if a > 40:
                tot += 0.2126 * r + 0.7152 * g + 0.0722 * b
                n += 1
    return tot / max(n, 1)


def apply_curve(im, gamma, sat):
    lut = []
    for v in range(256):
        y = (v / 255.0) ** gamma
        y = BLACK / 255.0 + y * (1.0 - BLACK / 255.0)
        lut.append(min(255, int(round(y * 255))))
    r, g, b, a = im.split()
    r, g, b = r.point(lut), g.point(lut), b.point(lut)
    rgb = ImageEnhance.Color(Image.merge('RGB', (r, g, b))).enhance(sat)
    return Image.merge('RGBA', (*rgb.split(), a))


def lift(im, target, sat):
    cur = mean_lum(im)
    if cur >= target:
        return im, 1.0, cur, cur
    lo, hi = 0.15, 1.0
    for _ in range(20):
        mid = (lo + hi) / 2
        if mean_lum(apply_curve(im, mid, sat)) < target:
            hi = mid
        else:
            lo = mid
    g = (lo + hi) / 2
    out = apply_curve(im, g, sat)
    return out, g, cur, mean_lum(out)


def do_icons(dry, report):
    target, sat = FAMILIES['icons']
    src = open(ICONS_JS).read()

    def repl(m):
        name, b64 = m.group(1), m.group(2)
        im = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGBA')
        out, g, cur, new = lift(im, target, sat)
        buf = io.BytesIO()
        out.save(buf, 'WEBP', quality=92, method=6)
        report.append(('icons', name, cur, new, g, len(buf.getvalue()) // 1024))
        nb = base64.b64encode(buf.getvalue()).decode()
        return 'export const %s = "data:image/webp;base64,%s"' % (name, nb)

    new_src = re.sub(r'export const (\w+) = "data:image/webp;base64,([A-Za-z0-9+/=]+)"', repl, src)
    if not dry:
        open(ICONS_JS, 'w').write(new_src)


def do_files(fam, dry, report):
    target, sat = FAMILIES[fam]
    paths = []
    for pat in GLOBS[fam]:
        paths.extend(sorted(glob.glob(pat)))
    for p in paths:
        im = Image.open(p).convert('RGBA')
        out, g, cur, new = lift(im, target, sat)
        buf = io.BytesIO()
        out.save(buf, 'WEBP', quality=92, method=6)
        report.append((fam, os.path.basename(p), cur, new, g, len(buf.getvalue()) // 1024))
        if not dry and g < 1.0:
            open(p, 'wb').write(buf.getvalue())


if __name__ == '__main__':
    dry = '--dry' in sys.argv
    report = []
    do_icons(dry, report)
    for fam in ('items', 'ach', 'orbs', 'misc'):
        do_files(fam, dry, report)
    for fam, n, c, nw, g, kb in report:
        print('%-6s %-26s %6.1f -> %6.1f  gamma=%.3f  %dkb' % (fam, n, c, nw, g, kb))
    print('%d Bilder%s' % (len(report), ' (Probelauf)' if dry else ' geschrieben'))
