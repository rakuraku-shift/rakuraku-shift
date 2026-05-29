# 👤 人間にしかできない作業 TODO リスト

**作成日**: 2026-05-28
**対象**: 小泉 咲太 (代表)
**目的**: 明日からの本番営業 + 実店舗導入 で必要な「人間側」の準備作業

---

## 📧 営業自動化 — server.js 側追加実装 (Phase B 移行時)

### 配信停止 API エンドポイント追加が必須
```javascript
// server.js に追加
app.post('/api/unsubscribe', async (req, res) => {
  const {email, reason, otherReason, timestamp} = req.body;
  // unsubscribe_list テーブルに保存
  await db.run('INSERT INTO unsubscribe_list (email, reason, other_reason, unsubscribed_at) VALUES (?, ?, ?, ?)',
    [email, reason, otherReason, timestamp]);
  res.json({ok: true});
});

// 送信前に必ずチェック
async function isUnsubscribed(email) {
  const result = await db.get('SELECT 1 FROM unsubscribe_list WHERE email = ?', [email]);
  return !!result;
}
```

### DB スキーマ追加
- `unsubscribe_list` テーブル: email, reason, other_reason, unsubscribed_at
- `email_logs` テーブル: 送信履歴 (再送防止用)

### 営業ツール 3 種 (社内専用)
- `/unsubscribe.html` — 配信停止フォーム (公開)
- `/sales-lead-manager.html` — リード管理 (社内専用 noindex)
- `/email-template-generator.html` — メールテンプレ集 (社内専用 noindex)

---

## 🚨 セキュリティ最重要事項 (絶対守る)

### 🔒 `/noru-admin.html` は **代表 (恋ちゃん) 専用**

- **絶対にお客様にURLを教えない**
- **絶対にスタッフにパスワードを共有しない**
- **デフォルトPW: `KOIZUMI-RAKU-2026`** → 初回ログイン後 **必ず変更** すること
- 全店舗の課金状況・売上・個人情報が見えるため、漏洩は致命的

### 公開してOKなURL (お客様にOK)
- `/` (トップ)
- `/help.html`
- `/getting-started.html`
- `/shift.html?shop=xxx` (店舗専用URL)
- `/myshift.html?shop=xxx`
- `/attendance.html?shop=xxx`
- `/payroll.html` (店長専用)
- 他の営業ページ全般

### 絶対に教えてはいけないURL
- ❌ `/noru-admin.html` ← **代表専用**
- ❌ `/sitemap-view.html` ← 管理者用全URL一覧
- ❌ `/data-export.html` ← データ書き出し (誤削除リスク)

---

## 🔴 P0: 営業開始 24時間以内に必須

### 1. Railway 環境変数の設定 (所要 10分)

Railway ダッシュボード → プロジェクト → Variables から以下を設定:

```
# メール送信 (Gmail App Password)
EMAIL_USER=koizumishota0323@gmail.com
EMAIL_PASS=（後述の手順で取得）

# Stripe (本番キー)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID_MONTHLY=price_xxxxx
STRIPE_PRICE_ID_ANNUAL=price_xxxxx

# その他
LICENSE_SECRET=（ランダム32文字: openssl rand -base64 32 で生成）
BASE_URL=https://rakuraku-shift-production.up.railway.app
```

#### Gmail App Password 取得手順
1. https://myaccount.google.com/security にアクセス
2. 「2段階認証プロセス」を ON にする (まだなら)
3. https://myaccount.google.com/apppasswords
4. アプリ名「RAKURAKU Server」入力 → 16文字の App Password を取得
5. これを `EMAIL_PASS` に設定

⚠️ **設定後にRailwayが自動再起動します。再起動後にメール機能が動きます。**

---

### 2. Stripe 本番化 + Freemium 移行 (所要 30分〜2日)

**現状**: テストモード
**目標**: 本番モードで Freemium 体系の実カード決済できる状態

#### ⚠️ 2026-05-29 重要変更: Freemium 戦略へ移行
旧プラン (月¥4,990 / 年¥49,900 のみ) → 新プラン (Free + 30日Pro体験 + Pro¥4,990 + Enterprise)

