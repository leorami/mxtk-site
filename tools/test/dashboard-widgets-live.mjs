// tools/test/dashboard-widgets-live.mjs
// E2E: verify live widgets interactions (PriceLarge interval toggle, PoolsTable limit)

import fetch from 'node-fetch'
import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer'

const BASE = process.env.BASE_URL || process.argv[2] || 'http://localhost:2000'
const DASHBOARD = `${BASE.replace(/\/$/, '')}/dashboard`
const TS = new Date().toISOString().replace(/[:.]/g, '-')
const ART_DIR = path.join(process.cwd(), 'artifacts')

async function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }) }

async function withPage(browser, viewport, fn) {
  const page = await browser.newPage()
  await page.setViewport(viewport)
  const errors = []; const networkErrors = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('response', r => { if (r.status() >= 400) networkErrors.push(`${r.status()} ${r.url()}`) })
  await fn(page, { errors, networkErrors })
  await page.close()
  return { errors, networkErrors }
}

(async () => {
  await ensureDir(ART_DIR)
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] })
  try {
    const viewports = [
      { name: 'desktop', vp: { width: 1366, height: 900, deviceScaleFactor: 1 } },
      { name: 'ipad',    vp: { width: 820,  height: 1180, deviceScaleFactor: 1 } },
      { name: 'mobile',  vp: { width: 390,  height: 844, deviceScaleFactor: 2 } },
    ]

    const results = {}

    for (const { name, vp } of viewports) {
      // Ensure home has widgets
      try {
        await fetch(`${DASHBOARD.replace(/\/dashboard$/, '')}/api/ai/home/seed`, { method: 'POST', headers: { 'content-type': 'application/json', 'ngrok-skip-browser-warning': 'true' }, body: JSON.stringify({ id: 'default', mode: 'learn', adapt: true }) })
      } catch {}
      const metrics = {}
      const caps = await withPage(browser, vp, async (page) => {
        await page.goto(DASHBOARD, { waitUntil: 'networkidle2', timeout: 45000 })
        // Open guide to make controls visible
        await page.evaluate(() => { try { document.documentElement.classList.add('guide-open'); localStorage.setItem('mxtk_guide_open','1') } catch {} })

        // Click interval 24h inside PriceLarge widget body
        await page.waitForSelector('.widget-tile', { timeout: 12000 })
        // Fallback query: use buttons inside price widget body
        await page.evaluate(() => {
          const tile = Array.from(document.querySelectorAll('.widget-tile')).find(t => /price/i.test(t.querySelector('.wf-title')?.textContent||''))
          const btns = tile?.querySelectorAll('button')
          const b24 = Array.from(btns || []).find(b => /24h/i.test(b.textContent||''))
          if (b24) (b24).click()
        })
        await page.waitForNetworkIdle({ timeout: 10000 })

        // Assert that the selection changed by checking active class
        const intervalState = await page.evaluate(() => {
          const tile = Array.from(document.querySelectorAll('.widget-tile')).find(t => /price/i.test(t.querySelector('.wf-title')?.textContent||''))
          const active = tile ? Array.from(tile.querySelectorAll('button')).find(b => /24h/i.test(b.textContent||'') && getComputedStyle(b).fontWeight >= '500') : null
          return Boolean(active)
        })

        // PoolsTable: open settings and change limit to 3
        await page.evaluate(() => {
          const tile = Array.from(document.querySelectorAll('.widget-tile')).find(t => /pool/i.test(t.querySelector('.wf-title')?.textContent||''))
          const gear = tile?.querySelector('button.iconbtn')
          if (gear) (gear).click()
        })
        await page.waitForTimeout(200)
        await page.evaluate(() => {
          const menu = Array.from(document.querySelectorAll('.widget-tile')).find(t => /pool/i.test(t.querySelector('.wf-title')?.textContent||''))
          const btn3 = menu?.querySelector('button')
          if (btn3) (btn3).click()
          const save = Array.from(document.querySelectorAll('button')).find(b => /save/i.test(b.textContent||''))
          if (save) (save).click()
        })
        await page.waitForNetworkIdle({ timeout: 10000 })

        // Assert row count <= 3
        const rowCountOk = await page.evaluate(() => {
          const table = document.querySelector('table[data-testid="pools-table"] tbody')
          return table ? table.querySelectorAll('tr').length <= 3 : true
        })

        const screenshot = path.join(ART_DIR, `dashboard-live-${name}-${TS}.png`)
        await page.screenshot({ path: screenshot, fullPage: true })

        Object.assign(metrics, { intervalState, rowCountOk, screenshot })
      })

      results[name] = { ...metrics, consoleErrors: caps.errors, networkErrors: caps.networkErrors }
    }

    const out = path.join(ART_DIR, `dashboard-live-${TS}.json`)
    fs.writeFileSync(out, JSON.stringify({ base: BASE, timestamp: TS, results }, null, 2))

    // Assertions
    const failures = []
    for (const [name, r] of Object.entries(results)) {
      if (!r.intervalState) failures.push(`[${name}] PriceLarge interval did not toggle to 24h`)
      if (!r.rowCountOk) failures.push(`[${name}] PoolsTable did not reduce to <=3 rows after limit change`)
      if ((r.consoleErrors||[]).length) failures.push(`[${name}] consoleErrors: ${r.consoleErrors.length}`)
      if ((r.networkErrors||[]).length) failures.push(`[${name}] networkErrors: ${r.networkErrors.length}`)
    }
    if (failures.length) {
      console.error('Live widgets test failed:\n' + failures.map(s => ` - ${s}`).join('\n'))
      process.exit(1)
    }
    console.log('Artifacts saved:', Object.values(results).map(r => r.screenshot))
    console.log('Report:', out)
    process.exit(0)
  } catch (err) {
    console.error(err && err.stack || String(err))
    process.exit(1)
  } finally {
    await browser?.close().catch(() => {})
  }
})()


