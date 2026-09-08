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
from detour import separer, masque, ligne_contact

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
        # 2e passage : LE RECALAGE. La ligne de contact varie d'une vue
        # à l'autre — le sac bouge dans le cadre, et la détection a son
        # propre bruit. On relève d'abord toutes les lignes, on prend la
        # MÉDIANE, et l'on décale chaque vue pour l'y amener. C'est ce
        # qui donne la sensation d'un plateau tournant plutôt que d'une
        # pièce qui sautille.
        cadres, lignes = [], []
        for f in vues:
            im = Image.open(f).convert('RGB').crop(tuple(int(v) for v in bb))
            im = im.resize((LARGE, haut), Image.LANCZOS)
            al, _ = masque(im)
            cadres.append(im); lignes.append(ligne_contact(al))
        ref = int(sorted(lignes)[len(lignes) // 2])
        saccade_avant = sum(abs(lignes[i + 1] - lignes[i])
                            for i in range(len(lignes) - 1)) / max(1, len(lignes) - 1)

        # LE RECALAGE EST DÉSACTIVÉ, et c'est une conclusion, pas un
        # oubli. Recaler chaque vue sur la médiane des lignes détectées
        # a fait passer la saccade de 6,1 à 27,4 px par vue sur le tour
        # rouge : la détection par symétrie est trop bruitée pour servir
        # de base à un déplacement. Le remède était pire que le mal.
        # Une séparation pièce/sol fiable demande un matting à la main
        # ou entraîné — pas une heuristique de plus.
        RECALER = False
        poids = 0; contacts = []
        for k, im in enumerate(cadres):
            dy = (ref - lignes[k]) if RECALER else 0
            if dy:
                cal = Image.new('RGB', im.size, im.getpixel((3, 3)))
                cal.paste(im, (0, dy))
                im = cal
            piece, sol, y = separer(im)
            contacts.append(y)
            p = os.path.join(DST, '%s-%02d.webp' % (cle, k))
            piece.save(p, 'WEBP', quality=Q, method=6, exact=True)
            poids += os.path.getsize(p)
            # l'ombre, à part et en petit : la page la compose et la pilote
            so = Image.new('RGBA', im.size, (0, 0, 0, 0))
            so.putalpha(sol)
            so.thumbnail((520, 520), Image.LANCZOS)
            q = os.path.join(DST, '%s-%02d-o.webp' % (cle, k))
            so.save(q, 'WEBP', quality=52, method=6, exact=True)
            poids += os.path.getsize(q)
        total += poids
        amp = max(contacts) - min(contacts)
        saccade = sum(abs(contacts[i + 1] - contacts[i])
                      for i in range(len(contacts) - 1)) / max(1, len(contacts) - 1)
        fonds[cle] = {'modele': modele, 'nuance': nuance, 'peau': peau,
                      'vues': len(vues), 'contact': sum(contacts) // len(contacts),
                      'haut': haut, 'derive': amp}
        print('%-18s %2d vues  %dx%d  %6d Ko  saccade %.1f → %.1f px/vue  (%s · %s)' %
              (cle, len(vues), LARGE, haut, poids // 1024,
               saccade_avant, saccade, nuance, peau))
    import json
    with open(os.path.join(DST, 'tours.json'), 'w') as fh:
        json.dump(fonds, fh, indent=1)
    print('total %d Ko' % (total // 1024))


if __name__ == '__main__':
    main()
