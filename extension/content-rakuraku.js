/* ══════════════════════════════════════════
   RAKURAKU 求人自動入力 — Bridge content script
   RAKURAKU サイト (localhost / Cloudflare Tunnel) で動作し
   page <-> extension のメッセージを橋渡しする
   ══════════════════════════════════════════ */

(function() {
  if (window.__rakurakuExtBridgeInjected) return;
  window.__rakurakuExtBridgeInjected = true;

  const MARKER = 'RAKURAKU_EXT';

  /* page → ext */
  window.addEventListener('message', function(event) {
    if (event.source !== window) return;
    const d = event.data;
    if (!d || d.target !== MARKER || !d.payload) return;

    try {
      chrome.runtime.sendMessage(d.payload, function(response) {
        // chrome.runtime.lastError may exist if the service worker is sleeping
        window.postMessage({
          target: MARKER + '_RESPONSE',
          requestId: d.requestId,
          response: response || null,
          error: chrome.runtime.lastError ? chrome.runtime.lastError.message : null,
        }, '*');
      });
    } catch (e) {
      window.postMessage({
        target: MARKER + '_RESPONSE',
        requestId: d.requestId,
        response: null,
        error: e.message,
      }, '*');
    }
  });

  /* ext → page (READY signal) */
  function announce() {
    let version = '0.1.0';
    try { version = chrome.runtime.getManifest().version; } catch(e) {}
    window.postMessage({ target: MARKER + '_READY', version }, '*');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', announce);
  } else {
    announce();
  }
  // 念のため数回繰り返し（SPAの後発描画対策）
  setTimeout(announce, 500);
  setTimeout(announce, 1500);
})();
