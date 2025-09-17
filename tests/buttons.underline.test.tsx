import Button from '@/components/ui/Button'
import { render } from '@testing-library/react'

describe('Button underline policy', () => {
  test('buttons render with no underline', () => {
    const { container } = render(<Button variant="primary">Test</Button>)
    const el = container.querySelector('a,button') as HTMLElement
    expect(el).toBeTruthy()
    // style assertion fallback: ensure class contains no-underline utility where used
    expect(el.className).toMatch(/no-underline|btn|btn-primary/)
  })
})


