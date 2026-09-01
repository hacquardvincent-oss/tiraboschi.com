# TIRABOSCHI Paris — Roadmap stratégique
> Analyse comparative vs. Miu Miu · Louis Vuitton · Tag Heuer · Audemars Piguet · Hermès
> Complète le cahier des charges existant (CLAUDE.md)

---

## ÉTAT DU SOCLE ACTUEL

✅ **Ce qu'on a déjà** (14 prototypes validés + Shopify en cours)
- Header Miu Miu, scroll stack, marquee, curseur custom
- Collection grid, hover crossfade, bottom sheet filtres
- Fiche produit storytelling 6 sections (Tag Heuer), galerie lightbox, sticky ATC
- Pages éditoriales complètes (Histoire, Savoir-Faire, Matières, Sur Mesure, La Société)
- Blog + Article + Search + 404 + Compte client + Checkout

Ce socle est **solide et cohérent**. Ce qui suit, c'est ce qui sépare "très bon thème custom" de "expérience grande maison".

---

## NIVEAU 1 — LES FONDATIONS MANQUANTES
*Ces éléments changent la perception globale du site entier. À faire en priorité absolue.*

---

### 1.1 — Smooth Scrolling (Lenis)
**Impact : ⭐⭐⭐⭐⭐ / Effort : faible**

C'est la différence la plus perceptible entre un Shopify et Miu Miu ou LV — même sans savoir pourquoi, les gens ressentent immédiatement que "ça ne défile pas pareil". Le scroll natif du navigateur est abrupt. Lenis ajoute du momentum, de la fluidité, une inertie qui donne du "poids" au contenu.

**Ce que ça change :**
- Chaque scroll reveal devient plus cinématique
- Les sections sticky stacking "glissent" au lieu de claquer
- Le parallax devient vraiment parallax

**Implémentation :**
```html
<!-- Dans theme.liquid, avant </body> -->
<script src="https://unpkg.com/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
<script>
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
// Désactiver sur touch pour conserver le scroll natif mobile
if ('ontouchstart' in window) lenis.destroy();
</script>
```
**Note :** Désactivé automatiquement sur mobile (le scroll natif iOS est déjà très bien).

---

### 1.2 — Transitions entre pages
**Impact : ⭐⭐⭐⭐⭐ / Effort : faible**

Actuellement, chaque clic de navigation = rechargement brutal. LV, Miu Miu, AP : le contenu s'estompe doucement (300ms), la nouvelle page apparaît. Ça transforme la navigation en expérience éditoriale continue.

**Implémentation simple (Shopify-compatible) :**
```css
/* Dans tiraboschi.css */
.page-transition-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: var(--tira-white);
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s var(--tira-ease);
}
.page-transition-overlay.active { opacity: 1; pointer-events: all; }
```
```js
// Intercept tous les liens internes
document.querySelectorAll('a[href^="/"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.href;
    overlay.classList.add('active');
    setTimeout(() => window.location.href = href, 300);
  });
});
// Au chargement, masquer l'overlay
window.addEventListener('load', () => overlay.classList.remove('active'));
```

---

### 1.3 — Mega-menu avec image éditoriale
**Impact : ⭐⭐⭐⭐ / Effort : moyen**

*Présent chez tous les 5 benchmarks.* Hover sur "Collections" dans la nav → le menu s'ouvre avec une image de campagne qui change selon le sous-menu survolé. Signal visuel fort que c'est une vraie maison, pas un marchand.

**Structure :**
```
[Collections]  hover  →  ┌──────────────────────────────────┐
                          │ FW25           │                 │
                          │ Sacs           │  IMAGE CAMPAGNE │
                          │ Petite maro.   │  qui change     │
                          │ Iconiques      │  selon le hover │
                          │ Sur Mesure     │                 │
                          └──────────────────────────────────┘
```

**Priorité à prototyper** avant intégration Shopify.

---

### 1.4 — Swatches couleur = changement gallery en live
**Impact : ⭐⭐⭐⭐⭐ / Effort : faible**

*Présent chez tous les 5 benchmarks.* Actuellement nos swatches changent un label. Il faut que cliquer sur "Marine" charge les photos du sac en Marine. C'est la feature e-commerce la plus basique du luxe et la plus attendue par les clientes.

