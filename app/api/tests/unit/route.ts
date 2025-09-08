import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'

export const runtime = 'nodejs'

const TMP_DIR = path.join(process.cwd(), '.tmp')
const LOG_LAST = path.join(TMP_DIR, 'vitest.last.out')
const STATUS = path.join(TMP_DIR, 'vitest.status')
const LOCK = path.join(TMP_DIR, 'vitest.lock')

async function ensureTmp() { await fs.mkdir(TMP_DIR, { recursive: true }).catch(() => { }) }

export async function GET() {
    await ensureTmp()
    let text = ''
    let status = 'idle'
    try { status = (await fs.readFile(STATUS, 'utf8')).trim() } catch { }
    try { text = await fs.readFile(LOG_LAST, 'utf8') } catch { text = '' }
    // Return only last ~200 lines to keep payload small
    const lines = text.split('\n')
    const tail = lines.slice(Math.max(0, lines.length - 200)).join('\n')
    return NextResponse.json({ ok: true, status, tail })
}

export async function POST(_req: NextRequest) {
    await ensureTmp()
    // Prevent concurrent runs
    try {
        await fs.access(LOCK)
        // If lock exists and status says running, bail fast
        const s = await fs.readFile(STATUS, 'utf8').catch(() => Buffer.from(''))
        if (String(s).includes('running')) {
            return NextResponse.json({ ok: false, error: 'already running' }, { status: 409 })
        }
    } catch { }

    await fs.writeFile(LOCK, String(Date.now()))
    await fs.writeFile(STATUS, 'running')
    await fs.writeFile(LOG_LAST, '==> vitest starting\n')

    const child = spawn(process.execPath, [
        '-e',
        // Use npx via a small JS shim to capture better errors
        // This invokes: npx vitest run --reporter=verbose --threads=false
        `import { spawn } from 'node:child_process';
const p = spawn('npx', ['vitest', 'run', '--reporter=verbose', '--threads=false'], { stdio: ['ignore','pipe','pipe'] });
p.stdout.on('data', d => process.stdout.write(d));
p.stderr.on('data', d => process.stdout.write(d));
p.on('exit', (code) => { process.exit(code ?? 1); });
`
    ], { stdio: ['ignore', 'pipe', 'pipe'] })

    // Append output to log file
    child.stdout.on('data', async (d) => { try { await fs.appendFile(LOG_LAST, d) } catch { } })
    child.stderr.on('data', async (d) => { try { await fs.appendFile(LOG_LAST, d) } catch { } })
    child.on('exit', async (code) => {
        try { await fs.appendFile(LOG_LAST, `\n==> vitest exit code: ${code}\n`) } catch { }
        try { await fs.writeFile(STATUS, `done:${code}`) } catch { }
        try { await fs.rm(LOCK) } catch { }
    })

    return NextResponse.json({ ok: true })
}


