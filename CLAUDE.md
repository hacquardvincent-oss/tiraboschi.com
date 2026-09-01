# TIRABOSCHI Paris — Instructions Claude Code v5.0
> Document de travail principal. Lu automatiquement à chaque session.
> Référence détaillée complète : `TIRABOSCHI_cahier_des_charges_complet.md`
> Roadmap stratégique : `ROADMAP.md`
> Suivi des validations : `VALIDATION.md`

---

## 🚨 WORKFLOW OBLIGATOIRE — LIRE EN PREMIER À CHAQUE SESSION

### Déploiement : GitHub UNIQUEMENT — jamais de Shopify CLI direct
- **Thème actuel** : `tiraboschibespoke` (ID 199706411351) — thème Bespoke custom, **pas Horizon**
- Toutes les modifications passent par `git commit + push` → auto-sync GitHub → Shopify
- Ne jamais utiliser `shopify theme push`, `shopify theme dev`, ni modifier les fichiers depuis Shopify CLI

### Branches git
```
Branche de dev   : claude/clever-archimedes-h8OmL  (prototypes HTML, docs)
Branche déployée : shopify-deploy  (auto-sync Shopify)
Branche locale   : shopify-deploy-local  → pousse vers origin/shopify-deploy
```
**Commande de push à utiliser :**
```bash
git push origin shopify-deploy-local:shopify-deploy
```
Si rejeté (non fast-forward) : `git fetch origin shopify-deploy` puis réessayer.

### Règle de mise à jour de ce fichier
**À chaque fin de session significative** : mettre à jour la section "ÉTAT D'AVANCEMENT" ci-dessous, committer et pousser CLAUDE.md. C'est ce fichier qui garantit la continuité entre sessions.

---

## ⛔ RÈGLE ABSOLUE — NE JAMAIS OUBLIER

```
THÈME LIVE    → ID 187554070871 (Phantom)       ← NE JAMAIS TOUCHER
THÈME DE TEST → ID 199706411351 (tiraboschibespoke) ← Travailler ICI uniquement
```

### 📍 Où vit le code — source de vérité unique

```
Branche de travail : shopify-deploy-local  →  push vers origin/shopify-deploy
Emplacement du thème : LA RACINE du dépôt (assets/ sections/ snippets/ templates/ layout/)
```

**Une seule copie du thème existe.** Le dossier `shopify-theme-tiraboschi/` a été
supprimé le 31/07/2026 : c'était un doublon désynchronisé (26 fichiers divergents)
qui a fait auditer et corriger du code mort. Ne jamais le recréer.

`shopify-theme/` = export Horizon d'origine, référence en lecture seule uniquement.

**Avant toute modification** : vérifier `git branch --show-current` et l'existence
de `sections/` à la racine. Si `sections/` n'est pas à la racine, la mauvaise
branche est active :
```bash
git fetch origin && git checkout -B shopify-deploy-local origin/shopify-deploy
```

---

## SETUP SHOPIFY CLI (référence uniquement — non utilisé)

```bash
# Authentification
shopify auth login --store tiraboschi-paris.myshopify.com

# Pull thème de test
shopify theme pull \
  --store tiraboschi-paris.myshopify.com \
  --theme-id 183983931735

# Dev local → http://127.0.0.1:9292
shopify theme dev \
  --store tiraboschi-paris.myshopify.com \
  --theme-id 183983931735

# Push tout
shopify theme push \
  --store tiraboschi-paris.myshopify.com \
  --theme-id 183983931735

# Push un fichier précis
shopify theme push \
  --store tiraboschi-paris.myshopify.com \
  --theme-id 183983931735 \
  --only assets/tiraboschi.css

# Vérifier les erreurs Liquid
shopify theme check

# Lister les thèmes
shopify theme list --store tiraboschi-paris.myshopify.com
```

---

## CONTEXTE PROJET

| Champ | Valeur |
|---|---|
| Marque | TIRABOSCHI Paris — maroquinerie luxe française |
| Fondée | 1904 |
| Tagline | "Made in France, Only. · Since 1904" |
| URL | tiraboschi-paris.myshopify.com |
| Instagram | @boschi_paris |
| Thème | Horizon v2.1.2 |
| Cible | Femmes 28–55 ans, CSP++, trafic ~70% mobile |
| Signature | Forme en V — logo, sacs, picto panier |

**Références UX (benchmark 5 grandes maisons) :**
- **Miu Miu** → structure globale, header, animations, scroll stack, collection, marquee, curseur custom
- **Louis Vuitton** → page transitions, mega-menu éditorial, pages Icônes modèles, video scrub
- **Tag Heuer** → storytelling fiche produit, tableau specs, sections craft immersives, stats animées
- **Audemars Piguet** → splash screen, scroll-driven animations, pages heritage profondes
- **Hermès** → sobriété éditoriale, pages matières, engagement RSE, réparation à vie
- **Jacquemus** → cards produit minimalistes, espacement
- **The Row** → sobriété typographique, pages éditoriales

---

## CHARTE GRAPHIQUE — RÈGLES ABSOLUES

### Couleurs
```css
--tira-black:  #0a0a0a;   /* textes, boutons, fond dark */
--tira-white:  #ffffff;   /* fond principal */
--tira-grey:   #f7f5f2;   /* fond sections alternées */
--tira-border: #e8e8e8;   /* séparateurs */
--tira-ease:   cubic-bezier(0.16, 1, 0.3, 1);
--tira-duration: 0.9s;
```

### Typographie — Playfair Display 400 UNIQUEMENT
| Élément | Desktop | Mobile |
|---|---|---|
| H1 hero | 88–100px | 48–64px |
| H1 page | 56px | 36px |
| H2 | 48px | 32px |
| H3 | 32px | 24px |
| Body | 14px | 14px |
| Caption / boutons | 11px | 11px |

- Letter-spacing H1 : `-0.01em`
- Letter-spacing boutons/captions : `0.1–0.15em`
- Text-transform : `uppercase` sur boutons/captions
- Italic autorisé pour citations et noms de campagne uniquement

### Règles design
| Règle | Valeur |
|---|---|
| Border-radius | **0px** — partout, toujours, sans exception |
| Bordures | 1px solid — jamais plus |
| Icônes | stroke thin 22px — jamais filled |
| Boutons | texte souligné uppercase — PAS de boîte rectangulaire |
| **Exception bouton** | CTA principal précommande ("Réserver ma pièce") → box 1px border autorisée |
| Gap grille collection | 2–4px (style Miu Miu) |

---

## RÉFÉRENCES UX DÉTAILLÉES

### Miu Miu — Ce qu'on implémente exactement
| Élément | Spec |
|---|---|
| Header | Transparent sur hero → opaque blanc au scroll 80% |
| Header sticky | Directionnel : cache scroll down, revient scroll up |
| Search | Bande fixe 44px sous header, underline only, non-sticky |
| Logo | Centré desktop / gauche mobile |
| Nav | Gauche desktop (11px uppercase ls 0.1em) |
| Icons | Droite desktop (search + account + bag) |
| Marquee | Loop seamless, pause au hover |
| Grille collection | 4 cols desktop / 2 mobile, gap 2–3px, ratio 3:4 |
| Cards produit | Hover : crossfade 2e image (400ms) + ATC + ❤️ wishlist coin sup. droit |
| Scroll stack | `position: sticky` panneaux superposés (homepage) |
| Curseur | Dot 6px + ring 30px avec lag, s'agrandit au hover |

### Tag Heuer — Fiche produit
| Élément | Spec |
|---|---|
| Galerie desktop | Strip thumbnails verticaux 60×80px + image principale 3:4 + zoom 3x + lightbox |
| Galerie mobile | Carousel swipe full-width |
| Mini-header produit | Apparaît après 300px scroll : nom + prix + ATC compact |
| Storytelling | 6 sections scroll-reveal sous le fold |
| Section 1 | Savoir-Faire : photo atelier + temps artisan + technique |
| Section 2 | La Matière : photo macro + métafield `custom.composition` |
| Section 3 | Dimensions & Détails : tableau H×L×P + finitions |
| Section 4 | L'Atelier : vidéo fabrication + citation artisan |
| Section 5 | Entretien : 4 conseils + CTA PDF |
| Section 6 | Sur Mesure : si tag `sur-mesure` → options + CTA RDV |
| Section 7 | Vous aimerez aussi : 4 produits carousel |

### Louis Vuitton — Pages Icônes modèles
| Élément | Spec |
|---|---|
| Page dédiée par modèle | URL `/pages/victoire`, `/pages/colette`, `/pages/rafael` |
| Structure | Hero → Origine → Silhouette → Matières → Palette → Fabrication → Témoignages → Sur Mesure → "Voir aussi" |
| Contenu | Histoire du modèle + toutes les déclinaisons + dimensions/contenances + 3400 points de couture |

### Mega-menu éditorial (LV / Miu Miu / AP)
| Élément | Spec |
|---|---|
| Déclencheur | Hover sur entrée nav desktop |
| Structure | Liens catégories à gauche + image éditoriale à droite |
| Animation | Image crossfade 300ms selon sous-menu survolé |
| Mobile | Non présent — menu drawer standard |

