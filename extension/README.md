# RAKURAKU 求人自動入力 — Chrome 拡張機能

RAKURAKU から不足シフトの求人を **Timee / シェアフル / バイトル** の事業者管理画面にワンタップで自動入力する拡張機能です。

---

## 💡 何ができるか

1. RAKURAKU の「⚡外部求人配信」ボタンを押す
2. 拡張機能が自動で各プラットフォームの求人投稿ページを **新しいタブで開く**
3. 各タブで **求人タイトル・本文・時給を自動入力**
4. ユーザーは内容を確認して「公開」ボタンを押すだけ

> ⚠️ 各プラットフォームの規約遵守のため、**「公開」ボタンの自動押下は行いません**。最終確認は必ずユーザーが行います。

---

## 📥 インストール手順（開発版・unpacked）

1. Chrome（または Edge / Brave）で `chrome://extensions/` を開く
2. 右上の「**デベロッパーモード**」を **ON**
3. 左上の「**パッケージ化されていない拡張機能を読み込む**」をクリック
4. このディレクトリ（`bar-exchange/extension/`）を選択
5. 拡張機能一覧に「RAKURAKU 求人自動入力」が表示されればインストール完了

### Chrome Web Store に公開する場合（本番配布）

- 開発者登録（一回限り $5）
- ZIP 化して Chrome Web Store にアップロード
- 審査（通常 1〜3 営業日）

---

## 🎯 事前準備（初回のみ）

### 1. 各プラットフォームにログインしておく

| | URL |
|---|---|
| Timee | https://app.timee.co.jp/business |
| シェアフル | https://business.sharefull.com/ |
| バイトル | https://www.baitoru.com/biz/ |

### 2. RAKURAKU でテンプレートを設定

RAKURAKU の「⚡外部求人」モーダル右上の **⚙️** ボタンから：

- 店舗名・住所・アクセス・店舗紹介
- 標準時給（通常/深夜）
- 募集文テンプレート（変数 `{storeName}` `{wage}` 等が使えます）

を一度だけ設定 → 保存。

---

## 🚀 使い方

1. RAKURAKU で人手不足の警告が出たら「⚡外部求人」を押す
2. 配信先プラットフォーム（Timee/シェアフル/バイトル）を選択
3. 時給を確認 → 「配信する」をクリック
4. 拡張機能が選択した各プラットフォームを **新タブで開く**
5. 各タブの上部に **「🚀 RAKURAKU → 求人内容を自動入力しました」** バナーが出る
6. 入力済みフォームを確認 → 「公開」ボタンを押す

---

## 🔧 セレクタの調整について

各プラットフォームのフォーム構造が変わると、自動入力が動かなくなる場合があります。

**自分で調整する方法**：

1. `chrome://extensions/` で「ファイルを読み込む」を選択
2. 該当プラットフォームのフォームページで DevTools（⌥⌘I）を開く
3. 各フィールドを `Inspect` → セレクタを確認
4. `content-timee.js` / `content-sharefull.js` / `content-baitoru.js` 内の `fillForm()` 関数の `titleCandidates` / `bodyCandidates` / `wageCandidates` 配列にセレクタを追加
5. 拡張機能ページで「再読み込み」アイコンをクリック

---

## 📋 ファイル構成

```
extension/
├── manifest.json          # Manifest V3 設定
├── background.js          # Service Worker (求人データ管理 + タブ起動)
├── content-rakuraku.js    # RAKURAKU 側との通信ブリッジ
├── content-timee.js       # Timee 自動入力
├── content-sharefull.js   # シェアフル 自動入力
├── content-baitoru.js     # バイトル 自動入力
├── popup.html             # ツールバーボタンのポップアップ
├── popup.js
└── README.md              # このファイル
```

---

## ⚠️ 既知の制約

- 各プラットフォームの **公開 API は非公開**（業務提携契約が必要）。本拡張機能は **DOM 自動入力方式** で動作するため、フォーム変更で動かなくなる可能性があります
- 自動「公開」はしません（規約遵守）
- Safari は別実装が必要（現状は Chrome / Edge / Brave のみ）
- 各プラットフォームに事前ログインしておく必要があります

---

## 🆘 動かないとき

| 症状 | 対処 |
|---|---|
| バナーが出ない | ページがログイン画面 or リダイレクト中の可能性。ログイン完了後、`F5` でリロード |
| 一部のフィールドが埋まらない | プラットフォームのフォーム変更が原因。`content-*.js` のセレクタを追加 |
| RAKURAKU 側で「拡張機能未検出」 | `chrome://extensions/` で拡張機能が **有効** になっているか確認。RAKURAKU を `F5` でリロード |
| クリップボードへのコピーは動くが新タブが開かない | ブラウザのポップアップブロックを確認 |

---

## 📞 サポート

問題があれば [support@rakuraku.example.com](mailto:support@rakuraku.example.com) までご連絡ください。
