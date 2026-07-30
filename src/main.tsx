// Tauri + Open Field Studio
// Initialize i18next, then start the app immediately, load plugins in background

import i18next from './i18n';

// __APP_VERSION__ is injected by Vite at build time from package.json.
declare const __APP_VERSION__: string;

// Expose i18next globally
(window as any).i18next = i18next;

// Keep the title-bar version label in sync with package.json.
(function syncVersionLabel() {
  const set = () => {
    const el = document.querySelector('.title-bar-version');
    if (el) el.textContent = 'v' + __APP_VERSION__;
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', set);
  else set();
})();

// Lazy-load the IFC viewer only when the user opens the BIM tab (heavy — three.js + web-ifc WASM).
(window as any).__ofsLoadIfcViewer = () => import('./ifc-viewer.ts');

// Expose Tauri plugin APIs globally for app.js (non-blocking)
function exposeTauriPlugins() {
  import('@tauri-apps/plugin-dialog').then(dialog => {
    (window as any).__tauriDialog = { save: dialog.save, open: dialog.open, ask: dialog.ask };
  }).catch(() => {});
  import('@tauri-apps/plugin-fs').then(fs => {
    (window as any).__tauriFs = { writeTextFile: fs.writeTextFile, readTextFile: fs.readTextFile };
  }).catch(() => {});
}

// Initialize the app
function initApp() {
  const OFS = (window as any).OpenFieldStudio;
  if (!OFS) return;

  // Create app instance immediately (so onclick="app.xxx" works)
  const app = new OFS();
  (window as any).app = app;

  // Load Tauri plugins in background (non-blocking)
  exposeTauriPlugins();

  // Sync language with i18next detection
  const detectedLang = i18next.language?.substring(0, 2) || 'nl';
  const supportedLangs = ['nl', 'en', 'de', 'fr'];
  const activeLang = supportedLangs.includes(detectedLang) ? detectedLang : 'nl';

  if (activeLang !== app.lang) {
    app.setLanguage(activeLang);
  }
  if ((window as any)._setActiveLang) {
    (window as any)._setActiveLang(activeLang);
  }

  // Patch setLanguage to sync titlebar dropdown
  const origSetLang = app.setLanguage.bind(app);
  app.setLanguage = (lang: string) => {
    origSetLang(lang);
    if ((window as any)._setActiveLang) {
      (window as any)._setActiveLang(lang);
    }
  };
}

if (i18next.isInitialized) {
  initApp();
} else {
  i18next.on('initialized', () => initApp());
}
