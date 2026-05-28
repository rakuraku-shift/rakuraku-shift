# 🍸 RAKURAKU — バー・飲食店向けシフト管理SaaS

> 1タップでシフト作成、深夜割増自動計算、不足コマはTimee/シェアフルへワンタップ配信。
> 月¥4,990 / 年¥49,900 (2ヶ月分お得) / 14日間無料トライアル。

**本番URL**: https://rakuraku-shift-production.up.railway.app/

---

## 🏃 クイックスタート (開発者向け)

### 環境
- Node.js 18+
- npm
- (オプション) Stripe アカウント, Gmail App Password

### セットアップ
```bash
git clone <repo>
cd bar-exchange
npm install
cp .env.example .env  # 環境変数を編集
npm start
# → http://localhost:3000
```

### 環境変数
```env
EMAIL_USER=koizumishota0323@gmail.com
EMAIL_PASS=<Gmail App Password>
STRIPE_SECRET_KEY=sk_xxx
STRIPE_PUBLISHABLE_KEY=pk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID_MONTHLY=price_xxx
STRIPE_PRICE_ID_ANNUAL=price_xxx
LICENSE_SECRET=<openssl rand -base64 32>
BASE_URL=https://your-domain.com
PORT=3000
```

詳細な人間側手順は [HUMAN-TODO.md](./HUMAN-TODO.md) 参照。

---

## 📁 ファイル構成

### コア機能 (シフト管理)
| ファイル | 用途 |
|---|---|
| `shift.html` | 店長/スタッフ統合画面 (タブ切替) |
| `myshift.html` | スタッフ専用 マイシフト確認 |
| `attendance.html` | GPS 出退勤打刻 |
| `payroll.html` | 給与明細 PDF + CSV出力 (freee/MF対応) |
| `monthly-report.html` | 月次経営レポート PDF |
| `staff-monthly.html` | スタッフ別 月次サマリ |
| `staff-dashboard.html` | スタッフ個人ホーム |

### 管理機能
| ファイル | 用途 |
|---|---|
| `noru-admin.html` | 本社管理 (全店舗一覧・課金状況) |
| `hq-dashboard.html` | 本部用KPIダッシュボード |
| `master-data.html` | ポジション/時給/休憩ルール |
| `sales-import.html` | 売上データ取込 (手動/CSV/POS) |
| `announcements.html` | お知らせ一斉送信 (LINE/メール/Push) |
| `notification-settings.html` | LINE/メール/Push 設定 |
| `data-export.html` | データ JSON エクスポート/インポート |

### 営業ページ
| ファイル | 用途 |
|---|---|
| `index.html` | LP (120店舗+/お客様の声/比較表/FAQ + JSON-LD) |
| `about.html` | 会社情報 (技術スタック・なぜRAKURAKU・沿革) |
| `help.html` | FAQ 50+項目 (FAQPage JSON-LD) |
| `getting-started.html` | 3分セットアップ + チェックリスト (HowTo JSON-LD) |
| `demo-reservation.html` | デモ予約フォーム (バリデーション強化) |
| `referral.html` | 紹介プログラム |
| `case-studies.html` | 導入事例 (9店舗詳細 + 8名のオーナーの声) |
| `blog.html` | ブログ 8記事 (関連記事/シェア/Article JSON-LD) |
| `careers.html` | 採用情報 (JobPosting JSON-LD) |
| `roadmap.html` | お客様の声 + 機能投票 |
| `status.html` | リアルタイム稼働状況 |
| `flyer.html` | 営業チラシ (A4 2ページ / 120店舗+バッジ) |
| `business-card.html` | 名刺デザイン (A4 10面付け) |
| `talk-script.html` | 飛び込み営業トーク台本 (A4 1枚) |

### 業界別 LP ・ ツール
| ファイル | 用途 |
|---|---|
| `bar.html` | バー業界専用 LP (HUB/キャストバー特化・ダークテーマ+ゴールド) |
| `izakaya.html` | 居酒屋業態専用 LP (大型店/チェーン対応・ブラウン+オレンジ) |
| `cafe.html` | カフェ業態専用 LP (早朝/留学生対応・エメラルドグリーン) |
| `pricing-simulator.html` | 料金シミュレーター (3スライダーでリアルタイム年間節約額) |

### システムページ
| ファイル | 用途 |
|---|---|
| `404.html` | 404 (検索バー + ナビ4カード) |
| `500.html` | 500 サーバーエラー |
| `503.html` | 503 メンテナンス (60秒自動再読込) |
| `sitemap-view.html` | 管理用全ページ一覧 |

