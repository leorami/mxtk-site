'use client'

import SectionWrapper from '@/components/SectionWrapper'
import { useCopy } from '@/components/copy/Copy'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import PageTheme from '@/components/theme/PageTheme'
import PageBackground from '@/components/visuals/PageBackground'
import React from 'react'

type Ink = string
type Lift = string
type Glass = string

export type PageScaffoldProps = {
  copyKey: string
  backgroundVariant?: string
  ink?: Ink
  lift?: Lift
  glass?: Glass
  heroAlign?: 'center' | 'left'
  heroTitleAs?: keyof JSX.IntrinsicElements
  heroTitleClassName?: string
  heroSubClassName?: string
  heroActions?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

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
    <PageTheme ink={ink} lift={lift} glass={glass}>
      <PageBackground page={backgroundVariant ?? copyKey} />      
        <div className="relative container mx-auto px-[var(--gutter-sm)] pt-4 pb-6 sm:px-6">
          <div className="glass glass--panel p-6 md:p-8">
            <div className="relative">
              <div className="space-y-0">
                {/* Hero Section */}
                <SectionWrapper
                  index={0}
                  className={heroAlign === 'center' ? 'text-center' : ''}
                >
                  <ModeTextSwap
                    as={TitleTag as any}
                    depKey={`${copyKey}-hero-title-${mode}`}
                    className={
                      heroTitleClassName ??
                      'text-4xl md:text-6xl font-bold tracking-tight copy-fade-in'
                    }
                    content={pageCopy.heroTitle[contentMode]}
                  />
                  <ModeTextSwap
                    as="p"
                    depKey={`${copyKey}-hero-sub-${mode}`}
                    className={[
                      (heroSubClassName ?? 'text-xl max-w-3xl copy-fade-in'),
                      heroAlign === 'center' ? 'mx-auto' : ''
                    ].join(' ')}
                    content={pageCopy.heroSub[contentMode]}
                  />
                  {heroActions ? (
                    <div className={`flex flex-col sm:flex-row gap-4 ${heroAlign === 'center' ? 'justify-center' : ''}`}>
                      {heroActions}
                    </div>
                  ) : null}
                </SectionWrapper>

                {/* Content Sections */}
                {children}
              </div>
            </div>
          </div>
        </div>
    </PageTheme>
  )
}