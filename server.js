require('dotenv').config();
const express  = require('express');
const http     = require('http');
const { Server } = require('socket.io');
const path     = require('path');
const fs       = require('fs');
const QRCode   = require('qrcode');
const crypto   = require('crypto');
const { PriceEngine } = require('./price-engine');

// ── Stripe (optional — requires STRIPE_SECRET_KEY in .env) ──
const stripe = process.env.STRIPE_SECRET_KEY
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : null;

// ── メール送信: Resend API (HTTPS) を優先・Nodemailer (SMTP) をフォールバック ──
// Railway 等のクラウド環境では SMTP がブロックされることがあるため、HTTPS API 優先
const _httpsModule = require('https');
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM = process.env.RESEND_FROM || 'RAKURAKU <onboarding@resend.dev>'; // 検証済みドメインがあれば変更

const nodemailer = process.env.EMAIL_USER ? require('nodemailer') : null;
const _smtpPort = parseInt(process.env.SMTP_PORT || '465');
const _smtpTransporter = nodemailer
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: _smtpPort,
      secure: (_smtpPort === 465),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 15000,
      greetingTimeout:   15000,
      socketTimeout:     30000,
      tls: { rejectUnauthorized: false },
    })
  : null;

/* Resend API でメール送信 (HTTPS・Railway で確実に動く) */
function sendViaResend({ to, subject, html, text }) {
  return new Promise((resolve, reject) => {
    if (!RESEND_API_KEY) return reject(new Error('RESEND_API_KEY 未設定'));
    const body = JSON.stringify({
      from: RESEND_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: html || undefined,
      text: text || undefined,
    });
    const req = _httpsModule.request({
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (response) => {
      let buf = '';
      response.on('data', c => buf += c);
      response.on('end', () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(JSON.parse(buf));
        } else {
          reject(new Error(`Resend ${response.statusCode}: ${buf}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/* 統一メール送信 API: Resend → SMTP の順でフォールバック */
const emailTransporter = (RESEND_API_KEY || _smtpTransporter) ? {
  async sendMail({ from, to, subject, html, text }) {
    /* Resend 優先 */
    if (RESEND_API_KEY) {
      try {
        const r = await sendViaResend({ to, subject, html, text });
        console.log(`[email] Resend 送信成功 → ${to} (id: ${r.id})`);
        return r;
      } catch (e) {
        console.warn(`[email] Resend失敗 → SMTPに切替: ${e.message}`);
      }
    }
    /* SMTP フォールバック */
    if (_smtpTransporter) {
      const r = await _smtpTransporter.sendMail({
        from: from || process.env.EMAIL_USER,
        to, subject, html, text,
      });
      console.log(`[email] SMTP 送信成功 → ${to}`);
      return r;
    }
    throw new Error('メール送信手段がありません (RESEND_API_KEY または EMAIL_USER 必要)');
  },
  async verify() {
    if (RESEND_API_KEY) {
      /* Resend は実送信せず疎通確認用 endpoint なし → 軽量チェック */
      return Promise.resolve(true);
    }
    return _smtpTransporter ? _smtpTransporter.verify() : Promise.reject(new Error('未設定'));
  }
} : null;

if (emailTransporter) {
  if (RESEND_API_KEY) {
    console.log(`[email] Resend API 優先 (from: ${RESEND_FROM})`);
    if (_smtpTransporter) console.log(`[email] SMTP フォールバック: ${process.env.SMTP_HOST || 'smtp.gmail.com'}:${_smtpPort}`);
  } else {
    console.log(`[email] SMTP のみ: ${process.env.SMTP_HOST || 'smtp.gmail.com'}:${_smtpPort}`);
  }
}

// In-memory checkout sessions: sessionId → { tableNo, orders, total, stripeUrl, status, createdAt }
const checkoutSessions = new Map();

// ══════════════════════════════════════════
//  DATA PERSISTENCE
// ══════════════════════════════════════════
const DATA_DIR          = path.join(__dirname, 'data');
const CONFIG_FILE       = path.join(DATA_DIR, 'config.json');
const STOCK_FILE        = path.join(DATA_DIR, 'stock.json');
const GACHA_CONFIG_FILE = path.join(DATA_DIR, 'gacha-config.json');
const SURVEY_FILE       = path.join(DATA_DIR, 'surveys.json');
const REGISTRY_FILE     = path.join(DATA_DIR, 'staff-registry.json');
const SUBSCRIPTIONS_FILE = path.join(DATA_DIR, 'subscriptions.json');
const SHOPS_DIR          = path.join(DATA_DIR, 'shops');
const ADMIN_FILE         = path.join(DATA_DIR, 'admin.json');
const ATTENDANCE_DIR     = path.join(DATA_DIR, 'attendance');
const ATTENDANCE_FACES_DIR = path.join(DATA_DIR, 'attendance-faces'); /* 顔認証スナップショット (非公開) */
const CHANGE_REQ_DIR     = path.join(DATA_DIR, 'change-requests');
const MESSAGES_DIR       = path.join(DATA_DIR, 'messages'); /* 店舗内メッセージ (グループ + 1:1) */

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(SHOPS_DIR)) fs.mkdirSync(SHOPS_DIR, { recursive: true });
if (!fs.existsSync(ATTENDANCE_DIR)) fs.mkdirSync(ATTENDANCE_DIR, { recursive: true });
if (!fs.existsSync(ATTENDANCE_FACES_DIR)) fs.mkdirSync(ATTENDANCE_FACES_DIR, { recursive: true });
if (!fs.existsSync(CHANGE_REQ_DIR)) fs.mkdirSync(CHANGE_REQ_DIR, { recursive: true });
if (!fs.existsSync(MESSAGES_DIR)) fs.mkdirSync(MESSAGES_DIR, { recursive: true });

// ── アンケート ──
function loadSurveys() { return readJSON(SURVEY_FILE, []); }
function appendSurvey(entry) {
  const surveys = loadSurveys();
  surveys.push(entry);
  writeJSON(SURVEY_FILE, surveys);
}

// ── スタッフレジストリ（名前→メール暗記） ──
function loadRegistry() { return readJSON(REGISTRY_FILE, {}); }
function saveRegistry(data) { writeJSON(REGISTRY_FILE, data); }

function ordersFile() {
  return path.join(DATA_DIR, `orders-${todayKey()}.json`);
}
function rankFile() {
  return path.join(DATA_DIR, `rankings-${todayKey()}.json`);
}
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readJSON(file, fallback = []) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch { return fallback; }
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* ── HTML エスケープ (メールテンプレ XSS 対策) ──
 * ユーザー入力 (shop, owner, email など) をメール HTML に埋め込む際に必須。
 * 例: shop = "<script>alert(1)</script>" でも安全に表示される。
 */
function escHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

function loadConfig() {
  return readJSON(CONFIG_FILE, null);
}

function saveConfig(cfg) {
  writeJSON(CONFIG_FILE, cfg);
}

function appendOrder(drinkId, price, name = null) {
  const orders = readJSON(ordersFile(), []);
  orders.push({ drinkId, price, ts: Date.now() });
  writeJSON(ordersFile(), orders);
}

function appendRanking(entry) {
  const ranks = readJSON(rankFile(), []);
  ranks.push(entry);
  writeJSON(rankFile(), ranks);
}

function loadOrders() { return readJSON(ordersFile(), []); }
function loadRankings() { return readJSON(rankFile(), []); }

// ── 在庫管理 ──
function loadStock() { return readJSON(STOCK_FILE, {}); }
function saveStock(s) { writeJSON(STOCK_FILE, s); }

// ── ガチャ ──
const DEFAULT_GACHA_CONFIG = {
  enabled: true,
  prizes: [
    { id:'drink_free', name:'ドリンク1杯無料',   emoji:'🍺', probability:5,  stock:10, color:'#00ff88' },
    { id:'snack_free', name:'おつまみプレゼント', emoji:'🍟', probability:10, stock:20, color:'#ffd700' },
    { id:'discount',   name:'次回10%割引',       emoji:'🎟', probability:15, stock:-1, color:'#4488ff' },
    { id:'miss',       name:'ハズレ…また来てね', emoji:'😢', probability:70, stock:-1, color:'#4a5270' },
  ],
};
function loadGachaConfig() { return readJSON(GACHA_CONFIG_FILE, DEFAULT_GACHA_CONFIG); }
function saveGachaConfig(cfg) { writeJSON(GACHA_CONFIG_FILE, cfg); }
function gachaHistoryFile() { return path.join(DATA_DIR, `gacha-${todayKey()}.json`); }
function loadGachaHistory() { return readJSON(gachaHistoryFile(), []); }
function appendGachaResult(entry) {
  const h = loadGachaHistory();
  h.push(entry);
  writeJSON(gachaHistoryFile(), h);
}

// ══════════════════════════════════════════
//  RAKURAKU SUBSCRIPTION (SaaS)
// ══════════════════════════════════════════
function loadSubscriptions() { return readJSON(SUBSCRIPTIONS_FILE, []); }
function saveSubscription(sub) {
  const all = loadSubscriptions();
  all.push(sub);
  writeJSON(SUBSCRIPTIONS_FILE, all);
}
function updateSubscriptionStatus(subscriptionId, status) {
  const all = loadSubscriptions();
  const idx = all.findIndex(s => s.subscriptionId === subscriptionId);
  if (idx >= 0) {
    all[idx].status = status;
    all[idx].updatedAt = new Date().toISOString();
    writeJSON(SUBSCRIPTIONS_FILE, all);
  }
}

function generateLicenseCode(seed) {
  const secret = process.env.LICENSE_SECRET || 'rakuraku-default-change-me';
  const hash = crypto.createHash('sha256')
    .update(secret + '::' + seed + '::' + Date.now())
    .digest('hex')
    .toUpperCase();
  return [0, 4, 8, 12].map(i => hash.slice(i, i + 4)).join('-');
}

/* ════════════════════════════════════════════
 * 6桁月次ライセンスコード生成 (shift.html / noru-admin.html と同じアルゴリズム)
 * 毎月変わる店舗専用コード — 店長が管理画面にログインする際に必要
 ════════════════════════════════════════════ */
const _NORU_SECRET = 'NORU_PF_2025_BAR';
function generateMonthlyLicenseCode(shopId, monthKey) {
  if (!shopId || !monthKey) return '------';
  const str = _NORU_SECRET + '::' + shopId + '::' + monthKey;
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
    h = h >>> 0;
  }
  const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let k = 0; k < 6; k++) {
    code += CHARS[h % CHARS.length];
    h = Math.floor(h / CHARS.length);
  }
  return code;
}
function _currentMonthKey() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}
function _nextMonthKey() {
  const d = new Date();
  let y = d.getFullYear(), m = d.getMonth() + 2;
  if (m > 12) { m = 1; y++; }
  return y + '-' + String(m).padStart(2, '0');
}

/* ════════════════════════════════════════════
 * 管理者通知 — 新規登録 / 課金開始 / 問い合わせ等を代表へメール
 * 全ての通知は ADMIN_NOTIFY_EMAIL (デフォルト koizumishota0323@gmail.com) に届く
 * ════════════════════════════════════════════ */
const ADMIN_NOTIFY_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'koizumishota0323@gmail.com';
async function notifyAdmin(subject, htmlBody, opts = {}) {
  if (!emailTransporter) {
    console.warn('[notifyAdmin] EMAIL_USER 未設定 — 管理者通知スキップ:', subject);
    return false;
  }
  try {
    const wrapped = `
      <div style="font-family:'Helvetica Neue',sans-serif;max-width:640px;margin:0 auto;padding:20px;color:#1E293B;line-height:1.7;">
        <div style="background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#fff;padding:16px 20px;border-radius:10px 10px 0 0;">
          <div style="font-size:11px;opacity:.85;letter-spacing:.06em;font-weight:700;">📨 RAKURAKU 管理者通知</div>
          <div style="font-size:16px;font-weight:900;margin-top:4px;">${escHtml(subject)}</div>
        </div>
        <div style="background:#fff;border:1px solid #E2E8F0;border-top:none;padding:24px;border-radius:0 0 10px 10px;">
          ${htmlBody}
          <hr style="margin:24px 0;border:none;border-top:1px solid #E2E8F0;">
          <div style="font-size:11px;color:#94A3B8;">
            送信時刻: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} (JST)<br>
            送信元: ${process.env.BASE_URL || 'http://localhost'}<br>
            ${opts.source ? '操作元: ' + escHtml(opts.source) + '<br>' : ''}
          </div>
        </div>
      </div>`;
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: ADMIN_NOTIFY_EMAIL,
      subject: `[RAKURAKU 通知] ${subject}`,
      html: wrapped,
    });
    console.log(`[notifyAdmin] 送信完了 → ${ADMIN_NOTIFY_EMAIL}: ${subject}`);
    return true;
  } catch (e) {
    console.error('[notifyAdmin] 送信失敗:', e.message);
    return false;
  }
}

async function sendLicenseEmail(to, shopName, licenseCode, shopId, opts = {}) {
  if (!emailTransporter) {
    console.warn('[email] EMAIL_USER 未設定 — ライセンスコードメール送信スキップ');
    return;
  }
  const plan = opts.plan; /* 'pro' | 'trial' | 'free' | undefined(=従来=Pro相当) */
  /* 導入文: プランごとに正確な料金説明へ出し分け（未指定時は従来文言を維持） */
  const introLine = plan === 'free'
    ? '<strong>Free プラン（永続無料）</strong>へのご登録が完了しました。料金は一切発生しません。'
    : plan === 'pro'
    ? '<strong>Pro プラン</strong>のご登録が完了しました。最初の 30 日間は無料体験期間です。'
    : '<strong>30 日 Pro 体験 (クレカ不要)</strong>が開始されました。期間中は一切料金が発生しません。';
  /* 末尾の課金注記: クレカ不要トライアル/Free に「自動課金」と誤通知しないよう出し分け（未指定時は従来文言を維持） */
  const billingNote = plan === 'free'
    ? '※ Free プランは永続無料です。料金は一切発生しません。<br>\n          ※ さらに多機能な Pro プラン（¥4,990/月・30 日無料体験）へはいつでもアップグレードできます。'
    : plan === 'trial'
    ? '※ 30 日間の体験終了後は自動的に Free プランへ切り替わります（クレジットカード未登録のため、自動課金は一切発生しません）。<br>\n          ※ 体験中いつでも Pro プランへアップグレードでき、引き続き全機能をご利用いただけます。'
    : '※ 最初の30日間は無料（¥0）。31日目以降は月額¥4,990（税込）の自動課金となります。<br>\n          ※ 解約はいつでも可能。解約後は翌月以降のご請求は発生しません。';
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  const shopUrl = shopId ? `${baseUrl}/shift.html?shop=${encodeURIComponent(shopId)}` : `${baseUrl}/shift.html`;
  /* 🆕 スタッフ配布用URL: ?staff=1 付き → 読み取った端末ではシフト管理タブ＆管理者ログインを非表示（店長専用URL=shopUrl とは別物） */
  const staffUrl = shopId ? `${baseUrl}/shift.html?shop=${encodeURIComponent(shopId)}&staff=1` : `${baseUrl}/shift.html?staff=1`;
  const myShiftUrl = shopId ? `${baseUrl}/myshift.html?shop=${encodeURIComponent(shopId)}` : `${baseUrl}/myshift.html`;
  const attendanceUrl = shopId ? `${baseUrl}/attendance.html?shop=${encodeURIComponent(shopId)}` : `${baseUrl}/attendance.html`;
  const qrUrl = shopId
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=2&color=4F46E5&data=${encodeURIComponent(staffUrl)}`
    : '';

  /* 🆕 6桁の月次ライセンスコード (シフト管理画面へのログインに必要) */
  const thisMonth = _currentMonthKey();
  const nextMonth = _nextMonthKey();
  const monthlyCodeNow  = shopId ? generateMonthlyLicenseCode(shopId, thisMonth) : '------';
  const monthlyCodeNext = shopId ? generateMonthlyLicenseCode(shopId, nextMonth) : '------';
  const [thisY, thisM] = thisMonth.split('-');
  const [nextY, nextM] = nextMonth.split('-');

  /* 体験(trial)向け: 本来の30日体験終了日と、月次コードの都合で実際に使える月末日。
     コードは月単位判定のため翌月末まで有効 → その差分を「特典」として正直に告知する */
  const _trialEnd = new Date(Date.now() + 30 * 86400000);
  const _trialEndStr = `${_trialEnd.getMonth() + 1}月${_trialEnd.getDate()}日`;
  const _effectiveEndStr = `${parseInt(nextM)}月${new Date(parseInt(nextY), parseInt(nextM), 0).getDate()}日`;

  await emailTransporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: '[RAKURAKU] ご登録ありがとうございます — 6桁ログインコード + 専用URL',
    html: `
      <div style="font-family:'Helvetica Neue',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1E293B;line-height:1.7;">
        <h2 style="color:#4F46E5;margin:0 0 16px;">RAKURAKU へようこそ${shopName ? `（${shopName} 様）` : ''}</h2>
        <p>この度はご登録いただき、誠にありがとうございます。</p>
        <p>${introLine}</p>

        ${shopId ? `
        <div style="background:linear-gradient(135deg,#EEF2FF,#FAF5FF);border:2px solid #4F46E5;padding:20px;margin:24px 0;border-radius:12px;">
          <div style="font-size:11px;color:#4F46E5;font-weight:800;letter-spacing:.04em;margin-bottom:6px;">🆔 ${shopName || 'お店'} 専用 店舗ID</div>
          <div style="font-size:18px;font-weight:900;font-family:monospace;color:#1E293B;word-break:break-all;">${shopId}</div>
          <div style="font-size:10px;color:#64748B;margin-top:6px;">※ この ID で${shopName || 'お店'}専用のデータ管理URLが発行されています</div>
        </div>
        ` : ''}

        <!-- 🔐 6桁ログインコード (毎月変わる店長専用パスワード) -->
        ${shopId ? `
        <div style="background:linear-gradient(135deg,#FEF3C7,#FFFBEB);border:3px solid #F59E0B;padding:24px;margin:24px 0;border-radius:14px;">
          <div style="text-align:center;margin-bottom:14px;">
            <div style="font-size:24px;margin-bottom:6px;">🔐</div>
            <div style="font-size:14px;color:#92400E;font-weight:900;">店長専用 ログインコード (毎月変わります)</div>
          </div>
          <div style="background:#fff;border-radius:10px;padding:18px;text-align:center;margin-bottom:12px;">
            <div style="font-size:11px;color:#B45309;font-weight:800;letter-spacing:.04em;margin-bottom:4px;">📅 ${parseInt(thisY)}年${parseInt(thisM)}月分</div>
            <div style="font-size:36px;font-weight:900;letter-spacing:.3em;color:#78350F;font-family:'Courier New',monospace;">${monthlyCodeNow}</div>
          </div>
          <div style="background:#fff;border-radius:10px;padding:14px;text-align:center;opacity:.85;">
            <div style="font-size:10px;color:#B45309;font-weight:800;letter-spacing:.04em;margin-bottom:3px;">📅 ${parseInt(nextY)}年${parseInt(nextM)}月分 (先行発行)</div>
            <div style="font-size:24px;font-weight:900;letter-spacing:.25em;color:#78350F;font-family:'Courier New',monospace;">${monthlyCodeNext}</div>
          </div>
          <div style="font-size:11px;color:#78350F;margin-top:14px;line-height:1.7;background:rgba(245,158,11,.1);padding:10px;border-radius:8px;">
            💡 <strong>このコードはシフト管理画面に初回ログインする際に必要です</strong><br>
            ※ コードはお店ごと / 月ごとに固有です (他店では使えません)<br>
            ※ 翌月になったら新しいコードを使用してください<br>
            ※ コードを忘れた場合: <a href="mailto:koizumishota0323@gmail.com" style="color:#B45309;">代表 (小泉) へ連絡</a>
          </div>
        </div>
        ` : ''}

        ${plan === 'trial' ? `
        <div style="background:linear-gradient(135deg,#ECFDF5,#F0FDF4);border:2px solid #10B981;padding:16px 18px;margin:24px 0;border-radius:12px;">
          <div style="font-size:13px;color:#065F46;font-weight:900;margin-bottom:6px;">🎁 体験期間のおしらせ</div>
          <div style="font-size:13px;color:#065F46;line-height:1.8;">
            本来の無料体験はご登録から30日間（〜<strong>${_trialEndStr}</strong>）ですが、<br>
            特典として <strong>${_effectiveEndStr}まで</strong> そのまま全機能を無料でお使いいただけます。
          </div>
        </div>
        ` : ''}

        <div style="background:#EEF2FF;border:2px dashed #4F46E5;padding:18px;margin:24px 0;text-align:center;border-radius:12px;">
          <div style="font-size:11px;color:#6B7280;margin-bottom:6px;letter-spacing:.05em;">永続ライセンスコード (Stripe決済用)</div>
          <div style="font-size:18px;font-weight:900;letter-spacing:.1em;color:#1E293B;font-family:monospace;">${licenseCode}</div>
          <div style="font-size:10px;color:#94A3B8;margin-top:6px;">※ 課金管理用。通常は使いません</div>
        </div>

        <h3 style="color:#0F172A;margin-top:24px;font-size:16px;">🔗 店長専用URL (ブックマーク推奨)</h3>
        <p style="background:#F8FAFC;border-left:4px solid #4F46E5;padding:12px;margin:12px 0;font-size:13px;word-break:break-all;font-family:monospace;color:#334155;">
          ${shopUrl}
        </p>
        <p style="text-align:center;margin:24px 0;">
          <a href="${shopUrl}" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:800;font-size:14px;">📅 シフト管理を開く →</a>
        </p>

        ${qrUrl ? `
        <h3 style="color:#0F172A;margin-top:32px;font-size:16px;">📱 スタッフ配布用 QRコード</h3>
        <div style="background:#fff;border:1.5px solid #E2E8F0;padding:20px;border-radius:12px;text-align:center;margin:12px 0;">
          <img src="${qrUrl}" alt="店舗専用QRコード" style="display:block;margin:0 auto;border-radius:8px;" width="200" height="200" />
          <p style="font-size:12px;color:#64748B;margin-top:10px;">スタッフがこのQRを読み取ると ${shopName || 'お店'}専用のシフト提出画面にアクセスできます</p>
          <p style="font-size:10px;color:#94A3B8;margin-top:6px;">※ 印刷して店内掲示 or スタッフへ共有</p>
        </div>
        ` : ''}

        <h3 style="color:#0F172A;margin-top:32px;font-size:16px;">📲 スタッフ向け各種URL (スタッフに共有してください)</h3>
        <ul style="font-size:13px;line-height:2;padding-left:20px;">
          <li><strong>シフト希望提出</strong>: <a href="${staffUrl}" style="color:#4F46E5;">${staffUrl}</a></li>
          <li><strong>マイシフト確認</strong>: <a href="${myShiftUrl}" style="color:#4F46E5;">${myShiftUrl}</a></li>
          <li><strong>GPS出退勤打刻</strong>: <a href="${attendanceUrl}" style="color:#4F46E5;">${attendanceUrl}</a></li>
        </ul>

        <h3 style="color:#0F172A;margin-top:32px;font-size:16px;">🚀 今日やる3つのこと</h3>
        <ol style="font-size:13px;line-height:2;padding-left:20px;">
          <li><a href="${baseUrl}/master-data.html?shop=${encodeURIComponent(shopId || '')}" style="color:#4F46E5;">マスタデータ設定</a> (時給/時間帯)</li>
          <li><a href="${baseUrl}/getting-started.html" style="color:#4F46E5;">3分セットアップガイドを読む</a></li>
          <li>スタッフに上記QRを配布</li>
        </ol>

        <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0;" />
        <p style="font-size:12px;color:#94A3B8;line-height:1.7;">
          ${billingNote}<br>
          ※ ご不明な点はこのメールに返信、または 📞 080-5168-3303 までお問い合わせください。<br>
          ※ 運営: RAKURAKU（代表 小泉 咲太）
        </p>
      </div>
    `,
  });
  console.log(`[email] ライセンスコード + 店舗URL を ${to} に送信`);
}

/* ════════════════════════════════════════════
 * 月次ログインコード メール — 毎月の課金成功時 (subscription_cycle) に自動送信
 * 店長へ「今月の6桁ログインコード」+「翌月分(先行発行)」をお届けする
 * ※ 登録直後/トライアル開始時は sendLicenseEmail で既に案内済みなので、
 *   ここでは継続課金のサイクルでのみ呼ばれる (webhook 側で billing_reason を判定)
 ════════════════════════════════════════════ */
async function sendMonthlyCodeEmail(to, shopName, shopId) {
  if (!emailTransporter) {
    console.warn('[email] EMAIL_USER 未設定 — 月次コードメール送信スキップ');
    return;
  }
  if (!to) return;
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  const shopUrl = shopId ? `${baseUrl}/shift.html?shop=${encodeURIComponent(shopId)}` : `${baseUrl}/shift.html`;

  const thisMonth = _currentMonthKey();
  const nextMonth = _nextMonthKey();
  const monthlyCodeNow  = shopId ? generateMonthlyLicenseCode(shopId, thisMonth) : '------';
  const monthlyCodeNext = shopId ? generateMonthlyLicenseCode(shopId, nextMonth) : '------';
  const [thisY, thisM] = thisMonth.split('-');
  const [nextY, nextM] = nextMonth.split('-');

  await emailTransporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: `[RAKURAKU] ${parseInt(thisM)}月の店長ログインコード`,
    html: `
      <div style="font-family:'Helvetica Neue',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1E293B;line-height:1.7;">
        <h2 style="color:#4F46E5;margin:0 0 16px;">今月のログインコードをお届けします${shopName ? `（${shopName} 様）` : ''}</h2>
        <p>いつも RAKURAKU をご利用いただきありがとうございます。<br>
        ${parseInt(thisY)}年${parseInt(thisM)}月分の月額決済が正常に完了しました。今月の店長ログインコードをお知らせします。</p>

        <!-- 🔐 今月の6桁ログインコード (毎月変わる店長専用パスワード) -->
        <div style="background:linear-gradient(135deg,#FEF3C7,#FFFBEB);border:3px solid #F59E0B;padding:24px;margin:24px 0;border-radius:14px;">
          <div style="text-align:center;margin-bottom:14px;">
            <div style="font-size:24px;margin-bottom:6px;">🔐</div>
            <div style="font-size:14px;color:#92400E;font-weight:900;">店長専用 ログインコード (毎月変わります)</div>
          </div>
          <div style="background:#fff;border-radius:10px;padding:18px;text-align:center;margin-bottom:12px;">
            <div style="font-size:11px;color:#B45309;font-weight:800;letter-spacing:.04em;margin-bottom:4px;">📅 ${parseInt(thisY)}年${parseInt(thisM)}月分</div>
            <div style="font-size:36px;font-weight:900;letter-spacing:.3em;color:#78350F;font-family:'Courier New',monospace;">${monthlyCodeNow}</div>
          </div>
          <div style="background:#fff;border-radius:10px;padding:14px;text-align:center;opacity:.85;">
            <div style="font-size:10px;color:#B45309;font-weight:800;letter-spacing:.04em;margin-bottom:3px;">📅 ${parseInt(nextY)}年${parseInt(nextM)}月分 (先行発行)</div>
            <div style="font-size:24px;font-weight:900;letter-spacing:.25em;color:#78350F;font-family:'Courier New',monospace;">${monthlyCodeNext}</div>
          </div>
          <div style="font-size:11px;color:#78350F;margin-top:14px;line-height:1.7;background:rgba(245,158,11,.1);padding:10px;border-radius:8px;">
            💡 <strong>このコードはシフト管理画面にログインする際に必要です</strong><br>
            ※ コードはお店ごと / 月ごとに固有です (他店では使えません)<br>
            ※ 翌月になったら新しいコードを使用してください<br>
            ※ コードを忘れた場合: <a href="mailto:koizumishota0323@gmail.com" style="color:#B45309;">代表 (小泉) へ連絡</a>
          </div>
        </div>

        <p style="text-align:center;margin:24px 0;">
          <a href="${shopUrl}" style="display:inline-block;background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:800;font-size:14px;">📅 シフト管理を開く →</a>
        </p>

        <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0;" />
        <p style="font-size:12px;color:#94A3B8;line-height:1.7;">
          ※ このメールは月額決済の完了時に自動送信されています。<br>
          ※ 解約はいつでも可能です。解約後は翌月以降のご請求は発生しません。<br>
          ※ ご不明な点はこのメールに返信、または 📞 080-5168-3303 までお問い合わせください。<br>
          ※ 運営: RAKURAKU（代表 小泉 咲太）
        </p>
      </div>
    `,
  });
  console.log(`[email] 月次ログインコード (${thisMonth}) を ${to} に送信`);
}

/* ════════════════════════════════════════════
 * shopId 自動生成 — 店舗名 → URLセーフな ID へ
 * 例: "BAR LUMIERE 渋谷" → "bar-lumiere-3k7m"
 *     "" (空) → "shop-3k7m"
 ════════════════════════════════════════════ */
function generateShopId(shopName, email) {
  let slug = (shopName || '').toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '') /* 濁点等を除去 */
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
  if (!slug && email) {
    slug = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20);
  }
  if (!slug) slug = 'shop';
  /* 既存IDとの衝突を避ける suffix */
  const suffix = Date.now().toString(36).slice(-4);
  return `${slug}-${suffix}`;
}

/* noru-admin の shops リストに自動追加 */
function addShopToAdminList(shopData) {
  const data = loadAdminData();
  let shopsJson = data['noru_admin_shops'];
  let shops = [];
  if (shopsJson) {
    try { shops = JSON.parse(shopsJson); } catch(e) { shops = []; }
  }
  /* shopId 重複チェック */
  if (shops.find(s => s.shopId === shopData.shopId)) {
    console.log(`[admin] shopId 既存 — スキップ: ${shopData.shopId}`);
    return false;
  }
  shops.push({
    shopId:      shopData.shopId,
    name:        shopData.shopName || shopData.shopId, /* noru-admin は s.name を参照 */
    shopName:    shopData.shopName, /* 互換性のため両方残す */
    contact:     shopData.ownerName || '',
    fee:         shopData.fee || 4990,
    email:       shopData.email || '',
    phone:       shopData.phone || '',
    autoAdded:   true,
    addedAt:     new Date().toISOString(),
    source:      'stripe-webhook',
    subscriptionId: shopData.subscriptionId || '',
    customerId:  shopData.customerId || '',
  });
  setAdminKey('noru_admin_shops', JSON.stringify(shops));
  console.log(`[admin] 店舗自動追加 — ${shopData.shopName} (${shopData.shopId})`);
  /* Socket.io で noru-admin 開いている人に即時通知 */
  try { io.emit('admin_data_updated', { key: 'noru_admin_shops', value: JSON.stringify(shops), ts: Date.now() }); } catch(e) {}
  return true;
}

async function handleSubscriptionStarted(session) {
  const meta = session.metadata || {};
  const shopName  = meta.shopName  || '';
  const ownerName = meta.ownerName || '';
  const phone     = meta.phone     || '';
  const email     = session.customer_email || (session.customer_details && session.customer_details.email) || '';

  const licenseCode = generateLicenseCode(email + shopName);

  /* 🆔 shopId 自動生成 + noru-admin に追加 */
  const shopId = generateShopId(shopName, email);
  addShopToAdminList({
    shopId, shopName, ownerName, email, phone,
    subscriptionId: session.subscription,
    customerId:     session.customer,
    fee: 4990,
  });

  saveSubscription({
    sessionId:      session.id,
    customerId:     session.customer,
    subscriptionId: session.subscription,
    shopId, /* 紐付け */
    shopName, ownerName, email, phone,
    licenseCode,
    status:    'trialing',
    createdAt: new Date().toISOString(),
  });

  console.log(`[stripe] サブスク開始 — ${shopName || '?'} (${email}) → shopId: ${shopId} — code: ${licenseCode}`);

  /* 🔔 管理者通知 — Pro プラン課金が実際に開始された */
  notifyAdmin(
    `💼 Pro プラン課金開始 — ${shopName || '(店舗名未入力)'}`,
    `
      <p style="font-size:14px;margin:0 0 14px;"><strong>Stripe 決済が完了し、Pro プランが開始されました</strong></p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin:10px 0;">
        <tr><td style="padding:8px;background:#F8FAFC;border:1px solid #E2E8F0;width:30%;font-weight:700;">店舗名</td><td style="padding:8px;border:1px solid #E2E8F0;">${escHtml(shopName || '(未入力)')}</td></tr>
        <tr><td style="padding:8px;background:#F8FAFC;border:1px solid #E2E8F0;font-weight:700;">代表者</td><td style="padding:8px;border:1px solid #E2E8F0;">${escHtml(ownerName || '(未入力)')}</td></tr>
        <tr><td style="padding:8px;background:#F8FAFC;border:1px solid #E2E8F0;font-weight:700;">メール</td><td style="padding:8px;border:1px solid #E2E8F0;"><a href="mailto:${escHtml(email)}">${escHtml(email)}</a></td></tr>
        <tr><td style="padding:8px;background:#F8FAFC;border:1px solid #E2E8F0;font-weight:700;">電話</td><td style="padding:8px;border:1px solid #E2E8F0;">${escHtml(phone || '(未入力)')}</td></tr>
        <tr><td style="padding:8px;background:#F8FAFC;border:1px solid #E2E8F0;font-weight:700;">店舗ID</td><td style="padding:8px;border:1px solid #E2E8F0;font-family:monospace;">${escHtml(shopId)}</td></tr>
        <tr><td style="padding:8px;background:#F8FAFC;border:1px solid #E2E8F0;font-weight:700;">月額</td><td style="padding:8px;border:1px solid #E2E8F0;">¥4,990 (税抜)</td></tr>
        <tr><td style="padding:8px;background:#F8FAFC;border:1px solid #E2E8F0;font-weight:700;">Stripe Subscription</td><td style="padding:8px;border:1px solid #E2E8F0;font-family:monospace;font-size:11px;">${escHtml(session.subscription || '')}</td></tr>
        <tr><td style="padding:8px;background:#F8FAFC;border:1px solid #E2E8F0;font-weight:700;">Stripe Customer</td><td style="padding:8px;border:1px solid #E2E8F0;font-family:monospace;font-size:11px;">${escHtml(session.customer || '')}</td></tr>
      </table>
      <div style="background:#DCFCE7;border-left:4px solid #22C55E;padding:12px 14px;border-radius:0 8px 8px 0;font-size:12px;color:#065F46;margin:14px 0;">
        ✅ 既にお客様にはライセンスコード + 6 桁ログインコードのメールを送信済み。<br>
        🆔 noru-admin の店舗リストにも自動追加済 (autoAdded: true)。
      </div>
    `,
    { source: 'stripe webhook: checkout.session.completed' }
  ).catch(e => console.warn('[notifyAdmin] stripe subscription notification failed:', e.message));

  if (email) {
    try { await sendLicenseEmail(email, shopName, licenseCode, shopId); }
    catch (e) { console.error('[email] 送信失敗:', e.message); }

    /* オンボーディング自動メール (Day1/3/7/14/30) をスケジュール */
    try { scheduleOnboardingEmails(email, shopName, ownerName, shopId); }
    catch (e) { console.warn('[onboarding] schedule失敗:', e.message); }
  }
}

// ══════════════════════════════════════════
//  オンボーディング自動メール (Day 1/3/7/14/30)
// ══════════════════════════════════════════
const ONBOARDING_EMAILS = [
  {
    day: 1,
    subject: '[RAKURAKU] ようこそ! 今日やる3つのこと',
    html: ({ shopName, ownerName, shopId }) => {
      const base = 'https://rakuraku-shift-production.up.railway.app';
      const sp = shopId ? `?shop=${encodeURIComponent(shopId)}` : '';
      return `
      <div style="font-family:'Helvetica Neue',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1E293B;line-height:1.7;">
        <h2 style="color:#4F46E5;">${ownerName || '店長'}様、ご登録ありがとうございます!</h2>
        <p>RAKURAKU 開発代表の小泉です。${shopName || 'お店'} でのご利用、心からお待ちしておりました。</p>
        ${shopId ? `<p style="background:#EEF2FF;padding:12px;border-radius:8px;font-size:13px;">🆔 <strong>あなたの店舗ID:</strong> <code style="font-family:monospace;color:#4F46E5;">${shopId}</code><br>すべてのURLに自動的にこの ID が付与されています</p>` : ''}
        <h3 style="color:#0F172A;margin-top:24px;">🎯 今日やる3つのこと (合計15分)</h3>
        <ol>
          <li><strong>マスタデータを設定</strong> (5分) — ポジション・標準時給・時間帯テンプレを入力<br>
              → <a href="${base}/master-data.html${sp}" style="color:#4F46E5;">マスタ管理を開く</a></li>
          <li><strong>スタッフを5名登録</strong> (5分) — QRコードをスタッフに共有<br>
              → <a href="${base}/shift.html${sp}" style="color:#4F46E5;">シフト画面で QR 生成</a></li>
          <li><strong>3分セットアップガイドを読む</strong> — 画面ごとの操作手順<br>
              → <a href="${base}/getting-started.html" style="color:#4F46E5;">ガイドを開く</a></li>
        </ol>
        <p style="margin-top:24px;">何か不明点があれば、このメールに返信するだけで私 (小泉) に直接届きます。</p>
        <p style="color:#64748B;font-size:12px;margin-top:24px;">— 小泉 咲太 / 📞 080-5168-3303</p>
      </div>
    `;
    },
  },
  {
    day: 3,
    subject: '[RAKURAKU] スタッフ提出はうまく始まりましたか?',
    html: ({ shopName, ownerName }) => `
      <div style="font-family:'Helvetica Neue',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1E293B;line-height:1.7;">
        <h2 style="color:#4F46E5;">${ownerName || '店長'}様、ご登録から3日です</h2>
        <p>${shopName || 'お店'} でスタッフの希望提出は始まっていますか?</p>
        <h3>📌 よくつまずくポイント</h3>
        <ul>
          <li><strong>「スタッフが QR からアクセスできない」</strong> → 携帯のカメラで QR を読み取り、ブラウザで開く<br>
              一度開けばホーム画面に追加できます</li>
          <li><strong>「シフト希望を出す方法が分からない」</strong> → 動画 第2回をスタッフに見てもらってください</li>
          <li><strong>「外国人スタッフも使える?」</strong> → 画面右上の言語切替で 英/中/韓 に切り替え可能</li>
        </ul>
        <p style="background:#EEF2FF;padding:14px;border-radius:8px;margin-top:18px;">
          💡 <strong>5名のスタッフが提出すると</strong>、自動シフト生成が体感できます。<br>
          まずは 1サイクル試して効果を実感してみてください。
        </p>
        <p>❓ <a href="https://rakuraku-shift-production.up.railway.app/help.html" style="color:#4F46E5;">FAQ・ヘルプ</a></p>
        <p style="color:#64748B;font-size:12px;margin-top:24px;">困った時は: <a href="mailto:koizumishota0323@gmail.com">koizumishota0323@gmail.com</a></p>
      </div>
    `,
  },
  {
    day: 7,
    subject: '[RAKURAKU] 1週間経過 — 1回目のシフト生成、試しましたか?',
    html: ({ shopName, ownerName }) => `
      <div style="font-family:'Helvetica Neue',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1E293B;line-height:1.7;">
        <h2 style="color:#4F46E5;">${ownerName || '店長'}様、1週間お疲れさまでした</h2>
        <p>そろそろ <strong>「✨ シフト作成」ボタン</strong> をタップしてみる頃合いです。</p>

        <h3>🎯 シフト生成の見どころ</h3>
        <ul>
          <li><strong>時間バーが色で塗りつぶされて表示</strong> — 視覚的にひと目で分かる</li>
          <li><strong>赤/黄/緑の不足カレンダー</strong> — 「今すぐ動くべき日」が分かる</li>
          <li><strong>シフト調整依頼メール一括送信</strong> — 不足コマに対して既存スタッフへ自動提案</li>
          <li><strong>📢 全員通知ボタン</strong> — メールでシフト確定を一斉通知</li>
        </ul>

        <h3>💴 給与計算もぜひ試してください</h3>
        <p>1週間分の打刻データがあれば、<a href="https://rakuraku-shift-production.up.railway.app/payroll.html" style="color:#4F46E5;">payroll.html</a> から給与明細PDFが生成できます。<br>深夜割増・休憩控除も自動です。</p>

        <p style="background:#FEF3C7;padding:14px;border-radius:8px;margin-top:18px;">
          🤝 <strong>知り合いの飲食店オーナー</strong>に紹介してくれませんか?<br>
          <a href="https://rakuraku-shift-production.up.railway.app/referral.html" style="color:#B45309;">紹介プログラム</a> でお互い1ヶ月無料になります。
        </p>
        <p style="color:#64748B;font-size:12px;margin-top:24px;">代表 小泉 咲太</p>
      </div>
    `,
  },
  {
    day: 14,
    subject: '[RAKURAKU] トライアル折り返し — 効果は出ていますか?',
    html: ({ shopName, ownerName }) => `
      <div style="font-family:'Helvetica Neue',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1E293B;line-height:1.7;">
        <h2 style="color:#4F46E5;">${ownerName || '店長'}様、30日トライアルの折り返しです</h2>
        <p>${shopName || 'お店'} で RAKURAKU を使い始めて2週間。効果は出ていますでしょうか?</p>

        <h3>💡 トライアル中の効果を振り返り</h3>
        <p>下記URLから、これまでの利用状況をご確認いただけます:</p>
        <ul>
          <li>📊 <a href="https://rakuraku-shift-production.up.railway.app/staff-monthly.html" style="color:#4F46E5;">月次サマリ</a> — スタッフごとの勤務時間</li>
          <li>📑 <a href="https://rakuraku-shift-production.up.railway.app/monthly-report.html" style="color:#4F46E5;">月次レポート</a> — 売上・人件費率</li>
        </ul>

        <h3>📌 トライアル後は 月額¥4,990</h3>
        <p>31日目以降も自動で続きます。<strong>月額¥4,990（税込）</strong>です。<br>もちろん <strong>解約はいつでも可能</strong> で、解約後の請求は発生しません。</p>

        <p style="background:#DCFCE7;padding:14px;border-radius:8px;margin-top:18px;">
          💴 <strong>年払いプラン (¥49,900・2ヶ月分お得)</strong> もご用意しています。<br>
          長く使う予定があれば年払いが断然お得です。
        </p>
        <p style="color:#64748B;font-size:12px;margin-top:24px;">— 代表 小泉 咲太 / koizumishota0323@gmail.com</p>
      </div>
    `,
  },
  {
    day: 28,
    subject: '[RAKURAKU] あと2日でトライアル終了 — 月額¥4,990スタートのお知らせ',
    html: ({ shopName, ownerName }) => `
      <div style="font-family:'Helvetica Neue',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1E293B;line-height:1.7;">
        <h2 style="color:#4F46E5;">${ownerName || '店長'}様、30日間ありがとうございました</h2>
        <p>無料トライアル期間が間もなく終了します（あと2日）。${shopName || 'お店'} での RAKURAKU、いかがでしたか?</p>

        <h3>📌 継続いただける場合（おすすめ）</h3>
        <p>特に何もしていただく必要はありません。<br>31日目から <strong>月額¥4,990（税込）</strong> の課金となります。</p>

        <h3>解約をご希望の場合</h3>
        <p>このメールに <strong>「解約希望」</strong> と返信していただくか、<a href="https://rakuraku-shift-production.up.railway.app/help.html" style="color:#4F46E5;">ヘルプ</a> から解約手続きをお願いします。トライアル中の解約は一切費用がかかりません。</p>

        <p style="color:#64748B;font-size:12px;margin-top:24px;">— 代表 小泉 咲太 / koizumishota0323@gmail.com</p>
      </div>
    `,
  },
  {
    day: 30,
    subject: '[RAKURAKU] 1ヶ月経過! 次のステップ + 紹介プログラム',
    html: ({ shopName, ownerName }) => `
      <div style="font-family:'Helvetica Neue',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1E293B;line-height:1.7;">
        <h2 style="color:#4F46E5;">${ownerName || '店長'}様、ご利用1ヶ月おめでとうございます 🎉</h2>
        <p>${shopName || 'お店'} で RAKURAKU をご利用いただき、1ヶ月が経ちました。本日から <strong>月額¥4,990</strong> での継続がスタートしました。引き続きよろしくお願いいたします。</p>

        <h3>🚀 次のステップ: まだ使っていない機能を試してみませんか?</h3>
        <ol>
          <li><strong>売上データ取込</strong> → <a href="https://rakuraku-shift-production.up.railway.app/sales-import.html" style="color:#4F46E5;">売上取込</a><br>
              毎日の売上を入力 → 人件費率の自動計算</li>
          <li><strong>スタッフ評価機能</strong> → シフト画面のスタッフ名タップ → 5段階評価<br>
              優秀スタッフを可視化 → 時給アップの根拠に</li>
          <li><strong>個人給与照会 (パスワード保護)</strong> → スタッフが自分の今月給与を見れる</li>
        </ol>

        <h3>🤝 紹介プログラムでお互い1ヶ月無料</h3>
        <p>知り合いの飲食店オーナーに RAKURAKU を紹介すると、<strong>あなたも紹介先も1ヶ月無料</strong> になります。<br>
        紹介コード発行は1分で完了。<a href="https://rakuraku-shift-production.up.railway.app/referral.html" style="color:#4F46E5;">紹介プログラムページ</a> へ。</p>

        <h3>📞 困った時はいつでも</h3>
        <p>このメールにそのまま返信、または <a href="tel:08051683303" style="color:#4F46E5;">📞 080-5168-3303</a> へお電話ください。<br>担当者が迅速に対応します。</p>

        <p style="color:#64748B;font-size:12px;margin-top:24px;">— 代表 小泉 咲太</p>
      </div>
    `,
  },
];

function scheduleOnboardingEmails(email, shopName, ownerName, shopId) {
  if (!email) return;
  const now = Date.now();
  const file = path.join(DATA_DIR, 'scheduled-onboarding.json');
  const all = readJSON(file, []);
  ONBOARDING_EMAILS.forEach(e => {
    all.push({
      id: 'ob' + now + '_' + e.day,
      email, shopName, ownerName, shopId,
      day: e.day,
      scheduledAt: now + e.day * 86400000,
      sent: false,
    });
  });
  writeJSON(file, all);
  console.log(`[onboarding] ${email} に ${ONBOARDING_EMAILS.length}通のメールをスケジュール (shopId: ${shopId || '-'})`);
}

async function processScheduledOnboarding() {
  if (!emailTransporter) return;
  const file = path.join(DATA_DIR, 'scheduled-onboarding.json');
  const all = readJSON(file, []);
  const now = Date.now();
  let sentCount = 0;
  for (const item of all) {
    if (item.sent) continue;
    if (item.scheduledAt > now) continue;
    const template = ONBOARDING_EMAILS.find(e => e.day === item.day);
    if (!template) { item.sent = true; continue; }
    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: item.email,
        subject: template.subject,
        html: template.html({ shopName: item.shopName, ownerName: item.ownerName, shopId: item.shopId }),
      });
      item.sent = true;
      item.sentAt = now;
      sentCount++;
      console.log(`[onboarding] Day${item.day} 送信 → ${item.email}`);
    } catch(e) {
      console.warn(`[onboarding] 送信失敗 Day${item.day}:`, e.message);
      item.retries = (item.retries || 0) + 1;
      if (item.retries > 3) item.sent = true; /* 3回失敗で諦め */
    }
  }
  if (sentCount > 0 || all.some(i => i.sent === true)) {
    writeJSON(file, all.filter(i => !i.sent || (now - (i.sentAt || 0)) < 30 * 86400000));
  }
}

