# Photoréalisme 3D — pipeline et état des lieux

## Ce qui est ici

`rafael_cycles.py` — modèle de la Rafaël + rendu **Cycles** (path tracing,
le moteur de Blender). Preuve de faisabilité produite dans cette session :

```bash
pip install bpy                       # Blender en module Python
python3 tools/3d-cycles/rafael_cycles.py caviar    sortie.png 160 1440
python3 tools/3d-cycles/rafael_cycles.py alligator sortie.png 160 1440
```

Environ 30 s par image en 1440 px / 160 échantillons sur ce serveur (CPU seul).

## Pourquoi le temps réel du navigateur ne suffisait pas

| | WebGL temps réel (`tiraboschi-3d-prototype.html`) | Cycles (path tracing) |
|---|---|---|
| Lumière | approximée, pas de rebond | trajets réels, rebonds, occlusion |
| Métal | reflet plat sans monde à refléter → **or terne** | réflexions vraies → **or qui brille** |
| Arêtes | facettes visibles → aspect « carré » | bevel + subdivision → arêtes de cuir |
| Cuir | normal map seule | relief + vernis + micro-variation de brillance |
| Profondeur | aucune | bokeh, ombres douces, contact |

Le photoréalisme est un problème de **rendu** avant d'être un problème de modèle.

## Les trois voies vers la production

**A · Rendu pré-calculé (recommandé pour lancer).** Un modèle sculpté par un
artiste 3D d'après les pièces réelles, puis on rend hors-ligne toutes les
combinaisons × 24–36 angles. Le site sert des images : qualité maximale,
zéro contrainte pour le visiteur, coût de calcul payé une fois.
*Limite* : combinatoire — se réserve aux registres visibles (matière × nuance
× ferrures), pas aux 52 nuances × 6 matières × tout (≈ des dizaines de
milliers d'images). Stratégie : rendre les matières et un sous-ensemble de
nuances, et **recolorer** les autres par nuance (le pipeline de teinte
`color`/`overlay` déjà validé sur les packshots du configurateur).

**B · Temps réel de qualité (glTF + PBR + HDRI).** Un modèle propre exporté en
glTF, chargé dans le navigateur avec une carte d'environnement studio (HDRI)
qui donne au métal quelque chose à refléter. On garde la rotation libre et le
changement instantané de matière. Qualité : très supérieure à l'actuel, en
dessous de A. C'est la voie d'un configurateur pleinement interactif.

**C · Shoot photo réel + 360°.** 24–36 clichés sur plateau tournant par
combinaison-clé. Le plus luxueux, le plus lourd à produire, et impossible à
étendre aux combinaisons sur-mesure.

**Recommandation : A pour les pièces iconiques, B pour le sur-mesure**, avec la
même interface — l'utilisateur ne voit pas la différence de technologie.

## Ce qu'il manque pour atteindre le niveau des photos client

1. **Les cotes réelles** (H × L × P, diamètre de l'anneau, largeur de la
   bandoulière, hauteur du rabat) — aujourd'hui les proportions sont
   estimées d'après les photos.
2. **Un modèle sculpté** : le galbe du cuir rempli, les coutures, le
   surpiquage, la tranche peinte, l'épaisseur variable du rabat. Un artiste 3D
   fait ça en quelques jours à partir des pièces et des cotes.
3. **Une HDRI studio** (carte d'environnement) reproduisant le plateau de la
   maison — c'est elle qui donne au laiton ses reflets caractéristiques.
4. **Les pièces de quincaillerie** modélisées d'après les vraies (l'anneau en D
   a un méplat et une gorge que je ne peux pas deviner des photos).

---

## Voie A en production : les rendus de l'Atelier

`atelier_renders.py` produit les images utilisées par
`tiraboschi-atelier-prototype.html` :

```bash
for m in graine caviar lisse daim galuchat alligator masque; do
  python3 tools/3d-cycles/atelier_renders.py $m tools/rendus/rafael-$m.png 140 900
done
python3 tools/3d-cycles/vitrine.py caviar tools/rendus/rafael-vitrine.png 160 900
# puis compresser en WebP (760 px, q 86–88) et réinjecter en base64
```

**Le principe qui rend la combinatoire tenable** : chaque matière est rendue
une seule fois, en **base neutre** (albédo 0,42) sur **fond transparent**, plus
**une passe de masque** où seul le cuir reste opaque (l'or et le passepoil sont
en *holdout*). Le navigateur applique alors la nuance en
`mix-blend-mode: multiply` **à travers ce masque** :

- 6 matières + 1 masque + 1 vitrine = **8 images (592 Ko)** ;
- elles couvrent **6 × 52 = 312 combinaisons** ;
- l'or reste or, le passepoil reste framboise, le grain vient du rendu ;
- une nuance sombre donne un noir dense (le multiply assombrit vraiment).

Repères de la fiche placés d'après des mesures **sur l'image** : corps
44–89 % de la hauteur, anneau d'or à 50,7 / 74 % (localisé par ses pixels
dorés), bandoulière 6–44 %. Le cadre `.atl__ph.rendu` se cale sur l'image, donc
les pourcentages tombent au pixel près quelle que soit la fenêtre.
