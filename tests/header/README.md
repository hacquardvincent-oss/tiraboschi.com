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

## offsets.js — bandeau vide sous le header

    NODE_PATH=$(npm root -g) node offsets.js .

Vérifie un invariant simple sur 8 largeurs :
**l'espace réservé sous le header doit égaler l'espace réellement occupé.**

Le piège : `sections/tira-header.liquid` injecte du CSS critique dans le
`<body>`, donc APRÈS la feuille de style. Un `:root{--search-h:44px}` y
écrasait silencieusement le `--search-h:0` de `tiraboschi.css` sur desktop,
alors que la barre de recherche y est masquée. Résultat : 44px réservés
pour du vide, à travers lesquels le contenu défilait — entre le header et
la barre de filtres.

Règle à retenir : masquage d'un élément et hauteur qu'il réserve doivent
être déclarés au même endroit, sinon ils dérivent.

Validé contre le code d'avant correctif : 44px d'écart détectés sur les
quatre largeurs desktop.

## sticky.js — cohabitation header / barre de filtres

    NODE_PATH=$(npm root -g) node sticky.js .

Deux invariants au scroll (aller-retour) :
- le header ne se rétracte jamais sur une page qui porte une barre collée ;
- une fois accostée, la barre colle exactement au bas du header.

Sans ça, le header directionnel se rétractait et la barre de filtres venait
prendre sa place en haut de l'écran : le visiteur voyait le menu remplacé
par les filtres, deux navigations pour un même emplacement.

Contrôle aussi le rendu du CTA souligné (soulignement navigateur remplacé,
espace texte/filet, épaisseur, interlettrage).

## Ce qu'il ne couvre pas

Les pages de test sont des reconstructions du markup, pas les pages Shopify
réelles : le CSS et le JS sont ceux du thème, mais le contenu est simulé
(le CDN Shopify n'est pas joignable depuis l'environnement de build).
Un changement de markup dans `sections/tira-header.liquid` demande de mettre
les fichiers `hdr-*.html` à jour.
