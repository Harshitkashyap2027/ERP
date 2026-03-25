// ============================================
// UNIBOLT ERP — MODAL COMPONENT
// ============================================

const ERPModal = (() => {
  let activeModal = null;

  function init() {
    // Close on backdrop click
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) close();
    });
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
    // Close buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-modal-close]')) close();
    });
    // Open buttons
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-modal-open]');
      if (trigger) open(trigger.getAttribute('data-modal-open'));
    });
  }

  function open(modalId) {
    const backdrop = document.getElementById(modalId);
    if (!backdrop) return;
    activeModal = backdrop;
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!activeModal) {
      // Try to close any open modal
      const open = document.querySelector('.modal-backdrop.open');
      if (open) { open.classList.remove('open'); document.body.style.overflow = ''; }
      return;
    }
    activeModal.classList.remove('open');
    document.body.style.overflow = '';
    activeModal = null;
  }

  function create({ id, title, content, size = '', footer = '' }) {
    // Remove existing modal with same id
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = id;
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal ${size ? `modal-${size}` : ''}">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close" data-modal-close aria-label="Close">✕</button>
        </div>
        <div class="modal-body">${content}</div>
        ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
      </div>
    `;
    document.body.appendChild(backdrop);
    return backdrop;
  }

  function confirm({ title = 'Confirm', message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) {
    return new Promise((resolve) => {
      const id = 'confirm-modal-' + Date.now();
      const modal = create({
        id,
        title,
        content: `<p style="color:var(--text-secondary)">${message}</p>`,
        footer: `
          <button class="btn btn-secondary" id="${id}-cancel">${cancelText}</button>
          <button class="btn btn-${type}" id="${id}-confirm">${confirmText}</button>
        `
      });
      open(id);
      document.getElementById(`${id}-confirm`).addEventListener('click', () => { close(); modal.remove(); resolve(true); });
      document.getElementById(`${id}-cancel`).addEventListener('click', () => { close(); modal.remove(); resolve(false); });
    });
  }

  return { init, open, close, create, confirm };
})();
