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
  const raw = String(path || '').trim();

  // 1) Absolute URLs are passed through
  if (/^https?:\/\//i.test(raw)) return raw;

  // 2) Determine current base path (client: detect; server: env)
  let basePath = '';
  try {
    if (typeof window !== 'undefined') {
      // Lazy import to avoid cyclic deps during build
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { detectBasePath } = require('./basepath');
      basePath = (detectBasePath() || '').trim();
    } else {
      basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim();
    }
  } catch {
    basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim();
  }

  // Normalize basePath to '/segment' or '' (no trailing slash)
  if (basePath.endsWith('/')) basePath = basePath.replace(/\/+$/, '');

  // 3) If already basePath + /api/*, return as-is (avoid double-prefix)
  if (basePath && (raw === `${basePath}/api` || raw.startsWith(`${basePath}/api/`))) {
    return raw;
  }

  // 4) If already starts with '/api', just prefix basePath
  if (raw === '/api' || raw.startsWith('/api/')) {
    return `${basePath}${raw}`;
  }

  // 5) Strip any accidental leading basePath from provided path
  let working = raw;
  if (basePath && working.startsWith(basePath + '/')) {
    working = working.slice(basePath.length);
  }

  // 6) Normalize path by removing leading slashes and any 'api/' prefix
  working = working.replace(/^\/+/, '');
  if (working.startsWith('api/')) {
    working = working.slice(4);
  }

  // 7) Build final URL: basePath + /api + /rest
  return `${basePath}/api${working ? `/${working}` : ''}`;
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
