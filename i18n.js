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

  function t(key) {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    /* フォールバック順: 現在言語 → en (vi が無い場合) → ja → key */
    return entry[currentLang] || entry.en || entry.ja || key;
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
