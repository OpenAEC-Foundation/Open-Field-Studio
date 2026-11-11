/**
 * The `field_*` tools for the assistant of OpenAEC SuperCloud (browser build only, `window.__OPDS_APP__`).
 *
 * The site sends the tool calls of its assistant through its bridge to this interface in the frame of the application.
 * The tools work on the state of the running app (`window.app`, the OpenFieldStudio instance in public/app.js) and its
 * own methods, never on the form fields; after a change the app renders and saves as after an edit by the user. A
 * project without ERPNext (a local project) works the same. Opening and saving stay with the user (host contract);
 * exports are downloads, which the site catches. No network, no popups, no messages to other windows.
 *
 * Contract: OpenAEC-Blueprint docs/supercloud-koppeling.md. An error is `throw new Error("short_code: ...")`.
 */
import definitions from './site-app-tools.json' with { type: 'json' };

export interface SiteAppToolDefinition { name: string; description: string; inputSchema: object }
export interface SiteAppTools {
  tools(): Promise<string[]>;
  definitions(): Promise<SiteAppToolDefinition[]>;
  run(name: string, args?: Record<string, unknown>): Promise<unknown>;
}

type Args = Record<string, unknown>;
type Row = Record<string, any>;

/** The part of the OpenFieldStudio instance the tools use; everything the app renders is optional. */
export interface FieldApp {
  project: Row;
  contacts: Row[];
  floorPlans: Row[];
  tickets: Row[];
  inspections: Row[];
  handovers: Row[];
  checklistTemplates: Row[];
  activityLog: Row[];
  activeFloorPlanId: string | null;
  currentInspectionId: string | null;
  genId(): string;
  saveToLocalStorage(): void;
  logActivity(text: string): void;
  tFormat(key: string, ...args: string[]): string;
  countDoneItems(items: Row[]): number;
  createInspection(options: Row): Row;
  buildBCF(): { blob: Blob; filename: string };
  generateFullReport(): string;
  generateHandoverReport(id: string): string;
  [method: string]: any;
}

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
/** A tool answer goes into the context of a model; a bigger answer has to be narrowed down. */
const MAX_RESULT_CHARS = 30000;
const TICKET_FIELDS = ['label', 'description', 'category', 'priority', 'severity', 'status', 'assignedTo', 'deadline'] as const;
const PROJECT_FIELDS = ['name', 'number', 'client', 'contactPerson', 'address', 'postalCode', 'city', 'surveyDate', 'surveyor', 'description', 'notes'] as const;

const today = () => new Date().toISOString().split('T')[0];

/** Call a method of the app that only renders; the state is already right, so a missing element is no failure. */
function render(app: FieldApp, method: string, ...args: unknown[]) {
  try { if (typeof app[method] === 'function') app[method](...args); } catch { /* the screen catches up on the next render */ }
}

function floorPlanOf(app: FieldApp, ref: unknown): Row {
  const plan = app.floorPlans.find(fp => fp.id === ref) ?? app.floorPlans.find(fp => String(fp.name ?? '').toLowerCase() === String(ref).toLowerCase());
  if (!plan) throw new Error(`plattegrond_onbekend: ${ref}`);
  return plan;
}

function ticketOf(app: FieldApp, id: unknown): Row {
  const ticket = app.tickets.find(t => t.id === id);
  if (!ticket) throw new Error(`bevinding_onbekend: ${id}`);
  return ticket;
}

function inspectionOf(app: FieldApp, id: unknown): Row {
  const insp = app.inspections.find(i => i.id === id);
  if (!insp) throw new Error(`inspectie_onbekend: ${id}`);
  return insp;
}

function isOverdue(t: Row, day = today()) {
  return Boolean(t.deadline) && t.deadline < day && t.status !== 'verified' && t.status !== 'archived';
}

/** A ticket without photo data and without the long lists. */
function ticketSummary(app: FieldApp, t: Row) {
  const plan = app.floorPlans.find(fp => fp.id === t.floorPlanId);
  return { id: t.id, label: t.label, description: t.description || undefined, category: t.category, priority: t.priority, severity: t.severity,
    status: t.status, assignedTo: t.assignedTo || undefined, deadline: t.deadline || undefined, overdue: isOverdue(t) || undefined,
    floorPlan: plan ? { id: plan.id, name: plan.name } : null, x: t.x, y: t.y, photos: t.photos?.length || 0, comments: t.comments?.length || 0,
    createdAt: t.createdAt };
}

