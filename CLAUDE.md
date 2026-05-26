# TIRABOSCHI Paris — Instructions Claude Code
Lis ce fichier intégralement avant de commencer. Il contient tout ce dont tu as besoin. Document de référence complet : TIRABOSCHI_cahier_des_charges_complet.md

## SETUP INITIAL — Une seule fois
# 1. Installer Shopify CLI

npm install -g @shopify/cli @shopify/theme

# 2. S'authentifier

shopify auth login --store tiraboschi-paris.myshopify.com

# 3. Créer le dossier projet et se placer dedans

mkdir tiraboschi && cd tiraboschi

# Copier CLAUDE.md et TIRABOSCHI_cahier_des_charges_complet.md ici

# 4. Puller le thème de test UNIQUEMENT

shopify theme pull \

  --store tiraboschi-paris.myshopify.com \

  --theme-id 183983931735

# 5. Lancer le serveur de dev local

shopify theme dev \

  --store tiraboschi-paris.myshopify.com \

  --theme-id 183983931735

# → http://127.0.0.1:9292 pour prévisualiser

## WORKFLOW QUOTIDIEN
# Pusher tous les changements

shopify theme push \

  --store tiraboschi-paris.myshopify.com \

  --theme-id 183983931735

# Pusher un fichier précis (plus rapide)

shopify theme push \

  --store tiraboschi-paris.myshopify.com \

  --theme-id 183983931735 \

  --only assets/tiraboschi.css

# Vérifier les erreurs Liquid

shopify theme check

# Voir tous les thèmes

shopify theme list --store tiraboschi-paris.myshopify.com

## RÈGLE ABSOLUE — NE JAMAIS OUBLIER
THÈME LIVE    → ID 187554070871 (Phantom)  ← NE JAMAIS TOUCHER

THÈME DE TEST → ID 183983931735 (Horizon)  ← Travailler ICI uniquement

## CONTEXTE PROJET
Marque : TIRABOSCHI Paris — maroquinerie luxe française, fondée 1904
URL : tiraboschi-paris.myshopify.com
Thème : Horizon v2.1.2
Référence UX : miumiu.com (structure/animations) + tagheuer.com (contenu fiche produit)
Trafic : majoritairement mobile → coder mobile first

## CHARTE GRAPHIQUE — RÈGLES ABSOLUES
--tira-black: #0a0a0a;

--tira-white: #ffffff;

--tira-grey:  #f7f5f2;

--tira-border: #e8e8e8;

--tira-ease: cubic-bezier(0.16, 1, 0.3, 1);

--tira-duration: 0.9s;

Règle
Valeur
Border-radius
0px — partout, toujours
Police
Playfair Display Regular 400 — aucune autre
Boutons
Texte souligné uppercase — PAS de boîte
Bordures
1px solid — jamais plus
Icônes
stroke thin 22px — jamais filled
Gap grille collection
2–4px (style Miu Miu)

## FICHIERS CUSTOM (à modifier librement)
assets/tiraboschi.css          ← CSS global (tokens, animations, layouts)

assets/tiraboschi.js           ← JS (scroll reveals, marquee, curseur, lazy video)

assets/tiraboschi-header.css   ← CSS header mobile override Horizon

snippets/icon-bag-tiraboschi.liquid  ← SVG picto panier forme V

snippets/header-actions.liquid       ← Actions header (panier/compte)

snippets/tiraboschi-homepage-stack.liquid ← CSS scroll stack

layout/theme.liquid            ← Injecte tiraboschi.css + tiraboschi.js

sections/header-group.json     ← Config header

sections/footer-group.json     ← Config footer

