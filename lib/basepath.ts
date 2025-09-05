/**
 * Dynamic base path detection for simultaneous local + proxy support
 */

/**
 * Detect if we're running behind the /mxtk proxy
 * Uses environment variable on server-side, pathname on client-side
 */
export function detectBasePath(): string {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable
    return process.env.NEXT_PUBLIC_BASE_PATH || ''
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
