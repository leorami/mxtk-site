import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

// Write-first: target the planned widget location
import TopPoolsList from '@/components/home/widgets/TopPoolsList'

const mockPools = [
  {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    token0: { symbol: 'MXTK' },
    token1: { symbol: 'USDC' },
    tvlUSD: 1234567.89,
    volume24hUSD: 98765.43,
  },
  {
    address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    token0: { symbol: 'MXTK' },
    token1: { symbol: 'USDT' },
    tvlUSD: 2234567.89,
    volume24hUSD: 198765.43,
  },
]

describe('TopPoolsList (mobile stacked list)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    // JSDOM viewport limitations: we assert DOM shape (no table), not actual media queries
    vi.spyOn(global, 'fetch' as any).mockImplementation((input: RequestInfo | URL) => {
      const url = String(input)
      if (/\/api\/data\/pools/.test(url)) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ updatedAt: Date.now(), ttl: 30, data: mockPools }),
        }) as any
      }
      return Promise.resolve({ ok: true, json: async () => ({}) }) as any
    })
  })

  it('renders a stacked list (no table) with right badges and truncated address', async () => {
    const { container } = render(<TopPoolsList id="w1" data={{ token: '0xdeadbeef' }} />)

    await waitFor(() => {
      // No table on mobile stacked list
      expect(container.querySelector('table')).toBeNull()
      // Expect list rows present
      expect(screen.getByText(/MXTK\/USDC/)).toBeInTheDocument()
    })

    // Right badges labels should be present somewhere in the header or row
    expect(container.textContent || '').toEqual(expect.stringContaining('Vol 24h'))
    expect(container.textContent || '').toEqual(expect.stringContaining('TVL'))

    // Truncated address (0x1234…5678) visible in secondary text
    const truncated = /0x1234\u2026(?:5678|abcd)/ // allow either end depending on truncate impl
    expect(truncated.test(container.textContent || '')).toBe(true)
  })

  it('chevron opens bottom sheet with details/links', async () => {
    const { container } = render(<TopPoolsList id="w2" data={{ token: '0xdeadbeef' }} />)

    // Click row chevron
    await waitFor(() => expect(screen.getAllByRole('button', { name: /open details/i }).length).toBeGreaterThan(0))
    const btn = screen.getAllByRole('button', { name: /open details/i })[0]
    fireEvent.click(btn)

    // Bottom sheet/dialog should open with role dialog and contain token pair
    await waitFor(() => {
      const dialog = container.querySelector('[role="dialog"]')
      expect(dialog).toBeTruthy()
      expect(dialog?.textContent || '').toEqual(expect.stringContaining('MXTK/USDC'))
      // Expect some link presence (e.g., View on explorer)
      const links = dialog?.querySelectorAll('a') || []
      expect(links.length).toBeGreaterThan(0)
    })
  })
})


