// ============================================
// UNIBOLT ERP — USER SERVICE
// ============================================

const ERPUserService = {
  collection: ERPConstants.COLLECTIONS.USERS,

  async getProfile(uid) {
    try {
      const doc = await db.collection(this.collection).doc(uid).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (err) { return null; }
  },

  async updateProfile(uid, data) {
    try {
      await db.collection(this.collection).doc(uid).update({
        ...data, updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      // Update Firebase Auth display name if changed
      if (data.name && auth.currentUser) {
        await auth.currentUser.updateProfile({ displayName: data.name });
      }
      return { success: true };
    } catch (err) { return { success: false, error: err.message }; }
  },

  async uploadAvatar(uid, file) {
    try {
      const ref = storage.ref(`avatars/${uid}`);
      await ref.put(file);
      const url = await ref.getDownloadURL();
      await this.updateProfile(uid, { photoURL: url });
      if (auth.currentUser) await auth.currentUser.updateProfile({ photoURL: url });
      return { success: true, url };
    } catch (err) { return { success: false, error: err.message }; }
  },

  async getUsersByRole(role) {
    try {
      const snap = await db.collection(this.collection).where('role', '==', role).get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) { return []; }
  },

  async updateRole(uid, role, permissions = []) {
    try {
      await db.collection(this.collection).doc(uid).update({ role, permissions });
      await ERPAuditLog.log('role_changed', { targetUid: uid, role });
      return { success: true };
    } catch (err) { return { success: false }; }
  },

  async deactivate(uid) {
    try {
      await db.collection(this.collection).doc(uid).update({ status: 'inactive' });
      return { success: true };
    } catch (err) { return { success: false }; }
  },
};

// ── Audit Log Utility ─────────────────────
const ERPAuditLog = {
  async log(action, details = {}) {
    try {
      const user = ERPAuth.getCurrentUser();
      await db.collection(ERPConstants.COLLECTIONS.AUDIT_LOGS).add({
        action,
        details,
        userId: user?.uid || 'system',
        userEmail: user?.email || '',
        userRole: user?.role || '',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        ip: null, // to be filled by cloud function
      });
    } catch (err) { /* silent */ }
  },

  async getRecent(limit = 50) {
    try {
      const snap = await db.collection(ERPConstants.COLLECTIONS.AUDIT_LOGS)
        .orderBy('timestamp', 'desc').limit(limit).get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) { return []; }
  },
};
