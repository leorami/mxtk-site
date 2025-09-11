import puppeteer from 'puppeteer';

const BASE = process.env.BASE_URL || 'http://localhost:2000';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 900 });
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle2', timeout: 45000 });

    // pick first widget tile
    await page.waitForSelector('.widget-tile', { timeout: 12000 });
    const before = await page.evaluate(() => {
      const el = document.querySelector('.widget-tile');
      const cs = el ? getComputedStyle(el) : null;
      return cs ? { gridColumn: cs.gridColumn, gridRow: cs.gridRow } : null;
    });

    // drag by 2 columns to the right
    const tile = await page.$('.widget-tile .widget-chrome');
    const box = await tile.boundingBox();
    const startX = Math.floor(box.x + box.width / 2);
    const startY = Math.floor(box.y + 20);
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 200, startY, { steps: 8 });
    await page.mouse.up();

    // allow debounce to patch and re-render
    await new Promise(r => setTimeout(r, 1200));

    const after = await page.evaluate(() => {
      const el = document.querySelector('.widget-tile');
      const cs = el ? getComputedStyle(el) : null;
      return cs ? { gridColumn: cs.gridColumn, gridRow: cs.gridRow } : null;
    });

    // Reload to verify persistence
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 400));
    const persisted = await page.evaluate(() => {
      const el = document.querySelector('.widget-tile');
      const cs = el ? getComputedStyle(el) : null;
      return cs ? { gridColumn: cs.gridColumn, gridRow: cs.gridRow } : null;
    });

    console.log(JSON.stringify({ before, after, persisted }));
  } finally {
    await browser.close();
  }
})();


