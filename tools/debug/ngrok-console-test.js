#!/usr/bin/env node

// Comprehensive ngrok browser console testing with API verification
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const NGROK_BASE = 'https://ramileo.ngrok.app';

// Fail-fast configuration (can be overridden via env)
const MAX_ERRORS = parseInt(process.env.NGROK_MAX_ERRORS || '5', 10);
const MAX_WARNINGS = parseInt(process.env.NGROK_MAX_WARNINGS || '10', 10);
const MAX_NETWORK = parseInt(process.env.NGROK_MAX_NETWORK || '6', 10);
const STOP_ON_NAV_ERROR = (process.env.NGROK_STOP_ON_NAV_ERROR || '1') === '1';

const testPages = [
  '/mxtk/transparency',  // Critical: Must verify API calls are working
  '/mxtk/institutions',  // Critical: Must verify API calls are working
  '/mxtk/ecosystem', 
  '/mxtk/whitepaper', 
  '/mxtk/faq', 
  '/mxtk/media', 
  '/mxtk/the-team',
  '/mxtk/roadmap',
  '/mxtk/mxtk-cares',
  '/mxtk/owners',
  '/mxtk' // Home page
];

const apiEndpoints = [
  '/api/health',
  '/api/token/summary',
  '/api/pools', 
  '/api/market',
  '/api/test'
];

