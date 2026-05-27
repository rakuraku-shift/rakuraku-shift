/**
 * Bar Exchange — Price Engine
 * 需要連動型ダイナミックプライシングアルゴリズム
 */

const DEFAULT_DRINKS = [
  { id:'highball',  name:'ハイボール',   emoji:'🥃', base:500,  min:280, max:980,  rivals:['beer','lemon_sour'] },
  { id:'beer',      name:'ビール',       emoji:'🍺', base:600,  min:350, max:1100, rivals:['highball']          },
  { id:'wine',      name:'ワイン',       emoji:'🍷', base:700,  min:420, max:1300, rivals:['cocktail']          },
  { id:'cocktail',  name:'カクテル',     emoji:'🍸', base:800,  min:500, max:1500, rivals:['wine']              },
  { id:'sake',      name:'日本酒',       emoji:'🍶', base:650,  min:400, max:1200, rivals:['shochu']            },
  { id:'shochu',    name:'焼酎',         emoji:'🥂', base:550,  min:320, max:1000, rivals:['sake']              },
  { id:'lemon_sour',name:'レモンサワー', emoji:'🍋', base:480,  min:280, max:900,  rivals:['highball']          },
  { id:'whisky',    name:'ウイスキー',   emoji:'🥃', base:900,  min:600, max:1600, rivals:['brandy']            },
  { id:'brandy',    name:'ブランデー',   emoji:'🫗', base:950,  min:600, max:1700, rivals:['whisky']            },
  { id:'gin_tonic', name:'ジントニック', emoji:'🍹', base:750,  min:450, max:1400, rivals:['cocktail']          },
  { id:'champagne', name:'シャンパン',   emoji:'🥂', base:1200, min:800, max:2200, rivals:['wine']              },
  { id:'matcha',    name:'抹茶ラテ(NA)',emoji:'🍵', base:400,  min:250, max:750,  rivals:[]                    },
];

const DEFAULT_SETTINGS = {
  priceStep:   8,     // 1注文あたりの上昇率 (%)
  rivalStep:   5,     // ライバル注文のペナルティ率 (%)
  windowMin:   5,     // 計算ウィンドウ（分）
  trendThresh: 10,    // トレンド判定しきい値 (¥)
  stockWarn:   5,     // 在庫警告しきい値（この数以下で自動値上げ）
  isOpen:      true,
  spotlightId: null,
};

class PriceEngine {
  constructor(savedConfig = null) {
    this.drinks      = savedConfig?.drinks    ?? [...DEFAULT_DRINKS];
    this.settings    = { ...DEFAULT_SETTINGS, ...(savedConfig?.settings ?? {}) };
    this.prices      = {};
    this.history     = {};
    this.orderLog    = [];
    this.isCrash     = false;
    this.totalOrders = 0;
    this.stockLevels = {};

    this._initDrinks();

    // 10秒ごとに自然減衰
    setInterval(() => this._tick(), 10000);
  }

  // ── 設定更新（管理者画面から） ──────────────
  applyConfig(cfg) {
    const newDrinks = cfg?.drinks ?? this.drinks;
    this.settings   = { ...DEFAULT_SETTINGS, ...(cfg?.settings ?? {}) };

    // 新ドリンクの初期化（既存は維持）
    newDrinks.forEach(d => {
      if (!this.prices[d.id])  this.prices[d.id]  = d.base;
      if (!this.history[d.id]) this.history[d.id] = Array(20).fill(d.base);
    });

    this.drinks = newDrinks;
    this._recalculate();
  }

  // ── 注文記録 ────────────────────────────────
  recordOrder(drinkId) {
    if (!this.drinks.find(d => d.id === drinkId)) return null;
    this.orderLog.push({ drinkId, timestamp: Date.now() });
    this.totalOrders++;
    this._recalculate();
    return this.getState();
  }

  // ── クラッシュ ───────────────────────────────
  triggerCrash() {
    this.isCrash = true;
    this.drinks.forEach(d => {
      this.prices[d.id] = Math.round(d.min * 1.05);
    });
    this._pushHistory();
    setTimeout(() => { this.isCrash = false; this._recalculate(); }, 120000);
    return this.getState();
  }