/* 1時間ごとに送信ジョブ実行 */
setInterval(processScheduledOnboarding, 60 * 60 * 1000);
/* 起動直後にも1回実行 (2分後) */
setTimeout(processScheduledOnboarding, 2 * 60 * 1000);

// ══════════════════════════════════════════
//  SHOP DATA (シフトクロスデバイス同期)
// ══════════════════════════════════════════
function _safeShopId(shopId) {
  return String(shopId || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
}
function shopDataFile(shopId) {
  const safe = _safeShopId(shopId) || 'default';
  return path.join(SHOPS_DIR, safe + '.json');
}
function loadShopData(shopId) { return readJSON(shopDataFile(shopId), {}); }
function saveShopData(shopId, data) { writeJSON(shopDataFile(shopId), data); }
/* プロトタイプ汚染対策: 危険なキー名は書き込ませない (__proto__ / constructor / prototype) */
function _isUnsafeKey(k) { return k === '__proto__' || k === 'constructor' || k === 'prototype'; }
function setShopKey(shopId, key, value) {
  const data = loadShopData(shopId);
  if (!_isUnsafeKey(key)) data[key] = value;
  data._updatedAt = Date.now();
  saveShopData(shopId, data);
  return data;
}

/* ── 本社管理データ (noru-admin.html 用) ── */
function loadAdminData() { return readJSON(ADMIN_FILE, {}); }
function saveAdminData(data) { writeJSON(ADMIN_FILE, data); }
function setAdminKey(key, value) {
  const data = loadAdminData();
  if (!_isUnsafeKey(key)) data[key] = value;
  data._updatedAt = Date.now();
  saveAdminData(data);
  return data;
}
/* shopId から店舗メタ情報（名前・オーナー等）を取得 */
function getShopMetaById(shopId) {
  const data = loadAdminData();
  let shops = [];
  try {
    const raw = data['noru_admin_shops'];
    shops = typeof raw === 'string' ? JSON.parse(raw) : (raw || []);
  } catch(e) {}
  return shops.find(s => s.shopId === shopId || s.id === shopId) || null;
}

/* ── 出退勤データ管理 ── */
function attendanceFile(shopId, yearMonth) {
  const safe = _safeShopId(shopId) || 'default';
  return path.join(ATTENDANCE_DIR, `${safe}-${yearMonth}.json`);
}
function _monthKeyOf(ts) {
  const d = new Date(ts);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
}
function _dayKeyOf(ts) {
  const d = new Date(ts);
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function loadAttendance(shopId, yearMonth) {
  return readJSON(attendanceFile(shopId, yearMonth), []);
}
function appendAttendance(shopId, record) {
  const ym = _monthKeyOf(record.ts);
  const all = loadAttendance(shopId, ym);
  all.push(record);
  writeJSON(attendanceFile(shopId, ym), all);
  return record;
}

/* ════════════════════════════════════════════
 * 店舗内メッセージ (グループ + 1:1 DM) — file ベース
 *   1 店舗 = 1 ファイル data/messages/<safeShopId>.json (フラットな配列)。
 *   各メッセージ: { id, shopId, thread, scope:'group'|'dm', sender, to, text, ts }。
 *   グループ: thread='group', to=null。 1:1: thread=_dmThreadId(a,b), to=相手名。
 * ════════════════════════════════════════════ */
function messagesFile(shopId) {
  const safe = _safeShopId(shopId) || 'default';
  return path.join(MESSAGES_DIR, `${safe}.json`);
}
function loadMessages(shopId) { return readJSON(messagesFile(shopId), []); }
function appendMessage(shopId, msg) {
  const all = loadMessages(shopId);
  all.push(msg);
  /* ファイル肥大化を防ぐため直近 2000 件に制限 */
  const capped = all.length > 2000 ? all.slice(all.length - 2000) : all;
  writeJSON(messagesFile(shopId), capped);
  return msg;
}
/* 2 名から決定的な DM スレッド ID を生成 (名前順 → sha1 短縮) */
function _dmThreadId(a, b) {
  const pair = [String(a || '').trim().slice(0, 64), String(b || '').trim().slice(0, 64)].sort();
  const h = crypto.createHash('sha1').update(pair.join('::')).digest('hex').slice(0, 12);
  return 'dm_' + h;
}

/* ── 休み変更届データ管理 ── */
function changeReqFile(shopId) {
  const safe = _safeShopId(shopId) || 'default';
  return path.join(CHANGE_REQ_DIR, `${safe}.json`);
}
function loadChangeReqs(shopId) { return readJSON(changeReqFile(shopId), []); }
function saveChangeReqs(shopId, all) { writeJSON(changeReqFile(shopId), all); }
function appendChangeReq(shopId, req) {
  const all = loadChangeReqs(shopId);
  all.push(req);
  saveChangeReqs(shopId, all);
  return req;
}
function updateChangeReqStatus(shopId, reqId, status, decidedBy) {
  const all = loadChangeReqs(shopId);
  const idx = all.findIndex(r => r.id === reqId);
  if (idx < 0) return null;
  all[idx].status = status;
  all[idx].decidedBy = decidedBy || null;
  all[idx].decidedAt = Date.now();
  saveChangeReqs(shopId, all);
  return all[idx];
}

// ══════════════════════════════════════════
//  PRICE ENGINE
// ══════════════════════════════════════════
const savedConfig = loadConfig();
const engine = new PriceEngine(savedConfig);
engine.setStock(loadStock());

// ══════════════════════════════════════════
//  EXPRESS + SOCKET.IO
// ══════════════════════════════════════════
const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

// ── 🔒 セキュリティヘッダー + 軽量レート制限 (依存追加なし) ──────────────────
//   全レスポンスに防御ヘッダーを付与: クリックジャッキング/MIMEスニッフィング/リファラ漏洩を抑止。
//   ※ noru-admin.html では後段の middleware が Referrer-Policy を no-referrer に上書きする。
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  next();
});

