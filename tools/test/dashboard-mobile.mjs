#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import puppeteer from 'puppeteer'

async function main(){
  const BASE_URL = process.env.BASE_URL || 'http://localhost:2000'
  const BASE_PATH = (process.env.BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || '').trim() || ''
  const origin = BASE_URL.replace(/\/$/, '')
  const basePath = (BASE_PATH || '').replace(/\/$/, '')
  const outDir = path.resolve(process.cwd(), 'artifacts', String(Date.now()))
  fs.mkdirSync(outDir, { recursive: true })

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 })

  const errors = []
  page.on('pageerror', e => errors.push({ type: 'pageerror', message: e.message }))
  page.on('console', msg => {
    const type = msg.type()
    if (type === 'error') errors.push({ type: 'console', message: msg.text() })
  })

  const report = { startedAt: Date.now(), baseUrl: origin + basePath, assertions: [] }

  await page.goto(`${origin}${basePath}/dashboard`, { waitUntil: 'networkidle2' })
  await page.waitForSelector('[data-testid="sherpa-cluster"], header')

  // Footer Dock visible on mobile
  const dockSel = '.footer-dock'
  await page.waitForTimeout(500)
  const dockVisible = await page.$eval(dockSel, el => getComputedStyle(el).display !== 'none')
  report.assertions.push({ name: 'footerDockVisible', pass: !!dockVisible })

  // Journey Stage pill exists (ExperienceToggle icons)
  const hasXP = await page.$$eval('.footer-dock .experience-toggle button', els => els.length >= 1)
  report.assertions.push({ name: 'journeyStagePresent', pass: !!hasXP })

  // Theme switch exists
  const hasTheme = await page.$$eval('.footer-dock .footer-dock__right button', els => els.length >= 1)
  report.assertions.push({ name: 'themeTogglePresent', pass: !!hasTheme })

  // Grid: single column
  await page.waitForSelector('[data-grid]')
  const colCount = await page.$eval('[data-grid]', el => {
    const cs = getComputedStyle(el)
    const tmpl = cs.getPropertyValue('grid-template-columns')
    return (tmpl || '').trim().split(' ').filter(Boolean).length
  })
  report.assertions.push({ name: 'gridSingleColumn', pass: colCount === 1, got: colCount })

  // Attempt drag: click on a widget header should not move position and should show toast
  const firstTile = await page.$('.widget-tile')
  const bbox = await firstTile.boundingBox()
  // record initial Y row position via computed grid-row-start
  const initialRow = await page.$eval('.widget-tile', el => {
    const cs = getComputedStyle(el)
    const row = cs.getPropertyValue('grid-row-start')
    return row
  })

  // Find header and try to drag
  const head = await firstTile.$('.wf-head')
  const headBox = await head.boundingBox()
  await page.mouse.move(headBox.x + headBox.width/2, headBox.y + headBox.height/2)
  await page.mouse.down()
  await page.mouse.move(headBox.x + headBox.width/2, headBox.y + headBox.height/2 + 60, { steps: 8 })
  await page.mouse.up()
  await page.waitForTimeout(300)

  // Toast appeared
  const toastShown = await page.$$eval('.mxtk-toast-host .mxtk-toast', els => els.length > 0)
  report.assertions.push({ name: 'toastOnDragAttempt', pass: !!toastShown })

  // Position unchanged
  const afterRow = await page.$eval('.widget-tile', el => getComputedStyle(el).getPropertyValue('grid-row-start'))
  report.assertions.push({ name: 'positionUnchanged', pass: initialRow === afterRow, before: initialRow, after: afterRow })

  // No horizontal scroll
  const hasHScroll = await page.evaluate(() => document.scrollingElement.scrollWidth > document.scrollingElement.clientWidth)
  report.assertions.push({ name: 'noHorizontalScroll', pass: !hasHScroll })

  // Network errors (basic): none captured via console
  report.assertions.push({ name: 'noConsoleErrors', pass: errors.length === 0, errors })

  // Screenshots
  await page.screenshot({ path: path.join(outDir, 'dashboard-mobile.png'), fullPage: true })
  await page.screenshot({ path: path.join(outDir, 'dock-closeup.png'), clip: { x: 0, y: bbox.y + bbox.height - 120, width: 390, height: 120 } })

  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2))
  await browser.close()

  const failed = report.assertions.find(a => !a.pass)
  if (failed) {
    console.error('Failures:', report.assertions.filter(a => !a.pass))
    process.exit(1)
  }
  console.log('OK:', outDir)
}

main().catch(err => { console.error(err); process.exit(1) })


