import DashboardContent from '@/components/home/DashboardContent'
import type { HomeDoc } from '@/lib/home/types'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { vi } from 'vitest'

// JSDOM test: verify order and class contract of Adapt CTA buttons
describe('Dashboard Adapt CTA', () => {
  it('renders Preview, Dismiss, Apply in order with expected classes', async () => {
    const minimalDoc: HomeDoc = {
      id: 'default',
      layoutVersion: 2,
      sections: [
        { id: 'overview', key: 'overview', title: 'Overview', order: 0 },
      ],
      widgets: [],
    }
    // Stub fetch so internal effects don’t throw
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => minimalDoc })

    const { container } = render(<DashboardContent initialDocId="default" initialDoc={minimalDoc} />)
    // Message text should reflect one of the modes; we simply check presence of Adapt string
    expect(container.textContent).toMatch(/Adapt the Dashboard/i)
    const buttons = Array.from(container.querySelectorAll('button'))
      .filter(b => /Preview|Dismiss|Apply/.test(b.textContent || ''))
    expect(buttons.map(b => (b.textContent || '').trim())).toEqual(['Preview','Dismiss','Apply'])
    // Apply should be outline, Preview/Dismiss ghost
    const preview = buttons[0]
    const dismiss = buttons[1]
    const apply = buttons[2]
    expect(preview.className).toEqual(expect.stringContaining('btn-ghost'))
    expect(dismiss.className).toEqual(expect.stringContaining('btn-ghost'))
    expect(apply.className).toEqual(expect.stringContaining('btn-outline'))
    // All buttons use consistent vertical padding class
    for (const b of buttons) {
      expect(b.className).toEqual(expect.stringContaining('py-1'))
    }
  })
})


