import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL || 'http://localhost:2000';

async function dragAndDrop(page, sourceSelector, targetSelector) {
  const source = await page.waitForSelector(sourceSelector);
  const target = await page.waitForSelector(targetSelector);
  const sbox = await source.boundingBox();
  const tbox = await target.boundingBox();
  if (!sbox || !tbox) throw new Error('Missing boxes');
  await page.mouse.move(sbox.x + sbox.width / 2, sbox.y + sbox.height / 2);
  await page.mouse.down();
  await page.mouse.move(tbox.x + tbox.width / 2, tbox.y + tbox.height / 2, { steps: 12 });
  await new Promise(r => setTimeout(r, 50));
  await page.mouse.up();
}

async function run() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') console.error('Console error:', msg.text());
  });

  page.setDefaultNavigationTimeout(60000);
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('.section-rail > section#overview');

  // initial order capture (from API for reliability)
  const orderBefore = await page.evaluate(async (base) => {
    const r = await fetch(`${base.replace(/\/$/, '')}/api/ai/home/default`, { cache: 'no-store' });
    const j = await r.json();
    const secs = Array.isArray(j.sections) ? j.sections : [];
    return secs.sort((a,b)=> (a.order??0)-(b.order??0)).map(s=>s.id);
  }, BASE_URL);

  // Try click fallback: click moves down; Shift+click moves up
  const handle = await page.waitForSelector('section#overview .wf-head button[aria-label^="Reorder"]', { timeout: 10000 });
  await handle.click();
  await new Promise(r => setTimeout(r, 800));

  // verify persisted order changed via API
  const orderAfter = await page.evaluate(async (base) => {
    const r = await fetch(`${base.replace(/\/$/, '')}/api/ai/home/default`, { cache: 'no-store' });
    const j = await r.json();
    const secs = Array.isArray(j.sections) ? j.sections : [];
    return secs.sort((a,b)=> (a.order??0)-(b.order??0)).map(s=>s.id);
  }, BASE_URL);
  if (orderBefore.join(',') === orderAfter.join(',')) {
    throw new Error('Section order did not change after drag');
  }

  // trigger Undo
  const undoBtn = await page.$('text/Undo');
  if (undoBtn) {
    await undoBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }

  const orderRestored = await page.evaluate(async (base) => {
    const r = await fetch(`${base.replace(/\/$/, '')}/api/ai/home/default`, { cache: 'no-store' });
    const j = await r.json();
    const secs = Array.isArray(j.sections) ? j.sections : [];
    return secs.sort((a,b)=> (a.order??0)-(b.order??0)).map(s=>s.id);
  }, BASE_URL);
  if (orderBefore.join(',') !== orderRestored.join(',')) {
    throw new Error(`Undo did not restore order. before=${orderBefore} after=${orderRestored}`);
  }

  // Ensure Guide drawer width does not cause horizontal scroll when open
  await page.evaluate(() => document.documentElement.classList.add('guide-open'));
  const hasHScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (hasHScroll) throw new Error('Horizontal scroll detected with Guide open');

  await browser.close();
  console.log('dashboard-sections: OK');
}

run().catch(err => { console.error(err); process.exit(1); });


