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


def _nappe(a):
    """la toile de studio, ajustée en surface quadratique sur le bord"""
    h, w, _ = a.shape
    ys, xs = np.mgrid[0:h, 0:w]
    x = (xs / w - .5).astype(np.float32)
    y = (ys / h - .5).astype(np.float32)
    base = np.stack([np.ones_like(x), x, y, x * x, x * y, y * y], axis=-1)
    # l'anneau de bordure : 7 % de chaque côté, là où il n'y a jamais
    # la pièce (le cadrage commun la garde au centre)
    mx, my = max(2, int(w * .07)), max(2, int(h * .07))
    ring = np.zeros((h, w), bool)
    ring[:my], ring[-my:], ring[:, :mx], ring[:, -mx:] = True, True, True, True
    A = base[ring].reshape(-1, 6)
    out = np.empty_like(a)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A, a[..., c][ring].ravel(), rcond=None)
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
    # LA TOILE SE MODÉLISE, elle ne se relève pas sur les marges. Le
    # studio éclaire un halo derrière la pièce : pris depuis le bord, le
    # fond paraît sombre, et le halo passe alors pour du sujet — c'est
    # ce qui mangeait la Colette ivoire. On ajuste donc une surface
    # quadratique sur l'anneau de bordure : une nappe de studio est
    # lisse, un polynôme du second degré la décrit très bien.
    fond = _nappe(a)
    fond = np.maximum(fond, 1.0)
    # L'ÉCART SE MESURE EN TEINTE AUTANT QU'EN CLARTÉ. Une distance
    # RGB brute ne voit pas la Colette ivoire : elle est aussi CLAIRE
    # que la toile. Elle en est pourtant nettement plus CHAUDE — la
    # toile tire sur le mauve, le cuir sur le crème. On sépare donc les
    # deux axes chromatiques et on leur donne plus de poids.
    def opp(x):
        return (x.mean(axis=2),
                x[..., 0] - x[..., 1],
                (x[..., 0] + x[..., 1]) * .5 - x[..., 2])
    la, ra, ya = opp(a)
    lf, rf, yf = opp(fond)
    ecart = (np.abs(la - lf) * 1.6
             + np.abs(ra - rf) * 3.4
             + np.abs(ya - yf) * 3.4)

    # la signature d'une ombre : même teinte, moins de clarté
    r = a / fond
    etalement = r.max(axis=2) - r.min(axis=2)
    moyenne = r.mean(axis=2)
    # ATTENTION : un cuir NOIR passe aussi le test des trois rapports
    # égaux — il est sombre partout. On borne donc l'assombrissement :
    # une ombre portée baisse la clarté de 10 à 40 %, pas de 80 %.
    # La borne basse doit descendre assez pour couvrir l'ombre DENSE
    # juste sous la pièce : à .58 elle passait pour du sujet et laissait
    # une flaque grise sous le sac. À .38 elle est reconnue, et un cuir
    # noir reste sauf — il descend bien plus bas encore.
    est_ombre = (etalement < .075) & (moyenne < .995) & (moyenne > .38)

    # le seuil se calcule, il ne se choisit pas — mais on l'établit
    # SUR CE QUI N'EST PAS UNE OMBRE, sinon elle tire tout vers le haut
    util = ecart[~est_ombre]
    hist, _ = np.histogram(np.clip(util, 0, 255), bins=256, range=(0, 256))
    hist[:8] = 0
    s = max(12, _otsu(hist))

    # DEUX SEUILS, ET C'EST LE PLUS PERMISSIF QUI DÉCOUPE. Le panneau
    # en V de la Colette ivoire a très exactement la teinte de la toile :
    # au seuil strict il fuit, et le remplissage par diffusion s'engouffre
    # par la fuite pour manger tout le panneau. Au seuil permissif la
    # silhouette se ferme, et le panneau reste enfermé dedans.
    # On découpe donc une SILHOUETTE, pas un pixel à la fois.
    sujet = (ecart > s * .42) & ~est_ombre

    # on n'efface que ce qui COMMUNIQUE avec le bord : les creux
    # intérieurs (l'ouverture du V, sous l'anse) ne s'y rattachent pas
    # on DILATE la silhouette avant de diffuser : le panneau en V
    # communique avec l'extérieur par un canal de quelques pixels (là où
    # il rejoint l'ouverture du sac). Fermer ce canal, puis éroder
    # d'autant, rend le panneau inatteignable depuis le bord.
    D = max(2, w // 190)
    sil = Image.fromarray(np.where(sujet, 255, 0).astype(np.uint8), 'L')
    for _ in range(D):
        sil = sil.filter(ImageFilter.MaxFilter(3))
    mk = Image.fromarray(255 - np.asarray(sil), 'L')
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
