import SiteHeader from '@/components/SiteHeader'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

describe('SiteHeader labels and links', () => {
  it('shows Home pill linking to /home (Highlights hidden)', () => {
    const { container } = render(<SiteHeader hasHome />)
    const home = container.querySelector('a[href="/home"]')
    expect(home).toBeTruthy()
    expect(home?.textContent).toMatch(/Home/)

    const highlights = container.querySelector('a[href="/highlights"]')
    expect(highlights).toBeNull()
  })

  it('navigation group label updated to Overview', () => {
    const { container } = render(<SiteHeader hasHome />)
    const groupButtons = Array.from(container.querySelectorAll('button.nav-link.nav-pill'))
    const labels = groupButtons.map(b => (b.textContent || '').trim())
    expect(labels.some(l => /Overview/.test(l))).toBe(true)
  })
})
