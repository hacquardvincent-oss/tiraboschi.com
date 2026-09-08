# Prompt de reprise — le module de rotation, session neuve

> À copier intégralement dans une **session neuve**. Rédigé le 2026-09-08.
> Pourquoi une session neuve : celle qui a construit le module est à 759 000 jetons sur
> 1 000 000, ouverte depuis le 26 mai, et elle reconstruit le même composant. Elle porte tout
> l'historique des approches abandonnées — le modèle Blender, le prototype WebGL, le pipeline
> de teinte — et ça pèse sur ce qu'elle propose. Le travail, lui, est poussé et se reprend.

---

## CE QUI EXISTE — ne le reconstruis pas

Lis avant de proposer quoi que ce soit. Tout est sur la branche `shopify-deploy`.

| | |
|---|---|
| `tiraboschi-tour-360.html` | le module de rotation photographique, **fonctionnel** |
| `tests/tour/recette.js` | sa recette : cinq tours, rotation au doigt / souris / clavier, changement de peau à angle constant, aucun prix |
| `tools/demo/tours/` | 138 vues en WebP 660 × 440 + 13 zooms |
| `tools/rot360/README.md` | la demi-rotation par symétrie, sur les rendus de synthèse |
| `tools/3d-cycles/README.md` | l'analyse du photoréalisme, les trois voies, et **les quatre choses qui manquaient** |
| `tools/detourage/README.md` | **le document à exécuter en premier** — spécification de post-production |

**Le code est bon. Ne recommence pas le module.** Ce qui suit ne porte que sur ce qu'il affiche
et sur la manière dont il le compose.

---

## LES TROIS CAUSES MESURÉES DE L'ÉCART

Ce ne sont pas des impressions, elles se vérifient en une commande chacune.

**1. Les images ne sont pas détourées.** L'alpha des WebP est un dégradé rectangulaire sur le
pourtour, pas un découpage de la pièce. La toile blanche du studio est toujours dedans. D'où
les cartes blanches des voisines dans le carrousel, et d'où l'obligation pour la page de porter
la couleur de la toile.

**2. La définition plafonne le cadrage.** 660 × 440, la pièce y fait ~250 px, soit ~190 px
affichés à 1440 × 900 — **13 % de la hauteur de l'écran**. Les originaux font 9504 × 6336.

**3. Ciao Energy n'est pas une séquence photo.** C'est une scène 3D éclairée : c'est pour ça
que l'environnement change entièrement de couleur selon le parfum, que la lumière court sur le
métal, et que la caméra vole. On ne reproduit pas ça avec des packshots cuits sur blanc, quel
que soit le code.

---

## CE QUE FAIT CIAO ENERGY — trié

Référence : `Photos et assets/Ciao Energy - L'energy drink parfaite.mp4` sur la branche `main`
(50 s, 1280 × 720). Huit mécanismes relevés image par image.

### Transposables — à reprendre

| Mécanisme | Ce que ça vaut ici |
|---|---|
| **Préchargeur à pourcentage sur fond neutre** — rien n'apparaît avant d'être prêt | C'est ce qui autorise des images lourdes. Sans lui, on rogne la définition et tout s'effondre |
| **Objet grand, cadré serré, parfois coupé par le cadre** — 40 à 60 % de la hauteur | Le plus gros gain, et il ne coûte rien une fois les images détourées |
| **Défilement qui scrube la rotation, rail de progression visible** | Déjà fait dans le module |
| **Composition asymétrique** : colonne de texte étroite à gauche, objet à droite | À faire — tout est centré aujourd'hui |
| **Contraste typographique extrême** : nom très grand, corps de texte minuscule | À faire — le titre est à ~42 px pour un écran de 900 |
| **Chrome quasi nul** : la marque, deux liens, un rail de repères | Déjà proche |

### Costumes — à ne pas reprendre

| Mécanisme | Pourquoi non |
|---|---|
| **Le registre néon, sombre, cinétique, agressif** | Ciao est une boisson énergisante pour un public jeune. Tiraboschi est une maison de maroquinerie de 1904 à prix premium. Transposer le registre serait un déguisement, et ça se verrait |
| **L'environnement qui change de couleur par produit** | Techniquement bloqué tant que les images ne sont pas détourées — et, une fois débloqué, à employer avec retenue : une ambiance par matière, pas un néon par parfum |
| **La typographie condensée grasse en capitales** | Le serif actuel est juste pour la maison. Ce qui manque, c'est l'échelle, pas la police |

