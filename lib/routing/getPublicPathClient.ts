import { useBasePath } from '@/components/providers/BasePathProvider';

function normalizeRelative(input: string): string {
  if (/^https?:\/\//i.test(input)) return input; // pass-through absolute URLs
  let rel = input.trim();
  // strip any accidental leading slashes and accidental /mxtk prefix
  rel = rel.replace(/^\/+/, '/');
  rel = rel.replace(/^\/mxtk(\/|$)/i, '/');
  return rel.startsWith('/') ? rel : `/${rel}`;
}

let warned = false;
function devWarnOnce(msg: string) {
  if (process.env.NODE_ENV !== 'production' && !warned) {
    warned = true;
    // eslint-disable-next-line no-console
    console.warn(`[getPublicPath] ${msg}`);
  }
}

export function usePublicPath(relative: string): string {
  const bp = useBasePath() || '';
  const norm = normalizeRelative(relative);
  if (process.env.NODE_ENV !== 'production' && /\/mxtk\//i.test(relative)) {
    devWarnOnce(`Do not pass '/mxtk' to helpers. Received: "${relative}"`);
  }
  return `${bp}${norm}`.replace(/\/{2,}/g, '/');
}


