/* ════════════════════════════════════════════
   RAKURAKU オフライン対応モジュール
   - IndexedDB バックアップ (localStorage の保険)
   - 送信失敗 API リクエストのキューイング + オンライン復帰時に自動再送
   - ネットワーク状態モニター
   ════════════════════════════════════════════ */

(function(window) {
  'use strict';

  const DB_NAME = 'rakuraku-offline';
  const DB_VERSION = 1;
  const STORE_BACKUP = 'backup';
  const STORE_QUEUE = 'queue';

  let _db = null;

  /* IndexedDB 初期化 */
  function openDB() {
    return new Promise((resolve, reject) => {
      if (_db) return resolve(_db);
      if (!window.indexedDB) {
        console.warn('[offline-sync] IndexedDB 非対応 — メモリのみで動作');
        return resolve(null);
      }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_BACKUP)) {
          db.createObjectStore(STORE_BACKUP, { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains(STORE_QUEUE)) {
          const s = db.createObjectStore(STORE_QUEUE, { keyPath: 'id', autoIncrement: true });
          s.createIndex('ts', 'ts', { unique: false });
        }
      };
      req.onsuccess = e => { _db = e.target.result; resolve(_db); };
      req.onerror = e => reject(e.target.error);
    });
  }

  /* localStorage 全体を IndexedDB にバックアップ */
  async function backupLocalStorage() {
    const db = await openDB();
    if (!db) return false;
    const tx = db.transaction([STORE_BACKUP], 'readwrite');
    const store = tx.objectStore(STORE_BACKUP);
    const keys = Object.keys(localStorage);
    keys.forEach(k => {
      try {
        store.put({ key: k, value: localStorage.getItem(k), backedUpAt: Date.now() });
      } catch(e) { /* ignore */ }
    });
    return new Promise((res, rej) => {
      tx.oncomplete = () => res(true);
      tx.onerror = e => rej(e.target.error);
    });
  }

  /* IndexedDB から localStorage を復元 (localStorage が空の場合のみ) */
  async function restoreFromBackup() {
    const db = await openDB();
    if (!db) return false;
    if (localStorage.length > 0) return false; /* 既にデータあり */
    return new Promise((res, rej) => {
      const tx = db.transaction([STORE_BACKUP], 'readonly');
      const req = tx.objectStore(STORE_BACKUP).getAll();
      req.onsuccess = () => {
        let restored = 0;
        req.result.forEach(item => {
          try {
            localStorage.setItem(item.key, item.value);
            restored++;
          } catch(e) {}
        });
        console.log(`[offline-sync] ${restored} 件を復元`);
        res(restored > 0);
      };
      req.onerror = e => rej(e.target.error);
    });
  }

  /* 送信失敗リクエストをキューに追加 */
  async function queueRequest(url, options) {
    const db = await openDB();
    if (!db) return false;
    return new Promise((res, rej) => {
      const tx = db.transaction([STORE_QUEUE], 'readwrite');
      tx.objectStore(STORE_QUEUE).add({
        url, options, ts: Date.now(), retries: 0
      });
      tx.oncomplete = () => res(true);
      tx.onerror = e => rej(e.target.error);
    });
  }

  /* オンライン復帰時にキューを再送 */
  async function flushQueue() {
    const db = await openDB();
    if (!db || !navigator.onLine) return;
    return new Promise((res, rej) => {
      const tx = db.transaction([STORE_QUEUE], 'readwrite');
      const store = tx.objectStore(STORE_QUEUE);
      const req = store.getAll();
      req.onsuccess = async () => {
        const queue = req.result;
        let sent = 0;
        for (const item of queue) {
          try {
            const r = await fetch(item.url, item.options);
            if (r.ok) {
              store.delete(item.id);
              sent++;
            } else if (item.retries > 5) {
              store.delete(item.id); /* 5回失敗で諦め */
            } else {
              item.retries++;
              store.put(item);
            }
          } catch(e) {
            /* ネットワーク失敗 — 次回試す */
          }
        }
        if (sent > 0) console.log(`[offline-sync] キュー ${sent} 件を送信`);
        res(sent);
      };
      req.onerror = e => rej(e.target.error);
    });
  }

  /* fetch ラッパー — 失敗時に自動キュー */
  async function safeFetch(url, options) {
    options = options || {};
    if (!navigator.onLine) {
      /* オフライン → 即キュー */
      await queueRequest(url, options);
      throw new Error('offline-queued');
    }
    try {
      const res = await fetch(url, options);
      if (!res.ok && options.method && options.method !== 'GET') {
        await queueRequest(url, options);
      }
      return res;
    } catch(e) {
      if (options.method && options.method !== 'GET') {
        await queueRequest(url, options);
      }
      throw e;
    }
  }

  /* ネットワーク状態 UI */
  function setupNetworkBadge() {
    let badge = document.getElementById('net-status-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'net-status-badge';
      badge.style.cssText = 'position:fixed;top:8px;right:8px;padding:5px 10px;border-radius:14px;font-size:10px;font-weight:800;z-index:9999;display:none;font-family:inherit;box-shadow:0 2px 8px rgba(0,0,0,.15);';
      document.body.appendChild(badge);
    }
    function update() {
      if (navigator.onLine) {
        badge.style.display = 'none';
      } else {
        badge.style.display = 'block';
        badge.style.background = '#EF4444';
        badge.style.color = '#fff';
        badge.textContent = '⚠ オフライン (自動保存中)';
      }
    }
    window.addEventListener('online', () => {
      update();
      badge.style.display = 'block';
      badge.style.background = '#10B981';
      badge.style.color = '#fff';
      badge.textContent = '✓ オンライン復帰 — 同期中…';
      flushQueue().then(sent => {
        if (sent > 0) {
          badge.textContent = `✓ ${sent}件 同期完了`;
          setTimeout(() => { badge.style.display = 'none'; }, 3000);
        } else {
          badge.style.display = 'none';
        }
      });
    });
    window.addEventListener('offline', update);
    update();
  }

  /* 自動バックアップ (5分ごと) */
  function setupAutoBackup() {
    setInterval(backupLocalStorage, 5 * 60 * 1000);
    /* 初回バックアップ */
    setTimeout(backupLocalStorage, 5000);
  }

  /* 起動時に復元試行 */
  function init() {
    openDB().then(() => {
      restoreFromBackup().catch(() => {});
      setupNetworkBadge();
      setupAutoBackup();
      if (navigator.onLine) flushQueue().catch(() => {});
    }).catch(e => console.warn('[offline-sync]', e));
  }

  /* DOM準備後に init */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* グローバル API */
  window.RakuOffline = {
    backup: backupLocalStorage,
    restore: restoreFromBackup,
    queue: queueRequest,
    flush: flushQueue,
    safeFetch,
  };
})(window);
