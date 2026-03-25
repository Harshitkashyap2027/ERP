// ============================================
// UNIBOLT ERP — HELPER UTILITIES
// ============================================

const ERPHelpers = {
  // ── Formatting ────────────────────────────
  formatDate(date, format = 'short') {
    if (!date) return '—';
    const d = date instanceof Date ? date : new Date(date?.seconds ? date.seconds * 1000 : date);
    if (isNaN(d)) return '—';
    if (format === 'short') return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    if (format === 'long') return d.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    if (format === 'time') return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    if (format === 'datetime') return `${this.formatDate(d, 'short')}, ${this.formatDate(d, 'time')}`;
    if (format === 'relative') return this.timeAgo(d);
    return d.toLocaleDateString('en-IN');
  },

  timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = [
      { label: 'year', secs: 31536000 },
      { label: 'month', secs: 2592000 },
      { label: 'week', secs: 604800 },
      { label: 'day', secs: 86400 },
      { label: 'hour', secs: 3600 },
      { label: 'minute', secs: 60 },
    ];
    for (const { label, secs } of intervals) {
      const val = Math.floor(seconds / secs);
      if (val >= 1) return `${val} ${label}${val > 1 ? 's' : ''} ago`;
    }
    return 'just now';
  },

  formatCurrency(amount, currency = 'INR') {
    if (amount === null || amount === undefined) return '—';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, minimumFractionDigits: 0 }).format(amount);
  },

  formatNumber(num) {
    if (num === null || num === undefined) return '—';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toLocaleString('en-IN');
  },

  formatFileSize(bytes) {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  },

  // ── Strings ───────────────────────────────
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  titleCase(str) {
    if (!str) return '';
    return str.replace(/\b\w/g, c => c.toUpperCase());
  },

  truncate(str, max = 50) {
    if (!str || str.length <= max) return str;
    return str.substring(0, max) + '…';
  },

  initials(name) {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  },

  slugify(str) {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  },

  // ── Arrays ────────────────────────────────
  groupBy(arr, key) {
    return arr.reduce((groups, item) => {
      const val = item[key];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  },

  sortBy(arr, key, dir = 'asc') {
    return [...arr].sort((a, b) => {
      if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  },

  unique(arr, key) {
    if (key) {
      const seen = new Set();
      return arr.filter(item => {
        const val = item[key];
        if (seen.has(val)) return false;
        seen.add(val);
        return true;
      });
    }
    return [...new Set(arr)];
  },

  // ── Objects ───────────────────────────────
  deepClone(obj) { return JSON.parse(JSON.stringify(obj)); },

  pick(obj, keys) {
    return keys.reduce((acc, key) => {
      if (key in obj) acc[key] = obj[key];
      return acc;
    }, {});
  },

  omit(obj, keys) {
    return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)));
  },

  // ── DOM ───────────────────────────────────
  el(selector, parent = document) { return parent.querySelector(selector); },
  els(selector, parent = document) { return [...parent.querySelectorAll(selector)]; },

  createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else el.setAttribute(k, v);
    });
    children.forEach(child => {
      if (typeof child === 'string') el.insertAdjacentHTML('beforeend', child);
      else el.appendChild(child);
    });
    return el;
  },

  // ── Miscellaneous ─────────────────────────
  debounce(fn, delay = 300) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  throttle(fn, limit = 100) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  generateId(prefix = '') {
    return prefix + Math.random().toString(36).substring(2, 10).toUpperCase();
  },

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      ERPToast.show('Copied to clipboard!', 'success');
    });
  },

  downloadCSV(data, filename = 'export.csv') {
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  },

  printElement(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const w = window.open('', '_blank');
    w.document.write(`<html><head><title>Print</title></head><body>${el.innerHTML}</body></html>`);
    w.document.close(); w.print();
  },
};
