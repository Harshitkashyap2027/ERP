// ============================================
// UNIBOLT ERP — TOAST NOTIFICATIONS COMPONENT
// ============================================

const ERPToast = (() => {
  let container = null;

  function init() {
    container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
  }

  function show(message, type = 'info', options = {}) {
    if (!container) init();

    const { title = getDefaultTitle(type), duration = 4000 } = options;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${getIcon(type)}</div>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close">✕</button>
      <div class="toast-progress" style="width:100%;color:${getColor(type)};"></div>
    `;

    container.appendChild(toast);

    // Progress bar animation
    const progress = toast.querySelector('.toast-progress');
    setTimeout(() => { if (progress) progress.style.width = '0'; progress.style.transition = `width ${duration}ms linear`; }, 50);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => dismiss(toast));

    // Auto dismiss
    const timer = setTimeout(() => dismiss(toast), duration);
    toast._timer = timer;

    return toast;
  }

  function dismiss(toast) {
    clearTimeout(toast._timer);
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
    setTimeout(() => toast.remove(), 350);
  }

  function getIcon(type) {
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    return icons[type] || icons.info;
  }

  function getColor(type) {
    const colors = { success: 'var(--success)', error: 'var(--danger)', warning: 'var(--warning)', info: 'var(--info)' };
    return colors[type] || colors.info;
  }

  function getDefaultTitle(type) {
    const titles = { success: 'Success', error: 'Error', warning: 'Warning', info: 'Info' };
    return titles[type] || '';
  }

  function success(msg, opts = {}) { return show(msg, 'success', opts); }
  function error(msg, opts = {}) { return show(msg, 'error', opts); }
  function warning(msg, opts = {}) { return show(msg, 'warning', opts); }
  function info(msg, opts = {}) { return show(msg, 'info', opts); }

  return { init, show, dismiss, success, error, warning, info };
})();
