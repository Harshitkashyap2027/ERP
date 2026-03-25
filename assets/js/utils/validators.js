// ============================================
// UNIBOLT ERP — VALIDATORS
// ============================================

const ERPValidators = {
  // ── Core ──────────────────────────────────
  required(value) {
    if (value === null || value === undefined) return false;
    return String(value).trim().length > 0;
  },

  minLength(value, min) {
    return String(value).trim().length >= min;
  },

  maxLength(value, max) {
    return String(value).trim().length <= max;
  },

  // ── Email ─────────────────────────────────
  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  },

  // ── Phone ─────────────────────────────────
  phone(value) {
    return /^[6-9]\d{9}$/.test(String(value).replace(/\D/g, ''));
  },

  // ── Numbers ───────────────────────────────
  numeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  },

  integer(value) {
    return Number.isInteger(Number(value));
  },

  positiveNumber(value) {
    return this.numeric(value) && Number(value) > 0;
  },

  range(value, min, max) {
    const n = Number(value);
    return n >= min && n <= max;
  },

  percentage(value) {
    return this.range(value, 0, 100);
  },

  // ── Dates ─────────────────────────────────
  date(value) {
    const d = new Date(value);
    return !isNaN(d.getTime());
  },

  futureDate(value) {
    return this.date(value) && new Date(value) > new Date();
  },

  pastDate(value) {
    return this.date(value) && new Date(value) < new Date();
  },

  // ── Passwords ─────────────────────────────
  password(value) {
    return String(value).length >= 8;
  },

  strongPassword(value) {
    const str = String(value);
    return (
      str.length >= 8 &&
      /[A-Z]/.test(str) &&
      /[a-z]/.test(str) &&
      /\d/.test(str) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(str)
    );
  },

  passwordMatch(value, confirm) {
    return value === confirm;
  },

  // ── IDs ───────────────────────────────────
  rollNumber(value) {
    return /^[A-Z0-9]{4,12}$/.test(String(value).toUpperCase());
  },

  employeeId(value) {
    return /^[A-Z0-9]{3,10}$/.test(String(value).toUpperCase());
  },

  aadhar(value) {
    return /^\d{12}$/.test(String(value).replace(/\s/g, ''));
  },

  pan(value) {
    return /^[A-Z]{5}\d{4}[A-Z]{1}$/.test(String(value).toUpperCase());
  },

  // ── File ──────────────────────────────────
  fileSize(file, maxMB = 10) {
    return file && file.size <= maxMB * 1024 * 1024;
  },

  fileType(file, allowedTypes) {
    return file && allowedTypes.includes(file.type);
  },

  // ── URL ───────────────────────────────────
  url(value) {
    try { new URL(value); return true; } catch { return false; }
  },

  // ── Form validation helper ────────────────
  validateForm(formEl, rules) {
    const errors = {};
    let valid = true;

    Object.entries(rules).forEach(([field, fieldRules]) => {
      const input = formEl.querySelector(`[name="${field}"]`);
      if (!input) return;
      const value = input.value;

      for (const [rule, param] of Object.entries(fieldRules)) {
        if (rule === 'required' && param && !this.required(value)) {
          errors[field] = 'This field is required.';
          break;
        }
        if (rule === 'email' && param && !this.email(value)) {
          errors[field] = 'Enter a valid email address.';
          break;
        }
        if (rule === 'phone' && param && !this.phone(value)) {
          errors[field] = 'Enter a valid 10-digit phone number.';
          break;
        }
        if (rule === 'minLength' && !this.minLength(value, param)) {
          errors[field] = `Minimum ${param} characters required.`;
          break;
        }
        if (rule === 'maxLength' && !this.maxLength(value, param)) {
          errors[field] = `Maximum ${param} characters allowed.`;
          break;
        }
        if (rule === 'password' && param && !this.password(value)) {
          errors[field] = 'Password must be at least 8 characters.';
          break;
        }
        if (rule === 'numeric' && param && !this.numeric(value)) {
          errors[field] = 'Must be a valid number.';
          break;
        }
      }

      // Update UI
      const errorEl = formEl.querySelector(`[data-error="${field}"]`);
      if (errors[field]) {
        valid = false;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        if (errorEl) errorEl.textContent = errors[field];
      } else {
        input.classList.remove('is-invalid');
        if (value) input.classList.add('is-valid');
        if (errorEl) errorEl.textContent = '';
      }
    });

    return { valid, errors };
  },

  // Clear form validation state
  clearValidation(formEl) {
    formEl.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
      el.classList.remove('is-invalid', 'is-valid');
    });
    formEl.querySelectorAll('[data-error]').forEach(el => {
      el.textContent = '';
    });
  },
};
