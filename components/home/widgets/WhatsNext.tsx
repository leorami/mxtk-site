"use client";
import IconCard from '@/components/ui/IconCard';
import { getApiPath } from '@/lib/basepath';
import { useEffect, useMemo, useState } from 'react';

type Item = { title: string; href: string; reason: string; score: number }

export default function WhatsNext() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [guideOpen, setGuideOpen] = useState<boolean>(false)

  const docId = useMemo(() => {
    try {
      const m = document.cookie.match(/(?:^|; )mxtk_home_id=([^;]+)/)
      return m ? decodeURIComponent(m[1]) : 'default'
    } catch { return 'default' }
  }, [])

  // Track guide-open to gate controls
  useEffect(() => {
    try { setGuideOpen(document.documentElement.classList.contains('guide-open')) } catch {}
    const root = document.documentElement
    const mo = new MutationObserver(() => {
      try { setGuideOpen(root.classList.contains('guide-open')) } catch {}
    })
    mo.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => mo.disconnect()
  }, [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(getApiPath(`/api/ai/recommendations?doc=${encodeURIComponent(docId)}&limit=5`), { cache: 'no-store' })
        const data = await res.json().catch(() => null)
        if (!res.ok || !data) throw new Error('Bad response')
        if (!alive) return
        setItems(Array.isArray(data.items) ? data.items : [])
      } catch (e: any) {
        if (!alive) return
        setItems([
          { title: 'Resources', href: '/resources', reason: 'Authoritative internal link', score: 0.1 },
          { title: 'FAQ', href: '/faq', reason: 'Authoritative internal link', score: 0.1 },
          { title: 'Transparency', href: '/transparency', reason: 'Authoritative internal link', score: 0.1 },
        ])
        setError(null)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [docId])
  const suggestions = [
    {
      title: "Explore the whitepaper",
      description: "Learn about the technical foundations of MXTK",
      link: "/whitepaper"
    },
    {
      title: "Understand transparency",
      description: "See how MXTK ensures trust through transparent operations",
      link: "/transparency"
    },
    {
      title: "Browse resources",
      description: "Access guides, tutorials, and reference materials",
      link: "/resources"
    }
  ];

  return (
    <div className="p-2">
      <IconCard faIcon="fa-compass" iconColorClass="text-teal-600" title="What's Next" badges={[{ label: 'All resources', href: '/resources', faIcon: 'fa-arrow-up-right-from-square' }]}> 
        <div className="text-sm mb-2">Suggested next steps for your journey:</div>
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li key={`${it.href}:${i}`} className="border border-[var(--border-soft)] rounded-lg p-2 hover:bg-[var(--surface-elev-1)] transition-colors">
              <a href={it.href} className="block">
                <div className="font-medium">{it.title}</div>
                <div className="text-xs opacity-80">{it.reason}</div>
              </a>
            </li>
          ))}
        </ul>
        {guideOpen && items.length > 0 && (
          <div className="pt-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={async () => {
                try {
                  const r = await fetch(getApiPath('/api/ai/home/pin'), {
                    method: 'POST', headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ id: docId, widget: { type: 'whats-next', title: '', size: { w: 4, h: 12 } } })
                  })
                  if (r.ok) {
                    await fetch(getApiPath('/api/ai/signals'), { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: `${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`, ts: Date.now(), kind: 'pin', docId }) })
                  }
                } catch {}
              }}
            >
              Pin to Home
            </button>
          </div>
        )}
      </IconCard>
    </div>
  );
}