templates/*.json               ← Templates pages
## Fichiers à NE JAMAIS modifier
assets/base.css

assets/theme.js

snippets/stylesheets.liquid

snippets/scripts.liquid

config/settings_schema.json

## ASSETS DISPONIBLES SUR SHOPIFY
# Logos

shopify://shop_images/Logo_-_since_1904_-_vrai_noir.png    # noir

shopify://shop_images/Logo_-_since_1904_-_vrai_blanc.png   # blanc

shopify://shop_images/Favicon_T_32x32_-_noir.png           # favicon

# Photos

shopify://shop_images/28092025-DSCF1828.jpg   # héro héritage

shopify://shop_images/BOSCHI0919.jpg           # savoir-faire

shopify://shop_images/BOSCHI0154.jpg           # atelier

# Vidéos

shopify://files/videos/VIDEO HOMEPAGE.mp4                                          # 16:9

shopify://files/videos/TEST 9-16 Boschi 1_9407c299-0931-484a-a780-b09d560f2734.mp4 # 9:16 mobile

shopify://files/videos/VIDEO SAC DUO COLETTE VICTOIRE.mp4  # Victoire

shopify://files/videos/TEST 16 9_4.mp4                     # Colette

## CONTENU SHOPIFY — HANDLES
### Produits
rafael · victoire · colette · colette-mini · jane · olympe · pochon · chaine · anse-en-cuir
### Collections
fw25 · sacs · petite-maroquinerie · iconiques · sur-mesure-exotiques
### Menus
main-menu · footer-collections · footer-maison · footer
### Pages
histoire · savoir-faire · matieres-cuirs · a-propos · sur-mesure · contact · prendrez-rendez-vous
### Blog
latelier  (3 articles : couture-sellier, guide-cuirs-maroquinerie-luxe, pourquoi-sac-made-in-france-prix)
### Métafields produits
custom.composition   → cuir, matière, couleurs

custom.fabrication   → artisan, lieu, durée
### Color schemes
scheme-1    → fond blanc, texte noir

scheme-2    → fond crème #f7f5f2, texte noir

scheme-3    → fond noir, texte blanc

scheme-6    → transparent (héros + header)

scheme-31f09ca3-1031-4740-a2fb-9e46aea899cb → blanc opaque (header/footer)

## ÉTAT D'AVANCEMENT
### ✅ Fait
CSS global + tokens (assets/tiraboschi.css)
JS animations (assets/tiraboschi.js)
Layout theme.liquid (injection CSS/JS)
Homepage 7 sections (templates/index.json)
Header (sections/header-group.json)
Footer (sections/footer-group.json)
Color schemes (config/settings_data.json)
Picto panier SVG custom (snippets/icon-bag-tiraboschi.liquid)
Scroll stack CSS (snippets/tiraboschi-homepage-stack.liquid)
### 🔲 À FAIRE — dans cet ordre exact
PRIORITÉ 1 — Template collection
Fichiers à créer/modifier :

  templates/collection.json

  assets/tiraboschi-collection.css

Structure attendue :

  1. Hero 100vh — image collection, titre H1 blanc bas gauche

  2. Filtres sticky (matière, couleur, prix, tri)

  3. Intro texte éditorial (description collection, centré, 14px)

  4. Grille 4 cols desktop / 2 mobile / gap 2–4px

  5. Break éditorial après 6 produits

  6. Suite grille

Specs hero :

  - height: 100vh

  - object-fit: cover

  - overlay: linear-gradient(to top, rgba(0,0,0,0.45), transparent 60%)

  - H1 : position absolute, bottom: 48px, left: 48px

Specs filtres :

  - position: sticky; top: var(--header-height)

  - background: white

  - border-bottom: 1px solid #e8e8e8

  - Mobile : bouton FILTRER → bottom sheet

Specs cards :

  - ratio 3:4 strict

  - hover : crossfade 2ème image (400ms) + bouton ATC

  - ❤️ wishlist au survol coin sup. droit
PRIORITÉ 2 — Fiche produit
Fichiers à créer/modifier :

  templates/product.json

  sections/product-tiraboschi.liquid (section custom)

  assets/tiraboschi-product.css

PARTIE 1 — ACHAT (above the fold) :

  Desktop 2 cols :

    Gauche 55% : galerie sticky

      - Strip thumbnails verticaux 60×80px

      - Image principale ratio 3:4

      - Zoom loupe au survol (zone 3x, coin bas-droit)

      - Clic → lightbox plein écran

    Droite 45% : infos

      - Breadcrumb 12px opacity 40%

      - H1 nom produit

      - Prix "X EUR"

      - Sélecteur matière (boutons texte, underline sélection)

      - Sélecteur couleur (chips 24px, vraie couleur, tooltip nom)

      - Sélecteur option

      - Dimensions H×L×P

      - Bouton ATC pleine largeur noir

      - Wishlist ❤️

      - Livraison + Retours

  Mobile :

    - Carousel swipe full-width

    - Sticky ATC : position:fixed; bottom:0; prix + bouton

  Desktop mini header :

    - Apparaît après 300px scroll

    - Nom + prix + ATC compact

PARTIE 2 — STORYTELLING (6 sections, scroll reveal) :

  1. Savoir-Faire : photo atelier + temps artisan + technique spécifique

  2. La Matière : photo macro + description depuis métafield custom.composition

  3. Dimensions & Détails : tableau finitions + dimensions exactes

  4. L'Atelier : vidéo ou photos fabrication + citation artisan

  5. Entretien : 4 conseils + CTA PDF

  6. Sur Mesure : si tag 'sur-mesure' → options + CTA RDV

  7. Vous aimerez aussi : 4 produits carousel
PRIORITÉ 3 — Pages éditoriales
templates/page.histoire.json

  - Hero + timeline 1904→2025 + sections alternées

templates/page.savoir-faire.json

  - Hero + tableau temps par pièce + sections techniques

templates/page.matieres-cuirs.json

  - Hero + guide 5 cuirs + tableau comparatif

templates/page.sur-mesure.json

  - Hero + process 4 étapes + CTA RDV
PRIORITÉ 4 — Blog
templates/blog.json     → grille 3 cols

templates/article.json  → hero + corps 720px centré + pull quotes
PRIORITÉ 5 — Utilitaires
templates/404.json          → image éditoriale + message branded + CTA

templates/search.json       → grille cohérente avec collection
PRIORITÉ 6 — Finitions
- Tests mobile iOS Safari + Android Chrome

- Accessibilité (focus, ARIA, contraste AA)

- Performance (LCP < 2.5s, lazy loading)

- SEO (JSON-LD, meta descriptions, alt texts)

- Checklist non-régression complète (voir section MAINTIEN ci-dessous)

## ANIMATIONS — CODE EXACT
### Scroll reveals — utiliser l'attribut HTML
<div data-tira-reveal>...</div>

<!-- Le JS tiraboschi.js s'occupe du reste -->
### Marquee
<div class="tira-marquee" aria-hidden="true">

  <div class="tira-marquee__track">

    <span class="tira-marquee__item">Made in France, Only.</span>

    <span class="tira-marquee__item">·</span>

    <span class="tira-marquee__item">Since 1904</span>

    <span class="tira-marquee__item">·</span>

    <span class="tira-marquee__item">Maroquinerie de Luxe</span>

    <span class="tira-marquee__item">·</span>

    <span class="tira-marquee__item">Paris</span>

    <span class="tira-marquee__item">·</span>

    <!-- répéter 2x minimum pour le loop seamless -->

  </div>

</div>
### Ken Burns (images fixes uniquement)
<div class="tira-ken-burns">

  <img src="..." alt="...">

</div>
### Lazy video
<video

  data-tira-lazy

  data-src="shopify://files/videos/VIDEO HOMEPAGE.mp4"

  autoplay loop muted playsinline>

</video>
### Sticky ATC mobile
<div class="tira-sticky-atc">

  <span class="tira-sticky-atc__price">3 700,00 EUR</span>

  <button class="tira-sticky-atc__btn" type="submit">Ajouter au panier</button>

</div>

## MAINTIEN DU STYLE EN PRODUCTION
### Checklist avant tout push live
Visuel :

Header transparent sur homepage (logo blanc sur vidéo)
Header opaque sur les autres pages (logo noir sur fond blanc)
Sticky header fonctionne
Picto panier = SVG forme V (pas l'icône Shopify générique)
Marquee défile sur homepage
Scroll stack fonctionne (sections se superposent)
Ken Burns actif sur DSCF1828 et BOSCHI0919
Police Playfair Display sur toutes les pages
Border-radius 0px partout
Boutons = texte souligné (pas de boîte rectangulaire)
Footer complet + newsletter fonctionnelle
Pas de "Powered by Shopify"

Fonctionnel :

ATC fonctionne sur toutes les fiches produit
Panier drawer s'ouvre avec les articles
Checkout accessible
Search trouve les produits
Menus navigation complets
Pages éditoriales accessibles

Mobile iOS Safari + Android Chrome :

Header : logo gauche, icônes droite
Vidéos hero lisent (autoplay muted)
Carousel galerie swipeable
Sticky ATC visible
Filtres collection accessibles
Footer accordéon fonctionne
### Processus de mise en production
# 1. Travailler sur Horizon (ID 183983931735)

# 2. Tester en local : shopify theme dev

# 3. Valider la checklist ci-dessus

# 4. Faire valider visuellement par le client

# 5. Publier Horizon en remplacement de Phantom

#    (garder Phantom comme backup — NE PAS supprimer)

## PARTICULARITÉS HORIZON À CONNAÎTRE
sections JSON         → schéma strict, block types doivent exister dans le .liquid

color_scheme          → doit référencer un scheme dans config/settings_data.json

header                → dans sections/header-group.json (pas header.liquid)

grille header mobile  → câblée "leftA leftB center rightA rightB"

                        → overrider avec CSS grid-area

custom-liquid         → type section pour HTML custom (marquee, etc.)

_product-card         → type bloc privé Horizon

footer-utilities      → bloc spécial copyright + policy links

search_row: "bottom"  → search sous le header (natif Horizon)

enable_transparent_header_home: true → transparent sur homepage

## EN CAS DE DOUTE
Consulter TIRABOSCHI_cahier_des_charges_complet.md pour les specs détaillées
Référence visuelle : ouvrir miumiu.com et tagheuer.com
Ne pas improviser — si une spec est manquante, implémenter de façon neutre et laisser <!-- TODO: valider avec client -->
Toujours tester sur mobile avant de considérer une tâche terminée

CLAUDE.md v2.0 — TIRABOSCHI Paris — Mai 2025

## EXPÉRIENCES IMMERSIVES À IMPLÉMENTER
### Parallax sur sections éditoriales
// Mettre à jour --scroll-progress via scroll event

// Sur .tira-ken-burns uniquement

window.addEventListener('scroll', () => {

  document.querySelectorAll('.tira-parallax').forEach(el => {

    const rect = el.getBoundingClientRect();

    const progress = 1 - (rect.bottom / (rect.height + window.innerHeight));

    el.style.setProperty('--scroll-progress', progress);

  });

}, { passive: true });

.tira-parallax img {

  transform: translateY(calc(var(--scroll-progress, 0) * -15%));

  transition: transform 0.1s linear;

}
### Révélation de texte mot par mot
// Splitter les H2 en spans par mot

document.querySelectorAll('[data-tira-word-reveal]').forEach(el => {

  el.innerHTML = el.textContent.split(' ')

    .map((w, i) => `<span style="--i:${i}">${w}</span>`).join(' ');

});

[data-tira-word-reveal] span {

  opacity: 0;

  transform: translateY(8px);

  transition: opacity 0.5s var(--tira-ease) calc(var(--i) * 60ms),

              transform 0.5s var(--tira-ease) calc(var(--i) * 60ms);

}

[data-tira-word-reveal].is-visible span {

  opacity: 1; transform: none;

}
### Micro-animation logo (chargement)
.tira-logo-draw path {

  stroke-dasharray: 1000;

  stroke-dashoffset: 1000;

  animation: tira-draw 0.6s var(--tira-ease) forwards;

}

@keyframes tira-draw {

  to { stroke-dashoffset: 0; }

}

## TRIGGERS & CRM — INTÉGRATION SHOPIFY
### Klaviyo — Tags à appliquer automatiquement
Via Shopify Flow ou manuellement dans Klaviyo :

Segments :

  - 'prospect-chaud' : visite fiche produit 2x+ sans achat (Klaviyo tracking)

  - 'premier-acheteur' : 1 commande, < 30 jours

  - 'client-fidele' : 2+ commandes OU total > 5000€

  - 'societe-membre' : 1er achat (Cercle I)

  - 'societe-artisan' : 2+ achats OU total > 5000€ (Cercle II)

  - 'societe-maison' : sur invitation, total > 15000€ (Cercle III)
### Métafields client pour La Société
customer.loyalty_tier : "member" | "artisan" | "maison"

customer.loyalty_since : date ISO

customer.loyalty_notes : texte libre (pour le Cercle Maison)
### Flows Klaviyo prioritaires (dans l'ordre)
1. Bienvenue newsletter (3 emails : J0, J3, J7)

2. Abandon panier (2 emails : 1h, 24h — PAS de remise)

3. Post-achat (4 emails : J0, J2, J7, J30)

4. Retour en stock (1 email immédiat)

5. Bienvenue La Société (1 email — après 1er achat)

6. Win-back 6 mois (2 emails)

## PROGRAMME FIDÉLITÉ — LA SOCIÉTÉ
### Règles absolues
❌ JAMAIS : points, remises, bons, pourcentages, barres de progression

✓ TOUJOURS : privilèges, accès, reconnaissance, expériences

✓ LANGAGE : "La Société", "vos privilèges", jamais "programme fidélité"
### Niveaux
Cercle I  — Membre  : dès le 1er achat

Cercle II — Artisan : 2ème achat ou > 5 000€ cumulés

Cercle III — Maison : sur invitation, > 15 000€ ou relation exceptionnelle
### Avantages par niveau (résumé)
Membre  : livraison prioritaire, guide entretien, early access, packaging cadeau

Artisan : + carte membre physique, éditions limitées, visite atelier annuelle

Maison  : + relation directe fondatrice, pièce exclusive annuelle, invitation lancement
### Outil recommandé
Loyoly (loyoly.io) — made in France, orienté luxe, intégration Shopify + Klaviyo

Alternative : Customer metafields + Shopify Flow (dev custom)

## CHECKLIST ANTI-RÉGRESSION — RÉSUMÉ RAPIDE
Avant tout push, vérifier :

□ Vidéo hero charge + lit (mobile + desktop)

□ Marquee défile correctement

□ Scroll stack fonctionne

□ Logo : gauche + blanc sur transparent / noir sur opaque

□ Picto panier = SVG forme V

□ Search bar : sous le header, transparente, trait bas

□ Fiche produit : galerie sticky + ATC fonctionne

□ Sticky ATC visible sur mobile

□ Footer complet, newsletter fonctionne

□ 0px border-radius partout

□ Playfair Display chargée

□ Pas d'erreurs console

□ Pas de "Powered by Shopify"

Checklist complète : voir Partie 23 du cahier des charges.

## CRM & FIDÉLITÉ — IMPLÉMENTATION 100% CUSTOM
### Fichiers à créer (dans l'ordre)
ÉTAPE 1 — Métafields (à créer dans Shopify Admin)

  Client > loyalty.tier (string)

  Client > loyalty.tier_since (date)

  Client > loyalty.order_count (integer)

  Produit > reviews.average (decimal)

  Produit > reviews.count (integer)

  Produit > reviews.list (json)

ÉTAPE 2 — Snippets

  snippets/tira-newsletter-popup.liquid   ← Popup newsletter custom

  snippets/tira-back-in-stock.liquid      ← Alerte retour stock

  snippets/tira-reviews.liquid            ← Affichage avis

ÉTAPE 3 — Templates

  templates/page.la-societe.json          ← Page La Société

  sections/tira-la-societe.liquid         ← Section La Société

ÉTAPE 4 — Shopify Flow (configurer dans Admin > Flow)

  Flow 1 : Order created → tag loyalty-member (1er achat)

  Flow 2 : Tag added loyalty-pending → email bienvenue (J+7)

  Flow 3 : Order paid → tag loyalty-artisan (2ème achat / >5000€)

  Flow 4 : Checkout created → email abandon panier (1h + 24h)

  Flow 5 : Order fulfilled → emails post-achat (J+7, J+30)

  Flow 6 : Last order > 180 jours → email win-back

ÉTAPE 5 — Injecter dans layout/theme.liquid

  {%- render 'tira-newsletter-popup' -%}  avant </body>
### Règles fidélité — Résumé pour les Flows
Cercle I  (member)  : 1er achat → auto

Cercle II (artisan) : 2ème achat OU total > 5 000€ → auto

Cercle III (maison) : manuel uniquement → tag ajouté par l'admin
### Tags client à utiliser dans les Flows
loyalty-member      → Cercle I actif

loyalty-artisan     → Cercle II actif

loyalty-maison      → Cercle III actif

loyalty-pending     → Email bienvenue à envoyer

newsletter-signup   → Inscrit newsletter

back-in-stock       → Alerte retour stock demandée

variant-[ID]        → Variante spécifique demandée

win-back-sent       → Email win-back envoyé
### Shopify Email — Templates à créer
1. Bienvenue La Société (Cercle I)      → voir Partie 24.2

2. Bienvenue Cercle Artisan (Cercle II) → adapter template 1

3. Abandon panier (sans remise)         → voir Partie 24.2

4. Post-achat J+7 (guide entretien)     → template éditorial

5. Post-achat J+30 (demande avis)       → template court

6. Win-back (6 mois)                    → template éditorial

7. Retour en stock                      → template produit
### Shopify Inbox — Configurer
Widget : fond #0a0a0a, position bas-droit

Message bienvenue : "Bonjour, nous sommes disponibles. Réponse sous 24h."

FAQ auto :

  "livraison" → "3–5 jours ouvrés en France"

  "sur mesure" → "Délai 6–8 semaines. Contactez-nous."

  "retour" → "Retours sous 14 jours. Contactez-nous."

CSS override : masquer au scroll mobile (voir Partie 24.5)
### Économie vs apps tierces : 1 900–4 500€/an