function countBy(rows: Row[], key: (row: Row) => string | undefined) {
  const counts: Record<string, number> = {};
  for (const row of rows) { const k = key(row); if (k) counts[k] = (counts[k] ?? 0) + 1; }
  return counts;
}

function inspectionSummary(app: FieldApp, insp: Row) {
  const scored = insp.items.filter((i: Row) => i.type === 'nen2767' && i.score);
  return { id: insp.id, name: insp.name, date: insp.date, inspector: insp.inspector, templateId: insp.templateId, status: insp.status,
    scoring: insp.scoring || undefined, items: insp.items.length, done: app.countDoneItems(insp.items),
    failed: insp.items.filter((i: Row) => i.result === 'fail').length,
    nenAverage: scored.length ? Number((scored.reduce((a: number, i: Row) => a + i.score, 0) / scored.length).toFixed(1)) : undefined };
}

function activeTab(): string | null {
  try { return (document.querySelector('.nav-btn.active') as HTMLElement | null)?.dataset.tab ?? null; } catch { return null; }
}

function projectInfo(app: FieldApp) {
  const p = app.project;
  return { ...Object.fromEntries(PROJECT_FIELDS.map(key => [key, p[key] || ''])),
    erpProject: p.erpRef ? { id: p.erpRef.id, connector: p.erpRef.connector } : null,
    energyLabel: p.energyLabel?.label ?? null };
}

function stand(app: FieldApp) {
  const plan = app.floorPlans.find(fp => fp.id === app.activeFloorPlanId);
  const insp = app.inspections.find(i => i.id === app.currentInspectionId);
  return { project: projectInfo(app),
    counts: { tickets: app.tickets.length, ticketsByStatus: countBy(app.tickets, t => t.status || 'open'), overdue: app.tickets.filter(t => isOverdue(t)).length,
      inspections: app.inspections.length, handovers: app.handovers.length, floorPlans: app.floorPlans.length, contacts: app.contacts.length },
    screen: activeTab(),
    floorPlans: app.floorPlans.map(fp => ({ id: fp.id, name: fp.name })),
    activeFloorPlan: plan ? { id: plan.id, name: plan.name } : null,
    currentInspection: insp ? { id: insp.id, name: insp.name, status: insp.status } : null,
    contacts: app.contacts.map(c => ({ name: c.name, company: c.company || undefined, role: c.role || undefined })),
    hostFile: app._hostFile ? { name: app._hostFile.name, version: app._hostFile.version } : null };
}

function updateProject(app: FieldApp, args: Args) {
  for (const key of PROJECT_FIELDS) if (typeof args[key] === 'string') app.project[key] = args[key];
  render(app, 'loadProjectForm');
  app.saveToLocalStorage();
  return projectInfo(app);
}

function listTickets(app: FieldApp, args: Args) {
  if (typeof args.id === 'string') {
    const t = ticketOf(app, args.id);
    return { ...ticketSummary(app, t), comments: t.comments ?? [], history: t.history ?? [],
      photos: (t.photos ?? []).map((ph: Row) => ({ name: ph.name, capturedAt: ph.capturedAt })) };
  }
  let rows = app.tickets;
  for (const key of ['status', 'category', 'priority', 'assignedTo'] as const) {
    if (typeof args[key] === 'string' && args[key]) rows = rows.filter(t => (key === 'status' ? t.status || 'open' : t[key]) === args[key]);
  }
  if (typeof args.floorPlan === 'string') { const id = floorPlanOf(app, args.floorPlan).id; rows = rows.filter(t => t.floorPlanId === id); }
  if (typeof args.search === 'string' && args.search) {
    const q = args.search.toLowerCase();
    rows = rows.filter(t => `${t.label ?? ''} ${t.description ?? ''}`.toLowerCase().includes(q));
  }
  if (args.overdue === true) rows = rows.filter(t => isOverdue(t));
  const offset = Number.isInteger(args.offset) ? Math.max(0, args.offset as number) : 0;
  const limit = Number.isInteger(args.limit) ? Math.min(MAX_LIMIT, Math.max(1, args.limit as number)) : DEFAULT_LIMIT;
  return { total: rows.length, offset, tickets: rows.slice(offset, offset + limit).map(t => ticketSummary(app, t)) };
}

