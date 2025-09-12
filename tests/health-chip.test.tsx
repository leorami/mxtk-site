// vitest + testing-library
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import DataHealthChip from '@/components/health/DataHealthChip'

describe('DataHealthChip', () => {
  it('renders with aria label and test id', async () => {
    render(<DataHealthChip />)
    const chip = await screen.findByTestId('data-health')
    expect(!!chip).toBe(true)
    expect(chip.getAttribute('aria-label')).toBeTruthy()
  })
})


