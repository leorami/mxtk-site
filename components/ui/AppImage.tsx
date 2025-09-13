"use client";

import { useBasePath } from '@/lib/basepath';
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
  const basePath = useBasePath();
  const leaf = src.startsWith('/') ? src : `/${src}`;
  const href = `${basePath || ''}${leaf}`;

  return <Image {...rest} src={href} unoptimized />;
}


