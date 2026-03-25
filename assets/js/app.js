// ============================================
// UNIBOLT ERP — APP INITIALISER
// Bootstraps the entire application
// ============================================

const ERPApp = (() => {
  // ── Boot sequence ─────────────────────────
  async function init() {
    console.log('🚀 UniBolt ERP Initialising…');
    // 1. Apply saved theme
    applyTheme();
    // 2. Init components
    ERPLoader.init();
    ERPToast.init();
    ERPModal.init();
    // 3. Init auth (this triggers auth state observer)
    ERPAuth.init();
    // 4. Init router after auth is ready
    ERPRouter.init();
    // 5. Init global UI
    initGlobalUI();
    // 6. Register service worker (if supported)
    registerSW();
    console.log('✅ UniBolt ERP ready!');
  }

  // ── Theme ─────────────────────────────────
  function applyTheme() {
    const saved = localStorage.getItem('erp_theme') || 'dark';
    const color = localStorage.getItem('erp_color') || 'indigo';
    document.documentElement.setAttribute('data-theme', saved);
    document.documentElement.setAttribute('data-color', color);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('erp_theme', next);
    ERPToast.show(`${next === 'dark' ? '🌙 Dark' : '☀️ Light'} mode activated`, 'info');
  }

  // ── Global UI ─────────────────────────────
  function initGlobalUI() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const topbar = document.getElementById('topbar');
    const mainContent = document.getElementById('mainContent');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        const isMobile = window.innerWidth <= 1024;
        if (isMobile) {
          sidebar.classList.toggle('mobile-open');
          overlay && overlay.classList.toggle('show');
        } else {
          sidebar.classList.toggle('collapsed');
          topbar && topbar.classList.toggle('sidebar-collapsed');
          mainContent && mainContent.classList.toggle('sidebar-collapsed');
          localStorage.setItem('erp_sidebar_collapsed', sidebar.classList.contains('collapsed'));
        }
      });
    }

    // Restore sidebar state
    if (sidebar && localStorage.getItem('erp_sidebar_collapsed') === 'true' && window.innerWidth > 1024) {
      sidebar.classList.add('collapsed');
      topbar && topbar.classList.add('sidebar-collapsed');
      mainContent && mainContent.classList.add('sidebar-collapsed');
    }

    // Overlay click closes sidebar on mobile
    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar && sidebar.classList.remove('mobile-open');
        overlay.classList.remove('show');
      });
    }

    // Theme toggle button
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Global search (⌘K / Ctrl+K)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) searchInput.focus();
      }
    });

    // Dropdown menus
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
      }
    });
    document.querySelectorAll('[data-dropdown-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const menuId = btn.getAttribute('data-dropdown-toggle');
        const menu = document.getElementById(menuId);
        if (menu) {
          document.querySelectorAll('.dropdown-menu.open').forEach(m => {
            if (m !== menu) m.classList.remove('open');
          });
          menu.classList.toggle('open');
        }
      });
    });

    // Sub-nav accordions in sidebar
    document.querySelectorAll('[data-sub-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('expanded');
        const subId = btn.getAttribute('data-sub-toggle');
        const sub = document.getElementById(subId);
        if (sub) sub.classList.toggle('open');
      });
    });

    // Notification panel
    const notifBtn = document.getElementById('notifToggle');
    const notifPanel = document.getElementById('notifPanel');
    if (notifBtn && notifPanel) {
      notifBtn.addEventListener('click', () => notifPanel.classList.toggle('open'));
    }

    // Logout
    document.querySelectorAll('[data-action="logout"]').forEach(el => {
      el.addEventListener('click', () => ERPAuth.logout());
    });
  }

  // ── Service Worker ─────────────────────────
  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }

  return { init, toggleTheme };
})();

// Boot when DOM is ready
document.addEventListener('DOMContentLoaded', ERPApp.init);
