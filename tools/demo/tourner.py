# -*- coding: utf-8 -*-
"""Découpe les tours d'objet du shooting « 3D SITE » en séquences web.

Le studio a photographié cinq tours complets en un seul dossier
numéroté. On les sépare par la couleur dominante, on DÉTOURE chaque vue
(voir detour.py), ON LA REMET SUR L'AXE, et on exporte.

QUATRE RÈGLES, sans lesquelles un tour d'objet ne tourne pas :

1. UN CADRAGE COMMUN À TOUTE LA SÉQUENCE. Recadrer chaque vue sur son
   propre sujet fait sauter la pièce à chaque degré.
2. LE CADRE SE PREND SUR LA PIÈCE, PAS SUR LE STUDIO. Mesuré : le
   cadrage par écart au pixel du coin retenait la nappe entière, et la
   pièce n'occupait plus que 380 px sur 1400 — 27 % du cadre. Le reste
   était de la toile, exportée en pure perte, et la pièce paraissait
   floue parce qu'elle était petite. Le cadre se prend donc sur l'UNION
   DES SILHOUETTES détourées.
3. LA PIÈCE EST DÉTOURÉE. Le fond de studio visible derrière un objet
   qu'on fait tourner trahit tout de suite le montage.
4. LA PIÈCE EST REMISE SUR SON AXE (voir plus bas). Sans quoi elle
   dérive dans le cadre au lieu de tourner sur elle-même.

═══ REMETTRE LA PIÈCE SUR SON AXE ═══

Sur un plateau tournant, le centre de masse de la silhouette est une
fonction PÉRIODIQUE LISSE de l'angle : quelques harmoniques la
décrivent. C'est de la parallaxe, c'est vrai, et il ne faut pas y
toucher — sur la Colette rouge elle vaut 177 px d'amplitude.

Ce qui S'ÉCARTE de cette courbe lisse, en revanche, n'est pas de la
rotation : c'est la pièce reposée un peu à côté entre deux prises. On
ajuste donc une série de Fourier tronquée sur le centre de masse, et
l'on ramène chaque vue sur la courbe. Relevé avant correction :

    tour              résidu x   résidu y
    colette-rouge      5,4 px    11,1 px
    colette-bordeaux   6,9 px    28,2 px
    colette-cognac    14,1 px    13,2 px
    olympe-camel       7,6 px    16,7 px

sur des pièces larges de 380 à 400 px : le bordeaux dérivait de 7 % de
la largeur de la pièce, et cela se voyait.

ORDRE 3 EN X, ORDRE 2 EN Y, et ce n'est pas un réglage : en x la
parallaxe est réelle et riche (l'ordre 1 laisse encore 14,7 px de
résidu sur le rouge, l'ordre 3 en laisse 5,4) ; en y un objet rigide sur
un plateau NE MONTE PAS — le vrai signal est presque plat, tout le
reste est de la manipulation.

C'est aussi ce qui rachète l'échec précédent : recaler sur la MÉDIANE
d'une ligne de contact détectée par symétrie forçait une constante là
où il y a une courbe, avec un détecteur bruité par-dessus. La saccade
passait de 6,1 à 27,4 px/vue. On ne force plus une constante : on suit
la courbe, et on la mesure sur l'alpha du détourage, pas sur une
heuristique de reflet.

LA COLETTE IVOIRE EST ÉCARTÉE : son panneau en V a très exactement la
teinte de la toile de studio, ET il communique avec l'extérieur par
l'ouverture du sac. Aucun détourage automatique ne peut le retenir.
Il lui faut une reprise à la main, ou une reprise de vue sur fond
contrasté.

Lancer depuis la racine :
    python3 tools/demo/tourner.py <dossier-source> [largeur] [qualité]
"""
import glob, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from PIL import Image
from detour import separer, masque, bornes

SRC = sys.argv[1] if len(sys.argv) > 1 else 'tools/demo/source-3d'
LARGE = int(sys.argv[2]) if len(sys.argv) > 2 else 1400
Q = int(sys.argv[3]) if len(sys.argv) > 3 else 60
DST = 'tools/demo/tours'

