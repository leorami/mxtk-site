#!/usr/bin/env node

/**
 * Comprehensive Client Widgets Test Suite
 * Tests experience switcher, theme widgets, and third-party API functionality
 * Works for both local and proxy configurations
 */

const puppeteer = require('puppeteer');

const CONFIG = {
  testConfigs: [
    {
      name: 'Local',
      baseUrl: 'http://localhost:2000',
      apiBase: '/api',
      testPages: ['/', '/institutions', '/transparency', '/mxtk-cares']
    },
    {
      name: 'Proxy/Ngrok',
      baseUrl: 'https://ramileo.ngrok.app',
      basePath: '/mxtk',
      apiBase: '/mxtk/api', 
      testPages: ['/mxtk', '/mxtk/institutions', '/mxtk/transparency', '/mxtk/mxtk-cares']
    }
  ],
  timeout: 15000,
  maxRetries: 2
};

class ClientWidgetTester {
  constructor(config) {
    this.config = config;
    this.results = {
      configuration: config.name,
      baseUrl: config.baseUrl,
      summary: { passed: 0, failed: 0, errors: [] },
      tests: {}
    };
  }

  async testPage(browser, pagePath) {
    const url = `${this.config.baseUrl}${pagePath}`;
    console.log(`\n🔍 Testing ${this.config.name}: ${url}`);
    
    const page = await browser.newPage();
    const testResults = {
      url,
      widgets: {
        experienceToggle: { present: false, functional: false, modesWork: [] },
        themeToggle: { present: false, functional: false, persistsState: false },
        devThemeSwitcher: { present: false, functional: false },
        modeAwareContent: { present: false, changesOnToggle: false }
      },
      api: {
        internalCalls: { working: [], failed: [] },
        thirdPartyReachable: false
      },
      javascript: {
        errors: [],
        warnings: [],
        chunkLoadErrors: []
      },
      performance: {
        loadTime: 0,
        interactionReady: 0
      }
    };

    // Capture JavaScript console messages
    page.on('console', msg => {
      const text = msg.text();
      const type = msg.type();
      
      if (type === 'error') {
        testResults.javascript.errors.push(text);
        if (text.includes('ChunkLoadError') || text.includes('Loading chunk')) {
          testResults.javascript.chunkLoadErrors.push(text);
        }
      } else if (type === 'warning') {
        testResults.javascript.warnings.push(text);
      }
    });

    // Monitor API calls
    page.on('response', response => {
      const url = response.url();
      const status = response.status();
      
      if (url.includes(this.config.apiBase)) {
        const apiCall = {
          path: url.replace(this.config.baseUrl, ''),
          status,
          ok: response.ok()
        };
        
        if (response.ok()) {
          testResults.api.internalCalls.working.push(apiCall);
        } else {
          testResults.api.internalCalls.failed.push(apiCall);
        }
      }
    });

    try {
      const startTime = Date.now();
      
      // Navigate and wait for page to be ready
      await page.goto(url, { waitUntil: 'networkidle2', timeout: CONFIG.timeout });
      testResults.performance.loadTime = Date.now() - startTime;

      // Wait for JavaScript to initialize
      await new Promise(resolve => setTimeout(resolve, 2000));
      testResults.performance.interactionReady = Date.now() - startTime;

      // Test 1: Experience Toggle Widget (only on home page)
      if (pagePath === '/' || pagePath === '/mxtk') {
        await this.testExperienceToggle(page, testResults);
      }

      // Test 2: Theme Toggle Widget  
      await this.testThemeToggle(page, testResults);

      // Test 3: Dev Theme Switcher (development only)
      await this.testDevThemeSwitcher(page, testResults);

      // Test 4: Mode-Aware Content
      await this.testModeAwareContent(page, testResults);

      // Test 5: API Functionality
      await this.testApiCalls(page, testResults);

      // Test 6: Third-party API reachability
      await this.testThirdPartyApis(page, testResults);

      console.log(`   ✅ Page loaded in ${testResults.performance.loadTime}ms`);
      console.log(`   ✅ Interactive in ${testResults.performance.interactionReady}ms`);
      console.log(`   📊 API calls: ${testResults.api.internalCalls.working.length} working, ${testResults.api.internalCalls.failed.length} failed`);
      console.log(`   🎛️ Experience toggle: ${testResults.widgets.experienceToggle.functional ? '✅' : '❌'}`);
      console.log(`   🎨 Theme toggle: ${testResults.widgets.themeToggle.functional ? '✅' : '❌'}`);
      console.log(`   🔧 Dev switcher: ${testResults.widgets.devThemeSwitcher.functional ? '✅' : '❌'}`);
      
      this.results.summary.passed++;

    } catch (error) {
      console.log(`   ❌ Test failed: ${error.message}`);
      testResults.javascript.errors.push(error.message);
      this.results.summary.failed++;
      this.results.summary.errors.push(`${url}: ${error.message}`);
    } finally {
      await page.close();
    }

    this.results.tests[pagePath] = testResults;
    return testResults;
  }

