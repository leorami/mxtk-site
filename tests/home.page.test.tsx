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
})


