// Wave 3 focused test
import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL || 'http://localhost:2000';

async function runWave3(page, base) {
  console.log('Running Wave 3 tests...');
  
  page.on('console', msg => { 
    const t = msg.type(); 
    if(t === 'error' || t === 'warning') { 
      throw new Error('Console '+t+': '+msg.text()); 
    } 
  });
  
  // Desktop
  console.log('Testing desktop view...');
  await page.setViewport({ width: 1366, height: 900, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: 'networkidle0' });
  
  // Click AI button in experience controls
  console.log('Clicking AI button...');
  const aiButton = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button[aria-pressed]'));
    const aiButton = buttons.find(btn => btn.textContent?.trim() === 'AI');
    if (aiButton) {
      aiButton.click();
      return true;
    }
    return false;
  });
  
  if (!aiButton) throw new Error('Could not find or click AI button');
  
  // Wait for AI panel to open
  console.log('Waiting for AI panel...');
  const inputSel = 'input[placeholder^="Ask about MXTK"],textarea';
  await page.waitForSelector(inputSel);
  
  // Type a question that should trigger auto-append
  console.log('Typing question...');
  await page.type(inputSel, 'explain validator incentives');
  await page.keyboard.press('Enter');
  
  // Wait for response
  console.log('Waiting for response...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Find Journey link and click
  console.log('Looking for Journey link...');
  const link = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'));
    const journeyLink = links.find(a => 
      a.textContent?.toLowerCase().includes('journey') || 
      a.href?.toLowerCase().includes('journey')
    );
    if (journeyLink) {
      journeyLink.click();
      return true;
    }
    return false;
  });
  
  if (!link) throw new Error('Journey link not found');
  
  // Wait for navigation and check footnotes
  console.log('Waiting for navigation...');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await page.waitForSelector('aside h3');
  
  console.log('Taking desktop screenshot...');
  await page.screenshot({ path: '.tmp/mxtk/w3-journey-desktop.png', fullPage: true });
  
  // iPad
  console.log('Testing iPad view...');
  await page.setViewport({ width: 820, height: 1180, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: 'networkidle0' });
  
  // Click AI button in experience controls
  console.log('Clicking AI button on iPad...');
  const aiButtonIpad = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button[aria-pressed]'));
    const aiButton = buttons.find(btn => btn.textContent?.trim() === 'AI');
    if (aiButton) {
      aiButton.click();
      return true;
    }
    return false;
  });
  
  if (!aiButtonIpad) throw new Error('Could not find or click AI button on iPad');
  
  // Wait for AI panel to open
  console.log('Waiting for AI panel on iPad...');
  await page.waitForSelector(inputSel);
  
  console.log('Taking iPad screenshot...');
  await page.screenshot({ path: '.tmp/mxtk/w3-journey-ipad.png', fullPage: true });
  
  console.log('✅ Wave 3 tests completed successfully!');
}

// Main execution
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();

try {
  await runWave3(page, BASE_URL);
} catch (error) {
  console.error('❌ Wave 3 test failed:', error.message);
  process.exit(1);
} finally {
  await browser.close();
}
