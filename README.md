# Open Field Studio

**Inspection, Handover & Quality Assurance for Construction Projects**

Free, open-source tool for performing construction inspections, energy label surveys, monument inspections, handovers and quality assurance. Available as a desktop app (Windows, Linux), Android app, and web application.

![License](https://img.shields.io/badge/license-CC%20BY--SA%204.0-blue)
![Tauri](https://img.shields.io/badge/built%20with-Tauri%20v2-orange)
![i18next](https://img.shields.io/badge/i18n-i18next-green)

## Features

### Core inspection workflow
- **Tickets & defect registration** on floor plans with category, priority, status workflow and assignment
- **Checklist inspections** with 15 built-in templates (pass/fail and NEN 2767 condition scoring)
- **Energy label survey** — full NTA 8800 data collection in 43 items
- **Monument inspection** — construction, interior, moisture/damage, maintenance plan
- **Handover** with formal certificate, digital signatures and document attachments
- **Dashboard** with real-time statistics and charts

### 3D BIM
- **IFC viewer** (IFC 2x3 / IFC4) — Three.js + web-ifc WASM, orbit/pan/zoom, lazy-loaded on tab open

### Media & evidentiary data
- **Camera integration** for on-site photo capture with permission handling and mobile fallback
- **Photo metadata** — every photo carries capture timestamp + GPS coordinates (Wkb evidentiary value); shown in viewer and PDF report
- **IndexedDB blob store** — large binaries (photos, floor plans, signatures) live outside localStorage; quota effectively unlimited

### Dutch registers (NL BAG/Kadaster/RVO)
- **BAG address lookup** (Kadaster) — postcode + huisnummer → verified nummeraanduiding, verblijfsobject and pand IDs, stored on the project
- **EP-Online energy label** — one-click fetch from RVO's public register, colored badge in project and PDF

### Reports
- **PDF export** via native browser print with A4-optimized styles, print-color-adjust, page-break rules, photo captions with GPS/timestamp
- **HTML report** with save location picker
- **BCF 2.1 export** (buildingSMART) — interop with BIMcollab, Revit, Solibri; per-topic markup.bcf + photo snapshots

### Dossier publish / ERP connectors
Send a completed handover dossier to your existing back-office with one click. Same modal, connector-picker:
- **Woningborg WKI** — dossier + PvO to the Dutch home warranty registry
- **SWK** — Stichting Waarborgfonds Koopwoningen (identical dossier shape)
- **AFAS Profit** — KnSubject dossier item on the project
- **Exact Online** — Document + attachment linked to the project
- **n8n / generic webhook** — JSON POST for Zapier/Make/n8n/own relay
- **KYP Project** (planning) — separate project-scope flow that pushes open tickets as planning tasks

### UX & tech
- **Mobile responsive** — optimized layout for 6-inch phones (360–412px)
- **4 languages** — Dutch, English, German, French (i18next, ~350 keys)
- **Dark/Light theme** with system preference detection
- **Keyboard shortcuts** — Ctrl+S save, Ctrl+E export, Ctrl+O load, 1-8 tab switch
- **Native file dialogs** — save/open via OS dialogs (Tauri desktop)
- **Fully offline** — PDF.js, web-ifc WASM and fonts bundled locally, zero CDN calls
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

| Template | Items | Invoertypen |
|----------|-------|-------------|
| Bouwkundige opname | 16 | Check |
| Installatie-inspectie | 16 | Check |
| Veiligheidsinspectie | 14 | Check |
| Oplevering voorinspectie | 16 | Check + tekst (meterstanden) |
| Wkb-basiscontrole | 16 | Check |
| Vloerverwarming - Voorinspectie | 15 | Check + getal (kPa, °C, m²K/W) |
| Vloerverwarming - Druktest & Oplevering | 16 | Check + getal (kPa) + foto |
| Ventilatie - Kanaalwerk & Installatie | 14 | Check + keuze (ATC-klasse) + getal |
| Ventilatie - Inregelen & Oplevering | 16 | Check + getal (dm³/s, ppm, dB(A)) |
| Installatie - NEN 2767 Conditiemeting | 18 | NEN 2767 (1–6) |
| Energielabel - Volledige opname | 46 | Keuze + getal + tekst + foto + check |
| Monument - Constructie & Schil | 18 | NEN 2767 (1–6) |
| Monument - Historisch Interieur | 15 | NEN 2767 (1–6) |
| Monument - Vocht & Schade | 19 | NEN 2767 (1–6) + getal (mm) |
| Monument - Instandhoudingsplan | 18 | NEN 2767 (1–6) + getal (€) + check |

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
- **[i18next](https://www.i18next.com/)** — Internationalization (4 languages, ~350 keys)
- **[PDF.js](https://mozilla.github.io/pdf.js/)** — PDF floor plan rendering (bundled offline)
- **[Three.js](https://threejs.org/) + [web-ifc](https://github.com/ThatOpen/engine_web-ifc)** — 3D IFC BIM viewer (WASM, MIT-licensed)
- **IndexedDB** — Blob store for photos/floor plans/signatures (past the localStorage quota)
- **Vanilla JavaScript** — No UI framework, lightweight
- **System font stack** — Inter/Space Grotesk if installed, falls back to Segoe UI / San Francisco / Roboto (fully offline)

## Tauri Plugins

| Plugin | Purpose |
|--------|---------|
| `tauri-plugin-dialog` | Native save/open file dialogs |
| `tauri-plugin-fs` | File system read/write |
| `tauri-plugin-log` | Debug logging |

## Languages

| Language | Code | Status |
|----------|------|--------|
| Nederlands | NL | Complete (~352 keys) |
| English | EN | Complete |
| Deutsch | DE | Complete |
| Fran&ccedil;ais | FR | Complete |

Language preference is auto-detected from the browser/OS and persisted in localStorage.

## Changelog

### v0.3.0

Bidirectional connectors + own tab + in-app update notification.

**Nieuwe structuur**
- **"Koppelingen" is nu een aparte tab** — niet meer onder Export, want koppelingen zijn een primaire feature (configureren én ophalen van data).

**Bidirectionele integraties** — trek klantgegevens en tekeningen op vanuit een geconfigureerde koppeling:
- **ERPNext (Frappe)** — Customer + Contacts (via Dynamic Link) + Addresses + Files, met picker en apply-checkboxes. PDF-tekeningen worden via pdf.js gerasterd naar plattegronden.
- **n8n / generieke webhook** — GET je eigen endpoint dat een `{ project, contacts, floorPlans }` envelope teruggeeft. Werkt met elk systeem waar je een n8n-workflow voor kunt bouwen.
- Contact-dedup op email (of naam+bedrijf) — re-importeren verdubbelt niets meer.
- Same-origin auth-gate: API-tokens worden nooit meegestuurd naar third-party URLs (S3/CDN/attacker).

**In-app update-notificatie**
- Badge naast versielabel in titlebar zodra een nieuwere GitHub Release beschikbaar is.
- Werkt via `api.github.com/repos/.../releases/latest` — geen signer-keys of Tauri-updater-plugin nodig, silent-fail bij offline/dev, 6u localStorage-cache.

**Security-hardening**
- XSS-guard in `renderFloorPlansList` — `fp.name` wordt escaped, `fp.data` gevalideerd tegen strict data-URL regex (blokkeert attribute-breakout via hostile connector-payload).
- `_httpJsonGet` toont Frappe/backend error-body in de UI ("Import mislukt: HTTP 417 — Invalid filter …") ipv losse HTTP-status.

**Housekeeping**
- ~40 nieuwe i18n-keys × 4 talen (import_*, update_*, connector_bidirectional, nav_koppelingen).

### v0.2.1

- **ERPNext (Frappe)** — 6th publish-connector; REST + dual auth (`api-key:api-secret` triggers Frappe `token` header, else OAuth Bearer).
- **Bouw7** — 7th publish-connector for the Dutch construction ERP; dossier attached as document with `projectReference`.
- **Koppelingen panel** on the export tab — all 8 connectors are now discoverable and configurable without needing a completed handover; "Set up / Not set up" badges + config-only modal that just stores endpoint + API key.
- **Version label** now injected from `package.json` at build time (`__APP_VERSION__` via Vite `define`); titlebar can no longer drift out of sync.
- **CI change**: pushes to `main` no longer trigger the multi-platform Tauri build. Production installers are cut by `release.yml`, triggered by publishing a GitHub Release (tag `v*`) or via workflow_dispatch. PR builds still run as a pre-merge sanity check.

### v0.2.0

Major expansion — Wkb-bewijskracht + BIM + Dutch registries + ERP publish.

**Dutch registers**
- **BAG address lookup** — postcode + huisnummer → verified nummeraanduiding / verblijfsobject / pand IDs, stored on the project and printed in the report.
- **EP-Online energy label** — one-click fetch from RVO's public register once BAG has an addressable-object ID; colored A–G badge in project + report.

**Media & storage**
- **IndexedDB blob store** — photos, floor plans and signatures moved out of localStorage; effectively unlimited quota.
- **Photo metadata** — every new photo carries capture timestamp + GPS coordinates (Wkb evidentiary value). Shown in photo viewer (with Google Maps link) and in PDF report captions.

**Reports & interop**
- **Real PDF export** via native browser print, A4-optimized styles, print-color-adjust, page-break rules per section/ticket/table/signature.
- **BCF 2.1 export** (buildingSMART ZIP) — inline STORE-ZIP writer (no dep); per-topic markup.bcf + photo snapshots; importable in BIMcollab, Revit, Solibri.
- **3D BIM viewer** — new "3D BIM" tab with IFC upload (Three.js + web-ifc WASM, lazy-loaded); orbit / pan / zoom; auto-frames the model.

**Dossier publish / ERP connectors**
- Generic `PublishConnector`-registry with one modal for six destinations:
  - **Woningborg WKI** (dossier + PvO)
  - **SWK** (Stichting Waarborgfonds Koopwoningen)
  - **AFAS Profit** (KnSubject UpdateConnector)
  - **Exact Online** (Document + attachment)
  - **n8n / generic webhook** (JSON POST)
  - **KYP Project** (project-scope — open tickets pushed as planning tasks)
- Every connector: configurable endpoint, per-connector API key, test-mode that validates the payload without sending.

**Housekeeping**
- **Offline fonts** — Google Fonts CDN removed everywhere; system font stack (Inter/Space Grotesk if installed, fallback to Segoe UI / San Francisco / Roboto). Zero network requests on load.
- **SVG icon bug fix** — `applyLanguage()` no longer wipes SVG children when relabeling buttons.
- **~350 i18n keys** across NL/EN/DE/FR (from 277).
- **New dependencies**: `three`, `web-ifc`, `@thatopen/components`.

### v0.1.3

- **Getypte checklist items** — elk template-item heeft nu het juiste invoertype: `check` (✓/✗/-), `select` (keuzechips), `number` (getal met eenheid), `text` (tekstveld), `photo` (camera + upload), `nen2767` (1–6 schaal)
- **Energielabel template verbeterd** — woningtype als keuzechips, bouwjaar/oppervlak als getalvelden, ketel/installaties als tekstvelden, fotodocumentatie als fotovelden
- **Ventilatie inregelen** — debieten per ruimte (dm³/s), CO₂-meting (ppm), geluidswaarden (dB(A)) als meetvelden met eenheid
- **Vloerverwarming** — druktestwaarden (kPa) en aanvoertemperatuur (°C) als meetvelden
- **Ventilatie installatie** — luchtdichtheidsklasse als keuze (ATC2/3/4/5), geluidsniveau als meetveld
- **Monument & NEN 2767** — scheurwijdte als mm-meetveld, onderhoudsinplan kosten als €-velden
- **Voortgangsteller** — telt nu correct per itemtype: check op resultaat, number/select/text op ingevulde waarde, photo op aanwezige foto's

### v0.1.2

- **Camera permissie fix voor Android APK** — app-specifieke foutmeldingen ("Ga naar Instellingen > Apps > Rechten > Camera") in plaats van browser-instructies
- **CAMERA permissie in AndroidManifest.xml** — APK vraagt nu correct camera-toegang aan

### v0.1.1

- **5 new installer templates** — floor heating (pre-inspection, pressure test & handover), ventilation (ductwork & installation, commissioning & handover), NEN 2767 condition assessment for building services
- **Interactive checklist items** — items with multiple-choice options (e.g. housing type) render as tappable chips; `[FOTO]` items show inline camera/upload buttons per item
- **Mobile responsive** — new 480px breakpoint for 6-inch phones: single-column layouts, stacked filters, larger touch targets
- **Camera permission fix** — specific error messages for denied/blocked camera on Android, permission pre-check, `capture="environment"` fallback for direct mobile camera access

### v0.1.0

- Initial release with 10 checklist templates, 4-language support, Tauri desktop/Android builds

## License

CC BY-SA 4.0

## Links

- **Repository**: https://github.com/OpenAEC-Foundation/Open-Field-Studio
- **Issues**: https://github.com/OpenAEC-Foundation/Open-Field-Studio/issues
- **Organization**: https://github.com/OpenAEC-Foundation
