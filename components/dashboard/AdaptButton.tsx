'use client'

import { useCopy } from '@/components/copy/Copy'
import { getApiUrl } from '@/lib/api'
import * as React from 'react'

export default function AdaptButton({ docId = 'default' }: { docId?: string }) {
  const { mode } = useCopy('dashboard')
  const modeLabel = mode === 'learn' ? 'Learn' : mode === 'build' ? 'Build' : 'Operate'

  const onAdapt = React.useCallback(async () => {
    try {
      await fetch(getApiUrl('/ai/home/seed'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: docId, mode, adapt: true })
      })
      window.dispatchEvent(new CustomEvent('mxtk-dashboard-refresh', { detail: { source: 'adapt', mode } }))
    } catch {}
  }, [docId, mode])

  return (
    <button data-testid="adapt-btn" onClick={onAdapt} className="btn-primary" style={{ '--accent': 'var(--mxtk-orange)' } as React.CSSProperties}>
      {`Adapt Home to ${modeLabel}`}
    </button>
  )
}


