import 'server-only';
import { cookies } from 'next/headers';
import AdminSignin from '@/components/admin/AdminSignin';
import FlagsClient from '@/components/admin/FlagsClient';

export const dynamic = 'force-dynamic';

export default function Page() {
  const ck = cookies();
  const authed = ck.get('mxtk_admin')?.value === '1';
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Flag Review</h1>
      {!authed ? <AdminSignin /> : <FlagsClient initialQuery={{ status: 'open' }} />}
    </div>
  );
}


