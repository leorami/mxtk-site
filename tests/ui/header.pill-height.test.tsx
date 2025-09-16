import SiteHeader from '@/components/SiteHeader'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

/**
 * Ensures dropdown group pills match the Dashboard pill height
 */
describe('SiteHeader nav pill heights', () => {
  it('dropdown buttons have the same class contract for height as Home pill', () => {
    // jsdom cannot compute layout heights; instead, verify class contract:
    // Dashboard pill uses "nav-link nav-pill px-3 py-2"; dropdown buttons must too.
    const { container } = render(<SiteHeader hasHome />)
    const home = container.querySelector('a[href="/home"]')
    expect(home).toBeTruthy()
    const dropdownBtn = container.querySelector('button.nav-link.nav-pill')
    expect(dropdownBtn).toBeTruthy()

    // Both should include the same padding classes
    expect(home?.className).toEqual(expect.stringContaining('px-3'))
    expect(home?.className).toEqual(expect.stringContaining('py-2'))
    expect(dropdownBtn?.className).toEqual(expect.stringContaining('px-3'))
    expect(dropdownBtn?.className).toEqual(expect.stringContaining('py-2'))
  })
})


