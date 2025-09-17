import RecentAnswers from '@/components/home/widgets/RecentAnswers'
import { render, screen } from '@testing-library/react'

// Mock fetch to return a journey with blocks
const blocks = [
  { id:'1', title:'Explain MXTK tokenomics simply', body:'Answer body 1' },
  { id:'2', title:'What are MXTK transparency proofs?', body:'Answer body 2' },
]

beforeAll(() => {
  // @ts-expect-error
  global.fetch = vi.fn(async () => ({ json: async () => ({ ok:true, journey:{ id:'j', blocks } }) }))
  // @ts-expect-error
  global.localStorage = { getItem: () => 'journey-1' }
})

describe('RecentAnswers widget', () => {
  test('shows question title in the card header', async () => {
    render(<RecentAnswers />)
    expect(await screen.findByText(/Explain MXTK tokenomics/i)).toBeInTheDocument()
  })
})


