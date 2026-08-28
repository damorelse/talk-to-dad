/**
 * Service Worker: Talk With Dad Offline-First AAC Progressive Web App
 * Cache-First strategy for static assets and offline shell, Network-First fallback.
 */

const CACHE_NAME = 'talkwithdad-pwa-v1';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './manifest.json',
  './favicon.svg',
  './privacy.html',
  './terms.html',
];

// Install event: Precache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate event: Clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip cross-origin or non-http requests
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset immediately, update cache in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Offline - ignore network error
          });

        return cachedResponse;
      }

      // If not in cache, fetch from network and cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Fallback to offline index.html if navigating
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html') || caches.match('index.html');
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
    })
  );
});
