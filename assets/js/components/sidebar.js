// ============================================
// UNIBOLT ERP — SIDEBAR COMPONENT
// ============================================

const ERPSidebar = (() => {
  const NAV_STRUCTURE = [
    {
      section: 'Core',
      items: [
        { icon: '🏠', label: 'Dashboard', route: 'dashboard' },
        { icon: '🔍', label: 'Global Search', route: 'search' },
        { icon: '📋', label: 'Activity Timeline', route: 'activity' },
      ]
    },
    {
      section: 'Students',
      items: [
        { icon: '👨‍🎓', label: 'Student 360', route: 'student-dashboard' },
        { icon: '📝', label: 'Admissions', route: 'admissions' },
        { icon: '📋', label: 'Student List', route: 'students', sub: [
          { label: 'All Students', route: 'students' },
          { label: 'Enrollment', route: 'enrollment' },
          { label: 'Alumni', route: 'alumni' },
        ]},
        { icon: '📅', label: 'Attendance', route: 'attendance' },
        { icon: '🏆', label: 'Performance', route: 'performance' },
      ]
    },
    {
      section: 'Faculty & Staff',
      items: [
        { icon: '👨‍🏫', label: 'Faculty', route: 'faculty', sub: [
          { label: 'Faculty List', route: 'faculty' },
          { label: 'Workload', route: 'faculty-workload' },
          { label: 'Leave Management', route: 'leave' },
        ]},
        { icon: '💼', label: 'Staff', route: 'staff' },
        { icon: '💰', label: 'Payroll', route: 'payroll' },
      ]
    },
    {
      section: 'Academics',
      items: [
        { icon: '📚', label: 'Courses', route: 'courses' },
        { icon: '🕐', label: 'Timetable', route: 'timetable' },
        { icon: '📆', label: 'Academic Calendar', route: 'calendar' },
        { icon: '📖', label: 'Curriculum', route: 'curriculum' },
      ]
    },
    {
      section: 'Examinations',
      items: [
        { icon: '📝', label: 'Exam Engine', route: 'exams' },
        { icon: '❓', label: 'Question Bank', route: 'question-bank' },
        { icon: '📊', label: 'Results', route: 'results' },
        { icon: '🎓', label: 'Gradebook', route: 'gradebook' },
      ]
    },
    {
      section: 'Finance',
      items: [
        { icon: '💳', label: 'Fees', route: 'fees' },
        { icon: '🧾', label: 'Payments', route: 'payments' },
        { icon: '🎓', label: 'Scholarships', route: 'scholarships' },
        { icon: '📊', label: 'Budget', route: 'budget' },
      ]
    },
    {
      section: 'Infrastructure',
      items: [
        { icon: '🏢', label: 'Hostel', route: 'hostel' },
        { icon: '🚌', label: 'Transport', route: 'transport' },
        { icon: '📚', label: 'Library', route: 'library' },
        { icon: '📦', label: 'Inventory', route: 'inventory' },
      ]
    },
    {
      section: 'Communication',
      items: [
        { icon: '💬', label: 'Chat', route: 'chat' },
        { icon: '📢', label: 'Announcements', route: 'announcements' },
        { icon: '🔔', label: 'Notifications', route: 'notifications' },
        { icon: '🎉', label: 'Events', route: 'events' },
      ]
    },
    {
      section: 'Placement & LMS',
      items: [
        { icon: '🎯', label: 'Placement', route: 'placement' },
        { icon: '🎓', label: 'LMS', route: 'lms' },
        { icon: '🏢', label: 'Companies', route: 'companies' },
      ]
    },
    {
      section: 'AI & Analytics',
      items: [
        { icon: '🤖', label: 'AI Assistant', route: 'ai-assistant' },
        { icon: '📈', label: 'Analytics', route: 'analytics' },
        { icon: '⚠️', label: 'Risk Detection', route: 'risk-detection' },
        { icon: '📊', label: 'Reports', route: 'reports' },
      ]
    },
    {
      section: 'System',
      items: [
        { icon: '🔐', label: 'Access Control', route: 'rbac' },
        { icon: '⚙️', label: 'Settings', route: 'settings' },
        { icon: '🛡️', label: 'Audit Logs', route: 'audit' },
        { icon: '🎫', label: 'Support', route: 'support' },
      ]
    },
  ];

  function render(containerId = 'sidebarNav') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = ERPAuth.getCurrentUser();
    const html = NAV_STRUCTURE.map(({ section, items }) => `
      <div class="sidebar-section">
        <div class="sidebar-section-title">${section}</div>
        ${items.map(item => renderItem(item)).join('')}
      </div>
    `).join('');

    container.innerHTML = html;

    // Mark current route
    const current = ERPRouter.getCurrentRoute();
    if (current) {
      const active = container.querySelector(`[data-route="${current}"]`);
      if (active) active.classList.add('active');
    }
  }

  function renderItem(item) {
    if (item.sub) {
      const subId = `sub-${item.route}`;
      return `
        <button class="nav-item" data-sub-toggle="${subId}" data-route="${item.route}">
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
          <span class="nav-arrow">›</span>
        </button>
        <ul class="nav-sub" id="${subId}">
          ${item.sub.map(s => `
            <li>
              <a href="#${s.route}" class="nav-sub-item" data-route="${s.route}">
                <span class="nav-sub-dot"></span>
                ${s.label}
              </a>
            </li>
          `).join('')}
        </ul>
      `;
    }
    return `
      <a href="#${item.route}" class="nav-item" data-route="${item.route}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label">${item.label}</span>
        ${item.badge ? `<span class="badge badge-${item.badgeType || 'primary'}">${item.badge}</span>` : ''}
      </a>
    `;
  }

  return { render, NAV_STRUCTURE };
})();
