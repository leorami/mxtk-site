import { selectWidgets } from '@/components/home/engine/selectWidgets'

describe('Home selection stage switching', () => {
  it('updates order deterministically given same signals', () => {
    const registry = [
      { id:'x', stages:['training'], priority:0.8, mobileFriendly:true, categories:['Resources'] },
      { id:'y', stages:['preparing'], priority:0.5, mobileFriendly:true, categories:['Transparency'] },
      { id:'z', stages:['conquer'], priority:0.4, mobileFriendly:true, categories:['Owners'] },
    ] as any
    const signals = { pins: [], recency: {}, dwell: {}, prompts: {} } as any
    const a = selectWidgets({ stage: 'training', signals, registry })
    const b = selectWidgets({ stage: 'preparing', signals, registry })
    expect(a[0].id).toBe('x')
    expect(b[0].id).toBe('y')
    // Deterministic tie-break for rest
    const a2 = selectWidgets({ stage: 'training', signals, registry })
    expect(a.map(w=>w.id)).toEqual(a2.map(w=>w.id))
  })
})
