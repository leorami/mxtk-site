import WidgetGrid from '@/components/home/WidgetGrid'
import { loadHome } from '@/lib/home/store'
import { cookies } from 'next/headers'
import 'server-only'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const c = cookies()
  const id = c.get('mxtk_home_id')?.value || 'guest'
  const doc = await loadHome(id)
  return (
    <div className="main-container mx-auto max-w-7xl p-4">
      <WidgetGrid doc={doc} />
    </div>
  )
}


