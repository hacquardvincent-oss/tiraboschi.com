# CAHIER DES CHARGES COMPLET — TIRABOSCHI Paris
## Site e-commerce Shopify — Version définitive
### Mai 2025 — Document de référence unique

# PARTIE 1 — STRATÉGIE & POSITIONNEMENT
## 1.1 La marque
TIRABOSCHI Paris est une maison de maroquinerie de luxe fondée en 1904. Chaque pièce est fabriquée à la main par un seul artisan, de A à Z, dans les ateliers parisiens. Les cuirs proviennent exclusivement de tanneries françaises.

Territoire de marque :

Luxe artisanal authentique (pas du luxe de masse)
Héritage + modernité
Transparence sur la fabrication (anti-greenwashing)
Pièces rares, production limitée

Signature visuelle : la forme en V — présente dans le design de chaque sac, dans le logo, dans le picto panier.

Tagline : "Made in France, Only. · Since 1904"
## 1.2 Références UX/UI
Référence
Ce qu'on prend
Miu Miu (miumiu.com)
Structure globale, scroll stack, animations, header, pages collection, marquee
Tag Heuer (tagheuer.com)
Profondeur contenu fiche produit, storytelling artisanal, tableau spécifications, sections dédiées au craft
Jacquemus
Cards produit minimalistes, espacement, photo éditorialee
The Row
Sobriété typographique, pages éditoriales
## 1.3 Cible
Femmes 28–55 ans, CSP++
Sensibles à l'artisanat, à la provenance, à l'authenticité
Acheteuses de luxe raisonnées (qualité > logo)
Trafic majoritairement mobile (à prioriser)
Instagram : @boschi_paris

# PARTIE 2 — CHARTE GRAPHIQUE
## 2.1 Couleurs
Rôle
Valeur
Usage
Noir principal
#0a0a0a
Textes, boutons, fond dark
Blanc
#ffffff
Fond principal
Gris clair
#f7f5f2
Fond sections alternées
Bordures
#e8e8e8
Séparateurs, traits
Transparent
rgba(0,0,0,0)
Header sur hero
Overlay sombre
rgba(0,0,0,0.35)
Sur images/vidéos
## 2.2 Typographie
Police unique : Playfair Display Regular 400

Pas de Bold, pas d'autres polices
Italic autorisé pour les citations uniquement

Élément
Taille desktop
Taille mobile
Notes
H1 hero
88–100px
48–64px
Letter-spacing -0.01em
H1 page
56px
36px

H2
48px
32px

H3
32px
24px

Body
14px
14px
Line-height 1.6
Caption
11–12px
11px
Uppercase, ls 0.12em
Boutons
11px
11px
Uppercase, ls 0.1em
Prix
13–14px
13px

## 2.3 Éléments visuels
Border-radius : 0px partout — formes carrées uniquement
Bordures : 1px solid, jamais plus
Icônes : stroke thin, 22px, jamais filled
Boutons : texte souligné uppercase — PAS de boîte rectangulaire (style Miu Miu)
Espacement : généreux, aéré, pas de densité

# PARTIE 3 — HEADER
## 3.1 Mobile (priorité absolue)
[ Logo TIRABOSCHI · Since 1904 ]  ···  [ 🛍 ] [ 👤 ] [ ☰ ]

───────────────────────────────────────────────────────────

[ Rechercher...                                          🔍 ]

Élément
Spec
Logo
Gauche, ~140px largeur, lien homepage
Panier
SVG custom forme V TIRABOSCHI (snippets/icon-bag-tiraboschi.liquid)
Compte
Picto personne standard thin
Burger
Tout à droite, ouvre le drawer
Search
Sous le header, non-sticky, transparent, trait bas uniquement, loupe à droite
Hauteur
~56px
Sticky
Directional — réapparaît au scroll up
Transparent
Logo blanc + icônes blanches sur homepage, collections, pages éditoriales
Transition
Fondu 300ms vers opaque blanc au scroll
## 3.2 Desktop
[ Logo ]   Collections · La Maison · L'Atelier    [ 🔍 ] [ 👤 ] [ 🛍 ]

Menu navigation centré ou gauche selon Horizon
Mega menu "Collections" avec visuels produits
Icônes droite : search modal, compte, panier
## 3.3 Drawer menu (mobile)
Ouverture depuis la droite
Fond blanc, overlay noir 50%
Logo en haut
Navigation accordéon :
Collections → sous-menus
La Maison → sous-menus
L'Atelier
Fermeture : croix + tap overlay
## 3.4 Pages avec header transparent
Homepage ✓
Pages collection (si image hero) ✓
Pages éditoriales ✓
Articles blog ✓
Fiche produit ✗ (header opaque)
Panier ✗ (header opaque)

# PARTIE 4 — HOMEPAGE
## 4.1 Principe — Scroll Stack Miu Miu
C'est l'élément signature le plus important du site.

Chaque section est en position: sticky; top: 0 avec des z-index croissants. Au scroll, la section suivante monte par-dessus la précédente qui reste visible derrière, créant un effet de superposition progressive comme des diapositives qui s'empilent.

Sur mobile : scroll-snap-type: y mandatory — le scroll s'accroche à chaque section plein écran.
## 4.2 Sections (dans l'ordre)
### Section 1 — Hero Vidéo FW25 (100vh)
Vidéo desktop : VIDEO HOMEPAGE.mp4 (16:9, autoplay loop muted)
Vidéo mobile : version 9:16 (TEST 9-16...mp4)
Overlay : gradient noir 0% → 20% en bas
Contenu bas gauche : "FW25" H1 blanc + CTA "DÉCOUVRIR LA COLLECTION"
CTA : texte souligné uppercase (pas de bouton)
### Section 2 — Marquee texte défilant
"Made in France, Only. · Since 1904 · Maroquinerie de Luxe · Paris ·"
Défilement continu gauche→droite, 35s loop
Fond blanc, 1px border top/bottom
48px hauteur, 11px uppercase, letter-spacing 0.14em
Pause au survol desktop
Sort du scroll stack (position relative, pas sticky)
### Section 3 — Vidéo Victoire (66vh)
Vidéo : VIDEO SAC DUO COLETTE VICTOIRE.mp4
Contenu haut droite : "Victoire" H2 blanc + CTA "DÉCOUVRIR"
Curseur custom "VOIR" au survol desktop
### Section 4 — Image éditoriale "Héritage" (75vh)
Image : 28092025-DSCF1828.jpg
Overlay gradient bas→haut
Contenu bas gauche :
Kicker "SINCE 1904" — 12px uppercase
H2 "Une maison née d'un héritage"
Corps "Chaque pièce TIRABOSCHI est façonnée à la main par un seul artisan, du premier coup de tranchet au point final."
CTA "NOTRE HISTOIRE" → /pages/histoire
Ken Burns : zoom 1.0→1.04 sur 20s
### Section 5 — Vidéo Colette (66vh)
Vidéo : TEST 16 9_4.mp4
"Colette" H2 centré blanc + CTA "DÉCOUVRIR"
### Section 6 — Grille Produits FW25
Sort du scroll stack (position relative)
Fond blanc
Titre "La Collection FW25" + "Voir tout"
Grille 3 colonnes desktop, carousel mobile (75% cqw)
6 produits max
Cards avec scroll reveal stagger 80ms
Hover : zoom 1.04 + lift -6px
### Section 7 — Image Savoir-Faire (50vh)
Image : BOSCHI0919.jpg
Overlay gradient bas→haut
Kicker "SAVOIR-FAIRE" + H3 + CTA "DÉCOUVRIR LE SAVOIR-FAIRE"
Ken Burns activé
## 4.3 Animations homepage
Animation
Spec
Scroll stack
position:sticky, z-index croissants, micro scale 0.97 + opacity 0.88 à la sortie
Marquee
CSS animation 35s linear infinite, pause au survol
Ken Burns
scale 1.0→1.04, 20s, ease-in-out, alternate, infinite
Scroll reveals
translateY(24px)→0 + opacity, 0.9s, cubic-bezier(0.16,1,0.3,1)
Stagger produits
80ms entre chaque card
Curseur custom
Cercle 52px blanc "VOIR", trailing inertia lerp 0.12
Scroll snap mobile
y mandatory sur les sections héro
Lazy video
IntersectionObserver threshold 0.2, placeholder = 1ère frame

# PARTIE 5 — PAGES COLLECTION — Style Miu Miu
## 5.1 Structure
1. [HERO PLEIN ÉCRAN 100vh] — header transparent

2. [FILTRES STICKY]

3. [INTRO TEXTE éditorial]

4. [GRILLE PRODUITS 4 cols]

5. [BREAK ÉDITORIAL après 6 produits]

