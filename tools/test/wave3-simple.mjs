// Simple Wave 3 test - basic functionality verification
import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL || 'http://localhost:2000';

async function runSimpleWave3(page, base) {
  console.log('Running simple Wave 3 tests...');
  
  page.on('console', msg => { 
    const t = msg.type(); 
    if(t === 'error' || t === 'warning') { 
      console.log('Console ' + t + ': ' + msg.text());
    } 
  });
  
  // Desktop
  console.log('Testing desktop view...');
  await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: 'networkidle0' });
  
  // Verify AI button exists in experience controls
  console.log('Checking for AI button in experience controls...');
  const aiButtonExists = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button[aria-pressed]'));
    return buttons.some(btn => btn.textContent?.trim() === 'AI');
  });
  
  if (!aiButtonExists) {
    throw new Error('AI button not found in experience controls');
  }
  console.log('✅ AI button found in experience controls');
  
  // Click AI button
  console.log('Clicking AI button...');
  const aiButtonClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button[aria-pressed]'));
    const aiButton = buttons.find(btn => btn.textContent?.trim() === 'AI');
    if (aiButton) {
      aiButton.click();
      return true;
    }
    return false;
  });
  
  if (!aiButtonClicked) {
    throw new Error('Could not click AI button');
  }
  console.log('✅ AI button clicked');
  
  // Wait for AI panel to open
  console.log('Waiting for AI panel...');
  const inputSel = 'input[placeholder^="Ask about MXTK"],textarea';
  await page.waitForSelector(inputSel, { timeout: 10000 });
  console.log('✅ AI panel opened');
  
  // Take screenshot of AI panel
  console.log('Taking AI panel screenshot...');
  await page.screenshot({ path: '.tmp/mxtk/w3-ai-panel-desktop.png', fullPage: true });
  
  // iPad
  console.log('Testing iPad view...');
  await page.setViewport({ width: 820, height: 1180, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: 'networkidle0' });
  
  // Verify AI button exists on iPad
  const aiButtonExistsIpad = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button[aria-pressed]'));
    return buttons.some(btn => btn.textContent?.trim() === 'AI');
  });
  
  if (!aiButtonExistsIpad) {
    throw new Error('AI button not found in experience controls on iPad');
  }
  console.log('✅ AI button found on iPad');
  
  // Click AI button on iPad
  const aiButtonClickedIpad = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button[aria-pressed]'));
    const aiButton = buttons.find(btn => btn.textContent?.trim() === 'AI');
    if (aiButton) {
      aiButton.click();
      return true;
    }
    return false;
  });
  
  if (!aiButtonClickedIpad) {
    throw new Error('Could not click AI button on iPad');
  }
  console.log('✅ AI button clicked on iPad');
  
  // Wait for AI panel to open on iPad
  await page.waitForSelector(inputSel, { timeout: 10000 });
  console.log('✅ AI panel opened on iPad');
  
  // Take screenshot of iPad AI panel
  console.log('Taking iPad AI panel screenshot...');
  await page.screenshot({ path: '.tmp/mxtk/w3-ai-panel-ipad.png', fullPage: true });
  
  console.log('✅ Simple Wave 3 tests completed successfully!');
}

// Main execution
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();

try {
  await runSimpleWave3(page, BASE_URL);
} catch (error) {
  console.error('❌ Simple Wave 3 test failed:', error.message);
  process.exit(1);
} finally {
  await browser.close();
}
