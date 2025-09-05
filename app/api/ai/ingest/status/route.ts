import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

export async function GET() {
  const base = process.env.AI_VECTOR_DIR || './ai_store';
  
  async function count(file: string) {
    try {
      const p = path.join(process.cwd(), base, file);
      const txt = await fs.readFile(p, 'utf8');
      const arr = JSON.parse(txt);
      return Array.isArray(arr) ? arr.length : 0;
    } catch {
      return 0;
    }
  }
  
  const embeddings = await count('embeddings.json');
  const chunks = await count('chunks.json');
  
  let updatedAt: string | null = null;
  try {
    const st = await fs.stat(path.join(process.cwd(), base, 'embeddings.json'));
    updatedAt = new Date(st.mtimeMs).toISOString();
  } catch {
    // File doesn't exist or can't be read
  }
  
  return NextResponse.json({ 
    ok: true, 
    embeddings, 
    chunks, 
    updatedAt 
  });
}
