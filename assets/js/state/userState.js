// ============================================
// UNIBOLT ERP — USER STATE
// ============================================

const ERPState = {
  _user: null,
  _listeners: [],

  setUser(user) {
    this._user = user;
    ERPAuthState.set(user);
    this._listeners.forEach(fn => fn(user));
  },

  clearUser() {
    this._user = null;
    ERPAuthState.clear();
    this._listeners.forEach(fn => fn(null));
  },

  getUser() { return this._user; },

  onUserChange(fn) {
    this._listeners.push(fn);
    return () => { this._listeners = this._listeners.filter(f => f !== fn); };
  },

  // Profile fields
  get displayName() { return this._user?.displayName || ''; },
  get email() { return this._user?.email || ''; },
  get role() { return this._user?.role || 'student'; },
  get uid() { return this._user?.uid || null; },
  get photoURL() { return this._user?.photoURL || null; },
  get isAdmin() { return ['admin', 'super_admin'].includes(this.role); },
  get isFaculty() { return this.role === 'faculty'; },
  get isStudent() { return this.role === 'student'; },
};
