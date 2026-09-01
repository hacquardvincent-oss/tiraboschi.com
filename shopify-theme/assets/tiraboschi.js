'use strict';

// ============================================================
// TIRABOSCHI PARIS — Animations JS
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initMarquee();
  initCursor();
  initLazyVideos();
  initScrollStack();
});

// ---- 1. SCROLL REVEALS ----
function initReveal() {
  const els = document.querySelectorAll('[data-tira-reveal]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// ---- 2. MARQUEE ----
function initMarquee() {
  const tracks = document.querySelectorAll('.tira-marquee__track');
  tracks.forEach(track => {
    // Dupliquer le contenu pour le loop seamless
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.parentElement.appendChild(clone);
  });
}

// ---- 3. CURSEUR CUSTOM ----
function initCursor() {
  if (window.matchMedia('(max-width: 749px)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'tira-cursor';
  cursor.textContent = 'VOIR';
  document.body.appendChild(cursor);

  let mx = 0, my = 0;
  let cx = 0, cy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  // Trailing inertia
  function animateCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Activer sur les zones vidéo/image héros
  const videoZones = document.querySelectorAll('.tira-stack-section, .tira-ken-burns');
  videoZones.forEach(zone => {
    zone.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
    zone.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
  });
}

// ---- 4. LAZY VIDEOS ----
function initLazyVideos() {
  const videos = document.querySelectorAll('video[data-tira-lazy]');
  if (!videos.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        const src = video.dataset.src;
        if (src) {
          video.src = src;
          video.load();
          video.play().catch(() => {});
        }
        observer.unobserve(video);
      }
    });
  }, { threshold: 0.2 });

  videos.forEach(v => observer.observe(v));
}

// ---- 5. SCROLL STACK — micro scale sur sortie ----
function initScrollStack() {
  const sections = document.querySelectorAll('.tira-stack-section');
  if (!sections.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (!entry.isIntersecting) {
        // Section qui sort vers le haut : micro scale + opacity
        if (entry.boundingClientRect.top < 0) {
          el.style.transform = 'scale(0.97)';
          el.style.opacity = '0.88';
        } else {
          el.style.transform = '';
          el.style.opacity = '';
        }
      } else {
        el.style.transform = '';
        el.style.opacity = '';
      }
    });
  }, { threshold: [0, 0.1, 0.9, 1] });

  sections.forEach(s => observer.observe(s));
}