  async testExperienceToggle(page, results) {
    try {
      // Look for experience toggle buttons
      const toggleButtons = await page.$$('[role="group"][aria-label="Experience mode"] button');
      
      if (toggleButtons.length > 0) {
        results.widgets.experienceToggle.present = true;
        console.log(`     🎛️ Found ${toggleButtons.length} experience mode buttons`);
        
        // Test clicking each mode
        const modes = ['learn', 'build', 'operate'];
        for (let i = 0; i < Math.min(toggleButtons.length, modes.length); i++) {
          await toggleButtons[i].click();
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Check if mode was applied to document
          const currentMode = await page.evaluate(() => document.documentElement.dataset.xmode);
          if (modes.includes(currentMode)) {
            results.widgets.experienceToggle.modesWork.push(currentMode);
          }
        }
        
        results.widgets.experienceToggle.functional = results.widgets.experienceToggle.modesWork.length > 0;
      }
    } catch (error) {
      results.javascript.errors.push(`Experience toggle test failed: ${error.message}`);
    }
  }

  async testThemeToggle(page, results) {
    try {
      // Look for theme toggle button
      const themeToggle = await page.$('[aria-label*="theme" i], [aria-label*="Theme" i]');
      
      if (themeToggle) {
        results.widgets.themeToggle.present = true;
        console.log(`     🎨 Found theme toggle button`);
        
        // Test clicking theme toggle
        const initialTheme = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        await themeToggle.click();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newTheme = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        results.widgets.themeToggle.functional = (initialTheme !== newTheme);
        
        // Check localStorage persistence
        const savedTheme = await page.evaluate(() => localStorage.getItem('theme'));
        results.widgets.themeToggle.persistsState = (savedTheme !== null);
      }
    } catch (error) {
      results.javascript.errors.push(`Theme toggle test failed: ${error.message}`);
    }
  }

  async testDevThemeSwitcher(page, results) {
    try {
      // Look for dev theme switcher (only in development)
      const devSwitcher = await page.$('.fixed.z-\\[100\\].bottom-4.left-16 button, [title*="Theme switcher"]');
      
      if (devSwitcher) {
        results.widgets.devThemeSwitcher.present = true;
        console.log(`     🔧 Found dev theme switcher`);
        
        // Test Alt+T keyboard shortcut
        await page.keyboard.down('Alt');
        await page.keyboard.press('KeyT');
        await page.keyboard.up('Alt');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if switcher panel opened
        const switcherPanel = await page.$('.glass.p-4.rounded-2xl');
        results.widgets.devThemeSwitcher.functional = (switcherPanel !== null);
      }
    } catch (error) {
      results.javascript.errors.push(`Dev theme switcher test failed: ${error.message}`);
    }
  }

