#!/usr/bin/env node

// Real browser console testing with Puppeteer to capture actual errors
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const NGROK_BASE = 'https://ramileo.ngrok.app';
const LOCALHOST_BASE = 'http://localhost:2000';

const testPages = [
  '/mxtk/transparency', 
  '/mxtk/ecosystem', 
  '/mxtk/whitepaper', 
  '/mxtk/faq', 
  '/mxtk/media', 
  '/mxtk/the-team',
  '/mxtk/institutions',
  '/mxtk/roadmap',
  '/mxtk/mxtk-cares'
];

async function testPageWithBrowser(page, url, pageName) {
  console.log(`\n🔍 Testing: ${url}`);
  
  const errors = [];
  const warnings = [];
  const networkFailures = [];
  const consoleMessages = [];
  
  // Capture console messages
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push({
      type: msg.type(),
      text,
      timestamp: new Date().toISOString()
    });
    
    if (msg.type() === 'error') {
      errors.push(text);
      console.log(`   ❌ Console Error: ${text}`);
    } else if (msg.type() === 'warning') {
      warnings.push(text);
      console.log(`   ⚠️  Console Warning: ${text}`);
    }
  });
  
  // Capture network failures
  page.on('response', response => {
    if (!response.ok()) {
      const failure = `${response.status()} ${response.url()}`;
      networkFailures.push(failure);
      console.log(`   🔌 Network Failure: ${failure}`);
    }
  });
  
  // Capture page errors
  page.on('pageerror', error => {
    const errorText = error.toString();
    errors.push(`Page Error: ${errorText}`);
    console.log(`   💥 Page Error: ${errorText}`);
  });
  
  try {
    // Navigate with timeout
    await page.goto(url, { 
      waitUntil: 'networkidle0', 
      timeout: 15000 
    });
    
    // Wait for page to fully load
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check for background images
    const backgroundCheck = await page.evaluate(() => {
      // Look for PhotoBackdrop or background images
      const images = document.querySelectorAll('img');
      const backgrounds = Array.from(images).filter(img => 
        img.src.includes('photo') || 
        img.src.includes('background') ||
        img.alt.includes('background') ||
        img.className.includes('background')
      );
      
      const loadedBackgrounds = backgrounds.filter(img => img.complete && img.naturalWidth > 0);
      
      return {
        totalImages: images.length,
        backgroundImages: backgrounds.length,
        loadedBackgrounds: loadedBackgrounds.length,
        backgroundUrls: backgrounds.map(img => img.src)
      };
    });
    
    // Check for API data loading
    const apiCheck = await page.evaluate(() => {
      // Look for loading states or empty data indicators
      const loadingElements = document.querySelectorAll('[data-loading], .loading, .spinner');
      const hasLoadingText = document.body.textContent.includes('Loading...') || 
                         document.body.textContent.includes('Loading…');
      
      return {
        hasLoadingElements: loadingElements.length > 0,
        hasLoadingText,
        bodyLength: document.body.textContent.length
      };
    });
    
    // Check for redirect issues
    const finalUrl = page.url();
    const redirected = finalUrl !== url;
    
    // Scroll test to trigger scroll warnings
    await page.evaluate(() => {
      window.scrollTo(0, 100);
      window.scrollTo(0, 200);
      window.scrollTo(0, 0);
    });
    
    // Wait for any async warnings
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      url,
      finalUrl,
      pageName,
      success: errors.length === 0 && networkFailures.length === 0,
      errors,
      warnings,
      networkFailures,
      backgroundCheck,
      apiCheck,
      redirected,
      totalConsoleMessages: consoleMessages.length,
      consoleMessages: consoleMessages.slice(-10) // Last 10 messages
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
      networkFailures
    };
  }
}

async function runBrowserTest() {
  console.log('🚀 LAUNCHING REAL BROWSER CONSOLE TEST');
  console.log('=====================================');
  
  let browser;
  const results = [];
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Test all pages
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
  
  // Analysis
  const totalErrors = results.reduce((sum, r) => sum + (r.errors?.length || 0), 0);
  const totalWarnings = results.reduce((sum, r) => sum + (r.warnings?.length || 0), 0);
  const totalNetworkFailures = results.reduce((sum, r) => sum + (r.networkFailures?.length || 0), 0);
  const backgroundIssues = results.filter(r => r.backgroundCheck?.loadedBackgrounds === 0);
  const redirectIssues = results.filter(r => r.redirected);
  const successfulPages = results.filter(r => r.success);
  
  console.log('\n📊 COMPREHENSIVE BROWSER TEST RESULTS');
  console.log('=====================================');
  console.log(`Total Pages Tested: ${results.length}`);
  console.log(`Successful Pages: ${successfulPages.length}`);
  console.log(`Total Console Errors: ${totalErrors}`);
  console.log(`Total Console Warnings: ${totalWarnings}`);
  console.log(`Total Network Failures: ${totalNetworkFailures}`);
  console.log(`Pages with Background Issues: ${backgroundIssues.length}`);
  console.log(`Pages with Redirect Issues: ${redirectIssues.length}`);
  
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
  
  if (backgroundIssues.length > 0) {
    console.log('\n🖼️  BACKGROUND IMAGE ISSUES:');
    backgroundIssues.forEach(r => {
      console.log(`   ${r.pageName}: ${r.backgroundCheck?.loadedBackgrounds || 0} backgrounds loaded`);
    });
  }
  
  if (redirectIssues.length > 0) {
    console.log('\n🔄 REDIRECT ISSUES:');
    redirectIssues.forEach(r => {
      console.log(`   ${r.pageName}: ${r.url} → ${r.finalUrl}`);
    });
  }
  
  // Save detailed report
  const reportPath = path.join(__dirname, 'output', 'reports');
  if (!fs.existsSync(reportPath)) {
    fs.mkdirSync(reportPath, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  const reportFile = path.join(reportPath, `browser-console-test-${timestamp}.json`);
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPages: results.length,
      successfulPages: successfulPages.length,
      totalErrors,
      totalWarnings,
      totalNetworkFailures,
      backgroundIssues: backgroundIssues.length,
      redirectIssues: redirectIssues.length
    },
    results
  };
  
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  const successRate = (successfulPages.length / results.length * 100).toFixed(1);
  console.log(`\n📈 REAL BROWSER SUCCESS RATE: ${successRate}%`);
  console.log(`💾 Detailed report: ${reportFile}`);
  
  const isAllClear = totalErrors === 0 && totalWarnings === 0 && totalNetworkFailures === 0;
  console.log(`\n🎯 STATUS: ${isAllClear ? '✅ ALL CLEAR' : '❌ ISSUES DETECTED'}`);
  
  return {
    successRate: parseFloat(successRate),
    allClear: isAllClear,
    summary: report.summary
  };
}

if (require.main === module) {
  runBrowserTest()
    .then(result => {
      process.exit(result?.allClear ? 0 : 1);
    })
    .catch(console.error);
}

module.exports = { runBrowserTest };
