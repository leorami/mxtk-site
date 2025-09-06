const base = process.env.BASE_URL || 'http://localhost:2000'
export async function run(){
  const puppeteer = await import('puppeteer')
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  page.on('console', m=>{ const t=m.type(); if(t==='error'||t==='warning'){ throw new Error('Console '+t+': '+m.text()); } })
  await page.goto(base+'/', { waitUntil:'networkidle0' })
  await page.click('[data-testid="sherpa-pill"]')
  await page.waitForSelector('aside[role="complementary"] [data-testid="guide-input"]', { timeout: 8000 })
  const flag = await page.evaluate(()=>document.documentElement.getAttribute('data-guide-open'))
  if(!flag) throw new Error('data-guide-open not set')
  // type + send
  await page.type('[data-testid="guide-input"]', 'Quick sanity check')
  await page.keyboard.press('Enter')
  // optional: click first suggestion if present; must not close drawer
  const chip = await page.$('[data-testid^="chip-"]')
  if(chip){ await chip.click() }
  await page.waitForSelector('aside[role="complementary"] [data-testid="guide-input"]')
  await browser.close()
}
if (import.meta.main){ run().catch(e=>{ console.error(e); process.exit(1); }); }


