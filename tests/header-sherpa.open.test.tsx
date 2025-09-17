import SiteHeader from '@/components/SiteHeader'
import GuideHost from '@/components/ai/GuideHost'
import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/react'

// JSDOM shims
// @ts-expect-error
global.matchMedia = global.matchMedia || (() => ({ matches:false, addEventListener:()=>{}, removeEventListener:()=>{} }))
// @ts-expect-error
global.localStorage = global.localStorage || { getItem: ()=>null, setItem: ()=>{} }

describe('Sherpa header button opens bottom drawer', () => {
  test('toggles html.guide-open and renders exactly one [data-guide-panel]', () => {
    const { container } = render(
      <div>
        <SiteHeader hasHome />
        <GuideHost />
      </div>
    )

    const pill = container.querySelector('[data-testid="sherpa-pill"]') as HTMLElement
    expect(pill).toBeTruthy()

    // initial: not open
    expect(document.documentElement.classList.contains('guide-open')).toBe(false)

    // open (should also close mobile menu if present)
    fireEvent.click(pill)
    expect(document.documentElement.classList.contains('guide-open')).toBe(true)
    const openPanels = container.querySelectorAll('[data-guide-panel]')
    expect(openPanels.length).toBe(1)

    // close
    fireEvent.click(pill)
    expect(document.documentElement.classList.contains('guide-open')).toBe(false)
  })
})


