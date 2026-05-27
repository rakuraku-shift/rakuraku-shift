/* ══════════════════════════════════════════
   RAKURAKU 求人自動入力 — Timee content script
   ══════════════════════════════════════════ */

(function() {
  /* RAKURAKU 共通ユーティリティを読み込む */
  const script = document.createElement('script');
  // (ここでは共通ロジックは inline 展開)

  async function main() {
    // ページが React 等で描画されるのを待つ
    await waitForBody();
    await delay(800);

    const pending = await getPending();
    if (!pending) return;

    // 求人作成ページ以外では何もしない（管理画面のホームに着地した時など）
    if (!looksLikePostingPage()) {
      showBanner('Timee', '求人作成ページに移動してから内容を確認してください。', true);
      return;
    }

    fillForm(pending);
    showBanner('Timee', '求人内容を自動入力しました。確認して公開してください。', false);
  }

  function looksLikePostingPage() {
    const url = location.href.toLowerCase();
    const t   = document.body.innerText.toLowerCase();
    return /job|post|new|求人|募集|作成|登録/.test(url + ' ' + t.slice(0, 2000));
  }

  function fillForm({ jobText, jobTitle, wage }) {
    /* タイトル系 input */
    const titleCandidates = [
      'input[name*="title" i]',
      'input[name*="name" i]',
      'input[placeholder*="タイトル"]',
      'input[placeholder*="求人名"]',
      'input[id*="title" i]',
    ];
    fillFirstMatch(titleCandidates, jobTitle);

    /* 本文系 textarea */
    const bodyCandidates = [
      'textarea[name*="description" i]',
      'textarea[name*="content" i]',
      'textarea[name*="detail" i]',
      'textarea[placeholder*="詳細"]',
      'textarea[placeholder*="募集"]',
      'textarea[placeholder*="仕事内容"]',
      'textarea',
    ];
    fillFirstMatch(bodyCandidates, jobText);

    /* 時給系 input */
    const wageCandidates = [
      'input[name*="wage" i]',
      'input[name*="hourly" i]',
      'input[name*="salary" i]',
      'input[type="number"][placeholder*="時給"]',
      'input[type="number"][placeholder*="円"]',
    ];
    fillFirstMatch(wageCandidates, String(wage || ''));
  }

  /* ───── helpers ───── */
  function fillFirstMatch(selectors, value) {
    if (!value) return false;
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) { setReactValue(el, value); return true; }
    }
    return false;
  }
  function setReactValue(el, value) {
    const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
    setter.call(el, value);
    el.dispatchEvent(new Event('input',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    el.focus();
    el.blur();
  }
  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
  function waitForBody() {
    return new Promise(resolve => {
      if (document.body) return resolve();
      const obs = new MutationObserver(() => {
        if (document.body) { obs.disconnect(); resolve(); }
      });
      obs.observe(document.documentElement, { childList: true });
    });
  }
  function getPending() {
    return new Promise(resolve => {
      chrome.runtime.sendMessage({ type: 'GET_PENDING' }, resolve);
    });
  }
  function showBanner(platform, msg, isWarn) {
    if (document.getElementById('rakuraku-banner')) return;
    const div = document.createElement('div');
    div.id = 'rakuraku-banner';
    div.style.cssText = `position:fixed;top:0;left:0;right:0;background:${isWarn?'linear-gradient(135deg,#F59E0B,#D97706)':'linear-gradient(135deg,#4F46E5,#7C3AED)'};color:#fff;padding:12px 20px;text-align:center;font-family:'Noto Sans JP','Helvetica Neue',sans-serif;font-size:14px;font-weight:700;z-index:2147483647;box-shadow:0 4px 12px rgba(0,0,0,.25);line-height:1.5;`;
    div.innerHTML = `🚀 <strong>RAKURAKU</strong> → ${platform}: ${msg} <button onclick="this.parentElement.remove()" style="margin-left:14px;background:rgba(255,255,255,.25);border:none;color:#fff;padding:4px 10px;border-radius:6px;cursor:pointer;font-weight:700;font-size:12px;">✕</button>`;
    document.body.appendChild(div);
    setTimeout(() => { if (div.isConnected) div.remove(); }, 30000);
  }

  main().catch(e => console.error('[RAKURAKU Timee]', e));
})();
