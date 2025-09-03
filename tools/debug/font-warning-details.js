#!/usr/bin/env node

// Get full details of font warnings
const puppeteer = require('puppeteer');

const NGROK_BASE = 'https://ramileo.ngrok.app';

async function getFontWarningDetails() {
  console.log('🔍 FONT WARNING DETAILS');
  console.log('========================');
  
  let browser;
  const fontWarnings = [];
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Capture font warnings only
    page.on('console', msg => {
      const text = msg.text();
      const type = msg.type();
      
      if ((type === 'warning' || type === 'warn') && (text.includes('preload') || text.includes('woff'))) {
        fontWarnings.push({
          text,
          page: 'current'
        });
        
        console.log(`⚠️  FONT WARNING: ${text}`);
      }
    });
    
    console.log('📄 Loading home page...');
    await page.goto(`${NGROK_BASE}/mxtk`, { 
      waitUntil: 'networkidle0', 
      timeout: 15000 
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  console.log(`\n📊 Total Font Warnings: ${fontWarnings.length}`);
  return fontWarnings;
}

if (require.main === module) {
  getFontWarningDetails().catch(console.error);
}
