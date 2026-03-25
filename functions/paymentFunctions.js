// ============================================
// UNIBOLT ERP — PAYMENT CLOUD FUNCTIONS
// Integrate with Razorpay/Stripe/PayU here
// ============================================

const functions = require('firebase-functions');
const { admin, db } = require('./index');

// Callable: Initiate payment
exports.initiatePayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated.');
  const { feeId, amount, studentId } = data;
  // TODO: Integrate with payment gateway (Razorpay/PayU)
  // For now, create a pending payment record
  const paymentRef = await db.collection('payments').add({
    feeId, amount, studentId,
    status: 'pending', method: 'online',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    createdBy: context.auth.uid,
  });
  return { success: true, paymentId: paymentRef.id, orderId: 'ORDER_' + paymentRef.id.substring(0, 8).toUpperCase() };
});

// Callable: Verify payment
exports.verifyPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated.');
  const { paymentId, gatewayPaymentId, signature } = data;
  // TODO: Verify signature with payment gateway
  // Update payment and fee status
  await db.collection('payments').doc(paymentId).update({
    status: 'paid', gatewayPaymentId, verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  const payDoc = await db.collection('payments').doc(paymentId).get();
  if (payDoc.data().feeId) {
    await db.collection('fees').doc(payDoc.data().feeId).update({ status: 'paid', paidAt: admin.firestore.FieldValue.serverTimestamp() });
  }
  return { success: true };
});

// Callable: Generate payment receipt
exports.generateReceipt = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated.');
  const { paymentId } = data;
  const doc = await db.collection('payments').doc(paymentId).get();
  if (!doc.exists) throw new functions.https.HttpsError('not-found', 'Payment not found.');
  const payment = doc.data();
  return {
    receiptNumber: 'RCP-' + paymentId.substring(0, 8).toUpperCase(),
    ...payment,
  };
});
