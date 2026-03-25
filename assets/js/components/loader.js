// ============================================
// UNIBOLT ERP — PAGE LOADER COMPONENT
// ============================================

const ERPLoader = (() => {
  let overlay = null;

  function init() {
    overlay = document.getElementById('pageLoader');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'pageLoader';
      overlay.className = 'page-loader';
      overlay.innerHTML = `
        <div class="logo-icon" style="width:56px;height:56px;font-size:1.75rem;">⚡</div>
        <div class="page-loader-logo">UniBolt</div>
        <div class="spinner"></div>
        <div class="page-loader-text" id="loaderText">Loading…</div>
      `;
      document.body.appendChild(overlay);
    }
  }

  function show(message = 'Loading…') {
    if (!overlay) init();
    const textEl = overlay.querySelector('#loaderText');
    if (textEl) textEl.textContent = message;
    overlay.classList.remove('fade-out');
    overlay.style.display = 'flex';
  }

  function hide() {
    if (!overlay) return;
    overlay.classList.add('fade-out');
    setTimeout(() => { overlay.style.display = 'none'; }, 400);
  }

  // Inline button loading state
  function setButtonLoading(btn, loading = true) {
    if (!btn) return;
    if (loading) {
      btn.disabled = true;
      btn._originalText = btn.innerHTML;
      btn.innerHTML = `<span class="animate-spin" style="display:inline-block">⏳</span> ${btn._originalText}`;
    } else {
      btn.disabled = false;
      if (btn._originalText) btn.innerHTML = btn._originalText;
    }
  }

  return { init, show, hide, setButtonLoading };
})();
