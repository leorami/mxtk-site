const base = process.env.BASE_URL || 'http://localhost:2000'
export async function run() {
  const puppeteer = await import('puppeteer')
  const fs = await import('node:fs/promises')
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.setViewport({ width: 1366, height: 900 })
  page.on('console', m => { const t = m.type(); if (t === 'error') { throw new Error('Console error: ' + m.text()) } })

  // 1) Open root, open Guide, ask a question
  await page.goto(base + '/', { waitUntil: 'networkidle0' })
  await page.waitForSelector('[data-testid="sherpa-pill"]', { timeout: 8000 })
  await page.$eval('[data-testid="sherpa-pill"]', (el) => (el instanceof HTMLElement) && el.click())
  await page.waitForSelector('.guide-drawer', { timeout: 8000 })
  await page.waitForSelector('input[data-testid="guide-input"]', { timeout: 8000 })
  await page.type('input[data-testid="guide-input"]', 'Show me something useful for Home')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(1500)

  // 2) Verify CTA row logic (present when applicable, removed otherwise)
  const ctaVisible = await page.$eval('.guide-drawer', el => !!el.querySelector('span.opacity-70'))
  if (!ctaVisible) console.warn('CTA row not visible (may depend on AI response).')

  // 3) Click Add to Home -> navigate to /home -> scaffold renders with title/desc/section
  try {
    const addBtn = await page.$('button:has-text("Add to Home"), a:has-text("Open Home")')
    if (addBtn) {
      await addBtn.click()
      await page.waitForTimeout(800)
    }
  } catch {}
  await page.goto(base + '/home', { waitUntil: 'networkidle0' })
  await page.waitForSelector('[data-testid="page-scaffold"]', { timeout: 8000 })
  await page.waitForSelector('section.section-card', { timeout: 8000 })

  // 4) Hover a widget -> content scrolls; click Refresh/Learn More
  const widget = await page.$('[data-testid="widget-frame"]')
  if (widget) {
    await widget.hover()
    await page.waitForTimeout(250)
    await page.$eval('[data-testid="refresh-widget"]', (el) => (el instanceof HTMLElement) && el.click())
    await page.$eval('[data-testid="learn-widget"]', (el) => (el instanceof HTMLElement) && el.click())
  }

  // 5) Assert header icons color equals text color (computed)
  const colorOk = await page.evaluate(() => {
    const header = document.querySelector('.brand-header')
    if (!header) return true
    const cs = getComputedStyle(header)
    const textColor = cs.color
    const icon = document.querySelector('[data-testid="experience-controls-desktop"] [data-testid="experience-icons"]')
    if (!icon) return true
    const iconColor = getComputedStyle(icon).color
    return textColor === iconColor
  })
  if (!colorOk) throw new Error('Header icon color does not match text color')

  // 6) Capture screenshots (desktop/iPad/mobile)
  await fs.mkdir(`${process.cwd()}/.tmp/mxtk`, { recursive: true })
  await page.screenshot({ path: `${process.cwd()}/.tmp/mxtk/w12-desktop.png`, fullPage: true })
  await page.setViewport({ width: 1024, height: 800 })
  await page.screenshot({ path: `${process.cwd()}/.tmp/mxtk/w12-ipad.png`, fullPage: true })
  await page.setViewport({ width: 390, height: 800 })
  await page.screenshot({ path: `${process.cwd()}/.tmp/mxtk/w12-mobile.png`, fullPage: true })

  await browser.close()
}

run().catch(e => { console.error(e); process.exit(1); })

const base = process.env.BASE_URL || 'http://localhost:2000'

export async function run() {
    const puppeteer = await import('puppeteer')
    const fs = await import('node:fs/promises')
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
    const page = await browser.newPage()
    page.on('console', m => { const t = m.type(); if (t === 'error' || t === 'warning') { throw new Error('Console ' + t + ': ' + m.text()) } })

    // Desktop
    await page.setViewport({ width: 1360, height: 900 })
    await page.goto(base + '/home', { waitUntil: 'networkidle0' })
    await page.waitForSelector('[data-testid="home-grid"]', { timeout: 10000 })

    // Drag first widget by 1 col, 1 row
    const first = await page.$('[data-testid="home-grid"] [data-widget-id]')
    if (first) {
        const drag = await first.$('[data-testid="drag-handle"]')
        if (drag) {
            const b = await drag.boundingBox()
            if (b) {
                await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2)
                await page.mouse.down()
                await page.mouse.move(b.x + b.width / 2 + 80, b.y + b.height / 2 + 40, { steps: 8 })
                await page.mouse.up()
            }
        }
    }

    // Resize same widget
    const resize = await page.$('[data-testid="home-grid"] [data-widget-id] [data-testid="resize-handle"]')
    if (resize) {
        const r = await resize.boundingBox()
        if (r) {
            await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2)
            await page.mouse.down()
            await page.mouse.move(r.x + r.width / 2 + 100, r.y + r.height / 2 + 60, { steps: 8 })
            await page.mouse.up()
        }
    }

    // Add a note
    const note = await page.$('textarea')
    if (note) {
        await note.click()
        await page.keyboard.type('My persistent note from test')
        await page.waitForTimeout(800)
        await page.reload({ waitUntil: 'networkidle0' })
        const txt = await page.$eval('textarea', el => (el as HTMLTextAreaElement).value)
        if (!/persistent note/.test(txt)) throw new Error('CustomNote did not persist')
    }

    // Remove a widget
    const remove = await page.$('[data-testid="home-grid"] [data-widget-id] [data-testid="remove-widget"]')
    if (remove) {
        await remove.click()
        await page.waitForTimeout(200)
        await page.reload({ waitUntil: 'networkidle0' })
    }

    // Screenshots: desktop, ipad, mobile
    await fs.mkdir(`${process.cwd()}/.tmp/mxtk`, { recursive: true })
    await page.screenshot({ path: `${process.cwd()}/.tmp/mxtk/w12-home-desktop.png`, fullPage: true })

    await page.setViewport({ width: 1024, height: 900 })
    await page.reload({ waitUntil: 'networkidle0' })
    await page.screenshot({ path: `${process.cwd()}/.tmp/mxtk/w12-home-ipad.png`, fullPage: true })

    await page.setViewport({ width: 390, height: 844 })
    await page.reload({ waitUntil: 'networkidle0' })
    await page.screenshot({ path: `${process.cwd()}/.tmp/mxtk/w12-home-mobile.png`, fullPage: true })

    // Computed styles dump
    const dump = await page.evaluate(() => {
        const root = document.querySelector('[data-shiftable-root]') as HTMLElement | null
        const drawer = document.querySelector('.guide-drawer') as HTMLElement | null
        const get = (el: HTMLElement | null) => {
            if (!el) return null
            const cs = getComputedStyle(el)
            return { paddingLeft: cs.paddingLeft, width: cs.width, position: cs.position }
        }
        return { root: get(root), drawer: get(drawer) }
    })
    await fs.writeFile(`${process.cwd()}/.tmp/mxtk/w12-computed.json`, JSON.stringify(dump, null, 2))

    await browser.close()
}

run().catch(e => { console.error(e); process.exit(1); })


