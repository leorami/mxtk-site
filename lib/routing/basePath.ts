export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function withBase(href: string) {
    return `${BASE}${href.startsWith('/') ? href : `/${href}`}`
}

export function stripBase(pathname: string) {
    if (!BASE) return pathname
    return pathname.startsWith(BASE) ? pathname.slice(BASE.length) || '/' : pathname
}


