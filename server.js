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

// ── Nodemailer (optional — requires EMAIL_USER in .env) ──
const nodemailer = process.env.EMAIL_USER ? require('nodemailer') : null;
const emailTransporter = nodemailer
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: (process.env.SMTP_PORT === '465'),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  : null;

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
const CHANGE_REQ_DIR     = path.join(DATA_DIR, 'change-requests');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(SHOPS_DIR)) fs.mkdirSync(SHOPS_DIR, { recursive: true });
if (!fs.existsSync(ATTENDANCE_DIR)) fs.mkdirSync(ATTENDANCE_DIR, { recursive: true });
if (!fs.existsSync(CHANGE_REQ_DIR)) fs.mkdirSync(CHANGE_REQ_DIR, { recursive: true });

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

async function sendLicenseEmail(to, shopName, licenseCode) {
  if (!emailTransporter) {
    console.warn('[email] EMAIL_USER 未設定 — ライセンスコードメール送信スキップ');
    return;
  }
  const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
  await emailTransporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: '[RAKURAKU] ご登録ありがとうございます — ライセンスコードのご案内',
    html: `
      <div style="font-family:'Helvetica Neue',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1E293B;">
        <h2 style="color:#4F46E5;margin:0 0 16px;">RAKURAKU へようこそ${shopName ? `（${shopName} 様）` : ''}</h2>
        <p>この度はご登録いただき、誠にありがとうございます。</p>
        <p><strong>14日間の無料トライアル</strong>が開始されました。期間中は一切料金が発生しません。</p>
        <div style="background:#EEF2FF;border:2px dashed #4F46E5;padding:20px;margin:24px 0;text-align:center;border-radius:12px;">
          <div style="font-size:12px;color:#6B7280;margin-bottom:8px;letter-spacing:.05em;">ライセンスコード</div>
          <div style="font-size:22px;font-weight:900;letter-spacing:.1em;color:#1E293B;font-family:monospace;">${licenseCode}</div>
        </div>
        <p>下記URLからログインしてご利用ください：</p>
        <p style="text-align:center;margin:24px 0;">
          <a href="${baseUrl}/shift.html" style="display:inline-block;background:#4F46E5;color:#fff;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;">RAKURAKU を開く →</a>
        </p>
        <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0;" />
        <p style="font-size:12px;color:#94A3B8;line-height:1.7;">
          ※ 14日後に月額¥9,800（税込）の自動課金が開始されます。<br>
          ※ 解約はいつでも可能、翌月以降のご請求は発生しません。<br>
          ※ ご不明な点は ${process.env.EMAIL_USER} / 📞 080-5168-3303 までお問い合わせください。<br>
          ※ 運営: RAKURAKU（代表 小泉 咲太）
        </p>
      </div>
    `,
  });
  console.log(`[email] ライセンスコードを ${to} に送信`);
}

async function handleSubscriptionStarted(session) {
  const meta = session.metadata || {};
  const shopName  = meta.shopName  || '';
  const ownerName = meta.ownerName || '';
  const phone     = meta.phone     || '';
  const email     = session.customer_email || (session.customer_details && session.customer_details.email) || '';

  const licenseCode = generateLicenseCode(email + shopName);

  saveSubscription({
    sessionId:      session.id,
    customerId:     session.customer,
    subscriptionId: session.subscription,
    shopName, ownerName, email, phone,
    licenseCode,
    status:    'trialing',
    createdAt: new Date().toISOString(),
  });

  console.log(`[stripe] サブスク開始 — ${shopName || '?'} (${email}) — code: ${licenseCode}`);

  if (email) {
    try { await sendLicenseEmail(email, shopName, licenseCode); }
    catch (e) { console.error('[email] 送信失敗:', e.message); }
  }
}

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
function setShopKey(shopId, key, value) {
  const data = loadShopData(shopId);
  data[key] = value;
  data._updatedAt = Date.now();
  saveShopData(shopId, data);
  return data;
}

/* ── 本社管理データ (noru-admin.html 用) ── */
function loadAdminData() { return readJSON(ADMIN_FILE, {}); }
function saveAdminData(data) { writeJSON(ADMIN_FILE, data); }
function setAdminKey(key, value) {
  const data = loadAdminData();
  data[key] = value;
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
    updateSubscriptionStatus(event.data.object.id, 'cancelled');
    console.log(`[stripe] サブスク解約 — ${event.data.object.id}`);
  }

  if (event.type === 'invoice.payment_failed') {
    console.log(`[stripe] 支払い失敗 — subscription: ${event.data.object.subscription}`);
  }

  res.json({ received: true });
});

