"use client";

import { useBasePath } from '@/lib/basepath';
import { BasePathContext } from '@/lib/basepathContext';
import Image, { ImageProps } from 'next/image';

/**
 * AppImage wraps Next/Image with:
 * - Base-path-aware URL handling (respects Next.js basePath)
 * - Unoptimized mode (to avoid optimizer issues)
 *
 * Usage: exactly like <Image />, but with unoptimized images
 * Example: <AppImage src="/organizations/persona.png" alt="Persona" width={128} height={128} />
 */
export default function AppImage(props: Omit<ImageProps, 'src'> & { src: string }) {
  const { src, ...rest } = props;

  // Build basePath-aware absolute src. Avoid directory-valued inputs by requiring a file path.
  const ctxBasePath = (() => {
    try {
      // Lazily access context only in client
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const React = require('react');
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const useContext = React.useContext;
      return useContext ? (useContext(BasePathContext) || '') : '';
    } catch {
      return '';
    }
  })();
  // Prefer server-advertised base path (via css var) to avoid hydration mismatches
  let basePath = (process.env.NEXT_PUBLIC_BASE_PATH || ctxBasePath || '').trim();
  try {
    if (typeof document !== 'undefined') {
      const cssBase = getComputedStyle(document.documentElement).getPropertyValue('--asset-base')?.trim();
      if (cssBase) basePath = cssBase;
    }
  } catch {}
  if (!basePath) { try { basePath = useBasePath() || '' } catch { basePath = '' } }
  const leaf = src.startsWith('/') ? src : `/${src}`;
  const href = `${basePath || ''}${leaf}`;

  return <Image {...rest} src={href} unoptimized />;
}


