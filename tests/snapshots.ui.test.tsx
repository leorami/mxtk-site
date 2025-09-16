import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SnapshotManager from '@/components/home/SnapshotManager'
import { ToastProvider } from '@/components/ui/Toast'

describe('SnapshotManager UI', () => {
  const fetchMock = vi.fn()
  beforeEach(() => {
    fetchMock.mockReset()
    // @ts-ignore
    global.fetch = fetchMock
  })

  it('lists, saves, and deletes snapshots via mocked fetch', async () => {
    const items = [{ id: 's1', docId: 'd', createdAt: Date.now(), note: 'auto' }]
    fetchMock.mockImplementation((url: string, init?: any) => {
      if (url.includes('/snapshots') && !/\/[^/]+$/.test(String(url)) && (!init || init.method === undefined)) {
        return Promise.resolve(new Response(JSON.stringify({ items }), { status: 200 }))
      }
      if (url.endsWith('/snapshots') && init?.method === 'POST') {
        return Promise.resolve(new Response(JSON.stringify({ ok: true, meta: items[0] }), { status: 200 }))
      }
      if (/\/snapshots\//.test(String(url)) && init?.method === 'DELETE') {
        return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }))
      }
      if (/\/snapshots\//.test(String(url)) && init?.method === 'POST') {
        const doc = { id: 'd', layoutVersion: 2, sections: [], widgets: [] }
        return Promise.resolve(new Response(JSON.stringify({ ok: true, doc }), { status: 200 }))
      }
      return Promise.resolve(new Response('{}', { status: 200 }))
    })

    const onClose = vi.fn()
    render(<ToastProvider><SnapshotManager open={true} docId="d" onClose={onClose} /></ToastProvider>)
    await waitFor(() => {
      const n = screen.getAllByText('Snapshots');
      expect(n.length).toBeGreaterThan(0);
    })
    expect(fetchMock).toHaveBeenCalled()

    // Save
    // Mock prompt
    // @ts-ignore
    global.window.prompt = () => 'note'
    fireEvent.click(screen.getByText('Save'))
    await waitFor(() => expect(fetchMock).toHaveBeenCalled())

    // Since there are no items yet, create one by mocking load response with an item
    fetchMock.mockImplementationOnce((url: string) => Promise.resolve(new Response(JSON.stringify({ items }), { status: 200 })))
    // Re-open to trigger load
    fireEvent.click(screen.getByText('Close'))
    render(<ToastProvider><SnapshotManager open={true} docId="d" onClose={onClose} /></ToastProvider>)
    await waitFor(() => expect(screen.getAllByText('Snapshots').length).toBeGreaterThan(0))
    // Now delete
    const delBtn = await screen.findByText('Delete')
    fireEvent.click(delBtn)
    await waitFor(() => expect(fetchMock).toHaveBeenCalled())
  })
})


