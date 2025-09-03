#!/usr/bin/env node

// Quick test of current status
const puppeteer = require('puppeteer');

const NGROK_BASE = 'https://ramileo.ngrok.app';

async function quickTest() {
  console.log('🚀 QUICK STATUS TEST');
  console.log('===================');
  
  let browser;
  const errors = [];
  const warnings = [];
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Capture console messages
    page.on('console', msg => {
      const text = msg.text();
      const type = msg.type();
      
      if (type === 'error') {
        errors.push(text);
      } else if (type === 'warning' || type === 'warn') {
        warnings.push(text);
      }
    });
    
    console.log('📄 Testing institutions page...');
    await page.goto(`${NGROK_BASE}/mxtk/institutions`, { 
      waitUntil: 'networkidle0', 
      timeout: 15000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check MarketChart
    const marketChartCheck = await page.evaluate(() => {
      return {
        hasMarketDataText: document.body.textContent.includes('Professional-grade market data'),
        hasDataSection: document.body.textContent.includes('Data you can plug into systems'),
        hasEducationalText: document.body.textContent.includes('educational explanations'),
        hasLoadingText: document.body.textContent.includes('Loading…'),
        totalBodyLength: document.body.textContent.length
      };
    });
    
    console.log('\n✅ RESULTS:');
    console.log(`Console Errors: ${errors.length}`);
    console.log(`Console Warnings: ${warnings.length}`);
    console.log('\nMarketChart Status:');
    console.log(`  - Has market data text: ${marketChartCheck.hasMarketDataText}`);
    console.log(`  - Has data section: ${marketChartCheck.hasDataSection}`);
    console.log(`  - Has educational text: ${marketChartCheck.hasEducationalText}`);
    console.log(`  - Has loading text: ${marketChartCheck.hasLoadingText}`);
    
    // Count font warnings specifically
    const fontWarnings = warnings.filter(w => 
      w.includes('preload') && w.includes('woff2')
    );
    
    console.log(`\nFont Warnings: ${fontWarnings.length}`);
    if (fontWarnings.length > 0) {
      console.log('Sample font warning:', fontWarnings[0]);
    }
    
    const isMarketChartWorking = (marketChartCheck.hasMarketDataText || 
                                 marketChartCheck.hasDataSection || 
                                 marketChartCheck.hasEducationalText) &&
                                !marketChartCheck.hasLoadingText;
    
    console.log(`\n🎯 MarketChart Working: ${isMarketChartWorking}`);
    console.log(`🎯 Overall Status: ${errors.length === 0 && fontWarnings.length === 0 ? 'PERFECT' : 'NEEDS WORK'}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

quickTest().catch(console.error);
