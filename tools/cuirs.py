# -*- coding: utf-8 -*-
"""Tuiles GÉNÉRÉES : grainé et daim uniquement — en attendant les photos
du client (les quatre autres matières viennent de tools/tuiles.py, qui
découpe ses vraies peaux).

Cible : la photo de veau grainé fournie par le client (grain FIN et irrégulier,
sillons étroits et sombres, lumière douce et mate). La v1 produisait des
« galets » : cellules 4× trop grosses, éclairage plastique.

Recette par matière : champ de cellules Worley périodique (cKDTree sur points
tuilés 3×3) → carte de hauteur → éclairage diffus + spéculaire + occlusion de
cavité, le tout en dérivées np.roll donc rigoureusement seamless.

Sortie : PNG gris centrés ~128. La couleur arrive dans le navigateur :
    background-color:<nuance>; background-blend-mode:hard-light
"""
import math, random
import numpy as np
from PIL import Image
from scipy.spatial import cKDTree

N = 512  # tuile

# ── outils périodiques ────────────────────────────────────────────
def fbm(shape, octaves, base_freq, seed, persistence=0.5):
    """Bruit fractal seamless : grille répétée 3×3 avant l'agrandissement."""
    rng = np.random.default_rng(seed)
    out = np.zeros(shape); amp = 1.0; tot = 0.0
    for o in range(octaves):
        f = base_freq * (2 ** o)
        g = rng.random((f, f))
        g3 = np.tile(g, (3, 3))
        big = np.array(Image.fromarray((g3 * 255).astype(np.uint8))
                       .resize((shape[1] * 3, shape[0] * 3), Image.BICUBIC), dtype=float) / 255.0
        out += big[shape[0]:2 * shape[0], shape[1]:2 * shape[1]] * amp
        tot += amp; amp *= persistence
    out /= tot
    return (out - out.min()) / (np.ptp(out) + 1e-9)

def worley(pts, aniso=1.0):
    """f1, f2, id du plus proche — périodique via points tuilés 3×3.
       aniso > 1 étire les cellules horizontalement (peau, sens du dos)."""
    pts = np.asarray(pts, dtype=float)
    n = len(pts)
    offs = [(dx, dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1)]
    tuil = np.concatenate([pts + np.array(o) for o in offs])
    esc = np.array([1.0, aniso])
    tree = cKDTree(tuil * esc)
    ys, xs = np.mgrid[0:N, 0:N] / N
    q = np.stack([xs.ravel(), ys.ravel()], axis=1) * esc
    d, i = tree.query(q, k=2)
    f1 = d[:, 0].reshape(N, N); f2 = d[:, 1].reshape(N, N)
    id1 = (i[:, 0] % n).reshape(N, N)
    return f1, f2, id1

def semis(grid, seed, jitter=1.0, garde=1.0):
    """Semis de points : grille jitterée, avec suppression aléatoire pour
       créer des cellules doubles (le grain réel n'est pas calibré)."""
    rng = random.Random(seed)
    pts = []
    for gy in range(grid):
        for gx in range(grid):
            if rng.random() > garde: continue
            pts.append((((gx + rng.uniform(-.5, .5) * jitter) % grid) / grid,
                        ((gy + rng.uniform(-.5, .5) * jitter) % grid) / grid))
    return pts

def sstep(a, b, x):
    t = np.clip((x - a) / (b - a + 1e-9), 0, 1)
    return t * t * (3 - 2 * t)

def flou(h, r):
    if r <= 0: return h
    k = int(r * 3) | 1
    ax = np.arange(k) - k // 2
    g = np.exp(-(ax ** 2) / (2 * r * r)); g /= g.sum()
    out = np.zeros_like(h)
    for i, w in zip(ax, g): out += np.roll(h, int(i), axis=1) * w
    h2 = np.zeros_like(h)
    for i, w in zip(ax, g): h2 += np.roll(out, int(i), axis=0) * w
    return h2

def norm(v):
    return (v - v.min()) / (np.ptp(v) + 1e-9)

