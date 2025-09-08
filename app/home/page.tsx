"use client"
import { useEffect, useMemo, useState } from 'react'
import Grid from '@/components/home/Grid'
import StarterPanel from '@/components/home/StarterPanel'
import PageTheme from '@/components/theme/PageTheme'
import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import Card from '@/components/ui/Card'
import PageBackground from '@/components/visuals/PageBackground'
import { getApiPath } from '@/lib/basepath'

type HomeDoc = { id: string; widgets: any[]; layoutVersion: 1 }

export default function Page() {
  const [homeId, setHomeId] = useState<string | undefined>(undefined)
  const [widgets, setWidgets] = useState<any[]>([])

  useEffect(() => {
    try {
      const cookie = document.cookie.split('; ').find(x => x.startsWith('mxtk_home_id='))
      const id = cookie ? cookie.split('=')[1] : undefined
      if (id) {
        setHomeId(id)
        fetch(getApiPath(`/api/ai/home/${encodeURIComponent(id)}`), { cache: 'no-store', headers: { 'ngrok-skip-browser-warning': 'true' } })
          .then(r => r.json())
          .then(data => {
            const w = data?.doc?.widgets || data?.widgets || []
            if (Array.isArray(w)) setWidgets(w)
          })
          .catch(() => {})
      }
    } catch {}
  }, [])

  const doc: HomeDoc = useMemo(() => ({ id: homeId || 'guest', widgets, layoutVersion: 1 }), [homeId, widgets])
  const hasWidgets = widgets.length > 0

  return (
    <PageTheme ink="light" lift="H" glass="soft">
      <PageBackground page="home" />
      <PageHero>
        <SectionWrapper index={0} className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Home</h1>
          <p className="text-xl max-w-3xl mx-auto">
            {hasWidgets ? 'Pin helpful widgets, drag to arrange, and resize as you learn.' : 'Your Home is empty. Add a starter widget or ask Sherpa to help.'}
          </p>
        </SectionWrapper>
        <SectionWrapper index={1}>
          <Card tint="amber">
            <div className="section-title mb-4">
              <h2 className="text-2xl font-semibold">Your Home</h2>
              <p className="section-sub">Pin helpful widgets, drag to arrange, and resize as you learn. Use the buttons below or ask the AI Guide for suggestions.</p>
            </div>
            <div className="section-body">
              {hasWidgets ? (
                <Grid doc={doc} />
              ) : (
                <StarterPanel homeId={homeId} />
              )}
            </div>
          </Card>
        </SectionWrapper>
      </PageHero>
    </PageTheme>
  )
}



