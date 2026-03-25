// ============================================
// UNIBOLT ERP — FIREBASE CLOUD FUNCTIONS
// Entry point — imports all function modules
// ============================================

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

// Export function groups
const authFunctions = require('./authFunctions');
const paymentFunctions = require('./paymentFunctions');
const notificationFunctions = require('./notificationFunctions');

// Auth functions
exports.onUserCreated = authFunctions.onUserCreated;
exports.onUserDeleted = authFunctions.onUserDeleted;
exports.createUserWithRole = authFunctions.createUserWithRole;

// Payment functions
exports.initiatePayment = paymentFunctions.initiatePayment;
exports.verifyPayment = paymentFunctions.verifyPayment;
exports.generateReceipt = paymentFunctions.generateReceipt;

// Notification functions
exports.sendEmailNotification = notificationFunctions.sendEmailNotification;
exports.sendBulkNotification = notificationFunctions.sendBulkNotification;
exports.onFeeOverdue = notificationFunctions.onFeeOverdue;
exports.onLowAttendance = notificationFunctions.onLowAttendance;

// Scheduled functions
exports.dailyAttendanceCheck = functions.pubsub.schedule('0 8 * * *').onRun(async (context) => {
  // Check for students with low attendance and send alerts
  const threshold = 75;
  const snap = await db.collection('attendance')
    .where('percentage', '<', threshold).get();

  const notifications = snap.docs.map(doc => {
    const data = doc.data();
    return db.collection('notifications').add({
      userId: data.studentId,
      type: 'attendance_alert',
      title: 'Low Attendance Warning',
      message: `Your attendance is ${data.percentage}%, below the required ${threshold}%.`,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await Promise.all(notifications);
  console.log(`Sent ${notifications.length} attendance alerts`);
  return null;
});

exports.weeklyFeeReminder = functions.pubsub.schedule('0 9 * * 1').onRun(async (context) => {
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  const snap = await db.collection('fees')
    .where('status', '==', 'unpaid')
    .where('dueDate', '<=', threeDaysFromNow).get();

  const reminders = snap.docs.map(doc => {
    const data = doc.data();
    return db.collection('notifications').add({
      userId: data.studentId,
      type: 'fee_reminder',
      title: 'Fee Payment Reminder',
      message: `Your fee of ₹${data.amount} is due soon.`,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  await Promise.all(reminders);
  return null;
});

module.exports.db = db;
module.exports.auth = auth;
module.exports.admin = admin;
