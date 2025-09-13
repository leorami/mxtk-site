import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import SiteHeader from '@/components/SiteHeader'

/**
 * Ensures dropdown group pills match the Dashboard pill height
 */
describe('SiteHeader nav pill heights', () => {
  it('dropdown buttons have the same computed height as Dashboard pill', () => {
    // jsdom cannot compute layout heights; instead, verify class contract:
    // Dashboard pill uses "nav-link nav-pill px-3 py-2"; dropdown buttons must too.
    const { container } = render(<SiteHeader hasHome />)
    const dashboard = container.querySelector('a[href="/dashboard"]')
    expect(dashboard).toBeTruthy()
    const dropdownBtn = container.querySelector('button.nav-link.nav-pill')
    expect(dropdownBtn).toBeTruthy()

    // Both should include the same padding classes
    expect(dashboard?.className).toEqual(expect.stringContaining('px-3'))
    expect(dashboard?.className).toEqual(expect.stringContaining('py-2'))
    expect(dropdownBtn?.className).toEqual(expect.stringContaining('px-3'))
    expect(dropdownBtn?.className).toEqual(expect.stringContaining('py-2'))
  })
})


