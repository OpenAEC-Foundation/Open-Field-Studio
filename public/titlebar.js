// =====================================================
// Open Field Studio - Custom Title Bar Controller
// Platform detection: desktop Tauri / Android Tauri / Web
// =====================================================

(function () {
  var isMaximized = false;
  var appWindow = null;

  var maximizeSvg = '<svg width="10" height="10" viewBox="0 0 10 10"><rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
  var restoreSvg = '<svg width="10" height="10" viewBox="2 2 12 12" fill="currentColor"><path d="M5.08496 4C5.29088 3.4174 5.8465 3 6.49961 3H9.99961C11.6565 3 12.9996 4.34315 12.9996 6V9.5C12.9996 10.1531 12.5822 10.7087 11.9996 10.9146V6C11.9996 4.89543 11.1042 4 9.99961 4H5.08496ZM4.5 5H9.5C10.3284 5 11 5.67157 11 6.5V11.5C11 12.3284 10.3284 13 9.5 13H4.5C3.67157 13 3 12.3284 3 11.5V6.5C3 5.67157 3.67157 5 4.5 5ZM4.5 6C4.22386 6 4 6.22386 4 6.5V11.5C4 11.7761 4.22386 12 4.5 12H9.5C9.77614 12 10 11.7761 10 11.5V6.5C10 6.22386 9.77614 6 9.5 6H4.5Z"/></svg>';

  function isTauriDesktop() {
    if (!window.__TAURI__) return false;
    // Check if NOT on mobile (Android/iOS)
    var ua = navigator.userAgent;
    if (/Android|iPhone|iPad|iPod/i.test(ua)) return false;
    return true;
  }

  function isTauriMobile() {
    if (!window.__TAURI__) return false;
    var ua = navigator.userAgent;
    return /Android|iPhone|iPad|iPod/i.test(ua);
  }

  function updateMaximizeButton() {
    var btn = document.getElementById('tb-maximize');
    if (!btn) return;
    btn.innerHTML = isMaximized ? restoreSvg : maximizeSvg;
    btn.title = isMaximized ? 'Herstellen' : 'Maximaliseren';
  }

  function getAppWindow() {
    if (appWindow) return appWindow;
    try {
      if (window.__TAURI__ && window.__TAURI__.window) {
        appWindow = window.__TAURI__.window.getCurrentWindow();
        return appWindow;
      }
    } catch (e) { /* ignore */ }
    return null;
  }

  function detectPlatform() {
    if (isTauriDesktop()) {
      // Desktop Tauri: show custom titlebar
      document.body.classList.add('tauri-desktop');
    } else if (isTauriMobile()) {
      // Android/iOS Tauri: no titlebar, add safe-area class
      document.body.classList.add('tauri-mobile');
    } else {
      // Web browser: no titlebar
      document.body.classList.add('platform-web');
    }
  }

  async function initTitleBar() {
    detectPlatform();

    if (!isTauriDesktop()) return;

    var win = getAppWindow();
    if (!win) return;

    try {
      isMaximized = await win.isMaximized();
      updateMaximizeButton();
    } catch (e) { /* ignore */ }

    try {
      await win.onResized(async function () {
        try {
          isMaximized = await win.isMaximized();
          updateMaximizeButton();
        } catch (e) { /* ignore */ }
      });
    } catch (e) { /* ignore */ }

    document.getElementById('tb-minimize').addEventListener('click', function () {
      var w = getAppWindow();
      if (w) w.minimize();
    });

    document.getElementById('tb-maximize').addEventListener('click', function () {
      var w = getAppWindow();
      if (w) w.toggleMaximize();
    });

    document.getElementById('tb-close').addEventListener('click', function () {
      var w = getAppWindow();
      if (w) w.close();
    });

    document.querySelector('.title-bar').addEventListener('dblclick', function (e) {
      if (e.target.closest('.window-controls') || e.target.closest('.tb-lang-dropdown')) return;
      var w = getAppWindow();
      if (w) w.toggleMaximize();
    });
  }

  function tryInit() {
    if (window.__TAURI__) {
      initTitleBar();
    } else {
      // Not Tauri — web browser. Still detect platform.
      setTimeout(function () {
        detectPlatform();
        initTitleBar();
      }, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    tryInit();
  }
})();
