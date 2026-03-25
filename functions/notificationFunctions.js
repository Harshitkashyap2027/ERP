// ============================================
// UNIBOLT ERP — NOTIFICATION CLOUD FUNCTIONS
// ============================================

const functions = require('firebase-functions');
const { admin, db } = require('./index');

// Callable: Send email notification
exports.sendEmailNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated.');
  const { to, subject, body } = data;
  // TODO: Use SendGrid/Nodemailer to send email
  console.log(`Email to ${to}: ${subject}`);
  return { success: true };
});

// Callable: Send bulk notification to role
exports.sendBulkNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated.');
  const callerDoc = await db.collection('users').doc(context.auth.uid).get();
  if (!['admin', 'super_admin', 'faculty'].includes(callerDoc.data()?.role)) {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions.');
  }
  const { title, message, targetRole, type = 'general' } = data;
  const usersSnap = await db.collection('users').where('role', '==', targetRole).get();
  const batch = db.batch();
  usersSnap.docs.forEach(userDoc => {
    const ref = db.collection('notifications').doc();
    batch.set(ref, {
      userId: userDoc.id, title, message, type, read: false,
      sentBy: context.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
  await batch.commit();
  return { success: true, count: usersSnap.size };
});

// Firestore trigger: Alert when fee becomes overdue
exports.onFeeOverdue = functions.firestore.document('fees/{feeId}').onUpdate(async (change, context) => {
  const before = change.before.data();
  const after = change.after.data();
  if (before.status !== 'overdue' && after.status === 'overdue') {
    await db.collection('notifications').add({
      userId: after.studentId,
      type: 'fee_overdue',
      title: '🚨 Fee Payment Overdue',
      message: `Your fee of ₹${after.amount} is overdue. Late charges may apply.`,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
});

// Firestore trigger: Alert on low attendance
exports.onLowAttendance = functions.firestore.document('attendance/{recordId}').onWrite(async (change, context) => {
  const data = change.after.data();
  if (!data) return;
  if ((data.percentage || 100) < 75) {
    await db.collection('notifications').add({
      userId: data.studentId,
      type: 'low_attendance',
      title: '⚠️ Low Attendance Alert',
      message: `Your attendance in ${data.subject} is ${data.percentage}%. Minimum 75% required.`,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
});
