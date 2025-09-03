/**
 * Simple API helper with relative URLs
 * Infrastructure (proxy, CDN, etc.) handles path rewriting transparently
 */

/**
 * Get the API URL for a given path using simple relative URLs
 * 
 * @param path - API path like '/health', 'token/summary', or '/api/pools'
 * @returns API URL like '/api/health'
 */
export function getApiUrl(path: string): string {
  // Normalize the path - remove leading slashes and 'api/' prefix if present
  let normalizedPath = path.replace(/^\/+/, '');
  if (normalizedPath.startsWith('api/')) {
    normalizedPath = normalizedPath.slice(4);
  }
  
  // Ensure we have a leading slash on the path part
  if (normalizedPath && !normalizedPath.startsWith('/')) {
    normalizedPath = `/${normalizedPath}`;
  }
  
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}/api${normalizedPath}`;
}

/**
 * Lightweight fetch wrapper with automatic API URL generation
 * Includes ngrok header to skip browser warnings
 * 
 * @param path - API path 
 * @param init - fetch RequestInit options
 * @returns Promise resolving to parsed JSON response
 */
export async function apiGet<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const url = getApiUrl(path);
  
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(init?.headers || {}),
    },
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: GET ${path} (${response.status} ${response.statusText})`);
  }
  
  return response.json() as Promise<T>;
}

/**
 * POST request wrapper
 */
export async function apiPost<T = unknown>(path: string, data?: any, init?: RequestInit): Promise<T> {
  const url = getApiUrl(path);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(init?.headers || {}),
    },
    body: data ? JSON.stringify(data) : undefined,
    ...init,
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: POST ${path} (${response.status} ${response.statusText})`);
  }
  
  return response.json() as Promise<T>;
}

/**
 * PUT request wrapper
 */
export async function apiPut<T = unknown>(path: string, data?: any, init?: RequestInit): Promise<T> {
  const url = getApiUrl(path);
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(init?.headers || {}),
    },
    body: data ? JSON.stringify(data) : undefined,
    ...init,
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: PUT ${path} (${response.status} ${response.statusText})`);
  }
  
  return response.json() as Promise<T>;
}

/**
 * DELETE request wrapper  
 */
export async function apiDelete<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const url = getApiUrl(path);
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(init?.headers || {}),
    },
    ...init,
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: DELETE ${path} (${response.status} ${response.statusText})`);
  }
  
  return response.json() as Promise<T>;
}
