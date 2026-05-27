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

    /* ─── shift.html タブバー (タブ3つ) ─── */
    'tab.staff': { ja:'シフト提出', en:'Submit', zh:'提交', ko:'시프트 제출' },
    'tab.survey': { ja:'アンケート', en:'Survey', zh:'问卷', ko:'설문' },
    'tab.manager': { ja:'シフト管理', en:'Manage', zh:'班次管理', ko:'시프트 관리' },

    /* ─── shift.html 管理画面ヘッダー + 主要ボタン ─── */
    'mgr.eyebrow': { ja:'RAKURAKU · シフト管理コンソール',
                     en:'RAKURAKU · Manager Console',
                     zh:'RAKURAKU · 管理控制台',
                     ko:'RAKURAKU · 관리자 콘솔' },
    'mgr.title': { ja:'シフト管理', en:'Shift Management', zh:'班次管理', ko:'시프트 관리' },
    'mgr.badge_sync': { ja:'データ同期中', en:'Syncing', zh:'数据同步', ko:'데이터 동기화' },
    'mgr.badge_auto': { ja:'自動生成対応', en:'Auto-generate', zh:'自动生成', ko:'자동 생성' },
    'mgr.badge_mail': { ja:'メール通知', en:'Email Alerts', zh:'邮件通知', ko:'이메일 알림' },
    'mgr.realtime_attendance': { ja:'⏰ 本日の出退勤（リアルタイム）',
                                  en:'⏰ Today\'s Attendance (live)',
                                  zh:'⏰ 今日出勤（实时）',
                                  ko:'⏰ 오늘의 출퇴근 (실시간)' },
    'mgr.payroll': { ja:'📋 給与明細', en:'📋 Payroll', zh:'📋 工资单', ko:'📋 급여 명세' },
    'mgr.monthly_report': { ja:'📊 月次レポート', en:'📊 Monthly Report', zh:'📊 月度报告', ko:'📊 월간 리포트' },
    'mgr.no_records': { ja:'本日まだ打刻なし', en:'No punches today', zh:'今日尚无打卡', ko:'오늘 타각 없음' },

    /* ─── 締切・リマインド ─── */
    'rem.title': { ja:'⏰ 締切・リマインド管理', en:'⏰ Deadline & Reminders', zh:'⏰ 截止·提醒', ko:'⏰ 마감·리마인드' },
    'rem.deadline': { ja:'提出期限', en:'Submission Deadline', zh:'提交截止', ko:'제출 기한' },
    'rem.set': { ja:'✅ 設定', en:'✅ Set', zh:'✅ 设置', ko:'✅ 설정' },
    'rem.clear': { ja:'クリア', en:'Clear', zh:'清除', ko:'초기화' },
    'rem.staff_list': { ja:'スタッフリスト（リマインド用）', en:'Staff List (for reminders)', zh:'员工列表（提醒用）', ko:'스태프 목록(리마인드)' },
    'rem.add_staff': { ja:'＋ 追加', en:'+ Add', zh:'+ 添加', ko:'+ 추가' },
    'rem.send_reminder': { ja:'📢 未提出スタッフにリマインドを送る',
                            en:'📢 Send Reminder to Pending Staff',
                            zh:'📢 给未提交员工发送提醒',
                            ko:'📢 미제출 직원에게 리마인드 전송' },
    'rem.stat_total': { ja:'登録スタッフ', en:'Total Staff', zh:'登记员工', ko:'등록 직원' },
    'rem.stat_submitted': { ja:'提出済み', en:'Submitted', zh:'已提交', ko:'제출 완료' },
    'rem.stat_pending': { ja:'未提出', en:'Pending', zh:'未提交', ko:'미제출' },
    'rem.submitted_badge': { ja:'✅ 提出済み', en:'✅ Submitted', zh:'✅ 已提交', ko:'✅ 제출 완료' },
    'rem.pending_badge': { ja:'⏳ 未提出', en:'⏳ Pending', zh:'⏳ 未提交', ko:'⏳ 미제출' },
    'rem.role_badge': { ja:'役職', en:'Manager', zh:'管理', ko:'관리' },

    /* ─── 主要ボタン ─── */
    'btn.generate': { ja:'✨ シフト作成', en:'✨ Generate', zh:'✨ 生成班次', ko:'✨ 시프트 생성' },
    'btn.print': { ja:'🖨️ 印刷', en:'🖨️ Print', zh:'🖨️ 打印', ko:'🖨️ 인쇄' },
    'btn.export': { ja:'💾 エクスポート', en:'💾 Export', zh:'💾 导出', ko:'💾 내보내기' },
    'btn.submit': { ja:'📤 提出する', en:'📤 Submit', zh:'📤 提交', ko:'📤 제출하기' },
    'btn.lock': { ja:'🔒 ロック', en:'🔒 Lock', zh:'🔒 锁定', ko:'🔒 잠금' },
    'btn.unlock': { ja:'🔓 解除', en:'🔓 Unlock', zh:'🔓 解锁', ko:'🔓 잠금 해제' },

    /* ─── 警告バナー ─── */
    'warn.shortage': { ja:'人手不足の日程があります', en:'There are days with insufficient staff', zh:'有人手不足的日期', ko:'인력 부족인 날짜가 있습니다' },
    'warn.recruit_internal': { ja:'👥 自社スタッフに声がけ', en:'👥 Call Internal Staff', zh:'👥 内部招募', ko:'👥 자사 직원 호출' },
    'warn.recruit_external': { ja:'⚡ 外部求人', en:'⚡ External Recruit', zh:'⚡ 外部招聘', ko:'⚡ 외부 구인' },

    /* ─── スタッフ提出フォーム (4ステップ) ─── */
    'sf.step1_title': { ja:'基本情報', en:'Basic Info', zh:'基本信息', ko:'기본 정보' },
    'sf.step1_sub': { ja:'お名前を入力してください', en:'Enter your name', zh:'请输入姓名', ko:'이름을 입력하세요' },
    'sf.label_name': { ja:'氏名', en:'Name', zh:'姓名', ko:'이름' },
    'sf.label_name_hint': { ja:'1文字入力で候補表示', en:'Type one letter for suggestions', zh:'输入一个字符显示候选', ko:'한 글자 입력으로 추천' },
    'sf.label_email': { ja:'メールアドレス', en:'Email', zh:'邮箱', ko:'이메일' },
    'sf.email_hint': { ja:'シフト不足時に優先的に通知が届きます', en:'You\'ll be notified first when shifts need filling', zh:'班次不足时优先通知', ko:'시프트 부족 시 우선 알림' },
    'sf.autofill_badge': { ja:'✨ 前回のメールアドレスを自動入力しました', en:'✨ Email autofilled from last time', zh:'✨ 已自动填入上次的邮箱', ko:'✨ 이전 이메일이 자동 입력되었습니다' },
    'sf.step2_title': { ja:'希望日を選択', en:'Select Preferred Dates', zh:'选择希望日期', ko:'희망 날짜 선택' },
    'sf.step2_sub': { ja:'出勤可能な日付をタップで選択（複数可）', en:'Tap dates you can work (multiple)', zh:'轻触可工作日期（多选）', ko:'근무 가능한 날짜를 탭하세요 (복수 선택)' },
    'sf.selected_dates': { ja:'選択中の日付', en:'Selected Dates', zh:'已选日期', ko:'선택된 날짜' },
    'sf.step3_title': { ja:'希望時間帯', en:'Preferred Time Slots', zh:'希望时间段', ko:'희망 시간대' },
    'sf.step3_sub': { ja:'出勤可能な時間帯を選択（複数可）', en:'Select available time slots (multiple)', zh:'选择可工作时间段（多选）', ko:'근무 가능한 시간대 선택 (복수)' },
    'sf.custom_time': { ja:'カスタム時間を指定', en:'Custom Time', zh:'自定义时间', ko:'커스텀 시간 지정' },
    'sf.add': { ja:'＋ 追加', en:'+ Add', zh:'+ 添加', ko:'+ 추가' },
    'sf.step4_title': { ja:'確認・提出', en:'Review & Submit', zh:'确认·提交', ko:'확인·제출' },
    'sf.step4_sub': { ja:'内容を確認して提出してください', en:'Please review and submit', zh:'请确认内容并提交', ko:'내용을 확인하고 제출하세요' },

    /* ─── 時間帯 ─── */
    'time.morning': { ja:'朝', en:'Morning', zh:'早晨', ko:'아침' },
    'time.lunch': { ja:'昼', en:'Lunch', zh:'中午', ko:'점심' },
    'time.afternoon': { ja:'夕方', en:'Afternoon', zh:'傍晚', ko:'저녁때' },
    'time.evening': { ja:'夜', en:'Evening', zh:'晚上', ko:'밤' },
    'time.night': { ja:'深夜', en:'Late Night', zh:'深夜', ko:'심야' },
    'time.full': { ja:'フルタイム', en:'Full-time', zh:'全天', ko:'풀타임' },
    'time.full_sub': { ja:'終日対応可', en:'Available all day', zh:'全天可用', ko:'종일 가능' },

    /* ─── ポジション ─── */
    'role.hall': { ja:'ホール', en:'Hall', zh:'大厅', ko:'홀' },
    'role.kitchen': { ja:'キッチン', en:'Kitchen', zh:'厨房', ko:'주방' },
    'role.cashier': { ja:'レジ', en:'Cashier', zh:'收银', ko:'계산대' },
    'role.unassigned': { ja:'未設定', en:'Not Set', zh:'未设置', ko:'미설정' },

    /* ─── 内部募集モーダル ─── */
    'notify.title': { ja:'自社スタッフ内部募集', en:'Internal Recruitment', zh:'内部招募', ko:'사내 모집' },
    'notify.sub': { ja:'時給アップでシフト確保・外部求人の前に', en:'Boost wages first, before external recruitment', zh:'先涨工资再外部招聘', ko:'급여 인상으로 시프트 확보·외부 구인 전에' },
    'notify.shortage_dates': { ja:'📅 不足している日程・役職', en:'📅 Shortage Dates & Roles', zh:'📅 缺人日期·岗位', ko:'📅 부족한 일정·역할' },
    'notify.incentive': { ja:'💴 時給インセンティブ設定', en:'💴 Wage Incentive', zh:'💴 工资奖励设置', ko:'💴 시급 인센티브 설정' },
    'notify.send_btn': { ja:'📢 全スタッフに送信', en:'📢 Send to All Staff', zh:'📢 发送给全员', ko:'📢 전 직원에게 전송' },

    /* ─── 外部求人モーダル (Timee) ─── */
    'timee.title': { ja:'外部求人配信', en:'External Recruitment', zh:'外部招聘发布', ko:'외부 구인 송출' },
    'timee.sub': { ja:'人手不足のシフトを自動で募集', en:'Auto-recruit for shortage shifts', zh:'人手不足班次自动招聘', ko:'인력 부족 시프트 자동 모집' },
    'timee.job_content': { ja:'求人内容', en:'Job Description', zh:'招聘内容', ko:'구인 내용' },
    'timee.platforms': { ja:'配信先プラットフォーム（複数選択可）', en:'Platforms (multiple)', zh:'发布平台（多选）', ko:'송출 플랫폼 (복수)' },
    'timee.wage': { ja:'時給', en:'Hourly Wage', zh:'时薪', ko:'시급' },
    'timee.wage_unit': { ja:'円 / 時間', en:'JPY / hour', zh:'日元 / 小时', ko:'엔 / 시간' },
    'timee.post_btn': { ja:'⚡ 求人を配信する', en:'⚡ Post Recruitment', zh:'⚡ 发布招聘', ko:'⚡ 구인 송출' },

    /* ─── トーストメッセージ ─── */
    'toast.shift_generated': { ja:'✨ シフト表を生成しました！', en:'✨ Shift schedule generated!', zh:'✨ 班次表已生成！', ko:'✨ 시프트가 생성되었습니다!' },
    'toast.saved': { ja:'💾 保存しました', en:'💾 Saved', zh:'💾 已保存', ko:'💾 저장되었습니다' },
    'toast.submitted': { ja:'✅ 提出完了しました', en:'✅ Submitted successfully', zh:'✅ 提交成功', ko:'✅ 제출 완료' },
    'toast.deleted': { ja:'🗑 削除しました', en:'🗑 Deleted', zh:'🗑 已删除', ko:'🗑 삭제되었습니다' },
    'toast.added': { ja:'✅ 追加しました', en:'✅ Added', zh:'✅ 已添加', ko:'✅ 추가되었습니다' },
    'toast.locked': { ja:'🔒 ロックしました', en:'🔒 Locked', zh:'🔒 已锁定', ko:'🔒 잠금되었습니다' },

    /* ─── アンケート画面 ─── */
    'sv.title': { ja:'職場評価', en:'Workplace Survey', zh:'职场评价', ko:'직장 평가' },
    'sv.title_sub': { ja:'アンケート', en:'Survey', zh:'问卷', ko:'설문' },
    'sv.sub': { ja:'回答は完全に匿名です。正直な評価をお願いします',
                en:'Responses are completely anonymous. Please be honest.',
                zh:'答案完全匿名，请如实评价',
                ko:'답변은 완전히 익명입니다. 솔직히 평가해 주세요' },
    'sv.recommend': { ja:'同僚にこの職場を推薦しますか？', en:'Would you recommend this workplace to colleagues?', zh:'您会向同事推荐此职场吗？', ko:'동료에게 이 직장을 추천하시겠습니까?' },
    'sv.submit': { ja:'✅ アンケートを送信', en:'✅ Submit Survey', zh:'✅ 提交问卷', ko:'✅ 설문 제출' },

    /* ─── トースト・追加 (shift.html 残り) ─── */
    'toast.tmpl_saved':       { ja:'💾 テンプレートを保存しました', en:'💾 Template saved', zh:'💾 模板已保存', ko:'💾 템플릿이 저장되었습니다' },
    'toast.new_month':        { ja:'📅 新しい月が始まりました。先月のシフトは履歴に保存されています。', en:'📅 New month started. Previous month is archived.', zh:'📅 新月份开始。上月已存档。', ko:'📅 새 달이 시작되었습니다. 지난달은 보관됨' },
    'toast.pin_4digits':      { ja:'⚠️ 4桁の数字で入力してください', en:'⚠️ Please enter 4 digits', zh:'⚠️ 请输入4位数字', ko:'⚠️ 4자리 숫자를 입력해 주세요' },
    'toast.pin_changed':      { ja:'✅ PINを変更しました', en:'✅ PIN updated', zh:'✅ PIN已更改', ko:'✅ PIN이 변경되었습니다' },
    'toast.locked_mgr':       { ja:'🔒 シフト管理をロックしました', en:'🔒 Shift Management locked', zh:'🔒 班次管理已锁定', ko:'🔒 시프트 관리가 잠겼습니다' },
    'toast.input_time':       { ja:'⚠️ 開始または終了時間を入力してください', en:'⚠️ Please enter start or end time', zh:'⚠️ 请输入开始或结束时间', ko:'⚠️ 시작 또는 종료 시간을 입력해 주세요' },
    'toast.already_added':    { ja:'⚠️ すでに追加されています', en:'⚠️ Already added', zh:'⚠️ 已添加', ko:'⚠️ 이미 추가되었습니다' },
    'toast.shift_submitted':  { ja:'✅ シフトを提出しました！', en:'✅ Shift submitted!', zh:'✅ 班次已提交！', ko:'✅ 시프트가 제출되었습니다!' },
    'toast.unknown_error':    { ja:'⚠️ エラーが発生しました。ページをリロードして再試行してください。', en:'⚠️ An error occurred. Please reload the page.', zh:'⚠️ 发生错误。请重新加载页面。', ko:'⚠️ 오류가 발생했습니다. 페이지를 새로고침해 주세요.' },
    'toast.reset_done':       { ja:'🗑 リセットしました', en:'🗑 Reset complete', zh:'🗑 已重置', ko:'🗑 초기화 완료' },
    'toast.no_submissions':   { ja:'⚠️ 提出データがありません', en:'⚠️ No submissions yet', zh:'⚠️ 尚无提交数据', ko:'⚠️ 제출 데이터가 없습니다' },
    'toast.shift_generated':  { ja:'✨ シフト表を生成しました！', en:'✨ Shift generated!', zh:'✨ 班次表已生成！', ko:'✨ 시프트가 생성되었습니다!' },
    'toast.generate_first':   { ja:'⚠️ 先にシフトを生成してください', en:'⚠️ Please generate shift first', zh:'⚠️ 请先生成班次', ko:'⚠️ 먼저 시프트를 생성해 주세요' },
    'toast.absence_recorded': { ja:'🆘 欠勤として記録 → 募集モーダルを開きます', en:'🆘 Absence recorded → Opening recruit modal', zh:'🆘 已记录缺勤 → 打开招聘窗口', ko:'🆘 결근 기록됨 → 모집 모달 열기' },
    'toast.time_both':        { ja:'⚠ 開始/終了 両方入力してください', en:'⚠ Please enter both start and end', zh:'⚠ 请输入开始和结束时间', ko:'⚠ 시작과 종료 모두 입력해 주세요' },
    'toast.shift_time_updated': { ja:'✅ シフト時間を更新しました', en:'✅ Shift time updated', zh:'✅ 班次时间已更新', ko:'✅ 시프트 시간이 업데이트됨' },
    'toast.staff_not_found':  { ja:'⚠ スタッフが見つかりません', en:'⚠ Staff not found', zh:'⚠ 找不到员工', ko:'⚠ 직원을 찾을 수 없습니다' },
    'toast.absence_done':     { ja:'🆘 欠勤マーク完了 → 代替募集を開きます', en:'🆘 Absence marked → Opening recruit', zh:'🆘 缺勤标记完成 → 打开替代招聘', ko:'🆘 결근 표시 완료 → 대체 모집 열기' },
    'toast.date_required':    { ja:'⚠ 日付を選択してください', en:'⚠ Please select a date', zh:'⚠ 请选择日期', ko:'⚠ 날짜를 선택해 주세요' },
    'toast.shift_deleted':    { ja:'🗑 シフトを削除しました', en:'🗑 Shift deleted', zh:'🗑 班次已删除', ko:'🗑 시프트가 삭제되었습니다' },
    'toast.need_updated':     { ja:'✅ 必要人員を更新しました', en:'✅ Required staff count updated', zh:'✅ 所需人数已更新', ko:'✅ 필요 인원이 업데이트됨' },
    'toast.eval_saved':       { ja:'✅ 評価を保存しました', en:'✅ Evaluation saved', zh:'✅ 评价已保存', ko:'✅ 평가가 저장되었습니다' },
    'toast.email_missing':    { ja:'⚠️ メールアドレスが未登録です', en:'⚠️ Email not registered', zh:'⚠️ 邮箱未登记', ko:'⚠️ 이메일이 등록되지 않음' },
    'toast.no_candidates':    { ja:'⚠️ 送信できる候補者がいません', en:'⚠️ No candidates to send', zh:'⚠️ 没有可发送的候选人', ko:'⚠️ 전송할 후보자가 없습니다' },
    'toast.no_email_candidates':{ ja:'⚠️ メール登録済の候補者がいません', en:'⚠️ No candidates with registered email', zh:'⚠️ 没有已登记邮箱的候选人', ko:'⚠️ 이메일이 등록된 후보자 없음' },

    /* ─── 確認ダイアログ ─── */
    'confirm.reset_all':      { ja:'全ての提出データをリセットしますか？', en:'Reset all submission data?', zh:'重置所有提交数据吗？', ko:'모든 제출 데이터를 초기화하시겠습니까?' },
    'confirm.absence_recruit':{ ja:'を欠勤として記録し、代替スタッフを募集しますか？', en:'Record as absent and recruit replacement?', zh:'记录为缺勤并招募替代员工？', ko:'결근으로 기록하고 대체 직원을 모집하시겠습니까?' },
    'confirm.delete_shift':   { ja:'のシフトを削除しますか？', en:'Delete this shift?', zh:'删除此班次吗？', ko:'이 시프트를 삭제하시겠습니까?' },

    /* ─── 編集モーダル ─── */
    'edit.time_title':        { ja:'⏰ シフト時間を編集', en:'⏰ Edit Shift Time', zh:'⏰ 编辑班次时间', ko:'⏰ 시프트 시간 편집' },
    'edit.time_start':        { ja:'開始時刻', en:'Start Time', zh:'开始时间', ko:'시작 시각' },
    'edit.time_end':          { ja:'終了時刻', en:'End Time', zh:'结束时间', ko:'종료 시각' },
    'edit.need_title':        { ja:'👥 必要人員を編集', en:'👥 Edit Required Staff', zh:'👥 编辑所需人数', ko:'👥 필요 인원 편집' },
    'edit.need_morning':      { ja:'朝 必要人数', en:'Morning Required', zh:'早晨所需', ko:'아침 필요 인원' },
    'edit.need_lunch':        { ja:'昼 必要人数', en:'Lunch Required', zh:'中午所需', ko:'점심 필요 인원' },
    'edit.need_evening':      { ja:'夜 必要人数', en:'Evening Required', zh:'晚上所需', ko:'저녁 필요 인원' },
    'edit.save_btn':          { ja:'💾 保存', en:'💾 Save', zh:'💾 保存', ko:'💾 저장' },
    'edit.absence_btn':       { ja:'🆘 欠勤マーク', en:'🆘 Mark Absent', zh:'🆘 标记缺勤', ko:'🆘 결근 표시' },

    /* ─── スタッフ評価モーダル ─── */
    'eval.title':             { ja:'⭐ スタッフ評価', en:'⭐ Staff Evaluation', zh:'⭐ 员工评价', ko:'⭐ 직원 평가' },
    'eval.position':          { ja:'ポジション別', en:'By Position', zh:'按岗位', ko:'포지션별' },
    'eval.save_btn':          { ja:'⭐ 評価を保存', en:'⭐ Save Evaluation', zh:'⭐ 保存评价', ko:'⭐ 평가 저장' },
    'eval.skip_btn':          { ja:'スキップ', en:'Skip', zh:'跳过', ko:'건너뛰기' },

    /* ─── ホリデー設定モーダル ─── */
    'holiday.title':          { ja:'🎌 ホリデー設定', en:'🎌 Holiday Settings', zh:'🎌 节假日设置', ko:'🎌 휴일 설정' },
    'holiday.add_date':       { ja:'日付', en:'Date', zh:'日期', ko:'날짜' },
    'holiday.type':           { ja:'種別', en:'Type', zh:'类型', ko:'유형' },
    'holiday.t_busy':         { ja:'🔥 祝日（繁忙）', en:'🔥 Holiday (Busy)', zh:'🔥 节假日（繁忙）', ko:'🔥 휴일(번화)' },
    'holiday.t_quiet':        { ja:'😴 閑散日', en:'😴 Quiet Day', zh:'😴 闲淡日', ko:'😴 한산일' },
    'holiday.t_normal':       { ja:'通常', en:'Normal', zh:'通常', ko:'통상' },
    'holiday.add_btn':        { ja:'+ 追加', en:'+ Add', zh:'+ 添加', ko:'+ 추가' },
    'holiday.list_empty':     { ja:'まだ登録されたホリデーはありません', en:'No holidays registered yet', zh:'尚未登记节假日', ko:'등록된 휴일이 없습니다' },

    /* ─── 監査ログ ─── */
    'audit.title':            { ja:'📜 シフト変更履歴', en:'📜 Change History', zh:'📜 变更历史', ko:'📜 변경 이력' },
    'audit.empty':            { ja:'変更履歴はありません', en:'No change history', zh:'无变更记录', ko:'변경 이력이 없습니다' },
    'audit.time_edit':        { ja:'時間変更', en:'Time Edit', zh:'时间修改', ko:'시간 변경' },
    'audit.absence_marked':   { ja:'欠勤マーク', en:'Marked Absent', zh:'标记缺勤', ko:'결근 표시' },
    'audit.need_edit':        { ja:'必要人員変更', en:'Required Staff Change', zh:'所需人数变更', ko:'필요 인원 변경' },

    /* ─── マスタデータ管理 ─── */
    'md.title':               { ja:'⚙️ マスタデータ管理', en:'⚙️ Master Data', zh:'⚙️ 主数据管理', ko:'⚙️ 마스터 데이터' },
    'md.positions':           { ja:'🎯 ポジション', en:'🎯 Positions', zh:'🎯 岗位', ko:'🎯 포지션' },
    'md.wages':               { ja:'💰 標準時給', en:'💰 Standard Wages', zh:'💰 标准时薪', ko:'💰 표준 시급' },
    'md.slots':               { ja:'⏰ 時間帯テンプレ', en:'⏰ Time Slots', zh:'⏰ 时段模板', ko:'⏰ 시간대 템플릿' },
    'md.breaks':              { ja:'☕ 休憩ルール', en:'☕ Break Rules', zh:'☕ 休息规则', ko:'☕ 휴식 규칙' },
    'md.holidays':            { ja:'🎌 ホリデー', en:'🎌 Holidays', zh:'🎌 节假日', ko:'🎌 휴일' },
    'md.save_btn':            { ja:'💾 マスタを保存', en:'💾 Save Master Data', zh:'💾 保存主数据', ko:'💾 마스터 저장' },
    'md.reset_btn':           { ja:'🔄 デフォルトに戻す', en:'🔄 Reset to Defaults', zh:'🔄 重置为默认', ko:'🔄 기본값으로 재설정' },

    /* ─── 本部ダッシュボード ─── */
    'hq.title':               { ja:'🏢 本部ダッシュボード', en:'🏢 HQ Dashboard', zh:'🏢 总部仪表盘', ko:'🏢 본부 대시보드' },
    'hq.shops':               { ja:'運営店舗', en:'Active Shops', zh:'运营店铺', ko:'운영 매장' },
    'hq.staffs':              { ja:'総スタッフ', en:'Total Staff', zh:'员工总数', ko:'총 직원' },
    'hq.sales':               { ja:'合計売上', en:'Total Sales', zh:'总销售额', ko:'총 매출' },
    'hq.labor_rate':          { ja:'人件費率(平均)', en:'Labor Cost Rate (avg)', zh:'人工成本率(平均)', ko:'인건비율(평균)' },
    'hq.unpaid':              { ja:'未払い店舗', en:'Unpaid Shops', zh:'未付费店铺', ko:'미납 매장' },
    'hq.alerts':              { ja:'本日のアラート', en:'Today\'s Alerts', zh:'今日警报', ko:'오늘의 알림' },
    'hq.ranking':             { ja:'🏆 売上ランキング', en:'🏆 Sales Ranking', zh:'🏆 销售排名', ko:'🏆 매출 순위' },
    'hq.billing':             { ja:'💰 課金状況サマリ', en:'💰 Billing Summary', zh:'💰 计费摘要', ko:'💰 결제 요약' },
    'hq.map':                 { ja:'🗺 店舗マップ', en:'🗺 Shop Map', zh:'🗺 店铺地图', ko:'🗺 매장 지도' },
    'hq.metrics':             { ja:'📊 業務効率 指標', en:'📊 Operational Metrics', zh:'📊 业务效率指标', ko:'📊 업무 효율 지표' },
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

  /* 既存日本語文字列 → translation key の動的逆引きマップ
     既存コードを書き換えずに showToast(msg) → showToast(tt(msg)) で翻訳可能に */
  const JA_TO_KEY = {};
  Object.keys(TRANSLATIONS).forEach(function(key) {
    const entry = TRANSLATIONS[key];
    if (entry.ja && !JA_TO_KEY[entry.ja]) JA_TO_KEY[entry.ja] = key;
  });
  function tt(jaText) {
    if (!jaText || typeof jaText !== 'string') return jaText;
    const key = JA_TO_KEY[jaText.trim()];
    if (key) return t(key);
    return jaText;
  }

  /* グローバルAPI */
  window.RakuI18n = {
    t: t,
    tt: tt,
    setLang: setLang,
    getLang: getLang,
    apply: applyTranslations,
    buildSwitcher: buildLangSwitcher,
    supported: SUPPORTED_LANGS,
  };
})(window);
