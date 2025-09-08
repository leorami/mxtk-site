'use client'
import { getApiUrl } from '@/lib/api'
import { getApiPath } from '@/lib/basepath'
import { useState } from 'react'

export default function StarterPanel({ homeId }: { homeId?: string }) {
    const [loading, setLoading] = useState<string | null>(null)

    async function add(kind: string) {
        setLoading(kind)
        try {
            const res = await fetch(getApiUrl('/ai/home/add'), {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ homeId, widget: { type: kind } })
            })
            if (res.ok) location.assign(getApiPath('/home'))
        } finally { setLoading(null) }
    }

    async function seed(level: 'learn' | 'build' | 'operate') {
        setLoading(level)
        try {
            const res = await fetch(getApiUrl('/ai/home/seed'), {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level, homeId })
            })
            if (res.ok) location.assign(getApiPath('/home'))
        } finally { setLoading(null) }
    }

    const fireGuide = () => {
        try {
            document.documentElement.classList.add('guide-open')
            window.dispatchEvent(new CustomEvent('mxtk:guide:prefill', { detail: { prompt: 'Help me set up my Home with the right widgets.' } }))
        } catch { }
    }

    return (
        <div className="starter-panel">
            <p className="starter-hint">Your Home is empty. Add a starter widget or ask Sherpa to help.</p>
            <div className="chip-row">
                <button className="chip" onClick={() => add('recent-answers')} disabled={loading !== null}>{loading === 'recent-answers' ? '…' : 'Recent Answers'}</button>
                <button className="chip" onClick={() => add('glossary-spotlight')} disabled={loading !== null}>{loading === 'glossary-spotlight' ? '…' : 'Glossary'}</button>
                <button className="chip" onClick={() => add('resource-list')} disabled={loading !== null}>{loading === 'resource-list' ? '…' : 'Resources'}</button>
                <button className="chip" onClick={() => add('custom-note')} disabled={loading !== null}>{loading === 'custom-note' ? '…' : 'Custom Note'}</button>
                <button className="chip primary" onClick={fireGuide}>Ask Sherpa</button>
            </div>
            <div className="chip-row subtle">
                <span className="mr-2 opacity-70">Or start with a preset:</span>
                <button className="chip" onClick={() => seed('learn')} disabled={loading !== null}>{loading === 'learn' ? '…' : 'Learn'}</button>
                <button className="chip" onClick={() => seed('build')} disabled={loading !== null}>{loading === 'build' ? '…' : 'Build'}</button>
                <button className="chip" onClick={() => seed('operate')} disabled={loading !== null}>{loading === 'operate' ? '…' : 'Operate'}</button>
            </div>
        </div>
    )
}


