export type GradientKey =
  | 'home' | 'owners' | 'transparency' | 'institutions'
  | 'whitepaper' | 'roadmap' | 'cares' | 'media'
  | 'faq' | 'resources' | 'contact' | 'team';

/** Route → CSS gradient + accent utility (from styles/minerals.css) */
export const ROUTE_GRADIENTS: Record<GradientKey, { gradient: string; accent: string }> = {
  home:         { gradient: 'bg-amber',     accent: 'accent-amber' },
  owners:       { gradient: 'bg-citrine',   accent: 'accent-citrine' },
  transparency: { gradient: 'bg-tigereye',  accent: 'accent-tigereye' },
  institutions: { gradient: 'bg-lapis',     accent: 'accent-lapis' },
  whitepaper:   { gradient: 'bg-obsidian',  accent: 'accent-obsidian' },
  roadmap:      { gradient: 'bg-copper',    accent: 'accent-copper' },
  cares:        { gradient: 'bg-jade',      accent: 'accent-jade' },
  media:        { gradient: 'bg-onyx',      accent: 'accent-onyx' },
  faq:          { gradient: 'bg-quartz',    accent: 'accent-quartz' },
  resources:    { gradient: 'bg-hematite',  accent: 'accent-hematite' },
  contact:      { gradient: 'bg-contact',   accent: 'accent-contact' },
  team:         { gradient: 'bg-team',      accent: 'accent-team' },
};
