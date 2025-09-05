import { loadHome } from '@/lib/home/store'

export default async function HomeView({ id }: { id: string | null }) {
  if (!id) return <div className="max-w-5xl mx-auto p-6">No Home yet. Pin widgets from the Guide to create your personalized Home.</div>
  const h = await loadHome(id)
  if (!h) return <div className="max-w-5xl mx-auto p-6">Home not found.</div>
  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {h.widgets.map(w => (
        <div key={w.id} className={`rounded-xl border p-4 shadow-sm ${w.new ? 'ring-2 ring-orange-300 animate-pulse' : ''}`}>
          <h3 className="font-semibold mb-2">{w.title}</h3>
          <pre className="text-xs opacity-75">{JSON.stringify(w.props || {}, null, 2)}</pre>
        </div>
      ))}
    </div>
  )
}