**Sur Shopify :** chaque variant couleur = ses propres images dans la galerie. Le JS écoute le changement de variant et met à jour `galleryImages`.

---

## NIVEAU 2 — LES PAGES MANQUANTES
*Pages que les grandes maisons ont toutes et que TIRABOSCHI n'a pas encore.*

---

### 2.1 — Pages "Icônes" par modèle
**Impact : ⭐⭐⭐⭐⭐ / Effort : moyen**
**URLs cibles :** `/pages/victoire` · `/pages/colette` · `/pages/rafael`

C'est ce qui distingue LV, AP et Hermès d'un catalogue produit ordinaire. Le **Kelly** et le **Speedy** ont leur propre page d'histoire. La **Royal Oak** a la sienne. Ces pages racontent *pourquoi ce modèle existe*, pas seulement ce qu'il contient.

**Structure pour chaque modèle :**
```
1. Hero full-viewport (photo campaign du modèle)
2. Origine du nom + année de création
3. La silhouette : pourquoi cette forme (en V pour TIRABOSCHI ?)
4. Toutes les matières disponibles (gallery swatches)
5. Toutes les couleurs saison (carousel)
6. "Ce que les femmes en disent" (avis éditorialisés, pas notes/étoiles)
7. Dimensions + contenances ("tient un A4 / ordinateur 13" / ...")
8. Séquence de fabrication (photos atelier spécifiques à ce modèle)
9. CTA : Découvrir / Commander / Personnaliser
```

**À créer :** `tiraboschi-icone-victoire-prototype.html` (servira de template pour les autres)

---

### 2.2 — Page Contact + Booking RDV
**Impact : ⭐⭐⭐⭐ / Effort : faible**
**URL cible :** `/pages/contact`

On a des liens "Prendre rendez-vous" partout mais aucune destination. AP, Tag Heuer et Hermès ont une expérience de booking premium.

**Structure :**
```
1. Header : "Rencontrons-nous"
2. Adresse atelier (carte embedée, photos de l'atelier)
3. Horaires + accès
4. 3 motifs de RDV : Conseil & Essai / Sur Mesure / Entretien & Réparation
5. Formulaire ou embed Calendly
6. Alternative : "Nous écrire" + numéro (discret, pas mis en avant)
7. "Pour les clients internationaux : visioconférence disponible"
```

---

### 2.3 — Page Entretien & Réparation
**Impact : ⭐⭐⭐⭐ / Effort : faible**
**URL cible :** `/pages/entretien-reparation`

*Présente chez LV, Tag Heuer, AP, Hermès.* C'est une promesse de marque extrêmement forte : une pièce TIRABOSCHI ne devient pas obsolète. **Différenciante** car les grandes maisons ne réparent plus vraiment (temps trop long, coût) — TIRABOSCHI peut en faire un vrai avantage.

**Structure :**
```
1. "Une pièce TIRABOSCHI est faite pour durer"
2. Services proposés :
   - Nettoyage & conditionnement annuel
   - Recouture (sellier)
   - Recoloriage (teinture)
   - Remplacement quincaillerie
   - Réfection doublure
3. Comment ça fonctionne : envoyer / déposer / rendez-vous
4. Délais indicatifs
5. Tarifs : "Sur devis, selon le travail" (pas de grille)
6. Garantie : "Pièce garantie à vie si entretenue chez nous"
7. Formulaire de demande
```

---

### 2.4 — Page Campagne / Lookbook FW25
**Impact : ⭐⭐⭐⭐ / Effort : moyen**
**URL cible :** `/pages/fw25` ou `/collections/fw25`

*Présente chez tous les 5 benchmarks.* Distincte de la page Collection — c'est une expérience narrative avec les photos de campagne, pas un catalogue. Les produits y sont shoppables mais ce n'est pas l'objectif premier.

**Structure :**
```
1. Splash vidéo 100vh (muted, autoplay)
2. Titre campagne (ex: "Printemps Permanent · FW25")
3. Séquence 4–6 images plein écran (scroll vertical)
4. Chaque image : un produit visible → tooltip/tag shoppable au hover
5. CTA final : "Découvrir la collection complète"
```

**Note :** Nécessite les photos de campagne réelles.

---

