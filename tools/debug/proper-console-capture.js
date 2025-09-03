const puppeteer = require('puppeteer');

async function captureRealBrowserErrors() {
    console.log('\n🔍 CAPTURING REAL BROWSER CONSOLE ERRORS');
    console.log('=========================================\n');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        devtools: true,
        dumpio: true  // Pipe browser stdout/stderr to Node.js process
    });
    
    const page = await browser.newPage();
    
    let consoleErrors = [];
    let consoleWarnings = [];
    let pageErrors = [];
    let networkFailures = [];
    
    // 1. Capture ALL console messages (including errors and warnings)
    page.on('console', msg => {
        const type = msg.type(); // 'log', 'warn', 'error', 'info', 'debug'
        const text = msg.text();
        
        console.log(`BROWSER CONSOLE [${type.toUpperCase()}]: ${text}`);
        
        if (type === 'error') {
            consoleErrors.push({ type, text, location: msg.location() });
            
            // Look specifically for MXTK and redirect-related errors
            if (text.includes('[MXTK]') || text.includes('ERR_TOO_MANY_REDIRECTS')) {
                console.log(`🚨 CRITICAL ERROR DETECTED: ${text}`);
            }
        } else if (type === 'warn' || type === 'warning') {
            consoleWarnings.push({ type, text, location: msg.location() });
        }
    });

    // 2. Capture unhandled JavaScript exceptions
    page.on('pageerror', error => {
        console.error(`PAGE ERROR: ${error.message}`);
        pageErrors.push({
            message: error.message,
            stack: error.stack
        });
        
        if (error.message.includes('app-pages-internals')) {
            console.log(`🚨 REACT HYDRATION ERROR: ${error.message}`);
        }
    });

    // 3. Capture network request failures
    page.on('requestfailed', request => {
        const failureText = request.failure()?.errorText || 'Unknown error';
        const url = request.url();
        
        console.error(`NETWORK REQUEST FAILED: ${url} - ${failureText}`);
        
        networkFailures.push({
            url,
            failureText,
            method: request.method()
        });
        
        // Look specifically for redirect errors and _next failures
        if (failureText.includes('ERR_TOO_MANY_REDIRECTS')) {
            console.log(`🚨 REDIRECT LOOP CONFIRMED: ${url}`);
        } else if (url.includes('_next') && failureText !== 'net::ERR_ABORTED') {
            console.log(`⚠️ _NEXT RESOURCE FAILED: ${url} - ${failureText}`);
        }
    });

    try {
        console.log('🔍 Loading institutions page via ngrok...');
        
        const response = await page.goto('https://ramileo.ngrok.app/mxtk/institutions', {
            waitUntil: 'networkidle0', // Wait until no network requests for 500ms
            timeout: 30000
        });
        
        console.log(`📄 Page Response: ${response.status()} ${response.statusText()}`);
        
        // Wait for any delayed errors to surface
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Check if MarketChart loaded properly
        const hasMarketChart = await page.evaluate(() => {
            return document.querySelector('[data-testid="market-chart"]') !== null ||
                   document.textContent.includes('Live Blockchain Data') ||
                   document.textContent.includes('Price') ||
                   document.textContent.includes('Market Cap');
        });
        
        console.log(`📊 MarketChart Component Present: ${hasMarketChart ? '✅' : '❌'}`);
        
    } catch (error) {
        console.log(`💥 PAGE LOAD ERROR: ${error.message}`);
        pageErrors.push({
            message: `Navigation error: ${error.message}`,
            stack: error.stack
        });
    }
    
    await browser.close();
    
    console.log('\n📊 COMPREHENSIVE ERROR ANALYSIS');
    console.log('================================');
    console.log(`Console Errors: ${consoleErrors.length}`);
    console.log(`Console Warnings: ${consoleWarnings.length}`);
    console.log(`Page Errors: ${pageErrors.length}`);
    console.log(`Network Failures: ${networkFailures.length}`);
    
    if (consoleErrors.length > 0) {
        console.log('\n🔥 BROWSER CONSOLE ERRORS:');
        consoleErrors.forEach((error, i) => {
            console.log(`${i+1}. ${error.text}`);
            if (error.location) {
                console.log(`   Location: ${error.location.url}:${error.location.lineNumber}`);
            }
        });
    }
    
    if (consoleWarnings.length > 0) {
        console.log('\n⚠️ BROWSER CONSOLE WARNINGS:');
        consoleWarnings.slice(0, 5).forEach((warning, i) => {
            console.log(`${i+1}. ${warning.text}`);
        });
    }
    
    if (pageErrors.length > 0) {
        console.log('\n💀 UNHANDLED JAVASCRIPT EXCEPTIONS:');
        pageErrors.forEach((error, i) => {
            console.log(`${i+1}. ${error.message}`);
        });
    }
    
    if (networkFailures.length > 0) {
        console.log('\n🚨 NETWORK REQUEST FAILURES:');
        networkFailures.slice(0, 10).forEach((failure, i) => {
            console.log(`${i+1}. ${failure.url} - ${failure.failureText}`);
        });
    }
    
    return {
        consoleErrors: consoleErrors.length,
        consoleWarnings: consoleWarnings.length,
        pageErrors: pageErrors.length,
        networkFailures: networkFailures.length,
        success: consoleErrors.length === 0 && pageErrors.length === 0 && networkFailures.length === 0
    };
}

captureRealBrowserErrors().catch(console.error);
