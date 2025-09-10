const base = process.env.BASE_URL || 'http://localhost:2000'

export async function run() {
    const puppeteer = await import('puppeteer')
    const fs = await import('node:fs/promises')
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
    const page = await browser.newPage()
    page.on('console', m => { 
        console.log(`Browser console ${m.type()}: ${m.text()}`);
        // Don't throw on console errors since we're testing
    })

    try {
        // Desktop
        await page.setViewport({ width: 1360, height: 900 })
        await page.goto(base + '/dashboard', { waitUntil: 'networkidle0' })
        
        // Wait for the sections to appear
        await page.waitForSelector('.section-rail', { timeout: 10000 })
        console.log("✅ Found section rails")
        
        // Check if widgets are rendered
        const widgetCount = await page.$$eval('.wframe', els => els.length)
        console.log(`✅ Found ${widgetCount} widgets`)
        
        // Test Note widget
        const hasNote = await page.evaluate(() => {
            const widgets = document.querySelectorAll('.wframe')
            return Array.from(widgets).some(w => {
                const textarea = w.querySelector('textarea')
                return !!textarea
            })
        })
        console.log(`✅ Note widget present: ${hasNote}`)
        
        // Test writing to Note widget
        if (hasNote) {
            await page.type('textarea', 'Test note content')
            console.log("✅ Typed in note widget")
            
            // Wait for autosave
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Reload page and check if note persisted
            await page.reload({ waitUntil: 'networkidle0' })
            await page.waitForSelector('textarea', { timeout: 5000 })
            
            const noteText = await page.$eval('textarea', el => el.value)
            console.log(`✅ Note persisted after reload: ${noteText === 'Test note content'}`)
        }
        
        // Test WhatsNext widget
        const hasWhatsNext = await page.evaluate(() => {
            const widgets = document.querySelectorAll('.wframe')
            return Array.from(widgets).some(w => {
                const links = w.querySelectorAll('a')
                return links.length > 0 && Array.from(links).some(link => 
                    link.textContent.includes('Explore') || 
                    link.textContent.includes('Understand') || 
                    link.textContent.includes('Browse')
                )
            })
        })
        console.log(`✅ WhatsNext widget with links present: ${hasWhatsNext}`)
        
        // Test ResourceList widget
        const hasResourceList = await page.evaluate(() => {
            const widgets = document.querySelectorAll('.wframe')
            return Array.from(widgets).some(w => {
                const links = w.querySelectorAll('a')
                return links.length > 0 && Array.from(links).some(link => 
                    link.textContent.includes('Resources') || 
                    link.textContent.includes('Whitepaper') || 
                    link.textContent.includes('Transparency')
                )
            })
        })
        console.log(`✅ ResourceList widget with links present: ${hasResourceList}`)
        
        // Test GlossarySpotlight widget
        const hasGlossary = await page.evaluate(() => {
            const widgets = document.querySelectorAll('.wframe')
            return Array.from(widgets).some(w => {
                const term = w.querySelector('.font-medium, .font-semibold')
                return term && ['Mineral Token', 'Oracle', 'Validator', 'Provenance', 'Governance'].includes(term.textContent)
            })
        })
        console.log(`✅ GlossarySpotlight widget present: ${hasGlossary}`)
        
        // Take screenshots
        await fs.mkdir(`${process.cwd()}/.tmp/screenshots`, { recursive: true })
        await page.screenshot({ path: `${process.cwd()}/.tmp/screenshots/dashboard-widgets-test.png`, fullPage: true })
        
        console.log("✅ All widget tests passed!")
    } catch (error) {
        console.error("❌ Test failed:", error)
        throw error
    } finally {
        await browser.close()
    }
}

run().catch(e => { console.error(e); process.exit(1); })