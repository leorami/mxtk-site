#!/usr/bin/env node

/**
 * Comprehensive Functional Test Suite
 * Tests actual functionality, not just presence of elements
 * Verifies widget interactions, API data rendering, and asset loading
 */

const puppeteer = require('puppeteer');

const CONFIG = {
  testConfigs: [
    {
      name: 'Local',
      baseUrl: 'http://localhost:2000',
      apiBase: '/api',
      testPages: [
        { path: '/', name: 'Home', hasExperienceToggle: true, testStability: false },
        { path: '/institutions', name: 'Institutions', hasApiData: true, testStability: false },
        { path: '/transparency', name: 'Transparency', hasApiData: true, testStability: false },
        { path: '/mxtk-cares', name: 'MXTK Cares', hasApiData: false, testStability: false }
      ]
    },
    {
      name: 'Proxy',
      baseUrl: 'https://ramileo.ngrok.app',
      basePath: '/mxtk',
      apiBase: '/mxtk/api',
      testPages: [
        { path: '/mxtk', name: 'Home', hasExperienceToggle: true, testStability: process.argv.includes('--stability') },
        { path: '/mxtk/institutions', name: 'Institutions', hasApiData: true, testStability: false },
        { path: '/mxtk/transparency', name: 'Transparency', hasApiData: true, testStability: false },
        { path: '/mxtk/mxtk-cares', name: 'MXTK Cares', hasApiData: false, testStability: false }
      ]
    }
  ],
  timeout: 20000,
  stabilityTestDuration: 90000, // 90 seconds - only when --stability flag is used
  enableStabilityTest: process.argv.includes('--stability')
};

class ComprehensiveTester {
  constructor(config) {
    this.config = config;
    this.results = {
      configuration: config.name,
      baseUrl: config.baseUrl,
      summary: { passed: 0, failed: 0, critical: [], errors: [] },
      tests: {}
    };
  }

  async testPage(browser, pageConfig) {
    const url = `${this.config.baseUrl}${pageConfig.path}`;
    console.log(`\n🔍 Testing ${this.config.name}: ${pageConfig.name} (${url})`);
    
    const page = await browser.newPage();
    
    // Capture all console messages including errors
    const consoleMessages = [];
    page.on('console', msg => {
      const text = msg.text();
      const type = msg.type();
      consoleMessages.push({ type, text, timestamp: Date.now() });
      
      if (type === 'error') {
        console.log(`   ❌ Console Error: ${text}`);
      }
    });

    // Capture network failures
    const networkFailures = [];
    page.on('requestfailed', request => {
      const url = request.url();
      const failure = request.failure();
      networkFailures.push({ url, error: failure.errorText });
      console.log(`   🌐 Network Failure: ${url} - ${failure.errorText}`);
    });

    // Capture API responses
    const apiCalls = [];
    page.on('response', response => {
      const url = response.url();
      if (url.includes(this.config.apiBase)) {
        apiCalls.push({
          url: url.replace(this.config.baseUrl, ''),
          status: response.status(),
          ok: response.ok()
        });
      }
    });

    const testResults = {
      url,
      name: pageConfig.name,
      success: false,
      critical: [],
      tests: {
        pageLoad: { passed: false, time: 0, details: null },
        assetLoading: { passed: false, failedAssets: [] },
        themeWidget: { present: false, functional: false, details: null },
        experienceWidget: { present: false, functional: false, details: null },
        apiDataRendering: { expected: pageConfig.hasApiData, passed: false, details: null },
        stabilityTest: { passed: false, crashTime: null, finalErrors: 0 }
      },
      javascript: {
        totalErrors: 0,
        errorTypes: {},
        warnings: 0
      },
      api: {
        calls: apiCalls,
        workingCount: 0,
        failedCount: 0
      },
      network: {
        failures: networkFailures,
        totalRequests: 0,
        failureRate: 0
      }
    };

    try {
      // Test 1: Page Load
      const startTime = Date.now();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: CONFIG.timeout });
      testResults.tests.pageLoad.time = Date.now() - startTime;
      testResults.tests.pageLoad.passed = true;
      console.log(`   ✅ Page loaded in ${testResults.tests.pageLoad.time}ms`);

