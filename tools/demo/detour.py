# -*- coding: utf-8 -*-
"""Détourage d'une pièce photographiée sur toile de studio.

Première tentative abandonnée à tort : un seuil FIXE mange la Colette
ivoire, aussi claire que le fond. La bonne méthode tient en trois idées.

1. LE FOND EST ESTIMÉ LIGNE PAR LIGNE, sur les marges gauche et droite.
   La toile n'est pas d'un gris égal : elle s'éclaircit vers le haut.
2. LE SEUIL EST CALCULÉ, PAS CHOISI. Otsu sur l'histogramme des écarts :
   il trouve lui-même la vallée entre la toile et la pièce, quelle que
   soit la clarté du cuir. C'est ce qui sauve l'ivoire.
3. ON N'EFFACE QUE CE QUI TOUCHE LE BORD. Un remplissage par diffusion
   depuis les quatre coins : les zones sombres INTÉRIEURES (l'ouverture
   du V, le creux sous l'anse) ne communiquent pas avec l'extérieur,
   donc elles restent. Un simple seuil les mangerait.

L'ombre portée du studio part avec la toile ; on en repose une, douce,
sous la pièce — sans quoi elle flotte.
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter


def _otsu(h):
    """le seuil qui sépare le mieux deux populations"""
    t = h.sum()
    if t == 0:
        return 30
    p = h / t
    w = np.cumsum(p)
    m = np.cumsum(p * np.arange(len(p)))
    mt = m[-1]
    with np.errstate(divide='ignore', invalid='ignore'):
        inter = (mt * w - m) ** 2 / (w * (1 - w))
    inter[~np.isfinite(inter)] = 0
    return int(np.argmax(inter))


def _base(h, w, deg):
    ys, xs = np.mgrid[0:h, 0:w]
    x = (xs / w - .5).astype(np.float32)
    y = (ys / h - .5).astype(np.float32)
    cols = [(x ** i) * (y ** j)
            for i in range(deg + 1) for j in range(deg + 1 - i)]
    return np.stack(cols, axis=-1)


def _anneau(h, w):
    """l'anneau de bordure : 7 % de chaque côté, jamais la pièce"""
    r = np.zeros((h, w), bool)
    my, mx = max(2, int(h * .07)), max(2, int(w * .07))
    r[:my], r[-my:], r[:, :mx], r[:, -mx:] = True, True, True, True
    return r


def _nappe(a, ech=None, deg=2):
    """La toile de studio, ajustée en surface polynomiale.

    Prise sur le seul anneau de bordure, elle EXTRAPOLE vers le centre
    — et le studio y allume un ovale de contre-jour qu'aucune
    extrapolation ne devine. Le halo s'écarte alors du modèle autant
    qu'un cuir, se retrouve classé sujet, forme un anneau fermé autour
    de la pièce que le remplissage ne peut plus franchir, et l'on garde
    une auréole de toile grande comme le sac (vue de face de la Colette
    rouge). D'où le second ajustement de `masque()` : une fois la pièce
    localisée, on refait la nappe SUR LE VRAI FOND, ovale compris.
    """
    h, w, _ = a.shape
    base = _base(h, w, deg)
    if ech is None:
        ech = _anneau(h, w)
    # on n'ajuste que sur un pixel sur quatre : la nappe est lisse, et
    # le système passe de plusieurs millions de lignes à quelques
    # centaines de milliers
    pas = np.zeros((h, w), bool)
    pas[::2, ::2] = True
    ech = ech & pas
    if ech.sum() < base.shape[-1] * 8:
        ech = _anneau(h, w) & pas
    A = base[ech].reshape(-1, base.shape[-1])
    out = np.empty_like(a)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A, a[..., c][ech].ravel(), rcond=None)
        out[..., c] = base @ coef
    return out


