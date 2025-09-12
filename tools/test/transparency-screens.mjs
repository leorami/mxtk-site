#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'
import puppeteer from 'puppeteer'

const BASE_URL = process.env.BASE_URL || 'http://localhost:2000'
const OUT_ROOT = path.resolve(process.cwd(), 'artifacts')
const STAMP = String(Date.now())
const OUT_DIR = path.join(OUT_ROOT, STAMP)

async function ensureDir(dir) { try { await fs.mkdir(dir, { recursive: true }) } catch {} }

async function capture(page, name, width, height, route) {
  await page.setViewport({ width, height, deviceScaleFactor: 2 })
  const url = new URL(route, BASE_URL).toString()
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
  // No console errors
  const errors = []
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
  // Assertions
  const hasHScroll = await page.evaluate(() => document.body.scrollWidth > document.body.clientWidth)
  if (hasHScroll) throw new Error('Horizontal scroll detected')
  // Table headers visible and sticky
  await page.waitForSelector('thead', { timeout: 10000 })
  const position = await page.$eval('thead', (el) => getComputedStyle(el).position)
  if (position !== 'sticky') throw new Error(`Expected thead position sticky, got ${position}`)
  // At least 2 rows
  const rows = await page.$$eval('tbody tr', els => els.length)
  if (rows < 2) throw new Error(`Expected at least 2 rows, got ${rows}`)
  // Chart SVG path exists
  const hasPath = await page.$eval('svg path', () => true).catch(() => false)
  if (!hasPath) throw new Error('Chart path not found')
  // Screenshot
  const safe = route.replace(/\W+/g, '-')
  const file = path.join(OUT_DIR, `${safe}-${name}.png`)
  await page.screenshot({ path: file, fullPage: true })
  return file
}

async function main() {
  await ensureDir(OUT_DIR)
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  try {
    const page = await browser.newPage()
    const routes = ['/transparency', '/institutions']
    const shots = []
    for (const r of routes) {
      shots.push(await capture(page, 'desktop', 1280, 800, r))
      shots.push(await capture(page, 'ipad', 834, 1112, r))
      shots.push(await capture(page, 'mobile', 390, 844, r))
    }
    console.log(JSON.stringify({ outDir: OUT_DIR, shots }, null, 2))
  } finally {
    await browser.close()
  }
}

main().catch((e) => { console.error(e); process.exit(1) })


