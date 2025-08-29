import { getServerBasePath } from '@/lib/routing/serverBasePath';

function normalizeRelative(input: string): string {
  if (/^https?:\/\//i.test(input)) return input;
  let rel = input.trim();
  rel = rel.replace(/^\/+/, '/');
  rel = rel.replace(/^\/mxtk(\/|$)/i, '/');
  return rel.startsWith('/') ? rel : `/${rel}`;
}

export async function getServerPublicPath(relative: string): Promise<string> {
  const bp = await getServerBasePath();
  const norm = normalizeRelative(relative);
  return `${bp}${norm}`.replace(/\/{2,}/g, '/');
}


