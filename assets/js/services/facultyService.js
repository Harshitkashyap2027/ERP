// ============================================
// UNIBOLT ERP — FACULTY SERVICE
// ============================================

const ERPFacultyService = {
  collection: ERPConstants.COLLECTIONS.FACULTY,

  async getAll(filters = {}) {
    try {
      let query = db.collection(this.collection);
      if (filters.department) query = query.where('department', '==', filters.department);
      if (filters.status) query = query.where('status', '==', filters.status);
      query = query.orderBy('name');
      const snap = await query.get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) { return []; }
  },

  async getById(id) {
    try {
      const doc = await db.collection(this.collection).doc(id).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (err) { return null; }
  },

  async create(data) {
    try {
      const ref = await db.collection(this.collection).add({
        ...data, status: 'active',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      return { success: true, id: ref.id };
    } catch (err) { return { success: false, error: err.message }; }
  },

  async update(id, data) {
    try {
      await db.collection(this.collection).doc(id).update({
        ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return { success: true };
    } catch (err) { return { success: false }; }
  },

  async getWorkload(facultyId) {
    try {
      const snap = await db.collection(ERPConstants.COLLECTIONS.TIMETABLES)
        .where('facultyId', '==', facultyId).get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) { return []; }
  },

  async getDashboardStats() {
    try {
      const snap = await db.collection(this.collection).get();
      return { total: snap.size };
    } catch (err) { return { total: 0 }; }
  },
};
