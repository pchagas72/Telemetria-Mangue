const CACHE_NAME = 'mangue-v2';
const FILES_TO_CACHE = [
  '/app/index.html',
  '/app/replay.html',
  '/app/style.css',
  '/app/script.js',
  '/app/replay.js',
  '/app/icon-192.png',
  '/app/icon-512.png'
];;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

