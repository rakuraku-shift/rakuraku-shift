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

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(SHOPS_DIR)) fs.mkdirSync(SHOPS_DIR, { recursive: true });

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
          ※ ご不明な点は ${process.env.EMAIL_USER} までお問い合わせください。
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

app.use(express.json());

// ルートディレクトリの全ファイルを配信（HTML, CSS, JS など）
app.use(express.static(path.join(__dirname)));
// public/ も引き続き配信
app.use(express.static(path.join(__dirname, 'public')));

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
  if (stripe) {
    console.log(`  💳  Stripe 決済       有効 (${process.env.STRIPE_SECRET_KEY?.slice(0,12)}...)`);
  } else {
    console.log(`  💳  Stripe 決済       未設定 (.envにSTRIPE_SECRET_KEYを追加)`);
  }
  console.log(`${divider}`);
  console.log(`  ローカルIP確認: ipconfig getifaddr en0`);
  console.log(`${divider}\n`);
});
