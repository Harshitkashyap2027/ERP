// ============================================
// UNIBOLT ERP — ANALYTICS SERVICE
// ============================================

const ERPAnalyticsService = {
  async getDashboardOverview() {
    try {
      const [students, faculty, fees, payments] = await Promise.all([
        ERPStudentService.getDashboardStats(),
        ERPFacultyService.getDashboardStats(),
        db.collection(ERPConstants.COLLECTIONS.FEES).where('status', '==', 'unpaid').get(),
        db.collection(ERPConstants.COLLECTIONS.PAYMENTS)
          .orderBy('createdAt', 'desc').limit(5).get(),
      ]);

      return {
        students,
        faculty,
        pendingFees: fees.size,
        recentPayments: payments.docs.map(d => ({ id: d.id, ...d.data() })),
      };
    } catch (err) { return {}; }
  },

  async getAttendanceAnalytics(filters = {}) {
    try {
      let query = db.collection(ERPConstants.COLLECTIONS.ATTENDANCE);
      if (filters.semester) query = query.where('semester', '==', filters.semester);
      if (filters.department) query = query.where('department', '==', filters.department);
      const snap = await query.get();
      const records = snap.docs.map(d => d.data());

      const avgAttendance = records.length
        ? records.reduce((sum, r) => sum + (r.percentage || 0), 0) / records.length
        : 0;

      const atRisk = records.filter(r => (r.percentage || 0) < ERPConstants.ATTENDANCE_THRESHOLD).length;

      return { total: records.length, average: Math.round(avgAttendance), atRisk };
    } catch (err) { return { total: 0, average: 0, atRisk: 0 }; }
  },

  async getExamAnalytics(examId) {
    try {
      const snap = await db.collection(ERPConstants.COLLECTIONS.RESULTS)
        .where('examId', '==', examId).get();
      const results = snap.docs.map(d => d.data());

      if (!results.length) return null;

      const marks = results.map(r => r.marks || 0);
      const average = marks.reduce((a, b) => a + b, 0) / marks.length;
      const highest = Math.max(...marks);
      const lowest = Math.min(...marks);
      const passed = results.filter(r => (r.marks || 0) >= (r.passingMarks || 40)).length;

      return {
        totalStudents: results.length,
        average: Math.round(average * 10) / 10,
        highest,
        lowest,
        passed,
        failed: results.length - passed,
        passPercentage: Math.round((passed / results.length) * 100),
      };
    } catch (err) { return null; }
  },

  async getStudentRiskList() {
    try {
      const snap = await db.collection(ERPConstants.COLLECTIONS.ATTENDANCE)
        .where('percentage', '<', ERPConstants.ATTENDANCE_THRESHOLD).get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) { return []; }
  },

  async getMonthlyRevenue(months = 6) {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      const snap = await db.collection(ERPConstants.COLLECTIONS.PAYMENTS)
        .where('createdAt', '>=', startDate)
        .orderBy('createdAt', 'asc').get();

      const grouped = {};
      snap.docs.forEach(d => {
        const data = d.data();
        const date = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        grouped[key] = (grouped[key] || 0) + (data.amount || 0);
      });

      return Object.entries(grouped).map(([month, amount]) => ({ month, amount }));
    } catch (err) { return []; }
  },
};
