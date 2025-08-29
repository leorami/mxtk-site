'use client';
import FullBleed from '@/components/layout/FullBleed';
import cn from 'classnames';

export default function OrganicBand({ tint = 'amber', children, className = '' }:{
  tint?: 'amber'|'citrine'|'tigereye'|'lapis'|'obsidian'|'teal';
  children: React.ReactNode;
  className?: string;
}) {
  const bg = tint === 'citrine' ? 'bg-citrine'
    : tint === 'tigereye' ? 'bg-tigereye'
    : tint === 'lapis' ? 'bg-lapis'
    : tint === 'obsidian' ? 'bg-obsidian'
    : tint === 'teal' ? 'bg-teal' : 'bg-amber';

  return (
    <FullBleed>
      <div className={cn('relative mask-organic', bg, className)}>
        <div className="absolute inset-0 pointer-events-none">
          {/* top/bottom organic masks via SectionMask */}
        </div>
        {children}
      </div>
    </FullBleed>
  );
}


