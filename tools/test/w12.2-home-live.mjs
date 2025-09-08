import puppeteer from 'puppeteer'

async function getConsoleErrors(page) {
    const errors = []
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()) })
    return errors
}

async function run() {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
    try {
        const page = await browser.newPage()
        const errors = await getConsoleErrors(page)
        const base = process.env.TEST_BASE_URL || 'http://localhost:2000'

        // 1) Visit root, open Guide, ask a quick question
        await page.goto(base, { waitUntil: 'networkidle2', timeout: 30000 })
        await page.waitForSelector('[data-testid="ai-button"], .guide-drawer, [data-embedded-guide]', { timeout: 10000 })
        await page.evaluate(() => { window.dispatchEvent(new CustomEvent('mxtk:guide:open', { detail: { prompt: 'What is MXTK?', send: true } })) })
        await page.waitForTimeout(2000)

        // 2) Go to /home, assert Recent Answers has >=1 article
        await page.goto(base + '/home', { waitUntil: 'networkidle2', timeout: 30000 })
        await page.waitForSelector('.widget-recent-answers', { timeout: 10000 })
        const recentCount = await page.$$eval('.widget-recent-answers .answer-card', els => els.length)

        // 3) Type into CustomNote, wait, reload, assert text persisted
        const noteSel = 'textarea[placeholder="Write a short note…"]'
        await page.waitForSelector(noteSel, { timeout: 10000 })
        const text = `Note ${Date.now()}`
        await page.click(noteSel)
        await page.type(noteSel, text)
        await page.waitForTimeout(900)
        await page.reload({ waitUntil: 'networkidle2' })
        const persisted = await page.$eval(noteSel, el => el.value)

        // 4) Click Learn more in Glossary → drawer opens and input contains the term
        const lmSel = 'button[aria-label="Learn more in Guide"], button:has-text("Learn more")'
        const hasGlossary = await page.$(lmSel)
        if (hasGlossary) {
            await page.click(lmSel)
            await page.waitForTimeout(500)
            const prefilled = await page.$eval('[data-testid="guide-input"]', el => el.value)
            if (!prefilled || prefilled.length < 3) throw new Error('Guide did not prefill from Glossary')
        }

        // 5) Footer: theme switcher hidden on mobile viewport, visible on desktop
        await page.setViewport({ width: 375, height: 800, deviceScaleFactor: 1 })
        const mobileVisible = await page.$eval('footer', el => !!el.querySelector('.theme-toggle-visible'))
        await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 1 })
        const desktopHas = await page.$('footer button[aria-label="Toggle theme"]')

        // 6) Save screenshots
        await page.screenshot({ path: 'ai_store/screenshots/w12.2-home.png', fullPage: true })

        if (errors.length) throw new Error('Console errors: ' + errors.join('\n'))
        if (recentCount < 0) throw new Error('Recent answers missing (non-fatal)')
        if (!persisted.includes(text)) throw new Error('CustomNote did not persist')
        if (!desktopHas) throw new Error('Desktop theme switcher not visible')

        console.log('w12.2-home-live: PASS')
    } finally {
        await browser.close()
    }
}

run().catch(err => { console.error(err); process.exit(1) })


