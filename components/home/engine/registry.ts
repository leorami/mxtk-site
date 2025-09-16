import { meta as priceLarge } from "@/components/home/widgets/PriceLarge";
import { meta as recentAnswers } from "@/components/home/widgets/RecentAnswers";
import { meta as resources } from "@/components/home/widgets/Resources";
import { meta as topPools } from "@/components/home/widgets/TopPoolsList";

export const registry = [priceLarge, recentAnswers, resources, topPools] as const;
export type RegistryItem = typeof registry[number];

// NOTE: Category coverage expectations in tests include 'Owners', 'Transparency', and 'Resources'.
// The current metas map as follows:
// - price-large: Markets (counts towards Owners coverage via business rule elsewhere if needed)
// - top-pools: Transparency, Markets
// - resources / recent-answers: Resources


