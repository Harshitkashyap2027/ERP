// ============================================
// UNIBOLT ERP — ROLES CONFIGURATION
// ============================================

const ERPRoles = {
  SUPER_ADMIN: {
    key: 'super_admin',
    label: 'Super Administrator',
    icon: '👑',
    color: '#ef4444',
    description: 'Full access to all modules and system settings',
    dashboard: 'pages/dashboard/admin.html',
  },
  ADMIN: {
    key: 'admin',
    label: 'Administrator',
    icon: '⚙️',
    color: '#8b5cf6',
    description: 'Access to most administrative modules',
    dashboard: 'pages/dashboard/admin.html',
  },
  FACULTY: {
    key: 'faculty',
    label: 'Faculty Member',
    icon: '👨‍🏫',
    color: '#3b82f6',
    description: 'Access to teaching-related modules',
    dashboard: 'pages/dashboard/faculty.html',
  },
  STUDENT: {
    key: 'student',
    label: 'Student',
    icon: '👨‍🎓',
    color: '#10b981',
    description: 'Access to student-specific modules',
    dashboard: 'pages/dashboard/student.html',
  },
  STAFF: {
    key: 'staff',
    label: 'Staff Member',
    icon: '💼',
    color: '#f59e0b',
    description: 'Access to operational modules',
    dashboard: 'pages/dashboard/admin.html',
  },
  LIBRARIAN: {
    key: 'librarian',
    label: 'Librarian',
    icon: '📚',
    color: '#06b6d4',
    description: 'Library management module access',
    dashboard: 'pages/dashboard/admin.html',
  },
  ACCOUNTANT: {
    key: 'accountant',
    label: 'Accountant',
    icon: '💰',
    color: '#10b981',
    description: 'Finance and accounts module access',
    dashboard: 'pages/dashboard/admin.html',
  },
  PLACEMENT_OFFICER: {
    key: 'placement_officer',
    label: 'Placement Officer',
    icon: '🎯',
    color: '#6366f1',
    description: 'Placement and career module access',
    dashboard: 'pages/dashboard/admin.html',
  },
  HOSTEL_WARDEN: {
    key: 'hostel_warden',
    label: 'Hostel Warden',
    icon: '🏢',
    color: '#8b5cf6',
    description: 'Hostel management module access',
    dashboard: 'pages/dashboard/admin.html',
  },
  PARENT: {
    key: 'parent',
    label: 'Parent / Guardian',
    icon: '👨‍👩‍👧',
    color: '#94a3b8',
    description: 'View child academic progress',
    dashboard: 'pages/dashboard/student.html',
  },

  // Helper methods
  getByKey(key) {
    return Object.values(this).find(r => r.key === key);
  },

  getDashboard(key) {
    const role = this.getByKey(key);
    return role ? role.dashboard : 'pages/dashboard/admin.html';
  },

  getAllKeys() {
    return Object.values(this).filter(r => r.key).map(r => r.key);
  },
};
