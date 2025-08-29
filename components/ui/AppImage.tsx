'use client';

import { usePublicPath } from '@/lib/routing/getPublicPathClient';
import Image, { ImageProps } from 'next/image';

/**
 * AppImage wraps Next/Image with:
 * - SSR-safe base path prefixing via getPublicPath
 * - unoptimized mode (to avoid optimizer 400s in proxied /mxtk)
 *
 * Usage: exactly like <Image />, but `src` is relative to /public.
 * Example: <AppImage src="organizations/persona.png" alt="Persona" width={128} height={128} />
 */
export default function AppImage(props: Omit<ImageProps, 'src'> & { src: string }) {
  const { src, ...rest } = props;
  const url = usePublicPath(src);
  return <Image {...rest} src={url} unoptimized />;
}


