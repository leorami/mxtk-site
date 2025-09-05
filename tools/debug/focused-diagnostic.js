#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function runFocusedDiagnostic() {
  console.log('🔍 FOCUSED DIAGNOSTIC TEST');
  console.log('==========================\n');
  
  const browser = await puppeteer.launch({
    headless: 'new', // Always headless
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Capture all console messages
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[${type.toUpperCase()}] ${text}`);
  });

  // Capture network failures
  page.on('requestfailed', request => {
    console.log(`[NETWORK FAIL] ${request.url()} - ${request.failure().errorText}`);
  });

  // Capture responses
  page.on('response', response => {
    const url = response.url();
    const status = response.status();
    if (!response.ok() || url.includes('_next') || url.includes('api/')) {
      console.log(`[RESPONSE] ${status} ${url}`);
    }
  });

  try {
    const target = process.env.DEBUG_URL || 'http://localhost:2000';
    console.log('Loading ' + target + ' ...');
    await page.goto(target, { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    // Wait a short, bounded time for network to settle (Puppeteer Page API uses setTimeout fallback)
    await new Promise(r => setTimeout(r, 1500));

    // Check for critical elements
    const nav = await page.$('header nav');
    const themeToggle = await page.$('[aria-label="Theme"], [aria-label="Toggle theme"]');
    const expToggle = await page.$('[aria-label="Experience mode"]');
    const h1 = await page.$('h1');

    console.log('\n🔍 ELEMENT CHECK:');
    console.log(`Navigation: ${nav ? '✅ Found' : '❌ Missing'}`);
    console.log(`Theme Toggle: ${themeToggle ? '✅ Found' : '❌ Missing'}`);
    console.log(`Experience Toggle: ${expToggle ? '✅ Found' : '❌ Missing'}`);
    console.log(`H1 Element: ${h1 ? '✅ Found' : '❌ Missing'}`);

    if (h1) {
      const h1Text = await page.evaluate(el => el.textContent || '', h1);
      console.log(`H1 Text: "${h1Text}"`);
    }

    // Test theme toggle functionality
    if (themeToggle) {
      console.log('\n🔍 TESTING THEME TOGGLE:');
      try {
        await themeToggle.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Theme toggle clicked successfully');
      } catch (e) {
        console.log(`Theme toggle click failed: ${e.message}`);
      }
    }

    // Test experience toggle functionality
    if (expToggle) {
      console.log('\n🔍 TESTING EXPERIENCE TOGGLE:');
      try {
        const buttons = await expToggle.$$('button');
        console.log(`Found ${buttons.length} experience buttons`);
        if (buttons.length > 1) {
          await buttons[1].click(); // Click "Build"
          await new Promise(resolve => setTimeout(resolve, 1000));
          console.log('Experience toggle clicked successfully');
          
          // Check if content changed
          if (h1) {
            const newH1Text = await h1.textContent();
            console.log(`New H1 Text: "${newH1Text}"`);
          }
        }
      } catch (e) {
        console.log(`Experience toggle test failed: ${e.message}`);
      }
    }

    // Capture computed styles for critical layout elements
    console.log('\n🔍 COMPUTED STYLES:');
    const dump = await page.evaluate(() => {
      const sels = ['.guide-drawer', '[data-shiftable-root]', '.brand-footer'];
      const fields = ['position','right','left','top','bottom','width','height','marginRight','paddingRight','marginBottom'];
      const out = {};
      for (const sel of sels) {
        const el = document.querySelector(sel);
        if (!el) { out[sel] = { present:false }; continue; }
        const cs = getComputedStyle(el);
        const box = el.getBoundingClientRect();
        const rec = { present:true, rect:{ x:box.x, y:box.y, w:box.width, h:box.height } };
        for (const f of fields) rec[f] = cs[f];
        out[sel] = rec;
      }
      return out;
    });
    console.log(JSON.stringify(dump, null, 2));

    console.log('\nTest completed successfully');

  } catch (error) {
    console.error(`\n❌ CRITICAL ERROR: ${error.message}`);
    console.error(error.stack);
  }

  await new Promise(resolve => setTimeout(resolve, 5000)); // Keep browser open for 5 seconds
  await browser.close();
}

if (require.main === module) {
  runFocusedDiagnostic()
    .then(() => console.log('\nDiagnostic complete'))
    .catch(err => {
      console.error('Diagnostic failed:', err);
      process.exit(1);
    });
}

module.exports = { runFocusedDiagnostic };
