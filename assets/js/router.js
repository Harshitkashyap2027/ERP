// ============================================
// UNIBOLT ERP — CLIENT-SIDE ROUTER
// Hash-based SPA navigation
// ============================================

const ERPRouter = (() => {
  const routes = {};
  let currentRoute = null;
  const PUBLIC_ROUTES = ['login', 'register', 'forgot-password'];

  // ── Register a route ─────────────────────
  function register(path, handler) {
    routes[path] = handler;
  }

  // ── Navigate to path ─────────────────────
  function navigate(path, params = {}) {
    window.location.hash = path;
  }

  // ── Handle hash change ───────────────────
  function handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const [path, ...queryParts] = hash.split('?');
    const params = parseQuery(queryParts.join('?'));

    currentRoute = path;

    // Auth guard — skip if Firebase not configured (demo mode)
    const demoMode = !auth;
    if (!demoMode) {
      if (!PUBLIC_ROUTES.includes(path) && !ERPAuth.isAuthenticated()) {
        navigate('login');
        return;
      }
      if (PUBLIC_ROUTES.includes(path) && ERPAuth.isAuthenticated()) {
        navigate('dashboard');
        return;
      }
    }

    // Call handler
    if (routes[path]) {
      routes[path](params);
    } else if (routes['404']) {
      routes['404']();
    }
    // If no handler and no 404 handler, keep existing page content (static dashboard)

    // Update active nav item
    updateActiveNav(path);
  }

  // ── Parse query string ───────────────────
  function parseQuery(queryString) {
    if (!queryString) return {};
    return queryString.split('&').reduce((acc, pair) => {
      const [key, val] = pair.split('=');
      acc[decodeURIComponent(key)] = decodeURIComponent(val || '');
      return acc;
    }, {});
  }

  // ── Update sidebar active state ──────────
  function updateActiveNav(path) {
    document.querySelectorAll('.nav-item, .nav-sub-item').forEach(el => {
      el.classList.remove('active');
    });
    const active = document.querySelector(`[data-route="${path}"]`);
    if (active) {
      active.classList.add('active');
      // Open parent submenu if needed
      const parentSub = active.closest('.nav-sub');
      if (parentSub) {
        parentSub.classList.add('open');
        const parentBtn = parentSub.previousElementSibling;
        if (parentBtn) parentBtn.classList.add('expanded');
      }
    }
  }

  // ── Redirect helpers ─────────────────────
  function redirectAfterLogin() {
    const savedRoute = sessionStorage.getItem('erp_redirect') || 'dashboard';
    sessionStorage.removeItem('erp_redirect');
    navigate(savedRoute);
  }

  function redirectToLogin() {
    const hash = window.location.hash.replace('#', '');
    if (!PUBLIC_ROUTES.includes(hash)) {
      sessionStorage.setItem('erp_redirect', hash || 'dashboard');
    }
    navigate('login');
  }

  // ── Fallback ─────────────────────────────
  function show404() {
    const content = document.getElementById('page-content');
    if (content) {
      content.innerHTML = `
        <div class="empty-state" style="margin-top: 4rem;">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-title">Page Not Found</div>
          <p class="empty-state-text">The page you are looking for does not exist.</p>
          <a href="#dashboard" class="btn btn-primary mt-4">Go to Dashboard</a>
        </div>
      `;
    }
  }

  // ── Init ─────────────────────────────────
  function init() {
    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Handle initial load
  }

  function getCurrentRoute() { return currentRoute; }

  return { init, navigate, register, redirectAfterLogin, redirectToLogin, getCurrentRoute };
})();
