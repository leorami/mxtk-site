/**
 * Dynamic base path detection for simultaneous local + proxy support
 */

/**
 * Detect if we're running behind the /mxtk proxy
 * Uses headers on server-side, pathname on client-side
 */
export function detectBasePath(): string {
  if (typeof window === 'undefined') {
    // Server-side: check if we have proxy headers
    try {
      // In Next.js middleware, we can access headers
      const { headers } = require('next/headers')
      const headersList = headers()
      const forwardedPrefix = headersList.get('x-forwarded-prefix')
      if (forwardedPrefix === '/mxtk') {
        return '/mxtk'
      }
    } catch (e) {
      // Headers not available, assume direct access
    }
    return ''
  }
  
  const pathname = window.location.pathname
  // If pathname starts with /mxtk, we're behind proxy
  if (pathname.startsWith('/mxtk')) {
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
  if (typeof window === 'undefined') return ''
  return detectBasePath()
}

/**
 * Get API path with base path awareness (for fetch requests)
 */
export function getApiPath(path: string): string {
  return getBasePathUrl(path)
}
