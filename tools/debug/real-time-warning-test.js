#!/usr/bin/env node

// Real-time warning tracking during comprehensive test
const puppeteer = require('puppeteer');

const NGROK_BASE = 'https://ramileo.ngrok.app';

const testPages = [
  '/mxtk/transparency',
  '/mxtk/institutions',
  '/mxtk/ecosystem',
  '/mxtk/whitepaper',
  '/mxtk/faq'
];

async function realTimeWarningTest() {
  console.log('🔍 REAL-TIME WARNING TRACKING');
  console.log('==============================');
  
  let browser;
  let totalWarnings = 0;
  const pageWarnings = {};
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    for (const pagePath of testPages) {
      console.log(`\n📄 Testing ${pagePath}:`);
      
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });
      
      let pageWarningCount = 0;
      
      // Track warnings for this page
      page.on('console', msg => {
        const text = msg.text();
        const type = msg.type();
        
        if (type === 'warning' || type === 'warn') {
          pageWarningCount++;
          totalWarnings++;
          console.log(`   ⚠️  [${pageWarningCount}] ${text.substring(0, 80)}...`);
        }
        
        if (type === 'error') {
          console.log(`   💥 ERROR: ${text.substring(0, 80)}...`);
        }
      });
      
      // Track network failures
      page.on('response', response => {
        if (!response.ok() && response.status() !== 304) {
          console.log(`   🔌 Network Failure: ${response.status()} ${response.url()}`);
        }
      });
      
      try {
        await page.goto(`${NGROK_BASE}${pagePath}`, { 
          waitUntil: 'networkidle0', 
          timeout: 15000 
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        pageWarnings[pagePath] = pageWarningCount;
        console.log(`   📊 Page total: ${pageWarningCount} warnings`);
        
      } catch (error) {
        console.log(`   💥 Navigation error: ${error.message}`);
      }
      
      await page.close();
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  console.log('\n📈 SUMMARY:');
  console.log(`Total warnings across all pages: ${totalWarnings}`);
  console.log('\n📄 Warnings per page:');
  Object.entries(pageWarnings).forEach(([page, count]) => {
    console.log(`   ${page}: ${count} warnings`);
  });
  
  const averageWarnings = totalWarnings / testPages.length;
  console.log(`\n📊 Average warnings per page: ${averageWarnings.toFixed(1)}`);
  
  return {
    totalWarnings,
    pageWarnings,
    averageWarnings
  };
}

if (require.main === module) {
  realTimeWarningTest().catch(console.error);
}
