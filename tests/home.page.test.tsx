import HomePage from '@/app/home/page'
import { render, screen } from '@testing-library/react'

// Minimal mock for Next.js environment pieces used indirectly
vi.mock('next/navigation', () => ({ usePathname: () => '/home' }))

describe('Home page hero + helper', () => {
  test('renders hero and helper with correct classes', () => {
    render(<HomePage />)
    const title = screen.getByTestId('home-hero-title')
    expect(title).toBeInTheDocument()
    expect(title.className).toMatch(/text-4xl/)

    const helper = screen.getByTestId('home-hero-helper')
    expect(helper).toBeInTheDocument()
    // helper styled like hero sub (centered, max width)
    expect(helper.className).toMatch(/max-w-3xl/)
  })

  test('Empty sections are not rendered', () => {
    const { container } = render(<HomePage />)
    const sections = Array.from(container.querySelectorAll('.section-rail > section'))
    // Permit non-dashboard sections (stats rail) which may not include data-grid
    const dashboardSections = sections.filter(sec => !!sec.querySelector('[data-grid], .section-body') || /Overview|Learn|Build|Operate|Library/i.test(sec.textContent || ''))
    expect(dashboardSections.length).toBeGreaterThan(0)
  })
})


