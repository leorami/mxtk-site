'use client'

import { getApiPath } from '@/lib/routing/basePath'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function useApi<T = any>(url: string, { refreshMs = 30000 } = {}) {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const pathname = usePathname() || '/'

    async function load() {
        try {
            setError(null)
            // Accept both '/api/foo' and 'foo'
            const apiUrl = getApiPath(url, pathname)
            const res = await fetch(apiUrl, { cache: 'no-store' })
            if (!res.ok) throw new Error(await res.text())
            setData(await res.json())
        } catch (e: any) {
            setError(e?.message || 'error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
        if (refreshMs) {
            const t = setInterval(load, refreshMs)
            return () => clearInterval(t)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, pathname])

    return { data, loading, error, reload: load }
}
