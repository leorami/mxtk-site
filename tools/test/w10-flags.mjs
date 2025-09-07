const base = process.env.BASE_URL || 'http://localhost:2000'
export async function run(){
  const puppeteer = await import('puppeteer')
  const fs = await import('node:fs/promises')
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  page.on('console', m=>{ const t=m.type(); if(t==='error'||t==='warning'){ throw new Error('Console '+t+': '+m.text()) } })
  page.on('response', async (res)=> {
    try {
      const st = res.status();
      if (st >= 400) {
        // Log as info to avoid failing due to our own diagnostics; console.error would trip the handler above
        console.log('HTTP '+st+': '+res.url())
      }
    } catch {}
  })

  // Seed flags (dev/test only)
  const seed = [
    { source: 'system', reason: 'policy breach', category: 'policy', severity: 2 },
    { source: 'ingest', reason: 'spam terms detected', category: 'spam', severity: 3 },
    { source: 'chat', reason: 'possible pii', category: 'pii', severity: 1 },
  ]
  const rSeed = await fetch(base + '/api/ai/flags/seed', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(seed) })
  if (!rSeed.ok) throw new Error('seed failed')

  // Visit root to confirm no layout regressions
  await page.goto(base+'/', { waitUntil:'networkidle0' })

  // Navigate to Admin → Flags (set admin cookie in test to avoid interactive step)
  await page.setCookie({ name: 'mxtk_admin', value: '1', url: base, httpOnly: false, sameSite: 'Lax' })
  await page.goto(base+'/admin/flags', { waitUntil:'networkidle0' })

  // Assert table rows >= 3
  await page.waitForSelector('[data-testid="flags-client"] table tbody tr', { timeout: 8000 })
  const rows = await page.$$eval('[data-testid="flags-client"] table tbody tr', els => els.length)
  if (rows < 3) throw new Error('expected >=3 rows, got '+rows)

  // Open first row detail
  await page.click('[data-testid="flags-client"] table tbody tr:first-child button[aria-label^="View "]')
  await page.waitForSelector('section[role="region"][aria-label^="Flag detail"]', { timeout: 8000 })

  // Add note and resolve
  await page.type('section[role="region"] input[aria-label="Add note"]', 'looks fine')
  await page.click('section[role="region"] button[aria-label^="Resolve "]')
  // verify status updated in UI (allow brief delay)
  await page.waitForFunction(()=>{
    const tr = document.querySelector('[data-testid="flags-client"] table tbody tr:first-child')
    return tr && tr.textContent && /resolved/.test(tr.textContent)
  }, { timeout: 5000 })

  // Verify via GET one
  const firstId = await page.$eval('[data-testid="flags-client"] table tbody tr:first-child button[aria-label^="View "]', el => (el.getAttribute('aria-label')||'').split(' ').pop())
  const rOne = await fetch(base + '/api/ai/flags/' + firstId)
  if (!rOne.ok) throw new Error('GET one failed')

  // Save screenshots
  await fs.mkdir(`${process.cwd()}/.tmp/mxtk`, { recursive: true })
  await page.setViewport({ width: 1440, height: 900 })
  await page.screenshot({ path: `${process.cwd()}/.tmp/mxtk/w10-flags-desktop.png`, fullPage: true })
  await page.setViewport({ width: 1024, height: 900 })
  await page.screenshot({ path: `${process.cwd()}/.tmp/mxtk/w10-flags-ipad.png`, fullPage: true })
  await page.setViewport({ width: 390, height: 844 })
  await page.screenshot({ path: `${process.cwd()}/.tmp/mxtk/w10-flags-mobile.png`, fullPage: true })

  // Dump computed styles for shiftable root and guide drawer
  const dump = await page.evaluate(()=>{
    const sh = document.querySelector('[data-shiftable-root]')
    const gd = document.querySelector('.guide-drawer')
    const sc = (el)=> el ? getComputedStyle(el) : null
    const toObj = (cs)=> cs ? { paddingRight: cs.paddingRight, width: cs.width, position: cs.position } : null
    return {
      shiftable: toObj(sc(sh)),
      drawer: toObj(sc(gd))
    }
  })
  await fs.writeFile(`${process.cwd()}/.tmp/mxtk/w10-flags-styles.json`, JSON.stringify(dump, null, 2), 'utf8')

  await browser.close()
}

// Execute when run directly
run().catch(e=>{ console.error(e); process.exit(1); })
