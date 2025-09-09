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
  let basePath = '';
  try {
    basePath = useBasePath() || '';
  } catch {
    basePath = '';
  }

  // Ensure src starts with / for public assets
  const normalizedSrc = src.startsWith('/') ? src : `/${src}`;

  // Apply base path to public assets
  const basePathAwareSrc = `${basePath}${normalizedSrc}`;

  // Let Next.js Image component handle the rest
  // Add width="auto" or height="auto" to maintain aspect ratio when one dimension is modified
  const imageProps = { ...rest };

  // If only one dimension (width or height) is specified, set the other to "auto"
  if (imageProps.width && !imageProps.height) {
    imageProps.height = "auto" as any;
  } else if (imageProps.height && !imageProps.width) {
    imageProps.width = "auto" as any;
  }

  return <Image {...imageProps} src={basePathAwareSrc} unoptimized />;
}


