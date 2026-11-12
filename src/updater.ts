// Update check + update dialog for Open Field Studio.
//
// Source of truth is the GitHub Releases API (no signing keys / Tauri updater plugin needed).
// - checkForUpdates(): silent-fails offline / rate-limited; cached 6 h unless force=true.
// - openUpdateDialog(): shows "you're up to date" or "version X available" and a platform-aware
//   "Bijwerken" button:
//     Windows / Linux / Android app -> opens the matching installer download in the system browser
//     web build                     -> reloads the page (the site redeploys on every release)
//
// A fully silent in-place updater would require a Tauri signing keypair + updater artifacts in CI;
// until that exists, one click to the right installer is the honest, reliable path.

const REPO = 'OpenAEC-Foundation/Open-Field-Studio';
const CACHE_KEY = 'ofs_update_check_v2';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

declare const __APP_VERSION__: string;

type Asset = { name: string; url: string; size: number };
type Latest = { checkedAt: number; latestVersion: string; htmlUrl: string; assets: Asset[] };

export type UpdateStatus = {
    available: boolean;
    currentVersion: string;
    latestVersion?: string;
    htmlUrl?: string;
    assets?: Asset[];
    error?: boolean;
};

type Platform = 'android' | 'windows' | 'linux' | 'web' | 'other';

/* ---------- version compare ---------- */

function parseSemver(v: string): [number, number, number] | null {
    const clean = v.replace(/^v/, '').split(/[-+]/)[0];
    const parts = clean.split('.').map(Number);
    if (parts.length !== 3 || parts.some(n => Number.isNaN(n))) return null;
    return [parts[0], parts[1], parts[2]];
}

function isNewer(candidate: string, current: string): boolean {
    const c = parseSemver(candidate);
    const cur = parseSemver(current);
    if (!c || !cur) return false;
    for (let i = 0; i < 3; i++) {
        if (c[i] > cur[i]) return true;
        if (c[i] < cur[i]) return false;
    }
    return false;
}

/* ---------- fetch + cache ---------- */

async function fetchLatestRelease(): Promise<Latest | null> {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
        headers: { 'Accept': 'application/vnd.github+json' }
    });
    if (!res.ok) return null;
    const json = await res.json() as {
        tag_name?: string; html_url?: string;
        assets?: { name: string; browser_download_url: string; size: number }[];
    };
    if (!json.tag_name || !json.html_url) return null;
    return {
        checkedAt: Date.now(),
        latestVersion: json.tag_name,
        htmlUrl: json.html_url,
        assets: (json.assets || []).map(a => ({ name: a.name, url: a.browser_download_url, size: a.size }))
    };
}

function readCache(): Latest | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const c = JSON.parse(raw) as Latest;
        if (!c.checkedAt || (Date.now() - c.checkedAt) > CACHE_TTL_MS || !Array.isArray(c.assets)) return null;
        return c;
    } catch { return null; }
}

function writeCache(c: Latest) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch { /* quota */ }
}

export async function checkForUpdates(force = false): Promise<UpdateStatus> {
    const current = __APP_VERSION__;
    try {
        let latest = force ? null : readCache();
        if (!latest) {
            latest = await fetchLatestRelease();
            if (latest) writeCache(latest);
        }
        if (!latest) return { available: false, currentVersion: current, error: true };
        return {
            available: isNewer(latest.latestVersion, current),
            currentVersion: current,
            latestVersion: latest.latestVersion,
            htmlUrl: latest.htmlUrl,
            assets: latest.assets
        };
    } catch (e) {
        console.debug('Update check failed:', e);
        return { available: false, currentVersion: current, error: true };
    }
}

/* ---------- platform + installer choice ---------- */

function detectPlatform(): Platform {
    const isApp = '__TAURI_INTERNALS__' in window;
    if (!isApp) return 'web';
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) return 'android';
    if (/Windows/i.test(ua)) return 'windows';
    if (/Linux/i.test(ua)) return 'linux';
    return 'other';
}

function pickAsset(platform: Platform, assets: Asset[] = []): Asset | null {
    const find = (re: RegExp) => assets.find(a => re.test(a.name)) || null;
    switch (platform) {
        case 'android': return find(/\.apk$/i);
        // The per-user installer needs no admin rights and matches how the app is normally installed.
        case 'windows': return find(/x64_user-setup\.exe$/i) || find(/setup\.exe$/i);
        case 'linux': return find(/\.AppImage$/i) || find(/\.deb$/i);
        default: return null;
    }
}

async function openExternal(url: string) {
    if ('__TAURI_INTERNALS__' in window) {
        const { openUrl } = await import('@tauri-apps/plugin-opener');
        await openUrl(url);
    } else {
        window.open(url, '_blank', 'noopener');
    }
}

/* ---------- i18n helper ---------- */

