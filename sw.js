// Bhavya's DeepSearch Service Worker (Fresh Cache v3.0)
const CACHE_NAME = 'bhavya-deepsearch-v3.0';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => caches.delete(k)));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Always fetch fresh network requests for API and scripts
  if (e.request.url.includes('/api/') || e.request.url.includes('.js')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
