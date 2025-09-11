'use client'

import React from 'react'
import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import { useCopy } from '@/components/copy/Copy'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import PageTheme from '@/components/theme/PageTheme'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'

type Ink = string   // e.g., "light" | "warm"
type Lift = string  // e.g., "H" | "M" | "L"
type Glass = string // e.g., "soft" | "panel" | "none"

export type PageScaffoldProps = {
  /** Which copy entry to use (e.g., 'contact', 'faq', 'dashboard', etc.) */
  copyKey: string
  /** BackgroundPhoto variant (e.g., 'home' | 'contact' | 'faq'); defaults to copyKey */
  backgroundVariant?: string
  /** Design tokens (defaults align to Contact/FAQ) */
  ink?: Ink
  lift?: Lift
  glass?: Glass
  /** Center or left-align the hero block (Contact/FAQ use center) */
  heroAlign?: 'center' | 'left'
  /** Render the hero title as this tag (defaults to h1) */
  heroTitleAs?: keyof JSX.IntrinsicElements
  /** Optional class overrides for hero text */
  heroTitleClassName?: string
  heroSubClassName?: string
  /** Optional extra content below the hero text (e.g., CTA row) */
  heroActions?: React.ReactNode
  /** Section content: pass <SectionWrapper> + <Card> blocks as children */
  children?: React.ReactNode
  /** Optional className for outer hook */
  className?: string
}

/**
 * PageScaffold — canonical MXTK wrapper matching Contact/FAQ:
 * PageTheme → BackgroundPhoto → PageHero → SectionWrapper (+ ModeTextSwap/useCopy).
 * - Pure presentation; no routing/basePath/middleware logic.
 * - Backgrounds come from /public/art/photos via <BackgroundPhoto variant=...>.
 * - Copy is mode-aware via useCopy + ModeTextSwap.
 */
export default function PageScaffold({
  copyKey,
  backgroundVariant,
  ink = 'warm',
  lift = 'H',
  glass = 'soft',
  heroAlign = 'center',
  heroTitleAs = 'h1',
  heroTitleClassName,
  heroSubClassName,
  heroActions,
  children,
  className,
}: PageScaffoldProps) {
  const { mode, pageCopy } = useCopy(copyKey)
  const contentMode = (mode === 'ai') ? 'build' : (mode as 'learn' | 'build' | 'operate')
  const TitleTag = heroTitleAs

  return (
    <div className={['page-scaffold', className].filter(Boolean).join(' ')} data-testid="page-scaffold">
      <PageTheme ink={ink} lift={lift} glass={glass}>
        <BackgroundPhoto variant={backgroundVariant ?? copyKey} />
        <PageHero>
          <div className="relative">
            <div className="space-y-0">
              <SectionWrapper index={0} className={heroAlign === 'center' ? 'text-center' : undefined}>
                <ModeTextSwap
                  as={TitleTag as any}
                  depKey={`${copyKey}-hero-title-${mode}`}
                  className={
                    heroTitleClassName ??
                    'text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]'
                  }
                  content={pageCopy.heroTitle[contentMode]}
                />
                <ModeTextSwap
                  as="p"
                  depKey={`${copyKey}-hero-sub-${mode}`}
                  className={
                    (heroSubClassName ?? 'text-xl text-muted max-w-3xl') +
                    (heroAlign === 'center' ? ' mx-auto' : '')
                  }
                  content={pageCopy.heroSub[contentMode]}
                />
                {heroActions ? <div className="mt-6">{heroActions}</div> : null}
              </SectionWrapper>

              {/* Children render AFTER PageHero (hero above, sections below) */}
            </div>
          </div>
        </PageHero>
        {/* Children render AFTER PageHero (hero above, sections below) */}
        {children ? (
          <div className="container mx-auto px-4 md:px-6">
            {children}
          </div>
        ) : null}
      </PageTheme>
    </div>
  )
}