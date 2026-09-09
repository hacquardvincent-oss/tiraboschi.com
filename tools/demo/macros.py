# -*- coding: utf-8 -*-
"""Les macros de matière — UNE PAR PEAU ET PAR ÉLÉMENT.

Le shooting « ZOOM MATIERE » a livré 51 gros plans, et ils couvrent
CINQ déclinaisons en parallèle : rouge carmin, cognac, ivoire, bordeaux
et l'Olympe camel. On n'en utilisait que quatorze, indexées par
matière : la Colette bordeaux et la Colette rouge sont toutes deux en
alligator, elles recevaient donc la MÊME macro — rouge. Sur la vidéo de
recette, on regardait un sac bordeaux avec une écaille écarlate à côté,
et un fond cognac sous un alligator bordeaux. Le montage se voyait.

La table ci-dessous est un relevé À L'ŒIL sur les 51 vues : elle dit,
pour chaque peau et chaque élément, quelle prise de vue le montre. Ce
n'est pas automatisable — il faut reconnaître une tranche d'une anse.

Lancer depuis la racine :
    python3 tools/demo/macros.py <dossier ZOOM MATIERE> [largeur] [qualité]
"""
import glob
import os
import re
import sys

from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else 'tools/demo/source-zoom'
LARGE = int(sys.argv[2]) if len(sys.argv) > 2 else 1500
Q = int(sys.argv[3]) if len(sys.argv) > 3 else 58
DST = 'tools/demo/tours'

# peau → { élément : numéro de la prise de vue }
TABLE = {
    'colette-rouge':    {'peau': 7,  'v': 6,  'anse': 5,  'tranche': 10,
                         'fond': 9,  'doublure': 38, 'ferrure': 2},
    'colette-bordeaux': {'peau': 29, 'v': 30, 'anse': 35, 'tranche': 28,
                         'fond': 32, 'doublure': 36, 'ferrure': 31},
    'colette-cognac':   {'peau': 12, 'v': 37, 'anse': 14, 'tranche': 13,
                         'fond': 16, 'doublure': 15, 'ferrure': 17},
    'olympe-camel':     {'peau': 39, 'v': 42, 'anse': 44, 'tranche': 45,
                         'fond': 43, 'doublure': 46, 'ferrure': 41},
}


def main():
    fs = {}
    for f in glob.glob(os.path.join(SRC, '**', '*.jpg'), recursive=True):
        m = re.search(r'-(\d+)\.jpg$', f)
        if m:
            fs[int(m.group(1))] = f
    if not fs:
        sys.exit('aucune macro dans ' + SRC)
    os.makedirs(DST, exist_ok=True)
    total = 0
    for peau, els in TABLE.items():
        for el, n in els.items():
            if n not in fs:
                print('%-22s %-9s vue %02d absente' % (peau, el, n))
                continue
            im = Image.open(fs[n])
            im.draft('RGB', (LARGE, LARGE))
            im = im.convert('RGB')
            h = max(1, round(LARGE * im.size[1] / im.size[0]))
            im = im.resize((LARGE, h), Image.LANCZOS)
            p = os.path.join(DST, 'm-%s-%s.webp' % (peau, el))
            im.save(p, 'WEBP', quality=Q, method=6)
            total += os.path.getsize(p)
    print('%d macros, %d Ko' % (sum(len(v) for v in TABLE.values()), total // 1024))


if __name__ == '__main__':
    main()
