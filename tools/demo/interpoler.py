# -*- coding: utf-8 -*-
"""Peut-on compléter un tour d'objet en fabriquant les vues manquantes ?

La question mérite une mesure, pas une opinion. Le protocole :

On prend un tour DENSE dont on connaît la vérité — la Colette rouge,
39 vues, 9,2° entre deux. On en retire des vues pour simuler un tour
clairsemé, on reconstruit celles qu'on a retirées, et on compare la
reconstruction à la vraie vue. L'erreur se chiffre.

Deux méthodes :
  · le FONDU CROISÉ, qui superpose simplement les deux vues voisines ;
  · le MORPHING PAR FLUX OPTIQUE, qui estime le déplacement de chaque
    pixel entre les deux vues et les fait converger l'une vers l'autre.

Ce qu'on cherche à savoir : à quel écart angulaire la reconstruction
cesse d'être crédible. Au-delà, des faces apparaissent ou disparaissent
— aucun flux ne les invente.

Lancer : python3 tools/demo/interpoler.py
"""
import glob
import sys

import cv2
import numpy as np
from PIL import Image

TOUR = 'tools/demo/tours/colette-rouge-%02d.webp'


def charger(i):
    im = Image.open(TOUR % i).convert('RGBA')
    return np.asarray(im).astype(np.float32)


def fondu(a, b, t):
    return a * (1 - t) + b * t


def morphing(a, b, t):
    """Chaque image avance vers l'autre le long du flux estimé."""
    ga = cv2.cvtColor(a[..., :3].astype(np.uint8), cv2.COLOR_RGB2GRAY)
    gb = cv2.cvtColor(b[..., :3].astype(np.uint8), cv2.COLOR_RGB2GRAY)
    fab = cv2.calcOpticalFlowFarneback(ga, gb, None, .5, 5, 25, 5, 7, 1.5, 0)
    fba = cv2.calcOpticalFlowFarneback(gb, ga, None, .5, 5, 25, 5, 7, 1.5, 0)
    h, w = ga.shape
    gx, gy = np.meshgrid(np.arange(w, dtype=np.float32),
                         np.arange(h, dtype=np.float32))

    def tirer(img, flot, k):
        mx = (gx + flot[..., 0] * k).astype(np.float32)
        my = (gy + flot[..., 1] * k).astype(np.float32)
        return cv2.remap(img, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)

    va = tirer(a, fab, t)
    vb = tirer(b, fba, 1 - t)
    return va * (1 - t) + vb * t


def erreur(x, y):
    """écart moyen sur les pixels où l'une des deux vues porte la pièce"""
    m = (x[..., 3] > 40) | (y[..., 3] > 40)
    if not m.any():
        return 0.0
    d = np.abs(x[..., :3] - y[..., :3]).mean(axis=2)
    return float(d[m].mean() / 255 * 100)


def main():
    n = len(glob.glob('tools/demo/tours/colette-rouge-[0-9][0-9].webp'))
    if n < 12:
        sys.exit('tour trop court')
    pas_deg = 360.0 / n
    print("Colette rouge : %d vues, %.1f° entre deux vues.\n" % (n, pas_deg))
    print("%-9s %-8s  %-16s %-16s" % ('écart', 'saut', 'fondu croisé', 'flux optique'))
    for saut in (2, 3, 4, 5):
        ea, eb = [], []
        for i in range(0, n - saut, saut):
            a, b = charger(i), charger((i + saut) % n)
            for k in range(1, saut):
                vrai = charger(i + k)
                t = k / saut
                ea.append(erreur(fondu(a, b, t), vrai))
                eb.append(erreur(morphing(a, b, t), vrai))
        print("%-9s %-8s  %5.2f %% d'écart   %5.2f %% d'écart" %
              ('%.0f°' % (pas_deg * saut), '×%d' % saut,
               float(np.mean(ea)), float(np.mean(eb))))

    # une planche pour juger à l'œil, à l'écart de l'Olympe (24°)
    saut = 3
    i = 6
    a, b = charger(i), charger(i + saut)
    vrai = charger(i + 1)
    V = 420
    pl = Image.new('RGB', (3 * V, 330), (0x10, 0x10, 0x14))
    for k, (img, nom) in enumerate([
            (fondu(a, b, 1 / saut), 'fondu croisé'),
            (morphing(a, b, 1 / saut), 'flux optique'),
            (vrai, 'la vraie vue')]):
        im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), 'RGBA')
        im.thumbnail((V - 8, 322))
        pl.paste(im, (k * V + 4, (330 - im.height) // 2), im)
    pl.save('/tmp/claude-0/-home-user-tiraboschi-com/'
            '0c5da69e-11bb-5c63-83b6-1098a8c5334e/scratchpad/essai_interpolation.png')
    print('\nplanche : fondu · flux · vérité, à 28° d\'écart')


if __name__ == '__main__':
    main()