/* メモリ内レート制限 (IP毎・1分スライディングウィンドウ)。
   書き込み系エンドポイントの濫用 (全店舗/全社データの大量改ざん・DoS) を抑止する。
   閾値は十分に緩く設定しており通常利用では到達しない。共有NAT配慮。必要なら調整可。 */
const _rlBuckets = new Map();
function rateLimit(maxPerMin) {
  return (req, res, next) => {
    const ip = String(req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown').split(',')[0].trim();
    const now = Date.now();
    let b = _rlBuckets.get(ip);
    if (!b || now > b.resetAt) { b = { count: 0, resetAt: now + 60000 }; _rlBuckets.set(ip, b); }
    b.count++;
    if (b.count > maxPerMin) {
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((b.resetAt - now) / 1000))));
      return res.status(429).json({ error: 'rate limit exceeded' });
    }
    next();
  };
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, b] of _rlBuckets) { if (now > b.resetAt) _rlBuckets.delete(ip); }
}, 5 * 60 * 1000).unref?.();

// ── Stripe Webhook (raw body — MUST come before express.json()) ──────────────
app.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  if (!stripe) return res.status(400).json({ error: 'Stripe not configured' });
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error('[stripe webhook]', e.message);
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    if (session.mode === 'subscription') {
      // RAKURAKU SaaS — サブスク開始（無料トライアル開始）
      await handleSubscriptionStarted(session);
    } else if (session.metadata?.type === 'restaurant') {
      // 飲食店モバイルオーダー — テーブル会計完了
      handleRestaurantPaymentCompleted(session);
    } else {
      // バー注文の単発決済（既存フロー）
      const tableNo = parseInt(session.metadata?.tableNo);
      const stored  = checkoutSessions.get(session.id);
      if (stored) { stored.status = 'paid'; stored.paidAt = new Date().toISOString(); }
      io.emit('payment_completed', {
        tableNo,
        sessionId: session.id,
        amount: session.amount_total,
      });
      console.log(`[stripe] 支払い完了 — ${tableNo}番卓 ¥${session.amount_total}`);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subObj = event.data.object;
    updateSubscriptionStatus(subObj.id, 'cancelled');
    console.log(`[stripe] サブスク解約 — ${subObj.id}`);

    /* 🔔 管理者通知 — Pro プラン解約 */
    notifyAdmin(
      `❌ Pro プラン解約 — Subscription ${subObj.id}`,
      `<p style="font-size:14px;">サブスクリプションが解約されました。</p>
       <p style="font-size:12px;color:#64748B;">Subscription ID: <code>${escHtml(subObj.id)}</code></p>
       <p style="font-size:12px;color:#64748B;">Customer ID: <code>${escHtml(subObj.customer || '')}</code></p>
       <p style="font-size:13px;margin-top:14px;">📋 解約理由アンケートを既にお客様へ送信済です。</p>`,
      { source: 'stripe webhook: customer.subscription.deleted' }
    ).catch(e => console.warn('[notifyAdmin] cancellation notification failed:', e.message));

    /* 解約理由アンケート URL を送信 */
    try { sendChurnSurveyEmail(subObj); }
    catch(e) { console.warn('[churn-survey] email failed:', e.message); }
  }

  if (event.type === 'invoice.payment_failed') {
    const inv = event.data.object;
    console.log(`[stripe] 支払い失敗 — subscription: ${inv.subscription}`);

    /* 🔔 管理者通知 — 月次決済失敗 (要対応!) */
    notifyAdmin(
      `⚠️ Pro プラン支払い失敗 — ${inv.customer_email || inv.customer}`,
      `<p style="font-size:14px;">月次決済が失敗しました。<strong>お客様への督促連絡が必要かもしれません</strong>。</p>
       <table style="width:100%;border-collapse:collapse;font-size:13px;margin:10px 0;">
         <tr><td style="padding:8px;background:#FEE2E2;border:1px solid #FECACA;font-weight:700;">お客様メール</td><td style="padding:8px;border:1px solid #FECACA;">${escHtml(inv.customer_email || '(不明)')}</td></tr>
         <tr><td style="padding:8px;background:#FEE2E2;border:1px solid #FECACA;font-weight:700;">金額</td><td style="padding:8px;border:1px solid #FECACA;">¥${inv.amount_due || 0}</td></tr>
         <tr><td style="padding:8px;background:#FEE2E2;border:1px solid #FECACA;font-weight:700;">失敗理由</td><td style="padding:8px;border:1px solid #FECACA;">${escHtml(inv.last_payment_error?.message || '(Stripe ログ参照)')}</td></tr>
         <tr><td style="padding:8px;background:#FEE2E2;border:1px solid #FECACA;font-weight:700;">Subscription</td><td style="padding:8px;border:1px solid #FECACA;font-family:monospace;font-size:11px;">${escHtml(inv.subscription || '')}</td></tr>
       </table>`,
      { source: 'stripe webhook: invoice.payment_failed' }
    ).catch(e => console.warn('[notifyAdmin] payment failure notification failed:', e.message));
  }

  if (event.type === 'invoice.payment_succeeded') {
    const inv = event.data.object;
    /* 毎月の定期課金サイクル (subscription_cycle) でのみ「今月のコード」を送信。
       トライアル開始・初回課金 (subscription_create) 時は登録メールで案内済みなので
       二重送信を避ける。決済処理を絶対に止めないよう必ず try/catch で包み、
       常に res 200 を返す。 */
    if (inv.billing_reason === 'subscription_cycle') {
      try {
        const sub = loadSubscriptions().find(s => s.subscriptionId === inv.subscription);
        if (sub && sub.email) {
          await sendMonthlyCodeEmail(sub.email, sub.shopName, sub.shopId);
          console.log(`[stripe] 月次決済成功 — 今月のコードを ${sub.email} に送信 (sub: ${inv.subscription})`);
        } else {
          console.warn(`[stripe] 月次決済成功だが購読情報が見つからず — subscription: ${inv.subscription}`);
        }
      } catch (e) {
        console.warn('[monthly-code] email failed:', e.message);
      }
    }
  }

  res.json({ received: true });
});

async function sendChurnSurveyEmail(subObj) {
  if (!emailTransporter) return;
  /* 購読IDからメール+店舗情報を取得 */
  const subs = loadSubscriptions();
  const sub = subs.find(s => s.subscriptionId === subObj.id);
  if (!sub || !sub.email) return;
  const baseUrl = process.env.BASE_URL || 'https://rakuraku-shift-production.up.railway.app';
  const surveyUrl = `${baseUrl}/churn-survey.html?shop=${encodeURIComponent(sub.shopName || '')}&email=${encodeURIComponent(sub.email)}&subscription_id=${encodeURIComponent(subObj.id)}`;

  await emailTransporter.sendMail({
    from: process.env.EMAIL_USER,
    to: sub.email,
    subject: '[RAKURAKU] ご利用ありがとうございました — 改善のためアンケートにご協力ください',
    html: `
      <div style="font-family:'Helvetica Neue',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1E293B;line-height:1.7;">
        <h2 style="color:#4F46E5;">${sub.ownerName || sub.shopName || ''}様</h2>
        <p>このたびは RAKURAKU をご利用いただき、誠にありがとうございました。</p>
        <p>サービス改善のため、3分のアンケートにご協力いただけませんでしょうか?<br>
        いただいたご意見は、改善作業に必ず反映させていただきます。</p>
        <p style="text-align:center;margin:30px 0;">
          <a href="${surveyUrl}" style="display:inline-block;background:#4F46E5;color:#fff;padding:14px 30px;border-radius:10px;text-decoration:none;font-weight:700;">
            📊 アンケートに回答する (3分)
          </a>
        </p>
        <p style="background:#FEF3C7;padding:14px;border-radius:8px;font-size:13px;">
          📌 もし「一時休止」も可能です。店舗を閉めている期間など、利用しない月だけ課金停止できます。<br>
          ご希望の場合は <a href="mailto:koizumishota0323@gmail.com?subject=【RAKURAKU】一時休止希望">こちら</a> までご連絡ください。
        </p>
        <p style="color:#64748B;font-size:12px;margin-top:24px;">— 代表 小泉 咲太 / 📞 080-5168-3303</p>
      </div>
    `,
  });
  console.log(`[churn-survey] アンケートURL送信 → ${sub.email}`);
}

/* 解約理由アンケート API */
app.post('/api/churn-survey', async (req, res) => {
  const data = req.body || {};
  const record = {
    id: 'ch' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    ...data,
    receivedAt: Date.now(),
  };
  const file = path.join(DATA_DIR, 'churn-surveys.json');
  const all = readJSON(file, []);
  all.push(record);
  writeJSON(file, all);

  console.log(`[churn-survey] 回答受信 — ${data.shop} / NPS:${data.nps} / 理由:${(data.reasons || []).join(',')}`);

  /* 管理者にも通知 */
  if (emailTransporter && process.env.EMAIL_USER) {
    try {
      /* XSS 対策: 解約アンケートのユーザー入力を全 escape */
      const cs = {
        shop: escHtml(data.shop || '-'),
        email: escHtml(data.email || '-'),
        nps: escHtml(String(data.nps)),
        reasons: (data.reasons || []).map(r => escHtml(r)),
        competitor: escHtml(data.competitor || '-'),
        improvement: escHtml(data.improvement || '-').replace(/\n/g, '<br>')
      };
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `[RAKURAKU] 📊 解約アンケート — ${data.shop || '?'} (NPS: ${data.nps}/10)`,
        html: `
          <h2>解約アンケート 回答</h2>
          <p><strong>店舗:</strong> ${cs.shop}<br>
             <strong>メール:</strong> ${cs.email}</p>
          <p><strong>NPS:</strong> ${cs.nps}/10</p>
          <p><strong>解約理由:</strong><br>${cs.reasons.map(r => '• ' + r).join('<br>')}</p>
          <p><strong>検討中の他社:</strong> ${cs.competitor}</p>
          <p><strong>改善要望:</strong><br>${cs.improvement}</p>
          <p><strong>再連絡可否:</strong> ${data.recontact ? '✅ OK' : '❌ 不要'}</p>
        `,
      });
    } catch(e) { console.warn('[churn-survey] admin email failed:', e.message); }
  }

  res.json({ ok: true, record });
});

app.get('/api/churn-survey', (req, res) => {
  const file = path.join(DATA_DIR, 'churn-surveys.json');
  res.json(readJSON(file, []));
});

/* ════════════════════════════════════════════
 * 🔥 創業メンバー 100 店舗プログラム 応募 API
 * 応募 → JSON保存 + 代表 (EMAIL_USER) にメール通知
 ════════════════════════════════════════════ */
/* 🚫 創業メンバー制度は廃止 (30 日 Pro 体験に一本化)
 * POST /api/apply-founders は 410 Gone で応募受付を停止。
 * 既存の応募データ (founders-applications.json) は破棄せず保持。
 */
app.post('/api/apply-founders', express.json({ limit: '64kb' }), (req, res) => {
  return res.status(410).json({
    ok: false,
    error: 'gone',
    message: '創業メンバー制度は終了しました。30 日 Pro 無料体験をご利用ください。',
    redirectTo: '/pricing.html'
  });
});

/* 旧 POST 実装は廃止 (上記 410 で代替) — 以下は未到達コード扱い */
app.post('/api/_deprecated_apply-founders_archive', express.json({ limit: '1mb' }), async (req, res) => {
  const data = req.body || {};
  const record = {
    id: 'fnd' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    ...data,
    ip: (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim(),
    userAgent: req.headers['user-agent'] || '',
    receivedAt: Date.now(),
  };
  const file = path.join(DATA_DIR, 'founders-applications.json');
  const all = readJSON(file, []);
  all.push(record);
  writeJSON(file, all);

  const seatNumber = all.length;
  console.log(`[founders] 🎉 応募受信 #${seatNumber} — ${data.shop} / ${data.owner} / ${data.region}`);

  /* 代表 (運営者) にメール通知 */
  if (emailTransporter && process.env.EMAIL_USER) {
    try {
      /* ⚠️ XSS 対策: data.* はユーザー入力なので必ず escHtml() */
      const d = {
        shop: escHtml(data.shop || '-'), owner: escHtml(data.owner || '-'),
        email: escHtml(data.email || ''), tel: escHtml(data.tel || ''),
        biz: escHtml(data.biz || '-'), staff: escHtml(data.staff || '-'),
        stores: escHtml(data.stores || '-'), region: escHtml(data.region || '-'),
        pain: escHtml(data.pain || '(未記入)')
      };
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `🔥 [RAKURAKU 創業メンバー応募 #${seatNumber}] ${data.shop || '?'} 様`,
        html: `
          <h2 style="color:#EF4444;">🎉 創業メンバー応募が届きました!</h2>
          <p style="font-size:14px;background:#FEF3C7;padding:10px 14px;border-radius:8px;border-left:4px solid #F59E0B;">
            <strong>受付番号:</strong> #${seatNumber} / 100
          </p>
          <table style="border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">店舗名</td><td style="padding:6px 10px;">${d.shop}</td></tr>
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">代表者</td><td style="padding:6px 10px;">${d.owner}</td></tr>
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">メール</td><td style="padding:6px 10px;"><a href="mailto:${d.email}">${d.email || '-'}</a></td></tr>
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">電話</td><td style="padding:6px 10px;"><a href="tel:${d.tel}">${d.tel || '-'}</a></td></tr>
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">業態</td><td style="padding:6px 10px;">${d.biz}</td></tr>
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">スタッフ数</td><td style="padding:6px 10px;">${d.staff}</td></tr>
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">店舗数</td><td style="padding:6px 10px;">${d.stores}</td></tr>
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">所在地</td><td style="padding:6px 10px;">${d.region}</td></tr>
          </table>
          <h3 style="margin-top:20px;">現在のお困りごと:</h3>
          <div style="padding:12px;background:#F8FAFC;border-radius:8px;font-size:13px;white-space:pre-wrap;">${d.pain}</div>
          <hr style="margin:24px 0;">
          <p style="font-size:12px;color:#64748B;">
            💡 24 時間以内に <a href="mailto:${d.email}">${d.email}</a> へご返信してください<br>
            📊 累計応募数: ${seatNumber} / 100 席<br>
            🌐 IP: ${escHtml(String(record.ip || '-'))}<br>
            🕐 受信時刻: ${new Date(record.receivedAt).toLocaleString('ja-JP', {timeZone: 'Asia/Tokyo'})}
          </p>
        `,
      });
      console.log(`[founders] 📧 admin email 送信成功 -> ${process.env.EMAIL_USER}`);
    } catch(e) { console.warn('[founders] admin email failed:', e.message); }

    /* 応募者にも自動返信 (任意) */
    if (data.email) {
      try {
        /* XSS 対策 */
        const safeOwn = escHtml(data.owner || '');
        const safeShp = escHtml(data.shop || '');
        await emailTransporter.sendMail({
          from: process.env.EMAIL_USER,
          to: data.email,
          subject: `🎉 [RAKURAKU] 創業メンバー応募ありがとうございます`,
          html: `
            <h2 style="color:#EF4444;">🔥 ${safeOwn} 様</h2>
            <p>RAKURAKU 創業メンバー 100 店舗プログラムにご応募いただき、誠にありがとうございます。</p>
            <p style="font-size:14px;background:#FEF3C7;padding:14px 18px;border-radius:10px;border-left:4px solid #F59E0B;">
              <strong>受付番号:</strong> #${seatNumber} / 100<br>
              <strong>店舗名:</strong> ${safeShp}
            </p>
            <p><strong>24 時間以内に</strong>代表 小泉 よりご返信いたします。</p>
            <p>創業メンバーになっていただいた場合の特典:</p>
            <ul style="line-height:1.85;">
              <li>🎁 Pro プラン 1 年間 完全無料 (¥59,880 相当)</li>
              <li>⚡ 初期セットアップ 無料 (¥30,000 相当)</li>
              <li>🎓 スタッフ説明会 無料 (¥20,000 相当)</li>
              <li>🏆 創業メンバー認定 + 機能要望の優先実装権</li>
            </ul>
            <hr style="margin:24px 0;">
            <p style="font-size:12px;color:#64748B;">
              RAKURAKU 代表 小泉 咲太<br>
              📨 <a href="mailto:koizumishota0323@gmail.com">koizumishota0323@gmail.com</a><br>
              📞 080-5168-3303<br>
              🌐 <a href="https://rakuraku-shift-production.up.railway.app/">rakuraku-shift-production.up.railway.app</a>
            </p>
          `,
        });
        console.log(`[founders] 📧 applicant auto-reply 送信成功 -> ${data.email}`);
      } catch(e) { console.warn('[founders] applicant email failed:', e.message); }
    }
  }

  res.json({ ok: true, seatNumber, record });
});

