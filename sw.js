// sw.js – Service Worker básico
const CACHE_NAME = 'rss-reader-static-v1';
const ASSETS = [
  '/',                       // index.html
  '/css/main.css',
  '/src/app/init.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// Simple “network‑first” strategy
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .catch(() => caches.match(e.request))
  );
});