import puppeteer from 'puppeteer';

const BASE = process.env.BASE_URL || 'http://localhost:2000';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 900 });
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle2', timeout: 45000 });

    // Wait for tiles to render with retries (up to ~25s)
    const start = Date.now();
    while (Date.now() - start < 25000) {
      const have = await page.evaluate(() => document.querySelectorAll('.widget-tile').length);
      if (have > 0) break;
      await new Promise(r => setTimeout(r, 300));
    }
    // pick first widget tile
    const before = await page.evaluate(() => {
      const el = document.querySelector('[data-widget-id]')?.closest('.widget-tile') || document.querySelector('.widget-tile');
      const cs = el ? getComputedStyle(el) : null;
      return cs ? { gridColumn: cs.gridColumn, gridRow: cs.gridRow } : null;
    });

    // Ensure guide is open so drag is enabled
    await page.evaluate(() => { document.documentElement.classList.add('guide-open'); localStorage.setItem('mxtk_guide_open','1'); });
    await new Promise(r => setTimeout(r, 250));
    // drag by 2 columns to the right (start from widget header handle)
    const header = await page.$('.widget-tile .wf-head');
    if (!header) { console.log(JSON.stringify({ skipped: 'no-header-found' })); process.exit(0); }
    const hb = await header.boundingBox();
    const startX = Math.floor(hb.x + Math.min(80, hb.width - 10));
    const startY = Math.floor(hb.y + Math.min(12, hb.height - 6));
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 200, startY, { steps: 8 });
    await page.mouse.up();

    // allow debounce to patch and re-render
    await new Promise(r => setTimeout(r, 1200));

    const after = await page.evaluate(() => {
      const el = document.querySelector('[data-widget-id]')?.closest('.widget-tile') || document.querySelector('.widget-tile');
      const cs = el ? getComputedStyle(el) : null;
      return cs ? { gridColumn: cs.gridColumn, gridRow: cs.gridRow } : null;
    });

    // Click an action button to ensure clickability and stopPropagation
    try {
      const actionBtn = await page.$('.wframe-controls .iconbtn');
      if (actionBtn) { await actionBtn.click({ delay: 10 }); }
    } catch {}

    // Try resizing using the bottom-right handle
    try {
      const handle = await page.$('.wframe-resize.br');
      if (handle) {
        const hb = await handle.boundingBox();
        const hx = Math.floor(hb.x + hb.width / 2);
        const hy = Math.floor(hb.y + hb.height / 2);
        await page.mouse.move(hx, hy);
        await page.mouse.down();
        await page.mouse.move(hx + 60, hy + 40, { steps: 6 });
        await page.mouse.up();
        await new Promise(r => setTimeout(r, 600));
      }
    } catch {}

    // Reload to verify persistence
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 400));
    const persisted = await page.evaluate(() => {
      const el = document.querySelector('[data-widget-id]')?.closest('.widget-tile') || document.querySelector('.widget-tile');
      const cs = el ? getComputedStyle(el) : null;
      return cs ? { gridColumn: cs.gridColumn, gridRow: cs.gridRow } : null;
    });

    // Switch to mobile and verify no overlaps
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await new Promise(r => setTimeout(r, 500));
    const overlaps = await page.evaluate(() => {
      const tiles = Array.from(document.querySelectorAll('.widget-tile'));
      function rect(el){ const r = el.getBoundingClientRect(); return {x:r.left,y:r.top,w:r.width,h:r.height}; }
      function over(a,b){ return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y); }
      for(let i=0;i<tiles.length;i++){
        for(let j=i+1;j<tiles.length;j++){
          if (over(rect(tiles[i]), rect(tiles[j]))) return true;
        }
      }
      return false;
    });

    console.log(JSON.stringify({ before, after, persisted, mobileOverlap: overlaps }));
  } finally {
    await browser.close();
  }
})();


