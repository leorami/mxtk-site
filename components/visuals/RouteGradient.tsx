'use client';
import { usePathname } from 'next/navigation';
import type { Variant } from './MineralBackground';

export function variantFromPathname(pathname: string | null): Variant {
  const p = (pathname || '/').toLowerCase();
  // Works with or without a base path like /mxtk
  if (p.includes('/owners')) return 'owners';
  if (p.includes('/transparency')) return 'transparency';
  if (p.includes('/institutions')) return 'institutions';
  if (p.includes('/whitepaper')) return 'whitepaper';
  if (p.includes('/roadmap')) return 'roadmap';
  if (p.includes('/mxtk-cares') || p.includes('/cares')) return 'cares';
  if (p.includes('/media')) return 'media';
  if (p.includes('/faq')) return 'faq';
  if (p.includes('/resources')) return 'resources';
  if (p.includes('/contact')) return 'contact';
  if (p.includes('/the-team')) return 'team';
  return 'home';
}

export function useRouteVariant(): Variant {
  const pathname = usePathname();
  return variantFromPathname(pathname);
}
