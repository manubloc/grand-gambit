# -*- coding: utf-8 -*-
"""Hebt die gemalten Gold-Icons auf eine einheitliche Ziel-Leuchtdichte.
Gamma-Kurve (haelt Weisspunkt, kein Clipping) + leichter Schwarzpunkt-Lift
+ leichte Saettigung. Idempotent: liegt ein Bild schon auf Ziel, passiert nichts.
"""
import re, base64, io, sys, math
from PIL import Image, ImageEnhance

TARGET = float(sys.argv[1]) if len(sys.argv) > 1 else 118.0
BLACK  = 14      # Schwarzpunkt anheben, damit Konturen nicht absaufen
SAT    = 1.10    # Gold soll golden bleiben

def mean_lum(im):
    px = im.load(); tot = 0.0; n = 0
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if a > 40:
                tot += 0.2126*r + 0.7152*g + 0.0722*b; n += 1
    return tot / max(n, 1), n

def apply_curve(im, gamma):
    lut = []
    for v in range(256):
        y = (v / 255.0) ** gamma
        y = BLACK/255.0 + y * (1.0 - BLACK/255.0)
        lut.append(min(255, int(round(y * 255))))
    r, g, b, a = im.split()
    r, g, b = r.point(lut), g.point(lut), b.point(lut)
    out = Image.merge('RGBA', (r, g, b, a))
    return Image.merge('RGBA', (*ImageEnhance.Color(Image.merge('RGB', out.split()[:3])).enhance(SAT).split(), a))

def lift(im, target=TARGET):
    cur, _ = mean_lum(im)
    if cur >= target: return im, 1.0, cur, cur
    lo, hi = 0.25, 1.0
    for _ in range(22):
        mid = (lo + hi) / 2
        m, _ = mean_lum(apply_curve(im, mid))
        if m < target: hi = mid
        else: lo = mid
    g = (lo + hi) / 2
    out = apply_curve(im, g)
    new, _ = mean_lum(out)
    return out, g, cur, new

if __name__ == '__main__':
    path = 'src/app/ui/assets/icons/iconAssets.js'
    src = open(path).read()
    report = []
    def repl(m):
        name, b64 = m.group(1), m.group(2)
        im = Image.open(io.BytesIO(base64.b64decode(b64))).convert('RGBA')
        out, g, cur, new = lift(im)
        buf = io.BytesIO(); out.save(buf, 'WEBP', quality=92, method=6)
        nb = base64.b64encode(buf.getvalue()).decode()
        report.append((name, cur, new, g, len(buf.getvalue())//1024))
        out.save(f'/home/claude/ic/{name}_neu.png')
        return f'export const {name} = "data:image/webp;base64,{nb}"'
    new_src = re.sub(r'export const (\w+) = "data:image/webp;base64,([A-Za-z0-9+/=]+)"', repl, src)
    open(path, 'w').write(new_src)
    for n, c, nw, g, kb in report:
        print(f'{n:14s} {c:6.1f} -> {nw:6.1f}  gamma={g:.3f}  {kb}kb')
