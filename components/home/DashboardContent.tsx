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

  const sections: SectionState[] = React.useMemo(
    () => (Array.isArray(doc?.sections) ? (doc!.sections as SectionState[]) : []),
    [doc]
  )

  React.useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    
    ;(async () => {
      try {
        // 1) Try GET
        let res = await fetch(api(`/api/ai/home/${initialDocId}`), { cache: 'no-store' })
        
        if (res.status === 404) {
          // 2) Seed, then GET
          const seeded = await fetch(api(`/api/ai/home/seed`), {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id: initialDocId, mode })
          })
          
          if (!seeded.ok) {
            const errorData = await seeded.json().catch(() => ({ error: 'Unknown error' }))
            if (alive) {
              setError(`Failed to seed dashboard: ${errorData.error || 'Unknown error'}`)
              setLoading(false)
            }
            return
          }
          
          // Get the seeded data directly from the seed response
          const seedData = await seeded.json().catch(() => null)
          if (alive && seedData && !seedData.error) {
            setDoc(seedData)
            setLoading(false)
            return
          }
          
          // If we couldn't get data from seed response, try GET again
          res = await fetch(api(`/api/ai/home/${initialDocId}`), { cache: 'no-store' })
        }
        
        if (!res.ok) {
          if (alive) {
            setError(`Failed to load dashboard: ${res.status} ${res.statusText}`)
            setLoading(false)
          }
          return
        }
        
        const j = await res.json().catch(() => null)
        if (alive) {
          if (j && !j.error) {
            setDoc(j)
          } else {
            setError(`Invalid dashboard data: ${j?.error || 'Unknown format'}`)
          }
          setLoading(false)
        }
      } catch (err) {
        if (alive) {
          setError(`Dashboard error: ${err instanceof Error ? err.message : String(err)}`)
          setLoading(false)
        }
      }
    })()
    
    return () => { alive = false }
  }, [initialDocId, mode])

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
            onClick={() => window.location.reload()}
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