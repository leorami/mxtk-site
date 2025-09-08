"use client";
import { getApiPath } from '@/lib/basepath';
import { useEffect, useRef, useState } from 'react';

export default function UnitTestConsole() {
    const [tail, setTail] = useState('')
    const [status, setStatus] = useState('idle')
    const timer = useRef<any>(null)

    const refresh = async () => {
        const res = await fetch(getApiPath('/api/tests/unit'), { cache: 'no-store' })
        const j = await res.json().catch(() => ({ ok: false }))
        if (j.ok) { setTail(j.tail || ''); setStatus(j.status || 'idle') }
    }

    const start = async () => {
        await fetch(getApiPath('/api/tests/unit'), { method: 'POST' })
        setStatus('running')
        if (timer.current) clearInterval(timer.current)
        timer.current = setInterval(refresh, 1000)
    }

    useEffect(() => { refresh(); const t = setInterval(refresh, 3000); return () => clearInterval(t) }, [])

    return (
        <div className="rounded-xl border border-neutral-300 dark:border-neutral-700 p-3 bg-[var(--surface-card,#ffffff)]/90 dark:bg-[var(--surface-card,#0b0e12)]/60">
            <div className="mb-2 flex items-center gap-2">
                <button onClick={start} className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-50" disabled={status === 'running'}>Run Unit Tests</button>
                <span className="text-xs opacity-90 text-neutral-800 dark:text-neutral-200">Status: {status}</span>
            </div>
            <pre className="text-xs whitespace-pre-wrap max-h-80 overflow-auto p-2 bg-black text-green-200 rounded border border-neutral-700">{tail || 'No logs yet'}</pre>
        </div>
    )
}


