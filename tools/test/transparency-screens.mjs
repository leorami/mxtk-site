#!/usr/bin/env node
import puppeteer from 'puppeteer'
import fs from 'fs/promises'
import path from 'path'

const BASE_URL = process.env.BASE_URL || 'http://localhost:2000'
const OUT_DIR = path.resolve(process.cwd(), 'artifacts')

async function ensureDir(dir) { try { await fs.mkdir(dir, { recursive: true }) } catch {} }

async function capture(page, name, width, height) {
  await page.setViewport({ width, height, deviceScaleFactor: 2 })
  const url = new URL('/transparency', BASE_URL).toString()
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
  // Assertions
  const hasHScroll = await page.evaluate(() => document.body.scrollWidth > document.body.clientWidth)
  if (hasHScroll) throw new Error('Horizontal scroll detected')
  // Table headers visible
  await page.waitForSelector('thead', { timeout: 10000 })
  // At least 2 rows
  const rows = await page.$$eval('tbody tr', els => els.length)
  if (rows < 2) throw new Error(`Expected at least 2 rows, got ${rows}`)
  // Chart SVG path exists
  const hasPath = await page.$eval('svg path', () => true).catch(() => false)
  if (!hasPath) throw new Error('Chart path not found')
  // Screenshot
  const file = path.join(OUT_DIR, `transparency-${name}.png`)
  await page.screenshot({ path: file, fullPage: true })
  return file
}

async function main() {
  await ensureDir(OUT_DIR)
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  try {
    const page = await browser.newPage()
    const desktop = await capture(page, 'desktop', 1280, 800)
    const ipad = await capture(page, 'ipad', 834, 1112)
    const mobile = await capture(page, 'mobile', 390, 844)
    console.log(JSON.stringify({ desktop, ipad, mobile }, null, 2))
  } finally {
    await browser.close()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })


