#!/usr/bin/env node

const puppeteer = require('puppeteer');

async function runFocusedDiagnostic() {
  console.log('🔍 FOCUSED DIAGNOSTIC TEST');
  console.log('==========================\n');
  
  const browser = await puppeteer.launch({
    headless: false, // Show browser for debugging
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
    console.log('Loading https://ramileo.ngrok.app/mxtk...');
    await page.goto('https://ramileo.ngrok.app/mxtk', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    console.log('Page loaded, waiting for network idle...');
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {
      console.log('Network idle timeout - continuing anyway');
    });

    // Check for critical elements
    const nav = await page.$('header nav');
    const themeToggle = await page.$('[aria-label="Theme"]');
    const expToggle = await page.$('[aria-label="Experience mode"]');
    const h1 = await page.$('h1');

    console.log('\n🔍 ELEMENT CHECK:');
    console.log(`Navigation: ${nav ? '✅ Found' : '❌ Missing'}`);
    console.log(`Theme Toggle: ${themeToggle ? '✅ Found' : '❌ Missing'}`);
    console.log(`Experience Toggle: ${expToggle ? '✅ Found' : '❌ Missing'}`);
    console.log(`H1 Element: ${h1 ? '✅ Found' : '❌ Missing'}`);

    if (h1) {
      const h1Text = await h1.textContent();
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

    console.log('\n🔍 CHECKING CHUNK LOADING:');
    // Check for chunk loading errors in console
    const logs = await page.evaluate(() => {
      return window.console.history || [];
    });

    console.log('Test completed successfully');

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