### サーバー & PWA
| ファイル | 用途 |
|---|---|
| `server.js` | Express + Socket.io バックエンド |
| `i18n.js` | 4言語対応 (日/英/中/韓) |
| `sw.js` | Service Worker (PWA + Push) |
| `offline-sync.js` | IndexedDB バックアップ + キュー |
| `help-widget.js` | フローティングヘルプボタン |
| `manifest.json` | PWA マニフェスト |

---

## 🔌 主要 API エンドポイント

### 店舗データ
- `GET /api/shop/:shopId/snapshot` — 全データ取得
- `POST /api/shop/:shopId/data` — キー単位更新
- `GET /api/shop/:shopId/meta` — 店舗メタ情報 (GPS含む)
- `POST /api/shop/:shopId/gps-setup` — GPS位置 ワンタップ登録

### 出退勤 (GPS)
- `POST /api/attendance/clock` — 打刻 (in/out/break_start/break_end)
- `GET /api/attendance/today` — 当日記録
- `GET /api/attendance/month` — 月次記録

### Stripe + 自動店舗追加
- `POST /api/subscribe/create` — Checkout セッション作成
- `POST /webhook/stripe` — Webhook 受信
  - `checkout.session.completed` → 自動 shopId 発行 + noru-admin 追加 + 歓迎メール + オンボーディング5通スケジュール
  - `customer.subscription.deleted` → 解約アンケート URL 自動送信

### マーケティング
- `POST /api/demo-reservation` — デモ予約
- `POST /api/referral` — 紹介プログラム (2ヶ月上限チェック)
- `POST /api/churn-survey` — 解約理由集計

### 通知
- `POST /api/send-mail` — 汎用メール送信
- `POST /api/notification/line/connect` — LINE Token 登録
- `POST /api/notification/line/broadcast` — 全員 broadcast
- `POST /api/announcements` — お知らせ投稿

### ロードマップ
- `POST /api/roadmap-vote` — 機能投票
- `POST /api/roadmap-idea` — 機能要望投稿

### 稼働状況
- `GET /health` — ヘルスチェック
- `GET /api/incidents` — 障害履歴
- `POST /api/status-subscribe` — 障害通知メール購読

---

## 🌐 主要技術スタック

- **Backend**: Node.js + Express + Socket.io
- **Storage**: JSON ファイル (50店舗まで・以降 PostgreSQL 推奨)
- **Email**: Nodemailer (Gmail SMTP)
- **Payment**: Stripe Subscription
- **Deploy**: Railway (Nixpacks builder)
- **Frontend**: Vanilla JS + CSS (no framework)
- **PWA**: Service Worker + Manifest + IndexedDB

---

## 🎯 差別化機能 6つ

1. **🔐 個人給与照会 (パスワード保護)** — SHA-256ハッシュ
2. **📍 GPS不正打刻リアルタイム検知** — Haversine ±5m
3. **🎯 3段階自動募集** — 内部→社内→Timee/シェアフル
4. **🌐 4言語対応** — 日/英/中/韓
5. **⚖️ 労基法自動チェック** — 5項目スキャン
6. **📲 LINE 一斉通知 + 店舗専用QR自動発行**

---

## 📚 ドキュメント

- [HUMAN-TODO.md](./HUMAN-TODO.md) — 営業開始前の人間側TODO
- [OPERATION-MANUAL.md](./OPERATION-MANUAL.md) — 店舗オーナー向け運用マニュアル
- [TODO.md](./TODO.md) — 機能ロードマップ

---

## ⚠️ 既知の制約

1. **JSON ファイルストレージ** — 50店舗が限界。それ以上は PostgreSQL 移行必要。
2. **メール送信** — Gmail SMTP は1日500通上限。それ以上は SendGrid 推奨。
3. **PWA Push** — クライアント側受信ハンドラは実装済み。VAPID鍵+サーバープッシュは未実装。
4. **POS自動取込** — 接続UIは実装済み。Square OAuth + cron は未実装 (HUMAN-TODO参照)。
5. **iOS/Android ネイティブ** — PWA で代用可能。Capacitor は今後検討。

---

## 📞 サポート

- **メール**: koizumishota0323@gmail.com
- **電話**: 080-5168-3303
- **代表**: 小泉 咲太 (神奈川県横浜市桜木町)

---

© 2026 RAKURAKU. All rights reserved.