### 2.5 — Page Cadeaux
**Impact : ⭐⭐⭐ / Effort : faible**
**URL cible :** `/pages/cadeaux`

*Présente chez LV, Miu Miu, Hermès.* Fort sur les pics saisonniers (Noël, Fête des Mères, anniversaires). Peut générer 15–20% du CA en période de fêtes.

**Structure :**
```
1. "Offrir TIRABOSCHI"
2. Filtres par budget : < 500€ / 500–2000€ / 2000€+
3. Guide d'achat éditorial (3 profils : "Pour elle" / "Pour une première pièce" / "L'investissement")
4. Gift card (carte cadeau numérique)
5. Le packaging cadeau TIRABOSCHI (unboxing visuel)
6. Message manuscrit inclus
7. Livraison directe au destinataire
```

---

### 2.6 — Page Presse
**Impact : ⭐⭐ / Effort : très faible**
**URL cible :** `/pages/presse`

*Présente chez tous les 5 benchmarks.* Les journalistes qui découvrent TIRABOSCHI ont besoin d'un accès immédiat aux assets.

**Structure simple :**
```
1. "Relations Presse" + contact attachée de presse (email)
2. Kit presse téléchargeable (PDF avec visuels HD + biographie)
3. Revue de presse (logos médias + extraits de citations)
4. Photos HD téléchargeables (fichiers zip)
5. Biographie fondatrice en 3 formats (court/moyen/long)
```

---

### 2.7 — Page RSE / Engagement
**Impact : ⭐⭐⭐ / Effort : faible**
**URL cible :** `/pages/engagement`

*Présente chez LV, Tag Heuer, AP, Hermès.* Pour TIRABOSCHI c'est **déjà une réalité** (Made in France, cuirs sourcés, un seul artisan par pièce = zéro gaspillage) — il suffit de l'articuler.

**Arguments forts :**
- Made in France = traçabilité totale
- Un artisan par pièce = aucun surplus de production
- Cuirs pleine fleur = aucun traitement chimique de surface
- Longévité : une pièce = 30 ans vs. fast-fashion = 2 ans
- Tanneries françaises = circuit court, contrôle qualité
- Réparable à vie = anti-obsolescence programmée

---

### 2.8 — Pages Wishlist + "Récemment vu"
**Impact : ⭐⭐⭐ / Effort : faible**
**URLs :** `/pages/wishlist` (compte requis ou localStorage)

*Présente chez LV, Miu Miu, Tag Heuer.* Le cœur existe déjà (icône ❤️ sur les cards). Il faut juste la destination.

**Wishlist :**
- Liste des produits sauvegardés
- Partage de liste par lien (fort pour les cadeaux)
- Notification si prix baisse ou retour en stock
- CTA "Envoyer à un proche" (email)

**Récemment vu :**
- 4 produits en bas de chaque fiche produit (localStorage)
- Déjà prévu dans CLAUDE.md — à implémenter en Phase 3

---

## NIVEAU 3 — L'AGENT IA DANS LA SEARCH
*La feature la plus différenciante du marché en 2025. Aucune maison de luxe française indépendante ne l'a vraiment faite.*

---

### Architecture "Demander à Tiraboschi"

```
[Barre de recherche : "Demander à Tiraboschi"]
              ↓ clic ou focus
    ┌──────────────────────────────────────────────┐
    │  OVERLAY PLEIN ÉCRAN                         │
    │                                              │
    │  "un sac pour aller au bureau"               │
    │  ___________________________________________  │
    │                                              │
    │  Réponse :                                   │
    │  "Pour un usage bureau, la Victoire et la    │
    │   Jane sont vos meilleures alliées. La Jane  │
    │   passe en cabine avion et tient un A4."     │
    │                                              │
    │  ┌──────┐ ┌──────┐ ┌──────┐                 │
    │  │Victo.│ │Jane  │ │Colet.│                 │
    │  │2850€ │ │2650€ │ │2290€ │                 │
    │  └──────┘ └──────┘ └──────┘                 │
    │                                              │
    │  "Parler à un conseiller →"                  │
    └──────────────────────────────────────────────┘
```

