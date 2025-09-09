// lib/home/store.ts
import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import { HomeDocAny, HomeDocV2 } from './types'

const ROOT = process.env.AI_STORE_ROOT || 'ai_store'
const HOMES_DIR = join(process.cwd(), ROOT, 'homes')

async function ensureDir() {
  await fs.mkdir(HOMES_DIR, { recursive: true })
}

export async function readHome(id: string): Promise<HomeDocAny | null> {
  await ensureDir()
  try {
    const raw = await fs.readFile(join(HOMES_DIR, `${id}.json`), 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function writeHome(doc: HomeDocV2): Promise<void> {
  await ensureDir()
  const file = join(HOMES_DIR, `${doc.id}.json`)
  const stamped = { ...doc, updatedAt: new Date().toISOString(), createdAt: doc.createdAt || new Date().toISOString() }
  await fs.writeFile(file, JSON.stringify(stamped, null, 2), 'utf8')
}