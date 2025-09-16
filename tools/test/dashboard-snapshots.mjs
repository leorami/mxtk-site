import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'

async function main(){
  const baseUrl = process.env.BASE_URL || 'http://localhost:2000'
  const ts = Date.now()
  const outDir = path.join(process.cwd(), 'artifacts', String(ts))
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1400, height: 900, deviceScaleFactor: 1 })
  let sawConsoleError = false
  let sawRequestFail = false
  page.on('console', msg => {
    const t = msg.type();
    const txt = msg.text();
    if (t === 'error') { console.error('[console]', txt); sawConsoleError = true }
  })
  page.on('requestfailed', r => {
    console.error('[requestfailed]', r.url(), r.failure()?.errorText)
    sawRequestFail = true
  })
  page.on('dialog', async d => { try { await d.accept('e2e'); } catch {} })

  try {
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle0' })
    // Ensure Guide open (toggle pill)
    try {
      await page.waitForSelector('[data-testid="sherpa-pill"]', { timeout: 5000 })
      await page.click('[data-testid="sherpa-pill"]')
      await new Promise(r => setTimeout(r, 250))
    } catch {}
    // Force guide-open class to ensure controls visible
    await page.evaluate(() => { document.documentElement.classList.add('guide-open'); })

    // Save snapshot
    await page.waitForSelector('.snapshots-ctl-group .btn', { timeout: 10000 })
    await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('button'))
      const el = nodes.find(n => (n.textContent || '').trim() === 'Save')
      if (el) el.click()
    })
    await new Promise(r => setTimeout(r, 400))

    // Capture a widget position before change
    await page.waitForSelector('.widget-cell', { timeout: 10000 })
    const firstWidget = await page.$('.widget-cell')
    const before = await page.evaluate(el => ({ col: el.style.gridColumn, row: el.style.gridRow, id: el.getAttribute('data-widget-id') }), await page.$('.widget-cell'))
    const beforeStyle = { col: before.col, row: before.row }
    const widgetId = before.id
    if (!widgetId) throw new Error('No widget id found')
    // Move widget down by one row using keyboard
    await page.click(`.widget-cell[data-widget-id="${widgetId}"]`)
    await page.keyboard.press('ArrowDown')
    await new Promise(r => setTimeout(r, 500))

    // Ensure list exists at least once
    await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('button'))
      const el = nodes.find(n => (n.textContent || '').trim() === 'Restore')
      if (el) el.click()
    })
    await new Promise(r => setTimeout(r, 200))
    // Close panel by toggling Manage
    await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('button'))
      const el = nodes.find(n => (n.textContent || '').trim() === 'Manage')
      if (el) el.click()
    })
    await new Promise(r => setTimeout(r, 200))

    // Save again (creates second snapshot)
    await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('button'))
      const el = nodes.find(n => (n.textContent || '').trim() === 'Save')
      if (el) el.click()
    })
    await new Promise(r => setTimeout(r, 400))
    // Perform a small resize using on-screen handle (Guide must be open)
    await page.waitForSelector('.wframe-resize.br', { timeout: 10000 })
    const handle = await page.$('.wframe-resize.br')
    const box = handle && await handle.boundingBox()
    if (!box) throw new Error('No handle box')
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.down()
    await page.mouse.move(box.x + 30, box.y + 20, { steps: 10 })
    await page.mouse.up()
    await new Promise(r => setTimeout(r, 500))
    const changedStyle = await page.evaluate(el => ({ col: el.style.gridColumn, row: el.style.gridRow }), firstWidget)

    // Open Manage modal and restore the most recent by clicking first row restore
    await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('button'))
      const el = nodes.find(n => (n.textContent || '').trim() === 'Manage')
      if (el) el.click()
    })
    await page.waitForSelector('div[role="dialog"] table tbody tr', { timeout: 8000 })
    await page.evaluate(() => {
      const row = document.querySelector('div[role="dialog"] table tbody tr')
      const btn = row ? row.querySelector('button') : null
      if (btn) btn.click()
    })
    await new Promise(r => setTimeout(r, 800))

    const restoredStyle = await page.evaluate(el => ({ col: el.style.gridColumn, row: el.style.gridRow }), firstWidget)

    // Expect styles defined; equality check demonstrates revert path executed without errors
    if (!beforeStyle.col || !restoredStyle.col) throw new Error('Missing grid styles')
    // Verify revert occurred
    if (changedStyle.col === beforeStyle.col && changedStyle.row === beforeStyle.row) {
      throw new Error('Move did not change grid styles')
    }
    if (restoredStyle.col !== beforeStyle.col || restoredStyle.row !== beforeStyle.row) {
      throw new Error('Restore did not revert grid styles')
    }

    await page.screenshot({ path: path.join(outDir, 'dashboard-snapshots.png'), fullPage: true })
    if (sawConsoleError || sawRequestFail) throw new Error('Console or network errors detected')
    fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify({ ok: true, beforeStyle, changedStyle, restoredStyle, baseUrl }, null, 2))
  } finally {
    await browser.close()
  }
}

main().catch(err => { console.error(err); process.exit(1) })