app.get('/api/apply-founders', (req, res) => {
  /* 管理者用: 応募一覧を取得 (代表専用ページから参照) */
  const file = path.join(DATA_DIR, 'founders-applications.json');
  const all = readJSON(file, []);
  res.json({ total: all.length, remaining: Math.max(0, 100 - all.length), applications: all });
});

/* 管理者用: 空レコード or 特定 ID の応募を削除 */
app.delete('/api/apply-founders/:id', express.json({ limit: '64kb' }), (req, res) => {
  const id = req.params.id;
  const file = path.join(DATA_DIR, 'founders-applications.json');
  const all = readJSON(file, []);
  const next = all.filter(a => a.id !== id);
  writeJSON(file, next);
  res.json({ ok: true, deleted: all.length - next.length, total: next.length });
});

/* 管理者用: shop/owner/email が全て空のゴミレコードを一括掃除 */
app.post('/api/apply-founders/cleanup', (req, res) => {
  const file = path.join(DATA_DIR, 'founders-applications.json');
  const all = readJSON(file, []);
  const before = all.length;
  const cleaned = all.filter(a => a.shop || a.owner || a.email);
  writeJSON(file, cleaned);
  res.json({ ok: true, removed: before - cleaned.length, remaining: cleaned.length });
});

/* ════════════════════════════════════════════
 * 💴 銀行振込でのお申し込み受付 API
 ════════════════════════════════════════════ */
app.post('/api/bank-transfer-request', express.json({ limit: '1mb' }), async (req, res) => {
  const data = req.body || {};
  const file = path.join(DATA_DIR, 'bank-transfer-requests.json');
  const all = readJSON(file, []);
  const refNumber = 'RKR-' + String(all.length + 1).padStart(4, '0');
  const record = {
    id: 'bt' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    refNumber,
    ...data,
    ip: (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim(),
    userAgent: req.headers['user-agent'] || '',
    receivedAt: Date.now(),
    status: 'pending', // pending / paid / cancelled
  };
  all.push(record);
  writeJSON(file, all);

  const payTypeLabel = data.payType === 'debit' ? '🔁 口座振替 (自動引落)' : '📤 銀行振込 (毎回)';
  console.log(`[bank-transfer] 💴 申込受信 ${refNumber} — ${data.shop} / ${data.plan} / ${data.payType || 'transfer'}`);

  /* 代表 (運営者) にメール通知 */
  if (emailTransporter && process.env.EMAIL_USER) {
    try {
      const planLabel = data.plan === 'annual' ? '年払い ¥49,900' : '月払い ¥4,990';
      /* ⚠️ XSS 対策: ユーザー入力の bank info を escape */
      const bd = {
        bankName: escHtml(data.bankName || '-'),
        branchName: escHtml(data.branchName || '-'),
        accountType: escHtml(data.accountType || '-'),
        accountNumber: escHtml(data.accountNumber || '-'),
        accountHolder: escHtml(data.accountHolder || '-'),
        shop: escHtml(data.shop || '-'),
        owner: escHtml(data.owner || '-'),
        email: escHtml(data.email || ''),
        tel: escHtml(data.tel || ''),
        billing: escHtml(data.billing || '(同上)'),
        notes: escHtml(data.notes || '')
      };
      const debitHTML = data.payType === 'debit' ? `
        <h3 style="margin-top:18px;color:#047857;">🔁 引落口座情報 (口座振替依頼書発行用)</h3>
        <table style="border-collapse:collapse;font-size:14px;background:#F0FDF4;">
          <tr><td style="padding:6px 10px;background:#DCFCE7;font-weight:bold;">銀行名</td><td style="padding:6px 10px;">${bd.bankName}</td></tr>
          <tr><td style="padding:6px 10px;background:#DCFCE7;font-weight:bold;">支店名</td><td style="padding:6px 10px;">${bd.branchName}</td></tr>
          <tr><td style="padding:6px 10px;background:#DCFCE7;font-weight:bold;">預金種目</td><td style="padding:6px 10px;">${bd.accountType}</td></tr>
          <tr><td style="padding:6px 10px;background:#DCFCE7;font-weight:bold;">口座番号</td><td style="padding:6px 10px;font-family:monospace;">${bd.accountNumber}</td></tr>
          <tr><td style="padding:6px 10px;background:#DCFCE7;font-weight:bold;">名義人カナ</td><td style="padding:6px 10px;">${bd.accountHolder}</td></tr>
        </table>
        <p style="font-size:11px;color:#15803D;margin-top:8px;">⚠️ 口座振替依頼書 PDF を作成して 24 時間以内に送付してください</p>
      ` : '';
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `${payTypeLabel} [RAKURAKU ${refNumber}] ${data.shop || '?'} 様 / ${planLabel}`,
        html: `
          <h2 style="color:#DC2626;">${payTypeLabel} のお申し込みが届きました</h2>
          <p style="font-size:14px;background:#FEF3C7;padding:10px 14px;border-radius:8px;border-left:4px solid #F59E0B;">
            <strong>申込番号:</strong> ${escHtml(refNumber)}<br>
            <strong>プラン:</strong> ${planLabel}<br>
            <strong>支払方式:</strong> ${payTypeLabel}
          </p>
          <table style="border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">店舗名</td><td style="padding:6px 10px;">${bd.shop}</td></tr>
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">代表者</td><td style="padding:6px 10px;">${bd.owner}</td></tr>
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">メール</td><td style="padding:6px 10px;"><a href="mailto:${bd.email}">${bd.email || '-'}</a></td></tr>
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">電話</td><td style="padding:6px 10px;"><a href="tel:${bd.tel}">${bd.tel || '-'}</a></td></tr>
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">請求書宛名</td><td style="padding:6px 10px;">${bd.billing}</td></tr>
          </table>
          ${debitHTML}
          ${data.notes ? `<h3 style="margin-top:18px;">連絡事項:</h3><div style="padding:14px;background:#F8FAFC;border-radius:8px;font-size:13px;white-space:pre-wrap;">${bd.notes}</div>` : ''}
          <hr style="margin:20px 0;">
          <p style="font-size:12px;color:#64748B;">
            💡 24 時間以内に <a href="mailto:${bd.email}">${bd.email}</a> へ詳細案内を返信してください<br>
            🌐 IP: ${escHtml(String(record.ip || '-'))}<br>
            🕐 受信: ${new Date(record.receivedAt).toLocaleString('ja-JP', {timeZone: 'Asia/Tokyo'})}
          </p>
        `,
      });
      console.log(`[bank-transfer] 📧 admin mail OK -> ${process.env.EMAIL_USER}`);
    } catch(e) { console.warn('[bank-transfer] admin mail failed:', e.message); }

    /* 申込者に振込先 + 申込番号を自動返信 */
    if (data.email){
      try {
        const planLabel = data.plan === 'annual' ? '年払い ¥49,900' : '月払い ¥4,990';
        const amount = data.plan === 'annual' ? '¥49,900' : '¥4,990';
        /* XSS 対策: data.owner / refNumber を escape */
        const safeOwn = escHtml(data.owner || '');
        const safeRef = escHtml(refNumber);
        await emailTransporter.sendMail({
          from: process.env.EMAIL_USER,
          to: data.email,
          subject: `💴 [RAKURAKU] 銀行振込のご案内 (申込番号: ${refNumber})`,
          html: `
            <h2 style="color:#DC2626;">💴 ${safeOwn} 様</h2>
            <p>RAKURAKU へのお申し込みありがとうございます。<br>下記の口座へお振込みください。</p>
            <p style="font-size:14px;background:#FEF3C7;padding:14px 18px;border-radius:10px;border-left:4px solid #F59E0B;">
              <strong>申込番号:</strong> <span style="font-family:monospace;letter-spacing:.1em;">${safeRef}</span><br>
              <strong>プラン:</strong> ${planLabel}<br>
              <strong>金額:</strong> ${amount} (税込)
            </p>
            <h3 style="margin-top:18px;color:#DC2626;">📋 振込先</h3>
            <table style="border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">銀行名</td><td style="padding:6px 10px;">PayPay銀行 (銀行コード 0033)</td></tr>
              <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">支店</td><td style="padding:6px 10px;">支店番号 007</td></tr>
              <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">口座番号</td><td style="padding:6px 10px;font-family:monospace;letter-spacing:.05em;">普通 7879479</td></tr>
              <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">口座名義</td><td style="padding:6px 10px;">コイズミ ショウタ</td></tr>
              <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">振込手数料</td><td style="padding:6px 10px;">お客様ご負担 (PayPay銀行間は無料)</td></tr>
            </table>
            <p style="font-size:13px;background:#EFF6FF;padding:14px 18px;border-radius:10px;border-left:4px solid #4F46E5;margin-top:14px;">
              💡 <strong>振込人名義の末尾に申込番号 (${refNumber}) を追記</strong>していただくと、入金確認がスムーズです<br>
              例: <strong>カブシキガイシャ○○ ${refNumber}</strong>
            </p>
            <h3 style="margin-top:20px;">入金確認後の流れ</h3>
            <ol style="line-height:1.85;">
              <li>入金確認 (営業日 1-2 日)</li>
              <li>Pro プラン有効化 (即日)</li>
              <li>領収書 PDF をメールでお送り</li>
              <li>${data.plan === 'annual' ? '次年度のご請求は 12 ヶ月後にお送りします' : '次月のご請求書を月末にお送りします'}</li>
            </ol>
            <hr style="margin:24px 0;">
            <p style="font-size:12px;color:#64748B;">
              ご質問は <a href="mailto:koizumishota0323@gmail.com">koizumishota0323@gmail.com</a> までどうぞ<br>
              RAKURAKU 代表 小泉 咲太
            </p>
          `,
        });
        console.log(`[bank-transfer] 📧 applicant mail OK -> ${data.email}`);
      } catch(e) { console.warn('[bank-transfer] applicant mail failed:', e.message); }
    }
  }

  res.json({ ok: true, refNumber, record });
});

app.get('/api/bank-transfer-request', (req, res) => {
  const file = path.join(DATA_DIR, 'bank-transfer-requests.json');
  const all = readJSON(file, []);
  res.json({ total: all.length, pending: all.filter(r => r.status === 'pending').length, requests: all });
});

/* ════════════════════════════════════════════
 * 🎁 創業メンバー Pro 1 年無料 ライセンス発行 API (管理者専用)
 ════════════════════════════════════════════ */
function genFounderCode(){
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // 紛らわしい O, 0, 1, I を除外
  let p1 = '', p2 = '';
  for (let i = 0; i < 4; i++) p1 += chars[Math.floor(Math.random() * chars.length)];
  for (let i = 0; i < 4; i++) p2 += chars[Math.floor(Math.random() * chars.length)];
  return `RKR-FNDR-${p1}-${p2}`;
}

/* 🚫 創業メンバー制度は廃止: ライセンス発行 API は 410 Gone */
app.post('/api/issue-founder-license', express.json({ limit: '64kb' }), (req, res) => {
  return res.status(410).json({
    ok: false,
    error: 'gone',
    message: '創業メンバー制度は終了しました。新規ライセンス発行はできません。',
    redirectTo: '/pricing.html'
  });
});

/* 旧 POST 実装は廃止 (上記 410 で代替) */
app.post('/api/_deprecated_issue-founder-license_archive', express.json({ limit: '1mb' }), async (req, res) => {
  const { applicationId, shop, owner, email, durationDays } = req.body || {};
  if (!shop || !email){
    return res.status(400).json({ error: 'shop and email are required' });
  }

  /* コード生成 (重複しないように) */
  const file = path.join(DATA_DIR, 'founder-licenses.json');
  const all = readJSON(file, []);
  let code;
  let attempts = 0;
  do {
    code = genFounderCode();
    attempts++;
  } while (all.some(l => l.code === code) && attempts < 50);

  const now = Date.now();
  const days = Number(durationDays) || 365;
  const expiresAt = now + days * 86400000;
  const seatNumber = all.length + 1;
  const license = {
    code,
    refNumber: `RKR-FNDR-${String(seatNumber).padStart(4, '0')}`,
    applicationId: applicationId || null,
    shop, owner, email,
    issuedAt: now,
    expiresAt,
    activatedAt: null,
    status: 'issued',   // issued / activated / expired / cancelled
  };
  all.push(license);
  writeJSON(file, all);

  console.log(`[founder-license] 🎁 発行 ${code} → ${shop} / ${email}`);

  /* 申込者にアクティベートコードを送信 */
  if (emailTransporter && process.env.EMAIL_USER) {
    try {
      /* ⚠️ 重要: shop/owner はユーザー入力なので escHtml() で XSS 防止 */
      const safeOwner = escHtml(owner || shop || '');
      const safeShop = escHtml(shop);
      const safeRef = escHtml(license.refNumber);
      const safeCode = escHtml(code);  // 内部生成なので念のため
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `🎁 [RAKURAKU 創業メンバー] アクティベートコードのご案内`,
        html: `
          <h2 style="color:#DC2626;">🎉 ${safeOwner} 様</h2>
          <p>RAKURAKU 創業メンバー 100 店舗プログラムへのご応募、ありがとうございました。<br>厳正な審査の結果、<strong>創業メンバー</strong>としてご承認させていただきました。</p>

          <p style="font-size:14px;background:#FEF3C7;padding:16px 20px;border-radius:12px;border-left:5px solid #F59E0B;margin:20px 0;">
            <strong>受付番号:</strong> ${safeRef}<br>
            <strong>店舗名:</strong> ${safeShop}<br>
            <strong>プラン:</strong> Pro プラン 1 年間 完全無料 (¥59,880 相当)
          </p>

          <h3 style="color:#DC2626;margin-top:24px;">🔑 アクティベートコード</h3>
          <div style="background:#0F0F23;color:#FCD34D;padding:24px;border-radius:14px;text-align:center;font-family:Menlo,monospace;font-size:24px;font-weight:900;letter-spacing:0.15em;margin:14px 0;">
            ${safeCode}
          </div>

          <h3 style="margin-top:24px;">🚀 アクティベート方法</h3>
          <ol style="line-height:1.9;">
            <li>下記の URL をクリック</li>
            <li>上記のコードを入力</li>
            <li>「🔓 アクティベート」をクリック</li>
            <li>すぐに Pro プラン全機能をご利用いただけます</li>
          </ol>

          <p style="text-align:center;margin:24px 0;">
            <a href="https://rakuraku-shift-production.up.railway.app/founder-activate.html"
               style="display:inline-block;background:linear-gradient(135deg,#DC2626,#F59E0B);color:#fff;padding:14px 32px;border-radius:30px;font-weight:900;font-size:14px;text-decoration:none;">
              🔓 今すぐアクティベートする
            </a>
          </p>

          <p style="font-size:12px;color:#64748B;background:#F1F5F9;padding:14px;border-radius:10px;line-height:1.7;">
            ⚠️ このコードは <strong>1 回のみ</strong>使用できます<br>
            📅 有効期限: ${new Date(expiresAt).toLocaleDateString('ja-JP', {timeZone: 'Asia/Tokyo'})} まで<br>
            🔒 紛失した場合は <a href="mailto:koizumishota0323@gmail.com">koizumishota0323@gmail.com</a> へご連絡ください
          </p>

          <hr style="margin:24px 0;">
          <p style="font-size:12px;color:#64748B;">
            創業メンバー特典:<br>
            ・🎁 Pro プラン 1 年間 完全無料<br>
            ・⚡ 初期セットアップ 無料サポート<br>
            ・🎓 スタッフ向け Zoom 説明会 無料<br>
            ・📞 代表 直通サポート (平日 10-18 時)<br>
            ・🔧 機能要望の優先実装枠<br>
            ・🏆 公式サイトへの店舗紹介 (任意・許諾済みのみ)<br><br>

            RAKURAKU 代表 小泉 咲太<br>
            📨 <a href="mailto:koizumishota0323@gmail.com">koizumishota0323@gmail.com</a><br>
            📞 080-5168-3303
          </p>
        `,
      });
      console.log(`[founder-license] 📧 activation mail OK -> ${email}`);
    } catch(e) { console.warn('[founder-license] mail failed:', e.message); }
  }

  res.json({ ok: true, code, refNumber: license.refNumber, expiresAt });
});

/* ⚠️ 創業メンバー制度は廃止 (30 日 Pro 体験に一本化):
 * - 既にアクティベート済みの方は引き続き Pro プランをご利用いただけます (互換維持)
 * - 未アクティベート (status: issued) のコードは新規アクティベート不可 (410 gone)
 */
app.post('/api/validate-founder-license', express.json({ limit: '64kb' }), (req, res) => {
  const { code } = req.body || {};
  if (!code) return res.status(400).send('code is required');

  const file = path.join(DATA_DIR, 'founder-licenses.json');
  const all = readJSON(file, []);
  const license = all.find(l => l.code.toUpperCase() === String(code).toUpperCase());

  if (!license) return res.status(404).send('not found');
  if (license.expiresAt < Date.now()) return res.status(410).send('expired');

  /* ✅ 既にアクティベート済み → 互換維持で成功扱い (PWA 復元で叩かれる) */
  if (license.status === 'activated' && license.expiresAt > Date.now()){
    return res.json({
      ok: true,
      refNumber: license.refNumber,
      shop: license.shop,
      expiresAt: license.expiresAt,
      message: 'already activated'
    });
  }

  /* 🚫 未アクティベート (status: issued) の新規アクティベートはブロック */
  return res.status(410).json({
    ok: false,
    error: 'program-ended',
    message: '創業メンバー制度は終了しました。お手数ですが 30 日 Pro 無料体験をご利用ください。',
    redirectTo: '/pricing.html'
  });

  /* (旧アクティベート時の通知メール送信ロジックは廃止。
       既存 activated 済みは上で early return しているため到達不可) */
});

app.get('/api/founder-licenses', (req, res) => {
  const file = path.join(DATA_DIR, 'founder-licenses.json');
  const all = readJSON(file, []);
  res.json({
    total: all.length,
    issued: all.filter(l => l.status === 'issued').length,
    activated: all.filter(l => l.status === 'activated').length,
    licenses: all
  });
});

/* 管理者用: 問い合わせも同様 cleanup */
app.post('/api/contact-inquiries/cleanup', (req, res) => {
  const file = path.join(DATA_DIR, 'contact-inquiries.json');
  const all = readJSON(file, []);
  const before = all.length;
  const cleaned = all.filter(c => c.name || c.email || c.message);
  writeJSON(file, cleaned);
  res.json({ ok: true, removed: before - cleaned.length, remaining: cleaned.length });
});

/* ════════════════════════════════════════════
 * 📨 問い合わせ受信 API
 * mailto: の代替として Web フォーム経由でも受け取れる
 ════════════════════════════════════════════ */
app.post('/api/contact-inquiries', express.json({ limit: '1mb' }), async (req, res) => {
  const data = req.body || {};
  const record = {
    id: 'inq' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    ...data,
    ip: (req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim(),
    userAgent: req.headers['user-agent'] || '',
    receivedAt: Date.now(),
  };
  const file = path.join(DATA_DIR, 'contact-inquiries.json');
  const all = readJSON(file, []);
  all.push(record);
  writeJSON(file, all);

  console.log(`[contact] 📨 受信 #${all.length} — ${data.name || '?'} / ${data.subject || '件名なし'}`);

  if (emailTransporter && process.env.EMAIL_USER) {
    try {
      /* XSS 対策: 問い合わせ ユーザー入力を全 escape */
      const ci = {
        name: escHtml(data.name || '-'),
        email: escHtml(data.email || ''),
        tel: escHtml(data.tel || '-'),
        shop: escHtml(data.shop || '-'),
        subject: escHtml(data.subject || '-'),
        message: escHtml(data.message || '(本文なし)')
      };
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `📨 [RAKURAKU 問い合わせ #${all.length}] ${data.subject || data.name || '問い合わせ'}`,
        html: `
          <h2 style="color:#4F46E5;">📨 新しい問い合わせが届きました</h2>
          <table style="border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">お名前</td><td style="padding:6px 10px;">${ci.name}</td></tr>
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">メール</td><td style="padding:6px 10px;"><a href="mailto:${ci.email}">${ci.email || '-'}</a></td></tr>
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">電話</td><td style="padding:6px 10px;">${ci.tel}</td></tr>
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">店舗名</td><td style="padding:6px 10px;">${ci.shop}</td></tr>
            <tr><td style="padding:6px 10px;background:#F8FAFC;font-weight:bold;">件名</td><td style="padding:6px 10px;">${ci.subject}</td></tr>
          </table>
          <h3 style="margin-top:18px;">メッセージ:</h3>
          <div style="padding:14px;background:#F8FAFC;border-radius:8px;font-size:13px;white-space:pre-wrap;">${ci.message}</div>
          <hr style="margin:20px 0;">
          <p style="font-size:12px;color:#64748B;">
            💡 <a href="https://rakuraku-shift-production.up.railway.app/owner-inbox.html">受信ボックスで確認</a><br>
            🌐 IP: ${escHtml(String(record.ip || '-'))}<br>
            🕐 受信: ${new Date(record.receivedAt).toLocaleString('ja-JP', {timeZone: 'Asia/Tokyo'})}
          </p>
        `,
      });
      console.log(`[contact] 📧 admin mail OK -> ${process.env.EMAIL_USER}`);
    } catch(e) { console.warn('[contact] admin mail failed:', e.message); }
  }

  res.json({ ok: true, id: record.id });
});

app.get('/api/contact-inquiries', (req, res) => {
  const file = path.join(DATA_DIR, 'contact-inquiries.json');
  const all = readJSON(file, []);
  res.json({ total: all.length, inquiries: all });
});

/* ════════════════════════════════════════════
 * 💎 Pro サブスクリプション申込 ログ取得 API
 ════════════════════════════════════════════ */
app.get('/api/subscriptions', (req, res) => {
  const file = path.join(DATA_DIR, 'subscriptions.json');
  const all = readJSON(file, []);
  res.json({ total: all.length, subscriptions: all });
});

/* ════════════════════════════════════════════
 * 🎬 デモ予約 ログ取得 API
 ════════════════════════════════════════════ */
app.get('/api/demo-bookings', (req, res) => {
  const file = path.join(DATA_DIR, 'demo-bookings.json');
  const all = readJSON(file, []);
  res.json({ total: all.length, bookings: all });
});

app.use(express.json({ limit: '6mb' }));

/* ════════════════════════════════════════════
 * 🔒 noru-admin.html へのアクセスログ (誰がアクセスしたか追跡)
 * 代表専用ページなので、不審なアクセスを検知できるように
 ════════════════════════════════════════════ */
app.use((req, res, next) => {
  if (req.path === '/noru-admin.html' || req.path === '/noru-admin') {
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    const ua = req.headers['user-agent'] || 'unknown';
    const ts = new Date().toISOString();
    console.log(`[ADMIN-ACCESS] ${ts} | IP: ${ip} | UA: ${ua.slice(0, 80)}`);
    /* レスポンスヘッダー: 検索エンジンに絶対インデックスさせない */
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    res.setHeader('Referrer-Policy', 'no-referrer');
  }
  next();
});

