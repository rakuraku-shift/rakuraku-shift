/* ══════════════════════════════════════════
   RAKURAKU i18n (国際化)
   サポート言語: ja (日本語) / en (English) / zh (中文) / ko (한국어) / vi (Tiếng Việt)
   既存の 240+ エントリは vi: が未追加のものは英語にフォールバック (translate() で自動)
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
    'common.registered': { ja:'登録済み', en:'Registered', zh:'已注册', ko:'등록됨', vi:'Đã đăng ký' },
    'common.or': { ja:'または', en:'or', zh:'或', ko:'또는', vi:'hoặc' },

    /* ─── ボタン btn.* ─── */
    'btn.save': { ja:'💾 保存する', en:'💾 Save', zh:'💾 保存', ko:'💾 저장', vi:'💾 Lưu' },
    'btn.edit': { ja:'編集する', en:'Edit', zh:'编辑', ko:'편집', vi:'Sửa' },

    /* ─── 給与 pw.* ─── */
    'pw.view_personal': { ja:'💴 このスタッフの個人給与を見る',
                          en:'💴 View this staff member\'s personal payroll',
                          zh:'💴 查看此员工的个人薪资',
                          ko:'💴 이 직원의 개인 급여 보기',
                          vi:'💴 Xem lương cá nhân nhân viên này' },

    /* ─── 評価 eval.* ─── */
    'eval.save': { ja:'💾 評価を保存',
                   en:'💾 Save Evaluation',
                   zh:'💾 保存评价',
                   ko:'💾 평가 저장',
                   vi:'💾 Lưu đánh giá' },

    /* ─── ライセンス lic.* ─── */
    'lic.authenticate': { ja:'認証する →', en:'Authenticate →', zh:'认证 →', ko:'인증 →', vi:'Xác thực →' },
    'lic.admin_login': { ja:'🔑 管理者としてログイン（PIN）',
                         en:'🔑 Login as Admin (PIN)',
                         zh:'🔑 以管理员身份登录（PIN）',
                         ko:'🔑 관리자로 로그인 (PIN)',
                         vi:'🔑 Đăng nhập Admin (PIN)' },

    /* ─── 店長 mgr.* 追加 ─── */
    'mgr.bulk_send': { ja:'📨 まとめて一括送信する',
                       en:'📨 Send All at Once',
                       zh:'📨 一次性发送全部',
                       ko:'📨 일괄 전송',
                       vi:'📨 Gửi tất cả cùng lúc' },

    /* ─── 時間帯 tp.* ─── */
    'tp.morning': { ja:'朝', en:'Morning', zh:'早班', ko:'아침', vi:'Sáng' },
    'tp.lunch': { ja:'昼', en:'Lunch', zh:'午班', ko:'점심', vi:'Trưa' },
    'tp.evening': { ja:'夜', en:'Evening', zh:'晚班', ko:'저녁', vi:'Tối' },
    'tp.morning_time': { ja:'〜12:00まで出勤', en:'Until 12:00', zh:'12:00 之前到岗', ko:'12:00까지 출근', vi:'Vào trước 12:00' },
    'tp.lunch_time': { ja:'12:00〜17:00に出勤', en:'12:00 to 17:00', zh:'12:00-17:00 到岗', ko:'12:00-17:00 출근', vi:'12:00-17:00' },
    'tp.evening_time': { ja:'17:00以降に出勤', en:'After 17:00', zh:'17:00 之后到岗', ko:'17:00 이후 출근', vi:'Sau 17:00' },
    'common.persons': { ja:'名', en:'persons', zh:'人', ko:'명', vi:'người' },

    /* ─── 評価 eval.* 追加 ─── */
    'eval.overall': { ja:'総合評価', en:'Overall Rating', zh:'综合评价', ko:'종합 평가', vi:'Đánh giá tổng' },
    'eval.skills': { ja:'ポジション別スキル', en:'Skills by Position', zh:'按职位的技能', ko:'포지션별 스킬', vi:'Kỹ năng theo vị trí' },
    'eval.memo_label': { ja:'メモ（管理者のみ表示）', en:'Memo (Admin only)', zh:'备忘录（仅管理员可见）', ko:'메모 (관리자만 표시)', vi:'Ghi chú (Chỉ admin)' },

    /* ─── パスワード pw.* 追加 ─── */
    'pw.confirm_again': { ja:'確認のためもう一度',
                          en:'Re-enter to Confirm',
                          zh:'请再次输入确认',
                          ko:'확인을 위해 다시 입력',
                          vi:'Nhập lại để xác nhận' },

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

    /* ─── シフト管理タブ・ナビゲーション ─── */
    'mgr.tab_dashboard': { ja:'ダッシュボード', en:'Dashboard', zh:'仪表板', ko:'대시보드', vi:'Bảng điều khiển' },
    'mgr.tab_shifts': { ja:'シフト管理', en:'Shifts', zh:'班次管理', ko:'시프트 관리', vi:'Quản lý ca' },
    'mgr.tab_staff': { ja:'スタッフ', en:'Staff', zh:'员工', ko:'직원', vi:'Nhân viên' },
    'mgr.tab_payroll': { ja:'給与・売上', en:'Payroll & Sales', zh:'工资·营业额', ko:'급여·매출', vi:'Lương & Doanh thu' },
    'mgr.tab_deadline': { ja:'締切・リマインド', en:'Deadline', zh:'截止·提醒', ko:'마감·리마인드', vi:'Hạn chót' },
    'mgr.tab_survey': { ja:'アンケート', en:'Survey', zh:'问卷', ko:'설문', vi:'Khảo sát' },
    'mgr.tab_all': { ja:'全表示', en:'All', zh:'全部显示', ko:'전체 표시', vi:'Tất cả' },
    'mgr.prev_month': { ja:'‹ 前月', en:'‹ Prev', zh:'‹ 上月', ko:'‹ 이전 달', vi:'‹ Tháng trước' },
    'mgr.next_month': { ja:'翌月 ›', en:'Next ›', zh:'下月 ›', ko:'다음 달 ›', vi:'Tháng sau ›' },
    'mgr.this_month': { ja:'今月', en:'This Month', zh:'本月', ko:'이번 달', vi:'Tháng này' },

    /* ─── スタッフ登録メール一覧 ─── */
    'mgr.staff_registry_title': { ja:'📇 スタッフ登録メール一覧', en:'📇 Staff Registered Emails', zh:'📇 员工注册邮箱列表', ko:'📇 직원 등록 이메일 목록', vi:'📇 Email nhân viên đã đăng ký' },
    'mgr.staff_registry_desc': { ja:'アルバイトがシフト提出時に登録したメールアドレス。内部募集・リマインドに使用されます。',
                                  en:'Email addresses staff registered when submitting shifts. Used for internal recruiting and reminders.',
                                  zh:'员工提交班次时注册的邮箱地址。用于内部招聘和提醒。',
                                  ko:'직원이 시프트 제출 시 등록한 이메일 주소. 내부 모집·리마인드에 사용됩니다.',
                                  vi:'Địa chỉ email nhân viên đã đăng ký khi nộp ca. Dùng cho tuyển dụng nội bộ và nhắc nhở.' },
    'mgr.refresh': { ja:'🔄 更新', en:'🔄 Refresh', zh:'🔄 刷新', ko:'🔄 새로고침', vi:'🔄 Làm mới' },
    'mgr.delete_all': { ja:'🗑 全削除', en:'🗑 Delete All', zh:'🗑 全部删除', ko:'🗑 전체 삭제', vi:'🗑 Xóa tất cả' },
    'mgr.position_not_set': { ja:'⚠️ ポジション未設定', en:'⚠️ Position Not Set', zh:'⚠️ 岗位未设定', ko:'⚠️ 포지션 미설정', vi:'⚠️ Chưa đặt vị trí' },
    'mgr.payroll_not_set': { ja:'未設定', en:'Not Set', zh:'未设定', ko:'미설정', vi:'Chưa đặt' },
    'mgr.payroll_setting': { ja:'💴 給与設定', en:'💴 Payroll', zh:'💴 工资设定', ko:'💴 급여 설정', vi:'💴 Cài đặt lương' },
    'mgr.not_registered': { ja:'未登録', en:'Not Registered', zh:'未注册', ko:'미등록', vi:'Chưa đăng ký' },

    /* ─── 役職 (role) ─── */
    'role.hall': { ja:'ホール', en:'Hall', zh:'前厅', ko:'홀', vi:'Phòng khách' },
    'role.kitchen': { ja:'キッチン', en:'Kitchen', zh:'厨房', ko:'주방', vi:'Bếp' },
    'role.cashier': { ja:'レジ', en:'Cashier', zh:'收银', ko:'계산대', vi:'Thu ngân' },
    'role.unassigned': { ja:'未設定', en:'Unassigned', zh:'未分配', ko:'미배정', vi:'Chưa phân công' },
    'mgr.position_supported': { ja:'ポジション対応', en:'positions supported', zh:'岗位支持', ko:'포지션 지원', vi:'vị trí hỗ trợ' },
    'mgr.subtitle': { ja:'― 提出データをリアルタイムで確認', en:'― Review submitted data in real-time', zh:'― 实时查看提交数据', ko:'― 제출 데이터를 실시간으로 확인', vi:'― Xem dữ liệu đã nộp theo thời gian thực' },
    'mgr.badge_sync': { ja:'データ同期中', en:'Data Sync', zh:'数据同步', ko:'데이터 동기화', vi:'Đồng bộ dữ liệu' },
    'mgr.badge_auto': { ja:'自動生成対応', en:'Auto-Generate', zh:'自动生成', ko:'자동 생성', vi:'Tự động tạo' },
    'mgr.badge_mail': { ja:'メール通知', en:'Email Alerts', zh:'邮件通知', ko:'이메일 알림', vi:'Thông báo email' },
    'mgr.realtime_attendance': { ja:'⏰ 本日の出退勤（リアルタイム）', en:'⏰ Today\'s Attendance (Real-time)', zh:'⏰ 今日出勤（实时）', ko:'⏰ 오늘의 출퇴근 (실시간)', vi:'⏰ Chấm công hôm nay (Thời gian thực)' },
    'mgr.staff_evaluation': { ja:'スタッフ評価', en:'Staff Evaluation', zh:'员工评价', ko:'직원 평가', vi:'Đánh giá nhân viên' },
    'mgr.no_data': { ja:'データがありません', en:'No data', zh:'无数据', ko:'데이터가 없습니다', vi:'Không có dữ liệu' },
    'mgr.money_this_month': { ja:'📊 今月のお金まわり ひと目チェック', en:'📊 This Month\'s Finances at a Glance', zh:'📊 一目了然查看本月财务', ko:'📊 이번 달 자금 흐름 한눈에 확인', vi:'📊 Tài chính tháng này' },
    'mgr.expected_payroll': { ja:'今月の予想給与', en:'Expected Payroll This Month', zh:'本月预计工资', ko:'이번 달 예상 급여', vi:'Lương dự kiến tháng này' },
    'mgr.man_yen': { ja:'万円', en:'10K yen', zh:'万日元', ko:'만엔', vi:'vạn yên' },

    /* ─── スタッフ提出画面 (staff view) ─── */
    'staff.title': { ja:'シフト提出', en:'Submit Shift', zh:'提交班次', ko:'시프트 제출', vi:'Nộp ca làm' },
    'staff.sub': { ja:'希望の勤務日・時間帯を入力して提出してください', en:'Enter your preferred work days and times', zh:'请输入您希望的工作日和时间段', ko:'희망 근무일과 시간대를 입력해 제출해 주세요', vi:'Nhập ngày làm và khung giờ mong muốn rồi nộp' },

    /* ─── 締切・リマインド ─── */
    'rem.title_full': { ja:'⏰ 締切・リマインド管理', en:'⏰ Deadline & Reminders', zh:'⏰ 截止·提醒管理', ko:'⏰ 마감·리마인드 관리', vi:'⏰ Quản lý hạn chót & nhắc nhở' },

    /* ─── アンケート ─── */
    'survey.title': { ja:'📊 シフト後アンケート', en:'📊 Post-Shift Survey', zh:'📊 班次后问卷', ko:'📊 시프트 후 설문', vi:'📊 Khảo sát sau ca làm' },

    /* ─── サイト全体ナビ ─── */
    'nav.home': { ja:'ホーム', en:'Home', zh:'首页', ko:'홈', vi:'Trang chủ' },
    'nav.shift_management': { ja:'シフト管理', en:'Shift Management', zh:'班次管理', ko:'시프트 관리', vi:'Quản lý ca' },
    'nav.help': { ja:'ヘルプ', en:'Help', zh:'帮助', ko:'도움말', vi:'Trợ giúp' },
    'nav.settings': { ja:'設定', en:'Settings', zh:'设置', ko:'설정', vi:'Cài đặt' },

    /* ─── シフト提出フォーム チェックリスト ─── */
    'sf.chk_name': { ja:'氏名を入力する', en:'Enter your name', zh:'输入您的姓名', ko:'이름 입력', vi:'Nhập tên của bạn' },
    'sf.chk_dates': { ja:'希望日を選択する', en:'Select preferred dates', zh:'选择希望日期', ko:'희망일 선택', vi:'Chọn ngày mong muốn' },
    'sf.chk_times': { ja:'希望時間帯を選択する', en:'Select preferred time slots', zh:'选择希望时间段', ko:'희망 시간대 선택', vi:'Chọn khung giờ mong muốn' },
    'sf.anonymous': { ja:'匿名送信', en:'Anonymous', zh:'匿名提交', ko:'익명 전송', vi:'Gửi ẩn danh' },
    'sf.eval_title': { ja:'職場評価<br>アンケート', en:'Workplace<br>Evaluation', zh:'职场评价<br>问卷', ko:'직장 평가<br>설문', vi:'Đánh giá<br>nơi làm' },
    'sf.eval_step1': { ja:'各項目を評価', en:'Rate Each Item', zh:'评价各项目', ko:'각 항목 평가', vi:'Đánh giá từng mục' },
    'sf.comment': { ja:'コメント', en:'Comment', zh:'评论', ko:'코멘트', vi:'Bình luận' },
    'sf.comment_sub': { ja:'自由にご意見をどうぞ', en:'Share your thoughts freely', zh:'请自由分享您的意见', ko:'자유롭게 의견을 남겨주세요', vi:'Hãy chia sẻ ý kiến tự do' },

    /* ─── 統計バッジ・ラベル ─── */
    'stat.submitted_count': { ja:'提出人数', en:'Submitted', zh:'提交人数', ko:'제출 인원', vi:'Đã nộp' },
    'stat.target_days': { ja:'対象日数', en:'Target Days', zh:'目标天数', ko:'대상 일수', vi:'Số ngày' },
    'stat.assigned': { ja:'配置済み', en:'Assigned', zh:'已分配', ko:'배치 완료', vi:'Đã phân ca' },

    /* ─── 主要ボタン (続き) ─── */
    'btn.change': { ja:'変更する', en:'Change', zh:'更改', ko:'변경', vi:'Thay đổi' },
    'btn.reset': { ja:'リセット', en:'Reset', zh:'重置', ko:'리셋', vi:'Đặt lại' },
    'btn.delete': { ja:'削除', en:'Delete', zh:'删除', ko:'삭제', vi:'Xóa' },
    'btn.edit': { ja:'編集', en:'Edit', zh:'编辑', ko:'편집', vi:'Sửa' },
    'btn.back': { ja:'戻る', en:'Back', zh:'返回', ko:'뒤로', vi:'Quay lại' },
    'btn.next': { ja:'次へ', en:'Next', zh:'下一步', ko:'다음', vi:'Tiếp' },

    /* ─── 売上・給与 ─── */
    'mgr.sales_explain': { ja:'月次の目標と実績だけ簡易入力。日別の詳細は売上取込ページから',
                            en:'Enter monthly target and actuals only. Daily details from the Sales Import page.',
                            zh:'仅输入月度目标和实际数据。每日详细信息可在销售导入页面查看。',
                            ko:'월간 목표·실적만 간단 입력. 일별 상세는 매출 가져오기 페이지에서.',
                            vi:'Chỉ nhập mục tiêu và thực tế hàng tháng. Chi tiết hàng ngày từ trang nhập doanh thu.' },
    'mgr.sales_import_link': { ja:'売上取込ページ', en:'Sales Import', zh:'销售导入页面', ko:'매출 가져오기', vi:'Trang nhập doanh thu' },
    'mgr.rec_recruiting': { ja:'募集中', en:'Recruiting', zh:'招募中', ko:'모집 중', vi:'Đang tuyển' },
    'mgr.all_staff_total': { ja:'全スタッフ合計', en:'All Staff Total', zh:'全员合计', ko:'전 직원 합계', vi:'Tổng tất cả nhân viên' },

    /* ─── 給与計算説明 ─── */
    'mgr.payroll_explain': { ja:'提出シフトと給与設定から、深夜割増（22:00〜翌5:00 +25%）込みの月額を自動計算します。',
                              en:'Auto-calculates monthly pay including night premium (22:00–5:00 next day +25%) from submitted shifts and wage settings.',
                              zh:'根据提交的班次和工资设定，自动计算包含夜班加成（22:00–次日5:00 +25%）的月度工资。',
                              ko:'제출된 시프트와 급여 설정에서 야간 수당(22:00–익일 5:00 +25%) 포함 월 급여를 자동 계산합니다.',
                              vi:'Tự động tính lương tháng bao gồm phụ cấp đêm (22:00–5:00 hôm sau +25%) từ ca làm đã nộp và cài đặt lương.' },

    /* ─── 時間帯設定 ─── */
    'mgr.timeslot_explain': { ja:'各時間帯の下限〜上限を設定してください。下限未達なら警告、上限超は要調整。',
                               en:'Set lower and upper limits per time slot. Below lower → warning; above upper → adjustment needed.',
                               zh:'请设置各时段的下限~上限。低于下限会警告，超过上限需调整。',
                               ko:'각 시간대 하한~상한을 설정하세요. 하한 미달은 경고, 상한 초과는 조정 필요.',
                               vi:'Đặt giới hạn dưới ~ trên cho mỗi khung giờ. Dưới mức tối thiểu sẽ cảnh báo; trên tối đa cần điều chỉnh.' },

    /* ─── おすすめする / 場合による / しない ─── */
    'rec.yes': { ja:'👍<br>おすすめする', en:'👍<br>Recommend', zh:'👍<br>推荐', ko:'👍<br>추천함', vi:'👍<br>Đề xuất' },
    'rec.maybe': { ja:'🤔<br>場合による', en:'🤔<br>Depends', zh:'🤔<br>视情况', ko:'🤔<br>경우에 따라', vi:'🤔<br>Tùy lúc' },
    'rec.no': { ja:'👎<br>しない', en:'👎<br>No', zh:'👎<br>不推荐', ko:'👎<br>않음', vi:'👎<br>Không' },

    /* ─── その他のシフト管理ラベル ─── */
    'mgr.no_submissions_yet': { ja:'まだ提出がありません', en:'No submissions yet', zh:'尚无提交', ko:'아직 제출이 없습니다', vi:'Chưa có nội dung nộp' },
    'mgr.daily_sales_import': { ja:'日別売上取込', en:'Daily Sales Import', zh:'每日销售导入', ko:'일별 매출 가져오기', vi:'Nhập doanh thu hàng ngày' },
    'mgr.staff_monthly': { ja:'スタッフ別月次', en:'Monthly by Staff', zh:'按员工月度', ko:'직원별 월간', vi:'Hàng tháng theo nhân viên' },
    'mgr.one_tap_generate': { ja:'ワンタップでシフト作成', en:'One-Tap Generate', zh:'一键生成班次', ko:'원탭 시프트 생성', vi:'Tạo ca 1 chạm' },
    'mgr.shift_table_title': { ja:'シフト表', en:'Shift Table', zh:'班次表', ko:'시프트표', vi:'Bảng ca làm' },

    /* ─── パスワード関連 ─── */
    'pw.first_setup_title': { ja:'初回パスワード設定', en:'First-Time Password Setup', zh:'首次密码设置', ko:'첫 비밀번호 설정', vi:'Đặt mật khẩu lần đầu' },
    'pw.first_setup_hint': { ja:'このパスワードはあなたの端末にハッシュ化して保存されます。',
                              en:'This password will be hashed and stored on your device.',
                              zh:'此密码将经过哈希处理后保存在您的设备上。',
                              ko:'이 비밀번호는 해시 처리되어 귀하의 기기에 저장됩니다.',
                              vi:'Mật khẩu này sẽ được mã hóa và lưu trên thiết bị của bạn.' },
    'pw.confirm_again': { ja:'確認のためもう一度', en:'Confirm Again', zh:'请再次确认', ko:'확인을 위해 한 번 더', vi:'Xác nhận lại' },
    'pw.password': { ja:'パスワード', en:'Password', zh:'密码', ko:'비밀번호', vi:'Mật khẩu' },
    'pw.view_payroll_title': { ja:'給与情報の閲覧', en:'View Payroll Info', zh:'查看工资信息', ko:'급여 정보 조회', vi:'Xem thông tin lương' },
    'pw.view_payroll_hint': { ja:'設定済みの個人パスワードを入力してください。',
                               en:'Please enter your personal password that you set up.',
                               zh:'请输入您设置的个人密码。',
                               ko:'설정한 개인 비밀번호를 입력해 주세요.',
                               vi:'Vui lòng nhập mật khẩu cá nhân đã đặt.' },

    /* ─── 勤務日数・登録済み 等 ─── */
    'mgr.work_days': { ja:'勤務日数', en:'Work Days', zh:'工作天数', ko:'근무일수', vi:'Số ngày làm' },
    'mgr.registered': { ja:'登録済み', en:'Registered', zh:'已登记', ko:'등록 완료', vi:'Đã đăng ký' },
    'mgr.work_hours': { ja:'勤務時間', en:'Work Hours', zh:'工作时间', ko:'근무 시간', vi:'Giờ làm' },
    'mgr.night_hours': { ja:'深夜時間', en:'Night Hours', zh:'夜班时间', ko:'야간 시간', vi:'Giờ đêm' },
    'mgr.overall_rating': { ja:'総合評価', en:'Overall Rating', zh:'综合评价', ko:'종합 평가', vi:'Đánh giá tổng' },
    'mgr.position_skills': { ja:'ポジション別スキル', en:'Skills by Position', zh:'各岗位技能', ko:'포지션별 스킬', vi:'Kỹ năng theo vị trí' },
    'mgr.external_recruit': { ja:'外部求人配信', en:'External Job Posting', zh:'外部招聘发布', ko:'외부 구인 게시', vi:'Đăng tuyển bên ngoài' },
    'mgr.external_recruit_sub': { ja:'人手不足のシフトを自動で募集', en:'Auto-post understaffed shifts', zh:'自动招募人手不足的班次', ko:'인력 부족 시프트 자동 모집', vi:'Tự đăng ca thiếu người' },
    'mgr.internal_recruit': { ja:'自社スタッフ内部募集', en:'Internal Staff Posting', zh:'内部员工招募', ko:'내부 직원 모집', vi:'Tuyển nội bộ' },
    'mgr.job_details': { ja:'求人内容', en:'Job Details', zh:'招聘内容', ko:'구인 내용', vi:'Chi tiết tuyển' },
    'mgr.until_tomorrow': { ja:'明日まで', en:'Until Tomorrow', zh:'到明天', ko:'내일까지', vi:'Đến mai' },
    'common.or': { ja:'または', en:'or', zh:'或', ko:'또는', vi:'hoặc' },
    'mgr.gate_pin_required': { ja:'シフト管理へのアクセスには<br>PINが必要です', en:'Access to Shift Management<br>requires a PIN', zh:'访问班次管理<br>需要 PIN 码', ko:'시프트 관리 접근에는<br>PIN이 필요합니다', vi:'Truy cập Quản lý ca<br>cần mã PIN' },
    'mgr.hourly_wage': { ja:'時給', en:'Hourly Wage', zh:'时薪', ko:'시급', vi:'Lương theo giờ' },
    'mgr.last_month_result': { ja:'先月実績', en:'Last Month Actual', zh:'上月实绩', ko:'지난달 실적', vi:'Thực tế tháng trước' },
    'mgr.adjustment_explain': { ja:'新規募集する前に、既にシフト提出してくれているスタッフに<strong>時間調整をお願いするメール</strong>を送れます。',
                                 en:'Before posting new jobs, send <strong>time adjustment request emails</strong> to staff who already submitted shifts.',
                                 zh:'在新增招聘前，可向已提交班次的员工<strong>发送时间调整请求邮件</strong>。',
                                 ko:'신규 모집 전, 이미 시프트를 제출한 직원에게 <strong>시간 조정을 요청하는 이메일</strong>을 보낼 수 있습니다.',
                                 vi:'Trước khi tuyển mới, gửi <strong>email yêu cầu điều chỉnh giờ</strong> đến nhân viên đã nộp ca.' },
    'common.min': { ja:'最低', en:'Min', zh:'最低', ko:'최저', vi:'Tối thiểu' },
    'common.max': { ja:'最大', en:'Max', zh:'最大', ko:'최대', vi:'Tối đa' },

    /* ─── 創業メンバー 100 店舗プログラム ─── */
    'founders.eyebrow': { ja:'FOUNDING 100 MEMBERS  ·  創業メンバー募集',
                           en:'FOUNDING 100 MEMBERS  ·  Recruiting',
                           zh:'FOUNDING 100 MEMBERS  ·  招募创始会员',
                           ko:'FOUNDING 100 MEMBERS  ·  창업 멤버 모집',
                           vi:'FOUNDING 100 MEMBERS  ·  Tuyển thành viên sáng lập' },
    'founders.title': { ja:'創業メンバー 100 店舗様、<br>Pro プランを <span class="grad">1 年間 完全無料</span>',
                         en:'Founding 100 stores get the<br>Pro plan <span class="grad">FREE for 1 year</span>',
                         zh:'创业初期 100 家店铺，<br>Pro 套餐 <span class="grad">1 年完全免费</span>',
                         ko:'창업 멤버 100 매장 한정,<br>Pro 플랜 <span class="grad">1 년간 완전 무료</span>',
                         vi:'100 cửa hàng sáng lập,<br>Pro <span class="grad">miễn phí 1 năm</span>' },
    'founders.cta_apply': { ja:'今すぐ申し込む (無料)', en:'Apply Now (Free)', zh:'立即申请 (免费)', ko:'지금 신청 (무료)', vi:'Đăng ký ngay (Miễn phí)' },
    'founders.seats_remaining': { ja:'残り席数', en:'Seats Remaining', zh:'剩余席位', ko:'남은 자리', vi:'Số chỗ còn' },
    'founders.deadline_until': { ja:'締切まで', en:'Until Deadline', zh:'距截止', ko:'마감까지', vi:'Còn lại' },
    'founders.days': { ja:'日', en:'Days', zh:'天', ko:'일', vi:'Ngày' },
    'founders.hours': { ja:'時間', en:'Hours', zh:'小时', ko:'시간', vi:'Giờ' },
    'founders.benefits_title': { ja:'創業メンバー <span class="grad">4 つの特典</span>', en:'Founding Members get <span class="grad">4 Benefits</span>', zh:'创始会员的 <span class="grad">4 项特典</span>', ko:'창업 멤버 <span class="grad">4 가지 특전</span>', vi:'<span class="grad">4 ưu đãi</span> cho Thành viên sáng lập' },
    'founders.benefits_sub': { ja:'個人店も多店舗チェーンも、すべて対象です', en:'Both individual stores and chains qualify', zh:'个人店和连锁店均可申请', ko:'개인 매장도 다점포 체인도 모두 대상', vi:'Áp dụng cho cả cửa hàng cá nhân và chuỗi' },
    'founders.benefit1_title': { ja:'Pro プラン 1 年間 無料', en:'Pro Plan Free for 1 Year', zh:'Pro 套餐 1 年免费', ko:'Pro 플랜 1 년 무료', vi:'Pro miễn phí 1 năm' },
    'founders.benefit1_desc': { ja:'全機能フル開放 (シフト自動作成・GPS打刻・労基法アラート・多言語・売上分析)。1 年間ご請求は発生しません。',
                                 en:'All features unlocked (auto-shift, GPS punch, labor law alerts, multi-language, sales analytics). No charges for 1 full year.',
                                 zh:'全功能开放（自动排班、GPS打卡、劳基法警报、多语言、销售分析）。1 年内不收取任何费用。',
                                 ko:'모든 기능 풀 오픈 (자동 시프트, GPS 타각, 노동법 알림, 다국어, 매출 분석). 1 년 동안 청구 없음.',
                                 vi:'Mở khóa tất cả tính năng (ca tự động, chấm công GPS, cảnh báo luật lao động, đa ngôn ngữ, phân tích doanh thu). Không tính phí trong 1 năm.' },
    'founders.benefit2_title': { ja:'初期セットアップ 無料', en:'Free Initial Setup', zh:'免费初始设置', ko:'초기 셋업 무료', vi:'Cài đặt ban đầu miễn phí' },
    'founders.benefit2_desc': { ja:'店舗情報・スタッフ登録・LINE連携・既存データインポート、すべて代表が直接サポートします。',
                                 en:'Store info, staff registration, LINE integration, data import — all supported personally by the founder.',
                                 zh:'店铺信息、员工登记、LINE 集成、数据导入，全部由代表亲自支持。',
                                 ko:'매장 정보, 직원 등록, LINE 연동, 기존 데이터 가져오기, 모든 것을 대표가 직접 지원.',
                                 vi:'Thông tin cửa hàng, đăng ký nhân viên, tích hợp LINE, nhập dữ liệu — tất cả do người sáng lập hỗ trợ trực tiếp.' },
    'founders.benefit3_title': { ja:'スタッフ説明会 無料', en:'Free Staff Training', zh:'免费员工说明会', ko:'직원 설명회 무료', vi:'Đào tạo nhân viên miễn phí' },
    'founders.benefit3_desc': { ja:'Zoom 30 分でスタッフ様向けの説明会を実施。多言語対応 (英・中・韓・越) も可能です。',
                                 en:'30-min Zoom training session for your staff. Multi-language (En/Zh/Ko/Vi) available.',
                                 zh:'30 分钟 Zoom 员工说明会。支持多语言（英、中、韩、越）。',
                                 ko:'30 분 Zoom 직원 설명회 실시. 다국어 대응 (영·중·한·베) 가능.',
                                 vi:'30 phút đào tạo nhân viên qua Zoom. Hỗ trợ đa ngôn ngữ (Anh/Trung/Hàn/Việt).' },
    'founders.benefit4_title': { ja:'創業メンバー認定', en:'Founding Member Status', zh:'创始会员认证', ko:'창업 멤버 인정', vi:'Xác nhận thành viên sáng lập' },
    'founders.benefit4_price': { ja:'特別', en:'Special', zh:'特别', ko:'특별', vi:'Đặc biệt' },
    'founders.benefit4_desc': { ja:'会社情報ページに「創業 100 店舗」としてお店をご紹介 (任意・許諾済みのみ)。今後の機能要望は <strong>優先実装</strong>。',
                                 en:'Your store featured as one of the "Founding 100" (optional, with permission). Feature requests get <strong>priority implementation</strong>.',
                                 zh:'在公司信息页面以"创始 100 家"形式介绍您的店铺（自愿、需同意）。功能需求<strong>优先实施</strong>。',
                                 ko:'회사 정보 페이지에 "창업 100 매장"으로 매장 소개 (선택·동의 시). 향후 기능 요청은 <strong>우선 구현</strong>.',
                                 vi:'Cửa hàng của bạn được giới thiệu như "100 cửa hàng sáng lập" (tùy chọn, có sự đồng ý). Yêu cầu tính năng được <strong>ưu tiên triển khai</strong>.' },

    /* ─── デモ体験 (demo-experience.html) ─── */
    'demo.badge': { ja:'🎬 IMMERSIVE EXPERIENCE', en:'🎬 IMMERSIVE EXPERIENCE', zh:'🎬 沉浸式体验', ko:'🎬 몰입형 체험', vi:'🎬 TRẢI NGHIỆM THỰC' },
    'demo.title': { ja:'30 分で<span class="grad">店舗運営を疑似体験</span>',
                     en:'Simulate <span class="grad">running your store</span> in 30 min',
                     zh:'30 分钟<span class="grad">模拟店铺运营</span>',
                     ko:'30 분 만에 <span class="grad">매장 운영 체험</span>',
                     vi:'<span class="grad">Mô phỏng cửa hàng</span> trong 30 phút' },
    'demo.lead': { ja:'あなたのお店の情報を入力して、シフト自動作成 → 給与計算 → 労基法アラートまで本物と同じ流れで触ってみてください。',
                    en:'Enter your store info and experience the real flow: auto-shift → payroll → labor law alerts.',
                    zh:'输入您的店铺信息，体验真实流程：自动排班 → 工资计算 → 劳基法警报。',
                    ko:'매장 정보를 입력해 실제 흐름을 체험하세요: 자동 시프트 → 급여 → 노동법 알림.',
                    vi:'Nhập thông tin cửa hàng để trải nghiệm thực: ca tự động → lương → cảnh báo luật.' },
    'demo.s1_title': { ja:'🏪 まずはあなたのお店の情報', en:'🏪 Start with your store info', zh:'🏪 先输入您的店铺信息', ko:'🏪 매장 정보부터', vi:'🏪 Bắt đầu với thông tin cửa hàng' },
    'demo.s1_sub': { ja:'店舗名と営業時間を入力してください。シフト作成の基準になります。',
                      en:'Enter store name and hours. This forms the basis for shift creation.',
                      zh:'请输入店铺名称和营业时间。这将作为排班的基础。',
                      ko:'매장명과 영업시간을 입력하세요. 시프트 작성의 기준이 됩니다.',
                      vi:'Nhập tên cửa hàng và giờ mở. Đây là cơ sở để tạo ca.' },
    'demo.s2_title': { ja:'👥 スタッフを 5〜10 名登録', en:'👥 Register 5-10 staff', zh:'👥 登记 5-10 名员工', ko:'👥 직원 5-10 명 등록', vi:'👥 Đăng ký 5-10 nhân viên' },
    'demo.s2_sub': { ja:'名前 / ポジション / 時給を入力してください。「サンプル一括追加」で 5 名分が一瞬で入ります。',
                      en:'Enter name / position / hourly wage. Use "Add Sample 5" to populate 5 staff instantly.',
                      zh:'输入姓名/岗位/时薪。点击"添加 5 个样本"瞬间录入 5 名员工。',
                      ko:'이름 / 포지션 / 시급 입력. "샘플 5 명 일괄 추가"로 5 명을 한 번에.',
                      vi:'Nhập tên / vị trí / lương giờ. "Thêm 5 mẫu" để có 5 nhân viên ngay.' },
    'demo.s3_title': { ja:'⚡ AI が 1 週間分のシフトを自動作成 <span class="ai-badge">AI</span>',
                        en:'⚡ AI auto-generates a week\'s shift <span class="ai-badge">AI</span>',
                        zh:'⚡ AI 自动生成一周班次 <span class="ai-badge">AI</span>',
                        ko:'⚡ AI 가 1 주일 시프트 자동 작성 <span class="ai-badge">AI</span>',
                        vi:'⚡ AI tạo ca tự động 1 tuần <span class="ai-badge">AI</span>' },
    'demo.s3_sub': { ja:'登録したスタッフ・ポジション・時給を元に、最適なシフトが自動で組まれます。',
                      en:'Based on registered staff, positions, and wages, the optimal shift is generated automatically.',
                      zh:'根据已登记的员工、岗位、时薪，自动生成最优班次。',
                      ko:'등록된 직원 · 포지션 · 시급을 기반으로 최적 시프트가 자동 생성.',
                      vi:'Dựa trên nhân viên/vị trí/lương đã đăng ký, ca tối ưu được tạo tự động.' },
    'demo.s4_title': { ja:'💰 月間給与の予想', en:'💰 Monthly Payroll Estimate', zh:'💰 月度工资预估', ko:'💰 월 급여 예상', vi:'💰 Lương tháng dự kiến' },
    'demo.s4_sub': { ja:'深夜手当 (+25%) を自動加算した、月額の予想給与です。',
                      en:'Monthly payroll with night premium (+25%) auto-calculated.',
                      zh:'自动加算夜班补贴（+25%）的月度预算工资。',
                      ko:'야간 수당 (+25%) 자동 가산된 월 예상 급여.',
                      vi:'Lương tháng đã tự động cộng phụ cấp đêm (+25%).' },
    'demo.s5_title': { ja:'📊 売上 × 人件費比率', en:'📊 Sales × Labor Cost Ratio', zh:'📊 销售额 × 人工成本比率', ko:'📊 매출 × 인건비 비율', vi:'📊 Tỷ lệ Doanh thu × Lương' },
    'demo.s5_sub': { ja:'月間売上の見込みを入力すると、人件費率が分かります。業界平均は 28〜32%。',
                      en:'Enter expected monthly sales to see your labor cost ratio. Industry avg is 28-32%.',
                      zh:'输入预计月销售额查看人工成本率。行业平均为 28-32%。',
                      ko:'예상 월매출을 입력하면 인건비율이 보입니다. 업계 평균 28-32%.',
                      vi:'Nhập doanh thu dự kiến để xem tỷ lệ lương. Trung bình ngành 28-32%.' },
    'demo.s6_title': { ja:'⚖️ 労基法アラートをチェック', en:'⚖️ Check Labor Law Alerts', zh:'⚖️ 检查劳基法警报', ko:'⚖️ 노동법 알림 확인', vi:'⚖️ Kiểm tra cảnh báo luật' },
    'demo.s6_sub': { ja:'作成したシフトに労基法違反のリスクがないか、システムが自動チェックします。',
                      en:'System automatically checks for labor law violation risks in the generated shift.',
                      zh:'系统自动检查生成的班次是否存在劳基法违规风险。',
                      ko:'생성된 시프트에 노동법 위반 리스크가 없는지 자동 확인.',
                      vi:'Hệ thống tự kiểm tra rủi ro vi phạm luật trong ca đã tạo.' },
    'demo.s7_title': { ja:'📱 スタッフ側の画面 (多言語対応)', en:'📱 Staff App (Multi-language)', zh:'📱 员工端界面（多语言）', ko:'📱 직원 화면 (다국어)', vi:'📱 App nhân viên (Đa ngôn ngữ)' },
    'demo.s7_sub': { ja:'あなたのスタッフが見る画面です。外国人スタッフは母国語で操作可能。',
                      en:'This is what your staff sees. Foreign staff can use in their native language.',
                      zh:'这是您的员工看到的界面。外籍员工可使用母语操作。',
                      ko:'직원이 보는 화면입니다. 외국인 직원은 모국어로 사용 가능.',
                      vi:'Đây là màn hình nhân viên nhìn thấy. Nhân viên nước ngoài dùng bằng tiếng mẹ đẻ.' },
    'demo.s8_title': { ja:'🎉 体験完了！あなたが触ったのは…', en:'🎉 Experience Complete! Here\'s what you used...', zh:'🎉 体验完成！您刚才操作的是…', ko:'🎉 체험 완료! 방금 만진 것은…', vi:'🎉 Hoàn tất! Bạn đã thử...' },
    'demo.s8_sub': { ja:'これは RAKURAKU の本物の機能の一部です。実際の業務でも全部使えます。',
                      en:'These are real RAKURAKU features. All usable in actual operations.',
                      zh:'这些都是 RAKURAKU 的真实功能。实际运营全部可用。',
                      ko:'이것은 RAKURAKU 의 실제 기능입니다. 실제 업무에서도 모두 사용 가능.',
                      vi:'Đây là các tính năng thật của RAKURAKU. Có thể dùng trong vận hành thực tế.' },

    /* ─── ホーム index.html ─── */
    'home.hero_badge': { ja:'🏆 ヒアリング120店舗+ ・ 🆓 個人店は永久無料 ・ 🎁 30日 Pro 体験',
                          en:'🏆 120+ Stores Surveyed · 🆓 Free Forever for Individual Stores · 🎁 30-Day Pro Trial',
                          zh:'🏆 调研120+家店铺 · 🆓 个人店永久免费 · 🎁 30天Pro体验',
                          ko:'🏆 120+ 매장 청취 · 🆓 개인 매장 영구 무료 · 🎁 30일 Pro 체험',
                          vi:'🏆 Khảo sát 120+ cửa hàng · 🆓 Cửa hàng cá nhân miễn phí · 🎁 Pro thử 30 ngày' },
    'home.pain_title': { ja:'飲食店の「シフト疲れ」', en:'Restaurant "Shift Fatigue"', zh:'餐饮业的"班次疲劳"', ko:'음식점의 "시프트 피로"', vi:'"Mệt mỏi vì xếp ca" trong nhà hàng' },
    'home.pain_sub': { ja:'手書き・Excel・LINEのやり取りで毎月毎月、店長の貴重な時間を奪っていませんか？',
                        en:'Are handwritten schedules, Excel, and LINE messages stealing your precious manager hours every month?',
                        zh:'手写、Excel、LINE 交流是否每月都在夺走店长宝贵的时间？',
                        ko:'손글씨·Excel·LINE 소통이 매달 점장님의 귀중한 시간을 빼앗고 있지 않나요?',
                        vi:'Sổ tay, Excel, LINE đang lấy đi giờ quý báu của quản lý mỗi tháng?' },
    'home.solution_title': { ja:'RAKURAKU が解決します', en:'RAKURAKU Solves This', zh:'RAKURAKU 解决这些问题', ko:'RAKURAKU가 해결합니다', vi:'RAKURAKU giải quyết' },
    'home.solution_sub': { ja:'飲食店関係者の現場経験から生まれた、本当に必要な機能だけを搭載。',
                            en:'Built from restaurant industry insights with only the features you truly need.',
                            zh:'源于餐饮业现场经验，只搭载真正必需的功能。',
                            ko:'음식점 현장 경험에서 탄생한, 진짜 필요한 기능만 탑재.',
                            vi:'Sinh ra từ kinh nghiệm thực tế ngành nhà hàng, chỉ có tính năng cần thiết.' },
    'home.steps_title': { ja:'3ステップで導入完了', en:'Get Started in 3 Steps', zh:'3 步即可完成导入', ko:'3 단계로 도입 완료', vi:'Hoàn tất trong 3 bước' },

    /* ─── トップページ追加: バナー / ナビ / ヒーロー ─── */
    'banner.aria': { ja:'30 日間 Pro プラン全機能を無料で試せる', en:'Try all Pro plan features free for 30 days', zh:'30 天免费试用 Pro 全部功能', ko:'30 일간 Pro 전 기능 무료 체험', vi:'Dùng thử Pro toàn bộ tính năng 30 ngày miễn phí' },
    'banner.title': { ja:'30 日 Pro 全機能 無料体験', en:'30-Day Pro Free Trial', zh:'30 天 Pro 免费试用', ko:'30 일 Pro 무료 체험', vi:'Pro miễn phí 30 ngày' },
    'banner.no_card': { ja:'クレカ登録 不要', en:'No credit card', zh:'无需信用卡', ko:'카드 등록 불필요', vi:'Không cần thẻ' },
    'banner.auto_downgrade': { ja:'期間後 → 自動で Free に降格', en:'Auto-downgrades to Free after trial', zh:'期满后自动降级为免费版', ko:'기간 후 Free 로 자동 강등', vi:'Tự xuống Free sau khi hết hạn' },
    'banner.see_pricing': { ja:'料金プランを見る →', en:'See pricing →', zh:'查看定价 →', ko:'요금제 보기 →', vi:'Xem bảng giá →' },

    'nav.features': { ja:'機能', en:'Features', zh:'功能', ko:'기능', vi:'Tính năng' },
    'nav.pricing': { ja:'料金', en:'Pricing', zh:'价格', ko:'요금', vi:'Giá' },
    'nav.how': { ja:'使い方', en:'How to use', zh:'使用方法', ko:'사용법', vi:'Cách dùng' },
    'nav.faq': { ja:'FAQ', en:'FAQ', zh:'常见问题', ko:'FAQ', vi:'FAQ' },
    'nav.contact': { ja:'お問い合わせ', en:'Contact', zh:'联系我们', ko:'문의', vi:'Liên hệ' },
    'nav.contact_short': { ja:'お問合せ', en:'Contact', zh:'联系', ko:'문의', vi:'Liên hệ' },
    'a11y.skip_to_main': { ja:'メインコンテンツへスキップ', en:'Skip to main content', zh:'跳到主内容', ko:'본문으로 건너뛰기', vi:'Bỏ qua đến nội dung chính' },

    'news.banner': { ja:'📢 <strong>NEW</strong> · 2026年6月末まで <strong>セットアップ無料 + 初月無料</strong> キャンペーン中 ·',
                      en:'📢 <strong>NEW</strong> · Until end of June 2026: <strong>Free setup + free first month</strong> campaign ·',
                      zh:'📢 <strong>NEW</strong> · 2026 年 6 月底前: <strong>免费搭建 + 首月免费</strong> 活动中 ·',
                      ko:'📢 <strong>NEW</strong> · 2026 년 6 월 말까지 <strong>설치 무료 + 첫 달 무료</strong> 캠페인 ·',
                      vi:'📢 <strong>NEW</strong> · Đến hết tháng 6/2026: <strong>Miễn phí cài đặt + tháng đầu</strong> ·' },
    'news.see_hearing': { ja:'120店舗+ ヒアリング内容を見る →', en:'See 120+ store hearing results →', zh:'查看 120+ 家店铺调研内容 →', ko:'120 매장 + 청취 내용 보기 →', vi:'Xem khảo sát 120+ cửa hàng →' },

    'home.try_demo': { ja:'🎬 30 分で店舗運営を疑似体験 (本格デモ) →',
                       en:'🎬 Simulate store operations in 30 min (full demo) →',
                       zh:'🎬 30 分钟模拟门店运营 (完整演示) →',
                       ko:'🎬 30 분으로 매장 운영 체험 (본격 데모) →',
                       vi:'🎬 Mô phỏng vận hành 30 phút (demo đầy đủ) →' },
    'home.hero_h1_1': { ja:'シフト作成、', en:'Shift creation,', zh:'班次制作,', ko:'시프트 작성,', vi:'Tạo ca,' },
    'home.hero_h1_2': { ja:'1タップで完璧に。', en:'perfect in one tap.', zh:'一键完美完成。', ko:'한 번의 탭으로 완벽하게.', vi:'hoàn hảo trong 1 chạm.' },
    'home.hero_lead': { ja:'アルバイトはスマホで希望時間を提出するだけ。<br>店長はワンタップでシフト表が完成。<br>深夜割増・売上管理・スタッフ評価まで全部入り。',
                        en:'Staff just submit preferred times on their phones.<br>Managers complete the shift schedule with one tap.<br>Night premium, sales management, and staff ratings all included.',
                        zh:'员工只需用手机提交意向时间。<br>店长一键完成班次表。<br>深夜加班、销售管理、员工评价全部包含。',
                        ko:'아르바이트는 스마트폰으로 희망 시간을 제출.<br>점장은 원 탭으로 시프트 표 완성.<br>심야 할증·매출 관리·직원 평가까지 모두 포함.',
                        vi:'Nhân viên chỉ cần gửi giờ mong muốn qua điện thoại.<br>Quản lý hoàn thành bảng ca chỉ với 1 chạm.<br>Phụ cấp đêm, quản lý doanh thu, đánh giá nhân viên — tất cả đều có.' },
    'home.cta_start': { ja:'🆓 無料で始める (永久 or 30日 Pro 体験)', en:'🆓 Start Free (Forever / 30-day Pro Trial)', zh:'🆓 免费开始 (永久 / 30 天 Pro 体验)', ko:'🆓 무료 시작 (영구 / 30 일 Pro 체험)', vi:'🆓 Bắt đầu miễn phí (Vĩnh viễn / Pro 30 ngày)' },
    'home.cta_start_aria': { ja:'無料で始める (個人店は永久無料・30日 Pro 体験)', en:'Start Free (Forever-Free for individuals / 30-day Pro Trial)', zh:'免费开始 (个人店永久免费 / 30 天 Pro 体验)', ko:'무료 시작 (개인 매장 영구 무료 / 30 일 Pro 체험)', vi:'Bắt đầu miễn phí (Cửa hàng cá nhân miễn phí / Pro 30 ngày)' },
    'home.cta_demo': { ja:'🎬 デモを今すぐ触る (登録不要)', en:'🎬 Try the demo now (no signup)', zh:'🎬 立即试用演示 (无需注册)', ko:'🎬 데모 지금 체험 (등록 불필요)', vi:'🎬 Thử demo ngay (không cần đăng ký)' },
    'home.hero_note': { ja:'💡 <strong>年払いなら2ヶ月分お得 (¥49,900)</strong> + セットアップ無料・優先サポート等の特典5つ',
                        en:'💡 <strong>Annual saves 2 months (¥49,900)</strong> + 5 perks incl. free setup & priority support',
                        zh:'💡 <strong>年付省 2 个月 (¥49,900)</strong> + 免费搭建/优先支持等 5 项福利',
                        ko:'💡 <strong>연간 결제는 2 개월 절약 (¥49,900)</strong> + 5 가지 특전',
                        vi:'💡 <strong>Trả năm tiết kiệm 2 tháng (¥49,900)</strong> + 5 đặc quyền' },

    /* 信頼バッジ */
    'stats.hearing_shops': { ja:'ヒアリング店舗', en:'Stores Surveyed', zh:'调研店铺', ko:'청취 매장', vi:'Cửa hàng khảo sát' },
    'stats.lang_unit': { ja:'言語', en:'langs', zh:'语言', ko:'언어', vi:'ngôn ngữ' },
    'stats.multilang': { ja:'多言語対応', en:'Multilingual', zh:'多语言支持', ko:'다국어 지원', vi:'Đa ngôn ngữ' },
    'stats.time_saved': { ja:'時間削減 (試算)', en:'Time Saved (Est.)', zh:'时间节省 (估算)', ko:'시간 절약 (추정)', vi:'Tiết kiệm thời gian (Ước tính)' },
    'stats.satisfaction': { ja:'満足度', en:'Satisfaction', zh:'满意度', ko:'만족도', vi:'Mức hài lòng' },

    /* キャンペーン特典 */
    'promo.title': { ja:'今月導入の店舗様限定: セットアップ無料 + 初月無料', en:'This month only: Free setup + free first month', zh:'本月限定: 免费搭建 + 首月免费', ko:'이번 달 한정: 설치 무료 + 첫 달 무료', vi:'Tháng này: Miễn phí cài đặt + tháng đầu' },
    'promo.sub': { ja:'通常 ¥30,000相当のセットアップを 0円 でご提供します', en:'Setup normally ¥30,000 — free for you', zh:'通常 ¥30,000 的搭建免费提供', ko:'통상 ¥30,000 상당의 설치를 0 원으로', vi:'Cài đặt thông thường ¥30,000 — miễn phí' },
    'promo.deadline': { ja:'⏰ 〜2026年6月末まで', en:'⏰ Until end of June 2026', zh:'⏰ 至 2026 年 6 月底', ko:'⏰ 2026 년 6 월 말까지', vi:'⏰ Đến hết tháng 6/2026' },

    /* 関連リソース */
    'resources.label': { ja:'▶ 関連リソース:', en:'▶ Related Resources:', zh:'▶ 相关资源:', ko:'▶ 관련 리소스:', vi:'▶ Tài nguyên liên quan:' },
    'resources.sim_title': { ja:'節約額シミュレート', en:'Savings Simulator', zh:'节省金额模拟', ko:'절약액 시뮬레이터', vi:'Tính số tiền tiết kiệm' },
    'resources.sim_sub': { ja:'年いくら節約？', en:'How much per year?', zh:'每年节省多少?', ko:'연 얼마 절약?', vi:'Tiết kiệm bao nhiêu/năm?' },
    'resources.tmpl_title': { ja:'無料テンプレート', en:'Free Templates', zh:'免费模板', ko:'무료 템플릿', vi:'Mẫu miễn phí' },
    'resources.tmpl_sub': { ja:'Excelシフト表DL', en:'Excel shift sheet DL', zh:'Excel 班次表下载', ko:'Excel 시프트 표 DL', vi:'Tải bảng ca Excel' },
    'resources.guide_title': { ja:'完全ガイド 2026', en:'Complete Guide 2026', zh:'完整指南 2026', ko:'완벽 가이드 2026', vi:'Hướng dẫn đầy đủ 2026' },
    'resources.guide_sub': { ja:'8章/30+表', en:'8 chapters / 30+ tables', zh:'8 章 / 30+ 表', ko:'8장 / 30+ 표', vi:'8 chương / 30+ bảng' },
    'resources.gloss_title': { ja:'用語集 50+', en:'Glossary 50+', zh:'术语表 50+', ko:'용어집 50+', vi:'Từ điển 50+' },
    'resources.gloss_sub': { ja:'労基/SaaS用語', en:'Labor law / SaaS terms', zh:'劳基/SaaS 术语', ko:'근로/SaaS 용어', vi:'Thuật ngữ luật LĐ/SaaS' },
    'resources.feat_title': { ja:'機能一覧', en:'Features List', zh:'功能列表', ko:'기능 목록', vi:'Danh sách tính năng' },
    'resources.feat_sub': { ja:'GPS/労基/多言語', en:'GPS / Labor / Multilingual', zh:'GPS/劳基/多语言', ko:'GPS/근로법/다국어', vi:'GPS/Luật/Đa ngôn ngữ' },
    'resources.vs_title': { ja:'競合比較', en:'Competitor Comparison', zh:'竞争对手对比', ko:'경쟁사 비교', vi:'So sánh đối thủ' },
    'resources.onb_title': { ja:'5 分で始める', en:'Start in 5 min', zh:'5 分钟开始', ko:'5 분 시작', vi:'Bắt đầu trong 5 phút' },
    'resources.onb_sub': { ja:'3 ステップガイド', en:'3-step guide', zh:'3 步指南', ko:'3 단계 가이드', vi:'Hướng dẫn 3 bước' },
    'resources.ent_sub': { ja:'10店舗以上 / SLA', en:'10+ stores / SLA', zh:'10 店以上 / SLA', ko:'10 매장+ / SLA', vi:'Hơn 10 cửa hàng / SLA' },

    /* 痛みポイント */
    'pain.tag': { ja:'こんな悩みありませんか？', en:'Sound familiar?', zh:'有这些烦恼吗?', ko:'이런 고민 없으신가요?', vi:'Bạn có những vấn đề này?' },
    'pain.1_title': { ja:'月末は徹夜でシフト作成', en:'All-nighters at month-end for shift creation', zh:'月底通宵制作班次', ko:'월말 밤새 시프트 작성', vi:'Thức đêm cuối tháng làm ca' },
    'pain.1_desc': { ja:'紙とExcelで朝までシフト調整。本業に集中できない。', en:'Paper and Excel until dawn. Can\'t focus on actual business.', zh:'纸和 Excel 调整到天亮。无法专注本业。', ko:'종이와 Excel 로 새벽까지 시프트 조정. 본업에 집중 불가.', vi:'Giấy và Excel đến rạng sáng. Không thể tập trung công việc chính.' },
    'pain.2_title': { ja:'LINEで希望日が大量に届く', en:'Flood of LINE messages with preferred days', zh:'LINE 上大量收到希望日期', ko:'LINE 으로 희망일이 대량 도착', vi:'LINE ngập tin nhắn ngày mong muốn' },
    'pain.2_desc': { ja:'スタッフからのLINEに埋もれて、誰がいつ入れるか分からない。', en:'Buried in staff LINE messages, can\'t tell who can work when.', zh:'被员工 LINE 淹没,搞不清谁何时能上班。', ko:'직원 LINE 에 묻혀 누가 언제 일할 수 있는지 모름.', vi:'Chìm trong tin LINE, không biết ai có thể làm khi nào.' },
    'pain.3_title': { ja:'深夜割増の計算ミス', en:'Mistakes in late-night premium calculations', zh:'深夜加班费计算错误', ko:'심야 할증 계산 실수', vi:'Sai sót tính phụ cấp đêm' },
    'pain.3_desc': { ja:'22時以降の25%割増を手計算。給与トラブルの原因に。', en:'Manual 25% premium calculation after 22:00. Causes payroll trouble.', zh:'手动计算 22 点后 25% 加班费。引发工资纠纷。', ko:'22 시 이후 25% 할증을 수계산. 급여 분쟁의 원인.', vi:'Tính thủ công phụ cấp 25% sau 22h. Gây tranh chấp lương.' },

    /* 機能カード 7 種 */
    'feat.1_title': { ja:'スマホで希望提出', en:'Smartphone shift requests', zh:'手机提交意向', ko:'스마트폰 희망 제출', vi:'Đăng ký ca qua điện thoại' },
    'feat.1_desc': { ja:'スタッフはQRコードを読み取って、カレンダーから希望日と時間をタップするだけ。担当ポジションは店側で設定するので、アルバイト側の入力負担はゼロ。',
                      en:'Staff just scan QR and tap preferred days/times on the calendar. Manager sets positions — zero input burden on staff.',
                      zh:'员工只需扫码,从日历点击希望日期和时间。岗位由店方设置,员工输入负担为零。',
                      ko:'직원은 QR 만 스캔, 캘린더에서 희망일·시간을 탭. 포지션은 매장이 설정 → 직원 입력 부담 제로.',
                      vi:'Nhân viên chỉ quét QR, chạm ngày/giờ mong muốn trên lịch. Vị trí do cửa hàng cài — không tốn công nhập.' },
    'feat.2_title': { ja:'ワンタップでシフト作成', en:'One-tap shift creation', zh:'一键制作班次', ko:'원 탭 시프트 작성', vi:'Tạo ca chỉ 1 chạm' },
    'feat.2_desc': { ja:'大きな「シフト作成」ボタン1回で、朝/昼/夜の人員バランス・ポジション配置を考慮したシフト表が即完成。印刷もPDF風に綺麗に出力。',
                      en:'One press of the "Create Shift" button generates a balanced morning/lunch/evening schedule with proper positions. Print-ready PDF output.',
                      zh:'按一次"制作班次",立即生成考虑早/中/晚人员平衡和岗位配置的班次表。可打印 PDF。',
                      ko:'"시프트 작성" 버튼 한 번으로 아침/점심/저녁 인원 균형 + 포지션 고려한 시프트 표가 즉시 완성. PDF 인쇄 가능.',
                      vi:'Một lần nhấn "Tạo ca" → bảng ca cân bằng sáng/trưa/tối với vị trí phù hợp. Xuất PDF in được.' },
    'feat.3_title': { ja:'深夜割増を自動計算', en:'Auto late-night premium', zh:'自动计算深夜加班', ko:'심야 할증 자동 계산', vi:'Tự tính phụ cấp đêm' },
    'feat.3_desc': { ja:'労働基準法第37条準拠で、22:00〜翌5:00の深夜時間に+25%を自動適用。時給・交通費・役職手当を入れるだけで月次給与が自動算出。',
                      en:'Per Labor Standards Law §37: auto-applies +25% for 22:00-05:00. Just enter hourly wage / commute / position allowance — monthly payroll auto-calculated.',
                      zh:'依据劳基法第 37 条,22:00-次日 5:00 自动加 25%。输入时薪/交通费/职位津贴,月薪自动算出。',
                      ko:'근로기준법 37 조 준수: 22:00-익일 5:00 +25% 자동 적용. 시급/교통비/직책 수당 입력만으로 월급 자동 산출.',
                      vi:'Tuân thủ Luật LĐ §37: tự áp +25% cho 22h-5h. Chỉ nhập lương giờ/đi lại/phụ cấp → lương tháng tự tính.' },
    'feat.4_title': { ja:'売上と人件費率を可視化', en:'Sales & labor-cost dashboards', zh:'销售与人力成本可视化', ko:'매출과 인건비율 시각화', vi:'Trực quan doanh thu & chi phí LĐ' },
    'feat.4_desc': { ja:'月次売上目標と達成率、前年比、人件費率を一画面で。25-35%の目安と色分けで経営判断を即サポート。',
                      en:'Monthly sales targets, achievement rate, YoY, and labor cost ratio on one screen. Color-coded 25-35% benchmark guides management decisions instantly.',
                      zh:'月度销售目标与达成率、同比、人力成本率在一个画面。25-35% 基准色彩区分,瞬间支持管理决策。',
                      ko:'월별 매출 목표 / 달성률 / 전년 대비 / 인건비율을 한 화면에. 25-35% 기준선 색분리로 경영 판단 즉시 지원.',
                      vi:'Mục tiêu doanh thu tháng, tỷ lệ đạt, YoY, tỷ lệ chi phí LĐ trên 1 màn hình. Chuẩn 25-35% màu sắc → hỗ trợ quyết định ngay.' },
    'feat.5_title': { ja:'人員不足を3段階で自動解決', en:'3-tier auto-recruit for shortages', zh:'人手不足三段自动解决', ko:'인력 부족 3 단계 자동 해결', vi:'Tự giải quyết thiếu người 3 cấp' },
    'feat.5_desc': { ja:'<strong>① 既存スタッフへ時間調整依頼メール</strong>を一斉送信 → <strong>② 自社スタッフに時給インセンティブ付き内部募集</strong> → <strong>③ それでも不足なら Timee／シェアフル／バイトル へワンタップ外部求人配信</strong>。<br>新規募集の前にできることを全部自動でやるので、外部求人コストを最小化できます。',
                      en:'<strong>① Mass-mail existing staff for time-adjustment</strong> → <strong>② In-house recruit with hourly bonus</strong> → <strong>③ If still short, one-tap dispatch to Timee/Sharefull/Baitoru</strong>.<br>Automates everything before new recruitment — minimizing external job-board fees.',
                      zh:'<strong>① 群发现有员工时间调整请求</strong> → <strong>② 加时薪内部招募</strong> → <strong>③ 仍不足时一键派发 Timee/Sharefull/Baitoru</strong>。<br>新招前自动尝试所有方法 → 最小化外部招聘成本。',
                      ko:'<strong>① 기존 직원에게 시간 조정 요청 일괄 발송</strong> → <strong>② 시급 인센티브 사내 모집</strong> → <strong>③ 그래도 부족하면 Timee/Sharefull/Baitoru 원 탭 외부 구인</strong>.<br>신규 모집 전 모두 자동 처리 → 외부 구인 비용 최소화.',
                      vi:'<strong>① Gửi hàng loạt yêu cầu điều chỉnh giờ cho NV hiện có</strong> → <strong>② Tuyển nội bộ kèm thưởng</strong> → <strong>③ Vẫn thiếu → 1 chạm gửi Timee/Sharefull/Baitoru</strong>.<br>Tự động làm hết trước khi tuyển mới → giảm chi phí quảng cáo.' },
    'feat.6_title': { ja:'スタッフ評価機能', en:'Staff rating', zh:'员工评价功能', ko:'직원 평가 기능', vi:'Đánh giá nhân viên' },
    'feat.6_desc': { ja:'ポジションごとに5段階で評価。誰がホールが得意か、キッチンの揚げ場ができるか一目瞭然。シフト編成の最適化に直結。',
                      en:'5-star rating per position. See at a glance who excels at hall vs kitchen fry station. Optimizes shift composition.',
                      zh:'按岗位 5 星评价。一眼看出谁擅长前厅、谁能炸厨。直接优化班次配置。',
                      ko:'포지션별 5 단계 평가. 누가 홀에 강한지, 주방 튀김에 능한지 한눈에. 시프트 편성 최적화.',
                      vi:'Đánh giá 5 sao theo vị trí. Thấy ngay ai giỏi phục vụ, ai làm bếp chiên. Tối ưu phân ca.' },
    'feat.7_title': { ja:'多言語対応 (5言語)', en:'Multilingual (5 languages)', zh:'多语言 (5 种语言)', ko:'다국어 (5개 언어)', vi:'Đa ngôn ngữ (5 thứ tiếng)' },
    'feat.7_desc': { ja:'日本語・English・中文・한국어・Tiếng Việt に対応。<strong>外国人アルバイト</strong>もスマホで自分の言語で「シフト確認・休み変更届・GPS打刻」が完結。インバウンド時代の必須機能。',
                      en:'Supports 日本語・English・中文・한국어・Tiếng Việt. <strong>Foreign staff</strong> can confirm shifts, file leave, and GPS clock-in entirely in their own language. Essential for the inbound era.',
                      zh:'支持日语·English·中文·한국어·Tiếng Việt。<strong>外国员工</strong>也能用母语完成班次确认/休假申请/GPS 打卡。入境时代必备。',
                      ko:'日本語·English·中文·한국어·Tiếng Việt 지원. <strong>외국인 아르바이트</strong>도 모국어로 시프트 확인/휴가 신청/GPS 출근 완료. 인바운드 시대 필수.',
                      vi:'Hỗ trợ 日本語·English·中文·한국어·Tiếng Việt. <strong>Nhân viên nước ngoài</strong> cũng dùng tiếng mẹ đẻ để xem ca / xin nghỉ / chấm công GPS. Tính năng thiết yếu thời inbound.' },

    /* ─── トップページ 差別化機能セクション ─── */
    'unique.tag': { ja:'RAKURAKU だけの強み', en:'Only on RAKURAKU', zh:'RAKURAKU 独有', ko:'RAKURAKU 만의 강점', vi:'Chỉ có ở RAKURAKU' },
    'unique.title': { ja:'他社にはない <span style="background:#DC2626;-webkit-background-clip:text;-webkit-text-fill-color:transparent;">6つの差別化機能</span>',
                       en:'<span style="background:#DC2626;-webkit-background-clip:text;-webkit-text-fill-color:transparent;">6 unique features</span> no competitor has',
                       zh:'其他公司没有的 <span style="background:#DC2626;-webkit-background-clip:text;-webkit-text-fill-color:transparent;">6 个差异化功能</span>',
                       ko:'타사에 없는 <span style="background:#DC2626;-webkit-background-clip:text;-webkit-text-fill-color:transparent;">6가지 차별화 기능</span>',
                       vi:'<span style="background:#DC2626;-webkit-background-clip:text;-webkit-text-fill-color:transparent;">6 tính năng độc đáo</span> không đối thủ nào có' },
    'unique.sub': { ja:'これがあるから「他のシフトSaaSじゃなくRAKURAKU」を選んでいただいています。', en:'Why customers pick RAKURAKU over any other shift SaaS.', zh:'这就是为什么客户选择 RAKURAKU 而不是其他班次 SaaS。', ko:'그래서 다른 시프트 SaaS 대신 RAKURAKU 를 선택합니다.', vi:'Vì sao khách chọn RAKURAKU thay vì các SaaS khác.' },
    'unique.tag_original': { ja:'RAKURAKU 独自', en:'RAKURAKU Original', zh:'RAKURAKU 独有', ko:'RAKURAKU 독자', vi:'Chỉ RAKURAKU' },
    'unique.tag_patent': { ja:'特許級', en:'Patent-class', zh:'专利级', ko:'특허급', vi:'Cấp bằng sáng chế' },
    'unique.tag_industry_first': { ja:'業界初', en:'Industry First', zh:'业界首创', ko:'업계 최초', vi:'Đầu tiên trong ngành' },
    'unique.tag_foreign': { ja:'外国人対応', en:'Foreign Staff', zh:'外籍员工', ko:'외국인 대응', vi:'Nhân viên nước ngoài' },
    'unique.tag_law': { ja:'労基法準拠', en:'Labor Law Compliant', zh:'劳基法合规', ko:'근로법 준수', vi:'Tuân thủ Luật LĐ' },
    'unique.tag_line': { ja:'LINE 直連携', en:'LINE Direct', zh:'LINE 直接连接', ko:'LINE 직접 연결', vi:'LINE trực tiếp' },

    'unique.u1_title': { ja:'個人給与照会 (パスワード保護)', en:'Personal Payroll View (Password-Protected)', zh:'个人薪资查询 (密码保护)', ko:'개인 급여 조회 (비밀번호 보호)', vi:'Xem lương cá nhân (Bảo vệ mật khẩu)' },
    'unique.u1_desc': { ja:'スタッフが自分のパスワードで自分の今月給与だけを確認できる。SHA-256ハッシュで安全保管。<strong>「給料いくら?」のLINEが消える</strong>。', en:'Staff check only their own current payroll using their own password. SHA-256 secured. <strong>"How much was my pay?" LINE messages vanish</strong>.', zh:'员工用自己的密码仅查看自己当月薪资。SHA-256 安全保存。<strong>"工资多少?" 的 LINE 消息消失</strong>。', ko:'직원이 자신의 비밀번호로 본인 이번 달 급여만 확인. SHA-256 안전 보관. <strong>"월급 얼마?" LINE 사라짐</strong>.', vi:'Nhân viên dùng mật khẩu cá nhân xem lương tháng. SHA-256 bảo mật. <strong>"Lương bao nhiêu?" hết LINE</strong>.' },
    'unique.u1_benefit': { ja:'💡 給与トラブル防止・スタッフの安心感UP', en:'💡 Prevents payroll trouble · Boosts staff peace of mind', zh:'💡 防止薪资纠纷 · 提升员工安心感', ko:'💡 급여 분쟁 예방 · 직원 안심감 UP', vi:'💡 Ngăn tranh chấp lương · Tăng yên tâm cho NV' },

    'unique.u2_title': { ja:'GPS不正打刻 リアルタイム検知', en:'GPS Fraud Clock-in Real-time Detection', zh:'GPS 不正打卡实时检测', ko:'GPS 부정 출근 실시간 감지', vi:'Phát hiện GPS gian lận thời gian thực' },
    'unique.u2_desc': { ja:'店舗の半径200m外で打刻されたら<strong>即座に店長へアラート</strong>。Haversine 距離計算で誤差±5m。月¥8万分の不正打刻を防いだ事例あり。', en:'Clock-in outside 200m radius? <strong>Instant manager alert</strong>. Haversine distance ±5m. Case: prevented ¥80,000/month in fraud.', zh:'店外 200m 打卡? <strong>立即通知店长</strong>。Haversine 距离±5m。案例: 月防止 ¥8 万不正打卡。', ko:'매장 200m 외 출근? <strong>점장에게 즉시 알림</strong>. Haversine 거리±5m. 사례: 월 ¥8 만 사기 방지.', vi:'Chấm công ngoài bán kính 200m? <strong>Cảnh báo quản lý ngay</strong>. Haversine ±5m. Có case ngừa ¥80,000/tháng.' },
    'unique.u2_benefit': { ja:'💡 人件費の漏れ防止・公平性の担保', en:'💡 Prevents labor cost leakage · Ensures fairness', zh:'💡 防止人力成本漏洞 · 保证公平性', ko:'💡 인건비 누수 방지 · 공정성 보장', vi:'💡 Ngăn rò rỉ chi phí LĐ · Đảm bảo công bằng' },

    'unique.u3_title': { ja:'3段階自動募集 (内部→社内→外部)', en:'3-Tier Auto-Recruit (Existing → In-House → External)', zh:'3 段自动招募 (现有→内部→外部)', ko:'3 단계 자동 모집 (기존→사내→외부)', vi:'Tự tuyển 3 cấp (Hiện tại→Nội bộ→Ngoài)' },
    'unique.u3_desc': { ja:'不足コマ → ①既存スタッフ調整依頼 → ②社内時給アップ募集 → ③Timee/シェアフル配信。<strong>外部手数料を月¥40,000削減</strong>した事例。', en:'Shortage → ①Existing staff time-adjust → ②In-house bonus recruit → ③Timee/Sharefull dispatch. <strong>Saved ¥40,000/month in external fees</strong>.', zh:'缺岗 → ①现有员工调整 → ②内部加薪招募 → ③Timee/Sharefull 派发。<strong>月省 ¥40,000 外部费用</strong>。', ko:'부족 → ①기존 직원 시간 조정 → ②사내 시급 인상 → ③Timee/Sharefull 발송. <strong>외부 수수료 월 ¥40,000 절감</strong>.', vi:'Thiếu ca → ①Điều chỉnh NV hiện có → ②Tuyển nội bộ thưởng → ③Gửi Timee/Sharefull. <strong>Tiết kiệm ¥40,000/tháng phí ngoài</strong>.' },
    'unique.u3_benefit': { ja:'💡 Timee手数料 30%→8%へ大幅削減', en:'💡 Timee fees drop from 30% → 8%', zh:'💡 Timee 手续费从 30% 降至 8%', ko:'💡 Timee 수수료 30%→8% 대폭 절감', vi:'💡 Phí Timee từ 30% → 8%' },

    'unique.u4_title': { ja:'5言語完全対応 (日/英/中/韓/越)', en:'Full 5-language support (JA/EN/ZH/KO/VI)', zh:'5 语言完整支持 (日/英/中/韩/越)', ko:'5 개 언어 완전 지원 (일/영/중/한/베)', vi:'Hỗ trợ 5 ngôn ngữ đầy đủ (Nhật/Anh/Trung/Hàn/Việt)' },
    'unique.u4_desc': { ja:'シフト提出・打刻・通知・給与確認 すべて母国語で。<strong>外国人スタッフの伝達ミスがゼロに</strong>。インバウンド時代の競争力。', en:'Shift submit / clock-in / notify / payroll — all in native language. <strong>Zero miscommunication with foreign staff</strong>. Competitive edge for the inbound era.', zh:'班次提交/打卡/通知/薪资 全部母语。<strong>外籍员工沟通错误为零</strong>。入境时代竞争力。', ko:'시프트 제출 / 출근 / 알림 / 급여 - 모두 모국어. <strong>외국인 직원 전달 실수 제로</strong>. 인바운드 시대 경쟁력.', vi:'Đăng ký ca/Chấm công/Thông báo/Lương - tất cả tiếng mẹ. <strong>Không sai sót giao tiếp với NV nước ngoài</strong>. Cạnh tranh thời inbound.' },
    'unique.u4_benefit': { ja:'💡 採用面でも有利・優秀な留学生が応募', en:'💡 Recruiting advantage · attracts top international students', zh:'💡 招聘有优势 · 优秀留学生应聘', ko:'💡 채용에도 유리 · 우수 유학생 지원', vi:'💡 Lợi thế tuyển dụng · thu hút du học sinh giỏi' },

    'unique.u5_title': { ja:'労基法 自動チェック (5項目)', en:'Auto Labor Law Check (5 items)', zh:'劳基法自动检查 (5 项)', ko:'근로법 자동 체크 (5 항목)', vi:'Tự kiểm tra Luật LĐ (5 mục)' },
    'unique.u5_desc': { ja:'シフト生成時に <strong>① 重複シフト ② 連続7日勤務 ③ 6h超休憩義務 ④ 週40h超 ⑤ 18歳未満深夜</strong> を自動検知。違反リスクをゼロに。', en:'Auto-detects during generation: <strong>① duplicates ② 7-day consec ③ 6h+ break duty ④ 40h+ weekly ⑤ under-18 night</strong>. Zero violation risk.', zh:'生成时自动检测: <strong>① 重复班次 ② 连续 7 日 ③ 6h+ 休息义务 ④ 周 40h+ ⑤ 18 岁以下深夜</strong>。零违规风险。', ko:'생성 시 자동 감지: <strong>① 중복 ② 7 일 연속 ③ 6h+ 휴식 의무 ④ 주 40h+ ⑤ 18 세 미만 심야</strong>. 위반 리스크 제로.', vi:'Tự phát hiện khi tạo: <strong>① Trùng ca ② 7 ngày liên tục ③ Nghỉ 6h+ ④ 40h+/tuần ⑤ Dưới 18 ca đêm</strong>. Không rủi ro vi phạm.' },
    'unique.u5_benefit': { ja:'💡 労基署対応・コンプライアンス安心', en:'💡 Labor inspector ready · Compliance assured', zh:'💡 应对劳动监察 · 合规放心', ko:'💡 노동청 대응 · 컴플라이언스 안심', vi:'💡 Sẵn sàng thanh tra LĐ · Đảm bảo tuân thủ' },

    'unique.u6_title': { ja:'店舗専用QR + LINE 一斉通知', en:'Shop-specific QR + LINE Broadcast', zh:'店铺专用 QR + LINE 群发', ko:'매장 전용 QR + LINE 일괄 알림', vi:'QR riêng cửa hàng + LINE gửi tất cả' },
    'unique.u6_desc': { ja:'契約と同時に<strong>店舗専用QR + 専用URL</strong>を自動発行。LINE公式アカウント連携で<strong>シフト確定通知・締切リマインドを開封率3倍</strong>。', en:'Auto-issued <strong>shop QR + URL</strong> on contract. LINE Official Account integration → <strong>3× open rate</strong> for shift / deadline reminders.', zh:'签约同时自动发行 <strong>店铺专用 QR + URL</strong>。LINE 官方账号连接 → <strong>班次/截止提醒打开率 3 倍</strong>。', ko:'계약과 동시에 <strong>매장 전용 QR + URL</strong> 자동 발행. LINE 공식 계정 연동 → <strong>오픈율 3 배</strong>.', vi:'Tự cấp <strong>QR + URL riêng</strong> khi ký HĐ. Kết nối LINE Official → <strong>tỷ lệ mở 3 lần</strong>.' },
    'unique.u6_benefit': { ja:'💡 スタッフから「便利になった」の声', en:'💡 Staff say: "much more convenient"', zh:'💡 员工称 "变方便了"', ko:'💡 직원 "편해졌다" 평가', vi:'💡 NV nói: "Tiện hơn nhiều"' },

    'unique.footnote': { ja:'他のシフト管理SaaSはどれも似ています。<br><strong style="color:var(--slate-900);">RAKURAKUは飲食店関係者へのヒアリングで「現場で本当に困っていること」だけを解決しています。</strong>だから現場で本当に使える。',
                         en:'Other shift SaaS all look alike.<br><strong style="color:var(--slate-900);">RAKURAKU solves only the things restaurant operators told us actually hurt them.</strong> That\'s why it works on the ground.',
                         zh:'其他班次 SaaS 都很相似。<br><strong style="color:var(--slate-900);">RAKURAKU 仅解决餐饮业从业者反馈的真实痛点。</strong>所以现场真能用。',
                         ko:'다른 시프트 SaaS 는 다 비슷합니다.<br><strong style="color:var(--slate-900);">RAKURAKU 는 음식점 관계자에게 직접 들은 진짜 문제만 해결합니다.</strong> 그래서 현장에서 진짜로 쓸 수 있습니다.',
                         vi:'Các SaaS ca khác đều giống nhau.<br><strong style="color:var(--slate-900);">RAKURAKU chỉ giải quyết những vấn đề thật mà người làm nhà hàng cho biết.</strong> Vì vậy nó hoạt động tốt trong thực tế.' },

    /* HOW IT WORKS */
    'how.sub': { ja:'難しい設定は不要。アプリのインストールも不要。スマホのブラウザで完結。', en:'No complex setup, no app install — runs in your phone\'s browser.', zh:'无需复杂设置或安装应用 - 在手机浏览器中即可完成。', ko:'복잡한 설정 / 앱 설치 불필요 - 스마트폰 브라우저에서 완료.', vi:'Không cần cài đặt phức tạp hay tải app - chạy ngay trên trình duyệt điện thoại.' },
    'how.s1': { ja:'店舗URLとQRコードを発行。スタッフに共有するだけ。', en:'Issue store URL & QR. Just share with staff.', zh:'发行店铺 URL 和 QR。只需分享给员工。', ko:'매장 URL 과 QR 발급. 직원에게 공유만.', vi:'Phát URL & QR cửa hàng. Chỉ chia sẻ cho NV.' },
    'how.s2': { ja:'スタッフがスマホで希望日・時間を提出。', en:'Staff submit preferred dates/times via phone.', zh:'员工用手机提交希望日期/时间。', ko:'직원이 스마트폰으로 희망일/시간 제출.', vi:'NV gửi ngày/giờ mong muốn qua điện thoại.' },
    'how.s3': { ja:'店長が「ワンタップでシフト作成」をタップ。', en:'Manager taps "Create Shift" once.', zh:'店长点击"一键制作班次"。', ko:'점장이 "원 탭 시프트 작성" 탭.', vi:'Quản lý chạm "Tạo ca 1 lần".' },
    'how.s4': { ja:'PDF印刷 or 給与計算まで一気通貫。', en:'PDF print or payroll — all seamless.', zh:'PDF 打印或薪资计算一气呵成。', ko:'PDF 인쇄·급여 계산까지 일관 처리.', vi:'In PDF hoặc tính lương — liền mạch.' },

    /* TESTIMONIALS */
    'testi.title': { ja:'ヒアリング調査の声 <span style="color:#F59E0B;font-size:.7em;">★ 4.8 / 5.0</span>', en:'Hearing Survey Voices <span style="color:#F59E0B;font-size:.7em;">★ 4.8 / 5.0</span>', zh:'调研意见 <span style="color:#F59E0B;font-size:.7em;">★ 4.8 / 5.0</span>', ko:'청취 조사 의견 <span style="color:#F59E0B;font-size:.7em;">★ 4.8 / 5.0</span>', vi:'Phản hồi khảo sát <span style="color:#F59E0B;font-size:.7em;">★ 4.8 / 5.0</span>' },
    'testi.sub': { ja:'120店舗超の飲食店関係者へのヒアリング調査における総合評価 (プロトタイプ試用後アンケート / 匿名・許諾済み)', en:'Aggregate ratings from 120+ restaurant operator hearings (post-prototype survey, anonymous, consented)', zh:'120+ 家餐饮业者调研综合评分 (原型试用后问卷·匿名·已同意)', ko:'120 매장+ 음식점 관계자 청취 종합 평가 (프로토타입 사용 후 설문·익명·동의 완료)', vi:'Đánh giá tổng hợp từ 120+ buổi khảo sát người làm nhà hàng (sau dùng prototype, ẩn danh, đồng ý)' },
    'testi.a_name': { ja:'A様', en:'A-san', zh:'A 先生', ko:'A 님', vi:'Anh/Chị A' },
    'testi.a_meta': { ja:'バー / 東京都内 / スタッフ12名', en:'Bar / Tokyo / 12 staff', zh:'酒吧 / 东京 / 12 名员工', ko:'바 / 도쿄 / 직원 12 명', vi:'Bar / Tokyo / 12 NV' },
    'testi.a_quote': { ja:'「現状Timeeに毎月60万円ほど払っている。RAKURAKUの社内募集機能を見せてもらったところ90%は社内で埋められそう。月¥50,000以上の削減が期待でき、月額¥4,990の価値は十分にある。」', en:'"Currently pay ~¥600k/month to Timee. RAKURAKU\'s in-house recruit could fill 90% internally. Could save ¥50k+/month — easily worth the ¥4,990/mo."', zh:'"目前每月向 Timee 支付约 60 万日元。RAKURAKU 内部招募功能能填补 90%。月省 ¥50,000+,¥4,990/月 价值十足。"', ko:'"현재 Timee 에 월 60 만원 정도 지불. RAKURAKU 사내 모집으로 90% 사내 충당 가능. 월 ¥50,000+ 절감,¥4,990/월 충분한 가치."', vi:'"Hiện trả Timee ~600k ¥/tháng. Tính năng tuyển nội bộ của RAKURAKU lấp được 90%. Tiết kiệm ¥50k+/tháng — xứng đáng với ¥4,990/tháng."' },
    'testi.b_name': { ja:'B様', en:'B-san', zh:'B 先生', ko:'B 님', vi:'Anh/Chị B' },
    'testi.b_meta': { ja:'居酒屋 / 神奈川県 / スタッフ8名', en:'Izakaya / Kanagawa / 8 staff', zh:'居酒屋 / 神奈川 / 8 名员工', ko:'이자카야 / 가나가와 / 직원 8 명', vi:'Izakaya / Kanagawa / 8 NV' },
    'testi.b_quote': { ja:'「現状シフト作成に90分かかっている。プロトタイプを試したら3分で組めた。毎月の徹夜から解放されそう。労基法アラートも自動で出るのでコンプラ面の安心感が大きい。」', en:'"Shift creation takes 90 min now. Prototype did it in 3 min. Relieved from monthly all-nighters. Auto labor-law alerts give big compliance peace of mind."', zh:'"目前班次制作要 90 分钟。试用原型 3 分钟完成。能从每月通宵中解脱。劳基法警报自动显示,合规放心。"', ko:'"현재 시프트 작성 90 분. 프로토타입은 3 분. 매달 밤샘에서 해방. 근로법 알림 자동, 컴플라이언스 안심."', vi:'"Tạo ca mất 90 phút. Prototype làm 3 phút. Thoát thức đêm hàng tháng. Cảnh báo Luật LĐ tự động — yên tâm tuân thủ."' },
    'testi.c_name': { ja:'C様', en:'C-san', zh:'C 先生', ko:'C 님', vi:'Anh/Chị C' },
    'testi.c_meta': { ja:'カフェ / 大阪府 / スタッフ15名', en:'Cafe / Osaka / 15 staff', zh:'咖啡店 / 大阪 / 15 名员工', ko:'카페 / 오사카 / 직원 15 명', vi:'Cafe / Osaka / 15 NV' },
    'testi.c_quote': { ja:'「外国人スタッフ7名のうち6名が日本語苦手なので、5言語対応が決め手になりそう。シフト提出ミスがゼロになると期待。給与照会の多言語化も助かる。」', en:'"6 of 7 foreign staff struggle with Japanese, so 5-language support is decisive. Expect zero submission errors. Multilingual payroll inquiry also helpful."', zh:'"7 名外籍员工中 6 名日语不好,5 语言支持是决定因素。期望班次提交错误为零。薪资查询多语言化也很有帮助。"', ko:'"외국인 직원 7 명 중 6 명이 일본어 미숙, 5 언어 지원이 결정적. 시프트 제출 실수 제로 기대. 급여 조회 다국어도 도움."', vi:'"6/7 NV nước ngoài kém tiếng Nhật, hỗ trợ 5 ngôn ngữ là yếu tố quyết định. Mong sai sót đăng ký ca về 0. Đa ngôn ngữ xem lương cũng tốt."' },
    'testi.more_cases': { ja:'📊 もっと事例を見る (12店舗+ 詳細・12名の関係者の声)', en:'📊 See more cases (12+ shops, 12 voices)', zh:'📊 查看更多案例 (12+ 店铺,12 位声音)', ko:'📊 더 많은 사례 보기 (12+ 매장,12 명 의견)', vi:'📊 Xem thêm case (12+ cửa hàng, 12 ý kiến)' },

    /* SAFE / 4 つの理由 */
    'safe.title': { ja:'安心して試せる <span style="background:#DC2626;-webkit-background-clip:text;-webkit-text-fill-color:transparent;">4つの理由</span>', en:'<span style="background:#DC2626;-webkit-background-clip:text;-webkit-text-fill-color:transparent;">4 reasons</span> to try with peace of mind', zh:'安心试用的 <span style="background:#DC2626;-webkit-background-clip:text;-webkit-text-fill-color:transparent;">4 个理由</span>', ko:'안심하고 체험할 수 있는 <span style="background:#DC2626;-webkit-background-clip:text;-webkit-text-fill-color:transparent;">4 가지 이유</span>', vi:'<span style="background:#DC2626;-webkit-background-clip:text;-webkit-text-fill-color:transparent;">4 lý do</span> để thử yên tâm' },
    'safe.sub': { ja:'「導入したら戻れなくなったら困る」そんな不安をすべて解消します', en:'"What if I can\'t go back after switching?" — we put that worry to rest.', zh:'"导入后无法返回怎么办?" 我们消除所有这类担忧。', ko:'"도입 후 못 돌아갈까 봐 걱정" 그런 불안 모두 해소합니다.', vi:'"Lỡ đổi không quay lại được?" — chúng tôi xóa mọi lo lắng.' },
    'safe.r1_title': { ja:'30日間 完全無料', en:'30 days completely free', zh:'30 天完全免费', ko:'30 일간 완전 무료', vi:'30 ngày miễn phí hoàn toàn' },
    'safe.r1_sub': { ja:'全機能を制限なくお試し', en:'All features, no restrictions', zh:'全功能无限制试用', ko:'전 기능 제한 없이 체험', vi:'Toàn tính năng, không giới hạn' },
    'safe.r2_title': { ja:'解約自由', en:'Cancel anytime', zh:'自由取消', ko:'해지 자유', vi:'Hủy bất cứ lúc nào' },
    'safe.r2_sub': { ja:'違約金・手数料0円', en:'Zero penalty / fees', zh:'违约金/手续费 0 元', ko:'위약금/수수료 0 원', vi:'Không phí phạt' },
    'safe.r3_title': { ja:'データ持出可', en:'Data export OK', zh:'可导出数据', ko:'데이터 반출 가능', vi:'Xuất dữ liệu được' },
    'safe.r3_sub': { ja:'CSV/Excel エクスポート', en:'CSV/Excel export', zh:'CSV/Excel 导出', ko:'CSV/Excel 내보내기', vi:'Xuất CSV/Excel' },
    'safe.r4_title': { ja:'代表が直接対応', en:'Direct CEO support', zh:'CEO 直接对接', ko:'대표가 직접 대응', vi:'CEO trực tiếp hỗ trợ' },
    'safe.r4_sub': { ja:'電話・メール対応', en:'Phone & email', zh:'电话/邮件支持', ko:'전화·이메일 지원', vi:'Điện thoại & email' },
    'safe.cta_note': { ja:'💡 まずは <strong style="color:var(--indigo);">30日間 完全無料</strong> でお試しください。<br>気に入ったらそのまま、合わなければ何もせず離脱でOKです。', en:'💡 Start with <strong style="color:var(--indigo);">30 days free</strong>.<br>Keep going if you like it — or just walk away. No action needed.', zh:'💡 先用 <strong style="color:var(--indigo);">30 天免费</strong> 试用。<br>满意继续,不合适随时离开,无需任何操作。', ko:'💡 먼저 <strong style="color:var(--indigo);">30 일 무료</strong>로 체험해보세요.<br>좋으면 계속, 안 맞으면 아무것도 안 하고 떠나세요.', vi:'💡 Thử <strong style="color:var(--indigo);">30 ngày miễn phí</strong> trước.<br>Thích thì tiếp tục, không hợp thì rời đi — không cần làm gì.' },

    /* PRICING (index.html) */
    'pr.title': { ja:'あなたの店舗に合うプランを', en:'A plan for your store', zh:'适合您门店的方案', ko:'당신의 매장에 맞는 플랜', vi:'Gói phù hợp với cửa hàng bạn' },
    'pr.sub': { ja:'月払い・年払いから選べる。年払いなら<strong style="color:var(--indigo);">2ヶ月分お得 + 限定特典</strong>。', en:'Monthly or annual. Annual = <strong style="color:var(--indigo);">save 2 months + perks</strong>.', zh:'月付/年付可选。年付 = <strong style="color:var(--indigo);">省 2 个月 + 福利</strong>。', ko:'월 / 연 결제 선택. 연간 = <strong style="color:var(--indigo);">2 개월 절약 + 특전</strong>.', vi:'Trả tháng/năm. Năm = <strong style="color:var(--indigo);">tiết kiệm 2 tháng + đặc quyền</strong>.' },
    'pr.m_badge': { ja:'📅 月払いプラン', en:'📅 Monthly Plan', zh:'📅 月付方案', ko:'📅 월 결제 플랜', vi:'📅 Gói trả tháng' },
    'pr.m_plan': { ja:'スタンダード (月払い)', en:'Standard (Monthly)', zh:'标准版(月付)', ko:'스탠다드 (월 결제)', vi:'Tiêu chuẩn (Tháng)' },
    'pr.trial_30day': { ja:'30日間 完全無料', en:'30 days totally free', zh:'30 天完全免费', ko:'30 일 완전 무료', vi:'30 ngày miễn phí hoàn toàn' },
    'pr.trial_no_auto': { ja:' ・ 自動課金なし', en:' · No auto-billing', zh:' · 无自动扣款', ko:' · 자동 결제 없음', vi:' · Không tự thu phí' },
    'pr.chip_auto': { ja:'✓ 自動課金なし', en:'✓ No auto-billing', zh:'✓ 无自动扣款', ko:'✓ 자동 결제 없음', vi:'✓ Không tự thu' },
    'pr.chip_penalty': { ja:'✓ 違約金0円', en:'✓ Zero penalty', zh:'✓ 违约金 0', ko:'✓ 위약금 0 원', vi:'✓ Không phí phạt' },
    'pr.chip_full': { ja:'✓ 全機能使い放題', en:'✓ All features', zh:'✓ 全功能无限', ko:'✓ 전 기능 무제한', vi:'✓ Toàn tính năng' },
    'pr.no_action': { ja:'💡 合わなかったら<br><strong>何もせず離脱でOK</strong>', en:'💡 If it doesn\'t fit<br><strong>just leave, do nothing</strong>', zh:'💡 不合适<br><strong>直接离开即可</strong>', ko:'💡 안 맞으면<br><strong>그냥 떠나도 OK</strong>', vi:'💡 Không hợp<br><strong>chỉ cần rời đi</strong>' },
    'pr.per_month': { ja:'/月（税込）', en:'/mo (tax incl.)', zh:'/月(含税)', ko:'/월 (세금 포함)', vi:'/tháng (đã thuế)' },
    'pr.per_year': { ja:'/年（税込）', en:'/yr (tax incl.)', zh:'/年(含税)', ko:'/년 (세금 포함)', vi:'/năm (đã thuế)' },
    'pr.m_tax': { ja:'※ 初期費用 無料 / 縛りなし / 月単位で柔軟に', en:'※ No setup fee / No lock-in / Monthly flexibility', zh:'※ 无初装费 / 无锁定 / 月度灵活', ko:'※ 초기 비용 무료 / 묶음 없음 / 월 단위 유연', vi:'※ Miễn phí cài đặt / Không cam kết / Linh hoạt theo tháng' },
    'pr.f_staff': { ja:'スタッフ数 無制限', en:'Unlimited staff', zh:'员工人数无限', ko:'직원 수 무제한', vi:'Số NV không giới hạn' },
    'pr.f_auto': { ja:'シフト自動生成・深夜割増', en:'Auto shift gen + night premium', zh:'班次自动生成 + 深夜加班', ko:'시프트 자동 생성 + 심야 할증', vi:'Tự tạo ca + phụ cấp đêm' },
    'pr.f_sales': { ja:'売上 × 人件費率 分析', en:'Sales × labor cost analysis', zh:'销售 × 人力成本分析', ko:'매출 × 인건비율 분석', vi:'Phân tích doanh thu × CP lao động' },
    'pr.f_eval': { ja:'スタッフ評価機能', en:'Staff rating', zh:'员工评价功能', ko:'직원 평가 기능', vi:'Đánh giá nhân viên' },
    'pr.f_recruit': { ja:'3段階自動募集 (Timee代替)', en:'3-tier auto-recruit (Timee alt)', zh:'3 段自动招募 (Timee 替代)', ko:'3 단계 자동 모집 (Timee 대체)', vi:'Tự tuyển 3 cấp (thay Timee)' },
    'pr.f_lang': { ja:'多言語対応 (日/英/中/韓/越)', en:'5 languages (JA/EN/ZH/KO/VI)', zh:'5 语言 (日/英/中/韩/越)', ko:'5 개 언어 (일/영/중/한/베)', vi:'5 ngôn ngữ (Nhật/Anh/Trung/Hàn/Việt)' },
    'pr.start_30day': { ja:'🎁 30日間 無料で始める', en:'🎁 Start 30-day free trial', zh:'🎁 30 天免费开始', ko:'🎁 30 일 무료 시작', vi:'🎁 Bắt đầu 30 ngày MP' },
    'pr.m_note': { ja:'⚡ 1分で登録完了 → すぐ全機能使えます<br>いつでも解約可能。違約金 一切なし。', en:'⚡ Sign up in 1 min → all features instantly<br>Cancel anytime. Zero penalty.', zh:'⚡ 1 分钟注册完成 → 立即使用全功能<br>随时取消,无违约金。', ko:'⚡ 1 분 등록 완료 → 즉시 전 기능 사용<br>언제든 해지 가능. 위약금 없음.', vi:'⚡ Đăng ký 1 phút → dùng ngay toàn tính năng<br>Hủy bất cứ lúc nào. Không phí phạt.' },
    'pr.popular': { ja:'🏆 一番選ばれている', en:'🏆 Most Popular', zh:'🏆 最受欢迎', ko:'🏆 가장 인기', vi:'🏆 Được chọn nhiều nhất' },
    'pr.a_badge': { ja:'⭐ 年払いプラン (おすすめ)', en:'⭐ Annual Plan (Recommended)', zh:'⭐ 年付方案(推荐)', ko:'⭐ 연간 결제 (추천)', vi:'⭐ Gói năm (Khuyến nghị)' },
    'pr.a_plan': { ja:'スタンダード (年払い)', en:'Standard (Annual)', zh:'标准版(年付)', ko:'스탠다드 (연 결제)', vi:'Tiêu chuẩn (Năm)' },
    'pr.a_banner_title': { ja:'🎁 30日間 無料 + 年払い特典', en:'🎁 30-day free + annual perks', zh:'🎁 30 天免费 + 年付福利', ko:'🎁 30 일 무료 + 연간 특전', vi:'🎁 30 ngày MP + đặc quyền năm' },
    'pr.a_banner_sub': { ja:'トライアル満了時に年払い選択で適用', en:'Applied on annual selection after trial', zh:'试用结束选年付时应用', ko:'트라이얼 만료 시 연 결제 선택으로 적용', vi:'Áp dụng khi chọn năm sau hết trial' },
    'pr.a_save': { ja:'💰 月換算 ¥4,158 — <strong>毎月 ¥832 お得</strong> (年¥9,980 = 2ヶ月分)', en:'💰 ~¥4,158/mo — <strong>save ¥832/mo</strong> (¥9,980/yr = 2 months)', zh:'💰 月均 ¥4,158 — <strong>月省 ¥832</strong> (年省 ¥9,980 = 2 个月)', ko:'💰 월 환산 ¥4,158 — <strong>매월 ¥832 절약</strong> (연 ¥9,980 = 2 개월)', vi:'💰 ~¥4,158/tháng — <strong>tiết kiệm ¥832/tháng</strong> (¥9,980/năm = 2 tháng)' },
    'pr.a_tax': { ja:'※ 1年契約 / 12ヶ月分一括払い', en:'※ 1-year contract / 12 months upfront', zh:'※ 1 年合约 / 12 个月一次性支付', ko:'※ 1 년 계약 / 12 개월 일괄 결제', vi:'※ HĐ 1 năm / Thanh toán 12 tháng' },
    'pr.a_f1': { ja:'<strong style="color:var(--indigo);">月払いの全機能 +</strong>', en:'<strong style="color:var(--indigo);">All monthly features +</strong>', zh:'<strong style="color:var(--indigo);">月付全功能 +</strong>', ko:'<strong style="color:var(--indigo);">월 결제 전 기능 +</strong>', vi:'<strong style="color:var(--indigo);">Toàn tính năng tháng +</strong>' },
    'pr.a_f2': { ja:'🎁 <strong>2ヶ月分の料金がお得</strong> (年¥9,980節約)', en:'🎁 <strong>Save 2 months</strong> (¥9,980/yr)', zh:'🎁 <strong>省 2 个月</strong> (年省 ¥9,980)', ko:'🎁 <strong>2 개월 절약</strong> (연 ¥9,980)', vi:'🎁 <strong>Tiết kiệm 2 tháng</strong> (¥9,980/năm)' },
    'pr.a_f3': { ja:'🎁 <strong>初期セットアップ無料サポート</strong> (通常¥30,000)', en:'🎁 <strong>Free initial setup</strong> (normally ¥30,000)', zh:'🎁 <strong>免费初装支持</strong> (通常 ¥30,000)', ko:'🎁 <strong>무료 초기 설정</strong> (통상 ¥30,000)', vi:'🎁 <strong>Miễn phí cài đặt</strong> (¥30,000)' },
    'pr.a_f4': { ja:'🎁 <strong>優先メールサポート</strong> (24時間以内返信保証)', en:'🎁 <strong>Priority email support</strong> (24h reply guarantee)', zh:'🎁 <strong>优先邮件支持</strong> (24 小时回复保证)', ko:'🎁 <strong>우선 이메일 지원</strong> (24 시간 답변 보장)', vi:'🎁 <strong>Hỗ trợ email ưu tiên</strong> (Trả lời trong 24h)' },
    'pr.a_f5': { ja:'🎁 <strong>スタッフ向け説明会</strong> 1回 無料 (Zoom 30分)', en:'🎁 <strong>Staff briefing</strong> 1× free (Zoom 30 min)', zh:'🎁 <strong>员工说明会</strong> 1 次免费 (Zoom 30 分钟)', ko:'🎁 <strong>직원 설명회</strong> 1 회 무료 (Zoom 30 분)', vi:'🎁 <strong>Buổi hướng dẫn NV</strong> 1 lần MP (Zoom 30 phút)' },
    'pr.a_f6': { ja:'🎁 <strong>機能要望 優先実装</strong> 投票で月1件', en:'🎁 <strong>Priority feature requests</strong> 1/month by vote', zh:'🎁 <strong>功能需求优先实现</strong> 月 1 件投票', ko:'🎁 <strong>기능 요청 우선 구현</strong> 월 1 건 투표', vi:'🎁 <strong>Yêu cầu tính năng ưu tiên</strong> 1 tháng/lượt vote' },
    'pr.a_f7': { ja:'🎁 <strong>カスタムロゴ表示</strong> 給与明細PDFに自店ロゴ', en:'🎁 <strong>Custom logo</strong> on payroll PDFs', zh:'🎁 <strong>自定义 Logo</strong> 在工资单 PDF', ko:'🎁 <strong>커스텀 로고</strong> 급여 명세 PDF 에', vi:'🎁 <strong>Logo tùy chỉnh</strong> trên PDF lương' },
    'pr.a_cta': { ja:'⭐ 年払いで始める (おすすめ)', en:'⭐ Start with Annual (Recommended)', zh:'⭐ 选择年付开始 (推荐)', ko:'⭐ 연 결제로 시작 (추천)', vi:'⭐ Bắt đầu với gói năm (Khuyến nghị)' },
    'pr.a_note': { ja:'※ 30日間トライアル後、年払いを選択 → 自動で特典が適用<br>※ 中途解約時は残月数を月額換算で返金 (最大 ¥4,990/月)<br>※ 法人決済・銀行振込・請求書払い 対応',
                    en:'※ After 30-day trial, select annual → perks auto-applied<br>※ Mid-term cancellation refunds remaining months at monthly rate (max ¥4,990/mo)<br>※ Corporate / bank transfer / invoice billing supported',
                    zh:'※ 30 天试用后选年付 → 自动应用福利<br>※ 中途取消按月退款剩余月份 (最多 ¥4,990/月)<br>※ 支持企业结算/银行汇款/发票付款',
                    ko:'※ 30 일 트라이얼 후 연간 선택 → 자동 적용<br>※ 중도 해지 시 잔여 월수 환불 (최대 ¥4,990/월)<br>※ 법인 결제 / 은행 송금 / 청구서 지원',
                    vi:'※ Sau trial 30 ngày, chọn năm → đặc quyền tự áp dụng<br>※ Hủy giữa kỳ hoàn tiền tháng còn lại (tối đa ¥4,990/tháng)<br>※ Hỗ trợ thanh toán DN/chuyển khoản/hóa đơn' },

    /* COMPARISON (index.html) */
    'cmp.title': { ja:'他のシフト管理と何が違う？', en:'What\'s different from other shift tools?', zh:'与其他班次管理有何不同?', ko:'다른 시프트 관리와 무엇이 다른가?', vi:'Khác biệt so với công cụ ca khác?' },
    'cmp.sub': { ja:'バー・飲食店専用に最適化。Timee 手数料を月数万円削減できます。', en:'Optimized for bars & restaurants. Cut Timee fees by tens of thousands/month.', zh:'专为酒吧、餐饮店优化。每月可节省数万日元 Timee 手续费。', ko:'바·음식점 전용 최적화. Timee 수수료 월 수만 엔 절감.', vi:'Tối ưu cho bar & nhà hàng. Tiết kiệm hàng chục nghìn yên phí Timee/tháng.' },
    'cmp.r_monthly': { ja:'月額料金', en:'Monthly fee', zh:'月费', ko:'월 요금', vi:'Phí tháng' },
    'cmp.r_auto_shift': { ja:'シフト自動作成', en:'Auto shift creation', zh:'班次自动制作', ko:'시프트 자동 작성', vi:'Tạo ca tự động' },
    'cmp.r_night': { ja:'深夜割増 自動計算', en:'Auto night premium', zh:'深夜加班自动计算', ko:'심야 할증 자동 계산', vi:'Tự tính phụ cấp đêm' },
    'cmp.r_recruit': { ja:'不足コマ自動募集', en:'Auto-recruit for gaps', zh:'空缺岗位自动招募', ko:'부족 시간 자동 모집', vi:'Tự tuyển ca thiếu' },
    'cmp.r_timee_link': { ja:'Timee/シェアフル連携', en:'Timee/Sharefull integration', zh:'Timee/Sharefull 集成', ko:'Timee/Sharefull 연동', vi:'Tích hợp Timee/Sharefull' },
    'cmp.r_labor_cost': { ja:'売上 × 人件費率', en:'Sales × labor cost', zh:'销售 × 人力成本率', ko:'매출 × 인건비율', vi:'Doanh thu × CP lao động' },
    'cmp.r_eval': { ja:'スタッフ評価', en:'Staff rating', zh:'员工评价', ko:'직원 평가', vi:'Đánh giá NV' },
    'cmp.r_optimized': { ja:'飲食店業態最適化', en:'F&B-optimized', zh:'餐饮业态优化', ko:'음식점 업태 최적화', vi:'Tối ưu cho F&B' },
    'cmp.r_trial': { ja:'30日間 無料体験', en:'30-day free trial', zh:'30 天免费体验', ko:'30 일 무료 체험', vi:'30 ngày miễn phí' },
    'cmp.r_foreign': { ja:'外国人スタッフ対応', en:'Foreign staff support', zh:'外籍员工支持', ko:'외국인 직원 지원', vi:'Hỗ trợ NV nước ngoài' },
    'cmp.timee_fee': { ja:'¥0 + 紹介料 ¥30k-50k', en:'¥0 + ¥30k-50k referral', zh:'¥0 + 介绍费 ¥30k-50k', ko:'¥0 + 소개료 ¥30k-50k', vi:'¥0 + Phí giới thiệu ¥30k-50k' },
    'cmp.one_tap': { ja:'◎ 1タップ', en:'◎ One tap', zh:'◎ 一键', ko:'◎ 원 탭', vi:'◎ 1 chạm' },
    'cmp.one_tap2': { ja:'◎ ワンタップ', en:'◎ One tap', zh:'◎ 一键', ko:'◎ 원 탭', vi:'◎ 1 chạm' },
    'cmp.manual': { ja:'✕ 手動', en:'✕ Manual', zh:'✕ 手动', ko:'✕ 수동', vi:'✕ Thủ công' },
    'cmp.handcalc': { ja:'✕ 手計算', en:'✕ Hand calc', zh:'✕ 手算', ko:'✕ 수계산', vi:'✕ Tính tay' },
    'cmp.handcalc2': { ja:'✕ 手計算', en:'✕ Hand calc', zh:'✕ 手算', ko:'✕ 수계산', vi:'✕ Tính tay' },
    'cmp.three_stage': { ja:'◎ 3段階自動', en:'◎ 3-tier auto', zh:'◎ 3 段自动', ko:'◎ 3 단계 자동', vi:'◎ Tự 3 cấp' },
    'cmp.spot': { ja:'○ 単発', en:'○ Spot', zh:'○ 单次', ko:'○ 단발', vi:'○ Đơn lẻ' },
    'cmp.auto2': { ja:'◎ 自動', en:'◎ Auto', zh:'◎ 自动', ko:'◎ 자동', vi:'◎ Tự động' },
    'cmp.five_grade': { ja:'◎ 5段階', en:'◎ 5-grade', zh:'◎ 5 级', ko:'◎ 5 단계', vi:'◎ 5 cấp' },
    'cmp.dedicated': { ja:'◎ 専用', en:'◎ Dedicated', zh:'◎ 专用', ko:'◎ 전용', vi:'◎ Chuyên dụng' },
    'cmp.five_lang': { ja:'◎ 5言語', en:'◎ 5 languages', zh:'◎ 5 语言', ko:'◎ 5 개 언어', vi:'◎ 5 ngôn ngữ' },
    'cmp.note': { ja:'※ 2026年5月時点の各社公開情報に基づく比較。料金は税抜き表記の場合があります。', en:'※ Comparison based on public info as of May 2026. Prices may exclude tax.', zh:'※ 基于 2026 年 5 月各公司公开信息比较。价格可能不含税。', ko:'※ 2026 년 5 월 시점 각 사 공개 정보 비교. 가격은 세금 별도일 수 있음.', vi:'※ So sánh dựa trên thông tin công khai tại 5/2026. Giá có thể chưa thuế.' },

    /* FOUNDER (index.html) */
    'founder.title': { ja:'代表からひとこと', en:'A word from the founder', zh:'创始人寄语', ko:'대표의 한 마디', vi:'Lời từ nhà sáng lập' },
    'founder.name': { ja:'小泉 咲太', en:'Shota Koizumi', zh:'小泉 咲太', ko:'코이즈미 쇼타', vi:'Shota Koizumi' },
    'founder.role': { ja:'RAKURAKU 代表', en:'RAKURAKU CEO', zh:'RAKURAKU 创始人', ko:'RAKURAKU 대표', vi:'CEO RAKURAKU' },
    'founder.quote': { ja:'シフト管理の煩雑さ、Excel と LINE の往復、Timee 手数料の重さ。<br>僕自身の飲食店現場での経験から、「<strong>もう、シフトで悩まない</strong>」をつくりました。<br>バー・飲食店関係者さん、何でもご相談ください。代表が直接対応します。',
                       en:'Shift complexity, the Excel ↔ LINE back-and-forth, heavy Timee fees.<br>From my own restaurant-floor experience, I built "<strong>No more shift stress</strong>."<br>Bar & restaurant operators — ask me anything. I respond directly.',
                       zh:'班次管理的繁琐,Excel 和 LINE 的往复,Timee 手续费的重负。<br>基于我自己的餐饮业现场经验,打造了"<strong>不再为班次烦恼</strong>"。<br>酒吧、餐饮业者,有任何问题请咨询。CEO 直接回应。',
                       ko:'시프트 관리의 번잡함, Excel 과 LINE 의 왕복, Timee 수수료의 무거움.<br>제 자신의 음식점 현장 경험에서 "<strong>더 이상 시프트로 고민하지 않는</strong>" 을 만들었습니다.<br>바·음식점 관계자분, 무엇이든 상담해주세요. 대표가 직접 대응합니다.',
                       vi:'Sự phức tạp của quản lý ca, qua lại Excel ↔ LINE, phí Timee nặng nề.<br>Từ kinh nghiệm của tôi trong ngành nhà hàng, tôi đã tạo ra "<strong>Không còn stress về ca</strong>."<br>Người làm bar/nhà hàng — hãy hỏi tôi bất cứ điều gì. CEO trả lời trực tiếp.' },

    /* FAQ (index.html) */
    'faq.title': { ja:'よくあるご質問', en:'Frequently Asked Questions', zh:'常见问题', ko:'자주 묻는 질문', vi:'Câu hỏi thường gặp' },
    'faq.q1': { ja:'アプリのインストールは必要ですか？', en:'Do I need to install an app?', zh:'需要安装应用吗?', ko:'앱 설치가 필요한가요?', vi:'Có cần cài app không?' },
    'faq.a1': { ja:'不要です。スマホ・PCのブラウザで利用できます。ホーム画面に追加すればアプリのように起動できます（PWA対応）。', en:'No. Works in any phone/PC browser. Add to home screen to launch like an app (PWA).', zh:'不需要。手机 / PC 浏览器即可使用。添加到主屏幕可像 app 一样启动 (PWA)。', ko:'불필요. 스마트폰·PC 브라우저에서 사용. 홈 화면에 추가하면 앱처럼 실행 (PWA).', vi:'Không cần. Dùng trên trình duyệt điện thoại/PC. Thêm vào màn hình chính để chạy như app (PWA).' },
    'faq.q2': { ja:'スタッフ側の登録は必要ですか？', en:'Do staff need to register?', zh:'员工需要注册吗?', ko:'직원 측 등록이 필요한가요?', vi:'NV có cần đăng ký không?' },
    'faq.a2': { ja:'アカウント作成は不要です。店長が共有するQRコードを読み取って、名前と希望日時を入力するだけで提出完了します。', en:'No account needed. Just scan the manager\'s QR, enter name & preferred dates — done.', zh:'无需创建账号。扫描店长分享的 QR 码,输入姓名和希望日时即可提交。', ko:'계정 생성 불필요. 점장이 공유한 QR 을 스캔하고 이름과 희망 일시 입력만으로 제출 완료.', vi:'Không cần tài khoản. Chỉ quét QR của quản lý, nhập tên & ngày mong muốn — xong.' },
    'faq.q3': { ja:'複数店舗の管理はできますか？', en:'Can I manage multiple stores?', zh:'可以管理多个店铺吗?', ko:'다점포 관리 가능한가요?', vi:'Có thể quản lý nhiều cửa hàng?' },
    'faq.a3': { ja:'はい、店舗ごとに別URLが発行されるので、データを混在させずに複数店舗を運用できます。各店舗で月額がかかります。', en:'Yes. Each store gets its own URL — no data mixing. Monthly fee per store.', zh:'可以。每个店铺有独立 URL,数据不混淆。每店收取月费。', ko:'네. 매장별 별도 URL 발급 → 데이터 혼재 없음. 매장별 월 요금.', vi:'Có. Mỗi cửa hàng có URL riêng — không trộn dữ liệu. Phí tháng theo từng cửa hàng.' },
    'faq.q4': { ja:'深夜割増以外の割増賃金にも対応していますか？', en:'Other premium wages besides late night?', zh:'除深夜外的加班费也支持吗?', ko:'심야 외 할증 임금도 대응하나요?', vi:'Có hỗ trợ phụ cấp khác ngoài đêm?' },
    'faq.a4': { ja:'現在は深夜（22:00〜翌5:00 +25%）の自動計算に対応しています。時間外労働・休日労働の割増は労基法に基づき別途計算が必要ですが、アプリ内に解説パネルを用意しています。', en:'Currently auto-calculates late night (22:00-05:00 +25%). Overtime/holiday premiums per labor law need separate calc — explanation panel inside the app.', zh:'目前自动计算深夜 (22:00-次日 5:00 +25%)。加班/节假日加成需根据劳基法另算,app 内有解说面板。', ko:'현재 심야 (22:00-익일 5:00 +25%) 자동 계산. 시간외·휴일 할증은 별도 계산 필요, 앱 내 설명 패널 제공.', vi:'Hiện tự tính đêm (22h-5h +25%). Phụ cấp tăng ca/ngày nghỉ cần tính riêng theo luật — có bảng giải thích trong app.' },
    'faq.q5': { ja:'解約はいつでもできますか？', en:'Can I cancel anytime?', zh:'可以随时取消吗?', ko:'언제든 해지 가능한가요?', vi:'Có thể hủy bất cứ lúc nào?' },
    'faq.a5': { ja:'はい、いつでも解約可能です。違約金は一切ありません。解約申請の翌月以降、ご請求は発生しません。', en:'Yes, anytime. Zero penalty. No billing from the month after cancellation.', zh:'可以随时取消。无任何违约金。取消申请次月起不再扣款。', ko:'네, 언제든. 위약금 없음. 해지 신청 다음 달부터 청구 없음.', vi:'Có, bất cứ lúc nào. Không phí phạt. Không tính phí từ tháng sau khi hủy.' },
    'faq.q6': { ja:'無料お試しはありますか？', en:'Is there a free trial?', zh:'有免费试用吗?', ko:'무료 체험이 있나요?', vi:'Có dùng thử miễn phí không?' },
    'faq.a6': { ja:'はい、30 日 Pro 体験がございます。自動課金なしなので、お試し後そのまま離脱されても費用は一切発生しません。料金プランの「30日 Pro 体験で始める」ボタンからすぐに開始できます。', en:'Yes — 30-day Pro trial. No auto-billing, so leaving after trial costs nothing. Start via "30-day Pro Trial" button on pricing page.', zh:'有 30 天 Pro 体验。无自动扣款,试用后离开无任何费用。在价格页"30 天 Pro 体验开始"按钮立即开始。', ko:'네, 30 일 Pro 체험. 자동 결제 없음, 체험 후 떠나도 비용 없음. 요금제 "30 일 Pro 체험" 버튼으로 즉시 시작.', vi:'Có — Pro thử 30 ngày. Không tự thu phí, rời đi sau trial không tốn gì. Nhấn nút "30-day Pro Trial" trên trang giá.' },
    'faq.q7': { ja:'外国人スタッフ向けの言語対応はありますか？', en:'Language support for foreign staff?', zh:'有针对外籍员工的语言支持吗?', ko:'외국인 직원용 언어 지원이 있나요?', vi:'Có hỗ trợ ngôn ngữ cho NV nước ngoài?' },
    'faq.a7': { ja:'日本語・English・中文・한국어・Tiếng Việt の <strong>5言語に完全対応</strong> しています。シフト提出・打刻・通知・給与照会まで、スタッフが自分の母国語で操作できます。インバウンド業態や留学生スタッフが多い店舗様で特に重宝されています。', en:'<strong>Full 5-language support</strong>: 日本語・English・中文・한국어・Tiếng Việt. Staff submit shifts, clock in, get notifications, view payroll — all in their native language. Especially valued by inbound businesses and shops with many international students.', zh:'<strong>完整 5 语言支持</strong>: 日语·English·中文·한국어·Tiếng Việt。员工可用母语完成班次提交/打卡/通知/薪资查询。入境业态和留学生多的店铺尤其受用。', ko:'<strong>5 개 언어 완전 지원</strong>: 日本語·English·中文·한국어·Tiếng Việt. 직원이 모국어로 시프트 제출/출근/알림/급여 조회 가능. 인바운드 업태나 유학생이 많은 매장에서 특히 호평.', vi:'<strong>Hỗ trợ đầy đủ 5 ngôn ngữ</strong>: 日本語·English·中文·한국어·Tiếng Việt. NV gửi ca/chấm công/thông báo/xem lương — tất cả bằng tiếng mẹ. Đặc biệt giá trị cho ngành inbound và cửa hàng nhiều du học sinh.' },
    'faq.q8': { ja:'他のシフト管理ツールから乗り換えできますか？', en:'Can I migrate from other shift tools?', zh:'能从其他班次工具迁移吗?', ko:'다른 시프트 도구에서 이전 가능한가요?', vi:'Có chuyển từ công cụ ca khác được không?' },
    'faq.a8': { ja:'はい、可能です。CSVファイルでのスタッフ・シフトデータインポートに対応しています。乗り換え作業はサポートでお手伝いいたしますので、お気軽にご相談ください (koizumishota0323@gmail.com)。', en:'Yes. We support CSV import for staff/shift data. We help with migration — feel free to contact (koizumishota0323@gmail.com).', zh:'可以。支持 CSV 导入员工和班次数据。迁移工作我们会帮忙,请随时咨询 (koizumishota0323@gmail.com)。', ko:'네 가능. CSV 파일로 직원·시프트 데이터 임포트 지원. 이전 작업 도와드립니다 (koizumishota0323@gmail.com).', vi:'Có. Hỗ trợ import CSV dữ liệu NV/ca. Chúng tôi giúp chuyển — liên hệ thoải mái (koizumishota0323@gmail.com).' },
    'faq.q9': { ja:'サポートはどんな対応をしてくれますか？', en:'What kind of support do you provide?', zh:'提供什么样的支持?', ko:'어떤 지원을 제공하나요?', vi:'Hỗ trợ như thế nào?' },
    'faq.a9': { ja:'代表 小泉 が直接対応します (平日10:00-18:00)。導入時のセットアップサポート、運用に関するご相談、機能要望の受付など、すべて代表が一次対応します。「ヒアリング調査の声」ページで実際にいただいたご要望から優先順位を決めて開発しています。', en:'CEO Koizumi handles directly (weekdays 10:00-18:00). Setup support, operational consulting, feature requests — all primary responses by the CEO. Priorities decided from real feedback on the "Hearing Survey Voices" page.', zh:'CEO 小泉直接对应 (工作日 10:00-18:00)。导入支持、运营咨询、功能需求,全部由 CEO 一次回应。优先级根据"调研意见"页面的真实反馈决定。', ko:'대표 코이즈미가 직접 대응 (평일 10:00-18:00). 도입 지원·운용 상담·기능 요청 모두 대표가 1 차 대응. "청취 조사 의견" 페이지의 실제 피드백으로 우선순위 결정.', vi:'CEO Koizumi xử lý trực tiếp (T2-T6, 10:00-18:00). Hỗ trợ cài đặt, tư vấn vận hành, yêu cầu tính năng — CEO trả lời đầu tiên. Ưu tiên từ phản hồi thực tế trên trang "Hearing Survey Voices".' },
    'faq.more': { ja:'❓ もっと FAQ を見る (30問+)', en:'❓ See more FAQs (30+)', zh:'❓ 查看更多 FAQ (30+)', ko:'❓ 더 많은 FAQ (30+)', vi:'❓ Xem thêm FAQ (30+)' },

    /* CTA (index.html bottom) */
    'cta.title': { ja:'シフトに費やす時間を、本業に。', en:'Reclaim shift time for your real work.', zh:'把花在班次上的时间还给本业。', ko:'시프트에 쓰는 시간을 본업으로.', vi:'Trả lại thời gian xếp ca cho công việc chính.' },
    'cta.sub': { ja:'導入相談・無料デモのご希望はお気軽にお問い合わせください。', en:'Free demo and onboarding consultation — get in touch anytime.', zh:'导入咨询、免费演示请随时联系我们。', ko:'도입 상담·무료 데모 희망 사항은 언제든 문의해주세요.', vi:'Tư vấn triển khai & demo miễn phí — liên hệ bất cứ lúc nào.' },
    'cta.btn': { ja:'📨 お問い合わせはこちら', en:'📨 Contact us', zh:'📨 联系我们', ko:'📨 문의는 여기로', vi:'📨 Liên hệ tại đây' },

    /* FOOTER (index.html) */
    'footer.desc': { ja:'バー・飲食店向け<br>シフト管理プラットフォーム', en:'Shift management platform<br>for bars & restaurants', zh:'酒吧·餐厅<br>班次管理平台', ko:'바·음식점용<br>시프트 관리 플랫폼', vi:'Nền tảng quản lý ca<br>cho bar & nhà hàng' },
    'footer.features': { ja:'機能一覧', en:'Features', zh:'功能列表', ko:'기능 목록', vi:'Danh sách tính năng' },
    'footer.pricing': { ja:'料金プラン', en:'Pricing', zh:'价格方案', ko:'요금제', vi:'Bảng giá' },
    'footer.how': { ja:'使い方', en:'How to use', zh:'使用方法', ko:'사용법', vi:'Cách dùng' },
    'footer.getting_started': { ja:'3分で始める', en:'Start in 3 min', zh:'3 分钟开始', ko:'3 분 시작', vi:'Bắt đầu 3 phút' },
    'footer.help': { ja:'ヘルプ・FAQ', en:'Help & FAQ', zh:'帮助·FAQ', ko:'도움말·FAQ', vi:'Trợ giúp·FAQ' },
    'footer.demo': { ja:'🎁 無料デモ予約', en:'🎁 Free demo booking', zh:'🎁 免费演示预约', ko:'🎁 무료 데모 예약', vi:'🎁 Đặt demo MP' },
    'footer.referral': { ja:'🤝 紹介プログラム', en:'🤝 Referral program', zh:'🤝 推荐计划', ko:'🤝 추천 프로그램', vi:'🤝 Chương trình giới thiệu' },
    'footer.cases': { ja:'📊 ヒアリング事例', en:'📊 Hearing cases', zh:'📊 调研案例', ko:'📊 청취 사례', vi:'📊 Case khảo sát' },
    'footer.blog': { ja:'📚 ブログ', en:'📚 Blog', zh:'📚 博客', ko:'📚 블로그', vi:'📚 Blog' },
    'footer.roadmap': { ja:'🗺 機能ロードマップ', en:'🗺 Roadmap', zh:'🗺 功能路线图', ko:'🗺 로드맵', vi:'🗺 Lộ trình' },
    'footer.status': { ja:'🚦 稼働状況', en:'🚦 Status', zh:'🚦 运行状态', ko:'🚦 가동 상태', vi:'🚦 Trạng thái' },
    'footer.careers': { ja:'💼 採用情報', en:'💼 Careers', zh:'💼 招聘信息', ko:'💼 채용 정보', vi:'💼 Tuyển dụng' },
    'footer.terms': { ja:'利用規約', en:'Terms of Service', zh:'使用条款', ko:'이용 약관', vi:'Điều khoản' },
    'footer.privacy': { ja:'プライバシーポリシー', en:'Privacy Policy', zh:'隐私政策', ko:'개인정보 처리방침', vi:'Chính sách riêng tư' },
    'footer.tokusho': { ja:'特定商取引法に基づく表記', en:'Legal disclosures (JP)', zh:'特商法表记', ko:'특정 상거래법 표기', vi:'Công bố pháp lý (JP)' },
    'footer.about': { ja:'会社概要', en:'About', zh:'公司简介', ko:'회사 소개', vi:'Về chúng tôi' },
    'footer.email': { ja:'📧 メールでお問合せ', en:'📧 Email us', zh:'📧 邮件咨询', ko:'📧 이메일 문의', vi:'📧 Liên hệ email' },
    'footer.hours': { ja:'受付: 平日 10:00-18:00', en:'Hours: Weekdays 10:00-18:00', zh:'受理: 工作日 10:00-18:00', ko:'접수: 평일 10:00-18:00', vi:'Giờ: T2-T6 10:00-18:00' },
    'footer.copyright': { ja:'© 2026 RAKURAKU. All rights reserved.', en:'© 2026 RAKURAKU. All rights reserved.', zh:'© 2026 RAKURAKU. All rights reserved.', ko:'© 2026 RAKURAKU. All rights reserved.', vi:'© 2026 RAKURAKU. All rights reserved.' },

    /* TOKUSHOHO (特定商取引法) */
    'tk.title': { ja:'📋 特定商取引法に基づく表記', en:'📋 Legal Disclosures (Japan Specified Commercial Transaction Act)', zh:'📋 基于特定商取引法的标识', ko:'📋 특정 상거래법 표기', vi:'📋 Công bố pháp lý (Luật giao dịch JP)' },
    'tk.seller': { ja:'販売事業者', en:'Seller', zh:'销售事业者', ko:'판매 사업자', vi:'Người bán' },
    'tk.manager': { ja:'運営責任者', en:'Operations Manager', zh:'运营负责人', ko:'운영 책임자', vi:'Người phụ trách vận hành' },
    'tk.manager_name': { ja:'小泉 咲太', en:'Shota Koizumi', zh:'小泉 咲太', ko:'코이즈미 쇼타', vi:'Shota Koizumi' },
    'tk.address': { ja:'所在地', en:'Address', zh:'所在地', ko:'소재지', vi:'Địa chỉ' },
    'tk.address_val': { ja:'神奈川県横浜市桜木町', en:'Sakuragicho, Yokohama, Kanagawa, Japan', zh:'神奈川县横滨市樱木町', ko:'가나가와현 요코하마시 사쿠라기초', vi:'Sakuragicho, Yokohama, Kanagawa, Nhật Bản' },
    'tk.phone': { ja:'電話番号', en:'Phone', zh:'电话号码', ko:'전화번호', vi:'Điện thoại' },
    'tk.email': { ja:'メールアドレス', en:'Email', zh:'电子邮件', ko:'이메일', vi:'Email' },
    'tk.url': { ja:'ウェブサイトURL', en:'Website URL', zh:'网站 URL', ko:'웹사이트 URL', vi:'URL website' },
    'tk.price': { ja:'販売価格', en:'Price', zh:'销售价格', ko:'판매 가격', vi:'Giá bán' },
    'tk.price_val': { ja:'スタンダードプラン: 月額 ¥4,990（税込）<br>※ 各サービス紹介ページに表示の金額', en:'Standard Plan: ¥4,990/month (tax incl.)<br>※ See each service page for details', zh:'标准方案: 每月 ¥4,990 (含税)<br>※ 详见各服务介绍页', ko:'스탠다드 플랜: 월 ¥4,990 (세금 포함)<br>※ 각 서비스 페이지 참조', vi:'Gói Tiêu chuẩn: ¥4,990/tháng (đã thuế)<br>※ Xem chi tiết trên trang dịch vụ' },
    'tk.other_fees': { ja:'商品代金以外の必要料金', en:'Other required fees', zh:'商品代金以外的费用', ko:'상품 대금 외 필요 요금', vi:'Phí khác ngoài giá sản phẩm' },
    'tk.other_fees_val': { ja:'なし（決済手数料は当社負担）<br>※ 通信費・銀行振込手数料はお客様負担', en:'None (payment fees on us)<br>※ Communication & bank transfer fees are customer-borne', zh:'无 (结算手续费由本公司承担)<br>※ 通讯费/银行汇款手续费由客户承担', ko:'없음 (결제 수수료 당사 부담)<br>※ 통신비·은행 송금 수수료는 고객 부담', vi:'Không (phí thanh toán bên chúng tôi)<br>※ Phí liên lạc & chuyển khoản KH chịu' },
    'tk.pay_method': { ja:'お支払い方法', en:'Payment Methods', zh:'支付方式', ko:'결제 방법', vi:'Phương thức thanh toán' },
    'tk.pay_method_val': { ja:'クレジットカード（Visa / Mastercard / JCB / AMEX）<br>銀行振込（請求書発行）', en:'Credit card (Visa / Mastercard / JCB / AMEX)<br>Bank transfer (invoice issued)', zh:'信用卡 (Visa / Mastercard / JCB / AMEX)<br>银行汇款 (开具发票)', ko:'신용카드 (Visa / Mastercard / JCB / AMEX)<br>은행 송금 (청구서 발행)', vi:'Thẻ tín dụng (Visa / Mastercard / JCB / AMEX)<br>Chuyển khoản (xuất hóa đơn)' },
    'tk.pay_time': { ja:'お支払い時期', en:'Payment Timing', zh:'支付时间', ko:'결제 시기', vi:'Thời gian thanh toán' },
    'tk.pay_time_val': { ja:'毎月1日に自動課金（クレジットカード）<br>銀行振込の場合は当月末日まで', en:'Auto-charged on the 1st each month (credit card)<br>By month-end for bank transfer', zh:'每月 1 日自动扣款 (信用卡)<br>银行汇款需在月底前', ko:'매월 1 일 자동 결제 (신용카드)<br>은행 송금은 당월 말까지', vi:'Tự thu phí ngày 1 hàng tháng (thẻ)<br>Chuyển khoản trước cuối tháng' },
    'tk.delivery': { ja:'サービス提供時期', en:'Service Delivery', zh:'服务提供时间', ko:'서비스 제공 시기', vi:'Thời gian cung cấp' },
    'tk.delivery_val': { ja:'お申し込み・お支払い確認後、即時ご利用いただけます', en:'Immediately available after sign-up and payment confirmation', zh:'申请并确认付款后即可立即使用', ko:'신청·결제 확인 후 즉시 이용 가능', vi:'Có thể dùng ngay sau khi đăng ký & xác nhận thanh toán' },
    'tk.refund': { ja:'返品・キャンセル', en:'Refunds / Cancellation', zh:'退款·取消', ko:'반품·취소', vi:'Hoàn tiền·Hủy' },
    'tk.refund_val': { ja:'サービスの性質上、月次料金のお支払い後の返金は原則承っておりません。<br>解約はいつでも可能で、解約月の翌月以降のご請求は発生しません。', en:'Due to service nature, monthly fees are generally non-refundable after payment.<br>Cancel anytime — no charges from the month after cancellation.', zh:'服务性质上,月费支付后原则上不退款。<br>取消可随时,取消次月起不再扣款。', ko:'서비스 특성상 월 요금 결제 후 환불 원칙적 불가.<br>해지는 언제든, 해지 다음 달부터 청구 없음.', vi:'Do tính chất dịch vụ, không hoàn phí tháng sau khi đã thanh toán.<br>Hủy bất cứ lúc nào — không tính phí từ tháng sau hủy.' },
    'tk.env': { ja:'動作環境', en:'System Requirements', zh:'运行环境', ko:'동작 환경', vi:'Yêu cầu hệ thống' },
    'tk.env_val': { ja:'iOS Safari 14+、Android Chrome 90+、PC Chrome / Safari / Edge 最新版', en:'iOS Safari 14+, Android Chrome 90+, latest PC Chrome / Safari / Edge', zh:'iOS Safari 14+,Android Chrome 90+,PC Chrome / Safari / Edge 最新版', ko:'iOS Safari 14+, Android Chrome 90+, PC Chrome / Safari / Edge 최신', vi:'iOS Safari 14+, Android Chrome 90+, Chrome / Safari / Edge mới nhất' },
    'tk.disclose': { ja:'※ 詳細な番地等は、ご請求があった場合に遅延なく開示いたします。', en:'※ Full address available without delay upon request.', zh:'※ 详细地址等如有请求将立即公开。', ko:'※ 상세 번지 등은 요청 시 지체 없이 공개합니다.', vi:'※ Địa chỉ chi tiết sẽ cung cấp ngay khi yêu cầu.' },

    /* TERMS OVERLAY */
    'overlay.close_aria': { ja:'閉じる', en:'Close', zh:'关闭', ko:'닫기', vi:'Đóng' },
    'terms.title': { ja:'利用規約', en:'Terms of Service', zh:'使用条款', ko:'이용 약관', vi:'Điều khoản dịch vụ' },
    'terms.intro': { ja:'本規約は、RAKURAKU（以下「本サービス」）の利用条件を定めるものです。本サービスをご利用の際は、本規約に同意したものとみなされます。', en:'These terms govern use of RAKURAKU ("the Service"). By using the Service you agree to these terms.', zh:'本条款规定 RAKURAKU (以下"本服务") 的使用条件。使用本服务即视为同意本条款。', ko:'본 약관은 RAKURAKU (이하 "본 서비스") 이용 조건을 정합니다. 본 서비스 이용 시 본 약관에 동의한 것으로 간주됩니다.', vi:'Các điều khoản này quản lý việc sử dụng RAKURAKU ("Dịch vụ"). Sử dụng tức là đồng ý.' },
    'terms.h1': { ja:'第1条（適用）', en:'Article 1 (Application)', zh:'第 1 条 (适用)', ko:'제 1 조 (적용)', vi:'Điều 1 (Áp dụng)' },
    'terms.p1': { ja:'本規約は、本サービスの提供条件およびサービス運営者（以下「当社」）と利用者との間の権利義務関係を定めます。', en:'These terms define service conditions and rights/obligations between the operator ("we") and users.', zh:'本条款规定本服务提供条件及运营方与用户之间的权利义务关系。', ko:'본 약관은 본 서비스 제공 조건 및 운영자와 이용자 간 권리 의무 관계를 정합니다.', vi:'Điều khoản này quy định điều kiện cung cấp dịch vụ và quan hệ giữa nhà cung cấp và người dùng.' },
    'terms.h2': { ja:'第2条（利用登録）', en:'Article 2 (Registration)', zh:'第 2 条 (注册)', ko:'제 2 조 (이용 등록)', vi:'Điều 2 (Đăng ký)' },
    'terms.p2': { ja:'利用者は、当社所定の方法によって申込みを行い、当社の承諾をもって利用契約が成立します。', en:'Users apply via our designated method; contract is formed upon our acceptance.', zh:'用户按本公司指定方式申请,经本公司承诺后合同成立。', ko:'이용자는 당사 소정 방식으로 신청, 당사 승낙으로 이용 계약 성립.', vi:'Người dùng đăng ký theo cách chúng tôi chỉ định; hợp đồng có hiệu lực khi chúng tôi chấp nhận.' },
    'terms.h3': { ja:'第3条（料金および支払方法）', en:'Article 3 (Fees & Payment)', zh:'第 3 条 (费用及支付)', ko:'제 3 조 (요금 및 결제)', vi:'Điều 3 (Phí & Thanh toán)' },
    'terms.p3': { ja:'利用者は、当社が定める利用料金（月額¥4,990税込）を、当社が指定する方法により支払うものとします。', en:'Users pay the fee we set (¥4,990/month tax incl.) via our designated method.', zh:'用户按本公司指定方式支付我们设定的费用 (月 ¥4,990 含税)。', ko:'이용자는 당사가 정하는 요금 (월 ¥4,990 세금 포함) 을 당사 지정 방법으로 결제.', vi:'Người dùng trả phí chúng tôi đặt (¥4,990/tháng đã thuế) theo cách chúng tôi chỉ định.' },
    'terms.h4': { ja:'第4条（禁止事項）', en:'Article 4 (Prohibited Acts)', zh:'第 4 条 (禁止事项)', ko:'제 4 조 (금지 사항)', vi:'Điều 4 (Cấm)' },
    'terms.p4': { ja:'利用者は、本サービスの利用にあたり以下の行為を行ってはなりません：', en:'Users may not engage in the following:', zh:'用户使用本服务时不得进行以下行为:', ko:'이용자는 본 서비스 이용 시 다음 행위를 해서는 안 됩니다:', vi:'Người dùng không được thực hiện các hành vi sau:' },
    'terms.p4_1': { ja:'法令または公序良俗に違反する行為', en:'Acts violating laws or public order', zh:'违反法令或公序良俗的行为', ko:'법령 또는 공서양속 위반 행위', vi:'Vi phạm pháp luật hoặc trật tự công cộng' },
    'terms.p4_2': { ja:'本サービスの運営を妨害する行為', en:'Acts disrupting service operation', zh:'妨碍本服务运营的行为', ko:'본 서비스 운영을 방해하는 행위', vi:'Cản trở vận hành dịch vụ' },
    'terms.p4_3': { ja:'他の利用者・第三者の権利を侵害する行為', en:'Infringing rights of other users / third parties', zh:'侵犯其他用户或第三方权利的行为', ko:'다른 이용자·제 3 자 권리 침해', vi:'Xâm phạm quyền của người dùng khác / bên thứ ba' },
    'terms.p4_4': { ja:'本サービスを不正に複製・改変・配布する行為', en:'Unauthorized copy / modification / distribution', zh:'非法复制·修改·分发本服务', ko:'본 서비스 부정 복제·변경·배포', vi:'Sao chép / sửa đổi / phân phối trái phép' },
    'terms.h5': { ja:'第5条（解約）', en:'Article 5 (Cancellation)', zh:'第 5 条 (取消)', ko:'제 5 조 (해지)', vi:'Điều 5 (Hủy)' },
    'terms.p5': { ja:'利用者は、いつでも所定の方法により本サービスを解約できます。解約月の翌月以降の利用料金は発生しません。', en:'Users may cancel anytime. No fees from the month after cancellation.', zh:'用户可随时按规定方式取消。取消次月起不产生费用。', ko:'이용자는 언제든 소정 방식으로 해지 가능. 해지 다음 달부터 요금 없음.', vi:'Người dùng có thể hủy bất cứ lúc nào. Không phí từ tháng sau hủy.' },
    'terms.h6': { ja:'第6条（免責事項）', en:'Article 6 (Disclaimer)', zh:'第 6 条 (免责)', ko:'제 6 조 (면책)', vi:'Điều 6 (Miễn trừ)' },
    'terms.p6': { ja:'当社は、本サービスの利用により利用者に生じた損害について、当社の故意または重大な過失による場合を除き、責任を負わないものとします。', en:'We are not liable for user damages except in cases of our willful misconduct or gross negligence.', zh:'除本公司故意或重大过失外,本公司不对用户使用本服务产生的损害负责。', ko:'당사 고의 또는 중대 과실 외, 본 서비스 이용에 의한 손해에 대해 책임지지 않습니다.', vi:'Chúng tôi không chịu trách nhiệm cho thiệt hại trừ trường hợp cố ý hoặc lỗi nghiêm trọng của chúng tôi.' },
    'terms.h7': { ja:'第7条（規約の変更）', en:'Article 7 (Amendments)', zh:'第 7 条 (变更)', ko:'제 7 조 (약관 변경)', vi:'Điều 7 (Sửa đổi)' },
    'terms.p7': { ja:'当社は、必要に応じて本規約を変更できます。変更後の規約は、本サービス上に表示した時点から効力を生じます。', en:'We may amend these terms as needed. Amended terms take effect upon display on the Service.', zh:'本公司可根据需要变更本条款。变更后条款自显示于本服务时起生效。', ko:'당사는 필요에 따라 본 약관을 변경 가능. 변경 후 약관은 표시 시점부터 효력 발생.', vi:'Chúng tôi có thể sửa đổi khi cần. Điều khoản mới có hiệu lực khi hiển thị trên Dịch vụ.' },
    'terms.h8': { ja:'第8条（準拠法・管轄）', en:'Article 8 (Governing Law)', zh:'第 8 条 (准据法·管辖)', ko:'제 8 조 (준거법·관할)', vi:'Điều 8 (Luật áp dụng)' },
    'terms.p8': { ja:'本規約は日本法に準拠し、本サービスに関する紛争は東京地方裁判所を専属的合意管轄とします。', en:'These terms are governed by Japanese law; disputes are subject to exclusive jurisdiction of the Tokyo District Court.', zh:'本条款依日本法,争议由东京地方法院专属管辖。', ko:'본 약관은 일본법 준거, 분쟁은 도쿄 지방 법원 전속 관할.', vi:'Điều khoản theo luật Nhật; tranh chấp do Tòa án Quận Tokyo độc quyền xét xử.' },
    'terms.date': { ja:'制定日: 2026年5月26日', en:'Effective date: May 26, 2026', zh:'制定日: 2026 年 5 月 26 日', ko:'제정일: 2026 년 5 월 26 일', vi:'Ngày hiệu lực: 26/5/2026' },

    /* PRIVACY OVERLAY */
    'privacy.title': { ja:'プライバシーポリシー', en:'Privacy Policy', zh:'隐私政策', ko:'개인정보 처리방침', vi:'Chính sách riêng tư' },
    'privacy.intro': { ja:'当社は、利用者の個人情報保護の重要性を認識し、以下のプライバシーポリシーに基づき適切に取り扱います。', en:'We recognize the importance of protecting user personal information and handle it appropriately per this Privacy Policy.', zh:'本公司认识到用户个人信息保护的重要性,根据以下隐私政策妥善处理。', ko:'당사는 개인정보 보호의 중요성을 인식하고 본 정책에 따라 적절히 취급합니다.', vi:'Chúng tôi nhận thức tầm quan trọng của bảo vệ thông tin và xử lý phù hợp theo Chính sách này.' },
    'privacy.h1': { ja:'1. 取得する情報', en:'1. Information Collected', zh:'1. 取得的信息', ko:'1. 수집하는 정보', vi:'1. Thông tin thu thập' },
    'privacy.p1_1': { ja:'利用登録時にご提供いただく情報（店舗名・代表者名・メールアドレス・電話番号）', en:'Info provided at registration (shop name, representative name, email, phone)', zh:'注册时提供的信息 (店铺名/负责人/邮箱/电话)', ko:'등록 시 제공 정보 (매장명·대표자명·이메일·전화)', vi:'Thông tin khi đăng ký (tên cửa hàng, người đại diện, email, điện thoại)' },
    'privacy.p1_2': { ja:'サービス利用中に生成される情報（シフト提出データ・売上データ・スタッフ情報）', en:'Info generated during use (shift submissions, sales data, staff info)', zh:'使用过程中生成的信息 (班次提交/销售/员工)', ko:'이용 중 생성 정보 (시프트 제출, 매출, 직원)', vi:'Thông tin tạo ra trong khi dùng (đăng ký ca, doanh thu, NV)' },
    'privacy.p1_3': { ja:'クッキー等によるアクセス情報', en:'Access info via cookies etc.', zh:'通过 Cookie 等的访问信息', ko:'쿠키 등에 의한 액세스 정보', vi:'Thông tin truy cập qua cookie v.v.' },
    'privacy.h2': { ja:'2. 利用目的', en:'2. Purpose of Use', zh:'2. 使用目的', ko:'2. 이용 목적', vi:'2. Mục đích sử dụng' },
    'privacy.p2_1': { ja:'本サービスの提供・運営', en:'Providing & operating the Service', zh:'提供与运营本服务', ko:'본 서비스 제공·운영', vi:'Cung cấp & vận hành Dịch vụ' },
    'privacy.p2_2': { ja:'料金請求・お支払い処理', en:'Billing & payment processing', zh:'费用请求·支付处理', ko:'요금 청구·결제 처리', vi:'Lập hóa đơn & xử lý thanh toán' },
    'privacy.p2_3': { ja:'サポート・お問い合わせ対応', en:'Support & inquiry response', zh:'支持·咨询应对', ko:'지원·문의 대응', vi:'Hỗ trợ & trả lời câu hỏi' },
    'privacy.p2_4': { ja:'サービス改善・新機能開発', en:'Service improvement & new feature development', zh:'服务改进·新功能开发', ko:'서비스 개선·신기능 개발', vi:'Cải thiện dịch vụ & phát triển tính năng mới' },
    'privacy.h3': { ja:'3. 第三者提供', en:'3. Third-Party Disclosure', zh:'3. 第三方提供', ko:'3. 제 3 자 제공', vi:'3. Tiết lộ cho bên thứ ba' },
    'privacy.p3': { ja:'当社は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供しません。', en:'We do not disclose personal info to third parties without consent except as required by law.', zh:'除法律要求外,本公司未经本人同意不向第三方提供个人信息。', ko:'법령에 따른 경우를 제외하고 본인 동의 없이 제 3 자에게 개인정보 제공하지 않습니다.', vi:'Chúng tôi không tiết lộ TT cho bên thứ ba mà không có sự đồng ý trừ khi luật yêu cầu.' },
    'privacy.h4': { ja:'4. 業務委託', en:'4. Outsourcing', zh:'4. 业务委托', ko:'4. 업무 위탁', vi:'4. Thuê ngoài' },
    'privacy.p4': { ja:'決済処理（Stripe Inc.）・データ保管（クラウドサーバー）等で外部事業者を利用します。委託先には適切な管理を求めます。', en:'We use external providers (Stripe Inc. for payments, cloud servers for storage). We require appropriate management from contractors.', zh:'结算 (Stripe Inc.)·数据保管 (云服务器) 等使用外部供应商。要求委托方进行适当管理。', ko:'결제 (Stripe Inc.)·데이터 보관 (클라우드 서버) 등 외부 사업자 이용. 위탁처에 적절한 관리 요청.', vi:'Sử dụng nhà cung cấp ngoài (Stripe cho thanh toán, cloud cho lưu trữ). Yêu cầu quản lý phù hợp từ nhà thầu.' },
    'privacy.h5': { ja:'5. データの保管・削除', en:'5. Data Retention & Deletion', zh:'5. 数据保管·删除', ko:'5. 데이터 보관·삭제', vi:'5. Lưu trữ & xóa dữ liệu' },
    'privacy.p5': { ja:'個人情報は契約終了後3ヶ月間保管し、その後速やかに削除します。ご本人からの削除要請にも随時対応します。', en:'Personal data stored 3 months after contract termination, then promptly deleted. We honor deletion requests from data subjects.', zh:'个人信息合同终止后保存 3 个月,之后立即删除。也随时响应本人删除请求。', ko:'개인정보는 계약 종료 후 3 개월 보관, 이후 즉시 삭제. 본인 삭제 요청에도 수시 대응.', vi:'Dữ liệu cá nhân lưu 3 tháng sau khi kết thúc HĐ rồi xóa nhanh. Đáp ứng yêu cầu xóa từ chủ thể.' },
    'privacy.h6': { ja:'6. お問い合わせ', en:'6. Contact', zh:'6. 联系方式', ko:'6. 문의', vi:'6. Liên hệ' },
    'privacy.p6': { ja:'個人情報に関するお問い合わせは、koizumishota0323@gmail.com までご連絡ください。', en:'For privacy inquiries, contact koizumishota0323@gmail.com.', zh:'有关个人信息的咨询请联系 koizumishota0323@gmail.com。', ko:'개인정보 관련 문의는 koizumishota0323@gmail.com 으로 연락 주세요.', vi:'Câu hỏi về quyền riêng tư: koizumishota0323@gmail.com.' },
    'privacy.date': { ja:'制定日: 2026年5月26日', en:'Effective date: May 26, 2026', zh:'制定日: 2026 年 5 月 26 日', ko:'제정일: 2026 년 5 월 26 일', vi:'Ngày hiệu lực: 26/5/2026' },

    /* STICKY CTA */
    'sticky.text': { ja:'🎁 30日間 無料<small>即解約OK</small>', en:'🎁 30 days FREE<small>Cancel anytime</small>', zh:'🎁 30 天免费<small>随时取消</small>', ko:'🎁 30 일 무료<small>즉시 해지 OK</small>', vi:'🎁 30 ngày MP<small>Hủy bất kỳ lúc nào</small>' },
    'sticky.btn': { ja:'今すぐ試す →', en:'Try now →', zh:'立即试用 →', ko:'지금 체험 →', vi:'Thử ngay →' },
    'sticky.aria': { ja:'無料トライアル申込モーダルを開く', en:'Open free trial signup modal', zh:'打开免费试用申请窗口', ko:'무료 트라이얼 모달 열기', vi:'Mở cửa sổ đăng ký dùng thử MP' },

    /* COOKIE BANNER */
    'cookie.aria': { ja:'Cookie 同意', en:'Cookie consent', zh:'Cookie 同意', ko:'쿠키 동의', vi:'Đồng ý cookie' },
    'cookie.text': { ja:'🍪 当サイトは、サービス品質向上のため Cookie を使用します。利用を続けることで <a href="#" onclick="event.preventDefault();openOverlay(\'privacy\');">プライバシーポリシー</a> に同意したものとみなします。', en:'🍪 This site uses cookies to improve quality. By continuing you agree to our <a href="#" onclick="event.preventDefault();openOverlay(\'privacy\');">Privacy Policy</a>.', zh:'🍪 本网站使用 Cookie 以提升服务质量。继续使用即同意 <a href="#" onclick="event.preventDefault();openOverlay(\'privacy\');">隐私政策</a>。', ko:'🍪 본 사이트는 서비스 품질 향상을 위해 쿠키를 사용합니다. 계속 이용 시 <a href="#" onclick="event.preventDefault();openOverlay(\'privacy\');">개인정보 처리방침</a> 에 동의한 것으로 간주합니다.', vi:'🍪 Trang này dùng cookie để cải thiện chất lượng. Tiếp tục dùng tức là đồng ý <a href="#" onclick="event.preventDefault();openOverlay(\'privacy\');">Chính sách riêng tư</a>.' },
    'cookie.accept': { ja:'同意', en:'Accept', zh:'同意', ko:'동의', vi:'Đồng ý' },
    'cookie.decline': { ja:'拒否', en:'Decline', zh:'拒绝', ko:'거부', vi:'Từ chối' },
    'cookie.accept_aria': { ja:'Cookieに同意', en:'Accept cookies', zh:'同意 Cookie', ko:'쿠키 동의', vi:'Đồng ý cookie' },
    'cookie.decline_aria': { ja:'Cookieを拒否', en:'Decline cookies', zh:'拒绝 Cookie', ko:'쿠키 거부', vi:'Từ chối cookie' },

    /* SUBSCRIBE MODAL */
    'sub.eyebrow': { ja:'🎁 30日 Pro 体験', en:'🎁 30-day Pro Trial', zh:'🎁 30 天 Pro 体验', ko:'🎁 30 일 Pro 체험', vi:'🎁 Pro thử 30 ngày' },
    'sub.title': { ja:'RAKURAKU を始める', en:'Get Started with RAKURAKU', zh:'开始使用 RAKURAKU', ko:'RAKURAKU 시작하기', vi:'Bắt đầu với RAKURAKU' },
    'sub.sub': { ja:'30日 Pro 体験 ・ 自動課金は期間終了後 ・ いつでも解約OK', en:'30-day Pro Trial · Auto-charge after trial ends · Cancel anytime', zh:'30 天 Pro 体验 · 试用结束后自动扣款 · 随时取消', ko:'30 일 Pro 체험 · 기간 종료 후 자동 결제 · 언제든 해지 OK', vi:'Pro thử 30 ngày · Tự thu phí sau khi hết hạn · Hủy bất cứ lúc nào' },
    'sub.shop': { ja:'店舗名', en:'Shop Name', zh:'店铺名', ko:'매장명', vi:'Tên cửa hàng' },
    'sub.shop_ph': { ja:'例) BAR RAKURAKU 渋谷', en:'e.g. BAR RAKURAKU Shibuya', zh:'例) BAR RAKURAKU 涩谷', ko:'예) BAR RAKURAKU 시부야', vi:'VD) BAR RAKURAKU Shibuya' },
    'sub.owner': { ja:'お名前（代表者）', en:'Your Name (Representative)', zh:'您的姓名 (代表)', ko:'성함 (대표자)', vi:'Tên (Đại diện)' },
    'sub.owner_ph': { ja:'お名前', en:'Your name', zh:'您的姓名', ko:'성함', vi:'Tên của bạn' },
    'sub.email': { ja:'メールアドレス', en:'Email Address', zh:'电子邮件', ko:'이메일 주소', vi:'Email' },
    'sub.email_ph': { ja:'ライセンスコードをお送りします', en:'We\'ll send your license code', zh:'我们会发送许可证代码', ko:'라이선스 코드를 보내드립니다', vi:'Chúng tôi sẽ gửi mã giấy phép' },
    'sub.phone': { ja:'電話番号（任意）', en:'Phone (optional)', zh:'电话 (可选)', ko:'전화번호 (선택)', vi:'Điện thoại (Tùy chọn)' },
    'sub.phone_ph': { ja:'サポート連絡用', en:'For support contact', zh:'用于支持联系', ko:'지원 연락용', vi:'Liên hệ hỗ trợ' },
    'sub.plan_hint': { ja:'💡 お支払いプランを選択 (どちらでもOK)', en:'💡 Choose your billing plan (either works)', zh:'💡 选择付款方案 (任选)', ko:'💡 결제 플랜 선택 (둘 다 OK)', vi:'💡 Chọn gói thanh toán (cả hai đều được)' },
    'sub.plan_monthly': { ja:'📅 月払い<br>¥4,990/月', en:'📅 Monthly<br>¥4,990/mo', zh:'📅 月付<br>¥4,990/月', ko:'📅 월 결제<br>¥4,990/월', vi:'📅 Trả tháng<br>¥4,990/tháng' },
    'sub.plan_annual': { ja:'⭐ 年払い ¥49,900<br><em>2ヶ月分お得+特典5つ</em>', en:'⭐ Annual ¥49,900<br><em>Save 2mo + 5 perks</em>', zh:'⭐ 年付 ¥49,900<br><em>省 2 个月 + 5 项福利</em>', ko:'⭐ 연 결제 ¥49,900<br><em>2 개월 절약 + 5 특전</em>', vi:'⭐ Năm ¥49,900<br><em>Tiết kiệm 2 tháng + 5 đặc quyền</em>' },
    'sub.popular': { ja:'人気', en:'Popular', zh:'热门', ko:'인기', vi:'Phổ biến' },
    'sub.next': { ja:'💳 次へ進む（クレジットカード決済）', en:'💳 Continue (Credit Card)', zh:'💳 下一步 (信用卡支付)', ko:'💳 다음 (신용카드 결제)', vi:'💳 Tiếp tục (Thẻ tín dụng)' },
    'sub.or': { ja:'または', en:'or', zh:'或', ko:'또는', vi:'hoặc' },
    'sub.bank': { ja:'💴 銀行振込で申し込む', en:'💴 Apply by Bank Transfer', zh:'💴 通过银行汇款申请', ko:'💴 은행 송금으로 신청', vi:'💴 Đăng ký bằng chuyển khoản' },
    'sub.fine': { ja:'クレジットカード: Stripeの安全な決済ページへ遷移。<br>銀行振込: 24 時間以内に振込先案内メールをお送りします。', en:'Credit card: Redirects to Stripe\'s secure payment page.<br>Bank transfer: Account details emailed within 24 hours.', zh:'信用卡: 跳转至 Stripe 安全付款页面。<br>银行汇款: 24 小时内邮件发送汇款账户。', ko:'신용카드: Stripe 안전 결제 페이지로 이동.<br>은행 송금: 24 시간 이내 송금처 안내 메일 발송.', vi:'Thẻ tín dụng: Chuyển sang trang thanh toán an toàn Stripe.<br>Chuyển khoản: Gửi email thông tin tài khoản trong 24h.' },

    /* ─── 料金プラン pricing.html ─── */
    'pricing.badge': { ja:'🎉 永久無料プラン誕生',
                       en:'🎉 Forever-Free Plan Available',
                       zh:'🎉 永久免费方案诞生',
                       ko:'🎉 영구 무료 플랜 탄생',
                       vi:'🎉 Gói miễn phí vĩnh viễn' },
    'pricing.title': { ja:'💰 料金プラン',
                       en:'💰 Pricing Plans',
                       zh:'💰 价格方案',
                       ko:'💰 요금제',
                       vi:'💰 Bảng giá' },
    'pricing.lead': { ja:'個人バー・スナックなら<strong>完全永久無料</strong>。30 日間は全機能を無料で試せます。',
                      en:'Individual bars and snacks get <strong>forever free</strong>. Try all features free for 30 days.',
                      zh:'个人酒吧或小酒馆<strong>完全永久免费</strong>。30 天免费试用全部功能。',
                      ko:'개인 바・스낵은 <strong>완전 영구 무료</strong>. 30일간 모든 기능을 무료로 체험.',
                      vi:'Bar & Snack cá nhân <strong>miễn phí vĩnh viễn</strong>. Dùng thử toàn bộ tính năng 30 ngày.' },
    /* Free plan */
    'pricing.free_ribbon': { ja:'永久無料', en:'Forever Free', zh:'永久免费', ko:'영구 무료', vi:'Miễn phí vĩnh viễn' },
    'pricing.free_title': { ja:'🆓 Free', en:'🆓 Free', zh:'🆓 免费', ko:'🆓 Free', vi:'🆓 Miễn phí' },
    'pricing.forever': { ja:'/永久', en:'/forever', zh:'/永久', ko:'/영구', vi:'/vĩnh viễn' },
    'pricing.free_sub': { ja:'個人バー・スナックママ・小規模カフェに最適。',
                          en:'Perfect for individual bars, snacks, and small cafes.',
                          zh:'最适合个人酒吧、小酒馆、小型咖啡店。',
                          ko:'개인 바・스낵・소규모 카페에 최적.',
                          vi:'Phù hợp với bar/snack cá nhân, café nhỏ.' },
    /* Trial plan */
    'pricing.trial_ribbon': { ja:'⭐ 全員推奨', en:'⭐ Recommended', zh:'⭐ 推荐', ko:'⭐ 추천', vi:'⭐ Khuyến nghị' },
    'pricing.trial_title': { ja:'🎁 30日 Pro 体験', en:'🎁 30-Day Pro Trial', zh:'🎁 30天Pro体验', ko:'🎁 30일 Pro 체험', vi:'🎁 Pro 30 ngày' },
    'pricing.trial_period': { ja:'/30日間', en:'/30 days', zh:'/30天', ko:'/30일간', vi:'/30 ngày' },
    'pricing.trial_sub': { ja:'全機能を 30 日間まるごと試せる。クレカ登録なし。期間後は Free に自動降格 — 勝手に課金されません。',
                           en:'Try all features for 30 days. No credit card. Auto-downgrades to Free — no surprise charges.',
                           zh:'30 天完整试用全部功能。无需信用卡。期满后自动降级为免费版 — 不会自动扣费。',
                           ko:'30일간 모든 기능 체험. 카드 등록 불필요. 기간 후 Free로 자동 강등 — 임의 결제 없음.',
                           vi:'Dùng toàn bộ tính năng 30 ngày. Không cần thẻ. Hết hạn tự xuống Free — không trừ tiền.' },
    /* Pro plan */
    'pricing.pro_ribbon': { ja:'本格運用に', en:'For Production Use', zh:'适合正式运营', ko:'본격 운용용', vi:'Cho vận hành thật' },
    'pricing.pro_title': { ja:'💼 Pro', en:'💼 Pro', zh:'💼 Pro', ko:'💼 Pro', vi:'💼 Pro' },
    'pricing.pro_period': { ja:'/月 (税抜)', en:'/month (excl. tax)', zh:'/月（不含税）', ko:'/월 (세금별도)', vi:'/tháng (chưa thuế)' },
    'pricing.pro_sub': { ja:'中規模店・多店舗チェーンに。年額 ¥49,900 で 2 ヶ月分お得。',
                         en:'For mid-sized and multi-store chains. Annual ¥49,900 saves 2 months.',
                         zh:'适合中型店或连锁店。年付 ¥49,900 省2个月。',
                         ko:'중규모 매장・다점포 체인용. 연간 ¥49,900 으로 2개월 할인.',
                         vi:'Cho cửa hàng vừa & chuỗi. Trả năm ¥49,900 — tiết kiệm 2 tháng.' },
    /* Enterprise plan */
    'pricing.ent_ribbon': { ja:'10 店舗+', en:'10+ Stores', zh:'10店以上', ko:'10 매장+', vi:'Hơn 10 cửa hàng' },
    'pricing.ent_title': { ja:'🏢 Enterprise', en:'🏢 Enterprise', zh:'🏢 企业版', ko:'🏢 Enterprise', vi:'🏢 Enterprise' },
    'pricing.ent_price': { ja:'個別', en:'Custom', zh:'定制', ko:'개별', vi:'Tùy chỉnh' },
    'pricing.ent_period': { ja:'見積', en:'quote', zh:'报价', ko:'견적', vi:'báo giá' },
    'pricing.ent_sub': { ja:'大規模チェーン向け。SLA 99.99% / SSO / 専用サーバー。',
                         en:'For large chains. SLA 99.99% / SSO / Dedicated server.',
                         zh:'面向大型连锁店。SLA 99.99% / SSO / 专属服务器。',
                         ko:'대규모 체인용. SLA 99.99% / SSO / 전용 서버.',
                         vi:'Cho chuỗi lớn. SLA 99.99% / SSO / Server riêng.' },

    /* ─── 無料デモ予約 demo-reservation.html ─── */
    'demoresv.title': { ja:'無料 <span class="grad">オンラインデモ</span> 予約',
                        en:'Free <span class="grad">Online Demo</span> Reservation',
                        zh:'免费 <span class="grad">在线演示</span> 预约',
                        ko:'무료 <span class="grad">온라인 데모</span> 예약',
                        vi:'Đặt <span class="grad">demo online</span> miễn phí' },
    'demoresv.eyebrow': { ja:'🎁 完全無料 ・ オンライン15分',
                          en:'🎁 Completely Free · 15-min Online',
                          zh:'🎁 完全免费・在线 15 分钟',
                          ko:'🎁 완전 무료・온라인 15분',
                          vi:'🎁 Hoàn toàn miễn phí · Online 15 phút' },
    'demoresv.lead': { ja:'代表が画面を共有しながら、お店に合わせた使い方をご案内します。',
                       en:'Our founder will share the screen and walk you through how to use it for your store.',
                       zh:'创始人将分享屏幕，根据您的店铺指导使用方法。',
                       ko:'대표가 화면을 공유하며 매장에 맞는 사용법을 안내합니다.',
                       vi:'Người sáng lập sẽ chia sẻ màn hình & hướng dẫn theo cửa hàng của bạn.' },
    'demoresv.feat_time': { ja:'所要 15分', en:'~15 minutes', zh:'约 15 分钟', ko:'15분 소요', vi:'~15 phút' },
    'demoresv.feat_free': { ja:'完全無料', en:'Completely Free', zh:'完全免费', ko:'완전 무료', vi:'Hoàn toàn miễn phí' },
    'demoresv.submit': { ja:'📅 デモを予約する',
                         en:'📅 Book a Demo',
                         zh:'📅 预约演示',
                         ko:'📅 데모 예약',
                         vi:'📅 Đặt demo' },
    'demoresv.info': { ja:'✓ 24時間以内に Zoom URL をメールでお送りします<br>✓ 強引な営業は一切ありません<br>✓ 当日 RAKURAKU をその場で試せます',
                       en:'✓ Zoom URL emailed within 24 hours<br>✓ Zero pushy sales<br>✓ Try RAKURAKU live during the call',
                       zh:'✓ 24 小时内邮件发送 Zoom URL<br>✓ 绝无强行推销<br>✓ 当场体验 RAKURAKU',
                       ko:'✓ 24시간 이내에 Zoom URL을 메일로 발송<br>✓ 강압적인 영업 없음<br>✓ 당일 RAKURAKU 즉시 체험 가능',
                       vi:'✓ Gửi URL Zoom trong 24h<br>✓ Không ép bán<br>✓ Thử ngay RAKURAKU' },
    'demoresv.success_title': { ja:'デモ予約 受付完了',
                                en:'Demo Reservation Confirmed',
                                zh:'演示预约已确认',
                                ko:'데모 예약 접수 완료',
                                vi:'Đặt demo thành công' },
    'demoresv.success_msg': { ja:'24時間以内に <strong id="success-email"></strong> 宛に<br>Zoom URL をお送りします。お楽しみに！',
                              en:'Zoom URL will be sent to <strong id="success-email"></strong><br>within 24 hours. Looking forward to it!',
                              zh:'24 小时内向 <strong id="success-email"></strong><br>发送 Zoom URL。期待与您见面！',
                              ko:'24시간 이내에 <strong id="success-email"></strong><br>로 Zoom URL을 발송합니다.',
                              vi:'URL Zoom sẽ gửi đến <strong id="success-email"></strong><br>trong 24 giờ. Hẹn gặp lại!' },

    /* ─── スタッフ招待 ─── */
    'invite.title': { ja:'📨 スタッフを招待', en:'📨 Invite Staff', zh:'📨 邀请员工', ko:'📨 직원 초대', vi:'📨 Mời nhân viên' },

    /* ─── 創業メンバー Welcome ─── */
    'founder_welcome.title': { ja:'ようこそ、<br><span class="grad">創業メンバー</span> へ',
                                en:'Welcome,<br><span class="grad">Founding Member</span>',
                                zh:'欢迎您，<br><span class="grad">创始会员</span>',
                                ko:'환영합니다,<br><span class="grad">창업 멤버</span>',
                                vi:'Chào mừng,<br><span class="grad">Thành viên sáng lập</span>' },
    'founder_welcome.lead': { ja:'Pro プラン <strong>1 年間 完全無料</strong> でご利用いただけます',
                               en:'Use the Pro plan <strong>FREE for 1 full year</strong>',
                               zh:'Pro 套餐 <strong>完全免费 1 年</strong>',
                               ko:'Pro 플랜 <strong>1년간 완전 무료</strong>로 이용 가능',
                               vi:'Sử dụng Pro <strong>miễn phí 1 năm</strong>' },
    'invite.sub': { ja:'QR コード or リンクで簡単招待。LINE で送って 1 タップで参加できます',
                     en:'Invite easily with QR code or link. Send via LINE, join with one tap.',
                     zh:'用二维码或链接轻松邀请。通过 LINE 发送，一键参与。',
                     ko:'QR 코드 또는 링크로 간편 초대. LINE으로 보내 한 탭으로 참여.',
                     vi:'Mời dễ dàng bằng QR hoặc link. Gửi qua LINE, tham gia 1 chạm.' },

    /* ─── 銀行振込 / 口座振替 ─── */
    'bt.eyebrow': { ja:'💴 BANK · 銀行振込 / 口座振替', en:'💴 BANK · Transfer / Direct Debit', zh:'💴 BANK · 银行汇款/账户扣款', ko:'💴 BANK · 은행 이체/계좌 자동 이체', vi:'💴 NGÂN HÀNG · Chuyển khoản/Tự động' },
    'bt.title': { ja:'銀行で<br>お申し込み', en:'Apply via<br>Bank', zh:'通过银行<br>申请', ko:'은행으로<br>신청하기', vi:'Đăng ký qua<br>Ngân hàng' },
    'bt.lead': { ja:'クレジットカードをお持ちでなくてもご契約いただけます', en:'Sign up without needing a credit card', zh:'无需信用卡即可签约', ko:'신용카드 없이도 계약 가능합니다', vi:'Đăng ký không cần thẻ tín dụng' },
    'bt.pay_method': { ja:'💳 お支払い方式', en:'💳 Payment Method', zh:'💳 支付方式', ko:'💳 결제 방식', vi:'💳 Phương thức thanh toán' },
    'bt.transfer_title': { ja:'📤 銀行振込', en:'📤 Bank Transfer', zh:'📤 银行汇款', ko:'📤 은행 이체', vi:'📤 Chuyển khoản' },
    'bt.transfer_sub': { ja:'毎回振込', en:'Each Time', zh:'每次汇款', ko:'매번 이체', vi:'Mỗi lần' },
    'bt.transfer_desc': { ja:'手動で月次振込', en:'Monthly manual transfer', zh:'手动每月汇款', ko:'매월 수동 이체', vi:'Chuyển thủ công hàng tháng' },
    'bt.debit_title': { ja:'🔁 口座振替 (おすすめ)', en:'🔁 Direct Debit (Recommended)', zh:'🔁 账户自动扣款（推荐）', ko:'🔁 계좌 자동 이체 (추천)', vi:'🔁 Tự động (Đề xuất)' },
    'bt.debit_sub': { ja:'自動引落し', en:'Auto Debit', zh:'自动扣款', ko:'자동 이체', vi:'Tự động trừ' },
    'bt.debit_desc': { ja:'毎月 27 日 自動引落し', en:'Auto-debited on 27th monthly', zh:'每月 27 日自动扣款', ko:'매월 27 일 자동 이체', vi:'Tự trừ ngày 27 hàng tháng' },
    'bt.debit_note': { ja:'気づかないうちに自動課金 ✓', en:'Auto-charged silently ✓', zh:'无感自动收费 ✓', ko:'알아채지 못한 사이 자동 결제 ✓', vi:'Tự động trừ ✓' },
    'bt.merits_title': { ja:'✨ 口座振替 (自動引落し) のメリット', en:'✨ Benefits of Direct Debit', zh:'✨ 自动扣款的优势', ko:'✨ 자동 이체의 장점', vi:'✨ Lợi ích của tự động trừ' },
    'bt.merit_1': { ja:'毎月の振込手続き不要 — 一度登録すれば自動で引落とし', en:'No monthly transfer needed — register once, auto-debit forever', zh:'无需每月办理汇款 — 注册一次自动扣款', ko:'매월 이체 불필요 — 한 번만 등록하면 자동 이체', vi:'Không cần chuyển hàng tháng — đăng ký 1 lần, tự động trừ' },
    'bt.merit_2': { ja:'振込忘れによるサービス停止のリスクゼロ', en:'Zero risk of service stop from forgetting to transfer', zh:'无忘记汇款导致服务停止的风险', ko:'이체 망각으로 인한 서비스 중단 리스크 제로', vi:'Không lo dịch vụ dừng vì quên chuyển' },
    'bt.merit_3': { ja:'クレカと違って有効期限切れの心配なし', en:'No expiry worries like credit cards', zh:'不像信用卡担心有效期', ko:'카드와 달리 유효기간 만료 걱정 없음', vi:'Không như thẻ tín dụng, không lo hết hạn' },
    'bt.merit_4': { ja:'振込手数料が無料 (クレカ手数料 / 振込手数料の節約)', en:'No transfer fees (save credit card or transfer fees)', zh:'无汇款手续费（节省信用卡/汇款费用）', ko:'이체 수수료 무료 (카드/이체 수수료 절약)', vi:'Miễn phí chuyển (tiết kiệm phí thẻ/chuyển)' },
    'bt.merit_5': { ja:'領収書・経費処理が楽 (毎月の引落明細が経費証拠に)', en:'Easy receipts & expense processing (monthly statement as proof)', zh:'凭证及费用处理简便（每月扣款明细可作凭证）', ko:'영수증·경비 처리 간편 (매월 이체 명세서가 증빙)', vi:'Dễ làm hóa đơn (sao kê hàng tháng làm chứng từ)' },

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

  const SUPPORTED_LANGS = ['ja', 'en', 'zh', 'ko', 'vi'];

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

  /* dev モード: ?i18n-debug=1 で未翻訳キーをコンソール警告 */
  const DEBUG_MODE = (function(){
    try { return location.search.indexOf('i18n-debug=1') !== -1; } catch(e) { return false; }
  })();
  const _missingKeys = new Set();

  function t(key) {
    const entry = TRANSLATIONS[key];
    if (!entry) {
      if (DEBUG_MODE && !_missingKeys.has(key)) {
        _missingKeys.add(key);
        console.warn('[i18n] Missing translation key:', key);
      }
      return key;
    }
    /* フォールバック順: 現在言語 → en (vi が無い場合) → ja → key
       (currentLang のエントリが存在しない場合のみ fallback) */
    if (entry[currentLang] !== undefined) return entry[currentLang];
    if (DEBUG_MODE) {
      const missing = `${key}[${currentLang}]`;
      if (!_missingKeys.has(missing)) {
        _missingKeys.add(missing);
        console.warn('[i18n] Missing language for key:', key, '— falling back to en/ja');
      }
    }
    return entry.en || entry.ja || key;
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang;
    /* テキストノード置換 */
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    /* HTML 置換 (バグ修正: 以前は data-i18n-html が無視されていた) */
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      const key = el.getAttribute('data-i18n-html');
      el.innerHTML = t(key);
    });
    /* placeholder 置換 */
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = t(key);
    });
    /* aria-label 置換 (アクセシビリティ) */
    document.querySelectorAll('[data-i18n-aria]').forEach(function(el) {
      const key = el.getAttribute('data-i18n-aria');
      el.setAttribute('aria-label', t(key));
    });
    /* title 属性 (ツールチップ) 置換 */
    document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
      const key = el.getAttribute('data-i18n-title');
      el.setAttribute('title', t(key));
    });
    /* alt 属性 (画像) 置換 */
    document.querySelectorAll('[data-i18n-alt]').forEach(function(el) {
      const key = el.getAttribute('data-i18n-alt');
      el.setAttribute('alt', t(key));
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
      btn.textContent = lang === 'ja' ? '日' : lang === 'en' ? 'EN' : lang === 'zh' ? '中' : lang === 'ko' ? '한' : 'VI';
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
  /* 短縮エイリアス (shift.html や他のページが使う i18n.t() でアクセスできる) */
  window.i18n = window.RakuI18n;
})(window);
