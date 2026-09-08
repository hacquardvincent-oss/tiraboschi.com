# Détourage et post-production du tour de la pièce

**Date** : 2026-09-08
**Objet** : ce qu'il faut faire des 138 prises de vue avant d'écrire une ligne de plus.

---

## Pourquoi ce document existe

Le module `tiraboschi-tour-360.html` est correctement construit. Sa recette vérifie cinq tours
complets, la rotation au doigt, au clavier et au pavé tactile, et le fait que changer de peau
conserve l'angle. Le code n'est pas le problème.

**Le problème est dans les images qu'il consomme, et il est mesurable.**

### Fait 1 — les images ne sont pas détourées

Les WebP de `tools/demo/tours/` portent bien un canal alpha (`yuva420p`). Mais cet alpha **ne
découpe pas la pièce** : c'est un dégradé rectangulaire sur le pourtour du cadre. La toile
blanche du studio est toujours dans l'image.

Vérification, à refaire en une commande :

```bash
ffmpeg -f lavfi -i color=c=0x101014:s=660x440 -i tools/demo/tours/colette-rouge-00.webp \
  -filter_complex "[0][1]overlay" -frames:v 1 /tmp/preuve.png
```

On obtient un **rectangle blanc flou**, pas un sac sur fond sombre.

Trois conséquences en cascade, et elles expliquent tout le reste :

1. Les pièces voisines du carrousel s'affichent comme des cartes blanches posées sur la page.
2. La page est **obligée** de porter la couleur exacte de la toile. Le contournement est bon —
   il est même vérifié par la recette — mais c'est un contournement.
3. Donc : **aucun fond sombre, aucune ambiance colorée, aucune lévitation, aucune lumière
   derrière la pièce.** L'état interne du module porte déjà `ambiance: "#5e1a20"`, appliqué en
   lavis presque invisible — parce qu'un vrai aplat révélerait la carte blanche.

### Fait 2 — la définition plafonne le cadrage

| | |
|---|---|
| Originaux du studio | **9504 × 6336 px** |
| WebP servis | **660 × 440 px**, 1,9 Mo pour 138 vues |
| Hauteur de la pièce dans l'image | ~250 px |
| Hauteur affichée à 1440 × 900 | ~190 px, soit **13 % de l'écran** |

La pièce n'est pas petite par parti pris de composition. Elle est petite parce qu'il n'y a pas
plus de pixels. La matière existe — elle a été réduite pour tenir le poids.

### Fait 3 — le drift et l'exposition

Sur une planche contact des vues consécutives, la pièce **se déplace dans le cadre** d'une vue
à l'autre, et l'exposition varie légèrement entre les séries. Sur une rotation scrubée au
défilement, ça produit un tremblement et un scintillement.

---

## L'inventaire de la matière

`Photos et assets/Shooting 08092026/wetransfer_3d-site_2026-09-08_1917/` (branche `main`)

| Série | Vues | Remarque |
|---|---|---|
| `3D SITE/Highlights` — rouge carmin | 39 | tour complet |
| — bordeaux | 33 | tour complet |
| — ivoire / himalaya | 29 | tour complet |
| — cognac | 22 | tour complet, pas assez dense |
| — olympe camel (seau) | **15** | **tour incomplet** — à recompléter ou à écarter |
| `ZOOM MATIERE/Highlights` | 51 | détails de matière, non exploités à ce jour |

Toutes en 9504 × 6336, JPEG, ~7,6 Mo l'unité.

---

## Ce qu'on demande — spécification de sortie

### 1. Le détourage

- **Alpha réel sur la pièce**, pas un cadre. La toile est un blanc régulier : elle se clé.
- **L'ombre de contact ne fait pas partie de la pièce.** Elle sort en **fichier séparé** —
  une tache floue en niveaux de gris sur alpha — que la page compose et pilote. C'est ce qui
  permet ensuite de faire léviter la pièce, ou de la reposer, sans retoucher les images.
- Bords : pas de liseré blanc. Sur l'alligator et le galuchat, le contour est irrégulier —
  c'est là que se voit un mauvais détourage.

### 2. Le recalage

**Toutes les vues d'un même tour se recalent sur un centre optique fixe** et une échelle
constante. Critère de recette : la boîte englobante de l'alpha ne doit pas varier de plus de
**2 px** d'une vue à l'autre. Sans ça, la rotation tremble.

