const puppeteer = require('puppeteer');

async function test() {
    console.log('🔍 Simple Puppeteer Error Test...');
    
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        const consoleErrors = [];
        const networkErrors = [];
        
        // Set up error handlers
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
                console.log(`❌ CAPTURED ERROR: ${msg.text()}`);
            }
        });
        
        page.on('response', response => {
            if (response.status() >= 400) {
                const errorMsg = `${response.status()} ${response.statusText()}: ${response.url()}`;
                networkErrors.push(errorMsg);
                console.log(`🌐 CAPTURED NETWORK ERROR: ${errorMsg}`);
            }
        });
        
        console.log('📱 Navigating to MXTK site...');
        await page.goto('https://ramileo.ngrok.app/mxtk/', { 
            waitUntil: 'networkidle2', 
            timeout: 30000 
        });
        
        // Wait a bit
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log(`\n📊 RESULTS:`);
        console.log(`  Console Errors: ${consoleErrors.length}`);
        console.log(`  Network Errors: ${networkErrors.length}`);
        
        if (consoleErrors.length === 0 && networkErrors.length === 0) {
            console.log('❌ NO ERRORS CAPTURED - This is the problem!');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

test().catch(console.error);