function refreshTickets(app: FieldApp) {
  render(app, 'renderLocationPoints');
  render(app, 'renderPointsList');
  if (activeTab() === 'dashboard') render(app, 'updateDashboard');
  app.saveToLocalStorage();
}

function placeTicket(app: FieldApp, ticket: Row, args: Args) {
  if (typeof args.floorPlan === 'string') ticket.floorPlanId = floorPlanOf(app, args.floorPlan).id;
  if (typeof args.x === 'number') ticket.x = args.x;
  if (typeof args.y === 'number') ticket.y = args.y;
}

function addTicket(app: FieldApp, args: Args) {
  const label = String(args.label).trim();
  if (!label) throw new Error('label_leeg');
  const ticket: Row = { id: app.genId(), floorPlanId: app.activeFloorPlanId ?? app.floorPlans[0]?.id ?? null, label,
    description: '', category: 'Bouwkundig', priority: 'medium', severity: 'cosmetic', status: 'open', assignedTo: '', deadline: '',
    x: 50, y: 50, photos: [], comments: [], history: [{ action: 'Aangemaakt', date: new Date().toISOString() }], createdAt: new Date().toISOString() };
  for (const key of TICKET_FIELDS) if (typeof args[key] === 'string' && key !== 'label') ticket[key] = args[key];
  placeTicket(app, ticket, args);
  app.tickets.push(ticket);
  app.logActivity(app.tFormat('log_ticket_created', label));
  refreshTickets(app);
  return ticketSummary(app, ticket);
}

function updateTicket(app: FieldApp, args: Args) {
  const ticket = ticketOf(app, args.id);
  if (typeof args.label === 'string' && !args.label.trim()) throw new Error('label_leeg');
  for (const key of TICKET_FIELDS) if (typeof args[key] === 'string') ticket[key] = key === 'label' ? (args[key] as string).trim() : args[key];
  placeTicket(app, ticket, args);
  if (typeof args.comment === 'string' && args.comment.trim()) {
    (ticket.comments ??= []).push({ text: args.comment.trim(), date: new Date().toISOString(), author: app.project.surveyor || 'Assistent' });
  }
  (ticket.history ??= []).push({ action: 'Bewerkt', date: new Date().toISOString() });
  app.logActivity(app.tFormat('log_ticket_edited', ticket.label));
  refreshTickets(app);
  return ticketSummary(app, ticket);
}

function inspections(app: FieldApp, args: Args) {
  if (typeof args.id === 'string') {
    const insp = inspectionOf(app, args.id);
    return { ...inspectionSummary(app, insp), notes: insp.notes || undefined, signedBy: insp.signature?.name,
      items: insp.items.map((item: Row, index: number) => ({ index, id: item.id, question: item.question, type: item.type || 'check',
        options: item.options || undefined, unit: item.unit || undefined, result: item.result || undefined, score: item.score ?? undefined,
        value: item.value || undefined, notes: item.notes || undefined, photos: item.photos?.length || undefined })) };
  }
  return { inspections: app.inspections.map(insp => inspectionSummary(app, insp)),
    templates: app.checklistTemplates.map(t => ({ id: t.id, name: t.name, category: t.category, items: t.items.length, scoring: t.scoring || undefined })) };
}

function startInspection(app: FieldApp, args: Args) {
  const name = String(args.name).trim();
  if (!name) throw new Error('naam_leeg');
  const templateId = typeof args.templateId === 'string' ? args.templateId : '';
  if (templateId && !app.checklistTemplates.some(t => t.id === templateId)) throw new Error(`sjabloon_onbekend: ${templateId}`);
  const insp = app.createInspection({ name, type: 'checklist', templateId,
    date: typeof args.date === 'string' ? args.date : today(),
    inspector: typeof args.inspector === 'string' ? args.inspector : app.project.surveyor || '',
    floorPlanId: typeof args.floorPlan === 'string' ? floorPlanOf(app, args.floorPlan).id : '' });
  if (activeTab() === 'inspectie') render(app, 'renderInspectionsList');
  return inspections(app, { id: insp.id });
}

