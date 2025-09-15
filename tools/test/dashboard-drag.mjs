import puppeteer from 'puppeteer';

const BASE = process.env.BASE_URL || 'http://localhost:2000';
const ROOT = String(BASE).replace(/\/$/, '');
const DASHBOARD = `${ROOT}/dashboard`;

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 900 });
    await page.goto(DASHBOARD, { waitUntil: 'networkidle2', timeout: 45000 });

    // Wait for tiles to render with retries (up to ~25s)
    const start = Date.now();
    while (Date.now() - start < 25000) {
      const have = await page.evaluate(() => document.querySelectorAll('.widget-tile').length);
      if (have > 0) break;
      await new Promise(r => setTimeout(r, 300));
    }
    // Ensure the controls container exists (visibility is CSS-gated)
    try { await page.waitForSelector('.wframe-controls', { timeout: 8000 }); } catch {}
    // pick first widget tile
    const before = await page.evaluate(() => {
      const tile = document.querySelector('[data-widget-id]')?.closest('.widget-tile') || document.querySelector('.widget-tile');
      const cs = tile ? getComputedStyle(tile) : null;
      const id = tile?.getAttribute('data-widget-id') || null;
      return cs ? { id, gridColumn: cs.gridColumn, gridRow: cs.gridRow } : null;
    });

    // Read server state for that widget id
    async function fetchDoc() {
      const res = await fetch(`${ROOT}/api/ai/home/default`, { headers: { 'ngrok-skip-browser-warning': 'true' } });
      if (!res.ok) throw new Error(`GET home failed: ${res.status}`);
      return res.json();
    }
    const docBefore = await fetchDoc();
    const serverBefore = (docBefore.widgets || []).find(w => w.id === before?.id) || null;

    // Ensure guide is open so drag is enabled
    await page.evaluate(() => { document.documentElement.classList.add('guide-open'); localStorage.setItem('mxtk_guide_open','1'); });
    await new Promise(r => setTimeout(r, 250));
    // drag by 2 columns to the right (start from widget header handle)
    try { await page.waitForSelector('.widget-tile .wf-head, .wframe .wf-head, header.wf-head', { timeout: 8000 }); } catch {}
    // Prefer the full drag surface (widget-chrome) which is the actual handle
    try { await page.waitForSelector('.widget-tile .widget-chrome', { timeout: 8000 }); } catch {}
    let dragSurface = await page.$('.widget-tile .widget-chrome');
    if (!dragSurface) {
      // Fallback: click to focus a tile and try again
      const firstTile = await page.$('.widget-tile');
      if (firstTile) { await firstTile.click({ delay: 10 }); await new Promise(r=>setTimeout(r,200)); }
      try { await page.waitForSelector('.widget-tile .widget-chrome', { timeout: 4000 }); } catch {}
      const again = await page.$('.widget-tile .widget-chrome');
      if (!again) { console.error('Drag test failed: no widget drag surface found'); process.exit(1); }
      dragSurface = again;
    }
    const hb = await dragSurface.boundingBox();
    const startX = Math.floor(hb.x + Math.min(80, hb.width - 10));
    const startY = Math.floor(hb.y + Math.min(20, hb.height - 10));
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 200, startY, { steps: 8 });
    await page.mouse.up();

    // allow debounce to patch and re-render
    await new Promise(r => setTimeout(r, 1200));

    const after = await page.evaluate(() => {
      const tile = document.querySelector('[data-widget-id]')?.closest('.widget-tile') || document.querySelector('.widget-tile');
      const cs = tile ? getComputedStyle(tile) : null;
      const id = tile?.getAttribute('data-widget-id') || null;
      return cs ? { id, gridColumn: cs.gridColumn, gridRow: cs.gridRow } : null;
    });

    // Click an action button to ensure clickability and stopPropagation
    {
      const actionBtn = await page.$('.wframe-controls .iconbtn');
      if (!actionBtn) { console.error('Drag test failed: no action button found'); process.exit(1); }
      await actionBtn.click({ delay: 10 });
    }

    // Try resizing using the bottom-right handle
    {
      // Ensure guide is open before locating resize handle
      await page.evaluate(() => { document.documentElement.classList.add('guide-open'); localStorage.setItem('mxtk_guide_open','1'); });
      await new Promise(r => setTimeout(r, 150));
      const handle = await page.$('.wframe-resize.br');
      if (!handle) { console.error('Drag test failed: no resize handle found'); process.exit(1); }
      const hb2 = await handle.boundingBox();
      const hx = Math.floor(hb2.x + hb2.width / 2);
      const hy = Math.floor(hb2.y + hb2.height / 2);
      await page.mouse.move(hx, hy);
      await page.mouse.down();
      await page.mouse.move(hx + 60, hy + 40, { steps: 6 });
      await page.mouse.up();
      await new Promise(r => setTimeout(r, 600));
    }

    // Reload to verify persistence
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 400));
    const persisted = await page.evaluate(() => {
      const tile = document.querySelector('[data-widget-id]')?.closest('.widget-tile') || document.querySelector('.widget-tile');
      const cs = tile ? getComputedStyle(tile) : null;
      const id = tile?.getAttribute('data-widget-id') || null;
      return cs ? { id, gridColumn: cs.gridColumn, gridRow: cs.gridRow } : null;
    });

    // Validate server persistence of the same widget id
    const docAfter = await fetchDoc();
    const serverAfter = (docAfter.widgets || []).find(w => w.id === (persisted?.id || before?.id)) || null;
    const moved = !!(serverBefore && serverAfter && (serverBefore.pos?.x !== serverAfter.pos?.x || serverBefore.pos?.y !== serverAfter.pos?.y));
    const resized = !!(serverBefore && serverAfter && (serverBefore.size?.w !== serverAfter.size?.w || serverBefore.size?.h !== serverAfter.size?.h));

    // Switch to mobile and verify no overlaps (retry while grid settles)
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    let overlaps = true;
    const startMobileCheck = Date.now();
    while (Date.now() - startMobileCheck < 8000) {
      overlaps = await page.evaluate(() => {
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
      if (!overlaps) break;
      await new Promise(r => setTimeout(r, 250));
    }

    if (overlaps) { console.error('Drag test failed: mobile overlap detected'); process.exit(1); }
    console.log(JSON.stringify({ before, after, persisted, mobileOverlap: overlaps, moved, resized }));
  } finally {
    await browser.close();
  }
})();


