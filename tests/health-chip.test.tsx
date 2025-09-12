// vitest + testing-library
import DataHealthChip from '@/components/health/DataHealthChip'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('DataHealthChip', () => {
  it('renders with aria label and test id', async () => {
    render(<DataHealthChip />)
    const chip = await screen.findByTestId('data-health')
    expect(!!chip).toBe(true)
    expect(chip.getAttribute('aria-label')).toBeTruthy()
  })
})


