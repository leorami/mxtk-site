const puppeteer = require('puppeteer');

async function testSpecificRedirects() {
    console.log('\n🔄 TESTING SPECIFIC _NEXT REDIRECT LOOPS');
    console.log('========================================\n');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        devtools: false 
    });
    
    const page = await browser.newPage();
    
    let redirectErrors = [];
    let requestCount = {};
    
    // Track all requests and failures
    page.on('request', (request) => {
        const url = request.url();
        requestCount[url] = (requestCount[url] || 0) + 1;
        
        if (url.includes('_next')) {
            console.log(`📤 REQUEST: ${url} (attempt #${requestCount[url]})`);
        }
        
        // If we see the same _next URL requested more than 3 times, it's likely a redirect loop
        if (requestCount[url] > 3 && url.includes('_next')) {
            console.log(`🚨 POTENTIAL REDIRECT LOOP: ${url} requested ${requestCount[url]} times`);
            redirectErrors.push({ url, count: requestCount[url] });
        }
    });
    
    page.on('requestfailed', (request) => {
        const url = request.url();
        const error = request.failure()?.errorText;
        
        if (url.includes('_next')) {
            console.log(`❌ REQUEST FAILED: ${url} - ${error}`);
            
            if (error && error.includes('ERR_TOO_MANY_REDIRECTS')) {
                redirectErrors.push({ url, error });
            }
        }
    });
    
    try {
        console.log('🔍 Loading institutions page...');
        
        const response = await page.goto('https://ramileo.ngrok.app/mxtk/institutions', {
            waitUntil: 'networkidle0',
            timeout: 15000
        });
        
        console.log(`📄 Page loaded: ${response.status()}`);
        
        // Wait for any additional requests
        await page.waitForTimeout(2000);
        
    } catch (error) {
        console.log(`💥 PAGE LOAD ERROR: ${error.message}`);
    }
    
    await browser.close();
    
    console.log('\n📊 REDIRECT ANALYSIS RESULTS');
    console.log('============================');
    console.log(`Redirect Errors Found: ${redirectErrors.length}`);
    
    if (redirectErrors.length > 0) {
        console.log('\n🚨 REDIRECT ISSUES:');
        redirectErrors.forEach((issue, i) => {
            console.log(`${i+1}. ${issue.url}`);
            if (issue.count) console.log(`   Requested ${issue.count} times`);
            if (issue.error) console.log(`   Error: ${issue.error}`);
        });
    }
    
    // Show the most requested URLs
    const sortedRequests = Object.entries(requestCount)
        .filter(([url]) => url.includes('_next'))
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    if (sortedRequests.length > 0) {
        console.log('\n📈 MOST REQUESTED _NEXT URLS:');
        sortedRequests.forEach(([url, count]) => {
            console.log(`${count}x: ${url}`);
        });
    }
    
    return {
        redirectErrors: redirectErrors.length,
        success: redirectErrors.length === 0
    };
}

testSpecificRedirects().catch(console.error);
