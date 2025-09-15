import { cookies, headers } from 'next/headers';
export async function getServerBasePath(): Promise<string> {
  const h = await headers();
  const allowed = new Set(['/mxtk']);
  const envBase = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim();

  const forwarded = h.get('x-forwarded-prefix') || '';
  if (forwarded && allowed.has(forwarded)) return forwarded;

  const store = await cookies();
  const cookieVal = (store.get('bp')?.value || '').trim();
  if (cookieVal && allowed.has(cookieVal)) return cookieVal;

  const currentUrl = h.get('x-current-url') || '';
  try {
    const u = new URL(currentUrl);
    for (const candidate of allowed) {
      if (candidate && u.pathname.startsWith(candidate)) return candidate;
    }
  } catch {}

  return allowed.has(envBase) ? envBase : '';
}


