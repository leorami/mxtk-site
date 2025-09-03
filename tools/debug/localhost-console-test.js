#!/usr/bin/env node

// Localhost-only comprehensive browser console testing
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const LOCALHOST_BASE = 'http://localhost:2000';

const testPages = [
  '/transparency', 
  '/ecosystem', 
  '/whitepaper', 
  '/faq', 
  '/media', 
  '/the-team',
  '/institutions',
  '/roadmap',
  '/mxtk-cares',
  '/owners', // Adding more pages to be comprehensive
  '/' // Home page
];

async function testPageWithBrowser(page, url, pageName) {
  console.log(`\n🔍 Testing: ${url}`);
  
  const errors = [];
  const warnings = [];
  const networkFailures = [];
  const consoleMessages = [];
  
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
    } else if (type === 'warning' || type === 'warn') {
      warnings.push(text);
      console.log(`   ⚠️  Console Warning: ${text}`);
    } else if (type === 'log' && (text.includes('Warning') || text.includes('warning'))) {
      // Catch React warnings that might come as logs
      warnings.push(text);
      console.log(`   ⚠️  React Warning: ${text}`);
    }
  });
  
  // Capture ALL network failures (but ignore 304 Not Modified - those are cache hits!)
  page.on('response', response => {
    if (!response.ok() && response.status() !== 304) {
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
  
  // Capture request failures
  page.on('requestfailed', request => {
    const failure = `Request Failed: ${request.url()} - ${request.failure()?.errorText}`;
    networkFailures.push(failure);
    console.log(`   🚫 Request Failed: ${failure}`);
  });
  
  try {
    // Navigate with shorter timeout for localhost
    await page.goto(url, { 
      waitUntil: 'networkidle0', 
      timeout: 10000 
    });
    
    // Wait for page to fully load and any async operations
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check for background images specifically
    const backgroundCheck = await page.evaluate(() => {
      // Look for PhotoBackdrop, BackgroundPhoto, and any background images
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
               // Check if image is in a div that suggests it's a background
               img.parentElement?.className?.includes('backdrop') ||
               img.parentElement?.className?.includes('background')
      });
      
      const loadedBackgrounds = backgroundImages.filter(img => 
        img.complete && img.naturalWidth > 0 && img.naturalHeight > 0
      );
      
      // Also check for CSS background images
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
    
    // Test scroll behavior to catch scroll warnings
    await page.evaluate(() => {
      window.scrollTo(0, 100);
      window.scrollTo(0, 200);  
      window.scrollTo(0, 0);
    });
    
    // Wait for any async warnings after scroll
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for loading states that might indicate API failures
    const loadingCheck = await page.evaluate(() => {
      const loadingElements = document.querySelectorAll('[data-loading], .loading, .spinner');
      const hasLoadingText = document.body.textContent.includes('Loading...') || 
                             document.body.textContent.includes('Loading…') ||
                             document.body.textContent.includes('Refreshing…');
      
      return {
        hasLoadingElements: loadingElements.length > 0,
        hasLoadingText,
        bodyLength: document.body.textContent.length
      };
    });
    
    const success = errors.length === 0 && warnings.length === 0 && networkFailures.length === 0;
    
    return {
      url,
      pageName,
      success,
      errors,
      warnings,
      networkFailures,
      backgroundCheck,
      loadingCheck,
      totalConsoleMessages: consoleMessages.length,
      consoleMessages: consoleMessages.slice(-5) // Last 5 messages for debugging
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

async function runLocalhostTest() {
  console.log('🏠 LOCALHOST COMPREHENSIVE CONSOLE TEST');
  console.log('======================================');
  
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
      const result = await testPageWithBrowser(page, `${LOCALHOST_BASE}${testPage}`, testPage);
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
    // Exclude pages that shouldn't have backgrounds
    !['/'].includes(r.pageName)
  );
  
  const successfulPages = results.filter(r => r.success);
  
  console.log('\n📊 LOCALHOST COMPREHENSIVE TEST RESULTS');
  console.log('=======================================');
  console.log(`Total Pages Tested: ${results.length}`);
  console.log(`Successful Pages (0 errors/warnings): ${successfulPages.length}`);
  console.log(`Total Console Errors: ${totalErrors}`);
  console.log(`Total Console Warnings: ${totalWarnings}`);
  console.log(`Total Network Failures: ${totalNetworkFailures}`);
  console.log(`Pages Missing Backgrounds: ${pagesWithoutBackgrounds.length}`);
  
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
  
  if (pagesWithoutBackgrounds.length > 0) {
    console.log('\n🖼️  PAGES MISSING BACKGROUNDS:');
    pagesWithoutBackgrounds.forEach(r => {
      console.log(`   ${r.pageName}: ${r.backgroundCheck?.loadedBackgrounds || 0} images, ${r.backgroundCheck?.cssBackgrounds || 0} CSS backgrounds`);
    });
  }
  
  if (totalNetworkFailures > 0) {
    console.log('\n🔌 NETWORK FAILURES:');
    results.forEach(r => {
      if (r.networkFailures?.length > 0) {
        console.log(`   ${r.pageName}:`);
        r.networkFailures.forEach(failure => console.log(`     - ${failure}`));
      }
    });
  }
  
  // Background status per page
  console.log('\n🖼️  BACKGROUND STATUS PER PAGE:');
  results.forEach(r => {
    if (r.backgroundCheck) {
      const status = r.backgroundCheck.pageHasBackgrounds ? '✅' : '❌';
      console.log(`   ${status} ${r.pageName}: ${r.backgroundCheck.loadedBackgrounds} img backgrounds, ${r.backgroundCheck.cssBackgrounds} CSS backgrounds`);
    }
  });
  
  // Save detailed report
  const reportPath = path.join(__dirname, 'output', 'reports');
  if (!fs.existsSync(reportPath)) {
    fs.mkdirSync(reportPath, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().split('T')[0];
  const reportFile = path.join(reportPath, `localhost-console-test-${timestamp}.json`);
  
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalPages: results.length,
      successfulPages: successfulPages.length,
      totalErrors,
      totalWarnings,
      totalNetworkFailures,
      pagesWithoutBackgrounds: pagesWithoutBackgrounds.length
    },
    results
  };
  
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
  
  const successRate = (successfulPages.length / results.length * 100).toFixed(1);
  console.log(`\n📈 LOCALHOST SUCCESS RATE: ${successRate}%`);
  console.log(`💾 Detailed report: ${reportFile}`);
  
  const isAllClear = totalErrors === 0 && totalWarnings === 0 && totalNetworkFailures === 0;
  const allBackgroundsWorking = pagesWithoutBackgrounds.length === 0;
  const isPerfect = isAllClear && allBackgroundsWorking;
  
  console.log(`\n🎯 STATUS: ${isPerfect ? '✅ PERFECT - All tests passed!' : '❌ Issues detected'}`);
  
  if (!isAllClear) {
    console.log(`   - Console issues: ${totalErrors} errors, ${totalWarnings} warnings`);
  }
  if (!allBackgroundsWorking) {
    console.log(`   - Background issues: ${pagesWithoutBackgrounds.length} pages missing backgrounds`);
  }
  
  return {
    successRate: parseFloat(successRate),
    perfect: isPerfect,
    summary: report.summary
  };
}

if (require.main === module) {
  runLocalhostTest()
    .then(result => {
      process.exit(result?.perfect ? 0 : 1);
    })
    .catch(console.error);
}

module.exports = { runLocalhostTest };
