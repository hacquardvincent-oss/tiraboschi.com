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
| **NOUVELLES PAGES (benchmark grandes maisons)** | | | | |
| 15 | Icône Victoire | `tiraboschi-icone-victoire-prototype.html` | P2 | 🔲 |
| 16 | Contact + Booking RDV | `tiraboschi-contact-prototype.html` | P2 | 🔲 |
| 17 | Entretien & Réparation | `tiraboschi-entretien-prototype.html` | P2 | 🔲 |
| 18 | Lookbook FW25 | `tiraboschi-lookbook-prototype.html` | P2 | 🔲 |
| 19 | Cadeaux / Gift Guide | `tiraboschi-cadeaux-prototype.html` | P3 | 🔲 |
| 20 | Wishlist | `tiraboschi-wishlist-prototype.html` | P3 | 🔲 |
| 21 | Presse | `tiraboschi-presse-prototype.html` | P3 | 🔲 |
| 22 | RSE / Engagement | `tiraboschi-rse-prototype.html` | P3 | 🔲 |
| **COMPOSANTS** | | | | |
| 23 | Newsletter popup | `tiraboschi-newsletter-popup-prototype.html` | P3 | 🔲 |
| 24 | Animations premium | `tiraboschi-composants-prototype.html` | P3 | 🔲 |
| 7 | Sur Mesure | `tiraboschi-sur-mesure-prototype.html` | P2 | 🔲 |
| 8 | La Société | `tiraboschi-la-societe-prototype.html` | P2 | 🔲 |
| 9 | Blog L'Atelier | `tiraboschi-blog-prototype.html` | P3 | 🔲 |
| 10 | Article | `tiraboschi-article-prototype.html` | P3 | 🔲 |
| 11 | Search | `tiraboschi-search-prototype.html` | P3 | 🔲 |
| 12 | 404 | `tiraboschi-404-prototype.html` | P3 | 🔲 |
| 13 | Espace client | `tiraboschi-account-prototype.html` | P4 | 🔲 |
| 14 | Checkout | `tiraboschi-checkout-prototype.html` | P4 | 🔲 |
| **INTERNATIONAL** | | | | |
| 25 | International · Marchés | `tiraboschi-international-prototype.html` | P3 | 🔲 |
| **DROPS** | | | | |
| 26 | Drops & Précommandes | `tiraboschi-precommande-prototype.html` | P2 | 🔲 |

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

---

## PAGE 15 — ICÔNE VICTOIRE
**Fichier :** `tiraboschi-icone-victoire-prototype.html`
*Sert de template pour Colette et Rafael — même structure, contenu adapté.*

### Checklist
- [ ] Hero dark + filigrane "Victoire" : OK
- [ ] Texte d'origine (histoire du modèle) : exact ou à corriger ?
- [ ] Section "La Silhouette" : dimensions 28×35×12cm OK ?
- [ ] "Contient : carnet A5, portefeuille, téléphone, clés" : exact ?
- [ ] Les 4 matières proposées : OK ?
- [ ] Palette 8 couleurs FW25 : correspond à votre offre réelle ?
- [ ] "48 à 72h de travail · 14h couture sellier · 3 400 points" : exact ?
- [ ] Témoignages : style OK (pas de notes/étoiles) ?
- [ ] Section Sur Mesure : OK

### Questions spécifiques
1. Y a-t-il vraiment une histoire derrière le nom "Victoire" ? La nôtre est fictive — à corriger avec le vrai récit.
2. Le prix affiché "À partir de 2 850€" — c'est le prix actuel ?
3. Les 3 modèles dans "Découvrir aussi" (Colette, Colette Mini, Jane) — garder ou changer ?
4. Une fois validé, créer Icône Colette et Icône Rafael depuis ce template ?

**Retours →**

**Statut →** 🔲

---

## PAGE 16 — CONTACT + BOOKING RDV
**Fichier :** `tiraboschi-contact-prototype.html`

