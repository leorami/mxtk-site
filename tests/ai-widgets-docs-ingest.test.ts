import { getEmbedder } from '@/lib/ai/models'
import { loadVectorStore, searchSimilar } from '@/lib/ai/vector-store'
import { ingestUserDocs } from '@/scripts/ai.ingest.docs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { beforeAll, describe, expect, it } from 'vitest'

describe('User docs ingestion (widgets)', () => {
  const guidePath = path.join(process.cwd(), 'docs', 'user', 'WIDGETS_USER_GUIDE.md')

  beforeAll(async () => {
    // Ensure the guide exists
    const ok = await fs
      .stat(guidePath)
      .then(() => true)
      .catch(() => false)
    expect(ok).toBe(true)
    await ingestUserDocs()
  })

  it('ingests widgets user guide into the vector store', async () => {
    const store = await loadVectorStore()
    const has = store.chunks.some((c) => String(c.meta?.source || '').includes('docs/user/WIDGETS_USER_GUIDE.md'))
    expect(has).toBe(true)
  })

  it('retrieves widgets guidance via similarity search', async () => {
    const embedder = getEmbedder()
    const results = await searchSimilar('Managing your home widgets add remove move resize', embedder, 25)
    const anyWidgetsDoc = results.some((r) => String(r.chunk.meta?.source || '').includes('WIDGETS_USER_GUIDE'))
    expect(anyWidgetsDoc).toBe(true)
  })
})


