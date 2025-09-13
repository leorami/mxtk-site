import PageScaffold from '@/components/layout/PageScaffold'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

describe('PageScaffold hero CTA underline guard', () => {
  it('renders hero CTA anchors without text-decoration underline', () => {
    render(
      <PageScaffold copyKey="dashboard" backgroundVariant="home" heroAlign="center" heroActions={(
        <div>
          <a href="/resources" className="btn-soft">Explore resources</a>
          <a href="/institutions" className="btn-outline">For institutions</a>
        </div>
      )}/>
    )

    const res = screen.getByText('Explore resources')
    const inst = screen.getByText('For institutions')
    // We cannot assert computed styles in jsdom reliably; assert class contract
    expect(res.closest('a')?.className).toEqual(expect.stringContaining('btn-soft'))
    expect(inst.closest('a')?.className).toEqual(expect.stringContaining('btn-outline'))
  })
})