# la marge autour de la pièce. Elle n'est pas décorative : `masque()`
# modélise la toile du studio sur un anneau de bordure de 7 %. Un cadre
# serré au point d'y faire entrer la pièce ferait ajuster la nappe SUR
# LE SUJET, et le détourage s'effondrerait. 11 % laisse l'anneau libre.
MARGE = .11
MARGE_BAS = .14   # l'ombre portée se pose sous la pièce

# les cinq tours, relevés par couleur dominante. L'ivoire est écarté :
# voir l'en-tête du fichier.
TOURS = [
    ('colette-rouge',    1,  39, 'Colette', 'Rouge Carmin', 'Alligator'),
    ('colette-bordeaux', 40,  72, 'Colette', 'Bordeaux',     'Alligator'),
    ('colette-cognac',  102, 123, 'Colette', 'Cognac',       'Veau lisse'),
    ('olympe-camel',    124, 138, 'Olympe',  'Camel',        'Veau grainé'),
]


def union(a, b):
    if not a: return b
    if not b: return a
    return (min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3]))


def _lire(f, boite, larg, haut=None):
    """une vue, recadrée sur `boite` puis ramenée à `larg` de large.

    Le recadrage passe par le paramètre `box` de `resize` : il accepte
    des FLOTTANTS. C'est ce qui permet de décaler une vue d'une fraction
    de pixel — or c'est tout l'objet du recalage, et un `crop` entier y
    remettrait un demi-pixel de tremblement à chaque vue.
    """
    im = Image.open(f)
    W0, H0 = im.size
    if boite is None:
        boite = (0, 0, W0, H0)
    bw = max(1.0, boite[2] - boite[0])
    # `draft` fait décoder le JPEG à l'échelle utile : sans lui, chaque
    # vue coûte 9504 × 6336 pixels pour n'en garder qu'un quart
    im.draft('RGB', (max(1, int(W0 * larg / bw)), max(1, int(H0 * larg / bw))))
    r = im.size[0] / W0
    im = im.convert('RGB')
    b = (max(0.0, boite[0] * r), max(0.0, boite[1] * r),
         min(float(im.size[0]), boite[2] * r), min(float(im.size[1]), boite[3] * r))
    if haut is None:
        haut = max(1, round(larg * (b[3] - b[1]) / max(1e-6, b[2] - b[0])))
    return im.resize((larg, haut), Image.LANCZOS, box=b)


def silhouette(im):
    """centre de masse et boîte de la pièce, en fraction de l'image"""
    al, _ = masque(im)
    bb = bornes(al)
    if bb is None:
        return None
    a = np.asarray(al, dtype=np.float32)
    h, w = a.shape
    # LE CENTRE DE MASSE SE PREND DANS LA BOÎTE, pas sur toute l'image :
    # une frange de halo restée dans un coin le tirerait, et c'est lui
    # qui sert de repère pour remettre la pièce sur son axe.
    a = a[bb[1]:bb[3], bb[0]:bb[2]]
    t = a.sum()
    if t <= 0:
        return None
    ys, xs = np.mgrid[bb[1]:bb[3], bb[0]:bb[2]]
    return {'cx': float((a * xs).sum() / t) / w, 'cy': float((a * ys).sum() / t) / h,
            'bb': (bb[0] / w, bb[1] / h, bb[2] / w, bb[3] / h)}