/* ════════════════════════════════════════════
 * 🔒 機密ファイル / データディレクトリへの直接アクセス遮断 (static より前に置く)
 *   express.static(__dirname) はプロジェクト直下を丸ごと配信するため、この guard が無いと
 *   /data/subscriptions.json や /data/attendance/*.json (購読者・スタッフの個人情報)、
 *   /server.js などが URL 直打ちで取得できてしまう。
 *   公開して良いのは /data/menu-images/ (店舗メニュー画像) のみ。存在を悟らせないため 404。
 * ════════════════════════════════════════════ */
const _BLOCKED_EXACT = new Set([
  '/server.js', '/package.json', '/package-lock.json',
  '/.env', '/.env.local', '/.env.production', '/Procfile',
]);
app.use((req, res, next) => {
  let p;
  try { p = decodeURIComponent(req.path || ''); }
  catch (e) { return res.status(400).send('Bad request'); }
  p = path.posix.normalize(p);
  const blockedData = /^\/data(\/|$)/i.test(p) && !/^\/data\/menu-images\//i.test(p);
  const blockedDir  = /^\/(node_modules|\.git)(\/|$)/i.test(p);
  if (blockedData || blockedDir || _BLOCKED_EXACT.has(p)) {
    return res.status(404).send('Not found');
  }
  next();
});

// ルートディレクトリの全ファイルを配信（HTML, CSS, JS など）
app.use(express.static(path.join(__dirname)));
// public/ も引き続き配信
app.use(express.static(path.join(__dirname, 'public')));

// 静的ファイル配信後、未マッチパスに404ページを返す（API系より下に置くため位置はサーバ末尾に注意）
function _404Handler(req, res, next) {
  // API は別途処理
  if (req.path.startsWith('/api/') || req.path.startsWith('/webhook/')) return next();
  res.status(404).sendFile(path.join(__dirname, '404.html'));
}

// ── Health check + Status Page API ──────────────────────────────
const SERVER_START_TIME = Date.now();
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor((Date.now() - SERVER_START_TIME) / 1000),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ── /signup (拡張子なし) → signup.html へルート (旧リンク互換) ─────
//   既存のメール・SNS・外部記事にある `/signup` 参照を維持するため
app.get('/signup', (req, res) => {
  const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  res.redirect(302, '/signup.html' + qs);
});

// ── /api/signup — フォーム送信受け口 (Free/Trial: 即承認 / Pro: Stripe Checkout 生成) ─
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, shopname, plan } = req.body || {};
    if (!email || !password || !shopname) {
      return res.status(400).json({ error: 'email/password/shopname は必須です' });
    }
    if (!['free','trial','pro'].includes(plan)) {
      return res.status(400).json({ error: 'plan は free / trial / pro のいずれか' });
    }

    /* 🔔 管理者通知 (どのプランでも即時送信 — Pro の場合は Stripe Checkout 進行前) */
    const planLabel = ({ free: '🆓 Free (永久無料)', trial: '🎁 30日 Pro 体験', pro: '💼 Pro (¥4,990/月)' })[plan] || plan;
    const isPro = plan === 'pro';
    notifyAdmin(
      `新規登録申込 — ${planLabel} (${shopname})`,
      `
        <p style="font-size:14px;margin:0 0 14px;"><strong>新規登録の申込がありました</strong>${isPro ? ' (Pro プラン — クレカ登録ページへ遷移中)' : ''}</p>
        <table style="width:100%;border-collapse:collapse;font-size:13px;margin:10px 0;">
          <tr><td style="padding:8px;background:#F8FAFC;border:1px solid #E2E8F0;width:30%;font-weight:700;">プラン</td><td style="padding:8px;border:1px solid #E2E8F0;">${escHtml(planLabel)}</td></tr>
          <tr><td style="padding:8px;background:#F8FAFC;border:1px solid #E2E8F0;font-weight:700;">店舗名</td><td style="padding:8px;border:1px solid #E2E8F0;">${escHtml(shopname)}</td></tr>
          <tr><td style="padding:8px;background:#F8FAFC;border:1px solid #E2E8F0;font-weight:700;">メール</td><td style="padding:8px;border:1px solid #E2E8F0;"><a href="mailto:${escHtml(email)}">${escHtml(email)}</a></td></tr>
        </table>
        ${isPro ? `
        <div style="background:#FEF3C7;border-left:4px solid #F59E0B;padding:12px 14px;border-radius:0 8px 8px 0;font-size:12px;color:#78350F;margin:14px 0;">
          ⚠️ <strong>このメールは Stripe 決済前の段階</strong> です。実際に課金されたら別途「Pro プラン課金開始」通知が届きます。
        </div>
        ` : `
        <div style="background:#DCFCE7;border-left:4px solid #22C55E;padding:12px 14px;border-radius:0 8px 8px 0;font-size:12px;color:#065F46;margin:14px 0;">
          ✅ クレジットカード登録なしで即時登録完了。onboarding.html へ進みました。
        </div>
        `}
      `,
      { source: '/api/signup' }
    ).catch(e => console.warn('[notifyAdmin] signup notification failed:', e.message));

    /* Pro: Stripe Checkout URL を返す (クレカ正直開示の核心) */
    if (plan === 'pro') {
      if (!stripe) {
        // Stripe 未設定 → bank-transfer.html へ誘導
        return res.json({ next: '/bank-transfer.html?email=' + encodeURIComponent(email) + '&shopname=' + encodeURIComponent(shopname) });
      }
      /* 💳 シンプル課金: 30日間無料トライアル → 通常 ¥4,990/月
         - trial_period_days:30 で最初の30日は無料
         - 31日目から通常 ¥4,990/月。プロモコード入力は許可 */
      const sessionParams = {
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: email,
        line_items: [{
          price_data: {
            currency: 'jpy',
            recurring: { interval: 'month' },
            product_data: { name: 'RAKURAKU Pro プラン (30日間無料 → ¥4,990/月)' },
            unit_amount: 4990,
          },
          quantity: 1,
        }],
        subscription_data: {
          trial_period_days: 30,
          metadata: { shopname, shopName: shopname, plan: 'pro' },
        },
        locale: 'ja',
        success_url: (process.env.BASE_URL || '') + '/onboarding.html?plan=pro&email=' + encodeURIComponent(email),
        cancel_url: (process.env.BASE_URL || '') + '/signup.html?plan=pro',
        /* 🐛 修正: shopName (camelCase) と shopname 両方入れる → webhook 側のキー不一致を吸収 */
        metadata: { shopname, shopName: shopname, plan: 'pro' },
      };
      sessionParams.allow_promotion_codes = true;
      const session = await stripe.checkout.sessions.create(sessionParams);
      return res.json({ checkoutUrl: session.url });
    }

    /* Free / Trial: クレカ不要 — サーバー側で店舗を発行し、お客様へ確認(歓迎)メールを送ってからオンボーディングへ。
       ※ signup.html で「確認メールをお送りします」と明示しているため、ここで必ずお客様宛に送信する。
         (Pro は Stripe webhook の handleSubscriptionStarted で同等処理を実施) */
    const pseudoSubId = plan + '_' + Date.now();
    const licenseCode = generateLicenseCode(email + shopname);
    const shopId = generateShopId(shopname, email);
    addShopToAdminList({
      shopId, shopName: shopname, ownerName: '', email, phone: '',
      subscriptionId: pseudoSubId, customerId: '',
      fee: plan === 'free' ? 0 : 4990,
    });
    saveSubscription({
      sessionId: pseudoSubId, customerId: '', subscriptionId: pseudoSubId,
      shopId, shopName: shopname, ownerName: '', email, phone: '',
      licenseCode,
      status: plan === 'free' ? 'free' : 'trialing',
      createdAt: new Date().toISOString(),
    });
    /* お客様へ確認(歓迎)メール — レスポンスはブロックせず非同期送信 (notifyAdmin と同様) */
    sendLicenseEmail(email, shopname, licenseCode, shopId, { plan })
      .catch(e => console.error('[api/signup] お客様への確認メール送信失敗:', e.message));
    try { scheduleOnboardingEmails(email, shopname, '', shopId); }
    catch (e) { console.warn('[api/signup] onboarding schedule失敗:', e.message); }
    /* next はクエリ無しで返す (signup.html 側が ?plan=&email= を付与するため二重 ? を避ける)。shopId は別フィールドで返却 */
    res.json({ next: '/onboarding.html', plan, email, shopId });
  } catch (e) {
    console.error('[api/signup]', e);
    res.status(500).json({ error: e.message });
  }
});

/* ════════════════════════════════════════════
 * テスト用: 店舗自動追加 を Stripe なしで確認できるエンドポイント
 * 使い方: POST /api/admin/test-auto-add { shopName, email, ownerName }
 * 本番運用時はこのエンドポイントを削除 or 認証で保護してください
 ════════════════════════════════════════════ */
app.post('/api/admin/test-auto-add', (req, res) => {
  const { shopName, email, ownerName, phone } = req.body || {};
  if (!shopName) return res.status(400).json({ error: 'shopName 必須' });

  const shopId = generateShopId(shopName, email);
  const licenseCode = generateLicenseCode(email + shopName);

  const added = addShopToAdminList({
    shopId, shopName, ownerName, email, phone,
    subscriptionId: 'test_' + Date.now(),
    customerId:     'cus_test_' + Date.now(),
    fee: 4990,
  });

  saveSubscription({
    sessionId: 'test_session_' + Date.now(),
    customerId: 'cus_test_' + Date.now(),
    subscriptionId: 'test_' + Date.now(),
    shopId, shopName, ownerName, email, phone,
    licenseCode,
    status: 'trialing',
    createdAt: new Date().toISOString(),
  });

  /* 歓迎メール + オンボーディングスケジュール */
  if (email) {
    sendLicenseEmail(email, shopName, licenseCode, shopId).catch(e => console.warn('[test-add] email:', e.message));
    scheduleOnboardingEmails(email, shopName, ownerName, shopId);
  }

  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  res.json({
    ok: true,
    added,
    shopId,
    licenseCode,
    shopUrl: `${baseUrl}/shift.html?shop=${encodeURIComponent(shopId)}`,
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=2&color=4F46E5&data=${encodeURIComponent(baseUrl + '/shift.html?shop=' + encodeURIComponent(shopId) + '&staff=1')}`,
    message: '✅ テスト用店舗を自動追加しました。noru-admin を開いてご確認ください。',
  });
});

/* ロードマップ 投票 + アイデア投稿 API */
app.post('/api/roadmap-vote', (req, res) => {
  const { id, voted } = req.body || {};
  if (!id) return res.status(400).json({ error: 'id 必須' });
  const file = path.join(DATA_DIR, 'roadmap-votes.json');
  const all = readJSON(file, {});
  all[id] = (all[id] || 0) + (voted ? 1 : -1);
  if (all[id] < 0) all[id] = 0;
  writeJSON(file, all);
  res.json({ ok: true, votes: all[id] });
});

app.get('/api/roadmap-votes', (req, res) => {
  res.json(readJSON(path.join(DATA_DIR, 'roadmap-votes.json'), {}));
});

app.post('/api/roadmap-idea', async (req, res) => {
  const { title, desc, email } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title 必須' });
  const file = path.join(DATA_DIR, 'roadmap-ideas.json');
  const all = readJSON(file, []);
  const record = { id: 'id' + Date.now(), title, desc: desc || '', email: email || '', submittedAt: Date.now() };
  all.push(record);
  writeJSON(file, all);
  console.log(`[roadmap-idea] 新規: ${title} (${email || '匿名'})`);
  if (emailTransporter && process.env.EMAIL_USER) {
    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `[RAKURAKU] 💡 新しい機能要望: ${title}`,
        html: `<h2>${title}</h2><p>${(desc || '').replace(/\n/g,'<br>')}</p><p>連絡: ${email || '匿名'}</p>`,
      });
    } catch(e) { console.warn('[roadmap-idea email]', e.message); }
  }
  res.json({ ok: true, record });
});

app.get('/api/incidents', (req, res) => {
  const file = path.join(DATA_DIR, 'incidents.json');
  const all = readJSON(file, []);
  /* 30日以内の障害のみ */
  const now = Date.now();
  res.json(all.filter(i => (now - new Date(i.startedAt).getTime()) < 30 * 86400000));
});

/* 管理者: 障害手動報告 */
app.post('/api/incidents', (req, res) => {
  const { title, description, status, severity } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title 必須' });
  const file = path.join(DATA_DIR, 'incidents.json');
  const all = readJSON(file, []);
  const record = {
    id: 'inc' + Date.now(),
    title, description: description || '',
    status: status || 'ongoing', /* ongoing / resolved / scheduled */
    severity: severity || 'medium', /* low / medium / high / critical */
    startedAt: new Date().toISOString(),
    resolvedAt: status === 'resolved' ? new Date().toISOString() : null,
  };
  all.unshift(record);
  writeJSON(file, all);

  /* 購読者全員にメール送信 */
  notifyStatusSubscribers(record).catch(e => console.warn('[incident notify]', e.message));
  res.json({ ok: true, record });
});

app.post('/api/status-subscribe', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email 必須' });
  const file = path.join(DATA_DIR, 'status-subscribers.json');
  const all = readJSON(file, []);
  if (!all.find(s => s.email === email)) {
    all.push({ email, subscribedAt: Date.now() });
    writeJSON(file, all);
    console.log(`[status] 購読登録 → ${email}`);
  }
  res.json({ ok: true });
});

async function notifyStatusSubscribers(incident) {
  if (!emailTransporter) return;
  const subs = readJSON(path.join(DATA_DIR, 'status-subscribers.json'), []);
  if (!subs.length) return;
  const subject = incident.status === 'resolved'
    ? `[RAKURAKU] ✅ 障害復旧 — ${incident.title}`
    : `[RAKURAKU] 🚨 障害発生 — ${incident.title}`;
  for (const s of subs) {
    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: s.email,
        subject,
        html: `
          <div style="font-family:'Helvetica Neue',sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1E293B;">
            <h2>${incident.status === 'resolved' ? '✅' : '🚨'} ${incident.title}</h2>
            <p>${incident.description || ''}</p>
            <p><strong>発生時刻:</strong> ${new Date(incident.startedAt).toLocaleString('ja-JP')}</p>
            ${incident.resolvedAt ? `<p><strong>復旧時刻:</strong> ${new Date(incident.resolvedAt).toLocaleString('ja-JP')}</p>` : ''}
            <p><a href="https://rakuraku-shift-production.up.railway.app/status.html">稼働状況ページを確認</a></p>
          </div>
        `,
      });
    } catch(e) { console.warn('[status notify]', s.email, e.message); }
  }
}

// ── REST API ──────────────────────────────
app.get('/api/state', (req, res) => {
  res.json(engine.getState());
});

app.get('/api/config', (req, res) => {
  res.json(loadConfig());
});

app.post('/api/config', (req, res) => {
  const cfg = req.body;
  saveConfig(cfg);
  engine.applyConfig(cfg);
  io.emit('config_updated', { config: cfg });
  res.json({ ok: true });
});

app.post('/api/order', (req, res) => {
  const { drinkId } = req.body;
  if (!drinkId) return res.status(400).json({ error: 'drinkId required' });
  const state = engine.recordOrder(drinkId);
  if (!state) return res.status(404).json({ error: 'drink not found' });
  const drink = state.drinks.find(d => d.id === drinkId);
  appendOrder(drinkId, drink?.price);
  // 在庫連動: 在庫を1減らして保存
  engine.decrementStock(drinkId);
  const stock = loadStock();
  if (stock[drinkId] != null) { stock[drinkId] = Math.max(0, stock[drinkId] - 1); saveStock(stock); }
  io.emit('price_update', engine.getState());
  res.json(engine.getState());
});

app.post('/api/crash', (req, res) => {
  const state = engine.triggerCrash();
  io.emit('price_update', state);
  io.emit('crash_event', { message: '💥 MARKET CRASH！全品目が暴落中！' });
  res.json(state);
});

app.post('/api/reset', (req, res) => {
  const state = engine.resetPrices();
  io.emit('price_update', state);
  res.json(state);
});

// ダッシュボード用集計API
app.get('/api/dashboard', (req, res) => {
  const orders   = loadOrders();
  const rankings = loadRankings();
  const state    = engine.getState();

  // ドリンク別集計
  const drinkStats = {};
  state.drinks.forEach(d => { drinkStats[d.id] = { name: d.name, emoji: d.emoji, count: 0, revenue: 0 }; });
  orders.forEach(o => {
    if (drinkStats[o.drinkId]) {
      drinkStats[o.drinkId].count++;
      drinkStats[o.drinkId].revenue += o.price ?? 0;
    }
  });

  // 時間帯別注文数（0〜23時）
  const byHour = Array(24).fill(0);
  orders.forEach(o => {
    const h = new Date(o.ts).getHours();
    byHour[h]++;
  });

  // プレイヤーランキング
  const playerCount = {};
  rankings.forEach(r => {
    const k = r.name || '匿名';
    playerCount[k] = (playerCount[k] ?? 0) + 1;
  });

  res.json({
    date:        todayKey(),
    totalOrders: orders.length,
    totalRevenue: orders.reduce((s, o) => s + (o.price ?? 0), 0),
    drinkStats:  Object.values(drinkStats).sort((a, b) => b.count - a.count),
    byHour,
    playerRanking: Object.entries(playerCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count })),
    rankings: rankings.slice(-50),
  });
});

// ── ガチャ API ───────────────────────────────
app.get('/api/gacha/config', (req, res) => {
  res.json(loadGachaConfig());
});

app.post('/api/gacha/config', (req, res) => {
  const cfg = req.body;
  saveGachaConfig(cfg);
  io.emit('gacha_config_updated', cfg);
  res.json({ ok: true });
});

app.post('/api/gacha/pull', (req, res) => {
  const { name, prizeId } = req.body;
  const cfg = loadGachaConfig();
  const prize = cfg.prizes.find(p => p.id === prizeId);
  // 在庫を減らす
  if (prize && prize.stock > 0) {
    prize.stock--;
    saveGachaConfig(cfg);
    io.emit('gacha_config_updated', cfg);
  }
  const entry = { name: name || '匿名', prizeId, prizeName: prize?.name, prizeEmoji: prize?.emoji, ts: Date.now() };
  appendGachaResult(entry);
  io.emit('gacha_pulled', entry);
  res.json({ ok: true, prize, entry });
});

app.get('/api/gacha/history', (req, res) => {
  res.json(loadGachaHistory());
});

// ── QR コード生成 API ────────────────────────
app.get('/api/qr', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('url required');
  try {
    const png = await QRCode.toBuffer(url, { width: 300, margin: 1 });
    res.set('Content-Type', 'image/png').send(png);
  } catch(e) {
    res.status(500).send(e.message);
  }
});

// ── スタッフレジストリ API（名前→メール暗記） ──────────────
// 登録・更新: POST /api/staff/registry  { name, email, role }
app.post('/api/staff/registry', (req, res) => {
  const { name, email, role } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'name required' });
  }
  const reg = loadRegistry();
  const prev = reg[name] || {};
  reg[name] = {
    email:     email     || prev.email     || '',
    role:      role      || prev.role      || 'hall',
    updatedAt: new Date().toISOString(),
  };
  saveRegistry(reg);
  res.json({ ok: true });
});

// 名前で検索: GET /api/staff/registry?name=xxx
// 全件取得: GET /api/staff/registry
app.get('/api/staff/registry', (req, res) => {
  const reg  = loadRegistry();
  const name = req.query.name;
  if (name) {
    const entry = reg[name];
    if (entry) return res.json({ found: true, ...entry });
    return res.json({ found: false });
  }
  // 全件：配列形式で返す（名前付き）
  const list = Object.entries(reg).map(([n, v]) => ({ name: n, ...v }));
  list.sort((a, b) => a.name.localeCompare(b.name, 'ja'));
  res.json(list);
});

// ── スタッフ通知 API ─────────────────────────
app.post('/api/notify/shortage', async (req, res) => {
  const { message, staff } = req.body;
  if (!Array.isArray(staff) || staff.length === 0) {
    return res.status(400).json({ error: 'staff array required' });
  }

  const results = [];

  for (const s of staff) {
    // ── メール送信 ──
    if (s.email) {
      if (!emailTransporter) {
        results.push({ name: s.name, method: 'email', ok: false, error: 'メール未設定 (.envにEMAIL_USER/EMAIL_PASSを追加)' });
      } else {
        try {
          await emailTransporter.sendMail({
            from: `"RAKURAKU シフト管理" <${process.env.EMAIL_USER}>`,
            to: s.email,
            subject: '【RAKURAKU】シフトのご協力をお願いします',
            text: message,
            html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;max-width:520px;margin:0 auto;padding:24px;">
              <div style="background:#4F46E5;border-radius:12px 12px 0 0;padding:20px 24px;">
                <h2 style="color:#fff;margin:0;font-size:18px;">🍺 RAKURAKU</h2>
                <p style="color:#C7D2FE;margin:4px 0 0;font-size:13px;">シフト管理システム</p>
              </div>
              <div style="background:#fff;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
                <pre style="font-family:inherit;white-space:pre-wrap;font-size:14px;line-height:1.8;color:#0F172A;margin:0;">${message}</pre>
                <hr style="border:none;border-top:1px solid #E2E8F0;margin:20px 0;">
                <p style="font-size:12px;color:#64748B;margin:0;">このメールはRAKURAKUシフト管理システムから自動送信されています。</p>
              </div>
            </div>`,
          });
          results.push({ name: s.name, method: 'email', ok: true });
        } catch(e) {
          results.push({ name: s.name, method: 'email', ok: false, error: e.message });
        }
      }
    }

  }

  console.log(`[notify] ${results.filter(r=>r.ok).length}/${results.length} 件送信完了`);
  res.json({ ok: true, results });
});

