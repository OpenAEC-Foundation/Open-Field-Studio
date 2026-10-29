// =====================================================
// Open Field Studio - display settings (theme, density, outdoor mode)
// Loaded in <head> without defer so the right theme is set before the first paint.
//
// - Theme: one of the five OpenAEC Blueprint themes (data-oa-theme).
// - Outdoor ("Buiten"): the Blueprint theme High contrast light, large text and
//   touch targets. Default on phones and tablets (coarse pointer) until the user
//   switches it off; one button in the app bar.
// - Density: "touch" (48 px targets, 16 px text) or "compact" (Blueprint desktop
//   sizes). "auto" picks touch on a coarse pointer.
// =====================================================
(function () {
  var THEMES = ['light', 'dark', 'blueprint', 'high-contrast-light', 'high-contrast-dark'];
  var root = document.documentElement;

  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function write(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* private mode */ } }
  function coarse() { return !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches); }

  function state() {
    var theme = read('ofs_theme');
    if (THEMES.indexOf(theme) < 0) theme = 'light';
    var outdoorPref = read('ofs_outdoor');
    var outdoor = outdoorPref === 'on' || (outdoorPref !== 'off' && coarse());
    var density = read('ofs_density');
    if (density !== 'touch' && density !== 'compact') density = 'auto';
    var touch = outdoor || density === 'touch' || (density === 'auto' && coarse());
    return { theme: theme, outdoor: outdoor, density: density, touch: touch };
  }

  function apply() {
    var s = state();
    root.setAttribute('data-oa-theme', s.outdoor ? 'high-contrast-light' : s.theme);
    root.setAttribute('data-ofs-density', s.touch ? 'touch' : 'compact');
    if (s.outdoor) root.setAttribute('data-ofs-outdoor', ''); else root.removeAttribute('data-ofs-outdoor');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', s.outdoor || s.theme === 'light' || s.theme === 'high-contrast-light' ? '#FFFFFF' : '#2A2A32');
    try { document.dispatchEvent(new CustomEvent('ofs-display-change', { detail: s })); } catch (e) { /* old webview */ }
    return s;
  }

  window.ofsDisplay = {
    themes: THEMES,
    get: state,
    apply: apply,
    setTheme: function (theme) { if (THEMES.indexOf(theme) >= 0) { write('ofs_theme', theme); } return apply(); },
    setOutdoor: function (on) { write('ofs_outdoor', on ? 'on' : 'off'); return apply(); },
    toggleOutdoor: function () { return this.setOutdoor(!state().outdoor); },
    setDensity: function (density) { write('ofs_density', density); return apply(); },
    // Ctrl+D: light <-> dark (outdoor mode is switched off, the user asked for a normal theme)
    toggleLightDark: function () {
      var s = state();
      write('ofs_outdoor', 'off');
      write('ofs_theme', s.theme === 'dark' ? 'light' : 'dark');
      return apply();
    }
  };

  apply();
  if (window.matchMedia) {
    var mq = window.matchMedia('(pointer: coarse)');
    var onChange = function () { apply(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange); else if (mq.addListener) mq.addListener(onChange);
  }
})();
