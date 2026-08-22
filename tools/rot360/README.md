# La rotation 360° de la pièce

## Le principe qui rend l'opération abordable

La Rafaël est **symétrique gauche/droite** et le studio est monté symétrique
(deux boîtes à lumière égales à ±48°, un dôme, un contre centré). On ne rend
donc que la **demi-rotation 0° → 180°**, et le navigateur obtient 195° → 345°
en reflétant horizontalement (`transform: scaleX(-1)`).

**13 rendus couvrent 24 positions.** Sur six matières, cela fait 78 rendus au
lieu de 144.

| | |
|---|---|
| Positions sur 360° | 24 (pas de 15°) |
| Rendus par matière | 13 (0° → 180°) |
| Résolution de la série | 460 px |
| Position 0 | rendue à part en 900 px, **même studio, même cadrage** |
| Masque | une passe par position, à 240 px (il ne sert qu'à découper) |

## Pourquoi une position 0 en haute définition

Au repos, la pièce doit être nette : c'est l'image que l'on regarde longtemps.
En rotation, le mouvement masque la douceur des 460 px. La position 0 est donc
rendue à 900 px — mais avec **exactement** le même studio et le même cadrage
que la série, sinon la pièce sauterait à la première position.

## Régénérer

```bash
S=chemin/du/scratchpad
for m in caviar graine lisse daim galuchat alligator masque; do
  python3 $S/rot360.py $m $S/rot360   24 56  460   # la série
done
for m in caviar graine lisse daim galuchat alligator masque; do
  python3 $S/rot360.py $m $S/rot360hd 1  140 900   # la position 0
done
python3 tools/rot360/compresser.py $S/rot360 $S/rot360hd
python3 tools/demo/assembler.py
```

## Ce que fait le navigateur

- `positionner(a)` traduit une position en `{ i: rendu, m: miroir ? }` ;
- la **nuance** se multiplie à travers le masque de la position courante —
  l'or et le passepoil gardent leur couleur à tous les angles ;
- les **repères** ne valent que de face : ils s'effacent dès que la pièce
  tourne, et reviennent au retour (touche `Home` ou `Échap`) ;
- le glissé a un **élan** qui s'éteint, et les flèches du clavier avancent
  d'une position.
