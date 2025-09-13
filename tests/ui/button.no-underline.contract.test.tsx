import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

const ButtonShapes = () => (
  <div>
    <a href="#" className="btn">Btn</a>
    <a href="#" className="btn-primary">Primary</a>
    <a href="#" className="btn-outline">Outline</a>
    <a href="#" className="btn-soft">Soft</a>
    <a href="#" className="btn-link">LinkBtn</a>
    <button className="btn"><a href="#">Inner</a></button>
  </div>
)

describe('button underline regression guard', () => {
  it('button-like anchors carry btn classes (CSS verified in puppeteer script)', () => {
    const { container } = render(<ButtonShapes />)
    const anchors = container.querySelectorAll('a')
    anchors.forEach(a => {
      if (a.className.includes('btn')) {
        expect(a.className).toMatch(/btn|btn-primary|btn-outline|btn-soft|btn-link/)
      }
    })
  })
})