async function testPageWithBrowser(page, url, pageName) {
  console.log(`\n🔍 Testing: ${url}`);
  
  const errors = [];
  const warnings = [];
  const networkFailures = [];
  const consoleMessages = [];
  const apiCalls = [];
  let failFastHit = false;
  function checkFailFast(reason) {
    if (
      errors.length >= MAX_ERRORS ||
      warnings.length >= MAX_WARNINGS ||
      networkFailures.length >= MAX_NETWORK
    ) {
      failFastHit = true;
      console.log(`\n⛔ Fail-fast triggered (${reason}). Halting page test early.`);
      return true;
    }
    return false;
  }
  
  // Track API calls specifically
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      apiCalls.push({
        url: response.url(),
        status: response.status(),
        ok: response.ok()
      });
      
      if (response.ok()) {
        console.log(`   ✅ API Call: ${response.status()} ${response.url()}`);
      } else {
        console.log(`   ❌ API Failed: ${response.status()} ${response.url()}`);
      }
    }
    // Track redirects explicitly
    if (response.status() >= 300 && response.status() < 400) {
      const loc = response.headers()['location'];
      const msg = `Redirect ${response.status()} ${response.url()} -> ${loc || '(no location header)'} `;
      networkFailures.push(msg);
      console.log(`   🔁 ${msg}`);
      checkFailFast('redirects');
    }
  });
  
  // Capture ALL console messages including warnings
  page.on('console', msg => {
    const text = msg.text();
    const type = msg.type();
    
    consoleMessages.push({
      type,
      text,
      timestamp: new Date().toISOString()
    });
    
    if (type === 'error') {
      errors.push(text);
      console.log(`   ❌ Console Error: ${text}`);
      checkFailFast('console errors');
    } else if (type === 'warning' || type === 'warn') {
      warnings.push(text);
      console.log(`   ⚠️  Console Warning: ${text}`);
      checkFailFast('console warnings');
    } else if (type === 'log' && (text.includes('Warning') || text.includes('warning'))) {
      warnings.push(text);
      console.log(`   ⚠️  React Warning: ${text}`);
      checkFailFast('react warnings');
    }
  });
  
  // Capture network failures (ignore 304 cache hits)
  page.on('response', response => {
    if (!response.ok() && response.status() !== 304) {
      const failure = `${response.status()} ${response.url()}`;
      networkFailures.push(failure);
      console.log(`   🔌 Network Failure: ${failure}`);
      checkFailFast('network failures');
    }
  });
  
  // Capture page errors  
  page.on('pageerror', error => {
    const errorText = error.toString();
    errors.push(`Page Error: ${errorText}`);
    console.log(`   💥 Page Error: ${errorText}`);
    checkFailFast('page errors');
  });
  
  // Capture request failures
  page.on('requestfailed', request => {
    const failure = `Request Failed: ${request.url()} - ${request.failure()?.errorText}`;
    networkFailures.push(failure);
    console.log(`   🚫 Request Failed: ${failure}`);
  });
  
  try {
    // Navigate with timeout
    const resp = await page.goto(url, { 
      waitUntil: 'networkidle0', 
      timeout: 20000 
    });
    if (STOP_ON_NAV_ERROR && resp && resp.status() >= 400) {
      errors.push(`Bad status ${resp.status()} on ${url}`);
      checkFailFast('nav error');
    }
    
    // Wait for page to fully load and API calls to complete
    await new Promise(resolve => setTimeout(resolve, 3000));
    if (failFastHit) {
      return {
        url,
        pageName,
        success: false,
        errors,
        warnings,
        networkFailures,
        apiCalls,
        note: 'Fail-fast early return'
      };
    }
    
    // Check for background images
    const backgroundCheck = await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const backgroundImages = Array.from(images).filter(img => {
        const src = img.src || '';
        const className = img.className || '';
        const alt = img.alt || '';
        
        return src.includes('photo') || 
               src.includes('background') ||
               src.includes('tigereye') ||
               src.includes('jade') ||
               src.includes('gold') ||
               className.includes('background') ||
               alt.includes('background') ||
               img.parentElement?.className?.includes('backdrop') ||
               img.parentElement?.className?.includes('background');
      });
      
      const loadedBackgrounds = backgroundImages.filter(img => 
        img.complete && img.naturalWidth > 0 && img.naturalHeight > 0
      );
      
      const elementsWithBgImages = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        return style.backgroundImage !== 'none';
      });
      
      return {
        totalImages: images.length,
        backgroundImages: backgroundImages.length,
        loadedBackgrounds: loadedBackgrounds.length,
        backgroundUrls: backgroundImages.map(img => img.src),
        cssBackgrounds: elementsWithBgImages.length,
        pageHasBackgrounds: loadedBackgrounds.length > 0 || elementsWithBgImages.length > 0
      };
    });
    
    // Check for API data rendering (specific to institutions and transparency)
    const apiDataCheck = await page.evaluate(() => {
      // Look for market data in institutions page
      const hasMarketData = document.body.textContent.includes('Professional-grade market data') ||
                           document.body.textContent.includes('Data you can plug into systems') ||
                           document.body.textContent.includes('educational explanations');
      
      // Look for pool data in transparency page
      const hasPoolData = document.body.textContent.includes('Uniswap v4 Pools') &&
                         !document.body.textContent.includes('Loading…');
      
      // Look for token summary data
      const hasTokenData = document.body.textContent.includes('Total Supply') &&
                          !document.body.textContent.includes('Loading…');
      
      // Check for any loading indicators that suggest failed API calls
      const hasLoadingIndicators = document.body.textContent.includes('Loading…') ||
                                  document.body.textContent.includes('Refreshing…') ||
                                  document.querySelectorAll('[data-loading]').length > 0;
      
      return {
        hasMarketData,
        hasPoolData, 
        hasTokenData,
        hasLoadingIndicators,
        bodyLength: document.body.textContent.length
      };
    });
    
    // Test scroll behavior
    await page.evaluate(() => {
      window.scrollTo(0, 100);
      window.scrollTo(0, 200);  
      window.scrollTo(0, 0);
    });
    
    // Wait for any async warnings
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = errors.length === 0 && warnings.length === 0 && networkFailures.length === 0;
    
    return {
      url,
      pageName,
      success,
      errors,
      warnings,
      networkFailures,
      backgroundCheck,
      apiDataCheck,
      apiCalls,
      totalConsoleMessages: consoleMessages.length,
      consoleMessages: consoleMessages.slice(-5)
    };
    
  } catch (error) {
    console.log(`   💥 Navigation Error: ${error.message}`);
    return {
      url,
      pageName,
      success: false,
      navigationError: error.message,
      errors: [error.message],
      warnings,
      networkFailures,
      apiCalls
    };
  }
}

async function testApiEndpoint(url, endpoint) {
  console.log(`\n🔌 Testing API: ${url}${endpoint}`);
  
  try {
    const https = require('https');
    
    return new Promise((resolve) => {
      const req = https.request(url + endpoint, {
        method: 'GET',
        timeout: 8000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const success = res.statusCode >= 200 && res.statusCode < 400;
          
          if (success) {
            console.log(`   ✅ API Success: ${res.statusCode} ${endpoint}`);
            
            // Try to parse as JSON to verify it's real data
            let hasRealData = false;
            try {
              const parsed = JSON.parse(data);
              hasRealData = Object.keys(parsed).length > 0 && !data.includes('Loading');
            } catch {}
            
            resolve({
              endpoint,
              success: true,
              status: res.statusCode,
              hasData: hasRealData,
              dataSize: data.length
            });
          } else {
            console.log(`   ❌ API Failed: ${res.statusCode} ${endpoint}`);
            resolve({
              endpoint,
              success: false,
              status: res.statusCode,
              hasData: false,
              error: data
            });
          }
        });
      });
      
      req.on('error', (err) => {
        console.log(`   💥 API Error: ${endpoint} - ${err.message}`);
        resolve({
          endpoint,
          success: false,
          status: 0,
          hasData: false,
          error: err.message
        });
      });
      
      req.on('timeout', () => {
        req.abort();
        console.log(`   ⏰ API Timeout: ${endpoint}`);
        resolve({
          endpoint,
          success: false,
          status: 0,
          hasData: false,
          error: 'Timeout'
        });
      });
      
      req.end();
    });
  } catch (error) {
    return {
      endpoint,
      success: false,
      status: 0,
      hasData: false,
      error: error.message
    };
  }
}

