// Utility to detect if we're in an external context (via ngrok)
export function isExternalAccess(): boolean {
  if (typeof window === 'undefined') {
    // Server-side: we can't detect external access here
    // We'll rely on the Nginx proxy to handle this
    return false;
  }
  
  // Client-side: check if we're on the ngrok domain
  return window.location.hostname.includes('ngrok.app') || 
         window.location.hostname.includes('ngrok.io') ||
         window.location.hostname.includes('ngrok-free.app');
}

// Get the base path for the current context
export function getBasePath(): string {
  if (isExternalAccess()) {
    return '/mxtk';
  }
  return '';
}

// Add base path to a URL if needed
// Always return the path as-is to avoid hydration mismatches
// The Nginx proxy will handle adding the /mxtk prefix for external access
export function withBase(path: string): string {
  return path;
}

// Remove base path from a URL if present
export function stripBase(path: string): string {
  if (path.startsWith('/mxtk/')) {
    return path.substring(5); // Remove '/mxtk'
  }
  return path;
}

// Server-side detection of external access
export function isExternalAccessFromHeaders(headers: Headers): boolean {
  const host = headers.get('host') || '';
  const referer = headers.get('referer') || '';
  const userAgent = headers.get('user-agent') || '';
  
  return host.includes('ngrok.app') || 
         host.includes('ngrok.io') ||
         host.includes('ngrok-free.app') ||
         referer.includes('ngrok.app') ||
         referer.includes('ngrok.io') ||
         referer.includes('ngrok-free.app') ||
         userAgent.includes('MXTK-Development-Proxy');
}


