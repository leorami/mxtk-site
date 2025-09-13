"use client";
import { useEffect, useMemo, useState } from 'react'
import { getApiPath } from '@/lib/basepath'

type Item = { title: string; href: string; reason: string; score: number }

export default function WhatsNext() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const docId = useMemo(() => {
    try {
      const m = document.cookie.match(/(?:^|; )mxtk_home_id=([^;]+)/)
      return m ? decodeURIComponent(m[1]) : 'default'
    } catch { return 'default' }
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
    <div className="space-y-3">
      <p className="text-sm mb-2">Suggested next steps for your journey:</p>
      <ul className="space-y-2">
        {items.map((it, i) => (
          <li key={`${it.href}:${i}`} className="border border-[var(--border-soft)] rounded-lg p-2 hover:bg-[var(--surface-elev-1)] transition-colors">
            <a href={it.href} className="block">
              <h4 className="font-medium">{it.title}</h4>
              <p className="text-xs opacity-80">{it.reason}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
