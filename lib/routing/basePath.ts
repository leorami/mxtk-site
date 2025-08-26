// Prefix-agnostic routing helpers. These functions ALWAYS return absolute paths
// so we never rely on the browser's "relative URL" base (which breaks when the
// current URL lacks a trailing slash, e.g. `/mxtk`).

function stripLeading(p: string) { return p.replace(/^\/+/, ''); }
function stripTrailing(p: string) { return p.replace(/\/+$/, ''); }
function cleanJoin(a: string, b: string) { return (`${a}/${b}`).replace(/\/{2,}/g, '/'); }

/** Detect the external prefix from a pathname (server) or window (client). */
function detectPrefix(currentPathname?: string): string {
  if (typeof window !== 'undefined' && !currentPathname) {
    currentPathname = window.location.pathname || '/';
  }
  const parts = (currentPathname || '/').split('/').filter(Boolean);
  return parts[0]?.toLowerCase() === 'mxtk' ? '/mxtk' : '';
}

/**
 * Absolute path builder for app routes.
 * - `target` can be `''` (home), `owners`, `legal/terms`, `/whitepaper`, etc.
 * - `currentPathname` is passed by caller (e.g. from usePathname) so SSR and
 *   client produce the SAME href and avoid hydration warnings.
 */
export function getRelativePath(target: string, currentPathname?: string): string {
  const leaf = stripLeading(target);
  const prefix = detectPrefix(currentPathname);
  // Ensure `/mxtk/` (with trailing slash) for home so relative assets resolve correctly.
  if (leaf === '') return `${stripTrailing(prefix)}/`;
  return cleanJoin(prefix || '/', leaf);
}

/**
 * Public asset path (anything in /public). Always absolute, never relative.
 * Example: getPublicPath('logo-horizontal.svg', '/mxtk/owners') -> '/mxtk/logo-horizontal.svg'
 */
export function getPublicPath(asset: string, currentPathname?: string): string {
  const leaf = stripLeading(asset);
  const prefix = detectPrefix(currentPathname);
  return cleanJoin(prefix || '/', leaf);
}

/**
 * API path helper. Accepts either `'token/summary'` or `'/api/token/summary'`.
 * On ngrok returns `/mxtk/api/...`, locally `/api/...`.
 */
export function getApiPath(path: string, currentPathname?: string): string {
  let leaf = stripLeading(path);
  // Allow callers to pass '/api/...'
  if (leaf.startsWith('api/')) leaf = leaf.slice(4);
  const prefix = detectPrefix(currentPathname);
  return cleanJoin(prefix || '/', `api/${leaf}`);
}
