// ============================================
// UNIBOLT ERP — STUDENT SERVICE
// Firebase Firestore operations for students
// ============================================

const ERPStudentService = {
  collection: ERPConstants.COLLECTIONS.STUDENTS,

  async getAll(filters = {}) {
    try {
      let query = db.collection(this.collection);
      if (filters.department) query = query.where('department', '==', filters.department);
      if (filters.semester) query = query.where('semester', '==', filters.semester);
      if (filters.batch) query = query.where('batch', '==', filters.batch);
      if (filters.status) query = query.where('status', '==', filters.status);
      query = query.orderBy('name');
      const snap = await query.get();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('StudentService.getAll:', err);
      return [];
    }
  },

  async getById(id) {
    try {
      const doc = await db.collection(this.collection).doc(id).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (err) { console.error('StudentService.getById:', err); return null; }
  },

  async create(data) {
    try {
      const ref = await db.collection(this.collection).add({
        ...data,
        status: 'active',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      await ERPAuditLog.log('student_created', { studentId: ref.id, name: data.name });
      return { success: true, id: ref.id };
    } catch (err) { console.error('StudentService.create:', err); return { success: false, error: err.message }; }
  },

  async update(id, data) {
    try {
      await db.collection(this.collection).doc(id).update({
        ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return { success: true };
    } catch (err) { return { success: false, error: err.message }; }
  },

  async delete(id) {
    try {
      await db.collection(this.collection).doc(id).delete();
      await ERPAuditLog.log('student_deleted', { studentId: id });
      return { success: true };
    } catch (err) { return { success: false, error: err.message }; }
  },

  async getAttendanceSummary(studentId, monthYear) {
    try {
      const snap = await db.collection(ERPConstants.COLLECTIONS.ATTENDANCE)
        .where('studentId', '==', studentId)
        .where('monthYear', '==', monthYear).get();
      if (snap.empty) return null;
      return { id: snap.docs[0].id, ...snap.docs[0].data() };
    } catch (err) { return null; }
  },

  async getResults(studentId) {
    try {
      const snap = await db.collection(ERPConstants.COLLECTIONS.RESULTS)
        .where('studentId', '==', studentId).orderBy('createdAt', 'desc').get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) { return []; }
  },

  // Real-time listener
  onStudentsChange(callback) {
    return db.collection(this.collection).orderBy('name').onSnapshot(snap => {
      const students = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(students);
    });
  },

  async search(term) {
    const upper = term.toUpperCase();
    try {
      const snap = await db.collection(this.collection)
        .orderBy('rollNumber').startAt(upper).endAt(upper + '\uf8ff').limit(10).get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) { return []; }
  },

  async getDashboardStats() {
    try {
      const [allSnap, activeSnap] = await Promise.all([
        db.collection(this.collection).get(),
        db.collection(this.collection).where('status', '==', 'active').get(),
      ]);
      return {
        total: allSnap.size,
        active: activeSnap.size,
        inactive: allSnap.size - activeSnap.size,
      };
    } catch (err) { return { total: 0, active: 0, inactive: 0 }; }
  },
};
