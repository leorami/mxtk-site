const base = process.env.BASE_URL || 'http://localhost:2000'
export async function run(){
  const puppeteer = await import('puppeteer')
  const fs = await import('node:fs/promises')
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 900 })
  page.on('console', m=>{ const t=m.type(); if(t==='error'||t==='warning'){ throw new Error('Console '+t+': '+m.text()) } })
  await page.goto(base+'/', { waitUntil:'networkidle0' })
  try {
    await page.waitForSelector('[data-testid="sherpa-pill"]', { timeout: 8000 })
    await page.$eval('[data-testid="sherpa-pill"]', (el)=> (el instanceof HTMLElement) && el.click())
    await page.waitForSelector('aside[role="complementary"]', { timeout: 8000 })
  } catch (e) {
    console.warn('Sherpa open step skipped:', e && (e.message || e))
  }
  await page.goto(base+'/home', { waitUntil:'networkidle0' })
  // open/close guide drawer on admin flags page too
  try {
    await page.goto(base+'/admin/flags', { waitUntil:'networkidle0' })
    await page.waitForSelector('[data-testid="sherpa-pill"]', { timeout: 8000 })
    await page.$eval('[data-testid="sherpa-pill"]', (el)=> (el instanceof HTMLElement) && el.click())
    await page.waitForSelector('aside[role="complementary"]', { timeout: 8000 })
  } catch (e) {
    console.warn('Admin flags drawer check skipped:', e && (e.message || e))
  }
  await page.waitForSelector('.main-container .grid')
  const out = `${process.cwd()}/.tmp/mxtk/w8-home.png`
  await fs.mkdir(`${process.cwd()}/.tmp/mxtk`, { recursive: true })
  await page.screenshot({ path: out, fullPage:true })
  await fs.stat(out)
  console.log('screenshot saved', out)

  // New: navigate to /facts and assert no horizontal scroll
  await page.goto(base+'/facts', { waitUntil:'networkidle0' })
  await page.waitForSelector('[data-testid="facts-view"]', { timeout: 8000 })
  const hasHScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  if (hasHScroll) throw new Error('Horizontal scroll detected on /facts')

  await browser.close()
}
// Execute by default when invoked via `node tools/test/w8-nav-debug.mjs`
run().catch(e=>{ console.error(e); process.exit(1); })