### Checklist
- [ ] Hero typographique (sans image) : OK
- [ ] 3 motifs de visite (Conseil / Sur Mesure / Entretien) : OK
- [ ] Adresse "12, rue de Bretagne · Paris 3e" : correcte ?
- [ ] Horaires (Mardi–Vendredi 10h–18h30 / Samedi 10h–17h) : corrects ?
- [ ] Accès métro "Arts & Métiers / Temple" : correct ?
- [ ] Formulaire : champs suffisants ?
- [ ] Section clients internationaux (visio) : OK

### Questions spécifiques
1. L'adresse est fictive — quelle est votre adresse réelle ?
2. Les horaires sont fictifs — quels sont vos horaires réels ?
3. Préférez-vous un embed Calendly/Doctolib pour le booking ou le formulaire HTML suffit ?
4. Le téléphone "+33 1 XX XX XX XX" — à remplacer par votre vrai numéro ou laisser "sur demande" ?
5. WhatsApp pour les clients Cercle II & III — c'est déjà le cas ?

**Retours →**

**Statut →** 🔲

---

## PAGE 17 — ENTRETIEN & RÉPARATION
**Fichier :** `tiraboschi-entretien-prototype.html`

### Checklist
- [ ] Hero (BOSCHI0154) KB : OK
- [ ] Citation "Nous réparons ce que nous fabriquons. Sans limitation de date." : OK
- [ ] Les 6 services proposés : liste complète ? En manque-t-il ?
- [ ] Les délais indiqués (5–21 jours selon intervention) : réalistes ?
- [ ] Tarifs indicatifs (80–500€) : dans la bonne fourchette ?
- [ ] Process 4 étapes : OK
- [ ] "Garantie à vie si entretenue chez nous" : c'est votre engagement ?
- [ ] Envoi postal disponible : c'est le cas ?

### Questions spécifiques
1. Proposez-vous réellement tous ces services ? Ou certains sont à terme ?
2. Les tarifs sont fictifs — fourchette correcte ou à ajuster complètement ?
3. La "garantie à vie" — c'est déjà votre politique officielle ?
4. "Nous retrouvons votre pièce dans nos archives" — vous tenez vraiment un carnet de bord par pièce ?

**Retours →**

**Statut →** 🔲

---

## PAGE 18 — LOOKBOOK / CAMPAGNE FW25
**Fichier :** `tiraboschi-lookbook-prototype.html`

### Checklist
- [ ] Hero transparent → solid (comme homepage) : OK
- [ ] Nom de campagne "Permanence" : OK ou autre nom pour FW25 ?
- [ ] Quote d'ouverture : OK
- [ ] 3 looks narratifs (Victoire Noir / Colette Marine / Rafael Cognac) : OK
- [ ] Image plein-écran "qui respire" (section 5) : OK
- [ ] Grille collection complète FW25 : OK
- [ ] Section "Coulisses" avec vidéo : OK
- [ ] Teaser SS26 final : OK ou à supprimer pour l'instant ?

### Questions spécifiques
1. Avez-vous des photos de campagne FW25 réelles ? (actuellement tout est en placeholder)
2. Le nom "Permanence" pour la campagne — c'est le bon ou vous avez un concept différent ?
3. Les couleurs des 3 looks (Noir / Marine / Cognac) — c'est ce que vous voulez mettre en avant ?

**Retours →**

**Statut →** 🔲

---

## PAGE 19 — CADEAUX / GIFT GUIDE
**Fichier :** `tiraboschi-cadeaux-prototype.html`

### Checklist
- [ ] 3 profils (Initier / Fidéliser / Marquer) avec référence Cercles I/II/III : OK ?
- [ ] Suggestions de produits par profil : pertinentes ?
- [ ] Packaging cadeau décrit : correspond à ce que vous proposez ?
- [ ] "Sans supplément" pour l'emballage cadeau : c'est bien gratuit ?
- [ ] Carte cadeau de 190€ à 5 000€ : vous la proposez déjà ?
- [ ] "Livraison directe au destinataire sans facture" : vous le faites ?

### Questions spécifiques
1. Avez-vous déjà une carte cadeau Shopify active ?
2. L'emballage cadeau — il y a un supplément ou c'est inclus ?
3. Cette page est-elle permanente ou saisonnière (Noël / Fête des Mères) ?

