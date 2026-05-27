/* ══════════════════════════════════════════
   RAKURAKU i18n (国際化)
   サポート言語: ja (日本語) / en (English) / zh (中文) / ko (한국어)
   ══════════════════════════════════════════ */

(function(window) {
  'use strict';

  const TRANSLATIONS = {
    /* ─── 共通 ─── */
    'lang.ja': { ja:'日本語', en:'日本語', zh:'日本語', ko:'日本語' },
    'lang.en': { ja:'English', en:'English', zh:'English', ko:'English' },
    'lang.zh': { ja:'中文', en:'中文', zh:'中文', ko:'中文' },
    'lang.ko': { ja:'한국어', en:'한국어', zh:'한국어', ko:'한국어' },
    'common.name': { ja:'お名前', en:'Name', zh:'姓名', ko:'이름' },
    'common.save': { ja:'保存', en:'Save', zh:'保存', ko:'저장' },
    'common.cancel': { ja:'キャンセル', en:'Cancel', zh:'取消', ko:'취소' },
    'common.submit': { ja:'送信', en:'Submit', zh:'提交', ko:'제출' },
    'common.close': { ja:'閉じる', en:'Close', zh:'关闭', ko:'닫기' },
    'common.confirm': { ja:'確認', en:'Confirm', zh:'确认', ko:'확인' },
    'common.today': { ja:'今日', en:'Today', zh:'今天', ko:'오늘' },
    'common.month': { ja:'月', en:'/M', zh:'月', ko:'월' },
    'common.day_short': { ja:'日', en:'D', zh:'日', ko:'일' },
    'common.loading': { ja:'読込中…', en:'Loading...', zh:'加载中…', ko:'로딩 중…' },
    'common.error': { ja:'エラー', en:'Error', zh:'错误', ko:'오류' },
    'common.required': { ja:'必須', en:'Required', zh:'必填', ko:'필수' },
    'common.optional': { ja:'任意', en:'Optional', zh:'选填', ko:'선택' },
    'common.success': { ja:'成功', en:'Success', zh:'成功', ko:'성공' },

    /* ─── 曜日 ─── */
    'dow.0': { ja:'日', en:'Sun', zh:'日', ko:'일' },
    'dow.1': { ja:'月', en:'Mon', zh:'一', ko:'월' },
    'dow.2': { ja:'火', en:'Tue', zh:'二', ko:'화' },
    'dow.3': { ja:'水', en:'Wed', zh:'三', ko:'수' },
    'dow.4': { ja:'木', en:'Thu', zh:'四', ko:'목' },
    'dow.5': { ja:'金', en:'Fri', zh:'五', ko:'금' },
    'dow.6': { ja:'土', en:'Sat', zh:'六', ko:'토' },

    /* ─── attendance.html 出退勤 ─── */
    'att.title': { ja:'出退勤打刻', en:'Time Clock', zh:'出勤打卡', ko:'출퇴근 타각' },
    'att.hint': { ja:'出勤・退勤・休憩はこの画面から打刻してください。GPS位置情報で店舗にいることが確認されます。',
                  en:'Use this screen to clock in, clock out, and manage breaks. GPS verifies you are at the shop.',
                  zh:'在此画面进行上班、下班和休息的打卡。GPS会确认您是否在店内。',
                  ko:'이 화면에서 출근, 퇴근, 휴식을 타각하세요. GPS로 매장 위치를 확인합니다.' },
    'att.name_label': { ja:'👤 お名前', en:'👤 Your Name', zh:'👤 您的姓名', ko:'👤 이름' },
    'att.name_ph': { ja:'例) 山田 太郎', en:'e.g. John Smith', zh:'例) 张三', ko:'예) 김철수' },
    'att.gps_loading': { ja:'位置情報を取得中...', en:'Getting location...', zh:'正在获取位置…', ko:'위치 정보를 가져오는 중...' },
    'att.gps_loading_sub': { ja:'GPS を有効にしてください', en:'Please enable GPS', zh:'请启用GPS', ko:'GPS를 활성화해 주세요' },
    'att.gps_error': { ja:'GPS エラー', en:'GPS Error', zh:'GPS错误', ko:'GPS 오류' },
    'att.gps_blocked': { ja:'GPSがブロックされています', en:'GPS is blocked', zh:'GPS被阻止', ko:'GPS가 차단되었습니다' },
    'att.gps_ready': { ja:'位置情報 取得済み', en:'Location ready', zh:'位置已就绪', ko:'위치 정보 준비됨' },
    'att.gps_in_range': { ja:'店舗範囲内です', en:'Inside shop area', zh:'在店铺范围内', ko:'매장 범위 내' },
    'att.gps_out_range': { ja:'店舗から離れています', en:'Outside shop area', zh:'离店铺较远', ko:'매장에서 떨어져 있음' },
    'att.status': { ja:'現在のステータス', en:'Current Status', zh:'当前状态', ko:'현재 상태' },
    'att.st_off': { ja:'⏸ 未出勤', en:'⏸ Not Clocked In', zh:'⏸ 未上班', ko:'⏸ 미출근' },
    'att.st_working': { ja:'🟢 勤務中', en:'🟢 Working', zh:'🟢 工作中', ko:'🟢 근무 중' },
    'att.st_break': { ja:'☕ 休憩中', en:'☕ On Break', zh:'☕ 休息中', ko:'☕ 휴식 중' },
    'att.st_clocked_out': { ja:'🏁 退勤済', en:'🏁 Clocked Out', zh:'🏁 已下班', ko:'🏁 퇴근 완료' },
    'att.last_punch': { ja:'最終打刻', en:'Last Punch', zh:'最后打卡', ko:'마지막 타각' },
    'att.work_time': { ja:'勤務時間', en:'Work Time', zh:'工作时间', ko:'근무 시간' },
    'att.break_time': { ja:'休憩時間', en:'Break Time', zh:'休息时间', ko:'휴식 시간' },
    'att.btn_in': { ja:'出勤', en:'Clock In', zh:'上班', ko:'출근' },
    'att.btn_out': { ja:'退勤', en:'Clock Out', zh:'下班', ko:'퇴근' },
    'att.btn_break_start': { ja:'休憩開始', en:'Start Break', zh:'开始休息', ko:'휴식 시작' },
    'att.btn_break_end': { ja:'休憩終了', en:'End Break', zh:'结束休息', ko:'휴식 종료' },
    'att.history': { ja:'📋 本日の打刻履歴', en:'📋 Today\'s Punches', zh:'📋 今日打卡记录', ko:'📋 오늘의 타각 기록' },
    'att.history_empty': { ja:'打刻履歴はまだありません', en:'No punches yet', zh:'尚无打卡记录', ko:'타각 기록이 없습니다' },
    'att.name_required': { ja:'お名前を入力してください', en:'Please enter your name', zh:'请输入您的姓名', ko:'이름을 입력해 주세요' },
    'att.out_range_confirm': { ja:'店舗から離れています。本当に打刻しますか？\n\n※不正打刻として記録され、店長に警告が届きます。',
                                en:'You are outside the shop area. Punch anyway?\n\nThis will be flagged and reported to the manager.',
                                zh:'您离店铺较远。仍然要打卡吗？\n\n※将被标记为异常打卡并通知店长。',
                                ko:'매장에서 떨어져 있습니다. 그래도 타각하시겠습니까?\n\n※부정 타각으로 기록되어 점장에게 경고됩니다.' },
    'att.recorded': { ja:'を記録しました', en:'recorded', zh:'已记录', ko:'기록되었습니다' },

    /* ─── myshift.html マイシフト ─── */
    'my.title': { ja:'📅 私の確定シフト', en:'📅 My Confirmed Shifts', zh:'📅 我的确认班次', ko:'📅 내 확정 시프트' },
    'my.sub': { ja:'確定したシフト・休み変更届・出退勤打刻',
                en:'View shifts · Request time off · Clock in/out',
                zh:'查看班次·请假申请·打卡',
                ko:'시프트 확인·휴가 신청·타각' },
    'my.qa_clock': { ja:'⏰ 出退勤打刻', en:'⏰ Time Clock', zh:'⏰ 出勤打卡', ko:'⏰ 출퇴근 타각' },
    'my.qa_change': { ja:'🆘 休み変更届', en:'🆘 Request Day Off', zh:'🆘 请假申请', ko:'🆘 휴가 신청' },
    'my.today_label': { ja:'本日のシフト', en:'Today\'s Shift', zh:'今日班次', ko:'오늘 시프트' },
    'my.today_empty': { ja:'本日は出勤予定ではありません', en:'No shift today', zh:'今日没有班次', ko:'오늘은 출근 예정이 아닙니다' },
    'my.legend_work': { ja:'出勤日', en:'Working Day', zh:'上班日', ko:'근무일' },
    'my.legend_request': { ja:'休み変更申請中', en:'Time Off Pending', zh:'请假申请中', ko:'휴가 신청 중' },
    'my.legend_off': { ja:'非出勤', en:'Off Day', zh:'休息日', ko:'비번' },
    'my.upcoming': { ja:'📋 これからの出勤予定', en:'📋 Upcoming Shifts', zh:'📋 即将到来的班次', ko:'📋 예정된 시프트' },
    'my.upcoming_empty_noname': { ja:'名前を入力するとシフトが表示されます', en:'Enter your name to see shifts', zh:'输入姓名以查看班次', ko:'이름을 입력하면 시프트가 표시됩니다' },
    'my.upcoming_empty_noshift': { ja:'確定シフトはまだありません', en:'No confirmed shifts yet', zh:'尚未确认班次', ko:'확정된 시프트가 없습니다' },
    'my.change_history': { ja:'📨 変更届の履歴', en:'📨 Request History', zh:'📨 申请历史', ko:'📨 신청 이력' },
    'my.change_empty': { ja:'変更届の履歴はまだありません', en:'No requests yet', zh:'尚无申请记录', ko:'신청 기록이 없습니다' },
    'my.status_pending': { ja:'⏳ 申請中', en:'⏳ Pending', zh:'⏳ 审核中', ko:'⏳ 검토 중' },
    'my.status_approved': { ja:'✓ 承認済', en:'✓ Approved', zh:'✓ 已批准', ko:'✓ 승인됨' },
    'my.status_rejected': { ja:'✕ 却下', en:'✕ Rejected', zh:'✕ 已拒绝', ko:'✕ 거부됨' },
    'my.status_requesting': { ja:'休み申請中', en:'Pending', zh:'申请中', ko:'신청 중' },
    'my.modal_title': { ja:'🆘 休み変更届', en:'🆘 Request Day Off', zh:'🆘 请假申请', ko:'🆘 휴가 신청' },
    'my.modal_sub': { ja:'出勤予定日を急遽休みたい場合に提出',
                      en:'Submit if you need to cancel a scheduled shift',
                      zh:'若需取消已排班次请提交',
                      ko:'예정된 시프트를 취소하고 싶을 때 제출' },
    'my.modal_warn': { ja:'⚠️ なるべく早めの申請をお願いします。代替スタッフの手配が必要なため、店長判断で承認/却下されます。',
                       en:'⚠️ Please submit as early as possible. Manager will approve or reject based on staffing needs.',
                       zh:'⚠️ 请尽早提交申请。需要安排替代员工，由店长决定批准或拒绝。',
                       ko:'⚠️ 가능한 한 빨리 신청해 주세요. 대체 직원 수배가 필요하므로 점장이 승인/거부합니다.' },
    'my.field_date': { ja:'休みたい日', en:'Date Off', zh:'请假日期', ko:'휴가 날짜' },
    'my.field_reason': { ja:'理由', en:'Reason', zh:'原因', ko:'사유' },
    'my.field_note': { ja:'詳細・補足（任意）', en:'Details (Optional)', zh:'详细说明（选填）', ko:'상세 내용 (선택)' },
    'my.reason_choose': { ja:'選択してください', en:'Please choose', zh:'请选择', ko:'선택하세요' },
    'my.reason_sick': { ja:'体調不良', en:'Sickness', zh:'身体不适', ko:'몸이 안 좋음' },
    'my.reason_family': { ja:'家庭の事情', en:'Family Matter', zh:'家庭原因', ko:'가족 사정' },
    'my.reason_school': { ja:'学校の予定', en:'School Schedule', zh:'学校安排', ko:'학교 일정' },
    'my.reason_ceremony': { ja:'冠婚葬祭', en:'Ceremonial Event', zh:'婚丧嫁娶', ko:'경조사' },
    'my.reason_other': { ja:'その他', en:'Other', zh:'其他', ko:'기타' },
    'my.modal_submit': { ja:'📨 変更届を提出する', en:'📨 Submit Request', zh:'📨 提交申请', ko:'📨 신청 제출' },
    'my.toast_submitted': { ja:'✅ 変更届を提出しました', en:'✅ Request submitted', zh:'✅ 申请已提交', ko:'✅ 신청이 제출되었습니다' },
    'my.toast_name_first': { ja:'まず名前を入力してください', en:'Please enter your name first', zh:'请先输入姓名', ko:'먼저 이름을 입력해 주세요' },
    'my.toast_not_scheduled': { ja:'この日は出勤予定ではありません', en:'No shift scheduled on this day', zh:'此日没有排班', ko:'이 날은 출근 예정이 아닙니다' },
    'my.toast_shift_updated': { ja:'📡 シフトが更新されました', en:'📡 Shift updated', zh:'📡 班次已更新', ko:'📡 시프트가 업데이트되었습니다' },
    'my.toast_approved': { ja:'✅ 変更届が承認されました', en:'✅ Request approved', zh:'✅ 申请已批准', ko:'✅ 신청이 승인되었습니다' },
    'my.toast_rejected': { ja:'⚠ 変更届が却下されました', en:'⚠ Request rejected', zh:'⚠ 申请被拒绝', ko:'⚠ 신청이 거부되었습니다' },
    'my.required_fields': { ja:'名前・日付・理由は必須です', en:'Name, date, and reason are required', zh:'姓名、日期和原因为必填', ko:'이름, 날짜, 사유는 필수입니다' },

    /* ─── shift.html スタッフ提出画面 ─── */
    'staff.title': { ja:'シフト提出', en:'Submit Shift Request', zh:'提交班次申请', ko:'시프트 제출' },
    'staff.sub': { ja:'希望の勤務日・時間帯を入力して提出してください',
                   en:'Enter your preferred work dates and times',
                   zh:'输入希望的工作日期和时间',
                   ko:'희망 근무일과 시간을 입력하세요' },
    'staff.go_attendance': { ja:'⏰ 出退勤打刻はこちら（GPS対応）',
                             en:'⏰ Time Clock (GPS-enabled)',
                             zh:'⏰ 出勤打卡（GPS）',
                             ko:'⏰ 출퇴근 타각 (GPS)' },
    'staff.go_myshift': { ja:'📅 マイシフト・休み変更届',
                          en:'📅 My Shifts & Time-off Request',
                          zh:'📅 我的班次·请假',
                          ko:'📅 내 시프트·휴가 신청' },
  };

  const SUPPORTED_LANGS = ['ja', 'en', 'zh', 'ko'];

  /* 言語検出 */
  function detectLang() {
    try {
      const saved = localStorage.getItem('rakuraku_lang');
      if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
    } catch(e) {}
    const browser = (navigator.language || 'ja').toLowerCase();
    if (browser.startsWith('ja')) return 'ja';
    if (browser.startsWith('zh')) return 'zh';
    if (browser.startsWith('ko')) return 'ko';
    if (browser.startsWith('en')) return 'en';
    return 'ja';
  }

  let currentLang = detectLang();

  function t(key) {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return entry[currentLang] || entry.ja || key;
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = t(key);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el) {
      const key = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', t(key));
    });
    /* イベント発火（カスタムレンダリングの再実行用） */
    window.dispatchEvent(new CustomEvent('rakuraku-lang-changed', { detail: { lang: currentLang } }));
  }

  function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;
    currentLang = lang;
    try { localStorage.setItem('rakuraku_lang', lang); } catch(e) {}
    applyTranslations();
  }

  function getLang() { return currentLang; }

  /* 言語切替UIの生成 */
  function buildLangSwitcher(containerId, opts) {
    opts = opts || {};
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    const sw = document.createElement('div');
    sw.className = 'i18n-switcher';
    sw.style.cssText = 'display:inline-flex;gap:2px;background:rgba(255,255,255,.1);border-radius:8px;padding:3px;font-size:11px;font-weight:800;';
    SUPPORTED_LANGS.forEach(function(lang) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = lang === 'ja' ? '日' : lang === 'en' ? 'EN' : lang === 'zh' ? '中' : '한';
      btn.style.cssText = 'padding:4px 9px;border:none;background:transparent;color:inherit;cursor:pointer;border-radius:5px;font-family:inherit;font-weight:800;transition:background .15s;';
      if (lang === currentLang) btn.style.background = 'rgba(255,255,255,.25)';
      btn.addEventListener('click', function() {
        setLang(lang);
        /* 全ボタンの選択状態を更新 */
        sw.querySelectorAll('button').forEach(function(b, i) {
          b.style.background = SUPPORTED_LANGS[i] === currentLang ? 'rgba(255,255,255,.25)' : 'transparent';
        });
      });
      sw.appendChild(btn);
    });
    container.appendChild(sw);
  }

  /* 自動初期化 */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTranslations);
  } else {
    applyTranslations();
  }

  /* グローバルAPI */
  window.RakuI18n = {
    t: t,
    setLang: setLang,
    getLang: getLang,
    apply: applyTranslations,
    buildSwitcher: buildLangSwitcher,
    supported: SUPPORTED_LANGS,
  };
})(window);
