import 'server-only';
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Flag Review</h1>
      <p className="opacity-70 mb-4">Requires ADMIN_TOKEN in Authorization header. For dev UX, a small client fetcher is mounted below.</p>
      {/* @ts-expect-error */}
      {require('@/components/admin/FlagReview').default()}
    </div>
  );
}


