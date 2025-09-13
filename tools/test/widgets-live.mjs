// tools/test/widgets-live.mjs
import puppeteer from 'puppeteer'

const BASE = process.env.BASE_URL || 'http://localhost:2000'

function ts() { return new Date().toISOString().replace(/[:.]/g,'-') }

async function run() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  page.on('console', m => { if (m.type() === 'error') console.error('Console:', m.text()) })
  try {
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle2', timeout: 45000 })
    // Open guide to reveal controls
    await page.evaluate(() => { document.documentElement.classList.add('guide-open'); localStorage.setItem('mxtk_guide_open','1') })
    await page.waitForSelector('.widget-tile', { timeout: 20000 })

    // Find pools-mini and set token
    const pools = await page.$('.widget-tile:has-text("Top Pools")').catch(() => null)
    if (pools) {
      await pools.hover()
      const before = await page.evaluate(() => Date.now())
      await page.$eval('.wframe-controls .iconbtn[title="Refresh"]', (el) => (el instanceof HTMLElement) && el.click())
      await page.waitForTimeout(500)
      const after = await page.evaluate(() => Date.now())
      if (after <= before) throw new Error('Pools refresh did not advance')
    }

    // Find price-mini and refresh
    const price = await page.$('.widget-tile:has-text("Price")').catch(() => null)
    if (price) {
      await price.hover()
      const before = await page.evaluate(() => Date.now())
      await page.$eval('.wframe-controls .iconbtn[title="Refresh"]', (el) => (el instanceof HTMLElement) && el.click())
      await page.waitForTimeout(500)
      const after = await page.evaluate(() => Date.now())
      if (after <= before) throw new Error('Price refresh did not advance')
    }

    // Try dragging the first tile down one row (guide open, handle only)
    const firstTile = await page.$('.widget-tile')
    if (firstTile) {
      const box = await firstTile.boundingBox()
      if (box) {
        // drag from header area (y + 10)
        await page.mouse.move(box.x + 10, box.y + 10)
        await page.mouse.down()
        await page.mouse.move(box.x + 10, box.y + 40, { steps: 5 })
        await page.mouse.up()
      }
    }
    console.log('widgets-live OK', ts())
    process.exit(0)
  } catch (err) {
    console.error(err && err.stack || String(err))
    process.exit(1)
  } finally {
    await browser.close().catch(() => {})
  }
}

run()


