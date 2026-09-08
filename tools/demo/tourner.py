# -*- coding: utf-8 -*-
"""Découpe les tours d'objet du shooting « 3D SITE » en séquences web.

Le studio a photographié cinq tours complets (quatre Colette, une Olympe)
en un seul dossier numéroté. On les sépare par la couleur dominante, puis
on exporte chaque vue.

DEUX RÈGLES, sans lesquelles un tour d'objet ne tourne pas :

1. UN CADRAGE COMMUN À TOUTE LA SÉQUENCE. Si l'on recadre chaque vue sur
   son propre sujet, la pièce saute d'une image à l'autre : elle change
   de taille et de position à chaque degré. On calcule donc l'union des
   boîtes englobantes de la séquence entière, et on recadre tout le monde
   pareil.
2. UNE HAUTEUR DE SOCLE COMMUNE. Le bas de la pièce doit rester à la même
   ligne : c'est ce qui donne l'impression qu'elle tourne sur un plateau
   plutôt qu'elle ne flotte.

Lancer depuis la racine :
    python3 tools/demo/tourner.py <dossier-source> [largeur] [qualité]
"""
import glob, os, re, sys
import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

SRC = sys.argv[1] if len(sys.argv) > 1 else 'tools/demo/source-3d'
LARGE = int(sys.argv[2]) if len(sys.argv) > 2 else 660
Q = int(sys.argv[3]) if len(sys.argv) > 3 else 56
DST = 'tools/demo/tours'

# les cinq tours, relevés par couleur dominante (voir le journal de session)
TOURS = [
    ('colette-rouge',    1,  39, 'Colette', 'Rouge Carmin',  'Alligator'),
    ('colette-bordeaux', 40,  72, 'Colette', 'Bordeaux',      'Alligator'),
    ('colette-ivoire',   73, 101, 'Colette', 'Ivoire',        'Alligator'),
    ('colette-cognac',  102, 123, 'Colette', 'Cognac',        'Veau lisse'),
    ('olympe-camel',    124, 138, 'Olympe',  'Camel',         'Veau grainé'),
]


def boite(im, seuil=14):
    """la boîte du sujet sur un fond de studio clair"""
    fond = Image.new('RGB', im.size, im.getpixel((4, 4)))
    d = ImageChops.difference(im.convert('RGB'), fond).convert('L')
    return d.point(lambda p: 255 if p > seuil else 0).getbbox()


def union(a, b):
    if not a: return b
    if not b: return a
    return (min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3]))


def fondu(im, marge=.13):
    """Fait disparaître le bord du plateau, sans détourer la pièce.

    Un détourage automatique casse ici : la toile de studio n'est pas
    d'un gris égal, et sur la Colette ivoire la pièce est AUSSI CLAIRE
    que le fond — le masque la mange. Essayé, mesuré, abandonné.

    On fait donc l'inverse, et c'est plus juste pour la maison : on
    garde la prise de vue telle quelle, avec sa vraie ombre portée, et
    l'on estompe seulement le bord du cadre. Posée sur une page de la
    même couleur que la toile, la pièce paraît reposer dans la salle —
    sans un seul artefact de découpe.

    Renvoie l'image adoucie et la couleur exacte de la toile, pour que
    la page puisse s'y accorder au pixel près.
    """
    a = np.asarray(im.convert('RGB'), dtype=np.float32)
    h, w, _ = a.shape
    m = max(3, w // 40)
    bord = np.concatenate([a[:, :m], a[:, -m:]], axis=1).reshape(-1, 3)
    toile = tuple(int(v) for v in np.median(bord, axis=0))
    # la toile n'est pas plate : un halo l'éclaire derrière la pièce.
    # On relève AUSSI ce cœur clair, pour que la page prolonge le même
    # dégradé — sinon le plateau reste un rectangle plus lumineux.
    cx, cy = int(w * .5), int(h * .3)
    d = max(6, w // 22)
    coeur = a[max(0, cy - d):cy + d, max(0, cx - d):cx + d].reshape(-1, 3)
    halo = tuple(int(v) for v in np.percentile(coeur, 88, axis=0))

    # un fondu en cosinus sur la marge : le raccord ne se voit pas
    marge = .22
    def rampe(n, k):
        r = np.ones(n, dtype=np.float32)
        if k < 1: return r
        t = np.linspace(0, np.pi / 2, k)
        r[:k] = np.sin(t) ** 2
        r[-k:] = np.sin(t[::-1]) ** 2
        return r
    ax = rampe(w, int(w * marge))
    ay = rampe(h, int(h * marge * 1.3))
    al = np.minimum(ax[None, :], ay[:, None]) * 255

    out = im.convert('RGBA')
    out.putalpha(Image.fromarray(al.astype(np.uint8), 'L'))
    return out, toile, halo


def main():
    fs = {int(re.search(r'-(\d+)\.jpg$', f).group(1)): f
          for f in glob.glob(os.path.join(SRC, '*.jpg'))}
    if not fs:
        sys.exit('aucune vue dans ' + SRC)
    os.makedirs(DST, exist_ok=True)
    total = 0; fonds = {}
    for cle, a, b, modele, nuance, peau in TOURS:
        vues = [fs[i] for i in range(a, b + 1) if i in fs]
        if not vues:
            print('%-18s aucune vue' % cle); continue
        # 1er passage : le cadrage commun
        bb = None
        for f in vues:
            im = Image.open(f); im.draft('RGB', (1200, 800))
            r = im.size[0] / Image.open(f).size[0]
            c = boite(im)
            if c: bb = union(bb, tuple(v / r for v in c))
        # une marge pour l'ombre portée — BORNÉE À L'IMAGE : au-delà,
        # PIL comble en noir, le fondu s'y accroche et l'on mesure une
        # toile noire au lieu du gris du studio.
        W, H = Image.open(vues[0]).size
        m = 0.035 * (bb[2] - bb[0])
        bb = (max(0, bb[0] - m), max(0, bb[1] - m),
              min(W, bb[2] + m), min(H, bb[3] + m * 1.6))
        haut = round(LARGE * (bb[3] - bb[1]) / (bb[2] - bb[0]))
        poids = 0; toile = (240, 238, 236); halo = (250, 249, 250)
        for k, f in enumerate(vues):
            im = Image.open(f).convert('RGB').crop(tuple(int(v) for v in bb))
            im = im.resize((LARGE, haut), Image.LANCZOS)
            im, toile, halo = fondu(im)
            p = os.path.join(DST, '%s-%02d.webp' % (cle, k))
            im.save(p, 'WEBP', quality=Q, method=6, exact=True)
            poids += os.path.getsize(p)
        total += poids
        fonds[cle] = {'bord': '#%02x%02x%02x' % toile, 'halo': '#%02x%02x%02x' % halo}
        print('%-18s %2d vues  %dx%d  %5d Ko  bord %s halo %s  (%s · %s)' %
              (cle, len(vues), LARGE, haut, poids // 1024,
               fonds[cle]['bord'], fonds[cle]['halo'], nuance, peau))
    import json
    with open(os.path.join(DST, 'toiles.json'), 'w') as fh:
        json.dump(fonds, fh, indent=1)
    print('total %d Ko · toiles → tours/toiles.json' % (total // 1024))


if __name__ == '__main__':
    main()