def lisser(v, ordre):
    """la courbe lisse et périodique qui passe au mieux par v"""
    n = len(v)
    ordre = max(1, min(ordre, (n - 2) // 2))
    th = np.arange(n) * 2 * np.pi / n
    cols = [np.ones(n)]
    for k in range(1, ordre + 1):
        cols += [np.cos(k * th), np.sin(k * th)]
    A = np.stack(cols, axis=-1)
    coef, *_ = np.linalg.lstsq(A, v, rcond=None)
    return A @ coef


def relever(cle):
    """La place que la pièce prend RÉELLEMENT dans sa vue.

    La page en a besoin pour dimensionner : un cadre n'est pas une
    pièce. Selon le modèle et l'angle, le sac tient de 18 % (de profil)
    à 66 % (de face) de la largeur de sa vue. Pour montrer toutes les
    pièces à la même taille apparente, on dimensionne sur la vue la
    plus large du tour — sans quoi une Colette de face déborde quand
    une Olympe de profil se perd.
    """
    fs = sorted(glob.glob(os.path.join(DST, '%s-[0-9][0-9].webp' % cle)))
    if not fs:
        return {}
    ls, hs, cx, bas = [], [], [], []
    for f in fs:
        a = np.asarray(Image.open(f).convert('RGBA'))[..., 3].astype(np.float32)
        b = bornes(Image.fromarray(a.astype(np.uint8), 'L'))
        if not b:
            continue
        ls.append(b[2] - b[0])
        hs.append(b[3] - b[1])
        cx.append((b[0] + b[2]) / 2)
        bas.append(b[3])
    if not ls:
        return {}
    W, H = Image.open(fs[0]).size
    # ── LA PIÈCE TOURNE SUR ELLE-MÊME, pas autour du plateau.
    # La série de Fourier remettait la pièce sur la COURBE de parallaxe :
    # elle est vraie physiquement — l'objet n'était pas centré sur le
    # plateau, il orbitait — mais on ne regarde pas un plateau, on
    # regarde un sac. « L'axe doit se situer sur le bas du V ou au
    # milieu du sac. » On épingle donc, vue par vue, le MILIEU de la
    # silhouette et sa BASE : le sac reste en place et tourne.
    med = float(np.median(bas))
    cal = [[round((W / 2 - cx[i]) / W, 5), round((med - bas[i]) / H, 5)]
           for i in range(len(cx))]
    # ── OÙ EST LA PIÈCE DANS SON CADRE, VUE PAR VUE.
    # Les repères se posaient en fraction du CADRE : ils désignaient
    # donc un point fixe de l'écran, pas un point de l'objet. De face la
    # pièce est large, de profil elle est étroite — le repère des
    # ferrures tombait à 200 px de la ferrure. On publie la boîte de
    # chaque vue (déjà recalée), et la page y place les repères.
    boites = []
    for i, f in enumerate(fs):
        a = np.asarray(Image.open(f).convert('RGBA'))[..., 3].astype(np.float32)
        b = bornes(Image.fromarray(a.astype(np.uint8), 'L'))
        if not b:
            boites.append(boites[-1] if boites else [.4, .1, .6, .9])
            continue
        boites.append([round(b[0] / W + cal[i][0], 4), round(b[1] / H + cal[i][1], 4),
                       round(b[2] / W + cal[i][0], 4), round(b[3] / H + cal[i][1], 4)])
    return {'cadre': [W, H], 'piecemax': max(ls), 'hautmax': max(hs),
            'cal': cal, 'boite': boites,
            'orbite': [round(float(np.ptp(cx))), round(float(np.ptp(bas)))]}


def main():
    fs = {int(re.search(r'-(\d+)\.jpg$', f).group(1)): f
          for f in glob.glob(os.path.join(SRC, '*.jpg'))}
    if not fs:
        sys.exit('aucune vue dans ' + SRC)
    os.makedirs(DST, exist_ok=True)
    total = 0
    fonds = {}
    for cle, a, b, modele, nuance, peau in TOURS:
        vues = [fs[i] for i in range(a, b + 1) if i in fs]
        if not vues:
            print('%-18s aucune vue' % cle)
            continue
        W, H = Image.open(vues[0]).size

        # ── 1er passage, en basse définition : où est la pièce ?
        gros = None
        for f in vues:
            im = _lire(f, None, 620)
            s = silhouette(im)
            if s:
                gros = union(gros, s['bb'])
        mx, my = (gros[2] - gros[0]) * .22, (gros[3] - gros[1]) * .22
        gros = (max(0, gros[0] - mx) * W, max(0, gros[1] - my) * H,
                min(1, gros[2] + mx) * W, min(1, gros[3] + my) * H)

        # ── 2e passage : le centre de masse. 900 px suffisent — il se
        # calcule sur des centaines de milliers de pixels, sa précision
        # est très en dessous du pixel de mesure.
        cx, cy, bbs = [], [], []
        for f in vues:
            im = _lire(f, gros, min(LARGE, 900))
            s = silhouette(im)
            if s is None:
                s = {'cx': .5, 'cy': .5, 'bb': (.4, .4, .6, .6)}
            gw, gh = gros[2] - gros[0], gros[3] - gros[1]
            cx.append(gros[0] + s['cx'] * gw)
            cy.append(gros[1] + s['cy'] * gh)
            bbs.append((gros[0] + s['bb'][0] * gw, gros[1] + s['bb'][1] * gh,
                        gros[0] + s['bb'][2] * gw, gros[1] + s['bb'][3] * gh))
        cx, cy, bbs = np.array(cx), np.array(cy), np.array(bbs)

        # ── la courbe lisse, et l'écart qu'on va corriger
        n = len(vues)
        lx, ly = lisser(cx, 3 if n >= 14 else 2), lisser(cy, 2)
        dx, dy = lx - cx, ly - cy
        # L'AXE DE ROTATION, c'est la composante continue de la courbe en
        # x : sur un tour complet la parallaxe s'annule en moyenne.
        axe = float(lx.mean())

        # ── le cadre : l'union des silhouettes UNE FOIS REMISES SUR L'AXE
        st = bbs + np.stack([dx, dy, dx, dy], axis=-1)
        g, d = float(st[:, 0].min()), float(st[:, 2].max())
        ht, bs = float(st[:, 1].min()), float(st[:, 3].max())
        # symétrique autour de l'axe : le centre du cadre EST l'axe, donc
        # la page n'a qu'à centrer l'image pour que la pièce tourne rond
        demi = max(axe - g, d - axe)
        mh, mv = demi * 2 * MARGE, (bs - ht) * MARGE
        cadre = [axe - demi - mh, ht - mv, axe + demi + mh, bs + (bs - ht) * MARGE_BAS]
        # le cadre décalé doit rester DANS l'image pour toutes les vues :
        # au-delà, PIL comble en noir et la nappe du détourage s'y perd
        mdx, mdy = float(np.abs(dx).max()), float(np.abs(dy).max())
        cadre = [max(mdx, cadre[0]), max(mdy, cadre[1]),
                 min(W - mdx, cadre[2]), min(H - mdy, cadre[3])]
        haut = max(1, round(LARGE * (cadre[3] - cadre[1]) / (cadre[2] - cadre[0])))
        ech = LARGE / (cadre[2] - cadre[0])

        # ── 3e passage : l'export, chaque vue prise à SA fenêtre
        poids = 0
        contacts = []
        for k, f in enumerate(vues):
            fen = (cadre[0] - dx[k], cadre[1] - dy[k],
                   cadre[2] - dx[k], cadre[3] - dy[k])
            im = _lire(f, fen, LARGE, haut)
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
        # les vues en trop d'un export précédent (le cadrage a changé,
        # pas le nombre de vues — mais un tour peut raccourcir)
        for vieux in glob.glob(os.path.join(DST, '%s-[0-9][0-9]*.webp' % cle)):
            i = re.search(r'-(\d+)(-o)?\.webp$', vieux)
            if i and int(i.group(1)) >= len(vues):
                os.remove(vieux)
        total += poids

        # ── ce qu'on a corrigé, en clair et à l'échelle de l'export
        rx, ry = float(dx.std() * ech), float(dy.std() * ech)
        larg_piece = float((st[:, 2] - st[:, 0]).mean() * ech)
        fonds[cle] = {'modele': modele, 'nuance': nuance, 'peau': peau,
                      'vues': len(vues), 'contact': sum(contacts) // len(contacts),
                      'haut': haut, 'piece': round(larg_piece),
                      'residu': [round(rx, 1), round(ry, 1)]}
        fonds[cle].update(relever(cle))
        print('%-18s %2d vues  %dx%d  %5d Ko  pièce %d px (%d %%)  '
              'remise sur l\'axe : %.1f / %.1f px  (%s · %s)' %
              (cle, len(vues), LARGE, haut, poids // 1024, larg_piece,
               round(larg_piece / LARGE * 100), rx, ry, nuance, peau))
    with open(os.path.join(DST, 'tours.json'), 'w') as fh:
        json.dump(fonds, fh, indent=1)
    print('total %d Ko' % (total // 1024))


if __name__ == '__main__':
    main()