**Retours →**

**Statut →** 🔲

---

## PAGE 20 — WISHLIST
**Fichier :** `tiraboschi-wishlist-prototype.html`

### Checklist
- [ ] Grille wishlist (état avec items) : OK
- [ ] Partage de liste par lien : OK
- [ ] État vide : OK
- [ ] Toast "Ajouté au panier" : OK
- [ ] Suppression avec animation : OK

### Questions spécifiques
1. Wishlist en localStorage (invités) ou uniquement pour les comptes clients ?
2. Notification si produit sauvegardé revient en stock : à activer (lié à Klaviyo) ?

**Retours →**

**Statut →** 🔲

---

## PAGE 21 — PRESSE
**Fichier :** `tiraboschi-presse-prototype.html`

### Checklist
- [ ] Contact presse "Marie Lecomte" : à remplacer par vrai contact
- [ ] 3 téléchargements (Communiqué / Photos / Biographie) : structure OK
- [ ] 6 revues de presse listées : à remplacer par vos vraies retombées presse
- [ ] Biographie courte : à corriger avec le vrai nom de la fondatrice

### Questions spécifiques
1. Avez-vous une attachée de presse ? Si oui, son nom et email ?
2. Avez-vous déjà des retombées presse à afficher ?
3. La biographie "Sophie Tiraboschi" — c'est votre prénom et parcours ? À corriger.
4. Le kit presse existe-t-il déjà (PDF) ou est-il à créer ?

**Retours →**

**Statut →** 🔲

---

## PAGE 22 — RSE / ENGAGEMENT
**Fichier :** `tiraboschi-rse-prototype.html`

### Checklist
- [ ] Ton : factuel + fier, jamais moralisateur : OK
- [ ] 4 piliers (Made in France / 1 artisan / Cuirs éthiques / Réparable à vie) : exacts ?
- [ ] "< 300km circuit de production" : exact ?
- [ ] "Moins de 200 pièces par an" : exact ?
- [ ] "50 ans de partenariat avec nos tanneurs" : exact ?
- [ ] Section FAQ engagement (emballages / exotiques / rapport RSE) : OK
- [ ] Ton de la FAQ : "Prenez rendez-vous" au lieu d'un rapport — OK ?

### Questions spécifiques
1. Les 3 tanneries mentionnées sont-elles vos vraies partenaires ?
2. La production annuelle "moins de 200 pièces" — c'est le bon chiffre ?
3. "Supprimé tout plastique en 2020" — c'est exact pour vos emballages ?

**Retours →**

**Statut →** 🔲

---

## PAGE 23 — NEWSLETTER POPUP (COMPOSANT)
**Fichier :** `tiraboschi-newsletter-popup-prototype.html`

### Checklist
- [ ] Desktop (overlay centré 2-col) : OK
- [ ] Mobile (bottom sheet) : OK
- [ ] Wording "Entrez dans les coulisses" : OK
- [ ] État succès après soumission : OK
- [ ] Comportement cookie (1× / 30 jours) : OK

### Questions spécifiques
1. Le wording "Recevoir L'Atelier" ou "Rejoindre L'Atelier" — lequel préférez-vous ?
2. Délai d'apparition : 8 secondes ou 40% scroll — ou les deux ?
3. Champ "Prénom" en plus de l'email ? (mieux pour personnaliser les emails Klaviyo)

**Retours →**

**Statut →** 🔲

---

## PAGE 24 — ANIMATIONS PREMIUM (DÉMO COMPOSANTS)
**Fichier :** `tiraboschi-composants-prototype.html`

### Checklist — valider chaque animation
- [ ] Lenis smooth scrolling : feel OK (momentum, poids) ?
- [ ] Transitions entre pages (350ms fondu blanc) : trop long / trop court / OK ?
- [ ] Splash screen logo (1.5s, stroke animation "T") : OK ou à supprimer ?
- [ ] Mega-menu éditorial (image change au hover) : OK ?
- [ ] Magnetic buttons (curseur attiré) : subtil OK ou trop prononcé ?
- [ ] Video scrub on scroll (démo) : compris l'effet — à utiliser sur quelle section ?
- [ ] Search autocomplete avec images : OK ?
- [ ] Color scheme shift on scroll : OK ?

