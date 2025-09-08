import { getApiUrl } from '@/lib/api'
import { cookies } from 'next/headers'
import 'server-only'

async function fetchRecent() {
  const c = await cookies()
  let j: string | undefined
  try { j = c.get('mxtkJourneyId')?.value || c.get('mxtk_journey_id')?.value } catch { j = undefined }
  try {
    const url = j ? getApiUrl(`/ai/journey/${j}`) : getApiUrl('/ai/journey')
    const res = await fetch(url, { cache: 'no-store', headers: { 'ngrok-skip-browser-warning': 'true' } })
    if (!res.ok) return []
    const data = await res.json()
    const doc = data.journey || data || { blocks: [] }
    const blocks = Array.isArray(doc.blocks) ? doc.blocks : []
    const answers = blocks.filter((b: any) => (b.body || '').trim()).slice(-5).reverse()
    return answers.map((b: any) => ({ id: b.id, title: b.title || 'Recent answer', body: b.body }))
  } catch { return [] }
}

export default async function RecentAnswers() {
  const items = await fetchRecent()
  return (
    <div className="prose prose-sm widget-recent-answers">
      {!items.length && <p className="opacity-70">No recent answers yet.</p>}
      {items.map((m: any) => (
        <article key={m.id} className="answer-card">
          <h4 className="m-0 font-medium">{m.title}</h4>
          <p>{m.body?.length > 800 ? m.body.slice(0, 800) + '…' : m.body}</p>
        </article>
      ))}
    </div>
  )
}


