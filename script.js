/* ==========================================================
   OMRI TZUR MAGEN — site behaviour
   Vanilla JS, no dependencies
   ========================================================== */

(() => {
  'use strict';

  /* ---- Year in footer ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Header shrink on scroll ---- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  const burger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');

  const closeMenu = () => {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });

    // Close with ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) closeMenu();
    });
  }

  /* ---- Intersection reveal ---- */
  const revealEls = document.querySelectorAll(
    '.section-title, .lead, .service-card, .testi, .contact-card, .g-item, .hours, .about-photo, .stat, .hero-tagline'
  );

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          entry.target.style.animationDelay = `${i * 0.05}s`;
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => {
      el.classList.add('reveal');
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ==========================================================
     LIGHTBOX for gallery
     ========================================================== */
  const lightbox = document.getElementById('lightbox');
  const lbContent = lightbox.querySelector('.lb-content');
  const lbCaption = lightbox.querySelector('.lb-caption');
  const lbCounter = lightbox.querySelector('.lb-counter');
  const lbClose = lightbox.querySelector('.lb-close');
  const lbPrev = lightbox.querySelector('.lb-prev');
  const lbNext = lightbox.querySelector('.lb-next');
  const galleryItems = Array.from(document.querySelectorAll('.g-item'));

  let currentIndex = 0;

  const renderLb = (idx) => {
    const item = galleryItems[idx];
    if (!item) return;
    const img = item.querySelector('img');
    const placeholder = item.querySelector('.g-placeholder');
    const caption = item.dataset.caption || '';

    lbContent.innerHTML = '';
    if (img) {
      const clone = img.cloneNode();
      lbContent.appendChild(clone);
    } else if (placeholder) {
      // Clone the placeholder so it looks the same when expanded
      const clone = placeholder.cloneNode(true);
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
  if (lbPrev) lbPrev.addEventListener('click', prevLb);
  if (lbNext) lbNext.addEventListener('click', nextLb);

  // Click outside to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLb();
  });

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') nextLb();   // RTL: left arrow = next
    if (e.key === 'ArrowRight') prevLb();  // RTL: right arrow = prev
  });

  // Swipe (mobile)
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx > 0) prevLb(); else nextLb();  // RTL-friendly
    }
  }, { passive: true });

  /* ==========================================================
     PWA — Service Worker registration
     ========================================================== */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {
        // Silent failure - PWA is a progressive enhancement
      });
    });
  }

})();
