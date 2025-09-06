const base=process.env.BASE_URL||'http://localhost:2000';
(async()=>{
  const puppeteer=await import('puppeteer');
  const browser=await puppeteer.launch({ headless:'new' });
  const page=await browser.newPage();
  page.on('console',m=>{const t=m.type(); if(t==='error'||t==='warning'){ throw new Error('Console '+t+': '+m.text()); }});
  await page.goto(base+'/',{waitUntil:'networkidle0'});
  const before=await page.evaluate(()=>({ pr: parseFloat(getComputedStyle(document.querySelector('[data-shiftable-root]')).paddingRight), flag: document.documentElement.getAttribute('data-guide-open') }));
  if(before.flag!==null) throw new Error('data-guide-open should be null on first paint');
  if(before.pr>1) throw new Error('Padding-right should be 0 before opening drawer, got '+before.pr);
  await page.waitForSelector('[data-testid="sherpa-pill"]', { timeout: 8000 });
  await page.$eval('[data-testid="sherpa-pill"]', (el)=> (el instanceof HTMLElement) && el.click());
  // Wait until drawer is marked open and attribute is set
  await page.waitForFunction(()=>document.documentElement.getAttribute('data-guide-open')==='true', { timeout: 5000 });
  await page.waitForSelector('aside[role="complementary"][data-open="true"]', { timeout: 8000 });
  // Allow a brief paint cycle for :has() recalculation
  await new Promise(r=>setTimeout(r,150));
  const after=await page.evaluate(()=>({ pr: parseFloat(getComputedStyle(document.querySelector('[data-shiftable-root]')).paddingRight), flag: document.documentElement.getAttribute('data-guide-open') }));
  if(after.flag!=='true') throw new Error('data-guide-open should be true after open');
  if(after.pr<=1) throw new Error('Padding-right should increase after open');
  await page.screenshot({path:'.tmp/mxtk/w8.1-first-visit.png', fullPage:true});
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });


