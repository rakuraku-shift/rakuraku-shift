# 📚 RAKURAKU 全サービス一覧

**最終更新**: 2026-05-28
**プロジェクト**: RAKURAKU (バー・飲食店向けシフト管理SaaS)
**本番URL**: https://rakuraku-shift-production.up.railway.app/

---

## 📑 目次

1. [🌐 営業・マーケティングページ (10)](#1-営業マーケティングページ-10)
2. [🏪 シフト管理コア機能 (8)](#2-シフト管理コア機能-8)
3. [🏢 管理者用機能 (5)](#3-管理者用機能-5)
4. [🛠 ユーティリティ (4)](#4-ユーティリティ-4)
5. [💳 決済関連 (3)](#5-決済関連-3)
6. [🎨 営業ツール (3)](#6-営業ツール-3)
7. [⚙️ システムページ (1)](#7-システムページ-1)
8. [🚫 別プロジェクト残骸 (13・非表示)](#8-別プロジェクト残骸-13)
9. [📜 JavaScript モジュール (5)](#9-javascript-モジュール-5)
10. [📋 ドキュメント (7)](#10-ドキュメント-7)
11. [🔌 サーバーAPI (81エンドポイント)](#11-サーバーapi-81エンドポイント)
12. [🎁 差別化機能 (6)](#12-差別化機能-6)

---

# 1. 営業・マーケティングページ (10)

お客様が見るページ。SEO・コンバージョン重要。

| # | URL | 役割 | 状態 |
|---|---|---|---|
| 1 | `/` (index.html) | **LP** トップページ。料金/機能/差別化6項目/FAQ | ✅ |
| 2 | `/about.html` | 会社情報・代表/所在地/特商法表記 | ✅ |
| 3 | `/help.html` | FAQ 46項目 / 8カテゴリ | ✅ |
| 4 | `/getting-started.html` | 3分セットアップガイド | ✅ |
| 5 | `/business-overview.html` | 事業概要書 A4 8ページ | ✅ |
| 6 | `/demo-reservation.html` | 15分無料デモ予約フォーム | ✅ |
| 7 | `/referral.html` | 紹介プログラム (お互い1ヶ月無料・上限2ヶ月) | ✅ |
| 8 | `/case-studies.html` | 導入事例 A〜F店・声A〜E様 (匿名) | ✅ |
| 9 | `/blog.html` | ブログ7記事 (小泉さん視点・人間文体) | ✅ |
| 10 | `/careers.html` | パートナー店舗募集 + エンジニア募集 (法令準拠) | ✅ |

---

# 2. シフト管理コア機能 (8)

契約後の店長/スタッフが日常利用するページ。

| # | URL | 役割 | 状態 |
|---|---|---|---|
| 11 | `/shift.html?shop=xxx` | **メイン画面** SmartNewsタブで7セクション切替 | ✅ |
| 12 | `/myshift.html?shop=xxx` | スタッフ用 マイシフト確認・休み変更届 | ✅ |
| 13 | `/attendance.html?shop=xxx` | GPS打刻 (出勤/退勤/休憩) | ✅ |
| 14 | `/staff-dashboard.html` | スタッフ個人ホーム (KPI/お知らせ/次シフト) | ✅ |
| 15 | `/payroll.html` | 給与明細PDF + freee/マネフォCSV出力 | ✅ |
| 16 | `/monthly-report.html` | 月次経営レポート (人件費率・売上分析) | ✅ |
| 17 | `/staff-monthly.html` | スタッフ別月次サマリ | ✅ |
| 18 | `/master-data.html?shop=xxx` | ポジション・時給・休憩ルール設定 | ✅ |

## shift.html の SmartNews 風タブ (7セクション)
- 🏠 ダッシュボード (KPI + リアルタイム出退勤)
- 📅 シフト管理 (提出一覧 + 自動生成 + 調整)
- 👥 スタッフ (登録一覧 + 評価)
- 💴 給与・売上 (給与カード + 売上管理)
- ⏰ 締切・リマインド (期限設定 + 通知)
- 📊 アンケート (匿名評価結果)
- 📋 全表示 (全部一覧)

---

# 3. 管理者用機能 (5)

オーナー・本社向け。複数店舗管理。

| # | URL | 役割 | 状態 |
|---|---|---|---|
| 19 | `/noru-admin.html` | **本社管理** 全店舗・課金状況・QR発行 | 🔒 PIN |
| 20 | `/hq-dashboard.html` | 本部用 横断KPIダッシュボード | ✅ |
| 21 | `/announcements.html` | お知らせ管理 (LINE/メール/Push 4ch送信) | ✅ |
| 22 | `/notification-settings.html` | LINE/メール/SMS/Push 設定 | ✅ |
| 23 | `/sales-import.html` | 売上データ取込 (手動/CSV/Square/スマレジ) | ✅ |

---

# 4. ユーティリティ (4)

運用補助・透明性向上ページ。

| # | URL | 役割 | 状態 |
|---|---|---|---|
| 24 | `/data-export.html` | データ JSON エクスポート/インポート/削除 | ✅ |
| 25 | `/churn-survey.html` | 解約理由アンケート (Stripe解約時自動送信) | ✅ |
| 26 | `/roadmap.html` | 機能ロードマップ 4カンバン + 投票/要望投稿 | ✅ |
| 27 | `/status.html` | リアルタイム稼働状況 (6サービス監視) | ✅ |

---

# 5. 決済関連 (3)

Stripe Checkout フロー。

| # | URL | 役割 | 状態 |
|---|---|---|---|
| 28 | `/checkout.html` | Stripe決済画面 (サブスク) | ✅ |
| 29 | `/payment-success.html` | 決済完了画面 (Stripeリダイレクト先) | ✅ |
| 30 | `/subscribe-success.html` | サブスク登録完了 + ライセンスコード表示 | ✅ |

---

# 6. 営業ツール (3)

印刷・対面営業用素材。

| # | URL | 役割 | 状態 |
|---|---|---|---|
| 31 | `/flyer.html` | 営業チラシ A4印刷用 (表裏あり) | ✅ |
| 32 | `/business-card.html` | 名刺デザイン (印刷発注用) | ✅ |
| 33 | `/talk-script.html` | 飛び込み営業トーク台本 | ✅ |

---

# 7. システムページ (1)

| # | URL | 役割 | 状態 |
|---|---|---|---|
| 34 | `/404.html` | 404エラーページ | ✅ |
| (+) | `/sitemap-view.html` | **管理者用全ページ一覧** (営業前QA) | ✅ |

---

# 8. 別プロジェクト残骸 (13)

過去のモバイルオーダープロジェクトのファイル。**RAKURAKU では使用しない**。
どこからもリンクされていないので、お客さんには見えません。放置でOK。

| ファイル | 旧用途 |
|---|---|
| `order.html` | モバイル注文画面 |
| `kitchen.html` | 厨房ディスプレイ |
| `pos.html` | POSレジ |
| `menu-admin.html` | メニュー管理 |
| `customer.html` | 顧客画面 |
| `table-qr.html` | テーブルQR管理 |
| `tables.html` | テーブル管理 |
| `gacha.html` | ガチャ機能 |
| `staff.html` | 旧スタッフ画面 |
| `sales.html` | 旧売上画面 |
| `demo.html` | 旧デモ環境 |
| `admin-settings.html` | 旧管理画面 |
| `worker-dashboard.html` | 旧ワーカーダッシュボード |

---

# 9. JavaScript モジュール (5)

横断的に複数ページから読込まれる共通モジュール。

| ファイル | 役割 | 行数 |
|---|---|---|
| `i18n.js` | 4言語対応 (日/英/中/韓) 270+ 翻訳キー | 中規模 |
| `offline-sync.js` | IndexedDB バックアップ + 送信失敗キュー | 中規模 |
| `help-widget.js` | 全ページ右下フローティングヘルプボタン | 小規模 |
| `sw.js` | Service Worker (PWA + プッシュ通知 + キャッシュ v7) | 中規模 |
| `price-engine.js` | (旧プロジェクト・未使用) | - |

---

# 10. ドキュメント (7)

| ファイル | 対象読者 | 内容 |
|---|---|---|
| **README.md** | 開発者 | プロジェクト全体 + API一覧 + 構成 + 既知制約 |
| **HUMAN-TODO.md** | 代表 (あなた) | 営業開始前にやる作業手順 (Stripe/Gmail/QA) |
| **OPERATION-MANUAL.md** | 店舗オーナー | セットアップ15分→月次運用→トラブル対応 |
| **TODO.md** | 開発記録 | 機能ロードマップ + 完了履歴 |
| **DEPLOY.md** | 開発者 | Railway デプロイ手順 |
| **ROADMAP.md** | 開発記録 | 機能計画 (TODO.md と一部重複) |
| **market-analysis.md** | 開発記録 | 競合分析・市場調査 |
| **sales-templates.md** | 営業 | 営業文面テンプレ |
| **ALL-SERVICES.md** | 全員 | **このファイル — 全サービス一覧** |

---

# 11. サーバーAPI (81エンドポイント)

`server.js` で公開している全API。

## 11.1 認証・基盤
- `GET /health` — ヘルスチェック (生存確認)
- `GET /api/state` — グローバル状態取得
- `GET /api/config` — 設定取得
- `POST /api/config` — 設定保存
- `POST /api/reset` — 初期化
- `POST /api/crash` — クラッシュレポート

## 11.2 店舗データ同期 (シフト管理)
- `GET /api/shop/:shopId/snapshot` — 全データ取得
- `POST /api/shop/:shopId/data` — キー単位更新
- `GET /api/shop/:shopId/meta` — 店舗メタ情報 (GPS含む)
- `POST /api/shop/:shopId/gps-setup` — GPS位置 ワンタップ登録 🆕

## 11.3 出退勤 (GPS打刻)
- `POST /api/attendance/clock` — 打刻 (in/out/break_start/break_end)
- `GET /api/attendance/today` — 当日記録
- `GET /api/attendance/month` — 月次記録

## 11.4 シフト変更届
- `GET /api/change-request` — 一覧取得
- `POST /api/change-request` — 新規申請
- `PUT /api/change-request/:id` — 承認/却下

## 11.5 スタッフ登録
- `GET /api/staff/registry` — 一覧
- `POST /api/staff/registry` — 登録

## 11.6 マスタデータ
- `GET /api/master-data/:shopId` — 取得
- `POST /api/master-data/:shopId` — 保存 (Socket.io broadcast)

## 11.7 売上管理
- `GET /api/sales/daily/:shopId` — 日次売上取得
- `POST /api/sales/daily` — 日次売上保存
- `POST /api/pos/connect` — POS Token登録 (Square/スマレジ)

## 11.8 本社管理 (noru-admin)
- `GET /api/admin/snapshot` — 全店舗データ
- `POST /api/admin/data` — 更新
- `POST /api/admin/test-auto-add` — テスト用店舗自動追加 🆕
- `GET /api/hq/summary` — 横断KPI集計

## 11.9 Stripe 決済 + 自動店舗追加 🆕
- `POST /api/subscribe/create` — Checkoutセッション作成
- `GET /api/subscribe/list` — サブスク一覧
- `POST /api/checkout/create` — 単発決済 (旧)
- `GET /api/checkout/info/:sessionId` — 決済詳細
- `POST /webhook/stripe` — Webhook受信
  - `checkout.session.completed` → 自動shopId発行 + noru-admin追加 + 歓迎メール
  - `customer.subscription.deleted` → 解約アンケートURL自動送信
  - `invoice.payment_failed` → 通知

## 11.10 マーケティング
- `POST /api/demo-reservation` — デモ予約
- `GET /api/demo-reservation` — 一覧
- `POST /api/referral` — 紹介プログラム (2ヶ月上限自動チェック)
- `GET /api/referral` — 一覧
- `POST /api/promo` — パートナー特典追加 (上限チェック付)
- `GET /api/free-days/:shopId` — 残無料日数

## 11.11 通知
- `POST /api/send-mail` — 汎用メール送信
- `POST /api/notification/line/connect` — LINE Token登録
- `POST /api/notification/line/test` — 疎通テスト
- `POST /api/notification/line/broadcast` — 全員 broadcast
- `POST /api/notify/shortage` — 不足通知

## 11.12 お知らせ
- `POST /api/announcements` — 投稿 (Socket.io配信)
- `GET /api/announcements/:shopId` — 取得
- `DELETE /api/announcements/:id` — 削除

## 11.13 解約アンケート
- `POST /api/churn-survey` — 回答受信
- `GET /api/churn-survey` — 集計取得

## 11.14 ロードマップ
- `POST /api/roadmap-vote` — 投票
- `GET /api/roadmap-votes` — 集計
- `POST /api/roadmap-idea` — アイデア投稿

## 11.15 稼働状況
- `GET /api/incidents` — 障害履歴
- `POST /api/incidents` — 障害手動報告 (購読者通知)
- `POST /api/status-subscribe` — 障害通知メール購読

## 11.16 アンケート (匿名スタッフ評価)
- `POST /api/survey/submit` — 回答送信
- `GET /api/survey/results` — 結果取得
- `POST /api/survey/send-invite` — 招待送信
- `GET /api/survey/shops` — 対象店舗一覧

## 11.17 QR生成
- `GET /api/qr?data=xxx` — QR画像生成

## 11.18 別プロジェクト残骸 (使わない)
- `/api/order` `/api/stock` `/api/dashboard`
- `/api/gacha/*` `/api/restaurant/*`
- これらは過去のモバイルオーダー用。RAKURAKUでは未使用。

---

# 12. 差別化機能 (6)

他社シフト管理SaaSにない RAKURAKU 独自の強み。

| # | 機能 | 詳細 | 競合状況 |
|---|---|---|---|
| 1 | **🔐 個人給与照会 (パスワード保護)** | SHA-256ハッシュでスタッフ本人のみ閲覧 | RAKURAKU独自 |
| 2 | **📍 GPS不正打刻リアルタイム検知** | Haversine±5m / 店舗外打刻アラート | 特許級 |
| 3 | **🎯 3段階自動募集** | 内部調整→社内インセンティブ→Timee/シェアフル | 業界初 |
| 4 | **🌐 4言語完全対応** | 日/英/中/韓 (シフト/打刻/通知すべて) | 外国人対応で圧倒 |
| 5 | **⚖️ 労基法5項目自動チェック** | 重複/連続7日/休憩義務/週40h/18歳未満深夜 | コンプラ重視 |
| 6 | **📲 LINE店舗QR自動発行** | 契約完了で専用URL+QRコード自動メール | LINE直結 |

## 競合比較

| 項目 | RAKURAKU | Airシフト | Shifty | Excel |
|---|---|---|---|---|
| 月額 | ¥9,800 | ¥5,500 | ¥3,300 | ¥0 |
| 年払い割引 | 2ヶ月分 | なし | なし | - |
| シフト自動作成 | ✅ 1タップ | ✅ | ✅ | ❌ |
| 深夜割増自動 | ✅ +25% | ✅ | ❌ | ❌ |
| 3段階自動募集 | ✅ 業界初 | ❌ | ❌ | ❌ |
| Timee/シェアフル連携 | ✅ ワンタップ | ❌ | ❌ | ❌ |
| 多言語対応 | ✅ 4言語 | △ 英のみ | ❌ | ❌ |
| GPS不正検知 | ✅ | △ | ❌ | ❌ |
| 個人給与照会 | ✅ パスワード | ❌ | ❌ | ❌ |
| 労基法チェック | ✅ 5項目 | ❌ | ❌ | ❌ |
| 飲食店業態特化 | ✅ 完全特化 | △ 汎用 | △ 汎用 | - |

---

# 13. 設定ファイル

| ファイル | 役割 |
|---|---|
| `package.json` | npm依存関係 (express, stripe, nodemailer, socket.io 等) |
| `manifest.json` | PWA マニフェスト (アイコン・shortcut) |
| `railway.json` | Railway デプロイ設定 (Nixpacks builder) |
| `sw.js` | Service Worker v7 (キャッシュ・push・オフライン) |

---

# 14. 料金プラン

## 月額プラン
- ¥9,800/月 (税込)
- 14日間無料トライアル
- いつでも解約可・違約金なし

## 年額プラン (🏆 推奨)
- ¥98,000/年 (税込)
- **2ヶ月分お得** (年¥19,600節約)
- 特典5つ:
  - セットアップ無料 (通常¥30,000)
  - 優先メールサポート (24h以内)
  - Zoom説明会 1回無料
  - 機能要望 優先実装
  - カスタムロゴ表示

## 紹介プログラム
- 紹介元・紹介先 両方が1ヶ月無料
- 上限: 1店舗あたり最大2ヶ月まで

---

# 15. 環境変数 (Railway 必須)

```env
# Stripe (本番)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_ID_MONTHLY=price_xxx
STRIPE_PRICE_ID_ANNUAL=price_xxx

# メール
EMAIL_USER=koizumishota0323@gmail.com
EMAIL_PASS=<Gmail App Password 16文字>

# その他
LICENSE_SECRET=<ランダム32文字>
BASE_URL=https://rakuraku-shift-production.up.railway.app
PORT=3000  (Railway自動設定)
```

---

# 16. 技術スタック

| 層 | 技術 |
|---|---|
| **Backend** | Node.js 18+ / Express / Socket.io |
| **Frontend** | Vanilla JS / CSS (no framework) |
| **Storage** | JSON files (〜50店舗) → PostgreSQL移行予定 |
| **Email** | Nodemailer + Gmail SMTP |
| **Payment** | Stripe Subscription |
| **Deploy** | Railway (Nixpacks builder) |
| **PWA** | Service Worker + Manifest + IndexedDB |
| **i18n** | カスタム実装 (4言語・270+キー) |

---

# 17. デプロイ状況

| 項目 | 状態 |
|---|---|
| 本番URL | https://rakuraku-shift-production.up.railway.app/ |
| GitHub | 連携済み (push で自動デプロイ) |
| 最新コミット | `643e95c` 全ページ一覧ビュー追加 |
| Stripe | 環境変数設定で有効化 |
| メール | EMAIL_USER + EMAIL_PASS 設定で有効化 |

---

# 18. 既知の制約 (営業時に正直に伝える)

1. **JSON ファイルストレージ** — 50店舗が限界
2. **メール送信** — Gmail SMTP 1日500通上限
3. **PWA Push** — 受信ハンドラのみ実装。VAPID + 購読管理は未実装
4. **POS自動取込** — UI のみ。Square OAuth + cron は未実装
5. **iOSアプリ** — PWAで代替 (Safari「ホーム画面に追加」)

---

# 19. ファイル統計

| カテゴリ | ファイル数 |
|---|---|
| HTML (RAKURAKU 使用中) | 34 |
| HTML (別プロジェクト残骸) | 13 |
| JavaScript モジュール | 5 |
| Markdown ドキュメント | 9 |
| 設定ファイル | 4 |
| **合計** | **65** |

---

# 20. 営業時の見せる順番 (推奨フロー)

```
1. /         (トップで「シフト1タップ」のヒーロー)
   ↓
2. /#unique  (差別化6機能セクション)
   ↓
3. /#pricing (年払い推奨)
   ↓
4. /shift.html?shop=demo  (実演)
   ↓
5. /case-studies.html  (他店事例)
   ↓
6. /demo-reservation.html  (デモ予約 or 即契約)
```

---

# 21. お問い合わせ

- **代表**: 小泉 咲太
- **メール**: koizumishota0323@gmail.com
- **電話**: 080-5168-3303
- **所在地**: 神奈川県横浜市桜木町
- **稼働状況**: https://rakuraku-shift-production.up.railway.app/status.html

---

**© 2026 RAKURAKU. All rights reserved.**
