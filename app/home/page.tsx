import 'server-only'
import { cookies } from 'next/headers'
import { getApiUrl } from '@/lib/api'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const c = await cookies()
  const id = c.get('mxtk_home_id')?.value

  let initialDoc: any | undefined
  if (id) {
    try {
      const res = await fetch(getApiUrl(`/ai/home/${id}`), { cache: 'no-store', headers: { 'ngrok-skip-browser-warning': 'true' } })
      if (res.ok) {
        const json = await res.json()
        initialDoc = json?.doc
      }
    } catch {}
  }

  return (
    <div className="main-container mx-auto max-w-7xl p-4">
      {id && initialDoc ? (
        // Client will hydrate and enhance
        // @ts-expect-error Async boundary not needed
        <HomeClient id={id} initialDoc={initialDoc} />
      ) : (
        <>
          <div className="rounded-2xl border p-6 text-center text-sm opacity-70">Your Home will appear here</div>
          {/* @ts-expect-error Async boundary not needed */}
          <HomeClient />
        </>
      )}
    </div>
  )
}

// @ts-expect-error RSC importing client component
import HomeClient from '@/components/home/HomeClient'