6. [SUITE GRILLE]
## 5.2 Hero collection
Hauteur : 100vh (plein écran — pas 50%, c'est le choix Miu Miu)
Image ou vidéo de la collection, object-fit: cover
Overlay : linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)
Nom collection — H1 blanc, bas gauche (pas centré)
Sous-titre discret : "X pièces · FW25"
Header transparent par-dessus
"Faites défiler" avec flèche ↓ en bas centré
## 5.3 Filtres
Sticky sous le hero (top: var(--header-height))
Background blanc, border-bottom: 1px solid #e8e8e8
Options : Matière · Couleur · Prix · Trier par
Mobile : bouton "FILTRER" → bottom sheet (drawer depuis le bas)
Compteur "6 pièces" à droite
Reset filtres visible
## 5.4 Grille produits
4 colonnes desktop (pas 3 — c'est le choix Miu Miu)
3 colonnes tablet
2 colonnes mobile
Gap : 2–4px (style Miu Miu — pas de gutter large)
Pas de fond de card — image seule + texte sous
## 5.5 Cards produit
Ratio portrait 3:4 strict
Au survol desktop :
Crossfade vers 2ème image (400ms)
Bouton "AJOUTER AU PANIER" en bas (si variante unique)
"CHOISIR" si variantes → quick add modal
❤️ wishlist coin supérieur droit (au survol)
Badge "Sur Mesure" ou "Exotique" si tag (12px uppercase, coin supérieur gauche)
Nom : 13px Playfair Regular
Prix : 13px
## 5.6 Break éditorial (après 6 produits)
Image plein largeur avec citation ou stat artisanale
Exemple : BOSCHI0919.jpg + "Chaque pièce prend entre 4 et 10 heures de travail artisanal"
Lien → /pages/savoir-faire
## 5.7 Collections et leurs héros
Collection
Handle
Hero
FW25
fw25
Vidéo homepage
Sacs
sacs
28092025-DSCF1828.jpg
Petite Maroquinerie
petite-maroquinerie
Photo produit
Iconiques
iconiques
Photo éditoriale
Sur Mesure & Exotiques
sur-mesure-exotiques
BOSCHI0154.jpg

# PARTIE 6 — FICHE PRODUIT — Mix Miu Miu + Tag Heuer
## 6.1 Philosophie
Miu Miu apporte : fluidité, sections immersives, minimalisme typographique, scroll storytelling Tag Heuer apporte : profondeur du contenu, spécifications détaillées, close-ups matière, sections craft, storytelling fabrication
## 6.2 Structure complète
═══════════════════════════════════════════

PARTIE 1 — ACHAT (above the fold)

═══════════════════════════════════════════

Desktop 2 colonnes :

┌─────────────────────┬────────────────────┐

│ GALERIE (sticky)    │ INFOS PRODUIT      │

│ - Strip thumbnails  │ - Breadcrumb       │

│ - Image principale  │ - H1 Nom           │

│ - Thumbnail vidéo   │ - Prix EUR         │

│ - Zoom loupe survol │ - SKU discret      │

│                     │ - Sélecteur matière│

│                     │ - Sélecteur couleur│

│                     │ - Sélecteur option │

│                     │ - Dimensions       │

│                     │ - Bouton ATC       │

│                     │ - Wishlist ❤️      │

│                     │ - Livraison        │

└─────────────────────┴────────────────────┘

Mobile : galerie carousel → infos → sticky ATC

═══════════════════════════════════════════

PARTIE 2 — STORYTELLING (scroll reveals)

═══════════════════════════════════════════

Section 1 : Le Savoir-Faire

Section 2 : La Matière

Section 3 : Dimensions & Détails

Section 4 : L'Atelier

Section 5 : Entretien du cuir

Section 6 : Sur Mesure (si tag)

Section 7 : Vous aimerez aussi
## 6.3 Galerie images
Desktop :

Strip thumbnails verticaux 60×80px à gauche
Image principale ratio 3:4, sticky au scroll
Icône ▶ sur thumbnail vidéo → lecture inline
Zoom loupe au survol (zone 3x, coin bas-droit)
Clic → lightbox plein écran navigation gauche/droite

Mobile :

Carousel full-width, swipe natif
Pinch-to-zoom
Dots navigation + compteur "3/7" coin supérieur droit
## 6.4 Informations achat
Breadcrumb : "Collections › Sacs › Victoire" — 12px, opacity 40%
Nom : H1 Playfair 32px desktop / 24px mobile
SKU : 11px uppercase, opacity 40%
Prix : "3 700,00 EUR" — 18px

Sélecteur Matière :

Boutons texte uppercase (Cuir Veau · Taurillon · Exotique)
Sélection : underline 2px
Au clic : change l'image principale immédiatement

Sélecteur Couleur :

Chips rondes 24px avec vraie couleur cuir
Survol → tooltip nom de couleur
Stock = 1 → chip avec croix + "Dernière pièce"
Rupture → chip grisée + "Sur commande — 4 semaines"
Au clic : change l'image principale

Sélecteur Option :

Avec/sans pochon, longueur anse, etc.
Boutons texte

Dimensions rapides :

3 valeurs inline : H × L × P (en cm)
Icônes discrètes

Bouton ATC :

Pleine largeur, fond noir, texte blanc uppercase
52px hauteur
Scale 0.98 au clic
Message de confirmation discret

Sticky ATC mobile :

position: fixed; bottom: 0
Fond blanc, border-top: 1px solid #e8e8e8
Prix à gauche + bouton à droite
Visible en permanence sur mobile

Mini header produit desktop :

Apparaît après 300px de scroll
Sticky haut de page
Nom produit + prix + bouton ATC compact

Wishlist ❤️ :

Texte "Ajouter à mes favoris" sous le bouton ATC

Livraison & Retours :

"Livraison offerte en France · 3–5 jours ouvrés"
"Retours sous 14 jours"
## 6.5 Section 1 — Savoir-Faire (style Tag Heuer)
Photo d'atelier ou détail couture (plein largeur gauche, ~60%)
Droite : Kicker "SAVOIR-FAIRE" + H2 + texte spécifique au modèle
Chiffre clé mis en avant : "~8 heures" — temps de fabrication
Détail technique par modèle :
Rafaël : "Couture sellier main · Parage des tranches · Gaufrage signature V"
Victoire : "Tressage poignée toron · Couture sellier · 800 points par pièce"
Colette : "Poignée toron tressée · Fond renforcé · Finition cire d'abeille"
Olympe : "Couture sellier · Anse réglable · Rivets laiton brossé"
Pochon : "Fermeture zip invisible · Doublure suédée · Passepoil cuir"
CTA "En savoir plus" → /pages/savoir-faire
## 6.6 Section 2 — La Matière (style Tag Heuer)
Photo macro texture cuir (plein largeur ou 50%)
H3 "Le Cuir"
Description selon matière sélectionnée (dynamique via métafield) :
Cuir Veau : "Cuir pleine fleur de veau, tanné en France. Grain fin, toucher soyeux, patine naturelle avec le temps. Résistance exceptionnelle."
Taurillon : "Cuir de taureau adulte, grain plus marqué, structure rigide. Le choix des pièces portées au quotidien."
Agneau Plongé : "Cuir d'agneau tanné en plongée. Texture veloutée, extrêmement souple."
Cuir Caviar : "Cuir grainé pressé, résistant aux rayures."
Exotique : "Peaux sélectionnées parmi les meilleures tanneries françaises spécialisées. Certificat CITES fourni."
Provenance : "Tannée en France · Certifiée REACH"
CTA → /pages/matieres-cuirs
## 6.7 Section 3 — Dimensions & Détails (style Tag Heuer)
Tableau finitions : | Élément | Détail | |---|---| | Fermeture | Bouton pression magnétique / Zip invisible | | Doublure | Microfibre suédée noire | | Fond | Renforcé par une plaque de cuir | | Anneaux | Laiton massif brossé | | Coutures | Fil de lin ciré, point sellier | | Tranches | Peintes et polies à la cire d'abeille |

Dimensions : Hauteur × Largeur × Profondeur en cm Portée : Hauteur anse main / Hauteur portée épaule Contenance : "Tient : téléphone · portefeuille · clés · agenda A5"
## 6.8 Section 4 — L'Atelier
Vidéo 16:9 plein largeur si disponible
Sinon : grille 3–4 photos de fabrication
Texte : "Cette pièce est fabriquée à Paris"
Citation artisan en Playfair Italic
## 6.9 Section 5 — Entretien du cuir
4 conseils avec icônes :
Protéger de la pluie
Éviter l'exposition soleil prolongée
Nourrir 2x par an avec crème sans silicone
Ranger dans la housse fournie
CTA : "Télécharger le guide d'entretien" (PDF)
## 6.10 Section 6 — Sur Mesure (si tag sur-mesure)
Options disponibles + délai "6–8 semaines"
CTA "PRENDRE RENDEZ-VOUS" → /pages/prendrez-rendez-vous
## 6.11 Section 7 — Vous aimerez aussi
4 produits de la même collection
Carousel mobile
Cards identiques à la page collection
## 6.12 Produits et leurs spécificités
Produit
Prix
Storytelling clé
Sur mesure
Rafaël
1 360–5 220€
Signature V + gaufrage
✓
Victoire
3 700–7 000€
Poignée toron tressée main
✓
Colette
2 500–6 800€
Structure rigide + souplesse
✓
Colette Mini
2 400€
Version compacte du Colette
✓
Jane
3 100€
Anse en cuir plissé
✗
Olympe
2 370–2 480€
Bandoulière réglable
✗
Pochon
580–680€
Pièce complémentaire
✗
Chaîne
190€
Accessoire
✗
Anse en cuir
250€
Accessoire remplacement
✗

# PARTIE 7 — PAGES ÉDITORIALES
## 7.1 Structure commune
1. [HERO PLEIN ÉCRAN] — header transparent, titre centré ou bas gauche

2. [INTRO TEXTE] — centré, max-width 720px, 16px, line-height 1.8

3. [SECTIONS ALTERNÉES] — image/texte (60/40%)

4. [CTA FINAL]
## 7.2 Notre Histoire (/pages/histoire)
Objectif : humaniser la marque, montrer l'héritage

Structure :

Hero : image éditoriale ou archives, titre "Notre Histoire"
Intro : 2–3 paragraphes sur les origines
Timeline scroll-reveal : 1904 → 1960s → 1990s → Aujourd'hui
Sections : Les Origines / La Signature V / La Rupture / Aujourd'hui
Photos intercalées (archives si disponibles, ou lifestyle actuel)
CTA final : "Découvrir nos collections"

Contenu texte (déjà rédigé dans Shopify) : utiliser page.content
## 7.3 Savoir-Faire (/pages/savoir-faire)
Objectif : justifier les prix, montrer la valeur artisanale

Structure :

Hero : photo d'artisan ou close-up couture
Intro : "Un artisan. Une pièce. Du début à la fin."
Tableau "Le temps d'une pièce" : | Pièce | Étapes | Durée | |---|---|---| | Rafaël | 12 étapes | ~2h | | Pochon | 8 étapes | ~3h | | Olympe | 14 étapes | ~4h | | Colette | 18 étapes | ~6h | | Victoire | 24 étapes | ~10h |
Sections techniques avec photos close-up :
La Coupe — tranchet, précision au millimètre
Le Parage — amincir les bords
La Couture sellier — point sellier main, 2 aiguilles
La Poignée toron — tressage main pour Victoire et Colette
Les Finitions — cire d'abeille, polissage tranches
CTA : "Voir les produits" → /collections/sacs
## 7.4 Matières & Cuirs (/pages/matieres-cuirs)
Objectif : éduquer, différencier les cuirs

Structure :

Hero : macro texture cuir
Guide par matière (section par section) :
Cuir Veau
Taurillon
Agneau Plongé
Cuir Caviar
Cuirs Exotiques
Chaque section : photo macro + nom + description + caractéristiques + provenance
Tableau comparatif récapitulatif
## 7.5 À Propos (/pages/a-propos)
Vision et valeurs de la marque
Portrait (si disponible)
Contact et réseaux
## 7.6 Sur Mesure (/pages/sur-mesure)
Objectif : convertir vers une commande sur mesure

Structure :

Hero : photo sac avec options coloris
Process en 4 étapes visuelles :
Choisir le modèle de base
Sélectionner le cuir et la couleur
Personnaliser les options (anse, pochon)
Livraison en 6–8 semaines
Options disponibles (cuirs, couleurs, finitions)
Prix indicatifs
CTA "PRENDRE RENDEZ-VOUS" → /pages/prendrez-rendez-vous

# PARTIE 8 — BLOG — L'ATELIER
## 8.1 Page liste articles
Grille 3 colonnes desktop / 1 colonne mobile
Card : image + date + titre + extrait 2 lignes
Sans pagination (tous visibles)
## 8.2 Template article
Hero plein écran avec image article, titre bas gauche
Corps : max-width 720px centré, 16px, line-height 1.8
Pull quotes en Playfair Italic, 24px, opacity 60%
Images inline plein largeur
"Articles similaires" en bas (3 cards)
## 8.3 Articles existants
Titre
Handle
Thème
La couture sellier
couture-sellier
Technique artisanale
Guide des cuirs
guide-cuirs-maroquinerie-luxe
Matières
Pourquoi un sac made in France
pourquoi-sac-made-in-france-prix
Valeur / prix

# PARTIE 9 — PANIER & CHECKOUT
## 9.1 Panier drawer
Ouverture depuis la droite, fond blanc
Overlay noir 40%
En-tête : "VOTRE PANIER (2)" + croix
Articles : image 60×80px + nom + variante + prix + +/- + supprimer
Sous-total
"Livraison offerte en France"
CTA principal : "VALIDER MA COMMANDE" → checkout
CTA secondaire : "Continuer mes achats" (ferme)
Ouverture automatique à l'ajout
Animation icône panier : micro-bounce + update count
## 9.2 Checkout Shopify
Logo : Logo_-_since_1904_-_vrai_noir.png
Police : Playfair Display
Boutons : fond #0a0a0a
Fond : blanc
Sans "Powered by Shopify"
Étapes : Informations → Livraison → Paiement

# PARTIE 10 — FOOTER
## 10.1 Structure desktop (4 colonnes)
[ Join the Society      ]  [ Collections     ]  [ La Maison       ]  [ Légal      ]

[ email *         →     ]  [ FW25            ]  [ Notre Histoire  ]  [ ML         ]

[ texte RGPD discret    ]  [ Sacs            ]  [ À Propos        ]  [ CGV        ]

[ 📷 @boschi_paris      ]  [ Petite Maro.    ]  [ Savoir-Faire    ]  [ Conf.      ]

                           [ Iconiques       ]  [ Matières & Cuirs]  [ Retours    ]

                           [ Sur Mesure      ]  [ L'Atelier       ]

──────────────────────────────────────────────────────────────────────────────────

© 2025 TIRABOSCHI Paris              ML · CGV · Confidentialité · Retours
## 10.2 Newsletter "Join the Society"
Titre : "Join the Society" — H3 Playfair Regular (pas italic)
Champ email : trait bas uniquement, transparent, placeholder "Adresse e-mail"
Bouton → (flèche) intégré
RGPD : 10px opacity 40%
Instagram : icône + "@boschi_paris" → lien profil
## 10.3 Menus footer
Collections (handle: footer-collections) : FW25, Sacs, Petite Maroquinerie, Iconiques, Sur Mesure
La Maison (handle: footer-maison) : Notre Histoire, À Propos, Savoir-Faire, Matières & Cuirs, L'Atelier
Légal (handle: footer) : Mentions légales, CGV, Confidentialité, Retours
## 10.4 Subfooter
© 2025 TIRABOSCHI Paris
Liens légaux séparés par ·
11px uppercase, opacity 40%
Pas de "Powered by Shopify"
## 10.5 Mobile
Newsletter pleine largeur en premier
Colonnes en accordéon (fermé par défaut)
Séparateur 1px entre newsletter et accordéons

# PARTIE 11 — PAGES UTILITAIRES
## 11.1 Page 404 branded
Image éditoriale plein écran
"La pièce que vous cherchez n'existe pas (encore)" — ton de marque
CTA → homepage + collections
## 11.2 Résultats de recherche
Grille cohérente avec la page collection
Predictive search dans la barre sous le header :
Résultats groupés : Produits (image + nom + prix) | Collections | Pages
Style : fond blanc, Playfair
Message 0 résultats + suggestions
## 11.3 Compte client
Formulaires : bordures 1px, Playfair, fond blanc
Boutons : noir plein
Pages : connexion, inscription, commandes, adresses, modifier profil

# PARTIE 12 — ANIMATIONS & INTERACTIONS (complet)
## 12.1 Scroll Stack (homepage — signature)
.content-for-layout > .shopify-section:nth-child(odd) {

  position: sticky;

  top: 0;

  will-change: transform;

}

/* Sortie : micro scale + opacity */

/* Z-index croissants par section */
## 12.2 Scroll reveals (toutes pages)
Attribut data-tira-reveal sur les éléments
IntersectionObserver threshold 12%, rootMargin 0 0 -40px 0
translateY(24px) → 0 + opacity 0 → 1
0.9s, cubic-bezier(0.16, 1, 0.3, 1)
Stagger 80ms entre enfants
Pas sur les éléments above the fold
## 12.3 Marquee
CSS animation 35s linear infinite
Pause au survol (desktop)
Duplication JS pour loop seamless
## 12.4 Ken Burns (images fixes uniquement)
scale(1.0) → scale(1.04), 20s, ease-in-out, alternate, infinite
Désactivé sur les vidéos
## 12.5 Curseur custom (desktop uniquement)
Zones vidéo : cercle 52px blanc "VOIR"
Trailing inertia : lerp(cursor, mouse, 0.12) à chaque frame via rAF
Opacity 0 → 1 en 250ms à l'entrée dans la zone
Désactivé touch/mobile
## 12.6 Lazy video loading
Placeholder = 1ère frame (image statique)
IntersectionObserver threshold 0.2
Quand visible → video.src = data-src → video.load() → video.play()
Crossfade placeholder → vidéo 300ms
## 12.7 View Transitions API
@view-transition { navigation: auto; }

::view-transition-old(root), ::view-transition-new(root) {

  animation-duration: 0.4s;

}

Fallback opacity 0.4s
## 12.8 Micro-interactions
Élément
Interaction
Bouton ATC
scale 0.98 au clic
Icône panier header
micro-bounce au +1 article
Burger → X
morphing SVG
Chips couleur
scale 1.1 + anneau au survol
Accordéons
height 0.4s ease
Lazy images
shimmer skeleton → fade in
Form submit
spinner → check vert
## 12.9 Scroll snap mobile (homepage)
.content-for-layout { scroll-snap-type: y mandatory; }

/* Sections héro */ { scroll-snap-align: start; }

/* Marquee + grille */ { scroll-snap-align: none; }
## 12.10 Reduced Motion — OBLIGATOIRE
@media (prefers-reduced-motion: reduce) {

  [data-tira-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; }

  .tira-marquee__track { animation: none !important; }

  .tira-ken-burns img { animation: none !important; }

}

# PARTIE 13 — EXPÉRIENCE CLIENT ENRICHIE
## 13.1 Wishlist / Favoris
App Wishlist+ (installée, à activer et intégrer)
❤️ sur chaque card produit et fiche produit
Sans compte : localStorage
Avec compte : sync serveur
Accessible depuis le header (icône ❤️) et le compte client
## 13.2 Indicateur stock / rareté
Stock = 1 : "Dernière pièce" (discret, 12px, opacity 70%)
Stock ≤ 3 : "Stock limité"
Rupture : chip grisée + "Sur commande — 4 semaines"
Cohérent avec production artisanale limitée
## 13.3 Retour en stock
Variante épuisée → "M'avertir du retour en stock"
Capture email → notification automatique Shopify
## 13.4 Quick Add modal
Trigger : bouton "CHOISIR" au survol d'une card avec variantes
Bottom sheet mobile, modal centré desktop
Image produit miniature + sélecteurs + ATC
Fermeture : swipe down ou ESC
## 13.5 Search predictive
Résultats temps réel pendant la saisie
Groupés : Produits (image + nom + prix) | Collections | Pages
Natif Horizon — à styler correctement
## 13.6 Hotspots éditoriaux (Phase 2)
Sur les images homepage/éditoriales
Picto + discret cliquable sur le sac
Popup mini-card : image + nom + prix + CTA
Lien vers fiche produit
## 13.7 Guide d'entretien PDF
Téléchargeable depuis fiche produit et page Savoir-Faire
Branding TIRABOSCHI

# PARTIE 14 — PERFORMANCES & SEO
## 14.1 Core Web Vitals cibles
Métrique
Cible
LCP
< 2.5s
CLS
< 0.1
FID
< 100ms
## 14.2 Optimisations
Images : loading="lazy" sous le fold, WebP, srcset 2x logos
Vidéos : lazy load via IntersectionObserver, pas de chargement avant viewport
CSS custom : chargé dans <head> (pas de FOUC)
JS custom : defer
Fonts : preload Playfair Display woff2
## 14.3 SEO
Alt texts : déjà faits sur les produits (à maintenir)
JSON-LD : Organisation + WebSite sur homepage
JSON-LD : Product sur les fiches produit (prix, disponibilité, SKU)
Canonical : toutes les pages
Meta descriptions : pages éditoriales, collections, articles
## 14.4 Accessibilité
Contraste AA minimum (ratio 4.5:1)
focus-visible sur tous les éléments interactifs (outline 2px #0a0a0a)
Labels sur tous les champs
skip link en début de page
ARIA sur drawers, modaux, accordéons
Navigation clavier complète

# PARTIE 15 — MAINTIEN DU STYLE EN PRODUCTION
## 15.1 Règles de non-régression
Avant tout push en production (thème live) :

Checklist visuelle :

Header transparent sur homepage (logo blanc visible sur vidéo)
Header opaque sur les autres pages (logo noir sur fond blanc)
Sticky header fonctionne (directional ou always)
Picto panier = SVG forme V (pas l'icône Shopify générique)
Marquee défile correctement sur homepage
Scroll stack fonctionne (sections sticky qui se superposent)
Ken Burns actif sur les images fixes (DSCF1828, BOSCHI0919)
Scroll snap mobile fonctionne sur les sections héro
Police Playfair Display chargée sur toutes les pages
Border-radius 0px partout (vérifier boutons, cards, inputs)
Boutons = texte souligné uppercase (pas de boîte rectangulaire)
Footer complet (4 colonnes desktop, accordéon mobile)
Newsletter footer fonctionnelle (champ + validation email)
Pas de "Powered by Shopify" visible

Checklist fonctionnelle :

ATC fonctionne sur toutes les fiches produit
Panier drawer s'ouvre et affiche les articles
Checkout accessible
Search trouve les produits
Pages éditoriales accessibles depuis le menu
Blog accessible
Compte client : connexion, inscription, commandes

Checklist mobile (iOS Safari + Android Chrome) :

Header correct (logo gauche, icônes droite)
Vidéos hero lisent correctement (autoplay muted)
Carousel galerie produit swipeable
Sticky ATC visible sur fiche produit
Filtres collection accessibles (bottom sheet)
Footer accordéon fonctionne
## 15.2 Processus de mise à jour
1. Travailler sur Horizon (ID 183983931735) — thème de test

2. Tester visuellement en local (shopify theme dev)

3. Valider la checklist ci-dessus

4. Faire valider par le client une section à la fois

5. Une fois validé → publier Horizon en remplacement de Phantom

   (NE PAS modifier Phantom — garder en backup)
## 15.3 Fichiers à ne jamais modifier
# Thème Phantom live — JAMAIS

Tout fichier du thème ID 187554070871

# Fichiers Horizon core — JAMAIS

assets/base.css

assets/theme.js

snippets/stylesheets.liquid

snippets/scripts.liquid

snippets/fonts.liquid

config/settings_schema.json
## 15.4 Fichiers custom à maintenir
assets/tiraboschi.css          ← CSS global (tokens, animations)

assets/tiraboschi.js           ← JS animations

assets/tiraboschi-header.css   ← Header mobile

snippets/icon-bag-tiraboschi.liquid  ← Picto panier SVG

snippets/header-actions.liquid       ← Actions header

snippets/tiraboschi-homepage-stack.liquid ← Scroll stack
## 15.5 Versioning recommandé
# Avant toute modification importante

shopify theme push --store ... --theme-id 183983931735

# → Crée un snapshot du thème dans Shopify

# Versionner avec git

git init

git add .

git commit -m "feat: template collection + filtres"

# PARTIE 16 — CONTENU EXISTANT À MIGRER
Tout ce contenu est dans Shopify — aucune perte au changement de thème.
## 16.1 Produits actifs (9)
Rafaël · Victoire · Colette · Colette Mini · Jane · Olympe · Pochon · Chaîne · Anse en cuir

Métafields enrichis sur 6 produits :

custom.composition : type cuir, matière, couleurs
custom.fabrication : artisan, lieu, durée
## 16.2 Collections (5)
fw25 · sacs · petite-maroquinerie · iconiques · sur-mesure-exotiques
## 16.3 Menus configurés (4)
main-menu · footer-collections · footer-maison · footer (légal)
## 16.4 Pages rédigées (7+)
histoire · savoir-faire · matieres-cuirs · a-propos · sur-mesure · contact · prendrez-rendez-vous
## 16.5 Blog L'Atelier (3 articles)
couture-sellier · guide-cuirs-maroquinerie-luxe · pourquoi-sac-made-in-france-prix
## 16.6 Assets media
Logos noir et blanc (Since 1904)
Favicon T
Photos produits avec alt texts
Vidéos homepage (16:9 et 9:16)
Photos lifestyle (DSCF1828, BOSCHI0919, BOSCHI0154)

# PARTIE 17 — PLANNING DE DÉVELOPPEMENT
## Phase 1 — Fondations ✅ (fait)
CSS global + tokens (tiraboschi.css)
JS animations (tiraboschi.js)
Layout theme.liquid
Homepage 7 sections (templates/index.json)
Header (sections/header-group.json)
Footer (sections/footer-group.json)
Color schemes
Picto panier SVG custom
Scroll stack CSS
## Phase 2 — Commerce (en cours)
Template collection (hero 100vh + filtres + grille 4 cols)
Fiche produit partie achat
Fiche produit storytelling (6 sections)
Panier drawer (style)
Quick add modal
## Phase 3 — Éditorial
Notre Histoire
Savoir-Faire
Matières & Cuirs
Sur Mesure
Blog liste + article template
## Phase 4 — Finitions
Page 404
Search results
Compte client (style)
Wishlist intégration
Tests mobile iOS + Android
Accessibilité
SEO check
Checklist non-régression complète
Publication Horizon → LIVE

# PARTIE 18 — POINTS À VALIDER AVEC LE CLIENT
Scroll stack homepage : l'effet superposition est-il validé ?
Hero collection : 100vh ou 60vh ?
Grille collection : 4 colonnes ou 3 ?
Gap grille : 2–4px style Miu Miu ou 16px plus aéré ?
Fiche produit storytelling : toutes les sections ou certaines seulement en phase 1 ?
Vidéos d'atelier : disponibles pour la section L'Atelier en fiche produit ?
Schéma dimensions : SVG illustré ou tableau texte ?
Sticky ATC mobile : toujours visible ou seulement après le fold ?
Hotspots éditoriaux : phase 1 ou 2 ?
Wishlist : activer Wishlist+ ou développement custom ?
Texte marquee : "Made in France, Only. · Since 1904 · Maroquinerie de Luxe · Paris" — OK ?
Colette Mini : pas d'image produit → créer ou mettre en DRAFT ?
Header sticky : directional (réapparaît au scroll up) ou always (toujours visible) ?
Guide entretien PDF : document existant ou à créer ?
Citations artisans : noms et portraits disponibles pour la fiche produit ?

Cahier des charges complet v1.0 — TIRABOSCHI Paris — Mai 2025 Références : miumiu.com · tagheuer.com · Baymard Institute Luxury Goods Research

# PARTIE 19 — EXPÉRIENCES IMMERSIVES AVANCÉES
## 19.1 Ce qui manque encore vs les meilleurs sites luxe
En comparant avec Miu Miu, Jacquemus, Loewe, The Row et Bottega Veneta, voici les expériences immersives qui feraient passer TIRABOSCHI dans une autre dimension.

## 19.2 Immersion sonore (Loewe, Jacquemus)
Certaines maisons intègrent un soundscape discret sur la homepage — un fond sonore ambiance atelier : cuir qu'on travaille, aiguille qui perfore, ciseau qui coupe. Volume très bas, opt-in (bouton son on/off visible).

Pour TIRABOSCHI :

Soundscape atelier de 30s en loop sur la homepage (si vidéo hero)
Bouton son 🔈/🔇 coin supérieur droit, discret
Désactivé par défaut — l'utilisateur choisit d'activer
Désactivé sur mobile (politique iOS autoplay audio)
Mémorisé en localStorage

Impact : crée une connexion émotionnelle immédiate avec le savoir-faire artisanal. Différenciant fort.

## 19.3 Parallax profond sur les sections éditoriales
Ce que Loewe et The Row font : Les images des sections éditoriales bougent à une vitesse différente du scroll — l'image "défile" plus lentement que la page, créant une profondeur de champ.

Pour TIRABOSCHI :

Parallax sur les images fixes de la homepage (DSCF1828, BOSCHI0919)
Vitesse : translateY(-15%) sur toute la hauteur de scroll de la section
Implémentation : transform: translateY(calc(var(--scroll-progress) * -15%)) via CSS custom property mise à jour par JS
Désactivé sur mobile (performance) et prefers-reduced-motion

## 19.4 Révélation de texte au scroll (Jacquemus)
Ce que Jacquemus fait : Les titres se révèlent mot par mot ou lettre par lettre au fur et à mesure que l'utilisateur scrolle dans la section. L'effet donne l'impression que le texte "se matérialise".

Pour TIRABOSCHI :

Sur les titres H2 des sections éditoriales (pas sur les H1 hero)
Chaque mot apparaît avec opacity 0→1 + translateY(8px)→0, délai 60ms entre chaque mot
Déclenché quand la section est à 30% de visibilité

## 19.5 Transition morphing entre images (Bottega Veneta)
Ce que Bottega Veneta fait : Au clic sur une image de collection ou au scroll sur la homepage, les images se transforment l'une en l'autre avec un morphing fluide — pas un simple fondu.

Pour TIRABOSCHI :

Sur la galerie de la fiche produit : transition morphing entre les images (FLIP animation)
Au changement de variante couleur : l'image se "transforme" en la nouvelle (300ms, ease)
Implémentation : CSS view-transition-name sur l'image produit + View Transitions API

## 19.6 Vidéo background interactive (Miu Miu avancé)
Ce que Miu Miu fait sur certains lancements : La vidéo hero répond à la position de la souris — quand on bouge la souris, la vitesse de lecture change légèrement, ou la position de cadrage s'ajuste.

Pour TIRABOSCHI :

Sur le hero FW25 desktop : la vidéo ralentit légèrement quand la souris est immobile, accélère au mouvement
Implémentation : video.playbackRate modifié selon mousemove velocity (0.7x → 1.3x)
Effet subtil — l'utilisateur doit le sentir sans le voir explicitement

## 19.7 Mode "Atelier" — Expérience immersive dédiée
Page ou section dédiée (inspiration Hermès "Horizons") :

Une expérience interactive en plein écran qui guide l'utilisateur à travers les étapes de fabrication d'un sac :

8 étapes illustrées avec photos/vidéos
Navigation horizontale (scroll ou flèches)
À chaque étape : texte + photo close-up + son optionnel
Durée estimée : "Vous êtes à l'étape 3/8"
CTA final : "Commander ce modèle" → fiche produit

URL : /pages/atelier-immersif Lien depuis : savoir-faire, homepage, fiche produit

## 19.8 Lookbook interactif avec hotspots
Ce que Miu Miu fait sur ses campagnes : Des photos de campagne en plein écran avec des points cliquables sur les pièces portées. Au clic → mini card produit flottante avec image, nom, prix, CTA.

Pour TIRABOSCHI :

Sur 2–3 images clés de la homepage ou pages éditoriales
Hotspot = point pulsant (animation CSS)
Au clic/tap : popup 200px avec image + nom + prix + "VOIR LA PIÈCE"
Données des hotspots en métafields ou JSON inline
Mobile : tap → bottom sheet compact

## 19.9 Expérience "Configure votre sac" (Sur Mesure)
Page de configuration interactive :

Image SVG ou PNG du sac avec zones remplaçables
Sélecteur couleur cuir → update de l'image en temps réel
Sélecteur matière → update visuel
Récapitulatif prix en live
CTA "Envoyer ma configuration" → email + RDV

Implémentation technique :

Canvas ou SVG avec calques par coloris
ou images PNG pré-générées par combinaison (plus simple, moins de code)
ou intégration app Zakeke/Kickflip (plug-and-play Shopify)

## 19.10 Micro-animations de chargement brandées
Plutôt qu'un spinner générique, une animation de chargement TIRABOSCHI :

Le logo V se dessine en trait (SVG stroke animation)
Durée : 600ms
Sur : chargement page, ajout panier, soumission formulaires
CSS stroke-dasharray + stroke-dashoffset animation

# PARTIE 20 — TRIGGERS & CRM
## 20.1 Stack recommandée pour TIRABOSCHI
Besoin
Outil recommandé
Plan Shopify Basic compatible
Email marketing + automation
Klaviyo
✓ (free jusqu'à 250 contacts)
CRM léger
Klaviyo profiles
✓
Popups & triggers
Klaviyo Forms ou Privy
✓
Chat & support
Tidio ou Gorgias
✓
Retour en stock
Klaviyo Back-in-Stock
✓
Avis clients
Judge.me
✓ (free tier)
Programme fidélité
Loyoly (luxe FR) ou Smile.io
✓
## 20.2 Flows email essentiels (Klaviyo)
### Flow 1 — Bienvenue "Join the Society"
Déclencheur : inscription newsletter (footer ou popup)

Email 1 — J+0 : "Bienvenue dans la Société TIRABOSCHI"

  → Histoire de la marque + lien Notre Histoire

  → Image éditoriale

  → CTA : Découvrir la collection FW25

Email 2 — J+3 : "Le Savoir-Faire"

  → Vidéo ou images de l'atelier

  → Tableau temps de fabrication

  → CTA : Découvrir les produits

Email 3 — J+7 : "Les Matières"

  → Guide des cuirs résumé

  → CTA : Lire le guide complet + voir la collection
### Flow 2 — Abandon panier
Déclencheur : article ajouté au panier, pas de commande après 1h

Email 1 — 1h après : "Votre sélection vous attend"

  → Image du produit abandonné

  → Prix

  → CTA : Reprendre ma commande

  → (Pas de remise — positionnement luxe)

Email 2 — 24h après : "Une pièce façonnée pour durer"

  → Contenu storytelling sur le produit abandonné

  → Témoignage client si disponible

  → CTA : Voir la fiche produit
### Flow 3 — Post-achat
Déclencheur : commande confirmée

Email 1 — J+0 : Confirmation commande (Shopify natif — customiser le template)

Email 2 — J+2 : "Votre pièce est en fabrication"

  → Photo de l'atelier

  → Description des étapes de fabrication

  → Lien tracking si applicable

Email 3 — J+7 (livraison estimée) : "Prendre soin de votre pièce"

  → Guide d'entretien complet

  → CTA : Télécharger le guide PDF

Email 4 — J+30 : "Comment se porte votre [nom du produit] ?"

  → Demande d'avis (Judge.me)

  → Invitation à partager sur Instagram @boschi_paris

  → CTA : Laisser un avis
### Flow 4 — Retour en stock
Déclencheur : variante remise en stock après inscription "M'avertir"

Email unique — immédiat :

  → "La pièce que vous attendiez est de retour"

  → Image + nom + variante + prix

  → CTA : Commander maintenant

  → Urgence discrète : "Stock limité — X pièces disponibles"
### Flow 5 — Win-back (réengagement)
Déclencheur : client inactif depuis 6 mois (ouverture ou achat)

Email 1 — "Nous avons pensé à vous"

  → Nouveautés depuis leur dernière visite

  → CTA : Découvrir les nouvelles pièces

Email 2 — J+14 si pas d'engagement : "La collection FW25 vous attend"

  → Éditorial collection

  → (Si toujours inactif après J+30 : sortir de la liste active)
### Flow 6 — Série VIP (clients récurrents)
Déclencheur : 2ème achat ou dépense cumulée > 5 000€

Email 1 : "Vous faites partie de la Société"

  → Invitation au programme fidélité (voir Partie 21)

  → Accès early à la prochaine collection

Email 2 : Invitation à un événement atelier (si disponible)
## 20.3 Segmentation Klaviyo recommandée
Segment
Critères
Usage
Prospect chaud
Visite fiche produit 2x+ sans achat
Flow abandon navigation
Premier acheteur
1 commande, < 30 jours
Flow post-achat onboarding
Client fidèle
2+ commandes ou > 5 000€
Flow VIP + early access
Client dormant
Pas d'achat depuis 12 mois
Win-back
Abonné newsletter
Inscrit mais jamais acheté
Nurturing éditorial
Sur mesure
Tag sur-mesure sur commande
Communication dédiée
## 20.4 Popups et triggers on-site
### Popup newsletter — style luxe
NE PAS faire : popup intrusif 3 secondes après l'arrivée

Approche TIRABOSCHI :

Déclencheur : scroll 60% de la homepage OU intent de quitter (exit intent desktop)
Design : plein écran discret, fond crème, Playfair Display
Message : "Join the Society — Les coulisses de l'atelier, les nouvelles pièces en avant-première"
Champ email + bouton → (flèche)
Fermeture : croix + "Non merci"
Fréquence : 1x par visiteur, ne réapparaît pas pendant 30 jours
### Notification retour en stock
Sur les variantes épuisées en fiche produit
"M'avertir du retour en stock" → saisie email inline
Pas de popup — intégré dans la page
### Notification abandon navigation (optionnel)
Si l'utilisateur consulte une fiche produit 3+ fois sans acheter
Trigger email Klaviyo "Browse Abandonment"
Pas de pop-up intrusif
## 20.5 Chat & support
Recommandation : Tidio (free tier)

Chat en temps réel
Bot de pré-qualification (Quel modèle vous intéresse ? Quelle occasion ?)
Horaires de disponibilité affichés
Style : bulle discrète coin bas-droit, fond noir, pas de photo avatar générique
Sur mobile : se cache automatiquement au scroll pour ne pas masquer le contenu

# PARTIE 21 — PROGRAMME DE FIDÉLITÉ LUXE
## 21.1 Philosophie — Ce qu'il NE faut PAS faire
À éviter absolument (anti-luxe) :

❌ Points convertibles en remises / bons de réduction
❌ "Gagnez 10 points pour chaque euro dépensé"
❌ Barres de progression gamifiées
❌ Emails "Il vous manque 150 points pour votre prochain bon"
❌ Langage promotionnel / coupon

Ce que font les maisons de luxe (Hermès, Cartier, Chanel) :

Accès et privilèges exclusifs, pas d'argent
Reconnaissance et statut
Expériences inoubliables, pas de remises
Invitation, pas d'inscription publique
## 21.2 Concept — "La Société TIRABOSCHI"
Nom : La Société — sobre, référence au "Join the Society" de la newsletter Accès : sur invitation après le 1er achat ou 2ème achat Communication : "Vous faites partie de La Société" — jamais "programme de fidélité"
## 21.3 Structure — 3 cercles (pas de niveaux gamifiés)
### Cercle I — "Membre"
Accès : dès le 1er achat Avantages :

Livraison prioritaire (48h vs 3–5 jours)
Guide d'entretien exclusif (version cuir + soins spéciaux)
Accès early aux nouvelles collections (48h avant ouverture publique)
Invitation aux événements digitaux (coulisses atelier, présentation collection)
Emballage cadeau inclus à chaque commande
### Cercle II — "Artisan"
Accès : 2ème achat ou dépense cumulée > 5 000€ Avantages précédents +

Carte de membre physique (papier épais, embossée, livrée dans un fourreau)
Accès aux pièces en édition limitée avant tout le monde
Note manuscrite glissée dans chaque commande
Invitation à une visite d'atelier (1x par an, Paris, groupe restreint de 10 personnes)
Sur mesure avec délai réduit (4 semaines vs 6–8)
### Cercle III — "Maison"
Accès : sur invitation uniquement — 3+ achats ou dépense cumulée > 15 000€ Avantages précédents +

Relation directe avec la fondatrice (email dédié)
Pièce exclusive réservée en avant-première (1 par an)
Invitation au lancement annuel de collection (Paris)
Personnalisation signature V offerte sur la prochaine commande
Accès au catalogue "Archive" — pièces historiques ou prototypes
## 21.4 Implémentation technique
### Option A — Loyoly (recommandé, made in France, luxe)
Pourquoi Loyoly :

Conçu pour le luxe et les marques premium françaises
Pas de points/remises par défaut — focus sur les expériences
Interface épurée, personnalisable aux couleurs de la marque
Intégration Shopify native + Klaviyo
Compatible plan Basic
Prix : ~99€/mois

Ce que Loyoly gère :

Gestion des niveaux (Membre, Artisan, Maison)
Attribution automatique selon les seuils d'achat
Page "La Société" brandée TIRABOSCHI
Emails de bienvenue par niveau
Tableau de bord client (avantages disponibles, statut)
### Option B — Smile.io (plus accessible)
Free tier disponible (limité)
Moins orienté luxe mais personnalisable
Désactiver toutes les fonctions "points" — n'utiliser que les niveaux et avantages
Prix : free → 49$/mois
### Option C — Développement custom (meilleure expérience)
Via les Customer Metafields Shopify :

Métafield customer.loyalty_tier : member | artisan | maison
Métafield customer.loyalty_since : date d'entrée
Logique d'attribution : Shopify Flow (automatisations)
Page client dédiée : /account/la-societe
Avantages débloqués via tags client (Shopify natif)

Avantage : expérience 100% dans la charte TIRABOSCHI, pas d'interface tierce Inconvénient : dev plus long, maintenance manuelle
## 21.5 Expérience client du programme
### Parcours d'entrée
1. Client passe sa 1ère commande

2. Email post-achat J+2 : "Votre pièce est en fabrication"

3. Email J+7 (après livraison) : "Bienvenue dans La Société"

   → Design premium, Playfair Display

   → "Vous faites maintenant partie d'un cercle restreint..."

   → Présentation des avantages Membre

   → CTA : "Découvrir vos privilèges" → page /account/la-societe

4. Page La Société dans l'espace client :

   → Statut actuel (Membre)

   → Avantages disponibles

   → "Prochaine étape : Cercle Artisan" (discret, pas de barre)
### Page "La Société" dans l'espace client
URL : /account/la-societe

Structure :

  1. En-tête : "La Société TIRABOSCHI" + statut actuel

  2. Vos privilèges (liste des avantages du niveau actuel)

  3. Section éditoriale : "Ce que signifie faire partie de La Société"

  4. Prochains événements (si disponibles)

  5. Votre historique avec TIRABOSCHI (commandes + pièces)
## 21.6 Communication du programme
### Règle d'or
Ne jamais appeler ça "programme de fidélité" dans les communications client. Toujours parler de "La Société", "votre statut", "vos privilèges".
### Ton
Sobre, confidentiel
"Vous faites partie de..." (exclusivité)
Jamais de chiffres (pas de "5 000€ dépensés")
Jamais de comparaison entre niveaux dans les emails
### Exemples de formulations
✓ "En tant que membre de La Société, vous bénéficiez d'un accès en avant-première." ✓ "Votre fidélité mérite une attention particulière." ✗ "Il vous manque 1 500€ pour passer au niveau Artisan." ✗ "Profitez de vos 500 points de fidélité."

# PARTIE 22 — OPTIMISATION DE L'EXISTANT
## 22.1 Homepage — Optimisations
Problème potentiel
Solution
3 vidéos chargées en même temps
Lazy load vidéos 2 et 3 via IntersectionObserver
LCP lent (vidéo hero)
Ajouter poster image (1ère frame) + preload="none" sur vidéos 2/3
Scroll stack saccadé sur Android
Utiliser will-change: transform + transform: translateZ(0)
Marquee freeze sur iOS
Utiliser animation: marquee sur le track + duplication JS
Ken Burns trop agressif
Réduire à 1.02 sur mobile
## 22.2 Fiche produit — Optimisations
Problème potentiel
Solution
Changement d'image trop lent au clic variante
Précharger toutes les images variantes en <link rel="preload">
Galerie desktop saccadée au scroll
position: sticky avec will-change: transform
ATC sticky mobile masque le contenu
Padding-bottom 72px sur le body uniquement sur les pages produit
Prix non mis à jour au changement variante
S'assurer que Horizon gère le prix dynamiquement (natif)
## 22.3 Pages collection — Optimisations
Problème potentiel
Solution
Filtres Horizon pas assez stylés
Override CSS ciblé sur .facets-*
Grille 4 cols trop dense sur tablette 768px
Breakpoint 3 cols à 900px
Images collection au format carré (Horizon default)
Forcer aspect-ratio: 3/4 sur .product-card__image
Hover 2ème image manquant sur iOS
Utiliser @media (hover: hover) pour le hover, tap pour mobile
## 22.4 Performance globale — Optimisations
### Images
<!-- Toujours utiliser les attributs Shopify optimisés -->

{{ image | image_url: width: 800 | image_tag:

   loading: 'lazy',

   sizes: '(max-width: 749px) 100vw, 50vw',

   widths: '400, 800, 1200' }}
### Fonts
<!-- Dans le <head> — précharger Playfair Display -->

<link rel="preload"

  href="{{ 'PlayfairDisplay-Regular.woff2' | asset_url }}"

  as="font" type="font/woff2" crossorigin>
### CSS critique
Inliner le CSS above-the-fold dans <style> dans le <head>
Charger tiraboschi.css en <link rel="preload"> également
### JavaScript
tiraboschi.js en defer (déjà fait)
Pas de jQuery — vanilla JS uniquement
Diviser tiraboschi.js en modules si > 50Ko
## 22.5 SEO — Optimisations manquantes
### JSON-LD à ajouter
// Sur les fiches produit

{

  "@type": "Product",

  "name": "Victoire",

  "brand": { "@type": "Brand", "name": "TIRABOSCHI Paris" },

  "offers": {

    "@type": "Offer",

    "price": "3700",

    "priceCurrency": "EUR",

    "availability": "InStock"

  },

  "material": "Cuir veau pleine fleur",

  "countryOfOrigin": "FR"

}
### Balises manquantes à ajouter
<meta name="robots" content="index, follow"> sur toutes les pages
Open Graph images dédiées par collection (pas la même pour tout le site)
hreflang si internationalisation future
### Vitesse — Core Web Vitals
Activer le CDN Shopify (natif — vérifier qu'il est activé)
Compresser les vidéos : max 8Mo pour le hero, 4Mo pour les autres
Format WebP pour toutes les images produit (Shopify le fait automatiquement si image_url est utilisé)
## 22.6 Accessibilité — Manques identifiés
Manque
Correction
Vidéos sans sous-titres
Ajouter <track kind="captions"> si dialog
Marquee animé sans option pause
Bouton "Pause" accessible au clavier
Modales sans focus trap
Implémenter focus trap dans les drawers/modales
Images décoratives sans alt=""
S'assurer que les images purement décoratives ont alt=""
Contrastes sur overlay vidéo
Vérifier ratio 4.5:1 sur les textes H1 et CTA

# PARTIE 23 — CHECKLIST ANTI-RÉGRESSION COMPLÈTE
## 23.1 Avant chaque push sur le thème de test
HOMEPAGE

□ Vidéo hero charge et lit correctement (desktop + mobile)

□ Marquee défile sans saccade

□ Scroll stack fonctionne (sections se superposent)

□ Ken Burns actif sur DSCF1828 et BOSCHI0919

□ Scroll reveals se déclenchent correctement

□ Stagger des cards produit visible

□ Curseur "VOIR" actif sur les zones vidéo (desktop)

HEADER

□ Logo TIRABOSCHI visible et à gauche (mobile) / gauche (desktop)

□ Logo blanc sur homepage (transparent) / noir sur autres pages

□ Picto panier = SVG forme V (pas l'icône générique)

□ Compte client + burger groupés à droite (mobile)

□ Search bar sous le header, transparente, trait bas

□ Sticky header fonctionne au scroll

COLLECTION

□ Hero 100vh, titre bas gauche

□ Filtres sticky (ne défilent pas avec le contenu)

□ Grille 4 colonnes desktop / 2 mobile

□ Gap 2–4px entre les cards

□ Hover : 2ème image + bouton ATC (desktop)

□ ❤️ wishlist visible au survol

FICHE PRODUIT

□ Galerie sticky desktop fonctionne

□ Zoom loupe actif au survol

□ Sélecteur couleur change l'image principale

□ Bouton ATC fonctionne (test ajout au panier)

□ Sticky ATC visible sur mobile

□ Sections storytelling s'affichent (scroll reveals)

□ Sur Mesure masqué si pas le tag correspondant

PANIER

□ Drawer s'ouvre correctement

□ Produits affichés avec image + variante + prix

□ Quantité modifiable

□ CTA checkout fonctionne

FOOTER

□ 4 colonnes visibles desktop

□ Newsletter : champ email + bouton → fonctionnels

□ Liens de navigation tous actifs

□ Accordéon mobile fonctionne

□ Pas de "Powered by Shopify"

□ Copyright © 2025 TIRABOSCHI Paris visible

TYPOGRAPHIE & STYLE

□ Playfair Display chargée (pas de fallback serif générique)

□ 0px border-radius partout (boutons, inputs, cards)

□ Boutons = texte souligné (pas de boîte)

□ Couleurs : #0a0a0a noir / #ffffff blanc / #f7f5f2 crème

PERFORMANCE

□ Pas d'erreurs console JavaScript

□ Pas d'erreurs 404 sur les assets

□ LCP raisonnable (< 4s sur mobile 3G simulé)

□ Pas de layout shift visible (CLS)

ACCESSIBILITÉ

□ Navigation clavier possible

□ Focus visible sur tous les éléments interactifs

□ Pas d'erreurs ARIA dans la console
## 23.2 Avant push en PRODUCTION (thème live)
Reprendre toute la checklist 23.1 PLUS :

□ Tester sur iPhone (iOS Safari) — vrai device ou BrowserStack

□ Tester sur Android Chrome — vrai device ou BrowserStack

□ Tester la commande de bout en bout (ATC → panier → checkout)

□ Tester la création de compte client

□ Tester la recherche produit

□ Vérifier les meta descriptions sur 3 pages

□ Vérifier le JSON-LD product sur une fiche produit

□ S'assurer que Phantom est toujours en backup (pas supprimé)

□ Faire valider visuellement par le client sur mobile

Cahier des charges v3.0 enrichi — TIRABOSCHI Paris — Mai 2025 Ajouts : Immersivité avancée · Triggers & CRM · Programme fidélité luxe · Optimisations · Checklist anti-régression

# PARTIE 24 — TRIGGERS, CRM & FIDÉLITÉ 100% CUSTOM (sans app tierce)
## 24.1 Philosophie — Tout en natif Shopify
Avantages du développement custom :

Expérience 100% dans la charte TIRABOSCHI (pas d'interface tierce)
Contrôle total sur les données clients
Pas de frais mensuels d'app (économie 100–400€/mois)
Pas de dépendance à un service tiers qui peut changer ou fermer
Données stockées directement dans Shopify

Outils Shopify natifs utilisés :

Customer Metafields — stocker les données fidélité
Customer Tags — déclencher les automations
Shopify Flow — automations (ajout tags, emails)
Shopify Email — envoi des emails (gratuit jusqu'à 10k/mois)
Shopify Segments — segmentation avancée
Shopify Inbox — chat support gratuit
Liquid — templates emails + pages custom
JavaScript custom — popups, tracking comportemental

## 24.2 Programme de fidélité — "La Société" en 100% custom
### Architecture des données
Métafields client à créer dans Shopify Admin :

Namespace : loyalty

Clé             Type      Description

──────────────────────────────────────────

tier            string    "member" | "artisan" | "maison"

tier_since      date      Date d'entrée dans le niveau actuel

total_spent     decimal   Montant cumulé (calculé par Flow)

order_count     integer   Nombre de commandes (calculé par Flow)

invited_by      string    "manual" | "auto" (pour Maison = toujours manual)

notes           string    Notes internes (pour le Cercle Maison)

early_access    boolean   Accès aux collections en avant-première

Tags client (pour les triggers Flow) :

loyalty-member     → Cercle I

loyalty-artisan    → Cercle II

loyalty-maison     → Cercle III

loyalty-pending    → Commande passée, email bienvenue pas encore envoyé

newsletter-signup  → Inscrit à la newsletter
### Shopify Flow — Automations de fidélité
Flow 1 : Attribution automatique Cercle I (Membre)

Déclencheur : Order created

Condition   : customer.orders_count == 1

              ET customer.tags ne contient pas "loyalty-member"

Actions     :

  1. Ajouter tag "loyalty-member" au client

  2. Mettre à jour metafield loyalty.tier = "member"

  3. Mettre à jour metafield loyalty.tier_since = today

  4. Ajouter tag "loyalty-pending" (déclenche Flow 2)

Flow 2 : Email bienvenue Cercle I

Déclencheur : Customer tag added = "loyalty-pending"

Délai       : 7 jours (attendre la livraison estimée)

Actions     :

  1. Envoyer email "Bienvenue dans La Société" (template ci-dessous)

  2. Retirer tag "loyalty-pending"

Flow 3 : Attribution automatique Cercle II (Artisan)

Déclencheur : Order paid

Condition   : customer.orders_count >= 2

              OU customer.total_spent >= 5000

              ET customer.tags ne contient pas "loyalty-artisan"

Actions     :

  1. Retirer tag "loyalty-member"

  2. Ajouter tag "loyalty-artisan"

  3. Mettre à jour metafield loyalty.tier = "artisan"

  4. Envoyer email "Vous accédez au Cercle Artisan"

Flow 4 : Cercle III (Maison) — Manuel uniquement

Pas de Flow automatique — ajout manuel depuis Shopify Admin

Le tag "loyalty-maison" et le metafield sont mis à jour manuellement

Email personnalisé envoyé manuellement ou via Flow déclenché sur tag

Flow 5 : Abandon panier

Déclencheur : Checkout created (sans Order created dans les 6h suivantes)

Délai       : 1 heure

Condition   : checkout.total_price > 0

Actions     :

  1. Envoyer email "Votre sélection vous attend" (template ci-dessous)

  → PAS de code promo — jamais

Délai       : 24 heures supplémentaires

Condition   : pas de commande passée depuis

Actions     :

  1. Envoyer email storytelling sur le produit abandonné

Flow 6 : Post-achat

Déclencheur : Order fulfilled (expédié)

Actions :

  Email J+0 : "Votre pièce est en route" (Shopify natif, à customiser)

Déclencheur : Order fulfilled

Délai       : 7 jours

Actions :

  Email J+7 : "Prendre soin de votre pièce" (guide entretien)

Déclencheur : Order fulfilled

Délai       : 30 jours

Actions :

  Email J+30 : "Comment se porte votre [produit] ?" (demande avis)

Flow 7 : Win-back

Déclencheur : 180 jours depuis le dernier achat (Order created)

Condition   : customer n'a pas de commande depuis 180 jours

Actions     :

  1. Envoyer email "Nous avons pensé à vous"

  2. Ajouter tag "win-back-sent"
### Templates emails (Liquid — Shopify Email)
Template 1 — Bienvenue La Société (Cercle I)

<!-- Objet : Bienvenue dans La Société TIRABOSCHI -->

<table style="max-width:600px; margin:0 auto; font-family:'Georgia', serif;">

  <tr>

    <td style="padding:48px 40px 32px; text-align:center; border-bottom:1px solid #e8e8e8;">

      <img src="{{ shop.metafields.global.logo_noir_url }}"

           alt="TIRABOSCHI Paris" height="20" style="height:20px;">

    </td>

  </tr>

  <tr>

    <td style="padding:48px 40px 16px;">

      <p style="font-size:11px; letter-spacing:0.14em; text-transform:uppercase;

                color:#0a0a0a; opacity:0.5; margin:0 0 24px;">

        La Société · Cercle I

      </p>

      <h2 style="font-size:28px; font-weight:400; color:#0a0a0a; margin:0 0 24px;

                 line-height:1.2; letter-spacing:-0.01em;">

        Bienvenue dans<br>La Société TIRABOSCHI

      </h2>

      <p style="font-size:14px; color:#0a0a0a; line-height:1.7; margin:0 0 24px;">

        Bonjour {{ customer.first_name }},

      </p>

      <p style="font-size:14px; color:#0a0a0a; line-height:1.7; margin:0 0 32px;">

        En faisant confiance à TIRABOSCHI, vous faites maintenant partie

        d'un cercle restreint de personnes qui partagent notre conviction

        que le vrai luxe se tient dans les heures passées à façonner

        chaque pièce à la main.

      </p>

    </td>

  </tr>

  <tr>

    <td style="padding:0 40px 32px;">

      <p style="font-size:11px; letter-spacing:0.1em; text-transform:uppercase;

                color:#0a0a0a; margin:0 0 16px; border-top:1px solid #e8e8e8;

                padding-top:32px;">

        Vos privilèges

      </p>

      <table style="width:100%;">

        <tr>

          <td style="padding:12px 0; border-bottom:1px solid #f0f0f0;

                     font-size:13px; color:#0a0a0a;">

            Livraison prioritaire (48h)

          </td>

        </tr>

        <tr>

          <td style="padding:12px 0; border-bottom:1px solid #f0f0f0;

                     font-size:13px; color:#0a0a0a;">

            Accès en avant-première aux nouvelles collections

          </td>

        </tr>

        <tr>

          <td style="padding:12px 0; border-bottom:1px solid #f0f0f0;

                     font-size:13px; color:#0a0a0a;">

            Guide d'entretien exclusif

          </td>

        </tr>

        <tr>

          <td style="padding:12px 0; font-size:13px; color:#0a0a0a;">

            Emballage cadeau inclus à chaque commande

          </td>

        </tr>

      </table>

    </td>

  </tr>

  <tr>

    <td style="padding:0 40px 48px; text-align:center;">

      <a href="{{ shop.url }}/account/la-societe"

         style="display:inline-block; font-size:11px; letter-spacing:0.1em;

                text-transform:uppercase; color:#0a0a0a; text-decoration:underline;

                text-underline-offset:4px;">

        Découvrir vos privilèges

      </a>

    </td>

  </tr>

  <tr>

    <td style="padding:32px 40px; border-top:1px solid #e8e8e8;

               text-align:center; font-size:11px; color:#0a0a0a; opacity:0.4;

               letter-spacing:0.1em; text-transform:uppercase;">

      © 2025 TIRABOSCHI Paris · La Société

    </td>

  </tr>

</table>

Template 2 — Abandon panier (sans remise)

<!-- Objet : Votre sélection vous attend -->

<!-- Utiliser les variables Shopify Email natives pour checkout.abandoned_checkout_url -->

<table style="max-width:600px; margin:0 auto; font-family:'Georgia', serif;">

  <tr>

    <td style="padding:48px 40px 32px; text-align:center; border-bottom:1px solid #e8e8e8;">

      <img src="{{ shop.metafields.global.logo_noir_url }}"

           alt="TIRABOSCHI Paris" height="20">

    </td>

  </tr>

  <tr>

    <td style="padding:48px 40px 32px;">

      <h2 style="font-size:24px; font-weight:400; color:#0a0a0a; margin:0 0 24px;">

        Votre sélection vous attend

      </h2>

      <p style="font-size:14px; line-height:1.7; color:#0a0a0a; margin:0 0 32px;">

        Vous avez sélectionné une pièce TIRABOSCHI.

        Elle est façonnée à la main, en quantité limitée.

      </p>

      <!-- Produit abandonné (natif Shopify Email) -->

      {% for line in checkout.line_items %}

      <table style="width:100%; margin-bottom:16px;">

        <tr>

          <td style="width:80px;">

            <img src="{{ line.image | img_url: '160x' }}"

                 alt="{{ line.title }}" width="80"

                 style="display:block; width:80px;">

          </td>

          <td style="padding-left:16px; vertical-align:top;">

            <p style="font-size:13px; color:#0a0a0a; margin:0 0 4px;">

              {{ line.title }}

            </p>

            <p style="font-size:13px; color:#0a0a0a; opacity:0.5; margin:0;">

              {{ line.variant_title }}

            </p>

            <p style="font-size:13px; color:#0a0a0a; margin:8px 0 0;">

              {{ line.price | money }} EUR

            </p>

          </td>

        </tr>

      </table>

      {% endfor %}

      <a href="{{ checkout.abandoned_checkout_url }}"

         style="display:block; background:#0a0a0a; color:#ffffff;

                text-align:center; padding:16px; font-size:11px;

                letter-spacing:0.1em; text-transform:uppercase;

                text-decoration:none; margin-top:32px;">

        Reprendre ma commande

      </a>

    </td>

  </tr>

</table>

## 24.3 Newsletter — Popup custom (sans app)
### Liquid + JS — Popup plein écran style luxe
Fichier : snippets/tira-newsletter-popup.liquid

{% unless customer %}

<div class="tira-popup" id="tira-newsletter-popup" aria-modal="true" role="dialog" aria-label="Join the Society">

  <div class="tira-popup__overlay" id="tira-popup-overlay"></div>

  <div class="tira-popup__content">

    <button class="tira-popup__close" id="tira-popup-close" aria-label="Fermer">

      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">

        <line x1="1" y1="1" x2="15" y2="15" stroke="currentColor" stroke-width="1"/>

        <line x1="15" y1="1" x2="1" y2="15" stroke="currentColor" stroke-width="1"/>

      </svg>

    </button>

    <p class="tira-popup__kicker">La Société · TIRABOSCHI Paris</p>

    <h3 class="tira-popup__title">Join the Society</h3>

    <p class="tira-popup__text">

      Les coulisses de l'atelier, les nouvelles pièces en avant-première.

    </p>

    {% form 'customer', id: 'tira-popup-form' %}

      <input type="hidden" name="contact[tags]" value="newsletter-signup">

      <div class="tira-popup__field">

        <input

          type="email"

          name="contact[email]"

          id="tira-popup-email"

          placeholder="Adresse e-mail"

          autocomplete="email"

          required>

        <button type="submit" aria-label="S'inscrire">

          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">

            <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" stroke-width="1"/>

            <polyline points="12,4 18,10 12,16" fill="none" stroke="currentColor" stroke-width="1"/>

          </svg>

        </button>

      </div>

      <p class="tira-popup__rgpd">

        En vous inscrivant, vous acceptez notre

        <a href="/policies/privacy-policy">politique de confidentialité</a>.

      </p>

    {% endform %}

    <button class="tira-popup__skip" id="tira-popup-skip">

      Non merci

    </button>

  </div>

</div>

<style>

.tira-popup {

  position: fixed;

  inset: 0;

  z-index: 1000;

  display: flex;

  align-items: center;

  justify-content: center;

  opacity: 0;

  pointer-events: none;

  transition: opacity 0.4s ease;

}

.tira-popup.is-open {

  opacity: 1;

  pointer-events: auto;

}

.tira-popup__overlay {

  position: absolute;

  inset: 0;

  background: rgba(0,0,0,0.6);

  backdrop-filter: blur(2px);

}

.tira-popup__content {

  position: relative;

  z-index: 1;

  background: #ffffff;

  padding: 56px 48px;

  max-width: 480px;

  width: calc(100% - 40px);

  text-align: center;

}

.tira-popup__close {

  position: absolute;

  top: 20px;

  right: 20px;

  background: none;

  border: none;

  cursor: pointer;

  padding: 8px;

  color: #0a0a0a;

  opacity: 0.4;

}

.tira-popup__kicker {

  font-size: 11px;

  letter-spacing: 0.14em;

  text-transform: uppercase;

  opacity: 0.4;

  margin: 0 0 16px;

}

.tira-popup__title {

  font-size: 28px;

  font-weight: 400;

  margin: 0 0 16px;

  letter-spacing: -0.01em;

}

.tira-popup__text {

  font-size: 14px;

  line-height: 1.6;

  opacity: 0.7;

  margin: 0 0 32px;

}

.tira-popup__field {

  display: flex;

  align-items: center;

  border-bottom: 1px solid #0a0a0a;

  margin-bottom: 16px;

}

.tira-popup__field input {

  flex: 1;

  border: none;

  outline: none;

  background: transparent;

  font-family: inherit;

  font-size: 14px;

  padding: 8px 0;

}

.tira-popup__field button {

  background: none;

  border: none;

  cursor: pointer;

  padding: 8px 0 8px 16px;

  color: #0a0a0a;

}

.tira-popup__rgpd {

  font-size: 11px;

  opacity: 0.4;

  margin: 0 0 24px;

  line-height: 1.5;

}

.tira-popup__rgpd a { color: inherit; }

.tira-popup__skip {

  background: none;

  border: none;

  font-size: 11px;

  letter-spacing: 0.08em;

  opacity: 0.35;

  cursor: pointer;

  text-decoration: underline;

  text-underline-offset: 3px;

  font-family: inherit;

}

@media (max-width: 749px) {

  .tira-popup__content { padding: 40px 24px; }

  .tira-popup__title { font-size: 22px; }

}

</style>

<script>

(function() {

  var STORAGE_KEY = 'tira_popup_dismissed';

  var DELAY_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours

  // Ne pas afficher si déjà vu ou si client connecté

  if (localStorage.getItem(STORAGE_KEY)) return;

  var popup = document.getElementById('tira-newsletter-popup');

  var overlay = document.getElementById('tira-popup-overlay');

  var closeBtn = document.getElementById('tira-popup-close');

  var skipBtn = document.getElementById('tira-popup-skip');

  var form = document.getElementById('tira-popup-form');

  function openPopup() {

    popup.classList.add('is-open');

    document.body.style.overflow = 'hidden';

  }

  function closePopup() {

    popup.classList.remove('is-open');

    document.body.style.overflow = '';

    localStorage.setItem(STORAGE_KEY, Date.now() + DELAY_MS);

  }

  // Déclencheur : scroll à 60% de la page

  var triggered = false;

  window.addEventListener('scroll', function() {

    if (triggered) return;

    var scrollPct = window.scrollY / (document.body.scrollHeight - window.innerHeight);

    if (scrollPct >= 0.6) {

      triggered = true;

      setTimeout(openPopup, 500);

    }

  }, { passive: true });

  // Déclencheur : exit intent (desktop uniquement)

  if (!('ontouchstart' in window)) {

    document.addEventListener('mouseleave', function(e) {

      if (triggered || e.clientY > 50) return;

      triggered = true;

      openPopup();

    });

  }

  // Fermeture

  closeBtn.addEventListener('click', closePopup);

  skipBtn.addEventListener('click', closePopup);

  overlay.addEventListener('click', closePopup);

  document.addEventListener('keydown', function(e) {

    if (e.key === 'Escape') closePopup();

  });

  // Succès inscription

  form.addEventListener('submit', function() {

    setTimeout(function() {

      popup.querySelector('.tira-popup__content').innerHTML =

        '<p style="font-size:14px; padding:40px 0; opacity:0.7;">Merci. Vous faites partie de La Société.</p>';

      setTimeout(closePopup, 2500);

    }, 500);

  });

})();

</script>

{% endunless %}

À injecter dans layout/theme.liquid avant </body> :

{%- render 'tira-newsletter-popup' -%}

## 24.4 Page "La Société" — Template custom
Fichier : templates/page.la-societe.json Utilise une section custom sections/tira-la-societe.liquid

Ce que la page affiche selon le niveau du client connecté :

{% comment %} sections/tira-la-societe.liquid {% endcomment %}

{%- assign tier = customer.metafields.loyalty.tier -%}

{%- assign tier_since = customer.metafields.loyalty.tier_since -%}

{% if customer %}

  <div class="tira-societe">

    {%- comment %} En-tête statut {%- endcomment %}

    <header class="tira-societe__header">

      <p class="tira-societe__kicker">La Société · TIRABOSCHI Paris</p>

      <h1 class="tira-societe__name">{{ customer.first_name }} {{ customer.last_name }}</h1>

      <p class="tira-societe__tier">

        {% case tier %}

          {% when 'member'  %}Cercle I — Membre

          {% when 'artisan' %}Cercle II — Artisan

          {% when 'maison'  %}Cercle III — Maison

        {% endcase %}

      </p>

      {% if tier_since %}

        <p class="tira-societe__since">

          Membre depuis {{ tier_since | date: "%B %Y" }}

        </p>

      {% endif %}

    </header>

    {%- comment %} Avantages du niveau actuel {%- endcomment %}

    <section class="tira-societe__benefits">

      <h2 class="tira-societe__section-title">Vos privilèges</h2>

      <ul class="tira-societe__list">

        <li>Livraison prioritaire (48h)</li>

        <li>Guide d'entretien exclusif</li>

        <li>Accès en avant-première aux nouvelles collections</li>

        <li>Emballage cadeau inclus</li>

        {% if tier == 'artisan' or tier == 'maison' %}

          <li>Carte de membre TIRABOSCHI</li>

          <li>Accès aux éditions limitées</li>

          <li>Invitation à la visite d'atelier annuelle (Paris)</li>

          <li>Sur mesure en délai réduit (4 semaines)</li>

        {% endif %}

        {% if tier == 'maison' %}

          <li>Relation directe avec la fondatrice</li>

          <li>Pièce exclusive réservée annuellement</li>

          <li>Invitation au lancement de collection (Paris)</li>

        {% endif %}

      </ul>

    </section>

    {%- comment %} Historique commandes {%- endcomment %}

    <section class="tira-societe__history">

      <h2 class="tira-societe__section-title">Vos pièces</h2>

      {% paginate customer.orders by 6 %}

        <div class="tira-societe__orders">

          {% for order in customer.orders %}

            <div class="tira-societe__order">

              {% for line_item in order.line_items %}

                {% if line_item.image %}

                  <img src="{{ line_item.image | img_url: '400x' }}"

                       alt="{{ line_item.title }}"

                       loading="lazy">

                {% endif %}

                <p class="tira-societe__order-title">{{ line_item.title }}</p>

                <p class="tira-societe__order-date">

                  {{ order.created_at | date: "%d %B %Y" }}

                </p>

              {% endfor %}

            </div>

          {% endfor %}

        </div>

      {% endpaginate %}

    </section>

  </div>

{% else %}

  {%- comment %} Client non connecté {%- endcomment %}

  <div class="tira-societe tira-societe--locked">

    <p class="tira-societe__kicker">La Société · TIRABOSCHI Paris</p>

    <h1>Un cercle restreint</h1>

    <p>La Société est réservée aux clients TIRABOSCHI.</p>

    <a href="/account/login" class="tira-cta">Se connecter</a>

  </div>

{% endif %}

## 24.5 Chat support — Shopify Inbox (gratuit)
Pourquoi Shopify Inbox plutôt qu'une app tierce :

Gratuit, intégré nativement
Fonctionne sur mobile et desktop
Répond automatiquement aux questions fréquentes (stock, livraison)
Notifications push sur mobile pour le marchand
Intégré au compte client et aux commandes

Configuration recommandée :

Widget bulle en bas à droite, fond noir #0a0a0a
Message de bienvenue : "Bonjour, nous sommes disponibles pour vous aider. Réponse garantie sous 24h."
Questions fréquentes configurées :
"Délai de livraison" → "3–5 jours ouvrés en France"
"Sur mesure" → "Délai 6–8 semaines. Contactez-nous pour une consultation."
"Retours" → "Retours acceptés sous 14 jours. Contactez-nous."
Masquer automatiquement sur mobile au scroll (via CSS override)

/* Masquer Shopify Inbox au scroll sur mobile */

@media (max-width: 749px) {

  .shopify-chat-button {

    transition: opacity 0.3s ease, transform 0.3s ease;

  }

  .shopify-chat-button.is-scrolling {

    opacity: 0;

    pointer-events: none;

    transform: translateY(20px);

  }

}

// Dans tiraboschi.js — masquer le chat au scroll mobile

let lastScroll = 0;

const chatBtn = document.querySelector('.shopify-chat-button');

window.addEventListener('scroll', () => {

  if (!chatBtn) return;

  if (window.innerWidth > 749) return;

  const scrollY = window.scrollY;

  if (scrollY > lastScroll + 50) {

    chatBtn.classList.add('is-scrolling');

  } else if (scrollY < lastScroll - 50) {

    chatBtn.classList.remove('is-scrolling');

  }

  lastScroll = scrollY;

}, { passive: true });

## 24.6 Retour en stock — Custom sans app
Fichier : snippets/tira-back-in-stock.liquid

{% comment %}

  À inclure dans la fiche produit, affiché sur les variantes épuisées.

  Utilise un formulaire customer natif Shopify.

{% endcomment %}

<div class="tira-back-in-stock" id="tira-bis-{{ variant.id }}"

     {% unless variant.available %}style="display:block"{% endunless %}

     style="display:none;">

  <p class="tira-bis__label">Cette variante est épuisée.</p>

  {% form 'customer', id: 'tira-bis-form-{{ variant.id }}' %}

    <input type="hidden" name="contact[tags]"

           value="back-in-stock,product-{{ product.handle }},variant-{{ variant.id }}">

    <input type="hidden" name="contact[note]"

           value="Alerte retour stock — {{ product.title }} — {{ variant.title }}">

    <div class="tira-bis__field">

      <input type="email" name="contact[email]"

             placeholder="Votre adresse e-mail"

             autocomplete="email" required>

      <button type="submit" class="tira-cta">M'avertir</button>

    </div>

  {% endform %}

  <p class="tira-bis__confirm" style="display:none;">

    Vous serez informé(e) dès le retour en stock.

  </p>

</div>

<script>

document.getElementById('tira-bis-form-{{ variant.id }}')

  .addEventListener('submit', function(e) {

    e.preventDefault();

    // Soumettre via fetch

    fetch('/contact', {

      method: 'POST',

      body: new FormData(this)

    }).then(() => {

      this.style.display = 'none';

      this.nextElementSibling.style.display = 'block';

    });

  });

</script>

Flow Shopify pour les alertes retour en stock :

Déclencheur : Inventory level updated (variante passe de 0 à > 0)

Action      : Envoyer email aux clients ayant le tag "variant-[ID]"

              via Shopify Email template dédié

## 24.7 Avis clients — Custom sans app
Métafields produit pour stocker les avis :

Namespace : reviews

Clé           Type      Description

─────────────────────────────────────

average       decimal   Note moyenne

count         integer   Nombre d'avis

list          json      Array des avis [{author, rating, text, date}]

Snippet d'affichage : snippets/tira-reviews.liquid

{%- assign reviews = product.metafields.reviews.list.value -%}

{%- assign avg = product.metafields.reviews.average -%}

{%- assign count = product.metafields.reviews.count -%}

{% if reviews and reviews.size > 0 %}

<section class="tira-reviews">

  <h3 class="tira-reviews__title">

    Ce qu'ils disent — {{ avg }}/5 ({{ count }} avis)

  </h3>

  <div class="tira-reviews__list">

    {% for review in reviews %}

    <div class="tira-reviews__item" data-tira-reveal>

      <div class="tira-reviews__stars">

        {% for i in (1..5) %}

          <span {% if i <= review.rating %}class="filled"{% endif %}>★</span>

        {% endfor %}

      </div>

      <p class="tira-reviews__text">{{ review.text }}</p>

      <p class="tira-reviews__author">

        {{ review.author }} · {{ review.date | date: "%B %Y" }}

      </p>

    </div>

    {% endfor %}

  </div>

</section>

{% endif %}

Collecte des avis : via le Flow post-achat J+30 — lien vers un formulaire Google Forms ou Typeform. Les réponses sont copiées manuellement dans les métafields (ou via un webhook pour automatiser).

## 24.8 Segmentation Shopify native
Segments à créer dans Shopify Admin > Clients > Segments :

Segment : "Prospects chauds"

  Critère : has visited product page (Shopify Pixel — déclenché côté Liquid)

  Usage   : ciblage Shopify Email

Segment : "La Société — Membres"

  Critère : customer_tags CONTAINS 'loyalty-member'

  Usage   : emails early access + communications La Société

Segment : "La Société — Artisans"

  Critère : customer_tags CONTAINS 'loyalty-artisan'

  Usage   : invitations visite atelier

Segment : "La Société — Maison"

  Critère : customer_tags CONTAINS 'loyalty-maison'

  Usage   : communications ultra-personnalisées

Segment : "Clients actifs"

  Critère : orders_count >= 1 AND last_order_date >= -180d

  Usage   : newsletter générale

Segment : "Clients dormants"

  Critère : orders_count >= 1 AND last_order_date < -180d

  Usage   : flow win-back

Segment : "Newsletter seulement"

  Critère : customer_tags CONTAINS 'newsletter-signup'

            AND orders_count == 0

  Usage   : nurturing éditorial

## 24.9 Récapitulatif — Ce qu'on économise en custom
App remplacée
Prix mensuel
Remplacement custom
Klaviyo
45–150€
Shopify Email + Flow (gratuit)
Loyoly / Smile.io
49–99€
Metafields + Flow + Liquid (gratuit)
Privy / Klaviyo Forms
30–50€
Snippet JS custom (gratuit)
Judge.me
15€
Metafields + snippet Liquid (gratuit)
Tidio / Gorgias
20–60€
Shopify Inbox (gratuit)
Total
159–374€/mois
0€/mois

Investissement initial : quelques heures de développement (Claude Code). Économie annuelle : 1 900–4 500€.

Section 24 ajoutée — Triggers, CRM & Fidélité 100% custom — Mai 2025
