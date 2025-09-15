import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import path from 'path'
import { promises as fs } from 'fs'
let listSnapshots: any, saveSnapshot: any, loadSnapshot: any, deleteSnapshot: any

// Redirect ai_store to a temp directory by monkeypatching process.cwd during this file
const ORIG_CWD = process.cwd()
const TMP_ROOT = path.join(ORIG_CWD, 'ai_store_test_tmp')

function chdirTmp(){
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(process as any).cwd = () => TMP_ROOT
}

function chdirOrig(){
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(process as any).cwd = () => ORIG_CWD
}

describe('snapshotStore file-backed ops', () => {
  const docId = 'utest'
  const baseDoc = { id: docId, layoutVersion: 2, sections: [], widgets: [] } as any

  beforeAll(async () => {
    await fs.mkdir(TMP_ROOT, { recursive: true })
    chdirTmp()
    const mod = await import('@/lib/home/store/snapshotStore')
    listSnapshots = mod.listSnapshots
    saveSnapshot = mod.saveSnapshot
    loadSnapshot = mod.loadSnapshot
    deleteSnapshot = mod.deleteSnapshot
  })

  afterAll(async () => {
    chdirOrig()
    try { await fs.rm(TMP_ROOT, { recursive: true, force: true }) } catch {}
  })

  it('save, list desc, load, delete works', async () => {
    const s1 = await saveSnapshot(baseDoc, { note: 'first' })
    expect(s1.id).toBeTruthy()
    await new Promise(r => setTimeout(r, 5))
    const s2 = await saveSnapshot(baseDoc, { note: 'second' })
    expect(s2.id).toBeTruthy()

    const items = await listSnapshots(docId)
    expect(items.length).toBeGreaterThanOrEqual(2)
    expect(items[0].createdAt).toBeGreaterThanOrEqual(items[1].createdAt)

    const loaded = await loadSnapshot(docId, s1.id)
    expect(loaded?.doc?.id).toBe(docId)

    const delOk = await deleteSnapshot(docId, s1.id)
    expect(delOk).toBeTypeOf('boolean')

    const items2 = await listSnapshots(docId)
    expect(items2.find(x => x.id === s1.id)).toBeFalsy()
  })
})


