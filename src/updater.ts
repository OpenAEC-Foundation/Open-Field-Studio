// Update check for Open Field Studio.
// Uses the GitHub Releases API — no signer keys or Tauri plugin needed.
// Silent-fails when offline, rate-limited (GitHub allows 60 unauth req/h per IP), or in dev.
// The badge in the titlebar links to the release page; the user downloads the installer manually.

const REPO = 'OpenAEC-Foundation/Open-Field-Studio';
const CACHE_KEY = 'ofs_update_check_cache';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

declare const __APP_VERSION__: string;

type CachedResult = {
    checkedAt: number;
    latestVersion: string;
    htmlUrl: string;
};

function parseSemver(v: string): [number, number, number] | null {
    const clean = v.replace(/^v/, '').split(/[-+]/)[0]; // drop pre-release / build
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

async function fetchLatestRelease(): Promise<CachedResult | null> {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
        headers: { 'Accept': 'application/vnd.github+json' }
    });
    if (!res.ok) return null;
    const json = await res.json() as { tag_name?: string; html_url?: string };
    if (!json.tag_name || !json.html_url) return null;
    return { checkedAt: Date.now(), latestVersion: json.tag_name, htmlUrl: json.html_url };
}

function readCache(): CachedResult | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const c = JSON.parse(raw) as CachedResult;
        if (!c.checkedAt || (Date.now() - c.checkedAt) > CACHE_TTL_MS) return null;
        return c;
    } catch { return null; }
}

function writeCache(c: CachedResult) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch { /* quota */ }
}

export type UpdateStatus = {
    available: boolean;
    currentVersion: string;
    latestVersion?: string;
    htmlUrl?: string;
};

export async function checkForUpdates(): Promise<UpdateStatus> {
    const current = __APP_VERSION__;
    try {
        let cached = readCache();
        if (!cached) {
            cached = await fetchLatestRelease();
            if (cached) writeCache(cached);
        }
        if (!cached) return { available: false, currentVersion: current };
        const available = isNewer(cached.latestVersion, current);
        return { available, currentVersion: current, latestVersion: cached.latestVersion, htmlUrl: cached.htmlUrl };
    } catch (e) {
        // Silent-fail: offline, rate-limited, CORS in weird env — never crash the app.
        console.debug('Update check skipped:', e);
        return { available: false, currentVersion: current };
    }
}

// Render the update-badge into the titlebar. Idempotent — safe to call multiple times.
export function renderUpdateBadge(status: UpdateStatus, tGet?: (key: string, ...args: string[]) => string) {
    const host = document.querySelector('.title-bar-version')?.parentElement;
    if (!host) return;
    let badge = document.getElementById('title-bar-update-badge') as HTMLAnchorElement | null;
    if (!status.available || !status.htmlUrl) {
        badge?.remove();
        return;
    }
    if (!badge) {
        badge = document.createElement('a');
        badge.id = 'title-bar-update-badge';
        badge.target = '_blank';
        badge.rel = 'noopener';
        badge.style.cssText = 'margin-left:0.75rem;padding:0.15rem 0.5rem;background:#d97706;color:#fff;font-size:0.7rem;font-weight:600;border-radius:4px;text-decoration:none;cursor:pointer;';
        host.appendChild(badge);
    }
    badge.href = status.htmlUrl;
    const t = tGet || ((k: string, ...args: string[]) => k.replace(/\{(\d+)\}/g, (_, i) => args[Number(i)] || ''));
    badge.textContent = t('update_available', status.latestVersion || '');
    badge.title = t('update_click_to_view');
}
