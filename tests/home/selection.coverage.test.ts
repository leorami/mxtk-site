import { selectWidgets } from '@/components/home/engine/selectWidgets'

describe('Home selection coverage', () => {
  it('ensures at least one from Owners, Transparency, Resources', () => {
    const registry = [
      { id:'m1', stages:['preparing'], priority:0.2, mobileFriendly:true, categories:['Markets'] },
      { id:'t1', stages:['preparing'], priority:0.2, mobileFriendly:true, categories:['Transparency'] },
      { id:'r1', stages:['preparing'], priority:0.2, mobileFriendly:true, categories:['Resources'] },
      { id:'o1', stages:['preparing'], priority:0.2, mobileFriendly:true, categories:['Owners'] },
    ] as any
    const signals = { pins: [], recency: {}, dwell: {}, prompts: {} } as any
    const out = selectWidgets({ stage: 'preparing', signals, registry })
    const cats = new Set(out.flatMap(w => (w as any).categories))
    expect(cats.has('Owners')).toBe(true)
    expect(cats.has('Transparency')).toBe(true)
    expect(cats.has('Resources')).toBe(true)
  })
})


