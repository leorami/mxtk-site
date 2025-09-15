// lib/home/store/snapshotStore.ts
import { promises as fs } from 'fs'
import path from 'path'
import type { HomeDoc, HomeSnapshot, HomeSnapshotMeta } from '../types'
import { putHome } from './fileStore'

const ROOT = process.cwd()
const SNAP_ROOT = path.join(ROOT, 'ai_store', 'homes', 'snapshots')

export async function ensureSnapshotDir(docId: string): Promise<string> {
  const dir = path.join(SNAP_ROOT, docId)
  try { await fs.mkdir(dir, { recursive: true }) } catch {}
  return dir
}

function fileNameFor(meta: HomeSnapshotMeta): string {
  const stamp = String(meta.createdAt || Date.now())
  const rand = Math.random().toString(36).slice(2, 8)
  return `${stamp}__${rand}.json`
}

function parseMetaFromFile(docId: string, file: string, meta: any): HomeSnapshotMeta | null {
  const base = path.basename(file)
  const createdAt = Number(base.split('__')[0])
  if (!Number.isFinite(createdAt)) return null
  const id = base.replace(/\.json$/,'')
  return {
    id,
    docId,
    createdAt,
    mode: typeof meta?.mode === 'string' ? meta.mode : undefined,
    note: typeof meta?.note === 'string' ? meta.note : undefined,
  }
}

export async function listSnapshots(docId: string): Promise<HomeSnapshotMeta[]> {
  try {
    const dir = await ensureSnapshotDir(docId)
    const files = await fs.readdir(dir)
    const items: HomeSnapshotMeta[] = []
    for (const f of files) {
      if (!f.endsWith('.json')) continue
      try {
        const raw = await fs.readFile(path.join(dir, f), 'utf8')
        const parsed = JSON.parse(raw)
        const meta = parseMetaFromFile(docId, f, parsed?.meta)
        if (meta) items.push(meta)
      } catch {}
    }
    items.sort((a,b) => b.createdAt - a.createdAt)
    return items
  } catch (e: any) {
    if (e?.code === 'ENOENT') return []
    return []
  }
}

export async function saveSnapshot(doc: HomeDoc, metaPartial?: Partial<HomeSnapshotMeta>): Promise<HomeSnapshotMeta> {
  const dir = await ensureSnapshotDir(doc.id)
  const createdAt = Date.now()
  const meta: HomeSnapshotMeta = {
    id: 'pending',
    docId: doc.id,
    createdAt,
    mode: metaPartial?.mode,
    note: metaPartial?.note,
  }
  const filename = fileNameFor(meta)
  meta.id = filename.replace(/\.json$/,'')
  const payload: HomeSnapshot = { meta, doc }
  try {
    await fs.writeFile(path.join(dir, filename), JSON.stringify(payload, null, 2), 'utf8')
  } catch {}
  return meta
}

export async function loadSnapshot(docId: string, snapshotId: string): Promise<HomeSnapshot | null> {
  try {
    const dir = await ensureSnapshotDir(docId)
    const file = path.join(dir, `${snapshotId}.json`)
    const raw = await fs.readFile(file, 'utf8')
    const parsed = JSON.parse(raw)
    // Validate basic shape
    if (!parsed?.doc || !parsed?.meta) return null
    const meta = parseMetaFromFile(docId, `${snapshotId}.json`, parsed.meta)
    if (!meta) return null
    return { meta, doc: parsed.doc as HomeDoc }
  } catch (e: any) {
    if (e?.code === 'ENOENT') return null
    return null
  }
}

export async function deleteSnapshot(docId: string, snapshotId: string): Promise<boolean> {
  try {
    const dir = await ensureSnapshotDir(docId)
    const file = path.join(dir, `${snapshotId}.json`)
    await fs.unlink(file)
    return true
  } catch (e: any) {
    if (e?.code === 'ENOENT') return false
    return false
  }
}

// Utility: restore snapshot into current doc using existing atomicity semantics
export async function restoreSnapshot(docId: string, snapshotId: string): Promise<HomeDoc | null> {
  const snap = await loadSnapshot(docId, snapshotId)
  if (!snap) return null
  const next = { ...snap.doc, id: docId }
  await putHome(next)
  return next
}


