type Entry<T> = { value: T; exp: number }
const store = new Map<string, Entry<any>>()
const MAX_ENTRIES = 256

export function getCached<T>(key: string): T | null {
    const hit = store.get(key)
    if (!hit) return null
    if (Date.now() > hit.exp) { store.delete(key); return null }
    // LRU: bump recency by re-inserting
    store.delete(key)
    store.set(key, hit)
    return hit.value as T
}

export function setCached<T>(key: string, value: T, ttlSeconds: number) {
    store.set(key, { value, exp: Date.now() + ttlSeconds * 1000 })
    // Trim if over capacity (delete oldest first)
    while (store.size > MAX_ENTRIES) {
        const oldestKey = store.keys().next().value as string | undefined
        if (!oldestKey) break
        store.delete(oldestKey)
    }
}

// Tiny helper to fetch-and-cache with TTL in milliseconds
export async function getOrSet<T>(key: string, ttlMs: number, loader: () => Promise<T> | T): Promise<T> {
    const existing = getCached<T>(key)
    if (existing !== null) return existing
    const value = await loader()
    setCached<T>(key, value, Math.max(0, Math.floor(ttlMs / 1000)))
    return value
}

export function getRemainingTtlMs(key: string): number {
    const hit = store.get(key)
    if (!hit) return 0
    const remaining = hit.exp - Date.now()
    if (remaining <= 0) { store.delete(key); return 0 }
    return remaining
}

// Diagnostics helpers (dev-only usage recommended)
export function listKeys(): string[] {
    const out: string[] = []
    for (const [k, v] of store.entries()) {
        if (Date.now() <= v.exp) out.push(k)
        else store.delete(k)
    }
    return out
}

export function getCapacity(): number { return MAX_ENTRIES }
