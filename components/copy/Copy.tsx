"use client";
import { useExperience } from "@/components/experience/ClientExperience";
import { careersCopy } from "@/copy/careers";
import { contactCopy } from "@/copy/contact";
import { dashboardCopy } from "@/copy/dashboard";
import { faqCopy } from "@/copy/faq";
import { homeCopy } from "@/copy/home";
import { institutionsCopy } from "@/copy/institutions";
import { disclosuresCopy } from "@/copy/legal/disclosures";
import { privacyCopy } from "@/copy/legal/privacy";
import { termsCopy } from "@/copy/legal/terms";
import { mediaCopy } from "@/copy/media";
import { mxtkCaresCopy } from "@/copy/mxtkCares";
import { ownersCopy } from "@/copy/owners";
import { resourcesCopy } from "@/copy/resources";
import { roadmapCopy } from "@/copy/roadmap";
import { teamCopy } from "@/copy/team";
import { transparencyCopy } from "@/copy/transparency";
import { whitepaperCopy } from "@/copy/whitepaper";

const registry = {
  home: homeCopy,
  dashboard: dashboardCopy,
  owners: ownersCopy,
  institutions: institutionsCopy,
  transparency: transparencyCopy,
  whitepaper: whitepaperCopy,
  careers: careersCopy,
  "mxtk-cares": mxtkCaresCopy,
  roadmap: roadmapCopy,
  media: mediaCopy,
  resources: resourcesCopy,
  faq: faqCopy,
  team: teamCopy,
  contact: contactCopy,
  terms: termsCopy,
  privacy: privacyCopy,
  disclosures: disclosuresCopy,
  // owners: ownersCopy, institutions: institutionsCopy (later)
};

export function useCopy(page: keyof typeof registry) {
  const { mode } = useExperience();
  const pageCopy = registry[page];
  return { mode, pageCopy };
}


