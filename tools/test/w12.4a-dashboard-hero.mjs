import puppeteer from 'puppeteer'
const base = process.env.BASE_URL || 'http://localhost:2000'

;(async () => {
  const browser = await puppeteer.launch({args:['--no-sandbox','--disable-setuid-sandbox']})
  const page = await browser.newPage()
  await page.goto(base + '/dashboard', { waitUntil: 'networkidle2' })
  await page.waitForSelector('[data-testid="page-scaffold"]')
  // jump to sections
  for (const id of ['overview','learn','build','operate','library']) {
    await page.click(`a[href="#${id}"]`)
    // Wait for a short time to let the page scroll
    await new Promise(resolve => setTimeout(resolve, 300))
  }
  await browser.close()
  process.exit(0)
})()
