// sw.js – Service Worker básico
const CACHE_NAME = 'rss-reader-cache-v1';
const ASSETS_TO_CACHE = [
  '/',                         // index.html
  '/css/main.css',
  '/src/app/init.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
];

// Instalación: caché de los assets estáticos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activación: limpieza de caches viejas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Interceptamos todas las peticiones
self.addEventListener('fetch', event => {
  // Estrategia “Cache‑first, network fallback”
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).then(networkResp => {
        if (event.request.method === 'GET' && networkResp.ok) {
          const clone = networkResp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResp;
      });
    })
  );
});