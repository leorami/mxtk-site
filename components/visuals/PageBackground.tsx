"use client";

import AppImage from '@/components/ui/AppImage';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type PageKey =
  | "home" | "dashboard" | "owners" | "institutions" | "transparency"
  | "whitepaper" | "elitedrop" | "careers" | "roadmap"
  | "media" | "ecosystem" | "faq" | "resources"
  | "contact" | "team";

const MAP: Record<PageKey, string> = {
  home:         "art/photos/home_gold.jpg",
  dashboard:    "art/photos/home_gold.jpg", // Using home background for dashboard
  owners:       "art/photos/owners_citrine.jpg",
  institutions: "art/photos/institutions_lapis.jpg",
  transparency: "art/photos/transparency_tigereye.jpg",
  whitepaper:   "art/photos/whitepaper_obsidian.jpg",
  elitedrop:    "art/photos/elitedrop_jade.jpg",
  careers:      "art/photos/careers_amber.jpg",
  roadmap:      "art/photos/roadmap_copper.jpg",
  media:        "art/photos/media_onyx.jpg",
  ecosystem:    "art/photos/ecosystem_jade.jpg",
  faq:          "art/photos/faq_quartz.jpg",
  resources:    "art/photos/resources_hematite.jpg",
  contact:      "art/photos/contact_diamond.jpg",
  team:         "art/photos/team_sapphire.jpg",
};

export default function PageBackground({ page }: { page: PageKey }) {
  const src = `/${MAP[page] || MAP.home}`; // Fallback to home background if page not found
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted || typeof document === 'undefined') return null
  return createPortal(
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" data-inert="true">
      <AppImage src={src} alt="" fill className="object-cover" />
    </div>,
    document.body
  );
}