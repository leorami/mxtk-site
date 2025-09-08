import 'server-only'
import { cookies } from 'next/headers'
import { getApiUrl } from '@/lib/api'
import PageScaffold from '@/components/layout/PageScaffold'
import Grid from '@/components/home/Grid'
import StarterPanel from '@/components/home/StarterPanel'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const jar = await cookies()
  const id = jar.get('mxtk_home_id')?.value || null
  let doc: any = null
  if (id) {
    try { const r = await fetch(getApiUrl(`/ai/home/${id}`), { cache: 'no-store', headers: { 'ngrok-skip-browser-warning': 'true' } }); if (r.ok) doc = await r.json() } catch {}
  }
  const has = !!doc?.widgets?.length
  return (
    <PageScaffold
      title="Home"
      description={!has ? 'Your Home is empty. Add a starter widget or ask Sherpa to help.' : undefined}
      backgroundClass="mxtk-bg-mineral"
      sections={[{
        id: 'home-grid',
        title: 'Your Home',
        description: 'Pin helpful widgets, drag to arrange, and resize as you learn.',
        children: has ? <Grid doc={doc} /> : <StarterPanel homeId={id || undefined} />
      }]}
    />
  )
}