### 3. L'étalonnage

Une seule courbe pour tout un tour. Blanc de référence pris sur la toile avant détourage.
Écart de luminance moyen entre deux vues consécutives : **sous 1 %**.

### 4. Les définitions

| Usage | Largeur | Format |
|---|---|---|
| Pièce au centre, hero | **1600 px** | WebP q 88, alpha |
| Pièce au centre, mobile | 900 px | WebP q 86, alpha |
| Voisines du carrousel, vignettes | 500 px | WebP q 82, alpha |
| Ombre portée | 800 px | WebP alpha, niveaux de gris |

Le poids cesse d'être un argument dès lors qu'il y a **un préchargeur à pourcentage** : c'est
exactement le dispositif que Ciao Energy emploie, et c'est ce qui rend le reste possible. On
précharge le tour de la pièce affichée, et seulement les vignettes des voisines.

### 5. La densité de rotation

**36 vues par tour**, pas 15 ni 39. En dessous de 30, le pas se voit au scrub ; au-delà de 36,
on paie du poids pour rien. Les tours existants s'interpolent ou se rééchantillonnent ; le
tour du seau (15 vues) est à recompléter.

---

## La recette — ce qui doit être vrai avant de rendre la main

- [ ] Chaque vue composée sur `#101014` montre **la pièce seule**, aucun rectangle
- [ ] La boîte englobante de l'alpha varie de **moins de 2 px** sur tout un tour
- [ ] L'écart de luminance entre deux vues consécutives est **sous 1 %**
- [ ] L'ombre est un fichier séparé, et la pièce reste correcte sans elle
- [ ] 36 vues par tour, cinq tours
- [ ] Le tour hero en 1600 px pèse moins de **2,5 Mo** au total, préchargeur en place
- [ ] Aucun liseré blanc sur l'alligator ni sur le galuchat, vérifié à 400 %

---

## Ce que ça débloque, et c'est tout le sujet

Une fois la pièce détachée de sa toile :

- **le fond devient un choix** — sombre, papier, ou une ambiance qui change avec la matière ;
- **la lumière devient un choix** — un halo derrière la pièce, une ombre qu'on allonge ;
- **le cadrage devient un choix** — la pièce peut occuper 45 à 60 % de la hauteur, être
  décentrée, dépasser du cadre ;
- **la composition devient un choix** — colonne de texte à gauche, pièce à droite.

Tant que la toile est dans l'image, aucun de ces quatre choix n'existe. C'est une demi-journée
de post-production qui débloque plusieurs semaines de design.

---

## Le brief de la prochaine prise de vue

À donner au studio avant le prochain shooting. Même plateau, même journée, même coût — registre
entièrement différent.

Ce qui a été livré le 8 septembre est un **tour de catalogue** : pièce centrée, posée, lumière
douce de dessus, toile blanche, échelle constante. C'est exactement ce qu'on commande quand on
dit « un 360 pour le site », et c'est très bien fait. Ce n'est simplement pas ce qui produit
l'effet recherché.

Ce qu'il faut demander la prochaine fois :

| | |
|---|---|
| **Fond** | noir ou gris très foncé, avec une lumière de contour qui détache la silhouette. Un fond sombre se détoure aussi bien qu'un blanc, et il donne au cuir verni et à la ferrure quelque chose à refléter |
| **Cadrage** | serré. La pièce remplit 60 à 80 % de la hauteur du cadre. On peut couper l'anse |
| **Axe** | légèrement en contre-plongée, la pièce vue d'un peu en dessous — c'est ce qui lui donne de la présence |
| **Densité** | **36 positions**, pas de 10° |
| **Recalage** | plateau tournant marqué, pièce recentrée entre chaque matière, focale et distance identiques sur tout le shooting |
| **En plus** | une passe **sur fond blanc** pour le catalogue produit — c'est le livrable qu'on a déjà, il reste nécessaire |
| **Et** | garder les 51 zooms de matière : ils sont la seule chose qu'aucune image de synthèse ne sait faire, et ils ne sont pas encore employés |

**Le point à faire comprendre au studio en une phrase** : on ne photographie pas un produit
pour un catalogue, on photographie un objet pour une scène.
