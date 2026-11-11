// node --test tests/ — the field_* tools on a stand-in for the OpenFieldStudio instance (public/app.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSiteAppTools, installSiteAppTools, type FieldApp } from '../src/site-app-tools.ts';

function fakeApp(): FieldApp & { saves: number; rendered: string[] } {
  let n = 0;
  const app: any = {
    saves: 0, rendered: [],
    project: { name: 'Lokaal project', number: 'P-1', client: '', surveyor: 'Sam', erpRef: null },
    contacts: [{ id: 'c1', name: 'Bouw BV', role: 'aannemer', company: 'Bouw BV' }],
    floorPlans: [{ id: 'fp1', name: 'Begane grond', data: 'data:image/png;base64,x' }, { id: 'fp2', name: 'Verdieping', data: 'data:image/png;base64,y' }],
    tickets: [
      { id: 't1', floorPlanId: 'fp1', label: 'Scheur in muur', description: 'Haarscheur', category: 'Bouwkundig', priority: 'high', severity: 'cosmetic',
        status: 'open', assignedTo: 'Bouw BV', deadline: '2000-01-01', x: 10, y: 20, photos: [{ name: 'a.jpg', data: 'data:...' }], comments: [], history: [] },
      { id: 't2', floorPlanId: 'fp2', label: 'Lekkende kraan', category: 'Sanitair', priority: 'low', severity: 'functional', status: 'completed', x: 5, y: 5 },
    ],
    inspections: [], handovers: [{ id: 'h1', type: 'first', date: '2026-11-01', status: 'in_progress', items: [{ ticketId: 't1', verdict: 'approved' }] }],
    checklistTemplates: [
      { id: 'tpl_a', name: 'Afvinken', category: 'X', items: [{ q: 'Dak dicht', type: 'check' }, { q: 'Druk', type: 'number', unit: 'bar' }, { q: 'Kleur', type: 'select', options: ['rood', 'blauw'] }] },
      { id: 'tpl_n', name: 'NEN', category: 'Y', scoring: 'nen2767', items: ['Gevel'] },
    ],
    activityLog: [], activeFloorPlanId: 'fp1', currentInspectionId: null,
    genId: () => `id_${++n}`,
    saveToLocalStorage() { app.saves++; },
    logActivity(text: string) { app.activityLog.push({ text, date: 'nu' }); },
    tFormat: (key: string, ...a: string[]) => `${key}:${a.join(',')}`,
    countDoneItems: (items: any[]) => items.filter(i => i.result || i.score || i.value).length,
    createInspection({ name, templateId, date, inspector, floorPlanId }: any) {
      const tpl = app.checklistTemplates.find((t: any) => t.id === templateId);
      const items = tpl ? tpl.items.map((it: any, i: number) => typeof it === 'object'
        ? { id: `item_${i}`, question: it.q, type: it.type, options: it.options ?? null, unit: it.unit ?? null, result: '', score: null, value: '', notes: '', photos: [] }
        : { id: `item_${i}`, question: it, type: tpl.scoring === 'nen2767' ? 'nen2767' : 'check', result: '', score: null, value: '', notes: '', photos: [] })
        : [{ id: 'item_0', question: 'Vrije observatie', type: 'check', result: '', score: null, value: '', notes: '', photos: [] }];
      const insp = { id: app.genId(), name, templateId: templateId || null, date, inspector, floorPlanId: floorPlanId || null, status: 'in_progress', items, notes: '' };
      app.inspections.push(insp); app.currentInspectionId = insp.id; app.saveToLocalStorage();
      return insp;
    },
    buildBCF: () => ({ blob: null, filename: 'x.bcfzip' }),
    generateFullReport: () => '<html></html>',
    generateHandoverReport: () => '<html></html>',
    renderPointsList() { app.rendered.push('points'); },
    loadProjectForm() { app.rendered.push('form'); },
    renderChecklistExecution() { throw new Error('no DOM'); },
  };
  return app;
}

test('installs with definitions, refuses unknown tools and bad arguments', async () => {
  const target: { __OPDS_APP__?: any } = {};
  installSiteAppTools(target);
  const names = await target.__OPDS_APP__.tools();
  assert.ok(names.length >= 6 && names.length <= 12);
  assert.ok(names.every((n: string) => n.startsWith('field_')));
  const tools = createSiteAppTools(() => fakeApp());
  assert.ok((await tools.definitions()).every(d => d.description && d.inputSchema));
  await assert.rejects(tools.run('field_nope'), /onbekende_tool/);
  await assert.rejects(tools.run('field_bevinding_toevoegen', {}), /ongeldig_argument: argumenten.label ontbreekt/);
  await assert.rejects(tools.run('field_bevinding_toevoegen', { label: 'x', status: 'klaar' }), /ongeldig_argument/);
  await assert.rejects(tools.run('field_stand', { extra: 1 }), /onbekend/);
  await assert.rejects(createSiteAppTools(() => undefined).run('field_stand'), /app_niet_klaar/);
});

test('stand and summary of a local project without ERPNext', async () => {
  const app = fakeApp();
  const tools = createSiteAppTools(() => app);
  const stand = await tools.run('field_stand') as any;
  assert.equal(stand.project.name, 'Lokaal project');
  assert.equal(stand.project.erpProject, null);
  assert.deepEqual(stand.counts.ticketsByStatus, { open: 1, completed: 1 });
  assert.equal(stand.counts.overdue, 1);
  assert.equal(stand.activeFloorPlan.name, 'Begane grond');
  const sum = await tools.run('field_samenvatting') as any;
  assert.equal(sum.tickets.total, 2);
  assert.deepEqual(sum.tickets.byAssignee, { 'Bouw BV': 1 });
  assert.equal(sum.tickets.photos, 1);
  assert.equal(sum.handovers[0].approved, 1);
  const project = await tools.run('field_project_bijwerken', { name: 'Nieuwbouw', city: 'Delft' }) as any;
  assert.equal(project.name, 'Nieuwbouw');
  assert.equal(app.project.city, 'Delft');
  assert.equal(app.project.number, 'P-1');
  assert.ok(app.rendered.includes('form'));
});

