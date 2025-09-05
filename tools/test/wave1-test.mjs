// Wave 1 specific test - Guide page and AI button verification
import fs from 'node:fs';
import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL || 'http://localhost:2000';

async function testGuide(page, base) {
  console.log(`Testing guide page: ${base}/guide`);
  
  // Capture console errors
  const consoleErrors = [];
  page.on('console', msg => { 
    const t = msg.type(); 
    if(t === 'error' || t === 'warning') { 
      consoleErrors.push(`Console ${t}: ${msg.text()}`);
    } 
  });

  await page.goto(`${base}/guide`, { waitUntil: 'networkidle0', timeout: 30000 });
  
  // Look for the Sherpa button
  const btn = await page.$('button[aria-label="Open Sherpa"]');
  if(!btn) {
    // Try alternative selector for the guide button
    const altBtn = await page.$('button.fixed.bottom-6.right-6');
    if (!altBtn) {
      throw new Error('Guide launcher button not found on /guide page');
    }
    console.log('✅ Found guide button (alternative selector)');
  } else {
    console.log('✅ Found Sherpa button with aria-label');
  }
  
  // Get computed styles from any button we found
  const targetBtn = btn || await page.$('button.fixed.bottom-6.right-6');
  const styles = await page.evaluate(el => {
    const s = getComputedStyle(el); 
    return { position: s.position, zIndex: s.zIndex, borderRadius: s.borderRadius };
  }, targetBtn);
  
  // Ensure temp directory exists
  fs.mkdirSync('.tmp/mxtk', { recursive: true });
  fs.writeFileSync('.tmp/mxtk/guide-launcher-styles.json', JSON.stringify(styles, null, 2));
  console.log('✅ Captured guide button styles');
  
  // Take screenshot
  await page.screenshot({ path: '.tmp/mxtk/guide-page.png', fullPage: true });
  console.log('✅ Captured guide page screenshot');
  
  if (consoleErrors.length > 0) {
    console.warn(`Guide page had ${consoleErrors.length} console issues:`, consoleErrors);
    // Don't fail on console errors for now, just warn
  }
}

async function testHome(page, base) {
  console.log(`Testing home page: ${base}`);
  
  await page.goto(base, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.screenshot({ path: '.tmp/mxtk/home.png', fullPage: true });
  console.log('✅ Captured home page screenshot');
}

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox','--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    
    console.log('Running MXTK Wave1 tests...');
    await testGuide(page, BASE_URL);
    await testHome(page, BASE_URL);
    console.log('✅ MXTK Wave1 tests passed');
    
    await page.close();
  } catch (err) {
    console.error('❌ Wave1 tests failed:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
