// ============================================
// UNIBOLT ERP — FINANCE SERVICE
// ============================================

const ERPFinanceService = {
  async getFees(filters = {}) {
    try {
      let query = db.collection(ERPConstants.COLLECTIONS.FEES);
      if (filters.studentId) query = query.where('studentId', '==', filters.studentId);
      if (filters.status) query = query.where('status', '==', filters.status);
      if (filters.academicYear) query = query.where('academicYear', '==', filters.academicYear);
      query = query.orderBy('dueDate', 'desc');
      const snap = await query.get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) { return []; }
  },

  async getPayments(filters = {}) {
    try {
      let query = db.collection(ERPConstants.COLLECTIONS.PAYMENTS);
      if (filters.studentId) query = query.where('studentId', '==', filters.studentId);
      if (filters.status) query = query.where('status', '==', filters.status);
      query = query.orderBy('createdAt', 'desc');
      const snap = await query.get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) { return []; }
  },

  async recordPayment(data) {
    try {
      const ref = await db.collection(ERPConstants.COLLECTIONS.PAYMENTS).add({
        ...data,
        status: 'paid',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      // Update fee status
      if (data.feeId) {
        await db.collection(ERPConstants.COLLECTIONS.FEES).doc(data.feeId).update({ status: 'paid', paidAt: firebase.firestore.FieldValue.serverTimestamp() });
      }
      await ERPAuditLog.log('payment_recorded', { paymentId: ref.id, amount: data.amount });
      return { success: true, id: ref.id };
    } catch (err) { return { success: false, error: err.message }; }
  },

  async getDashboardStats(academicYear) {
    try {
      const [feesSnap, paidSnap, overdueSnap] = await Promise.all([
        db.collection(ERPConstants.COLLECTIONS.FEES).where('academicYear', '==', academicYear).get(),
        db.collection(ERPConstants.COLLECTIONS.FEES).where('academicYear', '==', academicYear).where('status', '==', 'paid').get(),
        db.collection(ERPConstants.COLLECTIONS.FEES).where('academicYear', '==', academicYear).where('status', '==', 'overdue').get(),
      ]);

      const totalAmount = feesSnap.docs.reduce((sum, d) => sum + (d.data().amount || 0), 0);
      const paidAmount = paidSnap.docs.reduce((sum, d) => sum + (d.data().amount || 0), 0);

      return {
        total: totalAmount,
        collected: paidAmount,
        pending: totalAmount - paidAmount,
        overdue: overdueSnap.size,
      };
    } catch (err) { return { total: 0, collected: 0, pending: 0, overdue: 0 }; }
  },

  async getScholarships(filters = {}) {
    try {
      let query = db.collection(ERPConstants.COLLECTIONS.SCHOLARSHIPS);
      if (filters.studentId) query = query.where('studentId', '==', filters.studentId);
      const snap = await query.get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) { return []; }
  },
};
