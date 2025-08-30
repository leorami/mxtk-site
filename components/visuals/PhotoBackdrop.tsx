"use client";
import { usePublicPath } from "@/lib/routing/getPublicPathClient";
import cn from "classnames";

export default function PhotoBackdrop({ src, className = "", opacity = 1 }: { src: string; className?: string; opacity?: number }) {
  const imageSrc = usePublicPath(src);
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 top-[var(--nav-height,theme(spacing.14))] bottom-[var(--footer-height,theme(spacing.20))] -z-10",
        className
      )}
    >
      <img src={imageSrc} alt="" className="block w-full h-full object-cover" style={{ opacity }} loading="eager" decoding="async" />
    </div>
  );
}


