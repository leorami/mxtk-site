'use client';
import React from 'react';

export type Variant =
  | 'home' | 'owners' | 'transparency' | 'institutions'
  | 'whitepaper' | 'roadmap' | 'cares' | 'media'
  | 'faq' | 'resources' | 'contact' | 'team';

export const VARIANT_TO_CLASS: Record<Variant, string> = {
  home: 'bg-amber accent-amber',
  owners: 'bg-citrine accent-citrine',
  transparency: 'bg-tigereye accent-tigereye',
  institutions: 'bg-lapis accent-lapis',
  whitepaper: 'bg-obsidian accent-obsidian',
  roadmap: 'bg-copper accent-copper',
  cares: 'bg-jade accent-jade',
  media: 'bg-onyx accent-onyx',
  faq: 'bg-quartz accent-quartz',
  resources: 'bg-hematite accent-hematite',
  contact: 'bg-contact accent-contact',
  team: 'bg-team accent-team',
};

export default function MineralBackground({
  variant = 'home',
  wash = true,
  className = '',
  children,
}: React.PropsWithChildren<{ variant?: Variant; wash?: boolean; className?: string }>) {
  const base = VARIANT_TO_CLASS[variant] ?? VARIANT_TO_CLASS.home;
  return (
    <div className={`relative ${base} ${className}`}>
      {wash && <div className="mineral-wash" aria-hidden="true" />}
      {children}
    </div>
  );
}
