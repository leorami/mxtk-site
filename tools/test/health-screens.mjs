import puppeteer from 'puppeteer'
import fs from 'fs/promises'
import path from 'path'

const base = process.env.BASE_URL || 'http://localhost:2000'

const outDir = path.resolve(process.cwd(), 'artifacts', String(Date.now()))
await fs.mkdir(outDir, { recursive: true })

const browser = await puppeteer.launch({ headless: 'new' })
const page = await browser.newPage()

for (const route of ['/transparency']) {
  await page.goto(base + route, { waitUntil: 'networkidle0' })
  await page.waitForSelector('[data-testid="data-health"]', { timeout: 10_000 })
  const file = path.join(outDir, `health-${route.replace(/\W+/g, '_')}.png`)
  await page.screenshot({ path: file, fullPage: true })
  console.log('Saved', file)
}

await browser.close()