// ── Stripe 決済 API ──────────────────────────
app.post('/api/checkout/create', async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in .env' });

  const { tableNo, orders } = req.body;
  if (!tableNo || !orders?.length) return res.status(400).json({ error: 'tableNo and orders required' });

  const total = orders.reduce((s, o) => s + o.price, 0);
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: orders.map(o => ({
        price_data: {
          currency: 'jpy',
          product_data: {
            name: `${o.emoji || ''} ${o.drinkName || o.drinkId}`.trim(),
          },
          unit_amount: o.price,   // JPY is zero-decimal
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: `${baseUrl}/payment-success.html?session_id={CHECKOUT_SESSION_ID}&table=${tableNo}`,
      cancel_url:  `${baseUrl}/checkout.html?session={CHECKOUT_SESSION_ID}&cancelled=1`,
      metadata: { tableNo: String(tableNo) },
      locale: 'ja',
    });

    checkoutSessions.set(session.id, {
      tableNo,
      orders,
      total,
      stripeUrl: session.url,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    io.emit('payment_requested', { tableNo, sessionId: session.id, total });
    res.json({ sessionId: session.id, stripeUrl: session.url, total });
  } catch (e) {
    console.error('[stripe create]', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/checkout/info/:sessionId', (req, res) => {
  const data = checkoutSessions.get(req.params.sessionId);
  if (!data) return res.status(404).json({ error: 'Session not found' });
  res.json(data);
});

// ── 🩺 Stripe 環境変数 診断エンドポイント ────────────
/* ブラウザで /api/stripe/diagnose にアクセスすると、何が設定されてないか分かる
   キーの値そのものは伏字化して安全 */
app.get('/api/stripe/diagnose', (req, res) => {
  const mask = (v) => {
    if (!v) return null;
    if (v.length < 12) return '***短すぎ***';
    return v.slice(0, 8) + '...' + v.slice(-4);
  };
  const check = (name, val, expectedPrefix) => {
    if (!val) return { name, status: '❌ 未設定', value: null, issue: 'Railway Variables に追加してください' };
    if (val.startsWith('"') || val.endsWith('"') || val.startsWith("'") || val.endsWith("'")) {
      return { name, status: '⚠ 引用符あり', value: mask(val), issue: 'クオートを削除してください' };
    }
    if (val !== val.trim()) {
      return { name, status: '⚠ 前後にスペース', value: mask(val), issue: '前後のスペース/改行を削除' };
    }
    if (expectedPrefix && !val.startsWith(expectedPrefix)) {
      return { name, status: `⚠ プレフィックス違い`, value: mask(val), issue: `${expectedPrefix} で始まる値が必要 (現在: ${val.slice(0,8)}...)` };
    }
    return { name, status: '✅ OK', value: mask(val), issue: null };
  };

  const sk = process.env.STRIPE_SECRET_KEY || '';
  const isTest = sk.startsWith('sk_test_');
  const isLive = sk.startsWith('sk_live_');
  const isRestricted = sk.startsWith('rk_');
  const mode = isTest ? 'TEST' : isLive ? 'LIVE' : isRestricted ? 'RESTRICTED' : 'UNKNOWN';

  const diagnose = {
    timestamp: new Date().toISOString(),
    stripeMode: mode,
    stripeReady: !!stripe,
    variables: [
      check('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY, 'sk_'),
      check('STRIPE_PUBLISHABLE_KEY', process.env.STRIPE_PUBLISHABLE_KEY, 'pk_'),
      check('STRIPE_PRICE_ID_MONTHLY', process.env.STRIPE_PRICE_ID_MONTHLY, 'price_'),
      check('STRIPE_PRICE_ID_ANNUAL', process.env.STRIPE_PRICE_ID_ANNUAL, 'price_'),
      check('STRIPE_WEBHOOK_SECRET', process.env.STRIPE_WEBHOOK_SECRET, 'whsec_'),
      check('BASE_URL', process.env.BASE_URL, 'http'),
      check('EMAIL_USER', process.env.EMAIL_USER, null),
      check('EMAIL_PASS', process.env.EMAIL_PASS, null),
      check('LICENSE_SECRET', process.env.LICENSE_SECRET, null),
    ],
    advice: [],
  };

  if (!stripe) diagnose.advice.push('❌ STRIPE_SECRET_KEY が設定されていません → 決済不可');
  if (isRestricted) diagnose.advice.push('⚠ rk_ (制限付きキー) を使用中 → sk_ (標準キー) を推奨');
  if (isTest) diagnose.advice.push('⚠ テストモードです → 本番でカード課金したい場合 sk_live_ を使用');
  if (!process.env.STRIPE_PRICE_ID_MONTHLY && !process.env.STRIPE_PRICE_ID_ANNUAL) {
    diagnose.advice.push('❌ Price ID が両方未設定 → Stripe商品カタログで作成');
  }
  if (!process.env.BASE_URL) diagnose.advice.push('⚠ BASE_URL 未設定 → メール本文のリンクが壊れる');
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) diagnose.advice.push('⚠ メール認証情報未設定 → 歓迎メール送信されない');

  /* Stripe API への実接続テスト */
  if (stripe) {
    stripe.balance.retrieve().then(() => {
      diagnose.stripeConnectionTest = '✅ Stripe API 接続OK';
      res.json(diagnose);
    }).catch(err => {
      diagnose.stripeConnectionTest = '❌ ' + (err.message || err.code || 'Unknown error');
      diagnose.advice.push('❌ Stripe API 接続失敗: ' + err.message);
      res.json(diagnose);
    });
  } else {
    diagnose.stripeConnectionTest = '⏭ STRIPE_SECRET_KEY 未設定のためスキップ';
    res.json(diagnose);
  }
});

/* ════════════════════════════════════════════
 * 🩺 メール & Webhook 診断エンドポイント
 ════════════════════════════════════════════ */
app.get('/api/email/diagnose', async (req, res) => {
  const result = {
    timestamp: new Date().toISOString(),
    emailConfigured: !!emailTransporter,
    resendEnabled: !!RESEND_API_KEY,
    resendFrom: RESEND_API_KEY ? RESEND_FROM : null,
    smtpEnabled: !!_smtpTransporter,
    emailUser: process.env.EMAIL_USER ? process.env.EMAIL_USER.replace(/(.{3}).+(@.+)/, '$1***$2') : null,
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || '465',
    recentSubscriptions: [],
    advice: [],
  };

  if (!emailTransporter) {
    result.advice.push('❌ EMAIL_USER または EMAIL_PASS が未設定');
    return res.json(result);
  }

  /* 直近のサブスク作成履歴 */
  try {
    const subs = readJSON(SUBSCRIPTIONS_FILE, []);
    result.recentSubscriptions = subs.slice(-5).map(s => ({
      shopName: s.shopName,
      email: s.email ? s.email.replace(/(.{3}).+(@.+)/, '$1***$2') : null,
      shopId: s.shopId,
      status: s.status,
      createdAt: s.createdAt,
    }));
  } catch(e) {}

  /* SMTP 接続テスト */
  try {
    await emailTransporter.verify();
    result.smtpConnectionTest = '✅ SMTP 接続OK';
  } catch(e) {
    result.smtpConnectionTest = '❌ ' + e.message;
    if (e.message.includes('Invalid login')) {
      result.advice.push('❌ Gmail App Password が間違っています (16文字の半角英数字のみ)');
    }
    if (e.message.includes('Less secure')) {
      result.advice.push('❌ Gmail の「安全性の低いアプリ」アクセスが必要 → 代わりに App Password を使用');
    }
  }

  /* テストメール送信エンドポイント (GET ?send=true&to=test@example.com) */
  if (req.query.send === 'true' && req.query.to) {
    const to = req.query.to;
    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: '[RAKURAKU] 📧 メール送信テスト',
        html: `<h2>✅ メール送信成功</h2><p>このメールが届けば、RAKURAKU のメール送信機能は正常です。</p><p>送信時刻: ${new Date().toLocaleString('ja-JP')}</p>`,
      });
      result.testEmailSent = `✅ ${to} にテストメール送信成功`;
    } catch(e) {
      result.testEmailSent = `❌ 送信失敗: ${e.message}`;
    }
  } else {
    result.howToTest = `テストメール送信: /api/email/diagnose?send=true&to=あなたのメール`;
  }

  res.json(result);
});

/* Stripe Webhook 受信履歴を確認 */
app.get('/api/webhook/diagnose', (req, res) => {
  const result = {
    timestamp: new Date().toISOString(),
    webhookSecretConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
    webhookSecretLength: (process.env.STRIPE_WEBHOOK_SECRET || '').length,
    expectedEndpoint: (process.env.BASE_URL || 'https://rakuraku-shift-production.up.railway.app') + '/webhook/stripe',
    recentSubscriptions: [],
    advice: [],
  };
  try {
    const subs = readJSON(SUBSCRIPTIONS_FILE, []);
    result.totalSubscriptions = subs.length;
    result.recentSubscriptions = subs.slice(-3).map(s => ({
      shopName: s.shopName,
      shopId: s.shopId,
      status: s.status,
      createdAt: s.createdAt,
      hasShopId: !!s.shopId,
    }));
    if (subs.length === 0) {
      result.advice.push('⚠ サブスク作成履歴ゼロ — Webhook が一度も発火していない可能性');
      result.advice.push('💡 Stripe ダッシュボード → Webhooks → 該当エンドポイント → 「最近のイベント」で配信ログを確認');
    }
  } catch(e) {}

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    result.advice.push('❌ STRIPE_WEBHOOK_SECRET が未設定');
  } else if ((process.env.STRIPE_WEBHOOK_SECRET || '').length < 50) {
    result.advice.push('⚠ STRIPE_WEBHOOK_SECRET が短すぎる (正しくは whsec_ で始まる60文字以上)');
  }

  res.json(result);
});

/* ════════════════════════════════════════════
 * 🔁 歓迎メール再送 API (代表専用)
 * 過去の登録者にメール再送 + オンボーディング自動メール再スケジュール
 ════════════════════════════════════════════ */

/* 6桁ライセンスコード確認API (店舗ID指定で即取得) */
app.get('/api/admin/license-code/:shopId', (req, res) => {
  const shopId = req.params.shopId;
  if (!shopId) return res.status(400).json({ error: 'shopId 必須' });
  res.json({
    shopId,
    currentMonth: _currentMonthKey(),
    currentCode: generateMonthlyLicenseCode(shopId, _currentMonthKey()),
    nextMonth: _nextMonthKey(),
    nextCode: generateMonthlyLicenseCode(shopId, _nextMonthKey()),
  });
});

