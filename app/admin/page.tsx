import 'server-only';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default function AdminLanding() {
  const ck = cookies();
  const authed = ck.get('mxtk_admin')?.value === '1';
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin</h1>
      {authed ? (
        <p>
          <Link className="underline" href="/admin/flags">Go to Flags</Link>
        </p>
      ) : (
        // @ts-expect-error Server Component boundary
        require('@/components/admin/AdminSignin').default()
      )}
    </div>
  );
}


