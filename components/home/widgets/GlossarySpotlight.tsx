import { getApiUrl } from '@/lib/api'
import 'server-only'

async function getGlossary() {
  try {
    const res = await fetch(getApiUrl('/ai/glossary'), { cache: 'force-cache', headers: { 'ngrok-skip-browser-warning': 'true' } })
    if (!res.ok) return []
    const data = await res.json()
    return data.items || []
  } catch { return [] }
}

export default async function GlossarySpotlight() {
  const items = await getGlossary()
  if (!items.length) return <p className="opacity-70">No glossary data yet.</p>
  const day = Math.floor(Date.now() / 86400000)
  const pick = items[day % items.length]
  return (
    <div className="text-sm leading-relaxed">
      <div className="font-semibold mb-1">{pick.term}</div>
      <p className="opacity-90">{pick.definition}</p>
      <button
        className="underline mt-2"
        onClick={() => { try { window.dispatchEvent(new CustomEvent('mxtk:guide:prefill', { detail: { prompt: `Explain ${pick.term} as it relates to MXTK` } })) } catch { } }}
        aria-label="Learn more in Guide"
      >Learn more…</button>
    </div>
  )
}