app.use(express.json({ limit: '6mb' }));

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
            from: `"BAR EXCHANGE シフト管理" <${process.env.EMAIL_USER}>`,
            to: s.email,
            subject: '【BAR EXCHANGE】シフトのご協力をお願いします',
            text: message,
            html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif;max-width:520px;margin:0 auto;padding:24px;">
              <div style="background:#4F46E5;border-radius:12px 12px 0 0;padding:20px 24px;">
                <h2 style="color:#fff;margin:0;font-size:18px;">🍺 BAR EXCHANGE</h2>
                <p style="color:#C7D2FE;margin:4px 0 0;font-size:13px;">シフト管理システム</p>
              </div>
              <div style="background:#fff;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
                <pre style="font-family:inherit;white-space:pre-wrap;font-size:14px;line-height:1.8;color:#0F172A;margin:0;">${message}</pre>
                <hr style="border:none;border-top:1px solid #E2E8F0;margin:20px 0;">
                <p style="font-size:12px;color:#64748B;margin:0;">このメールはBAR EXCHANGEシフト管理システムから自動送信されています。</p>
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
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      subscription_data: {
        trial_period_days: 14,
        metadata,
      },
      metadata,
      success_url: `${baseUrl}/subscribe-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/?subscribe_cancelled=1`,
      locale: 'ja',
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

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

app.post('/api/shop/:shopId/data', (req, res) => {
  const { key, value } = req.body || {};
  if (!key) return res.status(400).json({ error: 'key required' });
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

app.post('/api/admin/data', (req, res) => {
  const { key, value } = req.body || {};
  if (!key) return res.status(400).json({ error: 'key required' });
  const data = setAdminKey(key, value);
  io.emit('admin_data_updated', { key, value, ts: data._updatedAt });
  res.json({ ok: true, _updatedAt: data._updatedAt });
});

// ── 出退勤 (GPS打刻) API ────────────────────────────────
app.post('/api/attendance/clock', (req, res) => {
  const { shopId, name, type, lat, lng, accuracy, distanceM, outsideAllowed, ts } = req.body || {};
  if (!shopId || !name || !type) {
    return res.status(400).json({ error: 'shopId, name, type 必須' });
  }
  if (!['in', 'out', 'break_start', 'break_end'].includes(type)) {
    return res.status(400).json({ error: 'type は in/out/break_start/break_end のいずれか' });
  }
  const record = {
    id: 'a' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    shopId,
    name: String(name).slice(0, 64),
    type,
    lat: typeof lat === 'number' ? lat : null,
    lng: typeof lng === 'number' ? lng : null,
    accuracy: typeof accuracy === 'number' ? accuracy : null,
    distanceM: typeof distanceM === 'number' ? distanceM : null,
    outsideAllowed: !!outsideAllowed,
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
app.post('/api/referral', async (req, res) => {
  const data = req.body || {};
  const record = {
    id: 'ref' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    ...data,
    status: 'pending',
    createdAt: Date.now(),
  };
  const file = path.join(DATA_DIR, 'referrals.json');
  const all = readJSON(file, []);
  all.push(record);
  writeJSON(file, all);
  console.log(`[referral] ${data.referrer?.shop} → ${data.target?.shop} (${data.code})`);
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
      mrr: totals.paid * 9800,
      arr: totals.paid * 9800 * 12,
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
        from: `"BAR EXCHANGE" <${process.env.EMAIL_USER}>`,
        to: s.email,
        subject: '【BAR EXCHANGE】職場アンケートにご協力ください',
        text: `${s.name}さん\n\n匿名で職場の評価をお願いします。\n${surveyUrl}\n\nご協力ありがとうございます。`,
        html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;">
          <h2 style="color:#4F46E5;">📋 職場アンケート</h2>
          <p>${s.name}さん、いつもお疲れ様です。</p>
          <p>匿名で <strong>${shopName || 'BAR EXCHANGE'}</strong> の職場評価にご協力ください。<br>所要時間：約2分</p>
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
  console.log(`  🍺  BAR EXCHANGE サーバー起動`);
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
});
