const CACHE_NAME = 'foodio-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  './src/assets/logo.png',
  './src/assets/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass service worker for API calls and uploads to prevent CORS/Interception issues
  if (url.port === '3000' || url.pathname.includes('/api/') || url.pathname.includes('/uploads/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        return new Response('', { status: 404, statusText: 'Not Found' });
      });
    })
  );
});