function tr(key: string, ...args: (string | number)[]): string {
    const i18n = (window as any).i18next;
    let s: string = i18n ? i18n.t(key, { defaultValue: key }) : key;
    args.forEach((a, i) => { s = s.split(`{${i}}`).join(String(a)); });
    return s;
}

function esc(s: string): string {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

/* ---------- titlebar badge ---------- */

export function renderUpdateBadge(status: UpdateStatus) {
    const host = document.querySelector('.title-bar-version')?.parentElement;
    if (!host) return;
    let badge = document.getElementById('title-bar-update-badge') as HTMLButtonElement | null;
    if (!status.available || !status.latestVersion) { badge?.remove(); return; }
    if (!badge) {
        badge = document.createElement('button');
        badge.id = 'title-bar-update-badge';
        badge.type = 'button';
        badge.style.cssText = 'margin-left:0.75rem;padding:0.15rem 0.5rem;background:#d97706;color:#fff;font-size:0.7rem;font-weight:600;border:0;border-radius:4px;cursor:pointer;-webkit-app-region:no-drag;';
        badge.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); void openUpdateDialog(); });
        host.appendChild(badge);
    }
    badge.textContent = tr('update_available', status.latestVersion);
    badge.title = tr('update_click_to_view');
}

/* ---------- dialog ---------- */

function ensureModal(): HTMLElement {
    let m = document.getElementById('update-modal');
    if (m) return m;
    m = document.createElement('div');
    m.className = 'modal';
    m.id = 'update-modal';
    m.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="update-modal-title"></h3>
                <button class="modal-close" id="update-modal-close" type="button">&times;</button>
            </div>
            <div class="modal-body" id="update-modal-body"></div>
            <div class="modal-footer" id="update-modal-footer"></div>
        </div>`;
    document.body.appendChild(m);
    const close = () => m!.classList.remove('active');
    m.querySelector('.modal-overlay')!.addEventListener('click', close);
    m.querySelector('#update-modal-close')!.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    return m;
}

async function runUpdate(status: UpdateStatus, setNote: (html: string) => void) {
    const platform = detectPlatform();
    if (platform === 'web') {
        setNote(esc(tr('update_reloading')));
        setTimeout(() => location.reload(), 400);
        return;
    }
    const asset = pickAsset(platform, status.assets);
    const url = asset?.url || status.htmlUrl;
    if (!url) return;
    try {
        await openExternal(url);
        const hint = asset ? tr(`update_hint_${platform}`) : tr('update_no_asset');
        setNote(esc(hint));
    } catch (e) {
        console.error('open update url failed', e);
        // Last resort: show the link so it can be copied.
        setNote(`${esc(tr('update_open_failed'))}<br><code style="word-break:break-all;">${esc(url)}</code>`);
    }
}

export async function openUpdateDialog() {
    const m = ensureModal();
    const title = m.querySelector('#update-modal-title') as HTMLElement;
    const body = m.querySelector('#update-modal-body') as HTMLElement;
    const footer = m.querySelector('#update-modal-footer') as HTMLElement;
    title.textContent = tr('update_title');
    m.classList.add('active');

    const render = (status: UpdateStatus | null) => {
        footer.innerHTML = '';
        const btn = (label: string, cls: string, onClick: () => void) => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = `btn ${cls}`; b.textContent = label; b.addEventListener('click', onClick);
            footer.appendChild(b); return b;
        };
        const noteEl = () => body.querySelector('#update-note') as HTMLElement;

        if (!status) {
            body.innerHTML = `<p>${esc(tr('update_checking'))}</p>`;
            return;
        }
        const cur = `<p style="margin:0 0 .5rem;color:var(--text-muted,#6b7280);font-size:.85rem;">${esc(tr('update_current', status.currentVersion))}</p>`;
        let state: string;
        if (status.error) state = `<p style="color:var(--danger,#dc2626);">${esc(tr('update_check_failed'))}</p>`;
        else if (status.available) state = `<p style="font-weight:600;">${esc(tr('update_available_msg', status.latestVersion || '', status.currentVersion))}</p>`;
        else state = `<p style="color:var(--success,#059669);font-weight:600;">✓ ${esc(tr('update_latest_ok'))}</p>`;
        body.innerHTML = `${cur}${state}<div id="update-note" style="margin-top:.5rem;font-size:.85rem;"></div>`;

        btn(tr('update_btn_recheck'), 'btn-secondary', async () => { render(null); render(await checkForUpdates(true)); renderUpdateBadge(await checkForUpdates()); });
        if (status.htmlUrl) btn(tr('update_btn_page'), 'btn-secondary', () => { void openExternal(status.htmlUrl!).catch(() => {}); });
        if (status.available) btn(tr('update_btn_update', status.latestVersion || ''), 'btn-primary', () => { void runUpdate(status, (h) => { noteEl().innerHTML = h; }); });
        else btn(tr('update_btn_close'), 'btn-primary', () => m.classList.remove('active'));
    };

    render(null);
    const status = await checkForUpdates(true);
    render(status);
    renderUpdateBadge(status);
}
