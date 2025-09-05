import { resolveCitations } from '@/lib/ai/citations';

export default async function CitationFootnotes({ ids }: { ids: string[] }) {
  const list = await resolveCitations(ids);
  
  if (!list.length) return null;
  
  return (
    <aside className="pt-8 border-t mt-8 text-xs">
      <h3 className="font-semibold mb-2">Sources</h3>
      <ol className="space-y-1">
        {list.map(s => (
          <li key={s.id}>
            [{s.id}] {s.source || 'Unknown source'}
            {s.page ? ` p.${s.page}` : ''}
            {s.section ? ` · ${s.section}` : ''}
          </li>
        ))}
      </ol>
    </aside>
  );
}
