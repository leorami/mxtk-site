'use client';

import cn from "classnames";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useBasePath } from '@/lib/basepath';

type Variant =
  | "home"
  | "dashboard"
  | "owners"
  | "institutions"
  | "transparency"
  | "whitepaper"
  | "elitedrop"
  | "careers"
  | "roadmap"
  | "media"
  | "ecosystem"
  | "faq"
  | "resources"
  | "contact"
  | "team";

const MAP: Record<Variant, string> = {
  home: "home_gold.jpg",
  dashboard: "home_gold.jpg", // Using home background for dashboard
  owners: "owners_citrine.jpg",
  institutions: "institutions_lapis.jpg",
  transparency: "transparency_tigereye.jpg",
  whitepaper: "whitepaper_obsidian.jpg",
  elitedrop: "elitedrop_jade.jpg",
  careers: "careers_amber.jpg",
  roadmap: "roadmap_copper.jpg",
  media: "media_onyx.jpg",
  ecosystem: "ecosystem_jade.jpg",
  faq: "faq_quartz.jpg",
  resources: "resources_hematite.jpg",
  contact: "contact_diamond.jpg",
  team: "team_sapphire.jpg",
};

export default function BackgroundPhoto({
  variant,
  className = "",
  opacity = 1,
}: {
  variant: Variant;
  className?: string;
  opacity?: number; // 0–1 in case we ever need a dimmer
}) {
  const file = MAP[variant];
  const basePath = useBasePath();
  const src = file ? `${basePath}/art/photos/${file}` : "";

  // Render the fixed background via a portal so it doesn't become the
  // first child in the route segment (avoids Next auto-scroll warning).
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-x-0 top-[var(--nav-height,theme(spacing.14))] bottom-[var(--footer-height,theme(spacing.20))] -z-10",
        className
      )}
      suppressHydrationWarning
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="block w-full h-full object-cover"
          style={{ opacity }}
          loading="eager"
          decoding="async"
        />
      ) : (
        <div className="w-full h-full bg-[radial-gradient(1200px_600px_at_50%_-200px,rgba(255,184,77,.35),transparent),linear-gradient(180deg,rgba(0,0,0,.05),transparent)] dark:bg-[radial-gradient(1200px_600px_at_50%_-200px,rgba(88,120,255,.18),transparent),linear-gradient(180deg,rgba(255,255,255,.04),transparent)]" />
      )}
    </div>,
    document.body
  );
}