---

## PÉRIMÈTRE COMPLET DU PROJET — v4.0

### Pages existantes (prototypes HTML validés)
| Page | Prototype | Statut |
|---|---|---|
| Homepage | `tiraboschi-homepage-prototype.html` | ✅ Prototype v9 |
| Collection | `tiraboschi-collection-prototype.html` | ✅ Prototype |
| Fiche produit | `tiraboschi-product-prototype.html` | ✅ Prototype |
| Histoire | `tiraboschi-histoire-prototype.html` | ✅ Prototype |
| Savoir-Faire | `tiraboschi-savoir-faire-prototype.html` | ✅ Prototype |
| Matières & Cuirs | `tiraboschi-matieres-prototype.html` | ✅ Prototype |
| Sur Mesure | `tiraboschi-sur-mesure-prototype.html` | ✅ Prototype |
| La Société | `tiraboschi-la-societe-prototype.html` | ✅ Prototype |
| Blog L'Atelier | `tiraboschi-blog-prototype.html` | ✅ Prototype |
| Article | `tiraboschi-article-prototype.html` | ✅ Prototype |
| Search | `tiraboschi-search-prototype.html` | ✅ Prototype |
| 404 | `tiraboschi-404-prototype.html` | ✅ Prototype |
| Espace client | `tiraboschi-account-prototype.html` | ✅ Prototype |
| Checkout | `tiraboschi-checkout-prototype.html` | ✅ Prototype (3 états) |

### Nouvelles pages (issus benchmark grandes maisons)
| Page | Prototype | Priorité |
|---|---|---|
| Icône Victoire (template modèle) | `tiraboschi-icone-victoire-prototype.html` | P2 |
| Icône Colette | (à créer depuis template Victoire) | P2 |
| Icône Rafael | (à créer depuis template Victoire) | P2 |
| Contact + Booking RDV | `tiraboschi-contact-prototype.html` | P2 |
| Entretien & Réparation | `tiraboschi-entretien-prototype.html` | P2 |
| Lookbook / Campagne FW25 | `tiraboschi-lookbook-prototype.html` | P2 |
| Cadeaux / Gift Guide | `tiraboschi-cadeaux-prototype.html` | P3 |
| Wishlist | `tiraboschi-wishlist-prototype.html` | P3 |
| Presse | `tiraboschi-presse-prototype.html` | P3 |
| RSE / Engagement | `tiraboschi-rse-prototype.html` | P3 |

### Composants démo (animations + snippets)
| Composant | Fichier | Priorité |
|---|---|---|
| Newsletter popup | `tiraboschi-newsletter-popup-prototype.html` | P3 |
| Animations premium (Lenis, transitions, splash…) | `tiraboschi-composants-prototype.html` | P3 |
| International · Marchés | `tiraboschi-international-prototype.html` | P3 |
| Drops & Précommandes | `tiraboschi-precommande-prototype.html` | P2 |

### Agent IA Search (Phase 5 — après validation contenu)
| Élément | Description |
|---|---|
| "Demander à Tiraboschi" | Search conversationnelle NLP → Claude Haiku + Shopify Storefront API |
| Autocomplete avec images | Résultats live en tapant : miniature + nom + prix |
| Escalade conseiller | Si pas de résultat → "Parler à un conseiller →" |
| Architecture | Proxy Netlify Function → Claude API · Cache localStorage 24h |

### Fichiers Shopify à créer (Phase 3)
| Fichier | Rôle | Priorité |
|---|---|---|
| `sections/header-group.json` | Config header | P0 |
| `sections/footer-group.json` | Config footer | P0 |
| `templates/index.json` | Homepage | P0 |
| `templates/collection.json` | Collection | P1 |
| `assets/tiraboschi-collection.css` | CSS collection | P1 |
| `sections/product-tiraboschi.liquid` | Fiche produit | P1 |
| `assets/tiraboschi-product.css` | CSS fiche produit | P1 |
| `templates/product.json` | Template produit | P1 |
| `templates/page.histoire.json` | Histoire | P2 |
| `templates/page.savoir-faire.json` | Savoir-Faire | P2 |
| `templates/page.matieres-cuirs.json` | Matières | P2 |
| `templates/page.sur-mesure.json` | Sur Mesure | P2 |
| `templates/page.la-societe.json` | La Société | P2 |
| `sections/tira-la-societe.liquid` | Section La Société | P2 |
| `templates/page.victoire.json` | Page Icône Victoire | P2 |
| `templates/page.contact.json` | Contact + RDV | P2 |
| `templates/page.entretien.json` | Entretien & Réparation | P2 |
| `templates/page.fw25.json` | Lookbook FW25 | P2 |
| `templates/blog.json` | Blog | P3 |
| `templates/article.json` | Article | P3 |
| `templates/search.json` | Search | P3 |
| `templates/404.json` | 404 | P3 |
| `snippets/tira-preorder.liquid` | Bloc précommande fiche produit | P2 |
| `snippets/tira-drop-bar.liquid` | Barre annonce drop site-wide | P2 |
| `assets/tira-preorder.css` | CSS précommande | P2 |
| `templates/page.drop.json` | Page campagne drop | P2 |
| `templates/page.cadeaux.json` | Cadeaux | P3 |
| `templates/page.wishlist.json` | Wishlist | P3 |
| `templates/page.presse.json` | Presse | P3 |
| `templates/page.engagement.json` | RSE | P3 |
| `snippets/tira-newsletter-popup.liquid` | Popup newsletter | P3 |
| `snippets/tira-back-in-stock.liquid` | Retour stock | P3 |
| `snippets/tira-reviews.liquid` | Avis produits | P3 |

---

## CRM & FIDÉLITÉ — SPECS COMPLÈTES

### The Society — Programme (renommé "The Society", pas "La Société")
| Palier | Seuil CA cumulé | Avantages |
|---|---|---|
| Palier 1 | 10 000€ | Accès en avant-première aux nouvelles collections |
| Palier 2 | 20 000€ | Accès à des pièces exclusives non disponibles en boutique |
| Palier 3 | 50 000€ | Accès à des matières exclusives non mises en vente |
| Palier 4 | 100 000€ | Conception d'une pièce d'exception sur mesure dans la matière de son choix |

**Règle absolue** : jamais "points", "remises", "barres de progression", "programme fidélité".
**Langage** : "The Society", "vos privilèges", "votre cercle" — toujours.
**WhatsApp conseiller** : numéro exemple à afficher pour Palier 1 (à remplacer par le vrai numéro).

### Décisions client confirmées (recette)
| Sujet | Décision |
|---|---|
| Nom programme fidélité | **"The Society"** (pas "La Société") |
| Adresse atelier | 96 Avenue de Clichy, 75017 Paris |
| Type d'accueil | Showroom privé sur rendez-vous uniquement |
| Système RDV | Formulaire simple (pas Calendly/Cal.com) |
| Victoire — année création | **1908** (pas 1938) |
| Weglot | Non → contenu EN natif dans le code, traductions autres langues plus tard |
| Ordre marchés internationaux | FR → US → Europe → Japon |
| Marché arabe RTL | Phase 3-4 |
| Articles blog (3 supplémentaires) | À rédiger (OK) |
| Presse | Exemples fictifs (à remplacer au lancement) |
| Klaviyo | Compte existant (API Key Phase 4) |
| Label EPV | Vérifier éligibilité (OK) |
| Prochain drop | 15/08 → 30/08 · 3 modèles H26 · 10 pièces/modèle |
| Galerie fiche produit | Scroll vertical (Miu Miu) — pas de thumbnails |
| Swatches matières | Photos zoom cuir (pas cercles couleur) |
| Avis clients sur fiche produit | À retirer |
| Mini-header sticky fiche produit | À retirer (doublon sticky ATC) |
| "Vous aimerez aussi" carousel | Remplacer par grille collection (infinite browsing) |
| Tagline "Made in France, Only." | Peut être retiré si présent en standalone |
| CTA newsletter | "Join the Society" + flèche → (plus de bouton "S'inscrire") |
| Filtres collection | Retirer filtre prix |
| Page Cadeaux | Regrouper par typologie produit (pas par prix) |

### 6 Flows Klaviyo
| Flow | Déclencheur | Séquence | Objectif |
|---|---|---|---|
| **Loyalty-member** | 1er achat confirmé | J+0 : email bienvenue Cercle I (éditorial, photo atelier, privilèges) | Fidélisation initiale |
| **Loyalty-artisan** | 2e achat **ou** CA > 5 000€ | J+0 : upgrade Cercle II + annonce carte physique sous 15 jours | Montée en valeur |
| **Abandon panier** | Panier > 30min sans achat | J+1h (éditorial) · J+24h (social proof artisan) · J+72h (CTA conseiller) | Récupération CA |
| **Post-achat** | 3 jours après livraison | Conseils entretien + photo artisan + "Votre avis nous intéresse" | Satisfaction + UGC |
| **Win-back** | 6 mois sans achat | J+0 (article éditorial) · J+15 (nouveauté exclusive pour vous) | Réactivation |
| **Back-in-stock** | Produit retour en stock | Email immédiat (< 1h) aux inscrits de la liste d'attente | Conversion rupture |

