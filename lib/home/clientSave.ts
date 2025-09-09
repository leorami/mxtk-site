// lib/home/clientSave.ts
import { getApiPath } from '@/lib/basepath';

type SavePayload = { id: string; widgets: Array<{ id: string; pos?: { x: number; y: number }; size?: { w: number; h: number } }> }

// Simple debounce for client-side saves
export function debouncedSave(docId: string) {
    let timeout: ReturnType<typeof setTimeout> | null = null
    let pendingSave: SavePayload | null = null

    return async function save(payload: SavePayload) {
        pendingSave = payload

        if (timeout) clearTimeout(timeout)

        timeout = setTimeout(async () => {
            if (!pendingSave) return

            try {
                await fetch(getApiPath(`/api/ai/home/${encodeURIComponent(docId)}`), {
                    method: 'PATCH',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(pendingSave)
                })
            } catch (e) {
                console.error('Failed to save home doc', e)
            }

            pendingSave = null
            timeout = null
        }, 500)
    }
}