type Entry<T> = { value: T; exp: number }
const store = new Map<string, Entry<any>>()

export function getCached<T>(key: string): T | null {
    const hit = store.get(key)
    if (!hit) return null
    if (Date.now() > hit.exp) { store.delete(key); return null }
    return hit.value as T
}

export function setCached<T>(key: string, value: T, ttlSeconds: number) {
    store.set(key, { value, exp: Date.now() + ttlSeconds * 1000 })
}

// Tiny helper to fetch-and-cache with TTL in milliseconds
export async function getOrSet<T>(key: string, ttlMs: number, loader: () => Promise<T> | T): Promise<T> {
    const existing = getCached<T>(key)
    if (existing !== null) return existing
    const value = await loader()
    setCached<T>(key, value, Math.max(0, Math.floor(ttlMs / 1000)))
    return value
}
