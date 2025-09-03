'use client';

import Image, { ImageProps } from 'next/image';

/**
 * AppImage wraps Next/Image with:
 * - Simple relative URL handling (no basePath complexity)
 * - Unoptimized mode (to avoid optimizer issues)
 *
 * Usage: exactly like <Image />, but with unoptimized images
 * Example: <AppImage src="/organizations/persona.png" alt="Persona" width={128} height={128} />
 */
export default function AppImage(props: Omit<ImageProps, 'src'> & { src: string }) {
  const { src, ...rest } = props;

  // Ensure src starts with / for public assets
  const normalizedSrc = src.startsWith('/') ? src : `/${src}`;

  // Use plain root-relative paths; proxy handles external prefixing
  return <Image {...rest} src={normalizedSrc} unoptimized />;
}


