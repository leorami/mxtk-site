import DashboardContent from '@/components/home/DashboardContent'
import { ToastProvider } from '@/components/ui/Toast'
import type { HomeDoc } from '@/lib/home/types'
import '@testing-library/jest-dom'
import { render, waitFor } from '@testing-library/react'
import { vi } from 'vitest'

// Polyfills for JSDOM
// @ts-ignore
vi.stubGlobal('ResizeObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
});

describe('DashboardContent client auto-seed effect', () => {
  const baseDoc: HomeDoc = {
    id: 'default',
    layoutVersion: 2,
    sections: [ { id: 'overview', key: 'overview', title: 'Overview', order: 0 } ],
    widgets: [],
  }

  beforeEach(() => {
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => baseDoc })
    // Reset cookie and session storage between tests
    Object.defineProperty(document, 'cookie', { writable: true, value: '' })
    sessionStorage.clear()
  })

  it('POSTs to /ai/home/seed when cookie missing or no widgets', async () => {
    render(
      <ToastProvider>
        <DashboardContent initialDocId="default" initialDoc={baseDoc} />
      </ToastProvider>
    )
    await waitFor(() => {
      expect((global.fetch as any).mock.calls.some((c: any[]) => String(c[0]).includes('/api/ai/home/seed'))).toBe(true)
    })
  })

  it('does not POST when cookie present and widgets exist', async () => {
    document.cookie = 'mxtk_home_id=abc123'
    const withWidgets: HomeDoc = { ...baseDoc, widgets: [{ id: 'w1', type: 'note', title: 't', sectionId: 'overview', size: { w: 2, h: 2 }, pos: { x: 0, y: 0 } }] as any }
    // Ensure GET returns a doc with widgets so client effect sees count > 0
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => withWidgets })
    render(
      <ToastProvider>
        <DashboardContent initialDocId="default" initialDoc={withWidgets} />
      </ToastProvider>
    )
    await waitFor(() => {
      expect((global.fetch as any).mock.calls.some((c: any[]) => String(c[0]).includes('/api/ai/home/seed'))).toBe(false)
    })
  })
})


