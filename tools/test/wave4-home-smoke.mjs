const base = process.env.BASE_URL || 'http://localhost:2000';
export async function run(){
  const fs = await import('node:fs/promises');
  const puppeteer = await import('puppeteer');
  await fs.mkdir('.tmp/mxtk', { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  page.on('console', m=>{ const t=m.type(); if(t==='error'||t==='warning'){ throw new Error('Console '+t+': '+m.text()); } });
  console.log('[wave4] goto home');
  await page.goto(base+'/', { waitUntil:'networkidle0' });
  // Open via footer chat to avoid dependency on CTA
  console.log('[wave4] open via footer chat');
  await page.type('footer input[placeholder="Ask the Sherpa..."]', 'What is MXTK?');
  await page.keyboard.press('Enter');
  console.log('[wave4] wait drawer open');
  await page.waitForSelector('[aria-label="Sherpa Drawer"]', { timeout: 8000 });
  // No more input field to wait for - drawer should be open and functional
  console.log('[wave4] screenshot');
  const out = '.tmp/mxtk/w4-home.png';
  await page.screenshot({ path: out, fullPage:true });
  try {
    const st = await fs.stat(out);
    console.log('[wave4] screenshot saved', out, st.size);
  } catch (e) {
    console.error('[wave4] screenshot missing', out, e);
    throw e;
  }
  await browser.close();
}
// Always run when invoked via node
run().catch(e=>{ console.error('[wave4] FAIL', e); process.exit(1); });


