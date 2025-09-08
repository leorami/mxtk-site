import 'server-only'
import { cookies } from 'next/headers'
import { getApiUrl } from '@/lib/api'
import PageScaffold from '@/components/layout/PageScaffold'
import Grid from '@/components/home/Grid'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const c = await cookies();
  const id = c.get('mxtk_home_id')?.value || null;
  let initialDoc: any | undefined
  if (id) {
    try {
      const res = await fetch(getApiUrl(`/ai/home/${id}`), { cache: 'no-store', headers: { 'ngrok-skip-browser-warning': 'true' } })
      if (res.ok) initialDoc = await res.json()
    } catch {}
  }

  const sections = [
    {
      id: 'home-grid',
      title: 'Your Home',
      description: 'Pin helpful widgets, drag to arrange, and resize as you learn. Ask the AI Guide for suggestions.',
      children: <Grid doc={{ id: id || 'guest', widgets: (initialDoc?.widgets || initialDoc?.doc?.widgets || []), layoutVersion: 1 }} />
    }
  ]

  return (
    <PageScaffold
      title="Home"
      subtitle={id ? undefined : 'Your Home will appear here'}
      description={id ? undefined : 'Use the AI Guide to add a starter widget.'}
      sections={sections}
      backgroundClass="mineral-sheen"
    />
  )
}



