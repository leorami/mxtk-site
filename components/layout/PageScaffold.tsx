'use client'

import React from 'react'
import PageHero from '@/components/PageHero'
import SectionWrapper from '@/components/SectionWrapper'
import { useCopy } from '@/components/copy/Copy'
import ModeTextSwap from '@/components/experience/ModeTextSwap'
import PageTheme from '@/components/theme/PageTheme'
import BackgroundPhoto from '@/components/visuals/BackgroundPhoto'

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
    <div className={['page-scaffold', className].filter(Boolean).join(' ')} data-testid="page-scaffold">
      <PageTheme ink={ink} lift={lift} glass={glass}>
        <BackgroundPhoto variant={backgroundVariant ?? copyKey} />
        <PageHero>
          <div className="relative">
            <SectionWrapper
              index={0}
              className={[
                heroAlign === 'center' ? 'text-center' : '',
                // 👇 force the hero to be a glass panel like the rest of the site
                'glass glass--panel rounded-2xl p-5 md:p-8 shadow-[0_12px_30px_rgba(0,0,0,0.22)]'
              ].join(' ').trim()}
            >
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
                className={[
                  (heroSubClassName ?? 'text-xl text-muted max-w-3xl'),
                  heroAlign === 'center' ? 'mx-auto' : ''
                ].join(' ')}
                content={pageCopy.heroSub[contentMode]}
              />
              {heroActions ? <div className="mt-6">{heroActions}</div> : null}
            </SectionWrapper>
          </div>
        </PageHero>

        {/* Sections container matches all other pages */}
        {children ? (
          <div className="container mx-auto px-4 md:px-6">
            {children}
          </div>
        ) : null}
      </PageTheme>
    </div>
  )
}