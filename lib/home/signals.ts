import type { HomeSignal } from '@/lib/home/types'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const BASE_DIR = process.env.AI_VECTOR_DIR || './ai_store'
const ROOT = process.cwd()
const SIGNALS_FILE = path.join(ROOT, BASE_DIR, 'signals.jsonl')

async function ensureDir(): Promise<void> {
  const dir = path.dirname(SIGNALS_FILE)
  await fs.mkdir(dir, { recursive: true })
}

export async function logSignal(signal: HomeSignal): Promise<void> {
  await ensureDir()
  const line = JSON.stringify(signal) + '\n'
  await fs.appendFile(SIGNALS_FILE, line, 'utf8')
}

export async function listSignals(opts?: { sinceMs?: number }): Promise<HomeSignal[]> {
  await ensureDir()
  try {
    const buf = await fs.readFile(SIGNALS_FILE)
    const txt = buf.toString('utf8')
    const lines = txt.split(/\n+/).filter(Boolean)
    const items: HomeSignal[] = []
    for (const line of lines) {
      try {
        const obj = JSON.parse(line)
        items.push(obj as HomeSignal)
      } catch {
        // ignore malformed lines
      }
    }
    const sinceMs = opts?.sinceMs
    return sinceMs ? items.filter(s => Number(s.ts) >= sinceMs) : items
  } catch (err: any) {
    if (err?.code === 'ENOENT') return []
    return []
  }
}


