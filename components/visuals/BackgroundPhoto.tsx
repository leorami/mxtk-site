'use client';
import { usePublicPath } from '@/lib/routing/getPublicPathClient';
import cn from 'classnames';

export default function BackgroundPhoto({
  variant = 'home',
  height = 'calc(100dvh - var(--nav-height) - var(--footer-overlap,0px))',
  className = '',
}: {
  variant?: 'home';
  height?: string;
  className?: string;
}) {
  const light = usePublicPath(`art/${variant}/${variant}_bg_light.jpg`);
  const dark  = usePublicPath(`art/${variant}/${variant}_bg_dark.jpg`);
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-x-0 z-0',
        // pin between top nav and footer; we assume header is sticky at the top
        'top-[var(--nav-height,56px)]',
        className
      )}
      style={{ height }}
    >
      <picture className="absolute inset-0 block w-full h-full">
        <source srcSet={dark} media="(prefers-color-scheme: dark)" />
        <img
          src={light}
          alt=""
          decoding="async"
          loading="lazy"
          className="block w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        />
      </picture>
      {/* gentle vignette + wash so glass stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/[.06] via-transparent to-black/[.06] dark:from-black/[.18] dark:to-black/[.18]" />
    </div>
  );
}


