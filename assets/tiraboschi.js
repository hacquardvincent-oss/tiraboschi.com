/* ════════════════════════════════════════════════════════════════════
   TIRABOSCHI Paris — Thème Bespoke v1.0
   Script principal (extrait du prototype V2 homepage)
   ──────────────────────────────────────────────────────────────────── */
'use strict';

(function () {
  /* ════════ Préférences utilisateur ════════ */
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDesktop = window.matchMedia('(hover: hover)').matches;

  /* ════════ Header : transparent → opaque, sticky directionnel ════════ */
  const hdr = document.getElementById('hdr');
  const search = document.getElementById('hdr-search');
  const isHome = document.body.classList.contains('template-index');
  let lastScrollY = window.scrollY;
  let ticking = false;
  let lastDir = 'up';

  function updateHeader() {
    if (!hdr) { ticking = false; return; }
    const y = window.scrollY;
    const heroH = window.innerHeight;

    /* 1. Transparent ↔ solid (uniquement sur homepage, sinon toujours solid) */
    const isSolid = !isHome || y >= heroH * 0.85;
    hdr.classList.toggle('solid', isSolid);
    if (search && !search.classList.contains('sticky-mode')) {
      search.classList.toggle('solid', isSolid);
    }
    document.body.classList.toggle('on-dark', isHome && !isSolid);

    /* 2. Header directionnel (désactivé sur homepage : le header reste visible pour le hero) */
    const delta = y - lastScrollY;
    if (!isHome && y > 120) {
      if (delta > 4 && lastDir !== 'down') {
        hdr.classList.add('hidden');
        if (search) {
          search.classList.add('sticky-mode');
          search.classList.remove('solid');
        }
        lastDir = 'down';
      } else if (delta < -4 && lastDir !== 'up') {
        hdr.classList.remove('hidden');
        if (search) {
          search.classList.remove('sticky-mode');
          search.classList.toggle('solid', isSolid);
        }
        lastDir = 'up';
      }
    } else {
      hdr.classList.remove('hidden');
      if (search) {
        search.classList.remove('sticky-mode');
        search.classList.toggle('solid', isSolid);
      }
      lastDir = 'up';
    }
    lastScrollY = y;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateHeader); ticking = true; }
  }, { passive: true });
  updateHeader();

  /* ════════ Word reveal ════════ */
  document.querySelectorAll('[data-words], [data-tira-word-reveal]').forEach(el => {
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

  /* ════════ Wishlist toggle (localStorage) ════════ */
  document.querySelectorAll('.card__wish').forEach(btn => {
    const article = btn.closest('article');
    const nameEl = article && article.querySelector('.card__name');
    if (!nameEl) return;
    const key = 'tira-wish-' + nameEl.textContent.trim();
    if (localStorage.getItem(key)) btn.classList.add('active');
    btn.addEventListener('click', e => {
      e.preventDefault();
      btn.classList.toggle('active');
      localStorage.setItem(key, btn.classList.contains('active') ? '1' : '');
    });
  });

  /* ════════ Join the Society form (Shopify customer/newsletter) ════════ */
  const societyForm = document.getElementById('society-form');
  if (societyForm) {
    societyForm.addEventListener('submit', function (e) {
      /* Si l'action pointe vers /contact (Shopify), on laisse Shopify gérer.
         Sinon, mode démo : on affiche confirmation client side */
      if (!this.action || this.action.indexOf('/contact') === -1) {
        e.preventDefault();
        const confirm = document.getElementById('society-confirm');
        if (confirm) {
          confirm.hidden = false;
          const field = this.querySelector('.society-crm__field');
          const gdpr  = this.querySelector('.society-crm__gdpr');
          if (field) field.style.display = 'none';
          if (gdpr)  gdpr.style.display = 'none';
        }
      }
    });
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
    const closeBtn = document.getElementById('mobile-nav-close');
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

  /* ════════ Transitions entre pages ════════ */
  const pageOverlay = document.getElementById('tira-page-overlay');
  if (pageOverlay && !noMotion) {
    window.addEventListener('pageshow', () => pageOverlay.classList.remove('active'));

    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href]');
      if (!link) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.target === '_blank') return;
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      try {
        const url = new URL(href, location.origin);
        if (url.origin !== location.origin) return;
      } catch (_) { return; }
      e.preventDefault();
      pageOverlay.classList.add('active');
      setTimeout(() => { location.href = link.href; }, 350);
    });
  }

  /* ════════ Cart AJAX (ajout panier sans rechargement) ════════ */
  document.addEventListener('submit', function (e) {
    const form = e.target;
    if (!form.matches('form[action*="/cart/add"]')) return;
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const originalLabel = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = '...'; }

    fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(r => r.json())
      .then(() => fetch('/cart.js').then(r => r.json()))
      .then(cart => {
        if (btn) { btn.textContent = 'Ajouté ✓'; setTimeout(() => { btn.textContent = originalLabel; btn.disabled = false; }, 1800); }
        document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = cart.item_count);
        document.dispatchEvent(new CustomEvent('tira:cart:updated', { detail: cart }));
      })
      .catch(() => { if (btn) { btn.textContent = originalLabel; btn.disabled = false; } });
  });

})();
