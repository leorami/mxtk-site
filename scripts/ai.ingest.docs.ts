import fs from 'node:fs/promises'
import path from 'node:path'

import { textToChunks } from '@/lib/ai/chunk'
import { embedAndLog } from '@/lib/ai/embed'
import { flagText } from '@/lib/ai/govern/flag'
import { createFlag, upsertPending } from '@/lib/ai/govern/store'
import { loadVectorStore, saveVectorStore } from '@/lib/ai/vector-store'

export async function listDocs(): Promise<string[]> {
  const root = process.cwd()
  const candidates = [
    path.join(root, 'docs', 'user'),
  ]
  const out: string[] = []
  for (const dir of candidates) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      for (const e of entries) {
        if (e.isFile() && /\.(md|mdx|txt)$/i.test(e.name)) {
          out.push(path.join(dir, e.name))
        }
      }
    } catch {
      // ignore
    }
  }
  // Include top-level developer widgets doc as user-adjacent reference
  const devWidgets = path.join(root, 'docs', 'WIDGETS.md')
  try {
    await fs.access(devWidgets)
    out.push(devWidgets)
  } catch {}
  return out
}

export async function ingestFile(filePath: string) {
  const content = await fs.readFile(filePath, 'utf8')
  const rel = path.relative(process.cwd(), filePath)
  const source = `docs:${rel}`
  const chunks = textToChunks(content, source)

  // Load existing store and compute id set for idempotency
  const store = await loadVectorStore()
  const existingIds = new Set(store.chunks.map((c) => c.id))
  const newChunks = chunks.filter((c) => !existingIds.has(c.id))

  if (newChunks.length === 0) {
    return { added: 0, quarantined: 0, total: 0 }
  }

  // Pre-ingestion flagging with quarantine behavior mirroring API route
  const flaggedIds = new Set<string>()
  await Promise.all(
    newChunks.map(async (c) => {
      const res = await flagText(c.text, c.meta)
      if (res.risk >= 0.5) {
        flaggedIds.add(c.id)
        await upsertPending({
          id: c.id,
          meta: c.meta,
          risk: res.risk,
          reasons: res.reasons,
          labels: res.labels,
          textHash:
            String((c.text || '').length) +
            '-' +
            Buffer.from((c.text || '').slice(0, 64)).toString('base64'),
        })
        const textHash =
          String((c.text || '').length) +
          '-' +
          Buffer.from((c.text || '').slice(0, 64)).toString('base64')
        await createFlag({
          source: 'ingest:docs',
          reason: (res.reasons || []).join('; ') || 'Flagged during docs ingest',
          labels: res.labels,
          metadata: { meta: c.meta, textHash },
        } as any)
      }
    })
  )

  const toEmbed = newChunks.filter((c) => !flaggedIds.has(c.id))
  const embeddings = toEmbed.length ? await embedAndLog(toEmbed.map((c) => c.text), 'ingest-docs') : []

  let eIdx = 0
  for (const c of newChunks) {
    if (flaggedIds.has(c.id)) {
      ;(c as any).quarantined = true
      store.chunks.push(c as any)
      store.embeddings.push(null)
    } else {
      store.chunks.push(c as any)
      store.embeddings.push(embeddings[eIdx++] || null)
    }
  }
  await saveVectorStore(store)
  return { added: toEmbed.length, quarantined: flaggedIds.size, total: newChunks.length }
}

export async function ingestUserDocs() {
  const files = await listDocs()
  if (!files.length) {
    console.log('No user docs found to ingest.')
    return
  }
  console.log('Ingesting user docs into Sherpa vector store...')
  for (const f of files) {
    const res = await ingestFile(f)
    console.log(`- ${path.relative(process.cwd(), f)} → chunks:${res.total} added:${res.added} quarantined:${res.quarantined}`)
  }
  console.log('✅ User docs ingest complete.')
}

if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  ingestUserDocs().catch((e) => {
    console.error('Docs ingest failed:', e)
    process.exit(1)
  })
}


