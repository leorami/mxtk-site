import AdminSignin from '@/components/admin/AdminSignin';
import { cookies } from 'next/headers';
import Link from 'next/link';
// @ts-expect-error RSC importing client component
import FactsEditor from '@/components/admin/FactsEditor';
// @ts-expect-error RSC importing client component
import UnitTestConsole from '@/components/dev/UnitTestConsole';
import 'server-only';

export default async function AdminLanding() {
  const ck = await cookies();
  const authed = ck.get('mxtk_admin')?.value === '1';
  return (
    <div className="max-w-3xl mx-auto p-6 rounded-xl border bg-[var(--surface-elevated,#ffffff)] text-[var(--ink,#0a0a0a)] dark:bg-[var(--surface-elevated,#111213)] dark:text-[var(--ink,#f8fafc)]">
      <h1 className="text-2xl font-semibold mb-4 text-[var(--ink-strong,#0a0a0a)] dark:text-[var(--ink-strong,#f8fafc)]">Admin</h1>
      {authed ? (
        <div className="space-y-2">
          <p><Link className="underline text-[var(--link,#0a58ff)] dark:text-[var(--link,#7ab0ff)] hover:opacity-90" href="/admin/flags">Flags</Link></p>
          <p><Link className="underline text-[var(--link,#0a58ff)] dark:text-[var(--link,#7ab0ff)] hover:opacity-90" href="/admin/costs">Costs</Link></p>
          <p><Link className="underline text-[var(--link,#0a58ff)] dark:text-[var(--link,#7ab0ff)] hover:opacity-90" href="/admin/tools">Tools</Link></p>
          <p><Link className="underline text-[var(--link,#0a58ff)] dark:text-[var(--link,#7ab0ff)] hover:opacity-90" href="/facts">Facts (view)</Link></p>
          <div className="mt-4">
            {/* Client component rendered from server page */}
            <FactsEditor />
          </div>
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Unit Tests</h2>
            <UnitTestConsole />
          </div>
        </div>
      ) : (
        <AdminSignin />
      )}
    </div>
  );
}


