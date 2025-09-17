import GuideDrawer from '@/components/ai/GuideDrawer'
import { render } from '@testing-library/react'

// minimal JSDOM mocks
// @ts-expect-error
global.matchMedia = global.matchMedia || function(query) {
  return { matches: /max-width:1024px/.test(query), addEventListener: () => {}, removeEventListener: () => {} } as any
}
// @ts-expect-error
global.localStorage = {
  getItem: () => '1', // open by default
  setItem: () => {}
}

describe('Sherpa guide drawer bottom overlay', () => {
  test('renders as bottom-overlay and width capped', async () => {
    const { container } = render(<div className="relative space-y-0"><GuideDrawer insideContainer={false} /></div>)
    document.documentElement.classList.add('guide-open')
    const drawer = container.querySelector('[data-guide-panel]') as HTMLElement
    expect(drawer).toBeTruthy()
    const style = getComputedStyle(drawer)
    // position may be fixed or absolute based on container usage
    expect(['fixed','absolute']).toContain(style.position)
    // bottom offset includes footer height token
    const bottom = drawer.style.bottom || style.bottom
    expect(bottom).toMatch(/var\(--footer-height/)
    const widthCss = drawer.style.width || style.width
    expect(widthCss).toMatch(/clamp\(/)
  })
})


