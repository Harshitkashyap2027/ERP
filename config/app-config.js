// ============================================
// UNIBOLT ERP — APP CONFIGURATION
// ============================================

const ERPAppConfig = {
  // App Info
  name: 'UniBolt ERP',
  version: '1.0.0',
  tagline: 'Enterprise College Management System',
  supportEmail: 'support@unibolt.in',
  supportPhone: '+91-1234567890',

  // University/Institution Details
  institution: {
    name: 'University Name',
    shortName: 'UNI',
    logo: null,
    address: 'University Road, City - 000000',
    phone: '+91-0000000000',
    email: 'info@university.edu',
    website: 'https://university.edu',
    establishedYear: 2000,
    affiliatedTo: 'State Technical University',
    naacGrade: 'A+',
  },

  // Academic Settings
  academic: {
    currentYear: '2024-25',
    currentSemester: 3,
    attendanceThreshold: 75, // percentage
    maxSemesters: 8,
    gradingSystem: 'CGPA', // CGPA | Percentage | Grade
    passingMarks: 40, // percentage
  },

  // Feature Flags
  features: {
    aiAssistant: true,
    onlineExams: true,
    rfidAttendance: false,
    biometricIntegration: false,
    gpsTracking: true,
    lms: true,
    placement: true,
    hosteel: true,
    transport: true,
    library: true,
    sms: false,
    email: true,
    pushNotifications: true,
    faceRecognition: false,
  },

  // Pagination
  defaultPageSize: 20,

  // Currency
  currency: 'INR',
  currencySymbol: '₹',

  // Date/Time
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',

  // File Upload Limits
  maxImageSizeMB: 5,
  maxDocumentSizeMB: 10,
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],

  // Notification Settings
  notifications: {
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    inAppEnabled: true,
  },
};