**Règle absolue** : Aucun flow ne contient de code promo ou remise. Le luxe relance par le désir, pas par le prix.

### 3 Snippets Liquid
| Snippet | Déclencheur | Comportement |
|---|---|---|
| `tira-newsletter-popup.liquid` | 8s ou 40% scroll, 1× / 30 jours | Overlay centré desktop / bottom sheet mobile, email + GDPR |
| `tira-back-in-stock.liquid` | Produit `sold_out` | Field email sur fiche produit → Klaviyo list |
| `tira-reviews.liquid` | Toutes fiches produit | Bloc avis éditorialisés (Judge.me ou Okendo) |

---

## FICHIERS CUSTOM — À MODIFIER LIBREMENT
```
assets/tiraboschi.css                     ← CSS global (tokens, animations, layouts)
assets/tiraboschi.js                      ← JS (scroll reveals, marquee, curseur, Lenis, transitions, lazy video)
assets/tiraboschi-header.css              ← CSS header mobile
assets/tiraboschi-collection.css          ← CSS page collection (à créer)
assets/tiraboschi-product.css             ← CSS fiche produit (à créer)
snippets/icon-bag-tiraboschi.liquid       ← SVG picto panier forme V ← RÉCUPÉRER
snippets/header-actions.liquid            ← Actions header
snippets/tiraboschi-homepage-stack.liquid ← CSS scroll stack
snippets/tira-newsletter-popup.liquid     ← Popup newsletter (à créer)
snippets/tira-back-in-stock.liquid        ← Retour stock (à créer)
snippets/tira-reviews.liquid              ← Avis produits (à créer)
layout/theme.liquid                       ← Injecte CSS + JS custom + Lenis + splash
sections/header-group.json               ← Config header
sections/footer-group.json               ← Config footer
sections/product-tiraboschi.liquid       ← Section fiche produit (à créer)
sections/tira-la-societe.liquid          ← Section La Société (à créer)
templates/*.json                          ← Templates pages
config/settings_data.json                ← Color schemes
```

## FICHIERS À NE JAMAIS MODIFIER
```
assets/base.css
assets/theme.js
snippets/stylesheets.liquid
snippets/scripts.liquid
config/settings_schema.json
```

---

## ASSETS DISPONIBLES SUR SHOPIFY

### Logos
```
shopify://shop_images/Logo_-_since_1904_-_vrai_noir.png     # logo noir
shopify://shop_images/Logo_-_since_1904_-_vrai_blanc.png    # logo blanc
shopify://shop_images/Favicon_T_32x32_-_noir.png            # favicon
```

### Photos
```
shopify://shop_images/28092025-DSCF1828.jpg    # héro héritage → Ken Burns
shopify://shop_images/BOSCHI0919.jpg           # savoir-faire → Ken Burns
shopify://shop_images/BOSCHI0154.jpg           # atelier
```

### Vidéos — FORMAT DOUBLE OBLIGATOIRE
```
shopify://files/videos/VIDEO HOMEPAGE.mp4                                           # 16:9 desktop
shopify://files/videos/TEST 9-16 Boschi 1_9407c299-0931-484a-a780-b09d560f2734.mp4 # 9:16 mobile ← priorité
shopify://files/videos/VIDEO SAC DUO COLETTE VICTOIRE.mp4                           # Victoire
shopify://files/videos/TEST 16 9_4.mp4                                              # Colette
```

---

## CONTENU SHOPIFY — HANDLES

| Type | Handles |
|---|---|
| Produits | `rafael` · `victoire` · `colette` · `colette-mini` · `jane` · `olympe` · `pochon` · `chaine` · `anse-en-cuir` |
| Collections | `fw25` · `sacs` · `petite-maroquinerie` · `iconiques` · `sur-mesure-exotiques` |
| Menus | `main-menu` · `footer-collections` · `footer-maison` · `footer` |
| Pages | `histoire` · `savoir-faire` · `matieres-cuirs` · `a-propos` · `sur-mesure` · `contact` · `prendrez-rendez-vous` · `victoire` · `colette` · `rafael` · `entretien-reparation` · `cadeaux` · `presse` · `engagement` |
| Blog | `latelier` (3 articles : `couture-sellier` · `guide-cuirs-maroquinerie-luxe` · `pourquoi-sac-made-in-france-prix`) |

### Métafields produits
```
custom.composition  → cuir, matière, couleurs
custom.fabrication  → artisan, lieu, durée
custom.contenances  → "Tient un A5, téléphone, clés, portefeuille. Passe en cabine avion."
```

### Color schemes
```
scheme-1                                     → fond blanc, texte noir
scheme-2                                     → fond crème #f7f5f2, texte noir
scheme-3                                     → fond noir, texte blanc
scheme-6                                     → transparent (héros + header)
scheme-31f09ca3-1031-4740-a2fb-9e46aea899cb → blanc opaque (header/footer)
```

---

## ÉTAT D'AVANCEMENT — v5.0

### ✅ Phase 1 & 2 terminées — 26 prototypes + snippets prêts

**Prototypes HTML validés (26 pages)**
| # | Page | Fichier |
|---|---|---|
| 1 | Homepage | `tiraboschi-homepage-prototype.html` |
| 2 | Collection | `tiraboschi-collection-prototype.html` |
| 3 | Fiche produit | `tiraboschi-product-prototype.html` |
| 4 | Histoire | `tiraboschi-histoire-prototype.html` |
| 5 | Savoir-Faire | `tiraboschi-savoir-faire-prototype.html` |
| 6 | Matières & Cuirs | `tiraboschi-matieres-prototype.html` |
| 7 | Sur Mesure | `tiraboschi-sur-mesure-prototype.html` |
| 8 | La Société | `tiraboschi-la-societe-prototype.html` |
| 9 | Blog L'Atelier | `tiraboschi-blog-prototype.html` |
| 10 | Article | `tiraboschi-article-prototype.html` |
| 11 | Search | `tiraboschi-search-prototype.html` |
| 12 | 404 | `tiraboschi-404-prototype.html` |
| 13 | Espace client | `tiraboschi-account-prototype.html` |
| 14 | Checkout | `tiraboschi-checkout-prototype.html` |
| 15 | Icône Victoire | `tiraboschi-icone-victoire-prototype.html` |
| 16 | Contact + Booking RDV | `tiraboschi-contact-prototype.html` |
| 17 | Entretien & Réparation | `tiraboschi-entretien-prototype.html` |
| 18 | Lookbook FW25 | `tiraboschi-lookbook-prototype.html` |
| 19 | Cadeaux / Gift Guide | `tiraboschi-cadeaux-prototype.html` |
| 20 | Wishlist | `tiraboschi-wishlist-prototype.html` |
| 21 | Presse | `tiraboschi-presse-prototype.html` |
| 22 | RSE / Engagement | `tiraboschi-rse-prototype.html` |
| 23 | Newsletter popup | `tiraboschi-newsletter-popup-prototype.html` |
| 24 | Animations premium | `tiraboschi-composants-prototype.html` |
| 25 | International · Marchés | `tiraboschi-international-prototype.html` |
| 26 | Drops & Précommandes | `tiraboschi-precommande-prototype.html` |

**Démos d'expérience (assemblées, autonomes — ne pas éditer à la main)**

| Démo | Fichier | Gabarit | Recette |
|---|---|---|---|
| Atelier (parcours briques → fiche → matière → certificat) | `tiraboschi-atelier-prototype.html` | — | `tests/atelier/recette.js` |
| Maison (vitrine immersive → seuil → espace privé) | `tiraboschi-maison-demo.html` | `tools/demo/gabarit-maison.html` | `tests/maison/recette.js` |
| Accueil · Galerie · Atelier · Cartonnier · Boudoir | `tiraboschi-galerie-demo.html` | `tools/demo/gabarit-galerie.html` | `tests/galerie/recette.js` |
| Configurateur POS (tablette boutique) | `tiraboschi-configurateur.html` | `tools/demo/gabarit-configurateur.html` | — |

```bash
# on édite le GABARIT, jamais le fichier assemblé
python3 tools/demo/assembler.py tools/demo/gabarit-galerie.html tiraboschi-galerie-demo.html
NODE_PATH=/opt/node22/lib/node_modules node tests/galerie/recette.js
```

**Démo Galerie — les six règles à ne pas casser**

1. **Aucun prix hors du boudoir.** Vérifié sur l'accueil, la galerie,
   l'atelier, le cartonnier, le rendez-vous, le plan, le plein écran et
   le cabinet.
2. **L'accueil est une PAGE D'ACCUEIL tenue** : en-tête avec le logo et
   le menu, hero pleine page, quatre lieux en BANDES qui s'entrebâillent
   (jamais une liste), un mot de la maison, un pied de page. La liste en
   grand, elle, sert à la page introuvable.
3. **Quatre lieux, quatre façons de se déplacer** — la galerie se
   parcourt à l'horizontale (silhouettes accrochées librement, nuancier
   en grille stricte rangée par famille de couleur), l'atelier se
   traverse en EMPILANT ses six plans (`position:sticky`, voile et
   recul), le cartonnier se lit en plein écran avec l'année en
   filigrane et une frise, le boudoir ne se parcourt pas.