/* 全サブスク一覧 (再送先選択用) */
app.get('/api/admin/subscriptions', (req, res) => {
  try {
    const subs = readJSON(SUBSCRIPTIONS_FILE, []);
    res.json(subs.map((s, idx) => ({
      index: idx,
      shopName: s.shopName,
      shopId: s.shopId,
      ownerName: s.ownerName,
      email: s.email,
      phone: s.phone,
      licenseCode: s.licenseCode,
      status: s.status,
      createdAt: s.createdAt,
    })));
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

/* 歓迎メール再送 — GET 版 (ブラウザで開くだけで実行) */
app.get('/api/admin/resend-welcome', async (req, res) => {
  const shopId = req.query.shop || req.query.shopId;
  const email = req.query.email;
  if (!shopId && !email) {
    return res.status(400).send(`
      <html><body style="font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px;">
        <h2>🔁 歓迎メール再送</h2>
        <p>以下のいずれかの形式でアクセスしてください:</p>
        <ul>
          <li><a href="/api/admin/resend-welcome?shop=rose-usuy">/api/admin/resend-welcome?shop=rose-usuy</a></li>
          <li><a href="/api/admin/resend-welcome?shop=rose-vlii">/api/admin/resend-welcome?shop=rose-vlii</a></li>
          <li>または UI: <a href="/resend-welcome.html">/resend-welcome.html</a></li>
        </ul>
      </body></html>
    `);
  }
  try {
    const subs = readJSON(SUBSCRIPTIONS_FILE, []);
    const target = subs.find(s =>
      (shopId && s.shopId === shopId) ||
      (email && s.email === email)
    );
    if (!target) return res.status(404).send(`<h2>❌ 該当する登録が見つかりません</h2><p>shop: ${shopId || '-'}, email: ${email || '-'}</p><a href="/api/admin/subscriptions">登録者一覧を見る</a>`);
    if (!target.email) return res.status(400).send('<h2>❌ メールアドレス未登録</h2>');
    await sendLicenseEmail(target.email, target.shopName, target.licenseCode, target.shopId);
    if (typeof scheduleOnboardingEmails === 'function') {
      try { scheduleOnboardingEmails(target.email, target.shopName, target.ownerName, target.shopId); } catch(e) {}
    }
    console.log(`[resend-welcome-GET] ${target.shopName} (${target.email}) に再送完了`);
    res.send(`
      <html><body style="font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px;background:#ECFDF5;border:2px solid #10B981;border-radius:14px;">
        <h2 style="color:#047857;">✅ 歓迎メール再送 完了</h2>
        <p>📧 送信先: <strong>${target.email}</strong></p>
        <p>🏪 店舗: <strong>${target.shopName}</strong></p>
        <p>🆔 店舗ID: <code>${target.shopId}</code></p>
        <p>数秒以内にメールが届きます。届かない場合は迷惑メールフォルダを確認してください。</p>
        <p style="margin-top:20px;">
          <a href="/resend-welcome.html" style="background:#4F46E5;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;">← 他の登録者の再送画面へ</a>
        </p>
      </body></html>
    `);
  } catch(e) {
    console.error('[resend-welcome-GET]', e);
    res.status(500).send(`<h2>❌ エラー</h2><pre>${e.message}</pre>`);
  }
});

/* 歓迎メール再送 — POST 版 (resend-welcome.html UI用) */
app.post('/api/admin/resend-welcome', async (req, res) => {
  const { shopId, email } = req.body || {};
  try {
    const subs = readJSON(SUBSCRIPTIONS_FILE, []);
    /* shopId か email で検索 */
    const target = subs.find(s =>
      (shopId && s.shopId === shopId) ||
      (email && s.email === email)
    );
    if (!target) {
      return res.status(404).json({ error: '該当する登録が見つかりません', searched: { shopId, email } });
    }
    if (!target.email) {
      return res.status(400).json({ error: 'メールアドレスが登録されていません' });
    }
    /* 再送 */
    await sendLicenseEmail(target.email, target.shopName, target.licenseCode, target.shopId);
    /* オンボーディング自動メールも再スケジュール (今日から Day 1/3/7/14/30) */
    if (typeof scheduleOnboardingEmails === 'function') {
      try { scheduleOnboardingEmails(target.email, target.shopName, target.ownerName, target.shopId); }
      catch(e) { console.warn('[resend] onboarding schedule失敗:', e.message); }
    }
    console.log(`[resend-welcome] ${target.shopName} (${target.email}) に再送完了`);
    res.json({
      ok: true,
      message: '✅ 歓迎メールを再送しました + オンボーディング5通もスケジュール',
      sent: {
        to: target.email,
        shopName: target.shopName,
        shopId: target.shopId,
      },
    });
  } catch(e) {
    console.error('[resend-welcome]', e);
    res.status(500).json({ error: e.message });
  }
});

/* 全登録者に再送 (バッチ) */
app.post('/api/admin/resend-welcome-all', async (req, res) => {
  try {
    const subs = readJSON(SUBSCRIPTIONS_FILE, []);
    const targets = subs.filter(s => s.email);
    const results = [];
    for (const s of targets) {
      try {
        await sendLicenseEmail(s.email, s.shopName, s.licenseCode, s.shopId);
        results.push({ shopName: s.shopName, email: s.email, status: '✅' });
      } catch(e) {
        results.push({ shopName: s.shopName, email: s.email, status: '❌', error: e.message });
      }
    }
    res.json({
      ok: true,
      total: targets.length,
      success: results.filter(r => r.status === '✅').length,
      results,
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ── RAKURAKU サブスクリプション API ────────────
app.post('/api/subscribe/create', async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in .env' });

  const { shopName, ownerName, email, phone, plan } = req.body;
  if (!shopName || !email) {
    return res.status(400).json({ error: '店舗名とメールアドレスは必須です' });
  }

  const priceId = plan === 'annual'
    ? process.env.STRIPE_PRICE_ID_ANNUAL
    : process.env.STRIPE_PRICE_ID_MONTHLY;

  if (!priceId) {
    const envName = plan === 'annual' ? 'STRIPE_PRICE_ID_ANNUAL' : 'STRIPE_PRICE_ID_MONTHLY';
    return res.status(500).json({ error: `Stripe Price ID が未設定です (.env の ${envName} を設定してください)` });
  }

  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  const metadata = { shopName, ownerName: ownerName || '', phone: phone || '', plan };

  try {
    /* 💳 シンプル課金: 30日間無料トライアル → 通常 ¥4,990/月
       月額・年額とも 30日トライアル後そのまま課金。プロモコード入力は許可 */
    const sessionParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      subscription_data: {
        trial_period_days: 30,
        metadata,
      },
      metadata,
      success_url: `${baseUrl}/subscribe-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/?subscribe_cancelled=1`,
      locale: 'ja',
      billing_address_collection: 'auto',
    };
    sessionParams.allow_promotion_codes = true;
    const session = await stripe.checkout.sessions.create(sessionParams);

    res.json({ url: session.url, sessionId: session.id });
  } catch (e) {
    console.error('[stripe subscribe create]', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/subscribe/list', (req, res) => {
  // 管理用: 全契約一覧（本番では認証を追加）
  res.json(loadSubscriptions());
});

// ── ショップ別データ同期 API（クロスデバイス対応） ────────────
app.get('/api/shop/:shopId/snapshot', (req, res) => {
  res.json(loadShopData(req.params.shopId));
});

app.post('/api/shop/:shopId/data', rateLimit(300), (req, res) => {
  const { key, value } = req.body || {};
  if (!key || typeof key !== 'string') return res.status(400).json({ error: 'key required' });
  /* プロトタイプ汚染 / 異常に長いキー / 巨大値を拒否 (正常な同期データは余裕で通過) */
  if (_isUnsafeKey(key) || key.length > 128) return res.status(400).json({ error: 'invalid key' });
  try {
    if (value != null && JSON.stringify(value).length > 4 * 1024 * 1024) {
      return res.status(413).json({ error: 'value too large' });
    }
  } catch (e) { return res.status(400).json({ error: 'invalid value' }); }
  const data = setShopKey(req.params.shopId, key, value);
  const room = 'shop:' + _safeShopId(req.params.shopId);
  io.to(room).emit('shop_data_updated', {
    shopId: req.params.shopId,
    key,
    value,
    ts: data._updatedAt,
  });
  res.json({ ok: true, _updatedAt: data._updatedAt });
});

// ── 店舗メタ情報 API（shift.html が店舗名等を取得） ────────────
/* 店舗GPS位置をワンタップ登録 (attendance画面の現在地ボタンから呼ばれる) */
app.post('/api/shop/:shopId/gps-setup', (req, res) => {
  const shopId = req.params.shopId;
  const { latitude, longitude, allowedRadiusMeters } = req.body || {};
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return res.status(400).json({ error: 'latitude, longitude (number) 必須' });
  }
  /* admin shops に upsert */
  const data = loadAdminData();
  let shops = [];
  try {
    const raw = data['noru_admin_shops'];
    shops = typeof raw === 'string' ? JSON.parse(raw) : (raw || []);
  } catch(e) {}
  let target = shops.find(s => s.shopId === shopId);
  if (!target) {
    target = {
      shopId,
      name: shopId,
      shopName: shopId,
      fee: 4990,
      autoAdded: false,
      addedAt: new Date().toISOString(),
      source: 'gps-setup',
    };
    shops.push(target);
  }
  target.latitude = latitude;
  target.longitude = longitude;
  target.allowedRadiusMeters = allowedRadiusMeters || 200;
  target.gpsUpdatedAt = new Date().toISOString();
  setAdminKey('noru_admin_shops', JSON.stringify(shops));
  io.emit('admin_data_updated', { key: 'noru_admin_shops', value: JSON.stringify(shops), ts: Date.now() });
  console.log(`[gps-setup] ${shopId} → ${latitude}, ${longitude} (radius: ${allowedRadiusMeters || 200}m)`);
  res.json({ ok: true, shop: target });
});

app.get('/api/shop/:shopId/meta', (req, res) => {
  const meta = getShopMetaById(req.params.shopId);
  if (!meta) {
    return res.json({ shopId: req.params.shopId, name: req.params.shopId, _missing: true });
  }
  res.json(meta);
});

// ── 本社管理データ同期 API（noru-admin.html 用） ────────────
app.get('/api/admin/snapshot', (req, res) => {
  res.json(loadAdminData());
});

app.post('/api/admin/data', rateLimit(120), (req, res) => {
  const { key, value } = req.body || {};
  if (!key || typeof key !== 'string') return res.status(400).json({ error: 'key required' });
  if (_isUnsafeKey(key) || key.length > 128) return res.status(400).json({ error: 'invalid key' });
  try {
    if (value != null && JSON.stringify(value).length > 4 * 1024 * 1024) {
      return res.status(413).json({ error: 'value too large' });
    }
  } catch (e) { return res.status(400).json({ error: 'invalid value' }); }
  const data = setAdminKey(key, value);
  io.emit('admin_data_updated', { key, value, ts: data._updatedAt });
  res.json({ ok: true, _updatedAt: data._updatedAt });
});

// ── 出退勤 (GPS打刻) API ────────────────────────────────
app.post('/api/attendance/clock', (req, res) => {
  const { shopId, name, type, lat, lng, accuracy, distanceM, outsideAllowed, ts, faceImage } = req.body || {};
  if (!shopId || !name || !type) {
    return res.status(400).json({ error: 'shopId, name, type 必須' });
  }
  if (!['in', 'out', 'break_start', 'break_end'].includes(type)) {
    return res.status(400).json({ error: 'type は in/out/break_start/break_end のいずれか' });
  }
  const recId = 'a' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);

  /* 🆕 顔認証スナップショット — 打刻時の自撮りを保存 (なりすまし打刻の抑止)。
     カメラ不可/拒否でも打刻自体は通し faceCaptured:false で記録 (深夜店舗で締め出さない)。
     画像は /data/attendance-faces/ 配下 (static 遮断済み) に保存し、専用 API でのみ配信。 */
  let facePhoto = null, faceCaptured = false;
  if (typeof faceImage === 'string' && faceImage.startsWith('data:image/')) {
    try {
      const m = /^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/i.exec(faceImage);
      if (m) {
        const buf = Buffer.from(m[2], 'base64');
        if (buf.length > 0 && buf.length <= 2 * 1024 * 1024) {
          const ext = m[1].toLowerCase() === 'jpeg' ? 'jpg' : m[1].toLowerCase();
          const safeShop = _safeShopId(shopId) || 'default';
          const dir = path.join(ATTENDANCE_FACES_DIR, safeShop);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          const fname = `${recId}.${ext}`;
          fs.writeFileSync(path.join(dir, fname), buf);
          facePhoto = `/api/attendance/face/${encodeURIComponent(safeShop)}/${fname}`;
          faceCaptured = true;
        }
      }
    } catch (e) {
      console.warn('[attendance] 顔写真の保存に失敗:', e.message);
    }
  }

  const record = {
    id: recId,
    shopId,
    name: String(name).slice(0, 64),
    type,
    lat: typeof lat === 'number' ? lat : null,
    lng: typeof lng === 'number' ? lng : null,
    accuracy: typeof accuracy === 'number' ? accuracy : null,
    distanceM: typeof distanceM === 'number' ? distanceM : null,
    outsideAllowed: !!outsideAllowed,
    faceCaptured,
    facePhoto,
    ts: typeof ts === 'number' ? ts : Date.now(),
  };
  appendAttendance(shopId, record);
  const room = 'shop:' + _safeShopId(shopId);
  io.to(room).emit('attendance_updated', record);
  /* 不正打刻は管理者にも通知 */
  if (outsideAllowed) {
    console.log(`[attendance] ⚠ 範囲外打刻 — ${shopId} / ${name} / ${type} / ${distanceM}m`);
  }
  res.json({ ok: true, record });
});

/* 🆕 顔認証スナップショット配信 — 店長が打刻の本人確認に使用。
   ファイル名は推測困難な record id のため、URL を知る者のみ取得可 (既存 attendance API と同じ前提)。
   path.basename + ホワイトリスト正規表現 + 保存ルート確認で traversal を防止。 */
app.get('/api/attendance/face/:shopId/:file', (req, res) => {
  const safeShop = _safeShopId(req.params.shopId);
  const file = path.basename(req.params.file || '');
  if (!safeShop || !/^a[0-9]+_[a-z0-9]+\.(jpg|png|webp)$/i.test(file)) {
    return res.status(404).send('Not found');
  }
  const fp = path.join(ATTENDANCE_FACES_DIR, safeShop, file);
  if (!fp.startsWith(ATTENDANCE_FACES_DIR + path.sep) || !fs.existsSync(fp)) {
    return res.status(404).send('Not found');
  }
  res.setHeader('Cache-Control', 'private, max-age=86400');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.sendFile(fp);
});

app.get('/api/attendance/today', (req, res) => {
  const { shop, name } = req.query;
  if (!shop) return res.status(400).json({ error: 'shop 必須' });
  const ym = _monthKeyOf(Date.now());
  const today = _dayKeyOf(Date.now());
  const all = loadAttendance(shop, ym);
  let records = all.filter(r => _dayKeyOf(r.ts) === today);
  if (name) records = records.filter(r => r.name === name);
  records.sort((a, b) => a.ts - b.ts);
  res.json(records);
});

app.get('/api/attendance/month', (req, res) => {
  const { shop, month } = req.query;
  if (!shop) return res.status(400).json({ error: 'shop 必須' });
  const ym = month || _monthKeyOf(Date.now());
  res.json(loadAttendance(shop, ym));
});

/* ════════════════════════════════════════════
 * 🧹 勤怠データ清掃 (代表専用・ガード付き)
 *   誤って共有 'default' バケットに溜まった打刻や、実店舗に紛れたデモ名打刻を掃除する。
 *   - env ADMIN_CLEANUP_TOKEN 未設定なら無効(403)。token は ?token= か x-admin-token で照合。
 *   - confirm=1 が無ければドライラン(削除せず対象のみ報告)。
 *   - shop 省略時は 'default'。names=A,B か demoOnly=1 で対象を限定。
 *     実店舗バケットの全件削除は禁止(names か demoOnly 必須)。default のみ全件削除可。
 *   例: /api/admin/clean-attendance?token=XXX            → default を全件ドライラン
 *       /api/admin/clean-attendance?token=XXX&confirm=1  → default を全件削除
 *       /api/admin/clean-attendance?token=XXX&shop=foo&demoOnly=1&confirm=1 → 実店舗のデモ名のみ削除
 * ════════════════════════════════════════════ */
function _isDemoAttendanceName(n) {
  if (!n) return false;
  const DEMO = ['古関','はるか','おうすけ','じゅな','みなみ','松本ゆうき','いづみ','なつき','おとは','ののか','しゅうへい','あいり'];
  return DEMO.indexOf(n) >= 0 || /^スタッフ[A-Z]$/.test(n);
}
app.get('/api/admin/clean-attendance', (req, res) => {
  const token = process.env.ADMIN_CLEANUP_TOKEN;
  if (!token) return res.status(403).json({ ok: false, error: 'cleanup disabled (ADMIN_CLEANUP_TOKEN 未設定)' });
  const given = req.query.token || req.headers['x-admin-token'] || '';
  if (given !== token) return res.status(403).json({ ok: false, error: 'forbidden' });

  const shop = _safeShopId(req.query.shop) || 'default';
  const confirm = req.query.confirm === '1';
  const demoOnly = req.query.demoOnly === '1';
  const names = String(req.query.names || '').split(',').map(s => s.trim()).filter(Boolean);
  const wipeAll = !demoOnly && names.length === 0;
  if (wipeAll && shop !== 'default') {
    return res.status(400).json({ ok: false, error: '実店舗バケットの全件削除は不可。names= か demoOnly=1 を指定してください' });
  }

  let files = [];
  try {
    files = fs.readdirSync(ATTENDANCE_DIR).filter(f => f.startsWith(shop + '-') && f.endsWith('.json'));
  } catch(e) { files = []; }

  const report = [];
  let totalRemoved = 0;
  files.forEach(f => {
    const fp = path.join(ATTENDANCE_DIR, f);
    const arr = readJSON(fp, []);
    const before = arr.length;
    const kept = wipeAll ? [] : arr.filter(r => {
      const nm = r && r.name;
      const hit = (demoOnly && _isDemoAttendanceName(nm)) || (names.length > 0 && names.indexOf(nm) >= 0);
      return !hit;
    });
    const removed = before - kept.length;
    if (removed > 0) {
      report.push({ file: f, before, removed, after: kept.length });
      totalRemoved += removed;
      if (confirm) writeJSON(fp, kept);
    }
  });

  res.json({
    ok: true,
    dryRun: !confirm,
    shop, demoOnly, wipeAll, names,
    totalRemoved,
    files: report,
    note: confirm ? '削除を実行しました' : 'ドライラン: confirm=1 で実際に削除します',
  });
});

/* ════════════════════════════════════════════
 * 💬 店舗内メッセージ API (グループ + 1:1 DM)
 *   送信は HTTP POST、配信は socket.io ('message_new')。クライアントはポーリングも併用。
 * ════════════════════════════════════════════ */

/* 送信 — グループ or 1:1。送信後に同店舗ルームへ配信。 */
app.post('/api/messages/:shopId/send', (req, res) => {
  const shopId = req.params.shopId;
  const { sender, text, scope, to } = req.body || {};
  if (!shopId || !sender || !text) {
    return res.status(400).json({ error: 'shopId, sender, text 必須' });
  }
  const cleanText = String(text).slice(0, 2000).trim();
  if (!cleanText) return res.status(400).json({ error: 'text が空です' });
  const sc = scope === 'dm' ? 'dm' : 'group';
  if (sc === 'dm' && !to) return res.status(400).json({ error: 'DM は to 必須' });

  const senderName = String(sender).slice(0, 64);
  const toName = sc === 'dm' ? String(to).slice(0, 64) : null;
  const msg = {
    id: 'm' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    shopId,
    scope: sc,
    thread: sc === 'dm' ? _dmThreadId(senderName, toName) : 'group',
    sender: senderName,
    to: toName,
    text: cleanText,
    ts: Date.now(),
  };
  appendMessage(shopId, msg);
  io.to('shop:' + _safeShopId(shopId)).emit('message_new', msg);
  res.json({ ok: true, message: msg });
});

/* 取得 — グループ: ?scope=group / 1:1: ?scope=dm&me=A&with=B 。?since=ts で差分取得可。 */
app.get('/api/messages/:shopId', (req, res) => {
  const shopId = req.params.shopId;
  if (!shopId) return res.status(400).json({ error: 'shopId 必須' });
  const { scope, me, with: withName, since } = req.query;
  const limit = Math.min(parseInt(req.query.limit) || 200, 500);
  const all = loadMessages(shopId);
  let list;
  if (scope === 'dm') {
    if (!me || !withName) return res.status(400).json({ error: 'DM は me, with 必須' });
    const tid = _dmThreadId(me, withName);
    list = all.filter(m => m.scope === 'dm' && m.thread === tid);
  } else {
    list = all.filter(m => m.scope === 'group');
  }
  if (since) {
    const s = parseInt(since);
    if (!isNaN(s)) list = list.filter(m => m.ts > s);
  }
  list.sort((a, b) => a.ts - b.ts);
  if (list.length > limit) list = list.slice(list.length - limit);
  res.json(list);
});

/* スレッド一覧 — グループ + 自分が参加している DM (相手名・最終メッセージ付き)。 */
app.get('/api/messages/:shopId/threads', (req, res) => {
  const shopId = req.params.shopId;
  const me = req.query.me;
  if (!shopId || !me) return res.status(400).json({ error: 'shopId, me 必須' });
  const all = loadMessages(shopId);

  const groupMsgs = all.filter(m => m.scope === 'group');
  const lastGroup = groupMsgs.length ? groupMsgs[groupMsgs.length - 1] : null;
  const threads = [{
    id: 'group', scope: 'group', title: null, with: null,
    lastText: lastGroup ? lastGroup.text : '', lastTs: lastGroup ? lastGroup.ts : 0,
    lastSender: lastGroup ? lastGroup.sender : '',
  }];

  /* 自分が関与する DM をスレッド単位で集約 */
  const dmMap = new Map();
  for (const m of all) {
    if (m.scope !== 'dm') continue;
    if (m.sender !== me && m.to !== me) continue;
    const other = m.sender === me ? m.to : m.sender;
    const cur = dmMap.get(m.thread);
    if (!cur || m.ts > cur.lastTs) {
      dmMap.set(m.thread, { other, lastText: m.text, lastTs: m.ts, lastSender: m.sender });
    }
  }
  for (const [tid, info] of dmMap.entries()) {
    threads.push({
      id: tid, scope: 'dm', title: info.other, with: info.other,
      lastText: info.lastText, lastTs: info.lastTs, lastSender: info.lastSender,
    });
  }
  threads.sort((a, b) => {
    if (a.scope === 'group') return -1;
    if (b.scope === 'group') return 1;
    return b.lastTs - a.lastTs;
  });
  res.json(threads);
});

// ── デモ予約 API ────────────────────────────────
app.post('/api/demo-reservation', async (req, res) => {
  const data = req.body || {};
  const record = {
    id: 'demo' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    ...data,
    createdAt: Date.now(),
  };
  /* ファイルに追記保存 */
  const file = path.join(DATA_DIR, 'demo-reservations.json');
  const all = readJSON(file, []);
  all.push(record);
  writeJSON(file, all);
  console.log(`[demo-reservation] ${data.shop} / ${data.name} / ${data.email}`);
  /* 管理者にメール通知 (emailTransporter があれば) */
  if (emailTransporter && process.env.EMAIL_USER) {
    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `[RAKURAKU] 🎁 デモ予約 — ${data.shop}`,
        html: `<h2>デモ予約</h2>
          <p><strong>店舗:</strong> ${data.shop}<br>
          <strong>担当者:</strong> ${data.name}<br>
          <strong>メール:</strong> ${data.email}<br>
          <strong>電話:</strong> ${data.phone || '-'}<br>
          <strong>第1希望:</strong> ${data.time1}<br>
          <strong>第2希望:</strong> ${data.time2 || '-'}<br>
          <strong>業態:</strong> ${data.type || '-'}<br>
          <strong>備考:</strong> ${data.note || '-'}</p>`,
      });
    } catch(e) { console.warn('[demo-reservation email]', e.message); }
  }
  res.json({ ok: true, record });
});

app.get('/api/demo-reservation', (req, res) => {
  const file = path.join(DATA_DIR, 'demo-reservations.json');
  res.json(readJSON(file, []));
});

// ── 紹介プログラム API ────────────────────────────────
/* ════════════════════════════════════════════
 * 無料期間上限ポリシー: 1店舗あたり最大 2ヶ月 (60日)
 * 14日トライアル + 紹介ボーナス + パートナー特典 を合算してこの上限を超えない
 ════════════════════════════════════════════ */
const MAX_FREE_DAYS = 60;

function calcGrantedFreeDays(shopId) {
  /* 当該店舗が既に受け取った無料日数の合計を返す */
  if (!shopId) return 0;
  const refFile = path.join(DATA_DIR, 'referrals.json');
  const refs = readJSON(refFile, []);
  let total = 14; /* 初回 14日トライアル分は常に算入 */
  refs.forEach(r => {
    if (r.referrer?.shopId === shopId || r.referrer?.shop === shopId) total += 30; /* 紹介者特典 */
    if (r.target?.shopId === shopId || r.target?.shop === shopId) total += 30; /* 被紹介者特典 */
  });
  /* パートナー特典・キャンペーン特典は別途記録 */
  const promoFile = path.join(DATA_DIR, 'promos.json');
  const promos = readJSON(promoFile, []);
  promos.filter(p => p.shopId === shopId).forEach(p => total += (p.days || 0));
  return total;
}

app.get('/api/free-days/:shopId', (req, res) => {
  const days = calcGrantedFreeDays(req.params.shopId);
  res.json({ shopId: req.params.shopId, grantedDays: days, maxAllowed: MAX_FREE_DAYS, remaining: Math.max(0, MAX_FREE_DAYS - days) });
});

app.post('/api/referral', async (req, res) => {
  const data = req.body || {};

  /* 上限チェック (紹介元・紹介先 双方を事前検証) */
  const referrerShop = data.referrer?.shopId || data.referrer?.shop;
  const targetShop = data.target?.shopId || data.target?.shop;
  const referrerDays = calcGrantedFreeDays(referrerShop);
  const targetDays = calcGrantedFreeDays(targetShop);

  if (referrerDays + 30 > MAX_FREE_DAYS) {
    return res.status(400).json({
      error: '紹介者の無料期間上限超過',
      detail: `紹介者「${referrerShop}」は既に ${referrerDays}日 の無料期間を受給。上限 ${MAX_FREE_DAYS}日 を超えるため適用不可。`,
      grantedDays: referrerDays,
      maxAllowed: MAX_FREE_DAYS,
    });
  }
  if (targetDays + 30 > MAX_FREE_DAYS) {
    return res.status(400).json({
      error: '紹介先の無料期間上限超過',
      detail: `紹介先「${targetShop}」は既に ${targetDays}日 の無料期間を受給。上限 ${MAX_FREE_DAYS}日 を超えるため適用不可。`,
      grantedDays: targetDays,
      maxAllowed: MAX_FREE_DAYS,
    });
  }

  const record = {
    id: 'ref' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    ...data,
    status: 'pending',
    bonusDaysReferrer: 30,
    bonusDaysTarget: 30,
    createdAt: Date.now(),
  };
  const file = path.join(DATA_DIR, 'referrals.json');
  const all = readJSON(file, []);
  all.push(record);
  writeJSON(file, all);
  console.log(`[referral] ${data.referrer?.shop} → ${data.target?.shop} (${data.code}) — 紹介者既受 ${referrerDays}d / 被紹介者既受 ${targetDays}d`);
  if (emailTransporter && process.env.EMAIL_USER) {
    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `[RAKURAKU] 🤝 紹介申請 — ${data.target?.shop} (${data.code})`,
        html: `<h2>紹介申請</h2>
          <p><strong>紹介者:</strong> ${data.referrer?.name} (${data.referrer?.shop})<br>
          メール: ${data.referrer?.email}</p>
          <p><strong>紹介先:</strong> ${data.target?.name} (${data.target?.shop})<br>
          メール: ${data.target?.email || '-'}<br>
          電話: ${data.target?.phone || '-'}</p>
          <p><strong>紹介コード:</strong> ${data.code}</p>
          <p><strong>備考:</strong> ${data.note || '-'}</p>`,
      });
    } catch(e) { console.warn('[referral email]', e.message); }
  }
  res.json({ ok: true, record });
});

app.get('/api/referral', (req, res) => {
  const file = path.join(DATA_DIR, 'referrals.json');
  res.json(readJSON(file, []));
});

/* パートナー・キャンペーン特典追加 (管理者用)
   POST /api/promo { shopId, days, reason } */
app.post('/api/promo', (req, res) => {
  const { shopId, days, reason } = req.body || {};
  if (!shopId || !days) return res.status(400).json({ error: 'shopId, days 必須' });
  const granted = calcGrantedFreeDays(shopId);
  if (granted + days > MAX_FREE_DAYS) {
    return res.status(400).json({
      error: '無料期間上限超過',
      detail: `店舗「${shopId}」は既に ${granted}日 受給済み。+${days}日 を追加すると上限 ${MAX_FREE_DAYS}日 を超えるため拒否`,
      grantedDays: granted,
      maxAllowed: MAX_FREE_DAYS,
      maxAddable: MAX_FREE_DAYS - granted,
    });
  }
  const file = path.join(DATA_DIR, 'promos.json');
  const all = readJSON(file, []);
  all.push({ id: 'pr' + Date.now(), shopId, days, reason: reason || '', grantedAt: Date.now() });
  writeJSON(file, all);
  console.log(`[promo] ${shopId} +${days}日 (${reason || '理由なし'})`);
  res.json({ ok: true, totalGranted: granted + days, remaining: MAX_FREE_DAYS - (granted + days) });
});

