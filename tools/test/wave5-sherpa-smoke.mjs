const base = process.env.BASE_URL || 'http://localhost:2000';
export async function run(){
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', m=>{ const t=m.type(); if(t==='error'||t==='warning'){ throw new Error('Console '+t+': '+m.text()); } });
  await page.goto(base+'/', { waitUntil:'networkidle0' });
  await page.waitForSelector('[data-testid="sherpa-toggle"]', { timeout: 8000 });
  await page.click('[data-testid="sherpa-toggle"]');
  await page.type('[data-testid="sherpa-input"]', 'What is MXTK?');
  await page.keyboard.press('Enter');
  await page.waitForSelector('[aria-label="Sherpa Drawer"] [data-testid="guide-input"]', { timeout: 8000 });
  await browser.close();
}
if (import.meta.main){ run().catch(e=>{ console.error(e); process.exit(1); }); }


