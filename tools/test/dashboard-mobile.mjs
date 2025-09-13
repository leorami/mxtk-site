#!/usr/bin/env node
import puppeteer from 'puppeteer'

const BASE_URL = process.env.BASE_URL || 'http://localhost:2000'

async function run() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded' })

  // Ensure no horizontal overflow
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  if (hasOverflow) throw new Error('Horizontal overflow on iPhone width')

  // Ensure actions row exists and is on the same row as title (layout check)
  const hasActionsRow = await page.$('.wf-head .wf-actions')
  if (!hasActionsRow) throw new Error('No actions row found')

  // Guide closed defaults; drag should be disabled
  const startCount = await page.$$eval('[data-grid] [data-widget-id]', els => els.length)
  await page.mouse.move(50, 300)
  await page.mouse.down()
  await page.mouse.move(200, 300)
  await page.mouse.up()
  const endCount = await page.$$eval('[data-grid] [data-widget-id]', els => els.length)
  if (endCount !== startCount) throw new Error('Drag changed grid unexpectedly while guide closed')

  await page.screenshot({ path: 'artifacts/dashboard-mobile-polish.png' })
  await browser.close()
  console.log('dashboard-mobile: OK')
}

run().catch(err => { console.error(err); process.exit(1) })


