#!/usr/bin/env node
import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL || 'http://localhost:2000'

async function run() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => {
    const type = msg.type();
    if (['error'].includes(type)) {
      console.error('Console', type, msg.text());
    }
  });

  page.setDefaultNavigationTimeout(60000);
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // Count current widgets
  const beforeCount = await page.$$eval('[data-grid] [data-widget-id]', els => els.length);

  // Ensure CTA pill visible and test Preview
  await page.waitForSelector('text/Adapt Dashboard to', { timeout: 8000 })
  await page.click('text/Preview')
  await new Promise(r => setTimeout(r, 600))

  // Wait for grid to re-render with at least one widget
  let afterCount = 0;
  const start = Date.now();
  while (Date.now() - start < 7000) {
    afterCount = await page.$$eval('[data-grid] [data-widget-id]', els => els.length).catch(() => 0);
    if (afterCount > 0) break;
    await new Promise(r => setTimeout(r, 250));
  }
  if (!(afterCount >= beforeCount)) {
    throw new Error(`Expected widget count to increase or stay same, before=${beforeCount} after=${afterCount}`);
  }

  // Apply
  await page.click('text/Apply')
  // naive wait for apply+refresh
  await new Promise(r => setTimeout(r, 1000))

  // Screenshots
  await page.setViewport({ width: 1366, height: 900 });
  await page.screenshot({ path: 'artifacts/dashboard-desktop-adapt.png' });
  await page.setViewport({ width: 820, height: 1024 });
  await page.screenshot({ path: 'artifacts/dashboard-ipad-adapt.png' });
  await page.setViewport({ width: 390, height: 844 });
  await page.screenshot({ path: 'artifacts/dashboard-mobile-adapt.png' });

  await browser.close();
  console.log('dashboard-adapt: OK');
}

run().catch(err => { console.error(err); process.exit(1); });


