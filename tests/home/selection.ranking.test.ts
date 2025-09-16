import { selectWidgets } from '@/components/home/engine/selectWidgets'

describe('Home selection ranking', () => {
  it('ranks by stage fit > signals > base priority', () => {
    const registry = [
      { id:'a', stages:['training'], priority:0.2, mobileFriendly:true, categories:['Markets'] },
      { id:'b', stages:['preparing'], priority:0.5, mobileFriendly:true, categories:['Transparency'] },
      { id:'c', stages:['preparing','training'], priority:0.1, mobileFriendly:true, categories:['Resources'] },
    ] as any
    const signals = { pins: ['b'], recency: { b: 0.9 }, dwell: { b: 0.7 }, prompts: {} } as any
    const out = selectWidgets({ stage: 'preparing', signals, registry, alpha: 0.6, beta: 0.3, gamma: 0.1 })
    expect(out[0].id).toBe('b')
  })
})