test('reads findings with filters and without photo data', async () => {
  const app = fakeApp();
  const tools = createSiteAppTools(() => app);
  const all = await tools.run('field_bevindingen') as any;
  assert.equal(all.total, 2);
  assert.equal(all.tickets[0].photos, 1);
  assert.ok(!JSON.stringify(all).includes('data:'));
  assert.equal((await tools.run('field_bevindingen', { floorPlan: 'verdieping' }) as any).tickets[0].id, 't2');
  assert.equal((await tools.run('field_bevindingen', { search: 'HAARSCHEUR' }) as any).total, 1);
  assert.equal((await tools.run('field_bevindingen', { overdue: true }) as any).tickets[0].id, 't1');
  assert.equal((await tools.run('field_bevindingen', { limit: 1, offset: 1 }) as any).tickets[0].id, 't2');
  assert.equal((await tools.run('field_bevindingen', { id: 't1' }) as any).photos[0].name, 'a.jpg');
  await assert.rejects(tools.run('field_bevindingen', { id: 'zz' }), /bevinding_onbekend/);
});

test('adds and changes a finding through the app state', async () => {
  const app = fakeApp();
  const tools = createSiteAppTools(() => app);
  const made = await tools.run('field_bevinding_toevoegen', { label: 'Kozijn klemt', category: 'Kozijnen', assignedTo: 'Bouw BV', floorPlan: 'fp2', x: 30, y: 40 }) as any;
  assert.deepEqual([made.floorPlan.id, made.x, made.y, made.status, made.priority], ['fp2', 30, 40, 'open', 'medium']);
  assert.equal(app.tickets.length, 3);
  assert.equal(app.tickets[2].history[0].action, 'Aangemaakt');
  assert.ok(app.saves > 0 && app.rendered.includes('points'));
  const plain = await tools.run('field_bevinding_toevoegen', { label: 'Zonder plek' }) as any;
  assert.deepEqual([plain.floorPlan.id, plain.x, plain.y], ['fp1', 50, 50]);
  const changed = await tools.run('field_bevinding_wijzigen', { id: 't1', status: 'assigned', description: 'Breder', comment: 'Gebeld' }) as any;
  assert.equal(changed.status, 'assigned');
  assert.equal(app.tickets[0].description, 'Breder');
  assert.equal(app.tickets[0].comments[0].author, 'Sam');
  assert.equal(app.tickets[0].label, 'Scheur in muur');
  await assert.rejects(tools.run('field_bevinding_wijzigen', { id: 't1', label: ' ' }), /label_leeg/);
  await assert.rejects(tools.run('field_bevinding_wijzigen', { id: 't1', floorPlan: 'Kelder' }), /plattegrond_onbekend/);
  await assert.rejects(tools.run('field_bevinding_wijzigen', { id: 't1', x: 120 }), /groter dan 100/);
});

test('starts an inspection and fills its checklist, all or nothing', async () => {
  const app = fakeApp();
  const tools = createSiteAppTools(() => app);
  const list = await tools.run('field_inspecties') as any;
  assert.deepEqual(list.templates.map((t: any) => t.id), ['tpl_a', 'tpl_n']);
  await assert.rejects(tools.run('field_inspectie_starten', { name: 'X', templateId: 'tpl_zz' }), /sjabloon_onbekend/);
  const insp = await tools.run('field_inspectie_starten', { name: 'Eindcontrole', templateId: 'tpl_a' }) as any;
  assert.equal(insp.inspector, 'Sam');
  assert.equal(insp.items.length, 3);
  await assert.rejects(tools.run('field_checklist_invullen', { inspectionId: insp.id, items: [{ index: 0, result: 'pass' }, { index: 1, result: 'pass' }] }), /geen_afvinkitem/);
  assert.equal(app.inspections[0].items[0].result, '');
  await assert.rejects(tools.run('field_checklist_invullen', { inspectionId: insp.id, items: [{ index: 2, value: 'groen' }] }), /keuze_onbekend/);
  const done = await tools.run('field_checklist_invullen', { inspectionId: insp.id, items: [
    { index: 0, result: 'fail', notes: 'Lek bij de goot' }, { id: 'item_1', value: '1.5' }, { index: 2, value: 'rood' }] }) as any;
  assert.deepEqual([done.done, done.failed], [3, 1]);
  const nen = await tools.run('field_inspectie_starten', { name: 'Conditie', templateId: 'tpl_n' }) as any;
  const scored = await tools.run('field_checklist_invullen', { inspectionId: nen.id, items: [{ index: 0, score: 4 }] }) as any;
  assert.equal(scored.nenAverage, 4);
  app.inspections[0].status = 'signed';
  await assert.rejects(tools.run('field_checklist_invullen', { inspectionId: insp.id, items: [{ index: 0, result: 'pass' }] }), /inspectie_ondertekend/);
});

test('export refuses what cannot be exported', async () => {
  const app = fakeApp();
  const tools = createSiteAppTools(() => app);
  await assert.rejects(tools.run('field_export', { type: 'oplevering' }), /handoverId_nodig/);
  await assert.rejects(tools.run('field_export', { type: 'oplevering', handoverId: 'hz' }), /oplevering_onbekend/);
  app.tickets = [];
  await assert.rejects(tools.run('field_export', { type: 'bcf' }), /geen_bevindingen/);
});
