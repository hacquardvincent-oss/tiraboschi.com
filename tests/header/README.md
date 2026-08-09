# Recette du header — test de contraste

Vérifie que le texte du header reste lisible sur le fond qui se trouve
réellement derrière lui, sur quatre types de page × deux points de rupture
× deux positions de scroll.

## Pourquoi

Le header est transparent au-dessus d'un hero sombre (`data-tira-dark-hero`)
et solide ailleurs. Le défaut classique : une page déclare l'attribut, mais
sa mise en page pousse le hero SOUS le header (`margin-top`). Le header se
retrouve alors en texte blanc sur le fond blanc de la page — invisible, sans
aucune erreur console. C'est arrivé sur la collection et sur les drops.

## Lancer

    cd tests/header
    NODE_PATH=$(npm root -g) node contrast.js .

Le test échoue si un contraste passe sous 4.5:1.

## grid.js — grille collection

    NODE_PATH=$(npm root -g) node grid.js .

Contrôle : débordement horizontal, distance du texte de card au bord de
l'écran, images sans `src` (icône d'image cassée), et contraste de la
mention « Prix sur demande ».

Validé contre le code d'avant correctif : il y détecte les trois défauts
(texte à 3px du bord, 1 image cassée, contraste à 1.94).

## Ce qu'il ne couvre pas

Les pages de test sont des reconstructions du markup, pas les pages Shopify
réelles : le CSS et le JS sont ceux du thème, mais le contenu est simulé
(le CDN Shopify n'est pas joignable depuis l'environnement de build).
Un changement de markup dans `sections/tira-header.liquid` demande de mettre
les fichiers `hdr-*.html` à jour.
