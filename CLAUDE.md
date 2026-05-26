# TIRABOSCHI Paris — Instructions Claude Code v3.0
> Document de travail principal. Lu automatiquement à chaque session.
> Référence détaillée complète : `TIRABOSCHI_cahier_des_charges_complet.md`
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

**Références UX :**
- **Miu Miu** → structure globale, header, animations, scroll stack, collection, marquee
- **Tag Heuer** → storytelling fiche produit, tableau specs, sections craft immersives
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
- Italic autorisé pour citations uniquement

### Règles design
| Règle | Valeur |
|---|---|
| Border-radius | **0px** — partout, toujours |
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

---

## PÉRIMÈTRE COMPLET DU PROJET

### Pages à créer / refaire
| Page | Fichiers | Priorité |
|---|---|---|
| Header + Footer | `sections/header-group.json` + `footer-group.json` | P0 |
| Homepage | `templates/index.json` | P0 |
| Collection | `templates/collection.json` + `assets/tiraboschi-collection.css` | P1 |
| Fiche produit | `templates/product.json` + `sections/product-tiraboschi.liquid` + `assets/tiraboschi-product.css` | P1 |
| Page histoire | `templates/page.histoire.json` | P2 |
| Page savoir-faire | `templates/page.savoir-faire.json` | P2 |
| Page matières | `templates/page.matieres-cuirs.json` | P2 |
| Page sur-mesure | `templates/page.sur-mesure.json` | P2 |
| La Société | `templates/page.la-societe.json` + `sections/tira-la-societe.liquid` | P2 |
| Blog | `templates/blog.json` | P3 |
| Article | `templates/article.json` | P3 |
| Recherche | `templates/search.json` | P3 |
| 404 | `templates/404.json` | P3 |
| Compte client | Style Shopify natif + intégration La Société | P4 |
| Checkout | Branding logo/couleurs/police (limite Shopify standard) | P4 |

### CRM & Fidélité
| Étape | Élément |
|---|---|
| Snippets | `tira-newsletter-popup.liquid` · `tira-back-in-stock.liquid` · `tira-reviews.liquid` |
| Flows Shopify | Loyalty-member (1er achat) · Loyalty-artisan (2e/5000€) · Abandon panier · Post-achat · Win-back |
| La Société | Cercle I Membre / Cercle II Artisan / Cercle III Maison |

---

## FICHIERS CUSTOM — À MODIFIER LIBREMENT
```
assets/tiraboschi.css                     ← CSS global (tokens, animations, layouts)
assets/tiraboschi.js                      ← JS (scroll reveals, marquee, curseur, lazy video)
assets/tiraboschi-header.css              ← CSS header mobile
assets/tiraboschi-collection.css          ← CSS page collection (à créer)
assets/tiraboschi-product.css             ← CSS fiche produit (à créer)
snippets/icon-bag-tiraboschi.liquid       ← SVG picto panier forme V ← RÉCUPÉRER
snippets/header-actions.liquid            ← Actions header
snippets/tiraboschi-homepage-stack.liquid ← CSS scroll stack
snippets/tira-newsletter-popup.liquid     ← Popup newsletter (à créer)
snippets/tira-back-in-stock.liquid        ← Retour stock (à créer)
snippets/tira-reviews.liquid              ← Avis produits (à créer)
layout/theme.liquid                       ← Injecte CSS + JS custom
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
| Pages | `histoire` · `savoir-faire` · `matieres-cuirs` · `a-propos` · `sur-mesure` · `contact` · `prendrez-rendez-vous` |
| Blog | `latelier` (3 articles : `couture-sellier` · `guide-cuirs-maroquinerie-luxe` · `pourquoi-sac-made-in-france-prix`) |

### Métafields produits
```
custom.composition  → cuir, matière, couleurs
custom.fabrication  → artisan, lieu, durée
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

## ÉTAT D'AVANCEMENT

### ✅ Validé
- CSS global + tokens (`assets/tiraboschi.css`)
- JS animations (`assets/tiraboschi.js`)
- Layout `theme.liquid` (injection CSS/JS)
- Homepage 7 sections (`templates/index.json`)
- Header (`sections/header-group.json`)
- Footer (`sections/footer-group.json`)
- Color schemes (`config/settings_data.json`)
- Picto panier SVG custom (`snippets/icon-bag-tiraboschi.liquid`)
- Scroll stack CSS (`snippets/tiraboschi-homepage-stack.liquid`)
- **Prototype homepage HTML** — expérience + animations ✅ / contenu à aligner ⚠️

### 🔲 Phase actuelle — Audit + Prototype fidèle
- [ ] Audit écarts prototype vs cahier des charges
- [ ] Correction prototype HTML (specs exactes + contenu réel)
- [ ] Validation visuelle client

