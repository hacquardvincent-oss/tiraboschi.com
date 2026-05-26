# TIRABOSCHI Paris — Instructions Claude Code v4.0
> Document de travail principal. Lu automatiquement à chaque session.
> Référence détaillée complète : `TIRABOSCHI_cahier_des_charges_complet.md`
> Roadmap stratégique : `ROADMAP.md`
> Suivi des validations : `VALIDATION.md`
> Prototype homepage validé : `tiraboschi-homepage-prototype.html`

---

## ⛔ RÈGLE ABSOLUE — NE JAMAIS OUBLIER

```
THÈME LIVE    → ID 187554070871 (Phantom)  ← NE JAMAIS TOUCHER
THÈME DE TEST → ID 183983931735 (Horizon)  ← Travailler ICI uniquement
```

---

## SETUP SHOPIFY CLI

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
| `templates/page.cadeaux.json` | Cadeaux | P3 |
| `templates/page.wishlist.json` | Wishlist | P3 |
| `templates/page.presse.json` | Presse | P3 |
| `templates/page.engagement.json` | RSE | P3 |
| `snippets/tira-newsletter-popup.liquid` | Popup newsletter | P3 |
| `snippets/tira-back-in-stock.liquid` | Retour stock | P3 |
| `snippets/tira-reviews.liquid` | Avis produits | P3 |

---

## CRM & FIDÉLITÉ — SPECS COMPLÈTES

### Programme La Société
| Cercle | Seuil | Avantages clés |
|---|---|---|
| I — Membre | 1er achat | Livraison prioritaire, early access, packaging cadeau |
| II — Artisan | 2e achat ou > 5 000€ cumul | + carte physique, éditions limitées, visite atelier, WhatsApp direct |
| III — Maison | Invitation fondatrice > 15 000€ | + relation directe fondatrice, pièce exclusive annuelle, consultation privée |

**Règle absolue** : jamais "points", "remises", "barres de progression", "programme fidélité".
**Langage** : "La Société", "vos privilèges", "votre cercle" — toujours.

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

## ÉTAT D'AVANCEMENT — v4.0

### ✅ Phase 1 & 2 terminées
- CSS global + tokens (`assets/tiraboschi.css`)
- JS animations (`assets/tiraboschi.js`)
- Layout `theme.liquid` (injection CSS/JS)
- Homepage 7 sections (`templates/index.json`)
- Header (`sections/header-group.json`)
- Footer (`sections/footer-group.json`)
- Color schemes (`config/settings_data.json`)
- **14 prototypes HTML validés** (voir liste ci-dessus)
- **10 nouveaux prototypes HTML** (benchmark grandes maisons)
- **Composants démo** (animations + newsletter popup)

### 🔲 Phase actuelle — Recette (validation visuelle)
- [ ] Recette page par page (voir `VALIDATION.md`)
- [ ] Validation contenu réel (textes, images, données)
- [ ] Corrections post-recette

### 🔲 Phase 3 — Intégration Shopify (dans l'ordre)
```
3A — Socle
□ Header + Footer Liquid
□ Homepage
□ Collection + Fiche produit (+ swatches → changement gallery)

3B — Fondations "grande maison"
□ Lenis smooth scrolling (theme.liquid)
□ Transitions entre pages (tiraboschi.js)
□ Splash screen logo (theme.liquid)
□ Mega-menu éditorial (header)
□ Magnetic buttons sur CTA principaux

3C — Pages prioritaires
□ Pages éditoriales P2 (Histoire, Savoir-Faire, Matières, Sur Mesure, La Société)
□ Pages Icônes (Victoire, Colette, Rafael)
□ Contact + Booking RDV
□ Entretien & Réparation
□ Lookbook FW25

3D — Pages secondaires
□ Blog + Article + Search + 404
□ Cadeaux + Wishlist + Presse + RSE
□ Espace client + Checkout branding
```

### 🔲 Phase 4 — CRM & Analytics
```
□ Klaviyo : 6 flows
□ Newsletter popup snippet
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
Phase 2 — Prototypes   ✅ DONE : 24 pages + composants HTML
Phase 3 — Shopify      → EN COURS : Conversion Liquid + intégration thème test
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

### JSON-LD par type de page
```
Homepage          → Organization + WebSite + SearchAction
Collection        → CollectionPage + BreadcrumbList
Produit           → Product + BreadcrumbList + AggregateRating
Page édito        → Article + BreadcrumbList
Page Icône modèle → Product + BreadcrumbList + AggregateRating
Blog              → Blog + BreadcrumbList
Article           → Article + Author + BreadcrumbList + speakable
FAQ               → FAQPage (Sur Mesure, Entretien, La Société, RSE)
Contact           → LocalBusiness + ContactPage + OpeningHoursSpecification
Lookbook          → WebPage + BreadcrumbList + VideoObject
```

### Nouveau métafield à ajouter
```
custom.contenances → "Tient un carnet A5, téléphone, clés, portefeuille. Passe en cabine avion."
```
Afficher dans la section "La Silhouette" des pages Icônes et dans les specs de la fiche produit.

### Checklist SEO par page
- `<title>` : `[Nom produit] — [Collection] | TIRABOSCHI Paris`
- Meta description : 150–160 chars
- H1 unique par page
- Alt texts : `{{ product.title }} — {{ product.type }} TIRABOSCHI Paris`
- Open Graph + Twitter Card sur chaque template
- URL canonique sur variantes produit
- `<link rel="preload" as="image">` sur hero
- `font-display: swap` sur Playfair Display

---

## GEO — GENERATIVE ENGINE OPTIMIZATION

*(Optimisation pour ChatGPT, Perplexity, Google SGE)*

- Contenu encyclopédique dense sur pages éditoriales (600+ mots, dates, faits vérifiables)
- FAQ structurée avec schema `speakable` sur pages clés
- Entités explicites : TIRABOSCHI = marque, fondée 1904, Paris, maroquinerie luxe, artisan unique
- Schema `AggregateRating` sur fiches produit ET pages Icônes
- NAP cohérent partout (Nom · Adresse · Contact)
- Articles de blog → liens internes vers pages éditoriales et pages Icônes
- Pages Icônes → denses en facts vérifiables (3400 points de couture, 48–72h, 1 artisan)

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