  // ── 在庫管理 ─────────────────────────────────
  setStock(levels) {
    this.stockLevels = { ...levels };
    this._recalculate();
    return this.getState();
  }

  decrementStock(drinkId) {
    if (this.stockLevels[drinkId] != null && this.stockLevels[drinkId] > 0) {
      this.stockLevels[drinkId]--;
      this._recalculate();
    }
  }

  // ── リセット ─────────────────────────────────
  resetPrices() {
    this.orderLog = [];
    this.drinks.forEach(d => { this.prices[d.id] = d.base; });
    this._pushHistory();
    return this.getState();
  }

  // ── 現在状態を返す ───────────────────────────
  getState() {
    const cutoff = Date.now() - 60000;
    const thresh = this.settings.trendThresh;
    const spotId = this.settings.spotlightId;

    return {
      drinks: this.drinks.map(d => {
        const price   = this.prices[d.id] ?? d.base;
        const change  = Math.round((price - d.base) / d.base * 100);
        const hist    = this.history[d.id] ?? [d.base];
        const prev    = hist[hist.length - 2] ?? d.base;
        const trend   = price > prev + thresh ? 'up' : price < prev - thresh ? 'down' : 'flat';
        const recent  = this.orderLog.filter(o => o.drinkId === d.id && o.timestamp > cutoff).length;
        const stock   = this.stockLevels[d.id] ?? null;
        const warn    = this.settings.stockWarn ?? 5;
        return {
          ...d,
          price,
          change,
          trend,
          history: hist.slice(-24),
          recentOrders: recent,
          spotlight: d.id === spotId,
          stock,
          soldOut:   stock === 0,
          stockLow:  stock != null && stock > 0 && stock <= warn,
        };
      }),
      settings:    this.settings,
      isCrash:     this.isCrash,
      isOpen:      this.settings.isOpen,
      totalOrders: this.totalOrders,
      timestamp:   Date.now(),
    };
  }

  // ── 内部メソッド ─────────────────────────────
  _initDrinks() {
    this.drinks.forEach(d => {
      if (!this.prices[d.id])  this.prices[d.id]  = d.base;
      if (!this.history[d.id]) this.history[d.id] = Array(20).fill(d.base);
    });
  }

  _tick() {
    const cutoff = Date.now() - this.settings.windowMin * 60000;
    this.orderLog = this.orderLog.filter(o => o.timestamp > cutoff);
    this._recalculate();
  }

  _recalculate() {
    if (this.isCrash) return;

    const cutoff  = Date.now() - this.settings.windowMin * 60000;
    const recent  = this.orderLog.filter(o => o.timestamp > cutoff);
    const pStep   = this.settings.priceStep  / 100;
    const rStep   = this.settings.rivalStep  / 100;

    this.drinks.forEach(drink => {
      const own   = recent.filter(o => o.drinkId === drink.id).length;
      const rival = recent.filter(o => (drink.rivals ?? []).includes(o.drinkId)).length;
      let mult = 1 + own * pStep - rival * rStep;
      let p = Math.round(drink.base * mult);

      // 在庫連動: 在庫が少ないほど自動値上がり
      const stock = this.stockLevels[drink.id];
      if (stock != null) {
        const warn = this.settings.stockWarn ?? 5;
        if (stock === 0) {
          p = drink.max; // 売り切れ → 最高値
        } else if (stock <= warn) {
          const boost = ((warn - stock + 1) / (warn + 1)) * 0.3; // 最大+30%
          p = Math.round(p * (1 + boost));
        }
      }

      p = Math.max(drink.min, Math.min(drink.max, p));
      this.prices[drink.id] = p;
    });

    this._pushHistory();
  }

  _pushHistory() {
    this.drinks.forEach(d => {
      if (!this.history[d.id]) this.history[d.id] = [];
      this.history[d.id].push(this.prices[d.id]);
      if (this.history[d.id].length > 60) this.history[d.id].shift();
    });
  }
}

module.exports = { PriceEngine, DEFAULT_DRINKS, DEFAULT_SETTINGS };
