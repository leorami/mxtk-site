#!/usr/bin/env node
import puppeteer from 'puppeteer'

const BASE_URL = process.env.BASE_URL || 'http://localhost:2000'

async function main() {
  const ts = Date.now()
  const outDir = `artifacts/${ts}`
  const fs = await import('node:fs/promises')
  await fs.mkdir(outDir, { recursive: true })

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  page.on('console', (msg) => {
    const text = msg.text()
    if (/error/i.test(text)) {
      console.error('console:', text)
    }
  })

  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' })
  await page.waitForSelector('.section-rail', { timeout: 30000 })

  // Try to interact: click first widget refresh if present
  const refreshSel = '.widget-tile .wframe .wf-head .widget-controls .iconbtn'
  const hadRefresh = await page.$(refreshSel)
  if (hadRefresh) {
    await page.click(refreshSel).catch(() => {})
  }

  // Drag the first widget slightly if possible
  const cell = await page.$('.widget-tile')
  if (cell) {
    const box = await cell.boundingBox()
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + 10)
      await page.mouse.down()
      await page.mouse.move(box.x + box.width / 2 + 20, box.y + 10, { steps: 10 })
      await page.mouse.up()
    }
  }

  // Poll recommendations
  const res = await page.evaluate(async () => {
    const res = await fetch('/api/ai/recommendations?doc=default&limit=5', { cache: 'no-store' })
    return res.json()
  })

  if (!res || !Array.isArray(res.items) || res.items.length === 0) {
    console.error('No recommendations received')
  }

  await page.screenshot({ path: `${outDir}/dashboard-recos.png`, fullPage: true })
  await browser.close()
  console.log(`Saved screenshot to ${outDir}/dashboard-recos.png`)
}

main().catch((e) => { console.error(e); process.exit(1) })


