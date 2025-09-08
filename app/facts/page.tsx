import { getBasePathUrl } from '../../lib/basepath';

async function fetchFacts() {
  const url = getBasePathUrl('/api/ai/facts');
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load facts');
  const data = await res.json();
  const etag = res.headers.get('etag') || undefined;
  return { data, etag } as { data: any; etag?: string };
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <dt className="text-sm text-neutral-500 dark:text-neutral-400">{label}</dt>
      <dd className="text-sm text-neutral-900 dark:text-neutral-100">{value || '—'}</dd>
    </div>
  );
}

function List({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return <span>—</span>;
  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((x, i) => (
        <li key={i} className="text-sm text-neutral-900 dark:text-neutral-100">{x}</li>
      ))}
    </ul>
  );
}

function CopyJsonButton() {
  'use client';
  const onClick = async () => {
    const url = (await import('../../lib/basepath')).getBasePathUrl('/api/ai/facts');
    const res = await fetch(url);
    const json = await res.text();
    await navigator.clipboard.writeText(json);
  };
  return (
    <button onClick={onClick} className="px-3 py-1 rounded-md border border-neutral-300 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Copy JSON</button>
  );
}

export default async function FactsPage() {
  const { data: doc, etag } = await fetchFacts();
  const d = doc?.data || {};
  const project = d.project || {};
  const assets = d.assets || {};
  const governance = d.governance || {};
  const models = d.models || {};

  return (
    <div data-testid="facts-view" className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Public Facts</h1>
        <CopyJsonButton />
      </div>

      <section className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
        <h2 className="text-lg font-medium mb-2">Project</h2>
        <dl>
          <InfoRow label="Name" value={project.name} />
          <InfoRow label="Tagline" value={project.tagline} />
        </dl>
      </section>

      <section className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
        <h2 className="text-lg font-medium mb-2">Assets</h2>
        <dl>
          <InfoRow label="Committed USD" value={typeof assets.committedUSD === 'number' ? `$${assets.committedUSD.toLocaleString()}` : undefined} />
          <div>
            <dt className="text-sm text-neutral-500 dark:text-neutral-400">Categories</dt>
            <dd className="mt-1"><List items={assets.categories} /></dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
        <h2 className="text-lg font-medium mb-2">Governance</h2>
        <dl>
          <InfoRow label="Policy URL" value={governance.policyUrl} />
          <InfoRow label="Contact" value={governance.contact} />
        </dl>
      </section>

      <section className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
        <h2 className="text-lg font-medium mb-2">Models</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm font-medium">Suggest</div>
            <List items={models.suggest} />
          </div>
          <div>
            <div className="text-sm font-medium">Answer</div>
            <List items={models.answer} />
          </div>
          <div>
            <div className="text-sm font-medium">Deep</div>
            <List items={models.deep} />
          </div>
        </div>
        <dl className="mt-3">
          <InfoRow label="Embeddings" value={models.embeddings} />
        </dl>
      </section>

      <section className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
        <h2 className="text-lg font-medium mb-2">Meta</h2>
        <dl>
          <InfoRow label="Version" value={String(doc.version)} />
          <InfoRow label="Updated" value={new Date(doc.updatedAt).toLocaleString()} />
          <InfoRow label="ETag" value={etag} />
        </dl>
      </section>
    </div>
  );
}