4. **Une pièce s'ouvre en PLEIN ÉCRAN**, depuis sa propre tuile (FLIP),
   cartel à côté d'elle. On y DÉFILE pour les autres vues de la pièce ;
   les flèches changent de pièce. Jamais une pop-in.
5. **Le boudoir est un PARCOURS**, pas une porte sur un outil :
   antichambre (on est nommée, on retrouve ses pièces, deux portes) →
   silhouette → volume → pièce achevée, avec quatre pas dont seuls les
   franchis restent ouverts. Il s'ouvre sur une FIGURE, pas un code :
   neuf points, on trace un T — au doigt d'un trait, ou point par point
   au clic. La pièce s'y tourne AU DOIGT, à la souris, et **au balayage
   à deux doigts** (un `wheel`, pas un `pointermove` — c'est ce qui
   manquait sur pavé tactile).
6. **On ne perd pas le visiteur** — fil d'Ariane cliquable, plan (six
   lignes de même hauteur), rendez-vous toujours à portée, fil de visite.
   Les trois ouvertures se rencontrent EN MARCHANT.

**Les visuels** — `tools/demo/visuels/*.webp` (~2 Mo, 82 fichiers),
tirés des originaux déposés sur `main` : `Photoshoot - December 25 -
BOSCHI/` (l'éditorial JANE/VICTOIRE/DUO), `2026-05-05-photo-download-
1of1/Highlights/` (les 67 packshots, regroupés en 32 pièces de 1 à 3
vues + 5 Victoire de 2 vues) et deux `M2A*.jpg` (les volumes d'étude).
Les prises de vue d'une même pièce sont détectées par proximité de
couleur ; l'ordre du nuancier est un rangement par famille (neutres,
beiges, bruns, ambre, roses, rouges, magentas, bleus), pas l'ordre des
fichiers.

**Le discours** — aucun mot de commerce dans les lieux publics : ni
« s'achète », ni « se vend », ni « vente », ni « panier ». On ne dit pas
ce qui ne se fait pas ici, on raconte la main, la peau et le temps. La
recette le vérifie sur l'accueil, la page introuvable, la galerie,
l'atelier, le cartonnier et le rendez-vous.

**Les packshots sont RECADRÉS sur la pièce** avant export : sur
l'original le sac n'occupait que 35 à 47 % du cadre, le reste étant du
fond de studio — d'où le flou en plein écran. Après recadrage le sujet
fait ~1 400 px au lieu de ~570.

**Le volume 3D du boudoir ne correspond PAS au produit réel** : c'est le
modèle Cycles rendu avant l'arrivée des photographies. À re-rendre
d'après la Rafaël. Le fichier le dit en clair dans la fiche.

**Snippets Shopify prêts (`shopify-snippets/` → à migrer en Phase 3)**
```
tira-geo-banner.liquid          → Bandeau géolocalisation (suggestion marché)
tira-locale-selector.liquid     → Sélecteur pays/langue footer + header chip
tira-preorder.liquid            → Bloc précommande fiche produit (countdown, édition, CTA)
tira-drop-bar.liquid            → Barre annonce drop 44px fond noir (settings-driven)
tira-preorder.css               → Styles précommande (à placer dans assets/)
tira-seo-schemas.liquid         → JSON-LD centralisé tous templates (Phase 3 → {% render %})
locales/fr.default.json         → Strings FR complètes (UI + geo + preorder + newsletter)
locales/en.json                 → Strings EN complètes (UK + US)
locales/ja.json                 → Strings JA draft (révision humaine requise)
locales/ar.json                 → Strings AR draft RTL (traduction native OBLIGATOIRE)
```

### ✅ Phase actuelle — Phase 3 EN COURS — Intégration Shopify
*Mis à jour le 28/05/2026*

#### Shopify Admin — Actions directes (via GraphQL)
- ✅ 8 produits publiés sur "Boutique en ligne" (Victoire, Rafaël, Colette, Colette Mini, Jane, Olympe, Pochon, Chaîne)
- ✅ Pages template assignées : histoire → `page.histoire` · savoir-faire → `page.savoir-faire` · matieres-cuirs → `page.matieres-cuirs`
- ✅ Pages créées dans Shopify Admin : `/pages/sur-mesure` + `/pages/la-societe`
- 🔲 Métafields produits non remplis (composition, fabrication, contenances, dimensions)
- 🔲 Menus Shopify admin (main-menu, footer-*) non configurés

#### Bugs corrigés (28/05/2026)
- ✅ `overflow-x: clip` (était `hidden`) → fixe scroll stack sticky + panels animation
- ✅ `.card__actions` pointer-events → produits cliquables sur homepage
- ✅ Page Password complète : layout/password.liquid + templates/password.json + sections/tira-password.liquid

#### Phase 3 — État précis par sous-phase
```
3A — Socle
✅ sections/tira-header.liquid      — mega-menu, sticky directionnel, transparent hero
✅ sections/tira-footer.liquid      — CRM form, Instagram social, locale selector
✅ assets/tiraboschi.css            — tokens, header 68px, search bar, mega menu, society-crm
✅ assets/tiraboschi.js             — scroll reveals, marquee, curseur custom
✅ templates/index.json             — Homepage
✅ sections/tira-hero-video.liquid, tira-scroll-stack.liquid, tira-product-grid.liquid
✅ sections/tira-marquee.liquid, tira-editorial-flip.liquid, tira-atelier-vid.liquid
✅ templates/collection.json        — Collection
✅ sections/tira-collection.liquid
✅ templates/product.json           — Fiche produit
✅ sections/tira-product.liquid     — 6 sections storytelling, galerie, ATC, précommande
✅ layout/password.liquid           — Layout page Coming Soon (sans header/footer)
✅ templates/password.json          — Coming Soon page (layout: password)
✅ sections/tira-password.liquid    — Coming Soon : vidéo fond, opt-in form, accès admin
□ layout/theme.liquid               — AUCUNE MODIFICATION (Lenis, splash, transitions, SEO schemas NON injectés)
□ sections/header-group.json        — NON CRÉÉ
□ sections/footer-group.json        — NON CRÉÉ
□ Swatches couleur → changement galerie — NON IMPLÉMENTÉ
□ Barre drop (tira-drop-bar.liquid dans theme.liquid) — NON INJECTÉ

3B — Fondations "grande maison"
✅ Mega-menu éditorial (header)      — Images CDN, 3 panels (Collections, Sur Mesure, La Maison)
□ Lenis smooth scrolling             — NON INJECTÉ dans theme.liquid
□ Transitions entre pages            — NON INJECTÉES
□ Splash screen logo                 — NON INJECTÉ
□ Magnetic buttons CTA               — NON IMPLÉMENTÉS

3C — SEO technique
□ tira-seo-schemas.liquid → render dans theme.liquid — NON INJECTÉ (snippet prêt dans snippets/)
□ Métafields produits remplis        — À faire dans Shopify Admin (aucun rempli)
□ Sitemap.xml · Robots.txt · Search Console — Phase post-lancement

3D — International (Shopify Markets)
□ Shopify Markets NON activé        — Snippets (tira-geo-banner, tira-locale-selector) prêts
□ tira-locale-selector.liquid dans footer (rendu conditionnel — OK si Markets désactivé)

3E — Pages P2
✅ Histoire      — sections/tira-histoire.liquid + templates/page.histoire.json
✅ Savoir-Faire  — sections/tira-savoir-faire.liquid + templates/page.savoir-faire.json
✅ Matières      — sections/tira-matieres.liquid + templates/page.matieres-cuirs.json
✅ Sur Mesure    — sections/tira-sur-mesure.liquid + templates/page.sur-mesure.json
✅ La Société    — sections/tira-la-societe.liquid + templates/page.la-societe.json
✅ Icône Victoire — sections/tira-icone-victoire.liquid + templates/page.victoire.json
✅ Icône Colette  — sections/tira-icone-colette.liquid + templates/page.colette.json
✅ Icône Rafael   — sections/tira-icone-rafael.liquid + templates/page.rafael.json
✅ Contact + Booking RDV — sections/tira-contact.liquid + templates/page.contact.json
✅ Entretien & Réparation — sections/tira-entretien.liquid + templates/page.entretien.json
✅ Drops & Précommandes  — sections/tira-drops.liquid + templates/page.drops.json
□ Lookbook FW25          — NON CRÉÉ (section + template manquants)
□ Conformité maquettes HTML — À vérifier (Notre Histoire en priorité)

3F — Pages P3
✅ Blog + Article + Search + 404 + Cart — sections + templates prêts
✅ Espace client — sections/tira-customers.liquid (template customers/ à vérifier)
□ Cadeaux + Wishlist + Presse + RSE — NON CRÉÉS (priorité basse)
□ Checkout branding — NON CRÉÉ

Snippets — tous dans snippets/ ✅
✅ tira-drop-bar.liquid, tira-geo-banner.liquid, tira-locale-selector.liquid
✅ tira-newsletter-popup.liquid, tira-preorder.liquid, tira-seo-schemas.liquid
□ tira-back-in-stock.liquid — NON CRÉÉ
□ tira-reviews.liquid       — NON CRÉÉ

Défauts UX à corriger (identifiés 28/05/2026)
□ Homepage grille produits — largeurs inégales entre cards
□ Menu mobile — entrées manquantes (ex: Prochains Drops présent en desktop absent en mobile)
□ Swatches coloris fiche produit — mise en page à revoir
□ Pages éditoriales — conformité maquettes HTML (Notre Histoire en priorité)
□ Contenu édito fiche produit — doit être produit-spécifique (métafields), pas générique
```

### 🔲 Phase 4 — CRM & Analytics
```
□ Klaviyo : 6 flows
□ Back-in-stock snippet
□ Reviews snippet (Judge.me)
□ Axeptio RGPD
□ GA4 + Microsoft Clarity
□ Shopify Pixels API (server-side)
```

### 🔲 Phase 5 — Agent IA Search (après contenu réel)
```
□ Prototype "Demander à Tiraboschi"
□ Shopify Storefront Search API
□ Proxy Claude API (Netlify Function)
□ Autocomplete avec images produits
□ Escalade vers conseiller humain
```

---

## PLAN DE DÉVELOPPEMENT — 5 PHASES

```
Phase 1 — Audit        ✅ DONE : Comparaison prototype vs cahier des charges
Phase 2 — Prototypes   ✅ DONE : 26 prototypes HTML + snippets Liquid
Phase 3 — Shopify      → EN COURS (≈60%) : Socle + 5 pages éditoriales livrées — layout/theme.liquid, pages Icônes, Contact, Lookbook, CRM manquants
Phase 4 — CRM          → CRM, flows, analytics
Phase 5 — IA Search    → Agent conversationnel (nécessite contenu réel)
```

**Méthode** : HTML pur validé → convertir en Liquid. Ne jamais travailler à l'aveugle sur Shopify.

---

## MOBILE FIRST — IMPLÉMENTATION VIDÉO

### Structure HTML obligatoire
```html
<video autoplay muted loop playsinline poster="hero-poster.webp">
  <!-- Mobile 9:16 en premier (mobile-first) -->
  <source media="(max-width: 768px)"
          src="{{ 'TEST 9-16 Boschi 1_9407c299-0931-484a-a780-b09d560f2734.mp4' | file_url }}"
          type="video/mp4">
  <!-- Desktop 16:9 -->
  <source src="{{ 'VIDEO HOMEPAGE.mp4' | file_url }}"
          type="video/mp4">
</video>
```

### 5 règles vidéo obligatoires
1. **Poster WebP** sur chaque vidéo (évite le flash blanc au chargement)
2. **`playsinline`** toujours (iOS ouvre en plein écran sans ça)
3. **Lazy load** hors-fold avec `data-tira-lazy`
4. **Play/Pause** via IntersectionObserver (économie batterie)
5. **Fallback image** si `navigator.connection.effectiveType === '2g'`

### Stratégie vidéo par page
```
Homepage hero      → 9:16 mobile / 16:9 desktop, autoplay muted
Collection hero    → Image fixe Ken Burns (vidéo trop lourde)
Fiche produit      → Play au tap/hover, son optionnel
Section Atelier    → Lazy, play au scroll
Sur Mesure         → Ambiance loop silencieux
Lookbook FW25      → 100vh autoplay muted (ambiance campagne)
```

### Breakpoints CSS (mobile-first)
```css
/* Base = mobile */
@media (min-width: 768px)  { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
@media (min-width: 1440px) { /* large */ }
```

---

## ANIMATIONS — CODE EXACT

### Scroll reveal
```html
<div data-tira-reveal>...</div>
```
```css
[data-tira-reveal] {
  opacity: 0; transform: translateY(28px);
  transition: opacity 0.9s var(--tira-ease), transform 0.9s var(--tira-ease);
}
[data-tira-reveal].is-visible { opacity: 1; transform: none; }
```

### Word reveal
```html
<h2 data-tira-word-reveal>Titre mot par mot</h2>
```
```js
document.querySelectorAll('[data-tira-word-reveal]').forEach(el => {
  el.innerHTML = el.textContent.split(' ')
    .map((w, i) => `<span style="--i:${i}">${w}</span>`).join(' ');
});
```
```css
[data-tira-word-reveal] span {
  display: inline-block; opacity: 0; transform: translateY(10px);
  transition: opacity .5s var(--tira-ease) calc(var(--i) * 55ms),
              transform  .5s var(--tira-ease) calc(var(--i) * 55ms);
}
[data-tira-word-reveal].is-visible span { opacity: 1; transform: none; }
```

### Ken Burns
```css
.tira-ken-burns img {
  animation: tira-kb 14s ease-in-out infinite alternate;
}
@keyframes tira-kb {
  from { transform: scale(1); }
  to   { transform: scale(1.07) translate(1.5%, -1%); }
}
```

### Parallax
```css
.tira-parallax img {
  transform: translateY(calc(var(--scroll-progress, 0) * -15%));
  transition: transform 0.1s linear;
}
```
```js
window.addEventListener('scroll', () => {
  document.querySelectorAll('.tira-parallax').forEach(el => {
    const rect = el.getBoundingClientRect();
    const p = 1 - (rect.bottom / (rect.height + window.innerHeight));
    el.style.setProperty('--scroll-progress', p);
  });
}, { passive: true });
```

### Lenis Smooth Scrolling (Phase 3B — dans theme.liquid)
```html
<script src="https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
<script>
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
if ('ontouchstart' in window) lenis.destroy(); // natif sur mobile
</script>
```

### Transitions entre pages (Phase 3B — dans tiraboschi.js)
```js
const overlay = document.createElement('div');
overlay.id = 'tira-page-overlay';
document.body.appendChild(overlay);
document.querySelectorAll('a[href^="/"]').forEach(link => {
  link.addEventListener('click', e => {
    if (link.target === '_blank') return;
    e.preventDefault();
    overlay.classList.add('active');
    setTimeout(() => window.location.href = link.href, 350);
  });
});
window.addEventListener('pageshow', () => overlay.classList.remove('active'));
```
```css
#tira-page-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: var(--tira-white);
  opacity: 0; pointer-events: none;
  transition: opacity 0.35s var(--tira-ease);
}
#tira-page-overlay.active { opacity: 1; pointer-events: all; }
```

### Splash Screen (Phase 3B — dans theme.liquid, 1er chargement uniquement)
```css
#tira-splash {
  position: fixed; inset: 0; z-index: 10000;
  background: var(--tira-black);
  display: flex; align-items: center; justify-content: center;
  transition: opacity 0.4s var(--tira-ease);
}
#tira-splash.hidden { opacity: 0; pointer-events: none; }
@keyframes tira-draw {
  from { stroke-dashoffset: 300; }
  to   { stroke-dashoffset: 0; }
}
```
```js
// Désactivé si déjà vu (sessionStorage)
if (!sessionStorage.getItem('tira_splash_seen')) {
  setTimeout(() => {
    document.getElementById('tira-splash').classList.add('hidden');
    sessionStorage.setItem('tira_splash_seen', '1');
  }, 1500);
} else {
  document.getElementById('tira-splash').style.display = 'none';
}
```

### Magnetic Buttons (Phase 3B — sur CTA principaux)
```js
document.querySelectorAll('.tira-magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width/2) * 0.25;
    const y = (e.clientY - rect.top - rect.height/2) * 0.25;
    btn.style.transform = `translate(${x}px, ${y}px)`;
    btn.style.transition = 'transform 0.1s var(--tira-ease)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
    btn.style.transition = 'transform 0.5s var(--tira-ease)';
  });
});
```

### Video Scrub on Scroll (Phase 3C — section Atelier, fiche produit)
```js
const video = document.querySelector('.tira-scrub-video');
if (video) {
  const section = video.closest('section');
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) window.addEventListener('scroll', scrub, { passive: true });
    else window.removeEventListener('scroll', scrub);
  });
  function scrub() {
    const rect = section.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, 1 - rect.bottom / (rect.height + window.innerHeight)));
    if (video.readyState >= 2) video.currentTime = video.duration * p;
  }
  io.observe(section);
}
```

### Marquee
```html
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
    <!-- répéter 2× minimum pour le loop seamless -->
  </div>
