import type { WidgetState } from './types'

export function scoreWidgetsForOverview(widgets: WidgetState[], mode: 'learn'|'build'|'operate'): Array<{ w: WidgetState; score: number }>{
  const stageMap: Record<'learn'|'build'|'operate', 'training'|'preparing'|'conquer'> = {
    learn: 'training', build: 'preparing', operate: 'conquer'
  }
  const stage = stageMap[mode]
  return widgets.map(w => {
    let s = 0
    if (Array.isArray(w.stages) && w.stages.includes(stage)) s += 5
    if (typeof w.priority === 'number') s += Math.max(0, Math.min(5, w.priority))
    if (w.mobileFriendly) s += 1
    return { w, score: s }
  }).sort((a, b) => b.score - a.score)
}