#### 手順
1. https://dashboard.stripe.com/ にログイン
2. 右上の「テスト/本番」トグルを「本番」に切替
3. 「商品」→「商品を追加」で **Pro プラン 2 種類** 作成:
   - **Pro 月額**: ¥4,990/月 (recurring monthly) → `STRIPE_PRICE_ID_MONTHLY` に設定
   - **Pro 年額**: ¥49,900/年 (recurring yearly) → `STRIPE_PRICE_ID_ANNUAL` に設定
   - **※ Free プランは Stripe 不要** (DB フラグだけで管理)
   - **※ 30日Pro体験は Stripe Subscription を作らず、トライアル期間として server.js 側で管理**
4. 「開発者」→「APIキー」で本番の `sk_live_` と `pk_live_` を取得
5. 「開発者」→「Webhook」→ エンドポイント追加:
   - URL: `https://rakuraku-shift-production.up.railway.app/webhook/stripe`
   - イベント: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`, `customer.subscription.created`, `customer.subscription.updated`
   - シークレットをメモ → `STRIPE_WEBHOOK_SECRET` に設定
6. 本番審査が未完了の場合、Stripe から書類提出依頼が来る (運営会社名/銀行口座/本人確認書類)
   - 通常 3-7日で承認
   - **Freemium モデルは Stripe 審査でプラス評価** (無料ユーザー基盤 = 信頼性)

#### 🆓 Freemium 実装に必要な server.js 修正
- [ ] DB に `plan` カラム追加 (`free` / `trial` / `pro_monthly` / `pro_annual` / `enterprise`)
- [ ] DB に `trial_ends_at` カラム追加 (30日後の日時)
- [ ] DB に `staff_limit` カラム追加 (Free: 3, Trial/Pro: -1, Enterprise: -1)
- [ ] DB に `store_limit` カラム追加 (Free: 1, Pro: 3, Enterprise: -1)
- [ ] 機能フラグ実装: 売上連動AI/多言語/API/freee連携 は Pro のみ
- [ ] 30日経過時の自動降格バッチ (cron: 毎日深夜)
- [ ] アップグレード誘導 UI (スタッフ4人目追加時など)

⚠️ **本番審査通過まで実際の引き落としは発生しません**。テストカード `4242 4242 4242 4242` で動作確認可能。

---

### 3. ドメイン取得 (任意・所要 30分)

現状は `rakuraku-shift-production.up.railway.app` (Railwayサブドメイン)
**推奨**: 独自ドメイン (`rakuraku.jp` / `rakuraku-shift.com` 等)

#### 手順
1. お名前.com / Cloudflare / Google Domains 等で取得 (年¥1,000-3,000)
2. Railway → Settings → Domains → Custom Domain 追加
3. ネームサーバーで指示された CNAME レコードを設定
4. SSL 証明書は Railway が自動発行

---

### 4. 営業前テスト (所要 30分)

#### A. 全URLが開くか確認
ブラウザで以下を順にアクセス、それぞれエラーなく表示されるか:

- [ ] https://rakuraku-shift-production.up.railway.app/
- [ ] /about.html
- [ ] /help.html
- [ ] /getting-started.html
- [ ] /demo-reservation.html
- [ ] /referral.html
- [ ] /case-studies.html
- [ ] /blog.html
- [ ] /careers.html
- [ ] /roadmap.html
- [ ] /status.html
- [ ] /business-overview.html
- [ ] /shift.html
- [ ] /noru-admin.html
- [ ] /myshift.html
- [ ] /attendance.html

#### B. 主要機能の動作確認
- [ ] `/shift.html?shop=test-001` を開く → タブ切替できる (SmartNews風)
- [ ] スタッフ名入力 → 希望日選択 → 提出できる
- [ ] 「シフト管理」タブで自動生成できる
- [ ] スタッフ名タップ → 「個人給与を見る」→ パスワード設定できる
- [ ] `/attendance.html?shop=test-001` を開く → GPS取得できる
- [ ] `/noru-admin.html` で店舗追加できる
- [ ] /demo-reservation.html でフォーム送信できる

#### C. Stripe 決済テスト
- [ ] index.html → 「年払いで始める」→ 店舗情報入力 → Stripe Checkout 画面が開く
- [ ] テストカード `4242 4242 4242 4242` で決済完了
- [ ] payment-success.html にリダイレクト
- [ ] 登録メールアドレスに「店舗ID・専用URL・QRコード」付き歓迎メール届く
- [ ] noru-admin.html を開いて自動追加された店舗が表示されているか確認

---

## 🟠 P1: 営業開始 1週間以内

### 5. 名刺・パンフレット印刷 (所要 1-2日)

`/business-card.html` および `/flyer.html` がプレビュー可能。
- ラクスル / プリントパック で印刷発注
- A4 1枚 ¥30程度 / 名刺100枚 ¥500程度

### 6. Google ビジネスプロフィール登録 (所要 20分)
- https://www.google.com/business/
- 「RAKURAKU」で登録 → 住所・電話・営業時間を入力
- 検索結果に出るようになる

### 7. SNS アカウント作成 (所要 30分)
- Twitter/X: @rakuraku_shift など
- Instagram: rakuraku.shift など
- 簡単な開発日記投稿で SEO 強化

### 8. 営業先リスト作成 (所要 数時間)
**ターゲット**: スタッフ5名以上の BAR / 居酒屋 / カフェ

優先順位:
1. **知り合いの店舗** (直接営業)
2. **食べログ「バー」カテゴリ星3.5以上** 横浜・川崎エリア
3. **Instagram で見つけたお洒落バー** DM 営業
4. **同業者の紹介** (パートナー店舗を1店成立させてから)

---

## 🟡 P2: 安定運用フェーズ

### 9. 解約理由アンケート 確認 (週1)
- `/api/churn-survey` の集計結果を読む
- データ保存先: `data/churn-surveys.json`
- 改善要望が3件以上重なったら開発タスク化

### 10. 障害監視 (UptimeRobot 無料設定 / 所要 10分)
- https://uptimerobot.com/ アカウント作成
- 5分間隔で /health エンドポイントを監視
- ダウン時にメール通知
- これで深夜障害も寝てる間に検知可能

### 11. Search Console 登録 (所要 15分)
- https://search.google.com/search-console
- サイトマップ提出: `/sitemap.xml`
- インデックス促進

---

## 🟢 P3: 中長期 (1ヶ月以内)

### 12. 法人化検討
- 売上¥30万/月 (約3店舗) を超えたら合同会社設立
- 設立費用: 約¥6万 (登記+定款)
- メリット: 信用度UP・税金最適化

### 13. インボイス制度対応
- 法人化したら適格請求書発行事業者の登録
- https://www.invoice-kohyo.nta.go.jp/

### 14. PostgreSQL 移行
- 現在 JSON ファイル運用 (50店舗が限界)
- 30店舗を超えたら Railway PostgreSQL Add-on で移行
- データ移行スクリプトは要新規作成

### 15. LINE 公式アカウント取得
- https://www.linebiz.com/jp/entry/
- Messaging API 有効化 → Token を /notification-settings.html に入力
- これで店舗ごとに LINE 通知が動く

---

## 🛠 困った時の連絡先

- **Railway サポート**: https://railway.app/help
- **Stripe サポート**: https://support.stripe.com/ (日本語可)
- **Gmail SMTP問題**: Google Account → Security → 確認

---

## 📋 自分用 営業トーク チェックリスト

毎回の商談で必ず伝える3つ:

1. **「14日間無料・クレカ不要」** (心理ハードルを下げる)
2. **「年払いなら¥19,600節約+特典5つ」** (年契推奨)
3. **「3分でセットアップ完了」** (面倒くささを払拭)

---

**📞 困ったらメモを開いて、上から順に確認していけば大丈夫。**

最終更新: 2026-05-28
