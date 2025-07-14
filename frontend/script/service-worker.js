const CACHE_NAME = 'mangue-v2';
const FILES_TO_CACHE = [
  '/app/index.html',
  '/app/replay.html',
  '/app/CSS/style.css',
  '/app/script/script.js',
  '/app/script/replay.js',
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