// ── マスタデータ同期 API（ポジション・時給・休憩ルール）─────────────
app.post('/api/master-data/:shopId', (req, res) => {
  const { shopId } = req.params;
  if (!shopId) return res.status(400).json({ error: 'shopId 必須' });
  const safeId = _safeShopId(shopId);
  const file = path.join(DATA_DIR, `master-data-${safeId}.json`);
  try {
    writeJSON(file, { ...req.body, updatedAt: Date.now() });
    const room = 'shop:' + safeId;
    io.to(room).emit('master_data_updated', { shopId, data: req.body });
    res.json({ ok: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/master-data/:shopId', (req, res) => {
  const { shopId } = req.params;
  const safeId = _safeShopId(shopId);
  const file = path.join(DATA_DIR, `master-data-${safeId}.json`);
  res.json(readJSON(file, null));
});

// ── 汎用メール送信 API (シフト確定通知など)────────────
app.post('/api/send-mail', async (req, res) => {
  const { to, subject, text, html, shopId } = req.body || {};
  if (!to || !subject || (!text && !html)) {
    return res.status(400).json({ error: 'to, subject, text/html 必須' });
  }
  if (!emailTransporter) {
    return res.status(503).json({ error: 'EMAIL_USER 未設定 — メール送信不可' });
  }
  const recipients = Array.isArray(to) ? to : [to];
  let sent = 0, failed = [];
  for (const r of recipients) {
    try {
      await emailTransporter.sendMail({
        from: process.env.EMAIL_USER,
        to: r,
        subject,
        text: text || undefined,
        html: html || undefined,
      });
      sent++;
    } catch(e) { failed.push({ to: r, error: e.message }); }
  }
  console.log(`[send-mail] ${shopId || '?'} — ${sent}/${recipients.length} 送信成功`);
  res.json({ ok: true, sent, failed });
});

// ── お知らせ API ────────────────────
app.post('/api/announcements', (req, res) => {
  const data = req.body || {};
  if (!data.title || !data.body) return res.status(400).json({ error: 'title, body 必須' });
  const safeId = _safeShopId(data.shopId || 'default');
  const file = path.join(DATA_DIR, `announcements-${safeId}.json`);
  const all = readJSON(file, []);
  all.unshift({ ...data, savedAt: Date.now() });
  writeJSON(file, all.slice(0, 200)); // 200件まで保持
  const room = 'shop:' + safeId;
  io.to(room).emit('announcement_published', data);
  console.log(`[announcements] ${safeId} — ${data.title}`);
  res.json({ ok: true });
});

app.get('/api/announcements/:shopId', (req, res) => {
  const safeId = _safeShopId(req.params.shopId);
  const file = path.join(DATA_DIR, `announcements-${safeId}.json`);
  const all = readJSON(file, []);
  /* 有効なお知らせのみ返す (toが過ぎていない) */
  const now = new Date().toISOString().slice(0,10);
  res.json(all.filter(a => !a.to || a.to >= now));
});

app.delete('/api/announcements/:id', (req, res) => {
  const { id } = req.params;
  /* 全店舗ファイルから探して削除 */
  const files = require('fs').readdirSync(DATA_DIR).filter(f => f.startsWith('announcements-') && f.endsWith('.json'));
  let removed = 0;
  files.forEach(fn => {
    const fp = path.join(DATA_DIR, fn);
    const all = readJSON(fp, []);
    const filtered = all.filter(a => a.id !== id);
    if (filtered.length !== all.length) {
      writeJSON(fp, filtered);
      removed++;
    }
  });
  res.json({ ok: true, removed });
});

// ── 売上データ API ────────────────────
app.post('/api/sales/daily', (req, res) => {
  const { date, sales, customers, cost, memo, shopId } = req.body || {};
  if (!date || sales === undefined) return res.status(400).json({ error: 'date, sales 必須' });
  const safeId = _safeShopId(shopId || 'default');
  const file = path.join(DATA_DIR, `sales-${safeId}.json`);
  const all = readJSON(file, {});
  all[date] = { date, sales, customers, cost, memo, savedAt: Date.now() };
  writeJSON(file, all);
  const room = 'shop:' + safeId;
  io.to(room).emit('sales_updated', { shopId, date, sales });
  res.json({ ok: true });
});

app.get('/api/sales/daily/:shopId', (req, res) => {
  const safeId = _safeShopId(req.params.shopId);
  const file = path.join(DATA_DIR, `sales-${safeId}.json`);
  res.json(readJSON(file, {}));
});

// ── POS 連携 API (Square / スマレジ etc) ────────────
app.post('/api/pos/connect', (req, res) => {
  const { provider, token, shopId } = req.body || {};
  if (!provider || !token) return res.status(400).json({ error: 'provider, token 必須' });
  const safeId = _safeShopId(shopId || 'default');
  const file = path.join(DATA_DIR, `pos-${safeId}.json`);
  const configs = readJSON(file, {});
  configs[provider] = { token, connectedAt: Date.now(), provider };
  writeJSON(file, configs);
  console.log(`[pos/connect] ${safeId} / ${provider}`);
  res.json({ ok: true });
});

// ── LINE 連携APIは廃止 (2026-06-11) — 通知はメールに一本化 ──

// ── 本部 集計 API（複数店舗横断 KPI）─────────────────
app.get('/api/hq/summary', (req, res) => {
  try {
    const adminFile = path.join(DATA_DIR, 'admin-data.json');
    const adminData = readJSON(adminFile, { shops: [] });
    const shops = adminData.shops || [];

    // 各店舗の最新スナップショットを取得
    const enriched = shops.map(s => {
      const safeId = _safeShopId(s.id || s.shopId || s.name);
      const snapFile = path.join(DATA_DIR, `snapshot-${safeId}.json`);
      const snap = readJSON(snapFile, null);
      const masterFile = path.join(DATA_DIR, `master-data-${safeId}.json`);
      const master = readJSON(masterFile, null);
      return {
        ...s,
        staffCount: snap?.staffs?.length || 0,
        monthSales: snap?.monthSales || 0,
        laborCost: snap?.laborCost || 0,
        lastActive: snap?.updatedAt || s.lastActive,
        hasMasterData: !!master,
      };
    });

    // KPI 集計
    const totals = enriched.reduce((acc, s) => {
      acc.staffs += s.staffCount || 0;
      acc.sales += s.monthSales || 0;
      acc.laborCost += s.laborCost || 0;
      if (s.subscriptionStatus === 'active' || s.billingStatus === 'paid') acc.paid++;
      if (s.subscriptionStatus === 'trialing') acc.trial++;
      if (s.subscriptionStatus === 'past_due' || s.billingStatus === 'unpaid') acc.unpaid++;
      return acc;
    }, { staffs: 0, sales: 0, laborCost: 0, paid: 0, trial: 0, unpaid: 0 });

    res.json({
      ok: true,
      shopCount: enriched.length,
      totals,
      mrr: totals.paid * 4990,
      arr: totals.paid * 4990 * 12,
      shops: enriched,
    });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// ── 休み変更届 API ────────────────────────────────
app.post('/api/change-request', (req, res) => {
  const { shopId, name, date, reason, note, type } = req.body || {};
  if (!shopId || !name || !date) {
    return res.status(400).json({ error: 'shopId, name, date 必須' });
  }
  const reqRecord = {
    id: 'cr' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    shopId,
    name: String(name).slice(0, 64),
    date,
    reason: reason || '',
    note: note || '',
    type: type || 'absence',
    status: 'pending',
    createdAt: Date.now(),
  };
  appendChangeReq(shopId, reqRecord);
  const room = 'shop:' + _safeShopId(shopId);
  io.to(room).emit('change_request_updated', { shopId, action: 'created', request: reqRecord });
  console.log(`[change-request] 新規申請 — ${shopId} / ${name} / ${date} / ${reason}`);
  res.json({ ok: true, request: reqRecord });
});

app.get('/api/change-request', (req, res) => {
  const { shop, status, name } = req.query;
  if (!shop) return res.status(400).json({ error: 'shop 必須' });
  let all = loadChangeReqs(shop);
  if (status) all = all.filter(r => r.status === status);
  if (name) all = all.filter(r => r.name === name);
  all.sort((a, b) => b.createdAt - a.createdAt);
  res.json(all);
});

app.put('/api/change-request/:id', (req, res) => {
  const { shopId, status, decidedBy } = req.body || {};
  if (!shopId || !status) return res.status(400).json({ error: 'shopId, status 必須' });
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'status は approved/rejected/pending' });
  }
  const updated = updateChangeReqStatus(shopId, req.params.id, status, decidedBy);
  if (!updated) return res.status(404).json({ error: '申請が見つかりません' });
  const room = 'shop:' + _safeShopId(shopId);
  io.to(room).emit('change_request_updated', { shopId, action: status, request: updated });
  res.json({ ok: true, request: updated });
});

// ── 在庫 API ────────────────────────────────
app.get('/api/stock', (req, res) => {
  res.json(loadStock());
});

app.post('/api/stock', (req, res) => {
  const levels = req.body;
  saveStock(levels);
  engine.setStock(levels);
  io.emit('price_update', engine.getState());
  res.json({ ok: true });
});

// ── SOCKET.IO ─────────────────────────────
io.on('connection', (socket) => {
  console.log(`[connect] ${socket.id}`);

  // 接続直後に現在の状態を送信
  socket.emit('price_update', engine.getState());
  const cfg = loadConfig();
  if (cfg) socket.emit('config_loaded', cfg);

  // ── ショップ別ルーム参加（シフトクロスデバイス同期用） ──
  socket.on('shop_join', ({ shopId }) => {
    const safeId = _safeShopId(shopId);
    if (!safeId) return;
    socket.join('shop:' + safeId);
    console.log(`[shop_join] ${socket.id} → shop:${safeId}`);
  });

  // 注文
  socket.on('order', ({ drinkId }) => {
    const state = engine.recordOrder(drinkId);
    if (!state) return;
    const drink = state.drinks.find(d => d.id === drinkId);
    appendOrder(drinkId, drink?.price);
    engine.decrementStock(drinkId);
    const stock = loadStock();
    if (stock[drinkId] != null) { stock[drinkId] = Math.max(0, stock[drinkId] - 1); saveStock(stock); }
    io.emit('price_update', engine.getState());
  });

  // クラッシュ
  socket.on('crash', () => {
    const state = engine.triggerCrash();
    io.emit('price_update', state);
    io.emit('crash_event', {});
  });

  // リセット
  socket.on('reset', () => {
    const state = engine.resetPrices();
    io.emit('price_update', state);
  });

  // 設定更新（管理者画面から）
  socket.on('config_update', (cfg) => {
    saveConfig(cfg);
    engine.applyConfig(cfg);
    io.emit('config_updated', { config: cfg });
  });

  // 営業開閉
  socket.on('market_status', ({ isOpen }) => {
    io.emit('market_status', { isOpen });
  });

  // プレイヤー注文（お客様スマホから）
  socket.on('player_order', (entry) => {
    appendRanking(entry);
    io.broadcast.emit('player_order', entry);
  });

  socket.on('disconnect', () => {
    console.log(`[disconnect] ${socket.id}`);
  });
});

// 10秒ごとに自然減衰をブロードキャスト
setInterval(() => {
  io.emit('price_update', engine.getState());
}, 10000);

// ══════════════════════════════════════════
//  SURVEY API
// ══════════════════════════════════════════

// アンケート送信
app.post('/api/survey/submit', (req, res) => {
  const { shopId, shopName, respondent, ratings, comment, recommend } = req.body;
  if (!shopId || !ratings) return res.status(400).json({ error: 'shopId and ratings required' });
  const entry = {
    shopId, shopName: shopName || shopId,
    respondent: respondent || {},
    ratings, comment: comment || '', recommend: recommend || null, // 'yes'/'maybe'/'no'/null
    submittedAt: new Date().toISOString(),
  };
  appendSurvey(entry);
  res.json({ ok: true });
});

// 全店舗のアンケート結果取得（集計済み）
app.get('/api/survey/results', (req, res) => {
  const surveys = loadSurveys();
  const { shopId } = req.query;
  const filtered = shopId ? surveys.filter(s => s.shopId === shopId) : surveys;

  if (filtered.length === 0) return res.json({ count: 0, shops: {} });

  // 店舗ごとに集計
  const shops = {};
  filtered.forEach(s => {
    if (!shops[s.shopId]) {
      shops[s.shopId] = {
        shopId: s.shopId, shopName: s.shopName,
        count: 0, ratings: { overall:0, atmosphere:0, management:0, salary:0, schedule:0, growth:0 },
        demographics: { age: {}, gender: {}, tenure: {} },
        comments: [], recommends: 0,
      };
    }
    const shop = shops[s.shopId];
    shop.count++;
    Object.keys(s.ratings).forEach(k => { shop.ratings[k] = (shop.ratings[k] || 0) + (s.ratings[k] || 0); });
    if (s.recommend === true || s.recommend === 'yes') shop.recommends++;
    if (s.comment) shop.comments.push({ text: s.comment, date: s.submittedAt.slice(0,10) });

    // 統計
    const ag = s.respondent?.ageGroup || 'unknown';
    shop.demographics.age[ag] = (shop.demographics.age[ag] || 0) + 1;
    const gn = s.respondent?.gender || 'unknown';
    shop.demographics.gender[gn] = (shop.demographics.gender[gn] || 0) + 1;
    const tn = s.respondent?.tenure || 'unknown';
    shop.demographics.tenure[tn] = (shop.demographics.tenure[tn] || 0) + 1;
  });

  // 平均を計算
  Object.values(shops).forEach(shop => {
    Object.keys(shop.ratings).forEach(k => {
      shop.ratings[k] = Math.round((shop.ratings[k] / shop.count) * 10) / 10;
    });
    // 最新20件コメントのみ
    shop.comments = shop.comments.slice(-20).reverse();
  });

  res.json({ count: filtered.length, shops });
});

// 店舗一覧（アンケートがある店舗）
app.get('/api/survey/shops', (req, res) => {
  const surveys = loadSurveys();
  const shopMap = {};
  surveys.forEach(s => {
    if (!shopMap[s.shopId]) shopMap[s.shopId] = { shopId: s.shopId, shopName: s.shopName, count: 0 };
    shopMap[s.shopId].count++;
  });
  res.json(Object.values(shopMap));
});

// アンケートメール送信（スタッフに定期送信）
app.post('/api/survey/send-invite', async (req, res) => {
  const { staff, shopId, shopName } = req.body;
  if (!staff || !Array.isArray(staff)) return res.status(400).json({ error: 'staff array required' });
  if (!emailTransporter) return res.status(503).json({ error: 'メール未設定' });

  const results = [];
  const surveyUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/worker-dashboard.html?survey=${shopId}`;

  for (const s of staff) {
    if (!s.email) continue;
    try {
      await emailTransporter.sendMail({
        from: `"RAKURAKU" <${process.env.EMAIL_USER}>`,
        to: s.email,
        subject: '【RAKURAKU】職場アンケートにご協力ください',
        text: `${s.name}さん\n\n匿名で職場の評価をお願いします。\n${surveyUrl}\n\nご協力ありがとうございます。`,
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
          <h2 style="color:#4F46E5;">📋 職場アンケート</h2>
          <p>${s.name}さん、いつもお疲れ様です。</p>
          <p>匿名で <strong>${shopName || 'RAKURAKU'}</strong> の職場評価にご協力ください。<br>所要時間：約2分</p>
          <a href="${surveyUrl}" style="display:inline-block;margin:20px 0;padding:14px 28px;background:#4F46E5;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;">アンケートに答える</a>
          <p style="color:#64748B;font-size:12px;">回答は完全匿名です。個人が特定されることはありません。</p>
        </div>`,
      });
      results.push({ name: s.name, ok: true });
    } catch (e) {
      results.push({ name: s.name, ok: false, error: e.message });
    }
  }
  res.json({ ok: true, results });
});

// ══════════════════════════════════════════
//  飲食店モバイルオーダー（QR注文 + スマホ会計）
// ══════════════════════════════════════════
const RESTAURANT_MENU_FILE   = path.join(DATA_DIR, 'restaurant-menu.json');
const RESTAURANT_ORDERS_FILE = path.join(DATA_DIR, 'restaurant-orders.json');
const MENU_IMG_DIR           = path.join(DATA_DIR, 'menu-images');
if (!fs.existsSync(MENU_IMG_DIR)) fs.mkdirSync(MENU_IMG_DIR, { recursive: true });

function loadRestaurantMenu() {
  return readJSON(RESTAURANT_MENU_FILE, {
    settings: { shopName: '店舗', taxRate: 0.1, taxIncluded: true, currency: 'JPY' },
    categories: [],
    items: [],
  });
}
function saveRestaurantMenu(m) { writeJSON(RESTAURANT_MENU_FILE, m); }

function loadRestaurantData() {
  return readJSON(RESTAURANT_ORDERS_FILE, { sessions: [], orders: [] });
}
function saveRestaurantData(d) { writeJSON(RESTAURANT_ORDERS_FILE, d); }

function genId(prefix) {
  return prefix + '_' + crypto.randomBytes(6).toString('hex');
}

function findOrCreateOpenSession(data, tableNo) {
  let s = data.sessions.find(x => x.tableNo === Number(tableNo) && x.status === 'open');
  if (!s) {
    s = {
      id: genId('ts'),
      tableNo: Number(tableNo),
      status: 'open',
      openedAt: new Date().toISOString(),
      closedAt: null,
      paymentMethod: null,
      paidAt: null,
      stripeSessionId: null,
      paidAmount: 0,
    };
    data.sessions.push(s);
  }
  return s;
}

function sessionOrders(data, sessionId) {
  return data.orders.filter(o => o.sessionId === sessionId);
}

function sessionTotal(data, sessionId) {
  return sessionOrders(data, sessionId).reduce((sum, o) => sum + o.subtotal, 0);
}

// ── メニュー ─────────────────────────────────
app.get('/api/restaurant/menu', (req, res) => {
  res.json(loadRestaurantMenu());
});

app.put('/api/restaurant/menu', (req, res) => {
  const m = req.body;
  if (!m || !Array.isArray(m.items) || !Array.isArray(m.categories)) {
    return res.status(400).json({ error: 'invalid menu' });
  }
  saveRestaurantMenu(m);
  io.emit('restaurant_menu_updated');
  res.json({ ok: true });
});

// ── 商品画像アップロード（data URL を受け取り data/menu-images/ に保存） ──
app.post('/api/restaurant/upload-image', (req, res) => {
  const { dataUrl } = req.body || {};
  if (!dataUrl) return res.status(400).json({ error: 'dataUrl required' });
  const m = /^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/i.exec(dataUrl);
  if (!m) return res.status(400).json({ error: '対応形式: jpg / png / webp' });
  const ext = m[1].toLowerCase() === 'jpeg' ? 'jpg' : m[1].toLowerCase();
  const buf = Buffer.from(m[2], 'base64');
  if (buf.length > 4 * 1024 * 1024) return res.status(413).json({ error: '画像は4MB以下にしてください' });
  const filename = `img_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;
  fs.writeFileSync(path.join(MENU_IMG_DIR, filename), buf);
  res.json({ url: `/data/menu-images/${filename}` });
});

// ── 商品画像削除（ファイルを物理削除） ──
app.post('/api/restaurant/delete-image', (req, res) => {
  const { url } = req.body || {};
  if (!url || !url.startsWith('/data/menu-images/')) {
    return res.status(400).json({ error: 'invalid url' });
  }
  const filename = path.basename(url);
  const fp = path.join(MENU_IMG_DIR, filename);
  try {
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── 注文 ────────────────────────────────────
// お客様：注文を投入
app.post('/api/restaurant/order', (req, res) => {
  const { tableNo, items } = req.body;
  if (!tableNo || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: 'tableNo and items required' });
  }

  const menu = loadRestaurantMenu();
  const enriched = [];
  for (const it of items) {
    const def = menu.items.find(m => m.id === it.itemId);
    if (!def || !def.available) {
      return res.status(400).json({ error: `商品が見つからない/取扱停止: ${it.itemId}` });
    }
    const qty = Math.max(1, Number(it.qty) || 1);
    enriched.push({
      itemId: def.id,
      name: def.name,
      emoji: def.emoji || '',
      price: def.price,
      qty,
      note: (it.note || '').slice(0, 80),
    });
  }
  const subtotal = enriched.reduce((s, x) => s + x.price * x.qty, 0);

  const data = loadRestaurantData();
  const session = findOrCreateOpenSession(data, tableNo);

  const order = {
    id: genId('ord'),
    sessionId: session.id,
    tableNo: session.tableNo,
    items: enriched,
    subtotal,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  data.orders.push(order);
  saveRestaurantData(data);

  io.emit('restaurant_new_order', { order, session });
  res.json({ ok: true, order, sessionTotal: sessionTotal(data, session.id) });
});

// 店舗側：注文一覧
app.get('/api/restaurant/orders', (req, res) => {
  const data = loadRestaurantData();
  const status = req.query.status;
  let orders = data.orders;
  if (status) orders = orders.filter(o => o.status === status);
  // 新しい順
  orders = orders.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({ orders, sessions: data.sessions });
});

// 店舗側：注文ステータス更新
app.put('/api/restaurant/order/:id/status', (req, res) => {
  const { status } = req.body;
  const valid = ['new', 'preparing', 'served', 'cancelled'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'invalid status' });

  const data = loadRestaurantData();
  const order = data.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'order not found' });
  order.status = status;
  order.updatedAt = new Date().toISOString();
  saveRestaurantData(data);
  io.emit('restaurant_order_updated', { order });
  res.json({ ok: true, order });
});

// テーブルセッション取得（お客様の「今までの注文」表示用）
app.get('/api/restaurant/table/:tableNo/session', (req, res) => {
  const data = loadRestaurantData();
  const tableNo = Number(req.params.tableNo);
  const clientId = req.query.clientId || '';

  // 1) open セッションがあればそれを返す（state: open）
  const openSession = data.sessions
    .filter(s => s.tableNo === tableNo && s.status === 'open')
    .sort((a, b) => b.openedAt.localeCompare(a.openedAt))[0];
  if (openSession) {
    const orders = sessionOrders(data, openSession.id);
    return res.json({
      session: openSession, orders,
      total: sessionTotal(data, openSession.id),
      state: 'open',
    });
  }

  // 2) 当日の最新 paid セッション → 自分か他人かで分岐
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const latestPaid = data.sessions
    .filter(s => s.tableNo === tableNo && s.status === 'paid' && s.paidAt && new Date(s.paidAt) >= todayStart)
    .sort((a, b) => b.paidAt.localeCompare(a.paidAt))[0];
  if (latestPaid) {
    const isMine = clientId && latestPaid.paidByClientId === clientId;
    if (isMine) {
      const orders = sessionOrders(data, latestPaid.id);
      return res.json({
        session: latestPaid, orders,
        total: sessionTotal(data, latestPaid.id),
        state: 'paid-by-me',
      });
    }
    // サプライズ保護：他人には注文履歴・金額を返さない
    return res.json({
      session: { id: latestPaid.id, tableNo: latestPaid.tableNo, status: 'paid', paidAt: latestPaid.paidAt },
      orders: [], total: 0,
      state: 'paid-by-other',
    });
  }

  res.json({ session: null, orders: [], total: 0, state: 'no-session' });
});

// ── 会計：Stripe Checkout（スマホ決済） ────────
app.post('/api/restaurant/checkout', async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Stripe未設定です' });
  const { sessionId, tableNo, clientId } = req.body;

  const data = loadRestaurantData();
  let session;
  if (sessionId) session = data.sessions.find(s => s.id === sessionId);
  else if (tableNo) session = data.sessions
    .filter(s => s.tableNo === Number(tableNo) && s.status === 'open')
    .sort((a, b) => b.openedAt.localeCompare(a.openedAt))[0];
  if (!session) return res.status(404).json({ error: 'セッションが見つかりません' });
  if (session.status === 'paid') return res.status(400).json({ error: '既に会計済みです' });

  const orders = sessionOrders(data, session.id);
  if (!orders.length) return res.status(400).json({ error: '注文がありません' });

  // 商品を line_items にフラット化
  const lineMap = new Map();
  for (const o of orders) {
    for (const it of o.items) {
      const key = `${it.itemId}|${it.price}`;
      const cur = lineMap.get(key) || { name: `${it.emoji} ${it.name}`.trim(), price: it.price, qty: 0 };
      cur.qty += it.qty;
      lineMap.set(key, cur);
    }
  }

  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  try {
    const checkout = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [...lineMap.values()].map(l => ({
        price_data: {
          currency: 'jpy',
          product_data: { name: l.name },
          unit_amount: l.price,
        },
        quantity: l.qty,
      })),
      mode: 'payment',
      success_url: `${baseUrl}/order.html?table=${session.tableNo}&paid=1`,
      cancel_url:  `${baseUrl}/order.html?table=${session.tableNo}&cancelled=1`,
      metadata: {
        type: 'restaurant',
        sessionId: session.id,
        tableNo: String(session.tableNo),
        clientId: clientId || '',
      },
      locale: 'ja',
    });

    session.stripeSessionId = checkout.id;
    // 楽観的に paidByClientId を仮設定（webhook で確定）
    if (clientId) session.paidByClientId = clientId;
    saveRestaurantData(data);

    io.emit('restaurant_payment_requested', { sessionId: session.id, tableNo: session.tableNo });
    res.json({ url: checkout.url, stripeSessionId: checkout.id });
  } catch (e) {
    console.error('[restaurant stripe]', e.message);
    res.status(500).json({ error: e.message });
  }
});

// 店舗側：現金会計（手動でセッションを paid に）
app.post('/api/restaurant/session/:id/cash-paid', (req, res) => {
  const { clientId } = req.body || {};
  const data = loadRestaurantData();
  const session = data.sessions.find(s => s.id === req.params.id);
  if (!session) return res.status(404).json({ error: 'session not found' });
  if (session.status === 'paid') return res.status(400).json({ error: '既に会計済みです' });

  const total = sessionTotal(data, session.id);
  session.status = 'paid';
  session.paymentMethod = 'cash';
  session.paidAt = new Date().toISOString();
  session.paidAmount = total;
  if (clientId) session.paidByClientId = clientId;
  saveRestaurantData(data);

  io.emit('restaurant_session_paid', { sessionId: session.id, tableNo: session.tableNo, total, method: 'cash' });
  res.json({ ok: true, session, total });
});

// 店舗側：テーブル番号別QRコード（PNG画像）を返す
app.get('/api/restaurant/table-qr/:tableNo', async (req, res) => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  const url = `${baseUrl}/order.html?table=${encodeURIComponent(req.params.tableNo)}`;
  try {
    const dataUrl = await QRCode.toDataURL(url, { width: 512, margin: 2 });
    res.json({ url, dataUrl });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Stripe Webhook 完了処理：飲食店モバイル会計
function handleRestaurantPaymentCompleted(checkout) {
  const sessionId = checkout.metadata?.sessionId;
  if (!sessionId) return;
  const data = loadRestaurantData();
  const session = data.sessions.find(s => s.id === sessionId);
  if (!session) {
    console.warn(`[restaurant] webhook: session not found ${sessionId}`);
    return;
  }
  session.status = 'paid';
  session.paymentMethod = 'stripe';
  session.paidAt = new Date().toISOString();
  session.paidAmount = checkout.amount_total;
  session.stripeSessionId = checkout.id;
  if (checkout.metadata?.clientId) session.paidByClientId = checkout.metadata.clientId;
  saveRestaurantData(data);

  io.emit('restaurant_session_paid', {
    sessionId: session.id,
    tableNo: session.tableNo,
    total: checkout.amount_total,
    method: 'stripe',
  });
  console.log(`[restaurant] 支払い完了 — ${session.tableNo}番卓 ¥${checkout.amount_total}`);
}

// ══════════════════════════════════════════
//  404 ハンドラ（全てのルート定義の後）
// ══════════════════════════════════════════
app.use(_404Handler);

// ══════════════════════════════════════════
//  START
// ══════════════════════════════════════════
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  const divider = '─'.repeat(50);
  console.log(`\n${divider}`);
  console.log(`  🍺  RAKURAKU サーバー起動`);
  console.log(`${divider}`);
  console.log(`  📺  TV表示ボード      http://localhost:${PORT}/demo.html`);
  console.log(`  📱  お客様スマホ      http://localhost:${PORT}/customer.html`);
  console.log(`  ⚙️   管理者画面        http://localhost:${PORT}/admin-settings.html`);
  console.log(`  💰  売上管理          http://localhost:${PORT}/sales.html`);
  console.log(`  🎰  ガチャ（客スマホ） http://localhost:${PORT}/gacha.html`);
  console.log(`  🍽️   テーブル管理      http://localhost:${PORT}/tables.html`);
  console.log(`  📋  スタッフハンディ  http://localhost:${PORT}/staff.html`);
  console.log(`  ⭐  職場評価ダッシュ  http://localhost:${PORT}/worker-dashboard.html`);
  console.log(`${divider}`);
  console.log(`  🍽️  飲食店モバイルオーダー`);
  console.log(`  📱  お客様注文（QR）   http://localhost:${PORT}/order.html?table=1`);
  console.log(`  👨‍🍳  キッチン受付      http://localhost:${PORT}/kitchen.html`);
  console.log(`  💴  会計レジ          http://localhost:${PORT}/pos.html`);
  console.log(`  📋  メニュー管理      http://localhost:${PORT}/menu-admin.html`);
  console.log(`  🔳  テーブルQR発行    http://localhost:${PORT}/table-qr.html`);
  console.log(`${divider}`);
  if (stripe) {
    console.log(`  💳  Stripe 決済       有効 (${process.env.STRIPE_SECRET_KEY?.slice(0,12)}...)`);
  } else {
    console.log(`  💳  Stripe 決済       未設定 (.envにSTRIPE_SECRET_KEYを追加)`);
  }
  console.log(`${divider}`);
  console.log(`  ローカルIP確認: ipconfig getifaddr en0`);
  console.log(`${divider}\n`);

  /* 🔒 セキュリティ設定の健全性チェック (未設定の重要 env を起動時に警告) */
  const _secWarn = [];
  if (!process.env.LICENSE_SECRET) _secWarn.push('LICENSE_SECRET 未設定 — 既定値が使われライセンスコードが推測可能');
  if (!process.env.ADMIN_CLEANUP_TOKEN) _secWarn.push('ADMIN_CLEANUP_TOKEN 未設定 — 管理用クリーンアップAPIは無効');
  if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_WEBHOOK_SECRET) _secWarn.push('STRIPE_WEBHOOK_SECRET 未設定 — Webhook 署名検証不可');
  if (_secWarn.length) {
    console.warn(`${divider}`);
    console.warn('  ⚠️  セキュリティ警告:');
    _secWarn.forEach(w => console.warn('     • ' + w));
    console.warn(`${divider}\n`);
  }
});
