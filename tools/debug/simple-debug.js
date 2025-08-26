const puppeteer = require('puppeteer');

async function testPage(url, label) {
    console.log(`\n🔍 Testing ${label}: ${url}`);
    
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Set up error collection
        const errors = [];
        const warnings = [];
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            } else if (msg.type() === 'warning') {
                warnings.push(msg.text());
            }
        });
        
        page.on('pageerror', error => {
            errors.push(`Page Error: ${error.message}`);
        });
        
        // Navigate to the page
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Wait for page to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if page loaded successfully
        const pageInfo = await page.evaluate(() => {
            return {
                title: document.title,
                hasBody: !!document.body,
                bodyText: document.body ? document.body.textContent.substring(0, 100) : 'No body',
                hasNavigation: document.querySelectorAll('nav a, header a').length,
                hasBackgroundImage: document.querySelectorAll('[style*="background-image"]').length,
                backgroundImages: Array.from(document.querySelectorAll('[style*="background-image"]')).map(el => {
                    const style = window.getComputedStyle(el);
                    return {
                        bgImage: style.backgroundImage,
                        isVisible: style.display !== 'none' && style.visibility !== 'hidden'
                    };
                })
            };
        });
        
        console.log(`  Title: ${pageInfo.title}`);
        console.log(`  Has Body: ${pageInfo.hasBody}`);
        console.log(`  Navigation Links: ${pageInfo.hasNavigation}`);
        console.log(`  Background Images: ${pageInfo.hasBackgroundImage}`);
        
        if (pageInfo.backgroundImages.length > 0) {
            pageInfo.backgroundImages.forEach((bg, index) => {
                if (bg.isVisible && bg.bgImage !== 'none') {
                    console.log(`  ✅ Background ${index + 1}: ${bg.bgImage}`);
                } else {
                    console.log(`  ❌ Background ${index + 1}: ${bg.bgImage} (not visible)`);
                }
            });
        }
        
        // Check for errors
        if (errors.length > 0) {
            console.log(`  ❌ Errors: ${errors.length}`);
            errors.forEach(error => console.log(`    ${error}`));
        }
        
        if (warnings.length > 0) {
            console.log(`  ⚠️ Warnings: ${warnings.length}`);
            warnings.forEach(warning => console.log(`    ${warning}`));
        }
        
        // Take screenshot
        const screenshotPath = `debug-${label.toLowerCase().replace(/\s+/g, '-')}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`  📸 Screenshot: ${screenshotPath}`);
        
        return {
            success: pageInfo.hasBody && !pageInfo.bodyText.includes('404'),
            errors: errors.length,
            warnings: warnings.length,
            backgroundImages: pageInfo.backgroundImages.length
        };
        
    } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
        return { success: false, error: error.message };
    } finally {
        await browser.close();
    }
}

async function main() {
    console.log('🎨 MXTK Simple Debugger');
    console.log('=' .repeat(50));
    
    // Test localhost
    console.log('\n🏠 Testing Localhost...');
    const localhostTests = [
        { url: 'http://localhost:2000/owners', label: 'Localhost Owners' },
        { url: 'http://localhost:2000/institutions', label: 'Localhost Institutions' },
        { url: 'http://localhost:2000/transparency', label: 'Localhost Transparency' },
        { url: 'http://localhost:2000/ecosystem', label: 'Localhost Ecosystem' },
        { url: 'http://localhost:2000/whitepaper', label: 'Localhost Whitepaper' },
        { url: 'http://localhost:2000/faq', label: 'Localhost FAQ' },
        { url: 'http://localhost:2000/mxtk-cares', label: 'Localhost MXTK Cares' },
        { url: 'http://localhost:2000/resources', label: 'Localhost Resources' }
    ];
    
    let localhostResults = [];
    for (const test of localhostTests) {
        const result = await testPage(test.url, test.label);
        localhostResults.push({ ...test, ...result });
    }
    
    // Test ngrok
    console.log('\n🌐 Testing Ngrok...');
    const ngrokTests = [
        { url: 'https://ramileo.ngrok.app/mxtk/owners', label: 'Ngrok Owners' },
        { url: 'https://ramileo.ngrok.app/mxtk/institutions', label: 'Ngrok Institutions' },
        { url: 'https://ramileo.ngrok.app/mxtk/transparency', label: 'Ngrok Transparency' },
        { url: 'https://ramileo.ngrok.app/mxtk/ecosystem', label: 'Ngrok Ecosystem' },
        { url: 'https://ramileo.ngrok.app/mxtk/whitepaper', label: 'Ngrok Whitepaper' },
        { url: 'https://ramileo.ngrok.app/mxtk/faq', label: 'Ngrok FAQ' },
        { url: 'https://ramileo.ngrok.app/mxtk/mxtk-cares', label: 'Ngrok MXTK Cares' },
        { url: 'https://ramileo.ngrok.app/mxtk/resources', label: 'Ngrok Resources' }
    ];
    
    let ngrokResults = [];
    for (const test of ngrokTests) {
        const result = await testPage(test.url, test.label);
        ngrokResults.push({ ...test, ...result });
    }
    
    // Summary
    console.log('\n📊 Summary');
    console.log('=' .repeat(50));
    
    console.log('\n🏠 Localhost Results:');
    const localhostSuccess = localhostResults.filter(r => r.success).length;
    const localhostTotal = localhostResults.length;
    console.log(`  Success: ${localhostSuccess}/${localhostTotal}`);
    
    console.log('\n🌐 Ngrok Results:');
    const ngrokSuccess = ngrokResults.filter(r => r.success).length;
    const ngrokTotal = ngrokResults.length;
    console.log(`  Success: ${ngrokSuccess}/${ngrokTotal}`);
    
    // Show failed tests
    const failedLocalhost = localhostResults.filter(r => !r.success);
    const failedNgrok = ngrokResults.filter(r => !r.success);
    
    if (failedLocalhost.length > 0) {
        console.log('\n❌ Failed Localhost Tests:');
        failedLocalhost.forEach(test => console.log(`  ${test.label}: ${test.error || 'Unknown error'}`));
    }
    
    if (failedNgrok.length > 0) {
        console.log('\n❌ Failed Ngrok Tests:');
        failedNgrok.forEach(test => console.log(`  ${test.label}: ${test.error || 'Unknown error'}`));
    }
}

main().catch(console.error);