async function runNgrokTest() {
  console.log('🌐 NGROK COMPREHENSIVE CONSOLE TEST');
  console.log('==================================');
  
  let browser;
  const results = [];
  const apiResults = [];
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Test all API endpoints first
    console.log('\n🔌 TESTING API ENDPOINTS:');
    for (const endpoint of apiEndpoints) {
      const result = await testApiEndpoint(NGROK_BASE, endpoint);
      apiResults.push(result);
    }
    
    // Test all pages
    console.log('\n📄 TESTING PAGES:');
    for (const testPage of testPages) {
      const result = await testPageWithBrowser(page, `${NGROK_BASE}${testPage}`, testPage);
      results.push(result);
    }
    
  } catch (error) {
    console.error('Browser test failed:', error);
    return { error: error.message };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  // Comprehensive analysis
  const totalErrors = results.reduce((sum, r) => sum + (r.errors?.length || 0), 0);
  const totalWarnings = results.reduce((sum, r) => sum + (r.warnings?.length || 0), 0);
  const totalNetworkFailures = results.reduce((sum, r) => sum + (r.networkFailures?.length || 0), 0);
  
  const pagesWithoutBackgrounds = results.filter(r => 
    r.backgroundCheck && !r.backgroundCheck.pageHasBackgrounds && 
    !['/mxtk'].includes(r.pageName) // Exclude home page
  );
  
  const successfulPages = results.filter(r => r.success);
  const failedApiEndpoints = apiResults.filter(r => !r.success);
  const workingApiEndpoints = apiResults.filter(r => r.success);
  
  // Check specific pages for API data rendering
  const institutionsPage = results.find(r => r.pageName === '/mxtk/institutions');
  const transparencyPage = results.find(r => r.pageName === '/mxtk/transparency');
  
  console.log('\n📊 NGROK COMPREHENSIVE TEST RESULTS');
  console.log('===================================');
  console.log(`Total Pages Tested: ${results.length}`);
  console.log(`Successful Pages (0 errors/warnings): ${successfulPages.length}`);
  console.log(`Total Console Errors: ${totalErrors}`);
  console.log(`Total Console Warnings: ${totalWarnings}`);
  console.log(`Total Network Failures: ${totalNetworkFailures}`);
  console.log(`Pages Missing Backgrounds: ${pagesWithoutBackgrounds.length}`);
  console.log(`Working API Endpoints: ${workingApiEndpoints.length}/${apiResults.length}`);
  console.log(`Failed API Endpoints: ${failedApiEndpoints.length}`);
  
  // API Analysis
  if (failedApiEndpoints.length > 0) {
    console.log('\n🚨 FAILED API ENDPOINTS:');
    failedApiEndpoints.forEach(api => {
      console.log(`   ❌ ${api.endpoint}: ${api.status} - ${api.error}`);
    });
  }
  
  if (workingApiEndpoints.length > 0) {
    console.log('\n✅ WORKING API ENDPOINTS:');
    workingApiEndpoints.forEach(api => {
      console.log(`   ✅ ${api.endpoint}: ${api.status} (${api.dataSize} bytes, hasData: ${api.hasData})`);
    });
  }
  
  // Detailed error reporting
  if (totalErrors > 0) {
    console.log('\n🚨 CONSOLE ERRORS DETECTED:');
    results.forEach(r => {
      if (r.errors?.length > 0) {
        console.log(`   ${r.pageName}:`);
        r.errors.forEach(error => console.log(`     - ${error}`));
      }
    });
  }
  
  if (totalWarnings > 0) {
    console.log('\n⚠️  CONSOLE WARNINGS DETECTED:');
    results.forEach(r => {
      if (r.warnings?.length > 0) {
        console.log(`   ${r.pageName}:`);
        r.warnings.forEach(warning => console.log(`     - ${warning}`));
      }
    });
  }
  
  // Background status
  console.log('\n🖼️  BACKGROUND STATUS PER PAGE:');
  results.forEach(r => {
    if (r.backgroundCheck) {
      const status = r.backgroundCheck.pageHasBackgrounds ? '✅' : '❌';
      console.log(`   ${status} ${r.pageName}: ${r.backgroundCheck.loadedBackgrounds} img backgrounds, ${r.backgroundCheck.cssBackgrounds} CSS backgrounds`);
    }
  });
  
  // API Data Rendering Check
  console.log('\n🔄 API DATA RENDERING CHECK:');
  if (institutionsPage) {
    const hasData = institutionsPage.apiDataCheck?.hasMarketData && !institutionsPage.apiDataCheck?.hasLoadingIndicators;
    console.log(`   ${hasData ? '✅' : '❌'} Institutions: Market data rendering ${hasData ? 'SUCCESS' : 'FAILED'}`);
  }
  
  if (transparencyPage) {
    const hasData = (transparencyPage.apiDataCheck?.hasPoolData || transparencyPage.apiDataCheck?.hasTokenData) && 
                   !transparencyPage.apiDataCheck?.hasLoadingIndicators;
    console.log(`   ${hasData ? '✅' : '❌'} Transparency: Pool/Token data rendering ${hasData ? 'SUCCESS' : 'FAILED'}`);
  }
  
  // Save detailed report
  const reportPath = path.join(__dirname, 'output', 'reports');
  if (!fs.existsSync(reportPath)) {
    fs.mkdirSync(reportPath, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  const reportFile = path.join(reportPath, `ngrok-console-test-${timestamp}.json`);
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPages: results.length,
      successfulPages: successfulPages.length,
      totalErrors,
      totalWarnings,
      totalNetworkFailures,
      pagesWithoutBackgrounds: pagesWithoutBackgrounds.length,
      workingApiEndpoints: workingApiEndpoints.length,
      failedApiEndpoints: failedApiEndpoints.length
    },
    results,
    apiResults
  };
  
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  const successRate = (successfulPages.length / results.length * 100).toFixed(1);
  const apiSuccessRate = (workingApiEndpoints.length / apiResults.length * 100).toFixed(1);
  
  console.log(`\n📈 NGROK SUCCESS RATE: ${successRate}%`);
  console.log(`📈 API SUCCESS RATE: ${apiSuccessRate}%`);
  console.log(`💾 Detailed report: ${reportFile}`);
  
  const isAllClear = totalErrors === 0 && totalWarnings === 0 && totalNetworkFailures === 0;
  const allBackgroundsWorking = pagesWithoutBackgrounds.length === 0;
  const allApisWorking = failedApiEndpoints.length === 0;
  const institutionsDataWorking = institutionsPage?.apiDataCheck?.hasMarketData && !institutionsPage?.apiDataCheck?.hasLoadingIndicators;
  const transparencyDataWorking = (transparencyPage?.apiDataCheck?.hasPoolData || transparencyPage?.apiDataCheck?.hasTokenData) && 
                                 !transparencyPage?.apiDataCheck?.hasLoadingIndicators;
  
  const isPerfect = isAllClear && allBackgroundsWorking && allApisWorking && institutionsDataWorking && transparencyDataWorking;
  
  console.log(`\n🎯 STATUS: ${isPerfect ? '✅ PERFECT - All tests passed!' : '❌ Issues detected'}`);
  
  if (!isAllClear) {
    console.log(`   - Console issues: ${totalErrors} errors, ${totalWarnings} warnings, ${totalNetworkFailures} network failures`);
  }
  if (!allBackgroundsWorking) {
    console.log(`   - Background issues: ${pagesWithoutBackgrounds.length} pages missing backgrounds`);
  }
  if (!allApisWorking) {
    console.log(`   - API issues: ${failedApiEndpoints.length} failed endpoints`);
  }
  if (!institutionsDataWorking) {
    console.log(`   - Institutions page: API data not rendering properly`);
  }
  if (!transparencyDataWorking) {
    console.log(`   - Transparency page: API data not rendering properly`);
  }
  
  return {
    successRate: parseFloat(successRate),
    apiSuccessRate: parseFloat(apiSuccessRate),
    perfect: isPerfect,
    summary: report.summary,
    institutionsDataWorking,
    transparencyDataWorking
  };
}

if (require.main === module) {
  runNgrokTest()
    .then(result => {
      process.exit(result?.perfect ? 0 : 1);
    })
    .catch(console.error);
}

module.exports = { runNgrokTest };
