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
  // Capture console errors (attach before navigation)
  const errors = []
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()) })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
  // Assertions
  // Badge presence: look for text like 'Updated ' in either table badge or chart badge
  const badgePresent = await page.evaluate(() => {
    const badges = Array.from(document.querySelectorAll('span')).map(el => el.textContent || '')
    return badges.some(t => /Updated\s+\d+m\s+ago|Updated\s+just\s+now/i.test(t))
  })
  if (!badgePresent) throw new Error('Updated badge not found')
  const hasHScroll = await page.evaluate(() => {
    const bw = document.body.scrollWidth - document.body.clientWidth
    const style = getComputedStyle(document.body)
    const hidden = style.overflowX === 'hidden' || style.overflowX === 'clip'
    return bw > 2 && !hidden
  })
  if (hasHScroll) throw new Error('Horizontal scroll detected')
  // Table headers visible and sticky (when table exists). If no table (empty state), skip.
  const stickyResult = await page.evaluate(() => {
    const head = document.querySelector('table[data-testid="pools-table"] thead')
    if (!head) return { present: false, sticky: false }
    const posHead = getComputedStyle(head).position
    if (posHead === 'sticky') return { present: true, sticky: true }
    if (head.classList.contains('sticky')) return { present: true, sticky: true }
    const ths = head.querySelectorAll('th')
    for (const th of Array.from(ths)) {
      const pos = getComputedStyle(th).position
      if (pos === 'sticky') return { present: true, sticky: true }
      if ((th && th.nodeType === 1 && th.classList && th.classList.contains('sticky'))) return { present: true, sticky: true }
    }
    return { present: true, sticky: false }
  })
  if (stickyResult.present && !stickyResult.sticky) throw new Error('Expected sticky table header, none detected')
  if (errors.length > 0) throw new Error(`Console errors detected: ${errors.join('\n')}`)
  // Rows may be 0 when offline; do not fail on count
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