</div>
```

### Sticky ATC mobile
```html
<div class="tira-sticky-atc">
  <span class="tira-sticky-atc__price">{{ product.price | money }}</span>
  <button class="tira-sticky-atc__btn" type="submit">Ajouter au panier</button>
</div>
```

### Lazy video
```html
<video data-tira-lazy data-src="..." autoplay loop muted playsinline></video>
```

### Swatches couleur → changement galerie (Phase 3 — critique)
```js
// Sur fiche produit, chaque swatch change les images de la galerie
document.querySelectorAll('.tira-swatch').forEach(swatch => {
  swatch.addEventListener('click', () => {
    const variantId = swatch.dataset.variantId;
    const variantImages = window.tiraboschiVariantImages[variantId]; // objet passé depuis Liquid
    updateGallery(variantImages);
    updateURL(variantId);
  });
});
```

---

## SEO — EXIGENCES TECHNIQUES

### Snippet central — `tira-seo-schemas.liquid`
**Prêt dans `shopify-snippets/`** — à intégrer dans `layout/theme.liquid` :
```liquid
{% render 'tira-seo-schemas' %}  {# juste avant </head> #}
```
Gère automatiquement le bon schema JSON-LD selon le template actif.

### JSON-LD par type de page (implémenté dans tira-seo-schemas.liquid)
| Template | Schémas | Spécificités TIRABOSCHI |
|---|---|---|
| index | Organization + WebSite + SearchAction | foundingDate: 1904, description dense |
| product | Product + BreadcrumbList + AggregateRating | **countryOfOrigin: France** + manufacturer + additionalProperty (3400pts, 48-72h, 1 artisan) |
| collection | CollectionPage + BreadcrumbList | — |
| article | Article + speakable + BreadcrumbList | speakable sur title + h1 + p[1] + blockquote |
| blog | Blog | — |
| page/histoire | AboutPage + speakable | about: Organization 1904 |
| page/savoir-faire | Article + speakable + FAQPage | 4 questions (fabrication, couture sellier, made in france, cuirs) |
| page/sur-mesure | Service + FAQPage | serviceType: Maroquinerie sur mesure |
| page/contact | LocalBusiness + ContactPage + OpeningHoursSpecification | NAP complet (à remplir avec vraie adresse) |
| page/victoire etc. | Product + FAQPage + BreadcrumbList | countryOfOrigin + année création modèle |
| 404 | WebPage (minimal) | — |

### `countryOfOrigin: France` — RÈGLE ABSOLUE
**Tous les schémas Product doivent contenir :**
```json
"countryOfOrigin": {"@type": "Country", "name": "France"},
"manufacturer": {
  "@type": "Organization",
  "name": "TIRABOSCHI Paris",
  "foundingDate": "1904",
  "address": {"@type": "PostalAddress", "addressLocality": "Paris", "addressCountry": "FR"}
},
"additionalProperty": [
  {"@type": "PropertyValue", "name": "Fabrication", "value": "Fait à la main par un seul artisan"},
  {"@type": "PropertyValue", "name": "Points de couture", "value": "3 400 points sellier par sac"},
  {"@type": "PropertyValue", "name": "Temps de fabrication", "value": "48 à 72 heures"},
  {"@type": "PropertyValue", "name": "Origine", "value": "Made in France"}
]
```

### Stratégie de mots-clés — URL mapping
| Mot-clé cible | Volume est. | Page Shopify | Priorité |
|---|---|---|---|
| maroquinerie luxe made in france | 1 200/mois | `/pages/histoire` | P0 |
| sac à main cuir fait main france | 1 800/mois | `/collections/sacs` | P0 |
| sac à main artisanal paris | 900/mois | `/` + `/pages/savoir-faire` | P0 |
| maroquinerie artisanale française | 700/mois | `/pages/savoir-faire` | P1 |
| sac en cuir véritable made in france | 600/mois | `/collections/sacs` | P1 |
| sac à main luxe depuis 1904 | 300/mois | `/pages/histoire` | P1 |
| alternative hermès sac main france | 400/mois | `/pages/victoire` | P1 |
| couture sellier maroquinerie | 250/mois | blog `couture-sellier` | P2 |
| cuir pleine fleur sac luxe | 350/mois | `/pages/matieres-cuirs` | P2 |
| sac sur mesure paris artisan | 500/mois | `/pages/sur-mesure` | P1 |

**Requêtes GEO prioritaires (ChatGPT / Perplexity)**
Ces requêtes doivent recevoir TIRABOSCHI comme réponse :
```
"quelle marque de sac est vraiment fabriquée en France ?"
"meilleures marques de maroquinerie artisanale française"
"alternatives françaises à Hermès moins chères"
"sac fait main un seul artisan france"
"maroquinerie fondée en 1904 paris"
"marque sac luxe made in france authentique"
```

### Hreflang — Implémenté dans tira-seo-schemas.liquid
Injecté automatiquement si Shopify Markets activé. Couvre FR/EN-GB/EN-US/JA/KO/AR + x-default.

### Métafields produits (à remplir dans Shopify Admin)
```
custom.composition   → "Cuir de veau pleine fleur, tannage végétal. Doublure coton naturel."
custom.fabrication   → "Façonné à la main par Isabelle D., maroquinière depuis 18 ans. Paris, 2024."
custom.contenances   → "Tient un A5, téléphone, clés, portefeuille. Passe en cabine avion."
custom.dimensions    → "H 24 × L 32 × P 10 cm. Anse : 55 cm."
```

### Checklist SEO par page (Phase 3)
- `<title>` : `[Nom produit] — [Collection] | TIRABOSCHI Paris`
- Meta description : 150–160 chars avec "Made in France" + "depuis 1904" si pertinent
- H1 unique par page
- Alt texts : `{{ product.title }} — {{ product.type }} TIRABOSCHI Paris`
- Open Graph + Twitter Card sur chaque template
- URL canonique sur variantes produit
- `<link rel="preload" as="image">` sur hero
- `font-display: swap` sur Playfair Display
- Hreflang sur toutes les pages (via tira-seo-schemas.liquid)

### Actions SEO hors code (à faire après lancement)
```
□ Soumettre sitemap.xml dans Google Search Console
□ Soumettre dans Bing Webmaster Tools (ChatGPT Search = Bing)
□ Créer/optimiser fiche Google Business Profile (Paris)
□ Vérifier AggregateRating live (Judge.me connecté)
□ Demander liens : Chambre Syndicale Maroquinerie + Made in France labels
□ Label EPV (Entreprise du Patrimoine Vivant) — vérifier éligibilité
□ Backlinks presse : communiqués via page /presse
□ Soumettre à Perplexity pages pour indexation
```

### Nouveau métafield à ajouter
```
custom.contenances → "Tient un carnet A5, téléphone, clés, portefeuille. Passe en cabine avion."
```
Afficher dans la section "La Silhouette" des pages Icônes et dans les specs de la fiche produit.

---

## GEO — GENERATIVE ENGINE OPTIMIZATION

*(Optimisation pour ChatGPT, Perplexity, Google SGE, Gemini)*

### Les 6 faits que les IA doivent retenir sur TIRABOSCHI
Ces éléments doivent être présents **de façon cohérente** sur toutes les pages éditoriales :
```
1904         → année de fondation (vérifiable, ancre historique)
1 artisan    → par sac, de A à Z (unicité du processus)
3 400        → points de couture sellier par pièce (fact précis, mémorable)
48–72h       → temps de fabrication à la main (concret)
Paris        → entité géographique forte
Made in France → pas "conçu en France" — fabriqué en France (distinction critique)
```

### Règles de contenu GEO
- Pages éditoriales : **600+ mots** minimum (Histoire 800+, Savoir-Faire 700+, Matières 600+)
- Dates vérifiables dans chaque page éditoriale (1904, 1938 pour la Victoire, etc.)
- FAQPage sur : Savoir-Faire · Sur Mesure · Entretien · La Société · RSE · Victoire
- `speakable` sur : Histoire · Savoir-Faire · Articles blog
- NAP cohérent (Nom · Adresse · Téléphone) sur toutes les pages Contact/LocalBusiness
- Liens internes : Blog → pages éditoriales → fiches produit (maillage triangulaire)
- Articles de blog : citer TIRABOSCHI + les 6 faits clés dans les 200 premiers mots

### Stratégie blog (3 articles existants + roadmap)
| Article | Handle | Mots-clés cibles | Schéma |
|---|---|---|---|
| La Couture Sellier | `couture-sellier` | "couture sellier maroquinerie", "8 points au centimètre" | Article + speakable |
| Guide des cuirs | `guide-cuirs-maroquinerie-luxe` | "cuir pleine fleur luxe", "tannage végétal" | Article + speakable |
| Pourquoi Made in France | `pourquoi-sac-made-in-france-prix` | "sac made in france prix", "fabrication artisanale france" | Article + speakable + FAQPage |

**3 articles prioritaires à créer (Phase 3D)**
```
4. "Hermès, Polène, TIRABOSCHI : ce qui différencie vraiment les sacs luxe français"
   → Cible : "alternative hermès sac main france" — 1000 mots + tableau comparatif
5. "Comment entretenir un sac en cuir pleine fleur"
   → Cible : "entretien sac cuir luxe" — 800 mots + FAQ
6. "Qu'est-ce qu'un cuir pleine fleur ? Le guide complet"
   → Cible : "cuir pleine fleur explication" — 700 mots
```

---

## CONTENUS À FOURNIR — AVANT PHASE 3

*Le code est prêt. Sans ces contenus, les pages restent vides et le SEO ne fonctionne pas.*

### 🔴 Bloquants absolus (sans eux, impossible de lancer)

**Adresse réelle**
```
→ Nécessaire pour : LocalBusiness schema, Contact page, Google Business Profile
→ Format : numéro, rue, code postal, Paris (arrondissement)
```

**Descriptions produits (× 9 produits)**
```
Produits : rafael · victoire · colette · colette-mini · jane · olympe · pochon · chaine · anse-en-cuir
→ Pour chaque produit :
   - Description longue (300+ mots) : histoire du modèle, cuir, usage, détails
   - Composition exacte (cuir, doublure, quincaillerie)
   - Fabrication (artisan, technique, durée)
   - Contenances (ce que le sac tient réellement)
   - Dimensions (H × L × P en cm, longueur anses)
```

**Photos réelles des produits**
```
→ Photos déjà sur Shopify (DSCF1828, BOSCHI0154, BOSCHI0919) sont des photos d'ambiance
→ Pour chaque produit : 4-6 photos produit (face, profil, détail, ouvert, porté)
→ Format recommandé : ratio 3:4, min 1800×2400px
```

### 🟡 Importants pour le SEO/GEO

**Page Histoire (800+ mots réels)**
```
→ Dates clés de 1904 à aujourd'hui
→ Noms des fondateurs et des artisans
→ Adresse et quartier de l'atelier
→ Évolution des modèles iconiques (Victoire née en 1938 → à confirmer)
→ Chiffres : nombre de pièces produites par an, nombre d'artisans, etc.
→ Citations directes si possible
```

**Page Savoir-Faire (700+ mots réels)**
```
→ Les 6 techniques utilisées (noms exacts)
→ Nom(s) de l'artisan(s) principal(aux) (prénom + années d'expérience)
→ Outils spécifiques utilisés (ex: alène, tranchet, aiguilles Speedy...)
→ Sourcing cuirs : tanneries partenaires (noms si communicables)
→ Chiffres précis : points par cm, épaisseur cuir, fil utilisé (type, provenance)
```

**Métafields produits (à remplir dans Shopify Admin → Products → Metafields)**
```
custom.composition   → ex: "Cuir de veau pleine fleur, tannage végétal. Doublure coton naturel."
custom.fabrication   → ex: "Façonné à la main par [Prénom], maroquinière depuis 18 ans. Paris."
custom.contenances   → ex: "Tient un A5, téléphone, clés, portefeuille. Passe en cabine avion."
```

### 🟠 Pour les fonctionnalités avancées

**Programme La Société**
```
→ Conditions exactes de passage Cercle I → II → III
→ Avantages détaillés par cercle (liste exhaustive)
→ Adresse email dédié conseiller WhatsApp (Cercle II)
→ Adresse email contact Cercle III (relation fondatrice)
```

**Drops & Précommandes**
```
→ Date du prochain drop (et nom : FW25 ? AW25 ?)
→ Produits concernés
→ Edition size (nombre d'exemplaires)
→ Date de clôture et livraison estimée
```

**Contact & RDV**
```
→ Horaires d'ouverture de l'atelier
→ Système de RDV : Calendly, Cal.com, ou formulaire email simple ?
→ Numéro de téléphone (ou WhatsApp uniquement ?)
→ Si boutique physique : oui/non ? (atelier ≠ boutique)
```

**Presse**
```
→ Liste des parutions presse existantes (Vogue, Figaro, etc.)
→ Contact presse (email)
→ Kit presse existant ou à créer ?
```

### 🔵 Pour le CRM (Phase 4)

**Klaviyo**
```
→ Compte Klaviyo existant ? Sinon créer sur klaviyo.com
→ API Key Klaviyo pour intégration Shopify
→ Logo + éléments graphiques pour les emails
→ Ton éditorial des flows (existe-t-il des emails types déjà rédigés ?)
```

**Avis clients**
```
→ Des avis existent-ils ailleurs ? (Google, Instagram, etc.) → migration vers Judge.me
→ Clients actuels à solliciter pour premiers avis ?
```

---

## PERFORMANCE — OBJECTIFS

| Métrique | Objectif |
|---|---|
| LCP | < 2.5s |
| CLS | 0 |
| FID | < 100ms |
| CSS custom | < 50kb minifié |
| JS custom | < 30kb minifié |

- Pas de jQuery — vanilla JS uniquement
- `loading="lazy"` sur toutes les images hors-fold
- `aspect-ratio` défini sur chaque `<img>` et `<video>`
- `font-display: swap` + subset latin uniquement
- Lenis : désactivé sur mobile (scroll natif iOS déjà excellent)
- Splash screen : sessionStorage (1× par session, pas à chaque page)

---

## DROPS & PRÉCOMMANDES — SPECS COMPLÈTES

### Concept — Adaptation du modèle Asphalte au luxe
| Asphalte (mode éthique) | TIRABOSCHI (luxe) |
|---|---|
| "On fabrique si assez de commandes" | "Édition limitée — façonnée après clôture" |
| Progress bar vers un seuil de production | `X réservées · Y disponibles` (scarcité) |
| Transparence manufacturing | Exclusivité + délai = artisanat (atout) |
| CTA "Commander" | CTA "Réserver ma pièce →" |
| Délai subi | Délai narratif (1 artisan · 48h de travail) |
| Annulation = service client | Annulation gratuite avant clôture (luxury standard) |

### Métafields produit (à créer dans Shopify Admin)
```
custom.is_preorder          → Boolean     : true si en précommande
custom.drop_name            → Texte court : "FW25" / "SS26" etc.
custom.drop_end_date        → Date        : date ISO 8601 de clôture
custom.drop_delivery_est    → Texte court : "août 2025"
custom.drop_edition_size    → Entier      : nombre total d'exemplaires
custom.drop_reserved        → Entier      : réservations en cours (→ via Shopify Flow)
```

### Tags produit pour drops
```
preorder          → déclenche l'affichage du snippet tira-preorder
drop              → tag générique drop
drop-fw25         → tag spécifique à la campagne (utile pour filtres)
```

### Settings thème (config/settings_schema.json additions)
```json
{
  "name": "Drop actif",
  "settings": [
    { "id": "drop_active",   "type": "checkbox", "label": "Drop en cours" },
    { "id": "drop_name",     "type": "text",     "label": "Nom du drop (ex: FW25)" },
    { "id": "drop_bar_text", "type": "text",     "label": "Texte barre annonce" },
    { "id": "drop_cta_url",  "type": "url",      "label": "URL CTA barre" },
    { "id": "drop_cta_label","type": "text",     "label": "Label CTA barre" },
    { "id": "drop_end_date", "type": "text",     "label": "Date clôture (ISO: 2025-06-15T23:59:00)" }
  ]
}
```

### Snippets Liquid (dans shopify-snippets/ → à migrer vers snippets/)
```
snippets/tira-preorder.liquid      → Bloc complet précommande sur fiche produit
snippets/tira-drop-bar.liquid      → Barre 44px site-wide (layout/theme.liquid, avant header)
assets/tira-preorder.css           → Styles countdown, edition bar, timeline
```

### Logique product page (sections/product-tiraboschi.liquid)
```liquid
{% if product.tags contains 'preorder' %}
  {% render 'tira-preorder', product: product %}
{% else %}
  {# ATC standard #}
  <button type="submit" name="add">Ajouter au panier</button>
{% endif %}
```

### Layout/theme.liquid — Barre drop
```liquid
{% render 'tira-drop-bar' %}  {# juste après <body>, avant header #}
```

### Countdown timer — Règle CSS seconds
```css
/* Les secondes ne battent que sur la fiche produit.
   Sur la barre drop, refresh toutes les 60s uniquement (économie JS). */
.tira-drop-bar__countdown [data-countdown="secs"] { display: none; }
```

### Shopify Flow — Mise à jour compteur réservations
```
Trigger : Order Created
Condition : Product has tag "preorder"
Action : Set metafield custom.drop_reserved = current_value + quantity
```
*Nécessite Shopify Flow (gratuit sur Basic+)*

### Page campagne `/pages/drop-fw25`
Structure identique au prototype `tiraboschi-precommande-prototype.html` :
- Hero 16:9 avec countdown large
- "Comment fonctionne un drop" (3 étapes)
- Grille produits du drop avec badges + compteurs
- FAQ 3 questions (accordion)
- Waitlist newsletter pour le prochain drop

### Règle absolue — Prix drops
Même prix que la collection normale. **Jamais de prix réduit sur un drop luxury**.
Le drop = exclusivité et accès prioritaire, pas une promotion.

---

## DATA & ANALYTICS

### Stack recommandé
| Outil | Usage | Coût |
|---|---|---|
| Google Analytics 4 | Events e-commerce, conversions, mobile vs desktop | Gratuit |
| Microsoft Clarity | Heatmaps + session recordings illimités | Gratuit |
| Shopify Analytics | Rapports natifs produits/trafic | Inclus |
| Klaviyo | Revenue email, comportements CRM, 6 flows | ~100€/mois |
| Axeptio | RGPD/CNIL consent banner (made in France) | ~50€/mois |
| Judge.me | Avis produits (snippet tira-reviews) | ~15€/mois |
| Gorgias | Live chat concierge (optionnel) | ~10€/mois |
| Alma | 3× sans frais (intégration checkout) | % commission |

### KPIs cibles (luxe maroquinerie)
```
CVR            → 1.5–2.5%
AOV            → > 2 000€
LTV 12 mois   → > 4 000€
Abandon panier → < 65%
Scroll depth   → > 70% pages édito
Temps produit  → > 2 min
Search usage   → > 15% des sessions
```

---

## PRIVACY & RGPD

- **Axeptio** (made in France, CNIL-compliant) — obligatoire avant tout tracking
- Server-side tracking via Shopify Pixels API (récupère ~80% data malgré bloqueurs)
- Politique de confidentialité à jour
- Droit à l'oubli + portabilité des données

---

## RECOMMANDATIONS UX INTÉGRÉES

| Feature | Spec |
|---|---|
| Sticky ATC mobile | `position: fixed; bottom: 0` sur fiche produit |
| Lightbox galerie | Clic → plein écran + clavier + swipe mobile |
| Color swatches | Chips 24×24px + tooltip nom couleur + changement galerie en live |
| Quick view | Hover card → modal produit (desktop) |
| Recently viewed | localStorage, 4 produits, bas de fiche produit |
| Zoom produit | Zone 3× bas-droit, hover desktop uniquement |
| Mini-header produit | Après 300px scroll : nom + prix + ATC |
| Search overlay | "Demander à Tiraboschi" → overlay full, résultats instantanés |
| Filtres collection | Sticky top desktop / bottom sheet mobile |
| Wishlist | ❤️ sur cards → page `/pages/wishlist` + partage par lien |
| Waiting list | Formulaire email sur produit rupture → Klaviyo list |
| Gift wrapping | Toggle dans checkout + message manuscrit |
| Mega-menu | Hover nav → image éditoriale à droite (desktop uniquement) |
| Magnetic buttons | CTAs principaux attirent le curseur à 60px (desktop uniquement) |
| Smooth scrolling | Lenis sur desktop, natif sur mobile |
| Page transitions | Fondu blanc 350ms entre chaque page |

---

## CHECKLIST ANTI-RÉGRESSION

```
Avant tout push sur thème test :

□ Vidéo hero : 9:16 sur mobile, 16:9 sur desktop
□ Header transparent sur homepage (logo blanc)
□ Header opaque sur autres pages (logo noir)
□ Sticky directionnel fonctionne
□ body.hdr-hidden ajouté au JS quand header masqué
□ Picto panier = SVG forme V
□ Marquee défile correctement
□ Scroll stack fonctionne
□ Ken Burns actif sur DSCF1828 et BOSCHI0919
□ Playfair Display chargée
□ 0px border-radius partout
□ Boutons = texte souligné uniquement
□ Mega-menu : image change au hover (Phase 3B)
□ Transitions pages : fondu 350ms
□ Lenis : actif desktop, désactivé mobile
□ Splash screen : 1× par session uniquement
□ Swatches couleur → changement galerie fiche produit
□ Footer complet + newsletter
□ Pas de "Powered by Shopify"
□ ATC fonctionne sur fiches produit
□ Panier drawer fonctionne
□ Checkout accessible
□ Mobile : vidéos lisent (autoplay muted playsinline)
□ Mobile : carousel galerie swipeable
□ Mobile : sticky ATC visible
□ Mobile : bottom sheet filtres fonctionne
□ Pas d'erreurs console

Règles structurelles (à l'origine de bugs réels — recette 31/07/2026) :
□ UNE seule convention de reveal : data-reveal/data-tira-reveal observés par
  tiraboschi.js, qui pose 'visible' ET 'is-visible'. Ne jamais réimplémenter
  un IntersectionObserver ou un word-split dans un <script> inline de section.
□ Aucun <script> inline de section ne doit utiliser un sélecteur GLOBAL déjà
  traité par tiraboschi.js ([data-words], .card__wish, [data-reveal]...) :
  le double traitement casse le rendu.
□ Commentaires Liquid = {% comment %}, JAMAIS {# #} (syntaxe Jinja, émise
  littéralement — a invalidé tout le JSON-LD du site).
□ Tout {% if form.posted_successfully? %} doit être À L'INTÉRIEUR du {% form %}
  (hors du bloc, l'objet form est nil et la confirmation ne s'affiche jamais).
□ Ne jamais faire textContent= sur un élément qui contient une icône
  (ex: [data-cart-count] porte l'<img> du picto sac).
□ Toute classe utilisée en Liquid doit avoir une règle CSS — sinon élément nu.
□ [hidden] PERD contre display:flex/grid posé par une classe. Déclarer une fois
  `[hidden]{display:none!important}` — sinon un élément « masqué » en JS reste
  affiché (filtres de famille et flèches visibles sur un écran d'option).
□ Un overlay plein écran doit déclarer SA propre couleur de texte. S'il hérite
  du body et que le body change de thème (body.clair), on obtient du noir sur
  noir — contraste mesuré 1.00:1.
□ Un cover flow qui se reconstruit (innerHTML='') ne s'anime jamais : les
  nœuds naissent déjà à leur transform final. Garder les cartes, ne changer
  que le transform.
□ Une tuile de texture doit être vérifiée seamless (saut au raccord < 1.6× le
  saut interne). PIL.resize et feTurbulence non tuilés laissent des coutures.
□ background-size ≠ taille native de l'image = rééchantillonnage, et Chromium
  ne boucle pas le filtrage : coutures visibles. Utiliser la taille native.
□ Un repère positionné en % de la section peut tomber sous une barre fixe :
  le cantonner à la bande réellement libre (top/bottom du conteneur).
□ Un descendant qui REDÉCLARE `visibility:visible` redevient visible ET
  cliquable même si son conteneur est masqué (`visibility:hidden`). Une
  scène/sous-barre à l'intérieur d'un lieu masqué doit hériter :
  `.x:not(.on){visibility:hidden}` + rien sur `.x.on`, ou `visibility:inherit`.
  Deux bugs réels : un bouton fantôme interceptait les clics du lieu affiché.
□ Un sélecteur à ID (`#lieu > *`) écrase la `position` d'une classe
  (`.scene{position:absolute}`) : empiler avec `z-index` sur un sélecteur
  qui ne touche PAS `position`.
□ Un décor surdimensionné (arc, halo) crée du défilement latéral s'il n'est
  pas borné à la plus petite dimension ET clippé par son conteneur.
□ Un indicateur en surimpression (`position:absolute; bottom:0`) finit par
  recouvrir un contenu long : le mettre dans le flux, en dernière rangée.
□ `aspect-ratio` ne donne PAS sa hauteur à une ligne de grille `auto`
  (Chromium) : la ligne se mesure sur le contenu, le contenu sur la ligne,
  et tout se superpose. Sur une grille qui se replie, revenir au procédé
  sûr — largeur en %, hauteur en `padding-top:%` — qui se résout toujours
  contre une largeur définie.
□ Un élément dont la largeur vient de son contenu et dont le contenu fait
  `width:100%` (une image dans un cadre en `aspect-ratio`) se mesure à
  ZÉRO. Dimensionner le cadre en pixels depuis le JS quand il sert de
  cible d'animation.
□ Mesurer un chevauchement avec `getBoundingClientRect` pendant une
  animation de révélation donne de faux positifs : utiliser `offset*`,
  qui décrit la mise en page et ignore les transformations.
□ `display:flex` sur un titre transforme chaque enfant en élément de
  flex : la gouttière s'insère après l'apostrophe (« L' Atelier »).
  Garder le flux inline pour un texte.
□ `visibility` ne s'interpole PAS : en passant à `hidden`, elle reste
  `visible` pendant toute la transition. Un calque refermé continue donc
  d'intercepter les clics — ajouter `pointer-events:none` sur l'état
  fermé, sinon le lieu que l'on vient d'ouvrir est sourd une seconde.
□ Un rail « à demeure » posé en `position:absolute` dans un conteneur
  qui défile part avec la page : le poser en `fixed` (le lieu parent est
  déjà `position:fixed`).
□ Une `<img>` sans `src` compte comme cassée : lui donner un pixel
  transparent en amorce.
```

---

## PARTICULARITÉS HORIZON

```
sections JSON     → schéma strict, block types doivent exister dans le .liquid
color_scheme      → doit référencer un scheme dans config/settings_data.json
header            → dans sections/header-group.json (pas header.liquid)
grille mobile     → câblée "leftA leftB center rightA rightB" → overrider CSS
custom-liquid     → type section pour HTML custom
_product-card     → type bloc privé Horizon
footer-utilities  → bloc spécial copyright + policy links
search_row:bottom → search sous le header (natif Horizon)
transparent_home  → enable_transparent_header_home: true
```

---

## EN CAS DE DOUTE

1. Consulter `TIRABOSCHI_cahier_des_charges_complet.md` pour les specs détaillées
2. Consulter `ROADMAP.md` pour le benchmark grandes maisons + priorités
3. Consulter `VALIDATION.md` pour les retours client en cours
4. Référence visuelle : miumiu.com · louisvuitton.com · tagheuer.com · audemarspiguet.com
5. Ne pas improviser → implémenter neutre + `<!-- TODO: valider client -->`
6. Toujours tester mobile avant de considérer une tâche terminée
7. `tiraboschi-homepage-prototype.html` = référence d'expérience validée

---

*CLAUDE.md v4.0 — TIRABOSCHI Paris — Mai 2025*
*Mis à jour : benchmark 5 grandes maisons · 24 prototypes · Lenis · page transitions · splash · mega-menu · magnetic buttons · video scrub · pages Icônes · CRM flows détaillés · agent IA search (Phase 5)*
