import AdminSignin from '@/components/admin/AdminSignin';
import { cookies } from 'next/headers';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'server-only';

export default async function AdminLanding() {
  const ck = await cookies();
  const authed = ck.get('mxtk_admin')?.value === '1';
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin</h1>
      {authed ? (
        <div className="space-y-2">
          <p><Link className="underline" href="/admin/flags">Flags</Link></p>
          <p><Link className="underline" href="/admin/costs">Costs</Link></p>
          <p><Link className="underline" href="/admin/tools">Tools</Link></p>
          <p><Link className="underline" href="/facts">Facts (view)</Link></p>
          <div className="mt-4">
            {/* Client-only editor; page SSRs for everyone */}
            {/** @ts-expect-error Async Server Component wrapper for client import */}
            {dynamic(() => import('@/components/admin/FactsEditor'), { ssr: false })()}
          </div>
        </div>
      ) : (
        <AdminSignin />
      )}
    </div>
  );
}


