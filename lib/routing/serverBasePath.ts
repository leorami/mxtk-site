import { cookies, headers } from 'next/headers';
export async function getServerBasePath(): Promise<string> {
  const h = await headers();
  const forwarded = h.get('x-forwarded-prefix');
  if (forwarded === '/mxtk') return '/mxtk';
  const store = await cookies();
  return store.get('bp')?.value || '';
}


