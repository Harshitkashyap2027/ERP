// ============================================
// UNIBOLT ERP — AUTH CLOUD FUNCTIONS
// ============================================

const functions = require('firebase-functions');
const { admin, db, auth } = require('./index');

// Triggered when a new user signs up
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  const snap = await db.collection('users').doc(user.uid).get();
  if (!snap.exists) {
    await db.collection('users').doc(user.uid).set({
      name: user.displayName || user.email,
      email: user.email,
      photoURL: user.photoURL || null,
      role: 'student',
      permissions: [],
      status: 'active',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
  // Log the event
  await db.collection('auditLogs').add({
    action: 'user_registered',
    userId: user.uid,
    userEmail: user.email,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
});

// Triggered when a user is deleted
exports.onUserDeleted = functions.auth.user().onDelete(async (user) => {
  await db.collection('users').doc(user.uid).update({ status: 'deleted', deletedAt: admin.firestore.FieldValue.serverTimestamp() });
  await db.collection('auditLogs').add({
    action: 'user_deleted',
    userId: user.uid,
    userEmail: user.email,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
});

// Callable: Create user with specific role (admin only)
exports.createUserWithRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated.');
  const callerDoc = await db.collection('users').doc(context.auth.uid).get();
  if (!callerDoc.exists || !['admin', 'super_admin'].includes(callerDoc.data().role)) {
    throw new functions.https.HttpsError('permission-denied', 'Insufficient permissions.');
  }
  const { email, password, role, name, department } = data;
  const userRecord = await auth.createUser({ email, password, displayName: name });
  await db.collection('users').doc(userRecord.uid).set({
    name, email, role: role || 'student', department: department || null,
    permissions: [], status: 'active',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    createdBy: context.auth.uid,
  });
  return { success: true, uid: userRecord.uid };
});
