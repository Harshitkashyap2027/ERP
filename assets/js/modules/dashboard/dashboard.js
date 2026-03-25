// ============================================
// UNIBOLT ERP — DASHBOARD MODULE
// ============================================

const ERPDashboard = (() => {
  async function init() {
    renderSkeleton();
    const data = await ERPAnalyticsService.getDashboardOverview();
    renderStats(data);
    renderActivity();
    renderQuickActions();
    renderAnnouncements();
  }

  function renderSkeleton() {
    const grid = document.getElementById('statsGrid');
    if (grid) grid.innerHTML = Array(4).fill(0).map(() => `
      <div class="stat-card"><div class="skeleton skeleton-card" style="height:90px;border-radius:var(--radius-lg);"></div></div>
    `).join('');
  }

  function renderStats(data) {
    const grid = document.getElementById('statsGrid');
    if (!grid) return;

    const stats = [
      { icon: '👨‍🎓', label: 'Total Students', value: ERPHelpers.formatNumber(data?.students?.total || 0), change: '+12', trend: 'up', color: 'rgba(99,102,241,0.15)', iconColor: '#6366f1' },
      { icon: '👨‍🏫', label: 'Faculty Members', value: ERPHelpers.formatNumber(data?.faculty?.total || 0), change: '+2', trend: 'up', color: 'rgba(16,185,129,0.15)', iconColor: '#10b981' },
      { icon: '💰', label: 'Fees Pending', value: ERPHelpers.formatNumber(data?.pendingFees || 0), change: '-5%', trend: 'down', color: 'rgba(245,158,11,0.15)', iconColor: '#f59e0b' },
      { icon: '📊', label: 'Avg Attendance', value: '87%', change: '+2%', trend: 'up', color: 'rgba(6,182,212,0.15)', iconColor: '#06b6d4' },
    ];

    grid.innerHTML = stats.map(s => `
      <div class="stat-card">
        <div class="stat-icon" style="background:${s.color};color:${s.iconColor}">${s.icon}</div>
        <div class="stat-info">
          <div class="stat-value">${s.value}</div>
          <div class="stat-label">${s.label}</div>
          <div class="stat-change ${s.trend}">
            ${s.trend === 'up' ? '↑' : '↓'} ${s.change} this month
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderActivity() {
    const container = document.getElementById('activityList');
    if (!container) return;
    const activities = [
      { icon: '👨‍🎓', bg: 'rgba(99,102,241,0.15)', color: '#6366f1', title: 'New student enrolled', sub: 'Rahul Sharma — B.Tech CSE Sem 3', time: '2 hours ago' },
      { icon: '💳', bg: 'rgba(16,185,129,0.15)', color: '#10b981', title: 'Fee payment received', sub: '₹45,000 — Priya Verma (2024CSE042)', time: '4 hours ago' },
      { icon: '📝', bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', title: 'Exam results published', sub: 'Mid-Sem 2024 — Computer Science', time: '6 hours ago' },
      { icon: '⚠️', bg: 'rgba(239,68,68,0.15)', color: '#ef4444', title: 'Low attendance alert', sub: '23 students below 75% threshold', time: '8 hours ago' },
      { icon: '📚', bg: 'rgba(6,182,212,0.15)', color: '#06b6d4', title: 'Library book issued', sub: 'Data Structures — Amit Kumar', time: '1 day ago' },
    ];
    container.innerHTML = `<div class="timeline">${activities.map(a => `
      <div class="timeline-item">
        <div class="timeline-icon" style="background:${a.bg};color:${a.color}">${a.icon}</div>
        <div class="timeline-content">
          <div class="timeline-title">${a.title}</div>
          <div class="timeline-text">${a.sub}</div>
          <div class="timeline-time">${a.time}</div>
        </div>
      </div>
    `).join('')}</div>`;
  }

  function renderQuickActions() {
    const container = document.getElementById('quickActions');
    if (!container) return;
    const actions = [
      { icon: '➕', label: 'Add Student', route: 'students?action=new' },
      { icon: '📝', label: 'Record Attendance', route: 'attendance?action=mark' },
      { icon: '💳', label: 'Collect Fee', route: 'payments?action=new' },
      { icon: '📢', label: 'Announcement', route: 'announcements?action=new' },
      { icon: '📊', label: 'Generate Report', route: 'reports' },
      { icon: '🎓', label: 'Issue Certificate', route: 'certificates' },
      { icon: '📚', label: 'Issue Book', route: 'library?action=issue' },
      { icon: '🔔', label: 'Send Notice', route: 'notifications?action=new' },
    ];
    container.innerHTML = actions.map(a => `
      <a href="#${a.route}" class="quick-action-btn">
        <span class="quick-action-icon">${a.icon}</span>
        <span class="quick-action-label">${a.label}</span>
      </a>
    `).join('');
  }

  function renderAnnouncements() {
    const container = document.getElementById('announcements');
    if (!container) return;
    const anns = [
      { title: 'Mid-Semester Examinations', text: 'Mid-semester exams scheduled from Nov 15–25. Check timetable.', date: 'Nov 10', type: 'primary' },
      { title: 'Fee Submission Deadline', text: 'Last date for sem fee submission is Nov 20. Late fee ₹500/day.', date: 'Nov 8', type: 'warning' },
      { title: 'Annual Tech Fest 2024', text: 'Register your teams for TechFest 2024. Last date Nov 12.', date: 'Nov 6', type: 'success' },
    ];
    container.innerHTML = anns.map(a => `
      <div style="padding:var(--space-4);border-bottom:1px solid var(--border-light);display:flex;gap:var(--space-3);">
        <div style="width:6px;border-radius:var(--radius-full);background:var(--${a.type});flex-shrink:0;"></div>
        <div style="flex:1;">
          <div style="font-size:0.875rem;font-weight:600;color:var(--text-primary);margin-bottom:4px;">${a.title}</div>
          <div style="font-size:0.8rem;color:var(--text-muted);">${a.text}</div>
        </div>
        <div style="font-size:0.75rem;color:var(--text-muted);white-space:nowrap;">${a.date}</div>
      </div>
    `).join('');
  }

  return { init };
})();