def eclairer(h, force=1.0, kd=0.85, ks=0.35, brillance=28, ao=0.55,
             r_ao=3.0, lum=(-.40, -.62, .67)):
    h = h.astype(float)
    dx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * 0.5 * force * N
    dy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * 0.5 * force * N
    nz = np.ones_like(h)
    ln = np.sqrt(dx * dx + dy * dy + nz * nz)
    nx, ny, nz = -dx / ln, -dy / ln, nz / ln
    L = np.array(lum) / np.linalg.norm(lum)
    diff = np.clip(nx * L[0] + ny * L[1] + nz * L[2], 0, 1)
    V = np.array([0, 0, 1.0])
    H = (L + V); H /= np.linalg.norm(H)
    spec = np.clip(nx * H[0] + ny * H[1] + nz * H[2], 0, 1) ** brillance
    cavite = np.clip(flou(h, r_ao) - h, 0, 1)
    return 0.30 + kd * diff + ks * spec - ao * cavite

def sortir(v, nom, lo=0.16, hi=0.90, renorm=True, niveaux=72):
    if renorm: v = norm(v)
    v = lo + v * (hi - lo)
    a = np.clip(v * 255, 0, 255)
    a = np.round(a / (256 / niveaux)) * (256 / niveaux)
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'L')
    im.save('tools/cuirs/%s.png' % nom, optimize=True)
    print('%-12s %6d o' % (nom, len(open('tools/cuirs/%s.png' % nom, 'rb').read())))

def plis(seed, freq, seuil, prof, large):
    """Plis longs et peu profonds qui traversent le grain (bruit ridé)."""
    w = fbm((N, N), 3, freq, seed)
    ride = 1 - np.abs(2 * w - 1)
    return flou(sstep(seuil, 1.0, ride), large) * prof

import os
os.makedirs('tools/cuirs', exist_ok=True)
os.makedirs('tools/out', exist_ok=True)

# ═══ GRAINÉ — veau grainé fin (la photo de référence) ═══
# ~1000 cellules irrégulières : jitter fort + 12 % de cellules fusionnées.
pts = semis(36, 11, jitter=1.25, garde=.88)
f1, f2, id1 = worley(pts, aniso=1.12)
rng = np.random.default_rng(3)
alea = (0.86 + 0.14 * rng.random(len(pts)))[id1]
crease = sstep(0.0, 0.0034, f2 - f1)           # sillon hairline
dome   = 1 - 0.24 * sstep(0.004, 0.024, f1)    # bombé discret du grain
h = crease * dome * alea
h = h - plis(7, 5, 0.94, 0.10, 1.6)            # plis longs, à peine visibles
h = h + 0.05 * fbm((N, N), 4, 32, 8)           # micro-pores
h = flou(h, 0.6)
v = eclairer(h, force=.024, kd=.92, ks=.05, brillance=6, ao=.80, r_ao=1.8)
v = norm(v) + 0.05 * (fbm((N, N), 2, 6, 9) - .5)   # respiration lente de la peau
sortir(v, 'graine', lo=.27, hi=.74)

# ═══ DAIM — velours : poil fin, plages de sens, aucun éclat ═══
h = flou(fbm((N, N), 2, 10, 41), 2.2)
v = norm(eclairer(h, force=.0016, kd=.55, ks=.28, brillance=2.2, ao=.10))
fibres = norm(flou(fbm((N, N), 1, 200, 43), 0.7))
nappe  = norm(flou(fbm((N, N), 2, 8, 44), 4.0))
v = flou(0.38 * v + 0.24 * fibres + 0.38 * nappe, 0.9)
v = 0.5 + (v - 0.5) * 0.80
sortir(v, 'daim', lo=.40, hi=.66, renorm=False)

# ═══ Vérification : la tuile boucle-t-elle vraiment ? ═══
print()
for n in ['graine', 'daim']:
    a = np.asarray(Image.open('tools/cuirs/%s.png' % n), dtype=float)
    for axe, nom in ((1, 'vertical'), (0, 'horizontal')):
        d_int = np.abs(np.diff(a, axis=axe)).mean()
        d_rac = np.abs(np.take(a, 0, axis=axe) - np.take(a, -1, axis=axe)).mean()
        r = d_rac / (d_int + 1e-9)
        print('%-10s raccord %-11s %5.2f× %s' % (n, nom, r, 'OK' if r < 1.6 else 'COUTURE'))
