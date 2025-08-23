
// Base path detection for custom assets (conditional based on environment)
export function isExternalAccess(): boolean {
  if (typeof window === 'undefined') {
    // Server-side: For now, always return false to match client-side behavior on localhost
    // This prevents hydration mismatches where server thinks it's external but client doesn't
    return false;
  }
  // Client-side: check if we're on the ngrok domain
  return window.location.hostname.includes('ngrok.app') || 
         window.location.hostname.includes('ngrok.io') ||
         window.location.hostname.includes('ngrok-free.app');
}

export function getBasePath(): string {
  return isExternalAccess() ? '/mxtk' : '';
}

export function withBase(path: string): string {
  const base = getBasePath();
  if (!base) return path;
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Avoid double /mxtk/mxtk/
  if (normalizedPath.startsWith('/mxtk/')) {
    return normalizedPath;
  }
  
  return `${base}${normalizedPath}`;
}

export function stripBase(path: string): string {
  const base = getBasePath();
  if (!base) return path;
  
  // Remove base path if present
  if (path.startsWith(base)) {
    return path.slice(base.length) || '/';
  }
  
  return path;
}


