const puppeteer = require('puppeteer');

async function testRedirectLoops() {
    console.log('\n🔄 TESTING FOR ERR_TOO_MANY_REDIRECTS ERRORS');
    console.log('=============================================\n');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        devtools: true,
        args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'] 
    });
    
    const page = await browser.newPage();
    
    let redirectErrors = [];
    let consoleErrors = [];
    let networkFailures = [];
    let maxErrorsBeforeStop = 3;
    
    // Capture network failures including redirect loops
    page.on('requestfailed', (request) => {
        const failure = {
            url: request.url(),
            failureText: request.failure()?.errorText || 'Unknown error'
        };
        
        console.log(`🚨 NETWORK FAILURE: ${failure.failureText} - ${failure.url}`);
        
        if (failure.failureText.includes('ERR_TOO_MANY_REDIRECTS')) {
            redirectErrors.push(failure);
            console.log(`💥 REDIRECT LOOP DETECTED: ${failure.url}`);
        }
        
        networkFailures.push(failure);
        
        // Stop if we hit too many errors
        if (redirectErrors.length >= maxErrorsBeforeStop) {
            console.log(`\n🛑 STOPPING AFTER ${redirectErrors.length} REDIRECT ERRORS`);
            return;
        }
    });
    
    // Capture console errors  
    page.on('console', (msg) => {
        if (msg.type() === 'error') {
            const error = {
                type: msg.type(),
                text: msg.text(),
                location: msg.location()
            };
            console.log(`🔥 CONSOLE ERROR: ${error.text}`);
            consoleErrors.push(error);
            
            if (consoleErrors.length >= maxErrorsBeforeStop) {
                console.log(`\n🛑 STOPPING AFTER ${consoleErrors.length} CONSOLE ERRORS`);
                return;
            }
        }
    });
    
    // Capture uncaught exceptions
    page.on('pageerror', (error) => {
        console.log(`💀 PAGE ERROR: ${error.message}`);
        consoleErrors.push({
            type: 'pageerror',
            text: error.message,
            stack: error.stack
        });
    });
    
    try {
        console.log('🔍 Testing institutions page...');
        
        // Set a timeout to prevent hanging on redirect loops
        const response = await page.goto('https://ramileo.ngrok.app/mxtk/institutions', {
            waitUntil: 'domcontentloaded',
            timeout: 10000
        });
        
        console.log(`📄 Page Response: ${response?.status()} ${response?.statusText()}`);
        
        // Wait a bit for any async issues to surface
        await page.waitForTimeout(3000);
        
        // Try to access some _next resources that might be causing redirects
        const nextResources = [
            'https://ramileo.ngrok.app/_next/static/chunks/app/layout.js',
            'https://ramileo.ngrok.app/_next/static/chunks/webpack.js',
            'https://ramileo.ngrok.app/_next/static/chunks/main-app.js'
        ];
        
        for (const url of nextResources) {
            try {
                console.log(`🔍 Testing: ${url}`);
                const response = await page.goto(url, { timeout: 5000 });
                console.log(`   ✅ ${response.status()} - ${url}`);
            } catch (error) {
                console.log(`   ❌ FAILED: ${error.message} - ${url}`);
                if (error.message.includes('ERR_TOO_MANY_REDIRECTS')) {
                    redirectErrors.push({ url, error: error.message });
                }
            }
            
            if (redirectErrors.length >= maxErrorsBeforeStop) break;
        }
        
    } catch (error) {
        console.log(`💥 NAVIGATION ERROR: ${error.message}`);
        if (error.message.includes('ERR_TOO_MANY_REDIRECTS')) {
            redirectErrors.push({ url: 'navigation', error: error.message });
        }
    }
    
    await browser.close();
    
    console.log('\n📊 REDIRECT LOOP TEST RESULTS');
    console.log('==============================');
    console.log(`Redirect Errors: ${redirectErrors.length}`);
    console.log(`Console Errors: ${consoleErrors.length}`);
    console.log(`Network Failures: ${networkFailures.length}`);
    
    if (redirectErrors.length > 0) {
        console.log('\n🚨 REDIRECT LOOP DETAILS:');
        redirectErrors.forEach((error, i) => {
            console.log(`${i+1}. ${error.url}`);
            console.log(`   Error: ${error.failureText || error.error}`);
        });
    }
    
    if (consoleErrors.length > 0) {
        console.log('\n🔥 CONSOLE ERROR DETAILS:');
        consoleErrors.slice(0, 3).forEach((error, i) => {
            console.log(`${i+1}. ${error.text}`);
        });
    }
    
    return {
        redirectErrors: redirectErrors.length,
        consoleErrors: consoleErrors.length,
        networkFailures: networkFailures.length,
        success: redirectErrors.length === 0 && consoleErrors.length === 0
    };
}

testRedirectLoops().catch(console.error);