**Retours →** *Indiquer pour chaque animation : Valider / Ajuster / Supprimer*

**Statut →** 🔲

---

## NOTES GLOBALES & DÉCISIONS EN SUSPENS

*Utilisez cette section pour tout ce qui ne rentre pas dans les pages spécifiques.*

### Contenu réel à fournir (prioritaire avant Phase 3)
- [ ] Photos produits HD (toutes les couleurs par modèle)
- [ ] Textes définitifs fiches produit (composition, dimensions exactes)
- [ ] Vraie vidéo atelier "couture sellier" pour la fiche produit + video scrub
- [ ] Citation(s) fondatrice à intégrer dans Histoire + Savoir-Faire
- [ ] Palette couleurs officielle par modèle (noms + références hex)
- [ ] Tanneries partenaires — noms réels ou garder fictifs ?
- [ ] Adresse réelle atelier + horaires
- [ ] Vraie fondatrice : prénom, biographie courte, photo
- [ ] Kit presse existant ou à créer
- [ ] Retombées presse réelles à afficher
- [ ] Chiffres de production (combien de pièces / an ?)
- [ ] Photos de campagne FW25 pour le lookbook

### Décisions techniques à prendre
- [ ] Shopify Standard vs Plus (impact checkout + emails + analytics avancés)
- [ ] Prestataire 3× sans frais (Alma recommandé pour la France)
- [ ] CRM email : Klaviyo ou autre ?
- [ ] Consent banner RGPD : Axeptio (recommandé) ou autre ?
- [ ] Avis clients : Judge.me / Okendo ou pas d'avis affichés ?
- [ ] Live chat concierge : Gorgias (~10€/mois) ou pas dans l'immédiat ?
- [ ] Booking RDV : formulaire HTML, Calendly embed, ou autre ?
- [ ] Wishlist : localStorage invités ou compte obligatoire ?

### Animations à valider (voir Page 24)
- [ ] Lenis smooth scrolling
- [ ] Transitions entre pages
- [ ] Splash screen logo
- [ ] Mega-menu éditorial avec image
- [ ] Magnetic buttons
- [ ] Video scrub on scroll
- [ ] Color scheme shift on scroll

---

## PAGE 25 — INTERNATIONAL · MARCHÉS
**Fichier :** `tiraboschi-international-prototype.html`
**Priorité :** P3
**Statut :** 🔲 À valider

### Comment utiliser cette page
Ouvrir le fichier dans un navigateur. La barre noire en haut permet de basculer entre 6 marchés.
Tester chaque marché et vérifier les comportements décrits ci-dessous.

### Validation par composant

**Composant 1 — Bandeau géo-suggestion**
- [ ] France : aucun bandeau affiché (marché local)
- [ ] UK : bandeau apparaît avec texte EN "You appear to be browsing from the United Kingdom"
- [ ] USA : bandeau EN, mention "$ USD"
- [ ] Japon : bandeau JA, katakana lisible
- [ ] Corée : bandeau KO, hangul lisible
- [ ] Arabe : bandeau AR, texte RTL correct (droite → gauche)
- [ ] Animation slide-down (translateY) fluide
- [ ] Bouton × ferme le bandeau proprement
- [ ] "Stay in € EUR" / "Rester en €" fonctionne (dismiss)

**Composant 2 — Header locale chip**
- [ ] Chip affiche bien le drapeau + code devise (🇫🇷 EUR / 🇬🇧 GBP / 🇺🇸 USD / 🇯🇵 JPY / 🇰🇷 KRW)
- [ ] Dropdown s'ouvre au clic, se ferme en cliquant ailleurs
- [ ] Sélectionner un marché dans le dropdown bascule correctement
- [ ] Dropdown : 0px border-radius ✓ Playfair Display ✓ underline buttons ✓
- [ ] Position dropdown OK (top calc(100% + 12px) sous le chip)

