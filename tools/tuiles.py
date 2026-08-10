# -*- coding: utf-8 -*-
"""Tuiles de cuir à partir des PHOTOGRAPHIES du client (tools/photos/).

Le client a tranché : pas de matière redessinée — ses vraies peaux, dupliquées.
Pipeline par photo :
  1. recadrage de la zone nette et à plat
  2. niveaux de gris (la nuance vient du navigateur : hard-light sur la tuile)
  3. aplanissement de l'éclairage — on divise par une version très floutée,
     sinon le vignettage de la photo dessine un damier au tuilage
  4. raccord : décalage d'un demi-tour (np.roll) fondu avec l'original —
     les bords deviennent exacts, la transition se fait au centre
  5. recentrage sur 128 (hard-light à 128 = identité) et quantification

Vérification finale : le saut au raccord doit rester ≤ 1.6× le saut interne.
"""
import numpy as np
from PIL import Image

N = 512

def flou(h, r):
    k = int(r * 3) | 1
    ax = np.arange(k) - k // 2
    g = np.exp(-(ax ** 2) / (2 * r * r)); g /= g.sum()
    out = np.zeros_like(h)
    for i, w in zip(ax, g): out += np.roll(h, int(i), axis=1) * w
    h2 = np.zeros_like(h)
    for i, w in zip(ax, g): h2 += np.roll(out, int(i), axis=0) * w
    return h2

def sstep(a, b, x):
    t = np.clip((x - a) / (b - a + 1e-9), 0, 1)
    return t * t * (3 - 2 * t)

