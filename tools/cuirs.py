# -*- coding: utf-8 -*-
"""Génère des textures de cuir photographiques, seamless, en niveaux de gris.

Le rendu procédural SVG (feTurbulence) ne produisait pas du cuir : il produisait
du bruit. Ici on construit une vraie carte de hauteur par matière, puis on
l'éclaire (diffus + spéculaire + occlusion de cavité) comme un moteur de rendu.

Sortie : PNG gris centré sur 128. Le navigateur applique la couleur avec
    background-color: <cuir>; background-blend-mode: hard-light;
hard-light à 128 = identité, en dessous ça assombrit, au dessus ça éclaire —
donc un seul PNG par matière colore les 55 nuances, y compris les noires.
"""
import math, random
import numpy as np
from PIL import Image

N = 256  # tuile

def wrapd(a, b, n=1.0):
    """Distance signée la plus courte sur un tore."""
    d = a - b
    return d - np.round(d / n) * n

def fbm(shape, octaves, base_freq, seed, persistence=0.5):
    """Bruit fractal seamless : on synthétise dans le domaine de Fourier."""
    rng = np.random.default_rng(seed)
    out = np.zeros(shape)
    amp = 1.0
    tot = 0.0
    for o in range(octaves):
        f = base_freq * (2 ** o)
        g = rng.random((f, f))
        # La grille est répétée 3× avant l'agrandissement, puis on garde le centre :
        # sans ça le rééchantillonnage ne boucle pas et la tuile montre ses coutures.
        g3 = np.tile(g, (3, 3))
        big = np.array(Image.fromarray((g3 * 255).astype(np.uint8))
                       .resize((shape[1] * 3, shape[0] * 3), Image.BICUBIC), dtype=float) / 255.0
        img = big[shape[0]:2 * shape[0], shape[1]:2 * shape[1]]
        out += img * amp
        tot += amp
        amp *= persistence
    out /= tot
    return (out - out.min()) / (np.ptp(out) + 1e-9)

def points_tore(n, seed, jitter=1.0, grid=None):
    """Points de Worley répartis, périodiques."""
    rng = random.Random(seed)
    pts = []
    if grid:
        for gy in range(grid):
            for gx in range(grid):
                pts.append(((gx + rng.uniform(-.5, .5) * jitter) / grid,
                            (gy + rng.uniform(-.5, .5) * jitter) / grid))
    else:
        for _ in range(n):
            pts.append((rng.random(), rng.random()))
    return pts

def worley(pts, shape=(N, N)):
    """F1 et F2 sur un tore. Boucle sur les points : 400 passes de 256², rapide."""
    ys, xs = np.mgrid[0:shape[0], 0:shape[1]]
    xs = xs / shape[1]; ys = ys / shape[0]
    f1 = np.full(shape, 9.0); f2 = np.full(shape, 9.0)
    id1 = np.zeros(shape, dtype=np.int32)
    for i, (px, py) in enumerate(pts):
        dx = wrapd(xs, px); dy = wrapd(ys, py)
        d = np.sqrt(dx * dx + dy * dy)
        plus_proche = d < f1
        f2 = np.where(plus_proche, f1, np.minimum(f2, d))
        id1 = np.where(plus_proche, i, id1)
        f1 = np.where(plus_proche, d, f1)
    return f1, f2, id1

def sstep(a, b, x):
    t = np.clip((x - a) / (b - a + 1e-9), 0, 1)
    return t * t * (3 - 2 * t)

def flou(h, r):
    """Flou gaussien séparable, wrap → reste seamless."""
    if r <= 0: return h
    k = int(r * 3) | 1
    ax = np.arange(k) - k // 2
    g = np.exp(-(ax ** 2) / (2 * r * r)); g /= g.sum()
    out = np.zeros_like(h)
    for i, w in zip(ax, g): out += np.roll(h, int(i), axis=1) * w
    h2 = np.zeros_like(h)
    for i, w in zip(ax, g): h2 += np.roll(out, int(i), axis=0) * w
    return h2

def eclairer(h, force=1.0, kd=0.85, ks=0.35, brillance=28, ao=0.55, lum=(-.42, -.60, .68)):
    """Height map → image éclairée. np.roll pour les dérivées : seamless."""
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
    cavite = np.clip(flou(h, 6) - h, 0, 1)
    v = 0.30 + kd * diff + ks * spec - ao * cavite
    return v

def norm(v):
    return (v - v.min()) / (np.ptp(v) + 1e-9)

def sortir(v, nom, lo=0.16, hi=0.90, gamma=1.0, niveaux=48, renorm=True):
    # Les matières presque planes (box calf, daim) ont une amplitude minuscule :
    # normaliser APRÈS avoir ajouté le grain fin l'écrasait et donnait du granit.
    if renorm:
        v = norm(v)
    v = v ** gamma
    v = lo + v * (hi - lo)
    a = np.clip(v * 255, 0, 255)
    # quantifier : le PNG compresse bien mieux, l'œil ne voit pas la différence
    a = np.round(a / (256 / niveaux)) * (256 / niveaux)
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'L')
    im.save('tools/cuirs/%s.png' % nom, optimize=True)
    print('%-12s %5d o' % (nom, len(open('tools/cuirs/%s.png' % nom, 'rb').read())))

import os
os.makedirs('tools/cuirs', exist_ok=True)
os.makedirs('tools/out', exist_ok=True)

