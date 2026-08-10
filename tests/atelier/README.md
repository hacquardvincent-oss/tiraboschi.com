# Recette — Atelier sur-mesure

```bash
NODE_PATH=/opt/node22/lib/node_modules node tests/atelier/recette.js
```

Trois fenêtres (1440, tablette, iPhone 12). Le CDN Shopify est coupé pendant
la recette : on mesure la mécanique, pas le réseau.

## Ce que chaque cas protège

| Cas | Défaut d'origine |
|---|---|
| contraste des écrans d'option | la plongée héritait de `body.clair` → **noir sur noir, 1.00:1** |
| rien de fantôme | `[hidden]` perdait contre `display:flex` : filtres et flèches restaient visibles sur un écran d'option |
| nom / description séparés | les deux `<span>` étaient inline et se collaient |
| fond plongée × 55 cuirs | un cuir très clair rendait la légende blanche illisible |
| la carte suit le pointeur | `rendreC()` faisait `innerHTML=''` : les transitions ne partaient jamais, le cover flow se téléportait |
| le glissé des briques | l'écran 1 était un défilé figé ; il se feuillette désormais à la main |
| le fil d'étapes | on circule librement 1 ↔ 2 ↔ 3 sans perdre l'état |
| la nuance survit au changement de matière | changer d'onglet matière ré-habille les cartes sans réinitialiser la position |
| transitions coupées pendant le glissé | sans ça la carte traîne derrière le doigt |
| cartes persistantes | 7 nœuds jetables → 55 nœuds réutilisés |
| matière = PNG + hard-light | `feTurbulence` ne produisait pas du cuir mais du bruit |
| la teinte se pose sur la photo | choisir un cuir n'avait **aucune** conséquence visible |
| mélanges `color` / `overlay` | ces deux opérateurs conservent le blanc pur : le fond studio reste blanc, seule la pièce prend le cuir |
| repères atteignables | le repère « pieds » (92 %) passait sous le ruban |
| rien sous la ligne de flottaison | contrainte posée par le client |

Le ruban défile horizontalement **par construction** : seul un débord vertical,
ou latéral hors d'un conteneur défilable, est compté comme un défaut.

## Textures

Les six tuiles 512 px (`tools/cuirs/*.png`) sont découpées dans les
PHOTOGRAPHIES du client (`tools/photos/`) par `tools/tuiles.py` : recadrage
de la zone nette (rotation si la peau est drapée), niveaux de gris,
aplanissement de l'éclairage, égalisation locale des reflets, raccord par
demi-tour fondu — pour l'alligator, bords posés dans les sillons entre rangs.
La nuance vient du navigateur (`background-blend-mode:hard-light`), c'est
ainsi qu'une photo noire donne les 52 couleurs. Le contrôle de raccord admet
un raccord au niveau des sillons naturels de la peau (97e centile des sauts
de lignes × 1.1).

```bash
python3 tools/tuiles.py                                    # redécoupe + vérifie
python3 tools/injecter.py                                  # réinjecte dans le prototype
```

## Architecture du parcours

Briques (silhouettes glissables) → fiche d'atelier (liste numérotée, style
haute horlogerie) → plongée matière (7 matières × 52 nuances, cover flow) →
certificat. Le fil d'étapes du HUD circule librement ; l'état est conservé.
Une sélection de cuir = `matière:nuance` (ex. `caviar:marine`).
