#!/usr/bin/env node
import puppeteer from 'puppeteer'

const BASE_URL = process.env.BASE_URL || 'http://localhost:2000'

async function getStyles(page, selector) {
  return await page.$$eval(selector, (nodes) => nodes.map((el) => {
    const cs = window.getComputedStyle(el)
    return {
      textDecorationLine: cs.textDecorationLine,
      textDecoration: cs.textDecoration,
      borderBottomStyle: cs.borderBottomStyle,
      outerHTML: el.outerHTML.slice(0, 200),
    }
  }))
}

async function main() {
  const ts = Date.now()
  const outDir = `artifacts/${ts}`
  const fs = await import('node:fs/promises')
  await fs.mkdir(outDir, { recursive: true })

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  page.setDefaultTimeout(30000)
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' })
  await page.waitForSelector('.section-rail')

  const selectors = [
    'a.btn', 'a.btn-primary', 'a.btn-outline', 'a.btn-soft', 'a.btn-link',
    'button.btn a',
  ]

  let failed = false
  for (const sel of selectors) {
    const styles = await getStyles(page, sel)
    for (const st of styles) {
      const noUnderline = (st.textDecorationLine || '').toLowerCase() === 'none' || (st.textDecoration || '').toLowerCase() === 'none'
      const noBorderHack = (st.borderBottomStyle || '').toLowerCase() === 'none'
      if (!(noUnderline && noBorderHack)) {
        failed = true
        console.error(`Underline regression: ${sel} =>`, st)
      }
    }
  }

  await page.screenshot({ path: `${outDir}/buttons-underline.png`, fullPage: true })
  await browser.close()
  if (failed) {
    console.error(`Buttons underline check FAILED. Screenshot: ${outDir}/buttons-underline.png`)
    process.exit(1)
  } else {
    console.log(`Buttons underline check passed. Screenshot: ${outDir}/buttons-underline.png`)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })


