const base = process.env.BASE_URL || 'http://localhost:2000';
export async function run() {
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
  await page.goto(base + '/admin/costs', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: '.tmp/mxtk/w7-costs.png', fullPage: true });
  await browser.close();
}
if (import.meta.main) {
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}


