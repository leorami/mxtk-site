#!/usr/bin/env node

// Debug MarketChart specifically
const puppeteer = require('puppeteer');

const NGROK_BASE = 'https://ramileo.ngrok.app';

async function debugMarketChart() {
  console.log('🔍 DEBUGGING MARKETCHART');
  console.log('========================');
  
  let browser;
  const consoleMessages = [];
  const errors = [];
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Capture ALL console messages
    page.on('console', msg => {
      const text = msg.text();
      const type = msg.type();
      consoleMessages.push({ type, text, timestamp: new Date().toISOString() });
      
      if (text.includes('MarketChart')) {
        console.log(`[${type.toUpperCase()}] ${text}`);
      }
      
      if (type === 'error') {
        errors.push(text);
      }
    });
    
    // Capture page errors
    page.on('pageerror', error => {
      const errorText = error.toString();
      errors.push(`Page Error: ${errorText}`);
      console.log(`💥 Page Error: ${errorText}`);
    });
    
    console.log(`\n📄 Loading: ${NGROK_BASE}/mxtk/institutions`);
    
    // Navigate to institutions page
    await page.goto(`${NGROK_BASE}/mxtk/institutions`, { 
      waitUntil: 'networkidle0', 
      timeout: 20000 
    });
    
    console.log('✅ Page loaded, waiting for component hydration...');
    
    // Wait for potential hydration and API calls
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if MarketChart has rendered with data
    const marketChartStatus = await page.evaluate(() => {
      // Look for the MarketChart component
      const sections = Array.from(document.querySelectorAll('section'));
      const marketDataSection = sections.find(section => 
        section.textContent.includes('Professional-grade market data') ||
        section.textContent.includes('Data you can plug into systems')
      );
      
      if (!marketDataSection) {
        return { found: false, reason: 'Market data section not found' };
      }
      
      // Check for loading state vs actual data
      const hasLoadingSpinner = marketDataSection.textContent.includes('Loading') ||
                               marketDataSection.querySelector('.animate-pulse') !== null;
      
      const hasRealData = marketDataSection.textContent.includes('Price:') ||
                         marketDataSection.textContent.includes('$0.85') ||
                         marketDataSection.textContent.includes('Market Cap:');
      
      return {
        found: true,
        hasLoadingSpinner,
        hasRealData,
        sectionText: marketDataSection.textContent.substring(0, 200),
        htmlContent: marketDataSection.innerHTML.substring(0, 500)
      };
    });
    
    console.log('\n🔍 MarketChart Status:');
    console.log(JSON.stringify(marketChartStatus, null, 2));
    
    // Filter console messages for MarketChart
    const marketChartLogs = consoleMessages.filter(msg => 
      msg.text.includes('MarketChart') || 
      msg.text.includes('market') ||
      msg.text.includes('/api/market') ||
      msg.text.includes('Failed to fetch')
    );
    
    console.log(`\n📝 MarketChart Console Messages (${marketChartLogs.length}):`);
    marketChartLogs.forEach(msg => {
      console.log(`[${msg.type.toUpperCase()}] ${msg.text}`);
    });
    
    if (errors.length > 0) {
      console.log('\n🚨 JavaScript Errors Detected:');
      errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('\n✅ No JavaScript errors detected');
    }
    
    // Test API directly from the browser context
    console.log('\n🔌 Testing API call from browser context...');
    const apiTestResult = await page.evaluate(async () => {
      try {
        // Try the same logic as MarketChart
        const detectPrefix = (currentPathname) => {
          if (typeof window !== 'undefined') {
            try {
              const cookie = document.cookie || '';
              const match = cookie.match(/(?:^|;\\s*)bp=([^;]+)/);
              const bp = match ? decodeURIComponent(match[1]) : '';
              if (bp === '/mxtk') return '/mxtk';
            } catch {}
            const wpath = window.location?.pathname || '/';
            const first = wpath.split('/').filter(Boolean)[0]?.toLowerCase();
            if (first === 'mxtk') return '/mxtk';
          }
          return '';
        };
        
        const getApiPath = (path) => {
          let leaf = path.replace(/^\/+/, '');
          if (leaf.startsWith('api/')) leaf = leaf.slice(4);
          const prefix = detectPrefix();
          const cleanJoin = (a, b) => (`${a}/${b}`).replace(/\/{2,}/g, '/');
          return cleanJoin(prefix || '/', `api/${leaf}`);
        };
        
        const apiUrl = getApiPath('market');
        console.log('Browser API URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        return {
          success: true,
          apiUrl,
          status: response.status,
          data: data
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });
    
    console.log('\n🧪 Browser API Test Result:');
    console.log(JSON.stringify(apiTestResult, null, 2));
    
  } catch (error) {
    console.error('💥 Browser test failed:', error);
    return { error: error.message };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  console.log('\n🎯 SUMMARY:');
  console.log(`Console Messages: ${consoleMessages.length}`);
  console.log(`MarketChart Logs: ${consoleMessages.filter(m => m.text.includes('MarketChart')).length}`);
  console.log(`JavaScript Errors: ${errors.length}`);
}

if (require.main === module) {
  debugMarketChart()
    .then(() => process.exit(0))
    .catch(console.error);
}

module.exports = { debugMarketChart };