function fillChecklist(app: FieldApp, args: Args) {
  const insp = inspectionOf(app, args.inspectionId);
  if (insp.status === 'signed') throw new Error('inspectie_ondertekend: een ondertekende inspectie verandert niet meer');
  const changes = args.items as Row[];
  // Check everything first: either all items change or none.
  const targets = changes.map(change => {
    const index = typeof change.index === 'number' ? change.index : insp.items.findIndex((i: Row) => i.id === change.id);
    const item = insp.items[index];
    if (!item) throw new Error(`item_onbekend: ${change.index ?? change.id}`);
    const type = item.type || 'check';
    if (change.result !== undefined && type !== 'check') throw new Error(`geen_afvinkitem: item ${index} is ${type}`);
    if (change.score !== undefined && type !== 'nen2767') throw new Error(`geen_nen2767: item ${index} is ${type}`);
    if (change.value !== undefined && ['check', 'nen2767', 'photo'].includes(type)) throw new Error(`geen_waarde: item ${index} is ${type}`);
    if (type === 'select' && change.value && !(item.options ?? []).includes(change.value)) throw new Error(`keuze_onbekend: ${change.value}`);
    return { item, change };
  });
  for (const { item, change } of targets) {
    for (const key of ['result', 'score', 'value', 'notes']) if (change[key] !== undefined) item[key] = change[key];
  }
  if (app.currentInspectionId === insp.id) render(app, 'renderChecklistExecution');
  app.saveToLocalStorage();
  return inspectionSummary(app, insp);
}

function summary(app: FieldApp) {
  const t = app.tickets;
  return { project: { name: app.project.name || '', number: app.project.number || '', client: app.project.client || '',
      address: [app.project.address, app.project.postalCode, app.project.city].filter(Boolean).join(', ') },
    tickets: { total: t.length, byStatus: countBy(t, x => x.status || 'open'), byCategory: countBy(t, x => x.category || 'Overig'),
      byPriority: countBy(t, x => x.priority || 'medium'), byAssignee: countBy(t, x => x.assignedTo || undefined),
      overdue: t.filter(x => isOverdue(x)).map(x => ({ id: x.id, label: x.label, deadline: x.deadline, assignedTo: x.assignedTo || undefined })).slice(0, 25),
      photos: t.reduce((a, x) => a + (x.photos?.length || 0), 0) },
    inspections: app.inspections.map(insp => inspectionSummary(app, insp)),
    handovers: app.handovers.map(ho => ({ id: ho.id, type: ho.type, date: ho.date, status: ho.status, verdict: ho.verdict || undefined,
      items: ho.items?.length || 0, approved: (ho.items ?? []).filter((i: Row) => i.verdict === 'approved').length })),
    floorPlans: app.floorPlans.length,
    recentActivity: app.activityLog.slice(-10).reverse() };
}

