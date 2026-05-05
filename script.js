/* ==========================================================
   OMRI TZUR MAGEN — site behaviour  (BLADE edition)
   Vanilla JS, no dependencies
   ========================================================== */

(() => {
  'use strict';

  /* ---- Year in footer ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Scroll progress bar ---- */
  const progressBar = document.getElementById('progressBar');
  const updateProgress = () => {
    if (!progressBar) return;
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  };

  /* ---- Header shrink on scroll ---- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
    updateProgress();
    showWaFloat();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Floating WhatsApp — appears after scrolling past hero ---- */
  const waFloat = document.getElementById('waFloat');
  const hero    = document.querySelector('.hero');

  const showWaFloat = () => {
    if (!waFloat || !hero) return;
    const heroBottom = hero.getBoundingClientRect().bottom;
    waFloat.classList.toggle('visible', heroBottom < 0);
  };

  /* ---- Mobile menu (dropdown style) ---- */
  const burger = document.querySelector('.hamburger');
  const nav    = document.querySelector('.nav');

  const closeMenu = () => {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  };

  if (burger && nav) {
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || burger.contains(e.target)) return;
      closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 960 && nav.classList.contains('is-open')) closeMenu();
    });
  }

  /* ---- Hero video graceful fallback ---- */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.addEventListener('error', () => { heroVideo.style.display = 'none'; });
    const source = heroVideo.querySelector('source');
    if (source) source.addEventListener('error', () => { heroVideo.style.display = 'none'; });
  }

  /* ---- Social placeholder links ---- */
  document.querySelectorAll('a[data-social]').forEach(a => {
    a.addEventListener('click', (e) => {
      if (a.getAttribute('href') === '#') e.preventDefault();
    });
  });

  /* ---- Intersection reveal ---- */
  const revealTargets = document.querySelectorAll(
    '.section-title, .lead, .service-row, .testi, .contact-card, .g-item, .hours, .about-photo, .stat, .hero-tagline, .section-number'
  );

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, i * 45);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => {
      el.classList.add('reveal');
      io.observe(el);
    });
  } else {
    revealTargets.forEach(el => el.classList.add('in-view'));
  }

  /* ==========================================================
     LIGHTBOX for gallery
     ========================================================== */
  const lightbox   = document.getElementById('lightbox');
  const lbContent  = lightbox.querySelector('.lb-content');
  const lbCaption  = lightbox.querySelector('.lb-caption');
  const lbCounter  = lightbox.querySelector('.lb-counter');
  const lbClose    = lightbox.querySelector('.lb-close');
  const lbPrev     = lightbox.querySelector('.lb-prev');
  const lbNext     = lightbox.querySelector('.lb-next');
  const galleryItems = Array.from(document.querySelectorAll('.g-item'));

  let currentIndex = 0;

  const renderLb = (idx) => {
    const item = galleryItems[idx];
    if (!item) return;
    const img     = item.querySelector('img');
    const caption = item.dataset.caption || '';

    while (lbContent.firstChild) lbContent.removeChild(lbContent.firstChild);

    if (img) {
      const clone = img.cloneNode();
      lbContent.appendChild(clone);
    }

    lbCaption.textContent = caption;
    lbCounter.textContent = `${idx + 1} / ${galleryItems.length}`;
    currentIndex = idx;
  };

  const openLb = (idx) => {
    renderLb(idx);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLb = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const nextLb = () => renderLb((currentIndex + 1) % galleryItems.length);
  const prevLb = () => renderLb((currentIndex - 1 + galleryItems.length) % galleryItems.length);

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => openLb(idx));
  });

  if (lbClose) lbClose.addEventListener('click', closeLb);
  if (lbPrev)  lbPrev.addEventListener('click', prevLb);
  if (lbNext)  lbNext.addEventListener('click', nextLb);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLb();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape')     closeLb();
    if (e.key === 'ArrowLeft')  nextLb();
    if (e.key === 'ArrowRight') prevLb();
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) { dx > 0 ? prevLb() : nextLb(); }
  }, { passive: true });

  /* ==========================================================
     PWA — Service Worker registration
     ========================================================== */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

})();
