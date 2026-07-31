/* ════════════════════════════════════════════════════════════════════
   TIRABOSCHI Paris — Thème Bespoke v1.0
   Script principal (extrait du prototype V2 homepage)
   ──────────────────────────────────────────────────────────────────── */
'use strict';

(function () {
  /* ════════ Préférences utilisateur ════════ */
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(hover: hover)').matches;

  /* ════════ Header ════════════════════════════════════════════════════
     UNE seule règle, appliquée partout :

     • La page a un hero sombre plein cadre ([data-tira-dark-hero] ou la
       homepage) → header transparent au-dessus, puis solide après le seuil.
     • Sinon → header solide dès le chargement.

     Sans cette distinction, le header flottait sans fond sur les pages
     éditoriales : rien ne le séparait du contenu, il paraissait absent.

     La search bar suit le header au lieu de passer en position collée :
     elles se rétractent et reviennent ensemble.
  ═══════════════════════════════════════════════════════════════════════ */
  const hdr = document.getElementById('hdr');
  const search = document.getElementById('hdr-search');
  const isHome = document.body.classList.contains('template-index');
  const hasDarkHero = isHome || document.querySelector('[data-tira-dark-hero]') !== null;
  let lastScrollY = window.scrollY;
  let ticking = false;
  let lastDir = 'up';

  function setHidden(hidden) {
    hdr.classList.toggle('hidden', hidden);
    if (search) search.classList.toggle('hidden', hidden);
    document.body.classList.toggle('hdr-hidden', hidden);
  }

  function updateHeader() {
    if (!hdr) { ticking = false; return; }
    const y = window.scrollY;

    /* 1. Transparent ↔ solide */
    const threshold = isHome ? window.innerHeight * 0.85 : 80;
    /* Pas de hero sombre → jamais transparent, dès le premier pixel. */
    const isSolid = hasDarkHero ? y >= threshold : true;
    hdr.classList.toggle('solid', isSolid);
    if (search) search.classList.toggle('solid', isSolid);
    document.body.classList.toggle('on-dark', hasDarkHero && !isSolid);

    /* 2. Sticky directionnel — jamais sur la homepage (le hero garde le header) */
    const delta = y - lastScrollY;
    if (!isHome && y > 120) {
      if (delta > 4 && lastDir !== 'down') { setHidden(true);  lastDir = 'down'; }
      else if (delta < -4 && lastDir !== 'up') { setHidden(false); lastDir = 'up'; }
    } else {
      setHidden(false);
      lastDir = 'up';
    }

    lastScrollY = y;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
  }, { passive: true });
  updateHeader();

  /* ════════ Word reveal ════════
     Idempotent : un <script> inline de section peut avoir déjà découpé
     l'élément. Sans ce garde-fou, la 2e passe re-split du HTML déjà balisé
     et produit des fragments de code visibles à l'écran. */
  document.querySelectorAll('[data-words], [data-tira-word-reveal]').forEach(el => {
    if (el.dataset.wordsDone) return;
    el.dataset.wordsDone = '1';
    const raw = el.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    const words = raw.split(/\s+/);
    el.innerHTML = words
      .map((w, i) => w === '\n' ? '<br>' : `<span style="--i:${i}">${w}</span>`)
      .join(' ');
  });

  /* ════════ IntersectionObserver : reveals + words ════════ */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible', 'is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal], [data-words], [data-tira-reveal], [data-tira-word-reveal]').forEach(el => io.observe(el));

  /* ════════ Lazy video play/pause ════════ */
  const videoObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const vid = e.target;
      if (e.isIntersecting) { vid.play && vid.play().catch(() => {}); }
      else { vid.pause && vid.pause(); }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('video[data-tira-lazy], .hero__video, .atelier-vid__video').forEach(v => videoObs.observe(v));

  /* ════════ Fallback connexion lente ════════ */
  if (navigator.connection && navigator.connection.effectiveType === '2g') {
    document.querySelectorAll('video').forEach(v => {
      const poster = v.getAttribute('poster');
      if (poster) {
        const img = document.createElement('img');
        img.src = poster; img.alt = ''; img.setAttribute('aria-hidden', 'true');
        img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover';
        v.parentNode.insertBefore(img, v);
        v.style.display = 'none';
      }
    });
  }

  /* ════════ Wishlist (localStorage) ════════
     Store unique 'tira_wishlist' (tableau d'ids), partagé entre les cards
     de collection/homepage et la fiche produit. Auparavant deux systèmes
     coexistaient (clé par titre vs tableau d'ids) et ne se voyaient pas.
     Délégation sur document : couvre aussi les cards injectées par
     "Charger plus", qui n'étaient jamais bindées. */
  const WISHLIST_KEY = 'tira_wishlist';

  function readWishlist() {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function writeWishlist(list) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  }
  function wishKeyOf(btn) {
    if (btn.dataset.productId) return String(btn.dataset.productId);
    if (btn.dataset.productHandle) return String(btn.dataset.productHandle);
    const article = btn.closest('article');
    const nameEl = article && article.querySelector('.card__name');
    return nameEl ? nameEl.textContent.trim() : null;
  }

  function paintWishlist() {
    const list = readWishlist();
    document.querySelectorAll('.card__wish, .prd-gallery__wish').forEach(btn => {
      const key = wishKeyOf(btn);
      if (key) btn.classList.toggle('active', list.indexOf(key) !== -1);
    });
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest && e.target.closest('.card__wish, .prd-gallery__wish');
    if (!btn) return;
    e.preventDefault();
    const key = wishKeyOf(btn);
    if (!key) return;
    const list = readWishlist();
    const i = list.indexOf(key);
    if (i > -1) list.splice(i, 1); else list.push(key);
    writeWishlist(list);
    btn.classList.toggle('active', i === -1);
    btn.setAttribute('aria-pressed', String(i === -1));
    document.dispatchEvent(new CustomEvent('tira:wishlist:updated', { detail: list }));
  });

  paintWishlist();
  /* Repeindre après un "Charger plus" */
  document.addEventListener('tira:grid:appended', paintWishlist);

  /* ════════ Join the Society form (Shopify newsletter) ════════
     La soumission est native ({% form 'customer' %}) : Shopify recharge la
     page et Liquid affiche la confirmation via form.posted_successfully?.
     On se contente de masquer le champ quand la confirmation est visible. */
  const societyForm = document.getElementById('society-form');
  if (societyForm) {
    const confirmEl = societyForm.querySelector('.society-crm__confirm');
    if (confirmEl && !confirmEl.hidden) {
      const field = societyForm.querySelector('.society-crm__field');
      const gdpr  = societyForm.querySelector('.society-crm__gdpr');
      if (field) field.style.display = 'none';
      if (gdpr)  gdpr.style.display  = 'none';
      confirmEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  /* ════════ Footer accordion (mobile) ════════ */
  document.querySelectorAll('.footer__col h4').forEach(h4 => {
    h4.addEventListener('click', () => {
      const col = h4.closest('.footer__col');
      const isOpen = col.classList.contains('open');
      document.querySelectorAll('.footer__col.open').forEach(c => c.classList.remove('open'));
      if (!isOpen) col.classList.add('open');
    });
  });

  /* ════════ Menu mobile (hamburger → drawer) ════════ */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuNav = document.getElementById('mobile-nav');
  function closeMobileMenu() {
    if (!mobileMenuBtn || !mobileMenuNav) return;
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuNav.classList.remove('open');
    mobileMenuNav.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-open');
  }
  if (mobileMenuBtn && mobileMenuNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const open = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      if (!open) {
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileMenuNav.classList.add('open');
        mobileMenuNav.setAttribute('aria-hidden', 'false');
        document.body.classList.add('nav-open');
      } else { closeMobileMenu(); }
    });
    mobileMenuNav.addEventListener('click', e => {
      if (e.target === mobileMenuNav) closeMobileMenu();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMobileMenu();
    });
    const closeBtn = document.querySelector('[data-tira-menu-close], .mobile-nav__close');
    if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
  }

  /* ════════ Lenis Smooth Scrolling (si chargé via theme.liquid) ════════ */
  if (typeof Lenis !== 'undefined' && isDesktop && !noMotion) {
    document.documentElement.style.scrollBehavior = 'auto';
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }

  /* ════════ Ken Burns : stop quand vidéo démarre ════════ */
  const heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    heroVideo.addEventListener('playing', () => {
      heroVideo.style.animation = 'none';
    });
  }

  /* ════════ Transitions entre pages ════════
     Le navigateur gère la transition nativement quand il sait le faire
     (@view-transition dans le CSS) : l'image de la carte se déplace
     jusqu'à devenir le visuel de la fiche. L'overlay en fondu blanc n'est
     qu'un repli pour les navigateurs sans View Transitions. */
  const supportsVT = 'startViewTransition' in document;
  const pageOverlay = document.getElementById('tira-page-overlay');

  /* Retour arrière depuis le cache : le DOM est restauré tel quel, header
     éventuellement rétracté. On remet tout à plat. */
  window.addEventListener('pageshow', function () {
    if (pageOverlay) pageOverlay.classList.remove('active');
    if (hdr) { setHidden(false); lastDir = 'up'; lastScrollY = window.scrollY; updateHeader(); }
  });

  if (pageOverlay && !noMotion && !supportsVT) {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href]');
      if (!link) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (link.target === '_blank' || link.hasAttribute('download')) return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      try {
        const url = new URL(href, location.origin);
        if (url.origin !== location.origin) return;
        /* Pas de fondu sur le panier ni le compte : on veut la réponse immédiate */
        if (/^\/(cart|account|checkout)/.test(url.pathname)) return;
      } catch (_) { return; }
      e.preventDefault();
      pageOverlay.classList.add('active');
      setTimeout(() => { location.href = link.href; }, 350);
    });
  }

  /* ════════ Moment 01 — transition morphée grille → fiche ════════
     Seule la carte cliquée porte le nom de transition : deux éléments
     partageant le même nom au même instant annulent l'animation. */
  if (supportsVT && !noMotion) {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href*="/products/"]');
      if (!link) return;
      const card = link.closest('.card, .ep-card, .reco-card');
      if (!card) return;
      document.querySelectorAll('.is-morphing').forEach(el => el.classList.remove('is-morphing'));
      const media = card.querySelector('.card__img, .card__media, img');
      if (media) media.classList.add('is-morphing');
    }, true);
  }

  /* ════════ Cart AJAX (ajout panier sans rechargement) ════════ */
  document.addEventListener('submit', function (e) {
    const form = e.target;
    if (!form.matches('form[action*="/cart/add"]')) return;
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    /* innerHTML (pas textContent) : le bouton précommande contient un <span> de note */
    const originalHTML = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.textContent = '...'; }

    function restoreBtn() {
      if (btn) { btn.innerHTML = originalHTML; btn.disabled = false; }
    }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      /* Tester r.ok : un 422 (rupture, variante invalide) renvoie du JSON valide
         et enchaînerait sinon sur le message de succès. */
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (!ok) throw new Error(d.description || d.message || 'add failed');
        return fetch('/cart.js').then(r => r.json());
      })
      .then(cart => {
        if (btn) { btn.textContent = 'Ajouté ✓'; setTimeout(restoreBtn, 1800); }
        updateCartCount(cart.item_count);
        document.dispatchEvent(new CustomEvent('tira:cart:updated', { detail: cart }));
      })
      .catch(err => {
        if (btn) {
          btn.textContent = 'Indisponible';
          setTimeout(restoreBtn, 2200);
        }
        document.dispatchEvent(new CustomEvent('tira:cart:error', { detail: err }));
      });
  });

  /* Met à jour le compteur SANS détruire le picto sac.
     [data-cart-count] est porté par le <a class="hdr__bag"> qui contient
     l'<img> de l'icône : un textContent = N effacerait l'icône. */
  function updateCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.setAttribute('data-cart-count', count);
      let badge = el.querySelector('.hdr__bag-count');
      if (count > 0) {
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'hdr__bag-count';
          badge.setAttribute('aria-hidden', 'true');
          el.appendChild(badge);
        }
        badge.textContent = count;
      } else if (badge) {
        badge.remove();
      }
      const label = el.getAttribute('aria-label');
      if (label && /^Panier/.test(label)) {
        el.setAttribute('aria-label', 'Panier — ' + count + ' article' + (count !== 1 ? 's' : ''));
      }
    });
  }

})();
