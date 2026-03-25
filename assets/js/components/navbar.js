// ============================================
// UNIBOLT ERP — NAVBAR COMPONENT
// ============================================

const ERPNavbar = (() => {
  function render() {
    const user = ERPAuth.getCurrentUser();
    if (!user) return;

    // Update user info in topbar/sidebar
    const nameEls = document.querySelectorAll('[data-user-name]');
    nameEls.forEach(el => el.textContent = user.displayName || 'User');

    const roleEls = document.querySelectorAll('[data-user-role]');
    roleEls.forEach(el => el.textContent = ERPHelpers.titleCase(user.role || 'Student'));

    const avatarEls = document.querySelectorAll('[data-user-avatar]');
    avatarEls.forEach(el => {
      if (user.photoURL) {
        el.innerHTML = `<img src="${user.photoURL}" alt="${user.displayName}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
      } else {
        el.textContent = ERPHelpers.initials(user.displayName);
      }
    });
  }

  function initSearch() {
    const input = document.getElementById('globalSearch');
    if (!input) return;

    const debouncedSearch = ERPHelpers.debounce(async (query) => {
      if (query.length < 2) {
        hideSearchResults();
        return;
      }
      await performSearch(query);
    }, 300);

    input.addEventListener('input', (e) => debouncedSearch(e.target.value));
    input.addEventListener('blur', () => setTimeout(hideSearchResults, 200));
  }

  async function performSearch(query) {
    // Search across students, faculty, courses
    const lowerQuery = query.toLowerCase();
    const results = [];

    try {
      // Search students
      const studentSnap = await db.collection(ERPConstants.COLLECTIONS.STUDENTS)
        .orderBy('name').startAt(query).endAt(query + '\uf8ff').limit(5).get();
      studentSnap.forEach(doc => {
        results.push({ type: 'Student', ...doc.data(), id: doc.id, icon: '👨‍🎓', route: `student-profile?id=${doc.id}` });
      });
    } catch (e) { /* ignore */ }

    showSearchResults(results, query);
  }

  function showSearchResults(results, query) {
    let container = document.getElementById('searchResults');
    if (!container) {
      container = document.createElement('div');
      container.id = 'searchResults';
      container.className = 'search-results';
      const searchWrapper = document.querySelector('.topbar-search');
      if (searchWrapper) { searchWrapper.style.position = 'relative'; searchWrapper.appendChild(container); }
    }

    if (!results.length) {
      container.innerHTML = `<div class="p-4 text-center" style="color:var(--text-muted);font-size:0.875rem;">No results for "${query}"</div>`;
      container.style.display = 'block';
      return;
    }

    const grouped = ERPHelpers.groupBy(results, 'type');
    container.innerHTML = Object.entries(grouped).map(([type, items]) => `
      <div class="search-result-group-title">${type}s</div>
      ${items.map(item => `
        <a href="#${item.route}" class="search-result-item">
          <div class="search-result-icon">${item.icon}</div>
          <div class="search-result-info">
            <div class="search-result-title">${item.name || item.title}</div>
            <div class="search-result-sub">${item.rollNumber || item.department || ''}</div>
          </div>
          <span class="search-result-type">${type}</span>
        </a>
      `).join('')}
    `).join('');
    container.style.display = 'block';
  }

  function hideSearchResults() {
    const container = document.getElementById('searchResults');
    if (container) container.style.display = 'none';
  }

  function init() {
    ERPAuth.onAuthChange(render);
    initSearch();
  }

  return { init, render };
})();
