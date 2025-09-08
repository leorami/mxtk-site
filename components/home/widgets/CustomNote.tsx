"use client";
import { getApiUrl } from '@/lib/api';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function CustomNote({ widgetId }: { widgetId?: string }) {
    const [note, setNote] = useState('');
    const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('mxtk_home_note');
            if (raw) setNote(raw);
        } catch { }
    }, []);

    const debouncedSave = useCallback((value: string) => {
        if (timer.current) clearTimeout(timer.current);
        setStatus('saving');
        timer.current = setTimeout(async () => {
            try {
                let homeId: string | null = null;
                try { homeId = localStorage.getItem('mxtk_home_id'); } catch { }
                if (!homeId || !widgetId) { setStatus('error'); return; }
                const res = await fetch(getApiUrl(`/ai/home/${encodeURIComponent(homeId)}`), {
                    method: 'PATCH',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ widgets: [{ id: widgetId, data: { note: value } }] })
                });
                if (!res.ok) throw new Error('save failed');
                try { localStorage.setItem('mxtk_home_note', value); } catch { }
                setStatus('saved');
            } catch {
                setStatus('error');
            }
        }, 600);
    }, [widgetId]);

    return (
        <div>
            <textarea
                className="w-full min-h-[120px] rounded-lg border p-2 bg-white text-slate-900 placeholder:text-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:border-white/10"
                placeholder="Write a short note…"
                value={note}
                onChange={(e) => { setNote(e.target.value); debouncedSave(e.target.value); }}
            />
            <div className="mt-1 text-xs opacity-70" aria-live="polite">
                {status === 'saving' && 'Saving…'}
                {status === 'saved' && 'Saved'}
                {status === 'error' && 'Could not save'}
            </div>
        </div>
    );
}


