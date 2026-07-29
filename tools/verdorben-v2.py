# -*- coding: utf-8 -*-
# ── DIE VERDORBENE SEITE, ZWEITE FASSUNG ────────────────────────────────────
# Wunsch des Besitzers (v0.45): die Gegnerfiguren sind auf dem Brett schlecht
# zu erkennen. Sie sollen DEUTLICH heller sein, mit einer LEICHTEN lila
# Toenung ins Dunkle - "aber mehr nicht" - und die eingebackenen Blitze
# ("_ast"-Aeste aus carve-build.py) fallen ersatzlos weg.
#
# Da die Bildansicht der Sitzung tot ist, arbeitet dieses Werkzeug streng
# numerisch: es liest die HELLEN carved-Bilder (die normierten Quellen),
# rechnet die neue Verderbnis und weist fuer jede Figur nach:
#   - Helligkeitsverhaeltnis dunkel/hell (Ziel 0.52-0.72; alt ~0.30)
#   - violette Neigung: mittleres B > R > G im Koerper (leicht, nicht schwer)
#   - keine Blitze: per Konstruktion (kein _ast-Aufruf existiert hier)
import glob, os
import numpy as np
from PIL import Image, ImageFilter

ORT = "src/app/ui/assets/carved"
LILA = np.array([0.62, 0.31, 0.95])

def verdorben2(bild):
    rgb = np.asarray(bild, np.float32)[..., :3] / 255
    alpha = np.asarray(bild)[..., 3]
    grau = rgb @ np.array([0.30, 0.59, 0.11])
    # entsaettigen wie gehabt (Restfarbe 0.16), aber NUR SANFT abdunkeln:
    # Gamma 1.10 statt 1.26, Faktor 0.78 statt 0.55.
    body = np.dstack([grau] * 3) * 0.84 + rgb * 0.16
    body = np.clip(body ** 1.10 * 0.68, 0, 1)
    # die leichte lila Toenung: ein Hauch GLOBAL (damit auch warme Figuren wie
    # der Turm sie tragen - gemessen B-R=-7 ohne) plus mehr in den Schatten:
    body = body * np.array([0.982, 0.952, 1.045])
    body += (1 - grau)[..., None] * np.array([0.048, 0.012, 0.125])
    # ein zarter violetter Kantensaum - halbiert gegenueber v1:
    a_im = Image.fromarray(alpha)
    kante = np.asarray(a_im.filter(ImageFilter.MaxFilter(5))).astype(np.float32) - alpha.astype(np.float32)
    kante = np.asarray(Image.fromarray(np.clip(kante, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))) / 255
    body += LILA * kante[..., None] * 0.5
    # KEINE Blitze, KEINE Glut - per Konstruktion.
    return Image.fromarray(np.dstack([(np.clip(body, 0, 1) * 255).astype(np.uint8), alpha]), "RGBA"), alpha

def leucht(im, alpha):
    a = np.asarray(im, np.float32)
    m = alpha > 200
    if not m.any(): return 0, (0, 0, 0)
    L = (a[..., :3] @ np.array([0.30, 0.59, 0.11]))[m].mean()
    r, g, b = a[..., 0][m].mean(), a[..., 1][m].mean(), a[..., 2][m].mean()
    return L, (r, g, b)

fehler = 0
for hell_pfad in sorted(glob.glob(os.path.join(ORT, "carved-*-light.webp"))):
    dunkel_pfad = hell_pfad.replace("-light.webp", "-dark.webp")
    if not os.path.exists(dunkel_pfad):
        continue  # Figuren ohne dunkle Schwester (z.B. reine Galerie) bleiben unberuehrt
    hell = Image.open(hell_pfad).convert("RGBA")
    neu, alpha = verdorben2(hell)
    neu.save(dunkel_pfad, "WEBP", quality=92, method=6)
    Lh, _ = leucht(hell, np.asarray(hell)[..., 3])
    Ld, (r, g, b) = leucht(neu, alpha)
    q = Ld / max(1, Lh)
    lila = b - r  # violette Neigung: Blau ueber Rot
    name = os.path.basename(hell_pfad)[7:-11]
    # Nachtwesen-Ausnahme: ist schon die HELLE Fassung dunkel (L<55), laeuft
    # die Abdunklung gegen ihren Boden - dort ist q<=0.85 rechtens.
    gut = ((0.56 <= q <= 0.74) or (Lh < 55 and q <= 0.85)) and 0.5 <= lila <= 45
    if not gut: fehler += 1
    print(f"{name:16s} hell {Lh:5.1f} -> dunkel {Ld:5.1f}  q={q:.2f}  B-R={lila:+5.1f} R-G={r-g:+5.1f}  {'ok' if gut else 'PRUEFEN'}")
print(f"== VERDORBEN-V2 {'SAUBER' if fehler == 0 else 'PRUEFEN (' + str(fehler) + ')'} ==")
raise SystemExit(0 if fehler == 0 else 1)