**Requêtes naturelles à gérer :**
- "un sac pour le bureau qui tient un ordi"
- "cadeau pour ma mère autour de 2000€"
- "quelque chose dans les tons cognac ou caramel"
- "je cherche quelque chose de similaire au Celine Triomphe"
- "quel sac recommandez-vous pour voyager"
- "différence entre la Victoire et la Colette"
- "qu'est-ce qui se fait sur mesure ?"

**Stack technique :**
```
Layer 1 : Shopify Storefront Search API
          → résultats produits, collections, articles
          → gratuit, déjà dispo sur Shopify

Layer 2 : Claude API (claude-haiku-4-5, rapide + pas cher)
          → reçoit la requête + catalogue produits
          → génère 1 phrase de réponse éditoriale
          → classe/filtre les produits pertinents
          → suggère des actions (RDV, contact conseiller)

Cache : localStorage 24h pour les requêtes fréquentes
Proxy : Netlify Function ou Shopify Proxy pour cacher la clé API
```

**Coût estimé :** Claude Haiku ≈ 0,001€ par recherche → 1000 recherches/mois = 1€

**Ce que ça donne vs. la concurrence :**
| | Search standard | Shopify AI Search | "Demander à Tiraboschi" |
|---|---|---|---|
| Requête exacte | ✓ | ✓ | ✓ |
| Langage naturel | ✗ | Partiel | ✓ |
| Conseil éditorial | ✗ | ✗ | ✓ |
| Comparaison modèles | ✗ | ✗ | ✓ |
| Ton de marque | ✗ | ✗ | ✓ |
| Escalade conseiller | ✗ | ✗ | ✓ |

---

## NIVEAU 4 — CRM & FLOWS KLAVIYO
*Déjà dans le cahier des charges — à implémenter en Phase 4*

### 6 flows à configurer

| Flow | Déclencheur | Séquence | Objectif |
|---|---|---|---|
| **Loyalty-member** | 1er achat confirmé | Email J+0 : "Bienvenue dans La Société · Cercle I" | Fidélisation initiale |
| **Loyalty-artisan** | 2e achat **ou** CA > 5 000€ | Email J+0 : upgrade Cercle II + annonce carte physique | Montée en valeur |
| **Abandon panier** | Panier > 30min sans achat | J+1h (éditorial) · J+24h (social proof) · J+72h (concierge) | Récupération CA |
| **Post-achat** | 3 jours après livraison confirmée | Conseils entretien + photo artisan + invitation à partager | Satisfaction + UGC |
| **Win-back** | 6 mois sans achat | J+0 (article éditorial) · J+15 (nouveauté exclusive) | Réactivation |
| **Back-in-stock** | Produit de retour en stock | Email immédiat (< 1h) aux inscrits | Conversion rupture |

**Règle absolue :** Aucun flow ne contient de code promo, de "solde", de "remise". Le luxe ne brade pas. On relance par le désir, pas par le prix.

### 3 snippets Liquid à créer

| Snippet | Comportement | Déclencheur |
|---|---|---|
| `tira-newsletter-popup.liquid` | Overlay centré · fond flouté · 1× / 30 jours · cookie | 8s après arrivée ou 40% scroll |
| `tira-back-in-stock.liquid` | Field email sur fiche produit rupture → Klaviyo list | Produit `sold_out` |
| `tira-reviews.liquid` | Bloc avis éditorialisés (Judge.me ou Okendo) | Toutes fiches produit |

---

## NIVEAU 5 — ANIMATIONS MANQUANTES
*Features d'animation présentes chez les 5 benchmarks que nos prototypes n'ont pas encore*

### 5.1 — Video scrub on scroll
*LV, Tag Heuer, AP.* La vidéo se joue en fonction de la position de scroll — pas en autoplay. L'utilisateur "contrôle" le film en scrollant. Très impressionnant sur les sections savoir-faire.

```js
// Sur la section "L'artisan au travail"
const video = document.querySelector('.tira-scrub-video');
window.addEventListener('scroll', () => {
  const section = video.closest('section');
  const rect = section.getBoundingClientRect();
  const progress = 1 - (rect.bottom / (rect.height + window.innerHeight));
  video.currentTime = Math.max(0, Math.min(video.duration * progress, video.duration));
}, { passive: true });
```

