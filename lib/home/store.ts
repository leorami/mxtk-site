import fs from 'node:fs/promises';
import path from 'node:path';
import type { HomeDoc, Widget } from './types';

const BASE = process.env.AI_VECTOR_DIR || './ai_store'
const DIR = path.join(process.cwd(), BASE, 'home')

async function ensure() {
  await fs.mkdir(DIR, { recursive: true })
}

export async function loadHome(id: string): Promise<HomeDoc> {
  await ensure()
  try {
    return JSON.parse(await fs.readFile(path.join(DIR, `${id}.json`), 'utf8'))
  } catch {
    return { id, updatedAt: new Date().toISOString(), widgets: [] }
  }
}

export async function saveHome(doc: HomeDoc) {
  await ensure()
  const next = { ...doc, updatedAt: new Date().toISOString() }
  await fs.writeFile(path.join(DIR, `${doc.id}.json`), JSON.stringify(next, null, 2), 'utf8')
  return next
}

export async function addWidget(id: string, w: Omit<Widget, 'id' | 'order'> & { id?: string }) {
  const doc = await loadHome(id)
  if (w.id && doc.widgets.some(x => x.id === w.id)) return doc
  const wid = w.id || `w_${Math.random().toString(36).slice(2)}`
  const order = (doc.widgets.at(-1)?.order ?? 0) + 1
  doc.widgets.push({ id: wid, order, ...w })
  return saveHome(doc)
}

export async function updateWidget(id: string, wid: string, patch: Partial<Widget>) {
  const doc = await loadHome(id)
  const i = doc.widgets.findIndex(x => x.id === wid)
  if (i < 0) return doc
  doc.widgets[i] = { ...doc.widgets[i], ...patch }
  return saveHome(doc)
}

export async function removeWidget(id: string, wid: string) {
  const doc = await loadHome(id)
  doc.widgets = doc.widgets.filter(x => x.id !== wid)
  return saveHome(doc)
}

export async function reorderWidget(id: string, wid: string, dir: 1 | -1) {
  const doc = await loadHome(id)
  const idx = doc.widgets.findIndex(x => x.id === wid)
  if (idx < 0) return doc
  const swap = idx + dir
  if (swap < 0 || swap >= doc.widgets.length) return doc
  const a = doc.widgets[idx]
  const b = doc.widgets[swap]
  const ao = a.order
  a.order = b.order
  b.order = ao
  ;[doc.widgets[idx], doc.widgets[swap]] = [b, a]
  return saveHome(doc)
}


