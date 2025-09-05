export type WidgetType = 'glossary' | 'resources' | 'marketTicker'

export const WidgetRegistry: Record<WidgetType, { title: string }> = {
  glossary: { title: 'Glossary' },
  resources: { title: 'Resources' },
  marketTicker: { title: 'Market Ticker' }
}


