import puppeteer from 'puppeteer'

async function run(){
  const base = process.env.BASE_URL || 'http://localhost:2000'
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
  const page = await browser.newPage()
  const consoleErrors = []
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()) })

  // 1) Visit /home with no widgets -> StarterPanel visible
  await page.goto(base + '/home', { waitUntil: 'networkidle2', timeout: 30000 })
  await page.waitForSelector('.starter-panel', { timeout: 10000 })

  // 2) Click 'Learn' preset and wait for navigation
  await page.click('.chip-row.subtle .chip:nth-child(2)')
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 })

  // assert >=3 widgets and no duplicate 'Your Home' headings
  const widgetCount = await page.$$eval('[data-testid="widget-frame"]', els => els.length)
  const headers = await page.$$eval('.section-header h2', els => els.map(e => e.textContent?.trim()).filter(Boolean))
  if (widgetCount < 3) throw new Error('Expected at least 3 widgets after seeding')
  if (headers.filter(h => h === 'Your Home').length !== 1) throw new Error('Duplicate "Your Home" headings')

  // 3) Assert background class applied
  const hasBg = await page.$eval('[data-testid="page-scaffold"]', el => el.className.includes('mxtk-bg-mineral'))
  if (!hasBg) throw new Error('Missing mineral background class')

  // 4) Footer brand color equals footer link color (computed)
  const colors = await page.evaluate(() => {
    const footer = document.querySelector('footer.site-footer');
    if (!footer) return null;
    const brand = footer.querySelector('.footer-brand');
    const link = footer.querySelector('a');
    if (!brand || !link) return null;
    const gb = getComputedStyle(brand).color;
    const gl = getComputedStyle(link).color;
    return { gb, gl };
  })
  if (!colors || colors.gb !== colors.gl) throw new Error('Footer brand color mismatch')

  // 5) Screenshots
  await page.screenshot({ path: 'ai_store/screenshots/w12.2.1-home-desktop.png', fullPage: true })
  await page.setViewport({ width: 820, height: 1180, deviceScaleFactor: 1 })
  await page.screenshot({ path: 'ai_store/screenshots/w12.2.1-home-ipad.png', fullPage: true })
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })
  await page.screenshot({ path: 'ai_store/screenshots/w12.2.1-home-mobile.png', fullPage: true })

  if (consoleErrors.length) throw new Error('Console errors: ' + consoleErrors.join('\n'))
  console.log('w12.2.1-home-starter: PASS')
  await browser.close()
}

run().catch(err => { console.error(err); process.exit(1) })