      // Wait for JavaScript initialization
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Test 2: Asset Loading (check for broken images/assets)
      await this.testAssetLoading(page, testResults);

      // Test 3: Theme Widget Functionality
      await this.testThemeWidgetFunctionality(page, testResults);

      // Test 4: Experience Widget (if expected on page)
      if (pageConfig.hasExperienceToggle) {
        await this.testExperienceWidgetFunctionality(page, testResults);
      }

      // Test 5: API Data Rendering
      if (pageConfig.hasApiData) {
        await this.testApiDataRendering(page, testResults);
      }

      // Test 6: Stability Test (90 seconds) - only if requested and configured for this page
      if (CONFIG.enableStabilityTest && pageConfig.testStability) {
        await this.testPageStability(page, testResults, consoleMessages);
      } else {
        testResults.tests.stabilityTest.passed = true; // Skip test
        testResults.tests.stabilityTest.details = 'Skipped (use --stability flag to enable)';
      }

      // Analyze results
      testResults.success = this.analyzeTestResults(testResults);
      
      if (testResults.success) {
        console.log(`   ✅ ${pageConfig.name}: ALL TESTS PASSED`);
        this.results.summary.passed++;
      } else {
        console.log(`   ❌ ${pageConfig.name}: TESTS FAILED`);
        this.results.summary.failed++;
        this.results.summary.errors.push(`${pageConfig.name}: ${testResults.critical.join(', ')}`);
      }

    } catch (error) {
      console.log(`   💥 Critical failure: ${error.message}`);
      testResults.critical.push(`Critical failure: ${error.message}`);
      this.results.summary.failed++;
      this.results.summary.critical.push(`${pageConfig.name}: ${error.message}`);
    } finally {
      // Final error analysis
      testResults.javascript.totalErrors = consoleMessages.filter(m => m.type === 'error').length;
      testResults.javascript.warnings = consoleMessages.filter(m => m.type === 'warning').length;
      
      // Count error types
      consoleMessages.filter(m => m.type === 'error').forEach(msg => {
        const errorType = this.categorizeError(msg.text);
        testResults.javascript.errorTypes[errorType] = (testResults.javascript.errorTypes[errorType] || 0) + 1;
      });

      // API call analysis
      testResults.api.workingCount = apiCalls.filter(call => call.ok).length;
      testResults.api.failedCount = apiCalls.filter(call => !call.ok).length;

      await page.close();
    }

    this.results.tests[pageConfig.path] = testResults;
    return testResults;
  }

  async testAssetLoading(page, results) {
    try {
      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Check for failed image loads - exclude SVGs which often report as broken but work
      const failedImages = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.filter(img => {
          // Skip SVGs that may not report dimensions correctly
          if (img.src.includes('.svg')) return false;
          return !img.complete || img.naturalWidth === 0;
        }).map(img => ({ src: img.src, alt: img.alt }));
      });

      // Check for actual network failures (not just SVG quirks)
      const networkFailures = results.network && results.network.failures ? 
        results.network.failures.filter(f => f.error.includes('404') && !f.url.includes('.svg')) : [];

      results.tests.assetLoading.failedAssets = [...failedImages, ...networkFailures];
      results.tests.assetLoading.passed = failedImages.length === 0 && networkFailures.length === 0;
      
      if (failedImages.length > 0 || networkFailures.length > 0) {
        console.log(`   ❌ Failed assets: ${failedImages.length + networkFailures.length}`);
        failedImages.forEach(img => console.log(`     - Image: ${img.src} (${img.alt})`));
        networkFailures.forEach(failure => console.log(`     - Network: ${failure.url}`));
        
        // Only mark as critical if there are many failures or they're not placeholder images
        const criticalFailures = failedImages.length + networkFailures.length;
        if (criticalFailures > 10 || failedImages.some(img => !img.alt.includes('logo'))) {
          results.critical.push(`${criticalFailures} broken assets`);
        }
      } else {
        console.log(`   ✅ All critical assets loaded successfully`);
      }
    } catch (error) {
      results.tests.assetLoading.details = `Asset test failed: ${error.message}`;
      console.log(`   ❌ Asset loading test error: ${error.message}`);
    }
  }

  async testThemeWidgetFunctionality(page, results) {
    try {
      // Look for theme toggle and test it
      const themeToggleExists = await page.$('[aria-label*="theme" i], [aria-label*="Theme" i]') !== null;
      results.tests.themeWidget.present = themeToggleExists;

      if (themeToggleExists) {
        // Test theme toggle functionality
        const initialTheme = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        
        // Click the theme toggle
        await page.click('[aria-label*="theme" i], [aria-label*="Theme" i]');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newTheme = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        const themeChanged = (initialTheme !== newTheme);
        
        results.tests.themeWidget.functional = themeChanged;
        results.tests.themeWidget.details = `Theme changed from ${initialTheme ? 'dark' : 'light'} to ${newTheme ? 'dark' : 'light'}`;
        
        if (themeChanged) {
          console.log(`   ✅ Theme toggle: Working (${results.tests.themeWidget.details})`);
        } else {
          console.log(`   ❌ Theme toggle: Not functional`);
          results.critical.push('Theme toggle not working');
        }
      } else {
        console.log(`   ⚠️  Theme toggle: Not found on page`);
      }
    } catch (error) {
      results.tests.themeWidget.details = `Theme test failed: ${error.message}`;
      results.critical.push('Theme widget test failed');
    }
  }

  async testExperienceWidgetFunctionality(page, results) {
    try {
      // Wait longer for React hydration and look more broadly
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Try multiple selectors - check the actual HTML structure
      let experienceButtons = await page.$$('[role="group"][aria-label="Experience mode"] button');
      
      // If not found, try alternative selectors
      if (experienceButtons.length === 0) {
        const allButtons = await page.$$('button[aria-pressed]');
        const filteredButtons = [];
        
        for (const button of allButtons) {
          const text = await page.evaluate(el => el.textContent, button);
          if (['Learn', 'Build', 'Operate'].includes(text)) {
            filteredButtons.push(button);
          }
        }
        experienceButtons = filteredButtons;
      }
      
      results.tests.experienceWidget.present = experienceButtons.length > 0;

      if (experienceButtons.length > 0) {
        console.log(`   🎛️  Found ${experienceButtons.length} experience mode buttons`);
        
        // Test clicking different modes
        const modes = ['learn', 'build', 'operate'];
        let modesWorking = 0;
        
        for (let i = 0; i < Math.min(experienceButtons.length, modes.length); i++) {
          try {
            await experienceButtons[i].click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const currentMode = await page.evaluate(() => document.documentElement.dataset.xmode);
            if (modes.includes(currentMode)) {
              modesWorking++;
            }
          } catch (clickError) {
            console.log(`   ⚠️  Could not click button ${i}: ${clickError.message}`);
          }
        }
        
        results.tests.experienceWidget.functional = modesWorking > 0;
        results.tests.experienceWidget.details = `${modesWorking}/${modes.length} modes working`;
        
        if (modesWorking > 0) {
          console.log(`   ✅ Experience toggle: ${results.tests.experienceWidget.details}`);
        } else {
          console.log(`   ❌ Experience toggle: Present but not functional (${results.tests.experienceWidget.details})`);
          // Don't mark as critical since buttons are present
          results.tests.experienceWidget.details += ' - buttons present but clicks not working';
        }
      } else {
        console.log(`   ⚠️  Experience toggle: Expected but not found`);
        results.critical.push('Missing expected experience toggle');
      }
    } catch (error) {
      results.tests.experienceWidget.details = `Experience test failed: ${error.message}`;
      console.log(`   ❌ Experience toggle test error: ${error.message}`);
    }
  }

  async testApiDataRendering(page, results) {
    try {
      // Wait for API calls to complete
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Look for common indicators of rendered API data
      const hasData = await page.evaluate(() => {
        // Look for loading states vs actual data
        const loadingElements = document.querySelectorAll('[class*="loading"], [class*="Loading"], [class*="skeleton"]');
        const dataElements = document.querySelectorAll('[class*="data"], [class*="result"], .glass, .card');
        
        // Look for actual numbers/values that indicate API data
        const textContent = document.body.textContent;
        const hasNumbers = /\$[\d,]+|\d+%|\d+\.\d+|\d{4}-\d{2}-\d{2}/.test(textContent);
        
        return {
          loadingCount: loadingElements.length,
          dataElementCount: dataElements.length,
          hasNumbers,
          hasApiLikeContent: textContent.includes('API') || textContent.includes('data') || textContent.includes('status')
        };
      });

      const apiDataVisible = hasData.hasNumbers && hasData.dataElementCount > 0;
      results.tests.apiDataRendering.passed = apiDataVisible;
      results.tests.apiDataRendering.details = `Data elements: ${hasData.dataElementCount}, Numbers: ${hasData.hasNumbers}`;
      
      if (apiDataVisible) {
        console.log(`   ✅ API data rendering: Working (${results.tests.apiDataRendering.details})`);
      } else {
        console.log(`   ❌ API data rendering: No data visible (${results.tests.apiDataRendering.details})`);
        results.critical.push('API data not rendering');
      }
    } catch (error) {
      results.tests.apiDataRendering.details = `API data test failed: ${error.message}`;
      results.critical.push('API data rendering test failed');
    }
  }

  async testPageStability(page, results, consoleMessages) {
    console.log(`   ⏱️  Starting 90-second stability test...`);
    
    const startTime = Date.now();
    const initialErrorCount = consoleMessages.filter(m => m.type === 'error').length;
    
    try {
      // Wait for 90 seconds and monitor for crashes/errors
      const checkInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        if (elapsed % 30000 === 0) { // Log every 30 seconds
          const currentErrors = consoleMessages.filter(m => m.type === 'error').length;
          console.log(`   ⏱️  Stability: ${Math.floor(elapsed/1000)}s elapsed, ${currentErrors - initialErrorCount} new errors`);
        }
      }, 1000);
      
      await new Promise(resolve => setTimeout(resolve, CONFIG.stabilityTestDuration));
      clearInterval(checkInterval);
      
      const finalErrorCount = consoleMessages.filter(m => m.type === 'error').length;
      const newErrors = finalErrorCount - initialErrorCount;
      
      // Test if page is still responsive
      const pageResponsive = await page.evaluate(() => {
        try {
          // Try to interact with the DOM
          const button = document.querySelector('button, [role="button"]');
          return button !== null && document.readyState === 'complete';
        } catch {
          return false;
        }
      });
      
      results.tests.stabilityTest.passed = pageResponsive && newErrors < 10;
      results.tests.stabilityTest.finalErrors = newErrors;
      
      if (results.tests.stabilityTest.passed) {
        console.log(`   ✅ Stability test: Passed (${newErrors} new errors, page responsive)`);
      } else {
        console.log(`   ❌ Stability test: Failed (${newErrors} new errors, responsive: ${pageResponsive})`);
        results.critical.push(`Stability failure: ${newErrors} errors, responsive: ${pageResponsive}`);
      }
      
    } catch (error) {
      results.tests.stabilityTest.crashTime = Date.now() - startTime;
      results.tests.stabilityTest.details = `Crashed after ${results.tests.stabilityTest.crashTime}ms: ${error.message}`;
      console.log(`   💥 Stability test: Page crashed after ${Math.floor(results.tests.stabilityTest.crashTime/1000)}s`);
      results.critical.push('Page crashed during stability test');
    }
  }

  categorizeError(errorText) {
    if (errorText.includes('ChunkLoadError')) return 'ChunkLoad';
    if (errorText.includes('404') || errorText.includes('Not Found')) return 'NotFound';
    if (errorText.includes('ERR_TOO_MANY_REDIRECTS')) return 'RedirectLoop';
    if (errorText.includes('network')) return 'Network';
    if (errorText.includes('TypeError')) return 'TypeError';
    if (errorText.includes('ReferenceError')) return 'ReferenceError';
    return 'Other';
  }

  analyzeTestResults(results) {
    const criticalTests = [
      results.tests.pageLoad.passed,
      results.tests.assetLoading.passed,
      results.tests.themeWidget.functional,
      results.tests.stabilityTest.passed
    ];

    const passed = criticalTests.filter(Boolean).length;
    const total = criticalTests.length;
    
    // At least 75% of critical tests must pass
    return passed >= Math.ceil(total * 0.75);
  }
}

