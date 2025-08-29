"use client";
import { usePublicPath } from "@/lib/routing/getPublicPathClient";

type PageKey =
  | "home" | "owners" | "institutions" | "transparency"
  | "whitepaper" | "elitedrop" | "careers" | "roadmap"
  | "media" | "ecosystem" | "faq" | "resources"
  | "contact" | "team";

const MAP: Record<PageKey, string> = {
  home:         "art/photos/home_gold.jpg",
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
  const src = usePublicPath(MAP[page]);
  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      <img src={src} alt="" className="w-full h-full object-cover" />
    </div>
  );
}


