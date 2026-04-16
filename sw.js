/* ==========================================================
   OMRI TZUR MAGEN — Service Worker
   Simple offline-first cache for static assets
   ========================================================== */

const CACHE_NAME = 'otm-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './assets/logo.png',
  './assets/logo-full.png',
  './assets/mark-otm.png',
  './assets/wordmark.png',
  './assets/favicon.png',
  './assets/apple-touch-icon.png',
  './assets/omri-portrait.png'
];

/* Install — cache core assets */
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
      .catch(() => {}) // don't block install on cache failure
  );
  self.skipWaiting();
});

/* Activate — clean up old caches */
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Fetch — cache-first for assets, network-first for HTML */
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // HTML: network-first so users see updates
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Other assets: cache-first
  e.respondWith(
    caches.match(req).then((cached) =>
      cached || fetch(req).then((res) => {
        if (res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached)
    )
  );
});
