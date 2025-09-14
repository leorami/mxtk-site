import { cookies, headers } from 'next/headers';
export async function getServerBasePath(): Promise<string> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-prefix');
  if (forwarded === '/mxtk') return '/mxtk';
  const store = await cookies();
  const cookieVal = store.get('bp')?.value || '';
  if (cookieVal === '/mxtk') return '/mxtk';
  // Fallback: infer from current URL path to avoid SSR/CSR mismatches
  const currentUrl = h.get('x-current-url') || '';
  try {
    const u = new URL(currentUrl);
    if (u.pathname.startsWith('/mxtk')) return '/mxtk';
  } catch {}
  return '';
}


