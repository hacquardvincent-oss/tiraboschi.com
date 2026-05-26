# TIRABOSCHI Paris — Suivi de validation prototypes
> **Comment utiliser ce document**
> Pour chaque page : ouvrir le fichier HTML dans un navigateur, noter les retours ici.
> Statuts : 🔲 À valider · ⚠️ Retour en cours · ✅ Validé · 🚫 À refaire

---

## MODE D'EMPLOI RAPIDE

Pour chaque page, répondre aux questions en remplaçant `[ ]` par `[x]` ou en ajoutant un commentaire après `→`.
Exemple :
```
- [x] Structure générale OK
- [ ] Hero → trop sombre, éclaircir de 20%
- [ ] Couleur CTA → changer pour blanc sur fond noir
```
Une fois la page annotée, me la renvoyer ou me dicter les retours.

---

## STATUT GLOBAL

| # | Page | Fichier | Priorité | Statut |
|---|---|---|---|---|
| 1 | Homepage | `tiraboschi-homepage-prototype.html` | P0 | 🔲 |
| 2 | Collection | `tiraboschi-collection-prototype.html` | P1 | 🔲 |
| 3 | Fiche produit | `tiraboschi-product-prototype.html` | P1 | 🔲 |
| 4 | Histoire | `tiraboschi-histoire-prototype.html` | P2 | 🔲 |
| 5 | Savoir-Faire | `tiraboschi-savoir-faire-prototype.html` | P2 | 🔲 |
| 6 | Matières & Cuirs | `tiraboschi-matieres-prototype.html` | P2 | 🔲 |
| 7 | Sur Mesure | `tiraboschi-sur-mesure-prototype.html` | P2 | 🔲 |
| 8 | La Société | `tiraboschi-la-societe-prototype.html` | P2 | 🔲 |
| 9 | Blog L'Atelier | `tiraboschi-blog-prototype.html` | P3 | 🔲 |
| 10 | Article | `tiraboschi-article-prototype.html` | P3 | 🔲 |
| 11 | Search | `tiraboschi-search-prototype.html` | P3 | 🔲 |
| 12 | 404 | `tiraboschi-404-prototype.html` | P3 | 🔲 |
| 13 | Espace client | `tiraboschi-account-prototype.html` | P4 | 🔲 |
| 14 | Checkout | `tiraboschi-checkout-prototype.html` | P4 | 🔲 |

---

## ÉLÉMENTS TRANSVERSAUX (valables sur toutes les pages)

*Ces éléments sont identiques sur chaque page — les valider ici une seule fois.*