### 5.2 — Color scheme shift on scroll
*LV, Tag Heuer, AP.* La page passe automatiquement de fond blanc à fond noir à fond crème selon la section visible. Déjà partiellement dans nos prototypes (sections alternées) mais sans transition CSS fluide entre les sections.

```js
// IntersectionObserver sur chaque section avec data-scheme
document.querySelectorAll('[data-scheme]').forEach(section => {
  observer.observe(section); // → document.body.dataset.scheme = section.dataset.scheme
});
```

### 5.3 — Magnetic buttons
*Miu Miu.* Les boutons/CTA "attirent" le curseur quand il s'approche à 60px. Subtil mais perceptible — renforce l'impression d'interface "vivante".

```js
document.querySelectorAll('.tira-magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width/2) * 0.3;
    const y = (e.clientY - rect.top - rect.height/2) * 0.3;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});
```

### 5.4 — Séquence de chargement logo
*LV, Tag Heuer, AP.* 1,5s max au premier chargement : le "T" de TIRABOSCHI se dessine (SVG stroke animation), puis le logo complet apparaît, puis la page. Perçu comme premium, masque le LCP.

```html
<!-- Splash screen dans theme.liquid -->
<div id="tira-splash">
  <svg class="tira-splash__logo"><!-- stroke-dasharray animation --></svg>
</div>
<script>
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('tira-splash').classList.add('hidden'), 1200);
});
</script>
```

### 5.5 — Autocomplete search avec previews images
*LV, Miu Miu, Tag Heuer.* En tapant dans la search, des résultats apparaissent immédiatement sous la barre avec : miniature produit + nom + prix. Pas besoin de valider.

---

## RÉSUMÉ PRIORISÉ — DANS L'ORDRE

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3A — Intégration Shopify (socle)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Header + Footer Liquid
□ Homepage
□ Collection + Fiche produit
□ Swatches couleur → changement gallery ← À FAIRE EN PHASE 3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3B — Fondations "grande maison"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Lenis smooth scrolling (1 journée)
□ Transitions entre pages (1/2 journée)
□ Mega-menu éditorial (1 journée)
□ Séquence de chargement logo (1/2 journée)
□ Magnetic buttons sur CTA principaux

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3C — Pages manquantes (prototypes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Page Icône Victoire (template pour tous les modèles)
□ Page Contact + Booking RDV
□ Page Entretien & Réparation
□ Page Cadeaux
□ Page Lookbook / Campagne FW25

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 — CRM & Snippets
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Klaviyo : 6 flows
□ tira-newsletter-popup.liquid
□ tira-back-in-stock.liquid
□ tira-reviews.liquid (Judge.me)
□ Axeptio RGPD
□ GA4 + Clarity

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 5 — Agent IA Search
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Prototype "Demander à Tiraboschi" HTML
□ Intégration Shopify Storefront Search API
□ Proxy Claude API (Netlify Function)
□ Autocomplete avec images
□ Escalade vers conseiller humain

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 5B — Animations premium
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Video scrub on scroll (1 section clé)
□ Color scheme shift on scroll
□ Autocomplete search avec previews

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 6 — Pages secondaires
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Page RSE / Engagement
□ Page Presse
□ Page Wishlist
□ Récemment vu (localStorage)
□ Page Carrières (optionnel)
```

---

## CE QU'ON N'A PAS BESOIN DE FAIRE

*Certaines features des grandes maisons ne sont pas pertinentes pour TIRABOSCHI à ce stade :*

| Feature | Pourquoi pas |
|---|---|
| 360° product spin | Budget photo important, peu de ROI sur maroquinerie |
| AR try-on | Technique complexe, navigateurs limités, pas adapté au cuir |
| App mobile native | Trafic insuffisant au démarrage pour justifier l'investissement |
| Podcast / vidéo série | Contenu long-form à développer après l'audience (Phase 6+) |
| Store locator | Un seul atelier — une adresse suffit |
| Corporate gifting | Hors positionnement (particuliers CSP++) |
| Investor relations | Non pertinent (maison indépendante) |
| Visual search par image | Complexe, peu de ROI vs. AI conversationnelle |

---

*ROADMAP.md — TIRABOSCHI Paris — Mai 2025*
*Analyse comparative : Miu Miu · Louis Vuitton · Tag Heuer · Audemars Piguet · Hermès*