**Ce qu'on admire chez eux, ce n'est pas leur registre — c'est leur valeur de production et
leur chorégraphie de défilement. Les deux se séparent, et c'est la séparation qui est utile.**

---

## L'ORDRE DE TRAVAIL

**1. La post-production, avant tout le reste.** Exécute `tools/detourage/README.md` : détourage
réel depuis les originaux 9504 px, ombre en fichier séparé, recalage à 2 px près, étalonnage à
1 %, 36 vues par tour, sorties en 1600 / 900 / 500 px. Tant que ce n'est pas fait, tout travail
de composition est du replâtrage.

**2. Le préchargeur.** À pourcentage, sur la couleur de fond retenue. Il précharge le tour de
la pièce affichée et seulement les vignettes des voisines.

**3. La composition.** La pièce à 45–60 % de la hauteur. Casser la symétrie. Un seul point
focal. Et retirer la note « Démonstration — 138 prises de vue… » restée en haut à gauche de la
composition : c'est un artefact de travail dans un livrable.

**4. L'ambiance.** Une par matière, dérivée du cuir, en dégradé lumineux — pas un aplat pastel.
Sombre aux bords, claire derrière la pièce, comme une lumière de studio. C'est le moment où le
site peut enfin être autre chose que blanc, **si** c'est le parti pris retenu — le blanc
assumé est aussi défendable pour une maison de cuir, et il n'est pas ce que fait Ciao.

**5. Les 51 zooms de matière**, aujourd'hui inemployés. C'est la seule chose qu'aucune image de
synthèse ne sait faire : le grain réel de l'alligator, du galuchat, du daim. À intégrer au
parcours.

**6. Le code en dernier.** Il est déjà largement écrit et il est correct.

---

## AVANT DE MONTRER — les preuves

Un ✓ que tu te décernes ne vaut rien. Pour chaque état montré :

- [ ] **Capture 1440 × 900 et capture 390 × 844**, réellement rendues dans un navigateur
- [ ] **Une vue composée sur `#101014`** prouvant que le détourage est réel
- [ ] **La hauteur de la pièce en pourcentage de l'écran**, chiffrée
- [ ] **Le poids préchargé** et le temps jusqu'au premier affichage
- [ ] **Deux captures à 0 ms et 800 ms** — si elles sont identiques, il n'y a pas d'entrée en
      matière
- [ ] **La réponse écrite** à : *cet écran pourrait-il servir à une autre maison de
      maroquinerie en ne changeant que le logo ?*
- [ ] La recette `tests/tour/recette.js` au vert, et ce qu'elle ne couvre pas, dit

« Non mesuré » est une réponse admise. « Conforme » sans preuve ne l'est pas.

---

## CE QUI TE MANQUE — demande-le, ne le suppose pas

Le README `tools/3d-cycles/` avait déjà posé quatre questions restées sans réponse. Elles
valent toujours si la voie du rendu revient un jour sur la table :

1. Les **cotes réelles** des pièces (H × L × P, diamètre de l'anneau, largeur de bandoulière) —
   aujourd'hui les proportions du modèle de synthèse sont estimées d'après des photos ;
2. Un **modèle sculpté** par un artiste 3D ;
3. Une **HDRI du plateau de la maison** ;
4. La **quincaillerie** relevée sur les vraies pièces.

Et deux points nouveaux, qui bloquent aujourd'hui :

5. **Le tour du seau Olympe n'a que 15 vues** — incomplet. Recompléter ou l'écarter de la démo.
6. **La branche de travail `shopify-deploy-local` n'existe pas sur le dépôt distant.** Le nom
   dit « local » et il l'est. Pousse sur une branche qui existe, ou crée-la.

---

## FRONTIÈRES — ne pas trancher seul

Le parti pris de fond (sombre / papier / blanc assumé) · le budget d'une nouvelle prise de vue ·
tout élément qui engage l'identité de la maison · et le choix entre « rotation photographiée »
et « temps réel 3D », qui est une décision de production, pas de code.
