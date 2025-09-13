import { promises as fs } from 'fs'
import path from 'path'
import type { Signal } from './types'

function yyyymmdd(d = new Date()): string {
  return d.toISOString().slice(0,10).replace(/-/g, '')
}

async function ensureDir(): Promise<string> {
  const dir = path.join(process.cwd(), 'ai_store', 'signals')
  await fs.mkdir(dir, { recursive: true })
  return dir
}

export async function append(batch: Signal[]): Promise<void> {
  if (!Array.isArray(batch) || batch.length === 0) return
  const dir = await ensureDir()
  const file = path.join(dir, `${yyyymmdd()}.jsonl`)
  const lines = batch.map(s => JSON.stringify(s)).join('\n') + '\n'
  await fs.appendFile(file, lines, 'utf8')
}


