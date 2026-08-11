# Ajouter ou modifier une matière — mode d'emploi

## Aujourd'hui (prototypes autonomes)

**1 · La photo.** Une peau **à plat, nette partout, sans reflet dur** (votre caviar
noir est la référence idéale). La déposer dans `tools/photos/`.

**2 · La tuile.** Une ligne dans `tools/tuiles.py` (recadrage, aplanissement,
raccord seamless — rotation possible si la peau est drapée, cf. le daim) puis :
```bash
python3 tools/tuiles.py        # découpe + vérifie les raccords
python3 tools/injecter.py      # réinjecte les tuiles dans le configurateur
python3 tools/3d/assemble.py   # ré-assemble le simulateur 3D (npm i three@0.128 requis)
```

**3 · La déclarer.** Dans `tiraboschi-atelier-prototype.html`, une entrée dans
`TYPES` : `{id:'nubuck', n:'Nubuck', d:260, tx:'nubuck'}` (id = nom de la tuile,
`d` = supplément). Dans le gabarit 3D (`tools/3d/gabarit-3d.html`), une entrée
dans `MATIERES` avec son toucher : `rough` (mat 1.0 → brillant 0.3), `bump`
(force du relief), `echelle` (taille du grain sur le sac).

## Modifier ce qui est personnalisable ou non

| Quoi | Où (prototype) | Où (Plateforme — cible) |
|---|---|---|
| Ajustements offerts par un modèle (le V, le pochon…) | `MODELES[].reps` + `ajPourModele()` | `ref_modeles.ajustements` |
| Position des repères sur le packshot | `MODELES[].reps` (x,y en %) | idem, champ `reps` |
| Réserver une matière/nuance à un cercle The Society | — (prototype : tout visible) | `visibilite: "societe:2"` dans `ref_matieres` / `ref_nuances` — le serveur FILTRE, le client ne voit jamais l'interdit |
| Ferrures, doublures, bijouterie, pieds | tableaux `FERRURES` / `DOUBLURES` / `BIJOUX` / `PIEDS` | collections du Référentiel |
| Prix de base d'un modèle, suppléments | `MODELES[].base`, `TYPES[].d` | `ref_modeles.base`, `ref_matieres.supplement` |

## Demain (Plateforme intégrée)

Une matière = **un document** dans `ref_matieres`
(`plateforme/scripts/seed_referentiel.js` aujourd'hui, saisie PLM demain) :

```js
{ _id:'nubuck', nom:'Nubuck', code_erp:'CU0xx', supplement:260,
  visibilite:'public', cites:false, tuile:'shopify://files/cuir-nubuck-512.png' }
```

Le configurateur intégré lit `GET /api/referentiel` (déjà filtré par cliente) :
**ajouter une matière ne touchera plus aucun code** — un document en base, une
tuile sur le CDN. Le SKU, le devis et le stock suivent via `code_erp`.
