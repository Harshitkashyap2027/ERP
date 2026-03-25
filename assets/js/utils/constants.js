// ============================================
// UNIBOLT ERP — CONSTANTS
// ============================================

const ERPConstants = {
  APP_NAME: 'UniBolt ERP',
  APP_VERSION: '1.0.0',
  APP_TAGLINE: 'Enterprise College Management System',

  // ── Roles ─────────────────────────────────
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    FACULTY: 'faculty',
    STUDENT: 'student',
    STAFF: 'staff',
    PARENT: 'parent',
    LIBRARIAN: 'librarian',
    ACCOUNTANT: 'accountant',
    PLACEMENT_OFFICER: 'placement_officer',
    HOSTEL_WARDEN: 'hostel_warden',
  },

  // ── Firestore Collections ─────────────────
  COLLECTIONS: {
    USERS: 'users',
    STUDENTS: 'students',
    FACULTY: 'faculty',
    STAFF: 'staff',
    COURSES: 'courses',
    SUBJECTS: 'subjects',
    BATCHES: 'batches',
    ATTENDANCE: 'attendance',
    EXAMS: 'exams',
    RESULTS: 'results',
    FEES: 'fees',
    PAYMENTS: 'payments',
    SCHOLARSHIPS: 'scholarships',
    BOOKS: 'books',
    BOOK_ISSUES: 'bookIssues',
    HOSTEL_ROOMS: 'hostelRooms',
    HOSTEL_ALLOCATIONS: 'hostelAllocations',
    TRANSPORT_ROUTES: 'transportRoutes',
    VEHICLES: 'vehicles',
    JOBS: 'jobs',
    INTERNSHIPS: 'internships',
    ANNOUNCEMENTS: 'announcements',
    NOTIFICATIONS: 'notifications',
    MESSAGES: 'messages',
    EVENTS: 'events',
    TICKETS: 'tickets',
    INVENTORY: 'inventory',
    ASSETS: 'assets',
    AUDIT_LOGS: 'auditLogs',
    FEEDBACK: 'feedback',
    CLUBS: 'clubs',
    TIMETABLES: 'timetables',
    LEAVE_REQUESTS: 'leaveRequests',
  },

  // ── Status values ─────────────────────────
  STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    PAID: 'paid',
    UNPAID: 'unpaid',
    OVERDUE: 'overdue',
    ISSUED: 'issued',
    RETURNED: 'returned',
    OPEN: 'open',
    CLOSED: 'closed',
    RESOLVED: 'resolved',
  },

  // ── Academic ──────────────────────────────
  SEMESTERS: [1, 2, 3, 4, 5, 6, 7, 8],
  GRADES: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
  ATTENDANCE_THRESHOLD: 75, // percentage
  DAYS_OF_WEEK: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  // ── Pagination ────────────────────────────
  PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],

  // ── File Limits ───────────────────────────
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOC_TYPES: ['application/pdf', 'application/msword', 'text/plain'],

  // ── Fees ──────────────────────────────────
  FEE_CATEGORIES: ['Tuition', 'Hostel', 'Transport', 'Library', 'Laboratory', 'Exam', 'Other'],
  PAYMENT_METHODS: ['Online', 'Cash', 'Cheque', 'DD', 'NEFT/RTGS'],

  // ── Leave Types ───────────────────────────
  LEAVE_TYPES: ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Maternity Leave', 'Study Leave'],

  // ── Event Types ───────────────────────────
  EVENT_TYPES: ['Academic', 'Cultural', 'Sports', 'Technical', 'Workshop', 'Seminar', 'Exam', 'Holiday'],

  // ── Ticket Categories ─────────────────────
  TICKET_CATEGORIES: ['Academic', 'Finance', 'Technical', 'Hostel', 'Transport', 'Library', 'Other'],

  // ── Toast durations (ms) ─────────────────
  TOAST_DURATION: {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 8000,
  },
};
