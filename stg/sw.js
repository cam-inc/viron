const VERSION = '1.0.17';
const CACHE_NAME = 'viron';
const urlsToCache = ['/css/app.min.css'];

// インストール時の処理。
self.addEventListener('install', event => {
  console.log(`install: ${VERSION}`);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// 有効時の処理。
this.addEventListener('activate', event => {
  console.log(`activate: ${VERSION}`);
});

// リクエスト時の処理。
this.addEventListener('fetch', event => {
  console.log(`fetch: ${VERSION}`);
  event.respondWith(
    caches
      .match(event.request)
      .then(response => {
        if (!!response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