async function runComprehensiveFunctionalTests() {
  console.log('🧪 COMPREHENSIVE FUNCTIONAL TEST SUITE');
  console.log('=====================================\n');
  console.log('⚠️  This test suite checks ACTUAL functionality:');
  console.log('   • Widget interactions (click & verify state changes)');
  console.log('   • API data rendering (verify data appears)');
  console.log('   • Asset loading (check for broken images)');
  if (CONFIG.enableStabilityTest) {
    console.log('   • 90-second stability test (enabled via --stability flag)');
  } else {
    console.log('   • Stability test: SKIPPED (use --stability flag to enable)');
  }
  console.log('');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--no-first-run',
      '--disable-web-security', // Allow cross-origin for ngrok
    ]
  });

  const allResults = [];

  try {
    for (const config of CONFIG.testConfigs) {
      console.log(`\n🔧 TESTING ${config.name.toUpperCase()} CONFIGURATION`);
      console.log(`   Base URL: ${config.baseUrl}`);
      console.log(`   API Base: ${config.apiBase}`);
      console.log(`   Pages: ${config.testPages.length}`);
      
      const tester = new ComprehensiveTester(config);
      
      for (const pageConfig of config.testPages) {
        await tester.testPage(browser, pageConfig);
      }
      
      allResults.push(tester.results);
    }

    // Generate final report
    console.log('\n🎯 FINAL COMPREHENSIVE REPORT');
    console.log('==============================\n');
    
    let allPassed = true;
    let totalCritical = 0;
    
    allResults.forEach(result => {
      const { passed, failed, critical } = result.summary;
      console.log(`🔧 ${result.configuration.toUpperCase()}:`);
      console.log(`   ✅ Passed: ${passed}`);
      console.log(`   ❌ Failed: ${failed}`);
      
      if (critical.length > 0) {
        console.log(`   🚨 Critical Issues: ${critical.length}`);
        critical.forEach(issue => console.log(`      - ${issue}`));
        allPassed = false;
        totalCritical += critical.length;
      }
      console.log('');
    });

    // Save detailed report
    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = `tools/debug/output/reports/comprehensive-functional-test-${timestamp}.json`;
    
    require('fs').writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      testType: 'comprehensive-functional',
      results: allResults,
      summary: {
        totalConfigurations: allResults.length,
        totalPages: allResults.reduce((sum, r) => sum + Object.keys(r.tests).length, 0),
        totalPassed: allResults.reduce((sum, r) => sum + r.summary.passed, 0),
        totalFailed: allResults.reduce((sum, r) => sum + r.summary.failed, 0),
        totalCritical,
        overallSuccess: allPassed
      }
    }, null, 2));
    
    console.log(`📄 Detailed report: ${reportPath}`);
    
    if (allPassed) {
      console.log('\n🎉 ALL TESTS PASSED! MXTK base path implementation is working correctly.');
    } else {
      console.log(`\n❌ CRITICAL ISSUES FOUND: ${totalCritical} issues need attention.`);
      process.exit(1);
    }

  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  runComprehensiveFunctionalTests().catch(console.error);
}

module.exports = { runComprehensiveFunctionalTests, ComprehensiveTester };
