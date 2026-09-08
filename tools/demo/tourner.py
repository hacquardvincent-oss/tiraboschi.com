# -*- coding: utf-8 -*-
"""Découpe les tours d'objet du shooting « 3D SITE » en séquences web.

Le studio a photographié cinq tours complets en un seul dossier
numéroté. On les sépare par la couleur dominante, on DÉTOURE chaque vue
(voir detour.py) et on exporte.

TROIS RÈGLES, sans lesquelles un tour d'objet ne tourne pas :

1. UN CADRAGE COMMUN À TOUTE LA SÉQUENCE, borné à l'image. Recadrer
   chaque vue sur son propre sujet fait sauter la pièce à chaque degré.
2. LA PIÈCE EST DÉTOURÉE. Le fond de studio visible derrière un objet
   qu'on fait tourner trahit tout de suite le montage.
3. ASSEZ DE DÉFINITION POUR LA TAILLE D'AFFICHAGE. Une vue exportée à
   660 px et montrée à 800 px est floue — c'est le même défaut que sur
   les visuels de la galerie, et il se voit encore plus sur un objet
   qu'on manipule.

LA COLETTE IVOIRE EST ÉCARTÉE : son panneau en V a très exactement la
teinte de la toile de studio, ET il communique avec l'extérieur par
l'ouverture du sac. Aucun détourage automatique ne peut le retenir.
Il lui faut une reprise à la main, ou une reprise de vue sur fond
contrasté.

Lancer depuis la racine :
    python3 tools/demo/tourner.py <dossier-source> [largeur] [qualité]
"""
import glob, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, ImageChops
from detour import detourer

SRC = sys.argv[1] if len(sys.argv) > 1 else 'tools/demo/source-3d'
LARGE = int(sys.argv[2]) if len(sys.argv) > 2 else 1400
Q = int(sys.argv[3]) if len(sys.argv) > 3 else 60
DST = 'tools/demo/tours'

# les cinq tours, relevés par couleur dominante. L'ivoire est écarté :
# voir l'en-tête du fichier.
TOURS = [
    ('colette-rouge',    1,  39, 'Colette', 'Rouge Carmin', 'Alligator'),
    ('colette-bordeaux', 40,  72, 'Colette', 'Bordeaux',     'Alligator'),
    ('colette-cognac',  102, 123, 'Colette', 'Cognac',       'Veau lisse'),
    ('olympe-camel',    124, 138, 'Olympe',  'Camel',        'Veau grainé'),
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
        poids = 0
        for k, f in enumerate(vues):
            im = Image.open(f).convert('RGB').crop(tuple(int(v) for v in bb))
            im = im.resize((LARGE, haut), Image.LANCZOS)
            im = detourer(im)
            p = os.path.join(DST, '%s-%02d.webp' % (cle, k))
            im.save(p, 'WEBP', quality=Q, method=6, exact=True)
            poids += os.path.getsize(p)
        total += poids
        fonds[cle] = {'modele': modele, 'nuance': nuance, 'peau': peau,
                      'vues': len(vues)}
        print('%-18s %2d vues  %dx%d  %6d Ko  (%s · %s)' %
              (cle, len(vues), LARGE, haut, poids // 1024, nuance, peau))
    import json
    with open(os.path.join(DST, 'tours.json'), 'w') as fh:
        json.dump(fonds, fh, indent=1)
    print('total %d Ko' % (total // 1024))


if __name__ == '__main__':
    main()
