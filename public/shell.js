// =====================================================
// Open Field Studio - shell behaviour (was an inline <script> in index.html)
// Language menu, outdoor switch, keyboard shortcuts, online/offline.
// No inline handlers anywhere: the app works under a CSP without 'unsafe-inline'.
// =====================================================
(function () {
  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    // ---------- Outdoor switch in the app bar ----------
    var outdoorBtn = document.getElementById('outdoor-toggle');
    function syncDisplayControls() {
      var s = window.ofsDisplay ? window.ofsDisplay.get() : { outdoor: false, theme: 'light', density: 'auto' };
      if (outdoorBtn) outdoorBtn.setAttribute('aria-pressed', s.outdoor ? 'true' : 'false');
      var vo = document.getElementById('view-outdoor'); if (vo) vo.checked = s.outdoor;
      var vt = document.getElementById('view-theme'); if (vt) vt.value = s.theme;
      var vd = document.getElementById('view-density'); if (vd) vd.value = s.density;
    }
    if (outdoorBtn) outdoorBtn.addEventListener('click', function () {
      if (window.ofsDisplay) window.ofsDisplay.toggleOutdoor();
    });
    document.addEventListener('ofs-display-change', syncDisplayControls);
    syncDisplayControls();

    // ---------- Language menu ----------
    var langToggle = document.getElementById('tb-lang-toggle');
    var langMenu = document.getElementById('tb-lang-menu');
    var langCurrent = document.getElementById('tb-lang-current');
    var savedLang = 'nl';
    try { savedLang = localStorage.getItem('ofs_lang') || 'nl'; } catch (e) { /* ignore */ }

    function closeLangMenu() {
      langMenu.classList.remove('open');
      langToggle.classList.remove('open');
      langToggle.setAttribute('aria-expanded', 'false');
    }
    window._setActiveLang = function (lang) {
      langCurrent.textContent = lang.toUpperCase();
      document.querySelectorAll('.tb-lang-option').forEach(function (btn) {
        var on = btn.dataset.lang === lang;
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-checked', on ? 'true' : 'false');
      });
    };
    window._setActiveLang(savedLang);

    langToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = langMenu.classList.toggle('open');
      langToggle.classList.toggle('open', isOpen);
      langToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.querySelectorAll('.tb-lang-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = this.dataset.lang;
        if (window.app) window.app.setLanguage(lang);
        window._setActiveLang(lang);
        closeLangMenu();
      });
    });
    document.addEventListener('click', closeLangMenu);

    // ---------- Ticket filters: always open on wide screens, a disclosure on narrow ones ----------
    var filterBox = document.getElementById('ticket-filter-box');
    if (filterBox && window.matchMedia) {
      var wide = window.matchMedia('(min-width: 1100px)');
      var syncFilters = function () { if (wide.matches) filterBox.open = true; };
      if (wide.addEventListener) wide.addEventListener('change', syncFilters); else if (wide.addListener) wide.addListener(syncFilters);
      syncFilters();
    }

    // ---------- Online / offline ----------
    function netChanged() { if (window.app && window.app.onNetworkChange) window.app.onNetworkChange(); }
    window.addEventListener('online', netChanged);
    window.addEventListener('offline', netChanged);

    // ---------- Keyboard shortcuts ----------
    document.addEventListener('keydown', function (e) {
      var tag = document.activeElement && document.activeElement.tagName;
      var isInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            if (window.app) window.app.saveProject();
            break;
          case 'e':
            if (!isInput) { e.preventDefault(); if (window.app) window.app.exportHTML(); }
            break;
          case 'o':
            e.preventDefault();
            document.getElementById('load-json-input').click();
            break;
          case 'd':
            if (!isInput) { e.preventDefault(); if (window.ofsDisplay) window.ofsDisplay.toggleLightDark(); }
            break;
        }
      }

      // Number keys 1-8 for tab switching (no modifier, not in input)
      if (!isInput && !e.ctrlKey && !e.altKey && !e.metaKey) {
        var tabs = ['project', 'plattegrond', 'opname', 'inspectie', 'oplevering', 'dashboard', 'export', 'handleiding'];
        var num = parseInt(e.key, 10);
        if (num >= 1 && num <= 8 && window.app) window.app.switchTab(tabs[num - 1]);
      }
    });
  });
})();