# ── GRAINÉ (togo / veau grainé) : plateaux cellulaires séparés de sillons
pts = points_tore(0, 11, jitter=.92, grid=13)
f1, f2, id1 = worley(pts)
rng = np.random.default_rng(3)
hauteur_cel = rng.random(len(pts))[id1]           # chaque grain a sa hauteur
bord = sstep(0.0, 0.030, f2 - f1)                 # sillon entre deux grains
dome = 1 - sstep(0.0, 0.055, f1)                  # bombé du grain
h = 0.74 * bord + 0.18 * dome + 0.08 * hauteur_cel
h = h + 0.16 * fbm((N, N), 4, 16, 7)              # pores
h = flou(h, 0.7)
sortir(eclairer(h, force=.017, kd=.88, ks=.12, brillance=14, ao=.54), 'graine', lo=.21, hi=.85)

# ── LISSE (box calf) : presque plan, pores fins, éclat franc
h = 0.35 * fbm((N, N), 5, 32, 21) + 0.65 * fbm((N, N), 3, 5, 22)
h = flou(h, 1.6)
v = norm(eclairer(h, force=.0022, kd=.42, ks=.95, brillance=60, ao=.16))
v = np.clip(v + 0.030 * (fbm((N, N), 2, 110, 23) - .5), 0, 1)   # pores du veau
sortir(v, 'lisse', lo=.40, hi=.69, renorm=False, niveaux=96)

# ── DAIM (velours) : fibres courtes, aucun éclat
h = flou(fbm((N, N), 2, 12, 31), 2.2)             # ondulation large du nubuck
v = norm(eclairer(h, force=.0016, kd=.55, ks=.30, brillance=2.2, ao=.10))
fibres = norm(fbm((N, N), 1, 150, 33))            # le poil
nappe  = norm(flou(fbm((N, N), 2, 22, 34), 1.6))  # sens du poil, plages claires
v = flou(0.30 * v + 0.42 * fibres + 0.28 * nappe, 0.6)
sortir(v, 'daim', lo=.33, hi=.74, renorm=False)

# ── GALUCHAT (peau de raie) : perles serrées, très nacré
pts = points_tore(0, 41, jitter=.98, grid=26)
f1, f2, id1 = worley(pts)
r = 0.021
perle = np.sqrt(np.clip(1 - (f1 / r) ** 2, 0, 1))  # calottes sphériques
taille = 0.72 + 0.28 * np.random.default_rng(5).random(len(pts))[id1]
h = perle * taille
h = h + 0.05 * fbm((N, N), 3, 32, 51)
h = flou(h, 0.6)
sortir(eclairer(h, force=.020, kd=.50, ks=1.25, brillance=34, ao=.55), 'galuchat', lo=.20, hi=.97)

# ── PYTHON : rangs d'écailles irrégulières + livrée sombre
rng = random.Random(61)
pts = []
RANGS, PAR = 15, 26
for gy in range(RANGS):
    off = rng.random()
    for gx in range(PAR):
        pts.append((((gx + off + rng.uniform(-.34, .34)) % PAR) / PAR,
                    (gy + rng.uniform(-.16, .16)) / RANGS))
f1, f2, id1 = worley(pts)
bord = sstep(0.0, 0.016, f2 - f1)
dome = np.sqrt(np.clip(1 - (f1 / 0.036) ** 2, 0, 1))
alea = (0.70 + 0.30 * np.random.default_rng(62).random(len(pts)))[id1]
h = (0.60 * bord + 0.40 * dome) * alea
livree = sstep(.36, .60, flou(fbm((N, N), 2, 5, 71), 2.0))   # taches de la peau
h = h * (0.66 + 0.34 * livree) + 0.05 * fbm((N, N), 3, 40, 72)
h = flou(h, 0.8)
v = eclairer(h, force=.016, kd=.74, ks=.42, brillance=24, ao=.58)
v = v - 0.16 * (1 - livree)                       # la livrée assombrit vraiment
sortir(v, 'python', lo=.14, hi=.93)

# ── ALLIGATOR : grandes écailles irrégulières, sillons profonds
rng = random.Random(81)
pts = []
RANGS, PAR = 7, 8
for gy in range(RANGS):
    off = rng.random()
    for gx in range(PAR):
        pts.append((((gx + off + rng.uniform(-.30, .30)) % PAR) / PAR,
                    (gy + rng.uniform(-.20, .20)) / RANGS))
f1, f2, id1 = worley(pts)
bord = sstep(0.0, 0.030, f2 - f1)                 # sillon large et profond
dome = np.sqrt(np.clip(1 - (f1 / 0.085) ** 2, 0, 1))
alea = (0.76 + 0.24 * np.random.default_rng(82).random(len(pts)))[id1]
h = (0.58 * bord + 0.42 * dome) * alea
h = h + 0.06 * fbm((N, N), 4, 24, 91)             # grain dans l'écaille
h = flou(h, 1.1)
sortir(eclairer(h, force=.024, kd=.80, ks=.34, brillance=20, ao=.70), 'alligator', lo=.13, hi=.92)


# ═══ Vérification : la tuile boucle-t-elle vraiment ? ═══
# On compare le saut au raccord au saut moyen à l'intérieur. Au-delà de 2×,
# l'œil voit la couture — c'est le défaut qu'on vient de corriger.
print()
for n in ['graine', 'lisse', 'daim', 'galuchat', 'python', 'alligator']:
    a = np.asarray(Image.open('tools/cuirs/%s.png' % n), dtype=float)
    for axe, nom in ((1, 'vertical'), (0, 'horizontal')):
        d_int = np.abs(np.diff(a, axis=axe)).mean()
        d_rac = np.abs(np.take(a, 0, axis=axe) - np.take(a, -1, axis=axe)).mean()
        r = d_rac / (d_int + 1e-9)
        print('%-10s raccord %-11s %5.2f× %s' % (n, nom, r, 'OK' if r < 1.6 else 'COUTURE'))