def masque(im):
    """Renvoie l'alpha de la pièce (L) et la boîte du sujet.

    Le point dur n'était pas le seuil : c'était L'OMBRE PORTÉE sur la
    toile. Elle s'écarte du fond autant qu'un cuir sombre, donc tout
    seuil la garde. Or une ombre a une signature : elle conserve la
    TEINTE de la toile et n'en baisse que la clarté. On la reconnaît
    donc au rapport canal par canal — trois rapports presque égaux, et
    tous inférieurs à 1.

    Une pièce, elle, ou décale la teinte (le rouge, le bordeaux, le
    cognac, le camel), ou éclaircit (l'ivoire, plus clair que la toile).
    """
    a = np.asarray(im.convert('RGB'), dtype=np.float32)
    h, w, _ = a.shape

    def opp(x):
        """clarté, axe rouge-vert, axe jaune-bleu"""
        return (x.mean(axis=2),
                x[..., 0] - x[..., 1],
                (x[..., 0] + x[..., 1]) * .5 - x[..., 2])

    def juger(fond):
        """l'écart à la toile, et ce qui EST de la toile"""
        fond = np.maximum(fond, 1.0)
        # L'ÉCART SE MESURE EN TEINTE AUTANT QU'EN CLARTÉ. Une distance
        # RGB brute ne voit pas la Colette ivoire : elle est aussi CLAIRE
        # que la toile. Elle en est pourtant nettement plus CHAUDE — la
        # toile tire sur le mauve, le cuir sur le crème. On sépare donc
        # les deux axes chromatiques et on leur donne plus de poids.
        la, ra, ya = opp(a)
        lf, rf, yf = opp(fond)
        ecart = (np.abs(la - lf) * 1.6
                 + np.abs(ra - rf) * 3.4
                 + np.abs(ya - yf) * 3.4)
        # LA SIGNATURE DE LA TOILE : même teinte que la nappe, seule la
        # clarté change. C'est vrai de l'OMBRE PORTÉE (plus sombre) comme
        # du HALO du contre-jour (plus clair).
        # ATTENTION : un cuir NOIR passe aussi le test des trois rapports
        # égaux — il est sombre partout. On borne donc l'assombrissement :
        # une ombre portée baisse la clarté de 10 à 40 %, pas de 80 %.
        # La borne basse doit descendre assez pour couvrir l'ombre DENSE
        # juste sous la pièce : à .58 elle passait pour du sujet et
        # laissait une flaque grise sous le sac. À .38 elle est reconnue,
        # et un cuir noir reste sauf — il descend bien plus bas encore.
        # Vers le haut, aucune borne : un cuir CLAIR ET NEUTRE (la Colette
        # ivoire) se perdrait, mais elle est déjà écartée pour cette
        # raison exacte. Ce que la maison montre en clair et neutre — la
        # toile écrue de l'Olympe — est ENCLOS dans le cuir, donc sauvé
        # par le remplissage depuis les bords.
        r = a / fond
        est_toile = ((r.max(axis=2) - r.min(axis=2)) < .075) & (r.mean(axis=2) > .38)
        # le seuil se calcule, il ne se choisit pas — mais on l'établit
        # SUR CE QUI N'EST PAS DE LA TOILE, sinon elle tire tout vers le haut
        hist, _ = np.histogram(np.clip(ecart[~est_toile], 0, 255), bins=256,
                               range=(0, 256))
        hist[:8] = 0
        s = max(12, _otsu(hist))
        # DEUX SEUILS, ET C'EST LE PLUS PERMISSIF QUI DÉCOUPE. Le panneau
        # en V de la Colette ivoire a très exactement la teinte de la
        # toile : au seuil strict il fuit, et le remplissage par diffusion
        # s'engouffre par la fuite pour manger tout le panneau. Au seuil
        # permissif la silhouette se ferme, et le panneau reste enfermé
        # dedans. On découpe donc une SILHOUETTE, pas un pixel à la fois.
        return ecart, s, (ecart > s * .42) & ~est_toile

    def enfler(sujet):
        """la silhouette dilatée : le canal par lequel une cavité
        communique avec l'extérieur ne fait que quelques pixels ;
        le fermer rend la cavité inatteignable depuis le bord"""
        sil = Image.fromarray(np.where(sujet, 255, 0).astype(np.uint8), 'L')
        for _ in range(max(2, w // 190)):
            sil = sil.filter(ImageFilter.MaxFilter(3))
        return sil

    # ── PREMIER AJUSTEMENT : sur l'anneau de bordure seul.
    _, _, sujet = juger(_nappe(a))
    # ── SECOND AJUSTEMENT : sur le VRAI fond, ovale de contre-jour
    # compris. Sans lui, le halo s'écarte du modèle autant qu'un cuir,
    # forme un anneau fermé autour de la pièce, et l'on garde une
    # auréole de toile grande comme le sac (relevé sur la vue de face
    # de la Colette rouge). Le degré passe à 3 : on a maintenant des
    # points de mesure PARTOUT, plus seulement au bord, et une nappe de
    # studio a un ventre que le second degré ne décrit pas.
    dedans = np.asarray(enfler(sujet)) > 0
    ecart, s, sujet = juger(_nappe(a, ~dedans, deg=3))

    # on n'efface que ce qui COMMUNIQUE avec le bord : les creux
    # intérieurs (l'ouverture du V, sous l'anse) ne s'y rattachent pas
    mk = Image.fromarray(255 - np.asarray(enfler(sujet)), 'L')
    for xy in ((1, 1), (w - 2, 1), (1, h - 2), (w - 2, h - 2)):
        try:
            ImageDraw.floodfill(mk, xy, 128, thresh=8)
        except ValueError:
            pass
    dehors = np.asarray(mk) == 128

    al = np.clip((ecart - s * .35) * (255.0 / max(1.0, s * .55)), 0, 255)
    # on n'annule QUE ce qui est dehors : une zone d'ombre ENCLOSE dans
    # la pièce (le creux du V sur un cuir clair) doit rester — c'est ce
    # qui trouait la Colette ivoire
    al[dehors] = 0
    img = Image.fromarray(al.astype(np.uint8), 'L')
    # une fermeture morphologique scelle les micro-trous d'un cuir dont
    # la teinte frôle celle de la toile, sans manger le contour
    img = (img.filter(ImageFilter.MedianFilter(3))
              .filter(ImageFilter.MaxFilter(3))
              .filter(ImageFilter.MinFilter(3))
              .filter(ImageFilter.GaussianBlur(.6)))
    return img, Image.fromarray((~dehors).astype(np.uint8) * 255, 'L').getbbox()


def bornes(al, seuil=.015):
    """La boîte de la pièce, PAR LA MASSE et non par les extrêmes.

    La boîte rendue par le remplissage (`masque`) va d'un bord à
    l'autre : quelques pixels rescapés dans un coin suffisent. On
    mesure donc la masse d'alpha ligne par ligne et colonne par
    colonne, et l'on ne garde que ce qui pèse au moins `seuil` de la
    ligne (ou colonne) la plus chargée. Une anse fine pèse encore 20 %
    d'une ligne pleine ; une poussière, 0,2 %.
    """
    a = np.asarray(al, dtype=np.float32)
    col, lig = a.sum(axis=0), a.sum(axis=1)
    if col.max() <= 0:
        return None
    x = np.where(col > col.max() * seuil)[0]
    y = np.where(lig > lig.max() * seuil)[0]
    if not len(x) or not len(y):
        return None
    return int(x.min()), int(y.min()), int(x.max()) + 1, int(y.max()) + 1


def separer(im):
    """Renvoie (la pièce, le sol) — deux images RGBA distinctes.

    L'ombre sort à part : c'est ce qui permet ensuite de faire léviter
    la pièce, d'allonger son ombre ou de changer de fond sans retoucher
    une seule vue.

    ═══ LA PIÈCE NE SE COUPE PAS AU-DESSUS DE SA BASE ═══

    Une première version cherchait la « ligne de contact » par symétrie
    miroir, pour trancher le reflet d'un sol laqué. Mesuré sur ce
    shooting-ci, elle tombait 75 à 180 px AU-DESSUS de la base réelle :
    le bas des sacs partait avec le reflet. C'est le défaut que le
    client a vu — « les sacs sont tout simplement coupés en bas ».

    Et le reflet qu'elle traquait n'existe pas ici : la masse d'alpha
    tombe de 97 % à 1 % en une dizaine de lignes à la base (relevé sur
    les vues 1, 20 et 130). Le studio a posé la pièce sur une toile
    mate, pas sur un plateau laqué ; l'ombre portée, elle, part déjà
    avec la signature d'ombre de `masque()`.

    La base se prend donc là où la matière s'arrête, tout simplement.
    """
    al, _ = masque(im)
    bb = bornes(al)
    y = (bb[3] if bb else im.size[1]) - 1
    a = np.asarray(al).copy()

    # la pièce : tout ce qui tient dans la boîte de masse, avec un
    # fondu de trois pixels sous la base pour ne pas trancher net. Ce
    # qui est HORS de la boîte n'est pas de la pièce — un éclat de
    # toile rescapé dans un coin, une frange de halo — et cela
    # élargirait le cadrage commun de toute la séquence.
    ap = a.copy()
    f = min(3, max(0, ap.shape[0] - y))
    ap[y + f:] = 0
    if f:
        ap[y:y + f] = (ap[y:y + f] *
                       np.linspace(1, 0, f, dtype=np.float32)[:, None]).astype(np.uint8)
    if bb:
        ap[:bb[1]] = 0
        ap[:, :bb[0]] = 0
        ap[:, bb[2]:] = 0
    piece = Image.new('RGBA', im.size, (0, 0, 0, 0))
    piece.paste(im.convert('RGB'), (0, 0), Image.fromarray(ap, 'L'))

    # le sol : une ombre douce, en niveaux de gris, sous la ligne
    sol = Image.new('L', im.size, 0)
    if bb:
        cx = (bb[0] + bb[2]) / 2
        rx = (bb[2] - bb[0]) * .44
        ry = max(5, im.size[1] * .022)
        ImageDraw.Draw(sol).ellipse(
            [cx - rx, y - ry * .8, cx + rx, y + ry], fill=150)
        sol = sol.filter(ImageFilter.GaussianBlur(max(5, im.size[0] // 64)))
    return piece, sol, y


def detourer(im, ombre=True):
    """La pièce sur fond transparent, avec une ombre douce reposée."""
    al, bb = masque(im)
    out = Image.new('RGBA', im.size, (0, 0, 0, 0))
    if ombre and bb:
        # une ombre elliptique sous la pièce : elle l'ancre au sol sans
        # rapporter la tache du plateau
        w, h = im.size
        cx = (bb[0] + bb[2]) / 2
        base = bb[3]
        rx = (bb[2] - bb[0]) * .46
        ry = max(6, (bb[3] - bb[1]) * .045)
        o = Image.new('L', im.size, 0)
        ImageDraw.Draw(o).ellipse(
            [cx - rx, base - ry * 1.2, cx + rx, base + ry], fill=126)
        o = o.filter(ImageFilter.GaussianBlur(max(5, w // 70)))
        # NOIR PUR : peinte en gris, l'ombre éclaircit une salle sombre
        # au lieu de l'assombrir — on voyait une flaque claire sous la
        # pièce. Le noir, lui, marche sur tous les fonds.
        out.paste(Image.new('RGBA', im.size, (0, 0, 0, 255)), (0, 0), o)
    out.paste(im.convert('RGB'), (0, 0), al)
    return out
