import puppeteer from 'puppeteer';

const base = process.env.BASE_URL || 'http://localhost:2000';

async function run(){
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(base + '/home', { waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-testid="home-grid"]');
  // Tab to first widget frame and focus icon buttons
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  // Trigger Info
  await page.keyboard.press('Enter');
  await browser.close();
}

run().catch(err => { console.error(err); process.exit(1); });


