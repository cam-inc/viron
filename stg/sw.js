// `0.0.1`はrollupにて書き換えられる。
const VERSION = '0.0.1';
const BASE_DIR = '/viron/stg/';
const CACHE_NAME = `viron-${VERSION}`;
const CACHE_WHITELIST = [CACHE_NAME];
// 環境別に対応させるために相対パスで指定。
const urlsToCache = [
  `${BASE_DIR}`,
  `${BASE_DIR}css/app.min.css?_=${VERSION}`,
  `${BASE_DIR}js/app.js?_=${VERSION}`,
  `${BASE_DIR}js/swagger-client.js?_=${VERSION}`,
  `${BASE_DIR}img/logo.png?_=${VERSION}`,
  `${BASE_DIR}font/anticon.woff?_=${VERSION}`
];

// インストール時の処理。
this.addEventListener('install', event => {
  console.log(`install: ${VERSION}`);// eslint-disable-line no-console
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// 有効時の処理。
this.addEventListener('activate', event => {
  console.log(`activate: ${VERSION}`);// eslint-disable-line no-console
  event.waitUntil(
    caches.keys().then(cacheNames => Promise.all(cacheNames.map(cacheName => {
      if (CACHE_WHITELIST.indexOf(cacheName) === -1) {
        return caches.delete(cacheName);
      }
    })))
  );
});


// リクエスト時の処理。
this.addEventListener('fetch', event => {
  console.log(`fetch: ${VERSION}`);// eslint-disable-line no-console
  event.respondWith(
    caches
      .match(event.request)
      .then(response => {
        if (!!response) {
          console.log(`from cache: ${event.request.url}`);// eslint-disable-line no-console
          return response;
        }
        return fetch(event.request);
      })
  );
});
