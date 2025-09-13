export type SignalType = 'move' | 'resize' | 'pin' | 'unpin' | 'refresh' | 'settings' | 'open' | 'close' | 'collapse' | 'expand'

export interface Signal {
  ts: number
  user?: string
  homeId: string
  widgetId?: string
  type: SignalType
  payload?: Record<string, unknown>
}
