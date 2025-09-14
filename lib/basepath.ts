/**
 * Dynamic base path detection for simultaneous local + proxy support
 */

/**
 * Detect if we're running behind the /mxtk proxy
 * Uses environment variable on server-side, pathname on client-side
 */
export function detectBasePath(): string {
  if (typeof window === 'undefined') {
    // Server-side: avoid dynamic APIs here; use env only.
    return process.env.NEXT_PUBLIC_BASE_PATH || ''
  }
  
  // Client-side: prefer the public env if provided (Next exposes NEXT_PUBLIC_* at build time)
  const envBase = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim()
  if (envBase) {
    return envBase
  }

  const pathname = window.location.pathname
  // Consider base path only when the first path segment is exactly 'mxtk'
  // This avoids false positives for routes like '/mxtk-cares'
  const firstSegment = pathname.split('/').filter(Boolean)[0] || ''
  if (firstSegment === 'mxtk') {
    return '/mxtk'
  }
  return ''
}

/**
 * Get base path aware URL for links
 */
export function getBasePathUrl(path: string): string {
  const basePath = detectBasePath()
  
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  
  return `${basePath}${path}`
}

/**
 * Hook for React components to get current base path
 */
export function useBasePath(): string {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable
    return process.env.NEXT_PUBLIC_BASE_PATH || ''
  }
  return detectBasePath()
}

/**
 * Get API path with base path awareness (for fetch requests)
 */
export function getApiPath(path: string): string {
  return getBasePathUrl(path)
}
