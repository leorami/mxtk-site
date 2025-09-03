#!/usr/bin/env node

// Analyze what warnings are being generated
const puppeteer = require('puppeteer');

const NGROK_BASE = 'https://ramileo.ngrok.app';

async function analyzeWarnings() {
  console.log('🔍 ANALYZING CONSOLE WARNINGS');
  console.log('=============================');
  
  let browser;
  const allWarnings = [];
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Capture ALL console messages
    page.on('console', msg => {
      const text = msg.text();
      const type = msg.type();
      
      if (type === 'warning' || type === 'warn') {
        allWarnings.push({
          text,
          timestamp: Date.now()
        });
      }
    });
    
    const testPages = ['/mxtk/ecosystem', '/mxtk/institutions', '/mxtk/transparency', '/mxtk'];
    
    for (const pagePath of testPages) {
      console.log(`📄 Loading ${pagePath}...`);
      
      const warningsBeforePageLoad = allWarnings.length;
      
      await page.goto(`${NGROK_BASE}${pagePath}`, { 
        waitUntil: 'networkidle0', 
        timeout: 15000 
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const warningsAfterPageLoad = allWarnings.length;
      const warningsFromThisPage = warningsAfterPageLoad - warningsBeforePageLoad;
      
      console.log(`   Generated ${warningsFromThisPage} warnings`);
    }
    
    // Categorize warnings
    const warningCategories = {
      font: allWarnings.filter(w => w.text.includes('preload') || w.text.includes('woff')),
      react: allWarnings.filter(w => w.text.includes('React') || w.text.includes('component')),
      dom: allWarnings.filter(w => w.text.includes('DOM') || w.text.includes('element')),
      scroll: allWarnings.filter(w => w.text.includes('scroll') || w.text.includes('sticky') || w.text.includes('fixed')),
      other: allWarnings.filter(w => 
        !w.text.includes('preload') && !w.text.includes('woff') &&
        !w.text.includes('React') && !w.text.includes('component') &&
        !w.text.includes('DOM') && !w.text.includes('element') &&
        !w.text.includes('scroll') && !w.text.includes('sticky') && !w.text.includes('fixed')
      )
    };
    
    console.log(`\n📊 WARNING ANALYSIS (${allWarnings.length} total):`);
    console.log(`Font warnings: ${warningCategories.font.length}`);
    console.log(`React warnings: ${warningCategories.react.length}`);
    console.log(`DOM warnings: ${warningCategories.dom.length}`);
    console.log(`Scroll warnings: ${warningCategories.scroll.length}`);
    console.log(`Other warnings: ${warningCategories.other.length}`);
    
    // Show samples of each category
    Object.entries(warningCategories).forEach(([category, warnings]) => {
      if (warnings.length > 0) {
        console.log(`\n🏷️  ${category.toUpperCase()} WARNING SAMPLES:`);
        warnings.slice(0, 3).forEach((w, i) => {
          console.log(`   ${i+1}. ${w.text.substring(0, 100)}${w.text.length > 100 ? '...' : ''}`);
        });
      }
    });
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
  
  return allWarnings;
}

if (require.main === module) {
  analyzeWarnings().catch(console.error);
}

module.exports = { analyzeWarnings };
