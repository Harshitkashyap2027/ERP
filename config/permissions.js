// ============================================
// UNIBOLT ERP — PERMISSIONS ENGINE
// Fine-grained permission definitions per role
// ============================================

const ERPPermissions = {
  // ── Permission Keys ───────────────────────
  PERMISSIONS: {
    // Students
    STUDENT_VIEW: 'student.view',
    STUDENT_CREATE: 'student.create',
    STUDENT_EDIT: 'student.edit',
    STUDENT_DELETE: 'student.delete',
    STUDENT_EXPORT: 'student.export',

    // Faculty
    FACULTY_VIEW: 'faculty.view',
    FACULTY_CREATE: 'faculty.create',
    FACULTY_EDIT: 'faculty.edit',
    FACULTY_DELETE: 'faculty.delete',

    // Attendance
    ATTENDANCE_MARK: 'attendance.mark',
    ATTENDANCE_VIEW: 'attendance.view',
    ATTENDANCE_EDIT: 'attendance.edit',
    ATTENDANCE_REPORT: 'attendance.report',

    // Exams
    EXAM_CREATE: 'exam.create',
    EXAM_EDIT: 'exam.edit',
    EXAM_PUBLISH: 'exam.publish',
    RESULT_VIEW: 'result.view',
    RESULT_PUBLISH: 'result.publish',
    RESULT_EDIT: 'result.edit',

    // Finance
    FEE_VIEW: 'fee.view',
    FEE_CREATE: 'fee.create',
    FEE_EDIT: 'fee.edit',
    PAYMENT_VIEW: 'payment.view',
    PAYMENT_RECORD: 'payment.record',
    SCHOLARSHIP_MANAGE: 'scholarship.manage',

    // Library
    BOOK_VIEW: 'book.view',
    BOOK_MANAGE: 'book.manage',
    BOOK_ISSUE: 'book.issue',

    // Hostel
    HOSTEL_VIEW: 'hostel.view',
    HOSTEL_MANAGE: 'hostel.manage',
    ROOM_ALLOCATE: 'room.allocate',

    // Transport
    TRANSPORT_VIEW: 'transport.view',
    TRANSPORT_MANAGE: 'transport.manage',

    // Announcements
    ANNOUNCEMENT_VIEW: 'announcement.view',
    ANNOUNCEMENT_CREATE: 'announcement.create',

    // Reports
    REPORT_VIEW: 'report.view',
    REPORT_GENERATE: 'report.generate',
    REPORT_EXPORT: 'report.export',

    // System
    SYSTEM_SETTINGS: 'system.settings',
    AUDIT_LOG_VIEW: 'audit.view',
    USER_MANAGE: 'user.manage',
    ROLE_ASSIGN: 'role.assign',
  },

  // ── Default permissions per role ──────────
  DEFAULT_PERMISSIONS: {
    super_admin: ['*'], // All permissions

    admin: [
      'student.*', 'faculty.*', 'attendance.*', 'exam.*', 'result.*',
      'fee.*', 'payment.*', 'scholarship.manage',
      'book.*', 'hostel.*', 'transport.*',
      'announcement.*', 'report.*',
      'audit.view', 'user.manage',
    ],

    faculty: [
      'student.view', 'attendance.mark', 'attendance.view', 'attendance.report',
      'exam.create', 'exam.edit', 'result.view', 'result.publish',
      'announcement.view', 'announcement.create',
      'report.view', 'book.view',
    ],

    student: [
      'result.view', 'attendance.view', 'fee.view',
      'payment.view', 'book.view', 'announcement.view',
      'transport.view', 'hostel.view',
    ],

    staff: [
      'student.view', 'attendance.view',
      'book.view', 'hostel.view', 'transport.view',
      'announcement.view',
    ],

    librarian: ['book.*'],
    accountant: ['fee.*', 'payment.*', 'scholarship.manage', 'report.view'],
    placement_officer: ['student.view', 'report.view'],
    hostel_warden: ['hostel.*', 'room.allocate', 'student.view'],
    parent: ['result.view', 'attendance.view', 'fee.view', 'payment.view'],
  },

  // ── Check permission ──────────────────────
  can(userPermissions, userRole, permission) {
    if (userRole === 'super_admin') return true;
    const rolePerms = this.DEFAULT_PERMISSIONS[userRole] || [];
    if (rolePerms.includes('*')) return true;

    const [module, action] = permission.split('.');
    if (rolePerms.includes(`${module}.*`)) return true;
    if (rolePerms.includes(permission)) return true;
    if (userPermissions && userPermissions.includes(permission)) return true;

    return false;
  },

  // Get all permissions for a role
  getForRole(role) {
    return this.DEFAULT_PERMISSIONS[role] || [];
  },
};
