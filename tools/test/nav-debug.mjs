import puppeteer from 'puppeteer';

const BASE_URL = process.env.BASE_URL;
if (!BASE_URL) {
  console.error('ERROR: BASE_URL env var is required');
  process.exit(1);
}

async function capture(page) {
  const consoleErrors = [];
  const networkErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('__nextjs_original-stack-frames') && !/preload but not used/i.test(text)) {
        consoleErrors.push(text);
      }
    }
  });
  page.on('response', response => {
    const url = response.url();
    if (response.status() >= 400 && !url.includes('__nextjs_original-stack-frames') && !url.includes('webpack-hmr')) {
      networkErrors.push(`${response.status()} ${response.statusText()}: ${url}`);
    }
  });
  return { consoleErrors, networkErrors };
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    const { consoleErrors, networkErrors } = await capture(page);
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 45000 });
    console.log('Anchors sample:', await page.$$eval('a[href]', as => as.slice(0,5).map(a => a.getAttribute('href'))));
    if (consoleErrors.length || networkErrors.length) {
      console.log('Console errors:', consoleErrors);
      console.log('Network errors:', networkErrors);
    } else {
      console.log('No console or network errors on initial load');
    }
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error(err && err.stack || String(err));
    await browser.close();
    process.exit(1);
  }
})();


