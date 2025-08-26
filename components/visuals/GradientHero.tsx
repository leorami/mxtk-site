'use client';
import React from 'react';
import MineralBackground from './MineralBackground';
import { useRouteVariant } from './RouteGradient';

/**
 * Drop-in hero background that uses the correct gradient + optional shimmer.
 * Usage: replace your background wrapper in PageHero with <GradientHero>{children}</GradientHero>
 */
export default function GradientHero({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  const variant = useRouteVariant();
  return (
    <MineralBackground variant={variant} wash className={`min-h-[40vh] ${className}`}>
      {children}
    </MineralBackground>
  );
}
