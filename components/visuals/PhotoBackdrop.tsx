"use client";

import AppImage from '@/components/ui/AppImage';
import cn from "classnames";

export default function PhotoBackdrop({ src, className = "", opacity = 1 }: { src: string; className?: string; opacity?: number }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 top-[var(--nav-height,theme(spacing.14))] bottom-[var(--footer-height,theme(spacing.20))] -z-10",
        className
      )}
      suppressHydrationWarning
    >
      <AppImage src={src} alt="" fill className="object-cover" style={{ opacity }} priority />
    </div>
  );
}


