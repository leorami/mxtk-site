import Grid from '@/components/home/Grid'
import StarterPanel from '@/components/home/StarterPanel'
import PageScaffold from '@/components/layout/PageScaffold'
import { getApiUrl } from '@/lib/api'
import { cookies } from 'next/headers'
import 'server-only'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const c = await cookies();
  const id = c.get('mxtk_home_id')?.value || null;
  let initialDoc: any | undefined
  if (id) {
    try {
      const res = await fetch(getApiUrl(`/ai/home/${id}`), { cache: 'no-store', headers: { 'ngrok-skip-browser-warning': 'true' } })
      if (res.ok) initialDoc = await res.json()
    } catch { }
  }

  const widgets = (initialDoc?.widgets || initialDoc?.doc?.widgets || [])
  const hasWidgets = widgets.length > 0
  const sections = [
    {
      id: 'home-grid',
      title: 'Your Home',
      description: 'Pin helpful widgets, drag to arrange, and resize as you learn. Use the buttons below or ask the AI Guide for suggestions.',
      children: hasWidgets
        ? <Grid doc={{ id: id || 'guest', widgets, layoutVersion: 1 }} />
        : <StarterPanel homeId={id || undefined} />
    }
  ]

  return (
    <PageScaffold
      title="Home"
      description={!hasWidgets ? 'Your Home is empty. Add a starter widget or ask Sherpa to help.' : undefined}
      sections={sections}
      backgroundClass="mxtk-bg-mineral"
    />
  )
}



