import fs from 'node:fs/promises';
import path from 'node:path';

export type Widget = { id: string; type: string; title: string; props?: any; new?: boolean }
export type Home = { id: string; createdAt: string; updatedAt: string; widgets: Widget[] }

const base = process.env.AI_VECTOR_DIR || './ai_store'
const dir = path.join(process.cwd(), base, 'homes')

async function ensure() {
  await fs.mkdir(dir, { recursive: true })
}

export async function loadHome(id: string): Promise<Home | null> {
  await ensure()
  try {
    return JSON.parse(await fs.readFile(path.join(dir, `${id}.json`), 'utf8'))
  } catch {
    return null
  }
}

export async function saveHome(h: Home) {
  await ensure()
  h.updatedAt = new Date().toISOString()
  await fs.writeFile(path.join(dir, `${h.id}.json`), JSON.stringify(h, null, 2), 'utf8')
}


