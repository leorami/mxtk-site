import { routeModel } from '@/lib/ai/router'
import { describe, expect, it } from 'vitest'

describe('model router', () => {
    it('short simple -> suggest', () => {
        const r = routeModel('Quick tagline ideas for a nonprofit site.')
        expect(r.tier).toBe('suggest')
    })
    it('medium with code hints -> answer or deep', () => {
        const r = routeModel('Generate example JSON schema and a step-by-step plan for integration.', { toolOrCodeHeavy: true })
        expect(['answer', 'deep']).toContain(r.tier)
    })
    it('very long + high stakes -> deep', () => {
        const long = 'A'.repeat(6000)
        const r = routeModel(long, { highStakes: true })
        expect(r.tier).toBe('deep')
    })
})


