const base = process.env.BASE_URL || 'http://localhost:2000';
import fs from 'node:fs/promises';

export async function run() {
  await fs.mkdir('.tmp/mxtk', { recursive: true });
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ authorization: 'Bearer ' + (process.env.ADMIN_TOKEN || 'dev') });
  page.on('console', (m) => {
    const t = m.type();
    if (t === 'error' || t === 'warning') {
      throw new Error('Console ' + t + ': ' + m.text());
    }
  });
  await page.goto(base + '/admin/flags', { waitUntil: 'networkidle0' });
  const out = '.tmp/mxtk/w6-flags.png';
  await page.screenshot({ path: out, fullPage: true });
  await fs.stat(out);
  await browser.close();
}

if (import.meta.main) {
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}


