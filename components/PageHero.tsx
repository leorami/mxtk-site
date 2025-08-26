'use client';
import { usePathname } from 'next/navigation';
import React from 'react';

function gradientForPath(pathname: string) {
  const p = pathname.toLowerCase();
  if (p.includes('/owners')) return 'bg-citrine';
  if (p.includes('/transparency')) return 'bg-tigereye';
  if (p.includes('/institutions')) return 'bg-lapis';
  if (p.includes('/whitepaper')) return 'bg-obsidian';
  if (p.includes('/resources')) return 'bg-hematite';
  if (p.includes('/faq')) return 'bg-quartz';
  return 'bg-amber'; // home default
}

export default function PageHero({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const bg = gradientForPath(pathname || '/');

  return (
    <div className={`${bg} relative w-full`}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="glass p-6 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
