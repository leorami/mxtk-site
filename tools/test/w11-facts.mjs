import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL || 'http://localhost:2000';
const ADMIN_TOKEN = process.env.MXTK_ADMIN_TOKEN || process.env.ADMIN_TOKEN || process.env.NEXT_PUBLIC_ADMIN_TOKEN;

async function get(path, headers = {}) {
  const res = await fetch(`${BASE_URL}${path}`, { headers, redirect: 'manual' });
  const text = await res.text();
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), body: text };
}

(async () => {
  const artifacts = [];
  // 1) GET /api/ai/facts
  const a = await get('/api/ai/facts');
  if (a.status !== 200) throw new Error(`Expected 200, got ${a.status}`);
  const etagA = a.headers['etag'];
  if (!etagA) throw new Error('Missing ETag A');
  // 2) Conditional GET -> 304
  const b = await get('/api/ai/facts', { 'If-None-Match': etagA });
  if (b.status !== 304) throw new Error(`Expected 304, got ${b.status}`);

  // 3) Visit /facts SSR
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'error' || type === 'warning') {
      console.log('console', type, msg.text());
    }
  });
  await page.goto(`${BASE_URL}/facts`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('[data-testid="facts-view"]');
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.screenshot({ path: 'w11-facts-desktop.png' });
  await page.setViewport({ width: 834, height: 1112, deviceScaleFactor: 1 });
  await page.screenshot({ path: 'w11-facts-ipad.png' });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.screenshot({ path: 'w11-facts-mobile.png' });

  // 4) Optional admin PATCH
  if (ADMIN_TOKEN) {
    const resp = await fetch(`${BASE_URL}/api/admin/session`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: ADMIN_TOKEN })
    });
    if (resp.status !== 200) throw new Error('Admin sign-in failed');
    const patch = await fetch(`${BASE_URL}/api/ai/facts`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: { project: { tagline: 'ETag test' } } })
    });
    if (patch.status !== 200) throw new Error(`PATCH failed ${patch.status}`);
    const c = await get('/api/ai/facts');
    const etagB = c.headers['etag'];
    if (etagA === etagB) throw new Error('ETag did not change after PATCH');
    const cond = await get('/api/ai/facts', { 'If-None-Match': etagA });
    if (cond.status !== 200) throw new Error('Expected 200 after update with old ETag');
  }

  await browser.close();
  console.log('w11-facts ok');
})().catch((e) => {
  console.error('w11-facts failed', e);
  process.exit(1);
});
