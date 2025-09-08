"use client";
import { getBasePathUrl } from '@/lib/basepath';

export default function CopyFactsJsonButton() {
    async function onClick() {
        try {
            const url = getBasePathUrl('/api/ai/facts');
            const res = await fetch(url);
            const text = await res.text();
            await navigator.clipboard.writeText(text);
        } catch { }
    }
    return (
        <button onClick={onClick} className="px-3 py-1 rounded-md border border-neutral-300 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Copy JSON</button>
    );
}


