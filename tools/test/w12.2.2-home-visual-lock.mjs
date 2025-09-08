import puppeteer from 'puppeteer'

async function run(){
  const base = process.env.BASE_URL || 'http://localhost:2000'
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
  const page = await browser.newPage()
  const errors = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })

  await page.goto(base + '/home', { waitUntil: 'networkidle2', timeout: 30000 })
  await page.waitForSelector('[data-testid="page-scaffold"]', { timeout: 10000 })

  // Exactly one h2 'Your Home'
  const count = await page.$$eval('h2', els => els.filter(e => (e.textContent||'').trim() === 'Your Home').length)
  if (count !== 1) throw new Error('Expected exactly one "Your Home" heading, got ' + count)

  // Background should differ from default (has gradient or non-empty bg)
  const hasBg = await page.$eval('[data-testid="page-scaffold"]', el => {
    const cs = getComputedStyle(el)
    return (cs.backgroundImage && cs.backgroundImage !== 'none') || (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)')
  })
  if (!hasBg) throw new Error('Scaffold background not applied')

  // Footer brand color equals footer link color
  const colors = await page.evaluate(() => {
    const f = document.querySelector('footer.site-footer')
    if (!f) return null
    const b = f.querySelector('.footer-brand')
    const a = f.querySelector('a')
    if (!b || !a) return null
    return { brand: getComputedStyle(b).color, link: getComputedStyle(a).color }
  })
  if (!colors || colors.brand !== colors.link) throw new Error('Footer brand color mismatch')

  await page.screenshot({ path: 'ai_store/screenshots/w12.2.2-home-desktop.png', fullPage: true })
  await page.setViewport({ width: 820, height: 1180, deviceScaleFactor: 1 })
  await page.screenshot({ path: 'ai_store/screenshots/w12.2.2-home-ipad.png', fullPage: true })
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })
  await page.screenshot({ path: 'ai_store/screenshots/w12.2.2-home-mobile.png', fullPage: true })

  if (errors.length) throw new Error('Console errors: ' + errors.join('\n'))
  console.log('w12.2.2-home-visual-lock: PASS')
  await browser.close()
}

run().catch(e => { console.error(e); process.exit(1) })


