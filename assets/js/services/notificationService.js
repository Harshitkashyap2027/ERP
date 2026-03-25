// ============================================
// UNIBOLT ERP — NOTIFICATION SERVICE
// ============================================

const ERPNotificationService = {
  collection: ERPConstants.COLLECTIONS.NOTIFICATIONS,
  _unsubscribe: null,

  async send(data) {
    try {
      const ref = await db.collection(this.collection).add({
        ...data,
        read: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      return { success: true, id: ref.id };
    } catch (err) { return { success: false }; }
  },

  async broadcast(data, role) {
    try {
      const users = await ERPUserService.getUsersByRole(role);
      const batch = db.batch();
      users.forEach(user => {
        const ref = db.collection(this.collection).doc();
        batch.set(ref, {
          ...data, userId: user.id, read: false,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });
      await batch.commit();
      return { success: true };
    } catch (err) { return { success: false }; }
  },

  async markRead(notifId) {
    try {
      await db.collection(this.collection).doc(notifId).update({ read: true, readAt: firebase.firestore.FieldValue.serverTimestamp() });
      return { success: true };
    } catch (err) { return { success: false }; }
  },

  async markAllRead(userId) {
    try {
      const snap = await db.collection(this.collection)
        .where('userId', '==', userId).where('read', '==', false).get();
      const batch = db.batch();
      snap.docs.forEach(d => batch.update(d.ref, { read: true }));
      await batch.commit();
      return { success: true };
    } catch (err) { return { success: false }; }
  },

  async getForUser(userId, limit = 30) {
    try {
      const snap = await db.collection(this.collection)
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc').limit(limit).get();
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) { return []; }
  },

  listenForUser(userId, callback) {
    if (this._unsubscribe) this._unsubscribe();
    this._unsubscribe = db.collection(this.collection)
      .where('userId', '==', userId)
      .where('read', '==', false)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snap => {
        const notifs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(notifs);
        // Update badge
        const badge = document.querySelector('#notifToggle .notification-dot');
        if (badge) badge.style.display = notifs.length ? 'block' : 'none';
        ERPStore.setState({ notifications: notifs, unreadCount: notifs.length });
      });
    return this._unsubscribe;
  },

  stopListening() {
    if (this._unsubscribe) { this._unsubscribe(); this._unsubscribe = null; }
  },
};
