import { promises as fs } from 'fs'
import path from 'path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
let GET_LIST: any, POST_CREATE: any, POST_RESTORE: any, DELETE_ONE: any
let putHome: any

// Redirect ai_store to a temp directory
const ORIG_CWD = process.cwd()
const TMP_ROOT = path.join(ORIG_CWD, 'ai_store_test_tmp_api')
function chdirTmp(){
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(process as any).cwd = () => TMP_ROOT
}
function chdirOrig(){
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(process as any).cwd = () => ORIG_CWD
}

describe('snapshots API handlers', () => {
  const docId = 'utest'
  const baseDoc = { id: docId, layoutVersion: 2, sections: [], widgets: [] } as any

  beforeAll(async () => {
    await fs.mkdir(TMP_ROOT, { recursive: true })
    chdirTmp()
    const listMod = await import('@/app/api/ai/home/[id]/snapshots/route')
    const itemMod = await import('@/app/api/ai/home/[id]/snapshots/[sid]/route')
    const store = await import('@/lib/home/store/fileStore')
    GET_LIST = listMod.GET
    POST_CREATE = listMod.POST
    POST_RESTORE = itemMod.POST
    DELETE_ONE = itemMod.DELETE
    putHome = store.putHome
    await putHome(baseDoc)
  })

  afterAll(async () => {
    chdirOrig()
    try { await fs.rm(TMP_ROOT, { recursive: true, force: true }) } catch {}
  })

  it('list, create, restore, delete flows', async () => {
    // list
    const listRes = await GET_LIST(new Request('http://local'), { params: Promise.resolve({ id: docId }) } as any)
    const listBody = await listRes.json()
    expect(Array.isArray(listBody.items)).toBe(true)

    // create
    const createRes = await POST_CREATE(new Request('http://local', { method: 'POST', body: JSON.stringify({ note: 'via-api' }) }), { params: Promise.resolve({ id: docId }) } as any)
    const createBody = await createRes.json()
    expect(createBody?.ok).toBe(true)
    expect(createBody?.meta?.id).toBeTruthy()

    // list again
    const listRes2 = await GET_LIST(new Request('http://local'), { params: Promise.resolve({ id: docId }) } as any)
    const listBody2 = await listRes2.json()
    expect(listBody2.items.length).toBeGreaterThan(0)
    const sid = listBody2.items[0].id

    // restore
    const restoreRes = await POST_RESTORE(new Request('http://local', { method: 'POST', body: JSON.stringify({ action: 'restore' }) }), { params: Promise.resolve({ id: docId, sid }) } as any)
    const restoreBody = await restoreRes.json()
    expect(restoreBody?.ok).toBe(true)
    expect(restoreBody?.doc?.id).toBe(docId)

    // delete
    const delRes = await DELETE_ONE(new Request('http://local', { method: 'DELETE' }), { params: Promise.resolve({ id: docId, sid }) } as any)
    const delBody = await delRes.json()
    expect(delBody?.ok).toBeTypeOf('boolean')
  })
})


