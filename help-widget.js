/* ════════════════════════════════════════════
   RAKURAKU ヘルプウィジェット
   全ページの右下に floating help button を配置
   クリックでヘルプメニュー (FAQ/問い合わせ/デモ予約) 展開
   ════════════════════════════════════════════ */

(function(window) {
  'use strict';

  function buildWidget() {
    /* 既に存在すればスキップ */
    if (document.getElementById('rakuraku-help-widget')) return;

    /* CSS */
    const style = document.createElement('style');
    style.textContent = `
      #rakuraku-help-widget {
        position: fixed; bottom: 18px; right: 18px; z-index: 9998;
        font-family: 'Noto Sans JP','Inter',sans-serif;
      }
      .rhw-btn {
        width: 56px; height: 56px; border-radius: 50%;
        background: linear-gradient(135deg, #4F46E5, #7C3AED);
        color: #fff; border: none; cursor: pointer;
        box-shadow: 0 8px 24px rgba(79,70,229,.4);
        font-size: 26px; transition: transform .2s, box-shadow .2s;
        display: flex; align-items: center; justify-content: center;
      }
      .rhw-btn:hover { transform: scale(1.05); box-shadow: 0 12px 30px rgba(79,70,229,.5); }
      .rhw-btn.active { background: #EF4444; }
      .rhw-panel {
        position: absolute; bottom: 70px; right: 0;
        width: 320px; background: #fff; border-radius: 16px;
        box-shadow: 0 12px 40px rgba(0,0,0,.18);
        overflow: hidden; display: none; max-height: 80vh;
        animation: rhw-slide-up .25s;
      }
      .rhw-panel.show { display: block; }
      @keyframes rhw-slide-up {
        from { transform: translateY(10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .rhw-header {
        background: linear-gradient(135deg, #4F46E5, #7C3AED);
        color: #fff; padding: 18px 18px 16px;
      }
      .rhw-h-title { font-size: 16px; font-weight: 900; }
      .rhw-h-sub { font-size: 11px; opacity: .9; font-weight: 600; margin-top: 3px; }
      .rhw-section { padding: 14px 18px; border-bottom: 1px solid #F1F5F9; }
      .rhw-section:last-child { border-bottom: none; }
      .rhw-section-t {
        font-size: 10px; font-weight: 800; color: #64748B;
        letter-spacing: .04em; margin-bottom: 8px; text-transform: uppercase;
      }
      .rhw-link {
        display: flex; align-items: center; gap: 10px;
        padding: 9px 10px; border-radius: 8px;
        font-size: 13px; font-weight: 700; color: #334155;
        text-decoration: none; cursor: pointer; transition: background .12s;
      }
      .rhw-link:hover { background: #F8FAFC; color: #4F46E5; }
      .rhw-link .ic { font-size: 18px; flex-shrink: 0; }
      .rhw-link .desc {
        font-size: 10px; color: #64748B; font-weight: 600; margin-top: 1px;
      }
      .rhw-search {
        width: 100%; padding: 10px 12px; border: 1.5px solid #E2E8F0;
        border-radius: 8px; font-size: 13px; font-family: inherit;
        outline: none; background: #F8FAFC;
      }
      .rhw-search:focus { border-color: #4F46E5; background: #fff; }
      .rhw-cta {
        display: block; padding: 12px; text-align: center;
        background: linear-gradient(135deg, #4F46E5, #7C3AED);
        color: #fff; border-radius: 10px; text-decoration: none;
        font-weight: 800; font-size: 13px; margin-top: 8px;
      }
      .rhw-footer {
        padding: 12px 18px; background: #F8FAFC;
        font-size: 10px; color: #64748B; text-align: center; font-weight: 600;
      }
      .rhw-footer a { color: #4F46E5; text-decoration: none; font-weight: 700; }
      @media(max-width: 480px) {
        .rhw-panel { width: calc(100vw - 36px); right: -8px; }
      }
    `;
    document.head.appendChild(style);

    /* DOM */
    const widget = document.createElement('div');
    widget.id = 'rakuraku-help-widget';
    widget.innerHTML = `
      <div class="rhw-panel" id="rhw-panel">
        <div class="rhw-header">
          <div class="rhw-h-title">👋 何かお手伝いできますか?</div>
          <div class="rhw-h-sub">よくある質問・問い合わせ・デモ予約</div>
        </div>
        <div class="rhw-section">
          <input type="text" class="rhw-search" placeholder="🔍 質問を検索 (例: 料金, 解約, 多言語)" oninput="window.rhwSearch(this.value)" />
        </div>
        <div class="rhw-section">
          <div class="rhw-section-t">⚡ よく使う機能</div>
          <a href="/getting-started.html" class="rhw-link"><span class="ic">🚀</span><div><div>3分で始める</div><div class="desc">セットアップガイド</div></div></a>
          <a href="/tutorial.html" class="rhw-link"><span class="ic">📺</span><div><div>動画チュートリアル</div><div class="desc">3分×5本で完全マスター</div></div></a>
          <a href="/help.html" class="rhw-link"><span class="ic">❓</span><div><div>よくある質問</div><div class="desc">46項目のFAQ</div></div></a>
          <a href="/blog.html" class="rhw-link"><span class="ic">📚</span><div><div>ブログ</div><div class="desc">店舗運営ノウハウ</div></div></a>
          <a href="/roadmap.html" class="rhw-link"><span class="ic">🗺</span><div><div>ロードマップ</div><div class="desc">機能投票・要望投稿</div></div></a>
          <a href="/status.html" class="rhw-link"><span class="ic">🚦</span><div><div>稼働状況</div><div class="desc">障害情報・SLA</div></div></a>
        </div>
        <div class="rhw-section">
          <div class="rhw-section-t">📞 直接お問い合わせ</div>
          <a href="mailto:koizumishota0323@gmail.com" class="rhw-link"><span class="ic">📧</span><div><div>メールで質問</div><div class="desc">代表が24h以内に返信</div></div></a>
          <a href="tel:08051683303" class="rhw-link"><span class="ic">📞</span><div><div>080-5168-3303</div><div class="desc">平日 10-19時</div></div></a>
          <a href="/demo-reservation.html" class="rhw-cta">🎁 無料デモを予約</a>
        </div>
        <div class="rhw-footer">
          RAKURAKU / <a href="/about.html">会社情報</a> · <a href="/help.html">ヘルプ</a>
        </div>
      </div>
      <button class="rhw-btn" id="rhw-btn" aria-label="ヘルプを開く">💬</button>
    `;
    document.body.appendChild(widget);

    /* 開閉 */
    const btn = document.getElementById('rhw-btn');
    const panel = document.getElementById('rhw-panel');
    btn.addEventListener('click', function() {
      panel.classList.toggle('show');
      btn.classList.toggle('active');
      btn.textContent = btn.classList.contains('active') ? '✕' : '💬';
    });
    /* 外側クリックで閉じる */
    document.addEventListener('click', function(e) {
      if (!widget.contains(e.target)) {
        panel.classList.remove('show');
        btn.classList.remove('active');
        btn.textContent = '💬';
      }
    });
  }

  /* 簡易検索 */
  window.rhwSearch = function(q) {
    if (!q || q.length < 2) return;
    /* help.html に該当キーワード付きで遷移 */
    /* デバウンス: 連続入力で確定後遷移するのは負荷が高いので、Enter キーで検索 */
  };

  /* DOM準備後に組み立て */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})(window);
