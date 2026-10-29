#!/usr/bin/env node
// Copy the OpenAEC Blueprint web package (design 0.4) into public/openaec/.
//
// Usage:  node scripts/sync-openaec.mjs ../OpenAEC-Blueprint
//
// - openaec-tokens.css, openaec-components.css, openaec-components.js and
//   openaec-fonts.css are copied unchanged (they are generated in the Blueprint
//   repository; never edit them here).
// - fonts/: only the WOFF2 files and the OFL licences. The TTF fallbacks named in
//   openaec-fonts.css are for browsers without WOFF2 and are left out on purpose.
// - icons/field-studio.svg: one sprite with exactly the B2 icons Field Studio uses,
//   taken symbol by symbol from the per-app sprites in web/icons/. Add an id to
//   ICONS below and run the script again.
import { execSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ICONS = [
  // Navigation
  'field.project', 'field.floorplans', 'bim.workspace', 'field.survey', 'field.inspections',
  'field.handovers', 'field.dashboard', 'file.export', 'integration.manage', 'ui.help',
  // Field actions
  'camera.capture', 'camera.open', 'camera.switch', 'draw.note', 'field.ticket-add', 'file.save', 'file.open',
  // Status
  'status.success', 'status.warning', 'status.error', 'status.pending', 'status.busy', 'status.info',
  'status.bridge-live', 'status.bridge-off', 'integration.platform-sync', 'planning.sync', 'location.select',
  // Shell
  'theme.light', 'theme.dark', 'image.contrast', 'ui.settings', 'ui.more', 'ui.close', 'ui.language',
  'view.zoom-in', 'view.zoom-out', 'view.fit', 'edit.delete', 'evidence.photo', 'energy.fetch-label',
  'window.minimize', 'window.maximize', 'window.restore', 'window.close',
];

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..');
const blueprint = resolve(process.argv[2] || join(repo, '..', 'OpenAEC-Blueprint'));
const web = join(blueprint, 'web');
if (!existsSync(join(web, 'openaec-tokens.css'))) {
  console.error(`No Blueprint web package in ${web}`);
  process.exit(1);
}
const out = join(repo, 'public', 'openaec');
mkdirSync(join(out, 'fonts'), { recursive: true });
mkdirSync(join(out, 'icons'), { recursive: true });

for (const f of ['openaec-tokens.css', 'openaec-components.css', 'openaec-components.js', 'openaec-fonts.css']) {
  copyFileSync(join(web, f), join(out, f));
}
for (const f of readdirSync(join(web, 'fonts'))) {
  if (f.endsWith('.woff2') || f.endsWith('-OFL.txt')) copyFileSync(join(web, 'fonts', f), join(out, 'fonts', f));
}

// Collect every <symbol> of every app sprite, first one wins (they are identical per id).
const symbols = new Map();
for (const f of readdirSync(join(web, 'icons')).filter(n => n.endsWith('.svg'))) {
  const svg = readFileSync(join(web, 'icons', f), 'utf8');
  for (const m of svg.matchAll(/<symbol id="(i(?:16|24)-[^"]+)"[\s\S]*?<\/symbol>/g)) {
    if (!symbols.has(m[1])) symbols.set(m[1], m[0]);
  }
}
const missing = [];
const parts = [];
for (const id of ICONS) {
  for (const size of ['i16', 'i24']) {
    const s = symbols.get(`${size}-${id}`);
    if (s) parts.push(s); else missing.push(`${size}-${id}`);
  }
}
if (missing.length) {
  console.error(`Missing in the Blueprint sprites: ${missing.join(', ')}`);
  process.exit(1);
}

let rev = 'unknown';
try { rev = execSync('git rev-parse --short HEAD', { cwd: blueprint }).toString().trim(); } catch { /* not a git checkout */ }
writeFileSync(join(out, 'icons', 'field-studio.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n` +
  `<!-- OpenAEC B2 icons for Open Field Studio: ${ICONS.length} icons in 16 and 24 px, copied from OpenAEC-Blueprint ${rev} web/icons by scripts/sync-openaec.mjs; do not edit. -->\n` +
  parts.join('\n') + '\n</svg>\n');
writeFileSync(join(out, 'VERSION'), `OpenAEC-Blueprint ${rev} web package (design 0.4)\n`);
console.log(`public/openaec updated from OpenAEC-Blueprint ${rev}: ${ICONS.length} icons.`);
