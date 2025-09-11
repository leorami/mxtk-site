'use client'
import { useCopy } from '@/components/copy/Copy'
import type { HomeDoc, SectionState } from '@/lib/home/types'
import * as React from 'react'
import Grid from './Grid'

function api(path: string) {
  return (globalThis as any).__mx_basePath ? `${(globalThis as any).__mx_basePath}${path}` : path
}

type Props = { initialDocId?: string; initialDoc?: HomeDoc | null }

export default function DashboardContent({ initialDocId = 'default', initialDoc = null }: Props) {
  const { mode } = useCopy('dashboard')
  const [doc, setDoc] = React.useState<HomeDoc | null>(initialDoc)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [retryCount, setRetryCount] = React.useState(0)

  const sections: SectionState[] = React.useMemo(
    () => (Array.isArray(doc?.sections) ? (doc!.sections as SectionState[]) : []),
    [doc]
  )

  const loadData = React.useCallback(async (forceRetry = false) => {
    if (forceRetry) {
      setRetryCount(count => count + 1)
    }
    
    setLoading(true)
    setError(null)
    
    try {
      // 1) Try GET
      let res = await fetch(api(`/api/ai/home/${initialDocId}`), { 
        cache: 'no-store',
        headers: { 'x-retry-count': retryCount.toString() }
      })
      
      if (res.status === 404) {
        // 2) Seed, then GET
        console.log('Dashboard: Home not found, seeding...')
        const seeded = await fetch(api(`/api/ai/home/seed`), {
          method: 'POST',
          headers: { 
            'content-type': 'application/json',
            'x-retry-count': retryCount.toString()
          },
          body: JSON.stringify({ id: initialDocId, mode })
        })
        
        if (!seeded.ok) {
          const errorData = await seeded.json().catch(() => ({ error: 'Unknown error' }))
          console.error('Dashboard: Seed failed', errorData)
          setError(`Failed to seed dashboard: ${errorData.error || 'Unknown error'}`)
          setLoading(false)
          return
        }
        
        // Get the seeded data directly from the seed response
        const seedData = await seeded.json().catch(() => null)
        if (seedData && !seedData.error) {
          console.log('Dashboard: Seed successful')
          setDoc(seedData)
          setLoading(false)
          return
        }
        
        // If we couldn't get data from seed response, try GET again
        console.log('Dashboard: Trying GET after seed')
        res = await fetch(api(`/api/ai/home/${initialDocId}`), { 
          cache: 'no-store',
          headers: { 'x-retry-count': retryCount.toString() }
        })
      }
      
      if (!res.ok) {
        console.error(`Dashboard: GET failed ${res.status}`)
        setError(`Failed to load dashboard: ${res.status} ${res.statusText}`)
        setLoading(false)
        return
      }
      
      const j = await res.json().catch(() => null)
      if (j && !j.error) {
        console.log('Dashboard: GET successful')
        setDoc(j)
      } else {
        console.error('Dashboard: Invalid data', j)
        setError(`Invalid dashboard data: ${j?.error || 'Unknown format'}`)
      }
    } catch (err) {
      console.error('Dashboard: Error', err)
      setError(`Dashboard error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }, [initialDocId, mode, retryCount])

  React.useEffect(() => {
    let alive = true
    
    // Load data and set state only if component is still mounted
    loadData().then(() => {
      if (!alive) return
    })
    
    return () => { alive = false }
  }, [loadData])

  // Loading state
  if (loading) {
    return (
      <div className="section-rail">
        {['Overview','Learn','Build','Operate','Library'].map(t => (
          <section key={t} className="glass glass--panel p-4 md:p-6 mb-6 rounded-xl">
            <header className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold opacity-70">{t}</h2>
            </header>
            <div className="h-16 rounded-lg bg-slate-200 dark:bg-slate-700/30 animate-pulse" />
          </section>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="section-rail">
        <section className="glass glass--panel p-4 md:p-6 mb-6 rounded-xl border border-red-300 dark:border-red-800">
          <header className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Dashboard Error</h2>
          </header>
          <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
          <button 
            onClick={() => loadData(true)}
            className="btn btn--pill px-4 py-2 rounded-xl shadow-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
          >
            Reload Dashboard
          </button>
        </section>
      </div>
    )
  }

  // No document state
  if (!doc) {
    return (
      <div className="section-rail">
        {['Overview','Learn','Build','Operate','Library'].map(t => (
          <section key={t} className="glass glass--panel p-4 md:p-6 mb-6 rounded-xl">
            <header className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold opacity-70">{t}</h2>
            </header>
            <div className="h-16 rounded-lg opacity-40" />
          </section>
        ))}
      </div>
    )
  }

  // Render the dashboard
  return (
    <div className="section-rail">
      {sections.map((sec) => {
        const widgets = doc.widgets.filter(w => w.sectionId === sec.id)
        return (
          <section id={sec.id} key={sec.id} className="glass glass--panel p-4 md:p-6 mb-6 rounded-xl">
            <header className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">{sec.title}</h2>
              <button className="text-sm opacity-70 hover:opacity-100">Collapse</button>
            </header>
            <Grid doc={{ ...doc, widgets }} />
          </section>
        )
      })}
    </div>
  )
}