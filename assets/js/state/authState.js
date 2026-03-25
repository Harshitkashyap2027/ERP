// ============================================
// UNIBOLT ERP — AUTH STATE
// ============================================

const ERPAuthState = {
  user: null,
  isAuthenticated: false,
  role: null,
  permissions: [],

  set(user) {
    this.user = user;
    this.isAuthenticated = !!user;
    this.role = user?.role || null;
    this.permissions = user?.permissions || [];
    ERPStore.setState({ user });
  },

  clear() {
    this.user = null;
    this.isAuthenticated = false;
    this.role = null;
    this.permissions = [];
    ERPStore.setState({ user: null });
  },

  can(permission) {
    if (this.role === 'super_admin' || this.role === 'admin') return true;
    return this.permissions.includes(permission);
  },

  hasRole(role) {
    if (Array.isArray(role)) return role.includes(this.role);
    return this.role === role;
  },
};
