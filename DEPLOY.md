# 🚀 RAKURAKU デプロイ手順 (Railway)

このドキュメントは **30分で本番公開** までの手順です。

---

## 📋 進捗チェックリスト

- [ ] **STEP 1**: GitHub アカウント作成 (5分・初回のみ)
- [ ] **STEP 2**: GitHub に新規リポジトリ作成 (2分)
- [ ] **STEP 3**: ローカルコードを GitHub にプッシュ (2分・コマンドコピペ)
- [ ] **STEP 4**: Railway アカウント作成 (3分・初回のみ)
- [ ] **STEP 5**: Railway で GitHub リポジトリと接続 (2分)
- [ ] **STEP 6**: 環境変数を Railway に設定 (5分・コピペ)
- [ ] **STEP 7**: 永続ボリュームを追加 (3分・データ消失防止)
- [ ] **STEP 8**: 公開URL取得 + 動作確認 (3分)
- [ ] **STEP 9**: Stripe Webhook URL を本番URLに更新 (2分)
- [ ] **STEP 10**: 自動デプロイ確認 (`git push` で即反映)

---

## STEP 1 — GitHub アカウント作成

すでに持っている場合はスキップ。

1. [https://github.com/signup](https://github.com/signup) を開く
2. メアド (`koizumishota0323@gmail.com`) を入力
3. パスワード設定
4. ユーザー名選択 (例: `koizumishota`)
5. メール認証

---

## STEP 2 — リポジトリ作成

1. [https://github.com/new](https://github.com/new) を開く
2. **Repository name**: `rakuraku-shift`
3. **Description**: `RAKURAKU — バー・飲食店向けシフト管理SaaS`
4. **Private** にチェック（コード非公開）
5. ⚠️ **「Initialize this repository with」のチェックは全部OFF** (READMEもgitignoreも作らない)
6. **Create repository** クリック

→ 次の画面で **`https://github.com/USERNAME/rakuraku-shift.git`** のようなURLが表示される。これをコピー。

---

## STEP 3 — ローカルコードを GitHub にプッシュ

ターミナルで以下を実行（**`USERNAME` の部分を自分のGitHubユーザー名に置換**）:

```bash
cd /Users/koizumishota0323/bar-exchange

# git の初回設定（初回のみ）
git config --global user.name "あなたの名前"
git config --global user.email "koizumishota0323@gmail.com"

# リモート追加 ＆ プッシュ
git remote add origin https://github.com/USERNAME/rakuraku-shift.git
git branch -M main
git push -u origin main
```

初回プッシュでGitHubのログイン画面が出るので、ブラウザで認証。

✅ プッシュ成功すると、GitHubのリポジトリページにファイルが表示される。

---

## STEP 4 — Railway アカウント作成

1. [https://railway.app](https://railway.app) を開く
2. **「Login」→「Login with GitHub」** をクリック
3. GitHub認証 → Railwayのアクセス許可
4. **クレジットカード登録**（無料枠でも本人確認のため必要）
   - $5/月の無料クレジットが自動で付く
   - 月100-1000ユーザーくらいまでは実質無料

---

## STEP 5 — Railway で GitHub リポジトリと接続

1. Railway ダッシュボード → **「New Project」**
2. **「Deploy from GitHub repo」** を選択
3. リスト中から **`rakuraku-shift`** を選ぶ
4. **「Deploy Now」** クリック
5. 自動でビルドが始まる（2-3分）

---

## STEP 6 — 環境変数を Railway に設定

ビルド中に並行して環境変数を設定します。

1. Railway プロジェクト画面 → **「Variables」** タブ
2. 以下を1つずつ **「+ New Variable」** で追加：

### 必須環境変数

```env
PORT=3000
BASE_URL=https://rakuraku-shift-production.up.railway.app
# ↑ STEP 8 で取得する自分のURLに後で書き換え

# Stripe (Stripeダッシュボードで取得)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_PRICE_ID_MONTHLY=price_xxxxx
STRIPE_PRICE_ID_ANNUAL=price_xxxxx

# ライセンス署名用シークレット（長いランダム文字列）
LICENSE_SECRET=ここに長いランダム文字列を入れる（後で生成）

# Gmail メール送信
EMAIL_USER=koizumishota0323@gmail.com
EMAIL_PASS=（Gmail アプリパスワード16文字）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### LICENSE_SECRET の生成方法

ターミナルで：

```bash
openssl rand -hex 32
```

出力された64文字の文字列を `LICENSE_SECRET` に貼り付け。

---

## STEP 7 — 永続ボリューム追加（データ消失防止）

Railway はデフォルトだと **再デプロイのたびに `data/` が消えます**。永続ボリュームを設定します。

1. Railway プロジェクト → **「Settings」→「Volumes」**
2. **「+ New Volume」** クリック
3. **Mount path**: `/app/data`
4. **Size**: 1GB（無料枠で十分）
5. **「Add」** クリック
6. **「Deploy」** で再デプロイ

これで顧客データ・シフトデータが消えなくなります。

---

## STEP 8 — 公開URL取得 + 動作確認

1. Railway プロジェクト → **「Settings」→「Networking」**
2. **「Generate Domain」** をクリック
3. 例: `https://rakuraku-shift-production-xxxx.up.railway.app` が表示される
4. このURLをコピー
5. **STEP 6 の `BASE_URL` をこのURLに書き換える** → 再デプロイ

### 動作確認

ブラウザで以下を確認：

| URL | 期待する表示 |
|---|---|
| `BASE_URL/` | ランディングページ（RAKURAKU紹介） |
| `BASE_URL/shift.html?shop=test` | シフト管理画面（オンライン同期バッジ緑） |
| `BASE_URL/noru-admin.html` | 本社管理コンソール（パスワード `NORU2025`） |

---

## STEP 9 — Stripe Webhook URL を本番に更新

1. [Stripe ダッシュボード](https://dashboard.stripe.com/webhooks) を開く
2. 既存の Webhook を編集 or **「+ Add endpoint」** で新規作成
3. **Endpoint URL**: `BASE_URL/webhook/stripe`
4. **イベント選択**:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. **「Add endpoint」** → 表示される **Signing secret** (`whsec_...`) を Railway の `STRIPE_WEBHOOK_SECRET` に上書き → 再デプロイ

---

## STEP 10 — 以降の更新は `git push` 1回

コード変更したら：

```bash
cd /Users/koizumishota0323/bar-exchange
git add .
git commit -m "更新内容のメモ"
git push
```

→ Railway が **自動で検知して再デプロイ**（2-3分で反映）。

---

## 🆘 よくあるトラブル

| 症状 | 対処 |
|---|---|
| `git push` で permission denied | GitHub の Personal Access Token が必要。[手順](https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) |
| Railway でビルドエラー | Build logs を確認。`npm install` の失敗 → `package.json` の不整合を疑う |
| デプロイは成功するが画面が真っ白 | Browser の DevTools (Console) でエラー確認。`BASE_URL` の設定ミス疑い |
| Stripe Webhook が動かない | `STRIPE_WEBHOOK_SECRET` の値違い。Stripe ダッシュボードで Signing Secret を再コピー |
| データが消える | STEP 7 のボリューム未設定。`/app/data` をマウント |

---

## 💰 月額費用の目安

| | 内容 | 月額 |
|---|---|---|
| Railway | サーバー（無料枠 $5 → 超過後は $5-10） | **$0〜$10** |
| GitHub | プライベートリポジトリ | **$0** |
| ドメイン (任意) | お名前.com で `.com` 取得 | **¥130/月** |
| Stripe | サブスク決済手数料（売上の3.6% + ¥40 / 月額） | 売上の数% |

→ 顧客が10店舗以下なら **月¥1,000以内** で運用可能。
