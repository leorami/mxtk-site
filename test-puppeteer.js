const puppeteer = require('puppeteer');

async function testPuppeteerErrors() {
    console.log('🔍 Testing Puppeteer Console Error Capture...');
    
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Set up console error collection
        const consoleErrors = [];
        const consoleWarnings = [];
        const networkErrors = [];
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
                console.log(`❌ CONSOLE ERROR: ${msg.text()}`);
            } else if (msg.type() === 'warning') {
                consoleWarnings.push(msg.text());
                console.log(`⚠️ CONSOLE WARNING: ${msg.text()}`);
            }
        });
        
        page.on('pageerror', error => {
            consoleErrors.push(`Page Error: ${error.message}`);
            console.log(`🚨 PAGE ERROR: ${error.message}`);
        });
        
        // Capture network errors
        page.on('response', response => {
            if (response.status() >= 400) {
                const errorMsg = `${response.status()} ${response.statusText()}: ${response.url()}`;
                networkErrors.push(errorMsg);
                console.log(`🌐 NETWORK ERROR: ${errorMsg}`);
            }
        });
        
        console.log('\n📱 Navigating to MXTK site...');
        await page.goto('https://ramileo.ngrok.app/mxtk/', { 
            waitUntil: 'networkidle2', 
            timeout: 30000 
        });
        
        // Wait a bit for all errors to load
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log('\n📊 ERROR SUMMARY:');
        console.log(`  Console Errors: ${consoleErrors.length}`);
        console.log(`  Console Warnings: ${consoleWarnings.length}`);
        console.log(`  Network Errors: ${networkErrors.length}`);
        console.log(`  Total Issues: ${consoleErrors.length + consoleWarnings.length + networkErrors.length}`);
        
        if (consoleErrors.length > 0) {
            console.log('\n❌ CONSOLE ERRORS FOUND:');
            consoleErrors.forEach((error, i) => {
                console.log(`  ${i + 1}. ${error}`);
            });
        }
        
        if (consoleWarnings.length > 0) {
            console.log('\n⚠️ CONSOLE WARNINGS FOUND:');
            consoleWarnings.forEach((warning, i) => {
                console.log(`  ${i + 1}. ${warning}`);
            });
        }
        
        if (networkErrors.length > 0) {
            console.log('\n🌐 NETWORK ERRORS FOUND:');
            networkErrors.forEach((error, i) => {
                console.log(`  ${i + 1}. ${error}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testPuppeteerErrors().catch(console.error);
