import '@testing-library/jest-dom'

describe('Widget registry meta shape', () => {
  it('each widget exports meta with required fields', async () => {
    const widgets = [
      await import('@/components/home/widgets/TopPoolsList'),
      await import('@/components/home/widgets/PriceLarge'),
      await import('@/components/home/widgets/RecentAnswers'),
      await import('@/components/home/widgets/Resources'),
    ]
    for (const mod of widgets) {
      const meta = (mod as any).meta
      expect(meta).toBeTruthy()
      expect(meta).toHaveProperty('id')
      expect(meta).toHaveProperty('stages')
      expect(meta).toHaveProperty('priority')
      expect(meta).toHaveProperty('mobileFriendly')
      expect(meta).toHaveProperty('categories')
    }
  })
})