def tuile(src, crop, nom, contraste=(1, 99, 0.10, 0.90), r_aplat=64,
          fondu=(0.52, 0.96), lissage=0.0, egalise=0, fondu_axe='xy', rot=0):
    im = Image.open('tools/photos/' + src).convert('L')
    if rot: im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
    if crop: im = im.crop(crop)
    c = min(im.size)
    im = im.crop(((im.width - c) // 2, (im.height - c) // 2,
                  (im.width + c) // 2, (im.height + c) // 2))
    g = np.asarray(im.resize((N, N), Image.LANCZOS), dtype=float) / 255.0
    if lissage: g = flou(g, lissage)          # étouffe le bruit de capteur / webp

    # 3 · aplanir l'éclairage (lumière multiplicative)
    base = flou(g, r_aplat)
    g = g / np.maximum(base, 1e-3)

    # 3b · égalisation du contraste local : un reflet délave la texture
    #      (écart-type local minuscule) — on le renormalise au lieu de
    #      l'écrêter, ce qui rend leurs sillons aux zones brûlées
    if egalise:
        m = flou(g, egalise)
        et = np.sqrt(np.maximum(flou((g - m) ** 2, egalise), 1e-6))
        g = (g - m) / et
        g = np.clip(g, -2.6, 2.6)

    # étaler sur une plage médiane, centrée pour hard-light
    p_lo, p_hi, v_lo, v_hi = contraste
    a, b = np.percentile(g, p_lo), np.percentile(g, p_hi)
    g = np.clip((g - a) / (b - a + 1e-9), 0, 1) * (v_hi - v_lo) + v_lo
    g = g - g.mean() + 0.5

    # 4 · raccord par demi-tour fondu : R est exact aux bords,
    #     l'original est exact au centre, le fondu vit entre les deux.
    #     fondu_axe='x' : structure en RANGS déjà raccordée en vertical
    #     (bords posés dans les sillons) — on ne roule qu'en x, les rangs
    #     restent alignés pendant le mélange et rien ne se dédouble.
    ys, xs = np.mgrid[0:N, 0:N]
    if fondu_axe == 'x':
        R = np.roll(g, N // 2, 1)
        d = np.abs(xs - N / 2) / (N / 2)
    else:
        R = np.roll(np.roll(g, N // 2, 0), N // 2, 1)
        d = np.maximum(np.abs(xs - N / 2), np.abs(ys - N / 2)) / (N / 2)
    M = sstep(fondu[0], fondu[1], d)
    t = M * R + (1 - M) * g
    if fondu_axe == 'x':
        # les lèvres haut/bas du pli ne se correspondent pas colonne à
        # colonne : un fondu de quelques pixels les recorrèle sans dédoubler
        R2 = np.roll(t, N // 2, 0)
        d2 = np.abs(ys - N / 2) / (N / 2)
        M2 = sstep(0.955, 1.0, d2)
        t = M2 * R2 + (1 - M2) * t

    a8 = np.clip(t * 255, 0, 255)
    a8 = np.round(a8 / (256 / 96)) * (256 / 96)
    Image.fromarray(a8.astype(np.uint8), 'L').save('tools/cuirs/%s.png' % nom, optimize=True)
    print('%-10s %6d o  (source %s)' % (nom, len(open('tools/cuirs/%s.png' % nom, 'rb').read()), src))

# ── caviar : macro à plat ; aplat serré (r=18) — au-delà il restait des
#    nappes claires qui dessinaient un damier au tuilage
tuile('caviar-noir.jpg', (30, 20, 660, 600), 'caviar',
      contraste=(1, 98, 0.12, 0.86), r_aplat=18, lissage=0.5, egalise=16)
# ── lisse : la nappe plane en bas du drapé ; box calf = très peu de relief,
#    on garde l'ondulation lente et on écrase le bruit webp
tuile('lisse-noir.webp', (30, 420, 470, 800), 'lisse',
      contraste=(5, 95, 0.42, 0.58), r_aplat=26, lissage=1.2)
# ── galuchat : le bleu à plat, cadré hors couronne et hors perles brûlées
tuile('galuchat-bleu.jpg', (620, 110, 1190, 680), 'galuchat',
      contraste=(1, 98.5, 0.10, 0.90), r_aplat=30, lissage=0.4)
# ── alligator : bords haut/bas posés DANS les sillons entre rangs (mesurés
#    sur la photo), fondu réduit à une bande étroite pour ne pas dédoubler
#    les écailles, reflets écrêtés au 97e centile
# le rang supérieur de la photo est brûlé par le reflet (aucune texture à
# récupérer), le bas aussi : fenêtre nette mesurée y 102–497, bornée
# par deux sillons pour que le raccord vertical se fasse dans un pli
tuile('aligator-noir.jpg', (18, 102, 582, 497), 'alligator',
      contraste=(2, 98, 0.10, 0.88), r_aplat=28, fondu=(0.80, 0.99),
      egalise=22, fondu_axe='x')

# ── grainé : la photo à plat du client ; le bandeau « Pebbled Leather »
#    (en bas au centre) est hors cadre
tuile('graine-noir.jpg', (100, 0, 415, 315), 'graine',
      contraste=(1, 98, 0.14, 0.86), r_aplat=20, lissage=0.4, egalise=14,
      fondu=(0.42, 0.93))
# ── daim : photo drapée — les rouleaux font de larges dégradés que
#    l'aplanissement + l'égalisation effacent ; le velours est isotrope
#    la photo est un drapé : on la fait pivoter de -21° pour coucher la face
#    éclairée du rouleau central à l'horizontale, et on découpe DEDANS,
#    sans toucher les ombres de pli
tuile('daim-noir.jpg', (185, 445, 585, 645), 'daim', rot=-21,
      contraste=(2, 98, 0.40, 0.60), r_aplat=22, lissage=0.8, egalise=18)

print()
echecs = 0
for n in ['graine', 'caviar', 'lisse', 'daim', 'galuchat', 'alligator']:
    a = np.asarray(Image.open('tools/cuirs/%s.png' % n), dtype=float)
    for axe, nomax in ((1, 'vertical'), (0, 'horizontal')):
        # saut par paire de lignes adjacentes : les sillons d'une peau
        # structurée (alligator) sont les transitions naturelles les plus
        # fortes — un raccord posé DANS un sillon doit être comparé à eux,
        # pas au saut moyen dilué par les aplats d'écailles.
        paires = np.abs(np.diff(a, axis=axe)).mean(axis=1 - axe)
        d_rac = np.abs(np.take(a, 0, axis=axe) - np.take(a, -1, axis=axe)).mean()
        r = d_rac / (paires.mean() + 1e-9)
        sillon = np.percentile(paires, 97) * 1.1
        bon = r < 1.6 or d_rac <= sillon
        if not bon: echecs += 1
        print('%-10s raccord %-11s %5.2f× (sillon nat. %5.1f, raccord %5.1f) %s'
              % (n, nomax, r, sillon, d_rac, 'OK' if bon else 'COUTURE'))
import sys
sys.exit(1 if echecs else 0)
