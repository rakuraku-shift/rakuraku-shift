/* RAKURAKU Service Worker v1 */
var CACHE = 'rakuraku-v1';
var ASSETS = [
  '/shift.html',
  '/noru-admin.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  /* navigation リクエストはキャッシュ優先、なければネット */
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(res) {
        /* 成功レスポンスだけキャッシュに追加 */
        if (res && res.status === 200 && res.type === 'basic') {
          var clone = res.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return res;
      });
    }).catch(function() {
      /* オフライン時: HTMLリクエストには /shift.html を返す */
      if (e.request.destination === 'document') {
        return caches.match('/shift.html');
      }
    })
  );
});
