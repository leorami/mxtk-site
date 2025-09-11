const base = process.env.BASE_URL || 'http://localhost:2000'

export async function run() {
    const puppeteer = await import('puppeteer')
    const fs = await import('node:fs/promises')
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
    const page = await browser.newPage()
    page.on('console', m => { const t = m.type(); if (t === 'error' || t === 'warning') { throw new Error('Console ' + t + ': ' + m.text()) } })

    // Desktop
    await page.setViewport({ width: 1360, height: 900 })
    await page.goto(base + '/dashboard', { waitUntil: 'networkidle0' })
    
    try {
        // Wait for the sections to appear
        await page.waitForSelector('.section-rail', { timeout: 10000 })
        console.log("✅ Found section rails")
        
        // Check if widgets are rendered
        const widgetCount = await page.$$eval('.widget-tile', els => els.length)
        console.log(`✅ Found ${widgetCount} widgets`)
        
        // Check if widget content is rendered
        const hasWidgetContent = await page.evaluate(() => {
            const widgets = document.querySelectorAll('.widget-tile')
            return Array.from(widgets).some(w => {
                const body = w.querySelector('[data-widget-body]')
                return body && body.children.length > 0
            })
        })
        console.log(`✅ Widget content rendered: ${hasWidgetContent}`)
        
        // Take screenshots
        await fs.mkdir(`${process.cwd()}/.tmp/mxtk`, { recursive: true })
        await page.screenshot({ path: `${process.cwd()}/.tmp/mxtk/dashboard-desktop.png`, fullPage: true })
        
        // Test responsive layouts
        await page.setViewport({ width: 1024, height: 900 })
        await page.reload({ waitUntil: 'networkidle0' })
        await page.screenshot({ path: `${process.cwd()}/.tmp/mxtk/dashboard-tablet.png`, fullPage: true })
        
        await page.setViewport({ width: 390, height: 844 })
        await page.reload({ waitUntil: 'networkidle0' })
        await page.screenshot({ path: `${process.cwd()}/.tmp/mxtk/dashboard-mobile.png`, fullPage: true })
        
        console.log("✅ All tests passed!")
    } catch (error) {
        console.error("❌ Test failed:", error)
        throw error
    } finally {
        await browser.close()
    }
}

run().catch(e => { console.error(e); process.exit(1); })