#!/usr/bin/env node

const puppeteer = require('puppeteer');

const CONFIG = {
  baseUrl: 'https://ramileo.ngrok.app',
  timeout: 10000,
  maxErrors: 5,
  maxWarnings: 10,
  testPages: [
    '/mxtk',
    '/mxtk/institutions', 
    '/mxtk/transparency',
    '/mxtk/mxtk-cares',
    '/mxtk/careers'
  ]
};

async function runComprehensiveTest() {
  console.log('🔍 COMPREHENSIVE NGROK TEST');
  console.log('============================\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const results = {
    pages: {},
    globalIssues: [],
    summary: { errors: 0, warnings: 0, passed: 0, failed: 0 }
  };

  for (const path of CONFIG.testPages) {
    const url = `${CONFIG.baseUrl}${path}`;
    console.log(`\n🔍 Testing: ${url}`);
    
    const page = await browser.newPage();
    const pageResults = {
      url,
      errors: [],
      warnings: [],
      apiCalls: [],
      themeToggle: false,
      experienceToggle: false,
      modeAwareContent: false,
      chunkLoadErrors: [],
      navigationStyling: false
    };

    // Capture console messages
    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error') {
        pageResults.errors.push(text);
        if (text.includes('ChunkLoadError') || text.includes('app-pages-internals')) {
          pageResults.chunkLoadErrors.push(text);
        }
      } else if (msg.type() === 'warning') {
        pageResults.warnings.push(text);
      }
    });

    // Capture network failures
    page.on('requestfailed', request => {
      const url = request.url();
      if (url.includes('_next') || url.includes('api/')) {
        pageResults.errors.push(`Network failure: ${url} - ${request.failure().errorText}`);
      }
    });

    // Capture API responses
    page.on('response', response => {
      const url = response.url();
      if (url.includes('/api/')) {
        pageResults.apiCalls.push({
          url: url.replace(CONFIG.baseUrl, ''),
          status: response.status(),
          ok: response.ok()
        });
      }
    });

    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: CONFIG.timeout });
      
      // Test 1: Check for theme toggle functionality
      try {
        const themeToggle = await page.$('[aria-label="Theme"]');
        if (themeToggle) {
          pageResults.themeToggle = true;
          // Test clicking theme toggle
          await themeToggle.click();
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (e) {
        pageResults.warnings.push(`Theme toggle test failed: ${e.message}`);
      }

      // Test 2: Check for experience toggle (only on home page)
      if (path === '/mxtk') {
        try {
          const expToggle = await page.$('[aria-label="Experience mode"]');
          if (expToggle) {
            pageResults.experienceToggle = true;
            // Test clicking experience toggle
            const buttons = await expToggle.$$('button');
            if (buttons.length > 1) {
              await buttons[1].click(); // Click "Build" mode
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
        } catch (e) {
          pageResults.warnings.push(`Experience toggle test failed: ${e.message}`);
        }
      }

      // Test 3: Check for mode-aware content changes
      try {
        const h1 = await page.$('h1');
        if (h1) {
          const text = await h1.textContent();
          pageResults.modeAwareContent = text.length > 0;
        }
      } catch (e) {
        pageResults.warnings.push(`Mode-aware content test failed: ${e.message}`);
      }

      // Test 4: Check navigation styling
      try {
        const nav = await page.$('header nav');
        if (nav) {
          const styles = await page.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              display: computed.display,
              visibility: computed.visibility,
              color: computed.color
            };
          }, nav);
          pageResults.navigationStyling = styles.display !== 'none' && styles.visibility !== 'hidden';
        }
      } catch (e) {
        pageResults.warnings.push(`Navigation styling test failed: ${e.message}`);
      }

      // Test 5: Check for specific API endpoints on relevant pages
      if (path.includes('institutions') || path.includes('transparency')) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for API calls
        const hasTokenAPI = pageResults.apiCalls.some(call => call.url.includes('/api/token'));
        const hasPoolsAPI = pageResults.apiCalls.some(call => call.url.includes('/api/pools'));
        
        if (!hasTokenAPI && path.includes('institutions')) {
          pageResults.warnings.push('Missing token API call on institutions page');
        }
        if (!hasPoolsAPI && path.includes('institutions')) {
          pageResults.warnings.push('Missing pools API call on institutions page');
        }
      }

    } catch (error) {
      pageResults.errors.push(`Page load failed: ${error.message}`);
    }

    await page.close();
    
    // Summarize results for this page
    const errorCount = pageResults.errors.length;
    const warningCount = pageResults.warnings.length;
    const chunkErrors = pageResults.chunkLoadErrors.length;
    
    console.log(`   Errors: ${errorCount}, Warnings: ${warningCount}, Chunk Errors: ${chunkErrors}`);
    console.log(`   Theme Toggle: ${pageResults.themeToggle ? '✅' : '❌'}`);
    if (path === '/mxtk') {
      console.log(`   Experience Toggle: ${pageResults.experienceToggle ? '✅' : '❌'}`);
    }
    console.log(`   Mode-Aware Content: ${pageResults.modeAwareContent ? '✅' : '❌'}`);
    console.log(`   Navigation Styling: ${pageResults.navigationStyling ? '✅' : '❌'}`);
    console.log(`   API Calls: ${pageResults.apiCalls.length} (${pageResults.apiCalls.filter(c => c.ok).length} successful)`);

    if (errorCount > 0) {
      console.log(`   🚨 ERRORS:`);
      pageResults.errors.slice(0, 3).forEach(err => console.log(`      - ${err.substring(0, 100)}...`));
    }

    results.pages[path] = pageResults;
    results.summary.errors += errorCount;
    results.summary.warnings += warningCount;
    
    if (errorCount === 0 && chunkErrors === 0 && pageResults.themeToggle && pageResults.navigationStyling) {
      results.summary.passed++;
    } else {
      results.summary.failed++;
    }
  }

  await browser.close();

  // Final summary
  console.log('\n📊 FINAL SUMMARY');
  console.log('=================');
  console.log(`Pages Tested: ${CONFIG.testPages.length}`);
  console.log(`Passed: ${results.summary.passed}`);
  console.log(`Failed: ${results.summary.failed}`);
  console.log(`Total Errors: ${results.summary.errors}`);
  console.log(`Total Warnings: ${results.summary.warnings}`);

  // Critical issues
  const criticalIssues = [];
  Object.values(results.pages).forEach(page => {
    if (page.chunkLoadErrors.length > 0) {
      criticalIssues.push(`Chunk load errors on ${page.url}`);
    }
    if (!page.themeToggle) {
      criticalIssues.push(`Theme toggle not working on ${page.url}`);
    }
    if (!page.navigationStyling) {
      criticalIssues.push(`Navigation styling issues on ${page.url}`);
    }
  });

  if (criticalIssues.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES:');
    criticalIssues.forEach(issue => console.log(`   - ${issue}`));
  } else {
    console.log('\n✅ No critical issues found!');
  }

  return results.summary.failed === 0 && criticalIssues.length === 0;
}

if (require.main === module) {
  runComprehensiveTest()
    .then(success => process.exit(success ? 0 : 1))
    .catch(err => {
      console.error('Test failed:', err);
      process.exit(1);
    });
}

module.exports = { runComprehensiveTest };
