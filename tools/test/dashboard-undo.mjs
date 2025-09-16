import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'

async function main(){
  const baseUrl = process.env.BASE_URL || 'http://localhost:2000'
  const ts = Date.now()
  const outDir = path.join(process.cwd(), 'artifacts', String(ts))
  fs.mkdirSync(outDir, { recursive: true })
  const sleep = (ms) => new Promise(r => setTimeout(r, ms))

  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 1 })
  let sawConsoleError = false
  let sawRequestFail = false
  page.on('console', msg => { if (msg.type() === 'error') { console.error('[console]', msg.text()); sawConsoleError = true } })
  page.on('requestfailed', r => { console.error('[requestfailed]', r.url(), r.failure()?.errorText); sawRequestFail = true })

  try {
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle0' })
    // Ensure controls are visible
    try { await page.waitForSelector('[data-testid="sherpa-pill"]', { timeout: 5000 }); await page.click('[data-testid="sherpa-pill"]') } catch {}
    await page.evaluate(() => { document.documentElement.classList.add('guide-open') })

    // Capture initial style of first widget
    // wait for any widget to render (retry loop)
    {
      const start = Date.now();
      while (Date.now() - start < 15000) {
        const have = await page.evaluate(() => document.querySelectorAll('.widget-cell').length)
        if (have > 0) break;
        await sleep(250)
      }
    }
    const first = await page.$('.widget-cell')
    const before = await page.evaluate(el => ({ col: el.style.gridColumn, row: el.style.gridRow }), first)

    // Nudge via keyboard (down)
    await first?.click()
    await page.keyboard.press('ArrowDown')
    await sleep(500)
    const afterMove = await page.evaluate(el => ({ col: el.style.gridColumn, row: el.style.gridRow }), first)

    // Wait for Undo enabled, then click
    {
      const start = Date.now();
      while (Date.now() - start < 8000) {
        const enabled = await page.evaluate(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent||'').trim() === 'Undo');
          return !!(btn && !(btn).disabled);
        })
        if (enabled) break;
        await sleep(200)
      }
      await page.evaluate(() => { const btn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent||'').trim() === 'Undo'); if (btn) btn.click(); })
    }
    await sleep(800)
    const afterUndo = await page.evaluate(el => ({ col: el.style.gridColumn, row: el.style.gridRow }), first)

    // Click Redo (wait until enabled)
    {
      const start = Date.now();
      while (Date.now() - start < 8000) {
        const enabled = await page.evaluate(() => {
          const btn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent||'').trim() === 'Redo');
          return !!(btn && !(btn).disabled);
        })
        if (enabled) break;
        await sleep(200)
      }
      await page.evaluate(() => { const btn = Array.from(document.querySelectorAll('button')).find(b => (b.textContent||'').trim() === 'Redo'); if (btn) btn.click(); })
    }
    await sleep(800)
    let afterRedo = await page.evaluate(el => ({ col: el.style.gridColumn, row: el.style.gridRow }), first)
    // Ensure state is synced by reloading once
    await page.reload({ waitUntil: 'networkidle0' })
    await sleep(500)
    const first2 = await page.$('.widget-cell')
    afterRedo = await page.evaluate(el => ({ col: el.style.gridColumn, row: el.style.gridRow }), first2)

    if (before.col === afterMove.col && before.row === afterMove.row) throw new Error('Move did not change position')
    if (before.col !== afterUndo.col || before.row !== afterUndo.row) throw new Error('Undo did not revert position')
    if (before.col === afterRedo.col && before.row === afterRedo.row) throw new Error('Redo did not reapply position (still equals before)')

    await page.screenshot({ path: path.join(outDir, 'dashboard-undo.png'), fullPage: true })
    if (sawConsoleError || sawRequestFail) throw new Error('Console or network errors detected')
    fs.writeFileSync(path.join(outDir, 'report.undo.json'), JSON.stringify({ ok: true, before, afterMove, afterUndo, afterRedo, baseUrl }, null, 2))
  } finally {
    await page.close();
    await browser.close();
  }
}

main().catch(err => { console.error(err); process.exit(1) })