  async testModeAwareContent(page, results) {
    try {
      // Look for mode-aware content elements
      const modeContent = await page.$('[data-testid*="mode-"], .mode-swap, [class*="mode-"]');
      
      if (modeContent) {
        results.widgets.modeAwareContent.present = true;
        console.log(`     📝 Found mode-aware content`);
        
        // If experience toggle is present, test content changes
        if (results.widgets.experienceToggle.present) {
          const initialContent = await page.$eval('h1, .hero h1', el => el.textContent).catch(() => '');
          
          // Click experience toggle and check for content change
          const toggleButton = await page.$('[role="group"][aria-label="Experience mode"] button:nth-child(2)');
          if (toggleButton) {
            await toggleButton.click();
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newContent = await page.$eval('h1, .hero h1', el => el.textContent).catch(() => '');
            results.widgets.modeAwareContent.changesOnToggle = (initialContent !== newContent);
          }
        }
      }
    } catch (error) {
      results.javascript.errors.push(`Mode-aware content test failed: ${error.message}`);
    }
  }

  async testApiCalls(page, results) {
    try {
      // Test common API endpoints
      const apiEndpoints = ['/health', '/market', '/pools', '/token/summary'];
      
      for (const endpoint of apiEndpoints) {
        const fullUrl = `${this.config.baseUrl}${this.config.apiBase}${endpoint}`;
        
        const response = await page.evaluate(async (url) => {
          try {
            const res = await fetch(url);
            return { ok: res.ok, status: res.status, url };
          } catch (error) {
            return { ok: false, status: 0, error: error.message, url };
          }
        }, fullUrl);
        
        if (response.ok) {
          results.api.internalCalls.working.push(response);
        } else {
          results.api.internalCalls.failed.push(response);
        }
      }
    } catch (error) {
      results.javascript.errors.push(`API calls test failed: ${error.message}`);
    }
  }

  async testThirdPartyApis(page, results) {
    try {
      // Test that page can reach third-party APIs (Dexscreener, etc.)
      const thirdPartyTest = await page.evaluate(async () => {
        try {
          // Test a simple third-party API call that our app might make
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/arbitrum', {
            signal: controller.signal,
            headers: { 'ngrok-skip-browser-warning': 'true' }
          });
          
          clearTimeout(timeoutId);
          return response.ok;
        } catch {
          return false;
        }
      });
      
      results.api.thirdPartyReachable = thirdPartyTest;
      
    } catch (error) {
      results.javascript.errors.push(`Third-party API test failed: ${error.message}`);
    }
  }
}

async function runClientWidgetTests() {
  console.log('🧪 MXTK CLIENT WIDGETS TEST SUITE');
  console.log('==================================\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--no-first-run'
    ]
  });

  const allResults = [];

  try {
    for (const config of CONFIG.testConfigs) {
      console.log(`\n🔧 Testing ${config.name} Configuration`);
      console.log(`   Base URL: ${config.baseUrl}`);
      console.log(`   API Base: ${config.apiBase}`);
      
      const tester = new ClientWidgetTester(config);
      
      for (const pagePath of config.testPages) {
        await tester.testPage(browser, pagePath);
      }
      
      allResults.push(tester.results);
    }

    // Generate comprehensive report
    console.log('\n📊 COMPREHENSIVE TEST RESULTS');
    console.log('==============================\n');
    
    allResults.forEach(result => {
      console.log(`🔧 ${result.configuration} Configuration:`);
      console.log(`   ✅ Passed: ${result.summary.passed}`);
      console.log(`   ❌ Failed: ${result.summary.failed}`);
      
      if (result.summary.errors.length > 0) {
        console.log(`   🚨 Errors:`);
        result.summary.errors.forEach(error => console.log(`      - ${error}`));
      }
      console.log('');
    });

    // Save detailed results
    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = `tools/debug/output/reports/client-widgets-test-${timestamp}.json`;
    
    require('fs').writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      results: allResults,
      summary: {
        totalConfigs: allResults.length,
        totalPages: allResults.reduce((sum, r) => sum + Object.keys(r.tests).length, 0),
        totalPassed: allResults.reduce((sum, r) => sum + r.summary.passed, 0),
        totalFailed: allResults.reduce((sum, r) => sum + r.summary.failed, 0)
      }
    }, null, 2));
    
    console.log(`📄 Detailed report saved: ${reportPath}`);

  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  runClientWidgetTests().catch(console.error);
}

module.exports = { runClientWidgetTests, ClientWidgetTester };
