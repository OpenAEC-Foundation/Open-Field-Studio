#!/usr/bin/env node
// Screenshots for docs/schermen/: phone (390×844), tablet portrait (820×1180) and landscape
// (1180×820) as touch devices, and desktop (1440×900), each in the normal and the outdoor mode.
//
// Usage:  npm run dev            (in another terminal, serves http://localhost:3042)
//         node scripts/schermen.mjs
//
// Uses playwright-core with an installed Edge or Chrome (no browser download). Set BROWSER to
// the path of a Chromium-based browser if it is not found. The demo project is written to
// localStorage of the test browser only.
import { chromium } from 'playwright-core';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = process.env.OFS_URL || 'http://localhost:3042/';
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'schermen');
const CANDIDATES = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/microsoft-edge', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);
const executablePath = CANDIDATES.find(p => existsSync(p));
if (!executablePath) { console.error('No Edge/Chrome found; set BROWSER=/path/to/browser'); process.exit(1); }
mkdirSync(OUT, { recursive: true });

const DEVICES = {
  telefoon: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  tablet: { viewport: { width: 820, height: 1180 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  'tablet-liggend': { viewport: { width: 1180, height: 820 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 },
  desktop: { viewport: { width: 1440, height: 900 }, isMobile: false, hasTouch: false, deviceScaleFactor: 1 },
};

const selectPlan = async (p) => { await p.selectOption('#active-floor', 'fp1'); await p.waitForTimeout(300); };
const SCENES = {
  project: { tab: 'project' },
  opname: { tab: 'opname', after: selectPlan },
  inspectie: { tab: 'inspectie', after: async (p) => { await p.click('[data-click="inspection-open"]'); await p.waitForTimeout(300); } },
  notitie: { tab: 'opname', after: async (p) => { await p.click('[data-click="field-note"]'); await p.waitForTimeout(400); } },
  status: { tab: 'project', after: async (p) => { await p.click('#st-erp'); await p.waitForTimeout(300); } },
  weergave: { tab: 'project', after: async (p) => { await p.click('#view-settings-btn'); await p.waitForTimeout(300); } },
};

// [device, mode, scene, theme]
const SHOTS = [
  ['telefoon', 'buiten', 'project'], ['telefoon', 'buiten', 'opname'], ['telefoon', 'buiten', 'notitie'],
  ['telefoon', 'buiten', 'status'], ['telefoon', 'buiten', 'weergave'],
  ['telefoon', 'normaal', 'project'], ['telefoon', 'normaal', 'opname'],
  ['tablet', 'buiten', 'opname'], ['tablet', 'normaal', 'opname'],
  ['tablet', 'buiten', 'inspectie'], ['tablet', 'normaal', 'inspectie'],
  ['tablet-liggend', 'buiten', 'opname'], ['tablet-liggend', 'normaal', 'opname'],
  ['desktop', 'normaal', 'project'], ['desktop', 'normaal', 'opname'], ['desktop', 'normaal', 'status'],
  ['desktop', 'buiten', 'opname'], ['desktop', 'donker', 'opname', 'dark'],
];

async function seed(page, outdoor, theme) {
  await page.goto(BASE + 'openaec/VERSION', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ outdoor, theme }) => {
    const c = document.createElement('canvas'); c.width = 1200; c.height = 800;
    const g = c.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, 1200, 800);
    g.strokeStyle = '#222'; g.lineWidth = 8; g.strokeRect(60, 60, 1080, 680); g.lineWidth = 4;
    [[60, 400, 520, 400], [520, 60, 520, 740], [520, 300, 1140, 300], [820, 300, 820, 740]].forEach(([a, b, x, y]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(x, y); g.stroke(); });
    g.fillStyle = '#444'; g.font = '28px sans-serif';
    [['Woonkamer', 200, 240], ['Keuken', 220, 580], ['Slaapkamer', 760, 190], ['Badkamer', 600, 540], ['Hal', 940, 540]].forEach(([t, x, y]) => g.fillText(t, x, y));
    const now = Date.now();
    const data = {
      project: { name: 'Renovatie Damrak 1', number: 'DAM-2026-001', client: 'BouwCo BV', contactPerson: 'Jan Jansen', address: 'Damrak 1', postalCode: '1012LG', city: 'Amsterdam', surveyDate: '2026-10-29', surveyor: 'Martijn de Vries', description: 'Renovatie van het pand aan het Damrak.', notes: '', bagData: null,
        erpRef: { connector: 'erpnext', id: 'PROJ-0042', base: 'https://erp.voorbeeld.test', lastSyncAt: new Date(now - 40 * 60000).toISOString() } },
      contacts: [{ id: 'c1', name: 'Jan Jansen', role: 'Opdrachtgever', company: 'BouwCo BV' }, { id: 'c2', name: 'Marie de Wit', role: 'Uitvoerder', company: 'De Wit Bouw' }],
      floorPlans: [{ id: 'fp1', name: 'Begane grond', data: c.toDataURL('image/png'), type: 'image/png' }],
      tickets: [
        { id: 't1', floorPlanId: 'fp1', label: 'Scheur in kozijn', category: 'Kozijnen', priority: 'high', severity: 'structural', status: 'open', x: 30, y: 45, description: 'Verticale scheur naast het linker gevelkozijn.', assignedTo: 'De Wit Bouw', photos: [], comments: [], history: [] },
        { id: 't2', floorPlanId: 'fp1', label: 'Lekkage plafond badkamer', category: 'Sanitair', priority: 'medium', severity: 'functional', status: 'assigned', x: 58, y: 66, assignedTo: 'Slager Loodgieters', photos: [], comments: [], history: [] },
        { id: 't3', floorPlanId: 'fp1', label: 'Stopcontact defect', category: 'Elektra', priority: 'low', severity: 'cosmetic', status: 'completed', x: 75, y: 25, photos: [], comments: [], history: [] },
        { id: 't4', floorPlanId: 'fp1', label: 'Waarneming 10:12', category: 'Bouwkundig', priority: 'medium', severity: 'cosmetic', status: 'open', x: null, y: null, description: 'Voegwerk achtergevel los.', photos: [], comments: [], history: [] },
      ],
      inspections: [{ id: 'i1', name: 'Vooroplevering BG', type: 'checklist', floorPlanId: 'fp1', inspector: 'Martijn de Vries', date: '2026-10-29', status: 'in_progress', notes: '',
        items: [
          { question: 'Kozijnen afgesteld en sluiten goed', type: 'check', result: 'pass', notes: '' },
          { question: 'Kitvoegen sanitair compleet', type: 'check', result: 'fail', notes: 'Kitvoeg douche ontbreekt' },
          { question: 'Rookmelders geplaatst', type: 'check', result: '', notes: '' },
          { question: 'Afwerking wanden', type: 'select', options: ['Goed', 'Matig', 'Slecht'], value: 'Matig', notes: '' },
        ] }],
      handovers: [], checklistTemplates: [], activityLog: [],
    };
    localStorage.clear();
    localStorage.setItem('openFieldStudio', JSON.stringify(data));
    localStorage.setItem('ofs_lang', 'nl');
    localStorage.setItem('ofs_geo', 'on');
    localStorage.setItem('ofs_erp_pending', '1');
    localStorage.setItem('ofs_pub_erpnext_endpoint', 'https://erp.voorbeeld.test/api/resource/Project');
    localStorage.setItem('ofs_pub_erpnext_apikey', 'demo-key:demo-secret');
    localStorage.setItem('ofs_outdoor', outdoor ? 'on' : 'off');
    if (theme) localStorage.setItem('ofs_theme', theme);
  }, { outdoor, theme });
}

const browser = await chromium.launch({ executablePath, headless: true });
for (const [device, mode, scene, theme] of SHOTS) {
  const ctx = await browser.newContext({ ...DEVICES[device], locale: 'nl-NL' });
  const page = await ctx.newPage();
  await seed(page, mode === 'buiten', theme);
  const s = SCENES[scene];
  await page.goto(BASE + '?s=' + Date.now() + '#tab=' + s.tab, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  if (s.after) await s.after(page);
  const file = `${device}-${mode}-${scene}.png`;
  await page.screenshot({ path: join(OUT, file) });
  console.log('docs/schermen/' + file);
  await ctx.close();
}
await browser.close();