/** A download through `<a download>`; in the SuperCloud the site catches it and stores it in Docs. */
function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportFile(app: FieldApp, args: Args) {
  const base = (app.project.name || 'rapport').replace(/[\\/:*?"<>|]+/g, '_');
  if (args.type === 'bcf') {
    if (!app.tickets.length) throw new Error('geen_bevindingen: een BCF-export heeft bevindingen nodig');
    const { blob, filename } = app.buildBCF();
    download(blob, filename);
    app.logActivity(app.tFormat('act_bcf_exported', String(app.tickets.length)));
    return { started: true, filename, tickets: app.tickets.length };
  }
  if (args.type === 'oplevering') {
    if (typeof args.handoverId !== 'string') throw new Error('handoverId_nodig');
    if (!app.handovers.some(h => h.id === args.handoverId)) throw new Error(`oplevering_onbekend: ${args.handoverId}`);
    const filename = `${base}_handover.html`;
    download(new Blob([app.generateHandoverReport(args.handoverId)], { type: 'text/html' }), filename);
    return { started: true, filename };
  }
  const filename = `${base}_full.html`;
  download(new Blob([app.generateFullReport()], { type: 'text/html' }), filename);
  return { started: true, filename };
}

function screen(app: FieldApp, args: Args) {
  // selectFloorPlan opens the plan in opname; another tab comes after it.
  if (typeof args.floorPlan === 'string') app.selectFloorPlan(floorPlanOf(app, args.floorPlan).id);
  if (typeof args.floorPlan !== 'string' || args.tab !== 'opname') app.switchTab(args.tab);
  return { screen: activeTab() ?? args.tab, activeFloorPlan: app.activeFloorPlanId };
}

const handlers: Record<string, (app: FieldApp, args: Args) => unknown> = {
  field_stand: stand,
  field_project_bijwerken: updateProject,
  field_bevindingen: listTickets,
  field_bevinding_toevoegen: addTicket,
  field_bevinding_wijzigen: updateTicket,
  field_inspecties: inspections,
  field_inspectie_starten: startInspection,
  field_checklist_invullen: fillChecklist,
  field_samenvatting: summary,
  field_export: exportFile,
  field_scherm: screen,
};

/** Enough of JSON Schema for these definitions: type, enum, required, minimum/maximum, minItems, additionalProperties. */
export function validate(value: unknown, schema: Row, path = 'argumenten'): void {
  const types: string[] = schema.type === undefined ? [] : [].concat(schema.type);
  const kind = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
  const ok = !types.length || types.some(t => t === kind || (t === 'integer' && Number.isInteger(value)) || (t === 'number' && kind === 'number' && Number.isFinite(value)));
  if (!ok) throw new Error(`ongeldig_argument: ${path} moet ${types.join(' of ')} zijn`);
  if (schema.enum && !schema.enum.includes(value)) throw new Error(`ongeldig_argument: ${path} moet een van ${schema.enum.join(', ')} zijn`);
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) throw new Error(`ongeldig_argument: ${path} is kleiner dan ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) throw new Error(`ongeldig_argument: ${path} is groter dan ${schema.maximum}`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) throw new Error(`ongeldig_argument: ${path} heeft te weinig elementen`);
    if (schema.items) value.forEach((v, i) => validate(v, schema.items, `${path}[${i}]`));
  }
  if (kind === 'object') {
    const obj = value as Row;
    for (const key of schema.required ?? []) if (obj[key] === undefined) throw new Error(`ongeldig_argument: ${path}.${key} ontbreekt`);
    for (const [key, v] of Object.entries(obj)) {
      const sub = schema.properties?.[key];
      if (!sub) { if (schema.additionalProperties === false) throw new Error(`ongeldig_argument: ${path}.${key} is onbekend`); continue; }
      if (v !== undefined) validate(v, sub, `${path}.${key}`);
    }
  }
}

function bounded(name: string, result: unknown): unknown {
  const json = JSON.stringify(result ?? null);
  if (json.length > MAX_RESULT_CHARS) throw new Error(`te_groot: het antwoord van ${name} heeft ${json.length} tekens; filter of gebruik limit`);
  return JSON.parse(json);
}

export function createSiteAppTools(getApp: () => FieldApp | undefined = () => (window as any).app): SiteAppTools {
  return {
    async tools() { return definitions.tools.map(def => def.name); },
    async definitions() { return definitions.tools; },
    async run(name, args = {}) {
      if (!Object.prototype.hasOwnProperty.call(handlers, name)) throw new Error('onbekende_tool');
      validate(args, definitions.tools.find(def => def.name === name)!.inputSchema);
      const app = getApp();
      if (!app) throw new Error('app_niet_klaar');
      return bounded(name, handlers[name](app, args));
    },
  };
}

/** Put `window.__OPDS_APP__` in place (browser build only, main.tsx). */
export function installSiteAppTools(target: { __OPDS_APP__?: SiteAppTools } = window as never): void {
  target.__OPDS_APP__ = createSiteAppTools();
}
