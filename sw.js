/* RAKURAKU Service Worker v24 — i18n.js 更新を配信 (mgr.shift_edit_* / 顔認証 att.face_* / メッセージ msg.* の新キー). i18n.js はキャッシュ優先のため、翻訳キー追加時はこのバージョンを必ず上げること */
var CACHE = 'rakuraku-v24';
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
  '/demo-experience.html',
  '/referral.html',
  '/case-studies.html',
  '/blog.html',
  '/guide.html',
  '/glossary.html',
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
  '/churn-survey.html',
  /* campaign-founders / founder-activate / founder-welcome は廃止 (cache 除外) */
  '/staff-login.html',
  '/staff-invite.html',
  '/bank-transfer.html'
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

  var isHTML = e.request.destination === 'document'
            || (e.request.headers.get('accept') || '').indexOf('text/html') !== -1;

  /* ============== HTML: ネットワーク優先 (古い料金キャッシュを防ぐ) ============== */
  if (isHTML) {
    e.respondWith(
      fetch(e.request).then(function(res) {
        /* 成功時のみキャッシュ更新 */
        if (res && res.status === 200) {
          var clone = res.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return res;
      }).catch(function() {
        /* オフライン時のみキャッシュから復旧 */
        return caches.match(e.request).then(function(cached) {
          return cached || caches.match('/shift.html');
        });
      })
    );
    return;
  }

  /* ============== 静的アセット (JS/CSS/画像): キャッシュ優先 ============== */
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var clone = res.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return res;
      });
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
