/* RAKURAKU Service Worker v13 — Wave1-43 完了 + 個別事例 3本 + competitor-matrix + success-tips 追加 */
var CACHE = 'rakuraku-v13';
var ASSETS = [
  '/shift.html',
  '/noru-admin.html',
  '/myshift.html',
  '/attendance.html',
  '/payroll.html',
  '/monthly-report.html',
  '/staff-monthly.html',
  '/master-data.html',
  '/hq-dashboard.html',
  '/demo-reservation.html',
  '/referral.html',
  '/case-studies.html',
  '/blog.html',
  '/guide.html',
  '/glossary.html',
  '/press-release.html',
  '/lounge.html',
  '/snack.html',
  '/karaoke.html',
  '/club.html',
  '/dining-bar.html',
  '/vs-airshift.html',
  '/vs-shiftee.html',
  '/vs-freee.html',
  '/features/',
  '/features/gps.html',
  '/features/labor-law.html',
  '/features/multi-language.html',
  '/legal/terms.html',
  '/legal/privacy.html',
  '/legal/specified-commercial.html',
  '/security.html',
  '/integrations.html',
  '/api-docs.html',
  '/search.html',
  '/community.html',
  '/onboarding.html',
  '/enterprise.html',
  '/partner-program.html',
  '/tutorials.html',
  '/mobile-app.html',
  '/webinar.html',
  '/pricing.html',
  '/testimonials.html',
  '/changelog.html',
  '/case-bar.html',
  '/case-izakaya.html',
  '/case-cafe.html',
  '/competitor-matrix.html',
  '/success-tips.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/i18n.js',
  '/offline-sync.js',
  '/notification-settings.html',
  '/sales-import.html',
  '/announcements.html',
  '/staff-dashboard.html',
  '/data-export.html',
  '/careers.html',
  '/help-widget.js',
  '/roadmap.html',
  '/status.html',
  '/churn-survey.html'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      /* 一部のアセットが見つからなくても install 失敗しないように個別 addAll */
      return Promise.all(ASSETS.map(function(url) {
        return cache.add(url).catch(function(err) { console.warn('[SW] cache failed:', url, err.message); });
      }));
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
  /* API リクエストはキャッシュしない（常にネット） */
  if (e.request.url.indexOf('/api/') !== -1 || e.request.url.indexOf('/socket.io/') !== -1) {
    return;
  }
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

/* ────────────────────────────────────────────
 * Push 通知（シフト確定・締切リマインドなど）
 * ──────────────────────────────────────────── */
self.addEventListener('push', function(e) {
  var data = {};
  try {
    if (e.data) data = e.data.json();
  } catch(err) {
    if (e.data) data = { title: 'RAKURAKU', body: e.data.text() };
  }

  var title = data.title || 'RAKURAKU';
  var options = {
    body: data.body || 'お知らせがあります',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'rakuraku-notification',
    data: { url: data.url || '/shift.html', ...data.meta },
    actions: data.actions || [
      { action: 'open', title: '開く' },
      { action: 'close', title: '閉じる' }
    ],
    requireInteraction: data.requireInteraction || false,
    vibrate: [100, 50, 100]
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  if (e.action === 'close') return;

  var url = (e.notification.data && e.notification.data.url) || '/shift.html';

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var c = clientList[i];
        if (c.url.indexOf(url) !== -1 && 'focus' in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});

/* バックグラウンド同期（オフライン → オンライン復帰時にシフト希望を送信） */
self.addEventListener('sync', function(e) {
  if (e.tag === 'rakuraku-sync-submissions') {
    e.waitUntil(syncPendingSubmissions());
  }
});

function syncPendingSubmissions() {
  /* IndexedDB から保留中の提出を取り出して /api/submit に POST する想定 */
  /* 今は placeholder。実運用時に IndexedDB 統合を追加 */
  return Promise.resolve();
}