### Header
- [ ] Logo : taille OK (28px desktop / 24px mobile)
- [ ] Logo : position OK (centré desktop, gauche mobile)
- [ ] Nav : ordre des liens OK (Collections · La Maison · Sur Mesure · L'Atelier)
- [ ] Picto panier : forme V reconnaissable
- [ ] Comportement scroll : header disparaît en descendant, réapparaît en remontant
- [ ] Search bar : hauteur 44px, placeholder "Demander à Tiraboschi" OK

**Retours header →**

### Footer
- [ ] Colonnes OK (Collections / La Maison / Service + logo)
- [ ] Newsletter OK
- [ ] Liens légaux OK
- [ ] Mobile : accordéon fonctionne

**Retours footer →**

### Typographie
- [ ] Playfair Display chargée correctement
- [ ] Tailles OK (H1 56px, H2 48px, body 14px)
- [ ] Espacements OK

**Retours typo →**

### Curseur custom
- [ ] Point 6px + anneau 30px : OK ou trop discret / trop visible ?
- Choix → `[ ] garder tel quel` `[ ] supprimer` `[ ] modifier`

**Retours curseur →**

---

## PAGE 1 — HOMEPAGE
**Fichier :** `tiraboschi-homepage-prototype.html`
**Référence :** prototype validé en session précédente (header v9)

### Checklist
- [ ] Hero vidéo : ratio 16:9 desktop / 9:16 mobile OK
- [ ] Texte hero : "Made in France, Only. · Since 1904" — wording OK
- [ ] Scroll stack : les 3 panneaux se superposent correctement
- [ ] Section collection : 4 produits affichés, cards OK
- [ ] Marquee : vitesse OK, textes OK
- [ ] Ken Burns sur photo héritage (DSCF1828) : amplitude OK
- [ ] Section newsletter : position + wording OK

### Questions spécifiques
1. Section savoir-faire au scroll : préférez-vous garder le split texte/image ou passer en plein écran ?
2. Les 4 produits mis en avant dans la homepage — lesquels prioriser (actuellement : Victoire, Colette, Rafael, Olympe) ?
3. Le texte hero ("TIRABOSCHI Paris" + tagline) — position bas-gauche OK ou centré préféré ?

**Retours →**

**Statut →** 🔲

---

## PAGE 2 — COLLECTION (FW25)
**Fichier :** `tiraboschi-collection-prototype.html`

### Checklist
- [ ] Hero collection : hauteur 52vh OK ou trop/pas assez ?
- [ ] Filtre sticky : se décale bien quand le header disparaît
- [ ] Grille 4 colonnes desktop / 2 mobile : OK
- [ ] Gap 3px entre les cards (style Miu Miu) : OK
- [ ] Ratio cards 3:4 : OK
- [ ] Hover crossfade 2e image : OK (desktop)
- [ ] Bouton "Ajouter" au hover : OK
- [ ] ❤️ Wishlist coin sup. droit : OK
- [ ] Prix affichés sans décimales (ex: 2 850€) : OK
- [ ] Mobile : FAB "Filtrer & Trier" + bottom sheet : OK

### Questions spécifiques
1. Ordre d'affichage des produits — OK tel quel ou modifier ?
   - Actuel : Victoire · Colette · Rafael · Colette Mini · Jane · Olympe · Pochon · Chaine · Anse
2. Filtres disponibles : Modèle / Matière / Prix — en manque-t-il ? (ex: Couleur ?)
3. Le hero collection : image fixe Ken Burns ou vidéo ambiance ?

**Retours →**

**Statut →** 🔲

---

## PAGE 3 — FICHE PRODUIT (Victoire)
**Fichier :** `tiraboschi-product-prototype.html`

### Checklist
- [ ] Galerie desktop : thumbnails 60×80px + image principale OK
- [ ] Zoom 3× au hover (desktop) : OK
- [ ] Lightbox : s'ouvre au clic, navigation clavier (←/→/Esc) OK
- [ ] Mini-header apparaît après 300px scroll : OK
- [ ] Sélecteur couleur : chips 24×24px OK
- [ ] Bouton ATC desktop : OK (texte souligné)
- [ ] Mobile : carousel swipe galerie OK
- [ ] Mobile : sticky ATC en bas d'écran OK
- [ ] 6 sections storytelling (Savoir-Faire / Matière / Dimensions / Atelier / Entretien / Sur Mesure) : longueur OK
- [ ] "Vous aimerez aussi" : 4 produits carousel OK

### Questions spécifiques
1. Les 6 sections storytelling sous le fold — toutes nécessaires ou en retirer une ? (La plus discutable : "Entretien" ou "Sur Mesure")
2. Tableau de dimensions : format H×L×P suffit ou ajouter "Capacité" (ex: A4 ? Ordinateur 13" ?) ?
3. Vidéo atelier dans la fiche : lecture automatique au scroll ou lecture au clic uniquement ?
4. Nombre de photos dans la galerie : actuellement 5 — OK ou prévoir 8–10 ?

**Retours →**

**Statut →** 🔲

---

## PAGE 4 — HISTOIRE
**Fichier :** `tiraboschi-histoire-prototype.html`

### Checklist
- [ ] Hero Ken Burns (DSCF1828) : OK
- [ ] Timeline 5 événements alternant gauche/droite : lisible OK
- [ ] Dates OK : 1904 · 1938 · 1972 · 2019 · Aujourd'hui
- [ ] Section valeurs (fond noir) : OK
- [ ] Citation fondatrice : OK
- [ ] Chiffres clés (4 cellules) : données OK

### Questions spécifiques
1. Les 5 dates de la timeline — toutes exactes ? Y a-t-il des événements à ajouter/corriger ?
   - 1904 : Fondation par Matteo Tiraboschi, Paris 3e
   - 1938 : Premier sac signature "La Victoire"
   - 1972 : Transmission à la deuxième génération
   - 2019 : Troisième génération, relance éditoriale
   - Aujourd'hui : Maison indépendante, artisan unique
2. La citation fondatrice — avez-vous une vraie citation à intégrer ?
3. Les 4 chiffres clés — lesquels préférez-vous mettre en avant ?
   - Actuel : 1904 · 120 ans · 3 générations · 1 artisan par pièce

**Retours →**

**Statut →** 🔲

---

## PAGE 5 — SAVOIR-FAIRE
**Fichier :** `tiraboschi-savoir-faire-prototype.html`

### Checklist
- [ ] Hero (BOSCHI0919.jpg) KB : OK
- [ ] Les 6 techniques : noms + descriptions exacts ?
- [ ] 3 sections alternées (Apprentissage / Matière / Pièce) : longueur OK
- [ ] Section vidéo atelier : placeholder OK (vidéo à brancher)
- [ ] Chiffres 4 cellules : données exactes ?
- [ ] CTA double "Explorer la collection" / "Prendre rendez-vous" : OK

### Questions spécifiques
1. Les 6 techniques listées — toutes exactes ? En manque-t-il une ?
   - Couture Sellier · Coupe & Gabarit · Teinture & Finitions · Assemblage · Pose Quincailleries · Lustre & Contrôle
2. "3 ateliers à Paris" dans les data points — c'est exact ?
3. Les temps indiqués (48–72h par pièce, 3 ans d'apprentissage) — à confirmer

**Retours →**

**Statut →** 🔲

---

## PAGE 6 — MATIÈRES & CUIRS
**Fichier :** `tiraboschi-matieres-prototype.html`

### Checklist
- [ ] Hero typographique (sans image) : OK ou préférer une photo ?
- [ ] Les 4 cuirs standards : noms + origines exacts ?
- [ ] Les 3 peaux exotiques (section sombre) : OK
- [ ] 3 tanneries partenaires : noms + années exacts ?
- [ ] Palette 16 teintes : couleurs et noms OK ?
- [ ] Accordéon Entretien 5 conseils : OK

### Questions spécifiques
1. Les tanneries mentionnées (Mégisserie Berry / Rémy Carriat / Tannerie du Puy) — ce sont vos vrais partenaires ? À confirmer ou remplacer par des noms fictifs pour le prototype.
2. La palette 16 couleurs — correspond-elle à votre offre réelle ? Les noms sont-ils les vôtres ?
3. "Pleine fleur, jamais corrigée" — c'est votre positionnement exact ?

**Retours →**

**Statut →** 🔲

---

## PAGE 7 — SUR MESURE
**Fichier :** `tiraboschi-sur-mesure-prototype.html`

### Checklist
- [ ] Hero (DSCF1828) KB : OK
- [ ] Process 4 étapes (Rencontre / Choix / Création / Remise) : OK
- [ ] Délais indiqués (8–12 sem. standard, 12–16 exotiques) : exacts ?
- [ ] Section "Peaux Précieuses" (fond noir) : OK
- [ ] Mention prix "À partir de 4 500€" : OK à laisser ou retirer ?
- [ ] Formulaire de demande : champs suffisants ?
- [ ] FAQ 5 questions : OK, à compléter ?

### Questions spécifiques
1. Le dépôt à la commande — 30% correct ?
2. Adresse atelier : "Paris 3e" — souhaitez-vous une adresse précise ?
3. La visioconférence pour clients étrangers — c'est une option que vous proposez déjà ?
4. Le formulaire de RDV — préférez-vous un lien Calendly / Doctolib ou le form HTML ?

**Retours →**

**Statut →** 🔲

---

## PAGE 8 — LA SOCIÉTÉ
**Fichier :** `tiraboschi-la-societe-prototype.html`

### Checklist
- [ ] Hero dark + tagline "Des privilèges. Jamais des points." : OK
- [ ] Cercle I — seuil "1er achat" : OK
- [ ] Cercle II — seuil "2e achat ou > 5 000€" : OK
- [ ] Cercle III — seuil "Invitation > 15 000€" : OK
- [ ] Avantages listés par cercle : exacts ?
- [ ] 3 sections éditoriales alternées : longueur OK
- [ ] FAQ 4 questions : OK

### Questions spécifiques
1. Les seuils des cercles — ce sont les définitifs ou encore à ajuster ?
2. Les avantages du Cercle II (carte physique, visite atelier) — déjà opérationnels ou à terme ?
3. "Cercle III · Maison" — l'invitation directe fondatrice : c'est votre vision ou une aspiration ?
4. Souhaitez-vous une animation spéciale à l'entrée dans un cercle (confettis discrets, animation de reveal) ?

**Retours →**

**Statut →** 🔲

---

## PAGE 9 — BLOG L'ATELIER
**Fichier :** `tiraboschi-blog-prototype.html`

### Checklist
- [ ] Titre "Récits d'atelier" : OK ou autre wording ?
- [ ] Article featured (La Couture Sellier) en grand format 60/40 : OK
- [ ] 2 autres articles en grille : OK
- [ ] Catégories utilisées (TECHNIQUE / MATIÈRES / MANIFESTE) : OK ?
- [ ] Newsletter "Recevoir L'Atelier" : OK

### Questions spécifiques
1. Les 3 catégories — suffisantes ? En envisagez-vous d'autres (ex: PORTRAIT · ACTUALITÉ · HÉRITAGE) ?
2. Fréquence publication prévue ? (1/mois mentionné dans newsletter)
3. Le wording "L'Atelier" pour le blog — c'est définitif ?

**Retours →**

**Statut →** 🔲

---

## PAGE 10 — ARTICLE (Couture Sellier)
**Fichier :** `tiraboschi-article-prototype.html`

### Checklist
- [ ] Structure article : breadcrumb + hero + stats + corps + pull quote : OK
- [ ] Longueur du contenu (~600 mots) : OK ou trop long / trop court ?
- [ ] Le contenu rédigé : factuel ? À corriger ?
   - "3 400 points de couture sur une Victoire" — exact ?
   - "28 et 34 ans de pratique" pour les deux artisans sellier — à confirmer
   - "12–14h pour la couture sellier seule" — exact ?
- [ ] Barre de progression lecture (en bas) : OK ou à supprimer ?
- [ ] Articles liés : OK

### Questions spécifiques
1. Avez-vous un auteur à mentionner (nom de l'artisan, ou "TIRABOSCHI Paris") ?
2. Les photos d'article — avez-vous des photos d'atelier spécifiques à la couture sellier ?
3. Le pull quote — souhaitez-vous le garder ou avez-vous une vraie citation d'artisan ?

**Retours →**

**Statut →** 🔲

---

## PAGE 11 — SEARCH
**Fichier :** `tiraboschi-search-prototype.html`

### Checklist
- [ ] Barre de recherche grande + label "RECHERCHE" : OK
- [ ] Résultats mixtes (produits + articles + pages) : OK
- [ ] Sidebar filtres : catégories OK ?
- [ ] État "aucun résultat" + suggestions : OK
- [ ] Recherches populaires (tag cloud) : pertinents ?

### Questions spécifiques
1. Les recherches populaires listées — correspondent à ce que vos clients cherchent vraiment ?
   - Actuel : sac victoire · colette mini · cuir de veau · sur mesure · cadeau · bleu nuit · python · sac de jour · made in france · colette
2. Préférez-vous que la search soit instantanée (résultats live en tapant) ou sur validation (Enter) ?

**Retours →**

**Statut →** 🔲

---

## PAGE 12 — 404
**Fichier :** `tiraboschi-404-prototype.html`

### Checklist
- [ ] Concept "Cette page s'est égarée en atelier" : OK
- [ ] Filigrane "404" en fond : OK
- [ ] 6 liens suggérés : OK
- [ ] Ton global : OK

**Retours →**

**Statut →** 🔲

---

## PAGE 13 — ESPACE CLIENT
**Fichier :** `tiraboschi-account-prototype.html`

### Checklist
- [ ] Sidebar 4 rubriques (Commandes / La Société / Adresses / Profil) : OK
- [ ] Panel Commandes : liste + statuts OK
- [ ] Panel La Société : affichage 3 cercles OK
- [ ] Panel Adresses : cards + ajout OK
- [ ] Panel Profil : formulaire OK
- [ ] Mobile : tabs horizontaux scrollables OK

### Questions spécifiques
1. Les statuts de commande utilisés ("Livré" / "En atelier" / "Expédié") — utiliser les statuts natifs Shopify ou ces libellés custom ?
2. Le bloc La Société dans le compte — souhaitez-vous afficher le "prochain cercle" avec un seuil (ex: "Il vous manque X€ pour le Cercle II") ? Note : cela irait à l'encontre de la règle "jamais de barre de progression" — à confirmer.
3. Un certificat d'authenticité téléchargeable par commande — à prévoir ?

**Retours →**

**Statut →** 🔲

---

## PAGE 14 — CHECKOUT
**Fichier :** `tiraboschi-checkout-prototype.html`

### Checklist
- [ ] Étape 1 Livraison : champs, options transport OK
- [ ] Emballage cadeau + message manuscrit toggle : OK
- [ ] Étape 2 Paiement : carte + Apple Pay + PayPal + 3×SF OK
- [ ] Page Confirmation : onboarding La Société OK
- [ ] Récap commande sidebar : OK

### Questions spécifiques
1. Les options de livraison — correspondent à ce que vous proposez déjà ?
   - Actuel : Prioritaire (offerte) · Standard (offerte) · Retrait atelier Paris 3e
2. Le 3× sans frais "à partir de 500€" — avez-vous déjà un prestataire (Alma, Klarna, Scalapay) ?
3. La confirmation post-achat avec onboarding La Société — c'est le moment idéal ou préférez-vous un email dédié le lendemain ?
4. Note technique : Shopify Standard permet logo + couleurs + police dans le checkout. Le packaging cadeau passe par "Notes de commande" native. Shopify Plus serait nécessaire pour une personnalisation complète. Cela change-t-il votre plan ?

**Retours →**

**Statut →** 🔲

---

## NOTES GLOBALES & DÉCISIONS EN SUSPENS

*Utilisez cette section pour tout ce qui ne rentre pas dans les pages spécifiques.*

### Contenu réel à fournir
- [ ] Photos produits HD (toutes les couleurs par modèle)
- [ ] Textes définitifs fiches produit (composition, dimensions exactes)
- [ ] Vraie vidéo atelier "couture sellier" pour la fiche produit
- [ ] Citation(s) fondatrice à intégrer dans Histoire + Savoir-Faire
- [ ] Palette couleurs officielle par modèle (noms + références)
- [ ] Tanneries partenaires — noms réels ou garder fictifs ?

### Décisions techniques à prendre
- [ ] Shopify Standard vs Plus (impact checkout + emails + analytics avancés)
- [ ] Prestataire 3× sans frais (Alma recommandé pour la France)
- [ ] CRM email : Klaviyo ou autre ?
- [ ] Consent banner RGPD : Axeptio (recommandé) ou autre ?
- [ ] Avis clients : intégration (Judge.me, Okendo) ou pas d'avis affichés ?

### Ordre de priorité pour la Phase 3 (Intégration Shopify)
> À confirmer ensemble avant de démarrer

```
1. Header + Footer (socle commun)
2. Homepage
3. Collection + Fiche produit  ← génèrent du CA directement
4. Pages éditoriales P2
5. La Société + Espace client
6. Blog + Articles
7. Search + 404
8. Checkout branding
9. CRM + snippets fidélité
```

---

*VALIDATION.md — TIRABOSCHI Paris — Mis à jour : Mai 2025*
*Pour toute correction : répondre par message ou annoter directement ce fichier*
