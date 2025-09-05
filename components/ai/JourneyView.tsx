import { loadJourney } from '@/lib/ai/store/fileStore';
import CitationFootnotes from '@/components/ai/CitationFootnotes';

export default async function JourneyView({ id }: { id: string }) {
  const doc = await loadJourney(id);
  
  if (!doc) return <div className="p-6">Journey not found.</div>;
  
  const ids = Array.from(new Set(doc.blocks.flatMap(b => b.citations || [])));
  
  return (
    <article className="prose dark:prose-invert max-w-3xl mx-auto p-6">
      <h1>MXTK Journey</h1>
      
      {doc.blocks.map(b => (
        <section key={b.id} className="mt-8">
          <h2 id={b.topicKey}>{b.title}</h2>
          <div className="whitespace-pre-wrap">{b.body}</div>
        </section>
      ))}
      
      {/* @ts-expect-error Async Server Component */}
      <CitationFootnotes ids={ids} />
    </article>
  );
}
