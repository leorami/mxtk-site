'use client'
import * as React from 'react'
import { useCopy } from '@/components/copy/Copy'
import type { HomeDoc, SectionState } from '@/lib/home/types'
import Grid from './Grid'

function api(path: string) {
  return (globalThis as any).__mx_basePath ? `${(globalThis as any).__mx_basePath}${path}` : path
}

type Props = { initialDocId?: string; initialDoc?: HomeDoc | null }

export default function DashboardContent({ initialDocId = 'default', initialDoc = null }: Props) {
  const { mode } = useCopy('dashboard')
  const [doc, setDoc] = React.useState<HomeDoc | null>(initialDoc)

  const sections: SectionState[] = React.useMemo(
    () => (Array.isArray(doc?.sections) ? (doc!.sections as SectionState[]) : []),
    [doc]
  )

  React.useEffect(() => {
    let alive = true
    ;(async () => {
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
          console.error('home-seed-failed')
          return
        }
        res = await fetch(api(`/api/ai/home/${initialDocId}`), { cache: 'no-store' })
      }
      if (!res.ok) return
      const j = await res.json().catch(() => null)
      if (alive && j) setDoc(j)
    })()
    return () => { alive = false }
  }, [initialDocId, mode])

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