// ============================================
// UNIBOLT ERP — STATE MANAGEMENT STORE
// Simple reactive state store
// ============================================

const ERPStore = (() => {
  let state = {
    user: null,
    theme: 'dark',
    sidebarCollapsed: false,
    notifications: [],
    unreadCount: 0,
    currentPage: null,
    loading: false,
    error: null,
  };

  const listeners = {};

  function getState() { return { ...state }; }

  function setState(partial) {
    const prev = { ...state };
    state = { ...state, ...partial };
    // Notify relevant listeners
    Object.keys(partial).forEach(key => {
      if (listeners[key]) {
        listeners[key].forEach(fn => fn(state[key], prev[key]));
      }
    });
    // Always notify wildcard listeners
    if (listeners['*']) {
      listeners['*'].forEach(fn => fn(state, prev));
    }
  }

  function subscribe(key, fn) {
    if (!listeners[key]) listeners[key] = [];
    listeners[key].push(fn);
    // Return unsubscribe function
    return () => {
      listeners[key] = listeners[key].filter(f => f !== fn);
    };
  }

  function get(key) { return state[key]; }

  // Convenience methods
  function setLoading(loading) { setState({ loading }); }
  function setError(error) { setState({ error }); }
  function clearError() { setState({ error: null }); }

  // Persist non-sensitive state to localStorage
  function persist(keys) {
    const data = keys.reduce((acc, k) => { acc[k] = state[k]; return acc; }, {});
    localStorage.setItem('erp_state', JSON.stringify(data));
  }

  function restore(keys) {
    try {
      const saved = JSON.parse(localStorage.getItem('erp_state') || '{}');
      const partial = keys.reduce((acc, k) => {
        if (k in saved) acc[k] = saved[k];
        return acc;
      }, {});
      if (Object.keys(partial).length) setState(partial);
    } catch (e) { /* ignore */ }
  }

  return { getState, setState, subscribe, get, setLoading, setError, clearError, persist, restore };
})();