### 🔲 À faire — dans l'ordre
1. Template collection (P1)
2. Fiche produit storytelling (P1)
3. Pages éditoriales (P2)
4. La Société (P2)
5. Blog + Article (P3)
6. Search + 404 (P3)
7. Compte client + Checkout (P4)
8. CRM + Snippets fidélité (P4)
9. SEO/GEO/Performance (P5)
10. Data & Analytics (P5)
11. Tests mobile iOS + Android (P5)
12. Checklist anti-régression complète (P5)

---

## PLAN DE DÉVELOPPEMENT — 4 PHASES

```
Phase 1 — Audit        : Comparer prototype vs cahier des charges → liste d'écarts
Phase 2 — Prototype    : Corriger + compléter en HTML pur (toutes pages)
Phase 3 — Shopify      : Convertir en Liquid + intégrer sur thème test
Phase 4 — Contenu réel : Brancher vraies images/vidéos/produits + tests
```

**Méthode** : Itérer sur HTML pur (instantané) → valider → convertir en Liquid.
Ne jamais travailler à l'aveugle sur Shopify.

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

---

## SEO — EXIGENCES TECHNIQUES

### JSON-LD par type de page
```
Homepage    → Organization + WebSite + SearchAction
Collection  → CollectionPage + BreadcrumbList
Produit     → Product + BreadcrumbList + AggregateRating
Page édito  → Article + BreadcrumbList
Blog        → Blog + BreadcrumbList
Article     → Article + Author + BreadcrumbList
```

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
- Schema `AggregateRating` sur fiches produit
- NAP cohérent partout (Nom · Adresse · Contact)
- Articles de blog → liens internes vers pages éditoriales

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

---

## DATA & ANALYTICS

### Stack recommandé
| Outil | Usage | Coût |
|---|---|---|
| Google Analytics 4 | Events e-commerce, conversions, mobile vs desktop | Gratuit |
| Microsoft Clarity | Heatmaps + session recordings illimités | Gratuit |
| Shopify Analytics | Rapports natifs produits/trafic | Inclus |
| Klaviyo | Revenue email, comportements CRM | ~100€/mois |
| Axeptio | RGPD/CNIL consent banner | ~50€/mois |

### KPIs cibles (luxe maroquinerie)
```
CVR            → 1.5–2.5%
AOV            → > 2 000€
LTV 12 mois   → > 4 000€
Abandon panier → < 65%
Scroll depth   → > 70% pages édito
Temps produit  → > 2 min
```

---

## PRIVACY & RGPD

- **Axeptio** (made in France, CNIL-compliant) — obligatoire avant tout tracking
- Server-side tracking via Shopify Pixels API (récupère ~80% data malgré bloqueurs)
- Politique de confidentialité à jour
- Droit à l'oubli + portabilité des données

---

## PROGRAMME FIDÉLITÉ — LA SOCIÉTÉ

| Cercle | Seuil | Avantages clés |
|---|---|---|
| I — Membre | 1er achat | Livraison prioritaire, early access, packaging cadeau |
| II — Artisan | 2e achat ou > 5 000€ | + carte physique, éditions limitées, visite atelier |
| III — Maison | Invitation > 15 000€ | + relation directe fondatrice, pièce exclusive annuelle |

**Règle absolue** : jamais points, remises, barres de progression.
**Langage** : "La Société", "vos privilèges" — jamais "programme fidélité".

---

## RECOMMANDATIONS UX INTÉGRÉES

| Feature | Spec |
|---|---|
| Sticky ATC mobile | `position: fixed; bottom: 0` sur fiche produit |
| Lightbox galerie | Clic → plein écran + clavier + swipe mobile |
| Color swatches | Chips 24×24px + tooltip nom couleur |
| Quick view | Hover card → modal produit (desktop) |
| Recently viewed | localStorage, 4 produits, bas de fiche produit |
| Zoom produit | Zone 3× bas-droit, hover desktop uniquement |
| Mini-header produit | Après 300px scroll : nom + prix + ATC |
| Search overlay | Clic icône → overlay full, résultats instantanés |
| Filtres collection | Sticky top desktop / bottom sheet mobile |

---

## CHECKLIST ANTI-RÉGRESSION

```
Avant tout push sur thème test :

□ Vidéo hero : 9:16 sur mobile, 16:9 sur desktop
□ Header transparent sur homepage (logo blanc)
□ Header opaque sur autres pages (logo noir)
□ Sticky directionnel fonctionne
□ Picto panier = SVG forme V
□ Marquee défile correctement
□ Scroll stack fonctionne
□ Ken Burns actif sur DSCF1828 et BOSCHI0919
□ Playfair Display chargée
□ 0px border-radius partout
□ Boutons = texte souligné
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
2. Référence visuelle : miumiu.com + tagheuer.com
3. Ne pas improviser → implémenter neutre + `<!-- TODO: valider client -->`
4. Toujours tester mobile avant de considérer une tâche terminée
5. `tiraboschi-homepage-prototype.html` = référence d'expérience validée

---

*CLAUDE.md v3.0 — TIRABOSCHI Paris — Mai 2025*
*Mis à jour : périmètre complet · Miu Miu + Tag Heuer · mobile-first vidéo · SEO/GEO · data · UX*
