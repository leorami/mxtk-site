import fs from 'node:fs/promises';
import puppeteer from 'puppeteer';

const base = process.env.BASE_URL || 'http://localhost:2000';

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function run(){
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const logs = [];
  page.on('console', m => { const t=m.type(); if (t==='error'||t==='warning') logs.push({ t, msg: m.text() }); });

  // Desktop
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(base + '/', { waitUntil: 'networkidle0' });
  const before = await page.evaluate(() => {
    const el = document.querySelector('[data-shiftable-root]');
    const pr = el ? parseFloat(getComputedStyle(el).paddingRight || '0') : 0;
    return { pr, flag: document.documentElement.classList.contains('guide-open') };
  });
  if (before.flag) throw new Error('Drawer should be closed initially');
  if (before.pr > 1) throw new Error('Padding-right should be 0 before opening drawer');
  try {
    await page.waitForSelector('[data-testid="sherpa-pill"]', { timeout: 15000 });
    await page.click('[data-testid="sherpa-pill"]');
  } catch (e) {
    // Fallback: dispatch open event
    await page.evaluate(() => {
      try { window.dispatchEvent(new CustomEvent('mxtk:guide:open', { detail: {} })); } catch {}
    });
  }
  await sleep(500);
  await page.type('input[placeholder*="Ask"]', 'Hi');
  await page.click('button[type="submit"]');
  await page.waitForSelector('.conversation [data-role="assistant"]', { timeout: 10000 });

  // Add to Home via API
  await page.evaluate(async () => {
    await fetch('/api/ai/home/add', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ widget: { type: 'getting-started' } }) });
  });

  await page.goto(base + '/home', { waitUntil: 'networkidle0' });
  await page.waitForSelector('[data-testid="home-grid"] [data-widget-id]', { timeout: 8000 });

  // Screenshots
  await fs.mkdir('tools/test/artifacts', { recursive: true });
  await page.screenshot({ path: 'tools/test/artifacts/w9-desktop.png' });

  // iPad
  await page.setViewport({ width: 834, height: 1112, deviceScaleFactor: 1 });
  await page.screenshot({ path: 'tools/test/artifacts/w9-ipad.png' });

  // Mobile
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.screenshot({ path: 'tools/test/artifacts/w9-mobile.png' });

  if (logs.length) throw new Error('Console issues: ' + JSON.stringify(logs));
  await browser.close();
}

run().catch(err => { console.error(err); process.exit(1); });


