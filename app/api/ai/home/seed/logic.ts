import { selectWidgets } from "@/components/home/engine/selectWidgets";
import type { Stage } from "@/copy/home";

// Minimal, inline registry assembled from widget meta exports
import { meta as priceLarge } from "@/components/home/widgets/PriceLarge";
import { meta as recentAnswers } from "@/components/home/widgets/RecentAnswers";
import { meta as resources } from "@/components/home/widgets/Resources";
import { meta as topPools } from "@/components/home/widgets/TopPoolsList";

export type RegistryItem = typeof priceLarge
const defaultRegistry: RegistryItem[] = [priceLarge, recentAnswers, resources, topPools] as any

type In = { id: string|null, stage: Stage, adapt: boolean, registry?: RegistryItem[] }
export async function seedHome({ id, stage, adapt, registry }: In){
  const reg = registry && registry.length ? registry : defaultRegistry
  const base = selectWidgets({ stage, signals: { pins: [], recency: {}, dwell: {}, prompts: {} } as any, registry: reg as any, max: 8 })
  const existingPins: string[] = id ? await getPinnedWidgetIds(id) : []
  const withPinsOnTop = [
    ...existingPins
      .map(pid => base.find(w=>w.id===pid))
      .filter(Boolean) as RegistryItem[],
    ...base.filter(w=>!existingPins.includes(w.id)),
  ].slice(0, 8)
  const widgets = adapt ? withPinsOnTop : base
  const newId = id ?? (await createHomeId())
  await saveHome(newId, widgets.map(w=>({ id:w.id })), stage)
  return { id: newId, widgets, stage }
}

// stub storers — replace with your persistence
async function getPinnedWidgetIds(_id:string){ return [] }
async function createHomeId(){ return crypto.randomUUID() }
async function saveHome(_id:string,_w:any,_s:Stage){ return }