**Composant 3 — Prix dynamiques**
- [ ] France : 2 850 € · 2 290 € · 3 200 € · 490 €
- [ ] UK : 2 450 £ · 1 950 £ · 2 750 £ · 420 £
- [ ] USA : 3 100 $ · 2 500 $ · 3 450 $ · 530 $
- [ ] Japon : ¥415 000 · ¥330 000 · ¥460 000 · ¥72 000
- [ ] Corée : ₩3 850 000 · ₩3 050 000 · ₩4 250 000 · ₩645 000
- [ ] Animation fade (opacity) lors du changement de marché
- [ ] Avis fiscal sous prix adapté au marché

**Composant 4 — Footer locale selector**
- [ ] Select pays : 14 pays listés
- [ ] Select langue : 5 langues (FR / EN / JA / KO / AR)
- [ ] Style : underline seulement, pas de box, pas de border-radius
- [ ] Bouton "Valider →" : underlined uppercase, pas de box
- [ ] Synchro footer → bascule marché principal

**Composant 5 — Avis fiscaux par marché**
- [ ] France : "Prix TTC (TVA 20% incluse)"
- [ ] UK : "Price excl. VAT" + mention droits post-Brexit
- [ ] USA : "Price excl. taxes" + sales tax notice
- [ ] Japon : "税込価格（消費税10%）"
- [ ] Arabe : texte RTL correct

**Composant 6 — Tableau labels traduits**
- [ ] 7 lignes × 5 colonnes (FR / EN / JA / KO / AR)
- [ ] Colonne active du marché en cours mise en évidence (fond gris)
- [ ] "Ajouter au panier" → "Add to bag" → "カートに追加" → "카트에 추가" → "أضف إلى الحقيبة"
- [ ] "Sur Mesure" → "Bespoke" → "オーダーメイド" → "맞춤 제작" → "حسب الطلب"

**Support RTL (marché arabe uniquement)**
- [ ] document.dir = "rtl" actif
- [ ] Header : navigation inversée (droite → gauche)
- [ ] Bandeau : texte aligné à droite
- [ ] Cards produit : texte aligné à droite
- [ ] Footer : colonnes inversées
- [ ] Aucun élément "cassé" visuellement

### Questions décisionnelles

**1. Prix par marché** → Les prix affichés sont-ils corrects ?
- Victoire : 2 850 € / 2 450 £ / 3 100 $ / ¥415 000 / ₩3 850 000
→ Retour :

**2. Marchés à activer en priorité** → Dans quel ordre lancer les marchés ?
(Proposition : France → UK → USA → Japon)
→ Ordre retenu :

**3. Traductions** → Weglot (~€99/mois) est recommandé. Faut-il procéder autrement ?
→ Décision :

**4. Arabe** → Confirmer l'intégration RTL. L'affichage Moyen-Orient est-il souhaité au lancement ?
→ Décision :

**5. Bandeau géo** → Approche "suggestion, jamais forçage" validée ?
→ Validation :

**6. La Société internationale** → "La Société" reste en français dans toutes les langues (comme "Chanel" garde son nom) ou traduire ?
→ Décision :

**Retours généraux page 25 →**

---

### Ordre de priorité pour la Phase 3 (Intégration Shopify)
> À confirmer ensemble après validation des prototypes

```
3A — Socle
  1. Header + Footer + Lenis + transitions + splash
  2. Homepage
  3. Collection + Fiche produit (+ swatches → changement gallery)

3B — Pages P2
  4. Pages éditoriales (Histoire, Savoir-Faire, Matières, Sur Mesure, La Société)
  5. Pages Icônes (Victoire, Colette, Rafael)
  6. Contact + Entretien & Réparation
  7. Lookbook FW25

3C — Pages P3
  8. Blog + Articles + Search + 404
  9. Cadeaux + Wishlist + Presse + RSE
  10. Espace client + Checkout branding

Phase 4 — CRM
  11. Klaviyo 6 flows
  12. Snippets (popup, back-in-stock, reviews)
  13. Axeptio + GA4 + Clarity
```

---

*VALIDATION.md — TIRABOSCHI Paris — Mis à jour : Mai 2025*
*Pour toute correction : répondre par message ou annoter directement ce fichier*
