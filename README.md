# Open Field Studio

**Inspection, Handover & Quality Assurance for Construction Projects**

Free, open-source tool for performing construction inspections, energy label surveys, monument inspections, handovers and quality assurance. Available as a desktop app (Windows, Linux), Android app, and web application.

![License](https://img.shields.io/badge/license-CC%20BY--SA%204.0-blue)
![Tauri](https://img.shields.io/badge/built%20with-Tauri%20v2-orange)
![i18next](https://img.shields.io/badge/i18n-i18next-green)

## Features

- **Tickets & defect registration** on floor plans with category, priority, status workflow and assignment
- **Checklist inspections** with 10 built-in templates (pass/fail and NEN 2767 condition scoring)
- **Energy label survey** — full NTA 8800 data collection in 43 items
- **Monument inspection** — construction, interior, moisture/damage, maintenance plan
- **Handover** with formal certificate, digital signatures and document attachments
- **Dashboard** with real-time statistics and charts
- **Camera integration** for on-site photo capture
- **4 languages** — Dutch, English, German, French (i18next)
- **Dark/Light theme** with system preference detection
- **Keyboard shortcuts** — Ctrl+S save, Ctrl+E export, Ctrl+O load, 1-8 tab switch
- **Native file dialogs** — save/open via OS dialogs (Tauri desktop)
- **Offline capable** — PDF.js bundled locally, no internet required
- **HTML reports** with save location picker
- **Cross-platform** — Windows, Linux, Android, Web

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [Rust](https://www.rust-lang.org/tools/install) >= 1.77
- Platform-specific dependencies (see below)

### Setup

```bash
# Clone the repository
git clone https://github.com/OpenAEC-Foundation/Open-Field-Studio.git
cd Open-Field-Studio

# Install dependencies
npm install
```

### Linux dependencies (Ubuntu/Debian)

```bash
sudo apt-get install -y libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

## Running

### Development

```bash
npm run tauri dev
```

Opens the app in development mode with hot-reload on port 3042.

### Web only (no Tauri)

```bash
npm run dev
```

Opens the web version at http://localhost:3042.

## Building

### Desktop (Windows/Linux)

```bash
npm run tauri build
```

Outputs:
- **Windows**: `src-tauri/target/release/bundle/nsis/Open Field Studio_*_x64-setup.exe`
- **Linux**: `src-tauri/target/release/bundle/deb/*.deb` and `*.AppImage`

### Android

```bash
npx tauri android init
npx tauri android build --apk --target aarch64
```

## Project Structure

```
Open-Field-Studio/
├── index.html              # Main application HTML
├── package.json            # Node.js config
├── vite.config.ts          # Vite bundler config
├── public/
│   ├── app.js              # Application logic (OpenFieldStudio class)
│   ├── styles.css          # Main stylesheet (OpenAEC design system)
│   ├── titlebar.css        # Custom titlebar & theme styles
│   ├── themes.css          # Dark/light theme CSS variables
│   ├── titlebar.js         # Window controls & platform detection
│   ├── pdf.min.js          # PDF.js (bundled offline)
│   ├── pdf.worker.min.js   # PDF.js worker (bundled offline)
│   └── icon_256.png        # Application icon
├── src/
│   ├── main.tsx            # Vite entry: i18next init, Tauri plugin setup
│   ├── i18n.ts             # i18next configuration
│   └── locales/
│       ├── nl.json         # Dutch translations (277 keys)
│       ├── en.json         # English translations
│       ├── de.json         # German translations
│       └── fr.json         # French translations
├── src-tauri/
│   ├── tauri.conf.json     # Tauri window, build, plugin config
│   ├── Cargo.toml          # Rust dependencies
│   ├── capabilities/       # Tauri permission config
│   ├── icons/              # App icons (all sizes)
│   └── src/
│       └── lib.rs          # Rust: plugins, window icon
└── .github/
    └── workflows/
        ├── ci.yml          # CI: build on push/PR
        ├── release.yml     # Release: Windows + Linux + Android
        └── auto-assign-issues.yml
```

## Checklist Templates

| Template | Items | Scoring |
|----------|-------|---------|
| Bouwkundige opname | 16 | Pass/fail |
| Installatie-inspectie | 16 | Pass/fail |
| Veiligheidsinspectie | 14 | Pass/fail |
| Oplevering voorinspectie | 16 | Pass/fail |
| Wkb-basiscontrole | 16 | Pass/fail |
| Energielabel - Volledige opname | 43 | NEN 2767 |
| Monument - Constructie & Schil | 18 | NEN 2767 |
| Monument - Historisch Interieur | 15 | NEN 2767 |
| Monument - Vocht & Schade | 18 | NEN 2767 |
| Monument - Instandhoudingsplan | 18 | NEN 2767 |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save project |
| `Ctrl+E` | Export as HTML |
| `Ctrl+O` | Load project (JSON) |
| `Ctrl+D` | Toggle dark/light theme |
| `1` - `8` | Switch tab |
| `Escape` | Close modals |

## Technology

- **[Tauri v2](https://v2.tauri.app/)** — Desktop & mobile framework
- **[Vite](https://vite.dev/)** — Frontend build tool
- **[i18next](https://www.i18next.com/)** — Internationalization (4 languages, 277 keys)
- **[PDF.js](https://mozilla.github.io/pdf.js/)** — PDF floor plan rendering (bundled offline)
- **Vanilla JavaScript** — No UI framework, lightweight
- **OpenAEC Foundation design system** — Construction amber, Space Grotesk typography

## Tauri Plugins

| Plugin | Purpose |
|--------|---------|
| `tauri-plugin-dialog` | Native save/open file dialogs |
| `tauri-plugin-fs` | File system read/write |
| `tauri-plugin-log` | Debug logging |

## Languages

| Language | Code | Status |
|----------|------|--------|
| Nederlands | NL | Complete (277 keys) |
| English | EN | Complete |
| Deutsch | DE | Complete |
| Fran&ccedil;ais | FR | Complete |

Language preference is auto-detected from the browser/OS and persisted in localStorage.

## License

CC BY-SA 4.0

## Links

- **Repository**: https://github.com/OpenAEC-Foundation/Open-Field-Studio
- **Issues**: https://github.com/OpenAEC-Foundation/Open-Field-Studio/issues
- **Organization**: https://github.com/OpenAEC-Foundation
