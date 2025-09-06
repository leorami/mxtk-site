export type WidgetType = 'summary' | 'glossary' | 'resources' | 'news' | 'market'
export type Widget = { id: string; type: WidgetType; title?: string; data?: any; pinned?: boolean; order: number }
export type HomeDoc = { id: string; updatedAt: string; widgets: Widget[] }


