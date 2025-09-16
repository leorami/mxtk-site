import PriceLarge from '@/components/home/widgets/PriceLarge'
import '@testing-library/jest-dom'
import { fireEvent, render, waitFor } from '@testing-library/react'

describe('PriceLarge sparkline and details sheet', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    // TimeSeries meta endpoint + data endpoint
    vi.spyOn(global, 'fetch' as any).mockImplementation((input: RequestInfo | URL) => {
      const url = String(input)
      if (/\/api\/data\/prices\//.test(url)) {
        // meta shape consumed by PriceLarge + TimeSeries uses apiGet internally
        return Promise.resolve({ ok: true, json: async () => ({ updatedAt: Date.now(), ttl: 30, data: { series: { points: Array.from({ length: 20 }).map((_, i) => ({ time: i, value: 100 + i })) } } }) }) as any
      }
      return Promise.resolve({ ok: true, json: async () => ({}) }) as any
    })
  })

  it('renders sparkline chart', async () => {
    const { container } = render(<PriceLarge id="pl-1" data={{ symbol: 'MXTK', interval: '7d' }} />)
    await waitFor(() => {
      // Sparkline path inside TimeSeries SVG
      const svgs = container.querySelectorAll('svg')
      expect(svgs.length).toBeGreaterThan(0)
    })
  })

  it('tapping opens a bottom sheet with labeled axes and tabs', async () => {
    const { container } = render(<PriceLarge id="pl-2" data={{ symbol: 'MXTK', interval: '24h' }} />)

    // Simulate open details affordance: click chart area
    const svg = await waitFor(() => container.querySelector('svg'))
    expect(svg).toBeTruthy()
    fireEvent.click(svg as Element)

    // Details sheet/dialog appears with labeled axes and tabs
    await waitFor(() => {
      const dialog = container.querySelector('[role="dialog"]')
      expect(dialog).toBeTruthy()
      const text = dialog?.textContent || ''
      expect(text).toEqual(expect.stringContaining('Price'))
      // Tabs labels
      expect(text).toEqual(expect.stringContaining('24h'))
      expect(text).toEqual(expect.stringContaining('7d'))
      expect(text).toEqual(expect.stringContaining('30d'))
      // Basic axes hints
      expect(text).toEqual(expect.stringMatching(/\$|price|min|max/i))
    })
  })
})


